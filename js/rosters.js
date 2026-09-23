// ============================================================
//  ROSTERS — Kader aus dem ESPN-Sync laden
// ============================================================
//  ROSTERS (data/teams-rosters.js) ist nur ein leerer Platzhalter.
//  Die echten Kader kommen aus data/rosters-live.js, das der Workflow
//  "Daily 9cat Live Scores" (scripts/sync-espn-rosters.js) halbstuendlich
//  von ESPN schreibt. Diese Datei legt sie beim Seitenstart in ROSTERS.
//
//  Seit 2026-09-23 gibt es keinen Admin-Bereich, keinen ESPN-Sync-Knopf
//  und keine Trade-Tools mehr. Frueher konnten dadurch Kaderstaende im
//  localStorage des Browsers liegen, die den Server-Stand ueberdeckt
//  haben (manueller Sync, Admin-Korrekturen). Die werden hier einmalig
//  geloescht, damit jeder Besucher denselben Stand sieht.
//  Ersetzt js/admin.js, js/admin-inline.js, js/admin-settings.js,
//  js/admin-workflow-trigger.js und js/roster-overrides.js.
// ============================================================

(function _hydrateRostersFromLiveFile() {
  if (typeof ROSTERS_LIVE === 'undefined') return;
  Object.keys(ROSTERS_LIVE).forEach(tidStr => {
    const tid = parseInt(tidStr, 10);
    if (Array.isArray(ROSTERS_LIVE[tidStr])) {
      ROSTERS[tid] = ROSTERS_LIVE[tidStr].map(p => ({ ...p }));
    }
  });
})();

(function _clearLegacyLocalRosterState() {
  try {
    ['taco_espn_roster_snapshot_v1', 'taco_roster_overrides_v1', 'espnLastSync', 'espnLastSyncTs',
     'pickOverrides', 'extraPicks', 'nbaTrades']
      .forEach(k => localStorage.removeItem(k));
  } catch (e) { /* privater Modus o.ae. -- nichts zu tun */ }
})();
