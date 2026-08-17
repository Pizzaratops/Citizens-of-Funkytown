// ============================================================
//  DYNASTY ROLLING RANKINGS — UI
// ============================================================
//  Gleiches Layout/Verhalten wie js/rolling-rankings.js (Sidebar mit
//  sortierbarer Liste + Chart-Panel + Vergleichsmodus für bis zu 3
//  Spieler), aber auf Basis von data/dynasty-rolling.js (DYNASTY_
//  ROLLING, NUR MFHFBs DR). Kein Season-/Monats-/Wochen-Toggle, weil
//  es hier nur EINE Zeitreihe gibt: die Snapshots selbst (irregulär
//  datiert, wächst mit jedem `node scripts/build-dynasty-rolling.js`).
//  Eigener "dr"-Namespace statt "rr", damit beide Scripts gleichzeitig
//  geladen sein können ohne Variablen-/ID-Kollisionen.
// ============================================================

let drCompareMode = false;
let drSelected     = [];      // Array von origIdx (max 3 wenn compare, sonst max 1)
let drFiltered     = [];
let drChart        = null;
let drSortBy       = 'latest'; // 'latest' | 'name' | <snapshot-date>
let drSortDir      = 'asc';

const DR_COMPARE_COLORS = ['#f5c842', '#29b6f6', '#ff6584'];

let _drDataCache = null;
function _drData() {
  if (_drDataCache) return _drDataCache;
  const snaps = (typeof DYNASTY_ROLLING !== 'undefined') ? DYNASTY_ROLLING : [];
  const dynastyByName = new Map((typeof DYNASTY_PLAYERS !== 'undefined' ? DYNASTY_PLAYERS : []).map(p => [p[1], p]));
  const nameSet = new Set();
  snaps.forEach(s => Object.keys(s.ranks).forEach(n => nameSet.add(n)));

  _drDataCache = [...nameSet].map(name => {
    const dp = dynastyByName.get(name);
    const ranks = snaps.map(s => (name in s.ranks) ? s.ranks[name] : null);
    const latestRank = ranks.length ? ranks[ranks.length - 1] : null;
    return { name, team: dp ? dp[2] : '', pos: dp ? dp[3] : '', ranks, latestRank };
  });
  return _drDataCache;
}
function _drSnaps() {
  return (typeof DYNASTY_ROLLING !== 'undefined') ? DYNASTY_ROLLING : [];
}

