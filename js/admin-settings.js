// ============================================================
//  ADMIN SETTINGS PAGE
// ============================================================
const _asTradeDraft = { A: [], B: [] };

function showAdminSettings() {
  navigate('adminSettingsPage');
  _asInit();
}

function _asInit() {
  // Populate team dropdowns
  const teamOpts = TEAMS.map(t => '<option value="' + t.id + '">' + t.name + '</option>').join('');
  ['as-player-team','as-trade-team-a','as-trade-team-b','as-pick-orig','as-pick-new-owner'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '<option value="">— Team —</option>' + teamOpts;
  });

  // Populate pick years
  const yearSel = document.getElementById('as-pick-year');
  if (yearSel) {
    yearSel.innerHTML = [2026,2027,2028].map(y => '<option>' + y + '</option>').join('');
  }

  // Player autocomplete from all rosters
  const allNames = [...new Set(Object.values(ROSTERS).flat().map(p => p.name))].sort();
  const dl = document.getElementById('as-player-suggestions');
  if (dl) dl.innerHTML = allNames.map(n => '<option value="' + n + '">').join('');

  // Sync status
  const last = localStorage.getItem('espnLastSync');
  const statusEl = document.getElementById('as-sync-status');
  if (statusEl) statusEl.textContent = last ? 'Letzter ESPN Sync: ' + last : 'Noch kein Sync durchgeführt';

  _asRenderPickList();
  _asRenderTradeSides();
}

// ── Spieler verwalten ─────────────────────────────────────────
function asAddPlayer() {
  const tid  = parseInt(document.getElementById('as-player-team').value);
  const name = document.getElementById('as-player-name').value.trim();
  const pos  = document.getElementById('as-player-pos').value;
  const nba  = document.getElementById('as-player-nba').value.trim().toUpperCase() || 'FA';
  if (!tid || !name) { toast('⚠️ Team und Name sind Pflicht'); return; }

  const overrides = loadRosterOverrides();
  if (!overrides[tid]) overrides[tid] = { add: [], remove: [] };
  if (!overrides[tid].add.find(p => p.name === name)) {
    overrides[tid].add.push({ name, pos, team: nba });
  }
  saveRosterOverrides(overrides);
  _applyRosterOverrides();
  toast('✅ ' + name + ' → ' + (TEAMS.find(t=>t.id===tid)?.name||'Team '+tid));
  document.getElementById('as-player-name').value = '';
}

function asRemovePlayer() {
  const tid  = parseInt(document.getElementById('as-player-team').value);
  const name = document.getElementById('as-player-name').value.trim();
  if (!tid || !name) { toast('⚠️ Team und Name sind Pflicht'); return; }

  const overrides = loadRosterOverrides();
  if (!overrides[tid]) overrides[tid] = { add: [], remove: [] };
  if (!overrides[tid].remove.includes(name)) overrides[tid].remove.push(name);
  // Also remove from adds if pending
  overrides[tid].add = (overrides[tid].add || []).filter(p => p.name !== name);
  saveRosterOverrides(overrides);
  _applyRosterOverrides();
  toast('✅ ' + name + ' entfernt von ' + (TEAMS.find(t=>t.id===tid)?.name||'Team '+tid));
  document.getElementById('as-player-name').value = '';
}

// ── Picks ─────────────────────────────────────────────────────
function _asRenderPickList() {
  const el = document.getElementById('as-pick-list');
  if (!el) return;
  const lines = PICKS.map(p => {
    const orig = _ORIGINAL_PICKS.find(o => o.year === p.year && o.round === p.round && o.originalOwner === p.originalOwner);
    const origTeam = TEAMS.find(t => t.id === p.originalOwner)?.name || 'Team ' + p.originalOwner;
    const currTeam = TEAMS.find(t => t.id === p.currentOwner)?.name || 'Team ' + p.currentOwner;
    const changed  = orig && orig.currentOwner !== p.currentOwner ? ' <span style="color:var(--accent);">✎</span>' : '';
    return p.year + ' R' + p.round + ' (' + origTeam + ') → ' + currTeam + (p.note ? ' · ' + p.note : '') + changed;
  });
  el.innerHTML = '<div style="line-height:2;">' + lines.join('<br>') + '</div>';
}

