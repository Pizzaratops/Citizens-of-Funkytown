// ============================================================
//  LIVE SCORES — UI logic (Daily / Weekly / Monthly)
// ============================================================
//  Daily liest LIVESCORES_DAILY[league][date] (data/livescores-daily.js).
//  Weekly/Monthly lesen LIVESCORES_AGGREGATE[period][league][endDate]
//  (data/livescores-aggregate.js), erzeugt von
//  scripts/update-all-aggregates.js über die "Daily 9cat Live
//  Scores" GitHub Action.
// ============================================================

const LS_COLUMNS_DAILY = [
  { key: 'rank',      label: '#',      align: 'center' },
  { key: 'name',      label: 'Name',   align: 'left' },
  { key: 'team',      label: 'Team',   align: 'left' },
  { key: 'min',       label: 'MIN' },
  { key: 'pts',       label: 'PTS' },
  { key: 'reb',       label: 'REB' },
  { key: 'ast',       label: 'AST' },
  { key: 'stl',       label: 'STL' },
  { key: 'blk',       label: 'BLK' },
  { key: 'to',        label: 'TO' },
  { key: 'tpm',       label: '3PM' },
  { key: 'fgPct',     label: 'FG%' },
  { key: 'ftPct',     label: 'FT%' },
  { key: 'composite', label: 'Z-Score' },
];

// Wie LS_COLUMNS_DAILY, aber mit "GP" (Spiele im Fenster) nach Team —
// bei Weekly/Monthly sind MIN/PTS/etc. Pro-Spiel-Schnitte, keine Rohwerte.
const LS_COLUMNS_AGGREGATE = [
  { key: 'rank',      label: '#',      align: 'center' },
  { key: 'name',      label: 'Name',   align: 'left' },
  { key: 'team',      label: 'Team',   align: 'left' },
  { key: 'games',     label: 'GP' },
  { key: 'min',       label: 'MIN' },
  { key: 'pts',       label: 'PTS' },
  { key: 'reb',       label: 'REB' },
  { key: 'ast',       label: 'AST' },
  { key: 'stl',       label: 'STL' },
  { key: 'blk',       label: 'BLK' },
  { key: 'to',        label: 'TO' },
  { key: 'tpm',       label: '3PM' },
  { key: 'fgPct',     label: 'FG%' },
  { key: 'ftPct',     label: 'FT%' },
  { key: 'composite', label: 'Z-Score' },
];

const LS_PERIOD_LABEL = { week: 'Woche', month: 'Monat' };

// ESPN benutzt in den Boxscore-Feeds eigene Kurz-Codes, die teils von den
// "Standard"-3-Buchstaben-Codes abweichen, die anderswo auf der Seite
// verwendet werden (z.B. NBA_TEAM_NAMES in js/nba-teams.js) — GS statt GSW,
// NO statt NOR, NY statt NYK, PHX statt PHO, SA statt SAS, UTAH statt UTA,
// WSH statt WAS. Diese Map ist deshalb bewusst getrennt und deckt exakt die
// Codes ab, die in data/livescores-*.js tatsächlich vorkommen.
const LS_TEAM_NAMES = {
  ATL: 'Atlanta', BOS: 'Boston', BKN: 'Brooklyn', CHA: 'Charlotte',
  CHI: 'Chicago', CLE: 'Cleveland', DAL: 'Dallas', DEN: 'Denver',
  DET: 'Detroit', GS: 'Golden State', HOU: 'Houston', IND: 'Indiana',
  LAC: 'LA Clippers', LAL: 'LA Lakers', MEM: 'Memphis', MIA: 'Miami',
  MIL: 'Milwaukee', MIN: 'Minnesota', NO: 'New Orleans', NY: 'New York',
  OKC: 'Oklahoma City', ORL: 'Orlando', PHI: 'Philadelphia', PHX: 'Phoenix',
  POR: 'Portland', SA: 'San Antonio', SAC: 'Sacramento', TOR: 'Toronto',
  UTAH: 'Utah', WSH: 'Washington', FA: 'Free Agent',
};
function _lsTeamFullName(abbr) {
  return LS_TEAM_NAMES[abbr] || abbr;
}

