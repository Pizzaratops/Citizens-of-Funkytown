// ============================================================
//  ROLLING RANKINGS — Saison-Toggle 2025/26 ↔ 2026/27
//  Features:
//    - Season-Toggle (2025/26 handkuratiert / 2026/27 live aus Livescores)
//    - Monthly und Weekly Toggle
//    - Vergleichsmodus für bis zu 3 Spieler
//    - Instagram-Screenshot (4:5) in 2 Styles (warm / dark)
//
//  Saison 2025/26: ROLLING_RANKINGS (data/rolling-rankings.js) — handkuratiert
//  aus BBM-Exports. RR_MONTHS/RR_WEEKS sind deren feste Spaltenköpfe.
//
//  Saison 2026/27: kommt aus dem PERMANENTEN Archiv data/rolling-rankings-
//  2026-27.js (ROLLING_RANKINGS_2026 / RR2026_MONTHS / RR2026_WEEKS),
//  täglich gebaut von scripts/build-rolling-archive.js aus LIVESCORES_
//  AGGREGATE (Liga "nba", reguläre Saison — NICHT "nba-summer-*"/
//  "nba-preseason"), inkl. fester Kategorie-Gewichtung. Anders als früher
//  wird hier NICHTS mehr live im Browser neu berechnet — das Archiv wird
//  nie gekürzt, exakt gleiches Format wie ROLLING_RANKINGS (2025/26), damit
//  Sortierung, Vergleichsmodus und Instagram-Export unverändert weiterlaufen.
// ============================================================

const RR_MONTHS  = ['Oct','Nov','Dez','Jan','Feb','März'];
// RR_WEEKS und ROLLING_RANKINGS werden in data/rolling-rankings.js gesetzt (lädt davor).

const RR_SEASONS = [
  { key: 'season2025', label: '2025/26', short: '25/26' },
  { key: 'season2026', label: '2026/27', short: '26/27' },
];
let rrSeason = 'season2025';       // 'season2025' | 'season2026'

let rrView          = 'monthly';   // 'monthly' | 'weekly'
let rrCompareMode   = false;
let rrSelected      = [];          // Array von origIdx (max 3 wenn compare, sonst max 1)
let rrFiltered      = [];
let rrChart         = null;
let rrSortBy        = 'eos';       // 'eos' | 'name' | period-key (e.g. 'Oct', 'März', '1', '22')
let rrSortDir       = 'asc';       // 'asc' = lowest rank first

// Farben für Vergleichslinien
const RR_COMPARE_COLORS = ['#f5c842', '#29b6f6', '#ff6584'];

function _rrSeasonLabel(season) {
  const s = RR_SEASONS.find(s => s.key === (season || rrSeason));
  return s ? s.label : '';
}

// ── SEASON 2026/27 — aus dem permanenten Archiv laden ───────────────────────
// data/rolling-rankings-2026-27.js wird täglich von
// scripts/build-rolling-archive.js aus LIVESCORES_AGGREGATE (Liga "nba",
// reguläre Saison) gebaut — inkl. fester Kategorie-Gewichtung (PTS 0.9,
// REB 1, AST 1, STL 0.75, BLK 0.75, 3PM 0.75, FG% 1, FT% 0.85, TO 0.25) und
// wird NIE gekürzt. Anders als früher wird hier also nichts mehr live im
// Browser aus LIVESCORES_AGGREGATE neu berechnet (das würde nach dessen
// Kürzung auf 180 Stichtage Daten verlieren) — die Datei selbst ist die
// dauerhafte Quelle.
let _rrSeason2026Cache = null;

function _rrBuildSeason2026() {
  if (_rrSeason2026Cache) return _rrSeason2026Cache;

  const players = (typeof ROLLING_RANKINGS_2026 !== 'undefined') ? ROLLING_RANKINGS_2026 : [];
  const months  = (typeof RR2026_MONTHS !== 'undefined') ? RR2026_MONTHS : [];
  const weeks   = (typeof RR2026_WEEKS !== 'undefined') ? RR2026_WEEKS : [];

  _rrSeason2026Cache = { players, months, weeks };
  return _rrSeason2026Cache;
}

