// ============================================================
//  STANDINGS — History + Rolling Rankings
// ============================================================
//  1) Standings History (standingsPage): Endplatzierung je Saison fuer
//     alle heutigen Teams, dazu die Podiums-Tabelle. Quelle:
//     SEASON_HISTORY (data/season-history.js, per GitHub Actions
//     "Saison-Standings abrufen" direkt aus ESPN). Bis 2026-09-23 stand
//     hier eine fest eingetippte Tabelle der TTHQ-Liga.
//
//  2) Rolling Rankings (rollingStandingsPage): Tabellenplatz nach jeder
//     Woche, als Verlaufsdiagramm aller Teams plus Tabelle, Aufbau wie
//     die Season Rolling Rankings von Bear Witch Project HQ. Quelle:
//     SEASON_MATCHUPS (data/season-matchups.js, laufende Saison taeglich,
//     Vorjahre ueber denselben Workflow wie die History).
//     Zwei Wertungen: "Kategorien" (jede Kategorie zaehlt als Sieg/
//     Niederlage, ESPN H2H Each Category) und "Matchups" (nur wer die
//     Woche gewinnt, ESPN H2H Most Categories). Voreingestellt ist die,
//     die ESPN fuer die Liga meldet (scoringType). Playoff-Wochen
//     zaehlen nicht mit.
//
//  Styling: css/league.css (.st-*, .rs-*)
// ============================================================

// ── Gemeinsame Helfer ──────────────────────────────────────────
const ST_FALLBACK_COLORS = ['#8a9ba8', '#b0a48a', '#9a8ab0', '#8ab09b', '#b08a8a', '#8aa3b0'];

function _stTeamById(id) {
  return (typeof TEAMS !== 'undefined' ? TEAMS : []).find(t => t.id === id) || null;
}

function _stColor(teamId, fallbackIdx) {
  const t = teamId != null ? _stTeamById(teamId) : null;
  if (t) return getTeamColor(t);
  return ST_FALLBACK_COLORS[(fallbackIdx || 0) % ST_FALLBACK_COLORS.length];
}

function _stCss(name, fallback) {
  const v = getComputedStyle(document.body).getPropertyValue(name).trim();
  return v || fallback;
}

function _stOrdinal(n) { return n == null ? '–' : `${n}.`; }

function _stEmpty(title, text) {
  return `<div class="lg-empty">
    <div class="lg-empty-icon">📈</div>
    <div class="lg-empty-title">${title}</div>
    <div>${text}</div>
  </div>`;
}

// ============================================================
//  1) STANDINGS HISTORY
// ============================================================
let standingsChartInstance = null;

function showStandings() {
  navigate('standingsPage');
  setTimeout(renderStandingsChart, 50);
}

