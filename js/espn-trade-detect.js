//  ESPN LIVE-SYNC (Roster-Refresh + gemeinsam genutzter CORS-Proxy)
// ============================================================
//  Die automatische Trade-Erkennung lief hier frueher client-seitig
//  (siehe Git-Historie vor dem 05.08.2026), wurde aber entfernt:
//  sie funktionierte nur, wenn EIN UND DASSELBE Geraet einmal vor und
//  einmal nach einem Trade manuell synct hat (bei jedem ersten Sync
//  eines Geraets ueberhaupt wurde sie sogar bewusst uebersprungen,
//  um nicht jeden Spieler beim allerersten Laden als "Trade" zu
//  werten), und schrieb selbst dann nur in den localStorage dieses
//  einen Geraets -- fuer alle anderen Ligamitglieder unsichtbar bis
//  zum manuellen Export+Commit. In der Praxis hat sie deshalb nie
//  zuverlaessig einen echten Trade erfasst.
//
//  Trade-Erkennung laeuft seitdem ausschliesslich serverseitig in
//  scripts/detect-espn-trades.js, aufgerufen aus sync-espn-rosters.js
//  als Teil des taeglichen (jetzt halbstuendlichen 06-22 Uhr Berlin)
//  GitHub-Actions-Workflows -- vergleicht dort zuverlaessig den
//  letzten committeten Rosterstand mit dem frischen ESPN-Abruf und
//  schreibt Treffer direkt in data/trade-history.js, fuer alle sofort
//  sichtbar. Kein Geraet, kein manueller Schritt noetig.
//
//  Diese Datei bleibt bestehen fuer zwei weiterhin echte Aufgaben:
//   1) espnSync() aktualisiert ROSTERS im Browser sofort, ohne auf
//      den naechsten Server-Sync warten zu muessen (z.B. fuer Admins,
//      die eine gerade auf ESPN vorgenommene Aenderung direkt sehen
//      wollen). Rein kosmetisch/lokal fuer die laufende Sitzung --
//      persistiert nichts dauerhaft Geteiltes mehr.
//   2) _fetchEspnViaProxy() wird von js/matchup-planner.js fuer den
//      NBA-Spielplan-Abruf mitbenutzt (siehe dortiger Kommentar).

const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000;

// ── CORS-Proxy: ESPN API direkt blockt CORS, also über eigenen Cloudflare Worker
// Eigener Worker als primäre Quelle, öffentliche Proxies als Fallback.
const ESPN_WORKER_URL = 'https://pizzaratops.buniliga.workers.dev/';

