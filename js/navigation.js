// ============================================================
//  NAVIGATION
// ============================================================
let currentTeamId=null, currentTab='roster';
const teamMap={};
TEAMS.forEach(t=>teamMap[t.id]=t);

function getInitials(name){return name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();}

// ── Injury-Badge ─────────────────────────────────────────────
//  p.inj kommt aus dem taeglichen ESPN-Sync (data/rosters-live.js):
//  OUT, DTD (Day-to-Day) oder SUSP (Sperre). Gesunde Spieler haben
//  kein inj-Feld. Zentral hier, damit Roster-Ansicht und Matchup
//  Planner identische Badges zeigen.
function injuryBadge(inj) {
  if (!inj) return '';
  const cfg = {
    OUT:  { label: 'OUT',  color: '#ef5350', bg: 'rgba(239,83,80,0.15)' },
    DTD:  { label: 'DTD',  color: '#f5c842', bg: 'rgba(245,200,66,0.15)' },
    SUSP: { label: 'SUSP', color: 'var(--muted)', bg: 'rgba(123,127,158,0.15)' },
  }[inj] || { label: inj, color: '#ef5350', bg: 'rgba(239,83,80,0.15)' };
  return `<span title="${cfg.label === 'DTD' ? 'Day to Day (fraglich)' : cfg.label === 'OUT' ? 'Fällt aus' : cfg.label === 'SUSP' ? 'Gesperrt' : cfg.label}" style="font-size:9px;font-weight:800;letter-spacing:0.05em;padding:1px 6px;border-radius:8px;margin-left:5px;vertical-align:middle;background:${cfg.bg};color:${cfg.color};">${cfg.label}</span>`;
}

// ── Team-Bilanz ──────────────────────────────────────────────
//  Live-Bilanzen kommen taeglich aus dem ESPN-Sync (TEAM_RECORDS_LIVE
//  in data/rosters-live.js). Gating ueber die Saisonkennung: ESPN_SEASON
//  in js/espn-sync.js steht seit 05.08.2026 auf 2027 (die aktuelle,
//  bereits aktive Liga-Instanz -- Beweis: Trades werden dort schon vor
//  Saisonstart abgewickelt). Records zeigen deshalb ab jetzt echte
//  Werte, anfangs plausibel 0-0-0, bis der Spielbetrieb im Oktober
//  beginnt -- ueber den korrekten Datenpfad, nicht mehr blockiert.
//  Die 2025/26-Endstaende liegen im Archiv
//  (data/season-2025-26.js, Seite "Saison 2025/26").
function _displayRecord(t) {
  if (typeof TEAM_RECORDS_LIVE !== 'undefined'
      && TEAM_RECORDS_LIVE.season >= 2027
      && TEAM_RECORDS_LIVE.records
      && TEAM_RECORDS_LIVE.records[t.id]) {
    return TEAM_RECORDS_LIVE.records[t.id];
  }
  return t.record;
}

// ── Projection-Ranks fuer das Team-Staerke-Badge ─────────────
//  Rangliste aller Spieler nach Composite-Z aus LIVE_PROJECTIONS
//  (Baseline + Live Blend, wird taeglich neu gebaut). Einmal pro
//  Seitenaufruf berechnet und gecacht. Das Badge ist damit genauso
//  automatisiert wie die Projections selbst.
let _projRankMap = null;
function _getProjRankMap() {
  if (_projRankMap) return _projRankMap;
  _projRankMap = new Map();
  if (typeof LIVE_PROJECTIONS !== 'undefined') {
    Object.entries(LIVE_PROJECTIONS)
      .filter(([, s]) => typeof s.z === 'number')
      .sort((a, b) => b[1].z - a[1].z)
      .forEach(([name], i) => {
        _projRankMap.set(normalizeName(name).toLowerCase(), i + 1);
      });
  }
  return _projRankMap;
}

