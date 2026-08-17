#!/usr/bin/env node
// ============================================================
//  BLEND DYNASTY RANKINGS WITH EXTERNAL SOURCE
// ============================================================
//  Nimmt eine extern hochgeladene Rangliste (aktuell: Matt Lawson,
//  "Categories"-Tab, 9-Cat) und macht zwei Dinge:
//
//  1. Aktualisiert MATT_RANKS in data/hashtag.js komplett aus der
//     neuen Datei (Name -> Matt-Rang), 1:1, keine Blendung.
//
//  2. Blendet data/rankings.js (MFHFBs DR) mit dem neuen MATT_RANKS:
//     neuer Rang je Spieler = Durchschnitt aus (bisherigem MFHFB-Rang,
//     neuem Matt-Rang), danach komplett neu sortiert und 1..N
//     durchnummeriert. Spieler ohne Matt-Match behalten ihren
//     bisherigen Rang unverändert. Spieler, die NUR bei Matt
//     auftauchen, werden neu mit dessen Rang aufgenommen (Team/Pos/DOB
//     aus der Matt-Datei).
//
//  Matching: diakritik-unabhängig + Suffix/Punkt-unabhängig (gleiche
//  Normalisierungslogik wie data/aliases.js normalizeName()), plus ein
//  paar manuelle Vor-/Nachname-Overrides für Fälle, die reine
//  Normalisierung nicht löst (z.B. "Cameron Boozer" vs "Cam Boozer").
//
//  Usage:
//    node scripts/blend-dynasty-with-external.js <path-to-xlsx> [sheet-name]
//
//  Schreibt data/rankings.js und data/hashtag.js direkt.
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const XLSX = require('xlsx');

const ROOT = path.join(__dirname, '..');
const RANKINGS_PATH = path.join(ROOT, 'data', 'rankings.js');
const HASHTAG_PATH = path.join(ROOT, 'data', 'hashtag.js');

const xlsxPath = process.argv[2];
const sheetName = process.argv[3] || 'Categories';
if (!xlsxPath) {
  console.error('Usage: node scripts/blend-dynasty-with-external.js <path-to-xlsx> [sheet-name]');
  process.exit(1);
}

