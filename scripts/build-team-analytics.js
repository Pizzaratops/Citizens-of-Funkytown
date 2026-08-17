#!/usr/bin/env node
// ============================================================
//  TEAM ANALYTICS BUILD (automatisiert)
// ============================================================
//  Ersetzt den bis August 2026 statischen AN_ROSTER-Block in
//  js/analytics.js. Der war doppelt problematisch: (1) veraltete
//  von Hand eingefrorene Werte, (2) rund 21 Spieler ohne Daten
//  trugen den Sentinel -2.0 in ALLEN Kategorien und verzerrten
//  damit die Team-Scores massiv nach unten.
//
//  Dieses Script berechnet die per-Kategorie-Z-Scores frisch aus
//  den aktuellen Projections und schreibt data/team-analytics.js
//  in exakt der Struktur, die der Renderer in js/analytics.js
//  erwartet — der Renderer selbst bleibt unveraendert.
//
//  Inputs (beide taeglich aktualisiert):
//    data/live-projections.js  — LIVE_PROJECTIONS (Baseline+Live-Blend)
//    data/rosters-live.js      — ROSTERS_LIVE (ESPN-Sync)
//
//  Regeln:
//  - Spielerpool fuer Mittelwert/Streuung = alle gerosterten Spieler
//    MIT Projection (Liga-Kontext, selbst-normalisierend).
//  - Spieler ohne Projection werden WEGGELASSEN statt mit Fantasie-
//    werten gefuehrt. Der Cutoff (Top 13 je Team) sortiert ohnehin
//    nach Wert, fehlende Randspieler aendern am Ergebnis nichts.
//  - TO ist invertiert (weniger = besser).
//  - FG%/FT% als Impact (Abweichung vom Liga-Schnitt × Versuche):
//    Sobald echte Saisonspiele akkumuliert sind (fga/fta > 0),
//    werden die realen Makes/Attempts genutzt. Solange die Projection
//    "pctOnly" ist (Preseason, BBM-Export ohne Volumen), werden die
//    Versuche aus pts/tpm/fgPct/ftPct zurueckgerechnet:
//      FT-Punkte ≈ 20% der Punkte  -> ftm, fta = ftm/ftPct
//      Feldpunkte = 2·fgm + tpm    -> fgm, fga = fgm/fgPct
//    Dokumentierte Naeherung; mit Saisonstart loest sie sich von
//    selbst durch echte Daten ab.
//  - "value" = Mittel der 9 Kategorie-Z-Scores (gleiche Skala wie
//    der alte statische Block). "bz" = Composite-Z aus den
//    Projections × 10 (fuer die Sortier-Methode "BBM-Style").
//
//  Output: data/team-analytics.js — TEAM_ANALYTICS_LIVE
//
//  Usage: node scripts/build-team-analytics.js
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'team-analytics.js');

