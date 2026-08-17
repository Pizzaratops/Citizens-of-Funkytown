//  DRAFT DUEL SYSTEM
// ============================================================
const DUEL_ADMIN_PIN    = '0815';
const DUEL_VOTE_KEY     = 'mfhfbs_duel_votes_v1';
const DUEL_SESSION_KEY  = 'mfhfbs_duel_session_v1';
const DUEL_ADMIN_WEIGHT = 3;
const DUEL_USER_WEIGHT  = 1;

const DUEL_TIER_COLORS = {
  'Tier 1':'#f5d97a','Tier 1.5':'#ffcc80','Tier 2':'#a89bff',
  'Tier 3':'#6dddaa','Tier 4':'#4fc3f7','Tier 5':'#ff8fa3',
  'Tier 6':'#7b7f9e','Mystery':'#c792ea'
};
const DUEL_TIER_LABELS = {
  'Tier 1':'Tier 1','Tier 1.5':'Tier 1.5','Tier 2':'Tier 2',
  'Tier 3':'Tier 3','Tier 4':'Tier 4','Tier 5':'Tier 5',
  'Tier 6':'Tier 6','Mystery':'Mystery'
};

let duelIsAdmin      = false;
let duelVotes        = {};
let duelVisitedPairs = new Set();
let duelCurrentPair  = null;

async function duelStorageGet(key, shared) {
  if (window.storage) {
    try { const r = await window.storage.get(key, shared); return r ? r.value : null; } catch(e) { return null; }
  }
  return localStorage.getItem(key);
}
async function duelStorageSet(key, value, shared) {
  if (window.storage) { try { await window.storage.set(key, value, shared); } catch(e) {} }
  else { localStorage.setItem(key, value); }
}
async function duelStorageDel(key, shared) {
  if (window.storage) { try { await window.storage.delete(key, shared); } catch(e) {} }
  else { localStorage.removeItem(key); }
}

async function duelLoadAll() {
  const vRaw = await duelStorageGet(DUEL_VOTE_KEY, true);
  duelVotes = vRaw ? JSON.parse(vRaw) : {};
  const sRaw = await duelStorageGet(DUEL_SESSION_KEY, false);
  if (sRaw) { try { duelVisitedPairs = new Set(JSON.parse(sRaw)); } catch(e) { duelVisitedPairs = new Set(); } }
}
async function duelSaveVotes()   { await duelStorageSet(DUEL_VOTE_KEY,    JSON.stringify(duelVotes),             true);  }
async function duelSaveSession() { await duelStorageSet(DUEL_SESSION_KEY, JSON.stringify([...duelVisitedPairs]), false); }

function duelPairKey(a, b) { return a < b ? a+'_'+b : b+'_'+a; }
function duelVoteKey(w, l) { return 'w'+w+'_l'+l; }

function duelGetAllPairs() {
  const pairs = [];
  for (let i = 0; i < DRAFT_2026.length; i++)
    for (let j = i+1; j < DRAFT_2026.length; j++)
      pairs.push([DRAFT_2026[i].pick, DRAFT_2026[j].pick]);
  return pairs;
}

/* duelGetNextPair: replaced by ELO system */

