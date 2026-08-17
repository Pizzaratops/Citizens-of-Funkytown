#!/usr/bin/env node
// ============================================================
//  POST-DRAFT BEST AVAILABLE BOARD — 2026 Draft Class
// ============================================================
//  Kombiniert vier Signale zu einem gewichteten Gesamtscore für
//  jeden Spieler der 2026er Draft-Klasse (Erstrundenpicks bis
//  Undrafted Free Agents aus dem Pre-Draft Big Board):
//
//   1) Pre-Draft Big Board   (data/draft2026.js)              Gewicht 0.25
//   2) Echte Draft Capital   (data/draft-capital-2026.js)     Gewicht 0.20
//   3) Off-Season-Performance (data/offseason-rankings.js —
//      Summer League + Preseason, kumulativ, läuft täglich mit) Gewicht 0.30
//   4) Sticky Score          (Pizzaratops/Summer-League-Modell,
//      externes Rotation-/Sticky-Score-Tool, per raw.githubusercontent
//      geladen und mit identischer Formel wie js/stats.js neu berechnet) Gewicht 0.25
//
//  Fehlt ein Signal für einen Spieler (z.B. noch keine Summer-League-
//  Minuten), wird sein Gewicht anteilig auf die übrigen verfügbaren
//  Signale umgelegt statt den Spieler mit 0 zu bestrafen.
//
//  Output: data/postdraft-board.js — POSTDRAFT_BOARD, sortiert nach
//  Gesamtscore, inkl. echtem NBA-Team (aus Draft Capital) fürs
//  Whitelist-Filtering in js/best-available.js.
//
//  Usage:
//    node scripts/build-postdraft-board.js
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'postdraft-board.js');
const STICKY_CSV_URL = 'https://raw.githubusercontent.com/Pizzaratops/Summer-League-Modell/main/data/current-season-2026.csv';

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
// Extrahiert nur die "const VARNAME = [ ... ];" Deklaration (per Klammer-
// Zähler) statt der ganzen Datei, damit Dateien, die neben den Daten auch
// Browser-Code enthalten (document.*, DOM-Handler etc.), trotzdem sicher
// in Node geladen werden können.
function extractBalanced(code, marker, openCh, closeCh) {
  const start = code.indexOf(marker);
  if (start === -1) return null;
  let depth = 0;
  let end = -1;
  for (let i = start + marker.length - 1; i < code.length; i++) {
    if (code[i] === openCh) depth++;
    else if (code[i] === closeCh) { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  if (end === -1) return null;
  return code.slice(start, end) + ';';
}

function loadVmArray(filePath, varName) {
  const code = fs.readFileSync(filePath, 'utf8');
  const snippet = extractBalanced(code, `const ${varName} = [`, '[', ']');
  if (!snippet) return null;
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${snippet}\nthis.__RESULT__ = ${varName};`, sandbox);
  return sandbox.__RESULT__;
}

function loadVmObject(filePath, varName) {
  const code = fs.readFileSync(filePath, 'utf8');
  const snippet = extractBalanced(code, `const ${varName} = {`, '{', '}');
  if (!snippet) return null;
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${snippet}\nthis.__RESULT__ = ${varName};`, sandbox);
  return sandbox.__RESULT__;
}

function normalizeName(raw) {
  if (!raw) return '';
  let s = raw.toLowerCase().trim();
  s = s.replace(/\./g, '');
  s = s.replace(/['\u2019\u2018`]/g, '');
  s = s.replace(/\b(jr|sr|iii|ii)\b/g, '');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function mean(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }
function stdDev(arr, m) {
  if (arr.length < 2) return 0;
  const v = arr.reduce((a, b) => a + (b - m) * (b - m), 0) / arr.length;
  return Math.sqrt(v);
}
function zScores(values) {
  const m = mean(values);
  const s = stdDev(values, m);
  return values.map(v => (s > 0 ? (v - m) / s : 0));
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'taco-tuesday-hq-bot' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGet(res.headers.location).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} für ${url}`));
      }
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// ------------------------------------------------------------
// 1) Pre-Draft Big Board + Draft Capital laden
// ------------------------------------------------------------
const DRAFT_2026 = loadVmArray(path.join(ROOT, 'data', 'draft2026.js'), 'DRAFT_2026') || [];
const DRAFT_CAPITAL_2026 = (loadVmArray(path.join(ROOT, 'data', 'draft-capital-2026.js'), 'DRAFT_CAPITAL_2026')) || [];

const capitalByName = new Map();
DRAFT_CAPITAL_2026.forEach(d => capitalByName.set(normalizeName(d.name), d));

// ------------------------------------------------------------
// 2) Off-Season-Performance laden (Summer League + Preseason,
//    von scripts/build-offseason-rankings.js täglich fortgeschrieben)
// ------------------------------------------------------------
const offseasonPath = path.join(ROOT, 'data', 'offseason-rankings.js');
const OFFSEASON_RANKINGS = fs.existsSync(offseasonPath)
  ? loadVmObject(offseasonPath, 'OFFSEASON_RANKINGS')
  : null;

const offseasonByName = new Map();
if (OFFSEASON_RANKINGS && Array.isArray(OFFSEASON_RANKINGS.players)) {
  OFFSEASON_RANKINGS.players.forEach(p => offseasonByName.set(normalizeName(p.name), p));
}

// ------------------------------------------------------------
// 3) Sticky Score neu berechnen (identische Formel wie
//    Summer-League-Modell/js/stats.js, ALL-Pool da Positions-
//    Metadaten für den aktuellen Jahrgang dort noch nicht befüllt sind)
// ------------------------------------------------------------
const STICKY_HEADER_MAP = {
  'player': 'player_name', 'gp': 'gp', 'min': 'min', 'pts': 'pts', 'reb': 'reb',
  'ast': 'ast', 'stl': 'stl', 'blk': 'blk', 'tov': 'tov', 'oreb': 'oreb', 'dreb': 'dreb',
  'pf': 'pf', 'fgm': 'fgm', 'fga': 'fga', '3pm': 'fg3m', '3pa': 'fg3a',
  'ftm': 'ftm', 'fta': 'fta', 'fg%': 'fg_pct', '3p%': 'fg3_pct', 'ft%': 'ft_pct',
  'gmsc': 'game_score', 'ts%': 'ts_pct', 'efg%': 'efg_pct',
};

function parseNum(txt) {
  if (txt === undefined || txt === null) return null;
  txt = String(txt).trim();
  if (txt === '' || txt === '\u2014' || txt === '-') return null;
  const n = parseFloat(txt.replace(/,/g, ''));
  return isNaN(n) ? null : n;
}

function parseStickyCsv(raw) {
  const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headerCells = lines[0].split(',').map(h => h.trim().toLowerCase());
  const fieldForCol = headerCells.map(h => STICKY_HEADER_MAP[h] || null);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(',').map(s => s.trim());
    if (cells.length < 5) continue;
    const row = {};
    fieldForCol.forEach((field, idx) => {
      if (!field) return;
      if (field === 'player_name') row.player_name = cells[idx];
      else row[field] = parseNum(cells[idx]);
    });
    if (!row.player_name || row.gp === null || row.gp === undefined) continue;
    rows.push(row);
  }
  return rows;
}

// Gewichte identisch zu den Default-Werten in Summer-League-Modell/index.html
const STICKY_WEIGHTS = { sticky: 1.5, other: 1, icky: 0.5 };
const SHRINK_K = 40;

const STICKY_STAT_DEFS = [
  ['ast', false, 'sticky'],
  ['blk', false, 'sticky'],
  ['fg3_attempt_rate', false, 'other'],
  ['fg3a', false, 'other'],
  ['dreb', false, 'other'],
  ['pf', true, 'other'],
  ['fga', false, 'other'],
  ['fantasy_pts', false, 'other'],
  ['tov', true, 'other'],
  ['ft_attempt_rate', false, 'other'],
  ['ast_to', false, 'other'],
  ['fta', false, 'other'],
  ['pts_adj', false, 'other'],
  ['stl', false, 'icky'],
  ['ft_pct', false, 'icky'],
  ['game_score', false, 'icky'],
  ['dre36', false, 'icky'],
  ['efg_pct', false, 'icky'],
  ['two_pct', false, 'icky'],
  ['ts_pct', false, 'icky'],
  ['mpg', false, 'icky'],
  ['fg3_pct', false, 'icky'],
];

function safeDiv(a, b) { return (a === null || b === null || b === 0) ? null : a / b; }

function computeStickyScores(rows) {
  const derived = rows.map(r => {
    const d = { ...r };
    d.fg3_attempt_rate = safeDiv(r.fg3a, r.fga);
    d.ft_attempt_rate = safeDiv(r.fta, r.fga);
    d.ast_to = safeDiv(r.ast, r.tov);
    d.two_pct = safeDiv((r.fgm ?? 0) - (r.fg3m ?? 0), (r.fga ?? 0) - (r.fg3a ?? 0));
    if (r.game_score === null || r.game_score === undefined) {
      d.game_score = (r.pts ?? 0) + 0.4 * (r.fgm ?? 0) - 0.7 * (r.fga ?? 0) - 0.4 * ((r.fta ?? 0) - (r.ftm ?? 0))
        + 0.7 * (r.oreb ?? 0) + 0.3 * (r.dreb ?? 0) + (r.stl ?? 0) + 0.7 * (r.ast ?? 0)
        + 0.7 * (r.blk ?? 0) - 0.4 * (r.pf ?? 0) - (r.tov ?? 0);
    }
    d.fantasy_pts = (r.pts ?? 0) + (r.fg3m ?? 0) + (r.fgm ?? 0) * 2 - (r.fga ?? 0) + (r.ftm ?? 0) - (r.fta ?? 0)
      + (r.reb ?? 0) + (r.ast ?? 0) * 2 + (r.stl ?? 0) * 4 + (r.blk ?? 0) * 4 - (r.tov ?? 0) * 2;
    d.dre36 = (r.pts ?? 0) + 0.2 * (r.reb ?? 0) + 1.7 * (r.stl ?? 0) + 0.535 * (r.blk ?? 0)
      + 0.5 * (r.ast ?? 0) - 0.9 * (r.fga ?? 0) - 0.35 * (r.fta ?? 0) - 1.4 * (r.tov ?? 0);
    d.mpg = r.min;
    d._totalMin = (r.gp ?? 0) * (r.min ?? 0);
    return d;
  });

  const tsPool = derived.map(r => r.ts_pct).filter(v => v !== null && v !== undefined && !isNaN(v));
  const tsMean = mean(tsPool);
  const tsStd = stdDev(tsPool, tsMean);
  const ptsPool = derived.map(r => r.pts).filter(v => v !== null && v !== undefined && !isNaN(v));
  const ptsMean = mean(ptsPool);
  const ptsStd = stdDev(ptsPool, ptsMean);

  derived.forEach(r => {
    const zTS = (tsStd > 0 && r.ts_pct != null) ? (r.ts_pct - tsMean) / tsStd : 0;
    const factor = Math.min(1.4, Math.max(0.6, 1 + 0.3 * zTS));
    r.pts_adj = (r.pts ?? 0) * factor;
  });

  const zByKey = {};
  STICKY_STAT_DEFS.forEach(([key, inverted]) => {
    const values = derived.map(r => (r[key] === null || r[key] === undefined || isNaN(r[key])) ? null : r[key]);
    const valid = values.filter(v => v !== null);
    const z = zScores(valid);
    let zi = 0;
    zByKey[key] = values.map(v => {
      if (v === null) return 0;
      const zv = z[zi++];
      return inverted ? -zv : zv;
    });
  });
  const rebValues = derived.map(r => r.reb ?? 0);
  const orebValues = derived.map(r => r.oreb ?? 0);
  const zReb = zScores(rebValues);
  const zOreb = zScores(orebValues);

  derived.forEach((r, idx) => {
    let stickySum = 0, otherSum = 0, ickySum = 0;
    const shrink = r._totalMin / (r._totalMin + SHRINK_K);
    STICKY_STAT_DEFS.forEach(([key, , tier]) => {
      const z = zByKey[key][idx] * shrink;
      if (tier === 'sticky') stickySum += z;
      if (tier === 'other') otherSum += z;
      if (tier === 'icky') ickySum += z;
    });
    const reboundZ = (0.7 * zReb[idx] + 0.3 * zOreb[idx]) * shrink;
    stickySum += reboundZ;
    r._total = stickySum * STICKY_WEIGHTS.sticky + otherSum * STICKY_WEIGHTS.other + ickySum * STICKY_WEIGHTS.icky;
  });

  return derived;
}

// ------------------------------------------------------------
// 4) Alles zusammenführen
// ------------------------------------------------------------
async function main() {
  let stickyByName = new Map();
  try {
    const csv = await httpsGet(STICKY_CSV_URL);
    const rows = parseStickyCsv(csv);
    const scored = computeStickyScores(rows);
    scored.forEach(r => stickyByName.set(normalizeName(r.player_name), r._total));
    console.log(`Sticky Score: ${scored.length} Spieler von ${STICKY_CSV_URL} geladen.`);
  } catch (err) {
    console.warn(`Sticky Score konnte nicht geladen werden (${err.message}) — postdraft-board.js wird ohne dieses Signal gebaut.`);
  }

  const preDraftRanks = DRAFT_2026.map(p => p.pick);
  const maxPreDraft = Math.max(...preDraftRanks, 1);

  const draftedPicks = DRAFT_CAPITAL_2026.map(d => d.pick);
  const maxPick = Math.max(...draftedPicks, 60);
  const UNDRAFTED_PICK_VALUE = maxPick + 15; // moderates Straf-"Pick" für Undrafted im Vergleich zu Pick 60

  const players = DRAFT_2026.map(p => {
    const key = normalizeName(p.name);
    const cap = capitalByName.get(key);
    const off = offseasonByName.get(key);
    const sticky = stickyByName.has(key) ? stickyByName.get(key) : null;

    return {
      name: p.name,
      pos: p.pos,
      school: p.school,
      tier: p.tier,
      preDraftPick: p.pick,
      draftPick: cap ? cap.pick : null,
      nbaTeam: cap ? cap.team : null,
      drafted: !!cap,
      offseasonComposite: off ? off.composite : null,
      offseasonGames: off ? off.games : null,
      stickyScore: sticky,
    };
  });

  // Signale in Z-Scores (bzw. normierte Werte) umwandeln
  const preDraftZ = zScores(players.map(p => -(p.preDraftPick / maxPreDraft)));
  const draftCapZ = zScores(players.map(p => -((p.draftPick ?? UNDRAFTED_PICK_VALUE) / maxPick)));
  const offVals = players.map(p => p.offseasonComposite);
  const offValid = offVals.filter(v => v !== null && v !== undefined);
  const offZAll = zScores(offValid);
  let offIdx = 0;
  const offseasonZ = offVals.map(v => (v === null || v === undefined) ? null : offZAll[offIdx++]);
  const stickyVals = players.map(p => p.stickyScore);
  const stickyValid = stickyVals.filter(v => v !== null && v !== undefined);
  const stickyZAll = zScores(stickyValid);
  let stIdx = 0;
  const stickyZ = stickyVals.map(v => (v === null || v === undefined) ? null : stickyZAll[stIdx++]);

  const BASE_WEIGHTS = { preDraft: 0.25, draftCap: 0.20, offseason: 0.30, sticky: 0.25 };

  players.forEach((p, i) => {
    const signals = [
      ['preDraft', preDraftZ[i]],
      ['draftCap', draftCapZ[i]],
      ['offseason', offseasonZ[i]],
      ['sticky', stickyZ[i]],
    ].filter(([, v]) => v !== null && v !== undefined);

    const weightSum = signals.reduce((s, [k]) => s + BASE_WEIGHTS[k], 0);
    const composite = weightSum > 0
      ? signals.reduce((s, [k, v]) => s + v * (BASE_WEIGHTS[k] / weightSum), 0)
      : 0;

    p.compositeScore = Math.round(composite * 100) / 100;
    p.signalsUsed = signals.map(([k]) => k);
  });

  players.sort((a, b) => b.compositeScore - a.compositeScore);
  players.forEach((p, i) => { p.rank = i + 1; });

  const lines = players.map(p => {
    return `  { rank: ${p.rank}, name: ${JSON.stringify(p.name)}, pos: ${JSON.stringify(p.pos)}, ` +
      `nbaTeam: ${JSON.stringify(p.nbaTeam)}, drafted: ${p.drafted}, draftPick: ${p.draftPick ?? 'null'}, ` +
      `preDraftPick: ${p.preDraftPick}, tier: ${JSON.stringify(p.tier)}, ` +
      `offseasonComposite: ${p.offseasonComposite ?? 'null'}, stickyScore: ${p.stickyScore !== null && p.stickyScore !== undefined ? Math.round(p.stickyScore * 100) / 100 : 'null'}, ` +
      `compositeScore: ${p.compositeScore}, signalsUsed: ${JSON.stringify(p.signalsUsed)} }`;
  });

  const now = new Date().toISOString().slice(0, 10);
  const out = `// ============================================================
//  POST-DRAFT BEST AVAILABLE BOARD — 2026 Draft Class
// ============================================================
//  AUTO-GENERIERT von scripts/build-postdraft-board.js über die
//  "Daily 9cat Live Scores" GitHub Action. Nicht von Hand editieren.
//  Zuletzt aktualisiert: ${now}
//
//  Kombiniert (gewichtet, mit anteiliger Umverteilung bei fehlenden
//  Signalen): Pre-Draft Big Board (25%) + echte Draft Capital (20%)
//  + Off-Season-Performance aus Summer League/Preseason (30%) +
//  Sticky Score aus Pizzaratops/Summer-League-Modell (25%).
//
//  Shape: POSTDRAFT_BOARD = [ { rank, name, pos, nbaTeam, drafted,
//    draftPick, preDraftPick, tier, offseasonComposite, stickyScore,
//    compositeScore, signalsUsed }, ... ]
// ============================================================

const POSTDRAFT_BOARD = [
${lines.join(',\n')}
];
`;

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, out, 'utf8');
  console.log(`${OUT} aktualisiert: ${players.length} Spieler.`);
}

main().catch(err => {
  console.error('Fehler beim Bauen des Post-Draft Boards:', err);
  process.exit(1);
});
