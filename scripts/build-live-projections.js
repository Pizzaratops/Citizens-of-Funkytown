#!/usr/bin/env node
// ============================================================
//  BUILD LIVE PROJECTIONS
// ============================================================
//  Blendet Beyaz' Preseason-Baseline (data/projections-baseline.js)
//  mit den echten Boxscore-Stats der bisherigen Saison und schreibt
//  data/live-projections.js. Läuft ab Saisonstart als Teil der
//  täglichen Pipeline (nach daily-9cat.js), siehe README
//  "Season-Start-Plan: Projections-Flow".
//
//  Quelle für die echten Stats: die taeglichen CSVs, die daily-9cat.js
//  ohnehin schon pro Spieltag unter scripts/data/ ablegt
//  (daily-9cat_<league>_<date>.csv) — hier werden sie season-weit
//  aufsummiert (nicht die kompakten LIVESCORES_DAILY-Prozentwerte, weil
//  die keine rohen Makes/Attempts mehr enthalten).
//
//  Blend-Formel je Counting-Stat (PTS, REB, AST, STL, BLK, 3PM, TOV,
//  FGM, FGA, FTM, FTA):
//    geblendeter Wert = (Baseline × BASELINE_WEIGHT + Σ echte Spiele)
//                        / (BASELINE_WEIGHT + Anzahl echter Spiele)
//  FG%/FT% werden NICHT direkt gemittelt (Verhältniszahlen!), sondern
//  aus den geblendeten FGM/FGA bzw. FTM/FTA berechnet — die Baseline
//  bringt dafür ihre eigenen Makes/Attempts mit (siehe
//  import-projections-baseline.js), kein Prozent-Mittelwert nötig.
//
//  BASELINE_WEIGHT = 2: die Baseline zählt wie 2 "virtuelle" Spiele.
//  Bewusste Wahl (siehe Chat-Diskussion): Gewicht 1 macht die Baseline
//  schon nach 3-4 Spielen fast bedeutungslos (sehr reaktionsschnell auf
//  Breakouts/Bruchbuden, aber wackelig in den ersten Wochen); Gewicht 2
//  gibt ihr etwas mehr Bestand gegen Kleine-Stichprobe-Ausreißer, ohne
//  träge zu werden. Leicht anpassbar, falls sich das nicht bewährt.
//
//  Usage:
//    node scripts/build-live-projections.js [--league=nba] [--weight=2]
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const BASELINE_PATH = path.join(ROOT, 'data', 'projections-baseline.js');
const CONSENSUS_PATH = path.join(ROOT, 'data', 'projections-consensus.js');
const RANKINGS_PATH = path.join(ROOT, 'data', 'rankings.js');
const CSV_DIR = path.join(__dirname, 'data');
const OUT = path.join(ROOT, 'data', 'live-projections.js');

const args = process.argv.slice(2);
const leagueArg = (args.find(a => a.startsWith('--league=')) || '').split('=')[1] || 'nba';
const BASELINE_WEIGHT = parseFloat((args.find(a => a.startsWith('--weight=')) || '').split('=')[1]) || 2;

function extractBalanced(code, marker, openCh, closeCh) {
  const start = code.indexOf(marker);
  if (start === -1) return null;
  let depth = 0, end = -1;
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
  const sandbox = {}; vm.createContext(sandbox);
  vm.runInContext(`${snippet}\nthis.__RESULT__ = ${varName};`, sandbox);
  return sandbox.__RESULT__;
}
function loadVmObject(filePath, varName) {
  if (!fs.existsSync(filePath)) return null;
  const code = fs.readFileSync(filePath, 'utf8');
  const snippet = extractBalanced(code, `const ${varName} = {`, '{', '}');
  if (!snippet) return null;
  const sandbox = {}; vm.createContext(sandbox);
  vm.runInContext(`${snippet}\nthis.__RESULT__ = ${varName};`, sandbox);
  return sandbox.__RESULT__;
}

