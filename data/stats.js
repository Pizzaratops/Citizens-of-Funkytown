// ============================================================
//  DRAFT PICK VALUES
//  KTC-ähnlicher Algorithmus für 12-Team / 4-Runden Liga
//  Basis-Werte vom Rang-Äquivalent abgeleitet:
//    R1-early ≈ Ränge 5–15    (Ø ~1550)
//    R1-mid   ≈ Ränge 20–35   (Ø ~1100)
//    R1-late  ≈ Ränge 36–55   (Ø ~950)
//    R2-early ≈ Ränge 60–80   (Ø ~780)
//    ... etc.
//  Jahres-Discount: ×1.0 / ×0.82 / ×0.67 / ×0.55
// ============================================================

// Pick values calibrated so 2026 R1 early = 1016 = Cameron Boozer dynasty value
const PICK_VALUES = {
  "2026_R1_early":  678, "2026_R1_mid":  266, "2026_R1_late":  112,
  "2026_R2_early":   88, "2026_R2_mid":   60, "2026_R2_late":   35,
  "2026_R3_early":   30, "2026_R3_mid":   25, "2026_R3_late":   20,
  "2026_R4_early":   15, "2026_R4_mid":   10, "2026_R4_late":    5,
  "2027_R1_early":  550, "2027_R1_mid":  200, "2027_R1_late":  100,
  "2027_R2_early":   85, "2027_R2_mid":   55, "2027_R2_late":   30,
  "2027_R3_early":   25, "2027_R3_mid":   22, "2027_R3_late":   20,
  "2027_R4_early":   12, "2027_R4_mid":    8, "2027_R4_late":    4,
  "2028_R1_early":  506, "2028_R1_mid":  184, "2028_R1_late":   92,
  "2028_R2_early":   78, "2028_R2_mid":   50, "2028_R2_late":   27,
  "2028_R3_early":   23, "2028_R3_mid":   20, "2028_R3_late":   18,
  "2028_R4_early":   11, "2028_R4_mid":    7, "2028_R4_late":    3,
  "2029_R1_early":  467, "2029_R1_mid":  170, "2029_R1_late":   85,
  "2029_R2_early":   72, "2029_R2_mid":   46, "2029_R2_late":   25,
  "2029_R3_early":   21, "2029_R3_mid":   18, "2029_R3_late":   17,
  "2029_R4_early":   10, "2029_R4_mid":    6, "2029_R4_late":    3,
};


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

const PICK_POS_LABELS = {
  early: { label: 'Early', picks: 'Picks 1–4'  },
  mid:   { label: 'Mid',   picks: 'Picks 5–8'  },
  late:  { label: 'Late',  picks: 'Picks 9–12' },
};

// Baut Pick-Pool aus PICKS-Array mit echten Besitzern
function buildPickPool() {
  // Nicht mehr als "früh/mid/late"-Gruppen, sondern als individuelle Picks.
  // Wird nur noch intern benutzt — renderTradeList() filtert nach TT-Team.
  return PICKS.map(p => {
    const orig   = teamMap[p.originalOwner];
    const curr   = teamMap[p.currentOwner];
    const traded = p.originalOwner !== p.currentOwner;
    // F: slot-aware baseValue
    let pickRange = 'mid';
    if (p.slot != null) {
      if (p.slot <= 4)      pickRange = 'early';
      else if (p.slot <= 8) pickRange = 'mid';
      else                  pickRange = 'late';
    }
    const valKey = `${p.year}_R${p.round}_${pickRange}`;
    const baseValue = PICK_VALUES[valKey] || PICK_VALUES[`${p.year}_R${p.round}_mid`] || 0;
    return {
      isPick:         true,
      pickKey:        `${p.year}_R${p.round}_T${p.originalOwner}`,
      year:           p.year,
      round:          p.round,
      slot:           p.slot || null,
      pos:            pickRange,
      originalOwner:  p.originalOwner,
      currentOwner:   p.currentOwner,
      traded,
      note:           p.note || null,
      orig, curr,
      name:           `${p.year} R${p.round} · ${orig.name}`,
      displayName:    `${p.year} · Round ${p.round} (${orig.name})`,
      baseValue,
      owners:         [{ orig, curr, traded, note: p.note || null }],
      nba: '📋', rank: null, dob: null, owner: null, ownerId: null,
    };
  }).sort((a, b) =>
    a.year - b.year || a.round - b.round || a.originalOwner - b.originalOwner
  );
}