function asUpdatePick() {
  const year     = parseInt(document.getElementById('as-pick-year').value);
  const round    = parseInt(document.getElementById('as-pick-round').value);
  const origId   = parseInt(document.getElementById('as-pick-orig').value);
  const newOwner = parseInt(document.getElementById('as-pick-new-owner').value);
  const note     = document.getElementById('as-pick-note').value.trim();
  if (!origId || !newOwner) { toast('⚠️ Original-Team und neuer Besitzer sind Pflicht'); return; }

  const pickExists = _ORIGINAL_PICKS.some(p => p.year === year && p.round === round && p.originalOwner === origId);
  if (!pickExists) { toast('⚠️ Diesen Pick gibt es nicht — Jahr/Runde/Original-Team prüfen'); return; }

  const overrides = loadPickOverrides();
  const key = year + '-' + round + '-' + origId;
  overrides[key] = newOwner;
  if (note) overrides[key + '-note'] = note;
  savePickOverrides(overrides);

  // Apply immediately so every page (Draft Board, Trade Analyzer, Trade
  // Finder, ...) sees the change right away, not just this admin list.
  _applyPickOverrides();
  _asRenderPickList();
  toast('✅ Pick gespeichert: ' + year + ' R' + round + ' → ' + (TEAMS.find(t=>t.id===newOwner)?.name||'Team '+newOwner));
}

function asAddNewPick() {
  const year  = parseInt(document.getElementById('as-pick-year').value);
  const round = parseInt(document.getElementById('as-pick-round').value);
  const origId  = parseInt(document.getElementById('as-pick-orig').value);
  const ownerId = parseInt(document.getElementById('as-pick-new-owner').value);
  const note  = document.getElementById('as-pick-note').value.trim();
  if (!origId || !ownerId) { toast('⚠️ Pflichtfelder fehlen'); return; }

  const newPick = { year, round, originalOwner: origId, currentOwner: ownerId, note: note||undefined };

  // Persist so the pick survives a reload and doesn't get wiped the next
  // time _applyPickOverrides() resets PICKS from the originals.
  const extra = loadExtraPicks();
  extra.push(newPick);
  saveExtraPicks(extra);

  _ORIGINAL_PICKS.push({...newPick});
  PICKS.push(newPick);
  _asRenderPickList();
  toast('✅ Neuer Pick erstellt: ' + year + ' R' + round);
}

// ── Trade manuell ─────────────────────────────────────────────
function asTradeAddPlayer(side) {
  const inputId = 'as-trade-add-' + side.toLowerCase();
  const name = document.getElementById(inputId)?.value?.trim();
  if (!name) return;
  if (!_asTradeDraft[side].find(p => p.name === name)) {
    const dp = DYNASTY_PLAYERS.find(p => p[1] === name || normalizeName(p[1]) === normalizeName(name));
    _asTradeDraft[side].push({
      isPick: false,
      name,
      rank: dp ? dp[0] : null,
      dob:  dp ? dp[4] : null,
      nba:  Object.values(ROSTERS).flat().find(p => p.name === name)?.team || '',
      pos:  Object.values(ROSTERS).flat().find(p => p.name === name)?.pos || '',
      ownerName: '',
    });
  }
  document.getElementById(inputId).value = '';
  _asRenderTradeSides();
}

function _asRenderTradeSides() {
  ['A','B'].forEach(side => {
    const el = document.getElementById('as-trade-players-' + side.toLowerCase());
    if (!el) return;
    if (!_asTradeDraft[side].length) {
      el.innerHTML = '<span style="color:var(--muted);font-size:12px;">Noch keine Spieler</span>';
      return;
    }
    el.innerHTML = _asTradeDraft[side].map((p, i) =>
      '<span class="admin-player-chip">' + p.name +
      '<button onclick="asTradeRemovePlayer(\'' + side + '\',' + i + ')">×</button></span>'
    ).join('');
  });
}

