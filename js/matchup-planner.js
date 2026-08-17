// ============================================================
//  MATCHUP PLANER
// ============================================================
//  Seite #matchupPage. Stellt zwei Liga-Kader ueber alle neun
//  Kategorien gegenueber und schaetzt, wie das H2H Duell ausgeht.
//
//  Datenquellen fuer die Statistik (beide liefern Pro-Spiel-Schnitte,
//  deshalb laesst sich direkt auf Rohwert-Ebene mischen statt auf
//  Rang-Ebene):
//
//    Rankings    — tatsaechlich gespielte Stats. Waehlbar:
//                  LIVESCORES_AGGREGATE.month["nba"] (juengster
//                  Stichtag), LAST_SEASON_STATS_2025_26 (Preseason)
//                  oder OFFSEASON_RANKINGS.
//    Projections — LIVE_PROJECTIONS (Baseline + Live Blend).
//
//  Die Basis-Knoepfe mischen beide Quellen pro Kategorie linear:
//    wert = w × Projection + (1 − w) × Ranking
//  Hat ein Spieler nur eine der beiden Quellen, wird diese allein
//  genommen (und im Raster entsprechend markiert).
//
//  SPIELPLAN
//  Anders als in der ersten Fassung steckt jetzt ein echter Spielplan
//  dahinter statt eines Pauschalwerts. Zwei ESPN-Abrufe:
//
//    1. Liga-Spielplan (?view=mMatchupScore&view=mSettings)
//       — welches Team spielt in Matchup-Woche N gegen welches
//       — welche Spieltage (scoringPeriods) zu Woche N gehoeren
//    2. NBA-Spielplan (?view=proTeamSchedules_{Saison})
//       — welches NBA-Team spielt an welchem Spieltag gegen wen
//
//  Daraus entsteht pro Team ein Raster: Zeile = Spieler, Spalte =
//  Wochentag. Jedes angesetzte Spiel ist anklickbar. Abwaehlen
//  entfernt genau dieses eine Spiel aus allen Summen.
//
//  BEWUSSTE GRENZE
//  Es gibt keine Tageslimits fuer Startaufstellungen. Alle
//  angehakten Spiele zaehlen, auch wenn an einem Tag mehr Spieler
//  antreten, als aufgestellt werden duerfen. Wer das abbilden will,
//  waehlt die ueberzaehligen Spiele selbst ab.
//
//  Genutzt wird _fetchEspnViaProxy() aus js/espn-trade-detect.js —
//  dieses Script muss deshalb vorher geladen sein.
// ============================================================

// ─── Kategorien ──────────────────────────────────────────────
//  cv = Variationskoeffizient, also die typische Streuung eines
//  Spielers von Spiel zu Spiel relativ zu seinem eigenen Schnitt.
//  Steals und Blocks schwanken bei kleinem Volumen prozentual am
//  staerksten, Punkte am wenigsten. Diese Werte steuern nur die
//  Win-Wahrscheinlichkeit, nicht die angezeigten Summen.
const MP_CATS = [
  { key:'pts',   label:'PTS', type:'count', cv:0.35, dec:0, z:'pts' },
  { key:'reb',   label:'REB', type:'count', cv:0.42, dec:0, z:'reb' },
  { key:'ast',   label:'AST', type:'count', cv:0.45, dec:0, z:'ast' },
  { key:'stl',   label:'STL', type:'count', cv:0.75, dec:1, z:'stl' },
  { key:'blk',   label:'BLK', type:'count', cv:0.85, dec:1, z:'blk' },
  { key:'tpm',   label:'3PM', type:'count', cv:0.60, dec:1, z:'tpm' },
  { key:'to',    label:'TO',  type:'count', cv:0.55, dec:1, z:'to', invert:true, note:'weniger ist besser' },
  { key:'fgPct', label:'FG%', type:'pct',   sd:2.2,  dec:1, z:'fgImpact' },
  { key:'ftPct', label:'FT%', type:'pct',   sd:4.0,  dec:1, z:'ftImpact' },
];

// Spaltenreihenfolge im Spielplan-Raster
const MP_GRID_CATS = ['fgPct','ftPct','tpm','pts','reb','ast','stl','blk','to'];

// Gewichte fuer die Spielerreihenfolge — identisch zu den Rolling
// Rankings, damit "meine besten Spieler" hier dasselbe heisst wie dort.
const MP_WEIGHTS = {
  pts:0.9, reb:1, ast:1, stl:0.75, blk:0.75, tpm:0.75,
  fgImpact:1, ftImpact:0.85, to:0.25,
};

const MP_DAYS = ['So','Mo','Di','Mi','Do','Fr','Sa'];

// ─── Zustand ─────────────────────────────────────────────────
const MP_STATE = {
  teamA: null,
  teamB: null,
  projWeight: 0.5,    // 0 = nur Rankings, 1 = nur Projections
  rankSourceId: null, // null = Quelle mit der besten Kaderabdeckung
  period: null,       // gewaehlte Matchup-Woche
  schedule: null,     // Liga-Spielplan  { season, ts, currentPeriod, matchups, matchupPeriods }
  nba: null,          // NBA-Spielplan   { season, ts, byTeam, spDate, gameCount }
  auto: true,         // Aufstellung automatisch je Spieltag fuellen
  off: {},            // abgewaehlte Spiele: "teamId::spielerkey::spieltag" → true
  index: null,        // Ergebnis von _mpBuildIndex()
};

const MP_SCHED_KEY = 'tthqMpSchedule';
const MP_NBA_KEY   = 'tthqMpNbaSchedule';
const MP_PREFS_KEY = 'tthqMpPrefs';

// ============================================================
//  1 — Statistik-Index
// ============================================================

function _mpNum(v) { const n = Number(v); return Number.isFinite(n) ? n : 0; }

// Vereinheitlicht beide Quellformate auf dieselben Feldnamen.
// Rankings-Quellen nutzen "to", LIVE_PROJECTIONS nutzt "tov".
function _mpShape(o) {
  if (!o) return null;
  return {
    min:   _mpNum(o.min),
    pts:   _mpNum(o.pts),
    reb:   _mpNum(o.reb),
    ast:   _mpNum(o.ast),
    stl:   _mpNum(o.stl),
    blk:   _mpNum(o.blk),
    tpm:   _mpNum(o.tpm),
    to:    _mpNum(o.to !== undefined ? o.to : o.tov),
    fgPct: _mpNum(o.fgPct),
    ftPct: _mpNum(o.ftPct),
  };
}

function _mpKey(name) {
  return (typeof normalizeName === 'function') ? normalizeName(name) : String(name || '').toLowerCase().trim();
}

function _mpAllRostered() {
  const src = (typeof ROSTERS !== 'undefined' && ROSTERS) ? ROSTERS : (typeof ROSTERS_LIVE !== 'undefined' ? ROSTERS_LIVE : {});
  const out = [];
  Object.keys(src).forEach(tid => {
    (src[tid] || []).forEach(p => out.push({ ...p, teamId: parseInt(tid, 10) }));
  });
  return out;
}

