// ============================================================
//  data/picks-live.js -- Override-Basis für PICKS aus data/picks.js.
//  Zwei Quellen, zwei Abschnitte:
//
//    "automatisch" -- von scripts/sync-espn-picks.js, deckt nur den
//    bevorstehenden ESPN-Draft ab. Unangetastet von diesem Lauf.
//
//    "manuell" -- AUTO-GENERIERT von scripts/apply-pick-journal.js aus
//    scripts/data/pick-trades-manual.txt. Nicht direkt editieren,
//    stattdessen eine Zeile im Journal ergänzen und dieses Script
//    erneut laufen lassen.
//    Zuletzt angewendet: 2026-08-17T18:54:28.221Z
//
//  Wird von js/admin.js beim Seitenstart als Basis über PICKS gelegt.
// ============================================================

const PICKS_LIVE = {
  ttYear: 2026,
  espnSeason: 2027,
  aktualisiert: "2026-08-17T18:54:28.221Z",
  automatisch: [{"year":2026,"round":1,"originalOwner":11,"currentOwner":1,"overallPickNumber":1},{"year":2026,"round":1,"originalOwner":9,"currentOwner":1,"overallPickNumber":2},{"year":2026,"round":1,"originalOwner":7,"currentOwner":1,"overallPickNumber":3},{"year":2026,"round":1,"originalOwner":4,"currentOwner":1,"overallPickNumber":4},{"year":2026,"round":1,"originalOwner":12,"currentOwner":7,"overallPickNumber":5},{"year":2026,"round":1,"originalOwner":10,"currentOwner":1,"overallPickNumber":6},{"year":2026,"round":1,"originalOwner":6,"currentOwner":6,"overallPickNumber":9},{"year":2026,"round":1,"originalOwner":3,"currentOwner":1,"overallPickNumber":10},{"year":2026,"round":1,"originalOwner":2,"currentOwner":11,"overallPickNumber":11},{"year":2026,"round":2,"originalOwner":11,"currentOwner":1,"overallPickNumber":13},{"year":2026,"round":2,"originalOwner":1,"currentOwner":12,"overallPickNumber":24},{"year":2026,"round":3,"originalOwner":7,"currentOwner":12,"overallPickNumber":27},{"year":2026,"round":3,"originalOwner":12,"currentOwner":7,"overallPickNumber":29},{"year":2026,"round":3,"originalOwner":6,"currentOwner":12,"overallPickNumber":33},{"year":2026,"round":3,"originalOwner":2,"currentOwner":9,"overallPickNumber":35},{"year":2026,"round":3,"originalOwner":1,"currentOwner":12,"overallPickNumber":36},{"year":2026,"round":4,"originalOwner":2,"currentOwner":9,"overallPickNumber":47},{"year":2026,"round":4,"originalOwner":1,"currentOwner":2,"overallPickNumber":48}],
  manuell: [{"datum":"2026-08-11","year":2027,"round":2,"originalOwner":12,"currentOwner":1,"notiz":"Vancouver Curry-Wurst (Andreas) 2027 R2 an Fighting Illini -- Gegenzug zum 11.08. Trade (2x 2026 R3 + 2026 R2 gingen im ESPN-Pick-Sync automatisch an Vancouver)"},{"datum":"2026-08-12","year":2028,"round":1,"originalOwner":6,"currentOwner":1,"notiz":"3-Point Mafia 2028 R1 an Fighting Illini -- Gegenzug: FI gibt 2026 R1 Slot 9 (originalOwner 6, urspruenglich von 3PM erworben) zurueck an 3-Point Mafia. Diese Seite laeuft automatisch ueber den ESPN Pick-Sync (Trade ist bereits in ESPN eingetragen), hier nur der weit-voraus-Leg."}],
  get updates() { return this.automatisch.concat(this.manuell); },
};
