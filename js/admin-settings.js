// ============================================================
//  ADMIN SETTINGS PAGE
// ============================================================
function showAdminSettings() {
  navigate('adminSettingsPage');
  _asInit();
}

function _asInit() {
  // Populate team dropdowns
  const teamOpts = TEAMS.map(t => '<option value="' + t.id + '">' + t.name + '</option>').join('');
  ['as-player-team'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '<option value="">— Team —</option>' + teamOpts;
  });

  // Player autocomplete from all rosters
  const allNames = [...new Set(Object.values(ROSTERS).flat().map(p => p.name))].sort();
  const dl = document.getElementById('as-player-suggestions');
  if (dl) dl.innerHTML = allNames.map(n => '<option value="' + n + '">').join('');

  // Sync status
  const last = localStorage.getItem('espnLastSync');
  const statusEl = document.getElementById('as-sync-status');
  if (statusEl) statusEl.textContent = last ? 'Letzter ESPN Sync: ' + last : 'Noch kein Sync durchgeführt';

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

// ── Utilities ─────────────────────────────────────────────────
function asResetOverrides() {
  if (!confirm('Alle manuellen Roster-Overrides zurücksetzen?')) return;
  saveRosterOverrides({});
  _applyRosterOverrides();
  if (typeof renderHome === 'function') renderHome();
  toast('✅ Roster-Overrides zurückgesetzt');
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
