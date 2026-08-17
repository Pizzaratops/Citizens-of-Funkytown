// ============================================================
//  SAISON-ARCHIV 2021/22 — Rosterstand (Bilanzen groesstenteils nicht ueberliefert)
// ============================================================
//  Quelle: ESPN-Liga-Export als Excel-Datei, von Beyaz bereitgestellt.
//  Programmatisch aus der Tabellenstruktur extrahiert, nicht von Hand
//  abgetippt. Jeder Spielername gegen die Repo-Spielerdatenbank
//  validiert (129 Spieler).
//  WICHTIG: Die Saisonbilanzen sind bis auf Platz 1+2 NICHT ueberliefert
//  (ESPN-Export zeigte defekte Platzhalterwerte wie "0-0-153"). Nur
//  Champion (Bear Down) und Vizemeister (Team Beermode) sind von Beyaz
//  bestaetigt. Alle anderen Teams haben record:null und place:null --
//  bewusst nicht erraten oder mit Platzhaltern gefuellt. Die Reihenfolge
//  der uebrigen Teams in standings[] ist rein alphabetisch, OHNE
//  Aussage ueber die tatsaechliche Tabellenplatzierung.
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

const SEASON_2021_22 = {
 "label": "Saison 2021/22",
 "standings": [
  {
   "place": 1,
   "name": "Bear Down",
   "teamId": 1,
   "record": null,
   "rosterKey": "1"
  },
  {
   "place": 2,
   "name": "Team Beermode",
   "teamId": null,
   "record": null,
   "rosterKey": "x_team_beermode"
  },
  {
   "place": null,
   "name": "Angry Ducks",
   "teamId": null,
   "record": null,
   "rosterKey": "x_angry_ducks"
  },
  {
   "place": null,
   "name": "Crappy Chicken",
   "teamId": null,
   "record": null,
   "rosterKey": "x_crappy_chicken"
  },
  {
   "place": null,
   "name": "Devin Kurant",
   "teamId": null,
   "record": null,
   "rosterKey": "x_devin_kurant"
  },
  {
   "place": null,
   "name": "Dreschvitz Beerdrinkers",
   "teamId": null,
   "record": null,
   "rosterKey": "x_dreschvitz_beerdrinkers"
  },
  {
   "place": null,
   "name": "James LeBrontosaurus",
   "teamId": null,
   "record": null,
   "rosterKey": "x_james_lebrontosaurus"
  },
  {
   "place": null,
   "name": "Kawhi So Serious",
   "teamId": 8,
   "record": null,
   "rosterKey": "8"
  },
  {
   "place": null,
   "name": "Leaveland Cavaliers",
   "teamId": 4,
   "record": null,
   "rosterKey": "4"
  },
  {
   "place": null,
   "name": "New York Nix",
   "teamId": null,
   "record": null,
   "rosterKey": "x_new_york_nix"
  },
  {
   "place": null,
   "name": "Vancouver Curry-Wurst",
   "teamId": 12,
   "record": null,
   "rosterKey": "12"
  }
 ],
 "rosters": {
  "1": [
   {
    "slot": "PG",
    "name": "Donovan Mitchell",
    "team": "Utah",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Bruce Brown",
    "team": "Bkn",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Mikal Bridges",
    "team": "Phx",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Herbert Jones",
    "team": "NO",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Joel Embiid",
    "team": "Phi",
    "pos": "C",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "G",
    "name": "Mike Conley",
    "team": "Utah",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F",
    "name": "Robert Williams III",
    "team": "Bos",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "UTIL",
    "name": "Nikola Jokic",
    "team": "Den",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Zach LaVine",
    "team": "Chi",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "UTIL",
    "name": "Lonzo Ball",
    "team": "Chi",
    "pos": "PG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "Bench",
    "name": "Drew Eubanks",
    "team": "Por",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Michael Porter Jr.",
    "team": "Den",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   }
  ],
  "x_team_beermode": [
   {
    "slot": "PG",
    "name": "Terry Rozier",
    "team": "Cha",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "James Harden",
    "team": "Phi",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Caris LeVert",
    "team": "Cle",
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
    "name": "Nikola Vucevic",
    "team": "Chi",
    "pos": "C",
    "acq": "Draft",
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
    "name": "Bogdan Bogdanovic",
    "team": "Atl",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "UTIL",
    "name": "Evan Fournier",
    "team": "NY",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Cameron Payne",
    "team": "Phx",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Khris Middleton",
    "team": "Mil",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "Bench",
    "name": "Malcolm Brogdon",
    "team": "Ind",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Bobby Portis",
    "team": "Mil",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Damian Lillard",
    "team": "Por",
    "pos": "PG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   }
  ],
  "x_angry_ducks": [
   {
    "slot": "PG",
    "name": "Jalen Suggs",
    "team": "Orl",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "SG",
    "name": "Fred VanVleet",
    "team": "Tor",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "SF",
    "name": "Anthony Edwards",
    "team": "Min",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Jayson Tatum",
    "team": "Bos",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Jakob Poeltl",
    "team": "SA",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G",
    "name": "Derrick White",
    "team": "Bos",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F",
    "name": "Jaxson Hayes",
    "team": "NO",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Jordan Poole",
    "team": "GS",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Darius Garland",
    "team": "Cle",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Josh Giddey",
    "team": "OKC",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "Bench",
    "name": "Jaylen Brown",
    "team": "Bos",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jusuf Nurkic",
    "team": "Por",
    "pos": "C",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "Bench",
    "name": "OG Anunoby",
    "team": "Tor",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   }
  ],
  "x_crappy_chicken": [
   {
    "slot": "PG",
    "name": "Kyrie Irving",
    "team": "Bkn",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Andrew Wiggins",
    "team": "GS",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Gordon Hayward",
    "team": "Cha",
    "pos": "SF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "PF",
    "name": "Pascal Siakam",
    "team": "Tor",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Thomas Bryant",
    "team": "Wsh",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G",
    "name": "CJ McCollum",
    "team": "NO",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F",
    "name": "Norman Powell",
    "team": "LAC",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Tyrese Haliburton",
    "team": "Ind",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Jarrett Allen",
    "team": "Cle",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Zion Williamson",
    "team": "NO",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Kevin Durant",
    "team": "Bkn",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jimmy Butler",
    "team": "Mia",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Jamal Murray",
    "team": "Den",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   }
  ],
  "x_devin_kurant": [
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
    "name": "Devin Booker",
    "team": "Phx",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Jerami Grant",
    "team": "Det",
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
    "name": "Mo Bamba",
    "team": "Orl",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G",
    "name": "Devonte' Graham",
    "team": "NO",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F",
    "name": "Paul George",
    "team": "LAC",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Draymond Green",
    "team": "GS",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Karl-Anthony Towns",
    "team": "Min",
    "pos": "C",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "UTIL",
    "name": "Darius Bazley",
    "team": "OKC",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Spencer Dinwiddie",
    "team": "Dal",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Patty Mills",
    "team": "Bkn",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Franz Wagner",
    "team": "Orl",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   }
  ],
  "x_dreschvitz_beerdrinkers": [],
  "x_james_lebrontosaurus": [
   {
    "slot": "PG",
    "name": "Russell Westbrook",
    "team": "LAL",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Bradley Beal",
    "team": "Wsh",
    "pos": "SG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "SF",
    "name": "Harrison Barnes",
    "team": "Sac",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Kelly Oubre Jr.",
    "team": "Cha",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Mason Plumlee",
    "team": "Cha",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G",
    "name": "Will Barton",
    "team": "Den",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F",
    "name": "Julius Randle",
    "team": "NY",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Clint Capela",
    "team": "Atl",
    "pos": "C",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "UTIL",
    "name": "Kevin Porter Jr.",
    "team": "Hou",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Seth Curry",
    "team": "Bkn",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "Bench",
    "name": "Myles Turner",
    "team": "Ind",
    "pos": "C, PF",
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
    "name": "Evan Mobley",
    "team": "Cle",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   }
  ],
  "8": [
   {
    "slot": "PG",
    "name": "Dejounte Murray",
    "team": "SA",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Jalen Brunson",
    "team": "Dal",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Tobias Harris",
    "team": "Phi",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
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
    "name": "Steven Adams",
    "team": "Mem",
    "pos": "C",
    "acq": "Draft",
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
    "name": "Christian Wood",
    "team": "Hou",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Marcus Smart",
    "team": "Bos",
    "pos": "SG, PG",
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
    "pos": "PG, SG",
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
    "name": "Saddiq Bey",
    "team": "Det",
    "pos": "SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Marvin Bagley III",
    "team": "Det",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   }
  ],
  "4": [
   {
    "slot": "PG",
    "name": "D'Angelo Russell",
    "team": "Min",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Desmond Bane",
    "team": "Mem",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Bojan Bogdanovic",
    "team": "Utah",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Brandon Ingram",
    "team": "NO",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "C",
    "name": "Deandre Ayton",
    "team": "Phx",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G",
    "name": "RJ Barrett",
    "team": "NY",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F",
    "name": "Gary Trent Jr.",
    "team": "Tor",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Ja Morant",
    "team": "Mem",
    "pos": "PG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "UTIL",
    "name": "Reggie Jackson",
    "team": "LAC",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Montrezl Harrell",
    "team": "Cha",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Trae Young",
    "team": "Atl",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "John Collins",
    "team": "Atl",
    "pos": "PF, C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "Wendell Carter Jr.",
    "team": "Orl",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": false
   }
  ],
  "x_new_york_nix": [
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
    "name": "Shai Gilgeous-Alexander",
    "team": "OKC",
    "pos": "SG, PG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "SF",
    "name": "Scottie Barnes",
    "team": "Tor",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "PF",
    "name": "Aaron Gordon",
    "team": "Den",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Andre Drummond",
    "team": "Bkn",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G",
    "name": "Matisse Thybulle",
    "team": "Phi",
    "pos": "SF, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F",
    "name": "Aleksej Pokusevski",
    "team": "OKC",
    "pos": "PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "LaMelo Ball",
    "team": "Cha",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Jalen Green",
    "team": "Hou",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "UTIL",
    "name": "Kristaps Porzingis",
    "team": "Wsh",
    "pos": "C, PF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
   },
   {
    "slot": "Bench",
    "name": "Jonathan Isaac",
    "team": "Orl",
    "pos": "PF, SF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "Bench",
    "name": "Ben Simmons",
    "team": "Bkn",
    "pos": "PG",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "Bench",
    "name": "Dillon Brooks",
    "team": "Mem",
    "pos": "SG, SF",
    "acq": "Draft",
    "inj": false
   }
  ],
  "12": [
   {
    "slot": "PG",
    "name": "LeBron James",
    "team": "LAL",
    "pos": "SF, PG, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SG",
    "name": "Klay Thompson",
    "team": "GS",
    "pos": "SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "SF",
    "name": "Kawhi Leonard",
    "team": "LAC",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": true,
    "injStatus": "O"
   },
   {
    "slot": "PF",
    "name": "Miles Bridges",
    "team": "Cha",
    "pos": "SF, PF",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "C",
    "name": "Rudy Gobert",
    "team": "Utah",
    "pos": "C",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "G",
    "name": "Stephen Curry",
    "team": "GS",
    "pos": "PG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "F",
    "name": "Lauri Markkanen",
    "team": "Cle",
    "pos": "PF, SF",
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
    "name": "Mitchell Robinson",
    "team": "NY",
    "pos": "C",
    "acq": "Draft",
    "inj": true,
    "injStatus": "DTD"
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
    "slot": "Bench",
    "name": "Jrue Holiday",
    "team": "Mil",
    "pos": "PG, SG",
    "acq": "Draft",
    "inj": false
   },
   {
    "slot": "Bench",
    "name": "DeMar DeRozan",
    "team": "Chi",
    "pos": "SG, SF",
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
   }
  ]
 }
};
