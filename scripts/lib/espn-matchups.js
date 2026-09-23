// ============================================================
//  ESPN WOCHEN-MATCHUPS (Grundlage fuer die Rolling Rankings)
// ============================================================
//  Holt fuer EINE ESPN-Saison alle bereits entschiedenen Matchups
//  (view=mMatchupScore + mTeam + mSettings) und fuehrt sie in
//  data/season-matchups.js (SEASON_MATCHUPS) zusammen. Genutzt von:
//   - scripts/sync-espn-matchups.js      (taeglich, laufende Saison)
//   - scripts/fetch-espn-standings.js    (manuell, alle Vorjahre)
//
//  Je Team und Woche wird das Kategorie-Ergebnis gespeichert
//  (w/l/t = gewonnene/verlorene/unentschiedene Kategorien) plus das
//  Matchup-Ergebnis (res = "W" | "L" | "T"). Die Seite kann damit
//  beide Tabellenarten rechnen: nach Kategorien (ESPN "H2H Each
//  Category") und nach Matchups (ESPN "H2H Most Categories").
//  Welche die Liga tatsaechlich nutzt, steht in scoringType.
//
//  Nur entschiedene Matchups (winner != UNDECIDED), die laufende Woche
//  kommt erst rein, wenn ESPN sie abgeschlossen hat. Playoff-Wochen
//  werden mit playoff:true markiert, die Seite blendet sie aus.
//
//  Teams: Schluessel ist die ESPN-Team-ID (ueber die Jahre stabil).
//  teamId = heutige Funkytown-ID aus ESPN_TO_TT_TEAM (js/espn-sync.js)
//  oder null, wenn es das Team heute nicht mehr gibt.
// ============================================================

const fs = require('fs');
const path = require('path');
const https = require('https');
const vm = require('vm');

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'data', 'season-matchups.js');
const BASE = 'https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba';

