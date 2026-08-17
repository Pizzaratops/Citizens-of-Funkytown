#!/usr/bin/env node
// ============================================================
//  Permanentes Rolling-Rankings-Archiv — Saison 2026/27
// ============================================================
//  Liest den Weekly- und Monthly-Eintrag von HEUTE aus
//  data/livescores-aggregate.js (LIVESCORES_AGGREGATE[period]["nba"]
//  [datum]) und schreibt einen dauerhaften, gewichteten Rang pro
//  Spieler nach data/rolling-rankings-2026-27.js.
//
//  Bewusst NUR Liga "nba" (reguläre Saison) — Summer League/Preseason
//  fließen nicht ein, analog zu RR_LIVE_LEAGUE im Frontend.
//
//  Anders als data/livescores-aggregate.js (dort werden alte Stichtage
//  per --keep gekappt) wird diese Datei NIE gekürzt: jede Kalenderwoche
//  und jeder Kalendermonat bekommt genau einen Eintrag, der nur so lange
//  überschrieben wird, wie der Zeitraum noch läuft. Sobald ein neuer
//  Monat/eine neue Woche beginnt, fasst dieses Script den alten Eintrag
//  nie wieder an — er bleibt für immer so, wie er beim letzten Tag des
//  jeweiligen Zeitraums berechnet wurde.
//
//  Composite wird HIER mit einer festen, benutzerdefinierten Kategorie-
//  Gewichtung neu berechnet (siehe WEIGHTS) — unabhängig von der
//  Punt-Gewichtung im Live-Scores-Frontend (js/livescores.js), die nur
//  ephemer im Browser lebt und nichts speichert.
//
//  Usage:
//    node scripts/build-rolling-archive.js
//      → heutiges Datum, Liga "nba"
//    node scripts/build-rolling-archive.js --date=2026-11-03
//    node scripts/build-rolling-archive.js --agg=data/livescores-aggregate.js --out=data/rolling-rankings-2026-27.js
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const found = args.find(a => a.startsWith(`--${name}=`));
  return found ? found.split('=').slice(1).join('=') : fallback;
};

const dateStr = arg('date', new Date().toISOString().slice(0, 10));
const LEAGUE = arg('league', 'nba');
const AGG_PATH = arg('agg', path.join(__dirname, '..', 'data', 'livescores-aggregate.js'));
const OUT = arg('out', path.join(__dirname, '..', 'data', 'rolling-rankings-2026-27.js'));

// Feste Kategorie-Gewichtung fürs Rolling Ranking.
// Games-Played fließt bewusst NICHT ein.
const WEIGHTS = {
  pts: 0.9,
  reb: 1,
  ast: 1,
  stl: 0.75,
  blk: 0.75,
  tpm: 0.75,
  fgImpact: 1,
  ftImpact: 0.85,
  to: 0.25,
};

const MONTH_LABEL_BY_NUM = {
  1: 'Jan', 2: 'Feb', 3: 'März', 4: 'Apr', 5: 'Mai', 6: 'Jun',
  7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dez',
};

