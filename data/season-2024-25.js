// ============================================================
//  SAISON-ARCHIV 2024/25 — Rosterstand + finale Bilanzen
// ============================================================
//  Quelle: ESPN-Liga-Export als Excel-Datei, von Beyaz bereitgestellt.
//  Programmatisch aus der Tabellenstruktur extrahiert, nicht von Hand
//  abgetippt. Jeder Spielername gegen die Repo-Spielerdatenbank
//  validiert (291 Spieler, 0 Abweichungen). Alle Bilanzen decken
//  sich exakt mit der ESPN-Final-Standings-Tabelle.
//
//  FELDER JE EINTRAG IN standings[]:
//    name    Historischer Teamname DIESER Saison (Teams wurden teils
//            umbenannt, z.B. "Bear Down" -> "Fighting Illini").
//    teamId  Heutige Team-ID fuer Farbe/Owner/Klick-Ziel, oder null
//            wenn das Team heute nicht mehr existiert (2023/24:
//            Angry Ducks, WebEmbiid, Pats Pats).
//
//  FELDER JE SPIELER:
//    acq     Wie der Spieler zum Team kam (Draft/Trade/Free Agency).
//    inj     Trug zum Exportzeitpunkt ein ESPN-Verletzungsicon.
//    injStatus  'O' (Out) oder 'DTD' (Day-to-Day), falls ueberliefert.
//            Aeltere Exporte (2023/24) nutzen DTD, neuere nur noch O.
//
//  Der "Ø Top-10 Rank"-Badge auf den Team-Karten wird zur Laufzeit aus
//  den AKTUELLEN Dynasty-Rankings berechnet (js/navigation.js), nicht
//  hier gespeichert -- er beantwortet "wie stark waere dieser Kader nach
//  heutigen Massstaeben", nicht "wie stark galt er damals".
//
//  Taxi Squads absichtlich nicht enthalten (0-0-0, reine Stashes,
//  erscheinen auch nicht in ESPNs Final-Standings-Tabelle).
// ============================================================

