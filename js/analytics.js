//  TEAM ANALYTICS — Dynamic, roster-based, H2H aware
// ============================================================
const AN_CATS   = ['pV','3V','rV','aV','sV','bV','fgV','ftV','toV'];
const AN_LABELS = ['PTS','3PM','REB','AST','STL','BLK','FG%','FT%','TO'];
const AN_EMOJIS = ['🏀','3️⃣','💪','🤝','🫷','🛡️','🎯','🆓','⚠️'];

// Full roster data with per-player Z-scores and Value/BZ sort keys
// Team-Analytics-Daten kommen aus data/team-analytics.js
// (TEAM_ANALYTICS_LIVE, taeglich von scripts/build-team-analytics.js
// aus den aktuellen Projections + Live-Rostern gebaut). Der frueher
// hier eingebettete statische Block ist ersetzt -- er war veraltet und
// fuehrte Spieler ohne Daten mit -2.0-Sentinels, was die Team-Scores
// verzerrt hat. Spieler ohne Projection fehlen jetzt bewusst ganz.
const AN_ROSTER = (typeof TEAM_ANALYTICS_LIVE !== 'undefined') ? TEAM_ANALYTICS_LIVE : {};

let AN_STATE = { cutoff: 13, method: 'value' };

function anComputeScores(cutoff, method) {
  const raw = {};
  for (const [tid, players] of Object.entries(AN_ROSTER)) {
    const sorted = [...players].sort((a,b) => b[method] - a[method]).slice(0, cutoff);
    const sums = {};
    for (const c of AN_CATS) sums[c] = sorted.reduce((s,p) => s + (p[c] || 0), 0);
    raw[tid] = { sums, players: sorted };
  }
  const norm = {};
  for (const c of AN_CATS) {
    const vals = Object.values(raw).map(t => t.sums[c]);
    const mn = Math.min(...vals), mx = Math.max(...vals), rng = mx - mn || 1;
    if (c === 'toV') {
      Object.keys(raw).forEach(tid => { if (!norm[tid]) norm[tid]={}; norm[tid][c]=parseFloat((1-(raw[tid].sums[c]-mn)/rng*2).toFixed(3)); });
    } else {
      Object.keys(raw).forEach(tid => { if (!norm[tid]) norm[tid]={}; norm[tid][c]=parseFloat(((raw[tid].sums[c]-mn)/rng*2-1).toFixed(3)); });
    }
  }
  return { norm, raw };
}

function anCellColor(v) {
  const isLight = document.body.classList.contains('light');
if (v >= 0.6)  return isLight
    ? {bg:'rgba(61,138,92,0.55)',   tx:'#0d3d20',      subTx:'rgba(0,0,0,0.55)'}
    : {bg:'rgba(76,175,129,0.38)',  tx:'#c8f5e0',      subTx:'rgba(200,245,224,0.65)'};
  if (v >= 0.2)  return isLight
    ? {bg:'rgba(61,138,92,0.2)',    tx:'#1a5c30',      subTx:'rgba(0,0,0,0.45)'}
    : {bg:'rgba(76,175,129,0.18)',  tx:'#6dddaa',      subTx:'rgba(109,221,170,0.65)'};
  if (v >= -0.2) return isLight
    ? {bg:'rgba(150,150,150,0.08)', tx:'#555555',      subTx:'rgba(0,0,0,0.35)'}
    : {bg:'rgba(120,120,140,0.10)', tx:'#9ba0c0',      subTx:'rgba(155,160,192,0.6)'};
  if (v >= -0.6) return isLight
    ? {bg:'rgba(180,60,60,0.15)',   tx:'#8a1515',      subTx:'rgba(0,0,0,0.4)'}
    : {bg:'rgba(255,101,132,0.22)', tx:'#ff8fa8',      subTx:'rgba(255,143,168,0.65)'};
  return           isLight
    ? {bg:'rgba(180,60,60,0.48)',   tx:'#5a0000',      subTx:'rgba(0,0,0,0.5)'}
    : {bg:'rgba(255,101,132,0.45)', tx:'#ffe0e8',      subTx:'rgba(255,224,232,0.65)'};
}