function loadConfig() {
  const code = fs.readFileSync(path.join(ROOT, 'js', 'espn-sync.js'), 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${code}\nthis.__CFG__ = { ESPN_LEAGUE_ID, ESPN_SEASON, ESPN_TO_TT_TEAM };`, sandbox);
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

function seasonLabel(espnSeason) {
  return `${espnSeason - 1}/${String(espnSeason).slice(-2)}`;
}

// Versucht erst den normalen Saison-Endpoint, dann leagueHistory
// (aeltere Jahre). Gibt null zurueck, wenn beides nichts liefert.
async function fetchLeague(cfg, espnSeason, views) {
  const v = views.map(x => `view=${x}`).join('&');
  const urls = [
    `${BASE}/seasons/${espnSeason}/segments/0/leagues/${cfg.ESPN_LEAGUE_ID}?${v}`,
    `${BASE}/leagueHistory/${cfg.ESPN_LEAGUE_ID}?seasonId=${espnSeason}&${v}`,
  ];
  for (const url of urls) {
    try {
      const res = await httpsGetJson(url);
      const obj = Array.isArray(res) ? res[0] : res;
      if (obj && Array.isArray(obj.schedule)) return obj;
    } catch (e) {
      console.warn(`  Matchups ${espnSeason}: Abruf fehlgeschlagen (${e.message}).`);
    }
  }
  return null;
}

function _side(entry) {
  const cs = (entry && entry.cumulativeScore) || {};
  return { espnId: entry.teamId, w: cs.wins || 0, l: cs.losses || 0, t: cs.ties || 0 };
}

async function fetchSeasonMatchups(cfg, espnSeason) {
  const data = await fetchLeague(cfg, espnSeason, ['mMatchupScore', 'mTeam', 'mSettings']);
  if (!data) return null;

  const isCurrent = espnSeason === cfg.ESPN_SEASON;
  const teams = {};
  (data.teams || []).forEach(t => {
    const name = t.name || `${t.location || ''} ${t.nickname || ''}`.trim() || `Team ${t.id}`;
    teams[t.id] = {
      name,
      // Heutige IDs nur fuer die laufende Saison sicher; fuer Vorjahre
      // gilt dieselbe Zuordnung, solange ESPN die Team-ID beibehalten
      // hat (bei Liga 15679 der Fall). Fehlt die ID heute: null.
      teamId: cfg.ESPN_TO_TT_TEAM[t.id] ?? null,
    };
  });

  const weeks = {};
  (data.schedule || []).forEach(m => {
    if (!m || !m.home || !m.away) return;               // Bye-Woche
    if (!m.winner || m.winner === 'UNDECIDED') return;  // noch nicht entschieden
    const period = m.matchupPeriodId;
    const playoff = !!(m.playoffTierType && m.playoffTierType !== 'NONE');
    const h = _side(m.home), a = _side(m.away);
    const resH = m.winner === 'HOME' ? 'W' : m.winner === 'AWAY' ? 'L' : 'T';
    const resA = resH === 'W' ? 'L' : resH === 'L' ? 'W' : 'T';
    const list = weeks[period] = weeks[period] || [];
    list.push({ team: h.espnId, opp: a.espnId, w: h.w, l: h.l, t: h.t, res: resH, playoff });
    list.push({ team: a.espnId, opp: h.espnId, w: a.w, l: a.l, t: a.t, res: resA, playoff });
  });

  const settings = data.settings || {};
  return {
    espnSeason,
    label: seasonLabel(espnSeason),
    current: isCurrent,
    scoringType: (settings.scoringSettings && settings.scoringSettings.scoringType) || null,
    regularSeasonWeeks: (settings.scheduleSettings && settings.scheduleSettings.matchupPeriodCount) || null,
    teams,
    weeks,
  };
}

function loadExisting() {
  if (!fs.existsSync(OUT)) return [];
  try {
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(OUT, 'utf8') + '\nthis.__M__ = SEASON_MATCHUPS;', sandbox);
    return Array.isArray(sandbox.__M__) ? sandbox.__M__ : [];
  } catch (e) {
    console.warn('Bestehende data/season-matchups.js nicht lesbar, wird neu aufgebaut:', e.message);
    return [];
  }
}

// Fuehrt neue Saisons mit dem bestehenden Stand zusammen. Eine Saison
// OHNE entschiedene Wochen ersetzt keinen bereits vorhandenen Stand
// (schuetzt davor, dass ein halber ESPN-Ausfall Daten loescht).
function writeMatchups(seasons) {
  const byYear = new Map(loadExisting().map(s => [s.espnSeason, s]));
  seasons.forEach(s => {
    const hasWeeks = Object.keys(s.weeks).length > 0;
    if (!hasWeeks && byYear.has(s.espnSeason)) return;
    byYear.set(s.espnSeason, s);
  });
  const list = [...byYear.values()].sort((a, b) => b.espnSeason - a.espnSeason);
  const out = `// ============================================================
//  SEASON_MATCHUPS — Wochen-Ergebnisse je Saison (Rolling Rankings)
// ============================================================
//  AUTO-GENERIERT von scripts/lib/espn-matchups.js (taeglich ueber
//  scripts/sync-espn-matchups.js, Vorjahre ueber "Saison-Standings
//  abrufen"). Nicht von Hand editieren.
//  weeks[woche] = [{ team, opp, w, l, t, res, playoff }] mit
//  team/opp = ESPN-Team-ID, w/l/t = Kategorien, res = Matchup W/L/T.
//  Zuletzt aktualisiert: ${new Date().toISOString()}
// ============================================================

const SEASON_MATCHUPS = ${JSON.stringify(list)};
`;
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, out, 'utf8');
  console.log(`${path.relative(ROOT, OUT)} geschrieben (${list.length} Saison(s)).`);
}

module.exports = { loadConfig, fetchSeasonMatchups, writeMatchups, seasonLabel };
