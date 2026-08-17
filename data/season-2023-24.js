// ============================================================
//  SAISON-ARCHIV 2023/24 — Rosterstand + finale Bilanzen
// ============================================================
//  Quelle: ESPN-Liga-Export als Excel-Datei, von Beyaz bereitgestellt.
//  Programmatisch aus der Tabellenstruktur extrahiert, nicht von Hand
//  abgetippt. Jeder Spielername gegen die Repo-Spielerdatenbank
//  validiert (156 Spieler, 0 Abweichungen). Alle Bilanzen decken
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

const SEASON_2023_24 = {
 "label": "Saison 2023/24",
 "standings": [
  {
   "place": 1,
   "name": "Vancouver Curry-Wurst",
   "teamId": 12,
   "record": "99-62-1",
   "rosterKey": "12"
  },
  {
   "place": 2,
   "name": "Bear Down",
   "teamId": 1,
   "record": "102-59-1",
   "rosterKey": "1"
  },
  {
   "place": 3,
   "name": "Kawhi So Serious",
   "teamId": 8,
   "record": "95-64-3",
   "rosterKey": "8"
  },
  {
   "place": 4,
   "name": "Neukoelln Hustlers",
   "teamId": 3,
   "record": "97-64-1",
   "rosterKey": "3"
  },
  {
   "place": 5,
   "name": "Anadolu Ballers",
   "teamId": 5,
   "record": "77-82-3",
   "rosterKey": "5"
  },
  {
   "place": 6,
   "name": "Angry Ducks",
   "teamId": null,
   "record": "88-73-1",
   "rosterKey": "x_angry_ducks"
  },
  {
   "place": 7,
   "name": "Always Money in the BananaStand",
   "teamId": 7,
   "record": "84-76-2",
   "rosterKey": "7"
  },
  {
   "place": 8,
   "name": "Leaveland Cavaliers",
   "teamId": 4,
   "record": "81-78-3",
   "rosterKey": "4"
  },
  {
   "place": 9,
   "name": "S-Town Grizzlies",
   "teamId": 10,
   "record": "52-108-2",
   "rosterKey": "10"
  },
  {
   "place": 10,
   "name": "WebEmbiid",
   "teamId": null,
   "record": "57-104-1",
   "rosterKey": "x_webembiid"
  },
  {
   "place": 11,
   "name": "Cooking Show",
   "teamId": 9,
   "record": "76-84-2",
   "rosterKey": "9"
  },
  {
   "place": 12,
   "name": "Pats Pats",
   "teamId": null,
   "record": "53-107-2",
   "rosterKey": "x_pats_pats"
  }
 ],
 "rosters": {
  "12": [
   {
    "slot": "Bench",
    "name": "Stephen Curry",
    "team": "GS",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kawhi Leonard",
    "team": "LAC",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "Bench",
    "name": "DeMar DeRozan",
    "team": "Chi",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Tyler Herro",
    "team": "Mia",
    "pos": "SG, PG",
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
    "name": "Brook Lopez",
    "team": "Mil",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "John Collins",
    "team": "Utah",
    "pos": "PF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "Bench",
    "name": "CJ McCollum",
    "team": "NO",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "D'Angelo Russell",
    "team": "LAL",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Collin Sexton",
    "team": "Utah",
    "pos": "SG, PG",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "Bench",
    "name": "T.J. McConnell",
    "team": "Ind",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Mitchell Robinson",
    "team": "NY",
    "pos": "C",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "Bench",
    "name": "Malachi Flynn",
    "team": "Det",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   }
  ],
  "1": [
   {
    "slot": "PG",
    "name": "Cade Cunningham",
    "team": "Det",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "SG",
    "name": "Donovan Mitchell",
    "team": "Cle",
    "pos": "SG, PG",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "SF",
    "name": "Jalen Williams",
    "team": "OKC",
    "pos": "SG, SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Miles Bridges",
    "team": "Cha",
    "pos": "PF, SF",
    "acq": "Trade",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "UTIL",
    "name": "Naz Reid",
    "team": "Min",
    "pos": "C, PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Taylor Hendricks",
    "team": "Utah",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Darius Garland",
    "team": "Cle",
    "pos": "PG",
    "acq": "Trade",
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
    "name": "Mikal Bridges",
    "team": "Bkn",
    "pos": "SF, SG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Noah Clowney",
    "team": "Bkn",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Miles McBride",
    "team": "NY",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Ben Sheppard",
    "team": "Ind",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Alperen Sengun",
    "team": "Hou",
    "pos": "C",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "IR",
    "name": "Jalen Johnson",
    "team": "Atl",
    "pos": "SF, PF",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "DTD"
   }
  ],
  "8": [
   {
    "slot": "PG",
    "name": "Tre Jones",
    "team": "SA",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Alex Caruso",
    "team": "OKC",
    "pos": "PG, SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Bruce Brown",
    "team": "Tor",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Nic Claxton",
    "team": "Bkn",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Bam Adebayo",
    "team": "Mia",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Domantas Sabonis",
    "team": "Sac",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Luka Doncic",
    "team": "Dal",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Paul Reed",
    "team": "Phi",
    "pos": "PF, C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Anthony Davis",
    "team": "LAL",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Deni Avdija",
    "team": "Wsh",
    "pos": "SF, PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Fred VanVleet",
    "team": "Hou",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "IR",
    "name": "De'Anthony Melton",
    "team": "Phi",
    "pos": "PG, SG",
    "acq": "Free Agency",
    "inj": false
   }
  ],
  "3": [
   {
    "slot": "PG",
    "name": "Shai Gilgeous-Alexander",
    "team": "OKC",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Brandin Podziemski",
    "team": "GS",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "De'Andre Hunter",
    "team": "Atl",
    "pos": "SF, PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Kristaps Porzingis",
    "team": "Bos",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "C",
    "name": "Giannis Antetokounmpo",
    "team": "Mil",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Victor Wembanyama",
    "team": "SA",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "UTIL",
    "name": "RJ Barrett",
    "team": "Tor",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "UTIL",
    "name": "Gary Trent Jr.",
    "team": "Tor",
    "pos": "SG, PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "De'Aaron Fox",
    "team": "Sac",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Vince Williams Jr.",
    "team": "Mem",
    "pos": "SF, SG",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "Bench",
    "name": "Rui Hachimura",
    "team": "LAL",
    "pos": "PF, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Scottie Barnes",
    "team": "Tor",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "IR",
    "name": "Isaiah Stewart",
    "team": "Det",
    "pos": "C, PF",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "DTD"
   }
  ],
  "5": [
   {
    "slot": "PG",
    "name": "Bradley Beal",
    "team": "Phx",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Tyrese Haliburton",
    "team": "Ind",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "SF",
    "name": "Austin Reaves",
    "team": "LAL",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Zion Williamson",
    "team": "NO",
    "pos": "PF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "C",
    "name": "Pascal Siakam",
    "team": "Ind",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Bobby Portis",
    "team": "Mil",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Precious Achiuwa",
    "team": "NY",
    "pos": "PF, C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kevin Durant",
    "team": "Phx",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kyrie Irving",
    "team": "Dal",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Ayo Dosunmu",
    "team": "Chi",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Jakob Poeltl",
    "team": "Tor",
    "pos": "C",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "IR",
    "name": "Jalen Duren",
    "team": "Det",
    "pos": "C",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   }
  ],
  "x_angry_ducks": [
   {
    "slot": "PG",
    "name": "Jeremy Sochan",
    "team": "SA",
    "pos": "PF, PG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "SG",
    "name": "Anthony Edwards",
    "team": "Min",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Jayson Tatum",
    "team": "Bos",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Jaren Jackson Jr.",
    "team": "Mem",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "C",
    "name": "Jusuf Nurkic",
    "team": "Phx",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Chris Paul",
    "team": "GS",
    "pos": "PG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Andrew Wiggins",
    "team": "GS",
    "pos": "SF, PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Herbert Jones",
    "team": "NO",
    "pos": "PF, SF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jabari Smith Jr.",
    "team": "Hou",
    "pos": "PF, C",
    "acq": "Draft",
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
    "slot": "Bench",
    "name": "Anthony Black",
    "team": "Orl",
    "pos": "SG, PG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Cameron Johnson",
    "team": "Bkn",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "IR",
    "name": "Onyeka Okongwu",
    "team": "Atl",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   }
  ],
  "7": [
   {
    "slot": "PG",
    "name": "Jalen Brunson",
    "team": "NY",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "SG",
    "name": "Dejounte Murray",
    "team": "Atl",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Tobias Harris",
    "team": "Phi",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Draymond Green",
    "team": "GS",
    "pos": "PF, C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Myles Turner",
    "team": "Ind",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Tyus Jones",
    "team": "Wsh",
    "pos": "PG",
    "acq": "Trade",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "UTIL",
    "name": "Jalen Wilson",
    "team": "Bkn",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
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
    "name": "Donte DiVincenzo",
    "team": "NY",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Immanuel Quickley",
    "team": "Tor",
    "pos": "PG, SG",
    "acq": "Trade",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "Bench",
    "name": "Marcus Sasser",
    "team": "Det",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Ja Morant",
    "team": "Mem",
    "pos": "PG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "IR",
    "name": "LaMelo Ball",
    "team": "Cha",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   }
  ],
  "4": [
   {
    "slot": "PG",
    "name": "Derrick White",
    "team": "Bos",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Jrue Holiday",
    "team": "Bos",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Aaron Nesmith",
    "team": "Ind",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Jerami Grant",
    "team": "Por",
    "pos": "PF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "C",
    "name": "Clint Capela",
    "team": "Atl",
    "pos": "C",
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
    "name": "Cam Thomas",
    "team": "Bkn",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Josh Hart",
    "team": "NY",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jarrett Allen",
    "team": "Cle",
    "pos": "C",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "Bench",
    "name": "Brandon Ingram",
    "team": "NO",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Ziaire Williams",
    "team": "Mem",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "IR",
    "name": "Julius Randle",
    "team": "NY",
    "pos": "PF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "IR",
    "name": "Zach LaVine",
    "team": "Chi",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "DTD"
   }
  ],
  "10": [
   {
    "slot": "PG",
    "name": "Jaden Ivey",
    "team": "Det",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Devin Vassell",
    "team": "SA",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "SF",
    "name": "Franz Wagner",
    "team": "Orl",
    "pos": "SF, SG, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Chet Holmgren",
    "team": "OKC",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Ivica Zubac",
    "team": "LAC",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Wendell Carter Jr.",
    "team": "Orl",
    "pos": "C",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "UTIL",
    "name": "Terry Rozier",
    "team": "Mia",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "UTIL",
    "name": "Kentavious Caldwell-Pope",
    "team": "Den",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Desmond Bane",
    "team": "Mem",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "Bench",
    "name": "Josh Giddey",
    "team": "Chi",
    "pos": "PG, SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jonas Valanciunas",
    "team": "NO",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "OG Anunoby",
    "team": "NY",
    "pos": "SF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "IR",
    "name": "Bennedict Mathurin",
    "team": "Ind",
    "pos": "SF, SG",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "DTD"
   }
  ],
  "x_webembiid": [
   {
    "slot": "PG",
    "name": "Markelle Fultz",
    "team": "Orl",
    "pos": "PG, SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Devin Booker",
    "team": "Phx",
    "pos": "SG, PG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Jonathan Kuminga",
    "team": "GS",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Kelly Olynyk",
    "team": "Tor",
    "pos": "C, PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Paul George",
    "team": "LAC",
    "pos": "SF, SG, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Marvin Bagley III",
    "team": "Wsh",
    "pos": "PF, C",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "UTIL",
    "name": "Simone Fontecchio",
    "team": "Det",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "Bench",
    "name": "Karl-Anthony Towns",
    "team": "Min",
    "pos": "C, PF",
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
    "name": "Nikola Vucevic",
    "team": "Chi",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Russell Westbrook",
    "team": "LAC",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Trayce Jackson-Davis",
    "team": "GS",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Anfernee Simons",
    "team": "Por",
    "pos": "SG, PG",
    "acq": "Trade",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "IR",
    "name": "Lonzo Ball",
    "team": "Chi",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "DTD"
   }
  ],
  "9": [
   {
    "slot": "PG",
    "name": "Tyrese Maxey",
    "team": "Phi",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Buddy Hield",
    "team": "Phi",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Trey Murphy III",
    "team": "NO",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "P.J. Washington",
    "team": "Dal",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "James Harden",
    "team": "LAC",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Jalen Green",
    "team": "Hou",
    "pos": "SG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Jaime Jaquez Jr.",
    "team": "Mia",
    "pos": "SF",
    "acq": "Trade",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "Bench",
    "name": "Lauri Markkanen",
    "team": "Utah",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "Bench",
    "name": "Jaden Hardy",
    "team": "Dal",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Michael Porter Jr.",
    "team": "Den",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Bilal Coulibaly",
    "team": "Wsh",
    "pos": "SF, SG",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "IR",
    "name": "Mark Williams",
    "team": "Cha",
    "pos": "C",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "IR",
    "name": "Marcus Smart",
    "team": "Mem",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   }
  ],
  "x_pats_pats": [
   {
    "slot": "PG",
    "name": "Jordan Poole",
    "team": "Wsh",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "SG",
    "name": "Malik Beasley",
    "team": "Mil",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Bojan Bogdanovic",
    "team": "NY",
    "pos": "PF, SF",
    "acq": "Trade",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "PF",
    "name": "Paolo Banchero",
    "team": "Orl",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Goga Bitadze",
    "team": "Orl",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Keldon Johnson",
    "team": "SA",
    "pos": "SF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "UTIL",
    "name": "Dennis Schroder",
    "team": "Bkn",
    "pos": "PG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "UTIL",
    "name": "Nick Richards",
    "team": "Cha",
    "pos": "C",
    "acq": "Trade",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "Bench",
    "name": "Keegan Murray",
    "team": "Sac",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kyle Kuzma",
    "team": "Wsh",
    "pos": "PF, SF",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "Bench",
    "name": "Deandre Ayton",
    "team": "Por",
    "pos": "C",
    "acq": "Trade",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "IR",
    "name": "Jimmy Butler",
    "team": "Mia",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "IR",
    "name": "Shaedon Sharpe",
    "team": "Por",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   }
  ]
 }
};