// ── SAISON-AWARE ACCESSORS (ersetzen direkte ROLLING_RANKINGS/RR_MONTHS/RR_WEEKS-Zugriffe) ──
function _rrData() {
  return rrSeason === 'season2026' ? _rrBuildSeason2026().players : ROLLING_RANKINGS;
}
function _rrMonths() {
  return rrSeason === 'season2026' ? _rrBuildSeason2026().months : RR_MONTHS;
}
function _rrWeeksList() {
  return rrSeason === 'season2026' ? _rrBuildSeason2026().weeks : RR_WEEKS;
}
function _rrEosColumnTitle() {
  return rrSeason === 'season2026' ? 'Aktueller Rang (neuester Monat)' : 'End of Season Rank';
}

function rrSetSeason(season) {
  if (season !== 'season2025' && season !== 'season2026') return;
  if (season === rrSeason) return;
  rrSeason = season;
  rrSelected = [];
  rrSortBy = 'eos';
  rrSortDir = 'asc';
  const inp = document.getElementById('rrSearch');
  if (inp) inp.value = '';
  _rrInit();
}

function showRollingRankings(highlightName) {
  navigate('rollingRankingsPage');
  _rrInit();
  if (highlightName) {
    const data = _rrData();
    const idx = data.findIndex(p =>
      p.name === highlightName || normalizeName(p.name) === normalizeName(highlightName)
    );
    if (idx !== -1) {
      rrSelected = [idx];
      rrCompareMode = false;
      _rrRenderAll();
      setTimeout(() => {
        const row = document.querySelector('.rr-row[data-idx="' + idx + '"]');
        if (row) row.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 100);
    }
  }
}

function _rrInit() {
  rrFiltered = _rrData().map((p, i) => ({ ...p, origIdx: i }));
  _rrApplySort();
  const inp = document.getElementById('rrSearch');
  if (inp) inp.value = '';
  _rrRenderAll();
}

// Sort rrFiltered in-place by current rrSortBy / rrSortDir.
function _rrApplySort() {
  const dir = rrSortDir === 'desc' ? -1 : 1;
  const key = rrSortBy;
  const isPeriod = key !== 'eos' && key !== 'name';

  rrFiltered.sort((a, b) => {
    let va, vb;
    if (key === 'name') {
      return dir * a.name.localeCompare(b.name);
    }
    if (key === 'eos') {
      va = a.eosRank;
      vb = b.eosRank;
    } else if (isPeriod) {
      // period: month name (rrView === 'monthly') or week number string (rrView === 'weekly').
      // Hängt bewusst am aktiven View statt an der festen 2025/26-Monatsliste, da die
      // 2026/27-Saison mehr/andere Monatslabel haben kann (Apr, Mai, Jun, …).
      const isMonth = rrView === 'monthly';
      va = isMonth ? (a.rankings || {})[key] : (a.weeklyRanks || {})[key];
      vb = isMonth ? (b.rankings || {})[key] : (b.weeklyRanks || {})[key];
    }
    // Nulls always last
    const an = va == null;
    const bn = vb == null;
    if (an && bn) return a.name.localeCompare(b.name);
    if (an) return 1;
    if (bn) return -1;
    return dir * (va - vb);
  });
}

function rrSortByKey(key) {
  if (rrSortBy === key) {
    rrSortDir = rrSortDir === 'asc' ? 'desc' : 'asc';
  } else {
    rrSortBy = key;
    rrSortDir = 'asc';
  }
  _rrApplySort();
  _rrRenderListHeader();
  _rrRenderList();
}

function _rrRenderAll() {
  _rrRenderToolbar();
  if (rrSeason === 'season2026' && !_rrData().length) {
    _rrRenderEmptySeason();
    return;
  }
  _rrRenderListHeader();
  _rrRenderList();
  _rrRenderMain();
}

// Platzhalter, solange für die Liga "nba" (reguläre 2026/27-Saison) noch keine
// LIVESCORES_AGGREGATE-Daten existieren (z.B. während Summer League/Preseason).
function _rrRenderEmptySeason() {
  const colHost = document.getElementById('rrListCols');
  if (colHost) colHost.innerHTML = '';
  const body = document.getElementById('rrListBody');
  if (body) body.innerHTML = `
    <div style="padding:32px 18px;color:var(--muted);font-size:12px;text-align:center;line-height:1.6;">
      Noch keine Live-Daten für die Saison 2026/27.<br>
      Sobald die regulären NBA-Season-Aggregate (Liga „NBA 2026/27") einlaufen, erscheinen sie hier automatisch.
    </div>`;
  const panel = document.getElementById('rrChartPanel');
  if (panel) panel.innerHTML = `
    <div style="margin:auto;text-align:center;color:var(--muted);">
      <div style="font-size:40px;margin-bottom:12px;">🕒</div>
      <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px;">Saison 2026/27 startet bald</div>
      <div style="font-size:13px;max-width:340px;">Sobald reguläre Season-Daten unter Live Scores → „NBA 2026/27" einlaufen, werden die Rolling Rankings hier automatisch befüllt — Summer League- und Pre-Season-Daten fließen bewusst nicht ein.</div>
    </div>`;
}

// ── TOOLBAR (Season Toggle + View Toggle + Compare Toggle) ──────────────────
function _rrRenderToolbar() {
  const host = document.getElementById('rrToolbar');
  if (!host) return;
  const season2025Active = rrSeason === 'season2025' ? ' rr-tb-active' : '';
  const season2026Active = rrSeason === 'season2026' ? ' rr-tb-active' : '';
  const monthlyActive = rrView === 'monthly' ? ' rr-tb-active' : '';
  const weeklyActive  = rrView === 'weekly'  ? ' rr-tb-active' : '';
  const compareActive = rrCompareMode ? ' rr-tb-active' : '';
  host.innerHTML = `
    <div class="rr-tb-group">
      <button class="rr-tb-btn${season2025Active}" onclick="rrSetSeason('season2025')">2025/26</button>
      <button class="rr-tb-btn${season2026Active}" onclick="rrSetSeason('season2026')">2026/27</button>
    </div>
    <div class="rr-tb-group">
      <button class="rr-tb-btn${monthlyActive}" onclick="rrSetView('monthly')">📅 Monate</button>
      <button class="rr-tb-btn${weeklyActive}" onclick="rrSetView('weekly')">📊 Wochen</button>
    </div>
    <div class="rr-tb-group">
      <button class="rr-tb-btn${compareActive}" onclick="rrToggleCompare()">⚖️ Vergleichen ${rrCompareMode ? '(' + rrSelected.length + '/3)' : ''}</button>
    </div>
  `;
  const sub = document.getElementById('rrSeasonSubtitle');
  if (sub) sub.textContent = 'Saison ' + _rrSeasonLabel();
}

function rrSetView(v) {
  if (v !== 'monthly' && v !== 'weekly') return;
  rrView = v;
  _rrRenderAll();
}

function rrToggleCompare() {
  rrCompareMode = !rrCompareMode;
  if (!rrCompareMode && rrSelected.length > 1) {
    rrSelected = rrSelected.slice(0, 1);
  }
  _rrRenderAll();
}

// ── LIST HEADER (cols change with view, clickable for sort) ─────────────────
function _rrRenderListHeader() {
  const host = document.getElementById('rrListCols');
  if (!host) return;

  const sortIndicator = key => {
    if (rrSortBy !== key) return '';
    return rrSortDir === 'asc' ? ' ↑' : ' ↓';
  };
  const cls = key => 'rr-col-h' + (rrSortBy === key ? ' rr-col-active' : '');

  const eosTitle = _rrEosColumnTitle();

  if (rrView === 'monthly') {
    const months = _rrMonths();
    host.style.gridTemplateColumns = `32px 1fr repeat(${months.length}, 30px)`;
    const monthHeaders = months.map(m => {
      const lbl = m === 'März' ? 'Mrz' : m;
      return `<span class="${cls(m)}" onclick="rrSortByKey('${m}')">${lbl}${sortIndicator(m)}</span>`;
    }).join('');
    host.innerHTML =
      `<span class="${cls('eos')}" onclick="rrSortByKey('eos')" title="${eosTitle}">#${sortIndicator('eos')}</span>` +
      `<span class="${cls('name')}" onclick="rrSortByKey('name')" style="text-align:left;">Name${sortIndicator('name')}</span>` +
      monthHeaders;
  } else {
    const weeks = _rrWeeksList();
    host.style.gridTemplateColumns = `32px minmax(120px, 1fr) repeat(${weeks.length}, 26px)`;
    const weekHeaders = weeks.map(w => {
      const k = String(w);
      return `<span class="${cls(k)}" onclick="rrSortByKey('${k}')">W${w}${sortIndicator(k)}</span>`;
    }).join('');
    host.innerHTML =
      `<span class="${cls('eos')}" onclick="rrSortByKey('eos')" title="${eosTitle}">#${sortIndicator('eos')}</span>` +
      `<span class="${cls('name')}" onclick="rrSortByKey('name')" style="text-align:left;">Name${sortIndicator('name')}</span>` +
      weekHeaders;
  }
}

function rrFilter() {
  const q = (document.getElementById('rrSearch')?.value || '').toLowerCase().trim();
  const data = _rrData();
  rrFiltered = q
    ? data.map((p, i) => ({ ...p, origIdx: i })).filter(p => p.name.toLowerCase().includes(q))
    : data.map((p, i) => ({ ...p, origIdx: i }));
  _rrApplySort();
  _rrRenderList();
}

function _rrRankColor(r) {
  if (r === null || r === undefined) return 'var(--border)';
  if (r <= 5)   return '#f5c842';
  if (r <= 15)  return '#4caf81';
  if (r <= 30)  return '#29b6f6';
  if (r <= 60)  return '#9e78ff';
  if (r <= 100) return '#ff9800';
  return '#ff6584';
}

function _rrGetValues(player) {
  // Returns { labels, values } for the active view
  if (rrView === 'weekly') {
    const weeks = _rrWeeksList();
    const ranks = player.weeklyRanks || {};
    return {
      labels: weeks.map(w => 'W' + w),
      values: weeks.map(w => ranks[String(w)] ?? null),
      keys:   weeks.map(w => String(w)),
    };
  }
  const months = _rrMonths();
  const ranks = player.rankings || {};
  return {
    labels: months,
    values: months.map(m => ranks[m] ?? null),
    keys:   months.slice(),
  };
}

function _rrRenderList() {
  const body = document.getElementById('rrListBody');
  if (!body) return;
  const cols = rrView === 'monthly' ? _rrMonths() : _rrWeeksList().map(w => String(w));
  const colWidth = rrView === 'monthly' ? 30 : 26;
  const gridTpl = rrView === 'monthly'
    ? `32px 1fr repeat(${cols.length}, ${colWidth}px)`
    : `32px minmax(120px, 1fr) repeat(${cols.length}, ${colWidth}px)`;

  body.innerHTML = rrFiltered.map((p, sortIdx) => {
    const cells = cols.map(k => {
      const r = rrView === 'monthly' ? (p.rankings || {})[k] : (p.weeklyRanks || {})[k];
      const c = _rrRankColor(r);
      return `<span class="rr-rank-cell" style="color:${c};background:${r ? c + '22' : 'transparent'}">${r ?? '–'}</span>`;
    }).join('');
    const isSelected = rrSelected.indexOf(p.origIdx) !== -1;
    const active = isSelected ? ' rr-active' : '';
    const selIdx = rrSelected.indexOf(p.origIdx);
    const colorDot = (rrCompareMode && isSelected)
      ? `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${RR_COMPARE_COLORS[selIdx]};margin-right:4px;vertical-align:middle;"></span>`
      : '';
    // Index column: when sorting by EOS, show the EOS rank itself; otherwise the position in the current sort
    const idxLabel = rrSortBy === 'eos'
      ? (p.eosRank != null ? p.eosRank : '–')
      : (sortIdx + 1);
    return `<div class="rr-row${active}" data-idx="${p.origIdx}" onclick="rrSelectPlayer(${p.origIdx})" style="grid-template-columns:${gridTpl};">
      <span class="rr-idx">${idxLabel}</span>
      <span class="rr-name" title="${p.name}">${colorDot}${p.name}</span>
      ${cells}
    </div>`;
  }).join('');
}

function rrSelectPlayer(origIdx) {
  if (rrCompareMode) {
    const i = rrSelected.indexOf(origIdx);
    if (i !== -1) {
      // Deselect
      rrSelected.splice(i, 1);
    } else if (rrSelected.length < 3) {
      rrSelected.push(origIdx);
    } else {
      // Already 3 selected — replace last
      rrSelected[2] = origIdx;
    }
  } else {
    rrSelected = [origIdx];
  }
  _rrRenderAll();
}

// ── MAIN PANEL ──────────────────────────────────────────────────────────────
function _rrRenderMain() {
  const panel = document.getElementById('rrChartPanel');
  if (!panel) return;
  if (!rrSelected.length) {
    panel.innerHTML = `
      <div style="margin:auto;text-align:center;color:var(--muted);">
        <div style="font-size:40px;margin-bottom:12px;">📈</div>
        <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px;">Spieler auswählen</div>
        <div style="font-size:13px;">${rrCompareMode ? 'Wähle bis zu 3 Spieler links zum Vergleich' : 'Klicke links auf einen Spieler um seinen Ranking-Verlauf zu sehen'}</div>
      </div>`;
    return;
  }

  if (rrCompareMode && rrSelected.length > 1) {
    _rrRenderCompare(panel);
  } else {
    _rrRenderSingle(panel, _rrData()[rrSelected[0]]);
  }
}

function _rrRenderSingle(panel, player) {
  const v       = _rrGetValues(player);
  const valid   = v.values.filter(x => x !== null);
  const best    = valid.length ? Math.min(...valid) : null;
  const worst   = valid.length ? Math.max(...valid) : null;
  const avg     = valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : null;
  const total   = v.values.length;
  const unit    = rrView === 'weekly' ? 'Wochen' : 'Monate';

  const pillsHtml = `
    <div class="rr-pills">
      <div class="rr-pill"><span class="rr-pill-val" style="color:#f5c842">${best ?? '–'}</span><span class="rr-pill-label">Bestes</span></div>
      <div class="rr-pill"><span class="rr-pill-val" style="color:#ff6584">${worst ?? '–'}</span><span class="rr-pill-label">Schlechtestes</span></div>
      <div class="rr-pill"><span class="rr-pill-val" style="color:#29b6f6">${avg ?? '–'}</span><span class="rr-pill-label">Schnitt</span></div>
      <div class="rr-pill"><span class="rr-pill-val" style="color:#4caf81">${valid.length}/${total}</span><span class="rr-pill-label">${unit}</span></div>
    </div>`;

  // Compact badges — only for monthly (weekly would be too many)
  let badgesHtml = '';
  if (rrView === 'monthly') {
    badgesHtml = '<div class="rr-badges">' + _rrMonths().map((m, i) => {
      const r = v.values[i];
      const c = _rrRankColor(r);
      return `<div class="rr-month-badge">
        <span class="rr-badge-label">${m}</span>
        <span class="rr-badge-rank" style="color:${c}">${r ?? '—'}</span>
      </div>`;
    }).join('') + '</div>';
  }

  panel.innerHTML = `
    <div class="rr-player-header">
      <div>
        <div class="rr-player-name">${player.name}</div>
        <div class="rr-player-sub">Dynasty Rolling Rankings · Saison ${_rrSeasonLabel()} · ${rrView === 'weekly' ? 'Wöchentlich' : 'Monatlich'}</div>
      </div>
      ${pillsHtml}
    </div>
    <div class="rr-chart-box">
      <canvas id="rrCanvas"></canvas>
    </div>
    ${badgesHtml}
    <div class="rr-share-row">
      <button class="rr-share-btn" onclick="rrOpenShareModal()">📸 Instagram Screenshot</button>
    </div>`;

  _rrDrawChart([{ player, values: v.values, color: RR_COMPARE_COLORS[0] }], v.labels);
}

function _rrRenderCompare(panel) {
  const data = _rrData();
  const players = rrSelected.map(i => data[i]);
  const datasets = players.map((p, i) => {
    const v = _rrGetValues(p);
    return { player: p, values: v.values, color: RR_COMPARE_COLORS[i] };
  });
  const labels = _rrGetValues(players[0]).labels;

  // Mini-Stats für jeden Spieler
  const cardsHtml = datasets.map(d => {
    const valid = d.values.filter(x => x !== null);
    const best  = valid.length ? Math.min(...valid) : null;
    const avg   = valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : null;
    return `<div class="rr-compare-card" style="border-color:${d.color}55;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span style="width:12px;height:12px;border-radius:50%;background:${d.color};"></span>
        <span style="font-weight:800;font-size:15px;">${d.player.name}</span>
      </div>
      <div style="display:flex;gap:14px;font-size:11px;color:var(--muted);">
        <span>Bestes: <strong style="color:${d.color};font-size:14px;">#${best ?? '–'}</strong></span>
        <span>Schnitt: <strong style="color:${d.color};font-size:14px;">#${avg ?? '–'}</strong></span>
      </div>
    </div>`;
  }).join('');

  panel.innerHTML = `
    <div class="rr-player-header">
      <div>
        <div class="rr-player-name">Vergleich</div>
        <div class="rr-player-sub">Dynasty Rolling Rankings · Saison ${_rrSeasonLabel()} · ${rrView === 'weekly' ? 'Wöchentlich' : 'Monatlich'}</div>
      </div>
    </div>
    <div class="rr-compare-cards">${cardsHtml}</div>
    <div class="rr-chart-box">
      <canvas id="rrCanvas"></canvas>
    </div>
    <div class="rr-share-row">
      <button class="rr-share-btn" onclick="rrOpenShareModal()">📸 Instagram Screenshot</button>
    </div>`;

  _rrDrawChart(datasets, labels);
}

// ── CHART (handles 1-3 lines) ───────────────────────────────────────────────
function _rrDrawChart(datasets, labels) {
  if (rrChart) { rrChart.destroy(); rrChart = null; }
  const canvas = document.getElementById('rrCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const chartDatasets = datasets.map((d, i) => {
    const grad = ctx.createLinearGradient(0, 0, 0, 280);
    const rgba = _rrHexToRgba(d.color, 0.22);
    grad.addColorStop(0, rgba);
    grad.addColorStop(1, _rrHexToRgba(d.color, 0));
    return {
      label: d.player.name,
      data: d.values,
      borderColor: d.color,
      backgroundColor: datasets.length === 1 ? grad : 'transparent',
      pointBackgroundColor: d.values.map(r => datasets.length === 1 ? _rrRankColor(r) : d.color),
      pointBorderColor: 'var(--bg, #0f0f13)',
      pointBorderWidth: 2,
      pointRadius: rrView === 'weekly' ? 4 : 7,
      pointHoverRadius: rrView === 'weekly' ? 6 : 10,
      borderWidth: 2.5,
      fill: datasets.length === 1,
      tension: 0.35,
      spanGaps: true,
    };
  });

  rrChart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: chartDatasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: rrView === 'weekly' ? 2.0 : 2.6,
      plugins: {
        legend: {
          display: datasets.length > 1,
          labels: { color: 'var(--text, #f0eff6)', font: { size: 12, weight: '700' } }
        },
        tooltip: {
          backgroundColor: 'var(--surface2, #222229)',
          borderColor: 'var(--border, #2e2e3a)',
          borderWidth: 1,
          titleColor: 'var(--text, #f0eff6)',
          bodyColor: '#f5c842',
          padding: 12,
          callbacks: {
            label: c => c.raw === null ? `${c.dataset.label}: kein Ranking` : `${c.dataset.label}: #${c.raw}`
          }
        }
      },
      scales: {
        y: {
          reverse: true,
          min: 1,
          grid:   { color: 'var(--border, #2e2e3a)' },
          border: { color: 'var(--border, #2e2e3a)' },
          ticks:  { color: 'var(--muted, #7a7a8e)', font: { size: 11 }, callback: v => `#${v}`, stepSize: rrView === 'weekly' ? 25 : 10 },
          title:  { display: true, text: 'Ranking', color: 'var(--muted, #7a7a8e)', font: { size: 11 } }
        },
        x: {
          grid:   { color: 'var(--border, #2e2e3a)' },
          border: { color: 'var(--border, #2e2e3a)' },
          ticks:  {
            color: 'var(--text, #f0eff6)',
            font: { size: rrView === 'weekly' ? 9 : 12, weight: '700' },
            maxRotation: rrView === 'weekly' ? 0 : 0,
            autoSkip: rrView === 'weekly',
            autoSkipPadding: 8,
          }
        }
      }
    }
  });
}