function loadVmObject(file, varName) {
  const code = fs.readFileSync(file, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${code}\nthis.__X__ = typeof ${varName} !== 'undefined' ? ${varName} : null;`, sandbox);
  return sandbox.__X__;
}

const LIVE_PROJECTIONS = loadVmObject(path.join(ROOT, 'data', 'live-projections.js'), 'LIVE_PROJECTIONS');
const ROSTERS_LIVE = loadVmObject(path.join(ROOT, 'data', 'rosters-live.js'), 'ROSTERS_LIVE');
const NAME_ALIASES = loadVmObject(path.join(ROOT, 'data', 'aliases.js'), 'NAME_ALIASES') || {};

if (!LIVE_PROJECTIONS) { console.error('LIVE_PROJECTIONS fehlt — Abbruch.'); process.exit(1); }
if (!ROSTERS_LIVE) { console.error('ROSTERS_LIVE fehlt — Abbruch.'); process.exit(1); }

// ── Namens-Kanonisierung (identische Logik wie build-live-projections) ──
function stripDiacritics(s) { return s.normalize('NFKD').replace(/[\u0300-\u036f]/g, ''); }
function normalizeName(raw) {
  return stripDiacritics(String(raw))
    .toLowerCase()
    .replace(/[.,'’\-]/g, '')
    .replace(/\b(jr|sr|ii|iii|iv|v)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
const aliasByNorm = new Map(Object.entries(NAME_ALIASES).map(([k, v]) => [normalizeName(k), v]));
const projByNorm = new Map(Object.keys(LIVE_PROJECTIONS).map(n => [normalizeName(n), n]));
function findProjection(rawName) {
  const norm = normalizeName(rawName);
  if (projByNorm.has(norm)) return LIVE_PROJECTIONS[projByNorm.get(norm)];
  const alias = aliasByNorm.get(norm);
  if (alias && projByNorm.has(normalizeName(alias))) return LIVE_PROJECTIONS[projByNorm.get(normalizeName(alias))];
  return null;
}

// ── Attempts bestimmen (real oder Preseason-Naeherung) ──
function shootingVolumes(s) {
  if ((s.fga || 0) > 0 || (s.fta || 0) > 0) {
    const g = Math.max(1, s.gamesPlayed || 1);
    return { fgm: s.fgm / g, fga: s.fga / g, ftm: s.ftm / g, fta: s.fta / g };
  }
  const pts = s.pts || 0, tpm = s.tpm || 0;
  const ftPct = (s.ftPct || 75) / 100, fgPct = (s.fgPct || 45) / 100;
  const ftm = 0.2 * pts;
  const fta = ftPct > 0 ? ftm / ftPct : 0;
  const fieldPts = Math.max(0, pts - ftm);
  const fgm = Math.max(0, (fieldPts - tpm) / 2);
  const fga = fgPct > 0 ? fgm / fgPct : 0;
  return { fgm, fga, ftm, fta };
}

// ── Pool aufbauen: alle gerosterten Spieler mit Projection ──
const pool = []; // { teamId, name, s, vol }
Object.keys(ROSTERS_LIVE).forEach(tid => {
  (ROSTERS_LIVE[tid] || []).forEach(p => {
    const s = findProjection(p.name);
    if (!s) return;
    pool.push({ teamId: tid, name: p.name, s, vol: shootingVolumes(s) });
  });
});
if (pool.length < 100) {
  console.error(`Nur ${pool.length} Spieler mit Projection im Pool — sieht nach Datenproblem aus, breche ab ohne zu schreiben.`);
  process.exit(1);
}

// ── Liga-Schnitte fuer FG/FT-Impact (volumengewichtet) ──
const sum = (arr, f) => arr.reduce((a, x) => a + f(x), 0);
const leagueFgPct = sum(pool, x => x.vol.fgm) / Math.max(1e-9, sum(pool, x => x.vol.fga));
const leagueFtPct = sum(pool, x => x.vol.ftm) / Math.max(1e-9, sum(pool, x => x.vol.fta));

// ── Rohwerte je Kategorie ──
//  Reihenfolge/Keys exakt wie AN_CATS in js/analytics.js:
//  pV(PTS) 3V(3PM) rV(REB) aV(AST) sV(STL) bV(BLK) fgV(FG-Impact)
//  ftV(FT-Impact) toV(TO, invertiert)
function rawCats(x) {
  const s = x.s, v = x.vol;
  return {
    pV: s.pts || 0,
    '3V': s.tpm || 0,
    rV: s.reb || 0,
    aV: s.ast || 0,
    sV: s.stl || 0,
    bV: s.blk || 0,
    fgV: v.fga > 0 ? (v.fgm / v.fga - leagueFgPct) * v.fga : 0,
    ftV: v.fta > 0 ? (v.ftm / v.fta - leagueFtPct) * v.fta : 0,
    toV: s.tov || 0, // wird unten invertiert z-gescored
  };
}
const rawByPlayer = pool.map(x => ({ x, raw: rawCats(x) }));

const CATS = ['pV', '3V', 'rV', 'aV', 'sV', 'bV', 'fgV', 'ftV', 'toV'];
const stats = {};
CATS.forEach(c => {
  const vals = rawByPlayer.map(r => r.raw[c]);
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length) || 1;
  stats[c] = { mean, sd };
});
function zOf(c, val) {
  const { mean, sd } = stats[c];
  const z = (val - mean) / sd;
  return c === 'toV' ? -z : z; // TO: weniger ist besser
}

// ── Team-Struktur im AN_ROSTER-Format schreiben ──
const round3 = n => Math.round(n * 1000) / 1000;
const teams = {};
rawByPlayer.forEach(({ x, raw }) => {
  const zs = {};
  CATS.forEach(c => { zs[c] = round3(zOf(c, raw[c])); });
  const value = round3(CATS.reduce((a, c) => a + zs[c], 0) / CATS.length);
  const bz = round3((typeof x.s.z === 'number' ? x.s.z : value * 10) * 10);
  (teams[x.teamId] = teams[x.teamId] || []).push({ name: x.name, value, bz, ...zs });
});
Object.values(teams).forEach(list => list.sort((a, b) => b.value - a.value));

const skipped = [];
Object.keys(ROSTERS_LIVE).forEach(tid => {
  (ROSTERS_LIVE[tid] || []).forEach(p => { if (!findProjection(p.name)) skipped.push(p.name); });
});

const now = new Date().toISOString();
const out = `// ============================================================
//  TEAM ANALYTICS — automatisch aus den Projections gebaut
// ============================================================
//  AUTO-GENERIERT von scripts/build-team-analytics.js ueber die
//  "Daily 9cat Live Scores" GitHub Action. Nicht von Hand editieren.
//  Zuletzt gebaut: ${now}
//
//  Basis: LIVE_PROJECTIONS (Baseline + Live Blend) × ROSTERS_LIVE.
//  Spieler ohne Projection sind bewusst NICHT enthalten (frueher
//  stattdessen -2.0-Sentinels, die die Team-Scores verzerrt haben).
//  Ohne Projection uebersprungen: ${skipped.length} Spieler.
//
//  Wird von js/analytics.js als AN_ROSTER-Basis geladen.
// ============================================================

const TEAM_ANALYTICS_LIVE = ${JSON.stringify(teams)};
`;

fs.writeFileSync(OUT, out, 'utf8');
console.log(`${OUT} geschrieben: ${pool.length} Spieler ueber ${Object.keys(teams).length} Teams, ${skipped.length} ohne Projection uebersprungen.`);
if (skipped.length) console.log('  Uebersprungen: ' + skipped.slice(0, 15).join(', ') + (skipped.length > 15 ? ' …' : ''));