function renderAnHeatmap() {
  const { norm } = anComputeScores(AN_STATE.cutoff, AN_STATE.method);
  const tbody = document.getElementById('anHeatmapBody');
  if (!tbody) return;
  const sorted = Object.keys(norm).map(tid => {
    const s = norm[tid];
    const avg = AN_CATS.reduce((a,c) => a+s[c], 0) / AN_CATS.length;
    return { tid: parseInt(tid), avg, s };
  }).sort((a,b) => b.avg - a.avg);
  tbody.innerHTML = sorted.map(({tid, avg, s}, ri) => {
    const team = TEAMS.find(t => t.id === tid);
    const seasonRow = SEASON_STATS[tid] || null;
    const cells = AN_CATS.map(cat => {
      const v = s[cat]; const {bg, tx, subTx} = anCellColor(v);
      const label = v > 0.05 ? '+'+v.toFixed(2) : v.toFixed(2);
      const sk = AN_CAT_TO_SEASON[cat];
      const sv = seasonRow && sk ? seasonRow[sk] : null;
      const tooltip = sv !== null ? fmtSeasonStat(cat, sv) : '';
      // For TO: invert season stat color (more TO = worse = red tint)
      // For all cats: use white/near-white for sub-label so it's readable on colored bg in dark mode
return '<td style="padding:7px 4px;text-align:center;background:'+bg+';border:none;border-bottom:1px solid var(--border);" title="'+tooltip+'">'
  + '<span style="font-size:11px;font-weight:800;color:'+tx+';">'+label+'</span>'
  + (tooltip ? '<div style="font-size:9px;color:'+(subTx||tx)+';margin-top:1px;line-height:1.1;opacity:0.85;">'+tooltip+'</div>' : '')
  + '</td>';
    }).join('');
    const avgColor = avg>0.3?'#4caf81':avg>-0.1?'var(--text)':avg>-0.4?'#f5c842':'#ff6584';
    return '<tr style="cursor:pointer;transition:filter 0.1s;'+(ri%2?'background:var(--surface2);':'')+'" onclick="openAnModal('+tid+')" onmouseenter="this.style.filter=\'brightness(1.08)\'" onmouseleave="this.style.filter=\'\'"><td style="padding:10px 14px;border:none;border-bottom:1px solid var(--border);white-space:nowrap;"><div style="display:flex;align-items:center;gap:8px;"><div style="width:10px;height:10px;border-radius:50%;background:'+(team?.color||'#888')+';flex-shrink:0;"></div><div><div style="font-size:12px;font-weight:700;color:var(--text);">'+(team?.name||'Team '+tid)+'</div><div style="font-size:10px;color:var(--muted);margin-top:3px;font-weight:500;">'+(team?.owner||'')+'</div></div></div></td>'+cells+'<td style="padding:10px 14px;text-align:center;border:none;border-bottom:1px solid var(--border);"><span style="font-family:\'Playfair Display\',serif;font-size:14px;font-weight:800;color:'+avgColor+';">'+(avg>=0?'+':'')+avg.toFixed(2)+'</span></td></tr>';
  }).join('');
}

function renderAnRadar() {
  const { norm } = anComputeScores(AN_STATE.cutoff, AN_STATE.method);
  const grid = document.getElementById('anRadarGrid');
  if (!grid) return;
  grid.innerHTML = TEAMS.map(team => {
    const s = norm[String(team.id)]; if (!s) return '';
    const avg = AN_CATS.reduce((a,c) => a+s[c],0) / AN_CATS.length;
    const bars = AN_CATS.map((c,i) => {
      const v=s[c], barH=Math.round(Math.abs(v)*28), y=v>=0?(32-barH):32, x=8+i*24;
      const col=v>=0.4?'rgba(76,175,129,0.85)':v>=0?'rgba(76,175,129,0.45)':v>=-0.4?'rgba(255,101,132,0.35)':'rgba(255,101,132,0.8)';
      return '<rect x="'+x+'" y="'+y+'" width="16" height="'+barH+'" rx="3" fill="'+col+'"/><text x="'+(x+8)+'" y="72" text-anchor="middle" font-size="8" fill="var(--muted)" font-family="DM Sans,sans-serif">'+AN_LABELS[i]+'</text>';
    }).join('');
    const avgColor=avg>0.3?'#4caf81':avg>-0.1?'var(--text)':avg>-0.4?'#f5c842':'#ff6584';
    return '<div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px;cursor:pointer;transition:border-color 0.15s;" onclick="openAnModal('+team.id+')" onmouseenter="this.style.borderColor=\''+team.color+'\'" onmouseleave="this.style.borderColor=\'var(--border)\'"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;"><div><div style="font-size:13px;font-weight:700;color:var(--text);">'+team.name+'</div><div style="font-size:10px;color:var(--muted);">'+team.owner+'</div></div><span style="font-family:\'Playfair Display\',serif;font-size:16px;font-weight:800;color:'+avgColor+';">'+(avg>=0?'+':'')+avg.toFixed(2)+'</span></div><svg viewBox="0 0 240 80" style="width:100%;overflow:visible;"><line x1="0" y1="32" x2="240" y2="32" stroke="var(--border)" stroke-width="1"/>'+bars+'</svg></div>';
  }).join('');
}