function duelRenderCard(el, p) {
  if (!el || !p) return;
  const color = DUEL_TIER_COLORS[p.tier] || '#888';
  const posBg = {PG:'rgba(108,99,255,.2)',SG:'rgba(255,101,132,.2)',SF:'rgba(76,175,129,.2)',PF:'rgba(245,200,66,.2)',C:'rgba(41,182,246,.2)'};
  const posTx = {PG:'#a89bff',SG:'#ff8fa3',SF:'#6dddaa',PF:'#f5c842',C:'#4fc3f7'};
  const iid   = 'duel_intel_' + p.pick;

  // Build intel panel content
  const hasIntel = p.scouting || p.fantasy;
  const intelBar = hasIntel ? (
    '<div class="duel-intel-bar" onclick="toggleDuelIntel(\'' + iid + '\')">'
    + '<span>&#128269; Scout Intel</span>'
    + '<span id="' + iid + '_arrow" style="transition:transform .2s;">&#9662;</span>'
    + '</div>'
    + '<div class="duel-intel-panel" id="' + iid + '" onclick="event.stopPropagation()">'
      + (p.fantasy ? '<div style="background:var(--accent-light);border:1px solid rgba(108,99,255,.25);border-radius:8px;padding:8px 10px;margin-bottom:8px;font-size:11px;font-weight:600;color:var(--accent);line-height:1.6;">' + p.fantasy + '</div>' : '')
      + (p.scouting ? '<div style="font-size:12px;line-height:1.7;color:var(--text);">' + p.scouting + '</div>' : '')
    + '</div>'
  ) : '';

  // Replace el content with wrapped card
  el.style.cssText = '';
  el.className = '';
  el.innerHTML =
    '<div class="duel-card-wrap">'
    + '<div class="duel-card-main" onclick="duelVote(\'' + el.id.replace('duelCard','') + '\')">'
      + '<div style="width:8px;height:8px;border-radius:50%;background:'+color+';margin-bottom:10px;flex-shrink:0;"></div>'
      + '<div style="font-family:\'Playfair Display\',serif;font-size:28px;font-weight:800;color:'+color+';line-height:1;margin-bottom:8px;">'+p.pick+'</div>'
      + '<div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:4px;line-height:1.3;">'+p.name+'</div>'
      + '<div style="font-size:11px;color:var(--muted);margin-bottom:8px;">'+(p.school||'—')+'</div>'
      + '<span style="font-size:10px;font-weight:800;padding:2px 8px;border-radius:6px;background:'+(posBg[p.pos]||posBg.SF)+';color:'+(posTx[p.pos]||posTx.SF)+';">'+p.pos+'</span>'
      + '<div style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-top:6px;">'+(DUEL_TIER_LABELS[p.tier]||'')+'</div>'
    + '</div>'
    + intelBar
    + '</div>';
}

function toggleDuelIntel(id) {
  const panel = document.getElementById(id);
  const arrow = document.getElementById(id + '_arrow');
  if (!panel) return;
  const open = panel.style.display === 'none' || panel.style.display === '';
  panel.style.display = open ? 'block' : 'none';
  if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : '';
}

function duelShowDuel() {
  const content = document.getElementById('duelContent');
  if (!content) return;
  const pair       = duelGetNextPair();
  const total      = duelGetAllPairs().length;
  const done       = duelVisitedPairs.size;
  const pct        = Math.round(done / total * 100);
  const totalVotes = Object.values(duelVotes).reduce((s,v)=>s+v, 0);

  if (!pair) {
    content.innerHTML =
      '<div style="text-align:center;padding:50px 20px;">'+
      '<div style="font-family:\'Playfair Display\',serif;font-size:52px;font-weight:800;color:var(--accent);margin-bottom:14px;">✓</div>'+
      '<div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:8px;">Alle '+total+' Duelle bewertet!</div>'+
      '<p style="color:var(--muted);font-size:14px;line-height:1.6;margin-bottom:20px;">Schau dir das Duel Board an.</p>'+
      '<button onclick="duelResetMySession()" style="background:var(--surface2);border:1px solid var(--border);color:var(--text);padding:10px 20px;border-radius:10px;font-size:13px;font-weight:700;font-family:\'DM Sans\',sans-serif;cursor:pointer;">Nochmal von vorne</button>'+
      '</div>';
    return;
  }

  duelCurrentPair = pair;
  const pA = DRAFT_2026.find(p => p.pick === pair[0]);
  const pB = DRAFT_2026.find(p => p.pick === pair[1]);

  content.innerHTML =
    '<div style="display:grid;grid-template-columns:1fr 40px 1fr;gap:10px;align-items:stretch;margin-bottom:16px;">'+
      '<div id="duelCardA" style=""></div>'+
      '<div style="display:flex;align-items:center;justify-content:center;"><div style="font-family:\'Playfair Display\',serif;font-size:18px;font-weight:800;color:var(--muted);">vs</div></div>'+
      '<div id="duelCardB" style=""></div>'+
    '</div>'+
    '<div style="text-align:center;font-size:12px;color:var(--muted);margin-bottom:12px;">'+
      totalVotes+' Votes insgesamt · '+(duelIsAdmin?'⭐ Admin (3× Gewicht)':'User (1× Gewicht)')+
    '</div>'+
    '<button onclick="duelSkip()" style="display:block;margin:0 auto 20px;font-size:12px;color:var(--muted);background:none;border:none;cursor:pointer;text-decoration:underline;font-family:\'DM Sans\',sans-serif;">Dieses Duell überspringen →</button>'+
    '<div>'+
      '<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-bottom:5px;">'+
        '<span>'+done+' von '+total+' Duellen</span><span>'+pct+'%</span>'+
      '</div>'+
      '<div style="background:var(--surface2);border-radius:4px;height:4px;overflow:hidden;">'+
        '<div style="height:4px;background:var(--accent);border-radius:4px;width:'+pct+'%;transition:width .4s;"></div>'+
      '</div>'+
    '</div>';

  duelRenderCard(document.getElementById('duelCardA'), pA);
  duelRenderCard(document.getElementById('duelCardB'), pB);
}

