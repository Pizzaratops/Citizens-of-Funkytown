//  GLOBAL ADMIN SYSTEM
// ============================================================
var isAdmin = false; // declared globally so renderTradeHistory never throws ReferenceError
const GLOBAL_ADMIN_PIN = '0815';

// Shared admin state — replaces isAdmin used by Draft Duel
// We keep isAdmin as the canonical flag so all existing code works
function globalCheckPin() {
  const val = document.getElementById('globalPinInput')?.value?.trim();
  if (val === GLOBAL_ADMIN_PIN) {
    // Set global admin flag (used by Draft Duel + Trade)
    isAdmin = true;

    // Update header UI
    _updateAdminUI(true);

    // Also sync Draft Duel badge if visible
    const duelBadge = document.getElementById('duelAdminBadge');
    if (duelBadge) {
      duelBadge.textContent = '\u2B50 Admin (3\u00d7)';
      duelBadge.style.background = 'rgba(245,200,66,.15)';
      duelBadge.style.borderColor = 'rgba(245,200,66,.4)';
      duelBadge.style.color = '#f5c842';
    }

    // Update trade save button
    if (typeof updateTradeSaveBtnState === 'function') updateTradeSaveBtnState();

    if (typeof toast === 'function') toast('\u2B50 Admin aktiv!');
    document.getElementById('globalPinInput').value = '';
    // Close dropdown after short delay
    setTimeout(() => {
      const btn = document.getElementById('globalAdminBtn');
      if (btn) btn.classList.remove('open');
    }, 800);
  } else {
    if (typeof toast === 'function') toast('Falscher PIN.');
    const input = document.getElementById('globalPinInput');
    if (input) { input.style.borderColor = '#ff6584'; setTimeout(() => input.style.borderColor = '', 1000); }
  }
}

function globalLogout() {
  isAdmin = false;
  _updateAdminUI(false);
  const duelBadge = document.getElementById('duelAdminBadge');
  if (duelBadge) {
    duelBadge.textContent = 'User';
    duelBadge.style.background = '';
    duelBadge.style.borderColor = '';
    duelBadge.style.color = '';
  }
  if (typeof updateTradeSaveBtnState === 'function') updateTradeSaveBtnState();
  if (typeof toast === 'function') toast('Admin-Modus deaktiviert.');
  document.getElementById('globalAdminBtn')?.classList.remove('open');
}

function _updateAdminUI(active) {
  const settBtn = document.getElementById('adminSettingsBtn');
  if (settBtn) settBtn.style.display = active ? 'block' : 'none';
  // Dynasty-Rankings: Edit-Toolbar refreshen (falls Page aktuell sichtbar)
  if (typeof renderDynEditToolbar === 'function') {
    try { renderDynEditToolbar(); } catch(e){}
    // Wenn Edit-Modus aktiv war aber Admin abgemeldet, neu rendern damit Edit-Spalte weg ist
    if (!active && typeof _dynEditModeActive !== 'undefined' && _dynEditModeActive) {
      _dynEditModeActive = false;
      if (typeof rCurrentData !== 'undefined' && typeof renderDynastyRankings === 'function') {
        renderDynastyRankings(rCurrentData);
      }
    }
  }
  const syncBtn = document.getElementById('espnSyncBtn');
  if (syncBtn) {
    if (active) {
      syncBtn.style.background = 'rgba(0,104,183,0.12)';
      syncBtn.style.border     = '1.5px solid rgba(0,104,183,0.35)';
      syncBtn.style.color      = '#0068b7';
      syncBtn.style.cursor     = 'pointer';
    } else {
      syncBtn.style.background = 'rgba(128,128,128,0.08)';
      syncBtn.style.border     = '1.5px solid rgba(128,128,128,0.2)';
      syncBtn.style.color      = 'var(--muted)';
      syncBtn.style.cursor     = 'default';
    }
  }
  const btn   = document.getElementById('globalAdminBtn');
  const icon  = document.getElementById('globalAdminIcon');
  const label = document.getElementById('globalAdminLabel');
  const form  = document.getElementById('adminLoginForm');
  const status = document.getElementById('adminStatusRow');
  if (!btn) return;
  if (active) {
    btn.classList.add('active');
    if (icon)   icon.textContent   = '\u2B50';
    if (label)  label.textContent  = 'Admin (3\u00d7)';
    if (form)   form.style.display = 'none';
    if (status) status.style.display = '';
  } else {
    btn.classList.remove('active');
    if (icon)   icon.innerHTML    = '&#128274;';
    if (label)  label.textContent = 'Admin';
    if (form)   form.style.display = '';
    if (status) status.style.display = 'none';
  }
}

