// ============================================================
//  MFHFBs BIG BOARD — Stat-Sheet Style (Option D)
//
//  Quelle:       data/draft2026.js (DRAFT_2026)
//  Persistenz:   localStorage (lokal pro Browser)
//  Export:       window.print() + @media print (A4 landscape)
//  Field Notes:  Default aus DRAFT_2026[i].fantasy
//                Scout-Popup nutzt DRAFT_2026[i].scouting
// ============================================================

const BB_STORAGE_KEY = 'mfhfbs_bigBoard_v3';   // v3 — neuer state-shape
const BB_MAX_TOP     = 30;
const BB_MAX_TIERS   = 7;

// Tier-Farben (Fighting Illini Akzente + ergänzend)
const BB_TIER_COLORS = [
  '#E84A27',  // T1 — Illini Orange
  '#f5b942',  // T2 — Gold
  '#4caf81',  // T3 — Green
  '#29b6f6',  // T4 — Blue
  '#a89bff',  // T5 — Purple
  '#ff6584',  // T6 — Pink (Reserve)
  '#7bdcb5',  // T7 — Mint (Reserve)
];

// ============================================================
//  DUEL-INTEGRATION — Liga-Konsens via ELO
// ============================================================
// Berechnet für jeden Spieler im Big Board den Liga-Rang basierend auf ELO.
// Cache wird beim ersten Aufruf pro Render gebaut.
let _bbDuelCache = null;

function bbBuildDuelCache() {
  _bbDuelCache = { rankByPick: {}, eloByPick: {}, gamesByPick: {}, hasData: false };
  if (typeof duelComputeElo !== 'function' || typeof DRAFT_2026 === 'undefined') return _bbDuelCache;
  let computed;
  try { computed = duelComputeElo(); } catch (e) { console.warn('[Big Board] ELO compute failed:', e); return _bbDuelCache; }
  if (!computed || !computed.elo) return _bbDuelCache;
  const { elo, games } = computed;
  _bbDuelCache.eloByPick = elo;
  _bbDuelCache.gamesByPick = games;
  // Sortiere DRAFT_2026 Spieler nach ELO absteigend → Liga-Rang
  const ranked = [...DRAFT_2026].sort((a, b) => (elo[b.pick] || 0) - (elo[a.pick] || 0));
  ranked.forEach((p, i) => { _bbDuelCache.rankByPick[p.pick] = i + 1; });
  // hasData: True wenn mindestens 1 Vote existiert
  _bbDuelCache.hasData = Object.values(games).some(g => g > 0);
  return _bbDuelCache;
}

// Gibt Duel-Info für einen Spieler-Namen zurück: { rank, elo, games } oder null
function bbDuelInfo(name) {
  if (!_bbDuelCache) bbBuildDuelCache();
  const entry = bbFindDraftEntry(name);
  if (!entry) return null;
  const pick = entry.pick;
  if (_bbDuelCache.rankByPick[pick] == null) return null;
  return {
    rank:  _bbDuelCache.rankByPick[pick],
    elo:   _bbDuelCache.eloByPick[pick] || 0,
    games: _bbDuelCache.gamesByPick[pick] || 0,
  };
}

// Delta zwischen Big-Board-Position und Liga-Rang
// negativ = du hast ihn höher als Liga (↑), positiv = niedriger (↓)
function bbDuelDelta(myRank, leagueRank) {
  return leagueRank - myRank;
}

// Render des Delta-Badges: ▲5 / ▼3 / =
function bbDeltaBadge(delta, games) {
  if (delta == null) return '';
  const dimmed = games < 5;
  const dimClass = dimmed ? ' bb-delta-dim' : '';
  const title = `Liga-Rang vs. Commish-Rang (${games} Vote${games===1?'':'s'})`;
  if (delta === 0)  return `<span class="bb-delta bb-delta-eq${dimClass}" title="${title}">=</span>`;
  if (delta > 0)    return `<span class="bb-delta bb-delta-up${dimClass}" title="${title}">▲${delta}</span>`;
  return `<span class="bb-delta bb-delta-down${dimClass}" title="${title}">▼${Math.abs(delta)}</span>`;
}

