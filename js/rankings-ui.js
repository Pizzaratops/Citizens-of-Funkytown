// ============================================================
//  HASHTAG RANKINGS FUNCTIONS
// ============================================================
var hSortCol=0, hSortAsc=true, hCurrentData=[...HASHTAG_RANKINGS];

function renderHashtag(data) {
  const tbody=document.getElementById('hashtagBody');
  const noR=document.getElementById('hashtagNoResults');
  if(!data.length){tbody.innerHTML='';noR.style.display='block';return;}
  noR.style.display='none';
  tbody.innerHTML=data.map(p=>`<tr>
    <td><span class="r-rank ${rankClass(p[0])}">${p[0]}</span></td>
    <td><span class="r-name">${p[1]}</span></td>
    <td><span class="r-team">${p[2]}</span></td>
    <td><span class="r-pos">${p[3]}</span></td>
  </tr>`).join('');
}

function filterHashtag() {
  const q=document.getElementById('hashtagSearch').value.toLowerCase().trim();
  hCurrentData=q?HASHTAG_RANKINGS.filter(p=>p[1].toLowerCase().includes(q)||p[2].toLowerCase().includes(q)||p[3].toLowerCase().includes(q)):[...HASHTAG_RANKINGS];
  renderHashtag(hCurrentData);
}

function sortHashtag(col) {
  if(hSortCol===col) hSortAsc=!hSortAsc; else{hSortCol=col;hSortAsc=true;}
  document.querySelectorAll('#hashtagRankingsPage .rankings-table thead th').forEach((th,i)=>th.classList.toggle('r-sorted',i===col));
  hCurrentData.sort((a,b)=>{const av=a[col],bv=b[col];const c=typeof av==='number'?av-bv:String(av).localeCompare(String(bv));return hSortAsc?c:-c;});
  renderHashtag(hCurrentData);
}

function showHashtagRankings() { renderHashtag(hCurrentData); navigate('hashtagRankingsPage'); }

// ============================================================
//  DYNASTY RANKINGS — showRankings() war nicht definiert
// ============================================================
var rSortCol=0, rSortAsc=true, rCurrentData=[...DYNASTY_PLAYERS];

let _dynChangeSinceDate = null; // null = Default (vorletzter Snapshot, d.h. "seit letztem Update")

function _dynPopulateChangeSinceDropdown() {
  const sel = document.getElementById('dynChangeSince');
  if (!sel) return;
  const snaps = (typeof DYNASTY_ROLLING !== 'undefined') ? DYNASTY_ROLLING : [];
  if (snaps.length < 2) { sel.innerHTML = '<option value="">— keine Historie —</option>'; sel.disabled = true; return; }
  sel.disabled = false;
  // Alle Snapshots außer dem allerletzten sind moeglich Vergleichspunkte ("seit X")
  const options = snaps.slice(0, -1).map((s, i) => {
    const isDefault = i === snaps.length - 2; // vorletzter Snapshot = Default ("seit letztem Update")
    const isSelected = _dynChangeSinceDate === null ? isDefault : (s.date === _dynChangeSinceDate);
    return `<option value="${s.date}"${isSelected ? ' selected' : ''}>Seit ${s.label}${isDefault ? ' (letztes Update)' : ''}</option>`;
  });
  sel.innerHTML = options.join('');
}

function setDynChangeSince(dateStr) {
  _dynChangeSinceDate = dateStr || null;
  renderDynastyRankings(rCurrentData);
}

function _dynRankChangeBadge(name, currentRank) {
  const snaps = (typeof DYNASTY_ROLLING !== 'undefined') ? DYNASTY_ROLLING : [];
  if (snaps.length < 2) return '';
  const compareDate = _dynChangeSinceDate || snaps[snaps.length - 2].date;
  const prev = snaps.find(s => s.date === compareDate);
  if (!prev) return '';
  const prevRank = prev.ranks[name];
  if (prevRank == null) return ''; // kein Wert im gewählten Vergleichs-Snapshot (z.B. Spieler noch nicht dabei)
  const delta = prevRank - currentRank; // >0 = Rang verbessert (nach oben)
  if (delta === 0) return '';
  return delta > 0
    ? ` <span style="font-size:10px;font-weight:800;color:#6dddaa;white-space:nowrap;" title="Seit ${prev.label}: ${delta} Plätze nach oben">▲${delta}</span>`
    : ` <span style="font-size:10px;font-weight:800;color:#ff8fa3;white-space:nowrap;" title="Seit ${prev.label}: ${Math.abs(delta)} Plätze nach unten">▼${Math.abs(delta)}</span>`;
}