function showDynastyRolling(highlightName) {
  navigate('dynastyRollingPage');
  _drDataCache = null; // frisch aufbauen, falls sich data/rankings.js seit letztem Öffnen geändert hat
  _drInit();
  if (highlightName) {
    const data = _drData();
    const idx = data.findIndex(p =>
      p.name === highlightName || (typeof normalizeName === 'function' && normalizeName(p.name) === normalizeName(highlightName))
    );
    if (idx !== -1) {
      drSelected = [idx];
      drCompareMode = false;
      _drRenderAll();
      setTimeout(() => {
        const row = document.querySelector('.rr-row[data-idx="' + idx + '"]');
        if (row) row.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 100);
    }
  }
}

function _drInit() {
  drFiltered = _drData().map((p, i) => ({ ...p, origIdx: i }));
  _drApplySort();
  const inp = document.getElementById('drSearch');
  if (inp) inp.value = '';
  _drRenderAll();
}

function _drApplySort() {
  const dir = drSortDir === 'desc' ? -1 : 1;
  const key = drSortBy;
  const snaps = _drSnaps();
  const snapIdx = snaps.findIndex(s => s.date === key);

  drFiltered.sort((a, b) => {
    let va, vb;
    if (key === 'name') return dir * a.name.localeCompare(b.name);
    if (key === 'latest') { va = a.latestRank; vb = b.latestRank; }
    else if (snapIdx !== -1) { va = a.ranks[snapIdx]; vb = b.ranks[snapIdx]; }
    else { va = a.latestRank; vb = b.latestRank; }
    const an = va == null, bn = vb == null;
    if (an && bn) return a.name.localeCompare(b.name);
    if (an) return 1;
    if (bn) return -1;
    return dir * (va - vb);
  });
}

function drSortByKey(key) {
  if (drSortBy === key) drSortDir = drSortDir === 'asc' ? 'desc' : 'asc';
  else { drSortBy = key; drSortDir = 'asc'; }
  _drApplySort();
  _drRenderListHeader();
  _drRenderList();
}

function _drRenderAll() {
  _drRenderToolbar();
  if (!_drSnaps().length) { _drRenderEmpty(); return; }
  _drRenderListHeader();
  _drRenderList();
  _drRenderMain();
}

function _drRenderEmpty() {
  const colHost = document.getElementById('drListCols');
  if (colHost) colHost.innerHTML = '';
  const body = document.getElementById('drListBody');
  if (body) body.innerHTML = `<div style="padding:32px 18px;color:var(--muted);font-size:12px;text-align:center;line-height:1.6;">Noch keine Snapshot-Historie verfügbar.<br>Läuft automatisch mit, sobald <code>scripts/build-dynasty-rolling.js</code> läuft.</div>`;
  const panel = document.getElementById('drChartPanel');
  if (panel) panel.innerHTML = `<div style="margin:auto;text-align:center;color:var(--muted);"><div style="font-size:40px;margin-bottom:12px;">🕒</div><div style="font-size:15px;font-weight:700;color:var(--text);">Noch keine Daten</div></div>`;
}

function _drRenderToolbar() {
  const host = document.getElementById('drToolbar');
  if (!host) return;
  const compareActive = drCompareMode ? ' rr-tb-active' : '';
  host.innerHTML = `
    <div class="rr-tb-group">
      <button class="rr-tb-btn${compareActive}" onclick="drToggleCompare()">⚖️ Vergleichen ${drCompareMode ? '(' + drSelected.length + '/3)' : ''}</button>
    </div>
  `;
  const sub = document.getElementById('drSnapshotSubtitle');
  const snaps = _drSnaps();
  if (sub) sub.textContent = snaps.length ? `${snaps.length} Snapshot${snaps.length === 1 ? '' : 's'} · zuletzt ${snaps[snaps.length - 1].label}` : 'MFHFBs DR';
}

function drToggleCompare() {
  drCompareMode = !drCompareMode;
  if (!drCompareMode && drSelected.length > 1) drSelected = drSelected.slice(0, 1);
  _drRenderAll();
}

function _drRenderListHeader() {
  const host = document.getElementById('drListCols');
  if (!host) return;
  const snaps = _drSnaps();
  const sortIndicator = key => drSortBy !== key ? '' : (drSortDir === 'asc' ? ' ↑' : ' ↓');
  const cls = key => 'rr-col-h' + (drSortBy === key ? ' rr-col-active' : '');

  host.style.gridTemplateColumns = `32px 1fr repeat(${snaps.length}, 42px)`;
  const snapHeaders = snaps.map(s =>
    `<span class="${cls(s.date)}" onclick="drSortByKey('${s.date}')" title="${s.date}">${s.label}${sortIndicator(s.date)}</span>`
  ).join('');
  host.innerHTML =
    `<span class="${cls('latest')}" onclick="drSortByKey('latest')" title="Aktueller Rang (neuester Snapshot)">#${sortIndicator('latest')}</span>` +
    `<span class="${cls('name')}" onclick="drSortByKey('name')" style="text-align:left;">Name${sortIndicator('name')}</span>` +
    snapHeaders;
}

function drFilter() {
  const q = (document.getElementById('drSearch')?.value || '').toLowerCase().trim();
  const data = _drData();
  drFiltered = q
    ? data.map((p, i) => ({ ...p, origIdx: i })).filter(p => p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q) || p.pos.toLowerCase().includes(q))
    : data.map((p, i) => ({ ...p, origIdx: i }));
  _drApplySort();
  _drRenderList();
}

