// ============================================================
//  data/picks-live.js -- Override-Basis fuer PICKS aus data/picks.js.
//  Zwei Quellen, zwei Abschnitte:
//
//    "automatisch" -- AUTO-GENERIERT von scripts/sync-espn-picks.js
//    über die "Daily 9cat Live Scores" GitHub Action. Nicht von Hand
//    editieren, wird bei jedem Lauf komplett neu geschrieben. Deckt
//    AUSSCHLIESSLICH den bevorstehenden ESPN-Draft ab (TTHQ-Jahr
//    2026 = ESPN-Saison 2027).
//    Zuletzt synchronisiert: 2026-08-26T13:58:57.830Z
//
//    "manuell" -- von scripts/apply-pick-journal.js aus
//    scripts/data/pick-trades-manual.txt geschrieben. Deckt Picks fuer
//    spaetere Drafts ab, die ESPN nie sieht. Bleibt bei einem Lauf
//    dieses Scripts unangetastet stehen.
//
//  Wird von js/admin.js beim Seitenstart als Basis über PICKS gelegt
//  (_hydratePicksFromLiveFile), bevor ein manueller Admin-Override
//  (falls vorhanden) das letzte Wort behält. Legt NIE einen neuen Pick
//  an -- nur (year,round,originalOwner)-Tripel, die data/picks.js
//  bereits kennt, werden aktualisiert.
// ============================================================

const PICKS_LIVE = {
  ttYear: 2026,
  espnSeason: 2027,
  aktualisiert: "2026-08-26T13:58:57.830Z",
  automatisch: [],
  manuell: [{"datum":"2026-08-11","year":2027,"round":2,"originalOwner":12,"currentOwner":1,"notiz":"Vancouver Curry-Wurst (Andreas) 2027 R2 an Fighting Illini -- Gegenzug zum 11.08. Trade (2x 2026 R3 + 2026 R2 gingen im ESPN-Pick-Sync automatisch an Vancouver)"},{"datum":"2026-08-12","year":2028,"round":1,"originalOwner":6,"currentOwner":1,"notiz":"3-Point Mafia 2028 R1 an Fighting Illini -- Gegenzug: FI gibt 2026 R1 Slot 9 (originalOwner 6, urspruenglich von 3PM erworben) zurueck an 3-Point Mafia. Diese Seite laeuft automatisch ueber den ESPN Pick-Sync (Trade ist bereits in ESPN eingetragen), hier nur der weit-voraus-Leg."}],
  // Fuer die Hydrierung in js/admin.js zaehlt die Summe beider Listen.
  get updates() { return this.automatisch.concat(this.manuell); },
};
