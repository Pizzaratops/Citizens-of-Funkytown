#!/usr/bin/env node
// ============================================================
//  ESPN WOCHEN-MATCHUPS SYNC (laufende Saison)
// ============================================================
//  Taeglicher Schritt im Workflow "Daily 9cat Live Scores": holt die
//  bereits entschiedenen Matchups der laufenden ESPN-Saison und
//  schreibt sie nach data/season-matchups.js (Details siehe
//  scripts/lib/espn-matchups.js). Vor Saisonstart gibt es noch keine
//  entschiedenen Wochen, dann aendert sich einfach nichts.
//
//  Bewusst NICHT fatal (exit 0), damit ein ESPN-Aussetzer den Rest des
//  taeglichen Workflows nicht stoppt.
//
//  Usage:
//    node scripts/sync-espn-matchups.js            (laufende Saison)
//    node scripts/sync-espn-matchups.js --season 2026
// ============================================================

const { loadConfig, fetchSeasonMatchups, writeMatchups } = require('./lib/espn-matchups');

async function main() {
  const cfg = loadConfig();
  const i = process.argv.indexOf('--season');
  const season = i > -1 ? parseInt(process.argv[i + 1], 10) : cfg.ESPN_SEASON;
  console.log(`Wochen-Matchups für ESPN-Liga ${cfg.ESPN_LEAGUE_ID}, Saison ${season}...`);
  const data = await fetchSeasonMatchups(cfg, season);
  if (!data) { console.warn('Keine Daten von ESPN, Stand bleibt unverändert.'); return; }
  console.log(`  ${Object.keys(data.weeks).length} entschiedene Woche(n), scoringType ${data.scoringType || 'unbekannt'}.`);
  writeMatchups([data]);
}

main().catch(err => {
  console.error('Matchup-Sync fehlgeschlagen (nicht fatal):', err.message);
});