// // Helper: hole DRAFT_2026 Eintrag by Name (für Default-Notes + Scout-Popup)
function bbFindDraftEntry(name) {
  if (typeof DRAFT_2026 === 'undefined' || !name) return null;
  return DRAFT_2026.find(p => p.name === name) || null;
}

// Default-Field-Note für einen Spieler: nimm fantasy als kurze Scout-Line
function bbDefaultNote(name) {
  const e = bbFindDraftEntry(name);
  return (e && e.fantasy) ? e.fantasy : '';
}

function bbDefaultState() {
  const src = (typeof DRAFT_2026 !== 'undefined') ? DRAFT_2026 : [];
  const items = src.map(p => ({
    name:   p.name,
    pos:    p.pos || '',
    school: p.school || '',
    notes:  '',  // leer = Default aus DRAFT_2026.fantasy wird beim Render gezogen
  }));
  return {
    title:     'THE 2026 BIG BOARD',
    classified:'▪ Internal Scouting Document · Eyes Only',
    subtitle:  'MFHFBs Front-Office · Top-30 Prospects · Round One Projection',
    author:    'The Commish',
    revision:  '04',
    top:       items.slice(0, BB_MAX_TOP),
    hm:        items.slice(BB_MAX_TOP),
    tiers:     [
      { after: 2,  label: 'T2' },
      { after: 6,  label: 'T3' },
      { after: 13, label: 'T4' },
      { after: 21, label: 'T5' },
    ],
    tierNames: ['Generational', 'Cornerstone', 'Starter Lock', 'High-Upside', 'Rotation'],
  };
}

function bbLoad() {
  if (typeof DRAFT_2026 === 'undefined') {
    console.warn('[Big Board] DRAFT_2026 nicht geladen — Fallback auf leeren State');
    return bbDefaultState();
  }
  try {
    const raw = localStorage.getItem(BB_STORAGE_KEY);
    if (!raw) return bbDefaultState();
    const obj = JSON.parse(raw);
    // Wenn DRAFT_2026 deutlich gewachsen/geschrumpft ist, Default neu laden
    const expected = DRAFT_2026.length;
    const got      = (obj.top || []).length + (obj.hm || []).length;
    if (Math.abs(expected - got) > 3) {
      console.warn('[Big Board] DRAFT_2026 hat sich geändert — lade Default.');
      return bbDefaultState();
    }
    // Sicherheits-Defaults
    if (!Array.isArray(obj.top))       obj.top = [];
    if (!Array.isArray(obj.hm))        obj.hm = [];
    if (!Array.isArray(obj.tiers))     obj.tiers = [];
    if (!Array.isArray(obj.tierNames)) obj.tierNames = ['Tier 1'];
    // Sicherstellen: tierNames.length === tiers.length + 1
    const expectedLen = obj.tiers.length + 1;
    while (obj.tierNames.length < expectedLen) obj.tierNames.push(`Tier ${obj.tierNames.length + 1}`);
    while (obj.tierNames.length > expectedLen) obj.tierNames.pop();
    return obj;
  } catch (e) {
    console.error('[Big Board] localStorage corrupted, using default:', e);
    return bbDefaultState();
  }
}

function bbSave() {
  try { localStorage.setItem(BB_STORAGE_KEY, JSON.stringify(BB_STATE)); }
  catch (e) { console.error('[Big Board] save failed:', e); }
}

// State wird LAZY initialisiert beim ersten showBigBoard(), nicht beim Script-Load.
// Das vermeidet Race-Conditions, falls Script-Order anders ist als gedacht.
let BB_STATE   = null;
let BB_DRAG    = null;
let BB_EDITING = false;  // View-Mode default

function bbEnsureState() {
  if (!BB_STATE) BB_STATE = bbLoad();
}

// ============================================================
//  TIER HELPER
// ============================================================
function bbTierIndexAt(idx) {
  let t = 0;
  for (const tier of BB_STATE.tiers || []) {
    if (idx > tier.after) t++;
  }
  return t;
}
function bbTierColor(idx) { return BB_TIER_COLORS[bbTierIndexAt(idx) % BB_TIER_COLORS.length]; }
function bbTierLabel(idx) { return `T${bbTierIndexAt(idx) + 1}`; }