// ── Stats-Quelle: Consensus bevorzugt, Baseline als Rueckfall ──
//  Seit dem Consensus-Import (Beyaz x Josh Lloyd, siehe
//  scripts/build-consensus-projections.js) ist data/projections-consensus.js
//  die bessere Grundlage: sie mittelt zwei unabhaengige Quellen und hat
//  echte Makes/Attempts statt nur Prozente.
//
//  ABER: die Consensus-Datei enthaelt NUR Stats, keine Bewertungsfelder.
//  z / zFloor / zDepth / adpVal gibt es ausschliesslich in der alten
//  Baseline (Formel stammt aus dem Projections-Repo und ist hier nicht
//  nachgebaut). Deshalb werden BEIDE geladen:
//    Stats            -> Consensus, sonst Baseline
//    z/zFloor/zDepth/adpVal -> immer Baseline
//  Faellt die Consensus-Datei weg, laeuft alles unveraendert wie vorher.
const PROJECTIONS_BASELINE_RAW = loadVmObject(BASELINE_PATH, 'PROJECTIONS_BASELINE') || {};
const PROJECTIONS_CONSENSUS = loadVmObject(CONSENSUS_PATH, 'PROJECTIONS_CONSENSUS') || {};

const PROJECTIONS_BASELINE = (() => {
  if (!Object.keys(PROJECTIONS_CONSENSUS).length) {
    console.log('  Hinweis: keine Consensus-Datei gefunden, nutze data/projections-baseline.js.');
    return PROJECTIONS_BASELINE_RAW;
  }
  const merged = {};
  let fromConsensus = 0, ratingsCarried = 0;
  Object.keys(PROJECTIONS_CONSENSUS).forEach(name => {
    const c = PROJECTIONS_CONSENSUS[name];
    const b = PROJECTIONS_BASELINE_RAW[name] || {};
    if (b.z !== undefined) ratingsCarried++;
    fromConsensus++;
    merged[name] = {
      min: c.min, pts: c.pts, reb: c.reb, ast: c.ast, stl: c.stl, blk: c.blk,
      tpm: c.tpm, tov: c.tov,
      fgm: c.fgm || 0, fga: c.fga || 0, ftm: c.ftm || 0, fta: c.fta || 0,
      fgPct: c.fgPct, ftPct: c.ftPct,
      // Ohne Wurfversuche bleibt nur der Prozentwert -- dieselbe
      // Kennzeichnung wie in der alten Baseline, damit die Blend-Logik
      // unten unveraendert damit umgehen kann.
      pctOnly: !(c.fga > 0),
      z: b.z || 0, zFloor: b.zFloor || 0, zDepth: b.zDepth || 0, adpVal: b.adpVal || 0,
    };
  });
  // Spieler, die nur die alte Baseline kennt, nicht verlieren
  let baselineOnly = 0;
  Object.keys(PROJECTIONS_BASELINE_RAW).forEach(name => {
    if (!merged[name]) { merged[name] = PROJECTIONS_BASELINE_RAW[name]; baselineOnly++; }
  });
  console.log(`  Stats-Quelle: ${fromConsensus} aus Consensus, ${baselineOnly} nur aus Baseline, ${ratingsCarried} mit übernommenen z-Werten.`);
  return merged;
})();
const DYNASTY_PLAYERS = loadVmArray(RANKINGS_PATH, 'DYNASTY_PLAYERS') || [];
const dynastyByName = new Map(DYNASTY_PLAYERS.map(p => [p[1], p]));

