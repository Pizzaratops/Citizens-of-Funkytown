//  TRADE FINDER
// ============================================================

// ── STATE ──────────────────────────────────────────────────────────────────
const TF_STATE = {
  format: '2for1',
  give: [],
  targetOwner: null,
  giveTeam: null,
  sameTeam: true,
};

// Free-form format: user types numbers directly
// TF_STATE.format stores { give: N, get: M }
function getTFFormat() {
  const g = Math.max(1, Math.min(5, parseInt(document.getElementById('tfGiveNum')?.value) || 2));
  const r = Math.max(1, Math.min(5, parseInt(document.getElementById('tfGetNum')?.value) || 1));
  return { give: g, get: r };
}

function setTFFormatFree() {
  TF_STATE.give = [];
  updateTFGiveUI();
  document.getElementById('tfResults').innerHTML =
    '<div class="tf-empty">Wähle Spieler aus und klicke "Faire Trades finden"</div>';
  document.getElementById('tfResultCount').textContent = '';
}

// Bewertung wie im Trade Analyzer: 2026/27 Projections Rang ->
// tradePlayerValue(). Nur die Top 300, tiefer lohnt kein Trade.
function buildTFPlayerPool() {
  return buildTradePlayerPool()
    .filter(p => p.rank <= 300)
    .map(p => ({ ...p, dynVal: tradePlayerValue(p.rank) }))
    .filter(p => p.dynVal > 0);
}