function teamStrengthBadge(teamId) {
  const roster = ROSTERS[teamId] || [];
  const projMap = _getProjRankMap();

  // Basis: aktuelle Projections (taeglich neu gebaut).
  let ranks = roster
    .map(p => projMap.get(normalizeName(p.name).toLowerCase()) ?? null)
    .filter(r => r !== null);
  let label = 'Ø Top-20 Rank';
  const tip = 'Durchschnittlicher Projections Rang der 20 besten Spieler des Kaders (Basis: aktuelle 2026/27 Projections, täglich aktualisiert)';
  ranks = ranks.sort((a, b) => a - b).slice(0, 20);
  if (!ranks.length) return '';
  const avg = Math.round(ranks.reduce((a, b) => a + b, 0) / ranks.length);
  // Farbe nach Stärke
  let color, bg;
  if (avg <= 30)       { color = '#f5c842'; bg = 'rgba(245,200,66,0.15)'; }
  else if (avg <= 60)  { color = '#a89bff'; bg = 'rgba(108,99,255,0.15)'; }
  else if (avg <= 100) { color = '#6dddaa'; bg = 'rgba(76,175,129,0.15)'; }
  else if (avg <= 150) { color = '#4fc3f7'; bg = 'rgba(41,182,246,0.15)'; }
  else                 { color = 'var(--muted)'; bg = 'rgba(123,127,158,0.12)'; }
  const isLight = document.body.classList.contains('light');
  if (isLight) {
    if (avg <= 30)       { color = '#9a6e10'; bg = 'rgba(154,110,16,0.15)'; }
    else if (avg <= 60)  { color = '#c0622f'; bg = 'rgba(192,98,47,0.15)'; }
    else if (avg <= 100) { color = '#2d7a50'; bg = 'rgba(61,138,92,0.15)'; }
    else if (avg <= 150) { color = '#2a7ab8'; bg = 'rgba(42,122,184,0.15)'; }
    else                 { color = 'var(--muted)'; bg = 'rgba(123,127,158,0.12)'; }
  }
  return `<div style="margin-top:10px;display:flex;align-items:center;justify-content:space-between;" title="${tip}">
    <span style="font-size:10px;color:var(--muted);font-weight:600;">${label}</span>
    <span style="font-size:11px;font-weight:800;padding:2px 9px;border-radius:20px;background:${bg};color:${color};">#${avg}</span>
  </div>`;
}

// ── Staerke-Badge fuer archivierte Saisons ───────────────────
//  Nutzt die ZEITGENOESSISCHEN BBM-Saisonrankings (data/season-rankings.js),
//  beantwortet also "wie stark war dieser Kader DAMALS" -- nicht, wie er
//  heute bewertet wuerde. (Bis 05.08.2026 wurden hier ersatzweise die
//  aktuellen Dynasty-Ranks benutzt, was fachlich irrefuehrend war.)
//  Top 10 statt Top 20 wie bei der laufenden Saison: die Kader waren
//  damals nur ~13-15 Spieler gross, Top 20 wuerde faktisch den ganzen
//  Kader mitteln und die Unterschiede zwischen Teams einebnen.
//  Spieler ohne Saisonranking (Langzeitverletzung, Sperre -- sie tauchen
//  in keinem Saison-Ranking auf) werden uebersprungen, nicht geschaetzt.
function archivedStrengthBadge(roster, seasonKey) {
  if (!roster || !roster.length) return '';
  const table = (typeof SEASON_RANKINGS !== 'undefined' && SEASON_RANKINGS[seasonKey]) || null;
  if (!table) return '';
  const ranks = roster
    .map(p => table[p.name])
    .filter(r => typeof r === 'number')
    .sort((a, b) => a - b)
    .slice(0, 10);
  if (!ranks.length) return '';
  const avg = Math.round(ranks.reduce((a, b) => a + b, 0) / ranks.length);
  const isLight = document.body.classList.contains('light');
  let color, bg;
  if (avg <= 30)       { color = isLight ? '#9a6e10' : '#f5c842'; bg = 'rgba(245,200,66,0.15)'; }
  else if (avg <= 60)  { color = isLight ? '#c0622f' : '#a89bff'; bg = 'rgba(108,99,255,0.15)'; }
  else if (avg <= 100) { color = isLight ? '#2d7a50' : '#6dddaa'; bg = 'rgba(76,175,129,0.15)'; }
  else if (avg <= 150) { color = isLight ? '#2a7ab8' : '#4fc3f7'; bg = 'rgba(41,182,246,0.15)'; }
  else                 { color = 'var(--muted)'; bg = 'rgba(123,127,158,0.12)'; }
  const covered = roster.filter(p => typeof table[p.name] === 'number').length;
  const tip = 'Durchschnittlicher 9 Cat Rang der 10 besten Spieler dieses Kaders, '
            + 'gemessen an den Endrankings DIESER Saison (Basketball Monster). '
            + covered + ' von ' + roster.length + ' Spielern hatten ein Saisonranking.';
  return `<div style="margin-top:8px;display:flex;align-items:center;justify-content:space-between;" title="${tip}">
    <span style="font-size:10px;color:var(--muted);font-weight:600;">Ø Top-10 Rank</span>
    <span style="font-size:11px;font-weight:800;padding:2px 9px;border-radius:20px;background:${bg};color:${color};">#${avg}</span>
  </div>`;
}

