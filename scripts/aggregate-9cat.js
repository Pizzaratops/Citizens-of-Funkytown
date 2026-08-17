#!/usr/bin/env node
// ============================================================
//  Aggregierte 9cat Z-Score Rankings (Woche / Monat) — CLI-Tool
//  Liest die von daily-9cat.js erzeugten CSVs im selben Ordner
//  und aggregiert sie zu einem stabileren Composite-Score.
//
//  Rechnet über scripts/lib/aggregate-core.js — dieselbe Logik,
//  die auch scripts/convert-aggregate-to-livescores.js benutzt,
//  um data/livescores-aggregate.js (Weekly/Monthly-Tabs auf der
//  Seite) zu erzeugen. Dieses Skript hier ist nur für manuelle
//  Konsolen-/CSV-Auswertung, nicht Teil der Website-Pipeline.
//
//  Usage:
//    node aggregate-9cat.js week                        → letzte 7 Tage bis heute
//    node aggregate-9cat.js month                        → letzte 30 Tage bis heute
//    node aggregate-9cat.js week --end=2026-07-14        → 7 Tage bis zu einem Stichtag
//    node aggregate-9cat.js month --min-games=5          → Mindestanzahl Spiele (Default: week=2, month=4)
//    node aggregate-9cat.js week --league=nba-summer-las-vegas
// ============================================================

const fs = require('fs');
const path = require('path');
const { computeAggregate, toDateStr } = require('./aggregate-core');

const args = process.argv.slice(2);
const period = args.find(a => a === 'week' || a === 'month') || 'week';
const endArg = args.find(a => a.startsWith('--end='));
const leagueArg = args.find(a => a.startsWith('--league='));
const minGamesArg = args.find(a => a.startsWith('--min-games='));
const dirArg = args.find(a => a.startsWith('--dir='));

const LEAGUE = leagueArg ? leagueArg.split('=')[1] : 'nba-summer-las-vegas';
const dir = dirArg ? dirArg.split('=')[1] : path.join(__dirname, 'data');
const endDateStr = endArg ? endArg.split('=')[1] : new Date().toISOString().slice(0, 10);
const minGames = minGamesArg ? parseInt(minGamesArg.split('=')[1], 10) : undefined;

const result = computeAggregate({ league: LEAGUE, period, endDate: endDateStr, dir, minGames });

if (result.status === 'no-files') {
  console.log(`Keine Tages-CSVs im Zeitraum ${toDateStr(result.windowStart)} bis ${toDateStr(result.windowEnd)} gefunden (Liga: ${LEAGUE}).`);
  console.log('Läuft daily-9cat.js schon lange genug automatisiert, um Daten für diesen Zeitraum zu haben?');
  process.exit(0);
}

if (result.status === 'no-eligible') {
  console.log(`Keine Spieler mit mindestens ${result.minGames} Spielen im Zeitraum gefunden. --min-games=N zum Anpassen.`);
  process.exit(0);
}

const { windowStart: startDate, windowEnd: endDate, filesInWindow, allPlayers, eligible, leagueFGpct, leagueFTpct } = result;

// ------------------------------------------------------------
// Ausgabe: Konsole + CSV
// ------------------------------------------------------------
console.log(`\n=== ${period === 'month' ? 'Monats' : 'Wochen'}-9cat Ranking — ${toDateStr(startDate)} bis ${toDateStr(endDate)} (Liga: ${LEAGUE}) ===\n`);
console.log(`${filesInWindow.length} Tages-CSV(s) im Fenster, ${eligible.length} Spieler mit >= ${result.minGames} Spielen (von ${allPlayers.length} insgesamt).\n`);
console.log(`Liga-Durchschnitt im Fenster: FG% ${(leagueFGpct * 100).toFixed(1)}%  FT% ${(leagueFTpct * 100).toFixed(1)}%\n`);

const consoleRows = eligible.map((p, i) => ({
  Rank: i + 1,
  Name: p.name,
  Team: p.team,
  GP: p.games,
  'MIN/G': (p.min / p.games).toFixed(1),
  'PTS/G': p.ptsPg.toFixed(1),
  'REB/G': p.rebPg.toFixed(1),
  'AST/G': p.astPg.toFixed(1),
  'STL/G': p.stlPg.toFixed(1),
  'BLK/G': p.blkPg.toFixed(1),
  'TO/G': p.toPg.toFixed(1),
  '3PM/G': p.tpmPg.toFixed(1),
  'FG%': p.fga > 0 ? ((p.fgm / p.fga) * 100).toFixed(1) : '-',
  'FT%': p.fta > 0 ? ((p.ftm / p.fta) * 100).toFixed(1) : '-',
  Composite: p.composite.toFixed(2),
}));
console.table(consoleRows);

const csvHeader = [
  'Rank', 'Name', 'Team', 'GP', 'MIN_per_G', 'PTS_per_G', 'REB_per_G', 'AST_per_G',
  'STL_per_G', 'BLK_per_G', 'TO_per_G', '3PM_per_G', 'FG%', 'FT%', 'FGImpact', 'FTImpact', 'Composite',
];
const csvLines = [csvHeader.join(',')];
eligible.forEach((p, i) => {
  csvLines.push([
    i + 1,
    `"${p.name.replace(/"/g, '""')}"`,
    p.team,
    p.games,
    (p.min / p.games).toFixed(1),
    p.ptsPg.toFixed(2),
    p.rebPg.toFixed(2),
    p.astPg.toFixed(2),
    p.stlPg.toFixed(2),
    p.blkPg.toFixed(2),
    p.toPg.toFixed(2),
    p.tpmPg.toFixed(2),
    p.fga > 0 ? ((p.fgm / p.fga) * 100).toFixed(1) : '',
    p.fta > 0 ? ((p.ftm / p.fta) * 100).toFixed(1) : '',
    p.fgImpact.toFixed(2),
    p.ftImpact.toFixed(2),
    p.composite.toFixed(2),
  ].join(','));
});

const fileName = `${period}-9cat_${LEAGUE}_${toDateStr(startDate)}_to_${toDateStr(endDate)}.csv`;
const filePath = path.join(dir, fileName);
fs.writeFileSync(filePath, csvLines.join('\n'), 'utf8');
console.log(`\nCSV gespeichert: ${filePath}\n`);