function _drRankColor(r) {
  if (r === null || r === undefined) return 'var(--border)';
  if (r <= 5)   return '#f5c842';
  if (r <= 15)  return '#4caf81';
  if (r <= 30)  return '#29b6f6';
  if (r <= 60)  return '#9e78ff';
  if (r <= 100) return '#ff9800';
  return '#ff6584';
}

function _drRenderList() {
  const body = document.getElementById('drListBody');
  if (!body) return;
  const snaps = _drSnaps();
  const gridTpl = `32px 1fr repeat(${snaps.length}, 42px)`;

  body.innerHTML = drFiltered.map((p, sortIdx) => {
    const cells = snaps.map((s, i) => {
      const r = p.ranks[i];
      const c = _drRankColor(r);
      return `<span class="rr-rank-cell" style="color:${c};background:${r ? c + '22' : 'transparent'}">${r ?? '–'}</span>`;
    }).join('');
    const isSelected = drSelected.indexOf(p.origIdx) !== -1;
    const active = isSelected ? ' rr-active' : '';
    const selIdx = drSelected.indexOf(p.origIdx);
    const colorDot = (drCompareMode && isSelected)
      ? `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${DR_COMPARE_COLORS[selIdx]};margin-right:4px;vertical-align:middle;"></span>`
      : '';
    const idxLabel = drSortBy === 'latest'
      ? (p.latestRank != null ? p.latestRank : '–')
      : (sortIdx + 1);
    return `<div class="rr-row${active}" data-idx="${p.origIdx}" onclick="drSelectPlayer(${p.origIdx})" style="grid-template-columns:${gridTpl};">
      <span class="rr-idx">${idxLabel}</span>
      <span class="rr-name" title="${p.name}">${colorDot}${p.name}</span>
      ${cells}
    </div>`;
  }).join('');
}

function drSelectPlayer(origIdx) {
  if (drCompareMode) {
    const i = drSelected.indexOf(origIdx);
    if (i !== -1) drSelected.splice(i, 1);
    else if (drSelected.length < 3) drSelected.push(origIdx);
    else drSelected[2] = origIdx;
  } else {
    drSelected = [origIdx];
  }
  _drRenderAll();
}

// ── MAIN PANEL ──────────────────────────────────────────────────────────────
function _drRenderMain() {
  const panel = document.getElementById('drChartPanel');
  if (!panel) return;
  if (!drSelected.length) {
    panel.innerHTML = `
      <div style="margin:auto;text-align:center;color:var(--muted);">
        <div style="font-size:40px;margin-bottom:12px;">📈</div>
        <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px;">Spieler auswählen</div>
        <div style="font-size:13px;">${drCompareMode ? 'Wähle bis zu 3 Spieler links zum Vergleich' : 'Klicke links auf einen Spieler um seinen Dynasty-Rang-Verlauf zu sehen'}</div>
      </div>`;
    return;
  }
  if (drCompareMode && drSelected.length > 1) _drRenderCompare(panel);
  else _drRenderSingle(panel, _drData()[drSelected[0]]);
}

