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
//  OUTPUT
//  Pro Saison eine Datei data/season-<start>-<endkurz>.js im selben
//  Format, das js/navigation.js (_getSeasonData, SEASON_REGISTRY)
//  bereits erwartet -- rosters bleibt hier bewusst leer ({}), dieses
//  Script holt nur die Abschlusstabelle, keine Kader. Nach dem Lauf
//  muss jede neue Saison noch von Hand in SEASON_REGISTRY
//  (js/navigation.js) eingetragen werden, damit sie im Dropdown
//  auf der Home-Seite auftaucht -- bewusst kein Auto-Edit von
//  navigation.js, damit die Registry-Reihenfolge/Labels von Hand
//  kontrolliert bleiben.
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

function seasonVarSuffix(espnSeason) {
  // 2022 -> "2021_22"
  const start = espnSeason - 1;
  const endShort = String(espnSeason).slice(-2);
  return `${start}_${endShort}`;
}

// Holt die Abschlusstabelle für EINE ESPN-Saison. Gibt null zurück
// (statt zu werfen), wenn die Liga für diese Saison offensichtlich
// nicht existiert -- damit ein --from/--to-Lauf über Jahre ohne Liga
// einfach weiterlaufen kann.
async function fetchSeasonStandings(cfg, espnSeason) {
  const url = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/${espnSeason}/segments/0/leagues/${cfg.ESPN_LEAGUE_ID}?view=mTeam`;
  let data;
  try {
    data = await httpsGetJson(url);
  } catch (e) {
    console.warn(`  Saison ${espnSeason}: Abruf fehlgeschlagen (${e.message}) -- übersprungen.`);
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

function writeSeasonFile(season) {
  const varName = `SEASON_${seasonVarSuffix(season.espnSeason)}`;
  const out = `// ============================================================
//  SAISON-ARCHIV ${season.label} — Abschlusstabelle
// ============================================================
//  AUTO-GENERIERT von scripts/fetch-espn-standings.js gegen die ESPN
//  API (view=mTeam, rankCalculatedFinal). "estimated:true" bei einem
//  Team bedeutet: ESPN hat für diese Saison keine offizielle
//  Endplatzierung berechnet, die Reihenfolge wurde ersatzweise aus
//  dem Sieg-Prozentsatz abgeleitet -- keine offizielle ESPN-Angabe.
//  rosters bleibt hier leer -- dieses Script holt nur die Tabelle,
//  keine Kader. Neue Saison muss zusätzlich von Hand in
//  SEASON_REGISTRY (js/navigation.js) eingetragen werden, damit sie
//  im Saison-Dropdown auf der Home-Seite erscheint.
//  Zuletzt abgerufen: ${new Date().toISOString()}
// ============================================================

const ${varName} = ${JSON.stringify({ label: season.label, standings: season.standings, rosters: {} }, null, 1)};
`;
  const outPath = path.join(ROOT, 'data', `season-${seasonVarSuffix(season.espnSeason).replace('_', '-')}.js`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, out, 'utf8');
  console.log(`  ${path.relative(ROOT, outPath)} geschrieben (${season.standings.length} Teams).`);
  return outPath;
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
    // Standard: alle abgeschlossenen Saisons ab 2019 (frühestes Jahr,
    // für das ESPNs Fantasy-Basketball-API überhaupt zuverlässig
    // Daten liefert) bis zur laufenden Saison minus eins.
    seasons = [];
    for (let s = 2019; s < cfg.ESPN_SEASON; s++) seasons.push(s);
  }

  console.log(`Standings-Abruf für ESPN-Liga ${cfg.ESPN_LEAGUE_ID}, Saisons: ${seasons.join(', ')}`);

  const written = [];
  const skipped = [];
  for (const espnSeason of seasons) {
    console.log(`Saison ${espnSeason} (${seasonLabel(espnSeason)})...`);
    const season = await fetchSeasonStandings(cfg, espnSeason);
    if (!season) { skipped.push(espnSeason); continue; }
    written.push(writeSeasonFile(season));
  }

  console.log('');
  console.log(`Fertig: ${written.length} Saison-Datei(en) geschrieben, ${skipped.length} übersprungen${skipped.length ? ' (' + skipped.join(', ') + ')' : ''}.`);
  if (written.length) {
    console.log('Nächster Schritt: die neuen Saisons von Hand in SEASON_REGISTRY (js/navigation.js) eintragen, damit sie im Dropdown erscheinen.');
  }
}

main().catch(err => {
  console.error('Standings-Abruf fehlgeschlagen:', err.message);
  process.exit(1); // manuell ausgeloest, Fehler soll auffallen
});
