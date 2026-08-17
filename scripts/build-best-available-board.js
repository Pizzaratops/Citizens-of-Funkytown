#!/usr/bin/env node
// ============================================================
//  BEST AVAILABLE BOARD — vereinheitlichter Score
// ============================================================
//  Kombiniert für JEDEN Spieler (Rookies UND alle Spieler mit
//  Minuten aus der letzten Saison) so viele der folgenden Signale
//  wie verfügbar sind, mit anteiliger Gewichts-Umverteilung bei
//  fehlenden Signalen (identisches Prinzip wie build-postdraft-board.js):
//
//   - Dynasty-Rang (data/rankings.js, Beyaz/Matt Lawson kuratiert)  Gewicht 0.35
//   - BBM-Redraft-Rang (FA_PLAYERS, js/best-available.js)          Gewicht 0.15
//   - Post-Draft-Score für Rookies (data/postdraft-board.js)       Gewicht 0.30
//   - Letzte Saison 2025/26 (data/rolling-rankings.js, eosRank)    Gewicht 0.20
//   - Off-Season 2026 (data/offseason-rankings.js, SL+Preseason)   Gewicht 0.15
//   - Laufende Saison 2026/27 (data/livescores-aggregate.js,
//     Liga "nba", 30-Tage-Fenster — existiert erst NACH Saisonstart,
//     überschreibt dann automatisch Off-Season als dominantes Signal) Gewicht 0.35
//
//  WICHTIG — bekannte Datenlücke: data/rolling-rankings.js enthält nur
//  Gesamt-Ränge (eosRank/Monats-/Wochenränge), KEINE Kategorie-Z-Scores
//  und KEINE Minutenwerte. "Minuten-Schnitt", "Beste/Schwächste Kategorie"
//  lassen sich deshalb nur für Spieler mit Off-Season- oder laufenden-
//  Saison-Daten anzeigen (Rookies, Spieler die Summer League/Preseason
//  gespielt haben, bzw. alle sobald die reguläre Saison läuft) — für reine
//  "nur letzte Saison"-Spieler bleiben diese Felder bis Saisonstart leer.
//
//  Output: data/best-available-board.js — BEST_AVAILABLE_BOARD, ein
//  einzelnes flaches Array für js/best-available.js.
//
//  Usage:
//    node scripts/build-best-available-board.js
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'best-available-board.js');

