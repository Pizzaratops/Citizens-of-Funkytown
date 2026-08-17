// ============================================================
//  2026 NBA DRAFT — ECHTE DRAFT CAPITAL (Picks 1–60)
// ============================================================
//  Tatsächliches Ergebnis des NBA-Drafts vom 23./24. Juni 2026
//  (Barclays Center, Brooklyn). team = Team, das den Spieler auf
//  dem Podium ausgewählt hat bzw. dessen Rechte hält (bei
//  Draft-Night-Trades bereits das Endteam, sofern zum Redaktions-
//  schluss bekannt). Wird von scripts/build-postdraft-board.js
//  genutzt, um "Draft Capital" (frühe/späte Wahl = Signal für
//  Team-Vertrauen) mit in den Post-Draft Best Available Score
//  einfließen zu lassen. Nicht von Hand editieren, falls sich das
//  Draft-Ergebnis noch ändert (Trades) — dann hier korrigieren und
//  den Build-Schritt erneut laufen lassen.
// ============================================================

const DRAFT_CAPITAL_2026 = [
  { pick: 1, name: "AJ Dybantsa", team: "WAS" },
  { pick: 2, name: "Darryn Peterson", team: "UTA" },
  { pick: 3, name: "Cameron Boozer", team: "MEM" },
  { pick: 4, name: "Caleb Wilson", team: "CHI" },
  { pick: 5, name: "Keaton Wagler", team: "LAC" },
  { pick: 6, name: "Mikel Brown Jr.", team: "BKN" },
  { pick: 7, name: "Darius Acuff Jr.", team: "SAC" },
  { pick: 8, name: "Kingston Flemings", team: "ATL" },
  { pick: 9, name: "Morez Johnson Jr.", team: "DAL" },
  { pick: 10, name: "Brayden Burries", team: "MIL" },
  { pick: 11, name: "Yaxel Lendeborg", team: "GSW" },
  { pick: 12, name: "Aday Mara", team: "OKC" },
  { pick: 13, name: "Nate Ament", team: "MIL" },
  { pick: 14, name: "Hannes Steinbach", team: "CHA" },
  { pick: 15, name: "Dailyn Swain", team: "CHI" },
  { pick: 16, name: "Bennett Stirtz", team: "OKC" },
  { pick: 17, name: "Ebuka Okorie", team: "DET" },
  { pick: 18, name: "Christian Anderson Jr.", team: "CHA" },
  { pick: 19, name: "Allen Graves", team: "TOR" },
  { pick: 20, name: "Jayden Quaintance", team: "SAS" },
  { pick: 21, name: "Karim Lopez", team: "MEM" },
  { pick: 22, name: "Labaron Philon Jr.", team: "PHI" },
  { pick: 23, name: "Zuby Ejiofor", team: "ATL" },
  { pick: 24, name: "Cameron Carr", team: "LAL" },
  { pick: 25, name: "Sergio De Larrea", team: "DAL" },
  { pick: 26, name: "Tarris Reed Jr.", team: "SAS" },
  { pick: 27, name: "Chris Cenac Jr.", team: "BOS" },
  { pick: 28, name: "Joshua Jefferson", team: "BKN" },
  { pick: 29, name: "Alex Karaban", team: "SAS" },
  { pick: 30, name: "Koa Peat", team: "PHO" },
  { pick: 31, name: "Bruce Thornton", team: "HOU" },
  { pick: 32, name: "Richie Saunders", team: "MEM" },
  { pick: 33, name: "Isaiah Evans", team: "MIN" },
  { pick: 34, name: "Meleek Thomas", team: "CLE" },
  { pick: 35, name: "Trevon Brazile", team: "DEN" },
  { pick: 36, name: "Baba Miller", team: "LAC" },
  { pick: 37, name: "Ryan Conwell", team: "MIA" },
  { pick: 38, name: "Braden Smith", team: "IND" },
  { pick: 39, name: "Jack Kayil", team: "NYK" },
  { pick: 40, name: "Dillon Mitchell", team: "BOS" },
  { pick: 41, name: "Otega Oweh", team: "OKC" },
  { pick: 42, name: "Ja'Kobi Gillespie", team: "SAS" },
  { pick: 43, name: "Tyler Bilodeau", team: "BKN" },
  { pick: 44, name: "Maliq Brown", team: "SAS" },
  { pick: 45, name: "Emanuel Sharp", team: "SAC" },
  { pick: 46, name: "Felix Okpara", team: "WAS" },
  { pick: 47, name: "Tyler Nickel", team: "NYK" },
  { pick: 48, name: "Tobi Lawal", team: "DAL" },
  { pick: 49, name: "Bryce Hopkins", team: "DEN" },
  { pick: 50, name: "Jaden Bradley", team: "TOR" },
  { pick: 51, name: "Izaiyah Nelson", team: "ORL" },
  { pick: 52, name: "Henri Veesaar", team: "ATL" },
  { pick: 53, name: "Ugonna Onyenso", team: "DET" },
  { pick: 54, name: "Lajae Jones", team: "GSW" },
  { pick: 55, name: "Nick Martinelli", team: "LAC" },
  { pick: 56, name: "Vsevolod Ishchenko", team: "DAL" },
  { pick: 57, name: "Narcisse Ngoy", team: "LAC" },
  { pick: 58, name: "Jaron Pierre Jr.", team: "NOR" },
  { pick: 59, name: "Trey Kaufman-Renn", team: "MIN" },
  { pick: 60, name: "Malique Lewis", team: "MIL" },
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { DRAFT_CAPITAL_2026 };
}
