#!/usr/bin/env node
// ============================================================
//  IMPORT PROJECTIONS BASELINE (Preseason, aus xlsx)
// ============================================================
//  Liest Beyaz' finale Preseason-Projections und schreibt sie nach
//  data/projections-baseline.js — die Basis, mit der
//  scripts/build-live-projections.js ab Saisonstart die echten
//  Boxscore-Stats blendet (siehe README, "Season-Start-Plan:
//  Projections-Flow").
//
//  Erwartete Spalten (Reihenfolge egal, per Header erkannt):
//    Player | Team | Pos | MIN | PTS | REB | AST | STL | BLK | 3PM | TOV
//    + entweder "FGM-FGA" / "FTM-FTA" als kombinierte Textspalte
//      (z.B. "8.9-18.2"), ODER separate FGM/FGA/FTM/FTA-Spalten.
//
//  Usage:
//    node scripts/import-projections-baseline.js <xlsx> [sheet-name]
//
//  Namens-Matching wie bei den anderen Import-Scripts: NAME_ALIASES
//  aus data/aliases.js + Diakritik-Stripping.
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const XLSX = require('xlsx');

const ROOT = path.join(__dirname, '..');
const RANKINGS_PATH = path.join(ROOT, 'data', 'rankings.js');
const OUT = path.join(ROOT, 'data', 'projections-baseline.js');

const xlsxPath = process.argv[2];
const sheetArg = process.argv[3];
if (!xlsxPath) {
  console.error('Usage: node scripts/import-projections-baseline.js <xlsx> [sheet-name]');
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

// ── xlsx laden, Header robust finden ──────────────────────────
const wb = XLSX.readFile(xlsxPath, { cellDates: true });
const sheetName = sheetArg || wb.SheetNames[0];
const ws = wb.Sheets[sheetName];
if (!ws) {
  console.error(`Sheet "${sheetName}" nicht gefunden. Verfuegbare Sheets: ${wb.SheetNames.join(', ')}`);
  process.exit(1);
}
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: null });
const headerRowIdx = rows.findIndex(r =>
  r && r.some(c => c && /^(player|name)$/i.test(String(c).trim())) &&
  r.some(c => c && /^pts$/i.test(String(c).trim()))
);
if (headerRowIdx === -1) {
  console.error('Konnte keine Header-Zeile mit "Player"/"Name" und "PTS" finden.');
  process.exit(1);
}
const header = rows[headerRowIdx].map(h => (h || '').toString().trim());
const col = name => header.findIndex(h => h.toLowerCase() === name.toLowerCase());
const idx = {
  player: col('Player') !== -1 ? col('Player') : col('Name'),
  min: col('MIN'), pts: col('PTS'), reb: col('REB'), ast: col('AST'),
  stl: col('STL'), blk: col('BLK'), tpm: col('3PM'), tov: col('TOV'),
  fgmfga: header.findIndex(h => /^FGM.?FGA$/i.test(h)),
  ftmfta: header.findIndex(h => /^FTM.?FTA$/i.test(h)),
  fgm: col('FGM'), fga: col('FGA'), ftm: col('FTM'), fta: col('FTA'),
  fgPct: col('FG%'), ftPct: col('FT%'),
  z: col('Z'), zFloor: col('Z-Floor'), zDepth: col('Z-Depth'), adpVal: col('ADP-Val'),
};
if (idx.player === -1 || idx.pts === -1) {
  console.error('Pflichtspalten fehlen (Player/Name, PTS).');
  process.exit(1);
}
const hasVolumeData = idx.fgmfga !== -1 || (idx.fgm !== -1 && idx.fga !== -1);
if (!hasVolumeData && idx.fgPct !== -1) {
  console.log('⚠️  Keine FGM/FGA-Spalte gefunden, nur FG%/FT% — Datei liefert also keine Wurf-Volumen-Daten.');
  console.log('    Fallback: FG%/FT% werden als reine Prozentwerte übernommen (kein Makes/Attempts-Blend möglich,');
  console.log('    solange keine Spiele vorliegen). Sobald echte Spiele reinkommen, blendet build-live-projections.js');
  console.log('    die Prozente game-gewichtet unter Annahme des tatsächlichen Wurfvolumens der echten Spiele.');
  console.log('    Für exaktere Ergebnisse: Export mit FGM-FGA/FTM-FTA-Spalten verwenden, falls verfügbar.');
}

function num(v) { const n = parseFloat(v); return Number.isFinite(n) ? n : 0; }
function splitCombined(v) {
  if (!v) return [0, 0];
  const m = String(v).match(/([\d.]+)\s*-\s*([\d.]+)/);
  return m ? [parseFloat(m[1]), parseFloat(m[2])] : [0, 0];
}

