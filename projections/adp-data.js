// MFHFBs NBA Projections — ADP-Daten (Output von scripts/build-adp-data.py)
// Eigene Draft Results: 223 Spieler | Fantrax-ADP: 279 Spieler
// Key = normalisierter Spielername (siehe mfhfbNormalizeName in assets/shared.js)
// Felder: ownAdp/ownCount/ownMin/ownMax/ownPicks (aus data/draft-results/), fantraxAdp (aus data/fantrax-adp.csv)
// NICHT MANUELL BEARBEITEN — Skript erneut laufen lassen, nachdem neue CSVs abgelegt wurden.
const ADP_DATA = {
 "kentavious caldwellpope": {
  "name": "Kentavious Caldwell-Pope",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "PHI",
  "pos": "SG"
 },
 "keyonte george": {
  "name": "Keyonte George",
  "ownAdp": 55.3,
  "ownCount": 25,
  "ownMin": 41,
  "ownMax": 76,
  "ownPicks": [
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   }
  ],
  "fantraxAdp": 58,
  "team": "UTA",
  "pos": "PG"
 },
 "tre johnson": {
  "name": "Tre Johnson",
  "ownAdp": 145.5,
  "ownCount": 2,
  "ownMin": 135,
  "ownMax": 156,
  "ownPicks": [
   {
    "pick": 135,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 156,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   }
  ],
  "fantraxAdp": 239,
  "team": "WAS",
  "pos": "SG"
 },
 "dennis schroder": {
  "name": "Dennis Schroder",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 243,
  "team": "CHA",
  "pos": "PG"
 },
 "jalen green": {
  "name": "Jalen Green",
  "ownAdp": 116.4,
  "ownCount": 18,
  "ownMin": 75,
  "ownMax": 156,
  "ownPicks": [
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 119,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 120,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 120,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 122,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 123,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 126,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 129,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 131,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 156,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   }
  ],
  "fantraxAdp": 118,
  "team": "PHO",
  "pos": "SG"
 },
 "jordan poole": {
  "name": "Jordan Poole",
  "ownAdp": 155.0,
  "ownCount": 2,
  "ownMin": 153,
  "ownMax": 157,
  "ownPicks": [
   {
    "pick": 153,
    "source": "Fantrax-Draft-Results-AUTO-kjuxwfi4mrh17ll1"
   },
   {
    "pick": 157,
    "source": "Fantrax-Draft-Results-AUTO-emeu5xuymrh1a5id"
   }
  ],
  "fantraxAdp": 238,
  "team": "NO",
  "pos": "SG"
 },
 "tre jones": {
  "name": "Tre Jones",
  "ownAdp": 144.5,
  "ownCount": 12,
  "ownMin": 110,
  "ownMax": 163,
  "ownPicks": [
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 134,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 134,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 136,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 138,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 146,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 147,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 152,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 155,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 157,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 162,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 163,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 155,
  "team": "CHI",
  "pos": "PG"
 },
 "karlanthony towns": {
  "name": "Karl-Anthony Towns",
  "ownAdp": 16.9,
  "ownCount": 28,
  "ownMin": 13,
  "ownMax": 24,
  "ownPicks": [
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 17,
  "team": "NY",
  "pos": "C"
 },
 "aday mara": {
  "name": "Aday Mara",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "OKC",
  "pos": "C"
 },
 "kyrie irving": {
  "name": "Kyrie Irving",
  "ownAdp": 61.6,
  "ownCount": 25,
  "ownMin": 35,
  "ownMax": 81,
  "ownPicks": [
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 53,
  "team": "DAL",
  "pos": "SG"
 },
 "dillon brooks": {
  "name": "Dillon Brooks",
  "ownAdp": 138.5,
  "ownCount": 11,
  "ownMin": 111,
  "ownMax": 153,
  "ownPicks": [
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 121,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 131,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 133,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 136,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 144,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 145,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 148,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 149,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 152,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 153,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   }
  ],
  "fantraxAdp": 174,
  "team": "PHO",
  "pos": "SF"
 },
 "robert williams": {
  "name": "Robert Williams",
  "ownAdp": 157.0,
  "ownCount": 1,
  "ownMin": 157,
  "ownMax": 157,
  "ownPicks": [
   {
    "pick": 157,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   }
  ],
  "fantraxAdp": 234,
  "team": "POR",
  "pos": "C"
 },
 "jordan goodwin": {
  "name": "Jordan Goodwin",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "PHO",
  "pos": "PG"
 },
 "jamal shead": {
  "name": "Jamal Shead",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "TOR",
  "pos": "PG"
 },
 "miles mcbride": {
  "name": "Miles McBride",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 242,
  "team": "NY",
  "pos": "PG"
 },
 "max strus": {
  "name": "Max Strus",
  "ownAdp": 159.0,
  "ownCount": 2,
  "ownMin": 159,
  "ownMax": 159,
  "ownPicks": [
   {
    "pick": 159,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 159,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   }
  ],
  "fantraxAdp": 242,
  "team": "CLE",
  "pos": "SF"
 },
 "naji marshall": {
  "name": "Naji Marshall",
  "ownAdp": 156.7,
  "ownCount": 3,
  "ownMin": 152,
  "ownMax": 159,
  "ownPicks": [
   {
    "pick": 152,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 159,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 159,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   }
  ],
  "fantraxAdp": 230,
  "team": "DAL",
  "pos": "SF"
 },
 "marcus smart": {
  "name": "Marcus Smart",
  "ownAdp": 148.0,
  "ownCount": 1,
  "ownMin": 148,
  "ownMax": 148,
  "ownPicks": [
   {
    "pick": 148,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   }
  ],
  "fantraxAdp": 243,
  "team": "HOU",
  "pos": "PG"
 },
 "gg jackson": {
  "name": "GG Jackson",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 242,
  "team": "MEM",
  "pos": "PF"
 },
 "cooper flagg": {
  "name": "Cooper Flagg",
  "ownAdp": 12.9,
  "ownCount": 29,
  "ownMin": 7,
  "ownMax": 19,
  "ownPicks": [
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 20"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   }
  ],
  "fantraxAdp": 12,
  "team": "DAL",
  "pos": "SF"
 },
 "jeremiah fears": {
  "name": "Jeremiah Fears",
  "ownAdp": 130.1,
  "ownCount": 15,
  "ownMin": 96,
  "ownMax": 159,
  "ownPicks": [
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 118,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 121,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 123,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 125,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 130,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 133,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 136,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 142,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 142,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 151,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 156,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 159,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   }
  ],
  "fantraxAdp": 147,
  "team": "NO",
  "pos": "PG"
 },
 "dyson daniels": {
  "name": "Dyson Daniels",
  "ownAdp": 63.0,
  "ownCount": 25,
  "ownMin": 32,
  "ownMax": 89,
  "ownPicks": [
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   }
  ],
  "fantraxAdp": 60,
  "team": "ATL",
  "pos": "SG"
 },
 "ayo dosunmu": {
  "name": "Ayo Dosunmu",
  "ownAdp": 101.4,
  "ownCount": 21,
  "ownMin": 68,
  "ownMax": 125,
  "ownPicks": [
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 117,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 118,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 119,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 125,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   }
  ],
  "fantraxAdp": 105,
  "team": "MIN",
  "pos": "SG"
 },
 "og anunoby": {
  "name": "OG Anunoby",
  "ownAdp": 55.1,
  "ownCount": 23,
  "ownMin": 45,
  "ownMax": 65,
  "ownPicks": [
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   }
  ],
  "fantraxAdp": 57,
  "team": "NY",
  "pos": "PF"
 },
 "caleb wilson": {
  "name": "Caleb Wilson",
  "ownAdp": 99.2,
  "ownCount": 21,
  "ownMin": 51,
  "ownMax": 125,
  "ownPicks": [
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 117,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 117,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 122,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 125,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   }
  ],
  "fantraxAdp": 97,
  "team": "CHI",
  "pos": "PF"
 },
 "ajay mitchell": {
  "name": "Ajay Mitchell",
  "ownAdp": 114.8,
  "ownCount": 19,
  "ownMin": 95,
  "ownMax": 133,
  "ownPicks": [
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 120,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 123,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 123,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 125,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 127,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 127,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 131,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 133,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 113,
  "team": "OKC",
  "pos": "SG"
 },
 "evan mobley": {
  "name": "Evan Mobley",
  "ownAdp": 28.4,
  "ownCount": 26,
  "ownMin": 21,
  "ownMax": 37,
  "ownPicks": [
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   }
  ],
  "fantraxAdp": 29,
  "team": "CLE",
  "pos": "PF"
 },
 "scottie barnes": {
  "name": "Scottie Barnes",
  "ownAdp": 9.9,
  "ownCount": 29,
  "ownMin": 4,
  "ownMax": 15,
  "ownPicks": [
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 20"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 12,
  "team": "TOR",
  "pos": "PF"
 },
 "ryan kalkbrenner": {
  "name": "Ryan Kalkbrenner",
  "ownAdp": 168.0,
  "ownCount": 1,
  "ownMin": 168,
  "ownMax": 168,
  "ownPicks": [
   {
    "pick": 168,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   }
  ],
  "fantraxAdp": 234,
  "team": "CHA",
  "pos": "C"
 },
 "keegan murray": {
  "name": "Keegan Murray",
  "ownAdp": 108.5,
  "ownCount": 19,
  "ownMin": 94,
  "ownMax": 124,
  "ownPicks": [
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 118,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 119,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 119,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 124,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   }
  ],
  "fantraxAdp": 109,
  "team": "SAC",
  "pos": "PF"
 },
 "devin vassell": {
  "name": "Devin Vassell",
  "ownAdp": 130.8,
  "ownCount": 14,
  "ownMin": 100,
  "ownMax": 167,
  "ownPicks": [
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 118,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 121,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 126,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 142,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 143,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 147,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 148,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 150,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 151,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 167,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 153,
  "team": "SA",
  "pos": "SG"
 },
 "malik monk": {
  "name": "Malik Monk",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 241,
  "team": "SAC",
  "pos": "SG"
 },
 "jaime jaquez": {
  "name": "Jaime Jaquez",
  "ownAdp": 120.8,
  "ownCount": 16,
  "ownMin": 74,
  "ownMax": 156,
  "ownPicks": [
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 120,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 126,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 127,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 128,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 132,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 133,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 134,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 146,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 150,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 156,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   }
  ],
  "fantraxAdp": 125,
  "team": "MIL",
  "pos": "SF"
 },
 "brice sensabaugh": {
  "name": "Brice Sensabaugh",
  "ownAdp": 146.5,
  "ownCount": 2,
  "ownMin": 141,
  "ownMax": 152,
  "ownPicks": [
   {
    "pick": 141,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 152,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 241,
  "team": "UTA",
  "pos": "SF"
 },
 "sandro mamukelashvili": {
  "name": "Sandro Mamukelashvili",
  "ownAdp": 126.3,
  "ownCount": 11,
  "ownMin": 92,
  "ownMax": 160,
  "ownPicks": [
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 123,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 124,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 129,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 132,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 149,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 151,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 160,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   }
  ],
  "fantraxAdp": 134,
  "team": "LAL",
  "pos": "PF"
 },
 "kawhi leonard": {
  "name": "Kawhi Leonard",
  "ownAdp": 27.6,
  "ownCount": 28,
  "ownMin": 16,
  "ownMax": 40,
  "ownPicks": [
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   }
  ],
  "fantraxAdp": 28,
  "team": "LAC",
  "pos": "SF"
 },
 "payton pritchard": {
  "name": "Payton Pritchard",
  "ownAdp": 73.8,
  "ownCount": 24,
  "ownMin": 49,
  "ownMax": 89,
  "ownPicks": [
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   }
  ],
  "fantraxAdp": 79,
  "team": "BOS",
  "pos": "PG"
 },
 "zach lavine": {
  "name": "Zach LaVine",
  "ownAdp": 121.7,
  "ownCount": 18,
  "ownMin": 94,
  "ownMax": 140,
  "ownPicks": [
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 121,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 122,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 124,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 126,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 127,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 127,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 128,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 129,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 131,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 131,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 137,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 140,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   }
  ],
  "fantraxAdp": 118,
  "team": "SAC",
  "pos": "SG"
 },
 "cade cunningham": {
  "name": "Cade Cunningham",
  "ownAdp": 5.5,
  "ownCount": 31,
  "ownMin": 4,
  "ownMax": 7,
  "ownPicks": [
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 19"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 18"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 20"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 6,
  "team": "DET",
  "pos": "PG"
 },
 "kyshawn george": {
  "name": "Kyshawn George",
  "ownAdp": 119.9,
  "ownCount": 17,
  "ownMin": 98,
  "ownMax": 148,
  "ownPicks": [
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 118,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 118,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 118,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 119,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 122,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 122,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 123,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 129,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 129,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 132,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 133,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 148,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   }
  ],
  "fantraxAdp": 122,
  "team": "WAS",
  "pos": "SG"
 },
 "jarrett allen": {
  "name": "Jarrett Allen",
  "ownAdp": 85.0,
  "ownCount": 21,
  "ownMin": 71,
  "ownMax": 99,
  "ownPicks": [
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   }
  ],
  "fantraxAdp": 84,
  "team": "CLE",
  "pos": "C"
 },
 "royce oneale": {
  "name": "Royce O'Neale",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "CHA",
  "pos": "SF"
 },
 "scoot henderson": {
  "name": "Scoot Henderson",
  "ownAdp": 158.2,
  "ownCount": 4,
  "ownMin": 147,
  "ownMax": 168,
  "ownPicks": [
   {
    "pick": 147,
    "source": "Fantrax-Draft-Results-AUTO-bbw1narimrkdo0xy"
   },
   {
    "pick": 156,
    "source": "Fantrax-Draft-Results-AUTO-4cjjvk4dmrcvjknk"
   },
   {
    "pick": 162,
    "source": "Fantrax-Draft-Results-AUTO-emeu5xuymrh1a5id"
   },
   {
    "pick": 168,
    "source": "Fantrax-Draft-Results-AUTO-1ycl5y6pmrhrjicv"
   }
  ],
  "fantraxAdp": 231,
  "team": "POR",
  "pos": "PG"
 },
 "brayden burries": {
  "name": "Brayden Burries",
  "ownAdp": 155.0,
  "ownCount": 2,
  "ownMin": 152,
  "ownMax": 158,
  "ownPicks": [
   {
    "pick": 152,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 158,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   }
  ],
  "fantraxAdp": 229,
  "team": "MIL",
  "pos": "SG"
 },
 "dereck lively": {
  "name": "Dereck Lively",
  "ownAdp": 153.0,
  "ownCount": 1,
  "ownMin": 153,
  "ownMax": 153,
  "ownPicks": [
   {
    "pick": 153,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 211,
  "team": "DAL",
  "pos": "C"
 },
 "drew peterson": {
  "name": "Drew Peterson",
  "ownAdp": 86.0,
  "ownCount": 1,
  "ownMin": 86,
  "ownMax": 86,
  "ownPicks": [
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   }
  ],
  "fantraxAdp": 242,
  "team": "(N/A)",
  "pos": "PF"
 },
 "cameron johnson": {
  "name": "Cameron Johnson",
  "ownAdp": 143.5,
  "ownCount": 6,
  "ownMin": 120,
  "ownMax": 168,
  "ownPicks": [
   {
    "pick": 120,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 131,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 134,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 144,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 164,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 168,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   }
  ],
  "fantraxAdp": 186,
  "team": "DEN",
  "pos": "PF"
 },
 "jrue holiday": {
  "name": "Jrue Holiday",
  "ownAdp": 134.2,
  "ownCount": 9,
  "ownMin": 124,
  "ownMax": 166,
  "ownPicks": [
   {
    "pick": 124,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 125,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 125,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 127,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 131,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 133,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 137,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 140,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 166,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   }
  ],
  "fantraxAdp": 173,
  "team": "POR",
  "pos": "PG"
 },
 "jaden mcdaniels": {
  "name": "Jaden McDaniels",
  "ownAdp": 78.2,
  "ownCount": 22,
  "ownMin": 63,
  "ownMax": 88,
  "ownPicks": [
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   }
  ],
  "fantraxAdp": 79,
  "team": "MIN",
  "pos": "PF"
 },
 "isaac okoro": {
  "name": "Isaac Okoro",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "CHI",
  "pos": "SG"
 },
 "giannis antetokounmpo": {
  "name": "Giannis Antetokounmpo",
  "ownAdp": 10.9,
  "ownCount": 31,
  "ownMin": 5,
  "ownMax": 24,
  "ownPicks": [
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 18"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 19"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 20"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   }
  ],
  "fantraxAdp": 10,
  "team": "MIA",
  "pos": "PF"
 },
 "shaedon sharpe": {
  "name": "Shaedon Sharpe",
  "ownAdp": 129.6,
  "ownCount": 12,
  "ownMin": 111,
  "ownMax": 158,
  "ownPicks": [
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 120,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 121,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 124,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 124,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 125,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 135,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 140,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 141,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 141,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 158,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 160,
  "team": "POR",
  "pos": "SG"
 },
 "ousmane dieng": {
  "name": "Ousmane Dieng",
  "ownAdp": 164.0,
  "ownCount": 1,
  "ownMin": 164,
  "ownMax": 164,
  "ownPicks": [
   {
    "pick": 164,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 243,
  "team": "MIL",
  "pos": "C"
 },
 "deandre hunter": {
  "name": "De'Andre Hunter",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 243,
  "team": "SAC",
  "pos": "SF"
 },
 "kevin porter": {
  "name": "Kevin Porter",
  "ownAdp": 105.8,
  "ownCount": 21,
  "ownMin": 80,
  "ownMax": 137,
  "ownPicks": [
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 124,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 124,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 128,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 133,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 137,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   }
  ],
  "fantraxAdp": 108,
  "team": "MIL",
  "pos": "SG"
 },
 "isaiah jackson": {
  "name": "Isaiah Jackson",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "LAC",
  "pos": "C"
 },
 "adem bona": {
  "name": "Adem Bona",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 243,
  "team": "PHI",
  "pos": "C"
 },
 "luguentz dort": {
  "name": "Luguentz Dort",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 243,
  "team": "ATL",
  "pos": "SF"
 },
 "josh hart": {
  "name": "Josh Hart",
  "ownAdp": 97.5,
  "ownCount": 20,
  "ownMin": 78,
  "ownMax": 114,
  "ownPicks": [
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   }
  ],
  "fantraxAdp": 96,
  "team": "NY",
  "pos": "SG"
 },
 "danny wolf": {
  "name": "Danny Wolf",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 242,
  "team": "BKN",
  "pos": "PF"
 },
 "derik queen": {
  "name": "Derik Queen",
  "ownAdp": 92.6,
  "ownCount": 21,
  "ownMin": 67,
  "ownMax": 120,
  "ownPicks": [
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 120,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   }
  ],
  "fantraxAdp": 94,
  "team": "NO",
  "pos": "C"
 },
 "jabari smith": {
  "name": "Jabari Smith",
  "ownAdp": 85.3,
  "ownCount": 23,
  "ownMin": 71,
  "ownMax": 107,
  "ownPicks": [
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   }
  ],
  "fantraxAdp": 90,
  "team": "HOU",
  "pos": "PF"
 },
 "walker kessler": {
  "name": "Walker Kessler",
  "ownAdp": 42.2,
  "ownCount": 25,
  "ownMin": 30,
  "ownMax": 66,
  "ownPicks": [
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 40,
  "team": "LAL",
  "pos": "C"
 },
 "luka doncic": {
  "name": "Luka Doncic",
  "ownAdp": 3.6,
  "ownCount": 31,
  "ownMin": 1,
  "ownMax": 5,
  "ownPicks": [
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 18"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 19"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 20"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   }
  ],
  "fantraxAdp": 4,
  "team": "LAL",
  "pos": "PG"
 },
 "jaylin williams": {
  "name": "Jaylin Williams",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "OKC",
  "pos": "PF"
 },
 "daniel gafford": {
  "name": "Daniel Gafford",
  "ownAdp": 143.8,
  "ownCount": 5,
  "ownMin": 126,
  "ownMax": 159,
  "ownPicks": [
   {
    "pick": 126,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 142,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 142,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 150,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 159,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   }
  ],
  "fantraxAdp": 227,
  "team": "DAL",
  "pos": "C"
 },
 "jake laravia": {
  "name": "Jake LaRavia",
  "ownAdp": 162.0,
  "ownCount": 1,
  "ownMin": 162,
  "ownMax": 162,
  "ownPicks": [
   {
    "pick": 162,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   }
  ],
  "fantraxAdp": 240,
  "team": "LAL",
  "pos": "PF"
 },
 "yves missi": {
  "name": "Yves Missi",
  "ownAdp": 142.9,
  "ownCount": 7,
  "ownMin": 106,
  "ownMax": 164,
  "ownPicks": [
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 148,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 151,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 154,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 161,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 164,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   }
  ],
  "fantraxAdp": 229,
  "team": "NO",
  "pos": "C"
 },
 "keldon johnson": {
  "name": "Keldon Johnson",
  "ownAdp": 122.0,
  "ownCount": 3,
  "ownMin": 78,
  "ownMax": 161,
  "ownPicks": [
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 127,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 161,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 239,
  "team": "SA",
  "pos": "SF"
 },
 "jaylen wells": {
  "name": "Jaylen Wells",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 242,
  "team": "MEM",
  "pos": "SG"
 },
 "aaron nesmith": {
  "name": "Aaron Nesmith",
  "ownAdp": 158.0,
  "ownCount": 1,
  "ownMin": 158,
  "ownMax": 158,
  "ownPicks": [
   {
    "pick": 158,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   }
  ],
  "fantraxAdp": 223,
  "team": "IND",
  "pos": "SF"
 },
 "tj mcconnell": {
  "name": "T.J. McConnell",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "IND",
  "pos": "PG"
 },
 "yaxel lendeborg": {
  "name": "Yaxel Lendeborg",
  "ownAdp": 147.5,
  "ownCount": 4,
  "ownMin": 130,
  "ownMax": 159,
  "ownPicks": [
   {
    "pick": 130,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 144,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 157,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 159,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   }
  ],
  "fantraxAdp": 183,
  "team": "GS",
  "pos": "SF"
 },
 "amen thompson": {
  "name": "Amen Thompson",
  "ownAdp": 23.6,
  "ownCount": 27,
  "ownMin": 10,
  "ownMax": 42,
  "ownPicks": [
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   }
  ],
  "fantraxAdp": 24,
  "team": "HOU",
  "pos": "SF"
 },
 "aaron gordon": {
  "name": "Aaron Gordon",
  "ownAdp": 140.8,
  "ownCount": 10,
  "ownMin": 100,
  "ownMax": 165,
  "ownPicks": [
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 131,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 136,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 139,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 144,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 144,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 147,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 151,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 151,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 165,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   }
  ],
  "fantraxAdp": 153,
  "team": "DEN",
  "pos": "PF"
 },
 "precious achiuwa": {
  "name": "Precious Achiuwa",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 238,
  "team": "SAC",
  "pos": "C"
 },
 "jalen duren": {
  "name": "Jalen Duren",
  "ownAdp": 43.0,
  "ownCount": 25,
  "ownMin": 32,
  "ownMax": 60,
  "ownPicks": [
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   }
  ],
  "fantraxAdp": 44,
  "team": "DET",
  "pos": "C"
 },
 "shai gilgeousalexander": {
  "name": "Shai Gilgeous-Alexander",
  "ownAdp": 3.5,
  "ownCount": 31,
  "ownMin": 3,
  "ownMax": 5,
  "ownPicks": [
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 18"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 19"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 20"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 4,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   }
  ],
  "fantraxAdp": 3,
  "team": "OKC",
  "pos": "PG"
 },
 "donte divincenzo": {
  "name": "Donte DiVincenzo",
  "ownAdp": 129.5,
  "ownCount": 6,
  "ownMin": 108,
  "ownMax": 142,
  "ownPicks": [
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 123,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 126,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 137,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 141,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 142,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 220,
  "team": "MIN",
  "pos": "SG"
 },
 "naz reid": {
  "name": "Naz Reid",
  "ownAdp": 73.9,
  "ownCount": 23,
  "ownMin": 53,
  "ownMax": 90,
  "ownPicks": [
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   }
  ],
  "fantraxAdp": 72,
  "team": "CHA",
  "pos": "C"
 },
 "jakob poeltl": {
  "name": "Jakob Poeltl",
  "ownAdp": 122.4,
  "ownCount": 17,
  "ownMin": 95,
  "ownMax": 160,
  "ownPicks": [
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 119,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 119,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 127,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 132,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 135,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 137,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 137,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 142,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 143,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 160,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   }
  ],
  "fantraxAdp": 128,
  "team": "TOR",
  "pos": "C"
 },
 "rudy gobert": {
  "name": "Rudy Gobert",
  "ownAdp": 70.6,
  "ownCount": 25,
  "ownMin": 37,
  "ownMax": 90,
  "ownPicks": [
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   }
  ],
  "fantraxAdp": 72,
  "team": "MIN",
  "pos": "C"
 },
 "bam adebayo": {
  "name": "Bam Adebayo",
  "ownAdp": 35.9,
  "ownCount": 26,
  "ownMin": 23,
  "ownMax": 46,
  "ownPicks": [
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   }
  ],
  "fantraxAdp": 36,
  "team": "MIA",
  "pos": "C"
 },
 "derrick white": {
  "name": "Derrick White",
  "ownAdp": 31.1,
  "ownCount": 25,
  "ownMin": 9,
  "ownMax": 48,
  "ownPicks": [
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   }
  ],
  "fantraxAdp": 33,
  "team": "BOS",
  "pos": "SG"
 },
 "trey murphy": {
  "name": "Trey Murphy",
  "ownAdp": 28.9,
  "ownCount": 27,
  "ownMin": 18,
  "ownMax": 44,
  "ownPicks": [
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   }
  ],
  "fantraxAdp": 30,
  "team": "NO",
  "pos": "SF"
 },
 "aaron wiggins": {
  "name": "Aaron Wiggins",
  "ownAdp": 145.0,
  "ownCount": 2,
  "ownMin": 142,
  "ownMax": 148,
  "ownPicks": [
   {
    "pick": 142,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 148,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   }
  ],
  "fantraxAdp": 235,
  "team": "ATL",
  "pos": "SG"
 },
 "anthony black": {
  "name": "Anthony Black",
  "ownAdp": 135.2,
  "ownCount": 13,
  "ownMin": 107,
  "ownMax": 157,
  "ownPicks": [
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 125,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 127,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 130,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 137,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 145,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 149,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 152,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 154,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 156,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 157,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   }
  ],
  "fantraxAdp": 133,
  "team": "ORL",
  "pos": "PG"
 },
 "jonathan kuminga": {
  "name": "Jonathan Kuminga",
  "ownAdp": 149.0,
  "ownCount": 1,
  "ownMin": 149,
  "ownMax": 149,
  "ownPicks": [
   {
    "pick": 149,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   }
  ],
  "fantraxAdp": 243,
  "team": "(N/A)",
  "pos": "PF"
 },
 "darius acuff": {
  "name": "Darius Acuff",
  "ownAdp": 143.1,
  "ownCount": 15,
  "ownMin": 129,
  "ownMax": 167,
  "ownPicks": [
   {
    "pick": 129,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 130,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 131,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 134,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 135,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 138,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 139,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 141,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 143,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 146,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 146,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 150,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 153,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 165,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 167,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   }
  ],
  "fantraxAdp": 136,
  "team": "SAC",
  "pos": "PG"
 },
 "bennedict mathurin": {
  "name": "Bennedict Mathurin",
  "ownAdp": 144.4,
  "ownCount": 11,
  "ownMin": 130,
  "ownMax": 158,
  "ownPicks": [
   {
    "pick": 130,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 136,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 138,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 139,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 141,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 143,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 143,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 146,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 157,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 157,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 158,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   }
  ],
  "fantraxAdp": 160,
  "team": "LAC",
  "pos": "SF"
 },
 "jayson tatum": {
  "name": "Jayson Tatum",
  "ownAdp": 9.1,
  "ownCount": 31,
  "ownMin": 5,
  "ownMax": 15,
  "ownPicks": [
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 19"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 20"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 18"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   }
  ],
  "fantraxAdp": 8,
  "team": "BOS",
  "pos": "PF"
 },
 "lamelo ball": {
  "name": "LaMelo Ball",
  "ownAdp": 24.9,
  "ownCount": 28,
  "ownMin": 16,
  "ownMax": 33,
  "ownPicks": [
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   }
  ],
  "fantraxAdp": 24,
  "team": "MIN",
  "pos": "PG"
 },
 "anfernee simons": {
  "name": "Anfernee Simons",
  "ownAdp": 138.0,
  "ownCount": 1,
  "ownMin": 138,
  "ownMax": 138,
  "ownPicks": [
   {
    "pick": 138,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   }
  ],
  "fantraxAdp": 240,
  "team": "PHI",
  "pos": "SG"
 },
 "jusuf nurkic": {
  "name": "Jusuf Nurkic",
  "ownAdp": 123.1,
  "ownCount": 17,
  "ownMin": 86,
  "ownMax": 153,
  "ownPicks": [
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 117,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 121,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 122,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 123,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 125,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 125,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 127,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 129,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 134,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 135,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 140,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 146,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 153,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 123,
  "team": "UTA",
  "pos": "C"
 },
 "noah clowney": {
  "name": "Noah Clowney",
  "ownAdp": 150.5,
  "ownCount": 2,
  "ownMin": 147,
  "ownMax": 154,
  "ownPicks": [
   {
    "pick": 147,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 154,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 230,
  "team": "BKN",
  "pos": "PF"
 },
 "baylor scheierman": {
  "name": "Baylor Scheierman",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "BOS",
  "pos": "SG"
 },
 "keon ellis": {
  "name": "Keon Ellis",
  "ownAdp": 146.3,
  "ownCount": 6,
  "ownMin": 132,
  "ownMax": 157,
  "ownPicks": [
   {
    "pick": 132,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 135,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 148,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 150,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 156,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 157,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 225,
  "team": "BKN",
  "pos": "SG"
 },
 "moussa diabate": {
  "name": "Moussa Diabate",
  "ownAdp": 144.0,
  "ownCount": 3,
  "ownMin": 133,
  "ownMax": 162,
  "ownPicks": [
   {
    "pick": 133,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 137,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 162,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 171,
  "team": "CHA",
  "pos": "C"
 },
 "bobby portis": {
  "name": "Bobby Portis",
  "ownAdp": 143.5,
  "ownCount": 4,
  "ownMin": 134,
  "ownMax": 161,
  "ownPicks": [
   {
    "pick": 134,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 134,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 145,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 161,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 220,
  "team": "MIA",
  "pos": "PF"
 },
 "ryan rollins": {
  "name": "Ryan Rollins",
  "ownAdp": 67.2,
  "ownCount": 25,
  "ownMin": 54,
  "ownMax": 89,
  "ownPicks": [
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   }
  ],
  "fantraxAdp": 68,
  "team": "MIL",
  "pos": "PG"
 },
 "leonard miller": {
  "name": "Leonard Miller",
  "ownAdp": 165.0,
  "ownCount": 1,
  "ownMin": 165,
  "ownMax": 165,
  "ownPicks": [
   {
    "pick": 165,
    "source": "Fantrax-Draft-Results-AUTO-jkfwddasmrc2ubfh"
   }
  ],
  "fantraxAdp": 242,
  "team": "CHI",
  "pos": "SF"
 },
 "anthony edwards": {
  "name": "Anthony Edwards",
  "ownAdp": 9.8,
  "ownCount": 31,
  "ownMin": 6,
  "ownMax": 15,
  "ownPicks": [
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 18"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 19"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 20"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   }
  ],
  "fantraxAdp": 9,
  "team": "MIN",
  "pos": "SG"
 },
 "keaton wagler": {
  "name": "Keaton Wagler",
  "ownAdp": 152.0,
  "ownCount": 2,
  "ownMin": 138,
  "ownMax": 166,
  "ownPicks": [
   {
    "pick": 138,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 166,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 226,
  "team": "LAC",
  "pos": "SG"
 },
 "brandon ingram": {
  "name": "Brandon Ingram",
  "ownAdp": 68.8,
  "ownCount": 25,
  "ownMin": 49,
  "ownMax": 89,
  "ownPicks": [
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   }
  ],
  "fantraxAdp": 76,
  "team": "TOR",
  "pos": "SF"
 },
 "kelly oubre": {
  "name": "Kelly Oubre Jr.",
  "ownAdp": 157.5,
  "ownCount": 2,
  "ownMin": 148,
  "ownMax": 167,
  "ownPicks": [
   {
    "pick": 148,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 167,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   }
  ],
  "fantraxAdp": 233,
  "team": "IND",
  "pos": "SF"
 },
 "khris middleton": {
  "name": "Khris Middleton",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "WAS",
  "pos": "SF"
 },
 "aj dybantsa": {
  "name": "AJ Dybantsa",
  "ownAdp": 105.8,
  "ownCount": 20,
  "ownMin": 87,
  "ownMax": 150,
  "ownPicks": [
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 117,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 150,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   }
  ],
  "fantraxAdp": 102,
  "team": "WAS",
  "pos": "SF"
 },
 "desmond bane": {
  "name": "Desmond Bane",
  "ownAdp": 46.3,
  "ownCount": 25,
  "ownMin": 29,
  "ownMax": 58,
  "ownPicks": [
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   }
  ],
  "fantraxAdp": 47,
  "team": "ORL",
  "pos": "SG"
 },
 "kingston flemings": {
  "name": "Kingston Flemings",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 240,
  "team": "ATL",
  "pos": "PG"
 },
 "julian champagnie": {
  "name": "Julian Champagnie",
  "ownAdp": 151.7,
  "ownCount": 3,
  "ownMin": 150,
  "ownMax": 154,
  "ownPicks": [
   {
    "pick": 150,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 151,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 154,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   }
  ],
  "fantraxAdp": 225,
  "team": "SA",
  "pos": "SF"
 },
 "kristaps porzingis": {
  "name": "Kristaps Porzingis",
  "ownAdp": 117.4,
  "ownCount": 16,
  "ownMin": 91,
  "ownMax": 153,
  "ownPicks": [
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 117,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 121,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 125,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 132,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 139,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 150,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 153,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   }
  ],
  "fantraxAdp": 110,
  "team": "GS",
  "pos": "C"
 },
 "kyle kuzma": {
  "name": "Kyle Kuzma",
  "ownAdp": 141.0,
  "ownCount": 1,
  "ownMin": 141,
  "ownMax": 141,
  "ownPicks": [
   {
    "pick": 141,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 238,
  "team": "MIL",
  "pos": "PF"
 },
 "ron holland": {
  "name": "Ron Holland",
  "ownAdp": 156.0,
  "ownCount": 2,
  "ownMin": 152,
  "ownMax": 160,
  "ownPicks": [
   {
    "pick": 152,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 160,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   }
  ],
  "fantraxAdp": 237,
  "team": "DET",
  "pos": "SF"
 },
 "lebron james": {
  "name": "LeBron James",
  "ownAdp": 56.4,
  "ownCount": 25,
  "ownMin": 36,
  "ownMax": 77,
  "ownPicks": [
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   }
  ],
  "fantraxAdp": 57,
  "team": "(N/A)",
  "pos": "SF"
 },
 "nique clifford": {
  "name": "Nique Clifford",
  "ownAdp": 115.2,
  "ownCount": 11,
  "ownMin": 70,
  "ownMax": 144,
  "ownPicks": [
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 118,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 120,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 129,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 134,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 144,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   }
  ],
  "fantraxAdp": 211,
  "team": "SAC",
  "pos": "SG"
 },
 "duncan robinson": {
  "name": "Duncan Robinson",
  "ownAdp": 138.0,
  "ownCount": 1,
  "ownMin": 138,
  "ownMax": 138,
  "ownPicks": [
   {
    "pick": 138,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   }
  ],
  "fantraxAdp": 242,
  "team": "DET",
  "pos": "SF"
 },
 "scotty pippen": {
  "name": "Scotty Pippen",
  "ownAdp": 154.2,
  "ownCount": 8,
  "ownMin": 147,
  "ownMax": 168,
  "ownPicks": [
   {
    "pick": 147,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 147,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 149,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 149,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 155,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 156,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 163,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 168,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   }
  ],
  "fantraxAdp": 195,
  "team": "MEM",
  "pos": "PG"
 },
 "trae young": {
  "name": "Trae Young",
  "ownAdp": 22.8,
  "ownCount": 28,
  "ownMin": 10,
  "ownMax": 35,
  "ownPicks": [
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   }
  ],
  "fantraxAdp": 22,
  "team": "WAS",
  "pos": "PG"
 },
 "nicolas claxton": {
  "name": "Nicolas Claxton",
  "ownAdp": 101.8,
  "ownCount": 20,
  "ownMin": 84,
  "ownMax": 120,
  "ownPicks": [
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 118,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 120,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   }
  ],
  "fantraxAdp": 99,
  "team": "CHI",
  "pos": "C"
 },
 "pelle larsson": {
  "name": "Pelle Larsson",
  "ownAdp": 153.0,
  "ownCount": 9,
  "ownMin": 143,
  "ownMax": 166,
  "ownPicks": [
   {
    "pick": 143,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 145,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 145,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 147,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 148,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 160,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 161,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 162,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 166,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   }
  ],
  "fantraxAdp": 170,
  "team": "MIA",
  "pos": "SG"
 },
 "sam hauser": {
  "name": "Sam Hauser",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "BOS",
  "pos": "PF"
 },
 "tyler herro": {
  "name": "Tyler Herro",
  "ownAdp": 61.2,
  "ownCount": 24,
  "ownMin": 40,
  "ownMax": 83,
  "ownPicks": [
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   }
  ],
  "fantraxAdp": 61,
  "team": "MIL",
  "pos": "SG"
 },
 "nickeil alexanderwalker": {
  "name": "Nickeil Alexander-Walker",
  "ownAdp": 47.8,
  "ownCount": 25,
  "ownMin": 29,
  "ownMax": 65,
  "ownPicks": [
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 51,
  "team": "ATL",
  "pos": "SG"
 },
 "deandre ayton": {
  "name": "Deandre Ayton",
  "ownAdp": 144.4,
  "ownCount": 5,
  "ownMin": 132,
  "ownMax": 161,
  "ownPicks": [
   {
    "pick": 132,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 134,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 146,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 149,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 161,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   }
  ],
  "fantraxAdp": 212,
  "team": "WAS",
  "pos": "C"
 },
 "karlo matkovic": {
  "name": "Karlo Matkovic",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 243,
  "team": "NO",
  "pos": "PF"
 },
 "myles turner": {
  "name": "Myles Turner",
  "ownAdp": 83.2,
  "ownCount": 21,
  "ownMin": 66,
  "ownMax": 99,
  "ownPicks": [
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   }
  ],
  "fantraxAdp": 86,
  "team": "MIL",
  "pos": "C"
 },
 "jamal murray": {
  "name": "Jamal Murray",
  "ownAdp": 20.2,
  "ownCount": 28,
  "ownMin": 11,
  "ownMax": 31,
  "ownPicks": [
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   }
  ],
  "fantraxAdp": 21,
  "team": "DEN",
  "pos": "PG"
 },
 "nikola jovic": {
  "name": "Nikola Jovic",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "MIA",
  "pos": "PF"
 },
 "bradley beal": {
  "name": "Bradley Beal",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 242,
  "team": "LAC",
  "pos": "SG"
 },
 "reed sheppard": {
  "name": "Reed Sheppard",
  "ownAdp": 107.5,
  "ownCount": 17,
  "ownMin": 91,
  "ownMax": 130,
  "ownPicks": [
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 117,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 119,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 120,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 127,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 130,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   }
  ],
  "fantraxAdp": 116,
  "team": "HOU",
  "pos": "PG"
 },
 "andre drummond": {
  "name": "Andre Drummond",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 243,
  "team": "NY",
  "pos": "C"
 },
 "gui santos": {
  "name": "Gui Santos",
  "ownAdp": 161.5,
  "ownCount": 2,
  "ownMin": 160,
  "ownMax": 163,
  "ownPicks": [
   {
    "pick": 160,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 163,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   }
  ],
  "fantraxAdp": 200,
  "team": "GS",
  "pos": "PF"
 },
 "jalen brunson": {
  "name": "Jalen Brunson",
  "ownAdp": 32.2,
  "ownCount": 25,
  "ownMin": 17,
  "ownMax": 48,
  "ownPicks": [
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   }
  ],
  "fantraxAdp": 32,
  "team": "NY",
  "pos": "PG"
 },
 "james harden": {
  "name": "James Harden",
  "ownAdp": 26.0,
  "ownCount": 28,
  "ownMin": 13,
  "ownMax": 33,
  "ownPicks": [
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 20"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   }
  ],
  "fantraxAdp": 26,
  "team": "CLE",
  "pos": "PG"
 },
 "tyrese maxey": {
  "name": "Tyrese Maxey",
  "ownAdp": 6.4,
  "ownCount": 31,
  "ownMin": 1,
  "ownMax": 11,
  "ownPicks": [
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 20"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 19"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 18"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   }
  ],
  "fantraxAdp": 8,
  "team": "PHI",
  "pos": "PG"
 },
 "demar derozan": {
  "name": "DeMar DeRozan",
  "ownAdp": 143.2,
  "ownCount": 10,
  "ownMin": 122,
  "ownMax": 167,
  "ownPicks": [
   {
    "pick": 122,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 128,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 129,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 140,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 141,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 144,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 147,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 153,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 161,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 167,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   }
  ],
  "fantraxAdp": 141,
  "team": "(N/A)",
  "pos": "SF"
 },
 "quentin grimes": {
  "name": "Quentin Grimes",
  "ownAdp": 135.8,
  "ownCount": 11,
  "ownMin": 120,
  "ownMax": 154,
  "ownPicks": [
   {
    "pick": 120,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 126,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 127,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 132,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 135,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 135,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 137,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 141,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 142,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 145,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 154,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   }
  ],
  "fantraxAdp": 163,
  "team": "LAL",
  "pos": "SG"
 },
 "kevin durant": {
  "name": "Kevin Durant",
  "ownAdp": 17.4,
  "ownCount": 28,
  "ownMin": 7,
  "ownMax": 27,
  "ownPicks": [
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 17,
  "team": "HOU",
  "pos": "PF"
 },
 "santi aldama": {
  "name": "Santi Aldama",
  "ownAdp": 166.5,
  "ownCount": 2,
  "ownMin": 165,
  "ownMax": 168,
  "ownPicks": [
   {
    "pick": 165,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 168,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   }
  ],
  "fantraxAdp": 231,
  "team": "DAL",
  "pos": "PF"
 },
 "domantas sabonis": {
  "name": "Domantas Sabonis",
  "ownAdp": 44.7,
  "ownCount": 25,
  "ownMin": 23,
  "ownMax": 61,
  "ownPicks": [
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   }
  ],
  "fantraxAdp": 41,
  "team": "SAC",
  "pos": "C"
 },
 "alperen sengun": {
  "name": "Alperen Sengun",
  "ownAdp": 21.4,
  "ownCount": 28,
  "ownMin": 13,
  "ownMax": 37,
  "ownPicks": [
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 22,
  "team": "HOU",
  "pos": "C"
 },
 "andrew nembhard": {
  "name": "Andrew Nembhard",
  "ownAdp": 117.4,
  "ownCount": 16,
  "ownMin": 86,
  "ownMax": 158,
  "ownPicks": [
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 123,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 124,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 129,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 132,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 146,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 153,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 158,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 132,
  "team": "IND",
  "pos": "SG"
 },
 "jerami grant": {
  "name": "Jerami Grant",
  "ownAdp": 149.3,
  "ownCount": 3,
  "ownMin": 147,
  "ownMax": 153,
  "ownPicks": [
   {
    "pick": 147,
    "source": "Fantrax-Draft-Results-AUTO-hdvwmdermrfwbgdo"
   },
   {
    "pick": 148,
    "source": "Fantrax-Draft-Results-AUTO-emeu5xuymrh1a5id"
   },
   {
    "pick": 153,
    "source": "Fantrax-Draft-Results-AUTO-t6wu7qhgmrhrgajw"
   }
  ],
  "fantraxAdp": 216,
  "team": "MEM",
  "pos": "PF"
 },
 "lauri markkanen": {
  "name": "Lauri Markkanen",
  "ownAdp": 30.8,
  "ownCount": 25,
  "ownMin": 22,
  "ownMax": 40,
  "ownPicks": [
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   }
  ],
  "fantraxAdp": 34,
  "team": "UTA",
  "pos": "PF"
 },
 "toumani camara": {
  "name": "Toumani Camara",
  "ownAdp": 102.6,
  "ownCount": 20,
  "ownMin": 81,
  "ownMax": 128,
  "ownPicks": [
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 128,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 112,
  "team": "POR",
  "pos": "PF"
 },
 "dejounte murray": {
  "name": "Dejounte Murray",
  "ownAdp": 63.1,
  "ownCount": 25,
  "ownMin": 42,
  "ownMax": 79,
  "ownPicks": [
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   }
  ],
  "fantraxAdp": 58,
  "team": "NO",
  "pos": "PG"
 },
 "alex caruso": {
  "name": "Alex Caruso",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 243,
  "team": "OKC",
  "pos": "SG"
 },
 "morez johnson": {
  "name": "Morez Johnson",
  "ownAdp": 156.5,
  "ownCount": 2,
  "ownMin": 146,
  "ownMax": 167,
  "ownPicks": [
   {
    "pick": 146,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 167,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   }
  ],
  "fantraxAdp": 214,
  "team": "DAL",
  "pos": "PF"
 },
 "jay huff": {
  "name": "Jay Huff",
  "ownAdp": 139.7,
  "ownCount": 3,
  "ownMin": 123,
  "ownMax": 166,
  "ownPicks": [
   {
    "pick": 123,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 130,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 166,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   }
  ],
  "fantraxAdp": 225,
  "team": "IND",
  "pos": "C"
 },
 "jaylon tyson": {
  "name": "Jaylon Tyson",
  "ownAdp": 142.0,
  "ownCount": 6,
  "ownMin": 123,
  "ownMax": 155,
  "ownPicks": [
   {
    "pick": 123,
    "source": "Fantrax-Draft-Results-AUTO-2xpavvsdmrkgdwvm"
   },
   {
    "pick": 131,
    "source": "Fantrax-Draft-Results-AUTO-y2el57a9mrkgi9hu"
   },
   {
    "pick": 138,
    "source": "Fantrax-Draft-Results-AUTO-hdvwmdermrfwbgdo"
   },
   {
    "pick": 152,
    "source": "Fantrax-Draft-Results-AUTO-i4wkf62umrkds58d"
   },
   {
    "pick": 153,
    "source": "Fantrax-Draft-Results-AUTO-jkfwddasmrc2ubfh"
   },
   {
    "pick": 155,
    "source": "Fantrax-Draft-Results-AUTO-bbw1narimrkdo0xy"
   }
  ],
  "fantraxAdp": 227,
  "team": "CLE",
  "pos": "SG"
 },
 "alex sarr": {
  "name": "Alex Sarr",
  "ownAdp": 63.0,
  "ownCount": 25,
  "ownMin": 45,
  "ownMax": 81,
  "ownPicks": [
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   }
  ],
  "fantraxAdp": 62,
  "team": "WAS",
  "pos": "C"
 },
 "cj mccollum": {
  "name": "CJ McCollum",
  "ownAdp": 108.5,
  "ownCount": 17,
  "ownMin": 96,
  "ownMax": 128,
  "ownPicks": [
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 121,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 121,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 128,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   }
  ],
  "fantraxAdp": 118,
  "team": "ATL",
  "pos": "PG"
 },
 "victor wembanyama": {
  "name": "Victor Wembanyama",
  "ownAdp": 1.6,
  "ownCount": 31,
  "ownMin": 1,
  "ownMax": 3,
  "ownPicks": [
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 18"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 19"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 20"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   }
  ],
  "fantraxAdp": 2,
  "team": "SA",
  "pos": "C"
 },
 "cameron boozer": {
  "name": "Cameron Boozer",
  "ownAdp": 60.1,
  "ownCount": 25,
  "ownMin": 32,
  "ownMax": 83,
  "ownPicks": [
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   }
  ],
  "fantraxAdp": 59,
  "team": "MEM",
  "pos": "PF"
 },
 "maxime raynaud": {
  "name": "Maxime Raynaud",
  "ownAdp": 126.4,
  "ownCount": 16,
  "ownMin": 97,
  "ownMax": 142,
  "ownPicks": [
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 121,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 122,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 122,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 127,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 128,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 131,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 131,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 133,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 135,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 137,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 139,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 140,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 142,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   }
  ],
  "fantraxAdp": 129,
  "team": "SAC",
  "pos": "C"
 },
 "will riley": {
  "name": "Will Riley",
  "ownAdp": 150.0,
  "ownCount": 1,
  "ownMin": 150,
  "ownMax": 150,
  "ownPicks": [
   {
    "pick": 150,
    "source": "Fantrax-Draft-Results-AUTO-hdvwmdermrfwbgdo"
   }
  ],
  "fantraxAdp": 242,
  "team": "WAS",
  "pos": "SF"
 },
 "gary payton": {
  "name": "Gary Payton II",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 243,
  "team": "GS",
  "pos": "SG"
 },
 "nikola jokic": {
  "name": "Nikola Jokic",
  "ownAdp": 1.6,
  "ownCount": 31,
  "ownMin": 1,
  "ownMax": 3,
  "ownPicks": [
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 19"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 20"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 1,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 18"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 2,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 3,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   }
  ],
  "fantraxAdp": 2,
  "team": "DEN",
  "pos": "C"
 },
 "tim hardaway": {
  "name": "Tim Hardaway",
  "ownAdp": 165.0,
  "ownCount": 1,
  "ownMin": 165,
  "ownMax": 165,
  "ownPicks": [
   {
    "pick": 165,
    "source": "Fantrax-Draft-Results-AUTO-amyt53qkmrh14vqu"
   }
  ],
  "fantraxAdp": 240,
  "team": "MIA",
  "pos": "SG"
 },
 "ty jerome": {
  "name": "Ty Jerome",
  "ownAdp": 91.0,
  "ownCount": 21,
  "ownMin": 62,
  "ownMax": 136,
  "ownPicks": [
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 136,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   }
  ],
  "fantraxAdp": 91,
  "team": "MEM",
  "pos": "SG"
 },
 "coby white": {
  "name": "Coby White",
  "ownAdp": 88.2,
  "ownCount": 23,
  "ownMin": 72,
  "ownMax": 101,
  "ownPicks": [
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 84,
  "team": "CHA",
  "pos": "SG"
 },
 "donovan clingan": {
  "name": "Donovan Clingan",
  "ownAdp": 52.0,
  "ownCount": 25,
  "ownMin": 39,
  "ownMax": 65,
  "ownPicks": [
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   }
  ],
  "fantraxAdp": 51,
  "team": "POR",
  "pos": "C"
 },
 "stephon castle": {
  "name": "Stephon Castle",
  "ownAdp": 59.0,
  "ownCount": 25,
  "ownMin": 38,
  "ownMax": 84,
  "ownPicks": [
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   }
  ],
  "fantraxAdp": 60,
  "team": "SA",
  "pos": "PG"
 },
 "derrick jones": {
  "name": "Derrick Jones",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 243,
  "team": "LAC",
  "pos": "SF"
 },
 "rj barrett": {
  "name": "RJ Barrett",
  "ownAdp": 113.3,
  "ownCount": 20,
  "ownMin": 65,
  "ownMax": 140,
  "ownPicks": [
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 120,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 120,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 120,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 122,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 123,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 129,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 130,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 130,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 133,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 135,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 136,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 140,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 124,
  "team": "TOR",
  "pos": "SF"
 },
 "collin murrayboyles": {
  "name": "Collin Murray-Boyles",
  "ownAdp": 113.4,
  "ownCount": 19,
  "ownMin": 80,
  "ownMax": 147,
  "ownPicks": [
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 117,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 118,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 121,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 122,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 128,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 129,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 134,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 147,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   }
  ],
  "fantraxAdp": 111,
  "team": "TOR",
  "pos": "PF"
 },
 "isaiah stewart": {
  "name": "Isaiah Stewart",
  "ownAdp": 157.5,
  "ownCount": 2,
  "ownMin": 157,
  "ownMax": 158,
  "ownPicks": [
   {
    "pick": 157,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 158,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   }
  ],
  "fantraxAdp": 219,
  "team": "MEM",
  "pos": "C"
 },
 "luke kornet": {
  "name": "Luke Kornet",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "SA",
  "pos": "C"
 },
 "jalen suggs": {
  "name": "Jalen Suggs",
  "ownAdp": 89.7,
  "ownCount": 22,
  "ownMin": 67,
  "ownMax": 116,
  "ownPicks": [
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   }
  ],
  "fantraxAdp": 90,
  "team": "ORL",
  "pos": "PG"
 },
 "brook lopez": {
  "name": "Brook Lopez",
  "ownAdp": 156.5,
  "ownCount": 2,
  "ownMin": 155,
  "ownMax": 158,
  "ownPicks": [
   {
    "pick": 155,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 158,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   }
  ],
  "fantraxAdp": 216,
  "team": "LAC",
  "pos": "C"
 },
 "chet holmgren": {
  "name": "Chet Holmgren",
  "ownAdp": 26.3,
  "ownCount": 27,
  "ownMin": 14,
  "ownMax": 41,
  "ownPicks": [
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   }
  ],
  "fantraxAdp": 25,
  "team": "OKC",
  "pos": "C"
 },
 "jaren jackson": {
  "name": "Jaren Jackson",
  "ownAdp": 44.4,
  "ownCount": 25,
  "ownMin": 28,
  "ownMax": 63,
  "ownPicks": [
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   }
  ],
  "fantraxAdp": 42,
  "team": "UTA",
  "pos": "C"
 },
 "tari eason": {
  "name": "Tari Eason",
  "ownAdp": 138.8,
  "ownCount": 15,
  "ownMin": 113,
  "ownMax": 162,
  "ownPicks": [
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 125,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 130,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 132,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 132,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 133,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 133,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 136,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 139,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 146,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 149,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 149,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 151,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 152,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 162,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   }
  ],
  "fantraxAdp": 137,
  "team": "HOU",
  "pos": "PF"
 },
 "dayron sharpe": {
  "name": "Day'Ron Sharpe",
  "ownAdp": 108.7,
  "ownCount": 20,
  "ownMin": 70,
  "ownMax": 131,
  "ownPicks": [
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 118,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 120,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 123,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 126,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 131,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   }
  ],
  "fantraxAdp": 103,
  "team": "BKN",
  "pos": "C"
 },
 "daniss jenkins": {
  "name": "Daniss Jenkins",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 241,
  "team": "DET",
  "pos": "PG"
 },
 "oliviermaxence prosper": {
  "name": "Olivier-Maxence Prosper",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "MEM",
  "pos": "PF"
 },
 "aj green": {
  "name": "AJ Green",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 243,
  "team": "MIL",
  "pos": "SG"
 },
 "miles bridges": {
  "name": "Miles Bridges",
  "ownAdp": 100.7,
  "ownCount": 22,
  "ownMin": 72,
  "ownMax": 126,
  "ownPicks": [
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 119,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 126,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   }
  ],
  "fantraxAdp": 103,
  "team": "PHO",
  "pos": "SF"
 },
 "jalen williams": {
  "name": "Jalen Williams",
  "ownAdp": 42.0,
  "ownCount": 26,
  "ownMin": 17,
  "ownMax": 59,
  "ownPicks": [
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   }
  ],
  "fantraxAdp": 38,
  "team": "OKC",
  "pos": "SG"
 },
 "cedric coward": {
  "name": "Cedric Coward",
  "ownAdp": 113.2,
  "ownCount": 18,
  "ownMin": 86,
  "ownMax": 148,
  "ownPicks": [
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 117,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 119,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 122,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 134,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 136,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 137,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 148,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   }
  ],
  "fantraxAdp": 111,
  "team": "MEM",
  "pos": "SG"
 },
 "cam spencer": {
  "name": "Cam Spencer",
  "ownAdp": 164.0,
  "ownCount": 1,
  "ownMin": 164,
  "ownMax": 164,
  "ownPicks": [
   {
    "pick": 164,
    "source": "Fantrax-Draft-Results-AUTO-amyt53qkmrh14vqu"
   }
  ],
  "fantraxAdp": 228,
  "team": "MEM",
  "pos": "SG"
 },
 "norman powell": {
  "name": "Norman Powell",
  "ownAdp": 92.8,
  "ownCount": 22,
  "ownMin": 68,
  "ownMax": 112,
  "ownPicks": [
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   }
  ],
  "fantraxAdp": 92,
  "team": "CHI",
  "pos": "SG"
 },
 "pascal siakam": {
  "name": "Pascal Siakam",
  "ownAdp": 55.3,
  "ownCount": 25,
  "ownMin": 39,
  "ownMax": 78,
  "ownPicks": [
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   }
  ],
  "fantraxAdp": 57,
  "team": "IND",
  "pos": "PF"
 },
 "paul reed": {
  "name": "Paul Reed",
  "ownAdp": 143.1,
  "ownCount": 15,
  "ownMin": 117,
  "ownMax": 162,
  "ownPicks": [
   {
    "pick": 117,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 125,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 128,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 132,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 133,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 143,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 143,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 147,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 149,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 150,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 152,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 153,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 155,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 158,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 162,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   }
  ],
  "fantraxAdp": 158,
  "team": "DET",
  "pos": "C"
 },
 "russell westbrook": {
  "name": "Russell Westbrook",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 243,
  "team": "(N/A)",
  "pos": "PG"
 },
 "saddiq bey": {
  "name": "Saddiq Bey",
  "ownAdp": 125.0,
  "ownCount": 14,
  "ownMin": 86,
  "ownMax": 152,
  "ownPicks": [
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 118,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 124,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 126,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 136,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 139,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 140,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 144,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 150,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 152,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 131,
  "team": "NO",
  "pos": "SF"
 },
 "carlton carrington": {
  "name": "Carlton Carrington",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 242,
  "team": "WAS",
  "pos": "PG"
 },
 "kon knueppel": {
  "name": "Kon Knueppel",
  "ownAdp": 44.7,
  "ownCount": 25,
  "ownMin": 30,
  "ownMax": 62,
  "ownPicks": [
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   }
  ],
  "fantraxAdp": 44,
  "team": "CHA",
  "pos": "SF"
 },
 "oso ighodaro": {
  "name": "Oso Ighodaro",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "PHO",
  "pos": "PF"
 },
 "damian lillard": {
  "name": "Damian Lillard",
  "ownAdp": 88.6,
  "ownCount": 22,
  "ownMin": 63,
  "ownMax": 112,
  "ownPicks": [
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 83,
  "team": "POR",
  "pos": "PG"
 },
 "ace bailey": {
  "name": "Ace Bailey",
  "ownAdp": 124.9,
  "ownCount": 14,
  "ownMin": 87,
  "ownMax": 155,
  "ownPicks": [
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 121,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 122,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 124,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 128,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 134,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 138,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 150,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 151,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 155,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   }
  ],
  "fantraxAdp": 136,
  "team": "UTA",
  "pos": "SF"
 },
 "joan beringer": {
  "name": "Joan Beringer",
  "ownAdp": 153.0,
  "ownCount": 2,
  "ownMin": 149,
  "ownMax": 157,
  "ownPicks": [
   {
    "pick": 149,
    "source": "Fantrax-Draft-Results-AUTO-kjuxwfi4mrh17ll1"
   },
   {
    "pick": 157,
    "source": "Fantrax-Draft-Results-AUTO-t6wu7qhgmrhrgajw"
   }
  ],
  "fantraxAdp": 204,
  "team": "MIN",
  "pos": "PF"
 },
 "jaylen brown": {
  "name": "Jaylen Brown",
  "ownAdp": 39.6,
  "ownCount": 25,
  "ownMin": 17,
  "ownMax": 60,
  "ownPicks": [
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   }
  ],
  "fantraxAdp": 43,
  "team": "PHI",
  "pos": "SF"
 },
 "andrew wiggins": {
  "name": "Andrew Wiggins",
  "ownAdp": 104.2,
  "ownCount": 20,
  "ownMin": 90,
  "ownMax": 142,
  "ownPicks": [
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 126,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 142,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   }
  ],
  "fantraxAdp": 107,
  "team": "MIA",
  "pos": "SF"
 },
 "josh giddey": {
  "name": "Josh Giddey",
  "ownAdp": 27.9,
  "ownCount": 28,
  "ownMin": 16,
  "ownMax": 40,
  "ownPicks": [
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 27,
  "team": "CHI",
  "pos": "PG"
 },
 "vj edgecombe": {
  "name": "VJ Edgecombe",
  "ownAdp": 75.7,
  "ownCount": 23,
  "ownMin": 45,
  "ownMax": 101,
  "ownPicks": [
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   }
  ],
  "fantraxAdp": 84,
  "team": "PHI",
  "pos": "SG"
 },
 "isaiah collier": {
  "name": "Isaiah Collier",
  "ownAdp": 168.0,
  "ownCount": 1,
  "ownMin": 168,
  "ownMax": 168,
  "ownPicks": [
   {
    "pick": 168,
    "source": "Fantrax-Draft-Results-AUTO-f4s6y7hlmrkduxh8"
   }
  ],
  "fantraxAdp": 236,
  "team": "UTA",
  "pos": "PG"
 },
 "deanthony melton": {
  "name": "De'Anthony Melton",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 233,
  "team": "GS",
  "pos": "PG"
 },
 "tyrese haliburton": {
  "name": "Tyrese Haliburton",
  "ownAdp": 11.7,
  "ownCount": 29,
  "ownMin": 7,
  "ownMax": 21,
  "ownPicks": [
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 20"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   }
  ],
  "fantraxAdp": 11,
  "team": "IND",
  "pos": "PG"
 },
 "ausar thompson": {
  "name": "Ausar Thompson",
  "ownAdp": 78.7,
  "ownCount": 25,
  "ownMin": 59,
  "ownMax": 98,
  "ownPicks": [
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   }
  ],
  "fantraxAdp": 84,
  "team": "DET",
  "pos": "SF"
 },
 "jalen johnson": {
  "name": "Jalen Johnson",
  "ownAdp": 9.1,
  "ownCount": 30,
  "ownMin": 5,
  "ownMax": 14,
  "ownPicks": [
   {
    "pick": 5,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 6,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 7,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 8,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 18"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 20"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 9,
  "team": "ATL",
  "pos": "SF"
 },
 "draymond green": {
  "name": "Draymond Green",
  "ownAdp": 149.4,
  "ownCount": 7,
  "ownMin": 128,
  "ownMax": 165,
  "ownPicks": [
   {
    "pick": 128,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 142,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 145,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 145,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 156,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 165,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 165,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 182,
  "team": "(N/A)",
  "pos": "PF"
 },
 "kyle filipowski": {
  "name": "Kyle Filipowski",
  "ownAdp": 152.4,
  "ownCount": 9,
  "ownMin": 135,
  "ownMax": 165,
  "ownPicks": [
   {
    "pick": 135,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 140,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 142,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 147,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 154,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 162,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 163,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 164,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 165,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   }
  ],
  "fantraxAdp": 199,
  "team": "UTA",
  "pos": "C"
 },
 "terrence shannon": {
  "name": "Terrence Shannon",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 242,
  "team": "MIN",
  "pos": "SG"
 },
 "mikal bridges": {
  "name": "Mikal Bridges",
  "ownAdp": 67.3,
  "ownCount": 25,
  "ownMin": 46,
  "ownMax": 89,
  "ownPicks": [
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 70,
  "team": "NY",
  "pos": "SF"
 },
 "grayson allen": {
  "name": "Grayson Allen",
  "ownAdp": 143.2,
  "ownCount": 6,
  "ownMin": 124,
  "ownMax": 164,
  "ownPicks": [
   {
    "pick": 124,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 132,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 142,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 146,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 151,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 164,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 158,
  "team": "CHA",
  "pos": "SG"
 },
 "marvin bagley": {
  "name": "Marvin Bagley",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "DEN",
  "pos": "PF"
 },
 "devin booker": {
  "name": "Devin Booker",
  "ownAdp": 24.0,
  "ownCount": 27,
  "ownMin": 13,
  "ownMax": 39,
  "ownPicks": [
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   }
  ],
  "fantraxAdp": 26,
  "team": "PHO",
  "pos": "SG"
 },
 "allen graves": {
  "name": "Allen Graves",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 243,
  "team": "TOR",
  "pos": "PF"
 },
 "ja morant": {
  "name": "Ja Morant",
  "ownAdp": 78.7,
  "ownCount": 22,
  "ownMin": 57,
  "ownMax": 119,
  "ownPicks": [
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 119,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   }
  ],
  "fantraxAdp": 80,
  "team": "POR",
  "pos": "PG"
 },
 "kelel ware": {
  "name": "Kel'el Ware",
  "ownAdp": 60.7,
  "ownCount": 23,
  "ownMin": 38,
  "ownMax": 97,
  "ownPicks": [
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   }
  ],
  "fantraxAdp": 59,
  "team": "MIL",
  "pos": "C"
 },
 "isaiah hartenstein": {
  "name": "Isaiah Hartenstein",
  "ownAdp": 98.3,
  "ownCount": 19,
  "ownMin": 65,
  "ownMax": 134,
  "ownPicks": [
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 98,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 134,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 100,
  "team": "OKC",
  "pos": "C"
 },
 "mark williams": {
  "name": "Mark Williams",
  "ownAdp": 113.4,
  "ownCount": 20,
  "ownMin": 91,
  "ownMax": 141,
  "ownPicks": [
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 117,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 118,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 123,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 125,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 132,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 136,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 141,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   }
  ],
  "fantraxAdp": 110,
  "team": "PHO",
  "pos": "C"
 },
 "paul george": {
  "name": "Paul George",
  "ownAdp": 80.1,
  "ownCount": 23,
  "ownMin": 64,
  "ownMax": 96,
  "ownPicks": [
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   }
  ],
  "fantraxAdp": 78,
  "team": "BOS",
  "pos": "PF"
 },
 "herbert jones": {
  "name": "Herbert Jones",
  "ownAdp": 148.0,
  "ownCount": 2,
  "ownMin": 133,
  "ownMax": 163,
  "ownPicks": [
   {
    "pick": 133,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 163,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   }
  ],
  "fantraxAdp": 211,
  "team": "NO",
  "pos": "SF"
 },
 "deaaron fox": {
  "name": "De'Aaron Fox",
  "ownAdp": 67.8,
  "ownCount": 25,
  "ownMin": 41,
  "ownMax": 92,
  "ownPicks": [
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   }
  ],
  "fantraxAdp": 72,
  "team": "SA",
  "pos": "PG"
 },
 "deni avdija": {
  "name": "Deni Avdija",
  "ownAdp": 37.2,
  "ownCount": 25,
  "ownMin": 20,
  "ownMax": 56,
  "ownPicks": [
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   }
  ],
  "fantraxAdp": 37,
  "team": "POR",
  "pos": "SF"
 },
 "zach edey": {
  "name": "Zach Edey",
  "ownAdp": 70.9,
  "ownCount": 24,
  "ownMin": 53,
  "ownMax": 90,
  "ownPicks": [
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 70,
  "team": "MEM",
  "pos": "C"
 },
 "tobias harris": {
  "name": "Tobias Harris",
  "ownAdp": 137.9,
  "ownCount": 8,
  "ownMin": 124,
  "ownMax": 164,
  "ownPicks": [
   {
    "pick": 124,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 129,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 130,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 138,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 138,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 140,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 140,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 164,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   }
  ],
  "fantraxAdp": 182,
  "team": "SA",
  "pos": "PF"
 },
 "matisse thybulle": {
  "name": "Matisse Thybulle",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "LAL",
  "pos": "SG"
 },
 "brandin podziemski": {
  "name": "Brandin Podziemski",
  "ownAdp": 130.6,
  "ownCount": 16,
  "ownMin": 113,
  "ownMax": 166,
  "ownPicks": [
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 119,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 121,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 122,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 126,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 126,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 130,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 132,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 135,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 135,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 135,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 138,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 138,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 139,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 166,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   }
  ],
  "fantraxAdp": 122,
  "team": "GS",
  "pos": "SG"
 },
 "nikola vucevic": {
  "name": "Nikola Vucevic",
  "ownAdp": 121.6,
  "ownCount": 5,
  "ownMin": 97,
  "ownMax": 155,
  "ownPicks": [
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 128,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 155,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   }
  ],
  "fantraxAdp": 197,
  "team": "ORL",
  "pos": "C"
 },
 "dylan harper": {
  "name": "Dylan Harper",
  "ownAdp": 91.1,
  "ownCount": 21,
  "ownMin": 61,
  "ownMax": 121,
  "ownPicks": [
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 118,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 121,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   }
  ],
  "fantraxAdp": 88,
  "team": "SA",
  "pos": "SG"
 },
 "mitchell robinson": {
  "name": "Mitchell Robinson",
  "ownAdp": 145.0,
  "ownCount": 3,
  "ownMin": 133,
  "ownMax": 163,
  "ownPicks": [
   {
    "pick": 133,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 139,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 163,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 192,
  "team": "BOS",
  "pos": "C"
 },
 "max christie": {
  "name": "Max Christie",
  "ownAdp": 160.0,
  "ownCount": 1,
  "ownMin": 160,
  "ownMax": 160,
  "ownPicks": [
   {
    "pick": 160,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 236,
  "team": "DAL",
  "pos": "SG"
 },
 "franz wagner": {
  "name": "Franz Wagner",
  "ownAdp": 57.8,
  "ownCount": 25,
  "ownMin": 41,
  "ownMax": 77,
  "ownPicks": [
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 59,
  "team": "ORL",
  "pos": "SF"
 },
 "kris dunn": {
  "name": "Kris Dunn",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 241,
  "team": "LAC",
  "pos": "PG"
 },
 "quinten post": {
  "name": "Quinten Post",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "MEM",
  "pos": "C"
 },
 "darryn peterson": {
  "name": "Darryn Peterson",
  "ownAdp": 116.4,
  "ownCount": 17,
  "ownMin": 87,
  "ownMax": 144,
  "ownPicks": [
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 118,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 121,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 126,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 128,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 139,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 139,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 141,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 144,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   }
  ],
  "fantraxAdp": 114,
  "team": "UTA",
  "pos": "SG"
 },
 "matas buzelis": {
  "name": "Matas Buzelis",
  "ownAdp": 57.7,
  "ownCount": 25,
  "ownMin": 44,
  "ownMax": 77,
  "ownPicks": [
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 62,
  "team": "CHI",
  "pos": "SF"
 },
 "john collins": {
  "name": "John Collins",
  "ownAdp": 108.4,
  "ownCount": 19,
  "ownMin": 96,
  "ownMax": 124,
  "ownPicks": [
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 117,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 118,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 119,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 124,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   }
  ],
  "fantraxAdp": 110,
  "team": "DET",
  "pos": "PF"
 },
 "immanuel quickley": {
  "name": "Immanuel Quickley",
  "ownAdp": 81.0,
  "ownCount": 22,
  "ownMin": 69,
  "ownMax": 96,
  "ownPicks": [
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   }
  ],
  "fantraxAdp": 81,
  "team": "TOR",
  "pos": "PG"
 },
 "hannes steinbach": {
  "name": "Hannes Steinbach",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 235,
  "team": "CHA",
  "pos": "PF"
 },
 "wendell carter": {
  "name": "Wendell Carter",
  "ownAdp": 136.6,
  "ownCount": 14,
  "ownMin": 102,
  "ownMax": 158,
  "ownPicks": [
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 106,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 117,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 139,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 143,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 143,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 145,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 145,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 145,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 153,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 153,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 157,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 158,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   }
  ],
  "fantraxAdp": 169,
  "team": "ORL",
  "pos": "C"
 },
 "jarace walker": {
  "name": "Jarace Walker",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "IND",
  "pos": "PF"
 },
 "khaman maluach": {
  "name": "Khaman Maluach",
  "ownAdp": 152.0,
  "ownCount": 1,
  "ownMin": 152,
  "ownMax": 152,
  "ownPicks": [
   {
    "pick": 152,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   }
  ],
  "fantraxAdp": 199,
  "team": "PHO",
  "pos": "C"
 },
 "jalen smith": {
  "name": "Jalen Smith",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 243,
  "team": "CHI",
  "pos": "C"
 },
 "paolo banchero": {
  "name": "Paolo Banchero",
  "ownAdp": 44.2,
  "ownCount": 25,
  "ownMin": 18,
  "ownMax": 68,
  "ownPicks": [
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   }
  ],
  "fantraxAdp": 48,
  "team": "ORL",
  "pos": "PF"
 },
 "obi toppin": {
  "name": "Obi Toppin",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "IND",
  "pos": "PF"
 },
 "cason wallace": {
  "name": "Cason Wallace",
  "ownAdp": 122.5,
  "ownCount": 19,
  "ownMin": 92,
  "ownMax": 159,
  "ownPicks": [
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 117,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 119,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 121,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 124,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 127,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 130,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 140,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 140,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 141,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 143,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 144,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 159,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 118,
  "team": "OKC",
  "pos": "SG"
 },
 "isaiah joe": {
  "name": "Isaiah Joe",
  "ownAdp": 155.0,
  "ownCount": 1,
  "ownMin": 155,
  "ownMax": 155,
  "ownPicks": [
   {
    "pick": 155,
    "source": "Fantrax-Draft-Results-AUTO-emeu5xuymrh1a5id"
   }
  ],
  "fantraxAdp": 237,
  "team": "DET",
  "pos": "SG"
 },
 "cameron carr": {
  "name": "Cameron Carr",
  "ownAdp": 161.0,
  "ownCount": 1,
  "ownMin": 161,
  "ownMax": 161,
  "ownPicks": [
   {
    "pick": 161,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   }
  ],
  "fantraxAdp": 243,
  "team": "LAL",
  "pos": "SG"
 },
 "anthony davis": {
  "name": "Anthony Davis",
  "ownAdp": 27.8,
  "ownCount": 26,
  "ownMin": 15,
  "ownMax": 40,
  "ownPicks": [
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 31,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   }
  ],
  "fantraxAdp": 28,
  "team": "WAS",
  "pos": "PF"
 },
 "michael porter": {
  "name": "Michael Porter",
  "ownAdp": 61.8,
  "ownCount": 25,
  "ownMin": 41,
  "ownMax": 86,
  "ownPicks": [
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 75,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 86,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   }
  ],
  "fantraxAdp": 64,
  "team": "BKN",
  "pos": "SF"
 },
 "fred vanvleet": {
  "name": "Fred VanVleet",
  "ownAdp": 111.4,
  "ownCount": 21,
  "ownMin": 74,
  "ownMax": 144,
  "ownPicks": [
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 102,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 109,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 119,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 120,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 122,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 123,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 136,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 137,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 143,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 144,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   }
  ],
  "fantraxAdp": 108,
  "team": "HOU",
  "pos": "PG"
 },
 "moritz wagner": {
  "name": "Moritz Wagner",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "BKN",
  "pos": "C"
 },
 "peyton watson": {
  "name": "Peyton Watson",
  "ownAdp": 115.8,
  "ownCount": 19,
  "ownMin": 87,
  "ownMax": 138,
  "ownPicks": [
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 99,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 117,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 119,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 119,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 123,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 124,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 125,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 127,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 128,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 136,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 138,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   }
  ],
  "fantraxAdp": 115,
  "team": "DEN",
  "pos": "SF"
 },
 "sam merrill": {
  "name": "Sam Merrill",
  "ownAdp": 121.0,
  "ownCount": 1,
  "ownMin": 121,
  "ownMax": 121,
  "ownPicks": [
   {
    "pick": 121,
    "source": "Fantrax-Draft-Results-AUTO-y2el57a9mrkgi9hu"
   }
  ],
  "fantraxAdp": 239,
  "team": "CLE",
  "pos": "SG"
 },
 "mikel brown": {
  "name": "Mikel Brown",
  "ownAdp": 147.2,
  "ownCount": 8,
  "ownMin": 124,
  "ownMax": 168,
  "ownPicks": [
   {
    "pick": 124,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 127,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 143,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 152,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 154,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 155,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 155,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 168,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 188,
  "team": "BKN",
  "pos": "PG"
 },
 "christian braun": {
  "name": "Christian Braun",
  "ownAdp": 159.6,
  "ownCount": 5,
  "ownMin": 154,
  "ownMax": 167,
  "ownPicks": [
   {
    "pick": 154,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 155,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 156,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 166,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 167,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   }
  ],
  "fantraxAdp": 187,
  "team": "DEN",
  "pos": "SG"
 },
 "stephen curry": {
  "name": "Stephen Curry",
  "ownAdp": 18.9,
  "ownCount": 28,
  "ownMin": 12,
  "ownMax": 28,
  "ownPicks": [
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 20,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 24,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 28,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   }
  ],
  "fantraxAdp": 19,
  "team": "GS",
  "pos": "PG"
 },
 "jakobe walter": {
  "name": "Ja'Kobe Walter",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 243,
  "team": "TOR",
  "pos": "SG"
 },
 "collin gillespie": {
  "name": "Collin Gillespie",
  "ownAdp": 137.0,
  "ownCount": 10,
  "ownMin": 115,
  "ownMax": 154,
  "ownPicks": [
   {
    "pick": 115,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 120,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 128,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 130,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 138,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 139,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 147,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 149,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 150,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 154,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   }
  ],
  "fantraxAdp": 137,
  "team": "PHO",
  "pos": "PG"
 },
 "rui hachimura": {
  "name": "Rui Hachimura",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 238,
  "team": "LAC",
  "pos": "PF"
 },
 "onyeka okongwu": {
  "name": "Onyeka Okongwu",
  "ownAdp": 49.2,
  "ownCount": 25,
  "ownMin": 32,
  "ownMax": 76,
  "ownPicks": [
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 45,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   }
  ],
  "fantraxAdp": 47,
  "team": "ATL",
  "pos": "C"
 },
 "mario hezonja": {
  "name": "Mario Hezonja",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "CLE",
  "pos": "PF"
 },
 "dylan cardwell": {
  "name": "Dylan Cardwell",
  "ownAdp": 159.0,
  "ownCount": 1,
  "ownMin": 159,
  "ownMax": 159,
  "ownPicks": [
   {
    "pick": 159,
    "source": "Fantrax-Draft-Results-AUTO-pct4k2a6mr9s4u1f"
   }
  ],
  "fantraxAdp": 243,
  "team": "SAC",
  "pos": "C"
 },
 "jared mccain": {
  "name": "Jared McCain",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 242,
  "team": "OKC",
  "pos": "SG"
 },
 "collin sexton": {
  "name": "Collin Sexton",
  "ownAdp": 132.3,
  "ownCount": 3,
  "ownMin": 93,
  "ownMax": 155,
  "ownPicks": [
   {
    "pick": 93,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 149,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 155,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   }
  ],
  "fantraxAdp": 221,
  "team": "LAL",
  "pos": "SG"
 },
 "donovan mitchell": {
  "name": "Donovan Mitchell",
  "ownAdp": 12.9,
  "ownCount": 29,
  "ownMin": 9,
  "ownMax": 19,
  "ownPicks": [
   {
    "pick": 9,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 10,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 11,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 20"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 12,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 13,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 14,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 15,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 17,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 19,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   }
  ],
  "fantraxAdp": 14,
  "team": "CLE",
  "pos": "SG"
 },
 "al horford": {
  "name": "Al Horford",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "GS",
  "pos": "C"
 },
 "ivica zubac": {
  "name": "Ivica Zubac",
  "ownAdp": 70.3,
  "ownCount": 24,
  "ownMin": 56,
  "ownMax": 90,
  "ownPicks": [
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 70,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 80,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 90,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   }
  ],
  "fantraxAdp": 68,
  "team": "IND",
  "pos": "C"
 },
 "julius randle": {
  "name": "Julius Randle",
  "ownAdp": 63.2,
  "ownCount": 25,
  "ownMin": 39,
  "ownMax": 83,
  "ownPicks": [
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 53,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 64,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 69,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 71,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 73,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 77,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 83,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   }
  ],
  "fantraxAdp": 66,
  "team": "BKN",
  "pos": "PF"
 },
 "taylor hendricks": {
  "name": "Taylor Hendricks",
  "ownAdp": 149.5,
  "ownCount": 2,
  "ownMin": 148,
  "ownMax": 151,
  "ownPicks": [
   {
    "pick": 148,
    "source": "Fantrax-Draft-Results-AUTO-jkfwddasmrc2ubfh"
   },
   {
    "pick": 151,
    "source": "Fantrax-Draft-Results-AUTO-2xpavvsdmrkgdwvm"
   }
  ],
  "fantraxAdp": 241,
  "team": "MEM",
  "pos": "PF"
 },
 "davion mitchell": {
  "name": "Davion Mitchell",
  "ownAdp": 137.0,
  "ownCount": 12,
  "ownMin": 101,
  "ownMax": 151,
  "ownPicks": [
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 131,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 136,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 137,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 141,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 141,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 143,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 148,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 148,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 151,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 151,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   }
  ],
  "fantraxAdp": 154,
  "team": "MIA",
  "pos": "PG"
 },
 "brandon miller": {
  "name": "Brandon Miller",
  "ownAdp": 44.3,
  "ownCount": 25,
  "ownMin": 35,
  "ownMax": 57,
  "ownPicks": [
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 38,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 42,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 44,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 50,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   }
  ],
  "fantraxAdp": 43,
  "team": "CHA",
  "pos": "SF"
 },
 "jose alvarado": {
  "name": "Jose Alvarado",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "NY",
  "pos": "PG"
 },
 "klay thompson": {
  "name": "Klay Thompson",
  "ownAdp": null,
  "ownCount": 0,
  "ownMin": null,
  "ownMax": null,
  "ownPicks": [],
  "fantraxAdp": 244,
  "team": "DAL",
  "pos": "SF"
 },
 "walter clayton": {
  "name": "Walter Clayton",
  "ownAdp": 154.0,
  "ownCount": 1,
  "ownMin": 154,
  "ownMax": 154,
  "ownPicks": [
   {
    "pick": 154,
    "source": "Fantrax-Draft-Results-AUTO-osd7cxhzmrhramh2"
   }
  ],
  "fantraxAdp": 242,
  "team": "MEM",
  "pos": "PG"
 },
 "egor demin": {
  "name": "Egor Demin",
  "ownAdp": 132.4,
  "ownCount": 15,
  "ownMin": 107,
  "ownMax": 164,
  "ownPicks": [
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 117,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 121,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 129,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 131,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 133,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 134,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 135,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 137,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 138,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 139,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 144,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 145,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 164,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   }
  ],
  "fantraxAdp": 141,
  "team": "BKN",
  "pos": "PG"
 },
 "bilal coulibaly": {
  "name": "Bilal Coulibaly",
  "ownAdp": 128.9,
  "ownCount": 8,
  "ownMin": 111,
  "ownMax": 140,
  "ownPicks": [
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 117,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 130,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 131,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 132,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 134,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 136,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 140,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   }
  ],
  "fantraxAdp": 185,
  "team": "WAS",
  "pos": "SF"
 },
 "jimmy butler": {
  "name": "Jimmy Butler",
  "ownAdp": 137.6,
  "ownCount": 8,
  "ownMin": 95,
  "ownMax": 163,
  "ownPicks": [
   {
    "pick": 95,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 123,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 125,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 130,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 146,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 159,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 160,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 163,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   }
  ],
  "fantraxAdp": 210,
  "team": "GS",
  "pos": "SF"
 },
 "austin reaves": {
  "name": "Austin Reaves",
  "ownAdp": 25.8,
  "ownCount": 28,
  "ownMin": 16,
  "ownMax": 37,
  "ownPicks": [
   {
    "pick": 16,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 18,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 16"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 21,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 22,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 15"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 23,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 17"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 25,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 26,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 27,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 29,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 30,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 32,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 37,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   }
  ],
  "fantraxAdp": 25,
  "team": "LAL",
  "pos": "SG"
 },
 "joel embiid": {
  "name": "Joel Embiid",
  "ownAdp": 57.5,
  "ownCount": 25,
  "ownMin": 34,
  "ownMax": 88,
  "ownPicks": [
   {
    "pick": 34,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 35,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 36,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 40,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 41,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 43,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 46,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 58,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 67,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 74,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 82,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   }
  ],
  "fantraxAdp": 60,
  "team": "PHI",
  "pos": "C"
 },
 "neemias queta": {
  "name": "Neemias Queta",
  "ownAdp": 113.8,
  "ownCount": 20,
  "ownMin": 84,
  "ownMax": 139,
  "ownPicks": [
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 100,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 101,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 104,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 105,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 112,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 118,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 122,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 123,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 126,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 128,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 129,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 131,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 139,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   }
  ],
  "fantraxAdp": 108,
  "team": "BOS",
  "pos": "C"
 },
 "zaccharie risacher": {
  "name": "Zaccharie Risacher",
  "ownAdp": 153.0,
  "ownCount": 2,
  "ownMin": 138,
  "ownMax": 168,
  "ownPicks": [
   {
    "pick": 138,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 168,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   }
  ],
  "fantraxAdp": 236,
  "team": "DAL",
  "pos": "SF"
 },
 "zion williamson": {
  "name": "Zion Williamson",
  "ownAdp": 82.1,
  "ownCount": 24,
  "ownMin": 54,
  "ownMax": 96,
  "ownPicks": [
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 54,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 72,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 76,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 78,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 79,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 81,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 84,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 85,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 87,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 88,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 89,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 91,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 92,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 94,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 96,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   }
  ],
  "fantraxAdp": 82,
  "team": "NO",
  "pos": "PF"
 },
 "darius garland": {
  "name": "Darius Garland",
  "ownAdp": 54.9,
  "ownCount": 25,
  "ownMin": 33,
  "ownMax": 68,
  "ownPicks": [
   {
    "pick": 33,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 39,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01(1)"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 01"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 47,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 48,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 49,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 51,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 13"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 12"
   },
   {
    "pick": 52,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 55,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 56,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 57,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 59,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 08"
   },
   {
    "pick": 60,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 61,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 62,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 14"
   },
   {
    "pick": 63,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 65,
    "source": "Fantrax-Draft-Results-FBI Draft Only POINTS 02"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 07"
   },
   {
    "pick": 66,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 68,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   }
  ],
  "fantraxAdp": 55,
  "team": "LAC",
  "pos": "PG"
 },
 "pj washington": {
  "name": "P.J. Washington",
  "ownAdp": 116.0,
  "ownCount": 17,
  "ownMin": 97,
  "ownMax": 154,
  "ownPicks": [
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 10"
   },
   {
    "pick": 97,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_05"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 07"
   },
   {
    "pick": 103,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 05"
   },
   {
    "pick": 107,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 08"
   },
   {
    "pick": 108,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_01"
   },
   {
    "pick": 110,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 06"
   },
   {
    "pick": 111,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 03"
   },
   {
    "pick": 113,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_04"
   },
   {
    "pick": 114,
    "source": "Fantrax-Draft-Results-FBI Draft Only ROTO 04"
   },
   {
    "pick": 116,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_06"
   },
   {
    "pick": 122,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 09"
   },
   {
    "pick": 125,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_03"
   },
   {
    "pick": 126,
    "source": "Fantrax-Draft-Results-FBI Draft Only H2H 11"
   },
   {
    "pick": 129,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_H2H_02"
   },
   {
    "pick": 137,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_01"
   },
   {
    "pick": 154,
    "source": "Fantrax-Draft-Results-FBI_Draft_Only_ROTO_02"
   }
  ],
  "fantraxAdp": 134,
  "team": "DAL",
  "pos": "PF"
 }
};