function _drRenderSingle(panel, player) {
  const snaps  = _drSnaps();
  const labels = snaps.map(s => s.label);
  const values = player.ranks;
  const valid  = values.filter(x => x !== null);
  const best   = valid.length ? Math.min(...valid) : null;
  const worst  = valid.length ? Math.max(...valid) : null;
  const avg    = valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : null;

  const pillsHtml = `
    <div class="rr-pills">
      <div class="rr-pill"><span class="rr-pill-val" style="color:#f5c842">${best ?? '–'}</span><span class="rr-pill-label">Bestes</span></div>
      <div class="rr-pill"><span class="rr-pill-val" style="color:#ff6584">${worst ?? '–'}</span><span class="rr-pill-label">Schlechtestes</span></div>
      <div class="rr-pill"><span class="rr-pill-val" style="color:#29b6f6">${avg ?? '–'}</span><span class="rr-pill-label">Schnitt</span></div>
      <div class="rr-pill"><span class="rr-pill-val" style="color:#4caf81">${valid.length}/${values.length}</span><span class="rr-pill-label">Snapshots</span></div>
    </div>`;

  const badgesHtml = '<div class="rr-badges">' + snaps.map((s, i) => {
    const r = values[i];
    const c = _drRankColor(r);
    return `<div class="rr-month-badge"><span class="rr-badge-label">${s.label}</span><span class="rr-badge-rank" style="color:${c}">${r ?? '—'}</span></div>`;
  }).join('') + '</div>';

  panel.innerHTML = `
    <div class="rr-player-header">
      <div>
        <div class="rr-player-name">${player.name}</div>
        <div class="rr-player-sub">Dynasty Rolling Rankings · ${player.team || '—'} ${player.pos ? '· ' + player.pos : ''}</div>
      </div>
      ${pillsHtml}
    </div>
    <div class="rr-chart-box">
      <canvas id="drCanvas"></canvas>
    </div>
    ${badgesHtml}`;

  _drDrawChart([{ player, values, color: DR_COMPARE_COLORS[0] }], labels);
}

function _drRenderCompare(panel) {
  const data = _drData();
  const snaps = _drSnaps();
  const labels = snaps.map(s => s.label);
  const players = drSelected.map(i => data[i]);
  const datasets = players.map((p, i) => ({ player: p, values: p.ranks, color: DR_COMPARE_COLORS[i] }));

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
        <div class="rr-player-sub">Dynasty Rolling Rankings</div>
      </div>
    </div>
    <div class="rr-compare-cards">${cardsHtml}</div>
    <div class="rr-chart-box">
      <canvas id="drCanvas"></canvas>
    </div>`;

  _drDrawChart(datasets, labels);
}

// ── CHART ────────────────────────────────────────────────────────────────
function _drDrawChart(datasets, labels) {
  if (drChart) { drChart.destroy(); drChart = null; }
  const canvas = document.getElementById('drCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const chartDatasets = datasets.map(d => {
    const grad = ctx.createLinearGradient(0, 0, 0, 280);
    const rgba = _drHexToRgba(d.color, 0.22);
    grad.addColorStop(0, rgba);
    grad.addColorStop(1, _drHexToRgba(d.color, 0));
    return {
      label: d.player.name,
      data: d.values,
      borderColor: d.color,
      backgroundColor: datasets.length === 1 ? grad : 'transparent',
      pointBackgroundColor: d.values.map(r => datasets.length === 1 ? _drRankColor(r) : d.color),
      pointBorderColor: 'var(--bg, #0f0f13)',
      pointBorderWidth: 2,
      pointRadius: 7,
      pointHoverRadius: 10,
      borderWidth: 2.5,
      fill: datasets.length === 1,
      tension: 0.35,
      spanGaps: true,
    };
  });

  drChart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: chartDatasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.6,
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
          ticks:  { color: 'var(--muted, #7a7a8e)', font: { size: 11 }, callback: v => `#${v}` },
          title:  { display: true, text: 'Ranking', color: 'var(--muted, #7a7a8e)', font: { size: 11 } }
        },
        x: {
          grid:   { color: 'var(--border, #2e2e3a)' },
          border: { color: 'var(--border, #2e2e3a)' },
          ticks:  { color: 'var(--text, #f0eff6)', font: { size: 12, weight: '700' } }
        }
      }
    }
  });
}

function _drHexToRgba(hex, alpha) {
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return `rgba(245,200,66,${alpha})`;
  const n = parseInt(m[1], 16);
  return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${alpha})`;
}
