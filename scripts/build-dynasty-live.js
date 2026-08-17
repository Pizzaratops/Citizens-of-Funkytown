#!/usr/bin/env node
// ============================================================
//  DYNASTY LIVE NUDGE
// ============================================================
//  Zeigt neben dem manuellen Dynasty-Rang (data/rankings.js, bleibt
//  unangetastet) eine kleine, gedeckelte "Live"-Bewegung basierend
//  auf dem aktuellen Performance-Signal (laufende Saison sobald
//  verfügbar, sonst Off-Season/Preseason). Reine Anzeige-Info auf
//  der Dynasty-Rankings-Seite — verändert NICHT die tatsächliche
//  Sortierung dort und wird NIRGENDS sonst verwendet (Trade Analyzer,
//  Team Analytics, Trade Finder rechnen weiterhin ausschließlich mit
//  dem manuellen Rang aus data/rankings.js).
//
//  Formel: delta = clamp(round(SPOTS_PER_Z * signalZ), -MAX_NUDGE, +MAX_NUDGE)
//  liveRank = max(1, baseRank - delta)  (nur informativ, keine Neusortierung)
//
//  Setzt sich automatisch zurück: sobald Beyaz eine neue
//  data/rankings.js hochlädt, rechnet dieses Script beim nächsten
//  Lauf einfach von der neuen Basis aus weiter — kein Extra-Schritt.
//
//  Output: data/dynasty-live.js — DYNASTY_LIVE, keyed nichts (Array),
//  von js/rankings-ui.js per Name nachgeschlagen.
//
//  Usage:
//    node scripts/build-dynasty-live.js
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'dynasty-live.js');

const SPOTS_PER_Z = 4;
const MAX_NUDGE = 18;

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
function normalizeName(raw) {
  if (!raw) return '';
  let s = raw.toLowerCase().trim();
  s = s.replace(/\./g, '');
  s = s.replace(/['\u2019\u2018`]/g, '');
  s = s.replace(/\b(jr|sr|iii|ii)\b/g, '');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

const DYNASTY_PLAYERS = loadVmArray(path.join(ROOT, 'data', 'rankings.js'), 'DYNASTY_PLAYERS') || [];

const OFFSEASON_RANKINGS = (() => {
  const p = path.join(ROOT, 'data', 'offseason-rankings.js');
  return fs.existsSync(p) ? loadVmObject(p, 'OFFSEASON_RANKINGS') : null;
})();
const LIVESCORES_AGGREGATE = (() => {
  const p = path.join(ROOT, 'data', 'livescores-aggregate.js');
  return fs.existsSync(p) ? loadVmObject(p, 'LIVESCORES_AGGREGATE') : null;
})();

const OFFSEASON_LEAGUE_KEYS = new Set(['nba-summer-california', 'nba-summer-utah', 'nba-summer-las-vegas', 'nba-preseason']);

// Identisch zur Logik in build-best-available-board.js: bevorzugt die
// Liga "nba" (reguläre Saison) sobald sie existiert, sonst die neueste
// Off-Season-Liga.
function latestMonthWindow() {
  if (!LIVESCORES_AGGREGATE || !LIVESCORES_AGGREGATE.month) return null;
  const leagues = LIVESCORES_AGGREGATE.month;
  const leagueKeys = Object.keys(leagues);
  const regularSeasonKey = leagueKeys.find(k => !OFFSEASON_LEAGUE_KEYS.has(k));
  const preferredKeys = regularSeasonKey ? [regularSeasonKey] : leagueKeys;
  let best = null;
  preferredKeys.forEach(lk => {
    Object.keys(leagues[lk] || {}).forEach(d => {
      if (!best || d > best.date) best = { date: d, window: leagues[lk][d] };
    });
  });
  return best;
}
const LATEST_MONTH = latestMonthWindow();

const monthByName = new Map();
if (LATEST_MONTH) LATEST_MONTH.window.players.forEach(p => monthByName.set(normalizeName(p.name), p));
const offseasonByName = new Map();
if (OFFSEASON_RANKINGS && Array.isArray(OFFSEASON_RANKINGS.players)) {
  OFFSEASON_RANKINGS.players.forEach(p => offseasonByName.set(normalizeName(p.name), p));
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

const entries = [];
DYNASTY_PLAYERS.forEach(p => {
  const [baseRank, name] = p;
  const key = normalizeName(name);
  const month = monthByName.get(key);
  const off = offseasonByName.get(key);
  const source = month || off;
  if (!source) return; // kein aktuelles Signal -> kein Eintrag, Frontend zeigt dann einfach nichts an

  const signalZ = source.composite / 3; // gleiche Skalierung wie in build-best-available-board.js
  const delta = clamp(Math.round(signalZ * SPOTS_PER_Z), -MAX_NUDGE, MAX_NUDGE);
  if (delta === 0) return; // nichts zu zeigen

  const liveRank = Math.max(1, baseRank - delta);
  entries.push({ name, baseRank, liveRank, delta, source: month ? 'current' : 'offseason' });
});

const now = new Date().toISOString().slice(0, 10);
const lines = entries.map(e =>
  `  { name: ${JSON.stringify(e.name)}, baseRank: ${e.baseRank}, liveRank: ${e.liveRank}, delta: ${e.delta}, source: ${JSON.stringify(e.source)} }`
);

const out = `// ============================================================
//  DYNASTY LIVE NUDGE
// ============================================================
//  AUTO-GENERIERT von scripts/build-dynasty-live.js über die
//  "Daily 9cat Live Scores" GitHub Action. Nicht von Hand editieren.
//  Zuletzt aktualisiert: ${now}
//
//  Rein informativ — zeigt auf der Dynasty-Rankings-Seite ein kleines
//  "Live"-Badge neben dem manuellen Rang aus data/rankings.js. Verändert
//  NICHTS an data/rankings.js selbst und wird sonst nirgends verwendet
//  (Trade Analyzer/Team Analytics/Trade Finder rechnen unverändert mit
//  dem manuellen Rang). Nur Spieler mit aktuellem Off-Season-/Saison-
//  Signal UND einer spürbaren Bewegung (delta != 0) tauchen hier auf.
//
//  Shape: DYNASTY_LIVE = [ { name, baseRank, liveRank, delta, source }, ... ]
//  delta > 0 = Signal zeigt nach oben, delta < 0 = nach unten.
// ============================================================

const DYNASTY_LIVE = [
${lines.join(',\n')}
];
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out, 'utf8');
console.log(`${OUT} aktualisiert: ${entries.length} Spieler mit sichtbarer Live-Bewegung.`);
