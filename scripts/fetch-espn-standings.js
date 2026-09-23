#!/usr/bin/env node
// ============================================================
//  SAISON-STANDINGS ABRUFEN — wer wurde in welcher Saison
//  1., 2., 3. usw. (Liga-Historie)
// ============================================================
//  Holt für eine oder mehrere ESPN-Saisons die Abschlusstabelle
//  (view=mTeam liefert je Team u.a. record.overall und
//  rankCalculatedFinal -- letzteres ist ESPNs eigene, nach Playoffs
//  berechnete Endplatzierung, nicht bloss die Reguläre-Saison-Bilanz).
//
//  Läuft nach demselben Muster wie scripts/sync-espn-rosters.js und
//  scripts/fetch-draft-results-espn.js: direkter Call gegen den
//  ESPN "reads"-Endpoint, kein Auth-Cookie nötig (funktioniert nur
//  in Node/GitHub Actions, nicht im Browser -- dort blockt CORS).
//
//  NAMENSFORMAT ÄLTERER SAISONS
//  Vor ca. 2019 lieferte ESPN Teamnamen als getrennte location/
//  nickname-Felder statt eines einzelnen name-Felds. Beides wird
//  abgefangen.
//
//  RANK-FALLBACK
//  rankCalculatedFinal ist 0 (bzw. fehlt), wenn ESPN für diese Saison
//  keine offizielle Endplatzierung berechnet hat (z.B. Saison lief
//  noch, oder zu alt/unvollständig importiert). In dem Fall wird
//  ersatzweise nach Sieg-Prozentsatz sortiert und der Platz als
//  "geschätzt" markiert (place bleibt gesetzt, aber estimated:true) --
//  NIE stillschweigend als offizielle Platzierung ausgegeben.
//
//  TEAM-ZUORDNUNG
//  ESPN-Team-IDs sind je Liga über die Jahre stabil, aber nicht
//  jedes heutige Team existierte in jeder Saison (Liga kann kleiner
//  gewesen sein, Teams können die Besitzer gewechselt haben). Die
//  Zuordnung zur heutigen TT-Team-ID läuft über ESPN_TO_TT_TEAM aus
//  js/espn-sync.js; taucht eine ESPN-Team-ID dort nicht auf, wird
//  teamId:null geschrieben (kein Rate-Versuch) und rosterKey bekommt
//  ein "x_"-Präfix mit dem damaligen Teamnamen, analog zum
//  bestehenden Archiv-Format in data/season-2021-22.js.
//
//  AELTERE SAISONS
//  Liefert der normale seasons/<jahr>-Endpoint nichts (bei ESPN typisch
//  fuer weiter zurueckliegende Jahre), wird automatisch der
//  leagueHistory-Endpoint derselben Liga probiert.
//
//  WOCHEN-ERGEBNISSE
//  Pro Saison werden ausserdem die Matchups je Woche geholt und nach
//  data/season-matchups.js geschrieben (Rolling Rankings unter
//  Standings). Der Workflow committet data/season-*.js, beide Dateien
//  fallen darunter.
//
//  OUTPUT (seit 2026-09-23)
//  Eine einzige Datei data/season-history.js mit SEASON_HISTORY, einer
//  nach Saison absteigend sortierten Liste. Neue Laeufe werden mit dem
//  bestehenden Inhalt zusammengefuehrt (gleiche Saison = ersetzt), es
//  geht also nichts verloren, wenn nur eine einzelne Saison abgerufen
//  wird. js/navigation.js (Saison-Dropdown auf Home) und
//  js/standings.js (Standings History) lesen die Liste direkt, von
//  Hand muss nichts mehr eingetragen werden. rosters bleibt leer ({}),
//  dieses Script holt nur die Abschlusstabelle, keine Kader.
//
//  Usage:
//    node scripts/fetch-espn-standings.js --season 2022
//        (eine einzelne ESPN-Saison, z.B. 2022 = Saison 2021/22)
//    node scripts/fetch-espn-standings.js --from 2019 --to 2026
//        (Bereich; Saisons ohne Daten werden übersprungen, nicht
//        fatal -- z.B. falls die Liga in einem der Jahre nicht
//        existierte oder ESPN sie nicht mehr rausgibt)
//    node scripts/fetch-espn-standings.js
//        (Standard: alle abgeschlossenen Saisons von 2019 bis
//        ESPN_SEASON - 1)
// ============================================================

