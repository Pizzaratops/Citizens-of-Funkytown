#!/usr/bin/env node
// ============================================================
//  ESPN ROSTER SYNC (automatisiert)
// ============================================================
//  Node-Äquivalent von espnSync() in js/espn-trade-detect.js.
//  Im Browser muss der ESPN-Call über einen CORS-Proxy laufen, weil
//  ESPN keine Browser-Cross-Origin-Requests erlaubt. In Node/GitHub
//  Actions gibt es kein CORS — hier wird direkt gegen den ESPN-
//  "reads"-Endpoint gefetcht, kein Proxy nötig.
//
//  Liest Konfiguration (ESPN_LEAGUE_ID, ESPN_SEASON, Team-/Positions-
//  Mappings) direkt aus js/espn-sync.js, damit es keine zweite Quelle
//  der Wahrheit gibt, die aus dem Ruder laufen kann.
//
//  Output: data/rosters-live.js — ROSTERS_LIVE, wird von js/admin.js
//  beim Seitenstart als Basis geladen (vor manuellen localStorage-
//  Overrides, siehe _hydrateRostersFromLiveFile()).
//
//  Usage:
//    node scripts/sync-espn-rosters.js
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const https = require('https');
const { detectAndSaveTrades } = require('./detect-espn-trades');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'rosters-live.js');

function loadOldRosters() {
  // Stand VOR dem heutigen Sync -- Vergleichsbasis fuer die Trade-
  // Erkennung. Existiert die Datei noch nicht (allererster Lauf),
  // wird ein leeres Objekt zurueckgegeben; dann werden folgerichtig
  // keine "Trades" erkannt (kein alter Zustand zum Vergleichen).
  if (!fs.existsSync(OUT)) return {};
  const code = fs.readFileSync(OUT, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${code}\nthis.__OLD__ = ROSTERS_LIVE;`, sandbox);
  return sandbox.__OLD__ || {};
}

function loadConfig() {
  const code = fs.readFileSync(path.join(ROOT, 'js', 'espn-sync.js'), 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(
    `${code}\nthis.__CFG__ = { ESPN_LEAGUE_ID, ESPN_SEASON, ESPN_POS_MAP, ESPN_NBA_MAP, ESPN_TO_TT_TEAM };`,
    sandbox
  );
  return sandbox.__CFG__;
}

function httpsGetJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'taco-tuesday-hq-bot',
        'Accept': 'application/json',
      },
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGetJson(res.headers.location).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} für ${url}`));
      }
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Keine gültige JSON-Antwort von ESPN: ' + e.message)); }
      });
    }).on('error', reject);
  });
}