function _rrHexToRgba(hex, alpha) {
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return `rgba(245,200,66,${alpha})`;
  const n = parseInt(m[1], 16);
  return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${alpha})`;
}

// ============================================================
//  INSTAGRAM SCREENSHOT (4:5)
// ============================================================
let rrShareStyle = 'warm';  // 'warm' | 'dark'

function rrOpenShareModal() {
  const overlay = document.getElementById('rrShareModalOverlay');
  if (!overlay) return;
  rrShareStyle = 'warm';
  _rrRenderShareCard();
  overlay.style.display = 'flex';
}

function rrCloseShareModal() {
  const overlay = document.getElementById('rrShareModalOverlay');
  if (overlay) overlay.style.display = 'none';
}

function rrSetShareStyle(style) {
  rrShareStyle = style;
  _rrRenderShareCard();
}

function _rrRenderShareCard() {
  const host = document.getElementById('rrShareCardContent');
  if (!host) return;

  // Update style toggle buttons
  document.querySelectorAll('.rr-style-btn').forEach(btn => {
    btn.classList.toggle('rr-style-active', btn.dataset.style === rrShareStyle);
  });

  const isCompare = rrCompareMode && rrSelected.length > 1;
  const data      = _rrData();
  const players   = rrSelected.map(i => data[i]);
  const labels    = _rrGetValues(players[0]).labels;
  const datasets  = players.map((p, i) => {
    const v = _rrGetValues(p);
    return { player: p, values: v.values, color: RR_COMPARE_COLORS[i] };
  });

  const th = rrShareStyle === 'warm' ? {
    bg: '#fff5ee', surface: '#ffffff', text: '#1a1410', muted: '#8a6d5a',
    accent: '#c58f32', border: '#e8d5c2', shadow: 'rgba(197,143,50,0.08)',
  } : {
    bg: '#0f1117', surface: '#1a1d27', text: '#f0eff6', muted: '#8e8e9e',
    accent: '#f5c842', border: '#2e2e3a', shadow: 'rgba(0,0,0,0.3)',
  };

  const titleText = isCompare ? 'Rolling Rankings · Vergleich' : players[0].name;
  const subText   = isCompare ? `Saison ${_rrSeasonLabel()}` : `Dynasty Rolling Rankings · ${_rrSeasonLabel()}`;

  // Stats section
  let statsHtml = '';
  if (isCompare) {
    statsHtml = datasets.map(d => {
      const valid = d.values.filter(x => x !== null);
      const best  = valid.length ? Math.min(...valid) : null;
      const avg   = valid.length ? Math.round(valid.reduce((a,b)=>a+b,0)/valid.length) : null;
      return `<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:${th.surface};border-radius:10px;border:1px solid ${th.border};">
        <span style="width:14px;height:14px;border-radius:50%;background:${d.color};flex-shrink:0;"></span>
        <div style="flex:1;min-width:0;">
          <div style="font-size:14px;font-weight:800;color:${th.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${d.player.name}</div>
          <div style="font-size:10px;color:${th.muted};margin-top:2px;">Bestes #${best ?? '–'} · Schnitt #${avg ?? '–'}</div>
        </div>
      </div>`;
    }).join('');
    statsHtml = `<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:18px;">${statsHtml}</div>`;
  } else {
    const v = datasets[0].values;
    const valid = v.filter(x => x !== null);
    const best  = valid.length ? Math.min(...valid) : null;
    const worst = valid.length ? Math.max(...valid) : null;
    const avg   = valid.length ? Math.round(valid.reduce((a,b)=>a+b,0)/valid.length) : null;
    const pill = (val, label, color) => `
      <div style="flex:1;background:${th.surface};border:1px solid ${th.border};border-radius:10px;padding:12px 8px;text-align:center;">
        <div style="font-size:24px;font-weight:800;color:${color};line-height:1;">${val ?? '–'}</div>
        <div style="font-size:9px;color:${th.muted};margin-top:6px;letter-spacing:1px;text-transform:uppercase;">${label}</div>
      </div>`;
    statsHtml = `<div style="display:flex;gap:8px;margin-bottom:18px;">
      ${pill(best, 'Bestes', '#f5c842')}
      ${pill(worst, 'Schlechtestes', '#ff6584')}
      ${pill(avg, 'Schnitt', '#29b6f6')}
    </div>`;
  }

  host.innerHTML = `
    <div id="rrShareCardInner" style="width:480px;aspect-ratio:4/5;background:${th.bg};padding:32px 28px;font-family:'DM Sans',system-ui,sans-serif;color:${th.text};display:flex;flex-direction:column;border-radius:18px;box-shadow:0 8px 32px ${th.shadow};">
      <div style="font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${th.muted};text-align:center;margin-bottom:6px;">🌮 Taco Tuesday HQ · Rolling Rankings</div>
      <div style="font-size:${isCompare ? '28px' : '32px'};font-family:'Playfair Display',serif;font-weight:800;text-align:center;line-height:1.1;color:${th.accent};margin-bottom:4px;">${titleText}</div>
      <div style="font-size:11px;color:${th.muted};text-align:center;margin-bottom:18px;">${subText} · ${rrView === 'weekly' ? 'Wöchentlich' : 'Monatlich'}</div>
      ${statsHtml}
      <div style="flex:1;background:${th.surface};border:1px solid ${th.border};border-radius:14px;padding:14px;display:flex;align-items:center;justify-content:center;min-height:0;">
        <canvas id="rrShareCanvas" style="max-width:100%;max-height:100%;"></canvas>
      </div>
      <div style="text-align:center;font-size:10px;color:${th.muted};margin-top:14px;letter-spacing:1px;">taco-tuesday-league.com</div>
    </div>`;

  // Draw chart
  setTimeout(() => _rrDrawShareChart(datasets, labels, th), 30);
}