function _mpRoster(teamId) {
  const src = (typeof ROSTERS !== 'undefined' && ROSTERS) ? ROSTERS : (typeof ROSTERS_LIVE !== 'undefined' ? ROSTERS_LIVE : {});
  return (src[teamId] || []).map(p => ({ ...p }));
}

function _mpMeanSd(vals) {
  if (!vals.length) return { mean: 0, sd: 0 };
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const varr = vals.reduce((a, b) => a + (b - mean) * (b - mean), 0) / vals.length;
  return { mean, sd: Math.sqrt(varr) };
}

function _mpLatestRegSeason() {
  if (typeof LIVESCORES_AGGREGATE === 'undefined') return null;
  const byLeague = LIVESCORES_AGGREGATE.month && LIVESCORES_AGGREGATE.month['nba'];
  if (!byLeague) return null;
  const dates = Object.keys(byLeague).sort();
  if (!dates.length) return null;
  const snap = byLeague[dates[dates.length - 1]];
  if (!snap || !Array.isArray(snap.players) || !snap.players.length) return null;
  return { snap, date: dates[dates.length - 1] };
}

/**
 * Alle verfuegbaren Rankings-Quellen mit ihrer Abdeckung im Liga-Kader.
 *
 * Die Abdeckung ist der entscheidende Punkt: waehrend der Off-Season
 * ist die einzige "frische" Quelle die Summer League, in der fast nur
 * Rookies und Fringe-Spieler antreten. Ueber einen echten Liga-Kader
 * deckt sie kaum zehn Prozent ab, waehrend die Preseason-Stats
 * praktisch jeden Spieler kennen. Deshalb wird nicht stur nach
 * Aktualitaet sortiert, sondern die Quelle mit der besten Abdeckung
 * vorgewaehlt und die Abdeckung offen angezeigt.
 */
function _mpAvailableRankSources() {
  const rostered = new Set(_mpAllRostered().map(p => _mpKey(p.name)));
  const out = [];

  const reg = _mpLatestRegSeason();
  if (reg) {
    out.push({
      id: 'reg',
      label: `Reguläre Saison, Monatsfenster bis ${reg.date}`,
      short: 'Reg. Saison',
      players: reg.snap.players,
      leagueAvg: reg.snap.leagueAvg || { fg: 46, ft: 78 },
    });
  }
  if (typeof LAST_SEASON_STATS_2025_26 !== 'undefined' && LAST_SEASON_STATS_2025_26.length) {
    out.push({
      id: 'last',
      label: 'Preseason, komplette Saison 2025/26',
      short: 'Preseason',
      players: LAST_SEASON_STATS_2025_26,
      leagueAvg: { fg: 46.5, ft: 78 },
    });
  }
  if (typeof OFFSEASON_RANKINGS !== 'undefined' && OFFSEASON_RANKINGS.players && OFFSEASON_RANKINGS.players.length) {
    out.push({
      id: 'off',
      label: `Off Season, ${OFFSEASON_RANKINGS.windowStart} bis ${OFFSEASON_RANKINGS.windowEnd}`,
      short: 'Off Season',
      players: OFFSEASON_RANKINGS.players,
      leagueAvg: OFFSEASON_RANKINGS.leagueAvg || { fg: 43, ft: 71 },
    });
  }

  const total = rostered.size || 1;
  out.forEach(s => {
    const keys = new Set(s.players.map(p => _mpKey(p.name)));
    let hit = 0;
    rostered.forEach(k => { if (keys.has(k)) hit++; });
    s.covered = hit;
    s.coverage = hit / total;
  });
  return out;
}

function _mpRankingSource() {
  const all = _mpAvailableRankSources();
  if (!all.length) return null;
  if (MP_STATE.rankSourceId) {
    const hit = all.find(s => s.id === MP_STATE.rankSourceId);
    if (hit) return hit;
  }
  return all.slice().sort((a, b) => b.coverage - a.coverage)[0];
}

function _mpBuildIndex() {
  const rankSrc = _mpRankingSource();
  const rankMap = new Map();
  if (rankSrc) {
    rankSrc.players.forEach(p => {
      const k = _mpKey(p.name);
      if (k && !rankMap.has(k)) rankMap.set(k, _mpShape(p));
    });
  }

  const projMap = new Map();
  if (typeof LIVE_PROJECTIONS !== 'undefined') {
    Object.keys(LIVE_PROJECTIONS).forEach(name => {
      const k = _mpKey(name);
      if (k && !projMap.has(k)) projMap.set(k, _mpShape(LIVE_PROJECTIONS[name]));
    });
  }

  const w = MP_STATE.projWeight;
  const leagueAvg = (rankSrc && rankSrc.leagueAvg) || { fg: 46, ft: 78 };

  const pool = [];
  _mpAllRostered().forEach(p => {
    const k = _mpKey(p.name);
    const r = rankMap.get(k) || null;
    const j = projMap.get(k) || null;
    if (!r && !j) { pool.push({ ...p, key: k, stats: null, src: 'none' }); return; }
    let stats, src;
    if (r && j) {
      stats = {};
      Object.keys(r).forEach(f => { stats[f] = w * j[f] + (1 - w) * r[f]; });
      src = 'both';
    } else if (j) { stats = { ...j }; src = 'proj'; }
    else          { stats = { ...r }; src = 'rank'; }
    pool.push({ ...p, key: k, stats, src });
  });

  const withData = pool.filter(p => p.stats);
  const counting = ['pts','reb','ast','stl','blk','tpm','to'];
  const stat = {};
  counting.forEach(c => { stat[c] = _mpMeanSd(withData.map(p => p.stats[c])); });

  // FG und FT als Impact: Prozentabweichung gewichtet mit Volumen
  // (hier Minuten als Naeherung, weil die Rankings-Quellen keine
  // Wurfversuche mitliefern).
  const fgImp = withData.map(p => (p.stats.fgPct - leagueAvg.fg) / 100 * p.stats.min);
  const ftImp = withData.map(p => (p.stats.ftPct - leagueAvg.ft) / 100 * p.stats.min);
  stat.fgImpact = _mpMeanSd(fgImp);
  stat.ftImpact = _mpMeanSd(ftImp);

  withData.forEach(p => {
    const z = {};
    counting.forEach(c => { z[c] = stat[c].sd ? (p.stats[c] - stat[c].mean) / stat[c].sd : 0; });
    z.to = -z.to; // Ballverluste sind negativ zu werten
    z.fgImpact = stat.fgImpact.sd ? (((p.stats.fgPct - leagueAvg.fg) / 100 * p.stats.min) - stat.fgImpact.mean) / stat.fgImpact.sd : 0;
    z.ftImpact = stat.ftImpact.sd ? (((p.stats.ftPct - leagueAvg.ft) / 100 * p.stats.min) - stat.ftImpact.mean) / stat.ftImpact.sd : 0;
    p.z = z;
    p.composite = Object.keys(MP_WEIGHTS).reduce((s, c) => s + (z[c] || 0) * MP_WEIGHTS[c], 0);
  });
  pool.filter(p => !p.stats).forEach(p => { p.z = null; p.composite = null; });

  const byKey = new Map();
  pool.forEach(p => { if (!byKey.has(p.key)) byKey.set(p.key, p); });

  return {
    pool, byKey, leagueAvg,
    rankId: rankSrc ? rankSrc.id : null,
    rankLabel: rankSrc ? rankSrc.label : 'keine gespielten Stats verfügbar',
    rankShort: rankSrc ? rankSrc.short : 'keine',
    counts: {
      both: pool.filter(p => p.src === 'both').length,
      proj: pool.filter(p => p.src === 'proj').length,
      rank: pool.filter(p => p.src === 'rank').length,
      none: pool.filter(p => p.src === 'none').length,
      total: pool.length,
    },
  };
}

