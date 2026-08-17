// ============================================================
//  LIVE PROJECTIONS — UI
// ============================================================
//  Zeigt data/live-projections.js (Blend aus Preseason-Baseline +
//  echten Saison-Stats) als sortierbare/durchsuchbare Tabelle — gleiche
//  Spalten wie die Original-Projections-Page (MIN, PTS, REB, AST, STL,
//  BLK, 3PM, FGM-FGA, FG%, FTM-FTA, FT%, TOV, Z, Z-Floor, Z-Depth,
//  ADP-Val), Default-Sortierung nach Z, plus Barttorvik-Style
//  Min/Max-Filter pro Statistik. Ersetzt ab Saisonstart den aktuellen
//  Iframe unter "Player" → "Projections" (siehe README, "Season-Start-
//  Plan: Projections-Flow"). Bis dahin nur intern zum Testen erreichbar.
// ============================================================

// Spalten in Anzeige-Reihenfolge. combo:true = zeigt "Made-Attempts" aus
// zwei Feldern (z.B. FGM/FGA) in einer Spalte, mit separatem %-Feld daneben.
const LP_STAT_COLS = [
  { key: 'min',    label: 'MIN',  dec: 1 },
  { key: 'pts',    label: 'PTS',  dec: 1 },
  { key: 'reb',    label: 'REB',  dec: 1 },
  { key: 'ast',    label: 'AST',  dec: 1 },
  { key: 'stl',    label: 'STL',  dec: 1 },
  { key: 'blk',    label: 'BLK',  dec: 1 },
  { key: 'tpm',    label: '3PM',  dec: 1 },
  { key: 'fgma',   label: 'FGM-FGA', combo: ['fgm', 'fga'] },
  { key: 'fgPct',  label: 'FG%',  dec: 1, pct: true },
  { key: 'ftma',   label: 'FTM-FTA', combo: ['ftm', 'fta'] },
  { key: 'ftPct',  label: 'FT%',  dec: 1, pct: true },
  { key: 'tov',    label: 'TOV',  dec: 1, invert: true },
  { key: 'z',      label: 'Z',    dec: 2, signed: true },
  { key: 'zFloor', label: 'Z-Floor', dec: 2, signed: true },
  { key: 'zDepth', label: 'Z-Depth', dec: 2, signed: true },
  { key: 'adpVal', label: 'ADP-Val', dec: 0, signed: true },
];

// Welche Spalten im Filter-Panel als Min/Max-Range auftauchen (Barttorvik-Style)
const LP_FILTER_KEYS = ['min', 'pts', 'reb', 'ast', 'stl', 'blk', 'tpm', 'fgPct', 'ftPct', 'tov', 'z'];

let lpSortKey = 'z';
let lpSortAsc = false;
let lpFiltered = [];
let lpAllData = [];
let lpFilterRanges = {}; // { key: { min: number|null, max: number|null } }
let lpBounds = {}; // { key: { min, max } } — echte Wertebereiche im Pool, fuer Filter-Placeholder
let lpFilterPanelOpen = false;

function _lpData() {
  if (typeof LIVE_PROJECTIONS === 'undefined') return [];
  const dynastyByName = new Map((typeof DYNASTY_PLAYERS !== 'undefined' ? DYNASTY_PLAYERS : []).map(p => [p[1], p]));
  return Object.entries(LIVE_PROJECTIONS).map(([name, s]) => {
    const dp = dynastyByName.get(name);
    return { name, team: dp ? dp[2] : '', pos: dp ? dp[3] : '', ...s };
  });
}

function _lpComputeBounds() {
  lpBounds = {};
  LP_FILTER_KEYS.forEach(key => {
    const values = lpAllData.map(p => p[key]).filter(v => typeof v === 'number' && !isNaN(v));
    lpBounds[key] = values.length ? { min: Math.min(...values), max: Math.max(...values) } : { min: 0, max: 0 };
  });
}

function showLiveProjections() {
  navigate('liveProjectionsPage');
  lpAllData = _lpData();
  _lpComputeBounds();
  _lpBuildFilterPanel();
  _lpBuildHeader();
  filterLiveProjections();
}