function openAnModal(tid) {
  const { norm, raw } = anComputeScores(AN_STATE.cutoff, AN_STATE.method);
  const team = TEAMS.find(t => t.id === tid);
  const s = norm[String(tid)]; const r = raw[String(tid)];
  if (!team || !s) return;
  const avg = AN_CATS.reduce((a,c)=>a+s[c],0)/AN_CATS.length;
  const avgColor = avg>0.3?'#4caf81':avg>-0.1?'var(--text)':avg>-0.4?'#f5c842':'#ff6584';
  const sc = AN_CATS.map((c,i)=>({c,label:AN_LABELS[i],emoji:AN_EMOJIS[i],v:s[c]})).sort((a,b)=>b.v-a.v);
  const best=sc[0], worst=sc[sc.length-1];
  const seasonData = SEASON_STATS[tid] || null;
  const catBars = sc.map(({c,label,emoji,v}) => {
    const pct=Math.round((v+1)/2*100), disp=v>=0?'+'+v.toFixed(2):v.toFixed(2);
    const col=v>=0.5?'#4caf81':v>=0.1?'#a0d4b8':v>=-0.1?'var(--border)':v>=-0.5?'#ff9999':'#ff6584';
    const seasonKey = AN_CAT_TO_SEASON[c];
    const seasonVal = seasonData && seasonKey ? seasonData[seasonKey] : null;
    // For TO: season stat color should reflect that high TO = bad (inverted)
    const seasonColor = (c === 'toV')
      ? (seasonVal > 90 ? '#ff6584' : seasonVal > 75 ? '#ff9999' : '#a0d4b8')  // > liga avg ~82 = bad
      : 'var(--muted)';
    const seasonStr = seasonVal !== null ? '<span style="font-size:10px;font-weight:600;color:'+seasonColor+';margin-left:6px;">'+fmtSeasonStat(c, seasonVal)+'</span>' : '';
    return '<div style="margin-bottom:7px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;"><span style="font-size:12px;font-weight:700;color:var(--text);">'+emoji+' '+label+seasonStr+'</span><span style="font-size:12px;font-weight:800;color:'+col+';">'+disp+'</span></div><div style="background:var(--surface2);border-radius:4px;height:8px;overflow:hidden;"><div style="width:'+pct+'%;height:100%;background:'+col+';border-radius:4px;"></div></div></div>';
  }).join('');
  const mLabel = AN_STATE.method==='value'?'Per-Game Value':'Durability (BZ)';
  const topP = r.players.slice(0,8).map(p=>'<span style="font-size:10px;font-weight:600;background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:2px 7px;color:var(--muted);">'+p.name+'</span>').join(' ');
  document.getElementById('anModalContent').innerHTML =
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;"><div style="width:14px;height:14px;border-radius:50%;background:'+team.color+';flex-shrink:0;"></div><div style="font-family:\'Playfair Display\',serif;font-size:20px;font-weight:800;color:var(--text);">'+team.name+'</div></div>'+
    '<div style="font-size:11px;color:var(--muted);margin-bottom:2px;">'+team.owner+' · Top '+AN_STATE.cutoff+' · '+mLabel+'</div>'+
    '<div style="font-size:12px;color:var(--muted);margin-bottom:10px;">Ø Liga-Score: <strong style="color:'+avgColor+';font-size:15px;">'+(avg>=0?'+':'')+avg.toFixed(2)+'</strong></div>'+
    '<div style="display:flex;gap:8px;margin-bottom:12px;">'+
    '<div style="flex:1;background:rgba(76,175,129,0.1);border:1px solid rgba(76,175,129,0.3);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:9px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">💪 Stärke</div><div style="font-size:14px;font-weight:800;color:#4caf81;">'+best.emoji+' '+best.label+'</div><div style="font-size:11px;color:#4caf81;">'+(best.v>=0?'+':'')+best.v.toFixed(2)+'</div></div>'+
    '<div style="flex:1;background:rgba(255,101,132,0.1);border:1px solid rgba(255,101,132,0.3);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:9px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">⚠️ Schwäche</div><div style="font-size:14px;font-weight:800;color:#ff6584;">'+worst.emoji+' '+worst.label+'</div><div style="font-size:11px;color:#ff6584;">'+worst.v.toFixed(2)+'</div></div></div>'+
    '<div style="font-size:9px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Spieler in dieser Analyse (Top '+AN_STATE.cutoff+')</div>'+
    '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:14px;">'+topP+'</div>'+
    '<div style="border-top:1px solid var(--border);padding-top:12px;">'+catBars+'</div>';
  document.getElementById('anModal').style.display = 'flex';
}