async function duelVote(side) {
  if (!duelCurrentPair) return;
  const [idA, idB] = duelCurrentPair;
  const winner = side === 'A' ? idA : idB;
  const loser  = side === 'A' ? idB : idA;
  const w      = duelIsAdmin ? DUEL_ADMIN_WEIGHT : DUEL_USER_WEIGHT;
  const k      = duelVoteKey(winner, loser);
  duelVotes[k] = (duelVotes[k] || 0) + w;
  duelVisitedPairs.add(duelPairKey(idA, idB));
  const winName = DRAFT_2026.find(p => p.pick === winner)?.name || '';
  if (typeof toast === 'function') toast('+'+w+' Vote'+(w>1?'s':'')+' → '+winName);
  const winCard = document.getElementById('duelCard'+side);
  const losCard = document.getElementById(side==='A'?'duelCardB':'duelCardA');
  if (winCard) { winCard.style.borderColor='var(--green)'; winCard.style.background='rgba(76,175,129,.07)'; }
  if (losCard) { losCard.style.opacity='.35'; losCard.style.pointerEvents='none'; }
  await duelSaveVotes();
  await duelSaveSession();
  setTimeout(() => duelShowDuel(), 520);
}

async function duelSkip() {
  if (!duelCurrentPair) return;
  duelVisitedPairs.add(duelPairKey(...duelCurrentPair));
  await duelSaveSession();
  duelShowDuel();
}

// ── ELO ENGINE ───────────────────────────────────────────────────────────────

// Starting ELO based on draft position: Pick 1 = 1800, Pick 60 = 1100
function duelStartElo(pick) {
  const maxPick = DRAFT_2026.length;
  return Math.round(1800 - ((pick - 1) / (maxPick - 1)) * 700);
}

// Dynamic K-factor: high when few games played (uncertain), lower later (stable)
function duelKFactor(gamesPlayed) {
  if (gamesPlayed < 10) return 40;
  if (gamesPlayed < 20) return 30;
  return 20;
}