// ============================================================
//  2 — Spielplan
// ============================================================

// Datum eines Spieltags. Faellt an dem Tag ligaweit kein Spiel aus,
// steht kein Datum im Spielplan — dann vom naechstgelegenen bekannten
// Tag hochrechnen, weil Spieltage fortlaufende Kalendertage sind.
// Betrifft z.B. die All-Star-Pause und einzelne spielfreie Tage.
function _mpDateForSp(sp) {
  const nba = MP_STATE.nba;
  if (!nba || !nba.spDate) return null;
  if (nba.spDate[sp]) return new Date(nba.spDate[sp]);
  const known = Object.keys(nba.spDate).map(Number);
  if (!known.length) return null;
  let ref = known[0];
  known.forEach(k => { if (Math.abs(k - sp) < Math.abs(ref - sp)) ref = k; });
  return new Date(new Date(nba.spDate[ref]).getTime() + (sp - ref) * 86400000);
}

// Spieltage (scoringPeriods) der gewaehlten Matchup-Woche, mit Datum.
function _mpWeekDays() {
  const sc = MP_STATE.schedule, nba = MP_STATE.nba;
  if (!sc || !nba || !MP_STATE.period) return [];
  const sps = (sc.matchupPeriods && sc.matchupPeriods[MP_STATE.period]) || [];
  return sps.slice().sort((a, b) => a - b).map(sp => {
    const d = _mpDateForSp(sp);
    return {
      sp,
      iso: d ? d.toISOString() : null,
      dayLabel: d ? MP_DAYS[d.getDay()] : `T${sp}`,
      dateLabel: d ? `${d.getDate()}.${d.getMonth() + 1}.` : '',
    };
  });
}

// Startplaetze pro Spieltag aus den ESPN Liga-Einstellungen.
// lineupSlotCounts: Slot-ID → Anzahl. 12 = Bank, 13 = IR, beides
// zaehlt nicht als Startplatz.
const MP_BENCH_SLOTS = { 12: true, 13: true };
function _mpStarterSlots() {
  const sc = MP_STATE.schedule;
  const counts = sc && sc.lineupSlotCounts;
  if (!counts) return 10;   // ESPN-Standard fuer 9cat, falls nicht gelesen
  let n = 0;
  Object.keys(counts).forEach(slot => {
    if (!MP_BENCH_SLOTS[slot]) n += Number(counts[slot]) || 0;
  });
  return n > 0 ? n : 10;
}

// Angesetzte Spiele eines NBA-Teams, Spieltag → { opp, home }.
function _mpTeamGames(abbrev) {
  const nba = MP_STATE.nba;
  if (!nba || !abbrev) return {};
  return nba.byTeam[abbrev] || {};
}

function _mpOffKey(teamId, playerKey, sp) { return `${teamId}::${playerKey}::${sp}`; }

const _mpLastBreakdown = {};

function mpToggleGame(teamId, playerKey, sp) {
  _mpFreezeAuto();
  const k = _mpOffKey(teamId, playerKey, sp);
  if (MP_STATE.off[k]) delete MP_STATE.off[k];
  else MP_STATE.off[k] = true;
  _mpSavePrefs();
  mpRender();
}

// Ganze Spalte (Spieltag) eines Teams umschalten.
// Ausschalten heisst: alle Spiele dieses Tages raus. Wieder
// einschalten heisst NICHT alle Spieler aufstellen, sondern die
// automatische Auswahl fuer diesen Tag herstellen — sonst wuerde ein
// Doppelklick auf den Spaltenkopf plötzlich dreissig Spieler an einem
// Tag aufstellen und die Summen unbemerkt verdoppeln.
function mpToggleDay(teamId, sp) {
  const T = _mpLastBreakdown[teamId];
  if (!T) return;
  _mpFreezeAuto();
  const anyOn = T.players.some(p => p.games.some(g => g.sp === sp && !g.off));

  if (anyOn) {
    T.players.forEach(p => p.games.forEach(g => {
      if (g.sp === sp) MP_STATE.off[_mpOffKey(teamId, p.key, sp)] = true;
    }));
  } else {
    const day = T.days.find(d => d.sp === sp);
    const auto = _mpAutoOff(teamId, T.players, day ? [day] : []);
    T.players.forEach(p => p.games.forEach(g => {
      if (g.sp !== sp) return;
      const k = _mpOffKey(teamId, p.key, sp);
      if (auto[k]) MP_STATE.off[k] = true; else delete MP_STATE.off[k];
    }));
  }
  _mpSavePrefs();
  mpRender();
}

// Ganze Zeile (Spieler) umschalten.
function mpTogglePlayer(teamId, playerKey) {
  const T = _mpLastBreakdown[teamId];
  if (!T) return;
  const p = T.players.find(x => x.key === playerKey);
  if (!p || !p.games.length) return;
  _mpFreezeAuto();
  const anyOn = p.games.some(g => !g.off);
  p.games.forEach(g => {
    const k = _mpOffKey(teamId, playerKey, g.sp);
    if (anyOn) MP_STATE.off[k] = true; else delete MP_STATE.off[k];
  });
  _mpSavePrefs();
  mpRender();
}

// Zurueck zur automatischen Aufstellung.
function mpResetGames() {
  MP_STATE.auto = true;
  MP_STATE.off = {};
  _mpSavePrefs();
  mpRender();
}

// Alle angesetzten Spiele aktivieren, auch ueber die Startplaetze
// hinaus. Bewusst als eigener Knopf, weil die Summen dann hoeher
// ausfallen, als in einer Woche real erreichbar ist.
function mpActivateAll() {
  MP_STATE.auto = false;
  MP_STATE.off = {};
  _mpSavePrefs();
  mpRender();
}

// ============================================================
//  3 — Team-Auswertung
// ============================================================

/**
 * Baut die Spielerliste eines Teams samt angesetzter Spiele.
 *
 * WICHTIG: Die Kader in dieser Liga haben rund 30 Spieler. Waeren
 * pauschal alle angesetzten Spiele aktiv, kaeme fuer eine Woche
 * ungefaehr das Doppelte dessen heraus, was ein Team real erzielen
 * kann — man darf ja nur eine begrenzte Zahl Spieler pro Tag
 * aufstellen. Deshalb fuellt der Planer die Aufstellung standardmaessig
 * selbst: je Spieltag die besten verfuegbaren Spieler nach gewichtetem
 * Z-Score, bis die Startplaetze voll sind. Sobald von Hand geklickt
 * wird, friert dieser Stand ein und ab da gilt nur noch die eigene
 * Auswahl (MP_STATE.auto = false).
 */