function closeAnModal() { document.getElementById('anModal').style.display = 'none'; }
function setAnView(view) {
  document.getElementById('anHeatmapView').style.display=view==='heatmap'?'':'none';
  document.getElementById('anRadarView').style.display=view==='radar'?'':'none';
  document.getElementById('anViewHeatmap').style.background=view==='heatmap'?'var(--accent)':'transparent';
  document.getElementById('anViewHeatmap').style.color=view==='heatmap'?'white':'var(--muted)';
  document.getElementById('anViewRadar').style.background=view==='radar'?'var(--accent)':'transparent';
  document.getElementById('anViewRadar').style.color=view==='radar'?'white':'var(--muted)';
  if (view==='radar') renderAnRadar();
}
function setAnMethod(method) {
  AN_STATE.method=method;
  document.getElementById('anMethodValue').style.background=method==='value'?'var(--accent)':'transparent';
  document.getElementById('anMethodValue').style.color=method==='value'?'white':'var(--muted)';
  document.getElementById('anMethodBz').style.background=method==='bz'?'var(--accent)':'transparent';
  document.getElementById('anMethodBz').style.color=method==='bz'?'white':'var(--muted)';
  renderAnHeatmap();
  if (document.getElementById('anRadarView').style.display!=='none') renderAnRadar();
}
function setAnCutoff(n) {
  AN_STATE.cutoff=parseInt(n);
  document.getElementById('anCutoffLabel').textContent='Top '+n;
  renderAnHeatmap();
  if (document.getElementById('anRadarView').style.display!=='none') renderAnRadar();
}
function showAnalytics() { renderAnHeatmap(); navigate('analyticsPage'); }

