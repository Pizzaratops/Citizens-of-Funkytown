//  ESPN LIVE-SYNC (Roster-Refresh + gemeinsam genutzter CORS-Proxy)
// ============================================================
//  Stellt nur noch _fetchEspnViaProxy() bereit, das js/matchup-planner.js
//  fuer den Spielplan-Abruf nutzt (ESPN blockt direkte Browser-Anfragen
//  per CORS). Der fruehere "ESPN Sync"-Knopf im Header ist seit
//  2026-09-23 weg: die Kader kommen ausschliesslich aus dem
//  halbstuendlichen Server-Sync (scripts/sync-espn-rosters.js).
//
//  Hiess bis 2026-09-23 js/espn-trade-detect.js. Die Trade-Erkennung
//  (Trade History) wurde fuer diese Redraft-Liga komplett entfernt.

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