// ============================================================
//  RENDER
// ============================================================
async function showBigBoard() {
  bbEnsureState();
  navigate('bigBoardPage');
  // Duel-Daten frisch laden, falls Draft Duel noch nicht geöffnet wurde
  if (typeof duelLoadAll === 'function') {
    try { await duelLoadAll(); } catch (e) { console.warn('[Big Board] duelLoadAll failed:', e); }
  }
  renderBigBoard();
}

function renderBigBoard() {
  bbEnsureState();
  _bbDuelCache = null;  // Cache invalidieren, jeder Render rebaut
  const root = document.getElementById('bigBoardPage');
  if (!root) return;

  // Wenn DRAFT_2026 noch nicht da ist, warte kurz und versuche nochmal — aber MAX 10x
  if (typeof DRAFT_2026 === 'undefined' || !DRAFT_2026.length) {
    if (!window._bbLoadRetries) window._bbLoadRetries = 0;
    window._bbLoadRetries++;
    if (window._bbLoadRetries > 10) {
      root.innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);font-family:DM Sans,sans-serif;line-height:1.6;"><div style="font-size:36px;margin-bottom:12px;">⚠️</div><div style="color:#E84A27;font-weight:700;margin-bottom:8px;">DRAFT_2026 nicht geladen</div><div style="font-size:12px;">Prüfe die Browser-Console (F12) auf JavaScript-Fehler in <code>data/draft2026.js</code>.</div></div>';
      return;
    }
    root.innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);font-family:DM Sans,sans-serif;"><div style="font-size:36px;margin-bottom:12px;">⏳</div><div>Lade Prospects…</div></div>';
    setTimeout(renderBigBoard, 200);
    return;
  }
  window._bbLoadRetries = 0;

  const editClass = BB_EDITING ? 'bb-edit' : 'bb-view';
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  root.innerHTML = `
    <div class="bb-toolbar">
      <div class="bb-toolbar-left">
        <h2 class="bb-toolbar-title">🗂️ Big Board · Stat Sheet</h2>
        <span class="bb-toolbar-hint">${BB_EDITING ? 'Drag & Drop sortieren · Felder klicken zum Editieren' : 'View-Mode · Klick auf Spieler für Scouting'}</span>
      </div>
      <div class="bb-toolbar-right">
        <button class="bb-btn bb-btn-mode ${BB_EDITING ? 'active' : ''}" onclick="bbToggleEdit()">${BB_EDITING ? '✏️ Edit-Mode' : '👁️ View-Mode'}</button>
        <button class="bb-btn" onclick="bbResetState()" title="Zurück zu Default aus draft2026.js">🔄 Reset</button>
        <button class="bb-btn" onclick="bbExportJSON()" title="Aktuelles Board als JSON">💾 JSON</button>
        <button class="bb-btn bb-btn-primary" onclick="bbPrintA4()" title="A4 Querformat — über Druckdialog als PDF speichern">🖨️ A4 Drucken</button>
      </div>
    </div>

    <div class="sh-page ${editClass}" id="bbSheet">
      <div class="sh-header">
        <div class="sh-title-block">
          <div class="sh-classified" ${BB_EDITING ? 'contenteditable="true" onblur="bbField(\'classified\',this.innerText)"' : ''}>${BB_STATE.classified}</div>
          <h1 class="sh-title" ${BB_EDITING ? 'contenteditable="true" onblur="bbField(\'title\',this.innerText)"' : ''}>${BB_STATE.title}</h1>
          <div class="sh-sub" ${BB_EDITING ? 'contenteditable="true" onblur="bbField(\'subtitle\',this.innerText)"' : ''}>${BB_STATE.subtitle}</div>
        </div>
        <div class="sh-stamp-block">
          <div class="sh-stamp">COMMISH<br>APPROVED</div>
          <div class="sh-stamp-sub">REV. <span ${BB_EDITING ? 'contenteditable="true" onblur="bbField(\'revision\',this.innerText)"' : ''}>${BB_STATE.revision}</span> · ${today.toUpperCase()}</div>
        </div>
      </div>

      <div class="sh-meta-row">
        <span>Author: <strong ${BB_EDITING ? 'contenteditable="true" onblur="bbField(\'author\',this.innerText)"' : ''}>${BB_STATE.author}</strong></span>
        <span>Date: <strong>${today}</strong></span>
        <span>Rev: <strong>${BB_STATE.revision}</strong></span>
        <span>Tiers: <strong>${(BB_STATE.tiers||[]).length + 1}</strong></span>
        <span>Prospects: <strong>${BB_STATE.top.length} + ${BB_STATE.hm.length} HM</strong></span>
      </div>

      <div class="sh-tier-legend">${renderTierLegend()}</div>

      <div class="sh-table-wrap">
        <table class="sh-table">
          <thead><tr>
            ${BB_EDITING ? '<th class="sh-th-handle"></th>' : ''}
            <th class="sh-th-pick">Pick</th>
            <th class="sh-th-tier">Tier</th>
            <th class="sh-th-name">Name</th>
            <th class="sh-th-pos">Pos</th>
            <th class="sh-th-school">School / Origin</th>
            <th class="sh-th-liga" title="Liga-Konsens via Draft Duel ELO">Liga</th>
            <th class="sh-th-notes">Field Notes</th>
            ${BB_EDITING ? '<th class="sh-th-actions"></th>' : ''}
          </tr></thead>
          <tbody>${renderTableRows()}</tbody>
        </table>
      </div>

      ${(BB_STATE.hm && BB_STATE.hm.length) ? `
      <div class="sh-hm-section">
        <div class="sh-hm-header">
          <span class="sh-hm-label">▪ Honorable Mentions</span>
          <span class="sh-hm-sub">Watch list · Not yet ranked</span>
        </div>
        <div class="sh-hm-grid">${renderHM()}</div>
      </div>` : ''}

      ${renderDisagreementsBox()}
      <div class="sh-footer">
        <span>▪ MFHFBs PRESS · Internal</span>
        <span>Page 1 of 1 · Top-${BB_STATE.top.length}${BB_STATE.hm.length ? ` + ${BB_STATE.hm.length} HM` : ''}</span>
        <span>taco-tuesday-league.com</span>
      </div>
    </div>

    <div id="bbScoutPopup" class="bb-scout-popup" style="display:none;" onclick="bbCloseScout()"></div>
  `;
}