function _rrDrawShareChart(datasets, labels, th) {
  const canvas = document.getElementById('rrShareCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const chartDatasets = datasets.map(d => {
    const grad = ctx.createLinearGradient(0, 0, 0, 240);
    grad.addColorStop(0, _rrHexToRgba(d.color, 0.25));
    grad.addColorStop(1, _rrHexToRgba(d.color, 0));
    return {
      label: d.player.name,
      data: d.values,
      borderColor: d.color,
      backgroundColor: datasets.length === 1 ? grad : 'transparent',
      pointBackgroundColor: d.color,
      pointBorderColor: th.bg,
      pointBorderWidth: 2,
      pointRadius: rrView === 'weekly' ? 3 : 5,
      borderWidth: 2.5,
      fill: datasets.length === 1,
      tension: 0.35,
      spanGaps: true,
    };
  });

  new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: chartDatasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        y: {
          reverse: true,
          min: 1,
          grid:   { color: th.border },
          border: { color: th.border },
          ticks:  { color: th.muted, font: { size: 10 }, callback: v => `#${v}` }
        },
        x: {
          grid:   { color: th.border },
          border: { color: th.border },
          ticks:  {
            color: th.text,
            font: { size: rrView === 'weekly' ? 8 : 11, weight: '700' },
            autoSkip: rrView === 'weekly',
            autoSkipPadding: 6,
          }
        }
      }
    }
  });
}

