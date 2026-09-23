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
  }).filter(x => isTeamActive(TEAMS.find(t => t.id === x.tid))).sort((a,b) => b.avg - a.avg);
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
  grid.innerHTML = TEAMS.filter(isTeamActive).map(team => {
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

// ============================================================
