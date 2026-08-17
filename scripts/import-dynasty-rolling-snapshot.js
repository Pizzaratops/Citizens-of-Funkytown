#!/usr/bin/env node
// ============================================================
//  IMPORT DYNASTY ROLLING SNAPSHOT (historisch, aus xlsx)
// ============================================================
//  Für Snapshots, die NICHT aus dem aktuellen data/rankings.js kommen
//  (z.B. ein alter Export von Beyaz' eigenem Dynasty-Ranking aus einem
//  früheren Monat) — im Unterschied zu scripts/build-dynasty-rolling.js,
//  das immer den JETZIGEN Stand von data/rankings.js anhängt.
//
//  Erwartet ein xlsx mit Spalten Rank | Player | Team | Birthdate | Pos.
//  (Header kann in Zeile 1 oder 2 stehen, z.B. wenn Zeile 1 ein Titel
//  ist wie "Dynasty Februar 2026").
//
//  Usage:
//    node scripts/import-dynasty-rolling-snapshot.js <xlsx> <YYYY-MM-DD> [label] [sheet-name]
//
//  Namens-Matching wie beim Blend-Script: NAME_ALIASES aus data/aliases.js
//  + Diakritik-Stripping, damit derselbe Spieler über alle Snapshots
//  hinweg unter demselben (kanonischen) Namen geführt wird.
//
//  Robustheit: Zeilen, bei denen die Player-Spalte nur ein NBA-Team-
//  Kürzel enthält (verrutschte Spalten in der Quelldatei — kommt z.B.
//  vor, wenn beim Excel-Export/-Kopieren eine Spalte verloren geht),
//  werden übersprungen statt als Datenmüll importiert zu werden.
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const XLSX = require('xlsx');

const ROOT = path.join(__dirname, '..');
const RANKINGS_PATH = path.join(ROOT, 'data', 'rankings.js');
const OUT = path.join(ROOT, 'data', 'dynasty-rolling.js');

const xlsxPath = process.argv[2];
const dateArg  = process.argv[3];
const labelArg = process.argv[4];
const sheetArg = process.argv[5];
if (!xlsxPath || !dateArg) {
  console.error('Usage: node scripts/import-dynasty-rolling-snapshot.js <xlsx> <YYYY-MM-DD> [label] [sheet-name]');
  process.exit(1);
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(dateArg)) {
  console.error('Datum muss im Format YYYY-MM-DD sein.');
  process.exit(1);
}

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

const NAME_ALIASES = loadVmObject(path.join(ROOT, 'data', 'aliases.js'), 'NAME_ALIASES') || {};
const NAME_FIRST_ALIASES = {
  'nicolas claxton': 'nic claxton', 'alexandre sarr': 'alex sarr',
  'cameron johnson': 'cam johnson', 'cameron boozer': 'cam boozer',
  'ronald holland ii': 'ron holland', 'ronald holland': 'ron holland',
};
function stripDiacritics(s) { return s.normalize('NFKD').replace(/[\u0300-\u036f]/g, ''); }
function baseNormalize(raw) {
  if (!raw) return '';
  let s = stripDiacritics(raw).toLowerCase().trim();
  s = s.replace(/\./g, '').replace(/['\u2019\u2018`]/g, '');
  return s;
}
function normalizeName(raw) {
  let s = baseNormalize(raw).replace(/\b(jr|sr|iii|ii)\b/g, '').replace(/\s+/g, ' ').trim();
  return NAME_FIRST_ALIASES[s] || s;
}
function aliasCanonical(raw) {
  const base = baseNormalize(raw).replace(/\s+/g, ' ').trim();
  return NAME_ALIASES[base] || null;
}

// ── xlsx laden, Header-Zeile robust suchen (kann Zeile 1 oder 2 sein) ──
const wb = XLSX.readFile(xlsxPath, { cellDates: true });
const sheetName = sheetArg || wb.SheetNames[0];
const ws = wb.Sheets[sheetName];
if (!ws) {
  console.error(`Sheet "${sheetName}" nicht gefunden. Verfuegbare Sheets: ${wb.SheetNames.join(', ')}`);
  process.exit(1);
}
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: null });
let headerRowIdx = rows.findIndex(r =>
  r && r.some(c => c && /^rank$/i.test(String(c).trim())) && r.some(c => c && /^player$/i.test(String(c).trim()))
);
if (headerRowIdx === -1) {
  console.error('Konnte keine Header-Zeile mit "Rank" und "Player" finden.');
  process.exit(1);
}
const header = rows[headerRowIdx];
const idx = {
  rank:   header.findIndex(h => h && /rank/i.test(h)),
  player: header.findIndex(h => h && /player/i.test(h)),
};