async function rrDownloadShareImage() {
  const card = document.getElementById('rrShareCardInner');
  if (!card) return;
  if (typeof html2canvas !== 'function') { alert('html2canvas Library nicht geladen.'); return; }
  const btn = document.getElementById('rrDownloadBtn');
  const orig = btn ? btn.textContent : '';
  if (btn) { btn.textContent = '⏳ Erstelle...'; btn.disabled = true; }
  try {
    const bg = rrShareStyle === 'warm' ? '#fff5ee' : '#0f1117';
    const canvas = await html2canvas(card, {
      backgroundColor: bg,
      scale: 2,
      logging: false,
      useCORS: true,
    });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    const stamp = new Date().toISOString().split('T')[0];
    const isCompare = rrCompareMode && rrSelected.length > 1;
    const slug = isCompare
      ? 'vergleich'
      : (_rrData()[rrSelected[0]]?.name || 'spieler').toLowerCase().replace(/[^a-z0-9]+/g,'-');
    link.download = `taco-rolling-${slug}-${stamp}.png`;
    link.click();
    if (btn) { btn.textContent = '✓ Gespeichert!'; }
    setTimeout(() => { if (btn) { btn.textContent = orig; btn.disabled = false; } }, 1500);
  } catch (err) {
    console.error('Screenshot failed:', err);
    alert('Fehler beim Erstellen: ' + err.message);
    if (btn) { btn.textContent = orig; btn.disabled = false; }
  }
}