const LOTTERY_DATA = [
  { tt: 1,  nba: 'Washington Wizards',  ttTeam: 'Fighting Illini via Double Dribble Trouble', nonPlayoff: true,
    odds: [14, 13.4, 12.7, 12, 47.9, null, null, null, null, null, null], avg: 3.7 },
  { tt: 2,  nba: 'Indiana Pacers',       ttTeam: 'Vancouver Curry-Wurst',                      nonPlayoff: true,
    odds: [14, 13.4, 12.7, 12, 27.8, 20.1, null, null, null, null, null], avg: 3.9 },
  { tt: 3,  nba: 'Brooklyn Nets',        ttTeam: 'Fighting Illini via S-Town Grizzlies',       nonPlayoff: true,
    odds: [14, 13.4, 12.7, 12, 14.8, 26, 7, null, null, null, null], avg: 4.1 },
  { tt: 4,  nba: 'Utah Jazz',            ttTeam: 'Fighting Illini via Cooking Show',           nonPlayoff: true,
    odds: [11.5, 11.4, 11.2, 11, 7.5, 27.1, 17.9, 2.4, null, null, null], avg: 4.6 },
  { tt: 5,  nba: 'Sacramento Kings',     ttTeam: 'Kawhi So Serious',                           nonPlayoff: false,
    odds: [11.5, 11.4, 11.2, 11, 2, 18.2, 25.5, 8.5, 0.6, null, null], avg: 4.8 },
  { tt: 6,  nba: 'Memphis Grizzlies',    ttTeam: 'Fighting Illini via Always Money In The Bananastand', nonPlayoff: false,
    odds: [9, 9.2, 9.4, 9.6, null, 8.6, 29.7, 20.6, 3.7, 0.2, null], avg: 5.5 },
  { tt: 7,  nba: 'New Orleans Pelicans', ttTeam: 'Anadolu Ballers',                            nonPlayoff: false,
    odds: [6.8, 7.1, 7.5, 7.9, null, null, 19.8, 35.6, 13.8, 1.4, 0.1], avg: 6.4 },
  { tt: 8,  nba: 'Dallas Mavericks',     ttTeam: 'Fighting Illini via 3-Point Mafia',          nonPlayoff: false,
    odds: [6.7, 7, 7.4, 7.8, null, null, null, 32.9, 31.1, 6.6, 0.4], avg: 6.9 },
  { tt: 9,  nba: 'Chicago Bulls',        ttTeam: 'Fighting Illini via Leaveland Cavaliers',    nonPlayoff: false,
    odds: [4.5, 4.8, 5.2, 5.7, null, null, null, null, 50.8, 25.9, 3], avg: 8 },
  { tt: 10, nba: 'Milwaukee Bucks',      ttTeam: 'Fighting Illini via Neukölln Hustlers',      nonPlayoff: false,
    odds: [3, 3.3, 3.6, 4, null, null, null, null, null, 65.9, 19], avg: 9.2 },
  { tt: 11, nba: 'GSW',                  ttTeam: 'Seagulls',                                   nonPlayoff: false,
    odds: [2, 2.2, 2.4, 2.8, null, null, null, null, null, null, 77.6], avg: 10.3 },
  { tt: 12, nba: '—',                    ttTeam: 'Fighting Illini',                            champion: true,
    odds: [null, null, null, null, null, null, null, null, null, null, null], avg: 12 },
];

function lotteryHeatColor(val) {
  if (val === null) return { bg: 'transparent', text: 'var(--border)' };
  if (val >= 40)  return { bg: 'rgba(76,175,129,0.55)',  text: '#fff' };
  if (val >= 20)  return { bg: 'rgba(76,175,129,0.30)',  text: '#4caf81' };
  if (val >= 10)  return { bg: 'rgba(245,200,66,0.35)',  text: '#c8a020' };
  if (val >= 5)   return { bg: 'rgba(245,200,66,0.18)',  text: '#b89010' };
  if (val >= 1)   return { bg: 'rgba(255,101,132,0.22)', text: '#ff6584' };
  return           { bg: 'rgba(255,101,132,0.10)',        text: '#ff8fa3' };
}
function lotteryHeatColorLight(val) {
  if (val === null) return { bg: 'transparent', text: '#ddd' };
  if (val >= 40)  return { bg: 'rgba(61,138,92,0.55)',   text: '#fff' };
  if (val >= 20)  return { bg: 'rgba(61,138,92,0.25)',   text: '#2d7a50' };
  if (val >= 10)  return { bg: 'rgba(180,130,20,0.25)',  text: '#8a6000' };
  if (val >= 5)   return { bg: 'rgba(180,130,20,0.12)',  text: '#9a7010' };
  if (val >= 1)   return { bg: 'rgba(180,60,100,0.18)',  text: '#b43c64' };
  return           { bg: 'rgba(180,60,100,0.08)',         text: '#c05070' };
}

