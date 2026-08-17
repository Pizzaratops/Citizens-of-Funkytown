// ============================================================
//  DYNASTY EDIT (Admin-Only)
//  Lokales Editieren der DYNASTY_PLAYERS Ranks mit Drag&Drop,
//  Zahleneingabe und Export für GitHub-Commit
// ============================================================

const DYN_EDIT_STORAGE_KEY = 'mfhfbs_dynastyOverrides_v1';

// Speicher-Format: { "Spielername": newRank, ... }
// Wir speichern nur die Spieler, deren Rank vom Original abweicht
var _dynEditOverrides = null;

function _dynLoadOverrides() {
  if (_dynEditOverrides !== null) return _dynEditOverrides;
  try {
    const raw = localStorage.getItem(DYN_EDIT_STORAGE_KEY);
    _dynEditOverrides = raw ? JSON.parse(raw) : {};
  } catch (e) {
    _dynEditOverrides = {};
  }
  return _dynEditOverrides;
}

function _dynSaveOverrides() {
  try {
    localStorage.setItem(DYN_EDIT_STORAGE_KEY, JSON.stringify(_dynEditOverrides || {}));
  } catch (e) {}
}

// ------------------------------------------------------------
//  Apply Overrides — modifiziert die globale DYNASTY_PLAYERS
//  in-place, neu sortiert nach effektivem Rank
// ------------------------------------------------------------
function applyDynastyOverrides() {
  const overrides = _dynLoadOverrides();
  if (!DYNASTY_PLAYERS || !DYNASTY_PLAYERS.length) return;

  // Snapshot _origRank wenn noch nicht gesetzt
  DYNASTY_PLAYERS.forEach(p => {
    if (p._origRank === undefined) p._origRank = p[0];
  });

  // Sortier-Schlüssel: override-Rank wenn vorhanden + winzigen Offset für Stabilität,
  // sonst _origRank. Overrides bekommen einen kleinen Bias nach OBEN (-0.5) damit
  // sie genau auf der gewünschten Position landen statt darunter zu rutschen.
  DYNASTY_PLAYERS.forEach(p => {
    const name = p[1];
    if (name in overrides) {
      p._sortKey = overrides[name] - 0.5; // bias up
    } else {
      p._sortKey = p._origRank;
    }
  });

  // Sortieren nach _sortKey, bei gleichem Key nach _origRank für Stabilität
  DYNASTY_PLAYERS.sort((a, b) => (a._sortKey - b._sortKey) || (a._origRank - b._origRank));

  // Re-Number: 1..N
  DYNASTY_PLAYERS.forEach((p, i) => {
    p[0] = i + 1;
    delete p._sortKey; // cleanup
  });
}

// Beim Page-Load initial anwenden (wenn data/rankings.js schon geladen ist)
if (typeof DYNASTY_PLAYERS !== 'undefined') {
  applyDynastyOverrides();
}

// ------------------------------------------------------------
//  Edit-UI: Im Admin-Modus, in der Dynasty-Rankings-Page
// ------------------------------------------------------------
var _dynEditModeActive = false;

function toggleDynastyEditMode() {
  if (typeof isAdmin === 'undefined' || !isAdmin) {
    if (typeof toast === 'function') toast('Nur im Admin-Modus verfügbar.');
    return;
  }
  _dynEditModeActive = !_dynEditModeActive;
  const btn = document.getElementById('dynEditToggleBtn');
  if (btn) {
    btn.textContent = _dynEditModeActive ? '✓ Edit-Modus AN' : '✏️ Edit-Modus';
    btn.style.background = _dynEditModeActive ? 'var(--accent)' : '';
    btn.style.color = _dynEditModeActive ? '#fff' : '';
  }
  // UI neu rendern
  if (typeof renderDynastyRankings === 'function' && typeof rCurrentData !== 'undefined') {
    renderDynastyRankings(rCurrentData);
  }
}

