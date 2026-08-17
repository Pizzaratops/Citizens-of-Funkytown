// ============================================================
//  SAISON-ARCHIV 2022/23 — Rosterstand
// ============================================================
//  Quelle: ESPN-Liga-Export als Excel-Datei, von Beyaz bereitgestellt.
//  Programmatisch aus der Tabellenstruktur extrahiert, nicht von Hand
//  abgetippt. Jeder Spielername gegen die Repo-Spielerdatenbank
//  validiert (164 Spieler).
//  Alle 12 Bilanzen decken sich exakt mit der ESPN-Final-Standings-Tabelle.
//
//  "acq" = wie der Spieler zum Team kam (Draft/Trade/Free Agency).
//  "inj"/"injStatus" = trug zum Exportzeitpunkt ein Verletzungsicon
//  ('O' = Out, 'DTD' = Day-to-Day).
//
//  teamId = heutige Team-ID fuer Farbe/Owner/Klick-Ziel, oder null wenn
//  das Team heute nicht mehr existiert ODER die Umbenennungs-Kette zu
//  einem heutigen Team nicht zweifelsfrei rekonstruierbar war (siehe
//  Kommentar in js/navigation.js SEASON_REGISTRY-Bereich).
// ============================================================

const SEASON_2022_23 = {
 "label": "Saison 2022/23",
 "standings": [
  {
   "place": 1,
   "name": "Vancouver Curry-Wurst",
   "teamId": 12,
   "record": "105-72-3",
   "rosterKey": "12"
  },
  {
   "place": 2,
   "name": "Team Beermode",
   "teamId": null,
   "record": "107-71-2",
   "rosterKey": "x_team_beermode"
  },
  {
   "place": 3,
   "name": "Bear Down",
   "teamId": 1,
   "record": "96-82-2",
   "rosterKey": "1"
  },
  {
   "place": 4,
   "name": "Kawhi So Serious",
   "teamId": 8,
   "record": "95-83-2",
   "rosterKey": "8"
  },
  {
   "place": 5,
   "name": "Dreschvitz Beerdrinkers",
   "teamId": null,
   "record": "94-85-1",
   "rosterKey": "x_dreschvitz_beerdrinkers"
  },
  {
   "place": 6,
   "name": "Leaveland Cavaliers",
   "teamId": 4,
   "record": "86-92-2",
   "rosterKey": "4"
  },
  {
   "place": 7,
   "name": "Anadolu Ballers",
   "teamId": 5,
   "record": "87-90-3",
   "rosterKey": "5"
  },
  {
   "place": 8,
   "name": "Angry Ducks",
   "teamId": null,
   "record": "92-87-1",
   "rosterKey": "x_angry_ducks"
  },
  {
   "place": 9,
   "name": "S-Town Grizzlies",
   "teamId": 10,
   "record": "56-122-2",
   "rosterKey": "10"
  },
  {
   "place": 10,
   "name": "James LeBrontosaurus",
   "teamId": null,
   "record": "86-92-2",
   "rosterKey": "x_james_lebrontosaurus"
  },
  {
   "place": 11,
   "name": "Neukoelln Hustlers",
   "teamId": 3,
   "record": "82-95-3",
   "rosterKey": "3"
  },
  {
   "place": 12,
   "name": "Schweizer Taschenmesser",
   "teamId": null,
   "record": "81-96-3",
   "rosterKey": "x_schweizer_taschenmesser"
  }
 ],
 "rosters": {
  "12": [
   {
    "slot": "PG",
    "name": "Stephen Curry",
    "team": "GS",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "DeMar DeRozan",
    "team": "Chi",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "LeBron James",
    "team": "LAL",
    "pos": "SF, PG, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Draymond Green",
    "team": "GS",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "C",
    "name": "Rudy Gobert",
    "team": "Min",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G",
    "name": "Spencer Dinwiddie",
    "team": "Bkn",
    "pos": "SG, PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "F",
    "name": "Josh Hart",
    "team": "NY",
    "pos": "SG, SF",
    "acq": "Free Agency",
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
    "name": "Mitchell Robinson",
    "team": "NY",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Corey Kispert",
    "team": "Wsh",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kawhi Leonard",
    "team": "LAC",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
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
    "name": "Trey Murphy III",
    "team": "NO",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   }
  ],
  "x_team_beermode": [
   {
    "slot": "PG",
    "name": "James Harden",
    "team": "Phi",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Fred VanVleet",
    "team": "Tor",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Deni Avdija",
    "team": "Wsh",
    "pos": "SF, PF",
    "acq": "Free Agency",
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
    "name": "Xavier Tillman",
    "team": "Mem",
    "pos": "PF, C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "G",
    "name": "Tyrese Maxey",
    "team": "Phi",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F",
    "name": "Lauri Markkanen",
    "team": "Utah",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Brook Lopez",
    "team": "Mil",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Aaron Gordon",
    "team": "Den",
    "pos": "PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Marvin Bagley III",
    "team": "Det",
    "pos": "PF, C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Terry Rozier",
    "team": "Cha",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "Bench",
    "name": "Luke Kennard",
    "team": "Mem",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "Bench",
    "name": "Josh Richardson",
    "team": "NO",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Damian Lillard",
    "team": "Por",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   }
  ],
  "1": [
   {
    "slot": "PG",
    "name": "Donovan Mitchell",
    "team": "Cle",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Jalen Green",
    "team": "Hou",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Deandre Ayton",
    "team": "Phx",
    "pos": "C",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "G",
    "name": "Shaedon Sharpe",
    "team": "Por",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "F",
    "name": "Robert Williams III",
    "team": "Bos",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Nikola Vucevic",
    "team": "Chi",
    "pos": "C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Kevin Porter Jr.",
    "team": "Hou",
    "pos": "SG, PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Jrue Holiday",
    "team": "Mil",
    "pos": "PG, SG",
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
    "name": "Alperen Sengun",
    "team": "Hou",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Zach Collins",
    "team": "SA",
    "pos": "C",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "Bench",
    "name": "Jarrett Allen",
    "team": "Cle",
    "pos": "C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Austin Reaves",
    "team": "LAL",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Jalen Williams",
    "team": "OKC",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   }
  ],
  "8": [
   {
    "slot": "PG",
    "name": "Dejounte Murray",
    "team": "Atl",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Jalen Brunson",
    "team": "NY",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Jaden McDaniels",
    "team": "Min",
    "pos": "SF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "PF",
    "name": "Anthony Davis",
    "team": "LAL",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Nic Claxton",
    "team": "Bkn",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G",
    "name": "De'Anthony Melton",
    "team": "Phi",
    "pos": "PG, SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "F",
    "name": "Tari Eason",
    "team": "Hou",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Luka Doncic",
    "team": "Dal",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Bam Adebayo",
    "team": "Mia",
    "pos": "C, PF",
    "acq": "Draft",
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
    "name": "Domantas Sabonis",
    "team": "Sac",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
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
    "name": "Markelle Fultz",
    "team": "Orl",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   }
  ],
  "x_dreschvitz_beerdrinkers": [
   {
    "slot": "PG",
    "name": "Jordan Poole",
    "team": "GS",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Donte DiVincenzo",
    "team": "GS",
    "pos": "SG, PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Harrison Barnes",
    "team": "Sac",
    "pos": "SF, PF",
    "acq": "Free Agency",
    "inj": false
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
    "name": "Kelly Olynyk",
    "team": "Utah",
    "pos": "C, PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "G",
    "name": "Bogdan Bogdanovic",
    "team": "Atl",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "F",
    "name": "Keegan Murray",
    "team": "Sac",
    "pos": "PF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Mikal Bridges",
    "team": "Bkn",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Luguentz Dort",
    "team": "OKC",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Tre Jones",
    "team": "SA",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jimmy Butler",
    "team": "Mia",
    "pos": "SF, SG, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "CJ McCollum",
    "team": "NO",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "Bench",
    "name": "Kyle Lowry",
    "team": "Mia",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Keldon Johnson",
    "team": "SA",
    "pos": "SF, PF",
    "acq": "Trade",
    "inj": false
   }
  ],
  "4": [
   {
    "slot": "PG",
    "name": "Chris Paul",
    "team": "Phx",
    "pos": "PG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "SG",
    "name": "D'Angelo Russell",
    "team": "LAL",
    "pos": "PG, SG",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Cam Reddish",
    "team": "Por",
    "pos": "SF, SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Kyle Anderson",
    "team": "Min",
    "pos": "SF, PF",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "C",
    "name": "John Collins",
    "team": "Atl",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G",
    "name": "Ja Morant",
    "team": "Mem",
    "pos": "PG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "F",
    "name": "Zach LaVine",
    "team": "Chi",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Trae Young",
    "team": "Atl",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Mike Conley",
    "team": "Min",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "James Wiseman",
    "team": "Det",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
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
    "name": "Jusuf Nurkic",
    "team": "Por",
    "pos": "C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jordan Clarkson",
    "team": "Utah",
    "pos": "SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Kyle Kuzma",
    "team": "Wsh",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": false
   }
  ],
  "5": [
   {
    "slot": "PG",
    "name": "Kyrie Irving",
    "team": "Dal",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Tim Hardaway Jr.",
    "team": "Dal",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Caris LeVert",
    "team": "Cle",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Kevin Durant",
    "team": "Phx",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Pascal Siakam",
    "team": "Tor",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G",
    "name": "Dillon Brooks",
    "team": "Mem",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F",
    "name": "Christian Wood",
    "team": "Dal",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "RJ Barrett",
    "team": "NY",
    "pos": "SF, SG",
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
    "name": "Josh Okogie",
    "team": "Phx",
    "pos": "SG, SF",
    "acq": "Free Agency",
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
    "name": "Andrew Wiggins",
    "team": "GS",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Derrick White",
    "team": "Bos",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Zion Williamson",
    "team": "NO",
    "pos": "PF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   }
  ],
  "x_angry_ducks": [
   {
    "slot": "PG",
    "name": "Immanuel Quickley",
    "team": "NY",
    "pos": "PG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "SG",
    "name": "Jaylen Brown",
    "team": "Bos",
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
    "inj": false
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
    "slot": "G",
    "name": "Kelly Oubre Jr.",
    "team": "Cha",
    "pos": "PF, SG, SF",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "F",
    "name": "Anthony Edwards",
    "team": "Min",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "P.J. Washington",
    "team": "Cha",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
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
    "name": "Bones Hyland",
    "team": "LAC",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Darius Garland",
    "team": "Cle",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Monte Morris",
    "team": "Wsh",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jarred Vanderbilt",
    "team": "LAL",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Chris Duarte",
    "team": "Ind",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   }
  ],
  "10": [
   {
    "slot": "PG",
    "name": "Josh Giddey",
    "team": "OKC",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Desmond Bane",
    "team": "Mem",
    "pos": "SG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "SF",
    "name": "O.G. Anunoby",
    "team": "Tor",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Cameron Johnson",
    "team": "Bkn",
    "pos": "SF, PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Wendell Carter Jr.",
    "team": "Orl",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G",
    "name": "Kevin Huerter",
    "team": "Sac",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F",
    "name": "Bennedict Mathurin",
    "team": "Ind",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Devin Vassell",
    "team": "SA",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Jaden Ivey",
    "team": "Det",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "De'Andre Hunter",
    "team": "Atl",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Davion Mitchell",
    "team": "Sac",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Moritz Wagner",
    "team": "Orl",
    "pos": "C, PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jalen Smith",
    "team": "Ind",
    "pos": "PF, C",
    "acq": "Free Agency",
    "inj": false
   }
  ],
  "x_james_lebrontosaurus": [
   {
    "slot": "SG",
    "name": "Anfernee Simons",
    "team": "Por",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Gordon Hayward",
    "team": "Cha",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Julius Randle",
    "team": "NY",
    "pos": "PF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "C",
    "name": "Daniel Gafford",
    "team": "Wsh",
    "pos": "C, PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "G",
    "name": "Bradley Beal",
    "team": "Wsh",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F",
    "name": "Evan Mobley",
    "team": "Cle",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Jonas Valanciunas",
    "team": "NO",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Myles Turner",
    "team": "Ind",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Jonathan Isaac",
    "team": "Orl",
    "pos": "PF, SF",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "Bench",
    "name": "Russell Westbrook",
    "team": "LAC",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "LaMelo Ball",
    "team": "Cha",
    "pos": "PG",
    "acq": "Trade",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "Bench",
    "name": "Nick Richards",
    "team": "Cha",
    "pos": "C",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Miles Bridges",
    "team": "Cha",
    "pos": "PF, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Ben Simmons",
    "team": "Bkn",
    "pos": "PG, PF, C",
    "acq": "Trade",
    "inj": true,
    "injStatus": "O"
   }
  ],
  "3": [
   {
    "slot": "PG",
    "name": "De'Aaron Fox",
    "team": "Sac",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Malcolm Brogdon",
    "team": "Bos",
    "pos": "PG, SG",
    "acq": "Trade",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "SF",
    "name": "Kenyon Martin Jr.",
    "team": "Hou",
    "pos": "SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Kristaps Porzingis",
    "team": "Wsh",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Ivica Zubac",
    "team": "LAC",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G",
    "name": "Klay Thompson",
    "team": "GS",
    "pos": "SG, SF",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "F",
    "name": "Scottie Barnes",
    "team": "Tor",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": false
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
    "slot": "UTIL",
    "name": "Dennis Schroder",
    "team": "LAL",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Andrew Nembhard",
    "team": "Ind",
    "pos": "PG, SG",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Shai Gilgeous-Alexander",
    "team": "OKC",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Bruce Brown",
    "team": "Den",
    "pos": "SG, SF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Giannis Antetokounmpo",
    "team": "Mil",
    "pos": "PF, C",
    "acq": "Trade",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Lonzo Ball",
    "team": "Chi",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "O"
   }
  ],
  "x_schweizer_taschenmesser": [
   {
    "slot": "PG",
    "name": "Dennis Smith Jr.",
    "team": "Cha",
    "pos": "PG",
    "acq": "Free Agency",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "SG",
    "name": "Paul George",
    "team": "LAC",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "SF",
    "name": "Michael Porter Jr.",
    "team": "Den",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Royce O'Neale",
    "team": "Bkn",
    "pos": "SF, PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Bol Bol",
    "team": "Orl",
    "pos": "C, PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "G",
    "name": "Cole Anthony",
    "team": "Orl",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F",
    "name": "Jerami Grant",
    "team": "Por",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Joel Embiid",
    "team": "Phi",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Khris Middleton",
    "team": "Mil",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Devin Booker",
    "team": "Phx",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Buddy Hield",
    "team": "Ind",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Al Horford",
    "team": "Bos",
    "pos": "C, PF",
    "acq": "Free Agency",
    "inj": false
   },
   {
    "slot": "IR",
    "name": "Karl-Anthony Towns",
    "team": "Min",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   }
  ]
 }
};