function loadVmObject(filePath, varName) {
  if (!fs.existsSync(filePath)) return null;
  const code = fs.readFileSync(filePath, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  try {
    vm.runInContext(`${code}\nthis.__RESULT__ = typeof ${varName} !== "undefined" ? ${varName} : null;`, sandbox);
    return sandbox.__RESULT__;
  } catch (err) {
    console.error(`Konnte ${filePath} (${varName}) nicht parsen: ${err.message}`);
    return null;
  }
}

// Montag der ISO-Woche eines Datums, als "YYYY-MM-DD" — dient als stabiler
// Bucket-Key für die fortlaufende Wochen-Nummerierung.
function isoWeekStart(dStr) {
  const [y, m, d] = dStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const day = dt.getUTCDay(); // 0=So..6=Sa
  const diff = day === 0 ? -6 : 1 - day;
  dt.setUTCDate(dt.getUTCDate() + diff);
  return dt.toISOString().slice(0, 10);
}

function weightedComposite(zScores) {
  let sum = 0;
  for (const key of Object.keys(WEIGHTS)) {
    sum += (zScores[key] || 0) * WEIGHTS[key];
  }
  return sum;
}

function rankByWeightedComposite(players) {
  return (players || [])
    .filter(p => p && p.name && p.zScores)
    .map(p => ({ name: p.name, weighted: weightedComposite(p.zScores) }))
    .sort((a, b) => b.weighted - a.weighted)
    .map((p, i) => ({ name: p.name, rank: i + 1, weighted: Math.round(p.weighted * 100) / 100 }));
}

// ------------------------------------------------------------
// 1) Heutige Week-/Month-Aggregate laden
// ------------------------------------------------------------
const AGG = loadVmObject(AGG_PATH, 'LIVESCORES_AGGREGATE');
if (!AGG) {
  console.log(`Keine ${AGG_PATH} gefunden — nichts zu archivieren.`);
  process.exit(0);
}

const weekEntry = AGG.week && AGG.week[LEAGUE] ? AGG.week[LEAGUE][dateStr] : null;
const monthEntry = AGG.month && AGG.month[LEAGUE] ? AGG.month[LEAGUE][dateStr] : null;

if (!weekEntry && !monthEntry) {
  console.log(`Keine Week/Month-Daten für ${LEAGUE}/${dateStr} — Rolling-Archiv bleibt unverändert (vermutlich noch keine reguläre Saison).`);
  process.exit(0);
}

// ------------------------------------------------------------
// 2) Bestehendes Archiv laden (nie kürzen!)
// ------------------------------------------------------------
const months = loadVmObject(OUT, 'RR2026_MONTHS') || [];
const weeks = loadVmObject(OUT, 'RR2026_WEEKS') || [];
const weekOrder = loadVmObject(OUT, 'RR2026_WEEK_ORDER') || {};
const flatPlayers = loadVmObject(OUT, 'ROLLING_RANKINGS_2026') || [];

const playersByName = {};
flatPlayers.forEach(p => { playersByName[p.name] = p; });

function ensurePlayer(name) {
  if (!playersByName[name]) {
    playersByName[name] = { name, rankings: {}, weeklyRanks: {}, eosRank: null };
  }
  return playersByName[name];
}

// ------------------------------------------------------------
// 3) Monat archivieren
// ------------------------------------------------------------
let monthLabel = null;
if (monthEntry) {
  const monthNum = Number(dateStr.slice(5, 7));
  monthLabel = MONTH_LABEL_BY_NUM[monthNum];
  if (!months.includes(monthLabel)) months.push(monthLabel);
  const ranked = rankByWeightedComposite(monthEntry.players);
  ranked.forEach(({ name, rank }) => {
    const p = ensurePlayer(name);
    p.rankings[monthLabel] = rank;
    p.eosRank = rank; // aktuellster verfügbarer Stand
  });
}

// ------------------------------------------------------------
// 4) Woche archivieren (fortlaufende Wochen-Nummer, stabil über Läufe hinweg)
// ------------------------------------------------------------
let weekLabel = null;
if (weekEntry) {
  const weekKey = isoWeekStart(dateStr);
  if (!(weekKey in weekOrder)) {
    const nextLabel = weeks.length ? Math.max(...weeks) + 1 : 1;
    weekOrder[weekKey] = nextLabel;
    weeks.push(nextLabel);
  }
  weekLabel = String(weekOrder[weekKey]);
  const ranked = rankByWeightedComposite(weekEntry.players);
  ranked.forEach(({ name, rank }) => {
    const p = ensurePlayer(name);
    p.weeklyRanks[weekLabel] = rank;
    if (!monthEntry) p.eosRank = rank; // Fallback, falls (noch) kein Monats-Bucket existiert
  });
}

// ------------------------------------------------------------
// 5) Serialisieren & schreiben
// ------------------------------------------------------------
const playersOut = Object.values(playersByName).sort((a, b) => (a.eosRank ?? 9999) - (b.eosRank ?? 9999));

function fmtPlayer(p) {
  const rankStr = Object.keys(p.rankings).map(k => `${JSON.stringify(k)}: ${p.rankings[k]}`).join(', ');
  const weeklyStr = Object.keys(p.weeklyRanks).map(k => `${JSON.stringify(k)}: ${p.weeklyRanks[k]}`).join(', ');
  return `{ name: ${JSON.stringify(p.name)}, rankings: { ${rankStr} }, weeklyRanks: { ${weeklyStr} }, eosRank: ${p.eosRank ?? 'null'} }`;
}

const header = `// ============================================================
//  ROLLING RANKINGS — Saison 2026/27 (permanentes Archiv)
// ============================================================
//  AUTO-GENERIERT von scripts/build-rolling-archive.js über die
//  "Daily 9cat Live Scores" GitHub Action. Nicht von Hand editieren
//  — Änderungen werden beim nächsten Lauf überschrieben.
//
//  Anders als data/livescores-aggregate.js (dort werden alte Stichtage
//  gekappt) wird diese Datei NIE gekürzt — jede Kalenderwoche/jeder
//  Kalendermonat bekommt genau einen dauerhaften Eintrag, sobald der
//  Zeitraum vorbei ist, wird er nie wieder verändert.
//
//  composite wird mit fester Kategorie-Gewichtung berechnet:
//  PTS 0.9 · REB 1 · AST 1 · STL 0.75 · BLK 0.75 · 3PM 0.75 ·
//  FG% 1 · FT% 0.85 · TO 0.25 (Games-Played fließt bewusst nicht ein).
//
//  Gleiches Shape wie data/rolling-rankings.js (Saison 2025/26), damit
//  js/rolling-rankings.js beide Saisons identisch behandeln kann:
//  { name, rankings:{Monat:Rang}, weeklyRanks:{Woche:Rang}, eosRank }
//
//  RR2026_WEEK_ORDER (ISO-Wochenstart -> Wochen-Nummer) wird nur intern
//  von diesem Script benutzt, um die Wochen-Nummerierung über mehrere
//  Läufe hinweg stabil zu halten — das Frontend braucht nur
//  RR2026_MONTHS / RR2026_WEEKS / ROLLING_RANKINGS_2026.
// ============================================================

const RR2026_MONTHS = ${JSON.stringify(months)};
const RR2026_WEEKS = ${JSON.stringify(weeks)};
const RR2026_WEEK_ORDER = ${JSON.stringify(weekOrder)};
const ROLLING_RANKINGS_2026 = [
${playersOut.map(p => '  ' + fmtPlayer(p)).join(',\n')}
];
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, header, 'utf8');
console.log(`${OUT} aktualisiert: ${playersOut.length} Spieler, Monate: ${months.join(', ') || '–'}, Wochen: ${weeks.length}` +
  (monthLabel ? `, Monat "${monthLabel}" aktualisiert` : '') +
  (weekLabel ? `, Woche ${weekLabel} aktualisiert` : '') + '.');