function renderDisagreementsBox() {
  bbBuildDuelCache();
  if (!_bbDuelCache.hasData) return '';
  // Sammle alle Spieler aus Top mit Duel-Daten + berechne Delta
  const rows = [];
  BB_STATE.top.forEach((item, idx) => {
    const d = bbDuelInfo(item.name);
    if (!d) return;
    // Spieler mit < 3 Games ausschließen (zu wenig Signal)
    if (d.games < 3) return;
    const delta = bbDuelDelta(idx + 1, d.rank);
    rows.push({ name: item.name, school: item.school, myRank: idx + 1, leagueRank: d.rank, delta, games: d.games, elo: d.elo });
  });
  if (rows.length === 0) return '';
  // Sortiere nach absolutem Delta absteigend, top 5
  rows.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  const topGaps = rows.slice(0, 5);
  if (topGaps.length === 0 || Math.abs(topGaps[0].delta) === 0) return '';

  const items = topGaps.map(r => {
    const isHigher = r.delta > 0;  // Liga hat ihn niedriger → ich überrate ihn
    const arrowClass = isHigher ? 'bb-delta-up' : 'bb-delta-down';
    const arrow = isHigher ? `▲${r.delta}` : `▼${Math.abs(r.delta)}`;
    const verdict = isHigher
      ? `Commish hoch · Liga niedrig`
      : `Liga hoch · Commish niedrig`;
    return `<div class="bb-disagree-item">
      <div class="bb-disagree-name">${r.name}</div>
      <div class="bb-disagree-detail">
        <span class="bb-disagree-rank">Mein <strong>#${r.myRank}</strong></span>
        <span class="bb-disagree-vs">↔</span>
        <span class="bb-disagree-rank">Liga <strong>#${r.leagueRank}</strong></span>
        <span class="bb-disagree-arrow ${arrowClass}">${arrow}</span>
      </div>
      <div class="bb-disagree-verdict">${verdict}</div>
    </div>`;
  }).join('');

  return `<div class="bb-disagree-section">
    <div class="bb-disagree-header">
      <span class="bb-disagree-label">▪ Liga vs. Commish — Top Disagreements</span>
      <span class="bb-disagree-sub">Größte Diskrepanzen zwischen Big-Board-Ranking und Draft-Duel-Konsens (ELO)</span>
    </div>
    <div class="bb-disagree-grid">${items}</div>
  </div>`;
}