const fs = require('fs');
const path = require('path');
const https = require('https');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const matchupsLib = require('./lib/espn-matchups');

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
      headers: { 'User-Agent': 'citizens-of-funkytown-bot', 'Accept': 'application/json' },
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

function slugify(name) {
  return 'x_' + name
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // Umlaute/Akzente entfernen
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function seasonLabel(espnSeason) {
  const start = espnSeason - 1;
  const endShort = String(espnSeason).slice(-2);
  return `Saison ${start}/${endShort}`;
}

// Holt die Abschlusstabelle für EINE ESPN-Saison. Gibt null zurück
// (statt zu werfen), wenn die Liga für diese Saison offensichtlich
// nicht existiert -- damit ein --from/--to-Lauf über Jahre ohne Liga
// einfach weiterlaufen kann.
async function fetchSeasonStandings(cfg, espnSeason) {
  const base = 'https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba';
  const urls = [
    `${base}/seasons/${espnSeason}/segments/0/leagues/${cfg.ESPN_LEAGUE_ID}?view=mTeam`,
    `${base}/leagueHistory/${cfg.ESPN_LEAGUE_ID}?seasonId=${espnSeason}&view=mTeam`,
  ];
  let data = null;
  for (const url of urls) {
    try {
      const res = await httpsGetJson(url);
      const obj = Array.isArray(res) ? res[0] : res;
      if (obj && Array.isArray(obj.teams) && obj.teams.length) { data = obj; break; }
    } catch (e) {
      console.warn(`  Saison ${espnSeason}: ${url.includes('leagueHistory') ? 'leagueHistory' : 'seasons'}-Abruf fehlgeschlagen (${e.message}).`);
    }
  }
  if (!data) {
    console.warn(`  Saison ${espnSeason}: keine Daten -- übersprungen.`);
    return null;
  }
  const teams = data.teams || [];
  if (!teams.length) {
    console.warn(`  Saison ${espnSeason}: keine Teams in der Antwort -- Liga existierte in dieser Saison vermutlich nicht, übersprungen.`);
    return null;
  }

  const rows = teams.map(t => {
    const name = t.name || `${t.location || ''} ${t.nickname || ''}`.trim() || `Team ${t.id}`;
    const ov = t.record?.overall || {};
    const wins = ov.wins || 0, losses = ov.losses || 0, ties = ov.ties || 0;
    const record = `${wins}-${losses}-${ties}`;
    const finalRank = t.rankCalculatedFinal;
    const ttId = cfg.ESPN_TO_TT_TEAM[t.id] ?? null;
    return {
      espnTeamId: t.id,
      name,
      teamId: ttId,
      record,
      wins, losses, ties,
      pct: ov.percentage ?? (wins + losses + ties > 0 ? wins / (wins + losses + ties) : 0),
      finalRank: (typeof finalRank === 'number' && finalRank > 0) ? finalRank : null,
      rosterKey: ttId != null ? String(ttId) : slugify(name),
    };
  });

  const hasOfficialRanks = rows.every(r => r.finalRank !== null);
  let standings;
  if (hasOfficialRanks) {
    standings = rows
      .sort((a, b) => a.finalRank - b.finalRank)
      .map(r => ({
        place: r.finalRank,
        name: r.name,
        teamId: r.teamId,
        record: r.record,
        rosterKey: r.rosterKey,
      }));
  } else {
    // Fallback: nach Sieg-Prozentsatz sortiert, als geschätzt markiert.
    console.warn(`  Saison ${espnSeason}: ESPN liefert keine vollständige rankCalculatedFinal -- Platzierung nach Sieg-% geschätzt (estimated:true).`);
    standings = rows
      .sort((a, b) => b.pct - a.pct)
      .map((r, i) => ({
        place: i + 1,
        estimated: true,
        name: r.name,
        teamId: r.teamId,
        record: r.record,
        rosterKey: r.rosterKey,
      }));
  }

  return { espnSeason, label: seasonLabel(espnSeason), standings };
}

const HISTORY_PATH = path.join(ROOT, 'data', 'season-history.js');

function loadExistingHistory() {
  if (!fs.existsSync(HISTORY_PATH)) return [];
  try {
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(HISTORY_PATH, 'utf8') + '\nthis.__H__ = SEASON_HISTORY;', sandbox);
    return Array.isArray(sandbox.__H__) ? sandbox.__H__ : [];
  } catch (e) {
    console.warn('Bestehende data/season-history.js nicht lesbar, wird neu aufgebaut:', e.message);
    return [];
  }
}

