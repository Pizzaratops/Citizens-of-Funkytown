#!/usr/bin/env node
// ============================================================
//  PICK-JOURNAL ANWENDEN
// ============================================================
//  Liest scripts/data/pick-trades-manual.txt (siehe Kommentar dort
//  fuer das Zeilenformat) und schreibt die Eintraege in den
//  "manuell"-Abschnitt von data/picks-live.js. Der "automatisch"-
//  Abschnitt (von scripts/sync-espn-picks.js) bleibt dabei unangetastet
//  -- genau umgekehrt zu dessen eigenem Verhalten, das den "manuell"-
//  Teil stehen laesst.
//
//  Anders als der ESPN-Sync validiert dieses Script NICHT, ob das
//  (year,round,originalOwner)-Tripel tatsaechlich in data/picks.js
//  existiert, bevor es schreibt -- das waere zwar sicherer, aber
//  data/picks.js selbst per vm zu laden nur um eine Warnung auszugeben.
//  Stattdessen: die App zeigt einen Pick, den es nicht kennt, schlicht
//  nirgends an -- kein Absturz, nur ein stiller Pick. Bei Unsicherheit
//  im Admin unter "Pick übertragen" nachsehen, ob das Tripel existiert.
//
//  Usage:
//    node scripts/apply-pick-journal.js
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const JOURNAL = path.join(__dirname, 'data', 'pick-trades-manual.txt');
const OUT = path.join(ROOT, 'data', 'picks-live.js');

function parseJournal() {
  if (!fs.existsSync(JOURNAL)) {
    throw new Error(`${path.relative(ROOT, JOURNAL)} nicht gefunden`);
  }
  const raw = fs.readFileSync(JOURNAL, 'utf8');
  const zeilen = [];
  const fehler = [];

  raw.split('\n').forEach((line, i) => {
    const zeile = line.split('#')[0].trim();
    if (!zeile) return;
    const teile = zeile.split(',').map(s => s.trim());
    if (teile.length < 5) {
      fehler.push(`Zeile ${i + 1}: erwarte mindestens 5 Felder (datum, jahr, runde, originalOwner, neuerBesitzer), habe ${teile.length}: "${zeile}"`);
      return;
    }
    const [datum, jahrS, rundeS, origS, neuS, ...notizTeile] = teile;
    const jahr = parseInt(jahrS, 10), runde = parseInt(rundeS, 10);
    const original = parseInt(origS, 10), neu = parseInt(neuS, 10);
    if ([jahr, runde, original, neu].some(n => !Number.isFinite(n))) {
      fehler.push(`Zeile ${i + 1}: Jahr/Runde/Original/Neu müssen Zahlen sein: "${zeile}"`);
      return;
    }
    zeilen.push({ datum, year: jahr, round: runde, originalOwner: original, currentOwner: neu, notiz: notizTeile.join(', ') });
  });

  if (fehler.length) {
    throw new Error(`Journal enthält ${fehler.length} fehlerhafte Zeile(n):\n  ` + fehler.join('\n  '));
  }
  return zeilen;
}

function main() {
  const manuell = parseJournal();

  // "automatisch"-Abschnitt der bestehenden Datei unangetastet lassen.
  let bestehendAutomatisch = [];
  let ttYear = null, espnSeason = null;
  if (fs.existsSync(OUT)) {
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(`${fs.readFileSync(OUT, 'utf8')}\nthis.__EXIST__ = PICKS_LIVE;`, sandbox);
    if (sandbox.__EXIST__) {
      bestehendAutomatisch = sandbox.__EXIST__.automatisch || [];
      ttYear = sandbox.__EXIST__.ttYear;
      espnSeason = sandbox.__EXIST__.espnSeason;
    }
  }

  const out = `// ============================================================
//  data/picks-live.js -- Override-Basis für PICKS aus data/picks.js.
//  Zwei Quellen, zwei Abschnitte:
//
//    "automatisch" -- von scripts/sync-espn-picks.js, deckt nur den
//    bevorstehenden ESPN-Draft ab. Unangetastet von diesem Lauf.
//
//    "manuell" -- AUTO-GENERIERT von scripts/apply-pick-journal.js aus
//    scripts/data/pick-trades-manual.txt. Nicht direkt editieren,
//    stattdessen eine Zeile im Journal ergänzen und dieses Script
//    erneut laufen lassen.
//    Zuletzt angewendet: ${new Date().toISOString()}
//
//  Wird von js/admin.js beim Seitenstart als Basis über PICKS gelegt.
// ============================================================

const PICKS_LIVE = {
  ttYear: ${ttYear !== null ? ttYear : 'null /* noch kein ESPN-Sync gelaufen */'},
  espnSeason: ${espnSeason !== null ? espnSeason : 'null'},
  aktualisiert: "${new Date().toISOString()}",
  automatisch: ${JSON.stringify(bestehendAutomatisch)},
  manuell: ${JSON.stringify(manuell)},
  get updates() { return this.automatisch.concat(this.manuell); },
};
`;

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, out, 'utf8');
  console.log(`${path.relative(ROOT, OUT)} geschrieben: ${manuell.length} manuelle Einträge aus dem Journal, ${bestehendAutomatisch.length} automatische Einträge unangetastet übernommen.`);
}

try {
  main();
} catch (err) {
  console.error('Pick-Journal anwenden fehlgeschlagen:', err.message);
  process.exit(1); // hier bewusst fatal: ein kaputtes Journal soll aktiv auffallen
}
