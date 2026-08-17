// ============================================================
//  SAISON-ARCHIV 2025/26 — Rosterstand + finale Bilanzen
// ============================================================
//  Quelle: ESPN-Liga-Export als Excel-Datei, von Beyaz bereitgestellt.
//  Programmatisch aus der Tabellenstruktur extrahiert, nicht von Hand
//  abgetippt. Jeder Spielername gegen die Repo-Spielerdatenbank
//  validiert (364 Spieler, 0 Abweichungen). Alle Bilanzen decken
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

const SEASON_2025_26 = {
 "label": "Saison 2025/26",
 "standings": [
  {
   "place": 1,
   "name": "Fighting Illini",
   "teamId": 1,
   "record": "112-41-0",
   "rosterKey": "1"
  },
  {
   "place": 2,
   "name": "Seagulls",
   "teamId": 2,
   "record": "99-53-1",
   "rosterKey": "2"
  },
  {
   "place": 3,
   "name": "Neukoelln Hustlers",
   "teamId": 3,
   "record": "95-57-1",
   "rosterKey": "3"
  },
  {
   "place": 4,
   "name": "Leaveland Cavaliers",
   "teamId": 4,
   "record": "87-65-1",
   "rosterKey": "4"
  },
  {
   "place": 5,
   "name": "Anadolu Ballers",
   "teamId": 5,
   "record": "82-68-3",
   "rosterKey": "5"
  },
  {
   "place": 6,
   "name": "3-POINT MAFIA",
   "teamId": 6,
   "record": "77-74-2",
   "rosterKey": "6"
  },
  {
   "place": 7,
   "name": "Always Money in the BananaStand",
   "teamId": 7,
   "record": "70-75-8",
   "rosterKey": "7"
  },
  {
   "place": 8,
   "name": "Kawhi So Serious",
   "teamId": 8,
   "record": "73-78-2",
   "rosterKey": "8"
  },
  {
   "place": 9,
   "name": "Cooking Show",
   "teamId": 9,
   "record": "65-85-3",
   "rosterKey": "9"
  },
  {
   "place": 10,
   "name": "S-Town Grizzlies",
   "teamId": 10,
   "record": "62-89-2",
   "rosterKey": "10"
  },
  {
   "place": 11,
   "name": "Double Dribble Trouble",
   "teamId": 11,
   "record": "45-107-1",
   "rosterKey": "11"
  },
  {
   "place": 12,
   "name": "Vancouver Curry-Wurst",
   "teamId": 12,
   "record": "39-114-0",
   "rosterKey": "12"
  }
 ],
 "rosters": {
  "1": [
   {
    "slot": "PG",
    "name": "Cade Cunningham",
    "team": "Det",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Anthony Edwards",
    "team": "Min",
    "pos": "SG, SF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Cooper Flagg",
    "team": "Dal",
    "pos": "SF, PG, PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "PF",
    "name": "Ausar Thompson",
    "team": "Det",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Evan Mobley",
    "team": "Cle",
    "pos": "PF, C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Tyrese Maxey",
    "team": "Phi",
    "pos": "PG, SG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "Omer Yurtseven",
    "team": "GS",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Kawhi Leonard",
    "team": "LAC",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "VJ Edgecombe",
    "team": "Phi",
    "pos": "SG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Jalen Duren",
    "team": "Det",
    "pos": "C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Neemias Queta",
    "team": "Bos",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Dyson Daniels",
    "team": "Atl",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "LaMelo Ball",
    "team": "Cha",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Trae Young",
    "team": "Wsh",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Zion Williamson",
    "team": "NO",
    "pos": "PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Jalen Johnson",
    "team": "Atl",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jordan Poole",
    "team": "NO",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Amen Thompson",
    "team": "Hou",
    "pos": "SF, SG, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Josh Giddey",
    "team": "Chi",
    "pos": "SG, PG, SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Alperen Sengun",
    "team": "Hou",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Matas Buzelis",
    "team": "Chi",
    "pos": "SF, PF",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Reed Sheppard",
    "team": "Hou",
    "pos": "SG, PG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Dejounte Murray",
    "team": "NO",
    "pos": "SG, PG",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Taylor Hendricks",
    "team": "Mem",
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
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Desmond Bane",
    "team": "Orl",
    "pos": "SG, SF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Nick Richards",
    "team": "Chi",
    "pos": "C",
    "acq": "Free Agency",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Julian Reese",
    "team": "Wsh",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kobe Brown",
    "team": "Ind",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Day'Ron Sharpe",
    "team": "Bkn",
    "pos": "C",
    "acq": "Trade",
    "inj": true
   }
  ],
  "2": [
   {
    "slot": "PG",
    "name": "Tyler Herro",
    "team": "Mia",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "SG",
    "name": "Ryan Rollins",
    "team": "Mil",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "SF",
    "name": "Jaylen Brown",
    "team": "Bos",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Peyton Watson",
    "team": "Den",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "C",
    "name": "Onyeka Okongwu",
    "team": "Atl",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Jabari Smith Jr.",
    "team": "Hou",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "Derik Queen",
    "team": "NO",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Jaden McDaniels",
    "team": "Min",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Jaren Jackson Jr.",
    "team": "Utah",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Kon Knueppel",
    "team": "Cha",
    "pos": "SG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Sion James",
    "team": "Cha",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
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
    "name": "Aaron Gordon",
    "team": "Den",
    "pos": "PF",
    "acq": "Draft",
    "inj": true
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
    "name": "Collin Gillespie",
    "team": "Phx",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Cam Spencer",
    "team": "Mem",
    "pos": "SG, PG",
    "acq": "Free Agency",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Moritz Wagner",
    "team": "Orl",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jaime Jaquez Jr.",
    "team": "Mia",
    "pos": "SF, SG",
    "acq": "Trade",
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
    "name": "Tyler Kolek",
    "team": "NY",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Daniss Jenkins",
    "team": "Det",
    "pos": "PG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Dylan Cardwell",
    "team": "Sac",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Tristan Vukcevic",
    "team": "Wsh",
    "pos": "PF, C",
    "acq": "Free Agency",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Javon Small",
    "team": "Mem",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kobe Sanders",
    "team": "LAC",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Bradley Beal",
    "team": "LAC",
    "pos": "SF, SG",
    "acq": "Free Agency",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Justin Edwards",
    "team": "Phi",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Leonard Miller",
    "team": "Chi",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Collin Murray-Boyles",
    "team": "Tor",
    "pos": "PF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Kyle Kuzma",
    "team": "Mil",
    "pos": "PF, SF",
    "acq": "Draft",
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
    "name": "Aaron Wiggins",
    "team": "OKC",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Luguentz Dort",
    "team": "OKC",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Dean Wade",
    "team": "Cle",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Micah Potter",
    "team": "Ind",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Brandin Podziemski",
    "team": "GS",
    "pos": "SG, PG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "RJ Barrett",
    "team": "Tor",
    "pos": "SF, SG, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Scottie Barnes",
    "team": "Tor",
    "pos": "SF, SG, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Vit Krejci",
    "team": "Por",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Andrew Nembhard",
    "team": "Ind",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Paul George",
    "team": "Phi",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Klay Thompson",
    "team": "Dal",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Julian Champagnie",
    "team": "SA",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Ochai Agbaji",
    "team": "Bkn",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Ziaire Williams",
    "team": "Bkn",
    "pos": "SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Deandre Ayton",
    "team": "LAL",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Nikola Vucevic",
    "team": "Bos",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jonas Valanciunas",
    "team": "Den",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "De'Aaron Fox",
    "team": "SA",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kristaps Porzingis",
    "team": "GS",
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
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Kevin Durant",
    "team": "Hou",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Khris Middleton",
    "team": "Dal",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jalen Pickett",
    "team": "Den",
    "pos": "SG, PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jordan Miller",
    "team": "LAC",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Paolo Banchero",
    "team": "Orl",
    "pos": "PF, SF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Baylor Scheierman",
    "team": "Bos",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Pat Spencer",
    "team": "GS",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Guerschon Yabusele",
    "team": "Chi",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Max Strus",
    "team": "Cle",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Jordan Goodwin",
    "team": "Phx",
    "pos": "PG, SG",
    "acq": "Free Agency",
    "inj": true
   }
  ],
  "4": [
   {
    "slot": "PG",
    "name": "James Harden",
    "team": "Cle",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Josh Hart",
    "team": "NY",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Brandon Ingram",
    "team": "Tor",
    "pos": "SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "PF",
    "name": "Jerami Grant",
    "team": "Por",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Donovan Clingan",
    "team": "Por",
    "pos": "C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Jrue Holiday",
    "team": "Por",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "Cam Thomas",
    "team": "FA",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Dennis Schroder",
    "team": "Cle",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Duncan Robinson",
    "team": "Det",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Svi Mykhailiuk",
    "team": "Utah",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Cedric Coward",
    "team": "Mem",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Danny Wolf",
    "team": "Bkn",
    "pos": "PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Yanic Konan Niederhauser",
    "team": "LAC",
    "pos": "C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Mouhamed Gueye",
    "team": "Atl",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Ty Jerome",
    "team": "Mem",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "De'Andre Hunter",
    "team": "Sac",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Jamal Murray",
    "team": "Den",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Corey Kispert",
    "team": "Atl",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Zach LaVine",
    "team": "Sac",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Christian Braun",
    "team": "Den",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Harrison Barnes",
    "team": "SA",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Aaron Nesmith",
    "team": "Ind",
    "pos": "SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Clint Capela",
    "team": "Hou",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Julius Randle",
    "team": "Min",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jalen Smith",
    "team": "Chi",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Rui Hachimura",
    "team": "LAL",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": false
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
    "name": "Jamal Shead",
    "team": "Tor",
    "pos": "PG",
    "acq": "Trade",
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
    "slot": "IR",
    "name": "Keegan Murray",
    "team": "Sac",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Dillon Brooks",
    "team": "Phx",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   }
  ],
  "5": [
   {
    "slot": "PG",
    "name": "Ajay Mitchell",
    "team": "OKC",
    "pos": "PG",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "SG",
    "name": "AJ Green",
    "team": "Mil",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Kyle Anderson",
    "team": "Min",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Pascal Siakam",
    "team": "Ind",
    "pos": "PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "C",
    "name": "Jaylin Williams",
    "team": "OKC",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Russell Westbrook",
    "team": "Sac",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "F/C",
    "name": "Precious Achiuwa",
    "team": "Sac",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Jakob Poeltl",
    "team": "Tor",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Caris LeVert",
    "team": "Det",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Nikola Jokic",
    "team": "Den",
    "pos": "C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Goga Bitadze",
    "team": "Orl",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Saddiq Bey",
    "team": "NO",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Ousmane Dieng",
    "team": "Mil",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kelly Olynyk",
    "team": "SA",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Terance Mann",
    "team": "Bkn",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Caleb Martin",
    "team": "Dal",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": true
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
    "name": "Jalen Green",
    "team": "Phx",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Andrew Wiggins",
    "team": "Mia",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Joel Embiid",
    "team": "Phi",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Malik Beasley",
    "team": "FA",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Bennedict Mathurin",
    "team": "LAC",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Sam Hauser",
    "team": "Bos",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Payton Pritchard",
    "team": "Bos",
    "pos": "PG",
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
    "name": "Bilal Coulibaly",
    "team": "Wsh",
    "pos": "SF, SG",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Dru Smith",
    "team": "Mia",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": true
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
    "slot": "IR",
    "name": "Zach Collins",
    "team": "Chi",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Kyrie Irving",
    "team": "Dal",
    "pos": "PG, SG",
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
    "inj": true
   },
   {
    "slot": "SG",
    "name": "Donte DiVincenzo",
    "team": "Min",
    "pos": "SG, PG",
    "acq": "Trade",
    "inj": true
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
    "name": "Naz Reid",
    "team": "Min",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Jay Huff",
    "team": "Ind",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Kyle Filipowski",
    "team": "Utah",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "F/C",
    "name": "Bobby Portis",
    "team": "Mil",
    "pos": "PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Isaiah Joe",
    "team": "OKC",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Quentin Grimes",
    "team": "Phi",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Jarace Walker",
    "team": "Ind",
    "pos": "PF",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Tre Johnson",
    "team": "Wsh",
    "pos": "SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Walter Clayton Jr.",
    "team": "Mem",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Isaac Okoro",
    "team": "Chi",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Jake LaRavia",
    "team": "LAL",
    "pos": "PF",
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
    "name": "Davion Mitchell",
    "team": "Mia",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Shaedon Sharpe",
    "team": "Por",
    "pos": "SG, SF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Tristan da Silva",
    "team": "Orl",
    "pos": "SF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "GG Jackson",
    "team": "Mem",
    "pos": "PF",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Pelle Larsson",
    "team": "Mia",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Cam Whitmore",
    "team": "Wsh",
    "pos": "SF",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Sidy Cissoko",
    "team": "Por",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Gui Santos",
    "team": "GS",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Victor Wembanyama",
    "team": "SA",
    "pos": "C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Olivier-Maxence Prosper",
    "team": "Mem",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Karlo Matkovic",
    "team": "NO",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Rasheer Fleming",
    "team": "Phx",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kennedy Chandler",
    "team": "Utah",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Moussa Diabate",
    "team": "Cha",
    "pos": "PF, C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Thomas Sorber",
    "team": "OKC",
    "pos": "C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Dereck Lively II",
    "team": "Dal",
    "pos": "C",
    "acq": "Draft",
    "inj": true
   }
  ],
  "7": [
   {
    "slot": "PG",
    "name": "Jalen Brunson",
    "team": "NY",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Mikal Bridges",
    "team": "NY",
    "pos": "SF, SG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Kelly Oubre Jr.",
    "team": "Phi",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Karl-Anthony Towns",
    "team": "NY",
    "pos": "C, PF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Myles Turner",
    "team": "Mil",
    "pos": "C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "G/F",
    "name": "Derrick White",
    "team": "Bos",
    "pos": "SG, PG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "Rudy Gobert",
    "team": "Min",
    "pos": "C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Stephon Castle",
    "team": "SA",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Kevin Huerter",
    "team": "Det",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Keon Ellis",
    "team": "Cle",
    "pos": "SG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Dorian Finney-Smith",
    "team": "Hou",
    "pos": "PF, SF",
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
    "name": "Andre Drummond",
    "team": "Phi",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Wendell Carter Jr.",
    "team": "Orl",
    "pos": "C",
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
    "name": "Tobias Harris",
    "team": "Det",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Naji Marshall",
    "team": "Dal",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Miles Bridges",
    "team": "Cha",
    "pos": "SF, PF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Robert Williams III",
    "team": "Por",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Derrick Jones Jr.",
    "team": "LAC",
    "pos": "SF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Brice Sensabaugh",
    "team": "Utah",
    "pos": "SF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Grayson Allen",
    "team": "Phx",
    "pos": "SG, PG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jericho Sims",
    "team": "Mil",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Quenton Jackson",
    "team": "Ind",
    "pos": "PG, SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Sharife Cooper",
    "team": "Wsh",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "John Konchar",
    "team": "Utah",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jalen Suggs",
    "team": "Orl",
    "pos": "PG, SG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Ivica Zubac",
    "team": "Ind",
    "pos": "C",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Anthony Davis",
    "team": "Wsh",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": true
   }
  ],
  "8": [
   {
    "slot": "PG",
    "name": "Luka Doncic",
    "team": "LAL",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "SG",
    "name": "Jaylon Tyson",
    "team": "Cle",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Tari Eason",
    "team": "Hou",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Bam Adebayo",
    "team": "Mia",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "C",
    "name": "Mitchell Robinson",
    "team": "NY",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Jose Alvarado",
    "team": "NY",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "Royce O'Neale",
    "team": "Phx",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Dylan Harper",
    "team": "SA",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Yves Missi",
    "team": "NO",
    "pos": "C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Isaiah Stewart",
    "team": "Det",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "De'Anthony Melton",
    "team": "GS",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jaylen Wells",
    "team": "Mem",
    "pos": "SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Tre Mann",
    "team": "Cha",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jonathan Isaac",
    "team": "Orl",
    "pos": "PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Xavier Tillman",
    "team": "Cha",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Aaron Holiday",
    "team": "Hou",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Tim Hardaway Jr.",
    "team": "Den",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Cody Martin",
    "team": "Ind",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Alex Caruso",
    "team": "OKC",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Nickeil Alexander-Walker",
    "team": "Atl",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Domantas Sabonis",
    "team": "Sac",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Nic Claxton",
    "team": "Bkn",
    "pos": "C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Zach Edey",
    "team": "Mem",
    "pos": "C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Isaiah Hartenstein",
    "team": "OKC",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Larry Nance Jr.",
    "team": "Cle",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Deni Avdija",
    "team": "Por",
    "pos": "SF, SG, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Chet Holmgren",
    "team": "OKC",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Devin Carter",
    "team": "Sac",
    "pos": "PG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Fred VanVleet",
    "team": "Hou",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Kris Murray",
    "team": "Por",
    "pos": "PF",
    "acq": "Trade",
    "inj": false
   }
  ],
  "9": [
   {
    "slot": "PG",
    "name": "Tre Jones",
    "team": "Chi",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Cason Wallace",
    "team": "OKC",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Ronald Holland II",
    "team": "Det",
    "pos": "SF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Cameron Johnson",
    "team": "Den",
    "pos": "SF, PF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Luke Kornet",
    "team": "SA",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Kris Dunn",
    "team": "LAC",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "Obi Toppin",
    "team": "Ind",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "P.J. Washington",
    "team": "Dal",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Marcus Smart",
    "team": "LAL",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Luka Garza",
    "team": "Bos",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Khaman Maluach",
    "team": "Phx",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Moses Moody",
    "team": "GS",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Bones Hyland",
    "team": "Min",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kevon Looney",
    "team": "NO",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Gradey Dick",
    "team": "Tor",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Lauri Markkanen",
    "team": "Utah",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Kentavious Caldwell-Pope",
    "team": "Mem",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Donovan Mitchell",
    "team": "Cle",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Devin Booker",
    "team": "Phx",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Lonzo Ball",
    "team": "FA",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Buddy Hield",
    "team": "Atl",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Nikola Topic",
    "team": "OKC",
    "pos": "PG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Julian Strawther",
    "team": "Den",
    "pos": "SF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Caleb Love",
    "team": "Por",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jeremy Sochan",
    "team": "NY",
    "pos": "PF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jonathan Kuminga",
    "team": "Atl",
    "pos": "PF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Tidjane Salaun",
    "team": "Cha",
    "pos": "PF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Devin Vassell",
    "team": "SA",
    "pos": "SG, SF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Michael Porter Jr.",
    "team": "Bkn",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Damian Lillard",
    "team": "Por",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   }
  ],
  "10": [
   {
    "slot": "PG",
    "name": "Immanuel Quickley",
    "team": "Tor",
    "pos": "PG, SG",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "SG",
    "name": "Jared McCain",
    "team": "OKC",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Kyshawn George",
    "team": "Wsh",
    "pos": "SG, SF",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "PF",
    "name": "Ace Bailey",
    "team": "Utah",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Daniel Gafford",
    "team": "Dal",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "OG Anunoby",
    "team": "NY",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "Maxime Raynaud",
    "team": "Sac",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Max Christie",
    "team": "Dal",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Ja'Kobe Walter",
    "team": "Tor",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Cody Williams",
    "team": "Utah",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jeremiah Fears",
    "team": "NO",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Carter Bryant",
    "team": "SA",
    "pos": "SF",
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
    "name": "Scoot Henderson",
    "team": "Por",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Rob Dillingham",
    "team": "Chi",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Alex Sarr",
    "team": "Wsh",
    "pos": "C",
    "acq": "Draft",
    "inj": true
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
    "name": "Franz Wagner",
    "team": "Orl",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Will Riley",
    "team": "Wsh",
    "pos": "SF, SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Oso Ighodaro",
    "team": "Phx",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Drake Powell",
    "team": "Bkn",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kel'el Ware",
    "team": "Mia",
    "pos": "C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Mark Williams",
    "team": "Phx",
    "pos": "C",
    "acq": "Trade",
    "inj": true
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
    "name": "Jalen Williams",
    "team": "OKC",
    "pos": "PF, SF, C",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Dariq Whitehead",
    "team": "Mem",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jusuf Nurkic",
    "team": "Utah",
    "pos": "C",
    "acq": "Free Agency",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Kasparas Jakucionis",
    "team": "Mia",
    "pos": "PG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jalen Slawson",
    "team": "Ind",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Jaden Ivey",
    "team": "FA",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true
   }
  ],
  "11": [
   {
    "slot": "PG",
    "name": "Anthony Black",
    "team": "Orl",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Kevin Porter Jr.",
    "team": "Mil",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "SF",
    "name": "Zaccharie Risacher",
    "team": "Atl",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Paul Reed",
    "team": "Det",
    "pos": "C, PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Isaiah Jackson",
    "team": "LAC",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Craig Porter Jr.",
    "team": "Cle",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "Herbert Jones",
    "team": "NO",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Asa Newell",
    "team": "Atl",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Ben Sheppard",
    "team": "Ind",
    "pos": "SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Brandon Williams",
    "team": "Dal",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Joan Beringer",
    "team": "Min",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jase Richardson",
    "team": "Orl",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Nolan Traore",
    "team": "Bkn",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Noah Penda",
    "team": "Orl",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Koby Brea",
    "team": "Phx",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Giannis Antetokounmpo",
    "team": "Mil",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Miles McBride",
    "team": "NY",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Anfernee Simons",
    "team": "Chi",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Vince Williams Jr.",
    "team": "FA",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Darius Garland",
    "team": "LAC",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Patrick Williams",
    "team": "Chi",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Brandon Miller",
    "team": "Cha",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Jalen Wilson",
    "team": "Bkn",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Isaiah Collier",
    "team": "Utah",
    "pos": "PG",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Trayce Jackson-Davis",
    "team": "Tor",
    "pos": "PF, C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Sandro Mamukelashvili",
    "team": "Tor",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Cole Anthony",
    "team": "FA",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Stephen Curry",
    "team": "GS",
    "pos": "PG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "LeBron James",
    "team": "LAL",
    "pos": "SF, PF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Walker Kessler",
    "team": "Utah",
    "pos": "C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Jayson Tatum",
    "team": "Bos",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": true
   }
  ],
  "12": [
   {
    "slot": "PG",
    "name": "Ryan Nembhard",
    "team": "Dal",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Terrence Shannon Jr.",
    "team": "Min",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "DeMar DeRozan",
    "team": "Sac",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "PF",
    "name": "Trendon Watford",
    "team": "Phi",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Yang Hansen",
    "team": "Por",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G/F",
    "name": "Nique Clifford",
    "team": "Sac",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F/C",
    "name": "Al Horford",
    "team": "GS",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Will Richard",
    "team": "GS",
    "pos": "SG, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "T.J. McConnell",
    "team": "Ind",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "UTIL",
    "name": "Quinten Post",
    "team": "GS",
    "pos": "C",
    "acq": "Free Agency",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Egor Demin",
    "team": "Bkn",
    "pos": "PG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Bronny James",
    "team": "LAL",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Ben Saraf",
    "team": "Bkn",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Luke Kennard",
    "team": "LAL",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Johnny Furphy",
    "team": "Ind",
    "pos": "SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Dalton Knecht",
    "team": "LAL",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Norman Powell",
    "team": "Mia",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Brook Lopez",
    "team": "LAC",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "John Collins",
    "team": "LAC",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Collin Sexton",
    "team": "Chi",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Scotty Pippen Jr.",
    "team": "Mem",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "CJ McCollum",
    "team": "Atl",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Josh Minott",
    "team": "Bkn",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Coby White",
    "team": "Cha",
    "pos": "PG, SG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Ryan Kalkbrenner",
    "team": "Cha",
    "pos": "C",
    "acq": "Trade",
    "inj": false
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
    "name": "Jordan Walsh",
    "team": "Bos",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Noa Essengue",
    "team": "Chi",
    "pos": "PF",
    "acq": "Trade",
    "inj": true
   },
   {
    "slot": "Bench",
    "name": "Ayo Dosunmu",
    "team": "Min",
    "pos": "SG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Steven Adams",
    "team": "Hou",
    "pos": "C",
    "acq": "Draft",
    "inj": true
   },
   {
    "slot": "IR",
    "name": "Tyrese Haliburton",
    "team": "Ind",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": true
   }
  ]
 }
};