// Manche Spieler stehen im echten NBA-Team X, sind bei ESPN aber einem TT-
// Fantasy-Team zugeordnet (Keeper, Draft etc.) — z.B. Javon Small spielt
// für Memphis, ist aber bei den Seagulls gerostert. Zweite Zeile in der
// Team-Zelle soll deshalb bevorzugt den Fantasy-Owner zeigen, nicht die
// echte NBA-Stadt. ROSTERS/TEAMS kommen aus data/teams-rosters.js (inkl.
// ESPN-Sync-Überschreibungen) und sind global verfügbar, da vor
// livescores.js geladen.
function _lsFantasyOwner(playerName) {
  if (typeof ROSTERS === 'undefined' || typeof TEAMS === 'undefined') return null;
  const norm = (n) => (n || '').toLowerCase().trim();
  const target = norm(playerName);
  if (!target) return null;
  for (const tid of Object.keys(ROSTERS)) {
    const roster = ROSTERS[tid] || [];
    if (roster.some(p => norm(p.name) === target)) {
      const team = TEAMS.find(t => t.id === parseInt(tid, 10));
      return team ? { id: team.id, name: team.name } : null;
    }
  }
  return null;
}

// Reihenfolge/Labels für die Punt-Gewichtung — Keys müssen zu den Keys in
// player.zScores passen (siehe scripts/lib/aggregate-core.js CATEGORIES).
// Range 0..2 in 0.25-Schritten (0 - 0,25 - 0,5 - ... - 2), Default 1 (=
// normale Gewichtung, ergibt exakt die ursprüngliche unweighted Composite-
// Summe). Nichts wird gespeichert — lsWeights lebt nur im Speicher dieser
// Session.
const LS_WEIGHT_CATS = [
  { key: 'pts',       label: 'PTS' },
  { key: 'reb',       label: 'REB' },
  { key: 'ast',       label: 'AST' },
  { key: 'stl',       label: 'STL' },
  { key: 'blk',       label: 'BLK' },
  { key: 'to',        label: 'TO' },
  { key: 'tpm',       label: '3PM' },
  { key: 'fgImpact',  label: 'FG%' },
  { key: 'ftImpact',  label: 'FT%' },
];

function _lsDefaultWeights() {
  const w = {};
  LS_WEIGHT_CATS.forEach(c => { w[c.key] = 1; });
  return w;
}

let lsWeights = _lsDefaultWeights();
let lsPuntGridBuilt = false;

let lsCurrentPeriod = 'daily';  // "daily" | "week" | "month"
let lsCurrentLeague = 'nba-summer-las-vegas';
let lsCurrentDate   = null;     // "YYYY-MM-DD" — Tag (daily) oder Fenster-Stichtag (week/month)
let lsSortCol = 'composite';
let lsSortAsc = false;
let lsRows = [];
// Min.-Spiele-Filter für Weekly/Monthly, rein client-seitig (die Daten
// selbst enthalten seit dem Off-Season-Fix immer schon alle Spieler ab
// 1 Spiel — der Slider blendet nur aus, zeigt aber ohne neuen Datenabruf).
let lsMinGamesFilter = 1;

function _lsWeightedComposite(p) {
  if (!p.zScores) return p.composite;
  let sum = 0;
  for (const c of LS_WEIGHT_CATS) sum += (p.zScores[c.key] || 0) * (lsWeights[c.key] ?? 1);
  return Math.round(sum * 100) / 100;
}

// ------------------------------------------------------------
// Punt-Gewichtungs-Panel — aufklappbar, Standard: eingeklappt
// ------------------------------------------------------------
function _lsEnsurePuntGrid() {
  if (lsPuntGridBuilt) return;
  _lsRenderPuntGrid();
  lsPuntGridBuilt = true;
}

function lsTogglePuntPanel() {
  document.getElementById('lsPuntPanel')?.classList.toggle('collapsed');
}

function _lsRenderPuntGrid() {
  const grid = document.getElementById('lsPuntGrid');
  if (!grid) return;
  grid.innerHTML = LS_WEIGHT_CATS.map(c => {
    const v = lsWeights[c.key];
    return `<div class="ls-punt-item ${v === 0 ? 'is-punted' : ''}" id="lsPuntItem-${c.key}">
      <div class="ls-punt-item-label"><span>${c.label}</span><span class="ls-punt-item-value" id="lsPuntValue-${c.key}">${v.toFixed(2)}</span></div>
      <input type="range" min="0" max="2" step="0.25" value="${v}" oninput="lsSetPuntWeight('${c.key}', this.value)"/>
    </div>`;
  }).join('');
}