// ELO expected score for player A vs player B
function duelExpected(eloA, eloB) {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

// Compute full ELO table from all stored votes (live recalc from vote history)
function duelComputeElo() {
  const elo   = {};
  const games = {};
  DRAFT_2026.forEach(p => {
    elo[p.pick]   = duelStartElo(p.pick);
    games[p.pick] = 0;
  });
  // Replay every stored vote — admin 3x votes replay 3 times (correct)
  Object.entries(duelVotes).forEach(([k, weight]) => {
    const m = k.match(/^w(\d+)_l(\d+)$/);
    if (!m) return;
    const wId = parseInt(m[1]);
    const lId = parseInt(m[2]);
    if (elo[wId] === undefined || elo[lId] === undefined) return;
    for (let i = 0; i < weight; i++) {
      const eA   = elo[wId], eB = elo[lId];
      const expA = duelExpected(eA, eB);
      elo[wId]   = Math.round(eA + duelKFactor(games[wId]) * (1 - expA));
      elo[lId]   = Math.round(eB + duelKFactor(games[lId]) * (0 - (1 - expA)));
      games[wId]++;
      games[lId]++;
    }
  });
  return { elo, games };
}

// Total weighted vote count
function duelTotalVotes() {
  return Object.values(duelVotes).reduce((s, v) => s + v, 0);
}

// ── ELO MATCHMAKING ──────────────────────────────────────────────────────────

function duelGetNextPair() {
  const all    = duelGetAllPairs();
  const unseen = all.filter(([a, b]) => !duelVisitedPairs.has(duelPairKey(a, b)));
  if (!unseen.length) return null;

  const totalV = duelTotalVotes();

  // Bootstrap phase: first 30 votes are fully random to seed the ELO table
  if (totalV < 30) {
    return unseen[Math.floor(Math.random() * unseen.length)];
  }

  const { elo, games } = duelComputeElo();

  // Score each unseen pair:
  //   - Closer ELO = more informative matchup = higher score
  //   - Fewer games played = more uncertain = bonus score
  //   - Random noise prevents always repeating the same pair
  const scored = unseen.map(([a, b]) => {
    const diff     = Math.abs((elo[a] || 1400) - (elo[b] || 1400));
    const minGames = Math.min(games[a] || 0, games[b] || 0);
    const score    = (1 / (diff + 1)) + (1 / (minGames + 1)) * 200 + Math.random() * 0.3;
    return { pair: [a, b], score };
  });

  // Weighted random from top 10 candidates
  scored.sort((a, b) => b.score - a.score);
  const candidates  = scored.slice(0, 10);
  const totalScore  = candidates.reduce((s, c) => s + c.score, 0);
  let rand = Math.random() * totalScore;
  for (const c of candidates) {
    rand -= c.score;
    if (rand <= 0) return c.pair;
  }
  return candidates[0].pair;
}

// ── BOARD (ELO-sorted) ───────────────────────────────────────────────────────

function duelRenderBoard() {
  const { elo, games } = duelComputeElo();
  const totalV = duelTotalVotes();

  const badge = document.getElementById('duelTotalVotesBadge');
  if (badge) badge.textContent = totalV + ' Vote' + (totalV !== 1 ? 's' : '');

  const sorted   = [...DRAFT_2026].sort((a, b) => (elo[b.pick] || 0) - (elo[a.pick] || 0));
  const maxElo   = Math.max(...sorted.map(p => elo[p.pick] || 0));
  const minElo   = Math.min(...sorted.map(p => elo[p.pick] || 0));
  const eloRange = maxElo - minElo || 1;

  const listEl = document.getElementById('duelBoardList');
  if (!listEl) return;

  if (!totalV) {
    listEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted);font-size:13px;">Noch keine Votes — mach das erste Duell!</div>';
    return;
  }

  const medals = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49'];
  const posTx  = { PG:'#a89bff', SG:'#ff8fa3', SF:'#6dddaa', PF:'#f5c842', C:'#4fc3f7' };
  const posBg  = { PG:'rgba(108,99,255,.12)', SG:'rgba(255,101,132,.12)', SF:'rgba(76,175,129,.12)', PF:'rgba(245,200,66,.12)', C:'rgba(41,182,246,.12)' };

  listEl.innerHTML = sorted.map((p, i) => {
    const eloVal  = elo[p.pick]  || duelStartElo(p.pick);
    const gPlayed = games[p.pick] || 0;
    const pct     = Math.round((eloVal - minElo) / eloRange * 100);
    const color   = DUEL_TIER_COLORS[p.tier] || '#888';
    const rank    = i < 3 ? medals[i] : '#' + (i + 1);
    // Confidence dot: green = 10+ games, yellow = 5-9, red = <5
    const confColor = gPlayed >= 10 ? '#4caf81' : gPlayed >= 5 ? '#f5c842' : '#ff8fa3';

    return '<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:12px 14px;display:flex;align-items:center;gap:12px;margin-bottom:7px;transition:border-color .15s;" '
      + 'onmouseenter="this.style.borderColor=\'var(--accent)\'" onmouseleave="this.style.borderColor=\'var(--border)\'">'
      + '<div style="font-family:\'Playfair Display\',serif;font-size:16px;font-weight:800;min-width:32px;text-align:center;color:' + color + ';">' + rank + '</div>'
      + '<div style="flex:1;min-width:0;">'
        + '<div style="font-size:13px;font-weight:700;color:var(--text);">' + p.name + '</div>'
        + '<div style="font-size:11px;color:var(--muted);margin-top:2px;">Pick #' + p.pick + ' \u00B7 ' + (p.school || '\u2014') + ' \u00B7 '
          + '<span style="font-size:9px;font-weight:800;padding:1px 5px;border-radius:4px;background:' + (posBg[p.pos] || 'rgba(123,127,158,.12)') + ';color:' + (posTx[p.pos] || '#888') + ';">' + p.pos + '</span>'
        + '</div>'
      + '</div>'
      + '<div style="text-align:right;flex-shrink:0;">'
        + '<div style="display:flex;align-items:center;gap:5px;justify-content:flex-end;">'
          + '<span style="font-size:8px;color:' + confColor + ';" title="' + gPlayed + ' Duelle gespielt">\u25CF</span>'
          + '<div style="font-size:12px;font-weight:800;color:var(--accent);">' + eloVal + '</div>'
        + '</div>'
        + '<div style="width:60px;height:4px;background:var(--surface2);border-radius:2px;overflow:hidden;margin-top:4px;">'
          + '<div style="width:' + pct + '%;height:4px;background:var(--accent);border-radius:2px;"></div>'
        + '</div>'
        + '<div style="font-size:9px;color:var(--muted);margin-top:2px;">' + gPlayed + ' Duelle</div>'
      + '</div>'
      + '</div>';
  }).join('');
}