function renderHome() {
  renderSeasonPicker();
  const grid = document.getElementById('teamGrid');

  if (_viewSeason === 'current') {
    grid.innerHTML = TEAMS.map(t => {
      const c = getTeamColor(t);
      return `<div class="team-card" onclick="showTeam(${t.id})">
        <div class="team-avatar" style="background:${c}18;color:${c};">${getInitials(t.name)}</div>
        <div class="team-name">${t.name}</div>
        <div class="team-owner">${t.owner}</div>
        <div class="team-record">📊 ${_displayRecord(t)}</div>
        ${teamStrengthBadge(t.id)}
      </div>`;
    }).join('');
    return;
  }

  // Archivierte Saison: Reihenfolge nach Abschlusstabelle, Name/Owner/
  // Farbe weiterhin live aus TEAMS (Umbenennungen wirken nicht rueckwirkend
  // auf die archivierten Bilanzen). Kein Staerke-Badge -- fuer keine
  // archivierte Saison liegt ein Player-Ranking aus DER JEWEILIGEN Zeit vor;
  // die aktuellen Projection-Ranks auf ein altes Roster anzuwenden waere
  // irrefuehrend (z.B. Spieler, die es damals noch gar nicht gab).
  const season = _getSeasonData(_viewSeason);
  if (!season) { grid.innerHTML = ''; return; }
  grid.innerHTML = season.standings.map(row => {
    // Historischer Name der Saison (Teams wurden teils umbenannt).
    // teamId verweist auf das heutige Team fuer Farbe/Owner/Klick-Ziel;
    // ist sie null, existiert das Team heute nicht mehr -- dann keine
    // Verlinkung und ein neutraler Hinweis statt eines Owner-Namens.
    const t = row.teamId != null ? teamMap[row.teamId] : null;
    const displayName = row.name || (t ? t.name : '—');
    const c = t ? getTeamColor(t) : 'var(--muted)';
    const medal = row.place === 1 ? '🥇' : row.place === 2 ? '🥈' : row.place === 3 ? '🥉'
      : row.place != null ? `#${row.place}` : 'unbekannt';
    const recordText = row.record != null ? row.record : 'nicht überliefert';
    const roster = season.rosters ? season.rosters[row.rosterKey || String(row.teamId)] : null;
    const clickable = t && roster;
    const renamed = t && row.name && row.name !== t.name
      ? `<div style="font-size:10px;color:var(--muted);margin-top:2px;">heute: ${t.name}</div>` : '';
    return `<div class="team-card"${clickable ? ` onclick="showTeam(${t.id})"` : ' style="cursor:default;"'}>
      <div class="team-avatar" style="background:${t ? c + '18' : 'var(--surface2)'};color:${c};">${getInitials(displayName)}</div>
      <div class="team-name">${displayName}</div>
      <div class="team-owner">${t ? t.owner : 'Team existiert heute nicht mehr'}</div>
      ${renamed}
      <div class="team-record">📊 ${recordText}</div>
      <div style="margin-top:10px;display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:10px;color:var(--muted);font-weight:600;">Abschlussplatz</span>
        <span style="font-size:11px;font-weight:800;padding:2px 9px;border-radius:20px;background:var(--surface2);color:var(--muted);">${medal}</span>
      </div>
      ${archivedStrengthBadge(roster, _viewSeason)}
    </div>`;
  }).join('');
}


