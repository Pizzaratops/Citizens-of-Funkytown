// ============================================================
//  PLAYER — Rankings (Off Season / Reg Season) & Projections
// ============================================================
//  Rankings liest zwei automatisch generierte Quellen, komplett ohne
//  eigene Berechnung im Frontend (ungewichtete Z-Score-Composite, exakt
//  wie die Monthly-Ansicht bei Live Scores):
//
//  - Reg Season: der jeweils neueste Monthly-Eintrag aus
//    LIVESCORES_AGGREGATE.month.nba (data/livescores-aggregate.js) —
//    rollierendes 30-Tage-Fenster, täglich fortgeschrieben.
//  - Off Season: OFFSEASON_RANKINGS (data/offseason-rankings.js) —
//    kumulativ über die gesamte Off-Season (Summer League Cali/Utah/
//    Vegas + Pre-Season) bisher, gebaut von
//    scripts/build-offseason-rankings.js.
//
//  Der Gesamtwert (Spalte ganz rechts) folgt dem Score-Modus aus
//  js/score-mode.js (Z roh / Z ±3 / Perzentil) und wird dafuer im Browser
//  aus den mitgelieferten Kategorie-Z-Scores neu gebildet.
// ============================================================

let prCurrentTab = 'regseason'; // 'offseason' | 'regseason'
let prSortCol = 'composite';
let prSortAsc = false;
let prRows = [];
let prSearch = '';

function _prTeamFullName(abbr) {
  return (typeof _lsTeamFullName === 'function') ? _lsTeamFullName(abbr) : abbr;
}
function _prFantasyOwner(name) {
  return (typeof _lsFantasyOwner === 'function') ? _lsFantasyOwner(name) : null;
}

function _prLatestRegSeasonEntry() {
  if (typeof LIVESCORES_AGGREGATE === 'undefined' || !LIVESCORES_AGGREGATE.month || !LIVESCORES_AGGREGATE.month.nba) {
    return null;
  }
  const dates = Object.keys(LIVESCORES_AGGREGATE.month.nba).sort();
  if (!dates.length) return null;
  const latest = dates[dates.length - 1];
  const entry = LIVESCORES_AGGREGATE.month.nba[latest];
  if (!entry || !entry.players || !entry.players.length) return null;
  return { ...entry, _stichtag: latest };
}

function _prOffSeasonEntry() {
  if (typeof OFFSEASON_RANKINGS === 'undefined' || !OFFSEASON_RANKINGS.players || !OFFSEASON_RANKINGS.players.length) {
    return null;
  }
  return OFFSEASON_RANKINGS;
}

const PR_LEAGUE_LABELS = {
  'nba-summer-california': 'Cali',
  'nba-summer-utah': 'Utah',
  'nba-summer-las-vegas': 'Vegas',
  'nba-preseason': 'Preseason',
};

function showPlayerRankings() {
  navigate('playerRankingsPage');
  prInit();
}

// ── Script-Loader ──────────────────────────────────────────────
// Laedt grosse Datendateien erst bei Bedarf (z.B. data/projections-
// consensus.js fuer 2026/27 Projections, die Saison-Stats fuer Cat Web).
// Viele davon deklarieren "const" auf Top-Level -- ein zweites Laden
// wuerfe "Identifier bereits deklariert". Deshalb global tracken, was
// schon laeuft oder fertig ist, und beim zweiten Aufruf ueberspringen.
// (Die "Live Projections (Test)"-Seiten, fuer die das urspruenglich
// gebaut wurde, sind seit 2026-09-23 entfernt.)
const _loadedProjScripts = new Set(); // fertig geladen
const _loadingProjScripts = new Map(); // src -> Promise, waehrend des Ladens