const DYNASTY_PLAYERS = loadVmArray(RANKINGS_PATH, 'DYNASTY_PLAYERS') || [];
const dynastyByNorm = new Map();
DYNASTY_PLAYERS.forEach(p => dynastyByNorm.set(normalizeName(p[1]), p));
function canonicalName(rawName) {
  const aliasName = aliasCanonical(rawName);
  if (aliasName) {
    const m = dynastyByNorm.get(normalizeName(aliasName));
    if (m) return m[1];
  }
  const m = dynastyByNorm.get(normalizeName(rawName));
  return m ? m[1] : stripDiacritics(rawName).trim();
}

const NBA_TEAM_CODES = new Set(['ATL','BOS','BKN','BRK','CHA','CHI','CLE','DAL','DEN','DET','GSW','HOU','IND','LAC','LAL','MEM','MIA','MIL','MIN','NOP','NOR','NYK','OKC','ORL','PHI','PHO','PHX','POR','SAC','SAS','TOR','UTA','WAS']);

const ranks = {};
let matched = 0, unmatched = 0, skippedBadRow = 0;
for (let i = headerRowIdx + 1; i < rows.length; i++) {
  const r = rows[i];
  if (!r || !r[idx.player]) continue;
  const rank = parseInt(r[idx.rank], 10);
  if (!Number.isFinite(rank)) continue;
  const rawName = String(r[idx.player]).trim();
  // Verrutschte Zeilen erkennen: Player-Spalte enthaelt nur ein Team-Kuerzel
  // statt eines Namens (z.B. wenn im Quell-xlsx Spalten verschoben sind).
  if (NBA_TEAM_CODES.has(rawName.toUpperCase())) { skippedBadRow++; continue; }
  const canon = canonicalName(rawName);
  if (canon !== stripDiacritics(rawName).trim()) matched++; else unmatched++;
  ranks[canon] = rank;
}
console.log(`Snapshot geladen: ${Object.keys(ranks).length} Spieler (${matched} auf bekannte Namen gemappt, ${unmatched} unveraendert übernommen).`);
if (skippedBadRow) console.log(`⚠️  ${skippedBadRow} Zeile(n) übersprungen: Player-Spalte enthielt nur ein Team-Kürzel statt eines Namens (verrutschte Spalten in der Quelldatei).`);

// ── in data/dynasty-rolling.js einfügen (nach Datum sortiert) ──────────
let existing = [];
if (fs.existsSync(OUT)) existing = loadVmArray(OUT, 'DYNASTY_ROLLING') || [];

const MONTHS_DE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
function defaultLabel(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${d}. ${MONTHS_DE[m - 1]}`;
}
const label = labelArg || defaultLabel(dateArg);

const newSnapshot = { date: dateArg, label, ranks };
const existingIdx = existing.findIndex(s => s.date === dateArg);
if (existingIdx !== -1) {
  existing[existingIdx] = newSnapshot;
  console.log(`Snapshot fuer ${dateArg} bereits vorhanden — ersetzt.`);
} else {
  existing.push(newSnapshot);
  console.log(`Neuer Snapshot fuer ${dateArg} eingefuegt.`);
}
existing.sort((a, b) => a.date.localeCompare(b.date));

function serializeSnapshot(s) {
  const rankLines = Object.entries(s.ranks).map(([name, rank]) => {
    const escaped = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `"${escaped}":${rank}`;
  });
  return `  { date: "${s.date}", label: "${s.label}", ranks: { ${rankLines.join(', ')} } }`;
}

const today = new Date().toISOString().slice(0, 10);
const out = `// ============================================================
//  DYNASTY ROLLING RANKINGS — ARCHIV
// ============================================================
//  Historie der MFHFBs Dynasty Ranks (data/rankings.js) über die Zeit.
//  NUR MFHFBs DR — keine Matt-Lawson- oder Hashtag-Werte. Wird von
//  Hand erweitert:
//    - node scripts/build-dynasty-rolling.js               (aktueller Stand)
//    - node scripts/import-dynasty-rolling-snapshot.js ...  (historischer Import aus xlsx)
//  Zuletzt aktualisiert: ${today}
//
//  Shape: DYNASTY_ROLLING = [ { date, label, ranks: {name: rank} }, ... ]
//  chronologisch aufsteigend sortiert.
// ============================================================

const DYNASTY_ROLLING = [
${existing.map(serializeSnapshot).join(',\n')}
];
`;
fs.writeFileSync(OUT, out, 'utf8');
console.log(`${OUT} geschrieben: ${existing.length} Snapshot(s) total.`);