function renderDynastyRankings(data) {
  const tbody = document.getElementById('rankingsBody');
  const noR   = document.getElementById('rankingsNoResults');
  if (!data.length) { tbody.innerHTML=''; if(noR) noR.style.display='block'; return; }
  if(noR) noR.style.display='none';

  // Edit-Mode header / toolbar
  const editActive = (typeof _dynEditModeActive !== 'undefined') && _dynEditModeActive && (typeof isAdmin !== 'undefined') && isAdmin;
  const theadExtra = document.getElementById('rankingsEditHeader');
  if (theadExtra) theadExtra.style.display = editActive ? '' : 'none';

  tbody.innerHTML = data.map(p => {
    const mRk = MATT_RANKS[p[1]] || null;
    const hRk = hashtagRank(p[1]);
    const mBadge = mRk
      ? `<span style="font-size:11px;font-weight:800;padding:2px 8px;border-radius:6px;background:${dynastyRankBg(mRk)};color:${dynastyRankColor(mRk)};">#${mRk}</span>`
      : `<span style="color:var(--border);font-size:11px;">—</span>`;
    const hBadge = hRk
      ? `<span style="font-size:11px;font-weight:800;padding:2px 8px;border-radius:6px;background:${dynastyRankBg(hRk)};color:${dynastyRankColor(hRk)};">#${hRk}</span>`
      : `<span style="color:var(--border);font-size:11px;">—</span>`;
    // Live-Nudge: rein informatives Badge, verändert nicht p[0]/die Sortierung
    // hier auf der Seite. Siehe scripts/build-dynasty-live.js.
    const live = (typeof DYNASTY_LIVE !== 'undefined') ? DYNASTY_LIVE.find(d => d.name === p[1]) : null;
    const liveBadge = live
      ? (live.delta > 0
          ? `<span style="font-size:11px;font-weight:800;padding:2px 8px;border-radius:6px;background:rgba(76,175,129,0.15);color:#6dddaa;" title="Aktuelle Performance deutet nach oben (Basis: ${live.source === 'current' ? 'laufende Saison' : 'Off-Season'})">▲${live.delta}</span>`
          : `<span style="font-size:11px;font-weight:800;padding:2px 8px;border-radius:6px;background:rgba(255,101,132,0.15);color:#ff8fa3;" title="Aktuelle Performance deutet nach unten (Basis: ${live.source === 'current' ? 'laufende Saison' : 'Off-Season'})">▼${Math.abs(live.delta)}</span>`)
      : `<span style="color:var(--border);font-size:11px;">—</span>`;
    const editExtras = (typeof dynEditRowExtras === 'function') ? dynEditRowExtras(p) : { dragAttrs:'', extraCol:'', isModified:false };
    const rowStyle = editExtras.isModified ? 'background:rgba(232,74,39,.08);' : '';
    const dragHandle = editActive ? '<span style="color:var(--muted);cursor:grab;margin-right:6px;user-select:none;">⋮⋮</span>' : '';
    return `<tr ${editExtras.dragAttrs} style="${rowStyle}">
      <td>${dragHandle}<span class="r-rank ${rankClass(p[0])}">${p[0]}</span></td>
      <td><span class="r-name">${p[1]}</span></td>
      <td><span class="r-team">${p[2]}</span></td>
      <td><span class="r-pos">${p[3]}</span></td>
      <td style="text-align:center;white-space:nowrap;"><span style="font-size:11px;font-weight:800;padding:2px 8px;border-radius:6px;background:${dynastyRankBg(p[0])};color:${dynastyRankColor(p[0])};">#${p[0]}</span>${_dynRankChangeBadge(p[1], p[0])}</td>
      <td style="text-align:center;">${liveBadge}</td>
      <td style="text-align:center;">${mBadge}</td>
      <td style="text-align:center;">${hBadge}</td>
      ${editActive ? editExtras.extraCol : ''}
    </tr>`;
  }).join('');
}

