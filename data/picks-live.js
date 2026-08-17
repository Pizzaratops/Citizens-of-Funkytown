// ============================================================
//  data/picks-live.js -- Override-Basis fuer PICKS aus data/picks.js.
//  Zwei Quellen, zwei Abschnitte:
//
//    "automatisch" -- AUTO-GENERIERT von scripts/sync-espn-picks.js
//    über die "Daily 9cat Live Scores" GitHub Action. Nicht von Hand
//    editieren, wird bei jedem Lauf komplett neu geschrieben. Deckt
//    AUSSCHLIESSLICH den bevorstehenden ESPN-Draft ab (TTHQ-Jahr
//    2026 = ESPN-Saison 2027).
//    Zuletzt synchronisiert: 2026-08-17T16:58:59.909Z
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
  aktualisiert: "2026-08-17T16:58:59.909Z",
  automatisch: [{"year":2026,"round":1,"originalOwner":11,"currentOwner":1,"overallPickNumber":1},{"year":2026,"round":1,"originalOwner":9,"currentOwner":1,"overallPickNumber":2},{"year":2026,"round":1,"originalOwner":7,"currentOwner":1,"overallPickNumber":3},{"year":2026,"round":1,"originalOwner":4,"currentOwner":1,"overallPickNumber":4},{"year":2026,"round":1,"originalOwner":12,"currentOwner":7,"overallPickNumber":5},{"year":2026,"round":1,"originalOwner":10,"currentOwner":1,"overallPickNumber":6},{"year":2026,"round":1,"originalOwner":6,"currentOwner":6,"overallPickNumber":9},{"year":2026,"round":1,"originalOwner":3,"currentOwner":1,"overallPickNumber":10},{"year":2026,"round":1,"originalOwner":2,"currentOwner":11,"overallPickNumber":11},{"year":2026,"round":2,"originalOwner":11,"currentOwner":1,"overallPickNumber":13},{"year":2026,"round":2,"originalOwner":1,"currentOwner":12,"overallPickNumber":24},{"year":2026,"round":3,"originalOwner":7,"currentOwner":12,"overallPickNumber":27},{"year":2026,"round":3,"originalOwner":12,"currentOwner":7,"overallPickNumber":29},{"year":2026,"round":3,"originalOwner":6,"currentOwner":12,"overallPickNumber":33},{"year":2026,"round":3,"originalOwner":2,"currentOwner":9,"overallPickNumber":35},{"year":2026,"round":3,"originalOwner":1,"currentOwner":12,"overallPickNumber":36},{"year":2026,"round":4,"originalOwner":2,"currentOwner":9,"overallPickNumber":47},{"year":2026,"round":4,"originalOwner":1,"currentOwner":2,"overallPickNumber":48}],
  manuell: [{"datum":"2026-08-11","year":2027,"round":2,"originalOwner":12,"currentOwner":1,"notiz":"Vancouver Curry-Wurst (Andreas) 2027 R2 an Fighting Illini -- Gegenzug zum 11.08. Trade (2x 2026 R3 + 2026 R2 gingen im ESPN-Pick-Sync automatisch an Vancouver)"}],
  // Fuer die Hydrierung in js/admin.js zaehlt die Summe beider Listen.
  get updates() { return this.automatisch.concat(this.manuell); },
};