function showTeam(id){
  currentTeamId=id; currentTab='roster';
  currentRosterSort = 'pos';
  const sortBtn = document.getElementById('rosterSortBtn');
  if (sortBtn) {
    // Archiv hat keine Ranks zum Sortieren -- Button nur bei "current" zeigen.
    sortBtn.style.display = _viewSeason === 'current' ? 'block' : 'none';
    const btn = document.getElementById('sortToggleBtn');
    if (btn) { btn.textContent = '📊 Sort by Rank'; btn.style.background='var(--surface)'; btn.style.borderColor='var(--border)'; btn.style.color='var(--muted)'; }
  }
	const t=teamMap[id]; const c=getTeamColor(t);
  const season = _viewSeason !== 'current' ? _getSeasonData(_viewSeason) : null;
  const seasonRow = season ? season.standings.find(s => s.teamId === id) : null;
  const recordDisplay = seasonRow ? (seasonRow.record != null ? seasonRow.record : 'nicht überliefert') : _displayRecord(t);
  // In Archiv-Saisons den DAMALIGEN Teamnamen zeigen (Teams wurden teils
  // umbenannt) -- der heutige Name steht dann als Zusatz daneben.
  const histName = seasonRow && seasonRow.name ? seasonRow.name : t.name;
  const renamedNote = seasonRow && seasonRow.name && seasonRow.name !== t.name
    ? ` <span style="font-size:11px;color:var(--muted);font-weight:500;">(heute: ${t.name})</span>` : '';
  const seasonBadge = season
    ? `<span style="margin-left:8px;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:var(--surface2);border:1px solid var(--border);color:var(--muted);">📜 ${season.label}</span>`
    : '';
  document.getElementById('teamHeader').innerHTML=`
    <div class="team-page-avatar" style="background:${c}18;color:${c};">${getInitials(histName)}</div>
    <div>
      <div class="team-page-name">${histName}${seasonBadge}</div>
      <div class="team-page-owner">${t.owner}${renamedNote} &nbsp;·&nbsp; <span style="color:var(--green);">📊 ${recordDisplay}</span></div>
    </div>`;
  document.querySelectorAll('.tab').forEach((el,i)=>el.classList.toggle('active',i===0));
  renderTab(); navigate('teamPage');
}

function toggleRosterSort() {
  currentRosterSort = currentRosterSort === 'pos' ? 'rank' : 'pos';
  const btn = document.getElementById('sortToggleBtn');
  if (btn) {
    btn.textContent = currentRosterSort === 'rank' ? '📋 Sort by Position' : '📊 Sort by Rank';
    btn.style.background = currentRosterSort === 'rank' ? 'var(--accent-light)' : 'var(--surface)';
    btn.style.borderColor = currentRosterSort === 'rank' ? 'var(--accent)' : 'var(--border)';
    btn.style.color = currentRosterSort === 'rank' ? 'var(--accent)' : 'var(--muted)';
  }
  renderTab();
}
function renderTab(){
  if (_viewSeason !== 'current') {
    document.getElementById('tabContent').innerHTML = renderArchivedRoster(currentTeamId);
    return;
  }
  document.getElementById('tabContent').innerHTML=renderRoster(currentTeamId);
}