function renderStandingsChart() {
  const host = document.getElementById('standingsHistoryContent');
  if (!host) return;
  const seasons = (typeof SEASON_HISTORY !== 'undefined' ? SEASON_HISTORY : [])
    .slice().sort((a, b) => a.espnSeason - b.espnSeason);

  if (standingsChartInstance) { standingsChartInstance.destroy(); standingsChartInstance = null; }

  if (!seasons.length) {
    host.innerHTML = _stEmpty('Noch keine Funkytown-Historie geladen',
      'In GitHub unter <b>Actions → "Saison-Standings abrufen" → Run workflow</b> starten und alle Felder leer lassen. Der Lauf holt alle Saisons seit 2018 direkt von ESPN, danach erscheint hier der Verlauf.');
    return;
  }

  const maxTeams = Math.max(...seasons.map(s => s.standings.length));
  const anyEstimated = seasons.some(s => s.standings.some(r => r.estimated));

  host.innerHTML = `
    <div class="st-card">
      <div class="st-chart-box"><canvas id="standingsChart"></canvas></div>
    </div>
    <p class="lg-foot">Nur Teams, die es heute noch gibt · Lücke = in dieser Saison nicht dabei${anyEstimated ? ' · * Platzierung geschätzt (ESPN lieferte keine offizielle Endplatzierung)' : ''}</p>
    <div class="st-section-title">🏆 Podium je Saison</div>
    <div class="lg-table-wrap">
      <table class="lg-table">
        <thead><tr><th style="text-align:left;">Saison</th><th>🥇 Champion</th><th>🥈 Zweiter</th><th>🥉 Dritter</th><th>Teams</th></tr></thead>
        <tbody>
          ${seasons.slice().reverse().map(s => {
            const at = p => s.standings.find(r => r.place === p);
            const cell = r => {
              if (!r) return '–';
              const c = _stColor(r.teamId, 0);
              return `<span class="lg-dot" style="background:${c};"></span>${r.name}${r.estimated ? '*' : ''}<span class="st-rec">${r.record || ''}</span>`;
            };
            return `<tr>
              <td style="text-align:left;font-weight:700;">${s.label.replace('Saison ', '')}</td>
              <td>${cell(at(1))}</td><td>${cell(at(2))}</td><td>${cell(at(3))}</td>
              <td>${s.standings.length}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;

  const labels = seasons.map(s => s.label.replace('Saison ', ''));
  const teams = (typeof TEAMS !== 'undefined' ? TEAMS : []);
  const datasets = teams.map(t => {
    const data = seasons.map(s => {
      const r = s.standings.find(x => x.teamId === t.id);
      return r ? r.place : null;
    });
    const played = data.filter(v => v != null);
    if (!played.length) return null;
    const avg = (played.reduce((a, b) => a + b, 0) / played.length).toFixed(1);
    const col = getTeamColor(t);
    return {
      label: `${t.name} (Ø ${avg})`, data,
      borderColor: col, backgroundColor: col,
      borderWidth: 2.5, pointRadius: 5, pointHoverRadius: 7, tension: 0.3, spanGaps: false,
    };
  }).filter(Boolean);

  const canvas = document.getElementById('standingsChart');
  if (!canvas || typeof Chart === 'undefined') return;
  const textColor = _stCss('--muted', '#7b7f9e');
  const gridColor = _stCss('--border', '#2e3250');
  standingsChartInstance = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: _stCss('--text', '#e8eaf6'), padding: 16, font: { family: 'DM Sans', size: 11 }, boxWidth: 12, boxHeight: 12 } },
        tooltip: { callbacks: { label: c => ` ${c.dataset.label.replace(/ \(Ø [\d.]+\)/, '')}: Platz ${c.parsed.y}` } },
      },
      scales: {
        y: { reverse: true, min: 1, max: maxTeams, ticks: { stepSize: 1, color: textColor, callback: v => `${v}.` }, grid: { color: gridColor }, border: { color: gridColor } },
        x: { ticks: { color: textColor, font: { weight: '600' } }, grid: { color: gridColor }, border: { color: gridColor } },
      },
    },
  });
}

// ============================================================
//  2) ROLLING RANKINGS (Tabellenplatz je Woche)
// ============================================================
let rsSeasonKey = null;     // espnSeason der angezeigten Saison
let rsMode = null;          // 'cats' | 'matchups'
let rsChart = null;
let rsHover = null;         // Dataset-Index des hervorgehobenen Teams
let rsPinned = null;        // per Klick fixiertes Team (ESPN-ID)

function _rsSeasons() {
  return (typeof SEASON_MATCHUPS !== 'undefined' ? SEASON_MATCHUPS : [])
    .filter(s => s && s.weeks && Object.keys(s.weeks).some(w => (s.weeks[w] || []).some(e => !e.playoff)))
    .sort((a, b) => b.espnSeason - a.espnSeason);
}

function _rsRegularWeeks(season) {
  return Object.keys(season.weeks).map(Number)
    .filter(w => (season.weeks[w] || []).some(e => !e.playoff))
    .sort((a, b) => a - b);
}