function renderLottery() {
  const isLight = document.body.classList.contains('light');
  const colorFn = isLight ? lotteryHeatColorLight : lotteryHeatColor;
  const tbody = document.getElementById('lotteryBody');
  if (!tbody) return;

  tbody.innerHTML = LOTTERY_DATA.map((row, ri) => {
    const isChamp = row.champion;
    const isNP    = row.nonPlayoff;

    const tag = isChamp
      ? `<span style="font-size:9px;font-weight:800;background:rgba(245,200,66,0.2);color:#f5c842;padding:1px 6px;border-radius:8px;margin-left:6px;">🏆 Champ</span>`
      : isNP
      ? `<span style="font-size:9px;font-weight:800;background:rgba(108,99,255,0.15);color:var(--accent);padding:1px 6px;border-radius:8px;margin-left:6px;">Non-PO</span>`
      : '';

    const cells = row.odds.map((val, ci) => {
      const { bg, text } = colorFn(val);
      const display = val === null ? '' : val < 1 ? '>0' : val.toLocaleString('de-DE');
      const borderRight = ci === 10 ? `border-right:2px solid var(--border);` : '';
      return `<td style="padding:8px 4px;text-align:center;background:${bg};border:none;border-bottom:1px solid var(--border);${borderRight}">
        <span style="font-size:11px;font-weight:700;color:${text};">${display}</span>
      </td>`;
    }).join('');

    const avgColor = isChamp ? 'var(--muted)' : 'var(--text)';
    const rowBg = ri % 2 === 0 ? '' : `background:var(--surface2);`;

    return `<tr style="cursor:${isChamp ? 'default' : 'pointer'};transition:filter 0.1s;${rowBg}"
      onclick="${isChamp ? '' : `openLotteryModal(${ri})`}"
      onmouseenter="if(${!isChamp})this.style.filter='brightness(1.1)'"
      onmouseleave="this.style.filter=''">
      <td style="padding:10px 14px;border:none;border-bottom:1px solid var(--border);white-space:nowrap;">
        <span style="font-size:12px;font-weight:600;color:var(--text);">${row.nba}</span>
      </td>
      <td style="padding:10px 14px;border:none;border-bottom:1px solid var(--border);">
        <span style="font-size:12px;font-weight:600;color:var(--text);">${row.ttTeam}</span>${tag}
      </td>
      ${cells}
      <td style="padding:10px 14px;text-align:center;border:none;border-bottom:1px solid var(--border);">
        <span style="font-family:'Playfair Display',serif;font-size:14px;font-weight:800;color:${avgColor};">${isChamp ? '#12' : row.avg}</span>
      </td>
    </tr>`;
  }).join('');
}

function openLotteryModal(idx) {
  const row = LOTTERY_DATA[idx];
  if (!row || row.champion) return;
  const isLight = document.body.classList.contains('light');

  // Build bar chart
  const maxVal = Math.max(...row.odds.filter(v => v !== null));
  const bars = row.odds.map((val, i) => {
    if (val === null) return '';
    const pct   = Math.round((val / maxVal) * 100);
    const { bg } = (isLight ? lotteryHeatColorLight : lotteryHeatColor)(val);
    const barColor = val >= 20 ? 'var(--green)' : val >= 10 ? '#f5c842' : 'var(--accent)';
    const display  = val < 1 ? '>0,0%' : val.toLocaleString('de-DE') + '%';
    return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
      <div style="font-size:11px;font-weight:700;color:var(--muted);width:24px;text-align:right;flex-shrink:0;">#${i+1}</div>
      <div style="flex:1;background:var(--surface2);border-radius:4px;height:20px;overflow:hidden;">
        <div style="width:${pct}%;height:100%;background:${barColor};border-radius:4px;transition:width 0.4s ease;"></div>
      </div>
      <div style="font-size:11px;font-weight:800;color:var(--text);width:44px;text-align:right;flex-shrink:0;">${display}</div>
    </div>`;
  }).join('');

  const tag = row.nonPlayoff
    ? `<span style="font-size:10px;font-weight:700;background:rgba(108,99,255,0.15);color:var(--accent);padding:2px 8px;border-radius:10px;margin-left:6px;">Non-Playoff · max. #6</span>`
    : '';

  document.getElementById('lotteryModalContent').innerHTML = `
    <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:4px;">${row.nba}</div>
    <div style="font-family:'Playfair Display',serif;font-size:18px;font-weight:800;color:var(--text);margin-bottom:2px;">${row.ttTeam}${tag}</div>
    <div style="font-size:12px;color:var(--muted);margin-bottom:16px;">Ø Pick: <strong style="color:var(--accent);">${row.avg}</strong></div>
    <div style="border-top:1px solid var(--border);padding-top:14px;">${bars}</div>`;

  const modal = document.getElementById('lotteryModal');
  modal.style.display = 'flex';
}

function closeLotteryModal() {
  document.getElementById('lotteryModal').style.display = 'none';
}

function showLottery() {
  renderLottery();
  navigate('lotteryPage');
}

// ============================================================