function renderTFGiveList() {
  const fmt  = getTFFormat();
  const q    = (document.getElementById('tfGiveSearch')?.value || '').toLowerCase().trim();
  const listEl = document.getElementById('tfGiveList');
  if (!listEl) return;

  const pool = buildTFPlayerPool().filter(p => {
    if (TF_STATE.giveTeam && p.ownerId !== TF_STATE.giveTeam) return false;
    return true;
  });
  const filtered = q
    ? pool.filter(p => p.name.toLowerCase().includes(q) || p.nba.toLowerCase().includes(q))
    : pool;
  const selectedNames = new Set(TF_STATE.give.map(p => p.name));
  const isMaxed = TF_STATE.give.length >= fmt.give;
  if (!q && !filtered.length) {
    listEl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--muted);font-size:12px;">Tippe zum Suchen…</div>';
    return;
  }
  if (!q) {
    listEl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--muted);font-size:12px;">Tippe zum Suchen…</div>';
    return;
  }
  listEl.innerHTML = filtered.slice(0, 80).map(p => {
    const isSel    = selectedNames.has(p.name);
    const disabled = !isSel && isMaxed;
    const rb       = rankTierBg(p.rank);
    const rc       = rankTierColor(p.rank);
    const ownerLbl = p.owner ? p.owner.name : 'Unowned';
    return `<div class="tf-player-item ${isSel ? 'selected' : ''}"
      style="${disabled ? 'opacity:0.4;cursor:default;' : ''}"
      onclick="${disabled ? '' : `toggleTFGive('${p.name.replace(/'/g, "\\'")}')`}">
      <div class="tf-check">${isSel ? '<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</div>
      <div style="flex:1;">
        <div style="font-weight:600;font-size:13px;color:var(--text);">${p.name}</div>
        <div style="font-size:11px;color:var(--muted);">${p.nba} · ${ownerLbl}</div>
      </div>
      <span style="font-size:10px;font-weight:800;padding:2px 7px;border-radius:5px;background:${rb};color:${rc};">#${p.rank}</span>
    </div>`;
  }).join('') || '<div style="text-align:center;padding:24px;color:var(--muted);font-size:12px;">Keine Spieler gefunden.</div>';
}

function toggleTFGive(name) {
  const fmt    = getTFFormat();
  const pool   = buildTFPlayerPool();
  const player = pool.find(p => p.name === name);
  if (!player) return;
  const idx = TF_STATE.give.findIndex(p => p.name === name);
  if (idx >= 0) {
    TF_STATE.give.splice(idx, 1);
  } else {
    if (TF_STATE.give.length >= fmt.give) return;
    TF_STATE.give.push(player);
  }
  updateTFGiveUI();
}

function updateTFGiveUI() {
  const fmt = getTFFormat();
  const cntEl = document.getElementById('tfGiveCount');
  if (cntEl) cntEl.textContent = `${TF_STATE.give.length} / ${fmt.give}`;
  const pillsEl = document.getElementById('tfGivePills');
  if (pillsEl) {
    pillsEl.innerHTML = TF_STATE.give.length
      ? TF_STATE.give.map(p => {
          return `<span class="tf-pill" onclick="toggleTFGive('${p.name.replace(/'/g, "\\'")}')">
            ${p.name} <span style="font-size:14px;opacity:0.7;line-height:1;">×</span>
          </span>`;
        }).join('')
      : '<span style="color:var(--muted);font-size:12px;">Noch nichts ausgewählt</span>';
  }
  const valEl = document.getElementById('tfGiveValue');
  if (valEl) {
    if (TF_STATE.give.length) {
      const sorted = [...TF_STATE.give].sort((a, b) => b.dynVal - a.dynVal);
      const total  = sorted.reduce((s, p, i) => s + Math.round(p.dynVal * Math.pow(0.70, i)), 0);
      valEl.innerHTML = `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:10px 14px;font-size:12px;">
        <span style="color:var(--muted);font-weight:600;">Gesamtwert:</span>
        <span style="font-family:'Playfair Display',serif;font-size:18px;font-weight:800;color:var(--accent);margin-left:8px;">${total.toLocaleString()}</span>
      </div>`;
    } else {
      valEl.innerHTML = '';
    }
  }
  renderTFGiveList();
}

function initTFOwnerFilter() {
  const sel = document.getElementById('tfOwnerDropdown');
  if (!sel) return;
  sel.innerHTML =
    `<option value="">🕺 Alle Teams</option>` +
    TEAMS.map(t => `<option value="${t.id}">${t.name} (${t.owner})</option>`).join('');
  sel.value = TF_STATE.targetOwner || '';
  initTFGiveTeamDropdown();
}

function setTFOwnerFromDropdown() {
  const sel = document.getElementById('tfOwnerDropdown');
  const val = sel ? sel.value : '';
  TF_STATE.targetOwner = val ? parseInt(val) : null;
  renderTFGiveList();
}

function initTFGiveTeamDropdown() {
  const sel = document.getElementById('tfGiveTeamDropdown');
  if (!sel) return;
  sel.innerHTML =
    `<option value="">🕺 Alle Teams</option>` +
    TEAMS.map(t => `<option value="${t.id}">${t.name} (${t.owner})</option>`).join('');
  sel.value = TF_STATE.giveTeam || '';
}

function setTFGiveTeamFromDropdown() {
  const sel = document.getElementById('tfGiveTeamDropdown');
  const val = sel ? sel.value : '';
  TF_STATE.giveTeam = val ? parseInt(val) : null;
  TF_STATE.give = []; // clear selection when team changes
  updateTFGiveUI();
}

function runTradeFinder() {
  const fmt = getTFFormat();
  if (TF_STATE.give.length !== fmt.give) {
    const btn = document.getElementById('tfFindBtn');
    const orig = btn.textContent;
    btn.textContent = `⚠️ Wähle genau ${fmt.give} Spieler aus!`;
    btn.style.background = '#ff6584';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2000);
    return;
  }
  document.getElementById('tfResults').innerHTML = `
    <div class="tf-loading">
      <div class="spinner"></div>
      <div>Suche faire Kombinationen…</div>
      <div class="tf-progress"><div class="tf-progress-bar" id="tfProgressBar" style="width:0%"></div></div>
    </div>`;
  document.getElementById('tfResultCount').textContent = '';
  setTimeout(() => _runTFCore(fmt), 60);
}

function _runTFCore(fmt) {
  const giveNames  = new Set(TF_STATE.give.map(p => p.name));
  const giveSorted = [...TF_STATE.give].sort((a, b) => b.dynVal - a.dynVal);
  const giveTotal  = giveSorted.reduce((s, p, i) => s + Math.round(p.dynVal * Math.pow(0.70, i)), 0);
  const tol    = 0.13;
  const minVal = Math.round(giveTotal * (1 - tol));
  const maxVal = Math.round(giveTotal * (1 + tol));

  // Build player pool for results
  // — always exclude players that are being given away
  // — always exclude the give-side team (you can't trade to yourself)
  // — if a specific targetOwner is set, restrict to that team only
  const allPlayers = buildTFPlayerPool().filter(p => {
    if (giveNames.has(p.name)) return false;
    if (TF_STATE.targetOwner) return p.ownerId === TF_STATE.targetOwner;
    if (TF_STATE.giveTeam && p.ownerId === TF_STATE.giveTeam) return false;
    return true;
  }).sort((a, b) => b.dynVal - a.dynVal);

  const results = [];
  const seen    = new Set();
  _runTFCorePlayersOnly(fmt, allPlayers, giveSorted, giveTotal, minVal, maxVal, seen, results);

  results.sort((a, b) => a.diffPct - b.diffPct);
  const top = results.slice(0, 10);
  window._tfLastResults  = top;
  window._tfGivePlayers  = TF_STATE.give;
  _renderTFResults(top, giveTotal);
}

function _runTFCorePlayersOnly(fmt, pool, giveSorted, giveTotal, minVal, maxVal, seen, results) {
  if (fmt.get === 1) {
    for (const p of pool) {
      if (p.dynVal < minVal) continue;
      if (p.dynVal > maxVal) continue;
      const key = p.name;
      if (!seen.has(key)) {
        seen.add(key);
        const pct = Math.round(Math.abs(p.dynVal - giveTotal) / Math.max(giveTotal, 1) * 100);
        results.push({ players: [p], total: p.dynVal, diffPct: pct });
      }
    }
  } else if (fmt.get === 2) {
    const n = pool.length;
    for (let i = 0; i < n && results.length < 200; i++) {
      const a = pool[i];
      if (a.dynVal > maxVal) continue;
      for (let j = i + 1; j < n; j++) {
        const b   = pool[j];
        if (TF_STATE.sameTeam && a.ownerId !== b.ownerId) continue;
        const tot = Math.round(a.dynVal + b.dynVal * 0.70);
        if (tot < minVal) break;
        if (tot <= maxVal) {
          const key = [a.name, b.name].sort().join('|');
          if (!seen.has(key)) {
            seen.add(key);
            const pct = Math.round(Math.abs(tot - giveTotal) / Math.max(giveTotal, 1) * 100);
            results.push({ players: [a, b], total: tot, diffPct: pct });
          }
        }
      }
      if (i % 15 === 0) {
        const bar = document.getElementById('tfProgressBar');
        if (bar) bar.style.width = Math.min(90, Math.round(i / n * 100)) + '%';
      }
    }
  } else if (fmt.get === 3) {
    const n = pool.length;
    outer: for (let i = 0; i < n; i++) {
      const a = pool[i];
      if (a.dynVal > maxVal) continue;
      for (let j = i + 1; j < n; j++) {
        const b       = pool[j];
        if (TF_STATE.sameTeam && a.ownerId !== b.ownerId) continue;
        const partial = Math.round(a.dynVal + b.dynVal * 0.70);
        if (partial < minVal * 0.25) break;
        for (let k = j + 1; k < n; k++) {
          const c   = pool[k];
          if (TF_STATE.sameTeam && c.ownerId !== a.ownerId) continue;
          const tot = partial + Math.round(c.dynVal * 0.49);
          if (tot < minVal) break;
          if (tot <= maxVal) {
            const key = [a.name, b.name, c.name].sort().join('|');
            if (!seen.has(key)) {
              seen.add(key);
              const pct = Math.round(Math.abs(tot - giveTotal) / Math.max(giveTotal, 1) * 100);
              results.push({ players: [a, b, c], total: tot, diffPct: pct });
            }
          }
          if (results.length > 300) break outer;
        }
      }
    }
  }
}

function _renderTFResults(results, giveTotal) {
  const countEl = document.getElementById('tfResultCount');
  const resEl   = document.getElementById('tfResults');
  const isLight = document.body.classList.contains('light');
  if (!results.length) {
    countEl.textContent = '';
    const shareBtn = document.getElementById('tfShareBtn');
    if (shareBtn) shareBtn.style.display = 'none';
    resEl.innerHTML = `<div class="tf-empty">
      😔 Keine fairen Trades gefunden<br>
      <span style="font-size:11px;margin-top:8px;display:block;">Versuche einen anderen Trade-Typ, andere Spieler oder deaktiviere den Team-Filter</span>
    </div>`;
    return;
  }
  countEl.textContent = `(${results.length} gefunden)`;
  const shareBtn = document.getElementById('tfShareBtn');
  if (shareBtn) shareBtn.style.display = 'block';
  resEl.innerHTML = results.map((r, idx) => {
    const diff = r.diffPct;
    let ringColor, ringBg, fairLabel;
    if (diff <= 4)  { ringColor = '#4caf81'; ringBg = 'rgba(76,175,129,0.12)';  fairLabel = '✅ Fair'; }
    else if (diff <= 8) { ringColor = '#f5c842'; ringBg = 'rgba(245,200,66,0.1)'; fairLabel = '🟡 Fast Fair'; }
    else            { ringColor = '#ffa726'; ringBg = 'rgba(255,167,38,0.1)';    fairLabel = '🟠 Nah dran'; }
    const ownerGroups = {};
    r.players.forEach(p => {
      const k = p.owner ? p.owner.name : 'Free Agent / Unowned';
      if (!ownerGroups[k]) ownerGroups[k] = { owner: p.owner, players: [] };
      ownerGroups[k].players.push(p);
    });
    const playerChips = r.players.map(p => {
      const rc = rankTierColor(p.rank);
      const rb = rankTierBg(p.rank);
      const ownerColor = p.owner ? (isLight ? p.owner.lightColor : p.owner.color) : 'var(--muted)';
      return `<div class="tf-result-player-chip">
        <span style="font-size:9px;font-weight:800;padding:1px 5px;border-radius:3px;background:${rb};color:${rc};">#${p.rank}</span>
        <span>${p.name}</span>
        ${p.owner ? `<span style="font-size:9px;font-weight:700;color:${ownerColor};">${p.owner.name.split(' ')[0]}</span>` : ''}
      </div>`;
    }).join('');
    const detailHtml = Object.values(ownerGroups).map(group => {
      const ownerColor = group.owner ? (isLight ? group.owner.lightColor : group.owner.color) : 'var(--muted)';
      return `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:10px 14px;margin-bottom:8px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:1px;color:${ownerColor};text-transform:uppercase;margin-bottom:8px;">
          ${group.owner ? `Von: ${group.owner.name}` : 'Free Agent'}
        </div>
        ${group.players.map(p => {
          const age = p.dob ? playerAge(p.dob) : null;
          return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);">
            <span style="font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px;background:${rankTierBg(p.rank)};color:${rankTierColor(p.rank)};">#${p.rank}</span>
            <div style="flex:1;">
              <div style="font-weight:600;font-size:13px;color:var(--text);">${p.name}</div>
              <div style="font-size:11px;color:var(--muted);">${p.nba} · ${p.pos}${age !== null ? ` · ${age}y` : ''}</div>
            </div>
            <div style="text-align:right;font-size:11px;font-weight:800;color:var(--muted);">${p.dynVal.toLocaleString()}</div>
          </div>`;
        }).join('')}
      </div>`;
    }).join('');
    return `<div class="tf-result-card" style="animation-delay:${idx * 0.04}s;">
      <div class="tf-result-header" onclick="
        const body = this.nextElementSibling;
        body.style.display = body.style.display === 'none' ? 'block' : 'none';
        const arrow = this.querySelector('.tf-chevron');
        if (arrow) arrow.textContent = body.style.display === 'none' ? '▾' : '▴';
      ">
        <div class="tf-fairness-ring" style="background:${ringBg};border-color:${ringColor};color:${ringColor};">
          ${diff}%
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:5px;">${fairLabel} · Du bekommst</div>
          <div class="tf-result-players">${playerChips}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;flex-shrink:0;gap:2px;">
          <div style="font-family:'Playfair Display',serif;font-size:15px;font-weight:800;color:var(--text);">${r.total.toLocaleString()}</div>
          <div style="font-size:10px;color:var(--muted);">vs ${giveTotal.toLocaleString()}</div>
          <span class="tf-chevron" style="font-size:14px;color:var(--muted);">▾</span>
        </div>
      </div>
      <div style="display:none;">
        <div style="padding:0 16px 4px;">${detailHtml}</div>
        <div style="display:flex;gap:8px;padding:0 16px 14px;">
          <button class="tf-action-btn secondary" onclick="loadTFIntoAnalyzer(${idx})">⚖️ Im Trade Analyzer öffnen</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function loadTFIntoAnalyzer(idx) {
  const give    = window._tfGivePlayers || [];
  const receive = window._tfLastResults?.[idx]?.players || [];
  if (!give.length || !receive.length) return;
  showTrade();
  setTimeout(() => {
    TRADE_STATE.A.selected  = [...give];
    TRADE_STATE.B.selected  = [...receive];
    ['A','B'].forEach(side => {
      document.getElementById('tradeNbaFilter' + side).value = '';
      document.getElementById('tradeTTFilter'  + side).value = '';
      document.getElementById('tradeSearch'    + side).value = '';
    });
    renderTradeList('A');
    renderTradeList('B');
    renderSelectedPills('A');
    renderSelectedPills('B');
    renderTradeResult();
  }, 120);
}

function showTradeFinder() {
  // Reset state
  TF_STATE.give        = [];
  TF_STATE.targetOwner = null;
  TF_STATE.giveTeam    = null;
  TF_STATE.format      = '2for1';
  TF_STATE.sameTeam    = true;

  // Reset format inputs
  const gn = document.getElementById('tfGiveNum');
  const rn = document.getElementById('tfGetNum');
  if (gn) gn.value = 2;
  if (rn) rn.value = 1;

  // Reset share button
  const shareBtn = document.getElementById('tfShareBtn');
  if (shareBtn) shareBtn.style.display = 'none';

  initTFOwnerFilter();
  updateTFGiveUI();
  document.getElementById('tfResults').innerHTML     = '<div class="tf-empty">Wähle Spieler aus und klicke "Faire Trades finden"</div>';
  document.getElementById('tfResultCount').textContent = '';
  if (document.getElementById('tfGiveSearch')) document.getElementById('tfGiveSearch').value = '';
  navigate('tradeFinderPage');
}

// ── TRADE FINDER SHARE ─────────────────────────────────────────────────────
function openTFShareModal() {
  const results = window._tfLastResults || [];
  const give    = window._tfGivePlayers || [];
  if (!results.length || !give.length) return;

  // E: Reset _tradeShareText, damit Copy-Fallback auf Card-innerText liest
  window._tradeShareText = '';

  const isLight = document.body.classList.contains('light');
  const th = isLight ? {
    bg: '#fff5ee', surface: '#ffffff', surface2: '#fdebd8',
    border: '#f0d5bc', text: '#2c1a0e', muted: '#9a7560',
    accentA: '#c0622f', accentB: '#e8975a', divider: '#f0d5bc', footer: '#c8a882',
  } : {
    bg: '#0f1117', surface: '#1a1d27', surface2: '#222636',
    border: '#2e3250', text: '#e8eaf6', muted: '#7b7f9e',
    accentA: '#6c63ff', accentB: '#ff6584', divider: '#2e3250', footer: '#2e3250',
  };

  // Give side summary
  const giveSorted = [...give].sort((a, b) => b.dynVal - a.dynVal);
  const giveTotal  = giveSorted.reduce((s, p, i) => s + Math.round(p.dynVal * Math.pow(0.70, i)), 0);

  function giveRow(p, i) {
    return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid ${th.border};">
      <div style="width:26px;height:26px;border-radius:7px;background:${th.accentA}22;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:${th.accentA};flex-shrink:0;">${i+1}</div>
      <div style="flex:1;">
        <div style="font-weight:700;font-size:13px;color:${th.text};">${p.name}</div>
        <div style="font-size:11px;color:${th.muted};">${p.nba} · ${p.owner ? p.owner.name : 'Unowned'}</div>
      </div>
      <div style="font-size:12px;font-weight:800;color:${th.text};">${p.dynVal.toLocaleString()}</div>
    </div>`;
  }

  function resultBlock(r, idx) {
    const fairColor = r.diffPct <= 4 ? '#4caf81' : r.diffPct <= 8 ? '#f5c842' : '#ffa726';
    const fairLabel = r.diffPct <= 4 ? '✅ Fair' : r.diffPct <= 8 ? '🟡 Fast Fair' : '🟠 Nah dran';
    const rows = r.players.map((p, i) => `
      <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid ${th.border};">
        <div style="width:26px;height:26px;border-radius:7px;background:${th.accentB}22;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:${th.accentB};flex-shrink:0;">${i+1}</div>
        <div style="flex:1;">
          <div style="font-weight:700;font-size:13px;color:${th.text};">${p.name}</div>
          <div style="font-size:11px;color:${th.muted};">${p.nba} · ${p.owner ? p.owner.name : 'Unowned'}</div>
        </div>
        <div style="font-size:12px;font-weight:800;color:${th.text};">${p.dynVal.toLocaleString()}</div>
      </div>`).join('');
    return `<div style="border:1px solid ${fairColor}44;border-radius:12px;padding:12px 14px;margin-bottom:10px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <span style="font-size:11px;font-weight:700;color:${fairColor};">${fairLabel} · Option ${idx + 1}</span>
        <span style="font-size:12px;font-weight:800;color:${th.text};">${r.total.toLocaleString()} <span style="font-size:10px;color:${th.muted};">vs ${giveTotal.toLocaleString()}</span></span>
      </div>
      ${rows}
    </div>`;
  }

  const cardHtml = `<div id="shareCardInner" style="
    background:${th.bg};border:2px solid ${th.accentA};border-radius:20px;
    padding:24px 20px 20px;font-family:'DM Sans',system-ui,sans-serif;color:${th.text};
    max-width:480px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:14px;">
      <div style="font-size:10px;font-weight:700;letter-spacing:2px;color:${th.muted};text-transform:uppercase;margin-bottom:5px;">🌮 Taco Tuesday HQ · Trade Finder</div>
      <div style="font-family:'Playfair Display',Georgia,serif;font-size:22px;font-weight:800;color:${th.accentA};">Trade Vorschläge</div>
    </div>
    <div style="background:${th.surface};border:1px solid ${th.border};border-radius:12px;padding:12px 14px;margin-bottom:14px;">
      <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${th.muted};margin-bottom:8px;">Du gibst ab · Gesamtwert ${giveTotal.toLocaleString()}</div>
      ${giveSorted.map((p, i) => giveRow(p, i)).join('')}
    </div>
    <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${th.muted};margin-bottom:8px;">Faire Gegenleistungen</div>
    ${results.slice(0, 5).map((r, i) => resultBlock(r, i)).join('')}
    <div style="text-align:center;margin-top:8px;font-size:9px;color:${th.muted};letter-spacing:1px;text-transform:uppercase;">taco-tuesday-league.com</div>
  </div>`;

  document.getElementById('shareCardContent').innerHTML = cardHtml;
  document.getElementById('shareModalOverlay').style.display = 'flex';
}

// ============================================================