// ------------------------------------------------------------
//  Rank ändern per Zahleneingabe
// ------------------------------------------------------------
function dynEditSetRank(playerName, newRankStr) {
  const newRank = parseInt(newRankStr, 10);
  if (!Number.isFinite(newRank) || newRank < 1) {
    if (typeof toast === 'function') toast('Ungültiger Rang.');
    return;
  }
  const overrides = _dynLoadOverrides();
  overrides[playerName] = newRank;
  _dynSaveOverrides();
  applyDynastyOverrides();
  // Refresh aller Konsumenten der Daten
  if (typeof rCurrentData !== 'undefined') {
    rCurrentData = [...DYNASTY_PLAYERS];
    if (typeof filterRankings === 'function') filterRankings();
  }
  if (typeof toast === 'function') toast(`${playerName} → Rank ${newRank}`);
}

// ------------------------------------------------------------
//  Rank ändern per Drag&Drop
// ------------------------------------------------------------
var _dynDragSrcName = null;

function dynEditDragStart(evt, playerName) {
  if (!_dynEditModeActive) { evt.preventDefault(); return; }
  _dynDragSrcName = playerName;
  evt.dataTransfer.effectAllowed = 'move';
  evt.dataTransfer.setData('text/plain', playerName);
  evt.target.style.opacity = '0.4';
}
function dynEditDragEnd(evt) {
  evt.target.style.opacity = '';
  document.querySelectorAll('.dyn-drop-marker').forEach(el => el.classList.remove('dyn-drop-marker'));
}
function dynEditDragOver(evt) {
  if (!_dynEditModeActive || !_dynDragSrcName) return;
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'move';
  const row = evt.currentTarget;
  document.querySelectorAll('.dyn-drop-marker').forEach(el => el.classList.remove('dyn-drop-marker'));
  row.classList.add('dyn-drop-marker');
}
function dynEditDrop(evt, targetName) {
  if (!_dynEditModeActive || !_dynDragSrcName) return;
  evt.preventDefault();
  if (_dynDragSrcName === targetName) return;
  // Finde den Rank des Ziels und setze den Quellen-Spieler dort hin
  const targetPlayer = DYNASTY_PLAYERS.find(p => p[1] === targetName);
  if (!targetPlayer) return;
  const newRank = targetPlayer[0];
  dynEditSetRank(_dynDragSrcName, newRank);
  _dynDragSrcName = null;
}

// ------------------------------------------------------------
//  Reset-Funktionen
// ------------------------------------------------------------
function dynEditResetPlayer(playerName) {
  const overrides = _dynLoadOverrides();
  if (playerName in overrides) {
    delete overrides[playerName];
    _dynSaveOverrides();
    applyDynastyOverrides();
    if (typeof rCurrentData !== 'undefined') {
      rCurrentData = [...DYNASTY_PLAYERS];
      if (typeof filterRankings === 'function') filterRankings();
    }
    if (typeof toast === 'function') toast(`${playerName} zurückgesetzt`);
  }
}

function dynEditResetAll() {
  if (!confirm('Wirklich ALLE Rank-Überschreibungen zurücksetzen?')) return;
  _dynEditOverrides = {};
  _dynSaveOverrides();
  applyDynastyOverrides();
  if (typeof rCurrentData !== 'undefined') {
    rCurrentData = [...DYNASTY_PLAYERS];
    if (typeof filterRankings === 'function') filterRankings();
  }
  if (typeof toast === 'function') toast('Alle Overrides gelöscht.');
}

