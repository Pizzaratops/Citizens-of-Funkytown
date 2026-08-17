#!/usr/bin/env node
// ============================================================
//  ESPN PICK-SYNC — automatischer Abgleich fuer den bevorstehenden Draft
// ============================================================
//  HINTERGRUND
//  Die normale Trade-Erkennung (scripts/detect-espn-trades.js) vergleicht
//  Kader von gestern und heute. Ein Trade, der nur Draft-Picks bewegt,
//  aendert keinen Kader und ist dafuer unsichtbar -- so ist am 11.08.2026
//  ein kompletter Pick-Trade durchgerutscht.
//
//  scripts/probe-espn-picks.js hat in mehreren Runden geklaert, woraus
//  sich ein verlaesslicher Pick-Sync bauen laesst:
//    - draftDetail liefert fuer JEDEN Pick des bevorstehenden Drafts
//      teamId (aktueller Besitzer) und owningTeamIds[0] (urspruenglicher
//      Besitzer). Gegen 18 bekannte Pick-Trades aus dem
//      Transaktionsprotokoll gegengeprueft: teamId stimmte in ALLEN 18
//      Faellen mit dem tatsaechlichen Handelsziel ueberein.
//    - nominatingTeamId ist vor Draftstart durchgehend 0 und daher
//      nutzlos.
//    - Das Transaktionsprotokoll (mTransactions2) wird deshalb fuer
//      diesen Sync gar nicht gebraucht -- ein einziger draftDetail-Abruf
//      reicht.
//
//  JAHRESZUORDNUNG (wichtig, siehe auch js/espn-sync.js)
//  ESPN nummeriert die Saison nach dem Jahr, in dem sie ENDET -- die
//  Saison 2026/27 heisst bei ESPN "2027". TTHQs eigene Pick-Jahre in
//  data/picks.js zaehlen dagegen nach dem Kalenderjahr, in dem der Draft
//  STATTFINDET. Der bevorstehende Draft (ESPN-Saison = ESPN_SEASON,
//  aktuell 2027, noch nicht gedraftet) ist deshalb TTHQ-Jahr
//  ESPN_SEASON - 1 (aktuell 2026). Ueberprueft an zwei echten Trades vom
//  11.08.2026, siehe Bericht vom selben Tag.
//
//  GRENZE, DIE DIESES SCRIPT NICHT AUFHEBT
//  ESPN modelliert immer nur den unmittelbar bevorstehenden Draft. Picks
//  fuer den Draft DANACH (TTHQ-Jahr ESPN_SEASON, also aktuell 2027)
//  existieren bei ESPN nicht und koennen hier nie auftauchen. Dafuer:
//  scripts/data/pick-trades-manual.txt +
//  scripts/apply-pick-journal.js.
//
//  WAS DAS SCRIPT SCHREIBT
//  NICHT direkt in data/picks.js (das ist von Hand gepflegt, inklusive
//  Kommentaren und der Sonderstruktur DRAFT_2026_SLOT_ORDER). Stattdessen
//  nach data/picks-live.js, im selben Muster wie data/rosters-live.js:
//  eine schlanke Override-Liste, die js/admin.js beim Laden ueber die
//  handgepflegten Picks legt, BEVOR ein manueller Admin-Override greift
//  (siehe _hydratePicksFromLiveFile in js/admin.js -- der gewinnt bei
//  Bedarf weiterhin).
//
//  Nicht fatal: schlaegt der Abruf fehl, bleibt die letzte gute
//  picks-live.js unveraendert stehen, der taegliche Workflow laeuft
//  weiter.
//
//  Usage:
//    node scripts/sync-espn-picks.js
// ============================================================

const fs = require('fs');
const path = require('path');
const https = require('https');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const PICKS_JS = path.join(ROOT, 'data', 'picks.js');
const OUT = path.join(ROOT, 'data', 'picks-live.js');