function _mpTeamBreakdown(teamId, index) {
  const days = _mpWeekDays();
  const roster = _mpRoster(teamId);

  const players = roster.map(p => {
    const k = _mpKey(p.name);
    const hit = index.byKey.get(k);
    const sched = _mpTeamGames(p.team);
    const games = days
      .filter(d => sched[d.sp])
      .map(d => ({ sp: d.sp, opp: sched[d.sp].opp, home: sched[d.sp].home, off: false }));
    return {
      name: p.name, key: k, pos: p.pos, nbaTeam: p.team, inj: p.inj || null,
      stats: hit ? hit.stats : null,
      z: hit ? hit.z : null,
      composite: hit ? hit.composite : null,
      src: hit ? hit.src : 'none',
      games,
    };
  }).sort((a, b) => {
    // Spieler ohne Daten immer nach unten, sonst nach gewichtetem Z
    if ((a.composite === null) !== (b.composite === null)) return a.composite === null ? 1 : -1;
    return (b.composite || 0) - (a.composite || 0);
  });

  const offSet = MP_STATE.auto
    ? _mpAutoOff(teamId, players, days)
    : MP_STATE.off;

  players.forEach(p => {
    p.games.forEach(g => { g.off = !!offSet[_mpOffKey(teamId, p.key, g.sp)]; });
    p.played = p.games.filter(g => !g.off).length;
  });

  const totals = {};
  const sds = {};

  MP_CATS.filter(c => c.type === 'count').forEach(c => {
    let sum = 0, varSum = 0;
    players.forEach(p => {
      if (!p.stats || !p.played) return;
      const per = p.stats[c.key];
      sum += per * p.played;
      // Varianz der Wochensumme: n Spiele, je mit Standardabweichung
      // cv × Schnitt.
      varSum += p.played * Math.pow(c.cv * per, 2);
    });
    totals[c.key] = sum;
    sds[c.key] = Math.sqrt(varSum);
  });

  // Prozente nach Minuten mal Spielen gewichtet. Naeherung, weil die
  // Rankings-Quellen keine Wurfversuche mitliefern.
  let wSum = 0;
  players.forEach(p => { if (p.stats && p.played) wSum += p.stats.min * p.played; });
  ['fgPct','ftPct'].forEach(k => {
    if (!wSum) { totals[k] = 0; return; }
    totals[k] = players.reduce((s, p) =>
      (p.stats && p.played) ? s + p.stats[k] * p.stats.min * p.played : s, 0) / wSum;
  });
  sds.fgPct = MP_CATS.find(c => c.key === 'fgPct').sd;
  sds.ftPct = MP_CATS.find(c => c.key === 'ftPct').sd;

  const out = {
    teamId, players, days, totals, sds,
    gameCount: players.reduce((s, p) => s + p.played, 0),
    scheduledCount: players.reduce((s, p) => s + p.games.length, 0),
    activeCount: players.filter(p => p.stats && p.played).length,
    missingCount: players.filter(p => !p.stats).length,
    benchedCount: players.reduce((s, p) => s + p.games.filter(g => g.off).length, 0),
  };
  _mpLastBreakdown[teamId] = out;
  return out;
}

// Automatische Aufstellung: je Spieltag die besten Spieler nach
// gewichtetem Z-Score bis die Startplaetze voll sind, der Rest sitzt.
// Spieler ohne Datenquelle koennen nichts beitragen und sitzen immer.
function _mpAutoOff(teamId, players, days) {
  const slots = _mpStarterSlots();
  const off = {};
  days.forEach(d => {
    const cand = players
      .filter(p => p.stats && p.games.some(g => g.sp === d.sp))
      .sort((a, b) => b.composite - a.composite);
    cand.slice(slots).forEach(p => { off[_mpOffKey(teamId, p.key, d.sp)] = true; });
  });
  players.filter(p => !p.stats).forEach(p =>
    p.games.forEach(g => { off[_mpOffKey(teamId, p.key, g.sp)] = true; }));
  return off;
}

// Beim ersten Klick von Hand wird der automatische Stand eingefroren,
// sonst wuerde jede Aenderung sofort wieder ueberschrieben.
function _mpFreezeAuto() {
  if (!MP_STATE.auto) return;
  const days = _mpWeekDays();
  const frozen = {};
  [MP_STATE.teamA, MP_STATE.teamB].forEach(tid => {
    if (!tid) return;
    const T = _mpLastBreakdown[tid];
    if (!T) return;
    Object.assign(frozen, _mpAutoOff(tid, T.players, days));
  });
  MP_STATE.off = frozen;
  MP_STATE.auto = false;
}

// Normalverteilung, Abramowitz und Stegun 7.1.26
function _mpNormCdf(x) {
  const s = x < 0 ? -1 : 1;
  const z = Math.abs(x) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * z);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z);
  return 0.5 * (1 + s * y);
}

function _mpCompare(a, b) {
  const rows = MP_CATS.map(c => {
    const va = a.totals[c.key], vb = b.totals[c.key];
    const sd = Math.sqrt(a.sds[c.key] * a.sds[c.key] + b.sds[c.key] * b.sds[c.key]);
    let diff = va - vb;
    if (c.invert) diff = -diff;              // bei TO gewinnt der kleinere Wert
    const p = sd > 0 ? _mpNormCdf(diff / sd) : (diff > 0 ? 1 : diff < 0 ? 0 : 0.5);
    return { cat: c, va, vb, diff, prob: p };
  });
  const expA = rows.reduce((s, r) => s + r.prob, 0);
  return { rows, expA, expB: rows.length - expA };
}

// ============================================================
//  4 — ESPN Abrufe
// ============================================================

function _mpLoadCached(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (typeof ESPN_SEASON !== 'undefined' && obj.season !== ESPN_SEASON) return null;
    return obj;
  } catch (e) { return null; }
}

function _mpSave(key, obj) {
  try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) { /* Privatmodus oder Quota */ }
}

