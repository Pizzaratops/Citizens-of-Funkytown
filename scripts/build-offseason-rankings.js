#!/usr/bin/env node
// ============================================================
//  OFF-SEASON RANKINGS — Summer League (California/Utah/Las Vegas)
//  + Pre-Season, kumulativ über die GESAMTE Off-Season bisher
// ============================================================
//  Anders als Weekly/Monthly in data/livescores-aggregate.js (rollierendes
//  7-/30-Tage-Fenster, EINE Liga) zählt dieses Script ALLE bisher
//  vorhandenen Tages-CSVs der Off-Season-Ligen zusammen (keine Fenster-
//  Begrenzung) und berechnet Z-Scores über den gesamten kombinierten Pool.
//  Läuft täglich mit, tut aber nichts, solange keine passenden CSVs
//  existieren (z.B. außerhalb der Off-Season).
//
//  Usage:
//    node scripts/build-offseason-rankings.js
//    node scripts/build-offseason-rankings.js --dir=scripts/data --out=data/offseason-rankings.js --min-games=1
// ============================================================

const fs = require('fs');
const path = require('path');
const { parseCsv, CATEGORIES, FIELD_MAP, mean, stdDev, OFFSEASON_LEAGUES } = require('./aggregate-core');

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const found = args.find(a => a.startsWith(`--${name}=`));
  return found ? found.split('=').slice(1).join('=') : fallback;
};

const DIR = arg('dir', path.join(__dirname, 'data'));
const OUT = arg('out', path.join(__dirname, '..', 'data', 'offseason-rankings.js'));
const MIN_GAMES = parseInt(arg('min-games', '1'), 10);

const round1 = (n) => Math.round(n * 10) / 10;
const round2 = (n) => Math.round(n * 100) / 100;

const filePattern = new RegExp(`^daily-9cat_(${OFFSEASON_LEAGUES.join('|')})_(\\d{4}-\\d{2}-\\d{2})\\.csv$`);

const files = fs.existsSync(DIR)
  ? fs.readdirSync(DIR).filter(f => filePattern.test(f))
  : [];

if (!files.length) {
  console.log(`Keine Off-Season-CSVs in ${DIR} gefunden — offseason-rankings.js bleibt unverändert.`);
  process.exit(0);
}

// ------------------------------------------------------------
// 1) Alle Tages-CSVs der 4 Off-Season-Ligen aufsummieren
// ------------------------------------------------------------
const players = new Map();
const leaguesSeen = new Set();
let earliestDate = null;
let latestDate = null;

for (const file of files) {
  const m = file.match(filePattern);
  const league = m[1];
  const date = m[2];
  leaguesSeen.add(league);
  if (!earliestDate || date < earliestDate) earliestDate = date;
  if (!latestDate || date > latestDate) latestDate = date;

  const text = fs.readFileSync(path.join(DIR, file), 'utf8');
  const rows = parseCsv(text);
  for (const row of rows) {
    const name = row.Name;
    if (!players.has(name)) {
      players.set(name, {
        name, team: row.Team, games: 0,
        min: 0, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, to: 0, tpm: 0,
        fgm: 0, fga: 0, ftm: 0, fta: 0,
      });
    }
    const p = players.get(name);
    p.team = row.Team; // letztbekanntes Team (kann sich zw. Summer-League-Standorten/Preseason unterscheiden)
    p.games += 1;
    p.min += Number(row.MIN) || 0;
    p.pts += Number(row.PTS) || 0;
    p.reb += Number(row.REB) || 0;
    p.ast += Number(row.AST) || 0;
    p.stl += Number(row.STL) || 0;
    p.blk += Number(row.BLK) || 0;
    p.to += Number(row.TO) || 0;
    p.tpm += Number(row['3PM']) || 0;
    p.fgm += Number(row.FGM) || 0;
    p.fga += Number(row.FGA) || 0;
    p.ftm += Number(row.FTM) || 0;
    p.fta += Number(row.FTA) || 0;
  }
}

const allPlayers = Array.from(players.values());
const eligible = allPlayers.filter(p => p.games >= MIN_GAMES);

if (!eligible.length) {
  console.log(`${allPlayers.length} Spieler gefunden, aber keiner mit >= ${MIN_GAMES} Spielen — offseason-rankings.js bleibt unverändert.`);
  process.exit(0);
}

// ------------------------------------------------------------
// 2) Pro-Spiel-Schnitte, FG%/FT%-Impact, Z-Scores — exakt gleiche
//    Mathematik wie scripts/lib/aggregate-core.js, nur über den
//    kombinierten Off-Season-Pool statt einer einzelnen Liga/Fenster.
// ------------------------------------------------------------
for (const p of eligible) {
  p.ptsPg = p.pts / p.games;
  p.rebPg = p.reb / p.games;
  p.astPg = p.ast / p.games;
  p.stlPg = p.stl / p.games;
  p.blkPg = p.blk / p.games;
  p.toPg = p.to / p.games;
  p.tpmPg = p.tpm / p.games;
}

