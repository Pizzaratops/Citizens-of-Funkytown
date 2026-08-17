// ============================================================
//  TRADE ADMIN — Admin-gated saving + Roster update modal
// ============================================================

// localStorage key for roster overrides
const ROSTER_OVERRIDE_KEY = 'taco_roster_overrides_v1';

// Load roster overrides from localStorage
function loadRosterOverrides() {
  try {
    const raw = localStorage.getItem(ROSTER_OVERRIDE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e) { return {}; }
}

// Save roster overrides to localStorage
function saveRosterOverrides(overrides) {
  try {
    localStorage.setItem(ROSTER_OVERRIDE_KEY, JSON.stringify(overrides));
  } catch(e) {}
}

// Get effective roster for a team (hardcoded + overrides)
function getEffectiveRoster(teamId) {
  const base      = ROSTERS[teamId] ? [...ROSTERS[teamId]] : [];
  const overrides = loadRosterOverrides();
  const teamOvr   = overrides[teamId] || {};

  // Apply additions
  const additions = teamOvr.add || [];
  additions.forEach(p => {
    if (!base.find(b => b.name === p.name)) base.push(p);
  });

  // Apply removals
  const removals = teamOvr.remove || [];
  return base.filter(b => !removals.includes(b.name));
}

// Update the save button state based on admin status
function updateTradeSaveBtnState() {
  const btn = document.getElementById('tradeSaveBtn');
  if (!btn) return;
  if (isTradeAdmin()) {
    btn.style.opacity = '1';
    btn.style.cursor  = 'pointer';
    btn.title = '';
    btn.onclick = openTradeConfirmModal;
  } else {
    btn.style.opacity = '0.4';
    btn.style.cursor  = 'not-allowed';
    btn.title = 'Nur für Admins — bitte zuerst einloggen';
    btn.onclick = () => {
      if (typeof toast === 'function') toast('Nur für Admins. Bitte PIN eingeben.');
    };
  }
}

// Check if current user is admin (reuse existing isAdmin flag)
function isTradeAdmin() {
  return typeof isAdmin !== 'undefined' ? isAdmin : false;
}

// Build team options HTML for selects
function buildTeamOptions(selectedId) {
  return TEAMS.map(t =>
    '<option value="' + t.id + '"' + (t.id === selectedId ? ' selected' : '') + '>'
    + t.name + '</option>'
  ).join('');
}

// Open the trade confirm modal
function openTradeConfirmModal() {
  const selA = TRADE_STATE.A.selected;
  const selB = TRADE_STATE.B.selected;

  if (!selA.length || !selB.length) {
    if (typeof toast === 'function') toast('Bitte zuerst Spieler auf beiden Seiten auswählen.');
    return;
  }

  // Build rows: for each player, show name + FROM team + arrow + TO team dropdown
  // FROM = current owner, TO = the other side's team (best guess)
  // We guess "TO" by finding the most common team on the other side
  function guessTargetTeam(items) {
    const ids = items
      .filter(p => !p.isPick && p.ownerId)
      .map(p => p.ownerId);
    if (!ids.length) return null;
    const counts = {};
    ids.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
    return parseInt(Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0]);
  }

  const toTeamA = guessTargetTeam(selB); // Side A receives from B's team
  const toTeamB = guessTargetTeam(selA); // Side B receives from A's team

  function buildRows(items, defaultToTeam) {
    return items.map((p, i) => {
      const name     = p.isPick ? (p.year + ' R' + p.round + ' (' + (p.orig?.name || '?') + ')') : p.name;
      const subLabel = p.isPick ? 'Draft Pick' : (p.nba || '') + (p.owner ? ' · ' + p.owner.name : ' · Unowned');
      const fromId   = p.isPick ? (p.currentOwner || null) : (p.ownerId || null);
      const toId     = defaultToTeam;

      // Guess primary position for non-pick players
      const primaryPos = p.isPick ? '' : (p.pos || '').split('/')[0] || 'PG';
      const posOpts = ['PG','SG','SF','PF','C'].map(po =>
        '<option value="'+po+'"'+(po===primaryPos?' selected':'')+'>'+po+'</option>').join('');
      return '<div class="tcm-row" data-item-idx="' + i + '">'
        + '<div class="tcm-name">' + name + '<span>' + subLabel + '</span></div>'
        + '<div class="tcm-arrow">&#8594;</div>'
        + '<div class="tcm-select-wrap">'
          + '<select class="tcm-select tcm-to-select">'
          + buildTeamOptions(toId)
          + '</select>'
        + '</div>'
        + (p.isPick ? '' :
          '<div class="tcm-select-wrap" style="margin-left:6px;">'
          + '<select class="tcm-select tcm-pos-select" title="Position im neuen Team">'
          + posOpts
          + '</select></div>')
        + '</div>';
    }).join('');
  }

  const rowsA = buildRows(selA, toTeamA);
  const rowsB = buildRows(selB, toTeamB);

  document.getElementById('tcmRows').innerHTML =
    '<div style="font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--muted);margin-bottom:6px;">Side A gibt ab</div>'
    + '<div id="tcmRowsA">' + rowsA + '</div>'
    + '<div style="font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--muted);margin:14px 0 6px;">Side B gibt ab</div>'
    + '<div id="tcmRowsB">' + rowsB + '</div>';

  // Store references for confirmTradeAndSave
  window._tcmSelA = selA;
  window._tcmSelB = selB;

  document.getElementById('tradeConfirmOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeTradeConfirm() {
  document.getElementById('tradeConfirmOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Read the TO-team selections from the modal and apply roster changes
function confirmTradeAndSave() {
  const overrides = loadRosterOverrides();

  function applyTransfer(items, rowsContainerId) {
    const rows    = document.querySelectorAll('#' + rowsContainerId + ' .tcm-row');
    rows.forEach((row, i) => {
      const p      = items[i];
      if (!p) return;
      const toId   = parseInt(row.querySelector('.tcm-to-select').value);
      const fromId = p.isPick ? p.currentOwner : p.ownerId;

      if (!toId) return;

      // Build the player object to add to the new team
      const playerObj = p.isPick
        ? { name: p.year + ' R' + p.round + ' (' + (p.orig?.name || '') + ')', pos: 'PK', team: 'PICK', isPick: true }
        : { name: p.name,
            pos: (row.querySelector('.tcm-pos-select')?.value || p.pos || '').split('/')[0] || (p.pos||'').split('/')[0] || '',
            team: p.nba || '' };

      // Add to TO team
      if (!overrides[toId]) overrides[toId] = { add: [], remove: [] };
      if (!overrides[toId].add) overrides[toId].add = [];
      if (!overrides[toId].remove) overrides[toId].remove = [];
      if (!overrides[toId].add.find(x => x.name === playerObj.name)) {
        overrides[toId].add.push(playerObj);
      }

      // Remove from FROM team (if we know it)
      if (fromId && fromId !== toId) {
        if (!overrides[fromId]) overrides[fromId] = { add: [], remove: [] };
        if (!overrides[fromId].remove) overrides[fromId].remove = [];
        if (!overrides[fromId].remove.includes(playerObj.name)) {
          overrides[fromId].remove.push(playerObj.name);
        }
      }
    });
  }

  applyTransfer(window._tcmSelA || [], 'tcmRowsA');
  applyTransfer(window._tcmSelB || [], 'tcmRowsB');

  saveRosterOverrides(overrides);

  // Also save trade to history (existing function logic)
  _doSaveTradeToHistory();

  closeTradeConfirm();
  if (typeof toast === 'function') toast('✅ Trade gespeichert & Roster aktualisiert!');
}

// Extracted trade-history save logic (called after modal confirm)
function _doSaveTradeToHistory() {
  const selA = TRADE_STATE.A.selected;
  const selB = TRADE_STATE.B.selected;
  if (!selA.length || !selB.length) return;

  const serializePlayer = p => p.isPick
    ? { isPick: true, pickKey: p.pickKey, year: p.year, round: p.round,
        name: p.name, baseValue: p.baseValue,
        origName: p.orig?.name || '', currName: p.curr?.name || '', traded: p.traded }
    : { isPick: false, rank: p.rank, name: p.name, nba: p.nba, pos: p.pos,
        dob: p.dob || null, ownerName: p.owner?.name || 'Unowned' };

  const computeForMode = (mode) => {
    const orig = TRADE_MODE; TRADE_MODE = mode;
    const vA = tradeSideValue(selA), vB = tradeSideValue(selB);
    TRADE_MODE = orig;
    const tot = vA + vB, pA = tot > 0 ? (vA/tot*100) : 50;
    const d = Math.abs(pA-50);
    let v, cls2;
    if (d < 5)       { v='Fair Trade'; cls2='fair'; }
    else if (d < 12) { v=vA>vB?'Slight Edge: Side A':'Slight Edge: Side B'; cls2='slight'; }
    else             { v=vA>vB?'Side A Wins Big':'Side B Wins Big'; cls2='lopsided'; }
    return { valA:vA, valB:vB, verdict:v, cls:cls2, pctA:pA.toFixed(1), pctB:(100-pA).toFixed(1) };
  };

  const trade = {
    id: Date.now(),
    date: new Date().toLocaleDateString('de-DE', { month:'long', year:'numeric' }),
    savedMode: TRADE_MODE,
    sideA: selA.map(serializePlayer),
    sideB: selB.map(serializePlayer),
    frozen: {
      dynasty: computeForMode('dynasty'),
      raw:     computeForMode('raw'),
      winnow:  computeForMode('winnow'),
    },
  };

  const trades = loadTradeHistory();
  trades.unshift(trade);
  saveTradeHistory(trades);
}

/* showTeam override removed — see _applyRosterOverrides() */

// Update save button state whenever trade page is shown
// We patch the snav-dropdown-item onclick instead of overriding showTrade()
document.addEventListener('DOMContentLoaded', function() {
  // Wire all "Trade Analyzer" nav buttons to also update the save btn
  document.querySelectorAll('[data-page="trade"]').forEach(btn => {
    const orig = btn.getAttribute('onclick') || '';
    btn.setAttribute('onclick', orig + '; setTimeout(updateTradeSaveBtnState, 80);');
  });
  // Initial state
  updateTradeSaveBtnState();
});


// ============================================================