async function _fetchEspnViaProxy(espnUrl) {
  const proxies = [
    { name: 'cf-worker',    build: u => `${ESPN_WORKER_URL}?url=${encodeURIComponent(u)}` },
    { name: 'codetabs',     build: u => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(u)}` },
    { name: 'corsproxy.io', build: u => `https://corsproxy.io/?${encodeURIComponent(u)}` },
    { name: 'allorigins',   build: u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}` },
  ];
  const errors = [];
  for (const { name, build } of proxies) {
    try {
      const proxyUrl = build(espnUrl);
      console.log('[ESPN Sync] Trying', name, '…');
      const res = await fetch(proxyUrl, { credentials: 'omit' });
      if (!res.ok) {
        errors.push(`${name}: HTTP ${res.status}`);
        continue;
      }
      const text = await res.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        errors.push(`${name}: nicht-JSON Antwort`);
        continue;
      }
      // allorigins wraps in {contents: "..."} when /get is used; unwrap if seen
      if (parsed && typeof parsed === 'object' && 'contents' in parsed && typeof parsed.contents === 'string') {
        parsed = JSON.parse(parsed.contents);
      }
      console.log('[ESPN Sync] Success via', name);
      return parsed;
    } catch (err) {
      errors.push(`${name}: ${err.message}`);
    }
  }
  throw new Error('Alle Proxies tot. Letzte Fehler: ' + errors.join(' | '));
}

async function espnSync(auto = false) {
  const btn = document.getElementById('espnSyncBtn');
  if (auto) {
    const last = parseInt(localStorage.getItem('espnLastSyncTs') || '0');
    if (Date.now() - last < SYNC_INTERVAL_MS) return;
  }
  if (btn) { btn.textContent = '⏳ Syncing…'; btn.disabled = true; }
  try {
    const espnUrl = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/${ESPN_SEASON}/segments/0/leagues/${ESPN_LEAGUE_ID}?view=mRoster&view=mTeam`;
    const data = await _fetchEspnViaProxy(espnUrl);
    // ESPN nutzt eigene Team-IDs (1-14, inkl. 2 Taxi Squads). Nur Teams behalten,
    // die im ESPN_TO_TT_TEAM-Mapping stehen, und auf interne TT-IDs umsetzen.
    const teams = (data.teams || []).filter(t => ESPN_TO_TT_TEAM[t.id] !== undefined);
    if (!teams.length) throw new Error('Keine Teams in ESPN-Antwort');

    const newRosters = {};
    teams.forEach(espnTeam => {
      const ttId    = ESPN_TO_TT_TEAM[espnTeam.id];  // ESPN-ID → TT-ID
      if (!ttId) return;
      const entries = espnTeam.roster?.entries || [];
      newRosters[ttId] = entries.map(entry => {
        const pi     = entry.playerPoolEntry || {};
        const p      = pi.player || {};
        const name   = p.fullName || null;
        const posId  = (p.eligibleSlots || [])[0] ?? 0;
        const pos    = ESPN_POS_MAP[posId] || 'SF';
        const nbaTeam = ESPN_NBA_MAP[p.proTeamId] || 'FA';
        return name ? { name, pos, team: nbaTeam } : null;
      }).filter(Boolean);
    });

    Object.keys(newRosters).forEach(tid => {
      const t = parseInt(tid);
      ROSTERS[t] = newRosters[tid];
      _ORIGINAL_ROSTERS[t] = newRosters[tid].map(p => ({...p}));
    });

    // Trade-Erkennung laeuft seit 05.08.2026 nur noch serverseitig
    // (siehe Dateikopf) -- hier bewusst kein Aufruf mehr.

    // Persist the synced rosters so they survive page reloads.
    // Without this, every reload reverts to the hardcoded teams-rosters.js data.
    if (typeof saveEspnRosterSnapshot === 'function') {
      saveEspnRosterSnapshot(newRosters);
    }
    // NOTE: We deliberately do NOT call saveRosterOverrides({}) here.
    // Doing so would wipe out manual admin roster edits on every sync.
    // Manual overrides are layered on top of the ESPN snapshot by
    // _applyRosterOverrides().

    const total = Object.values(newRosters).reduce((s,r) => s + r.length, 0);
    const now   = new Date().toLocaleString('de-DE', {dateStyle:'short', timeStyle:'short'});

    _applyRosterOverrides();
    if (typeof renderHome === 'function') renderHome();
    if (typeof renderTab  === 'function') renderTab();

    localStorage.setItem('espnLastSync', now);
    localStorage.setItem('espnLastSyncTs', String(Date.now()));

    if (btn) { btn.textContent = '✅ ' + now; btn.disabled = false; }
    if (!auto && typeof toast === 'function') toast('✅ Sync: ' + total + ' Spieler (' + now + ')');
    fetchNbaTrades().catch(e => console.warn('NBA trades:', e));
  } catch(err) {
    console.error('ESPN Sync:', err);
    if (btn) { btn.textContent = '🔄 ESPN Sync'; btn.disabled = false; }
    if (!auto && typeof toast === 'function') toast('❌ Sync: ' + err.message);
  }
}

async function fetchNbaTrades() {
  // Der /trades-Endpoint existiert in der balldontlie v1-API nicht mehr
  // (neue URL-Struktur: /nba/v1/... — aber kein Trades-Endpoint verfügbar).
  // Funktion deaktiviert bis ein Ersatz gefunden wird.
  return;
}

function initEspnSyncBtn() {
  const last = localStorage.getItem('espnLastSync');
  const btn  = document.getElementById('espnSyncBtn');
  if (btn && last) btn.textContent = '🔄 ESPN (' + last + ')';
}

// Apply on page load so home screen team strength badges are correct
_applyRosterOverrides();