function _loadScriptOnce(src) {
  if (_loadedProjScripts.has(src)) return Promise.resolve();
  if (_loadingProjScripts.has(src)) return _loadingProjScripts.get(src);
  const p = new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = src;
    // onerror statt Abbruch: eine fehlende optionale Datei soll die
    // Seite nicht blockieren.
    s.onload = () => { _loadedProjScripts.add(src); resolve(); };
    s.onerror = () => { _loadedProjScripts.add(src); resolve(); };
    document.body.appendChild(s);
  });
  _loadingProjScripts.set(src, p);
  return p;
}

function _loadScriptsSequentially(srcs, i, onDone) {
  if (i >= srcs.length) { onDone(); return; }
  _loadScriptOnce(srcs[i]).then(() => _loadScriptsSequentially(srcs, i + 1, onDone));
}

function prInit() {
  document.getElementById('prSubtabOffSeason').classList.toggle('active', prCurrentTab === 'offseason');
  document.getElementById('prSubtabRegSeason').classList.toggle('active', prCurrentTab === 'regseason');
  prLoadTab();
}

function prSwitchTab(tab) {
  prCurrentTab = tab;
  document.getElementById('prSubtabOffSeason').classList.toggle('active', tab === 'offseason');
  document.getElementById('prSubtabRegSeason').classList.toggle('active', tab === 'regseason');
  prLoadTab();
}

function prLoadTab() {
  const meta = document.getElementById('prMeta');
  const content = document.getElementById('prContent');
  const entry = prCurrentTab === 'offseason' ? _prOffSeasonEntry() : _prLatestRegSeasonEntry();

  if (!entry) {
    if (meta) meta.textContent = '';
    const msg = prCurrentTab === 'offseason'
      ? 'Noch keine Off-Season-Daten (Summer League/Pre-Season) verfügbar.'
      : 'Noch keine Reg-Season-Daten verfügbar — kommt automatisch, sobald die Saison läuft.';
    content.innerHTML = `<div class="ls-status">${msg}</div>`;
    return;
  }

  if (meta) {
    if (prCurrentTab === 'offseason') {
      const leagueLabels = (entry.leagues || []).map(l => PR_LEAGUE_LABELS[l] || l).join(', ');
      meta.innerHTML = `${_prFormatDateShort(entry.windowStart)} – ${_prFormatDateShort(entry.windowEnd)}`
        + ` &nbsp;·&nbsp; ${leagueLabels}`
        + ` &nbsp;·&nbsp; min. ${entry.minGames} Spiele`
        + ` &nbsp;·&nbsp; Liga-Ø FG% ${entry.leagueAvg.fg.toFixed(1)}% · FT% ${entry.leagueAvg.ft.toFixed(1)}%`;
    } else {
      meta.innerHTML = `Rollierender Monat bis ${_prFormatDateShort(entry._stichtag)}`
        + ` &nbsp;·&nbsp; ${entry.daysInWindow} Tag${entry.daysInWindow === 1 ? '' : 'e'} mit Daten`
        + ` &nbsp;·&nbsp; min. ${entry.minGames} Spiele`
        + ` &nbsp;·&nbsp; Liga-Ø FG% ${entry.leagueAvg.fg.toFixed(1)}% · FT% ${entry.leagueAvg.ft.toFixed(1)}%`;
    }
  }

  prRows = _prApplyScoreMode(entry.players);
  _prSort(prSortCol, true);
  _prRenderTable();
}

// Gesamtwert je nach Score-Modus (js/score-mode.js) neu aus den mitgelieferten
// Kategorie-Z-Scores bilden. Pool fuer Perzentile = alle Spieler des
// Eintrags. Ohne zScores (sehr alte Daten) bleibt der Rohwert stehen.
const PR_Z_KEYS = ['pts', 'reb', 'ast', 'stl', 'blk', 'tpm', 'fgImpact', 'ftImpact', 'to'];
function _prApplyScoreMode(players) {
  const rows = players.map(p => ({ ...p, zRaw: p.composite }));
  if (typeof scoreFromCatZ !== 'function' || !rows.every(r => r.zScores)) return rows;
  // TO steckt in zScores bereits invertiert (hoeher = besser).
  const res = scoreFromCatZ(rows.map(r => r.zScores), PR_Z_KEYS);
  rows.forEach((r, i) => { r.composite = res[i].score; r.scoreCats = res[i].cats; });
  return rows;
}