// ------------------------------------------------------------
//  Helpers: vm-basiertes Laden von Browser-Global-Datendateien
// ------------------------------------------------------------
function extractBalanced(code, marker, openCh, closeCh) {
  const start = code.indexOf(marker);
  if (start === -1) return null;
  let depth = 0, end = -1;
  for (let i = start + marker.length - 1; i < code.length; i++) {
    if (code[i] === openCh) depth++;
    else if (code[i] === closeCh) { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  if (end === -1) return null;
  return code.slice(start, end) + ';';
}
function loadVmArray(filePath, varName) {
  const code = fs.readFileSync(filePath, 'utf8');
  const snippet = extractBalanced(code, `const ${varName} = [`, '[', ']');
  if (!snippet) return null;
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${snippet}\nthis.__RESULT__ = ${varName};`, sandbox);
  return sandbox.__RESULT__;
}

function loadVmObject(filePath, varName) {
  const code = fs.readFileSync(filePath, 'utf8');
  const snippet = extractBalanced(code, `const ${varName} = {`, '{', '}');
  if (!snippet) return null;
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${snippet}\nthis.__RESULT__ = ${varName};`, sandbox);
  return sandbox.__RESULT__;
}

// ------------------------------------------------------------
//  Name-Normalisierung — identisch zu data/aliases.js normalizeName(),
//  PLUS das komplette dort gepflegte NAME_ALIASES-Wörterbuch (ESPN-
//  Namensvarianten), PLUS Diakritik-Stripping (Dončić -> Doncic,
//  Şengün -> Sengun, ...), damit Namensschreibweisen aus fremden
//  Quellen zuverlässig auf unsere kanonischen Namen matchen.
// ------------------------------------------------------------
const NAME_ALIASES = loadVmObject(path.join(ROOT, 'data', 'aliases.js'), 'NAME_ALIASES') || {};
const NAME_FIRST_ALIASES = {
  'nicolas claxton': 'nic claxton',
  'alexandre sarr': 'alex sarr',
  'cameron johnson': 'cam johnson',
  'cameron boozer': 'cam boozer',
  'ronald holland ii': 'ron holland',
  'ronald holland': 'ron holland',
};
function stripDiacritics(s) {
  return s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}
function baseNormalize(raw) {
  if (!raw) return '';
  let s = stripDiacritics(raw).toLowerCase().trim();
  s = s.replace(/\./g, '');
  s = s.replace(/['\u2019\u2018`]/g, '');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}
// normalizeName: fuer den finalen Match-Key (Suffixe raus, Aliases angewandt)
function normalizeName(raw) {
  let s = baseNormalize(raw);
  s = s.replace(/\b(jr|sr|iii|ii)\b/g, '').replace(/\s+/g, ' ').trim();
  return NAME_FIRST_ALIASES[s] || s;
}
// aliasCanonical: wendet zuerst NAME_ALIASES an (Original-Suffixe erhalten,
// z.B. "carlton carrington" -> "Bub Carrington"), fuer den Fall dass die
// externe Quelle eine komplett andere Namensform nutzt als ESPN.
function aliasCanonical(raw) {
  const base = baseNormalize(raw);
  return NAME_ALIASES[base] || null;
}

// ------------------------------------------------------------
//  1) Neue externe Rangliste laden
// ------------------------------------------------------------
const wb = XLSX.readFile(xlsxPath, { cellDates: true });
const ws = wb.Sheets[sheetName];
if (!ws) {
  console.error(`Sheet "${sheetName}" nicht gefunden. Verfuegbare Sheets: ${wb.SheetNames.join(', ')}`);
  process.exit(1);
}
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: null });
// Header-Zeile: Rank | (leer) | Player | Team | (leer) | Birthdate | Pos. | Age | Change | ...
const header = rows[0];
const idx = {
  rank: header.findIndex(h => h && /rank/i.test(h)),
  player: header.findIndex(h => h && /player/i.test(h)),
  team: header.findIndex(h => h && /team/i.test(h)),
  dob: header.findIndex(h => h && /birth/i.test(h)),
  pos: header.findIndex(h => h && /pos/i.test(h)),
};

const external = []; // { rank, name, team, pos, dob }
for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  if (!r || !r[idx.player]) continue;
  const rank = parseInt(r[idx.rank], 10);
  if (!Number.isFinite(rank)) continue;
  let dob = null;
  const rawDob = r[idx.dob];
  if (rawDob) {
    const d = new Date(rawDob);
    if (!isNaN(d.getTime())) dob = d.toISOString().slice(0, 10);
  }
  external.push({
    rank,
    name: stripDiacritics(String(r[idx.player]).trim()),
    team: r[idx.team] ? String(r[idx.team]).trim() : '',
    pos: r[idx.pos] ? String(r[idx.pos]).trim() : '',
    dob,
  });
}
console.log(`Externe Rangliste geladen: ${external.length} Spieler aus "${sheetName}".`);

// ------------------------------------------------------------
//  2) MATT_RANKS komplett neu aus der externen Liste bauen
//     (Keys = kanonische DYNASTY_PLAYERS-Namen wenn Match, sonst
//     der externe Name selbst)
// ------------------------------------------------------------
const DYNASTY_PLAYERS = loadVmArray(RANKINGS_PATH, 'DYNASTY_PLAYERS') || [];
const dynastyByNorm = new Map();
DYNASTY_PLAYERS.forEach(p => dynastyByNorm.set(normalizeName(p[1]), p));

function findDynastyMatch(externalName) {
  const aliasName = aliasCanonical(externalName);
  if (aliasName) {
    const m = dynastyByNorm.get(normalizeName(aliasName));
    if (m) return m;
  }
  return dynastyByNorm.get(normalizeName(externalName)) || null;
}

const externalByNorm = new Map();
external.forEach(e => externalByNorm.set(normalizeName(e.name), e));

const newMattRanks = {};
external.forEach(e => {
  const dynastyMatch = findDynastyMatch(e.name);
  const key = dynastyMatch ? dynastyMatch[1] : e.name; // kanonischer Name wenn bekannt
  newMattRanks[key] = e.rank;
});

// ------------------------------------------------------------
//  3) Dynasty-Rankings blenden
// ------------------------------------------------------------
const blended = []; // { rawRank, origRank, name, team, pos, dob, isNew }
DYNASTY_PLAYERS.forEach(p => {
  const [origRank, name, team, pos, dob] = p;
  // umgekehrte Suchrichtung: gibt es einen externen Eintrag, dessen
  // (alias-kanonisierter) Name auf DIESEN Dynasty-Spieler zeigt?
  let ext = externalByNorm.get(normalizeName(name)) || null;
  if (!ext) {
    ext = external.find(e => {
      const m = findDynastyMatch(e.name);
      return m && m[1] === name;
    }) || null;
  }
  const rawRank = ext ? (origRank + ext.rank) / 2 : origRank;
  blended.push({ rawRank, origRank, name, team, pos, dob, isNew: false });
});
// Spieler, die nur extern auftauchen -> neu aufnehmen
let addedCount = 0;
external.forEach(e => {
  const m = findDynastyMatch(e.name);
  if (m) return; // schon oben verarbeitet
  blended.push({
    rawRank: e.rank,
    origRank: e.rank,
    name: e.name,
    team: e.team,
    pos: e.pos,
    dob: e.dob || '',
    isNew: true,
  });
  addedCount++;
});

blended.sort((a, b) => (a.rawRank - b.rawRank) || (a.origRank - b.origRank));
blended.forEach((p, i) => { p.finalRank = i + 1; });

console.log(`Blend fertig: ${blended.length} Spieler total, ${addedCount} neu aus externer Liste hinzugefuegt.`);

// ------------------------------------------------------------
//  4) data/rankings.js schreiben
// ------------------------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const rankingsLines = blended.map(p => {
  const name = p.name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const team = (p.team || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const pos = (p.pos || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const dob = (p.dob || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `  [${p.finalRank},"${name}","${team}","${pos}","${dob}"],`;
});
const rankingsOut = `// ============================================================
//  MFHFBs DYNASTY RANKING
// ============================================================
//  Beyaz' eigenes Dynasty-Ranking, geblendet per Zwei-Quellen-Mittelwert:
//  bestehendes MFHFB-Ranking + neu hochgeladenes externes Update
//  (z.B. Hashtag Basketball). Formel je Spieler: neuer Rang =
//  Durchschnitt aus (bisherigem MFHFB-Rang, neuem Quellen-Rang),
//  danach komplett neu sortiert und 1..N durchnummeriert. Spieler,
//  die im Update nicht auftauchen, behalten ihren bisherigen Rang.
//  Zuletzt aktualisiert: ${today} (Quelle: Matt Lawson Dynasty Rankings,
//  ${external.length} gerankte Spieler, ${addedCount} neu).
//
//  Manuell gepflegt, von Hand hochgeladen wenn Beyaz sein Ranking
//  aktualisiert.
//
//  Format: [rank, name, team, pos, dob]
//  dob ist bei Import aus dem Alter der xlsx errechnet (kein exaktes
//  Geburtsdatum) — für die Altersanzeige/den Alters-Multiplikator im
//  Trade Analyzer ausreichend genau, aber nicht als exaktes Datum
//  misszuverstehen.
// ============================================================

const DYNASTY_PLAYERS = [
${rankingsLines.join('\n')}
];
`;
fs.writeFileSync(RANKINGS_PATH, rankingsOut, 'utf8');
console.log(`${RANKINGS_PATH} geschrieben (${blended.length} Spieler).`);

// ------------------------------------------------------------
//  5) data/hashtag.js: nur MATT_RANKS-Block ersetzen, Rest unangetastet
// ------------------------------------------------------------
const hashtagCode = fs.readFileSync(HASHTAG_PATH, 'utf8');
const marker = 'const MATT_RANKS = {';
const startIdx = hashtagCode.indexOf(marker);
if (startIdx === -1) {
  console.error('MATT_RANKS Block nicht in data/hashtag.js gefunden — Abbruch, nichts geschrieben.');
  process.exit(1);
}
const before = hashtagCode.slice(0, startIdx);
const mattLines = Object.entries(newMattRanks).map(([name, rank]) => {
  const escaped = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `  "${escaped}":${rank},`;
});
// letztes Komma entfernen fuer sauberes Objekt-Ende
if (mattLines.length) mattLines[mattLines.length - 1] = mattLines[mattLines.length - 1].replace(/,$/, '');
const newMattBlock = `const MATT_RANKS = {\n${mattLines.join('\n')}\n};\n`;
fs.writeFileSync(HASHTAG_PATH, before + newMattBlock, 'utf8');
console.log(`${HASHTAG_PATH} geschrieben (MATT_RANKS: ${Object.keys(newMattRanks).length} Spieler).`);