function asTradeRemovePlayer(side, idx) {
  _asTradeDraft[side].splice(idx, 1);
  _asRenderTradeSides();
}

function asClearTrade() {
  _asTradeDraft.A = []; _asTradeDraft.B = [];
  _asRenderTradeSides();
}

function asSaveTrade() {
  const sideA = _asTradeDraft.A;
  const sideB = _asTradeDraft.B;
  if (!sideA.length || !sideB.length) { toast('⚠️ Beide Seiten brauchen mindestens einen Spieler'); return; }

  const teamAId = parseInt(document.getElementById('as-trade-team-a').value);
  const teamBId = parseInt(document.getElementById('as-trade-team-b').value);

  // Enrich ownerName
  sideA.forEach(p => { p.ownerName = TEAMS.find(t=>t.id===teamAId)?.name || 'Side A'; });
  sideB.forEach(p => { p.ownerName = TEAMS.find(t=>t.id===teamBId)?.name || 'Side B'; });

  // Push to TRADE_STATE and call existing save logic
  TRADE_STATE.A.selected = sideA;
  TRADE_STATE.B.selected = sideB;
  _doSaveTradeToHistory();

  // Also apply roster changes
  const overrides = loadRosterOverrides();
  if (teamAId && teamBId) {
    sideA.forEach(p => {
      if (!overrides[teamBId]) overrides[teamBId] = { add:[], remove:[] };
      if (!overrides[teamAId]) overrides[teamAId] = { add:[], remove:[] };
      if (!overrides[teamBId].add.find(x=>x.name===p.name)) overrides[teamBId].add.push({name:p.name,pos:p.pos,team:p.nba});
      if (!overrides[teamAId].remove.includes(p.name)) overrides[teamAId].remove.push(p.name);
    });
    sideB.forEach(p => {
      if (!overrides[teamAId]) overrides[teamAId] = { add:[], remove:[] };
      if (!overrides[teamBId]) overrides[teamBId] = { add:[], remove:[] };
      if (!overrides[teamAId].add.find(x=>x.name===p.name)) overrides[teamAId].add.push({name:p.name,pos:p.pos,team:p.nba});
      if (!overrides[teamBId].remove.includes(p.name)) overrides[teamBId].remove.push(p.name);
    });
    saveRosterOverrides(overrides);
    _applyRosterOverrides();
  }

  asClearTrade();
  toast('✅ Trade gespeichert & Roster aktualisiert!');
}

// ── Utilities ─────────────────────────────────────────────────
function asResetOverrides() {
  if (!confirm('Alle manuellen Roster-Overrides zurücksetzen?')) return;
  saveRosterOverrides({});
  _applyRosterOverrides();
  if (typeof renderHome === 'function') renderHome();
  toast('✅ Roster-Overrides zurückgesetzt');
}

function asClearTradeHistory() {
  if (!confirm('Gesamte Trade History löschen? Das kann nicht rückgängig gemacht werden.')) return;
  saveTradeHistory([]);
  toast('✅ Trade History geleert');
}

// ============================================================


// ============================================================
//  HOW-TO-INFOBOX — Klick/Tap zum Auf- und Zuklappen
// ============================================================
//  @media (hover: hover) im CSS deckt Desktop-Hover ab. Auf
//  Touch-Geraeten gibt es kein Hover, deshalb hier zusaetzlich ein
//  Klick-Toggle. Ein Klick ausserhalb schliesst offene Boxen.
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('.howto');
  const wasOpen = trigger && trigger.classList.contains('open');
  document.querySelectorAll('.howto.open').forEach(el => el.classList.remove('open'));
  if (trigger && !wasOpen) trigger.classList.add('open');
});