function filterRankings() {
  const q = document.getElementById('rankSearch').value.toLowerCase().trim();
  rCurrentData = q
    ? DYNASTY_PLAYERS.filter(p => p[1].toLowerCase().includes(q) || p[2].toLowerCase().includes(q) || p[3].toLowerCase().includes(q))
    : [...DYNASTY_PLAYERS];
  renderDynastyRankings(rCurrentData);
}

function sortRankings(col) {
  if(rSortCol===col) rSortAsc=!rSortAsc; else{rSortCol=col;rSortAsc=true;}
  document.querySelectorAll('#rankingsPage .rankings-table thead th').forEach((th,i)=>th.classList.toggle('r-sorted',i===col));
  rCurrentData.sort((a,b)=>{const av=a[col],bv=b[col];const c=typeof av==='number'?av-bv:String(av).localeCompare(String(bv));return rSortAsc?c:-c;});
  renderDynastyRankings(rCurrentData);
}

function showRankings() {
  _dynPopulateChangeSinceDropdown();
  renderDynastyRankings(rCurrentData);
  navigate('rankingsPage');
  // Edit-Toolbar nur für Admin sichtbar machen
  if (typeof renderDynEditToolbar === 'function') renderDynEditToolbar();
}

function renderDynEditToolbar() {
  const page = document.getElementById('rankingsPage');
  if (!page) return;
  let bar = document.getElementById('dynEditToolbar');
  const showBar = (typeof isAdmin !== 'undefined') && isAdmin;

  if (!showBar) {
    if (bar) bar.style.display = 'none';
    _dynEditModeActive = false; // Edit-Modus aus, wenn nicht Admin
    return;
  }

  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'dynEditToolbar';
    bar.style.cssText = 'display:flex;gap:8px;align-items:center;padding:10px 14px;margin-bottom:10px;background:var(--surface);border:1.5px dashed var(--accent);border-radius:10px;flex-wrap:wrap;font-family:DM Sans,sans-serif;';
    bar.innerHTML = `
      <span style="font-weight:700;color:var(--accent);font-size:13px;">⭐ Admin-Tools:</span>
      <button id="dynEditToggleBtn" onclick="toggleDynastyEditMode()" style="padding:7px 14px;background:transparent;border:1.5px solid var(--accent);color:var(--accent);border-radius:8px;font-weight:700;cursor:pointer;font-size:13px;">✏️ Edit-Modus</button>
      <button onclick="dynEditExportRankingsJs()" style="padding:7px 14px;background:transparent;border:1.5px solid var(--border);color:var(--text);border-radius:8px;font-weight:700;cursor:pointer;font-size:13px;">📤 Export rankings.js</button>
      <button onclick="dynEditResetAll()" style="padding:7px 14px;background:transparent;border:1.5px solid var(--border);color:var(--muted);border-radius:8px;font-weight:700;cursor:pointer;font-size:13px;">↺ Alle zurücksetzen</button>
      <span id="dynEditCount" style="margin-left:auto;font-size:12px;color:var(--muted);"></span>
    `;
    // Vor der Search-Bar einfügen
    const anchor = page.querySelector('#dynEditToolbarAnchor') || page.firstElementChild;
    if (anchor) {
      page.insertBefore(bar, anchor.nextSibling);
    } else {
      page.appendChild(bar);
    }
  }
  bar.style.display = '';

  // Counter aktualisieren
  try {
    const ov = JSON.parse(localStorage.getItem('mfhfbs_dynastyOverrides_v1') || '{}');
    const n = Object.keys(ov).length;
    const cnt = document.getElementById('dynEditCount');
    if (cnt) cnt.textContent = n ? `${n} Override${n === 1 ? '' : 's'} aktiv` : '';
  } catch (e) {}
}