// ------------------------------------------------------------
//  Export: zeigt aktualisierte rankings.js zum Kopieren
// ------------------------------------------------------------
function dynEditExportRankingsJs() {
  // Snapshot der DYNASTY_PLAYERS in deren aktuellem (effektivem) State
  const lines = DYNASTY_PLAYERS.map(p => {
    const rank = p[0];
    const name = (p[1] || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const team = (p[2] || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const pos  = (p[3] || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const dob  = (p[4] || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `  [${rank},"${name}","${team}","${pos}","${dob}"],`;
  });
  const body = lines.join('\n');
  const out = `// ============================================================\n//  DYNASTY RANKINGS\n// ============================================================\nconst DYNASTY_PLAYERS = [\n${body}\n];\n`;

  // Modal anzeigen
  const existing = document.getElementById('dynExportModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'dynExportModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div style="background:var(--surface);border-radius:14px;padding:20px;max-width:900px;width:100%;max-height:80vh;display:flex;flex-direction:column;border:1.5px solid var(--accent);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <h3 style="margin:0;font-family:DM Sans,sans-serif;color:var(--text);">Export: data/rankings.js</h3>
        <button onclick="document.getElementById('dynExportModal').remove()" style="background:transparent;border:none;color:var(--text);font-size:24px;cursor:pointer;">×</button>
      </div>
      <p style="font-family:DM Sans,sans-serif;color:var(--muted);font-size:13px;margin:0 0 10px 0;">
        Kompletten Inhalt kopieren und in <code>data/rankings.js</code> einfügen (alte Datei ersetzen).
      </p>
      <textarea id="dynExportTextarea" readonly style="flex:1;width:100%;font-family:Menlo,monospace;font-size:11px;padding:10px;background:#1a1d2e;color:#e0e3f0;border-radius:8px;border:1px solid var(--border);min-height:300px;resize:vertical;"></textarea>
      <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end;">
        <button onclick="dynEditCopyExport()" style="padding:10px 18px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-family:DM Sans,sans-serif;">📋 In Zwischenablage</button>
        <button onclick="document.getElementById('dynExportModal').remove()" style="padding:10px 18px;background:var(--border);color:var(--text);border:none;border-radius:8px;font-weight:700;cursor:pointer;font-family:DM Sans,sans-serif;">Schließen</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('dynExportTextarea').value = out;
}

function dynEditCopyExport() {
  const ta = document.getElementById('dynExportTextarea');
  if (!ta) return;
  ta.select();
  try {
    navigator.clipboard.writeText(ta.value).then(() => {
      if (typeof toast === 'function') toast('In Zwischenablage kopiert!');
    });
  } catch (e) {
    document.execCommand('copy');
    if (typeof toast === 'function') toast('Kopiert!');
  }
}

// ------------------------------------------------------------
//  Render-Helper: HTML für eine editierbare Zeile
// ------------------------------------------------------------
function dynEditRowExtras(player) {
  if (!_dynEditModeActive || typeof isAdmin === 'undefined' || !isAdmin) return { dragAttrs: '', extraCol: '' };

  const name = player[1];
  const currentRank = player[0];
  const overrides = _dynLoadOverrides();
  const isModified = name in overrides;

  const dragAttrs = `draggable="true" ondragstart="dynEditDragStart(event, '${name.replace(/'/g, "\\'")}')" ondragend="dynEditDragEnd(event)" ondragover="dynEditDragOver(event)" ondrop="dynEditDrop(event, '${name.replace(/'/g, "\\'")}')"`;

  const extraCol = `
    <td style="text-align:center;padding:4px 6px;white-space:nowrap;">
      <input type="number"
             value="${currentRank}"
             min="1"
             style="width:60px;padding:4px 6px;border-radius:6px;border:1.5px solid ${isModified ? 'var(--accent)' : 'var(--border)'};background:var(--surface);color:var(--text);font-weight:700;text-align:center;"
             onchange="dynEditSetRank('${name.replace(/'/g, "\\'")}', this.value)"
             onclick="this.select()"
             title="${isModified ? 'Geändert (Original: ' + player._origRank + ')' : 'Original-Rank'}" />
      ${isModified ? `<button onclick="dynEditResetPlayer('${name.replace(/'/g, "\\'")}')" style="margin-left:4px;background:transparent;border:none;color:var(--muted);cursor:pointer;font-size:14px;" title="Zurücksetzen">↺</button>` : ''}
    </td>
  `;

  return { dragAttrs, extraCol, isModified };
}

// CSS injizieren für Drop-Marker
(function injectDynEditStyles() {
  if (document.getElementById('dyn-edit-styles')) return;
  const style = document.createElement('style');
  style.id = 'dyn-edit-styles';
  style.textContent = `
    .dyn-drop-marker {
      box-shadow: inset 0 3px 0 0 var(--accent) !important;
    }
    #rankingsPage tr[draggable="true"] {
      cursor: grab;
    }
    #rankingsPage tr[draggable="true"]:active {
      cursor: grabbing;
    }
  `;
  document.head.appendChild(style);
})();