async function main() {
  const cfg = loadConfig();
  const oldRosters = loadOldRosters(); // MUSS vor dem Schreiben weiter unten passieren
  const espnUrl = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/${cfg.ESPN_SEASON}/segments/0/leagues/${cfg.ESPN_LEAGUE_ID}?view=mRoster&view=mTeam`;

  const data = await httpsGetJson(espnUrl);
  const teams = (data.teams || []).filter(t => cfg.ESPN_TO_TT_TEAM[t.id] !== undefined);
  if (!teams.length) throw new Error('Keine Teams in ESPN-Antwort — Liga-ID/Saison prüfen.');

  const rosters = {};
  const records = {};
  teams.forEach(espnTeam => {
    const ttId = cfg.ESPN_TO_TT_TEAM[espnTeam.id];
    if (!ttId) return;
    const entries = espnTeam.roster?.entries || [];
    rosters[ttId] = entries.map(entry => {
      const pi = entry.playerPoolEntry || {};
      const p = pi.player || {};
      const name = p.fullName || null;
      const posId = (p.eligibleSlots || [])[0] ?? 0;
      const pos = cfg.ESPN_POS_MAP[posId] || 'SF';
      const nbaTeam = cfg.ESPN_NBA_MAP[p.proTeamId] || 'FA';
      if (!name) return null;
      const player = { name, pos, team: nbaTeam };
      // Verletzungsstatus aus demselben Payload. Nur abweichende Status
      // werden geschrieben (ACTIVE = kein Feld), damit die Datei klein
      // bleibt. ESPN liefert u.a. OUT, DAY_TO_DAY, SUSPENSION.
      const inj = p.injuryStatus;
      if (inj && inj !== 'ACTIVE') {
        player.inj = inj === 'DAY_TO_DAY' ? 'DTD'
                   : inj === 'SUSPENSION' ? 'SUSP'
                   : inj; // OUT und alles Unbekannte unveraendert
      }
      return player;
    }).filter(Boolean);

    // W-L-T Bilanz aus mTeam. Fehlt der Block (z.B. vor dem ersten
    // Spieltag), wird 0-0-0 geschrieben.
    const ov = espnTeam.record?.overall || {};
    records[ttId] = `${ov.wins || 0}-${ov.losses || 0}-${ov.ties || 0}`;
  });

  const totalPlayers = Object.values(rosters).reduce((s, r) => s + r.length, 0);
  if (totalPlayers < 100) {
    // Sanity check — a 12-team league should have well over 100 rostered
    // players. If ESPN returned something malformed/partial, don't overwrite
    // the last good snapshot with garbage.
    throw new Error(`Nur ${totalPlayers} Spieler in ESPN-Antwort gefunden — sieht nach Teil-/Fehlantwort aus, breche ab ohne zu schreiben.`);
  }

  const now = new Date().toISOString();
  const rosterLines = Object.keys(rosters).sort((a, b) => a - b).map(tid => {
    const players = rosters[tid].map(p => JSON.stringify(p)).join(', ');
    return `  ${tid}: [${players}]`;
  });

  const out = `// ============================================================
//  ROSTERS_LIVE — automatisch von ESPN synchronisiert
// ============================================================
//  AUTO-GENERIERT von scripts/sync-espn-rosters.js über die
//  "Daily 9cat Live Scores" GitHub Action. Nicht von Hand editieren.
//  Zuletzt synchronisiert: ${now}
//
//  Wird von js/admin.js beim Seitenstart als Basis für ROSTERS geladen
//  (ersetzt die statischen Rosters aus data/teams-rosters.js), bevor
//  manuelle Overrides (localStorage bzw. der "ESPN Sync jetzt"-Knopf
//  für einen sofortigen Zwischenstand) angewendet werden.
// ============================================================

const ROSTERS_LIVE = {
${rosterLines.join(',\n')}
};

// W-L-T Bilanzen je Team aus derselben ESPN-Antwort (mTeam).
// "season" ist die ESPN-Saisonkennung (2027 = Saison 2026/27). Das UI
// (js/navigation.js, _displayRecord) zeigt diese Bilanzen nur, wenn
// season >= 2027 -- ESPN_SEASON in js/espn-sync.js steht seit 05.08.2026
// auf 2027, die Bilanzen laufen also bereits live durch diesen Pfad
// (anfangs plausibel 0-0-0, bis der Spielbetrieb im Oktober beginnt).
const TEAM_RECORDS_LIVE = {
  season: ${cfg.ESPN_SEASON},
  records: ${JSON.stringify(records)}
};
`;

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, out, 'utf8');
  console.log(`${OUT} aktualisiert: ${totalPlayers} Spieler über ${Object.keys(rosters).length} Teams.`);

  // Trade-Erkennung: alter Stand (vor dieser Zeile ueberschrieben) vs.
  // der gerade geschriebene neue Stand. Bewusst NICHT fatal -- ein
  // Fehler hier darf den Roster-Sync selbst nicht ungueltig machen,
  // der manuelle "Fuer Repo exportieren"-Button bleibt als Fallback.
  try {
    detectAndSaveTrades(oldRosters, rosters, { root: ROOT });
  } catch (err) {
    console.error('[Trade Detection] Fehlgeschlagen (Roster-Sync bleibt gueltig):', err.message);
  }
}

main().catch(err => {
  console.error('ESPN Roster Sync fehlgeschlagen:', err.message);
  // Non-fatal: exit 0 so the rest of the daily workflow still runs even
  // if ESPN is temporarily unreachable. The last good rosters-live.js
  // snapshot simply stays in place.
  process.exit(0);
});
