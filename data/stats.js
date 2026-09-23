// ============================================================
//  SEASON STATS 2025-26  (per week = total / 20 matchup weeks)
//  FG% and FT% are season averages (not per-week)
//  Cats: fg, ft, 3pm, reb, ast, stl, blk, to, pts
// ============================================================
const SEASON_STATS = {
  1:  {fg:0.4959,ft:0.7928,"3pm":85.3,reb:404.9,ast:287.1,stl:72.4,blk:38.0,to:132.5,pts:1058.2},
  2:  {fg:0.4755,ft:0.7889,"3pm":95.6,reb:290.8,ast:201.3,stl:55.6,blk:34.1,to:109.0,pts:834.2},
  3:  {fg:0.4801,ft:0.8095,"3pm":82.8,reb:269.8,ast:169.2,stl:46.1,blk:28.5,to:82.2, pts:771.5},
  4:  {fg:0.4746,ft:0.7921,"3pm":79.6,reb:256.6,ast:163.8,stl:51.4,blk:24.7,to:78.3, pts:729.0},
  5:  {fg:0.4626,ft:0.8056,"3pm":89.8,reb:260.5,ast:147.1,stl:50.4,blk:29.4,to:82.5, pts:706.9},
  6:  {fg:0.4762,ft:0.7550,"3pm":71.8,reb:264.1,ast:133.8,stl:41.4,blk:31.7,to:74.4, pts:637.4},
  7:  {fg:0.4773,ft:0.7668,"3pm":72.0,reb:246.7,ast:150.2,stl:42.2,blk:32.7,to:72.3, pts:643.9},
  8:  {fg:0.4644,ft:0.8127,"3pm":90.2,reb:257.7,ast:175.9,stl:40.2,blk:24.6,to:90.6, pts:792.2},
  9:  {fg:0.4697,ft:0.7732,"3pm":74.6,reb:252.2,ast:116.0,stl:47.2,blk:34.4,to:78.6, pts:665.5},
  10: {fg:0.4702,ft:0.8114,"3pm":70.3,reb:198.8,ast:136.1,stl:49.0,blk:18.2,to:67.2, pts:605.4},
  11: {fg:0.4648,ft:0.7745,"3pm":58.0,reb:169.6,ast:111.7,stl:35.6,blk:22.3,to:57.7, pts:474.9},
  12: {fg:0.4681,ft:0.7494,"3pm":60.8,reb:167.7,ast:123.1,stl:37.0,blk:17.9,to:62.8, pts:487.6},
};

// Maps AN_CATS keys to SEASON_STATS keys
const AN_CAT_TO_SEASON = {
  pV:'pts', '3V':'3pm', rV:'reb', aV:'ast', sV:'stl', bV:'blk', fgV:'fg', ftV:'ft', toV:'to'
};

// Format a season stat value nicely for display
function fmtSeasonStat(cat, val) {
  if (cat === 'fgV' || cat === 'ftV') return (val * 100).toFixed(1) + '%';
  if (cat === 'toV') return val.toFixed(1) + ' TO/wk'; // lower is better
  return val.toFixed(1) + '/wk';
}