function renderTierLegend() {
  let html = '';
  let prevAfter = -1;
  const tiers = BB_STATE.tiers || [];
  const tierNames = BB_STATE.tierNames || [];
  const ranges = [];
  tiers.forEach(t => {
    ranges.push({ start: prevAfter + 1, end: t.after, label: t.label });
    prevAfter = t.after;
  });
  ranges.push({ start: prevAfter + 1, end: BB_STATE.top.length - 1, label: `T${ranges.length + 1}` });
  if (ranges.length > 0) ranges[0].label = 'T1';

  ranges.forEach((r, i) => {
    const color = BB_TIER_COLORS[i % BB_TIER_COLORS.length];
    const count = Math.max(0, r.end - r.start + 1);
    const name  = tierNames[i] || `Tier ${i + 1}`;
    const editable = BB_EDITING ? `contenteditable="true" onblur="bbUpdateTierName(${i}, this.innerText)"` : '';
    html += `<div class="sh-legend-item" style="--c:${color}">
      <span class="sh-legend-pill" style="background:${color}">${r.label}</span>
      <span class="sh-legend-name" ${editable}>${name}</span>
      <span class="sh-legend-count">${count} prospect${count===1?'':'s'}</span>
    </div>`;
  });
  return html;
}

function renderTableRows() {
  let html = '';
  const tiersByAfter = {};
  (BB_STATE.tiers || []).forEach((t, i) => { tiersByAfter[t.after] = { ...t, idx: i }; });

  BB_STATE.top.forEach((item, idx) => {
    const color = bbTierColor(idx);
    const tlab  = bbTierLabel(idx);

    const draggable = BB_EDITING ? 'draggable="true"' : '';
    const dragHandlers = BB_EDITING
      ? `ondragstart="bbDragStart(event,'top',${idx})" ondragover="bbDragOver(event)" ondrop="bbDrop(event,'top',${idx})" ondragend="bbDragEnd(event)"`
      : '';
    const clickHandler = (!BB_EDITING && bbFindDraftEntry(item.name))
      ? `onclick="bbShowScout('${escapeJs(item.name)}')"`
      : '';

    // Notes: explizit gesetzt? Sonst Default aus fantasy
    const displayNotes = item.notes || bbDefaultNote(item.name);
    const isDefault = !item.notes && displayNotes;

    html += `<tr class="sh-row" data-idx="${idx}" ${draggable} ${dragHandlers} ${clickHandler}>
      ${BB_EDITING ? '<td class="sh-handle-cell"><span class="sh-handle">⋮⋮</span></td>' : ''}
      <td class="sh-pick">${(idx+1).toString().padStart(2, '0')}</td>
      <td class="sh-tier"><span class="sh-tier-pill" style="background:${color}">${tlab}</span></td>
      <td class="sh-name" ${BB_EDITING ? `contenteditable="true" onblur="bbUpdateField('top',${idx},'name',this.innerText)"` : ''}>${item.name}</td>
      <td class="sh-pos" ${BB_EDITING ? `contenteditable="true" onblur="bbUpdateField('top',${idx},'pos',this.innerText)"` : ''}>${item.pos}</td>
      <td class="sh-school" ${BB_EDITING ? `contenteditable="true" onblur="bbUpdateField('top',${idx},'school',this.innerText)"` : ''}>${item.school}</td>
      <td class="sh-liga">${(() => {
        const d = bbDuelInfo(item.name);
        if (!d) return '<span class="bb-delta-na" title="Keine Duel-Daten">–</span>';
        const delta = bbDuelDelta(idx + 1, d.rank);
        return `<span class="sh-liga-rank">#${d.rank}</span>${bbDeltaBadge(delta, d.games)}`;
      })()}</td>
      <td class="sh-notes-cell">
        <div class="sh-notes ${isDefault ? 'sh-notes-default' : ''}" ${BB_EDITING ? `contenteditable="true" onblur="bbUpdateField('top',${idx},'notes',this.innerText)"` : ''}>${displayNotes}</div>
      </td>
      ${BB_EDITING ? `<td class="sh-actions">
        <button class="sh-btn-mini" onclick="event.stopPropagation();bbAddTierAfter(${idx})" title="Tier-Break nach diesem Pick">+T</button>
        <button class="sh-btn-mini" onclick="event.stopPropagation();bbDemoteToHM(${idx})" title="Zu Honorable Mentions">↓HM</button>
      </td>` : ''}
    </tr>`;

    if (tiersByAfter[idx]) {
      const tier = tiersByAfter[idx];
      const tierIdx = bbTierIndexAt(idx);
      const nextColor = BB_TIER_COLORS[(tierIdx + 1) % BB_TIER_COLORS.length];
      const colspan = BB_EDITING ? 9 : 7;
      const nextName = (BB_STATE.tierNames || [])[tierIdx + 1] || `Tier ${tierIdx + 2}`;
      html += `<tr class="sh-tier-row" data-tier-after="${idx}">
        <td colspan="${colspan}" style="--c:${nextColor}">
          <div class="sh-tier-break">
            <span class="sh-tier-break-pill" style="background:${nextColor}">${tier.label}</span>
            <span class="sh-tier-break-name" style="color:${nextColor}">${nextName}</span>
            <span class="sh-tier-break-line" style="background:linear-gradient(90deg,${nextColor}88,transparent)"></span>
            ${BB_EDITING ? `<button class="sh-tier-remove" onclick="bbRemoveTier(${idx})" title="Tier-Break entfernen">×</button>` : ''}
          </div>
        </td>
      </tr>`;
    }
  });
  return html;
}

function renderHM() {
  if (!BB_EDITING) {
    return BB_STATE.hm.map(p => {
      const hasScout = !!bbFindDraftEntry(p.name);
      const click = hasScout ? `onclick="bbShowScout('${escapeJs(p.name)}')"` : '';
      const cursor = hasScout ? 'style="cursor:pointer;"' : '';
      return `<div class="sh-hm-item" ${click} ${cursor}>
        <span class="sh-hm-name">${p.name}</span>
        <span class="sh-hm-meta">${p.pos}${p.pos && p.school ? ' · ' : ''}${p.school}</span>
      </div>`;
    }).join('');
  }
  return BB_STATE.hm.map((p, idx) => `<div class="sh-hm-item" data-idx="${idx}" draggable="true" ondragstart="bbDragStart(event,'hm',${idx})" ondragover="bbDragOver(event)" ondrop="bbDrop(event,'hm',${idx})" ondragend="bbDragEnd(event)">
    <span class="sh-hm-handle">⋮</span>
    <span class="sh-hm-name">${p.name}</span>
    <span class="sh-hm-meta">${p.pos}${p.pos && p.school ? ' · ' : ''}${p.school}</span>
    <button class="sh-btn-mini sh-hm-up" onclick="event.stopPropagation();bbPromoteFromHM(${idx})" title="In Top-${BB_MAX_TOP} hochstufen">↑</button>
  </div>`).join('');
}

function escapeJs(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// ============================================================
//  SCOUTING POPUP — nutzt scouting + stats + fantasy
// ============================================================
function bbShowScout(name) {
  const src = bbFindDraftEntry(name);
  if (!src) return;
  const pop = document.getElementById('bbScoutPopup');
  pop.innerHTML = `<div class="bb-scout-card" onclick="event.stopPropagation()">
    <button class="bb-scout-close" onclick="bbCloseScout()">×</button>
    <div class="bb-scout-meta-top">▪ Scouting Report · MFHFBs Internal</div>
    <div class="bb-scout-name">${src.name}</div>
    <div class="bb-scout-meta">${src.pos || ''}${src.pos && src.school ? ' · ' : ''}${src.school || ''}${src.tier ? ' · ' + src.tier : ''}</div>
    ${src.measurements ? `<div class="bb-scout-measurements">📐 ${src.measurements}</div>` : ''}
    ${src.stats     ? `<div class="bb-scout-stats">${src.stats}</div>` : ''}
    ${src.fantasy   ? `<div class="bb-scout-fantasy">${src.fantasy}</div>` : ''}
    ${src.scouting  ? `<div class="bb-scout-text">${src.scouting}</div>` : ''}
  </div>`;
  pop.style.display = 'flex';
}

function bbCloseScout() {
  const pop = document.getElementById('bbScoutPopup');
  if (pop) pop.style.display = 'none';
}

// ============================================================
//  EDIT-ACTIONS
// ============================================================
function bbToggleEdit() { BB_EDITING = !BB_EDITING; renderBigBoard(); }

function bbResetState() {
  if (!confirm('Big Board auf Default aus draft2026.js zurücksetzen?\nAlle lokalen Änderungen (Reihenfolge, Notes, Tier-Breaks) gehen verloren.')) return;
  localStorage.removeItem(BB_STORAGE_KEY);
  BB_STATE = bbDefaultState();
  renderBigBoard();
}

function bbField(field, value) {
  BB_STATE[field] = String(value || '').trim();
  bbSave();
}

function bbUpdateField(list, idx, field, value) {
  const arr = (list === 'top') ? BB_STATE.top : BB_STATE.hm;
  if (!arr[idx]) return;
  const newVal = String(value || '').trim();
  // Wenn notes auf Default zurückgesetzt werden soll: leeren — wird dann beim Render aus fantasy gefüllt
  if (field === 'notes' && newVal === bbDefaultNote(arr[idx].name)) {
    arr[idx].notes = '';
  } else {
    arr[idx][field] = newVal;
  }
  bbSave();
}

function bbUpdateTierName(legendIdx, value) {
  if (!BB_STATE.tierNames) BB_STATE.tierNames = [];
  BB_STATE.tierNames[legendIdx] = String(value || '').trim();
  bbSave();
  // Tier-Break Label in der Tabelle aktualisieren — wir rerendern einfach
  renderBigBoard();
}

function bbAddTierAfter(idx) {
  if (!BB_STATE.tiers) BB_STATE.tiers = [];
  if (BB_STATE.tiers.length >= BB_MAX_TIERS - 1) {
    alert(`Maximum ${BB_MAX_TIERS} Tiers erreicht.`);
    return;
  }
  if (BB_STATE.tiers.some(t => t.after === idx)) {
    alert('Nach diesem Spieler ist bereits ein Tier-Break.');
    return;
  }
  const nextNum = BB_STATE.tiers.length + 2;
  const name = prompt(`Name des neuen Tiers (T${nextNum}):`, `Tier ${nextNum}`);
  if (!name) return;
  BB_STATE.tiers.push({ after: idx, label: `T${nextNum}` });
  BB_STATE.tiers.sort((a, b) => a.after - b.after);
  // Tier-Labels neu vergeben (T2, T3, T4, ...)
  BB_STATE.tiers.forEach((t, i) => { t.label = `T${i + 2}`; });
  // Einfügen-Position in tierNames bestimmen (entspricht der Position des Breaks +1)
  const breakPos = BB_STATE.tiers.findIndex(t => t.after === idx);
  if (!BB_STATE.tierNames) BB_STATE.tierNames = ['Tier 1'];
  BB_STATE.tierNames.splice(breakPos + 1, 0, name.trim());
  bbSave();
  renderBigBoard();
}

function bbRemoveTier(afterIdx) {
  const breakPos = (BB_STATE.tiers || []).findIndex(t => t.after === afterIdx);
  if (breakPos === -1) return;
  BB_STATE.tiers.splice(breakPos, 1);
  // Labels neu nummerieren
  BB_STATE.tiers.forEach((t, i) => { t.label = `T${i + 2}`; });
  // Auch den entsprechenden tierNames-Eintrag löschen (Position breakPos+1)
  if (BB_STATE.tierNames) BB_STATE.tierNames.splice(breakPos + 1, 1);
  bbSave();
  renderBigBoard();
}

function bbDemoteToHM(idx) {
  if (BB_STATE.top.length <= 1) return;
  const [item] = BB_STATE.top.splice(idx, 1);
  if (!BB_STATE.hm) BB_STATE.hm = [];
  BB_STATE.hm.unshift(item);
  BB_STATE.tiers = (BB_STATE.tiers || []).map(t => {
    if (t.after >= idx) return { ...t, after: t.after - 1 };
    return t;
  }).filter(t => t.after >= 0 && t.after < BB_STATE.top.length - 1);
  // tierNames bleibt — Anzahl der Tiers ändert sich erst durch tier-break-removal
  bbSave();
  renderBigBoard();
}

function bbPromoteFromHM(idx) {
  if (BB_STATE.top.length >= BB_MAX_TOP) {
    alert(`Top-Liste voll (${BB_MAX_TOP}). Verschiebe erst einen Spieler in HM.`);
    return;
  }
  const [item] = BB_STATE.hm.splice(idx, 1);
  BB_STATE.top.push(item);
  bbSave();
  renderBigBoard();
}

// ============================================================
//  DRAG & DROP
// ============================================================
function bbDragStart(e, list, idx) {
  if (!BB_EDITING) return;
  BB_DRAG = { list, idx };
  e.dataTransfer.effectAllowed = 'move';
  try { e.dataTransfer.setData('text/plain', `${list}:${idx}`); } catch (_) {}
  e.currentTarget.classList.add('bb-dragging');
}

function bbDragOver(e) {
  if (!BB_EDITING || !BB_DRAG) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('bb-drag-over');
}

function bbDrop(e, list, idx) {
  if (!BB_EDITING || !BB_DRAG) return;
  e.preventDefault();
  e.currentTarget.classList.remove('bb-drag-over');

  const { list: srcList, idx: srcIdx } = BB_DRAG;
  BB_DRAG = null;

  if (srcList === list && srcIdx === idx) return;

  const srcArr = (srcList === 'top') ? BB_STATE.top : BB_STATE.hm;
  const dstArr = (list === 'top')    ? BB_STATE.top : BB_STATE.hm;

  if (list === 'top' && srcList === 'hm' && BB_STATE.top.length >= BB_MAX_TOP) {
    alert(`Top-Liste voll (${BB_MAX_TOP}). Verschiebe erst einen Spieler in HM.`);
    return;
  }

  const [item] = srcArr.splice(srcIdx, 1);
  let insertAt = idx;
  if (srcList === list && idx > srcIdx) insertAt = idx - 1;
  dstArr.splice(insertAt, 0, item);

  if (srcList === 'top' || list === 'top') {
    BB_STATE.tiers = (BB_STATE.tiers || []).filter(t => t.after >= 0 && t.after < BB_STATE.top.length - 1);
  }
  bbSave();
  renderBigBoard();
}

function bbDragEnd(e) {
  document.querySelectorAll('.bb-dragging').forEach(el => el.classList.remove('bb-dragging'));
  document.querySelectorAll('.bb-drag-over').forEach(el => el.classList.remove('bb-drag-over'));
  BB_DRAG = null;
}

// ============================================================
//  EXPORT
// ============================================================
function bbExportJSON() {
  const json = JSON.stringify(BB_STATE, null, 2);
  navigator.clipboard.writeText(json).then(() => {
    alert('Big-Board-JSON in die Zwischenablage kopiert.');
  }).catch(() => {
    const w = window.open('', '', 'width=700,height=600');
    w.document.write(`<title>Big Board JSON</title><pre style="font-family:monospace;white-space:pre-wrap;padding:20px;font-size:11px;">${json.replace(/</g, '&lt;')}</pre>`);
    w.document.close();
  });
}

function bbPrintA4() {
  const wasEditing = BB_EDITING;
  if (wasEditing) { BB_EDITING = false; renderBigBoard(); }
  setTimeout(() => {
    window.print();
    if (wasEditing) { BB_EDITING = true; renderBigBoard(); }
  }, 200);
}
