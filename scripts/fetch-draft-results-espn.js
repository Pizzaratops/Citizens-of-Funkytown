#!/usr/bin/env node
// ============================================================
//  DRAFT RESULTS ABRUFEN — wer hat wen gepickt (abgeschlossener Draft)
// ============================================================
//  Anders als scripts/sync-espn-picks.js (Pick-BESITZ, taeglich, nur
//  der bevorstehende Draft) holt dieses Script Pick-INHALT fuer einen
//  bereits gelaufenen Draft: welcher Spieler ging an welches Team, bei
//  welchem Pick. Manuell ausgeloest, nicht taeglich -- ein
//  abgeschlossener Draft aendert sich nicht mehr.
//
//  NAMENSAUFLOESUNG
//  mDraftDetail liefert je Pick nur eine playerId, keinen Namen. Statt
//  eine neue, ungetestete ESPN-View zu raten, wird hier derselbe Weg
//  genutzt, den scripts/sync-espn-rosters.js bereits erfolgreich
//  einsetzt: view=mRoster liefert je Spieler direkt player.fullName.
//  Es werden also BEIDE Views fuer dieselbe Saison abgefragt, und die
//  playerId aus draftDetail wird gegen die playerId aus den aktuellen
//  Rostern dieser Saison nachgeschlagen.
//
//  GRENZE: Ein Spieler, der seit dem Draft von jedem Roster geworfen
//  wurde (Waiver, Free Agent), taucht in KEINEM aktuellen Roster mehr
//  auf und kann so nicht aufgeloest werden. Diese Picks werden mit
//  nameSource:'unresolved' und der blossen ESPN-ID markiert statt
//  geraten oder weggelassen.
//
//  Schreibt data/draft-results-<saison>.js. Nicht fatal bei Fehlern.
//
//  Usage:
//    node scripts/fetch-draft-results-espn.js --season 2026
//    node scripts/fetch-draft-results-espn.js            (Standard: ESPN_SEASON - 1)
// ============================================================

const fs = require('fs');
const path = require('path');
const https = require('https');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

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
  const arg = process.argv.indexOf('--season');
  const season = arg > -1 ? parseInt(process.argv[arg + 1], 10) : cfg.ESPN_SEASON - 1;

  const base = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/${season}/segments/0/leagues/${cfg.ESPN_LEAGUE_ID}`;

  console.log(`Draft Results für ESPN-Saison ${season}, Liga ${cfg.ESPN_LEAGUE_ID}`);

  // ── 1. Draft-Reihenfolge und Picks ──────────────────────────
  const draftData = await httpsGetJson(`${base}?view=mDraftDetail`);
  const dd = draftData.draftDetail;
  if (!dd) throw new Error('Kein draftDetail in der Antwort -- falsche Saison/Liga-ID?');
  if (!dd.drafted) {
    console.warn(`Warnung: ESPN meldet den Draft für Saison ${season} noch nicht als abgeschlossen. Ergebnisse können unvollständig sein.`);
  }
  const rawPicks = (dd.picks || []).filter(p => p.playerId && p.playerId > 0);
  if (!rawPicks.length) throw new Error('draftDetail.picks enthält keine besetzten Picks (playerId) -- Draft evtl. noch nicht gelaufen.');

  // ── 2. Spielernamen ueber dieselbe Saison-Roster-Abfrage ────
  //     (derselbe Weg wie scripts/sync-espn-rosters.js, view=mRoster).
  const rosterData = await httpsGetJson(`${base}?view=mRoster&view=mTeam`);
  const nameById = new Map();
  (rosterData.teams || []).forEach(t => {
    (t.roster?.entries || []).forEach(entry => {
      const pi = entry.playerPoolEntry || {};
      const p = pi.player || {};
      if (p.id && p.fullName) nameById.set(p.id, p.fullName);
    });
  });
  console.log(`  ${nameById.size} Spielernamen aus aktuellen Rostern dieser Saison aufgelöst.`);

  // ── 3. Zusammenfuehren ───────────────────────────────────────
  // unresolvedCount zaehlt NUR Picks, die tatsaechlich im Ergebnis
  // landen -- ein Pick mit unbekanntem ESPN-Team wird komplett
  // uebersprungen (siehe Filter unten) und soll die Zaehlung nicht
  // verfaelschen.
  const picks = rawPicks.map(p => {
    const ttTeam = cfg.ESPN_TO_TT_TEAM[p.teamId];
    const name = nameById.get(p.playerId);
    return {
      round: p.roundId,
      overallPickNumber: p.overallPickNumber,
      teamId: ttTeam ?? null,
      playerId: p.playerId,
      playerName: name || null,
      nameSource: name ? 'roster' : 'unresolved',
    };
  }).filter(p => p.teamId !== null); // unbekanntes ESPN-Team ueberspringen, nicht raten

  const unresolvedCount = picks.filter(p => p.nameSource === 'unresolved').length;

  picks.sort((a, b) => a.overallPickNumber - b.overallPickNumber);

  const out = `// ============================================================
//  AUTO-GENERIERT von scripts/fetch-draft-results-espn.js.
//  Manuell ausgeloest über "Draft Results abrufen" in GitHub Actions,
//  läuft NICHT täglich -- ein abgeschlossener Draft ändert sich nicht
//  mehr. Erneut ausführen, falls sich die Namensauflösung verbessern
//  soll (z.B. nachdem ein zunächst nicht auflösbarer Spieler wieder
//  auf einem Roster auftaucht).
//  Zuletzt abgerufen: ${new Date().toISOString()}
// ============================================================

const DRAFT_RESULTS = {
  espnSeason: ${season},
  fetchedAt: "${new Date().toISOString()}",
  unresolvedCount: ${unresolvedCount},
  picks: ${JSON.stringify(picks)},
};
`;

  const outPath = path.join(ROOT, 'data', `draft-results-${season}.js`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, out, 'utf8');
  console.log(`${path.relative(ROOT, outPath)} geschrieben: ${picks.length} Picks, davon ${unresolvedCount} ohne aufgelösten Namen.`);

  // Zusätzlich als "aktive" Datei ablegen, die index.html laedt --
  // damit die Draft-Results-Seite ohne Jahresauswahl sofort etwas
  // zeigt. Zeigt immer die zuletzt abgerufene Saison.
  const activePath = path.join(ROOT, 'data', 'draft-results-active.js');
  fs.writeFileSync(activePath, out.replace('const DRAFT_RESULTS', 'const DRAFT_RESULTS'), 'utf8');
  console.log(`${path.relative(ROOT, activePath)} aktualisiert (aktive Saison für die Draft Results Seite).`);
}

main().catch(err => {
  console.error('Draft Results Abruf fehlgeschlagen:', err.message);
  process.exit(1); // hier bewusst fatal: manuell ausgeloest, Fehler soll auffallen
});