// ------------------------------------------------------------
// Helpers (identisch zu build-postdraft-board.js)
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
function normalizeName(raw) {
  if (!raw) return '';
  let s = raw.toLowerCase().trim();
  s = s.replace(/\./g, '');
  s = s.replace(/['\u2019\u2018`]/g, '');
  s = s.replace(/\b(jr|sr|iii|ii)\b/g, '');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}
function mean(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }
function stdDev(arr, m) {
  if (arr.length < 2) return 0;
  const v = arr.reduce((a, b) => a + (b - m) * (b - m), 0) / arr.length;
  return Math.sqrt(v);
}
function zScores(values) {
  const m = mean(values);
  const s = stdDev(values, m);
  return values.map(v => (s > 0 ? (v - m) / s : 0));
}

const CAT_LABELS = {
  pts: 'PTS', reb: 'REB', ast: 'AST', stl: 'STL', blk: 'BLK',
  tpm: '3PM', fgImpact: 'FG%', ftImpact: 'FT%',
  // "to" (Turnover) bewusst NICHT hier drin — Beyaz will TO nicht als
  // Beste/Schwächste Kategorie angezeigt bekommen, das ist ihm meist egal.
};

// Given a zScores dict (from offseason-rankings.js or livescores-aggregate.js
// shape), returns { best: {cat,z}, worst: {cat,z} } with friendly labels.
// "to" (turnovers) is already inverted at the source (positive z = good),
// so no extra sign-flipping needed here.
function bestWorstCategory(zDict) {
  if (!zDict) return null;
  const entries = Object.keys(zDict)
    .filter(k => CAT_LABELS[k] !== undefined && typeof zDict[k] === 'number')
    .map(k => ({ cat: CAT_LABELS[k], z: zDict[k] }));
  if (!entries.length) return null;
  entries.sort((a, b) => b.z - a.z);
  return { best: entries[0], worst: entries[entries.length - 1] };
}

const BA_NBA_TEAMS = new Set(['ATL', 'BOS', 'BKN', 'CHA', 'CHI', 'CLE', 'DAL', 'DEN', 'DET',
  'GSW', 'HOU', 'IND', 'LAC', 'LAL', 'MEM', 'MIA', 'MIL', 'MIN', 'NOR', 'NYK', 'OKC', 'ORL',
  'PHI', 'PHO', 'POR', 'SAC', 'SAS', 'TOR', 'UTA', 'WAS', 'FA']);

// ------------------------------------------------------------
// 1) Alle Datenquellen laden
// ------------------------------------------------------------
const DYNASTY_PLAYERS = loadVmArray(path.join(ROOT, 'data', 'rankings.js'), 'DYNASTY_PLAYERS') || [];

const baText = fs.readFileSync(path.join(ROOT, 'js', 'best-available.js'), 'utf8');
const faSnippet = extractBalanced(baText, 'const FA_PLAYERS = [', '[', ']');
const FA_PLAYERS = faSnippet ? (() => {
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${faSnippet}\nthis.__R__ = FA_PLAYERS;`, sandbox);
  return sandbox.__R__;
})() : [];

const POSTDRAFT_BOARD = (() => {
  const p = path.join(ROOT, 'data', 'postdraft-board.js');
  return fs.existsSync(p) ? (loadVmArray(p, 'POSTDRAFT_BOARD') || []) : [];
})();

const ROLLING_RANKINGS = (() => {
  const p = path.join(ROOT, 'data', 'rolling-rankings.js');
  return fs.existsSync(p) ? (loadVmArray(p, 'ROLLING_RANKINGS') || []) : [];
})();

// Laufende Saison 2026/27 (Liga "nba", NICHT Off-Season) — permanentes
// Archiv aus scripts/build-rolling-archive.js. eosRank wird darin trotz des
// Namens laufend auf den neuesten verfügbaren Monats-/Wochen-Stand
// aktualisiert, nicht nur am Saisonende. Aktuell (Off-Season) noch leer —
// füllt sich automatisch, sobald die reguläre Saison Weekly/Monthly-Daten
// liefert. Das ist die Quelle für die "2026/27 Rankings"-Spalte in Best
// Available.
const ROLLING_RANKINGS_2026_27 = (() => {
  const p = path.join(ROOT, 'data', 'rolling-rankings-2026-27.js');
  return fs.existsSync(p) ? (loadVmArray(p, 'ROLLING_RANKINGS_2026') || []) : [];
})();
const season2627RankByName = new Map();
ROLLING_RANKINGS_2026_27.forEach(p => {
  if (p.eosRank != null) season2627RankByName.set(normalizeName(p.name), p.eosRank);
});

// Voller BBM-Export der letzten Saison (Minuten + Kategorie-Z-Scores) —
// deutlich reichhaltiger als ROLLING_RANKINGS (nur Gesamt-Rang). Wird
// bevorzugt für das lastSeason-Signal UND für Beschreibungsfelder
// (MIN/Beste-Kat/Schwächste-Kat) verwendet, wenn kein Off-Season-/
// laufende-Saison-Fenster existiert. Statischer Snapshot, kein
// Live-Scrape — siehe Kommentar in der Datei selbst.
const LAST_SEASON_STATS = (() => {
  const p = path.join(ROOT, 'data', 'last-season-stats-2025-26.js');
  return fs.existsSync(p) ? (loadVmArray(p, 'LAST_SEASON_STATS_2025_26') || []) : [];
})();

// Alter für die 2026er Rookies (nicht in LAST_SEASON_STATS, da keine
// NBA-Saison gespielt) + Namen des 2025er Draft-Jahrgangs für die
// "Sophomore"-Filterstufe in Best Available.
const DRAFT_CLASS_2026 = (() => {
  const p = path.join(ROOT, 'data', 'draft-class-2026.js');
  return fs.existsSync(p) ? (loadVmArray(p, 'DRAFT_CLASS_2026') || []) : [];
})();
const DRAFT_CLASS_2025 = (() => {
  const p = path.join(ROOT, 'data', 'draft-class-2025.js');
  return fs.existsSync(p) ? (loadVmArray(p, 'DRAFT_CLASS_2025') || []) : [];
})();
const rookieAgeByName = new Map();
DRAFT_CLASS_2026.forEach(p => rookieAgeByName.set(normalizeName(p.name), p.age));
const sophomoreNames = new Set(DRAFT_CLASS_2025.map(normalizeName));

const OFFSEASON_RANKINGS = (() => {
  const p = path.join(ROOT, 'data', 'offseason-rankings.js');
  return fs.existsSync(p) ? loadVmObject(p, 'OFFSEASON_RANKINGS') : null;
})();

const LIVESCORES_AGGREGATE = (() => {
  const p = path.join(ROOT, 'data', 'livescores-aggregate.js');
  return fs.existsSync(p) ? loadVmObject(p, 'LIVESCORES_AGGREGATE') : null;
})();

const OFFSEASON_LEAGUE_KEYS = new Set(['nba-summer-california', 'nba-summer-utah', 'nba-summer-las-vegas', 'nba-preseason']);

// Findet für einen Zeitraum ("week"|"month") das späteste verfügbare Fenster.
// Bevorzugt die Liga "nba" (reguläre Saison), sobald sie existiert — sonst
// die neueste verfügbare Off-Season-Liga.
function latestWindow(period) {
  if (!LIVESCORES_AGGREGATE || !LIVESCORES_AGGREGATE[period]) return null;
  const leagues = LIVESCORES_AGGREGATE[period];
  const leagueKeys = Object.keys(leagues);
  const regularSeasonKey = leagueKeys.find(k => !OFFSEASON_LEAGUE_KEYS.has(k));
  const preferredKeys = regularSeasonKey ? [regularSeasonKey] : leagueKeys;

  let best = null;
  preferredKeys.forEach(lk => {
    const dates = Object.keys(leagues[lk] || {});
    dates.forEach(d => {
      if (!best || d > best.date) best = { date: d, window: leagues[lk][d], league: lk };
    });
  });
  return best;
}
const LATEST_WEEK = latestWindow('week');
const LATEST_MONTH = latestWindow('month');
const isRegularSeason = LATEST_MONTH && !OFFSEASON_LEAGUE_KEYS.has(LATEST_MONTH.league);

function byNameMap(list, nameKey) {
  const m = new Map();
  list.forEach(p => m.set(normalizeName(p[nameKey] ?? p.name), p));
  return m;
}
const week7ByName = new Map();
if (LATEST_WEEK) LATEST_WEEK.window.players.forEach(p => week7ByName.set(normalizeName(p.name), p));
const month30ByName = new Map();
if (LATEST_MONTH) LATEST_MONTH.window.players.forEach(p => month30ByName.set(normalizeName(p.name), p));
const offseasonByName = new Map();
if (OFFSEASON_RANKINGS && Array.isArray(OFFSEASON_RANKINGS.players)) {
  OFFSEASON_RANKINGS.players.forEach(p => offseasonByName.set(normalizeName(p.name), p));
}
const postDraftByName = byNameMap(POSTDRAFT_BOARD, 'name');
const dynastyByName = new Map();
DYNASTY_PLAYERS.forEach(p => dynastyByName.set(normalizeName(p[1]), p));
const bbmByName = new Map();
FA_PLAYERS.forEach(p => bbmByName.set(normalizeName(p.name), p));
const rollingByName = new Map();
ROLLING_RANKINGS.forEach(p => rollingByName.set(normalizeName(p.name), p));
const lastSeasonStatsByName = new Map();
LAST_SEASON_STATS.forEach(p => lastSeasonStatsByName.set(normalizeName(p.name), p));

// ------------------------------------------------------------
// 2) Kandidaten-Pool: Union aller bekannten Spieler mit gültigem NBA-Team
// ------------------------------------------------------------
const candidates = new Map(); // normalizedName -> { name, nbaTeam, pos, dob }

function addCandidate(name, nbaTeam, pos, dob) {
  if (!name || !nbaTeam || !BA_NBA_TEAMS.has(nbaTeam)) return;
  const key = normalizeName(name);
  if (!candidates.has(key)) candidates.set(key, { name, nbaTeam, pos: pos || '', dob: dob || null });
  else if (dob && !candidates.get(key).dob) candidates.get(key).dob = dob;
}

DYNASTY_PLAYERS.forEach(p => addCandidate(p[1], p[2], p[3], p[4]));
FA_PLAYERS.forEach(p => addCandidate(p.name, p.nba, p.pos, null));
POSTDRAFT_BOARD.forEach(p => { if (p.drafted) addCandidate(p.name, p.nbaTeam, p.pos, null); });
// rolling-rankings.js hat kein Team-Feld — nur aufnehmen, wenn der Name
// bereits über eine der anderen Quellen ein gültiges Team hat (s.o.); sonst
// wüssten wir nicht, ob der Spieler überhaupt noch in der NBA ist.

// ------------------------------------------------------------
// 3) Rang→Z-Score Hilfsfunktion (für dynasty/BBM/eosRank — alles reine
//    Rangfolgen ohne rohe Statistiken)
// ------------------------------------------------------------
function rankToZLookup(pairs) {
  // pairs: [[key, rank], ...] — niedrigerer Rang = besser
  const ranks = pairs.map(([, r]) => r);
  const z = zScores(ranks.map(r => -r)); // invertiert: niedriger Rang -> hoher Wert
  const out = new Map();
  pairs.forEach(([key], i) => out.set(key, z[i]));
  return out;
}

const dynastyZByKey = rankToZLookup(DYNASTY_PLAYERS.map(p => [normalizeName(p[1]), p[0]]));
const bbmZByKey = rankToZLookup(FA_PLAYERS.map(p => [normalizeName(p.name), p.rank]));
const rollingZByKey = rankToZLookup(
  ROLLING_RANKINGS.filter(p => p.eosRank != null).map(p => [normalizeName(p.name), p.eosRank])
);

// ------------------------------------------------------------
// 4) Pro Kandidat: Signale sammeln, Score berechnen, Beschreibungsfelder füllen
// ------------------------------------------------------------
const BASE_WEIGHTS = {
  dynasty: 0.35, bbm: 0.15, postDraft: 0.30, lastSeason: 0.20,
  offseason: 0.15, currentSeason: 0.35,
};

const players = [];
candidates.forEach((info, key) => {
  const dyn = dynastyByName.get(key);
  const bbm = bbmByName.get(key);
  const pd = postDraftByName.get(key);
  const off = offseasonByName.get(key);
  const week = week7ByName.get(key);
  const month = month30ByName.get(key);
  const roll = rollingByName.get(key);

  const lastStats = lastSeasonStatsByName.get(key);

  const signals = [];
  if (dyn) signals.push(['dynasty', dynastyZByKey.get(key) ?? 0]);
  if (bbm) signals.push(['bbm', bbmZByKey.get(key) ?? 0]);
  if (pd) signals.push(['postDraft', pd.compositeScore]);
  if (lastStats) signals.push(['lastSeason', lastStats.composite / 3]); // volle Kategorie-Z-Summe, grob auf gleiche Streuung skaliert
  else if (roll && roll.eosRank != null) signals.push(['lastSeason', rollingZByKey.get(key) ?? 0]); // Fallback: nur Rang, falls kein BBM-Stat-Eintrag existiert
  if (off) signals.push(['offseason', off.composite / 3]); // grob auf ähnliche Streuung wie andere Z-Signale skaliert
  // "currentSeason" nur als EIGENES Signal zählen, sobald die reguläre Saison
  // läuft — während der Off-Season wäre das dieselben Summer-League-Zahlen
  // wie im "offseason"-Signal oben und würde sie doppelt gewichten.
  if (month && isRegularSeason) signals.push(['currentSeason', month.composite / 3]);

  const weightSum = signals.reduce((s, [k]) => s + BASE_WEIGHTS[k], 0);
  const compositeScore = weightSum > 0
    ? Math.round((signals.reduce((s, [k, v]) => s + v * (BASE_WEIGHTS[k] / weightSum), 0)) * 100) / 100
    : -99; // keinerlei Signal vorhanden -> ans Ende sortieren

  // Beschreibungsfelder: laufende Saison > Off-Season, sonst leer
  const statSource = month || off || lastStats;
  const minutesAvg = statSource ? Math.round((statSource.min ?? 0) * 10) / 10 : null;
  const bw7 = week ? bestWorstCategory(week.zScores) : null;
  const bw30 = month ? bestWorstCategory(month.zScores) : (off ? bestWorstCategory(off.zScores) : (lastStats ? bestWorstCategory(lastStats.zScores) : null));
  const z7 = week ? Math.round(week.composite * 100) / 100 : null;
  const z30 = month ? Math.round(month.composite * 100) / 100 : (off ? Math.round(off.composite * 100) / 100 : (lastStats ? Math.round(lastStats.composite * 100) / 100 : null));

  players.push({
    name: info.name,
    nbaTeam: info.nbaTeam,
    pos: info.pos,
    dob: info.dob,
    age: lastStats && lastStats.age != null
      ? Math.floor(lastStats.age)
      : (rookieAgeByName.has(key) ? Math.floor(rookieAgeByName.get(key)) : null),
    isRookie: !!pd,
    experience: pd ? 'rookie' : (sophomoreNames.has(key) ? 'sophomore' : 'veteran'),
    dynastyRank: dyn ? dyn[0] : null,
    bbmRank: bbm ? bbm.rank : null,
    lastSeasonRank: roll ? roll.eosRank : null,
    season2627Rank: season2627RankByName.get(key) ?? null,
    postDraftRank: pd ? pd.rank : null,
    stickyScore: pd ? pd.stickyScore : null,
    minutesAvg,
    z7,
    z30,
    bestCat7: bw7 ? bw7.best.cat : null,
    bestCat30: bw30 ? bw30.best.cat : null,
    worstCat30: bw30 ? bw30.worst.cat : null,
    statsWindow: month ? (isRegularSeason ? 'season' : 'offseason-30d') : (off ? 'offseason' : (lastStats ? 'last-season' : null)),
    compositeScore,
    signalsUsed: signals.map(([k]) => k),
  });
});

players.sort((a, b) => b.compositeScore - a.compositeScore);
players.forEach((p, i) => { p.rank = i + 1; });

// ------------------------------------------------------------
// 5) Serialisieren
// ------------------------------------------------------------
const lines = players.map(p => {
  const f = (v) => v === null || v === undefined ? 'null' : (typeof v === 'string' ? JSON.stringify(v) : v);
  return `  { rank: ${p.rank}, name: ${JSON.stringify(p.name)}, nbaTeam: ${JSON.stringify(p.nbaTeam)}, pos: ${JSON.stringify(p.pos)}, dob: ${f(p.dob)}, age: ${f(p.age)}, ` +
    `isRookie: ${p.isRookie}, experience: ${JSON.stringify(p.experience)}, dynastyRank: ${f(p.dynastyRank)}, bbmRank: ${f(p.bbmRank)}, lastSeasonRank: ${f(p.lastSeasonRank)}, season2627Rank: ${f(p.season2627Rank)}, ` +
    `postDraftRank: ${f(p.postDraftRank)}, stickyScore: ${f(p.stickyScore)}, minutesAvg: ${f(p.minutesAvg)}, ` +
    `z7: ${f(p.z7)}, z30: ${f(p.z30)}, bestCat7: ${f(p.bestCat7)}, bestCat30: ${f(p.bestCat30)}, worstCat30: ${f(p.worstCat30)}, ` +
    `statsWindow: ${f(p.statsWindow)}, compositeScore: ${p.compositeScore}, signalsUsed: ${JSON.stringify(p.signalsUsed)} }`;
});

const now = new Date().toISOString().slice(0, 10);
const out = `// ============================================================
//  BEST AVAILABLE BOARD — vereinheitlichter Score (ALLE Spieler)
// ============================================================
//  AUTO-GENERIERT von scripts/build-best-available-board.js über die
//  "Daily 9cat Live Scores" GitHub Action. Nicht von Hand editieren.
//  Zuletzt aktualisiert: ${now}
//  Aktueller Saison-Modus für "currentSeason"/z7/z30: ${isRegularSeason ? '"nba" (reguläre Saison)' : LATEST_MONTH ? `"${LATEST_MONTH.league}" (Off-Season)` : 'keine laufenden Daten'}
//
//  js/best-available.js filtert diese Liste zur Laufzeit gegen ROSTERS
//  (nicht rostered = Best Available). Nicht rostered ist HIER bereits
//  nicht berücksichtigt — das passiert client-seitig, da ROSTERS sich
//  durch manuelle Trades/Overrides zwischen den täglichen Läufen ändern kann.
//
//  Shape: BEST_AVAILABLE_BOARD = [ { rank, name, nbaTeam, pos, isRookie,
//    dynastyRank, bbmRank, lastSeasonRank, season2627Rank, postDraftRank, stickyScore,
//    minutesAvg, z7, z30, bestCat7, bestCat30, worstCat30, statsWindow,
//    compositeScore, signalsUsed }, ... ]
// ============================================================

const BEST_AVAILABLE_BOARD = [
${lines.join(',\n')}
];
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out, 'utf8');
console.log(`${OUT} aktualisiert: ${players.length} Spieler. Aktueller Saison-Modus: ${isRegularSeason ? 'reguläre Saison' : 'Off-Season'}.`);