// Wert mit Mode-Anpassung
function pickTradeValue(pick, mode) {
  let val = pick.baseValue;
  if (mode === 'winnow') {
    // Win-Now: nahe Picks stärker gewichtet
    const m = { 2026: 1.15, 2027: 1.00, 2028: 0.85, 2029: 0.70 };
    val = Math.round(val * (m[pick.year] || 0.65));
  } else if (mode === 'dynasty') {
    // Dynasty: zukünftige Picks leicht aufgewertet (Rebuild-Wert)
    const m = { 2026: 0.95, 2027: 1.00, 2028: 1.05, 2029: 1.08 };
    val = Math.round(val * (m[pick.year] || 1.00));
  }
  return val;
}

// Pick-Mode Toggle
function togglePickMode(side) {
  TRADE_STATE[side].showPicks = !TRADE_STATE[side].showPicks;
  const btn = document.getElementById('pickBtn' + side);
  if (btn) {
    btn.classList.toggle('active', TRADE_STATE[side].showPicks);
    btn.textContent = TRADE_STATE[side].showPicks ? '👤 Spieler anzeigen' : '📋 Picks anzeigen';
  }
  // Filter beim Wechsel zurücksetzen
  TRADE_STATE[side].nbaFilter = '';
  TRADE_STATE[side].ttFilter  = '';
  TRADE_STATE[side].search    = '';
  document.getElementById('tradeNbaFilter' + side).value = '';
  document.getElementById('tradeTTFilter'  + side).value = '';
  document.getElementById('tradeSearch'    + side).value = '';
  renderTradeList(side);
}

// Toggle für Pick-Auswahl
function toggleTradePick(side, pickKey) {
  const st   = TRADE_STATE[side];
  const pool = buildPickPool();
  const pick = pool.find(p => p.pickKey === pickKey);
  if (!pick) return;
  const idx = st.selected.findIndex(s => s.isPick && s.pickKey === pickKey);
  if (idx >= 0) { st.selected.splice(idx, 1); } else { st.selected.push(pick); }
  renderTradeList(side);
  renderSelectedPills(side);
  renderTradeResult();
}

function toggleTradePickDirect(side, key, year, round, originalOwner, currentOwner, baseVal, tradedStr, slot) {
  const st     = TRADE_STATE[side];
  const traded = tradedStr === 'true';
  const orig   = teamMap[originalOwner];
  const curr   = teamMap[currentOwner];
  const idx    = st.selected.findIndex(s => s.isPick && s.pickKey === key);

  if (idx >= 0) {
    st.selected.splice(idx, 1);
  } else {
    st.selected.push({
      isPick:        true,
      pickKey:       key,
      year, round,
      slot:          (slot === null || slot === 'null') ? null : slot,
      pos:           'mid',
      originalOwner, currentOwner,
      traded, orig, curr,
      name:          `${year} R${round} · ${orig.name}`,
      displayName:   `${year} · Round ${round}`,
      baseValue:     baseVal,
      owners:        [{ orig, curr, traded }],
      nba: '📋', rank: null, dob: null, owner: null, ownerId: null,
    });
  }

  renderTradeList(side);
  renderSelectedPills(side);
  renderTradeResult();
}

// Pick aus Auswahl entfernen
function removeTradePick(side, pickKey) {
  TRADE_STATE[side].selected = TRADE_STATE[side].selected.filter(
    s => !(s.isPick && s.pickKey === pickKey)
  );
  renderTradeList(side);
  renderSelectedPills(side);
  renderTradeResult();
}
