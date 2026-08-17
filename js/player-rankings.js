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
//  Projections ist bewusst noch leer (Platzhalter für später).
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

// War bis 2026-07-31 die externe GitHub-Pages-URL des eigenstaendigen
// MFHFBs-NBA-Projections-Repos, dann lokal per Iframe, seit 2026-08-01
// schrittweise nativ portiert. Inzwischen sind ALLE 3 Toolkit-Seiten
// (Projections, NBA Teams, Draft Board) echte TTHQ-Seiten — die komplette
// Iframe-Mechanik (Resize-Observer, postMessage-Theme-Sync, ?theme=-URL-
// Parameter) ist damit entfernt. projections/index.html, teams.html und
// draft.html existieren als Standalone-Dateien weiter (werden von TTHQ
// aber nicht mehr geladen); die Daten- und assets-Dateien darunter sind
// weiterhin die aktive Quelle fuer die nativen Seiten.

// showPlayerProjections() lebt jetzt in js/consensus-projections.js --
// die Seite hat seit dem Consensus-Import (Beyaz x Josh Lloyd) eine
// eigene Datenquelle, siehe data/projections-consensus.js.

// Daten+Logik fuer die native Projections-Seite werden erst beim ersten
// Besuch nachgeladen (~2,4 MB — players-data.js allein ist 1,9 MB), nicht
// statisch in index.html eingebunden, sonst wuerde JEDER TTHQ-Besuch das
// mitladen, egal ob die Seite je aufgerufen wird. Gleiche Grundidee wie
// vorher beim Iframe (frame.src nur beim ersten Aufruf gesetzt), nur jetzt
// als echte <script>-Injection statt Iframe-Navigation.
const LIVE_PROJ_NATIVE_SCRIPTS = [
  'projections/players-data.js',
  'projections/projected-minutes.js',
  'projections/adp-data.js',
  'projections/rosters-data.js',
  'projections/rookie-projections.js',
  'projections/assets/shared.js',
  'projections/assets/inseason-blend.js',
  'js/projections-native.js',
];
let _liveProjNativeState = 'unloaded'; // 'unloaded' | 'loading' | 'ready'

// Mehrere Projections-Unterseiten (Projections/NBA Teams/[Draft Board])
// brauchen teilweise DIESELBEN Datendateien (players-data.js, shared.js,
// ...). Die nutzen "const" auf Top-Level -- ein zweites Mal geladen wuerfe
// "Identifier bereits deklariert". Deshalb global tracken, was schon laeuft
// oder fertig geladen ist, und beim zweiten Aufruf einfach ueberspringen.
const _loadedProjScripts = new Set(); // fertig geladen
const _loadingProjScripts = new Map(); // src -> Promise, waehrend des Ladens

