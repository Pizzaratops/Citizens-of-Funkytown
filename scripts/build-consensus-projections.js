#!/usr/bin/env node
// ============================================================
//  CONSENSUS PROJECTIONS — Beyaz × Josh Lloyd (BBM) × Hashtag Basketball
// ============================================================
//  Bildet den Mittelwert aus DREI unabhaengigen Projections-Quellen:
//    a) data/projections-baseline.js  — Beyaz' eigene Projections
//    b) Basketball Monster / Josh Lloyd
//    c) Hashtag Basketball
//
//  ERWEITERT von der urspruenglichen Zwei-Quellen-Fassung (16.08.2026).
//  Die Architektur ist bewusst so gebaut, dass eine vierte Quelle
//  spaeter nur bedeutet, hier eine weitere Datei einzulesen -- der Rest
//  (Mittelung, Plausibilitaetspruefung, Speicherformat) bleibt generisch
//  ueber alle vorhandenen Quellen.
//
//  METHODIK
//
//  1. ZAEHLSTATS (min, pts, reb, ast, stl, blk, tpm, tov)
//     Einfacher arithmetischer Mittelwert ueber alle Quellen, die
//     diesen Spieler kennen. Eine Quelle, die ihn nicht listet, zaehlt
//     NICHT als 0 -- sie wird beim Mittelwert schlicht ausgelassen.
//
//  2. PROZENTE (FG%, FT%) — volumengewichtet ueber alle Quellen
//     Prozente werden gemittelt und ueber die verfuegbaren Wurfversuche
//     zurueck in Makes/Attempts gerechnet, genau wie in der
//     Zwei-Quellen-Fassung. Beyaz' Baseline hat selbst keine Attempts
//     (nur Prozente), verwendet deshalb ersatzweise die Attempts der
//     anderen Quellen als Volumen-Naeherung.
//
//  3. SPIELER NICHT IN ALLEN QUELLEN
//     Werden mit den vorhandenen Quellen gemittelt, nicht verworfen.
//     Das Feld `sources` ist jetzt ein sortierter String aus den
//     Buchstaben der beitragenden Quellen (z.B. "abc", "ab", "b") statt
//     der fruehen benannten Strings -- das verallgemeinert sauber auf
//     beliebig viele Quellen. `sourceCount` zaehlt sie zusaetzlich.
//
//  4. PLAUSIBILITAETSPRUEFUNG (nur fuer Beyaz' Baseline, Quelle a)
//     Rund 30-40 Spieler in Beyaz' Baseline haben Werte, die pro Spiel
//     unmoeglich sind (>1.05 Punkte pro Minute, siehe isImplausible).
//     Diese werden erkannt und aus der Mittelung ausgeschlossen -- der
//     Konsens bildet sich dann nur aus den verbleibenden Quellen (b/c).
//     Mit der dritten Quelle mehr Redundanz als vorher: faellt einmal
//     die Baseline UND eine der beiden anderen weg, bleibt immer noch
//     die dritte als Grundlage.
//
//  5. ROHWERTE ALLER DREI QUELLEN bleiben einzeln erhalten (Felder a/b/c
//     im Ausgabeobjekt). Nur so kann die Seite je Quelle einen eigenen
//     Rang berechnen und die Streuung zwischen den drei Meinungen
//     zeigen ("Δ Rang").
//
//  6. NUR-BEYAZ-BEREINIGUNG (17.08.2026)
//     Spieler mit sources==='a' (nur Beyaz' eigene Baseline, weder BBM
//     noch Hashtag projizieren sie) werden verworfen, AUSSER:
//       - sie stehen auf einem aktuellen NBA-Roster
//         (projections/rosters-data.js, taeglicher ESPN-Sync), oder
//       - sie stehen auf der manuellen Ausnahmeliste
//         (scripts/data/consensus-keep-list.txt)
//     Hintergrund: Beyaz' Baseline enthielt hunderte Karteileichen
//     (Mirotic, Wade, Melo, Westbrook, Gasol, ...), aus denen der
//     fruehere Merge munter "Konsens"-Zeilen fuer laengst aus der Liga
//     verschwundene Spieler baute. Zwei unabhaengige externe Quellen,
//     die BEIDE einen Spieler auslassen, ist ein verlaesslicheres
//     Signal als jeder einzelne Rosterstand -- ergaenzt um die
//     Ausnahmeliste fuer Faelle wie einen aktuell vertragslosen, aber
//     erkennbar noch relevanten Spieler.
//
//  Usage: node scripts/build-consensus-projections.js <bbm.json> <hashtag.json> [rosters-data.js] [keep-list.txt]
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'projections-consensus.js');

