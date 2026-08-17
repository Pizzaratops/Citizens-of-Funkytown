// ============================================================
//  NBA TEAM PAGE
// ============================================================
const NBA_TEAM_NAMES = {
  ATL:'Atlanta Hawks', BOS:'Boston Celtics', BKN:'Brooklyn Nets',
  CHA:'Charlotte Hornets', CHI:'Chicago Bulls', CLE:'Cleveland Cavaliers',
  DAL:'Dallas Mavericks', DEN:'Denver Nuggets', DET:'Detroit Pistons',
  GSW:'Golden State Warriors', HOU:'Houston Rockets', IND:'Indiana Pacers',
  LAC:'LA Clippers', LAL:'LA Lakers', MEM:'Memphis Grizzlies',
  MIA:'Miami Heat', MIL:'Milwaukee Bucks', MIN:'Minnesota Timberwolves',
  NOR:'New Orleans Pelicans', NOP:'New Orleans Pelicans', NYK:'New York Knicks',
  OKC:'Oklahoma City Thunder', ORL:'Orlando Magic', PHI:'Philadelphia 76ers',
  PHO:'Phoenix Suns', POR:'Portland Trail Blazers', SAC:'Sacramento Kings',
  SAS:'San Antonio Spurs', TOR:'Toronto Raptors', UTA:'Utah Jazz',
  WAS:'Washington Wizards', FA:'Free Agent',
};

function buildFantasyOwnerMap() {
  const map = {};
  Object.entries(ROSTERS).forEach(([teamId, roster]) => {
    roster.forEach(p => { map[normalizeName(p.name)] = parseInt(teamId); });
  });
  return map;
}

function showNBATeam(abbr) {
  const fullName = NBA_TEAM_NAMES[abbr] || abbr;
  const fantasyOwners = buildFantasyOwnerMap();

  const ranked = DYNASTY_PLAYERS
    .filter(p => p[2] === abbr)
    .map(p => {
      const ownerId = fantasyOwners[normalizeName(p[1])] || null;
      const owner = ownerId ? teamMap[ownerId] : null;
      return { rank: p[0], name: p[1], pos: p[3], owner };
    });

  ranked.sort((a, b) => a.rank - b.rank);

  const isLight = document.body.classList.contains('light');

  let headerHtml = `<div class="nba-team-hero">
    <div class="nba-team-abbr">${abbr}</div>
    <div>
      <div class="nba-team-title">${fullName}</div>
      <div class="nba-team-sub">${ranked.length} ranked player${ranked.length!==1?'s':''} · sorted by dynasty rank</div>
    </div>
  </div>`;

  let rows = '';
  if (!ranked.length) {
    rows = '<p style="color:var(--muted);padding:20px 0;">No ranked players on this team.</p>';
  } else {
    ranked.forEach(p => {
      let bg, color;
      const r = p.rank;
      if (r === 1)      { bg='rgba(245,200,66,0.15)';  color='#f5c842'; }
      else if (r <= 5)  { bg='rgba(108,99,255,0.15)';  color='#a89bff'; }
      else if (r <= 15) { bg='rgba(76,175,129,0.15)';  color='#6dddaa'; }
      else if (r <= 30) { bg='rgba(41,182,246,0.15)';  color='#4fc3f7'; }
      else if (r <= 75) { bg='rgba(255,101,132,0.12)'; color='#ff8fa3'; }
      else              { bg='rgba(123,127,158,0.12)'; color='var(--muted)'; }

      const ownerColor = p.owner ? (isLight ? p.owner.lightColor : p.owner.color) : null;
      const ownerTag = p.owner
        ? `<span class="nba-owner-tag" style="border-color:${ownerColor}44;color:${ownerColor};" onclick="showTeam(${p.owner.id})" title="Go to ${p.owner.name}">${p.owner.name}</span>`
        : `<span class="nba-owner-tag">Unowned</span>`;

      const posCls = `pos-${p.pos.split('/')[0]}`;
      rows += `<div class="nba-player-row">
        <span class="nba-rank-badge" style="background:${bg};color:${color};border-radius:8px;padding:4px 6px;">#${r}</span>
        <div class="pos-badge ${posCls}">${p.pos.split('/')[0]}</div>
        <div style="flex:1;font-weight:600;font-size:14px;color:var(--text);">${p.name}</div>
        ${ownerTag}
      </div>`;
    });
  }

  document.getElementById('nbaTeamHeader').innerHTML = headerHtml;
  document.getElementById('nbaTeamContent').innerHTML = rows;
  navigate('nbaTeamPage');
}
