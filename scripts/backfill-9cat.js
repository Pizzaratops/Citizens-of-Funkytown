#!/usr/bin/env node
// ============================================================
//  BACKFILL — nachträglich fehlende Tage/Ligen einsammeln
// ============================================================
//  Ruft daily-9cat.js + convert-to-livescores.js für jeden Tag in einem
//  Zeitraum auf. Gedacht für: Tage, die vor dem Einrichten der Cron-Action
//  verpasst wurden, oder mehrere Summer-League-Standorte auf einmal.
//
//  Läuft NICHT in der Claude-Sandbox (kein Zugriff auf ESPN von dort) —
//  entweder lokal mit `node scripts/backfill-9cat.js ...` oder über den
//  "Backfill 9cat Live Scores"-Workflow in GitHub Actions ausführen.
//
//  Usage:
//    node scripts/backfill-9cat.js --all-summer-2026
//      → California Classic (3.–6.7.), Salt Lake City (4.–7.7.),
//        Las Vegas (9.–19.7. — nur bis heute, ESPN hat für zukünftige
//        Tage ohnehin keine abgeschlossenen Spiele)
//    node scripts/backfill-9cat.js --league=nba-summer-california --from=2026-07-03 --to=2026-07-06
//    node scripts/backfill-9cat.js --league=nba-summer-las-vegas --from=2026-07-09 --to=2026-07-14
// ============================================================

const { execSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const found = args.find(a => a.startsWith(`--${name}=`));
  return found ? found.split('=').slice(1).join('=') : fallback;
};

function dateRange(from, to) {
  const dates = [];
  const [fy, fm, fd] = from.split('-').map(Number);
  const [ty, tm, td] = to.split('-').map(Number);
  let cur = new Date(Date.UTC(fy, fm - 1, fd));
  const end = new Date(Date.UTC(ty, tm - 1, td));
  while (cur <= end) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return dates;
}

// Bekannter 2026 Summer-League-Zeitplan über alle drei Standorte, laut
// nba.com/summer-league/2026. Bei Bedarf hier anpassen (z.B. für 2027).
const KNOWN_2026_SCHEDULE = [
  { league: 'nba-summer-california', from: '2026-07-03', to: '2026-07-06' },
  { league: 'nba-summer-utah', from: '2026-07-04', to: '2026-07-07' },
  { league: 'nba-summer-las-vegas', from: '2026-07-09', to: '2026-07-19' },
];

let jobs;
if (args.includes('--all-summer-2026')) {
  jobs = KNOWN_2026_SCHEDULE;
} else {
  const league = arg('league', null);
  const from = arg('from', null);
  const to = arg('to', from);
  if (!league || !from) {
    console.error('Usage: node scripts/backfill-9cat.js --league=<slug> --from=YYYY-MM-DD [--to=YYYY-MM-DD]');
    console.error('   or: node scripts/backfill-9cat.js --all-summer-2026');
    process.exit(1);
  }
  jobs = [{ league, from, to }];
}

const scriptsDir = __dirname;
let totalDays = 0, totalOk = 0;

for (const job of jobs) {
  const dates = dateRange(job.from, job.to);
  console.log(`\n=== ${job.league}: ${dates.length} Tag(e) von ${job.from} bis ${job.to} ===\n`);

  for (const date of dates) {
    totalDays++;
    console.log(`--- ${job.league} / ${date} ---`);
    try {
      execSync(`node "${path.join(scriptsDir, 'daily-9cat.js')}" ${date} --league=${job.league}`, { stdio: 'inherit' });
    } catch (err) {
      console.warn(`  ! daily-9cat.js fehlgeschlagen für ${job.league}/${date}, überspringe: ${err.message}`);
      continue;
    }
    try {
      execSync(`node "${path.join(scriptsDir, 'convert-to-livescores.js')}" --date=${date} --league=${job.league} --keep-days=180`, { stdio: 'inherit' });
      totalOk++;
    } catch (err) {
      console.warn(`  ! convert-to-livescores.js fehlgeschlagen für ${job.league}/${date}: ${err.message}`);
    }
  }
}

console.log(`\nBackfill fertig: ${totalOk}/${totalDays} Tage erfolgreich konvertiert.\n`);