function loadBaseline() {
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'data', 'projections-baseline.js'), 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'data', 'aliases.js'), 'utf8'), sandbox);
  vm.runInContext('this.__B__ = PROJECTIONS_BASELINE; this.__N__ = normalizeName;', sandbox);
  return { baseline: sandbox.__B__, normalizeName: sandbox.__N__ };
}

const round = (v, d = 2) => Math.round(v * Math.pow(10, d)) / Math.pow(10, d);

// Schwelle 1.05 P/Min, hergeleitet aus echten Liga-Daten: der
// Spitzenwert der gesamten Liga liegt bei Luka Doncic mit 0.977,
// gefolgt von Giannis mit 0.967. 1.05 laesst reale Extremwerte durch
// und faengt trotzdem alle tatsaechlichen Fehleintraege (der
// niedrigste Fehlerfall liegt bei 1.01, die meisten deutlich ueber
// 1.3).
const MAX_PTS_PER_MIN = 1.05;
function isImplausible(o) {
  return o && o.min > 0 && (o.pts / o.min) > MAX_PTS_PER_MIN;
}

// Kompakter Wertesatz einer einzelnen Quelle -- reicht aus, um daraus
// spaeter einen vollstaendigen 9-Cat-Z-Score zu rechnen.
function srcVals(o, fgaFallback, ftaFallback) {
  if (!o) return null;
  const fga = (o.fga > 0 ? o.fga : (fgaFallback || 0));
  const fta = (o.fta > 0 ? o.fta : (ftaFallback || 0));
  const fgPct = o.fgPct || 0, ftPct = o.ftPct || 0;
  return {
    min: round(o.min || 0, 1),
    pts: round(o.pts || 0, 1),
    reb: round(o.reb || 0, 1),
    ast: round(o.ast || 0, 1),
    stl: round(o.stl || 0, 2),
    blk: round(o.blk || 0, 2),
    tpm: round(o.tpm || 0, 2),
    tov: round((o.tov !== undefined ? o.tov : o.to) || 0, 2),
    fga: round(fga, 2),
    fgm: round(o.fgm > 0 ? o.fgm : fgPct / 100 * fga, 2),
    fta: round(fta, 2),
    ftm: round(o.ftm > 0 ? o.ftm : ftPct / 100 * fta, 2),
    fgPct: round(fgPct, 1),
    ftPct: round(ftPct, 1),
  };
}

const NUM_FIELDS = ['min', 'pts', 'reb', 'ast', 'stl', 'blk', 'tpm', 'tov'];
const DEC = { min: 1, pts: 1, reb: 1, ast: 1, stl: 2, blk: 2, tpm: 2, tov: 2 };

// Mittelwert ueber alle vorhandenen (nicht-null) Wertesaetze.
function averageVals(list) {
  const present = list.filter(Boolean);
  if (!present.length) return null;
  const out = {};
  NUM_FIELDS.forEach(f => {
    out[f] = round(present.reduce((s, v) => s + (v[f] || 0), 0) / present.length, DEC[f]);
  });

  const fgPct = round(present.reduce((s, v) => s + (v.fgPct || 0), 0) / present.length, 1);
  const ftPct = round(present.reduce((s, v) => s + (v.ftPct || 0), 0) / present.length, 1);
  // Attempts: Mittelwert der verfuegbaren Attempts (nicht nur einer
  // Quelle), damit die Ruecktransformation zu Makes robuster ist, wenn
  // mehrere Quellen echte Attempts liefern.
  const fgaSrc = present.map(v => v.fga).filter(x => x > 0);
  const ftaSrc = present.map(v => v.fta).filter(x => x > 0);
  const fga = fgaSrc.length ? round(fgaSrc.reduce((a, b) => a + b, 0) / fgaSrc.length, 2) : 0;
  const fta = ftaSrc.length ? round(ftaSrc.reduce((a, b) => a + b, 0) / ftaSrc.length, 2) : 0;

  out.fgPct = fgPct; out.ftPct = ftPct;
  out.fga = fga; out.fgm = round(fgPct / 100 * fga, 2);
  out.fta = fta; out.ftm = round(ftPct / 100 * fta, 2);
  return out;
}