// Tabelle nach Woche uptoWeek (inklusive), nur regulaere Saison.
function _rsStandingsThrough(season, uptoWeek) {
  const tot = {};
  _rsRegularWeeks(season).filter(w => w <= uptoWeek).forEach(w => {
    season.weeks[w].forEach(e => {
      if (e.playoff) return;
      const t = tot[e.team] = tot[e.team] || { team: e.team, cw: 0, cl: 0, ct: 0, mw: 0, ml: 0, mt: 0 };
      t.cw += e.w; t.cl += e.l; t.ct += e.t;
      if (e.res === 'W') t.mw++; else if (e.res === 'L') t.ml++; else t.mt++;
    });
  });
  const pct = (w, l, t) => (w + l + t) ? (w + t / 2) / (w + l + t) : 0;
  const list = Object.values(tot).map(t => ({
    ...t, catPct: pct(t.cw, t.cl, t.ct), mPct: pct(t.mw, t.ml, t.mt),
  }));
  list.sort(rsMode === 'matchups'
    ? (a, b) => (b.mPct - a.mPct) || (b.catPct - a.catPct) || (b.cw - a.cw)
    : (a, b) => (b.catPct - a.catPct) || (b.cw - a.cw) || (b.mPct - a.mPct));
  list.forEach((r, i) => { r.rank = i + 1; });
  return list;
}

function _rsTeamInfo(season, espnId, idx) {
  const info = (season.teams && season.teams[espnId]) || {};
  const teamId = info.teamId != null ? info.teamId : null;
  const today = teamId != null ? _stTeamById(teamId) : null;
  return {
    name: info.name || (today ? today.name : `Team ${espnId}`),
    teamId,
    color: _stColor(teamId, idx),
  };
}

function showRollingStandings() {
  navigate('rollingStandingsPage');
  renderRollingStandings();
}

function rsSetSeason(v) { rsSeasonKey = parseInt(v, 10); rsMode = null; rsPinned = null; renderRollingStandings(); }
function rsSetMode(m) { rsMode = m; renderRollingStandings(); }
function rsPin(espnId) { rsPinned = rsPinned === espnId ? null : espnId; renderRollingStandings(); }