function _loadScriptOnce(src) {
  if (_loadedProjScripts.has(src)) return Promise.resolve();
  if (_loadingProjScripts.has(src)) return _loadingProjScripts.get(src);
  const p = new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = src;
    // onerror statt Abbruch: adp-data.js/rosters-data.js/rookie-projections.js
    // hatten im Original schon ein onerror-Attribut (optional, Seite laeuft
    // auch ohne sie), gleiches Verhalten hier fuer alle beibehalten.
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

function showLiveProjections() {
  navigate('liveProjectionsPage');
  if (_liveProjNativeState === 'ready') return;
  if (_liveProjNativeState === 'loading') return;
  _liveProjNativeState = 'loading';
  const countEl = document.getElementById('count');
  if (countEl) countEl.textContent = 'Lade Projections…';
  _loadScriptsSequentially(LIVE_PROJ_NATIVE_SCRIPTS, 0, () => {
    _liveProjNativeState = 'ready';
    if (typeof initLiveProjectionsNative === 'function') {
      initLiveProjectionsNative();
    } else {
      console.error('initLiveProjectionsNative() nicht gefunden — js/projections-native.js korrekt geladen?');
      if (countEl) countEl.textContent = 'Fehler beim Laden — siehe Browser-Konsole.';
    }
  });
}

// NBA Teams braucht zum Teil dieselben Dateien wie Projections
// (players-data.js, rosters-data.js, assets/shared.js, assets/inseason-blend.js)
// -- ueber _loadScriptOnce() global dedupliziert, egal in welcher
// Reihenfolge die beiden Seiten zuerst besucht werden. adp-data.js wird
// hier NICHT gebraucht (nur auf der Projections-Seite selbst).
const LIVE_PROJ_TEAMS_SCRIPTS = [
  'projections/players-data.js',
  'projections/projected-minutes.js',
  'projections/rookie-projections.js',
  'projections/rosters-data.js',
  'projections/assets/shared.js',
  'projections/assets/inseason-blend.js',
  'js/projections-teams-native.js',
];
let _liveProjTeamsState = 'unloaded'; // 'unloaded' | 'loading' | 'ready'

function showLiveProjTeams() {
  navigate('liveProjTeamsPage');
  if (_liveProjTeamsState === 'ready' || _liveProjTeamsState === 'loading') return;
  _liveProjTeamsState = 'loading';
  const contentEl = document.getElementById('teamsContent');
  if (contentEl) contentEl.textContent = 'Lade NBA Teams…';
  _loadScriptsSequentially(LIVE_PROJ_TEAMS_SCRIPTS, 0, () => {
    _liveProjTeamsState = 'ready';
    if (typeof initLiveProjTeamsNative === 'function') {
      initLiveProjTeamsNative();
    } else {
      console.error('initLiveProjTeamsNative() nicht gefunden — js/projections-teams-native.js korrekt geladen?');
      if (contentEl) contentEl.textContent = 'Fehler beim Laden — siehe Browser-Konsole.';
    }
  });
}

// Draft Board braucht zusaetzlich adp-data.js und assets/fantrax-live.js
// (Live-Sync mit Fantrax) — Rest identisch mit Projections, ueber
// _loadScriptOnce() dedupliziert.
const LIVE_PROJ_DRAFT_SCRIPTS = [
  // Consensus zuerst: shared.js leitet daraus die Pro-Minute-Raten ab
  // (siehe mfhfbConsensusRatesFor), muss also vorher geladen sein.
  'data/projections-consensus.js',
  'projections/players-data.js',
  'projections/projected-minutes.js',
  'projections/adp-data.js',
  'projections/rosters-data.js',
  'projections/rookie-projections.js',
  'projections/assets/shared.js',
  'projections/assets/inseason-blend.js',
  'projections/assets/fantrax-live.js',
  'js/projections-draft-native.js',
];
let _liveProjDraftState = 'unloaded'; // 'unloaded' | 'loading' | 'ready'

function showLiveProjDraft() {
  navigate('liveProjDraftPage');
  if (_liveProjDraftState === 'ready' || _liveProjDraftState === 'loading') return;
  _liveProjDraftState = 'loading';
  const bodyEl = document.getElementById('poolBody');
  if (bodyEl) bodyEl.innerHTML = '<tr><td colspan="22" style="padding:16px;color:var(--muted);">Lade Draft Board…</td></tr>';
  _loadScriptsSequentially(LIVE_PROJ_DRAFT_SCRIPTS, 0, () => {
    _liveProjDraftState = 'ready';
    if (typeof initLiveProjDraftNative === 'function') {
      initLiveProjDraftNative();
    } else {
      console.error('initLiveProjDraftNative() nicht gefunden — js/projections-draft-native.js korrekt geladen?');
      if (bodyEl) bodyEl.innerHTML = '<tr><td colspan="22" style="padding:16px;color:var(--bad);">Fehler beim Laden — siehe Browser-Konsole.</td></tr>';
    }
  });
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

  prRows = entry.players.slice();
  _prSort(prSortCol, true);
  _prRenderTable();
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

  const thead = PR_COLUMNS.map(c =>
    `<th class="${c.key === prSortCol ? 'r-sorted' : ''}" onclick="prSortBy('${c.key}')">${c.label}<span class="r-sort-arrow">↕</span></th>`
  ).join('');

  const body = rows.map((p, i) => {
    const compClass = p.composite >= 0 ? 'pos' : 'neg';
    const compLabel = (p.composite >= 0 ? '+' : '') + p.composite.toFixed(2);
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
      <td><span class="ls-composite ${compClass}">${compLabel}</span></td>
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