function lsSetPuntWeight(key, value) {
  const v = parseFloat(value);
  lsWeights[key] = v;
  const valueEl = document.getElementById(`lsPuntValue-${key}`);
  if (valueEl) valueEl.textContent = v.toFixed(2);
  document.getElementById(`lsPuntItem-${key}`)?.classList.toggle('is-punted', v === 0);
  _lsRender();
}

function lsResetPuntWeights() {
  lsWeights = _lsDefaultWeights();
  LS_WEIGHT_CATS.forEach(c => {
    const input = document.querySelector(`#lsPuntItem-${c.key} input[type="range"]`);
    if (input) input.value = 1;
    const valueEl = document.getElementById(`lsPuntValue-${c.key}`);
    if (valueEl) valueEl.textContent = '1.00';
    document.getElementById(`lsPuntItem-${c.key}`)?.classList.remove('is-punted');
  });
  _lsRender();
}

function _lsToDateObj(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
function _lsToDateStr(d) {
  return d.toISOString().slice(0, 10);
}
function _lsFormatDateLabel(dateStr) {
  const d = _lsToDateObj(dateStr);
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
}
function _lsFormatDateShort(dateStr) {
  const d = _lsToDateObj(dateStr);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
}

// ------------------------------------------------------------
// Datenzugriff — je nach Periode aus einer anderen globalen Quelle
// ------------------------------------------------------------
function _lsAvailableDates(period, league) {
  if (period === 'daily') {
    const data = (typeof LIVESCORES_DAILY !== 'undefined' ? LIVESCORES_DAILY[league] : null) || {};
    return Object.keys(data).sort();
  }
  const data = (typeof LIVESCORES_AGGREGATE !== 'undefined' ? (LIVESCORES_AGGREGATE[period] || {})[league] : null) || {};
  return Object.keys(data).sort();
}

function _lsEntry(period, league, dateStr) {
  if (period === 'daily') {
    const data = (typeof LIVESCORES_DAILY !== 'undefined' ? LIVESCORES_DAILY[league] : null) || {};
    return data[dateStr];
  }
  const data = (typeof LIVESCORES_AGGREGATE !== 'undefined' ? (LIVESCORES_AGGREGATE[period] || {})[league] : null) || {};
  return data[dateStr];
}

// ------------------------------------------------------------
// Navigation
// ------------------------------------------------------------
function lsInit() {
  _lsEnsurePuntGrid();

  const select = document.getElementById('lsLeagueSelect');
  if (select) select.value = lsCurrentLeague;

  const dates = _lsAvailableDates(lsCurrentPeriod, lsCurrentLeague);
  const startDate = lsCurrentDate && dates.includes(lsCurrentDate)
    ? lsCurrentDate
    : (dates.length ? dates[dates.length - 1] : _lsToDateStr(new Date()));

  lsLoadDate(startDate);
}

function lsSwitchPeriod(period) {
  if (period === lsCurrentPeriod) return;
  lsCurrentPeriod = period;

  document.querySelectorAll('.ls-subtab').forEach(el => el.classList.remove('active'));
  const idByPeriod = { daily: 'lsSubtabDaily', week: 'lsSubtabWeekly', month: 'lsSubtabMonthly' };
  document.getElementById(idByPeriod[period])?.classList.add('active');

  // Beim Wechsel auf den zuletzt verfügbaren Stichtag für die neue Periode springen —
  // ein Datum, das bei Daily existiert, muss bei Weekly/Monthly nicht existieren.
  const dates = _lsAvailableDates(lsCurrentPeriod, lsCurrentLeague);
  const nextDate = dates.length ? dates[dates.length - 1] : lsCurrentDate;
  lsLoadDate(nextDate);
}

function lsLoadDate(dateStr) {
  if (!dateStr) return;
  lsCurrentLeague = document.getElementById('lsLeagueSelect')?.value || lsCurrentLeague;
  lsCurrentDate = dateStr;

  const dateInput = document.getElementById('lsDateInput');
  if (dateInput) dateInput.value = dateStr;

  _lsRender();
}

function lsShiftDate(delta) {
  if (!lsCurrentDate) return;
  const d = _lsToDateObj(lsCurrentDate);
  d.setUTCDate(d.getUTCDate() + delta);
  lsLoadDate(_lsToDateStr(d));
}

// ------------------------------------------------------------
// Rendering
// ------------------------------------------------------------
function _lsRender() {
  const meta = document.getElementById('lsMeta');
  const gamesLine = document.getElementById('lsGamesLine');
  const content = document.getElementById('lsContent');
  if (!content) return;

  const entry = _lsEntry(lsCurrentPeriod, lsCurrentLeague, lsCurrentDate);

  if (lsCurrentPeriod === 'daily') {
    if (meta) meta.textContent = _lsFormatDateLabel(lsCurrentDate);
  } else {
    const label = LS_PERIOD_LABEL[lsCurrentPeriod];
    if (meta) meta.textContent = `${label} bis ${_lsFormatDateShort(lsCurrentDate)}`;
  }

  if (!entry || !entry.players || !entry.players.length) {
    if (gamesLine) {
      gamesLine.textContent = lsCurrentPeriod === 'daily'
        ? ''
        : `Kein ${LS_PERIOD_LABEL[lsCurrentPeriod]}-Ranking für diesen Stichtag verfügbar.`;
    }
    const minGamesPanelEmpty = document.getElementById('lsMinGamesPanel');
    if (minGamesPanelEmpty) minGamesPanelEmpty.style.display = 'none';
    content.innerHTML = `<div class="ls-status">Keine Daten für diesen Zeitraum. Entweder wurden keine Spiele ausgetragen, oder die Automatisierung hat das noch nicht erfasst.</div>`;
    return;
  }

  if (gamesLine) {
    if (lsCurrentPeriod === 'daily') {
      const avg = entry.leagueAvg
        ? ` · Liga-Ø FG% ${entry.leagueAvg.fg.toFixed(1)}% · FT% ${entry.leagueAvg.ft.toFixed(1)}%`
        : '';
      gamesLine.innerHTML = (entry.games || []).join(' &nbsp;·&nbsp; ') + avg;
    } else {
      const avg = entry.leagueAvg
        ? ` · Liga-Ø FG% ${entry.leagueAvg.fg.toFixed(1)}% · FT% ${entry.leagueAvg.ft.toFixed(1)}%`
        : '';
      gamesLine.innerHTML = `Fenster ${_lsFormatDateShort(entry.windowStart)} – ${_lsFormatDateShort(entry.windowEnd)}`
        + ` &nbsp;·&nbsp; ${entry.daysInWindow} Tag${entry.daysInWindow === 1 ? '' : 'e'} mit Daten`
        + ` &nbsp;·&nbsp; angezeigt: min. ${lsMinGamesFilter} Spiel${lsMinGamesFilter === 1 ? '' : 'e'} (Regler unten)`
        + avg;
    }
  }

  const minGamesPanel = document.getElementById('lsMinGamesPanel');
  if (minGamesPanel) minGamesPanel.style.display = lsCurrentPeriod === 'daily' ? 'none' : 'flex';

  const source = lsCurrentPeriod === 'daily'
    ? entry.players
    : entry.players.filter(p => p.games >= lsMinGamesFilter);
  lsRows = source.map(p => ({ ...p, composite: _lsWeightedComposite(p) }));
  _lsSort(lsSortCol, true);
  _lsRenderTable();
}

function lsSetMinGames(val) {
  lsMinGamesFilter = parseInt(val, 10);
  const label = document.getElementById('lsMinGamesValue');
  if (label) label.textContent = lsMinGamesFilter;
  _lsRender();
}

function _lsSort(col, keepDirection) {
  if (!keepDirection) {
    if (lsSortCol === col) lsSortAsc = !lsSortAsc;
    else { lsSortCol = col; lsSortAsc = (col === 'rank' || col === 'name' || col === 'team'); }
  }
  lsRows.sort((a, b) => {
    const av = a[lsSortCol], bv = b[lsSortCol];
    const c = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
    return lsSortAsc ? c : -c;
  });
}

function lsSortBy(col) {
  _lsSort(col, false);
  _lsRenderTable();
}

function _lsCsvEscape(val) {
  const s = String(val);
  return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

// Exportiert genau das, was gerade auf dem Bildschirm steht (aktuelle
// Sortierung + Min.-Spiele-Filter), nicht die ungefilterten Rohdaten —
// so stimmt die Datei immer mit dem überein, was Beyaz gerade sieht.
function lsExportCsv() {
  if (lsCurrentPeriod === 'daily' || !lsRows.length) return;

  const isDaily = false;
  const columns = LS_COLUMNS_AGGREGATE;
  const fmtCount = (n) => n.toFixed(1);

  const header = columns.map(c => c.label).join(';');
  const lines = lsRows.map((p, i) => {
    const vals = columns.map(c => {
      if (c.key === 'rank') return i + 1;
      if (c.key === 'name') return p.name;
      if (c.key === 'team') return p.team;
      if (c.key === 'games') return p.games;
      if (c.key === 'fgPct' || c.key === 'ftPct') return p[c.key].toFixed(1) + '%';
      if (c.key === 'composite') return p.composite.toFixed(2);
      return fmtCount(p[c.key]);
    });
    return vals.map(_lsCsvEscape).join(';');
  });

  const csv = '\uFEFF' + [header, ...lines].join('\n'); // BOM, damit Excel Umlaute korrekt zeigt
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const periodLabel = LS_PERIOD_LABEL[lsCurrentPeriod] || lsCurrentPeriod;
  const dateLabel = lsCurrentDate || 'aktuell';
  a.href = url;
  a.download = `livescores_${periodLabel}_${lsCurrentLeague}_${dateLabel}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function _lsRenderTable() {
  const content = document.getElementById('lsContent');
  if (!content) return;

  const isDaily = lsCurrentPeriod === 'daily';
  const columns = isDaily ? LS_COLUMNS_DAILY : LS_COLUMNS_AGGREGATE;

  const thead = columns.map(c =>
    `<th class="${c.key === lsSortCol ? 'r-sorted' : ''}" onclick="lsSortBy('${c.key}')">${c.label}<span class="r-sort-arrow">↕</span></th>`
  ).join('');

  // Bei Daily sind min/pts/reb/... Rohwerte eines einzelnen Tages (Integers).
  // Bei Weekly/Monthly sind es Pro-Spiel-Schnitte über mehrere Tage (1 Dezimalstelle).
  const fmtCount = (n) => isDaily ? n : n.toFixed(1);

  const rows = lsRows.map((p, i) => {
    const compClass = p.composite >= 0 ? 'pos' : 'neg';
    const compLabel = (p.composite >= 0 ? '+' : '') + p.composite.toFixed(2);
    const gpCell = isDaily ? '' : `<td>${p.games}</td>`;
    const owner = _lsFantasyOwner(p.name);
    const secondLine = owner
      ? `<span class="ls-team-full ls-fantasy-owner" onclick="event.stopPropagation();if(typeof showTeam==='function')showTeam(${owner.id})" title="Go to ${owner.name}">${owner.name}</span>`
      : `<span class="ls-team-full">${_lsTeamFullName(p.team)}</span>`;
    const teamCell = `<td><div class="ls-team-cell"><span class="ls-team-abbr">${p.team}</span>${secondLine}</div></td>`;
    return `<tr>
      <td>${i + 1}</td>
      <td>${p.name}</td>
      ${teamCell}
      ${gpCell}
      <td>${fmtCount(p.min)}</td>
      <td>${fmtCount(p.pts)}</td>
      <td>${fmtCount(p.reb)}</td>
      <td>${fmtCount(p.ast)}</td>
      <td>${fmtCount(p.stl)}</td>
      <td>${fmtCount(p.blk)}</td>
      <td>${fmtCount(p.to)}</td>
      <td>${fmtCount(p.tpm)}</td>
      <td>${p.fgPct.toFixed(1)}%</td>
      <td>${p.ftPct.toFixed(1)}%</td>
      <td><span class="ls-composite ${compClass}">${compLabel}</span></td>
    </tr>`;
  }).join('');

  content.innerHTML = `
    <div class="ls-table-wrap">
      <table class="ls-table">
        <thead><tr>${thead}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}