function duelCheckPin() {
  const v = document.getElementById('duelPinInput')?.value?.trim();
  if (v === DUEL_ADMIN_PIN) {
    duelIsAdmin = true;
    const badge = document.getElementById('duelAdminBadge');
    if (badge) { badge.textContent='⭐ Admin (3×)'; badge.style.background='rgba(245,200,66,.15)'; badge.style.borderColor='rgba(245,200,66,.4)'; badge.style.color='#f5c842'; }
    const sec = document.getElementById('duelAdminOnlySection');
    if (sec) sec.style.display = '';
    if (document.getElementById('duelPinInput')) document.getElementById('duelPinInput').value = '';
    if (typeof toast === 'function') toast('Admin-Modus aktiv — dein Vote zählt 3×!');
  } else {
    if (typeof toast === 'function') toast('Falscher PIN.');
  }
}

async function duelResetMySession() {
  duelVisitedPairs = new Set();
  await duelSaveSession();
  if (typeof toast === 'function') toast('Session zurückgesetzt.');
  duelShowDuel();
}

async function duelResetAllVotes() {
  if (!duelIsAdmin) { if (typeof toast === 'function') toast('Nur für Admins.'); return; }
  if (!confirm('Wirklich ALLE Votes löschen?')) return;
  duelVotes = {};
  await duelStorageDel(DUEL_VOTE_KEY, true);
  if (typeof toast === 'function') toast('Alle Votes gelöscht.');
  duelShowDuel();
  duelRenderBoard();
}

async function showDuelPage() {
  await duelLoadAll();
  navigate('duelPage');
  duelShowDuel();
}

function showDuelBoard() {
  duelLoadAll().then(() => { duelRenderBoard(); navigate('duelBoardPage'); });
}

function showDuelSettings() {
  navigate('duelSettingsPage');
}