// ── Archivierte Rosteransicht ────────────────────────────────
//  Bewusst deutlich schlanker als renderRoster(): keine Rank-Badges
//  (keine historischen Rankings vorhanden, siehe SEASON_REGISTRY-
//  Kommentar), kein Admin-Edit, keine Sortierung -- reiner Snapshot-
//  Stand mit Slot, Team+Position und Acquisition-Art (Draft/Trade/FA).
function renderArchivedRoster(teamId) {
  const season = _getSeasonData(_viewSeason);
  const row = season ? season.standings.find(s => s.teamId === teamId) : null;
  const key = row && row.rosterKey ? row.rosterKey : String(teamId);
  const roster = season && season.rosters ? season.rosters[key] : null;
  if (!roster) {
    return `<div style="padding:40px 20px;text-align:center;color:var(--muted);font-size:13px;">
      Für ${season ? season.label : 'diese Saison'} liegt kein Rosterstand vor.
    </div>`;
  }
  const acqIcon = { Draft: '📋', Trade: '🔄', 'Free Agency': '🆓', Empty: '' };
  // injStatus ist nur in aelteren Exporten ueberliefert ('O' = Out,
  // 'DTD' = Day to Day); fehlt er, wird nur ein neutrales Icon gezeigt,
  // um keinen genaueren Status zu behaupten als bekannt ist.
  const injBadge = (p) => {
    if (!p.inj) return '';
    const label = p.injStatus === 'DTD' ? 'DTD' : p.injStatus === 'O' ? 'OUT' : '⚠';
    const tip = p.injStatus === 'DTD' ? 'Day to Day (fraglich) zum Exportzeitpunkt'
              : p.injStatus === 'O' ? 'Fiel zum Exportzeitpunkt aus'
              : 'Trug zum Exportzeitpunkt ein Verletzungsicon (genauer Status nicht überliefert)';
    const col = p.injStatus === 'DTD' ? '#f5c842' : '#ef5350';
    const bgc = p.injStatus === 'DTD' ? 'rgba(245,200,66,0.15)' : 'rgba(239,83,80,0.15)';
    return `<span title="${tip}" style="font-size:9px;font-weight:800;padding:1px 6px;border-radius:8px;margin-left:5px;vertical-align:middle;background:${bgc};color:${col};">${label}</span>`;
  };
  return `<div class="note" style="margin-bottom:14px;">
    📜 Rosterstand ${season.label} — eingefroren, keine Live-Daten.
  </div>` + roster.map(p => `<div class="player-row">
    <div class="pos-badge pos-${(p.pos || '?').split(',')[0].trim() || '?'}">${p.slot}</div>
    <div style="flex:1;min-width:0;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
      <div class="player-name">${p.name}${injBadge(p)}</div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span class="player-team r-team-link" style="font-size:12px;">${p.team} ${p.pos}</span>
        <span style="font-size:10px;color:var(--muted);background:var(--surface2);border:1px solid var(--border);padding:2px 8px;border-radius:10px;white-space:nowrap;">${acqIcon[p.acq] || ''} ${p.acq}</span>
      </div>
    </div>
  </div>`).join('');
}
// ── Projection-Rang eines Spielers (1 = bester) ─────────────
//  Einheitlicher Redraft-Rang fuer Roster, Best Available, NBA Teams
//  und Cat Web. Quelle: _getProjRankMap() (LIVE_PROJECTIONS).
function getProjRank(name) {
  return _getProjRankMap().get(normalizeName(name).toLowerCase()) ?? null;
}
// Stammdaten (Team/Position/Geburtsdatum) aus data/players.js.
let _playerDbMap = null;
function getPlayerDbEntry(name) {
  if (!_playerDbMap) {
    _playerDbMap = new Map();
    (typeof PLAYER_DB !== 'undefined' ? PLAYER_DB : [])
      .forEach(p => _playerDbMap.set(normalizeName(p[0]).toLowerCase(), p));
  }
  return _playerDbMap.get(normalizeName(name).toLowerCase()) || null;
}
function rankTierBg(rank) {
  if (rank === 1)      return 'rgba(245,200,66,0.15)';
  if (rank <= 5)       return 'rgba(108,99,255,0.15)';
  if (rank <= 15)      return 'rgba(76,175,129,0.15)';
  if (rank <= 30)      return 'rgba(41,182,246,0.15)';
  if (rank <= 75)      return 'rgba(255,101,132,0.12)';
  return 'rgba(123,127,158,0.12)';
}
function rankTierColor(rank) {
  if (rank === 1)      return '#f5c842';
  if (rank <= 5)       return '#a89bff';
  if (rank <= 15)      return '#6dddaa';
  if (rank <= 30)      return '#4fc3f7';
  if (rank <= 75)      return '#ff8fa3';
  return 'var(--muted)';
}
function projRankBadge(rank) {
  if (rank === null) return '<span style="font-size:11px;color:var(--border);font-weight:600;width:48px;text-align:right;padding:3px 8px;display:inline-block;">—</span>';
  return `<span onclick="showPlayerRankings()" title="2026/27 Projections Rang" style="font-size:11px;font-weight:800;width:48px;text-align:center;padding:3px 8px;border-radius:6px;background:${rankTierBg(rank)};color:${rankTierColor(rank)};cursor:pointer;transition:opacity 0.15s;display:inline-block;" onmouseenter="this.style.opacity='0.75'" onmouseleave="this.style.opacity='1'">#${rank}</span>`;
}
function playerAge(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
}
	
let currentRosterSort = 'pos'; // 'pos' | 'rank'