const SEASON_2024_25 = {
 "label": "Saison 2024/25",
 "standings": [
  {
   "place": 1,
   "name": "Bear Down",
   "teamId": 1,
   "record": "120-42-0",
   "rosterKey": "1"
  },
  {
   "place": 2,
   "name": "Hospital Squad",
   "teamId": 2,
   "record": "91-67-4",
   "rosterKey": "2"
  },
  {
   "place": 3,
   "name": "Anadolu Ballers",
   "teamId": 5,
   "record": "91-68-3",
   "rosterKey": "5"
  },
  {
   "place": 4,
   "name": "Neukoelln Hustlers",
   "teamId": 3,
   "record": "82-78-2",
   "rosterKey": "3"
  },
  {
   "place": 5,
   "name": "Vancouver Curry-Wurst",
   "teamId": 12,
   "record": "85-74-3",
   "rosterKey": "12"
  },
  {
   "place": 6,
   "name": "Always Money in the BananaStand",
   "teamId": 7,
   "record": "80-79-3",
   "rosterKey": "7"
  },
  {
   "place": 7,
   "name": "Leaveland Cavaliers",
   "teamId": 4,
   "record": "97-62-3",
   "rosterKey": "4"
  },
  {
   "place": 8,
   "name": "Cooking Show",
   "teamId": 9,
   "record": "85-76-1",
   "rosterKey": "9"
  },
  {
   "place": 9,
   "name": "S-Town Grizzlies",
   "teamId": 10,
   "record": "66-96-0",
   "rosterKey": "10"
  },
  {
   "place": 10,
   "name": "Double Dribble Trouble",
   "teamId": 11,
   "record": "60-98-4",
   "rosterKey": "11"
  },
  {
   "place": 11,
   "name": "3-POINT MAFIA",
   "teamId": 6,
   "record": "39-123-0",
   "rosterKey": "6"
  },
  {
   "place": 12,
   "name": "Kawhi So Serious",
   "teamId": 8,
   "record": "64-97-1",
   "rosterKey": "8"
  }
 ],
 "rosters": {
  "1": [
   {
    "slot": "PG",
    "name": "Trae Young",
    "team": "Atl",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Dyson Daniels",
    "team": "Atl",
    "pos": "SG, PG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Ausar Thompson",
    "team": "Det",
    "pos": "SF, PF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Miles Bridges",
    "team": "Cha",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "C",
    "name": "Mark Williams",
    "team": "Cha",
    "pos": "C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Kawhi Leonard",
    "team": "LAC",
    "pos": "SF, PF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "Ivica Zubac",
    "team": "LAC",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Alperen Sengun",
    "team": "Hou",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Amen Thompson",
    "team": "Hou",
    "pos": "SF, SG, PF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Josh Giddey",
    "team": "Chi",
    "pos": "SG, PG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jordan Poole",
    "team": "Wsh",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Jalen Suggs",
    "team": "Orl",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Cade Cunningham",
    "team": "Det",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jalen Williams",
    "team": "OKC",
    "pos": "PF, SF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Nikola Jokic",
    "team": "Den",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Karl-Anthony Towns",
    "team": "NY",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Mikal Bridges",
    "team": "NY",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Anthony Davis",
    "team": "Dal",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Trey Murphy III",
    "team": "NO",
    "pos": "SF, SG",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Immanuel Quickley",
    "team": "Tor",
    "pos": "PG, SG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Zion Williamson",
    "team": "NO",
    "pos": "PF",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Jimmy Butler III",
    "team": "GS",
    "pos": "SF, SG, PF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Jalen Johnson",
    "team": "Atl",
    "pos": "PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Paul George",
    "team": "Phi",
    "pos": "SF, PF",
    "acq": "Trade",
    "inj": true
   }
  ],
  "2": [
   {
    "slot": "PG",
    "name": "Chris Paul",
    "team": "SA",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Ricky Council IV",
    "team": "Phi",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Derrick Jones Jr.",
    "team": "LAC",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Jeremy Sochan",
    "team": "SA",
    "pos": "PF",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "C",
    "name": "Orlando Robinson",
    "team": "FA",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Jabari Smith Jr.",
    "team": "Hou",
    "pos": "PF, C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "Peyton Watson",
    "team": "Den",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Jusuf Nurkic",
    "team": "Cha",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Onyeka Okongwu",
    "team": "Atl",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Aaron Gordon",
    "team": "Den",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "LeBron James",
    "team": "LAL",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jaren Jackson Jr.",
    "team": "Mem",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Cameron Johnson",
    "team": "Bkn",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Anthony Edwards",
    "team": "Min",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Malik Monk",
    "team": "Sac",
    "pos": "SG, PG, SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Stephen Curry",
    "team": "GS",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Bub Carrington",
    "team": "Wsh",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Keon Ellis",
    "team": "Sac",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jaden McDaniels",
    "team": "Min",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kyle Kuzma",
    "team": "Mil",
    "pos": "PF, SF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Nicolas Batum",
    "team": "LAC",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Trendon Watford",
    "team": "Bkn",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jeff Dowtin Jr.",
    "team": "Phi",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Jaylen Brown",
    "team": "Bos",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": true
   }
  ],
  "5": [
   {
    "slot": "PG",
    "name": "Payton Pritchard",
    "team": "Bos",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Malik Beasley",
    "team": "Det",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Andrew Wiggins",
    "team": "Mia",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Kelly Olynyk",
    "team": "NO",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "C",
    "name": "Jalen Duren",
    "team": "Det",
    "pos": "C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Jalen Green",
    "team": "Hou",
    "pos": "SG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "Caris LeVert",
    "team": "Atl",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Russell Westbrook",
    "team": "Den",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Sam Hauser",
    "team": "Bos",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Amir Coffey",
    "team": "LAC",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Pascal Siakam",
    "team": "Ind",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Austin Reaves",
    "team": "LAL",
    "pos": "SG, PG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kevin Durant",
    "team": "Phx",
    "pos": "PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Kyrie Irving",
    "team": "Dal",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Jakob Poeltl",
    "team": "Tor",
    "pos": "C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Bennedict Mathurin",
    "team": "Ind",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Tim Hardaway Jr.",
    "team": "Det",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kevin Love",
    "team": "Mia",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Terry Rozier",
    "team": "Mia",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Joel Embiid",
    "team": "Phi",
    "pos": "C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Pat Connaughton",
    "team": "Mil",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Killian Hayes",
    "team": "Bkn",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Precious Achiuwa",
    "team": "NY",
    "pos": "PF, C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Brandon Clarke",
    "team": "Mem",
    "pos": "PF, C",
    "acq": "Free Agency",
    "inj": true
   }
  ],
  "3": [
   {
    "slot": "PG",
    "name": "Shai Gilgeous-Alexander",
    "team": "OKC",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Scottie Barnes",
    "team": "Tor",
    "pos": "SF, SG, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Max Strus",
    "team": "Cle",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Georges Niang",
    "team": "Atl",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Micah Potter",
    "team": "Utah",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Haywood Highsmith",
    "team": "Mia",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "Ochai Agbaji",
    "team": "Tor",
    "pos": "SF, SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "RJ Barrett",
    "team": "Tor",
    "pos": "SF, SG, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Jordan Clarkson",
    "team": "Utah",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Vit Krejci",
    "team": "Atl",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Nikola Vucevic",
    "team": "Chi",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Giannis Antetokounmpo",
    "team": "Mil",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jonas Valanciunas",
    "team": "Sac",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Zach Collins",
    "team": "Chi",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Santi Aldama",
    "team": "Mem",
    "pos": "PF, SF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Luguentz Dort",
    "team": "OKC",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Andrew Nembhard",
    "team": "Ind",
    "pos": "PG, SG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Taurean Prince",
    "team": "Mil",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Julian Champagnie",
    "team": "SA",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Ziaire Williams",
    "team": "Bkn",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Jaxson Hayes",
    "team": "LAL",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Brandon Williams",
    "team": "Dal",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kristaps Porzingis",
    "team": "Bos",
    "pos": "C, PF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "De'Aaron Fox",
    "team": "SA",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Deandre Ayton",
    "team": "Por",
    "pos": "C",
    "acq": "Trade",
    "inj": true
   }
  ],
  "12": [
   {
    "slot": "PG",
    "name": "Collin Sexton",
    "team": "Utah",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "CJ McCollum",
    "team": "NO",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "SF",
    "name": "Norman Powell",
    "team": "LAC",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Al Horford",
    "team": "Bos",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Moussa Diabate",
    "team": "Cha",
    "pos": "PF, C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Aaron Wiggins",
    "team": "OKC",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Tyler Herro",
    "team": "Mia",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Derrick White",
    "team": "Bos",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Steven Adams",
    "team": "Hou",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Brook Lopez",
    "team": "Mil",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Mitchell Robinson",
    "team": "NY",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Rudy Gobert",
    "team": "Min",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "D'Angelo Russell",
    "team": "Bkn",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Luke Kennard",
    "team": "Mem",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "T.J. McConnell",
    "team": "Ind",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Scotty Pippen Jr.",
    "team": "Mem",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "DeMar DeRozan",
    "team": "Sac",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Dalton Knecht",
    "team": "LAL",
    "pos": "SG, SF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Keon Johnson",
    "team": "Bkn",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Gary Payton II",
    "team": "GS",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Richaun Holmes",
    "team": "Wsh",
    "pos": "C, PF",
    "acq": "Free Agency",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Terrence Shannon Jr.",
    "team": "Min",
    "pos": "SG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Goga Bitadze",
    "team": "Orl",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "John Collins",
    "team": "Utah",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": true
   }
  ],
  "7": [
   {
    "slot": "PG",
    "name": "Tyus Jones",
    "team": "Phx",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Klay Thompson",
    "team": "Dal",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Naji Marshall",
    "team": "Dal",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Evan Mobley",
    "team": "Cle",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Nick Richards",
    "team": "Phx",
    "pos": "C",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "G/F",
    "name": "Mike Conley",
    "team": "Min",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "Jonathan Isaac",
    "team": "Orl",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Donte DiVincenzo",
    "team": "Min",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "LaMelo Ball",
    "team": "Cha",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Wendell Carter Jr.",
    "team": "Orl",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Myles Turner",
    "team": "Ind",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Bradley Beal",
    "team": "Phx",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jalen Brunson",
    "team": "NY",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Draymond Green",
    "team": "GS",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Ja Morant",
    "team": "Mem",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Coby White",
    "team": "Chi",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Stephon Castle",
    "team": "SA",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kelly Oubre Jr.",
    "team": "Phi",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Andre Drummond",
    "team": "Phi",
    "pos": "C",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Kevin Huerter",
    "team": "Chi",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Tobias Harris",
    "team": "Det",
    "pos": "PF, SF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Nick Smith Jr.",
    "team": "Cha",
    "pos": "SG",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Ayo Dosunmu",
    "team": "Chi",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Dejounte Murray",
    "team": "NO",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Jonathan Kuminga",
    "team": "GS",
    "pos": "PF",
    "acq": "Trade",
    "inj": false
   }
  ],
  "4": [
   {
    "slot": "PG",
    "name": "Dennis Schroder",
    "team": "Det",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Zach LaVine",
    "team": "Sac",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Christian Braun",
    "team": "Den",
    "pos": "SG, SF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Julius Randle",
    "team": "Min",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Jalen Smith",
    "team": "Chi",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Josh Hart",
    "team": "NY",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "Harrison Barnes",
    "team": "SA",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Jamal Murray",
    "team": "Den",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Duncan Robinson",
    "team": "Mia",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Dillon Brooks",
    "team": "Hou",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jrue Holiday",
    "team": "Bos",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jerami Grant",
    "team": "Por",
    "pos": "PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Cam Thomas",
    "team": "Bkn",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Jarrett Allen",
    "team": "Cle",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Clint Capela",
    "team": "Atl",
    "pos": "C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "James Harden",
    "team": "LAC",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Corey Kispert",
    "team": "Wsh",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "De'Andre Hunter",
    "team": "Cle",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Aaron Nesmith",
    "team": "Ind",
    "pos": "SF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Ty Jerome",
    "team": "Cle",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Johnny Juzang",
    "team": "Utah",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Isaiah Joe",
    "team": "OKC",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Dalano Banton",
    "team": "Por",
    "pos": "PG, SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Brandon Ingram",
    "team": "Tor",
    "pos": "SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Rui Hachimura",
    "team": "LAL",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": false
   }
  ],
  "9": [
   {
    "slot": "PG",
    "name": "Grayson Allen",
    "team": "Phx",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Cason Wallace",
    "team": "OKC",
    "pos": "SG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Royce O'Neale",
    "team": "Phx",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Michael Porter Jr.",
    "team": "Den",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Luke Kornet",
    "team": "Bos",
    "pos": "C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Donovan Mitchell",
    "team": "Cle",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "KJ Martin",
    "team": "Utah",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Damian Lillard",
    "team": "Mil",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Tyrese Maxey",
    "team": "Phi",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Lauri Markkanen",
    "team": "Utah",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Marcus Smart",
    "team": "Wsh",
    "pos": "SG, PG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Buddy Hield",
    "team": "GS",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jaime Jaquez Jr.",
    "team": "Mia",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kentavious Caldwell-Pope",
    "team": "Orl",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Lonzo Ball",
    "team": "Chi",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Obi Toppin",
    "team": "Ind",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Day'Ron Sharpe",
    "team": "Bkn",
    "pos": "C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Gradey Dick",
    "team": "Tor",
    "pos": "SG, SF",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Matas Buzelis",
    "team": "Chi",
    "pos": "SF, PF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Khris Middleton",
    "team": "Wsh",
    "pos": "SF",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Mouhamed Gueye",
    "team": "Atl",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Terance Mann",
    "team": "Atl",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kevon Looney",
    "team": "GS",
    "pos": "C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "P.J. Washington",
    "team": "Dal",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Moritz Wagner",
    "team": "Orl",
    "pos": "C",
    "acq": "Free Agency",
    "inj": true
   }
  ],
  "10": [
   {
    "slot": "PG",
    "name": "Scoot Henderson",
    "team": "Por",
    "pos": "PG",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "SG",
    "name": "Cody Williams",
    "team": "Utah",
    "pos": "SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "SF",
    "name": "Ronald Holland II",
    "team": "Det",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Tidjane Salaun",
    "team": "Cha",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Kel'el Ware",
    "team": "Mia",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Desmond Bane",
    "team": "Mem",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "Devin Vassell",
    "team": "SA",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Franz Wagner",
    "team": "Orl",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "OG Anunoby",
    "team": "NY",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Victor Wembanyama",
    "team": "SA",
    "pos": "C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Daniel Gafford",
    "team": "Dal",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jaden Ivey",
    "team": "Det",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Alex Sarr",
    "team": "Wsh",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Rob Dillingham",
    "team": "Min",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Noah Clowney",
    "team": "Bkn",
    "pos": "PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Cole Anthony",
    "team": "Orl",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Ryan Dunn",
    "team": "Phx",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Justin Champagnie",
    "team": "Wsh",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Max Christie",
    "team": "Dal",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Trey Lyles",
    "team": "Sac",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Moses Moody",
    "team": "GS",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Jared McCain",
    "team": "Phi",
    "pos": "SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Kobe Bufkin",
    "team": "Atl",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": true
   }
  ],
  "11": [
   {
    "slot": "PG",
    "name": "Miles McBride",
    "team": "NY",
    "pos": "PG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Anfernee Simons",
    "team": "Por",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "SF",
    "name": "Jayson Tatum",
    "team": "Bos",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "PF",
    "name": "Ben Simmons",
    "team": "LAC",
    "pos": "PG, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Walker Kessler",
    "team": "Utah",
    "pos": "C",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "G/F",
    "name": "Darius Garland",
    "team": "Cle",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "F/C",
    "name": "Mason Plumlee",
    "team": "Phx",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Devin Booker",
    "team": "Phx",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Anthony Black",
    "team": "Orl",
    "pos": "PG, SG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Ben Sheppard",
    "team": "Ind",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Simone Fontecchio",
    "team": "Det",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Zaccharie Risacher",
    "team": "Atl",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Brandon Miller",
    "team": "Cha",
    "pos": "SF, SG",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Jalen Wilson",
    "team": "Bkn",
    "pos": "PF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Gary Trent Jr.",
    "team": "Mil",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Patrick Williams",
    "team": "Chi",
    "pos": "PF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Justin Edwards",
    "team": "Phi",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Bogdan Bogdanovic",
    "team": "LAC",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Vince Williams Jr.",
    "team": "Mem",
    "pos": "SG, PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kevin Porter Jr.",
    "team": "Mil",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Karlo Matkovic",
    "team": "NO",
    "pos": "PF",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Herbert Jones",
    "team": "NO",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Isaiah Jackson",
    "team": "Ind",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": true
   }
  ],
  "6": [
   {
    "slot": "PG",
    "name": "Keyonte George",
    "team": "Utah",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Quentin Grimes",
    "team": "Phi",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Toumani Camara",
    "team": "Por",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Guerschon Yabusele",
    "team": "Phi",
    "pos": "PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "C",
    "name": "Naz Reid",
    "team": "Min",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Kyle Filipowski",
    "team": "Utah",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "Josh Green",
    "team": "Cha",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Tyler Smith",
    "team": "Mil",
    "pos": "SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Lonnie Walker IV",
    "team": "Phi",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Dariq Whitehead",
    "team": "Bkn",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Dereck Lively II",
    "team": "Dal",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Keldon Johnson",
    "team": "SA",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jake LaRavia",
    "team": "Sac",
    "pos": "PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Bobby Portis",
    "team": "Mil",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Malaki Branham",
    "team": "SA",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Tyrese Haliburton",
    "team": "Ind",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "MarJon Beauchamp",
    "team": "NY",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Davion Mitchell",
    "team": "Mia",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Tristan Vukcevic",
    "team": "Wsh",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jay Huff",
    "team": "Mem",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Keegan Murray",
    "team": "Sac",
    "pos": "PF, SF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jaylen Wells",
    "team": "Mem",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Brandon Boston",
    "team": "NO",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Paolo Banchero",
    "team": "Orl",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Bruce Brown",
    "team": "NO",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": true
   }
  ],
  "8": [
   {
    "slot": "PG",
    "name": "Alex Caruso",
    "team": "OKC",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Nickeil Alexander-Walker",
    "team": "Min",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Deni Avdija",
    "team": "Por",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "PF",
    "name": "Chet Holmgren",
    "team": "OKC",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Isaiah Hartenstein",
    "team": "OKC",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Jose Alvarado",
    "team": "NO",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "Yves Missi",
    "team": "NO",
    "pos": "C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Domantas Sabonis",
    "team": "Sac",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Zach Edey",
    "team": "Mem",
    "pos": "C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Bones Hyland",
    "team": "Min",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Fred VanVleet",
    "team": "Hou",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Luka Doncic",
    "team": "LAL",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Bam Adebayo",
    "team": "Mia",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Nic Claxton",
    "team": "Bkn",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Robert Williams III",
    "team": "Por",
    "pos": "C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Tre Jones",
    "team": "Chi",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Kyle Anderson",
    "team": "Mia",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jarred Vanderbilt",
    "team": "LAL",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Isaiah Stewart",
    "team": "Det",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Larry Nance Jr.",
    "team": "Atl",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Ja'Kobe Walter",
    "team": "Tor",
    "pos": "SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Tari Eason",
    "team": "Hou",
    "pos": "SF, PF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Grant Williams",
    "team": "Cha",
    "pos": "PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Josh Okogie",
    "team": "Cha",
    "pos": "SF, SG",
    "acq": "Free Agency",
    "inj": false
   }
  ]
 }
};