function toggleAdminDropdown(e) {
  e.stopPropagation();
  const btn = document.getElementById('globalAdminBtn');
  if (!btn) return;
  btn.classList.toggle('open');
  if (btn.classList.contains('open')) {
    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', _closeAdminOnOutside, { once: true });
    }, 10);
  }
}

function _closeAdminOnOutside() {
  document.getElementById('globalAdminBtn')?.classList.remove('open');
}

// ── ROSTER OVERRIDE SYSTEM (rewritten) ──────────────────────────────────────

// ── ESPN ROSTER SNAPSHOT PERSISTENCE ────────────────────────────────────────
// The ESPN sync writes the live league state into localStorage so that
// rosters survive a page reload. Without this, every reload reverts to
// the hardcoded teams-rosters.js data.
const ESPN_ROSTER_SNAPSHOT_KEY = 'taco_espn_roster_snapshot_v1';

function loadEspnRosterSnapshot() {
  try {
    const raw = localStorage.getItem(ESPN_ROSTER_SNAPSHOT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function saveEspnRosterSnapshot(rosters) {
  try {
    localStorage.setItem(ESPN_ROSTER_SNAPSHOT_KEY, JSON.stringify(rosters));
  } catch (e) { console.warn('ESPN snapshot save failed:', e); }
}

// Merge the auto-synced ESPN snapshot (data/rosters-live.js, updated daily
// by the "Daily 9cat Live Scores" GitHub Action) into ROSTERS as the new
// baseline, replacing the static teams-rosters.js data. Runs BEFORE the
// localStorage snapshot below, so a manual "ESPN Sync jetzt" click always
// wins if it happened more recently than the last daily auto-sync.
(function _hydrateRostersFromLiveFile() {
  if (typeof ROSTERS_LIVE === 'undefined') return;
  Object.keys(ROSTERS_LIVE).forEach(tidStr => {
    const tid = parseInt(tidStr);
    if (Array.isArray(ROSTERS_LIVE[tidStr])) {
      ROSTERS[tid] = ROSTERS_LIVE[tidStr].map(p => ({...p}));
    }
  });
})();

// Merge any persisted ESPN snapshot into ROSTERS *before* we take the
// _ORIGINAL_ROSTERS reference. This means _ORIGINAL_ROSTERS reflects the
// latest known ESPN state (or the hardcoded fallback if no snapshot exists),
// and _applyRosterOverrides() can layer manual admin overrides on top.
(function _hydrateRostersFromEspnSnapshot() {
  const snap = loadEspnRosterSnapshot();
  if (!snap) return;
  Object.keys(snap).forEach(tidStr => {
    const tid = parseInt(tidStr);
    if (Array.isArray(snap[tidStr])) {
      ROSTERS[tid] = snap[tidStr].map(p => ({...p}));
    }
  });
})();

// Deep-copy of original rosters — set once at startup, never modified.
// "Original" here means: ESPN snapshot if available, otherwise the
// hardcoded teams-rosters.js data.
const _ORIGINAL_ROSTERS = {};
Object.keys(ROSTERS).forEach(tid => {
  _ORIGINAL_ROSTERS[parseInt(tid)] = ROSTERS[tid].map(p => ({...p}));
});

// Apply localStorage overrides on top of original rosters
// Called on every showTeam() and on page load
function _applyRosterOverrides() {
  const overrides = loadRosterOverrides();

  // Always start fresh from originals
  Object.keys(_ORIGINAL_ROSTERS).forEach(tid => {
    ROSTERS[parseInt(tid)] = _ORIGINAL_ROSTERS[parseInt(tid)].map(p => ({...p}));
  });

  if (!overrides || !Object.keys(overrides).length) return;

  Object.keys(overrides).forEach(tidStr => {
    const tid      = parseInt(tidStr);
    const removals = overrides[tidStr].remove || [];
    const additions = overrides[tidStr].add   || [];

    if (!ROSTERS[tid]) ROSTERS[tid] = [];

    // Remove traded-away players
    ROSTERS[tid] = ROSTERS[tid].filter(p => !removals.includes(p.name));

    // Add incoming players (avoid duplicates)
    additions.forEach(p => {
      if (!ROSTERS[tid].find(r => r.name === p.name)) {
        ROSTERS[tid].push(p);
      }
    });
  });
}

// ── DRAFT PICK OVERRIDE SYSTEM ──────────────────────────────────────────────
// Same pattern as the roster overrides above: picks.js ships the "original"
// pick ownership. Manual admin edits (asUpdatePick) are stored keyed by
// "year-round-originalOwner" and re-applied on top of the originals on every
// load. Previously these overrides were only written to localStorage and
// read back by the admin page's own list — every other page (draft board,
// trade analyzer, trade finder, ...) read PICKS directly and never saw the
// change. _applyPickOverrides() now mutates the live PICKS array in place so
// all pages stay in sync.
function loadExtraPicks() {
  try {
    const raw = localStorage.getItem('extraPicks');
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function saveExtraPicks(picks) {
  try { localStorage.setItem('extraPicks', JSON.stringify(picks)); }
  catch (e) { console.warn('Extra pick save failed:', e); }
}

// "Originals" = hardcoded picks from data/picks.js + any manually added
// extra picks from a previous session, so both survive an override reset.
// Merge die auto-synchronisierten ESPN-Pick-Daten (data/picks-live.js,
// taeglich aktualisiert von scripts/sync-espn-picks.js ueber die "Daily
// 9cat Live Scores" GitHub Action) in PICKS als neue Basis -- dasselbe
// Muster wie _hydrateRostersFromLiveFile oben fuer Roster.
//
// Deckt NUR das TTHQ-Jahr des unmittelbar bevorstehenden ESPN-Drafts ab
// (siehe Kommentar in data/picks-live.js). Fuer weiter in der Zukunft
// liegende Picks, die ESPN nie sieht, siehe
// scripts/data/pick-trades-manual.txt.
//
// Laeuft VOR _ORIGINAL_PICKS, damit ein manueller Admin-Override wie
// gehabt das letzte Wort behaelt -- exakt wie beim Roster-Override.
(function _hydratePicksFromLiveFile() {
  if (typeof PICKS_LIVE === 'undefined' || !Array.isArray(PICKS_LIVE.updates)) return;
  PICKS_LIVE.updates.forEach(u => {
    const p = PICKS.find(x => x.year === u.year && x.round === u.round && x.originalOwner === u.originalOwner);
    // Kein automatisches Anlegen fehlender Eintraege: ein Pick, den
    // data/picks.js nicht kennt, deutet auf eine falsche Team-Zuordnung
    // hin und soll auffallen statt still einen neuen Eintrag zu erzeugen.
    // (scripts/sync-espn-picks.js prueft das serverseitig schon vorher,
    // das hier ist nur die zweite Absicherung im Browser.)
    if (p) p.currentOwner = u.currentOwner;
  });
})();

const _ORIGINAL_PICKS = PICKS.map(p => ({...p})).concat(loadExtraPicks());

function loadPickOverrides() {
  try {
    const raw = localStorage.getItem('pickOverrides');
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

function savePickOverrides(overrides) {
  try {
    localStorage.setItem('pickOverrides', JSON.stringify(overrides));
  } catch (e) { console.warn('Pick override save failed:', e); }
}

function _applyPickOverrides() {
  const overrides = loadPickOverrides();

  // Always start fresh from originals, then re-apply overrides on top.
  PICKS.length = 0;
  _ORIGINAL_PICKS.forEach(p => PICKS.push({...p}));

  if (!overrides || !Object.keys(overrides).length) return;

  PICKS.forEach(p => {
    const key = p.year + '-' + p.round + '-' + p.originalOwner;
    if (overrides[key] !== undefined) p.currentOwner = overrides[key];
    const noteKey = key + '-note';
    if (overrides[noteKey]) p.note = overrides[noteKey];
  });
}

_applyPickOverrides();