function filterLiveProjections() {
  const q = (document.getElementById('lpSearch')?.value || '').toLowerCase().trim();
  let rows = q
    ? lpAllData.filter(p => p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q) || p.pos.toLowerCase().includes(q))
    : [...lpAllData];

  Object.entries(lpFilterRanges).forEach(([key, range]) => {
    if (range.min !== null && range.min !== undefined && range.min !== '') rows = rows.filter(p => (p[key] ?? 0) >= parseFloat(range.min));
    if (range.max !== null && range.max !== undefined && range.max !== '') rows = rows.filter(p => (p[key] ?? 0) <= parseFloat(range.max));
  });

  lpFiltered = rows;
  _lpSort();
  _lpRender();

  const meta = document.getElementById('lpMeta');
  if (meta) {
    const withGames = lpFiltered.filter(p => p.gamesPlayed > 0).length;
    const activeFilters = Object.values(lpFilterRanges).filter(r => (r.min !== null && r.min !== '') || (r.max !== null && r.max !== '')).length;
    meta.textContent = `${lpFiltered.length} von ${lpAllData.length} Spielern` +
      (activeFilters ? ` · ${activeFilters} Filter aktiv` : '') +
      ` · ${withGames} mit echten Spielen in dieser Saison bisher`;
  }
}

function sortLiveProjections(key) {
  if (lpSortKey === key) lpSortAsc = !lpSortAsc;
  else { lpSortKey = key; lpSortAsc = (key === 'name' || key === 'team' || key === 'pos'); }
  _lpSort();
  _lpRender();
  _lpBuildHeader();
}

function _lpSort() {
  const key = lpSortKey, asc = lpSortAsc;
  lpFiltered.sort((a, b) => {
    if (key === 'name' || key === 'team' || key === 'pos') {
      const c = String(a[key]).localeCompare(String(b[key]));
      return asc ? c : -c;
    }
    const c = (a[key] || 0) - (b[key] || 0);
    return asc ? c : -c;
  });
}

// ── Filter-Panel (Barttorvik-Style Min/Max pro Stat) ────────────────────
function _lpBuildFilterPanel() {
  const host = document.getElementById('lpFilterFields');
  if (!host) return;
  host.innerHTML = LP_FILTER_KEYS.map(key => {
    const col = LP_STAT_COLS.find(c => c.key === key) || { label: key.toUpperCase() };
    const b = lpBounds[key] || { min: 0, max: 0 };
    return `<div style="display:flex;flex-direction:column;gap:3px;">
      <label style="font-size:10px;font-weight:800;color:var(--muted);text-transform:uppercase;">${col.label}</label>
      <div style="display:flex;gap:4px;align-items:center;">
        <input type="number" step="any" placeholder="${_lpFmtBound(b.min, col)}" id="lpFilter_${key}_min"
          oninput="setLiveProjectionsFilter('${key}','min',this.value)"
          style="width:56px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:11px;padding:4px 6px;border-radius:6px;outline:none;">
        <span style="color:var(--muted);font-size:10px;">–</span>
        <input type="number" step="any" placeholder="${_lpFmtBound(b.max, col)}" id="lpFilter_${key}_max"
          oninput="setLiveProjectionsFilter('${key}','max',this.value)"
          style="width:56px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:11px;padding:4px 6px;border-radius:6px;outline:none;">
      </div>
    </div>`;
  }).join('');
}
function _lpFmtBound(v, col) {
  if (v === undefined) return '';
  return col.dec ? v.toFixed(col.dec) : Math.round(v).toString();
}

function setLiveProjectionsFilter(key, bound, value) {
  if (!lpFilterRanges[key]) lpFilterRanges[key] = { min: null, max: null };
  lpFilterRanges[key][bound] = value === '' ? null : value;
  filterLiveProjections();
}

function toggleLiveProjectionsFilterPanel() {
  lpFilterPanelOpen = !lpFilterPanelOpen;
  const panel = document.getElementById('lpFilterPanel');
  const btn = document.getElementById('lpFilterToggleBtn');
  if (panel) panel.style.display = lpFilterPanelOpen ? 'flex' : 'none';
  if (btn) btn.textContent = lpFilterPanelOpen ? '▲ Filter' : '▼ Filter';
}

function resetLiveProjectionsFilters() {
  lpFilterRanges = {};
  LP_FILTER_KEYS.forEach(key => {
    const minInp = document.getElementById(`lpFilter_${key}_min`);
    const maxInp = document.getElementById(`lpFilter_${key}_max`);
    if (minInp) minInp.value = '';
    if (maxInp) maxInp.value = '';
  });
  const search = document.getElementById('lpSearch');
  if (search) search.value = '';
  filterLiveProjections();
}

