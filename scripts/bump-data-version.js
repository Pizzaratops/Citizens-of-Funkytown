#!/usr/bin/env node
// ============================================================
//  CACHE-BUSTER FUER DATENDATEIEN
// ============================================================
//  Problem: index.html laedt die Datendateien mit einer FESTEN
//  Versionsnummer, z.B. <script src="data/rosters-live.js?v=1">.
//  Der Inhalt dieser Dateien aendert sich taeglich durch die
//  Workflows, die URL aber nicht. Ein Browser mit aggressivem Cache
//  darf deshalb die alte Fassung ausliefern -- und tut es auch. In
//  der Praxis heisst das: ein Trade ist im Repo, aber auf der Seite
//  taucht er nicht auf, und niemand kommt auf die Idee, dass der
//  Cache schuld ist.
//
//  Loesung: Die Versionsnummer aus dem INHALT ableiten. Aendert sich
//  die Datei, aendert sich der Hash und damit die URL, der Browser
//  holt neu. Aendert sie sich nicht, bleibt alles wie es war und der
//  Cache greift weiter -- genau so soll es sein.
//
//  Betrifft ausschliesslich <script src="data/...">. Anwendungscode
//  unter js/ und css/ wird bewusst NICHT angefasst: dort pflegt
//  Beyaz die Versionsnummern von Hand, und ein Script, das ihm da
//  hineinschreibt, wuerde bei jedem Lauf Diffs erzeugen, die nichts
//  mit den Daten zu tun haben.
//
//  Idempotent: Zweimal hintereinander laufen aendert beim zweiten Mal
//  nichts. Fehlt eine referenzierte Datei, bleibt ihre URL unberuehrt
//  und es gibt eine Warnung, keinen Abbruch -- ein kaputter
//  Cache-Buster darf den taeglichen Workflow nicht stoppen.
//
//  Usage:
//    node scripts/bump-data-version.js
// ============================================================

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'index.html');

function shortHash(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha1').update(buf).digest('hex').slice(0, 8);
}

// ============================================================
//  SCHUTZ GEGEN UNAUFGELOESTE MERGE-KONFLIKTE (16./17.08.2026)
// ============================================================
//  Vorfall: ein Commit ("hashtag") landete mit unaufgeloesten
//  Konfliktmarkern (<<<<<<< HEAD / ======= / >>>>>>>) in index.html im
//  Repo. Da dieses Script nur gezielt ?v=-Parameter per Regex ersetzt
//  und den Rest der Datei nicht anfasst, war ihm das komplett egal --
//  es hat den kaputten Zustand klaglos jeden Tag weiter mit frischen
//  Hashes versehen und committet. Sichtbar wurde es erst, als die
//  Marker als Text auf der echten Seite auftauchten.
//
//  Diese Pruefung laeuft VOR allem anderen und ist bewusst FATAL
//  (anders als der Rest dieses Scripts, siehe unten) -- ein
//  Datenintegritaetsfehler dieser Art soll den taeglichen Workflow
//  sichtbar rot einfaerben, nicht still durchlaufen.
function assertNoConflictMarkers(filePath, content) {
  const markers = [
    { pat: /^<{7} /m, label: '<<<<<<<' },
    { pat: /^>{7} /m, label: '>>>>>>>' },
  ];
  for (const { pat, label } of markers) {
    const m = content.match(pat);
    if (m) {
      const line = content.slice(0, m.index).split('\n').length;
      throw new Error(
        `UNAUFGELOESTER MERGE-KONFLIKT in ${path.relative(ROOT, filePath)}, Zeile ${line} ` +
        `(Marker "${label}"). Das ist wahrscheinlich beim letzten manuellen Merge liegen ` +
        `geblieben -- bitte von Hand pruefen und auflösen, bevor der Workflow weiterlaeuft.`
      );
    }
  }
}

function main() {
  if (!fs.existsSync(HTML)) {
    console.error('index.html nicht gefunden, uebersprungen.');
    return;
  }

  let html = fs.readFileSync(HTML, 'utf8');
  assertNoConflictMarkers(HTML, html); // wirft und stoppt den Workflow, siehe oben
  let changed = 0, unchanged = 0, missing = 0;

  // Nur data/-Skripte, mit oder ohne bestehenden ?v=-Parameter.
  html = html.replace(
    /(<script\s+src=")(data\/[^"?]+\.js)(\?v=[^"]*)?(")/g,
    (full, pre, rel, oldQuery, post) => {
      const abs = path.join(ROOT, rel);
      if (!fs.existsSync(abs)) {
        console.warn(`  ! ${rel} referenziert, aber nicht vorhanden -- unveraendert gelassen`);
        missing++;
        return full;
      }
      const v = shortHash(abs);
      const newQuery = `?v=${v}`;
      if (oldQuery === newQuery) { unchanged++; return full; }
      changed++;
      return pre + rel + newQuery + post;
    }
  );

  if (changed) {
    fs.writeFileSync(HTML, html, 'utf8');
    console.log(`Cache-Buster: ${changed} aktualisiert, ${unchanged} unveraendert${missing ? `, ${missing} fehlend` : ''}.`);
  } else {
    console.log(`Cache-Buster: nichts zu tun (${unchanged} unveraendert${missing ? `, ${missing} fehlend` : ''}).`);
  }
}

try {
  main();
} catch (err) {
  if (String(err.message).includes('MERGE-KONFLIKT')) {
    // Bewusst FATAL, siehe assertNoConflictMarkers oben.
    console.error('❌ ' + err.message);
    process.exit(1);
  }
  // Alles andere bleibt nicht fatal: lieber ein veralteter Cache als
  // ein abgebrochener Workflow, der die frischen Daten gar nicht erst
  // committet.
  console.error('Cache-Buster fehlgeschlagen (Workflow laeuft weiter):', err.message);
}