async function mpFetchSchedule() {
  const btn = document.getElementById('mpSchedBtn');
  const st  = document.getElementById('mpSchedStatus');
  if (typeof _fetchEspnViaProxy !== 'function') {
    if (st) { st.className = 'mp-status err'; st.textContent = 'ESPN Anbindung nicht geladen. Seite neu laden und noch einmal versuchen.'; }
    return;
  }
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Lade…'; }
  const say = (cls, txt) => { if (st) { st.className = 'mp-status ' + cls; st.textContent = txt; } };
  say('', 'Frage ESPN nach dem Liga-Spielplan…');

  const problems = [];

  // ── 1. Liga-Spielplan und Wocheneinteilung ────────────────
  try {
    const url = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/${ESPN_SEASON}/segments/0/leagues/${ESPN_LEAGUE_ID}?view=mMatchupScore&view=mSettings`;
    const data = await _fetchEspnViaProxy(url);

    const matchups = [];
    (data.schedule || []).forEach(m => {
      const h = ESPN_TO_TT_TEAM[m.home && m.home.teamId];
      const a = ESPN_TO_TT_TEAM[m.away && m.away.teamId];
      // Kein Mapping heisst Taxi Squad oder Freilos — beides ueberspringen.
      if (!h || !a) return;
      matchups.push({ period: m.matchupPeriodId, home: h, away: a, winner: m.winner || 'UNDECIDED' });
    });
    if (!matchups.length) throw new Error('keine verwertbaren Matchups');

    // scheduleSettings.matchupPeriods: Woche → Liste der Spieltage
    const raw = (data.settings && data.settings.scheduleSettings && data.settings.scheduleSettings.matchupPeriods) || {};
    const matchupPeriods = {};
    Object.keys(raw).forEach(k => {
      matchupPeriods[k] = Array.isArray(raw[k]) ? raw[k].map(Number) : [];
    });

    const lineupSlotCounts = (data.settings && data.settings.rosterSettings
      && data.settings.rosterSettings.lineupSlotCounts) || null;

    const obj = {
      season: ESPN_SEASON, ts: Date.now(),
      currentPeriod: (data.status && data.status.currentMatchupPeriod) || 1,
      matchups, matchupPeriods, lineupSlotCounts,
    };
    _mpSave(MP_SCHED_KEY, obj);
    MP_STATE.schedule = obj;
    say('', 'Liga-Spielplan da. Hole jetzt den NBA Spielplan…');
  } catch (err) {
    problems.push('Liga-Spielplan: ' + err.message);
  }

  // ── 2. NBA-Spielplan aller Pro-Teams ──────────────────────
  try {
    const url = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/${ESPN_SEASON}?view=proTeamSchedules_${ESPN_SEASON}`;
    const data = await _fetchEspnViaProxy(url);
    const proTeams = (data.settings && data.settings.proTeams) || [];

    const byTeam = {};   // Abkuerzung → { Spieltag: { opp, home } }
    const spDate = {};   // Spieltag → ISO-Datum
    let games = 0;

    proTeams.forEach(t => {
      if (!t || !t.id) return;                        // id 0 = Free Agents
      const ab = ESPN_NBA_MAP[t.id] || t.abbrev;
      if (!ab) return;
      const per = t.proGamesByScoringPeriod || {};
      Object.keys(per).forEach(sp => {
        (per[sp] || []).forEach(g => {
          const home = g.homeProTeamId === t.id;
          const oppId = home ? g.awayProTeamId : g.homeProTeamId;
          if (!byTeam[ab]) byTeam[ab] = {};
          byTeam[ab][sp] = { opp: ESPN_NBA_MAP[oppId] || '?', home };
          if (g.date && !spDate[sp]) spDate[sp] = new Date(g.date).toISOString();
          games++;
        });
      });
    });

    if (!games) throw new Error('ESPN liefert für diese Saison noch keine Spiele');

    const obj = { season: ESPN_SEASON, ts: Date.now(), byTeam, spDate, gameCount: games };
    _mpSave(MP_NBA_KEY, obj);
    MP_STATE.nba = obj;
  } catch (err) {
    problems.push('NBA Spielplan: ' + err.message);
  }

  // ── Rueckmeldung ──────────────────────────────────────────
  if (MP_STATE.schedule && MP_STATE.nba) {
    const weeks = new Set(MP_STATE.schedule.matchups.map(m => m.period)).size;
    say('ok', `✓ ${weeks} Wochen und ${MP_STATE.nba.gameCount} NBA Spiele geladen. Aktuell läuft Woche ${MP_STATE.schedule.currentPeriod}.`);
  } else if (problems.length) {
    say('err', 'Nicht alles geladen. ' + problems.join(' · '));
  }

  if (btn) { btn.disabled = false; btn.textContent = '↻ ESPN Spielplan laden'; }
  mpRenderWeekSelect();
  mpRender();
}

function mpRenderWeekSelect() {
  const sel = document.getElementById('mpWeekSelect');
  if (!sel) return;
  const sched = MP_STATE.schedule;
  const teamA = MP_STATE.teamA;

  if (!sched || !teamA) {
    sel.innerHTML = '<option value="">— Spielplan noch nicht geladen —</option>';
    sel.disabled = true;
    return;
  }

  const mine = sched.matchups
    .filter(m => m.home === teamA || m.away === teamA)
    .sort((a, b) => a.period - b.period);

  if (!mine.length) {
    sel.innerHTML = '<option value="">— keine Matchups für dieses Team —</option>';
    sel.disabled = true;
    return;
  }

  sel.disabled = false;
  sel.innerHTML = '<option value="">— Woche wählen —</option>' + mine.map(m => {
    const oppId = m.home === teamA ? m.away : m.home;
    const opp = teamMap[oppId];
    const cur = m.period === sched.currentPeriod ? ' ●' : '';
    const on = (MP_STATE.period === m.period && MP_STATE.teamB === oppId) ? ' selected' : '';
    return `<option value="${m.period}|${oppId}"${on}>Woche ${m.period} vs ${_mpEsc(opp ? opp.name : 'Team ' + oppId)}${cur}</option>`;
  }).join('');

  // Laufende Woche vorauswaehlen, wenn noch nichts gewaehlt wurde.
  if (!MP_STATE.period) {
    const cur = mine.find(m => m.period === sched.currentPeriod) || mine[0];
    if (cur) {
      const oppId = cur.home === teamA ? cur.away : cur.home;
      sel.value = `${cur.period}|${oppId}`;
      MP_STATE.period = cur.period;
      MP_STATE.teamB = oppId;
      const bSel = document.getElementById('mpTeamB');
      if (bSel) bSel.value = String(oppId);
    }
  }
}

function mpPickWeek() {
  const sel = document.getElementById('mpWeekSelect');
  if (!sel || !sel.value) return;
  const parts = sel.value.split('|');
  MP_STATE.period = parseInt(parts[0], 10);
  MP_STATE.teamB = parseInt(parts[1], 10);
  const bSel = document.getElementById('mpTeamB');
  if (bSel) bSel.value = String(MP_STATE.teamB);
  // Abwahlen gelten pro Woche, beim Wochenwechsel also zuruecksetzen.
  MP_STATE.off = {}; MP_STATE.auto = true;
  _mpSavePrefs();
  mpRender();
}

// ============================================================
//  5 — Steuerung
// ============================================================

function _mpEsc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function mpSetTeam(side) {
  const el = document.getElementById(side === 'a' ? 'mpTeamA' : 'mpTeamB');
  const v = el && el.value ? parseInt(el.value, 10) : null;
  if (side === 'a') { MP_STATE.teamA = v; MP_STATE.period = null; MP_STATE.off = {}; MP_STATE.auto = true; mpRenderWeekSelect(); }
  else              { MP_STATE.teamB = v; }
  _mpSavePrefs();
  mpRender();
}

function mpSetBasis(pct) {
  MP_STATE.projWeight = Math.max(0, Math.min(1, Number(pct) / 100));
  MP_STATE.index = null;   // Blend hat sich geaendert, Index neu bauen
  _mpMarkBasisButtons();
  _mpSavePrefs();
  mpRender();
}

function _mpMarkBasisButtons() {
  const cur = Math.round(MP_STATE.projWeight * 100);
  const btns = document.querySelectorAll('.mp-basis-btn');
  if (!btns || !btns.forEach) return;
  btns.forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.pct, 10) === cur);
  });
}

