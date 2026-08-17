// ============================================================
//  ESPN FANTASY SYNC
// ============================================================
const ESPN_LEAGUE_ID = 15679;
// ESPN nutzt das END-Jahr der Saison als ID:
// 2024/25 → 2025, 2025/26 → 2026, 2026/27 → 2027.
// Bei Saisonwechsel hier hochzählen.
const ESPN_SEASON    = 2027;

const ESPN_POS_MAP = {
  1:'PG', 2:'SG', 3:'SF', 4:'PF', 5:'C', 6:'C', 11:'PG',
  12:'SG', 13:'SF', 14:'PF', 15:'C', 0:'SF'
};

const ESPN_NBA_MAP = {
  1:'ATL',2:'BOS',3:'NOR',4:'CHI',5:'CLE',6:'DAL',7:'DEN',8:'DET',
  9:'GSW',10:'HOU',11:'IND',12:'LAC',13:'LAL',14:'MIA',15:'MIL',
  16:'MIN',17:'BKN',18:'NYK',19:'ORL',20:'PHI',21:'PHO',22:'POR',
  23:'SAC',24:'SAS',25:'OKC',26:'UTA',27:'WAS',28:'TOR',29:'MEM',
  33:'UTA',38:'NOR',40:'WAS',41:'CHA',
};

// ESPN-Team-IDs weichen von unseren internen Team-IDs (TEAMS in teams-rosters.js) ab.
// Mapping: ESPN-ID → unsere TT-ID (Liga 15679, Stand 17.08.2026).
const ESPN_TO_TT_TEAM = {
  2:  1,  // Fighting Illini            → Fighting Illini
  3:  2,  // Team Chewbuckets           → Team Chewbuckets
  4:  3,  // German Wunderkinder        → German Wunderkinder
  5:  4,  // Gewürz Jürgchens           → Gewürz Jürgchens
  6:  5,  // Team Peterson              → Team Peterson
  8:  6,  // Cook Island Airballers     → Cook Island Airballers
  9:  7,  // Crackpistel Baller         → Crackpistel Baller
  10: 8,  // Isaac's Falling Fruits     → Isaac's Falling Fruits
  11: 9,  // Greifswald SG Gerstensaft  → Greifswald SG Gerstensaft
  13: 10, // Wedding Bobcats            → Wedding Bobcats
  14: 11, // Juicetown Farmers          → Juicetown Farmers
  15: 12, // Lokomotive List            → Lokomotive List
};