const baseline = {};
let count = 0, matched = 0;
for (let i = headerRowIdx + 1; i < rows.length; i++) {
  const r = rows[i];
  if (!r || !r[idx.player]) continue;
  const rawName = String(r[idx.player]).trim();
  const canon = canonicalName(rawName);
  if (canon !== stripDiacritics(rawName).trim()) matched++;

  let fgm = 0, fga = 0, ftm = 0, fta = 0, pctOnly = false;
  if (idx.fgmfga !== -1) [fgm, fga] = splitCombined(r[idx.fgmfga]);
  else if (idx.fgm !== -1 && idx.fga !== -1) { fgm = num(r[idx.fgm]); fga = num(r[idx.fga]); }
  else pctOnly = true;
  if (idx.ftmfta !== -1) [ftm, fta] = splitCombined(r[idx.ftmfta]);
  else if (idx.ftm !== -1 && idx.fta !== -1) { ftm = num(r[idx.ftm]); fta = num(r[idx.fta]); }
  else pctOnly = true;

  const entry = {
    min: num(r[idx.min]), pts: num(r[idx.pts]), reb: num(r[idx.reb]), ast: num(r[idx.ast]),
    stl: num(r[idx.stl]), blk: num(r[idx.blk]), tpm: num(r[idx.tpm]), tov: num(r[idx.tov]),
    fgm, fga, ftm, fta, pctOnly,
    z: idx.z !== -1 ? num(r[idx.z]) : 0,
    zFloor: idx.zFloor !== -1 ? num(r[idx.zFloor]) : 0,
    zDepth: idx.zDepth !== -1 ? num(r[idx.zDepth]) : 0,
    adpVal: idx.adpVal !== -1 ? num(r[idx.adpVal]) : 0,
  };
  if (pctOnly) {
    entry.fgPct = num(r[idx.fgPct]);
    entry.ftPct = num(r[idx.ftPct]);
  }
  baseline[canon] = entry;
  count++;
}
console.log(`Baseline geladen: ${count} Spieler (${matched} auf bekannte Namen gemappt).`);

function serialize(obj) {
  const lines = Object.entries(obj).map(([name, s]) => {
    const escaped = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const extra = s.pctOnly ? `, pctOnly:true, fgPct:${s.fgPct}, ftPct:${s.ftPct}` : '';
    return `  "${escaped}": { min:${s.min}, pts:${s.pts}, reb:${s.reb}, ast:${s.ast}, stl:${s.stl}, blk:${s.blk}, tpm:${s.tpm}, tov:${s.tov}, fgm:${s.fgm}, fga:${s.fga}, ftm:${s.ftm}, fta:${s.fta}${extra}, z:${s.z}, zFloor:${s.zFloor}, zDepth:${s.zDepth}, adpVal:${s.adpVal} }`;
  });
  return lines.join(',\n');
}

const today = new Date().toISOString().slice(0, 10);
const out = `// ============================================================
//  PROJECTIONS BASELINE — Preseason (Beyaz' finale Projections)
// ============================================================
//  Manuell hochgeladen vor Saisonstart via
//    node scripts/import-projections-baseline.js <xlsx>
//  Wird ab dem ersten Spieltag von scripts/build-live-projections.js
//  mit den echten Boxscore-Stats geblendet (data/live-projections.js) —
//  siehe README, "Season-Start-Plan: Projections-Flow".
//  Zuletzt importiert: ${today}
//
//  Shape: PROJECTIONS_BASELINE["Spielername"] = {
//    min, pts, reb, ast, stl, blk, tpm, tov,   // Pro-Spiel-Schnitte
//    fgm, fga, ftm, fta                          // Pro-Spiel-Schnitte (Makes/Attempts, NICHT Prozent!)
//    // Falls die Quelldatei keine Makes/Attempts hatte (nur FG%/FT%):
//    pctOnly, fgPct, ftPct                       // fgm/fga/ftm/fta sind dann 0, siehe build-live-projections.js
//    z, zFloor, zDepth, adpVal                   // 1:1 aus der Quelldatei übernommen (Projections-Repo-eigene Berechnung,
//                                                  // hier nicht nachgebaut). "z" wird ab dem ersten Spieltag von
//                                                  // build-live-projections.js live neu berechnet; zFloor/zDepth/adpVal
//                                                  // bleiben statische Baseline-Werte (kein Live-Recalc, Formel unbekannt).
//  }
// ============================================================

const PROJECTIONS_BASELINE = {
${serialize(baseline)}
};
`;
fs.writeFileSync(OUT, out, 'utf8');
console.log(`${OUT} geschrieben.`);