function mpSetRankSource(v) {
  MP_STATE.rankSourceId = v || null;
  MP_STATE.index = null;
  _mpSavePrefs();
  mpRender();
}

function mpFillRankSourceSelect() {
  const el = document.getElementById('mpRankSource');
  if (!el) return;
  const all = _mpAvailableRankSources();
  if (!all.length) {
    el.innerHTML = '<option value="">— keine gespielten Stats verfügbar —</option>';
    el.disabled = true;
    return;
  }
  const best = all.slice().sort((a, b) => b.coverage - a.coverage)[0];
  el.disabled = false;
  el.innerHTML = all
    .slice()
    .sort((a, b) => b.coverage - a.coverage)
    .map(s => {
      const auto = s.id === best.id ? ' · Standard' : '';
      const sel = MP_STATE.rankSourceId === s.id ? ' selected' : '';
      return `<option value="${s.id}"${sel}>${_mpEsc(s.short)} · deckt ${Math.round(s.coverage * 100)} % der Kader ab${auto}</option>`;
    }).join('');
  if (!MP_STATE.rankSourceId) el.value = best.id;
}

function _mpSavePrefs() {
  _mpSave(MP_PREFS_KEY, {
    season: typeof ESPN_SEASON !== 'undefined' ? ESPN_SEASON : null,
    teamA: MP_STATE.teamA, teamB: MP_STATE.teamB,
    projWeight: MP_STATE.projWeight,
    rankSourceId: MP_STATE.rankSourceId,
    period: MP_STATE.period,
    auto: MP_STATE.auto,
    off: MP_STATE.off,
  });
}

function _mpLoadPrefs() {
  const p = _mpLoadCached(MP_PREFS_KEY);
  if (!p) return;
  if (p.teamA) MP_STATE.teamA = p.teamA;
  if (p.teamB) MP_STATE.teamB = p.teamB;
  if (typeof p.projWeight === 'number') MP_STATE.projWeight = p.projWeight;
  if (p.rankSourceId) MP_STATE.rankSourceId = p.rankSourceId;
  if (p.period) MP_STATE.period = p.period;
  if (typeof p.auto === 'boolean') MP_STATE.auto = p.auto;
  if (p.off && typeof p.off === 'object') MP_STATE.off = p.off;
}

// ============================================================
//  6 — Rendering
// ============================================================

function mpRender() {
  const host = document.getElementById('mpResult');
  if (!host) return;

  if (!MP_STATE.teamA || !MP_STATE.teamB) {
    host.innerHTML = `<div class="mp-empty">Wähle oben Dein Team und den Gegner, oder lade den Spielplan aus ESPN und such Dir eine Woche aus.</div>`;
    return;
  }
  if (MP_STATE.teamA === MP_STATE.teamB) {
    host.innerHTML = `<div class="mp-empty">Beide Seiten zeigen auf dasselbe Team. Wähle einen anderen Gegner.</div>`;
    return;
  }

  const days = _mpWeekDays();
  if (!days.length) { host.innerHTML = _mpNoScheduleNotice(); return; }

  if (!MP_STATE.index) MP_STATE.index = _mpBuildIndex();
  const index = MP_STATE.index;

  const A = _mpTeamBreakdown(MP_STATE.teamA, index);
  const B = _mpTeamBreakdown(MP_STATE.teamB, index);
  const cmp = _mpCompare(A, B);

  const tA = teamMap[MP_STATE.teamA], tB = teamMap[MP_STATE.teamB];
  const winsA = cmp.rows.filter(r => r.prob > 0.5).length;

  let verdict;
  if (Math.abs(cmp.expA - cmp.expB) < 0.7) verdict = 'Sehr eng';
  else if (cmp.expA > cmp.expB) verdict = `${tA.name} vorn`;
  else verdict = `${tB.name} vorn`;

  const d0 = days[0], dN = days[days.length - 1];
  const span = (d0.dateLabel && dN.dateLabel) ? `${d0.dateLabel} bis ${dN.dateLabel}` : `${days.length} Spieltage`;

  host.innerHTML = `
    <div class="mp-scoreboard">
      <div class="mp-sb-team">
        <div class="mp-sb-name">${_mpEsc(tA.name)}</div>
        <div class="mp-sb-owner">${_mpEsc(tA.owner)} · ${A.gameCount} Spiele</div>
        <div class="mp-sb-score" style="color:${getTeamColor(tA)}">${cmp.expA.toFixed(1)}</div>
      </div>
      <div class="mp-sb-mid">
        <div class="mp-sb-verdict">Woche ${MP_STATE.period} · ${_mpEsc(span)}</div>
        <div class="mp-sb-dash">—</div>
        <div class="mp-sb-conf">${_mpEsc(verdict)}<br>Kategorien klar verteilt: ${winsA} zu ${9 - winsA}</div>
      </div>
      <div class="mp-sb-team right">
        <div class="mp-sb-name">${_mpEsc(tB.name)}</div>
        <div class="mp-sb-owner">${_mpEsc(tB.owner)} · ${B.gameCount} Spiele</div>
        <div class="mp-sb-score" style="color:${getTeamColor(tB)}">${cmp.expB.toFixed(1)}</div>
      </div>
    </div>

    <div class="mp-table-wrap">
      <table class="mp-table">
        <thead><tr>
          <th style="text-align:left;">Kategorie</th>
          <th>${_mpEsc(tA.name)}</th>
          <th>Verhältnis</th>
          <th>${_mpEsc(tB.name)}</th>
          <th>Chance ${_mpEsc(tA.owner)}</th>
        </tr></thead>
        <tbody>${cmp.rows.map(r => _mpRow(r, tA, tB)).join('')}</tbody>
      </table>
    </div>

    <div class="mp-grid-tools">
      <span class="mp-grid-tip">
        ${MP_STATE.auto
          ? `Aufstellung automatisch gefüllt: je Spieltag die besten ${_mpStarterSlots()} Spieler nach Z-Score, der Rest sitzt.`
          : 'Eigene Aufstellung aktiv.'}
        Klick auf ein Spiel schaltet es um, Klick auf einen Spielernamen oder einen Wochentag die ganze Zeile oder Spalte.
      </span>
      <span class="mp-grid-btns">
        <button class="mp-btn${MP_STATE.auto ? ' mp-btn-primary' : ''}" onclick="mpResetGames()">✨ Automatisch füllen</button>
        <button class="mp-btn" onclick="mpActivateAll()" title="Auch Spiele über die Startplätze hinaus mitzählen">Alle Spiele an</button>
      </span>
    </div>

    ${_mpGrid(A, tA, days)}
    ${_mpGrid(B, tB, days)}

    <div class="mp-panel" style="margin-top:16px;">
      <div class="mp-panel-title">Wie diese Zahlen entstehen</div>
      <div class="mp-hint" style="margin-top:0;">
        <strong style="color:var(--text);">Rankings</strong> kommen aus ${_mpEsc(index.rankLabel)}.
        <strong style="color:var(--text);">Projections</strong> aus dem Baseline und Live Blend.
        Beide werden pro Kategorie linear gemischt, aktuell ${Math.round((1 - MP_STATE.projWeight) * 100)} zu ${Math.round(MP_STATE.projWeight * 100)}.
        Von ${index.counts.total} gerosterten Spielern haben ${index.counts.both} beide Quellen, ${index.counts.proj} nur eine Projection, ${index.counts.rank} nur gespielte Stats und ${index.counts.none} gar keine Daten.
        ${_mpCoverageWarning(index)}<br><br>
        Jedes Häkchen im Raster ist ein real angesetztes NBA Spiel aus dem ESPN Spielplan. Die Kategoriesummen sind der Pro-Spiel-Schnitt mal die Zahl der angehakten Spiele.
        Die Wahrscheinlichkeit je Kategorie folgt aus dem Abstand beider Summen im Verhältnis zur erwarteten Streuung, wobei Steals und Blocks bei kleinem Volumen deutlich stärker schwanken als Punkte.<br><br>
        Euer Kader umfasst rund dreißig Spieler, aufstellen darfst Du pro Tag aber nur ${_mpStarterSlots()}. Deshalb füllt der Planer die Aufstellung standardmäßig selbst:
        je Spieltag die besten verfügbaren Spieler nach Z-Score, der Rest sitzt. Ohne diese Begrenzung käme etwa das Doppelte dessen heraus, was in einer Woche real erreichbar ist.
        Sobald Du das erste Spiel von Hand umschaltest, friert dieser Stand ein und ab da gilt nur noch Deine eigene Auswahl.<br><br>
        <span style="color:var(--accent2);">Grenze:</span> Die Automatik sortiert rein nach Gesamtwert und kennt keine Positionsvorgaben. Wenn an einem Tag vier Center Deine besten Optionen sind, stellt sie alle vier auf, obwohl ESPN das nicht zuließe.
        Für eine belastbare Planung an dichten Tagen also selbst nachjustieren.
        Prozentwerte sind nach Minuten und Spielen gewichtet, weil die Rankings-Quellen keine Wurfversuche mitliefern.
      </div>
    </div>
  `;
  _mpMarkBasisButtons();
}