function renderRoster(id) {
  const roster = ROSTERS[id] || [];
  let html = '';

  // Desktop header (hidden on mobile)
  html += `<div class="roster-header-row">
    <div style="width:32px;flex-shrink:0;"></div>
    <div style="flex:1;font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--muted);">Name</div>
    <div class="roster-col-nba" style="font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--muted);">NBA</div>
    <div class="roster-col-rank" style="font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--muted);" title="2026/27 Projections Rang">Proj</div>
  </div>`;

  const sorted = currentRosterSort === 'rank'
    ? [...roster].sort((a, b) => {
        const ra = getProjRank(a.name) ?? 9999;
        const rb = getProjRank(b.name) ?? 9999;
        return ra - rb;
      })
    : roster;

  const knownPos = ['PG','SG','SF','PF','C'];
  const posGroups = currentRosterSort === 'rank'
    ? [{ pos: null, players: sorted }]
    : [
        ...knownPos.map(pos => ({ pos, players: sorted.filter(p => p.pos && p.pos.split('/')[0] === pos) })),
        { pos: '?', players: sorted.filter(p => !p.pos || !knownPos.includes(p.pos.split('/')[0])) }
      ];

  posGroups.forEach(({ pos, players }) => {
    if (!players.length) return;
    players.forEach(p => {
      const rank   = getProjRank(p.name);
      const dbEntry = getPlayerDbEntry(p.name);
      const age    = dbEntry ? playerAge(dbEntry[3]) : null;
      const ageStr = age !== null
        ? `<span style="font-size:10px;font-weight:600;color:var(--muted);background:var(--surface2);border:1px solid var(--border);padding:1px 5px;border-radius:10px;margin-left:4px;">${age}y</span>`
        : '';
      const projBadge = projRankBadge(rank);

      const _posKey = p.pos ? p.pos.split('/')[0] : 'PG';
      html += `<div class="player-row">
        <div class="pos-badge pos-${_posKey}">${_posKey}</div>
        <div style="flex:1;min-width:0;">
          <!-- Desktop: single line -->
          <div class="roster-desktop-row">
            <div class="player-name" style="flex:1;cursor:pointer;" onclick="showRollingRankings('${p.name}')" title="📈 Rolling Rankings ansehen">${p.name}${ageStr}${injuryBadge(p.inj)}</div>
            <span class="roster-col-nba player-team r-team-link"
              onclick="showNBATeam('${p.team}')"
              style="font-size:12px;width:42px;text-align:center;"
            >${p.team}</span>
            <span class="roster-col-rank">${projBadge}</span>
          </div>
          <!-- Mobile: two lines -->
          <div class="roster-mobile-row">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
              <span class="player-name" style="font-size:13px;">${p.name}${ageStr}${injuryBadge(p.inj)}</span>
              <span class="player-team r-team-link" onclick="showNBATeam('${p.team}')" style="font-size:11px;">${p.team}</span>
            </div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;">
              <span style="font-size:9px;font-weight:700;color:var(--muted);padding:2px 6px;background:var(--surface2);border-radius:4px;">Proj</span>${projBadge}
            </div>
          </div>
        </div>
      </div>`;
    });
  });
  return html;
}