function renderRollingStandings() {
  const host = document.getElementById('rollingStandingsContent');
  if (!host) return;
  const seasons = _rsSeasons();
  if (rsChart) { rsChart.destroy(); rsChart = null; }

  if (!seasons.length) {
    host.innerHTML = _stEmpty('Noch keine Wochenergebnisse',
      'Die laufende Saison 2026/27 füllt sich automatisch, sobald die erste Woche entschieden ist (täglicher ESPN-Sync). Vorjahre holst Du über <b>Actions → "Saison-Standings abrufen" → Run workflow</b>.');
    return;
  }

  const season = seasons.find(s => s.espnSeason === rsSeasonKey) || seasons[0];
  rsSeasonKey = season.espnSeason;
  if (!rsMode) rsMode = season.scoringType === 'H2H_MOST_CATEGORIES' ? 'matchups' : 'cats';

  const weeks = _rsRegularWeeks(season);
  const byWeek = {};
  weeks.forEach(w => { byWeek[w] = _rsStandingsThrough(season, w); });
  const lastW = weeks[weeks.length - 1];
  const prevW = weeks.length > 1 ? weeks[weeks.length - 2] : null;
  const final = byWeek[lastW];
  const n = final.length;
  const teamIds = final.map(r => r.team);
  const info = {};
  teamIds.forEach((id, i) => { info[id] = _rsTeamInfo(season, id, i); });
  const rankAt = (w, id) => (byWeek[w].find(r => r.team === id) || {}).rank ?? null;

  const modeNote = season.scoringType === 'H2H_MOST_CATEGORIES' ? 'Matchups' : season.scoringType === 'H2H_CATEGORY' ? 'Kategorien' : null;

  host.innerHTML = `
    <div class="rs-toolbar">
      <label class="rs-field">Saison
        <select onchange="rsSetSeason(this.value)">
          ${seasons.map(s => `<option value="${s.espnSeason}" ${s.espnSeason === season.espnSeason ? 'selected' : ''}>${s.label}${s.current ? ' (laufend)' : ''}</option>`).join('')}
        </select>
      </label>
      <div class="rs-seg" role="group" aria-label="Wertung">
        <button class="${rsMode === 'cats' ? 'active' : ''}" onclick="rsSetMode('cats')">Kategorien</button>
        <button class="${rsMode === 'matchups' ? 'active' : ''}" onclick="rsSetMode('matchups')">Matchups</button>
      </div>
      <div class="rs-note">${weeks.length} Woche${weeks.length === 1 ? '' : 'n'} · reguläre Saison${modeNote ? ` · Liga wertet nach ${modeNote}` : ''}</div>
    </div>
    <div class="st-card">
      <div class="rs-chart-box" id="rsChartBox"><canvas id="rsCanvas"></canvas></div>
      <div class="rs-hint">Hover hebt ein Team hervor · Klick auf Linie oder Tabellenzeile fixiert es</div>
    </div>
    <div class="lg-table-wrap">
      <table class="lg-table rs-table">
        <thead><tr>
          <th>#</th><th style="text-align:left;">Team</th>
          <th title="Veränderung zur Vorwoche">±</th>
          <th>Kategorien</th><th>Matchups</th>
          <th class="rs-weeks-col">Platz je Woche</th>
        </tr></thead>
        <tbody>
          ${final.map(r => {
            const inf = info[r.team];
            const prev = prevW ? rankAt(prevW, r.team) : null;
            const diff = prev != null ? prev - r.rank : 0;
            const trend = diff > 0 ? `<span class="rs-up">▲${diff}</span>` : diff < 0 ? `<span class="rs-down">▼${-diff}</span>` : '<span class="rs-flat">–</span>';
            const pills = weeks.map(w => {
              const rk = rankAt(w, r.team);
              return `<span class="rs-pill" style="background:${_rsRankBg(rk, n)};" title="Woche ${w}: Platz ${rk ?? '–'}">${rk ?? '–'}</span>`;
            }).join('');
            return `<tr class="${rsPinned === r.team ? 'rs-pinned' : ''}" onclick="rsPin(${r.team})">
              <td class="rs-rank">${r.rank}</td>
              <td style="text-align:left;"><div class="lg-team"><span class="lg-dot" style="background:${inf.color};"></span><div class="lg-team-name">${inf.name}</div></div></td>
              <td>${trend}</td>
              <td class="rs-num">${r.cw}-${r.cl}-${r.ct}</td>
              <td class="rs-num">${r.mw}-${r.ml}-${r.mt}</td>
              <td class="rs-weeks-col"><div class="rs-pills">${pills}</div></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;

  _rsDrawChart(weeks, byWeek, teamIds, info, n);
}

function _rsRankBg(rank, n) {
  if (rank == null) return 'var(--surface2)';
  const q = (rank - 1) / Math.max(1, n - 1);
  if (q <= 0.25) return 'rgba(76,175,129,0.28)';
  if (q <= 0.5) return 'rgba(77,123,176,0.26)';
  if (q <= 0.75) return 'rgba(224,165,58,0.26)';
  return 'rgba(217,105,95,0.28)';
}