// ── Name-Normalisierung wie in den anderen Scripts (fuer CSV-Namen,
//    die evtl. leicht anders geschrieben sind als in der Baseline) ──
const NAME_ALIASES = loadVmObject(path.join(ROOT, 'data', 'aliases.js'), 'NAME_ALIASES') || {};
const NAME_FIRST_ALIASES = {
  'nicolas claxton': 'nic claxton', 'alexandre sarr': 'alex sarr',
  'cameron johnson': 'cam johnson', 'cameron boozer': 'cam boozer',
  'ronald holland ii': 'ron holland', 'ronald holland': 'ron holland',
};
function stripDiacritics(s) { return s.normalize('NFKD').replace(/[\u0300-\u036f]/g, ''); }
function baseNormalize(raw) { return stripDiacritics(raw || '').toLowerCase().trim().replace(/\./g, '').replace(/['\u2019\u2018`]/g, ''); }
function normalizeName(raw) {
  let s = baseNormalize(raw).replace(/\b(jr|sr|iii|ii)\b/g, '').replace(/\s+/g, ' ').trim();
  return NAME_FIRST_ALIASES[s] || s;
}
function aliasCanonical(raw) {
  const base = baseNormalize(raw).replace(/\s+/g, ' ').trim();
  return NAME_ALIASES[base] || null;
}
const dynastyByNorm = new Map(DYNASTY_PLAYERS.map(p => [normalizeName(p[1]), p]));
function canonicalName(rawName) {
  const aliasName = aliasCanonical(rawName);
  if (aliasName) { const m = dynastyByNorm.get(normalizeName(aliasName)); if (m) return m[1]; }
  const m = dynastyByNorm.get(normalizeName(rawName));
  return m ? m[1] : rawName;
}

// ── Alle Tages-CSVs der gewaehlten Liga einlesen und aufsummieren ──
function parseCsvLine(line) {
  // simpler CSV-Parser, reicht für dieses feste Format (ein quoted Feld: Name)
  const out = [];
  let cur = '', inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQuotes = !inQuotes;
    else if (c === ',' && !inQuotes) { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

const totals = new Map(); // canonicalName -> { games, pts, reb, ast, stl, blk, tpm, tov, fgm, fga, ftm, fta }
let filesRead = 0;
if (fs.existsSync(CSV_DIR)) {
  const files = fs.readdirSync(CSV_DIR).filter(f => f.startsWith(`daily-9cat_${leagueArg}_`) && f.endsWith('.csv'));
  files.forEach(f => {
    const lines = fs.readFileSync(path.join(CSV_DIR, f), 'utf8').split('\n').filter(Boolean);
    const header = parseCsvLine(lines[0]).map(h => h.trim());
    const col = name => header.indexOf(name);
    const c = {
      name: col('Name'), pts: col('PTS'), reb: col('REB'), ast: col('AST'),
      stl: col('STL'), blk: col('BLK'), to: col('TO'), tpm: col('3PM'),
      fgm: col('FGM'), fga: col('FGA'), ftm: col('FTM'), fta: col('FTA'),
    };
    if (c.name === -1) return;
    filesRead++;
    for (let i = 1; i < lines.length; i++) {
      const r = parseCsvLine(lines[i]);
      if (!r[c.name]) continue;
      const name = canonicalName(r[c.name].trim());
      const t = totals.get(name) || { games: 0, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, tpm: 0, tov: 0, fgm: 0, fga: 0, ftm: 0, fta: 0 };
      t.games += 1;
      t.pts += parseFloat(r[c.pts]) || 0;
      t.reb += parseFloat(r[c.reb]) || 0;
      t.ast += parseFloat(r[c.ast]) || 0;
      t.stl += parseFloat(r[c.stl]) || 0;
      t.blk += parseFloat(r[c.blk]) || 0;
      t.tpm += parseFloat(r[c.tpm]) || 0;
      t.tov += parseFloat(r[c.to]) || 0;
      t.fgm += parseFloat(r[c.fgm]) || 0;
      t.fga += parseFloat(r[c.fga]) || 0;
      t.ftm += parseFloat(r[c.ftm]) || 0;
      t.fta += parseFloat(r[c.fta]) || 0;
      totals.set(name, t);
    }
  });
}
console.log(`${filesRead} Tages-CSV(s) für Liga "${leagueArg}" eingelesen, ${totals.size} Spieler mit echten Stats.`);

// ── Blenden ──────────────────────────────────────────────────
// PTS/REB/AST/STL/BLK/3PM/TOV sind normale Counting-Stats -> generische
// Blend-Formel. FGM/FGA/FTM/FTA brauchen Sonderbehandlung, wenn die
// Baseline nur FG%/FT% ohne Volumen hat (pctOnly, siehe
// import-projections-baseline.js) — reine Counting-Stat-Blend würde
// sonst faelschlich Baseline-Volumen von 0 einmischen und FGA/FTA
// künstlich runterziehen.
const COUNTING_KEYS = ['pts', 'reb', 'ast', 'stl', 'blk', 'tpm', 'tov'];
const SHOOTING_PAIRS = [['fgm', 'fga', 'fgPct'], ['ftm', 'fta', 'ftPct']];
const allNames = new Set([...Object.keys(PROJECTIONS_BASELINE), ...totals.keys()]);

const live = {};
allNames.forEach(name => {
  const base = PROJECTIONS_BASELINE[name] || null;
  const actual = totals.get(name) || null;
  const games = actual ? actual.games : 0;
  const pctOnly = !!(base && base.pctOnly);

  const blended = {};
  COUNTING_KEYS.forEach(k => {
    const baseVal = base ? (base[k] || 0) : 0;
    const actualSum = actual ? (actual[k] || 0) : 0;
    const w = base ? BASELINE_WEIGHT : 0; // kein Baseline-Eintrag -> reiner Saison-Schnitt
    const denom = w + games;
    blended[k] = denom > 0 ? (baseVal * w + actualSum) / denom : 0;
  });

  SHOOTING_PAIRS.forEach(([mKey, aKey, pctKey]) => {
    if (pctOnly) {
      // Kein Baseline-Volumen bekannt: solange keine echten Spiele vorliegen,
      // einfach die Baseline-Prozentzahl unveraendert zeigen. Sobald echte
      // Spiele da sind, wird das TATSAECHLICHE Wurfvolumen der echten Spiele
      // auch fuer die "virtuellen" Baseline-Spiele angenommen (kein
      // erfundener Fixwert) — das reduziert sich mathematisch exakt auf
      // einen game-gewichteten Prozent-Durchschnitt zwischen Baseline-%
      // und Saison-%, ohne die Attempts-Verzerrung eines naiven simplen
      // Prozent-Mittelwerts über unterschiedlich große Stichproben.
      if (games > 0) {
        const avgAttPerGame = actual[aKey] / games;
        const virtualAttTotal = avgAttPerGame * BASELINE_WEIGHT;
        const virtualMadeTotal = virtualAttTotal * (base[pctKey] / 100);
        const denom = BASELINE_WEIGHT + games;
        blended[mKey] = (virtualMadeTotal + actual[mKey]) / denom;
        blended[aKey] = (virtualAttTotal + actual[aKey]) / denom;
      } else {
        blended[mKey] = 0;
        blended[aKey] = 0;
        blended[pctKey] = base[pctKey];
      }
    } else {
      const baseVal = base ? (base[mKey] || 0) : 0;
      const baseAtt = base ? (base[aKey] || 0) : 0;
      const actualMade = actual ? (actual[mKey] || 0) : 0;
      const actualAtt = actual ? (actual[aKey] || 0) : 0;
      const w = base ? BASELINE_WEIGHT : 0;
      const denom = w + games;
      blended[mKey] = denom > 0 ? (baseVal * w + actualMade) / denom : 0;
      blended[aKey] = denom > 0 ? (baseAtt * w + actualAtt) / denom : 0;
    }
  });

  blended.min = base ? base.min : 0; // MIN wird nicht season-live geblendet, reine Baseline-Info
  if (blended.fgPct === undefined) blended.fgPct = blended.fga > 0 ? (blended.fgm / blended.fga) * 100 : 0;
  if (blended.ftPct === undefined) blended.ftPct = blended.fta > 0 ? (blended.ftm / blended.fta) * 100 : 0;
  blended.gamesPlayed = games;
  blended.hasBaseline = !!base;
  // zFloor/zDepth/adpVal: statische Baseline-Werte, kein Live-Recalc (Formel
  // aus dem Projections-Repo nicht bekannt) — "z" selbst wird unten frisch
  // ueber den kompletten Pool neu berechnet (gleiche Mathe wie ueberall
  // sonst im Projekt, siehe scripts/build-offseason-rankings.js).
  blended.zFloor = base ? base.zFloor : 0;
  blended.zDepth = base ? base.zDepth : 0;
  blended.adpVal = base ? base.adpVal : 0;
  blended.z = base ? base.z : 0; // Fallback: Original-Baseline-Z, wird unten ggf. live neu berechnet

  live[name] = blended;
});

// ── Z-Score frisch ueber den kompletten Pool berechnen ────────
// Exakt gleiche Mathematik wie scripts/build-offseason-rankings.js /
// scripts/aggregate-core.js: pro Kategorie (mean, stdDev) ueber den
// gesamten Pool, FG%/FT% als "Impact" (Abweichung vom Pool-Schnitt,
// gewichtet mit dem Attempt-Volumen), TOV invertiert (weniger TOV = besser).
//
// WICHTIG: Nur neu berechnen, wenn es ueberhaupt schon echte Saison-Daten
// gibt (filesRead > 0). Vorher haben ALLE Spieler fgm=fga=0 (pctOnly-
// Baseline ohne Spiele, siehe oben) — der FG%/FT%-Einfluss würde dann für
// den kompletten Pool auf 0 fallen und die Original-Baseline-Z-Werte
// (die volle Wurf-Volumen-Daten hatten) verschlechtern statt verbessern.
// Vor Saisonstart bleibt daher einfach der Original-Z aus der Baseline
// unverändert stehen.
if (filesRead > 0) {
  function mean(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }
  function stdDev(arr, m) {
    if (arr.length < 2) return 0;
    const variance = arr.reduce((s, v) => s + (v - m) * (v - m), 0) / arr.length;
    return Math.sqrt(variance);
  }
  const liveEntries = Object.entries(live);
  const poolFgSum = liveEntries.reduce((s, [, p]) => s + p.fgm, 0);
  const poolFgaSum = liveEntries.reduce((s, [, p]) => s + p.fga, 0);
  const poolFtSum = liveEntries.reduce((s, [, p]) => s + p.ftm, 0);
  const poolFtaSum = liveEntries.reduce((s, [, p]) => s + p.fta, 0);
  const poolFgPct = poolFgaSum > 0 ? poolFgSum / poolFgaSum : 0;
  const poolFtPct = poolFtaSum > 0 ? poolFtSum / poolFtaSum : 0;
  liveEntries.forEach(([, p]) => {
    p._fgImpact = p.fga > 0 ? ((p.fgm / p.fga) - poolFgPct) * p.fga : 0;
    p._ftImpact = p.fta > 0 ? ((p.ftm / p.fta) - poolFtPct) * p.fta : 0;
  });
  const Z_CATS = [
    { key: 'pts' }, { key: 'reb' }, { key: 'ast' }, { key: 'stl' }, { key: 'blk' }, { key: 'tpm' },
    { key: '_fgImpact' }, { key: '_ftImpact' }, { key: 'tov', invert: true },
  ];
  const zStats = {};
  Z_CATS.forEach(cat => {
    const values = liveEntries.map(([, p]) => p[cat.key]);
    const m = mean(values);
    zStats[cat.key] = { mean: m, sd: stdDev(values, m) };
  });
  liveEntries.forEach(([, p]) => {
    let composite = 0;
    Z_CATS.forEach(cat => {
      const { mean: m, sd } = zStats[cat.key];
      let z = sd > 0 ? (p[cat.key] - m) / sd : 0;
      if (cat.invert) z = -z;
      composite += z;
    });
    p.z = composite;
    delete p._fgImpact;
    delete p._ftImpact;
  });
  console.log('Z-Scores frisch über den Live-Pool berechnet (echte Saison-Daten vorhanden).');
} else {
  console.log('Noch keine echten Saison-Daten — Original-Z aus der Baseline bleibt unverändert.');
}

function serialize(obj) {
  const lines = Object.entries(obj).map(([name, s]) => {
    const escaped = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const round = n => Math.round(n * 100) / 100;
    return `  "${escaped}": { min:${round(s.min)}, pts:${round(s.pts)}, reb:${round(s.reb)}, ast:${round(s.ast)}, stl:${round(s.stl)}, blk:${round(s.blk)}, tpm:${round(s.tpm)}, tov:${round(s.tov)}, fgm:${round(s.fgm)}, fga:${round(s.fga)}, ftm:${round(s.ftm)}, fta:${round(s.fta)}, fgPct:${round(s.fgPct)}, ftPct:${round(s.ftPct)}, gamesPlayed:${s.gamesPlayed}, hasBaseline:${s.hasBaseline}, z:${round(s.z)}, zFloor:${round(s.zFloor)}, zDepth:${round(s.zDepth)}, adpVal:${round(s.adpVal)} }`;
  });
  return lines.join(',\n');
}

const today = new Date().toISOString().slice(0, 10);
const out = `// ============================================================
//  LIVE PROJECTIONS
// ============================================================
//  AUTO-GENERIERT von scripts/build-live-projections.js. Nicht von
//  Hand editieren. Blend aus data/projections-baseline.js (Preseason)
//  + den echten Saison-Stats bisher (BASELINE_WEIGHT=${BASELINE_WEIGHT}, siehe
//  Script-Kommentar für die Formel). Siehe README "Season-Start-Plan:
//  Projections-Flow".
//  Zuletzt gebaut: ${today} · Liga: ${leagueArg} · ${filesRead} Spieltag(e) eingerechnet
//
//  Shape: LIVE_PROJECTIONS["Spielername"] = {
//    min, pts, reb, ast, stl, blk, tpm, tov, fgm, fga, ftm, fta,  // Pro-Spiel-Schnitte, geblendet
//    fgPct, ftPct,        // aus geblendeten Makes/Attempts berechnet, NICHT gemittelt
//    gamesPlayed,          // echte Spiele bisher in dieser Liga
//    hasBaseline,          // false = kein Preseason-Wert vorhanden, reiner Saison-Schnitt
//    z,                    // frisch ueber den kompletten Pool berechneter 9cat-Composite-Z-Score
//    zFloor, zDepth, adpVal, // statische Baseline-Werte (kein Live-Recalc, Formel aus Projections-Repo)
//  }
// ============================================================

const LIVE_PROJECTIONS = {
${serialize(live)}
};
`;
fs.writeFileSync(OUT, out, 'utf8');
console.log(`${OUT} geschrieben: ${allNames.size} Spieler total.`);
