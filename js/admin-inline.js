// ============================================================
//  ADMIN INLINE EDIT: pos & team on roster rows
// ============================================================
function adminEditPlayerField(evt, el, playerName, teamId, field, currentVal) {
  evt.stopPropagation();
  if (typeof isAdmin === 'undefined' || !isAdmin) return;

  const target = evt.currentTarget;
  const rect   = target.getBoundingClientRect();

  // Remove any existing popup
  document.querySelectorAll('.admin-inline-popup').forEach(el => el.remove());

  const popup = document.createElement('div');
  popup.className = 'admin-inline-popup';
  popup.style.cssText = [
    'position:fixed',
    'z-index:9999',
    'background:var(--surface)',
    'border:1.5px solid var(--accent)',
    'border-radius:10px',
    'box-shadow:0 4px 20px rgba(0,0,0,.18)',
    'padding:12px 14px',
    'min-width:180px',
    'font-family:DM Sans,sans-serif',
  ].join(';');
  popup.style.top  = (rect.bottom + 6 + window.scrollY) + 'px';
  popup.style.left = Math.min(rect.left, window.innerWidth - 210) + 'px';

  const label = field === 'pos' ? 'Position' : 'NBA Team';

  let inputHtml;
  if (field === 'pos') {
    const POS = ['PG','SG','SF','PF','C'];
    inputHtml = '<select id="aie-input" style="width:100%;padding:6px 8px;border-radius:7px;border:1.5px solid var(--border);background:var(--surface2);color:var(--text);font-size:13px;font-weight:700;">'
      + POS.map(p => '<option value="'+p+'"'+(p===currentVal?' selected':'')+'>'+p+'</option>').join('')
      + '</select>';
  } else {
    // NBA team: free text (3-letter code)
    inputHtml = '<input id="aie-input" type="text" maxlength="4" value="'+currentVal+'" '
      + 'style="width:100%;padding:6px 8px;border-radius:7px;border:1.5px solid var(--border);background:var(--surface2);color:var(--text);font-size:13px;font-weight:700;box-sizing:border-box;">';
  }

  const _pn = playerName.replace(/'/g, "\\'");
  const _fi = field.replace(/'/g, "\\'");
  popup.innerHTML = '<div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:8px;">' + label + ' \u00e4ndern</div>'
    + inputHtml
    + '<div style="display:flex;gap:8px;margin-top:10px;">'
    + '<button onclick="adminInlineSave(\'' + _pn + '\',' + teamId + ',\'' + _fi + '\')" '
    +   'style="flex:1;padding:6px;border-radius:7px;border:none;background:var(--accent);color:#fff;font-weight:700;font-size:12px;cursor:pointer;">Speichern</button>'
    + '<button onclick="document.querySelectorAll(\'.admin-inline-popup\').forEach(function(e){e.remove()})" '
    +   'style="flex:1;padding:6px;border-radius:7px;border:1.5px solid var(--border);background:var(--surface2);color:var(--text);font-weight:600;font-size:12px;cursor:pointer;">Abbrechen</button>'
    + '</div>';

  document.body.appendChild(popup);
  setTimeout(() => {
    document.getElementById('aie-input')?.focus();
    document.addEventListener('click', function closeAIE(e) {
      if (!popup.contains(e.target)) { popup.remove(); document.removeEventListener('click', closeAIE); }
    });
  }, 10);
}

function adminInlineSave(playerName, teamId, field) {
  const val = document.getElementById('aie-input')?.value?.trim();
  if (!val) return;

  const overrides = loadRosterOverrides();
  const tid = parseInt(teamId);

  // Find the player in current ROSTERS and update in-memory
  const roster = ROSTERS[tid] || [];
  const player  = roster.find(p => p.name === playerName);

  if (player) {
    // Update in-memory
    player[field] = val;

    // Persist via overrides: remove old entry, add updated
    if (!overrides[tid]) overrides[tid] = { add: [], remove: [] };
    // Remove from adds if already there, then re-add updated
    overrides[tid].add = (overrides[tid].add || []).filter(p => p.name !== playerName);
    // Check if this is an override player (not in original roster)
    const origRoster = _ORIGINAL_ROSTERS[tid] || [];
    const isOriginal = origRoster.find(p => p.name === playerName);
    if (!isOriginal) {
      // Override-only player: update add entry
      overrides[tid].add.push({ name: playerName, pos: player.pos, team: player.team });
    } else {
      // Original player: store field override by adding a modified copy
      // and removing the original name so _applyRosterOverrides re-adds updated
      const updatedPlayer = { ...player, [field]: val };
      if (!(overrides[tid].remove || []).includes(playerName)) {
        overrides[tid].remove = [...(overrides[tid].remove || []), playerName];
      }
      overrides[tid].add = overrides[tid].add.filter(p => p.name !== playerName);
      overrides[tid].add.push(updatedPlayer);
    }

    saveRosterOverrides(overrides);
    _applyRosterOverrides();
    renderTab(); // re-render current view
    if (typeof toast === 'function') toast('✅ ' + playerName + ' → ' + field.toUpperCase() + ': ' + val);
  } else {
    if (typeof toast === 'function') toast('⚠️ Spieler nicht gefunden');
  }
  document.querySelectorAll('.admin-inline-popup').forEach(e => e.remove());
}