function _rsHexToRgba(hex, a) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || '');
  if (!m) return hex;
  return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a})`;
}

function _rsDrawChart(weeks, byWeek, teamIds, info, n) {
  const canvas = document.getElementById('rsCanvas');
  const box = document.getElementById('rsChartBox');
  if (!canvas || !box || typeof Chart === 'undefined') return;
  const narrow = box.clientWidth < 640;
  const text = _stCss('--text', '#e8eaf6');
  const muted = _stCss('--muted', '#7b7f9e');
  const border = _stCss('--border', '#2e3250');
  const surface = _stCss('--surface', '#1a1d27');
  const firstW = weeks[0], lastW = weeks[weeks.length - 1];
  const rankAt = (w, id) => (byWeek[w].find(r => r.team === id) || {}).rank ?? null;
  const cellAt = (w, id) => byWeek[w].find(r => r.team === id) || null;
  const short = s => (narrow && s.length > 10 ? s.slice(0, 9) + '…' : s);
  const teamAt = (w, rank) => teamIds.find(id => rankAt(w, id) === rank);

  const datasets = teamIds.map(id => {
    const col = info[id].color;
    return {
      label: info[id].name, espnId: id, baseColor: col,
      data: weeks.map(w => rankAt(w, id)),
      borderColor: col, backgroundColor: col,
      pointBackgroundColor: col, pointBorderColor: surface, pointBorderWidth: 2,
      pointRadius: weeks.length > 16 ? 3 : 5, pointHoverRadius: 7, borderWidth: 3,
      tension: 0.4, cubicInterpolationMode: 'monotone', spanGaps: true, clip: false,
    };
  });

  const applyHighlight = chart => {
    const focus = rsHover !== null ? rsHover : (rsPinned !== null ? chart.data.datasets.findIndex(d => d.espnId === rsPinned) : null);
    chart.data.datasets.forEach((d, i) => {
      const dim = focus !== null && focus > -1 && i !== focus;
      const c = dim ? _rsHexToRgba(d.baseColor, 0.15) : d.baseColor;
      d.borderColor = c; d.pointBackgroundColor = c;
      d.borderWidth = i === focus ? 4.5 : 3;
      d.order = i === focus ? -1 : 0;
    });
    chart.update('none');
  };

  const rankAxis = (position, week) => ({
    position, reverse: true, min: 1, max: n, offset: false,
    grid: { color: position === 'left' ? border : 'transparent', drawTicks: false },
    border: { display: false },
    ticks: {
      stepSize: 1, autoSkip: false, padding: 8, color: text,
      font: { size: narrow ? 10 : 12, weight: '700' },
      callback: v => {
        const id = teamAt(week, v);
        if (narrow) return `${v}.`; // Handy: Namen stehen in der Tabelle darunter
        return id != null ? `${v}. ${short(info[id].name)}` : `${v}.`;
      },
    },
  });

  rsHover = null;
  rsChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: { labels: weeks.map(w => (narrow ? 'W' : 'Woche ') + w), datasets },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 400 },
      layout: { padding: { top: 10, bottom: 4, left: 4, right: narrow ? 20 : 12 } },
      interaction: { mode: 'nearest', intersect: false, axis: 'xy' },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: c => {
              const cell = cellAt(weeks[c.dataIndex], c.dataset.espnId);
              if (!cell) return `${c.dataset.label}: –`;
              return `${c.dataset.label}: Platz ${cell.rank} · Kat ${cell.cw}-${cell.cl}-${cell.ct} · Matchups ${cell.mw}-${cell.ml}-${cell.mt}`;
            },
          },
        },
      },
      onHover: (evt, els, chart) => {
        const idx = els.length ? els[0].datasetIndex : null;
        if (idx !== rsHover) { rsHover = idx; applyHighlight(chart); }
        if (evt.native) evt.native.target.style.cursor = idx !== null ? 'pointer' : 'default';
      },
      onClick: (evt, els, chart) => {
        if (!els.length) return;
        rsPin(chart.data.datasets[els[0].datasetIndex].espnId);
      },
      scales: {
        x: { offset: false, grid: { color: border }, border: { color: border }, ticks: { color: muted, font: { size: 11, weight: '700' } } },
        y: rankAxis('left', firstW),
        y2: rankAxis('right', lastW),
      },
    },
  });
  applyHighlight(rsChart);
  canvas.addEventListener('mouseleave', () => { if (rsHover !== null) { rsHover = null; applyHighlight(rsChart); } });
}
