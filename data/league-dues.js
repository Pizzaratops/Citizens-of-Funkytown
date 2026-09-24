// ============================================================
//  LEAGUE_DUES — Liga-Beiträge je Saison, von Hand gepflegt
// ============================================================
//  Eingetragen wird nur, WER SCHON BEZAHLT HAT (LEAGUE_DUES_PAID).
//  Alles andere leitet die Seite "💰 Liga-Beiträge" selbst ab:
//   - Saison <= CURRENT_DUES_SEASON ohne Eintrag: "Muss zahlen"
//     (Redraft-Liga: jeder zahlt jede Saison).
//   - Spätere Saisons: "offen" (noch nicht fällig).
//
//  Zahlung eintragen: { teamId, season } in LEAGUE_DUES_PAID ergänzen.
//  teamId = ID aus data/teams-rosters.js (TEAMS), season = exakt wie in
//  DUES_SEASONS geschrieben. date ist optional (z.B. "2026-10-05") und
//  wird als Tooltip angezeigt.
//
//  DUES_AMOUNT (optional, Zahl in Euro): Beitrag pro Team und Saison.
//  Ist er gesetzt, zeigt die Seite zusätzlich die eingesammelte Summe.
//
//  Neue Saison: DUES_SEASONS vorne ergänzen, CURRENT_DUES_SEASON
//  umstellen. Alte Einträge bleiben stehen und bilden die Historie.
// ============================================================

const DUES_SEASONS = ['2026/27'];
const CURRENT_DUES_SEASON = '2026/27';
const DUES_AMOUNT = null;

const LEAGUE_DUES_PAID = [
  { teamId: 1, season: '2026/27' },  // Fighting Illini (Kong Power)
  { teamId: 3, season: '2026/27' },  // German Wunderkinder (Stefan Buchholz)
  { teamId: 8, season: '2026/27' },  // Isaac's Falling Fruits (White Schröder)
  { teamId: 9, season: '2026/27' },  // Greifswald SG Gerstensaft (Sven Kosanke)
  { teamId: 6, season: '2026/27' },  // Cook Island Airballers (Rocket Sascha)
  { teamId: 7, season: '2026/27' },  // Crackpistel Baller (Thies Rinner)
  { teamId: 4, season: '2026/27' },  // Gewürz Jürgchens (Jürgen Willi)
  { teamId: 5, season: '2026/27' },  // Team Peterson (Enno)
];

// Rückgabe: "paid" | "owes" | "not-relevant"
function leagueDuesStatus(teamId, season) {
  const paid = LEAGUE_DUES_PAID.some(d => d.teamId === teamId && d.season === season);
  if (paid) return 'paid';
  const idx = DUES_SEASONS.indexOf(season);
  const cur = DUES_SEASONS.indexOf(CURRENT_DUES_SEASON);
  // DUES_SEASONS ist absteigend sortiert (neueste zuerst): ein groesserer
  // Index heisst aeltere Saison, also bereits faellig.
  return idx >= cur ? 'owes' : 'not-relevant';
}

function leagueDuesPaidEntry(teamId, season) {
  return LEAGUE_DUES_PAID.find(d => d.teamId === teamId && d.season === season) || null;
}