// ── Header (dynamisch, damit Sortier-Pfeile aktualisiert werden) ───────
function _lpBuildHeader() {
  const row = document.getElementById('lpHeaderRow');
  if (!row) return;
  const arrow = key => lpSortKey !== key ? '' : (lpSortAsc ? ' ↑' : ' ↓');
  const cls = key => 'r-sorted-check' + (lpSortKey === key ? ' r-sorted' : '');
  let html = `<th>#</th>`;
  html += `<th class="${cls('name')}" onclick="sortLiveProjections('name')" style="text-align:left;">Name${arrow('name')}</th>`;
  html += `<th class="${cls('team')}" onclick="sortLiveProjections('team')">Team${arrow('team')}</th>`;
  html += `<th class="${cls('pos')}" onclick="sortLiveProjections('pos')">Pos${arrow('pos')}</th>`;
  LP_STAT_COLS.forEach(col => {
    if (col.combo) { html += `<th style="text-align:center;">${col.label}</th>`; return; }
    html += `<th class="${cls(col.key)}" onclick="sortLiveProjections('${col.key}')">${col.label}${arrow(col.key)}</th>`;
  });
  html += `<th>Status</th>`;
  row.innerHTML = html;
}

// ── Heatmap-Farbe: Position im Pool-Wertebereich (min..max), invertiert
//    fuer TOV (niedriger = besser). Gruen-Gelb-Rot-Gradient wie im Rest
//    der Seite (Z-Score-Badges etc.).
function _lpHeatColor(value, key, invert) {
  const b = lpBounds[key] || (LP_FILTER_KEYS.includes(key) ? lpBounds[key] : null);
  let min, max;
  if (b) { min = b.min; max = b.max; }
  else {
    const values = lpAllData.map(p => p[key]).filter(v => typeof v === 'number');
    min = values.length ? Math.min(...values) : 0;
    max = values.length ? Math.max(...values) : 0;
  }
  if (max === min) return 'transparent';
  let t = (value - min) / (max - min); // 0..1
  if (invert) t = 1 - t;
  // grün (gut) -> transparent (mitte) -> rot (schlecht)
  if (t > 0.5) {
    const a = (t - 0.5) * 2 * 0.28;
    return `rgba(76,175,129,${a.toFixed(2)})`;
  }
  const a = (0.5 - t) * 2 * 0.28;
  return `rgba(255,101,132,${a.toFixed(2)})`;
}

function _lpFmt(v, col) {
  if (v === undefined || v === null) return '–';
  const n = col.dec !== undefined ? v.toFixed(col.dec) : v;
  const withSign = col.signed && v > 0 ? `+${n}` : n;
  return col.pct ? `${withSign}%` : withSign;
}

function _lpRender() {
  const tbody = document.getElementById('lpBody');
  const noR = document.getElementById('lpNoResults');
  if (!tbody) return;
  if (!lpFiltered.length) { tbody.innerHTML = ''; if (noR) noR.style.display = 'block'; return; }
  if (noR) noR.style.display = 'none';

  tbody.innerHTML = lpFiltered.map((p, i) => {
    const statCells = LP_STAT_COLS.map(col => {
      if (col.combo) {
        const [mKey, aKey] = col.combo;
        return `<td style="text-align:center;color:var(--muted);font-size:11px;">${(p[mKey] || 0).toFixed(1)}-${(p[aKey] || 0).toFixed(1)}</td>`;
      }
      const bg = LP_FILTER_KEYS.includes(col.key) || col.key === 'tov'
        ? _lpHeatColor(p[col.key] || 0, col.key, !!col.invert)
        : 'transparent';
      return `<td style="text-align:center;background:${bg};">${_lpFmt(p[col.key], col)}</td>`;
    }).join('');
    const badge = p.gamesPlayed > 0
      ? `<span style="font-size:9px;font-weight:800;padding:1px 6px;border-radius:5px;background:rgba(76,175,129,0.15);color:#6dddaa;" title="${p.gamesPlayed} echte Spiele eingerechnet">LIVE · ${p.gamesPlayed} GP</span>`
      : `<span style="font-size:9px;font-weight:800;padding:1px 6px;border-radius:5px;background:var(--surface2);color:var(--muted);" title="Noch keine echten Spiele, reine Preseason-Baseline">BASELINE</span>`;
    return `<tr>
      <td style="text-align:center;color:var(--muted);">${i + 1}</td>
      <td><span class="r-name">${p.name}</span></td>
      <td><span class="r-team">${p.team}</span></td>
      <td><span class="r-pos">${p.pos}</span></td>
      ${statCells}
      <td>${badge}</td>
    </tr>`;
  }).join('');
}
