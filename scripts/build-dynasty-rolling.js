#!/usr/bin/env node
// ============================================================
//  DYNASTY ROLLING RANKINGS — ARCHIV
// ============================================================
//  Snapshot-Historie der MFHFBs Dynasty Ranks (NUR MFHFBs DR,
//  keine Matt-Lawson- oder Hashtag-Werte). Jedes Mal, wenn Beyaz
//  data/rankings.js manuell aktualisiert (Re-Rank, Blend mit
//  externer Quelle, etc.), diesen Script danach einmal laufen
//  lassen — er haengt den aktuellen Stand als neuen datierten
//  Snapshot an data/dynasty-rolling.js an. Existiert fuer das
//  heutige Datum schon ein Snapshot, wird er ersetzt (kein
//  Duplikat pro Tag).
//
//  Usage:
//    node scripts/build-dynasty-rolling.js [--date=YYYY-MM-DD] [--label="Text"]
//
//  Output: data/dynasty-rolling.js — DYNASTY_ROLLING
//  Shape: [{ date, label, ranks: { name: rank, ... } }, ...] chronologisch aufsteigend
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const RANKINGS_PATH = path.join(ROOT, 'data', 'rankings.js');
const OUT = path.join(ROOT, 'data', 'dynasty-rolling.js');

const args = process.argv.slice(2);
const dateArg = (args.find(a => a.startsWith('--date=')) || '').split('=')[1];
const labelArg = (args.find(a => a.startsWith('--label=')) || '').split('=')[1];

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

const DYNASTY_PLAYERS = loadVmArray(RANKINGS_PATH, 'DYNASTY_PLAYERS') || [];
if (!DYNASTY_PLAYERS.length) {
  console.error('data/rankings.js konnte nicht geladen werden — Abbruch.');
  process.exit(1);
}

const today = dateArg || new Date().toISOString().slice(0, 10);
const MONTHS_DE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
function defaultLabel(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${d}. ${MONTHS_DE[m - 1]}`;
}
const label = labelArg || defaultLabel(today);

let existing = [];
if (fs.existsSync(OUT)) {
  existing = loadVmArray(OUT, 'DYNASTY_ROLLING') || [];
}

const ranks = {};
DYNASTY_PLAYERS.forEach(p => { ranks[p[1]] = p[0]; });

const newSnapshot = { date: today, label, ranks };
const idx = existing.findIndex(s => s.date === today);
if (idx !== -1) {
  existing[idx] = newSnapshot;
  console.log(`Snapshot fuer ${today} bereits vorhanden — ersetzt.`);
} else {
  existing.push(newSnapshot);
  console.log(`Neuer Snapshot fuer ${today} angehaengt.`);
}
existing.sort((a, b) => a.date.localeCompare(b.date));

function serializeSnapshot(s) {
  const rankLines = Object.entries(s.ranks).map(([name, rank]) => {
    const escaped = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `"${escaped}":${rank}`;
  });
  return `  { date: "${s.date}", label: "${s.label}", ranks: { ${rankLines.join(', ')} } }`;
}

const out = `// ============================================================
//  DYNASTY ROLLING RANKINGS — ARCHIV
// ============================================================
//  Historie der MFHFBs Dynasty Ranks (data/rankings.js) über die Zeit.
//  NUR MFHFBs DR — keine Matt-Lawson- oder Hashtag-Werte. Wird von
//  Hand nach jedem manuellen Dynasty-Rankings-Update erweitert via:
//    node scripts/build-dynasty-rolling.js
//  Zuletzt aktualisiert: ${today}
//
//  Shape: DYNASTY_ROLLING = [ { date, label, ranks: {name: rank} }, ... ]
//  chronologisch aufsteigend sortiert.
// ============================================================

const DYNASTY_ROLLING = [
${existing.map(serializeSnapshot).join(',\n')}
];
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out, 'utf8');
console.log(`${OUT} geschrieben: ${existing.length} Snapshot(s) total.`);
