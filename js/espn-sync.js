// ============================================================
//  ESPN FANTASY SYNC
// ============================================================
const ESPN_LEAGUE_ID = 44361109;
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
// Mapping: ESPN-ID → unsere TT-ID. Taxi Squads (ESPN 12, 13) sind nicht gemappt
// und werden im Sync übersprungen.
const ESPN_TO_TT_TEAM = {
  1: 1,   // Bear Down            → Fighting Illini
  2: 2,   // Hospital Squad       → Seagulls
  4: 3,   // Neukoelln Hustlers   → Neukoelln Hustlers
  7: 4,   // Leaveland Cavaliers  → Leaveland Cavaliers
  5: 5,   // Anadolu Ballers      → Anadolu Ballers
  11: 6,  // 3-POINT MAFIA        → 3-POINT MAFIA
  8: 7,   // Always Money         → Always Money In The BananaStand
  10: 8,  // Kawhi So Serious     → Kawhi So Serious
  6: 9,   // Cooking Show         → Cooking Show
  14: 10, // S-Town Grizzlies     → S-Town Grizzlies
  3: 11,  // Double Dribble Tr.   → Double Dribble Trouble
  9: 12,  // Vancouver Curry-Wurst→ Vancouver Curry-Wurst
  // ESPN 12 + 13 = Taxi Squads → ignorieren
};