function writeHistory(fetched) {
  const byYear = new Map(loadExistingHistory().map(s => [s.espnSeason, s]));
  fetched.forEach(s => byYear.set(s.espnSeason, {
    key: `${s.espnSeason - 1}-${String(s.espnSeason).slice(-2)}`,
    espnSeason: s.espnSeason,
    label: s.label,
    standings: s.standings,
    rosters: {},
  }));
  const list = [...byYear.values()].sort((a, b) => b.espnSeason - a.espnSeason);
  const out = `// ============================================================
//  SEASON_HISTORY — Abschlusstabellen aller Funkytown-Saisons
// ============================================================
//  AUTO-GENERIERT von scripts/fetch-espn-standings.js gegen die ESPN
//  API (view=mTeam, rankCalculatedFinal), GitHub Actions "Saison-
//  Standings abrufen". Nicht von Hand editieren, neue Laeufe werden
//  mit dem bestehenden Inhalt zusammengefuehrt.
//  "estimated:true" bei einem Team: ESPN hat fuer diese Saison keine
//  offizielle Endplatzierung berechnet, die Reihenfolge stammt aus dem
//  Sieg-Prozentsatz. teamId null = Team existiert heute nicht mehr.
//  Gelesen von js/navigation.js (Saison-Dropdown) und js/standings.js.
//  Zuletzt abgerufen: ${new Date().toISOString()}
// ============================================================

const SEASON_HISTORY = ${JSON.stringify(list, null, 1)};
`;
  fs.mkdirSync(path.dirname(HISTORY_PATH), { recursive: true });
  fs.writeFileSync(HISTORY_PATH, out, 'utf8');
  console.log(`  ${path.relative(ROOT, HISTORY_PATH)} geschrieben (${list.length} Saisons insgesamt).`);
}

async function main() {
  const cfg = loadConfig();
  const args = process.argv.slice(2);
  const getArg = name => {
    const i = args.indexOf(`--${name}`);
    return i > -1 ? parseInt(args[i + 1], 10) : null;
  };

  const single = getArg('season');
  const from = getArg('from');
  const to = getArg('to');

  let seasons;
  if (single) {
    seasons = [single];
  } else if (from && to) {
    seasons = [];
    for (let s = from; s <= to; s++) seasons.push(s);
  } else {
    // Standard: alle abgeschlossenen Saisons ab 2018 (Liga existiert
    // seit 2018; aeltere Jahre laufen notfalls ueber leagueHistory)
    // bis zur laufenden Saison minus eins.
    seasons = [];
    for (let s = 2018; s < cfg.ESPN_SEASON; s++) seasons.push(s);
  }

  console.log(`Standings-Abruf für ESPN-Liga ${cfg.ESPN_LEAGUE_ID}, Saisons: ${seasons.join(', ')}`);

  const fetched = [];
  const skipped = [];
  const matchups = [];
  for (const espnSeason of seasons) {
    console.log(`Saison ${espnSeason} (${seasonLabel(espnSeason)})...`);
    const season = await fetchSeasonStandings(cfg, espnSeason);
    if (!season) { skipped.push(espnSeason); continue; }
    fetched.push(season);
    // Im selben Lauf die Wochen-Ergebnisse fuer die Rolling Rankings
    // mitnehmen (data/season-matchups.js, siehe scripts/lib/espn-matchups.js).
    // Nicht fatal: fehlen sie, bleibt nur der Rolling-Verlauf dieser Saison leer.
    try {
      const m = await matchupsLib.fetchSeasonMatchups(cfg, espnSeason);
      if (m) { matchups.push(m); console.log(`  ${Object.keys(m.weeks).length} Wochen-Ergebnisse.`); }
    } catch (e) {
      console.warn(`  Wochen-Ergebnisse ${espnSeason} fehlgeschlagen: ${e.message}`);
    }
  }
  if (fetched.length) writeHistory(fetched);
  if (matchups.length) matchupsLib.writeMatchups(matchups);

  console.log('');
  console.log(`Fertig: ${fetched.length} Saison(s) abgerufen, ${skipped.length} übersprungen${skipped.length ? ' (' + skipped.join(', ') + ')' : ''}.`);
}

main().catch(err => {
  console.error('Standings-Abruf fehlgeschlagen:', err.message);
  process.exit(1); // manuell ausgeloest, Fehler soll auffallen
});