function loadCurrentRosterNames(rostersPath) {
  if (!rostersPath || !fs.existsSync(rostersPath)) return new Set();
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(rostersPath, 'utf8') + '\nthis.__R__ = ROSTERS_DATA;', sandbox);
  const names = new Set();
  const data = sandbox.__R__;
  if (data && data.rosters) {
    Object.values(data.rosters).forEach(t => (t.players || []).forEach(p => names.add(p.name)));
  }
  return names;
}

function loadKeepList(keepListPath) {
  if (!keepListPath || !fs.existsSync(keepListPath)) return new Set();
  const raw = fs.readFileSync(keepListPath, 'utf8');
  const names = new Set();
  raw.split('\n').forEach(line => {
    const clean = line.split('#')[0].trim();
    if (clean) names.add(clean);
  });
  return names;
}

function main() {
  const bbmPath = process.argv[2];
  const hashtagPath = process.argv[3];
  const rostersPath = process.argv[4] || path.join(ROOT, 'projections', 'rosters-data.js');
  const keepListPath = process.argv[5] || path.join(__dirname, 'data', 'consensus-keep-list.txt');
  if (!bbmPath || !hashtagPath) {
    throw new Error('Aufruf: node build-consensus-projections.js <bbm.json> <hashtag.json>');
  }
  const bbm = JSON.parse(fs.readFileSync(bbmPath, 'utf8'));
  const hashtag = JSON.parse(fs.readFileSync(hashtagPath, 'utf8'));
  const { baseline, normalizeName } = loadBaseline();
  const rosterNames = loadCurrentRosterNames(rostersPath);
  const keepNames = loadKeepList(keepListPath);
  const keepThisPlayer = (name) => rosterNames.has(name) || keepNames.has(name);

  const mineByNorm = new Map();
  Object.keys(baseline).forEach(n => {
    const k = normalizeName(n);
    if (k && !mineByNorm.has(k)) mineByNorm.set(k, n);
  });
  const bbmByNorm = new Map();
  Object.keys(bbm).forEach(n => {
    const k = normalizeName(n);
    if (k && !bbmByNorm.has(k)) bbmByNorm.set(k, n);
  });
  const hashtagByNorm = new Map();
  Object.keys(hashtag).forEach(n => {
    const k = normalizeName(n);
    if (k && !hashtagByNorm.has(k)) hashtagByNorm.set(k, n);
  });

  // Vereinigung aller Spielernamen ueber alle drei Quellen, dedupliziert
  // nach normalisiertem Namen. Anzeigename: bevorzugt Beyaz' Schreibweise
  // (eigene Baseline pflegt am konsistentesten Positions-/Team-Metadaten
  // fuer die App), sonst BBM, sonst Hashtag.
  const allKeys = new Set([...mineByNorm.keys(), ...bbmByNorm.keys(), ...hashtagByNorm.keys()]);

  const result = {};
  const stats = { count3: 0, count2: 0, count1: 0, implausibleA: 0, droppedPhantom: 0, keptViaException: 0 };

  allKeys.forEach(key => {
    const displayName = mineByNorm.get(key) || bbmByNorm.get(key) || hashtagByNorm.get(key);
    const rawA = mineByNorm.has(key) ? baseline[mineByNorm.get(key)] : null;
    const rawB = bbmByNorm.has(key) ? bbm[bbmByNorm.get(key)] : null;
    const rawC = hashtagByNorm.has(key) ? hashtag[hashtagByNorm.get(key)] : null;

    // Attempts-Fallback fuer Beyaz (der selbst keine hat): erst BBM,
    // dann Hashtag.
    const fgaFallback = (rawB && rawB.fga) || (rawC && rawC.fga) || 0;
    const ftaFallback = (rawB && rawB.fta) || (rawC && rawC.fta) || 0;

    let aImplausible = false;
    let vA = srcVals(rawA, fgaFallback, ftaFallback);
    if (vA && isImplausible(rawA)) {
      aImplausible = true;
      stats.implausibleA++;
      vA = null; // aus der Mittelung ausschliessen
    }
    const vB = srcVals(rawB, rawB ? rawB.fga : 0, rawB ? rawB.fta : 0);
    const vC = srcVals(rawC, rawC ? rawC.fga : 0, rawC ? rawC.fta : 0);

    const contributing = [];
    if (vA) contributing.push('a');
    if (vB) contributing.push('b');
    if (vC) contributing.push('c');

    if (!contributing.length) {
      // Nur eine unplausible Beyaz-Zeile und sonst nichts. Ohne
      // Roster-/Keep-Bestaetigung wird das verworfen -- ein Wert, der
      // schon als Zahl unplausibel ist UND von keiner zweiten Quelle
      // gegengeprueft wird UND nicht mal auf einem aktuellen Roster
      // steht, ist keine Zeile, die die App zeigen sollte.
      if (rawA) {
        if (!keepThisPlayer(displayName)) { stats.droppedPhantom++; return; }
        stats.count1++;
        stats.keptViaException++;
        const v = srcVals(rawA, 0, 0);
        result[displayName] = {
          team: '', pos: rawA.pos || '', g: null,
          ...v,
          sources: 'a', sourceCount: 1, aImplausible: true,
          a: v, b: null, c: null,
        };
      }
      return;
    }

    // NUR Beyaz als Quelle (contributing = ['a']), weder BBM noch
    // Hashtag kennen den Spieler: ohne Roster-/Keep-Bestaetigung
    // verwerfen. Siehe Kopfkommentar Punkt 6 fuer die Begruendung.
    if (contributing.length === 1 && contributing[0] === 'a' && !keepThisPlayer(displayName)) {
      stats.droppedPhantom++;
      return;
    }
    if (contributing.length === 1 && contributing[0] === 'a') stats.keptViaException++;

    const merged = averageVals([vA, vB, vC]);
    const team = (rawB && rawB.team) || (rawC && rawC.team) || '';
    const pos = (rawA && rawA.pos) || (rawB && rawB.pos) || (rawC && rawC.pos) || '';
    const g = (rawC && rawC.g) || (rawB && rawB.g) || null;

    stats[`count${contributing.length}`]++;

    const entry = {
      team, pos, g,
      ...merged,
      sources: contributing.join(''),
      sourceCount: contributing.length,
      a: vA, b: vB, c: vC,
    };
    if (aImplausible) entry.aImplausible = true;
    result[displayName] = entry;
  });

  const header = `// ============================================================
//  CONSENSUS PROJECTIONS 2026/27 — Beyaz × Josh Lloyd (BBM) × Hashtag Basketball
// ============================================================
//  AUTO-GENERIERT von scripts/build-consensus-projections.js.
//  Erzeugt am: ${new Date().toISOString()}
//
//  Mittelwert aus DREI unabhängigen Projections-Quellen:
//    a) data/projections-baseline.js (Beyaz)
//    b) Basketball Monster / Josh Lloyd (August-Stand)
//    c) Hashtag Basketball (August-Stand)
//
//  Zählstats werden über alle vorhandenen Quellen gemittelt (fehlende
//  Quelle zählt NICHT als 0, sie wird ausgelassen). FG%/FT% werden
//  gemittelt und über die verfügbaren Wurfversuche zurück in echte
//  Makes/Attempts gerechnet.
//
//  "sources" ist ein String aus den Buchstaben der beitragenden
//  Quellen (z.B. "abc" = alle drei, "bc" = nur BBM+Hashtag, "a" = nur
//  Beyaz). "sourceCount" zählt sie. Verteilung in diesem Lauf:
//    3 Quellen: ${stats.count3} Spieler
//    2 Quellen: ${stats.count2} Spieler
//    1 Quelle:  ${stats.count1} Spieler
//    Beyaz-Werte als unplausibel verworfen (>1.05 Pkt/Min): ${stats.implausibleA}
//
//  Rohwerte aller Quellen bleiben unter a/b/c erhalten -- Grundlage für
//  separate Ränge und die Δ-Rang-Anzeige auf der Seite.
// ============================================================

const PROJECTIONS_CONSENSUS = ${JSON.stringify(result, null, 1)};
`;

  fs.writeFileSync(OUT, header, 'utf8');

  console.log(`${path.relative(ROOT, OUT)} geschrieben.`);
  console.log(`  3 Quellen: ${stats.count3}  |  2 Quellen: ${stats.count2}  |  1 Quelle: ${stats.count1}`);
  console.log(`  Beyaz-Werte verworfen (unplausibel): ${stats.implausibleA}`);
  console.log(`  Nur-Beyaz-Karteileichen entfernt (kein Roster, keine Ausnahme): ${stats.droppedPhantom}`);
  console.log(`  Nur-Beyaz behalten (Roster oder Ausnahmeliste): ${stats.keptViaException}`);
  console.log(`  Rosterquelle: ${rosterNames.size} Spieler | Ausnahmeliste: ${keepNames.size} Spieler`);
  console.log(`  Gesamt: ${Object.keys(result).length}`);
}

main();