const totalFGM = eligible.reduce((s, p) => s + p.fgm, 0);
const totalFGA = eligible.reduce((s, p) => s + p.fga, 0);
const totalFTM = eligible.reduce((s, p) => s + p.ftm, 0);
const totalFTA = eligible.reduce((s, p) => s + p.fta, 0);
const leagueFGpct = totalFGA > 0 ? totalFGM / totalFGA : 0;
const leagueFTpct = totalFTA > 0 ? totalFTM / totalFTA : 0;

for (const p of eligible) {
  const playerFGpct = p.fga > 0 ? p.fgm / p.fga : 0;
  const playerFTpct = p.fta > 0 ? p.ftm / p.fta : 0;
  p.fgImpact = p.fga > 0 ? (playerFGpct - leagueFGpct) * (p.fga / p.games) : 0;
  p.ftImpact = p.fta > 0 ? (playerFTpct - leagueFTpct) * (p.fta / p.games) : 0;
}

const stats = {};
for (const cat of CATEGORIES) {
  const field = FIELD_MAP[cat.key];
  const values = eligible.map(p => p[field]);
  const m = mean(values);
  const sd = stdDev(values, m);
  stats[cat.key] = { mean: m, sd };
}

for (const p of eligible) {
  let composite = 0;
  p.zScores = {};
  for (const cat of CATEGORIES) {
    const field = FIELD_MAP[cat.key];
    const { mean: m, sd } = stats[cat.key];
    let z = sd > 0 ? (p[field] - m) / sd : 0;
    if (cat.invert) z = -z;
    p.zScores[cat.key] = z;
    composite += z;
  }
  p.composite = composite;
}

eligible.sort((a, b) => b.composite - a.composite);

// ------------------------------------------------------------
// 3) Serialisieren & schreiben
// ------------------------------------------------------------
function fmtPlayer(p, i) {
  const z = p.zScores;
  const zStr = Object.keys(z).map(k => `${k}: ${round2(z[k])}`).join(', ');
  return `{ rank: ${i + 1}, name: ${JSON.stringify(p.name)}, team: ${JSON.stringify(p.team)}, games: ${p.games}, ` +
    `min: ${round1(p.min / p.games)}, pts: ${round1(p.ptsPg)}, reb: ${round1(p.rebPg)}, ast: ${round1(p.astPg)}, ` +
    `stl: ${round1(p.stlPg)}, blk: ${round1(p.blkPg)}, to: ${round1(p.toPg)}, tpm: ${round1(p.tpmPg)}, ` +
    `fgPct: ${p.fga > 0 ? round1((p.fgm / p.fga) * 100) : 0}, ftPct: ${p.fta > 0 ? round1((p.ftm / p.fta) * 100) : 0}, ` +
    `composite: ${round2(p.composite)}, zScores: { ${zStr} } }`;
}

const playersStr = eligible.map((p, i) => '      ' + fmtPlayer(p, i)).join(',\n');

const out = `// ============================================================
//  OFF-SEASON RANKINGS — Summer League (Cali/Utah/Vegas) + Pre-Season
// ============================================================
//  AUTO-GENERIERT von scripts/build-offseason-rankings.js über die
//  "Daily 9cat Live Scores" GitHub Action. Nicht von Hand editieren —
//  Änderungen werden beim nächsten Lauf überschrieben.
//
//  Kumulativ über die GESAMTE Off-Season bisher (kein rollierendes
//  Fenster wie bei Weekly/Monthly) — Z-Scores/composite ungewichtet,
//  exakt wie die Monthly-Ansicht bei Live Scores (siehe LS_COLUMNS_
//  AGGREGATE in js/livescores.js). minGames = ${MIN_GAMES}.
//
//  Shape:
//  OFFSEASON_RANKINGS = {
//    windowStart, windowEnd,   // "YYYY-MM-DD" — erster/letzter erfasster Tag
//    leagues,                   // welche der 4 Off-Season-Ligen Daten beigetragen haben
//    minGames,
//    leagueAvg: { fg, ft },
//    players: [ { rank, name, team, games, min, pts, reb, ast, stl, blk,
//      to, tpm, fgPct, ftPct, composite, zScores }, ... ]
//  }
// ============================================================

const OFFSEASON_RANKINGS = {
  windowStart: ${JSON.stringify(earliestDate)},
  windowEnd: ${JSON.stringify(latestDate)},
  leagues: ${JSON.stringify([...leaguesSeen].sort())},
  minGames: ${MIN_GAMES},
  leagueAvg: { fg: ${round1(leagueFGpct * 100)}, ft: ${round1(leagueFTpct * 100)} },
  players: [
${playersStr}
  ]
};
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out, 'utf8');
console.log(`${OUT} aktualisiert: ${eligible.length} Spieler, ${earliestDate}–${latestDate}, Ligen: ${[...leaguesSeen].join(', ')}.`);