if (typeof onScoreModeChange === 'function') {
  onScoreModeChange(() => {
    const page = document.getElementById('playerRankingsPage');
    if (page && page.classList.contains('active')) prLoadTab();
  });
}

function _prFormatDateShort(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}.${m}.${y}`;
}

function _prSort(col, keepDirection) {
  if (!keepDirection) {
    if (prSortCol === col) prSortAsc = !prSortAsc;
    else { prSortCol = col; prSortAsc = (col === 'rank' || col === 'name' || col === 'team'); }
  }
  prRows.sort((a, b) => {
    const av = a[prSortCol], bv = b[prSortCol];
    const c = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
    return prSortAsc ? c : -c;
  });
}

function prSortBy(col) {
  _prSort(col, false);
  _prRenderTable();
}

function prFilter() {
  prSearch = (document.getElementById('prSearch').value || '').toLowerCase().trim();
  _prRenderTable();
}

const PR_COLUMNS = [
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

function _prRenderTable() {
  const content = document.getElementById('prContent');
  if (!content) return;

  const rows = prSearch
    ? prRows.filter(p => p.name.toLowerCase().includes(prSearch) || p.team.toLowerCase().includes(prSearch))
    : prRows;

  if (!rows.length) {
    content.innerHTML = `<div class="ls-status">Keine Spieler gefunden.</div>`;
    return;
  }

  const colLabel = c => (c.key === 'composite' && typeof scoreColumnLabel === 'function') ? scoreColumnLabel() : c.label;
  const thead = PR_COLUMNS.map(c =>
    `<th class="${c.key === prSortCol ? 'r-sorted' : ''}" onclick="prSortBy('${c.key}')">${colLabel(c)}<span class="r-sort-arrow">↕</span></th>`
  ).join('');

  const body = rows.map((p, i) => {
    const hasMode = typeof scoreFormat === 'function';
    const compClass = (hasMode ? scoreIsPositive(p.composite) : p.composite >= 0) ? 'pos' : 'neg';
    const compLabel = hasMode ? scoreFormat(p.composite) : (p.composite >= 0 ? '+' : '') + p.composite.toFixed(2);
    const compTitle = typeof p.zRaw === 'number' ? ` title="Z roh ${(p.zRaw >= 0 ? '+' : '') + p.zRaw.toFixed(2)}"` : '';
    const owner = _prFantasyOwner(p.name);
    const secondLine = owner
      ? `<span class="ls-team-full ls-fantasy-owner" onclick="event.stopPropagation();if(typeof showTeam==='function')showTeam(${owner.id})" title="Go to ${owner.name}">${owner.name}</span>`
      : `<span class="ls-team-full">${_prTeamFullName(p.team)}</span>`;
    const teamCell = `<td><div class="ls-team-cell"><span class="ls-team-abbr">${p.team}</span>${secondLine}</div></td>`;
    return `<tr>
      <td>${i + 1}</td>
      <td>${p.name}</td>
      ${teamCell}
      <td>${p.games}</td>
      <td>${p.min.toFixed(1)}</td>
      <td>${p.pts.toFixed(1)}</td>
      <td>${p.reb.toFixed(1)}</td>
      <td>${p.ast.toFixed(1)}</td>
      <td>${p.stl.toFixed(1)}</td>
      <td>${p.blk.toFixed(1)}</td>
      <td>${p.to.toFixed(1)}</td>
      <td>${p.tpm.toFixed(1)}</td>
      <td>${p.fgPct.toFixed(1)}%</td>
      <td>${p.ftPct.toFixed(1)}%</td>
      <td><span class="ls-composite ${compClass}"${compTitle}>${compLabel}</span></td>
    </tr>`;
  }).join('');

  content.innerHTML = `
    <div class="ls-table-wrap">
      <table class="ls-table">
        <thead><tr>${thead}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
}