function _mpNoScheduleNotice() {
  const hasLeague = !!MP_STATE.schedule;
  const hasNba = !!MP_STATE.nba;
  let why;
  if (!hasLeague && !hasNba) why = 'Weder der Liga-Spielplan noch der NBA Spielplan sind geladen.';
  else if (!hasNba)          why = 'Der Liga-Spielplan ist da, aber ESPN liefert für diese Saison noch keine NBA Spiele.';
  else if (!hasLeague)       why = 'Der NBA Spielplan ist da, aber der Liga-Spielplan fehlt.';
  else                       why = 'Für die gewählte Woche sind keine Spieltage hinterlegt.';

  return `<div class="mp-empty" style="text-align:left;">
    <div style="font-weight:700;color:var(--text);font-size:15px;margin-bottom:10px;">Spielplan fehlt noch</div>
    ${_mpEsc(why)}
    <br><br>
    Der Planer rechnet ausschließlich mit real angesetzten Spielen und bleibt ohne Spielplan deshalb bewusst leer,
    statt mit einem geschätzten Pauschalwert eine Genauigkeit vorzutäuschen, die es nicht gibt.
    <br><br>
    In der Off Season ist das der Normalfall: ESPN veröffentlicht den Spielplan der neuen Saison erst im Spätsommer.
    Sobald er steht, genügt ein Klick auf <strong style="color:var(--text);">ESPN Spielplan laden</strong> und alles hier füllt sich.
  </div>`;
}

// Wenn kaum ein gerosterter Spieler in der Rankings-Quelle vorkommt,
// laufen die Basis-Knoepfe faktisch ins Leere: fuer die meisten
// Spieler gibt es dann nur die Projection. Das muss sichtbar sein,
// sonst wirkt der fehlende Effekt wie ein Fehler.
function _mpCoverageWarning(index) {
  const c = index.counts;
  const share = c.total ? c.both / c.total : 0;
  if (share >= 0.6) return '';
  return `<br><span style="color:var(--accent2);">Nur ${Math.round(share * 100)} % der Kader sind in beiden Quellen vertreten.</span>
    Für alle übrigen wird automatisch die einzige vorhandene Quelle genommen, die Basis-Wahl ändert bei ihnen also nichts.
    Eine andere Rankings-Quelle mit höherer Abdeckung lässt sich oben wählen.`;
}

function _mpRow(r, tA, tB) {
  const c = r.cat;
  const aWin = r.prob > 0.5;
  const total = Math.abs(r.va) + Math.abs(r.vb) || 1;
  let pctA = Math.abs(r.va) / total * 100;
  if (c.invert) pctA = 100 - pctA;   // beim Balken soll die bessere Seite laenger sein
  const pctB = 100 - pctA;

  let cls = 'toss';
  const edge = Math.abs(r.prob - 0.5);
  if (edge > 0.25) cls = 'strong';
  else if (edge > 0.1) cls = 'lean';

  const fmt = v => c.type === 'pct' ? v.toFixed(1) + ' %' : v.toFixed(c.dec);

  return `<tr>
    <td class="mp-cat-name">${c.label}${c.note ? `<span class="mp-cat-note">${c.note}</span>` : ''}</td>
    <td class="mp-val ${aWin ? 'win' : 'lose'}">${fmt(r.va)}</td>
    <td><div class="mp-bar">
      <div class="mp-bar-l" style="width:${pctA.toFixed(1)}%;background:${getTeamColor(tA)}"></div>
      <div class="mp-bar-r" style="width:${pctB.toFixed(1)}%;background:${getTeamColor(tB)}"></div>
    </div></td>
    <td class="mp-val ${aWin ? 'lose' : 'win'}">${fmt(r.vb)}</td>
    <td class="mp-prob ${cls}">${Math.round(r.prob * 100)} %</td>
  </tr>`;
}

// Heatmap wie im Stat-Sheet: gruen ueber, rot unter dem Schnitt.
function _mpHeat(z) {
  if (z === null || z === undefined || !Number.isFinite(z)) return '';
  const a = Math.min(Math.abs(z) / 2.2, 1) * 0.55;
  if (a < 0.06) return '';
  return z > 0
    ? `background:rgba(76,175,129,${a.toFixed(2)});`
    : `background:rgba(255,101,132,${a.toFixed(2)});`;
}