// ============================================================
//  DRAFT RESULTS -- wer hat wen gepickt (abgeschlossener Draft)
// ============================================================
//  Zeigt fuer einen bereits gelaufenen Draft, welcher Spieler an
//  welches Team ging, bei welchem Pick. Daten kommen aus
//  data/draft-results-<saison>.js (siehe scripts/fetch-draft-results-espn.js).
function showDraftResults(){
  navigate('draftResultsPage');
  const host = document.getElementById('draftResultsContent');
  const sub = document.getElementById('draftResultsSub');
  if (!host) return;

  if (typeof DRAFT_RESULTS === 'undefined' || !DRAFT_RESULTS || !DRAFT_RESULTS.picks || !DRAFT_RESULTS.picks.length) {
    host.innerHTML = `<div style="background:var(--surface);border:1px dashed var(--border);border-radius:12px;padding:32px 20px;text-align:center;color:var(--muted);font-size:13px;line-height:1.6;">
      <div style="font-size:32px;margin-bottom:8px;">📋</div>
      <b style="color:var(--text);">Der Draft 2026/27 steht noch aus.</b><br>
      Sonntag, 11. Oktober 2026 · 20:30 Uhr. Danach füllt sich das Board über
      <b>Actions → "Draft Results abrufen" → Run workflow</b>.
    </div>`;
    if (sub) sub.textContent = 'Wer hat wen gepickt';
    return;
  }

  const rounds = [...new Set(DRAFT_RESULTS.picks.map(p => p.round))].sort((a,b) => a-b);
  const unresolved = DRAFT_RESULTS.picks.filter(p => p.nameSource === 'unresolved').length;

  if (sub) {
    const datum = DRAFT_RESULTS.fetchedAt ? new Date(DRAFT_RESULTS.fetchedAt).toLocaleDateString('de-DE') : '';
    sub.textContent = `ESPN-Saison ${DRAFT_RESULTS.espnSeason} · abgerufen ${datum}`;
  }

  let html = '';
  if (unresolved) {
    html += `<div style="background:var(--accent-light);border:1px solid var(--border);border-left:3px solid var(--accent2);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--muted);">
      ⚠️ ${unresolved} Spieler nicht auflösbar (nicht mehr auf einem Roster, deshalb kein Name über die ESPN-Roster-Abfrage verfügbar). Zeigt die ESPN-ID statt des Namens.
    </div>`;
  }

  html += '<table><thead><tr><th class="round-label">Rnd</th>';
  TEAMS.forEach(t => { html += `<th title="${t.owner}">${t.name.split(' ')[0]}</th>`; });
  html += '</tr></thead><tbody>';

  rounds.forEach(round => {
    html += `<tr><td style="font-weight:700;color:var(--muted);white-space:nowrap;background:var(--surface);">R${round}</td>`;
    TEAMS.forEach(t => {
      const pick = DRAFT_RESULTS.picks.find(p => p.round === round && p.teamId === t.id);
      if (!pick) { html += `<td><span class="pick-empty">—</span></td>`; return; }
      const unresolvedTag = pick.nameSource === 'unresolved' ? ' style="opacity:.6;font-style:italic;"' : '';
      html += `<td>
  <div class="pick-cell pick-own-cell"${unresolvedTag}>
    ${pick.nameSource === 'unresolved' ? `ESPN #${pick.playerId}` : pick.playerName}
    <span style="display:block;font-size:9px;color:var(--muted);margin-top:2px;">Pick ${pick.overallPickNumber}</span>
  </div>
</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';

  host.innerHTML = html;
}

// Which group each page belongs to (for group-button highlighting)
const SUBNAV_PAGES = {
  homePage:'home',
  // Liga
  rollingStandingsPage:'tabellenverlauf', standingsPage:'historie', analyticsPage:'analytics',
  draftResultsPage:'draftboard', duesPage:'beitraege', rulesPage:'regeln',
  // Spieler
  playerRankingsPage:'rankings', playerProjectionsPage:'projections', rollingRankingsPage:'spielerverlauf',
  liveScoresPage:'livescores', playerShapePage:'catweb',
  // Einzelne Werkzeuge
  matchupPage:'matchup', bestAvailPage:'waiver',
};

const SNAV_GROUP = {
  tabellenverlauf: 'snavLiga', historie: 'snavLiga', analytics: 'snavLiga',
  draftboard: 'snavLiga', beitraege: 'snavLiga', regeln: 'snavLiga',
  rankings: 'snavSpieler', projections: 'snavSpieler', spielerverlauf: 'snavSpieler',
  livescores: 'snavSpieler', catweb: 'snavSpieler',
};

// Reverse map: hash value → pageId
const HASH_TO_PAGE = Object.fromEntries(
  Object.entries(SUBNAV_PAGES).map(([pageId, hash]) => [hash, pageId])
);
// Pages not in SUBNAV_PAGES that still need hash routing
const EXTRA_HASH_TO_PAGE = {
  'home': 'homePage',
  // Alte Adressen (vor der Navi-Neuordnung am 2026-09-23), damit
  // Lesezeichen weiter funktionieren.
  'standings': 'standingsPage', 'rollingstandings': 'rollingStandingsPage',
  'draftresults': 'draftResultsPage', 'dues': 'duesPage', 'rules': 'rulesPage',
  'playerrankings': 'playerRankingsPage', 'playerprojections': 'playerProjectionsPage',
  'rollingrankings': 'rollingRankingsPage', 'playershape': 'playerShapePage',
  'bestavail': 'bestAvailPage',
};

function _applyPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById(pageId);
  if (!el) { document.getElementById('homePage').classList.add('active'); return; }
  el.classList.add('active');
  document.getElementById('backBtn').style.display = pageId !== 'homePage' ? 'flex' : 'none';
  const pageKey = SUBNAV_PAGES[pageId] || '';
  document.querySelectorAll('.snav-single').forEach(el =>
    el.classList.toggle('active', el.dataset.page === pageKey));
  document.querySelectorAll('.snav-group-btn').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.snav-dropdown-item').forEach(el =>
    el.classList.toggle('active', el.dataset.page === pageKey));
  const groupId = SNAV_GROUP[pageKey];
  if (groupId) { const g = document.getElementById(groupId); if (g) g.classList.add('active'); }
  const activeBtn = document.querySelector('.subnav-mobile-btn[data-page="'+pageKey+'"]');
  const label = document.getElementById('mobileNavLabel');
  if (label) label.textContent = activeBtn ? activeBtn.textContent : '🕺 Menü';
  window.scrollTo(0, 0);
}

function navigate(pageId, opts = {}) {
  const hash = SUBNAV_PAGES[pageId] || pageId.replace('Page','').toLowerCase();
  try {
    if (window.location.hash !== '#' + hash) {
      if (opts.replace) {
        history.replaceState({ pageId }, '', '#' + hash);
      } else {
        history.pushState({ pageId }, '', '#' + hash);
      }
    }
  } catch(e) { /* iframe preview — history API blocked, no-op */ }
  _applyPage(pageId);
}

function _pageIdFromHash(hash) {
  const key = (hash || '').replace('#', '');
  if (!key || key === 'home') return 'homePage';
  return HASH_TO_PAGE[key] || EXTRA_HASH_TO_PAGE[key] || 'homePage';
}

// Browser back/forward
window.addEventListener('popstate', (e) => {
  const pageId = e.state?.pageId || _pageIdFromHash(window.location.hash);
  _applyPage(pageId);
  _rerenderPage(pageId);
});

function toggleMobileNav() {
  const dd = document.getElementById('mobileNavDropdown');
  const arrow = document.getElementById('mobileNavArrow');
  const subNav = document.getElementById('subNav');
  const open = dd.classList.toggle('open');
  arrow.style.transform = open ? 'rotate(180deg)' : '';
  if (subNav) subNav.classList.toggle('mobile-nav-open', open);
}

function closeMobileNav() {
  document.getElementById('mobileNavDropdown').classList.remove('open');
  document.getElementById('mobileNavArrow').style.transform = '';
  const subNav = document.getElementById('subNav');
  if (subNav) subNav.classList.remove('mobile-nav-open');
}
// ── Saison-Auswahl (Dropdown auf der Home-Seite) ────────────
//  Aendert, welche Saison auf Home-Grid und Team-Detailseite gezeigt
//  wird. "current" = live (ROSTERS/TEAM_RECORDS_LIVE/Projections wie
//  gehabt). Alle anderen Saisons kommen aus SEASON_HISTORY
//  (data/season-history.js, per GitHub Actions "Saison-Standings
//  abrufen" direkt aus ESPN geholt). Neue Saison = Workflow erneut
//  laufen lassen, hier ist nichts von Hand einzutragen.
//  Bis 2026-09-23 standen hier die Archiv-Saisons der TTHQ-Liga
//  (data/season-20xx-xx.js), die fuer Funkytown falsch waren.
//  Reset bei jedem Seitenaufruf auf "current" (kein localStorage) --
//  bewusst so gewuenscht, damit man nie versehentlich in einer alten
//  Saison "haengen bleibt".
function _seasonHistory() {
  return (typeof SEASON_HISTORY !== 'undefined' && Array.isArray(SEASON_HISTORY)) ? SEASON_HISTORY : [];
}
const SEASON_REGISTRY = [
  { key: 'current', label: 'Saison 2026/27 (aktuell)' },
  ..._seasonHistory().map(s => ({ key: s.key, label: s.label })),
];
let _viewSeason = 'current';

function _getSeasonData(key) {
  return _seasonHistory().find(s => s.key === key) || null;
}

function renderSeasonPicker() {
  const host = document.getElementById('seasonPicker');
  if (!host) return;
  const available = SEASON_REGISTRY.filter(s => s.key === 'current' || _getSeasonData(s.key));
  if (available.length <= 1) { host.style.display = 'none'; return; }
  host.style.display = '';
  host.innerHTML = `<select id="seasonPickerSelect" onchange="setViewSeason(this.value)">
    ${available.map(s => `<option value="${s.key}" ${s.key === _viewSeason ? 'selected' : ''}>${s.label}</option>`).join('')}
  </select>`;
}

function setViewSeason(key) {
  _viewSeason = key;
  renderHome();
}

function goHome(){navigate('homePage');}
function showRules(){navigate('rulesPage');}
function showLiveScores(){navigate('liveScoresPage');typeof lsInit==='function'&&lsInit();}
function _rerenderPage(pageId) {
  if (pageId === 'playerRankingsPage')   typeof prInit === 'function' && prInit();
  if (pageId === 'standingsPage')        setTimeout(renderStandingsChart, 50);
  if (pageId === 'rollingStandingsPage') renderRollingStandings();
  if (pageId === 'duesPage')             renderDues();
  if (pageId === 'playerShapePage')      showPlayerShape();
  if (pageId === 'draftResultsPage')     showDraftResults();
  if (pageId === 'bestAvailPage')        showBestAvail();
  if (pageId === 'analyticsPage')        showAnalytics();
  if (pageId === 'rollingRankingsPage')  showRollingRankings();
  if (pageId === 'rulesPage')            showRules();
  if (pageId === 'liveScoresPage')       typeof lsInit === 'function' && lsInit();
  if (pageId === 'matchupPage')          typeof _mpEnsureData === 'function' && _mpEnsureData(mpInit);
}
function toggleRule(header){header.parentElement.classList.toggle('collapsed');}