function loadConfig() {
  const code = fs.readFileSync(path.join(ROOT, 'js', 'espn-sync.js'), 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(
    `${code}\nthis.__CFG__ = { ESPN_LEAGUE_ID, ESPN_SEASON, ESPN_TO_TT_TEAM };`,
    sandbox
  );
  return sandbox.__CFG__;
}

// Nur zum Gegenpruefen, ob ein (year,round,originalOwner)-Tripel
// ueberhaupt in der handgepflegten Basis existiert -- das Script legt
// NIE einen neuen Pick an, ein unbekanntes Tripel ist immer ein Zeichen
// fuer eine falsche Team-Zuordnung, kein neuer Pick.
function loadKnownPickKeys() {
  const code = fs.readFileSync(PICKS_JS, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${code}\nthis.__PICKS__ = PICKS;`, sandbox);
  const keys = new Set();
  (sandbox.__PICKS__ || []).forEach(p => keys.add(`${p.year}-${p.round}-${p.originalOwner}`));
  return keys;
}

function httpsGetJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'taco-tuesday-hq-bot', 'Accept': 'application/json' },
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGetJson(res.headers.location).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('keine gültige JSON-Antwort')); }
      });
    }).on('error', reject);
  });
}

async function main() {
  const cfg = loadConfig();
  const ttYear = cfg.ESPN_SEASON - 1;
  const knownKeys = loadKnownPickKeys();

  const url = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/${cfg.ESPN_SEASON}/segments/0/leagues/${cfg.ESPN_LEAGUE_ID}?view=mDraftDetail`;
  const data = await httpsGetJson(url);
  const picks = (data.draftDetail && data.draftDetail.picks) || [];
  if (!picks.length) throw new Error('draftDetail.picks ist leer -- ESPN liefert für diese Saison keine Picks');

  const updates = [];
  const uebersprungen = [];

  picks.forEach(p => {
    const espnOriginal = Array.isArray(p.owningTeamIds) ? p.owningTeamIds[0] : undefined;
    const espnCurrent = p.teamId;
    if (espnOriginal === undefined || espnCurrent === undefined) return;

    const ttOriginal = cfg.ESPN_TO_TT_TEAM[espnOriginal];
    const ttCurrent = cfg.ESPN_TO_TT_TEAM[espnCurrent];
    // Kein Mapping heisst Taxi Squad, Free-Agent-Slot o.ae. -- nichts,
    // das TTHQ als Liga-Team kennt. Ueberspringen statt raten.
    if (ttOriginal === undefined || ttCurrent === undefined) return;

    const key = `${ttYear}-${p.roundId}-${ttOriginal}`;
    if (!knownKeys.has(key)) {
      // Existiert in data/picks.js nicht -- entweder eine falsche
      // Team-Zuordnung in ESPN_TO_TT_TEAM, oder ein Pick, den die Basis
      // (noch) nicht kennt. Wird gemeldet, aber NICHT angelegt.
      uebersprungen.push({ overallPickNumber: p.overallPickNumber, round: p.roundId, ttOriginal, ttCurrent, grund: 'unbekanntes (year,round,originalOwner)-Tripel' });
      return;
    }

    updates.push({
      year: ttYear, round: p.roundId, originalOwner: ttOriginal, currentOwner: ttCurrent,
      overallPickNumber: p.overallPickNumber, // nur zur Nachvollziehbarkeit im Diff, nicht fachlich genutzt
    });
  });

  // data/picks-live.js wird von ZWEI Scripts gemeinsam gefuellt: diesem
  // hier (automatisch, nur der bevorstehende Draft) und
  // scripts/apply-pick-journal.js (manuell, alles Weitere). Die
  // "manuell"-Liste einer evtl. bereits vorhandenen Datei bleibt beim
  // Schreiben erhalten, damit ein Lauf dieses Scripts nicht die Arbeit
  // des anderen loescht.
  let bestehendManuell = [];
  if (fs.existsSync(OUT)) {
    try {
      const sandbox = {};
      vm.createContext(sandbox);
      vm.runInContext(`${fs.readFileSync(OUT, 'utf8')}\nthis.__EXIST__ = PICKS_LIVE;`, sandbox);
      if (sandbox.__EXIST__ && Array.isArray(sandbox.__EXIST__.manuell)) {
        bestehendManuell = sandbox.__EXIST__.manuell;
      }
    } catch (e) { /* vorherige Datei kaputt/leer -- ohne manuellen Teil neu schreiben */ }
  }

  const out = `// ============================================================
//  data/picks-live.js -- Override-Basis fuer PICKS aus data/picks.js.
//  Zwei Quellen, zwei Abschnitte:
//
//    "automatisch" -- AUTO-GENERIERT von scripts/sync-espn-picks.js
//    über die "Daily 9cat Live Scores" GitHub Action. Nicht von Hand
//    editieren, wird bei jedem Lauf komplett neu geschrieben. Deckt
//    AUSSCHLIESSLICH den bevorstehenden ESPN-Draft ab (TTHQ-Jahr
//    ${ttYear} = ESPN-Saison ${cfg.ESPN_SEASON}).
//    Zuletzt synchronisiert: ${new Date().toISOString()}
//
//    "manuell" -- von scripts/apply-pick-journal.js aus
//    scripts/data/pick-trades-manual.txt geschrieben. Deckt Picks fuer
//    spaetere Drafts ab, die ESPN nie sieht. Bleibt bei einem Lauf
//    dieses Scripts unangetastet stehen.
//
//  Wird von js/admin.js beim Seitenstart als Basis über PICKS gelegt
//  (_hydratePicksFromLiveFile), bevor ein manueller Admin-Override
//  (falls vorhanden) das letzte Wort behält. Legt NIE einen neuen Pick
//  an -- nur (year,round,originalOwner)-Tripel, die data/picks.js
//  bereits kennt, werden aktualisiert.
// ============================================================

const PICKS_LIVE = {
  ttYear: ${ttYear},
  espnSeason: ${cfg.ESPN_SEASON},
  aktualisiert: "${new Date().toISOString()}",
  automatisch: ${JSON.stringify(updates)},
  manuell: ${JSON.stringify(bestehendManuell)},
  // Fuer die Hydrierung in js/admin.js zaehlt die Summe beider Listen.
  get updates() { return this.automatisch.concat(this.manuell); },
};
`;

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, out, 'utf8');
  console.log(`${path.relative(ROOT, OUT)} geschrieben: ${updates.length} Picks automatisch abgeglichen (TTHQ-Jahr ${ttYear}), ${bestehendManuell.length} manuelle Einträge unangetastet übernommen.`);
  if (uebersprungen.length) {
    console.warn(`  ${uebersprungen.length} Pick(s) übersprungen, weil (year,round,originalOwner) in data/picks.js unbekannt ist:`);
    uebersprungen.slice(0, 10).forEach(u => console.warn(`    Pick #${u.overallPickNumber}, Runde ${u.round}, TT-Team ${u.ttOriginal} → ${u.ttCurrent}`));
  }
}

main().catch(err => {
  // Nicht fatal: der letzte gute Stand von data/picks-live.js bleibt
  // stehen, der taegliche Workflow laeuft weiter.
  console.error('ESPN Pick-Sync fehlgeschlagen (nicht kritisch):', err.message);
  process.exit(0);
});