function _mpGrid(T, team, days) {
  const cats = MP_GRID_CATS.map(k => MP_CATS.find(c => c.key === k));

  const head = `<tr>
    <th class="mp-g-name">Spieler</th>
    <th class="mp-g-g" title="angehakte Spiele in dieser Woche">G</th>
    ${cats.map(c => `<th>${c.label}</th>`).join('')}
    ${days.map(d => `<th class="mp-g-day" title="ganzen Tag umschalten" onclick="mpToggleDay(${T.teamId},${d.sp})">
        ${d.dayLabel}<span class="mp-g-date">${_mpEsc(d.dateLabel)}</span></th>`).join('')}
  </tr>`;

  const rows = T.players.map(p => {
    const noData = !p.stats;
    const statCells = cats.map(c => {
      if (noData) return '<td class="mp-g-stat">—</td>';
      const v = p.stats[c.key];
      const txt = c.type === 'pct'
        ? (v / 100).toFixed(3).replace(/^0/, '')
        : v.toFixed(c.dec === 0 ? 1 : c.dec);
      return `<td class="mp-g-stat" style="${_mpHeat(p.z ? p.z[c.z] : null)}">${txt}</td>`;
    }).join('');

    const dayCells = days.map(d => {
      const g = p.games.find(x => x.sp === d.sp);
      if (!g) return '<td class="mp-g-cell"></td>';
      return `<td class="mp-g-cell${g.off ? ' off' : ''}" onclick="mpToggleGame(${T.teamId},'${p.key}',${d.sp})">
        <span class="mp-g-opp">${g.home ? '' : '@'}${_mpEsc(g.opp)}</span>
        <span class="mp-g-box">${g.off ? '' : '✓'}</span>
      </td>`;
    }).join('');

    const srcTag = { proj: 'nur Projection', rank: 'nur Stats', none: 'keine Daten' }[p.src] || '';
    return `<tr class="${p.played ? '' : 'idle'}">
      <td class="mp-g-name" onclick="mpTogglePlayer(${T.teamId},'${p.key}')" title="ganze Zeile umschalten">
        <span class="mp-g-pname">${_mpEsc(p.name)}${typeof injuryBadge === 'function' ? injuryBadge(p.inj) : ''}</span>
        <span class="mp-g-pmeta">${_mpEsc(p.pos || '')} · ${_mpEsc(p.nbaTeam || '')}${srcTag ? ' · ' + srcTag : ''}</span>
      </td>
      <td class="mp-g-g">${p.played || ''}</td>
      ${statCells}
      ${dayCells}
    </tr>`;
  }).join('');

  const perDay = days.map(d =>
    T.players.reduce((s, p) => s + (p.games.some(g => g.sp === d.sp && !g.off) ? 1 : 0), 0));

  const foot = `<tr class="mp-g-foot">
    <td class="mp-g-name">Summe Woche</td>
    <td class="mp-g-g">${T.gameCount}</td>
    ${cats.map(c => {
      const v = T.totals[c.key];
      return `<td class="mp-g-stat">${c.type === 'pct' ? v.toFixed(1) + '%' : v.toFixed(c.dec)}</td>`;
    }).join('')}
    ${perDay.map(n => `<td class="mp-g-cell">${n || ''}</td>`).join('')}
  </tr>`;

  return `<div class="mp-gridwrap">
    <div class="mp-grid-head">
      <span class="mp-grid-team" style="color:${getTeamColor(team)}">${_mpEsc(team.name)}</span>
      <span class="mp-grid-meta">${T.gameCount} von ${T.scheduledCount} angesetzten Spielen aktiv · ${T.activeCount} Spieler im Einsatz${T.missingCount ? ` · ${T.missingCount} ohne Daten` : ''}</span>
    </div>
    <div class="mp-grid-scroll">
      <table class="mp-grid">
        <thead>${head}</thead>
        <tbody>${rows}</tbody>
        <tfoot>${foot}</tfoot>
      </table>
    </div>
  </div>`;
}

// ============================================================
//  7 — Nachladen der Preseason-Stats
// ============================================================
//  data/last-season-stats-2025-26.js ist rund 190 KB und wird sonst
//  nirgends im Frontend gebraucht, deshalb steht es bewusst NICHT in
//  index.html. Ohne diese Datei bliebe waehrend der Off-Season nur die
//  Summer League als Rankings-Quelle uebrig, die kaum zehn Prozent
//  eines Liga-Kaders abdeckt. Sie wird daher beim ersten Aufruf dieser
//  Seite nachgeladen.

const MP_EXTRA_DATA = ['data/last-season-stats-2025-26.js?v=1'];
let _mpDataState = 'idle';   // idle | loading | ready
const _mpPendingCbs = [];

function _mpLoadScript(src) {
  if (typeof _loadScriptOnce === 'function') return _loadScriptOnce(src);
  return new Promise(resolve => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = resolve;   // fehlt die Datei, laeuft die Seite trotzdem
    document.body.appendChild(s);
  });
}

function _mpEnsureData(onDone) {
  const cb = typeof onDone === 'function' ? onDone : function () {};
  if (_mpDataState === 'ready' || typeof LAST_SEASON_STATS_2025_26 !== 'undefined') {
    _mpDataState = 'ready';
    cb();
    return;
  }
  // Waehrend des Ladens weitere Aufrufe nicht verwerfen, sondern
  // anhaengen. Sonst bliebe die Seite leer, wenn jemand waehrend des
  // Ladens wegnavigiert und direkt wieder zurueckkommt.
  _mpPendingCbs.push(cb);
  if (_mpDataState === 'loading') return;
  _mpDataState = 'loading';

  const host = document.getElementById('mpResult');
  if (host) host.innerHTML = '<div class="mp-empty">Lade Preseason-Statistiken…</div>';

  let i = 0;
  const next = () => {
    if (i >= MP_EXTRA_DATA.length) {
      _mpDataState = 'ready';
      MP_STATE.index = null;
      while (_mpPendingCbs.length) {
        try { _mpPendingCbs.shift()(); }
        catch (e) { console.error('[Matchup] Init fehlgeschlagen:', e); }
      }
      return;
    }
    _mpLoadScript(MP_EXTRA_DATA[i++]).then(next);
  };
  next();
}

// ============================================================
//  8 — Init
// ============================================================

function mpFillTeamSelects() {
  ['mpTeamA', 'mpTeamB'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const cur = id === 'mpTeamA' ? MP_STATE.teamA : MP_STATE.teamB;
    el.innerHTML = '<option value="">— Team wählen —</option>' +
      TEAMS.map(t => `<option value="${t.id}"${cur === t.id ? ' selected' : ''}>${_mpEsc(t.name)} · ${_mpEsc(t.owner)}</option>`).join('');
  });
}

let _mpInited = false;
function mpInit() {
  if (!_mpInited) {
    _mpLoadPrefs();
    MP_STATE.schedule = _mpLoadCached(MP_SCHED_KEY);
    MP_STATE.nba      = _mpLoadCached(MP_NBA_KEY);
    _mpInited = true;
  }
  mpFillTeamSelects();
  mpFillRankSourceSelect();
  _mpMarkBasisButtons();

  const st = document.getElementById('mpSchedStatus');
  if (st) {
    st.className = 'mp-status';
    if (MP_STATE.schedule && MP_STATE.nba) {
      const age = Math.round((Date.now() - MP_STATE.schedule.ts) / 3600000);
      st.textContent = `Spielplan aus dem Zwischenspeicher, vor ${age} Stunden geladen. Aktuell läuft Woche ${MP_STATE.schedule.currentPeriod}.`;
    } else {
      st.textContent = 'Holt den Liga-Spielplan und den NBA Spielplan. Danach lässt sich jede Woche der Saison durchrechnen, nicht nur die laufende.';
    }
  }

  // Rosters koennen sich seit dem letzten Aufruf geaendert haben.
  MP_STATE.index = null;
  mpRenderWeekSelect();
  mpRender();
}

function showMatchupPlanner() {
  navigate('matchupPage');
  _mpEnsureData(() => mpInit());
}
