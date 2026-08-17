//  TRADE HISTORY
// ============================================================

const TH_STORAGE_KEY = 'taco_trade_history';
let TH_MODE = 'dynasty';

// Basis-Trades kommen aus data/trade-history.js (TRADE_HISTORY_BASE) --
// dort committed = fuer alle Ligamitglieder sichtbar. localStorage ist
// nur das Staging des Admins fuer noch nicht committete Trades; der
// Export-Button unten erzeugt die naechste Version der Datendatei.
const HARDCODED_TRADES = (typeof TRADE_HISTORY_BASE !== 'undefined') ? TRADE_HISTORY_BASE : [];

function setTHMode(mode) {
  TH_MODE = mode;
  ['Dynasty','Raw','Winnow'].forEach(m => {
    const btn = document.getElementById('thMode' + m);
    if (!btn) return;
    btn.style.background = m.toLowerCase() === mode ? 'var(--accent)' : 'transparent';
    btn.style.color = m.toLowerCase() === mode ? 'white' : 'var(--muted)';
  });
  renderTradeHistory();
}

function loadTradeHistory() {
  const hardcodedIds = new Set(HARDCODED_TRADES.map(t => t.id));
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem(TH_STORAGE_KEY) || '[]'); } catch(e) {}
  const userTrades = saved.filter(t => !hardcodedIds.has(t.id));
  return [...userTrades, ...HARDCODED_TRADES];
}

function saveTradeHistory(trades) {
  const hardcodedIds = new Set(HARDCODED_TRADES.map(t => t.id));
  const userTrades = trades.filter(t => !hardcodedIds.has(t.id));
  try { localStorage.setItem(TH_STORAGE_KEY, JSON.stringify(userTrades)); } catch(e) {}
}

function saveTradeToHistory() {
  const selA = TRADE_STATE.A.selected;
  const selB = TRADE_STATE.B.selected;
  const resultBox = document.querySelector('.trade-result-box');
  if (!selA.length || !selB.length || !resultBox) {
    alert('Bitte zuerst einen Trade analysieren!');
    return;
  }
  const serializePlayer = p => p.isPick
    ? { isPick: true, pickKey: p.pickKey, year: p.year, round: p.round,
        name: p.name, baseValue: p.baseValue,
        origName: p.orig?.name || '', currName: p.curr?.name || '', traded: p.traded }
    : { isPick: false, rank: p.rank, name: p.name, nba: p.nba, pos: p.pos,
        dob: p.dob || null, ownerName: p.owner?.name || 'Unowned' };

  const computeForMode = (mode) => {
    const origMode = TRADE_MODE;
    TRADE_MODE = mode;
    const vA = tradeSideValue(selA);
    const vB = tradeSideValue(selB);
    TRADE_MODE = origMode;
    const tot = vA + vB;
    const pA = tot > 0 ? (vA / tot * 100) : 50;
    const d = Math.abs(pA - 50);
    let v, cls2;
    if (d < 5)      { v = 'Fair Trade'; cls2 = 'fair'; }
    else if (d < 12){ v = vA > vB ? 'Slight Edge: Side A' : 'Slight Edge: Side B'; cls2 = 'slight'; }
    else            { v = vA > vB ? 'Side A Wins Big' : 'Side B Wins Big'; cls2 = 'lopsided'; }
    return { valA: vA, valB: vB, verdict: v, cls: cls2, pctA: pA.toFixed(1), pctB: (100-pA).toFixed(1) };
  };

  const trade = {
    id: Date.now(),
    date: new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }),
    savedMode: TRADE_MODE,
    sideA: selA.map(serializePlayer),
    sideB: selB.map(serializePlayer),
    frozen: { dynasty: computeForMode('dynasty'), raw: computeForMode('raw'), winnow: computeForMode('winnow') },
  };

  const trades = loadTradeHistory();
  trades.unshift(trade);
  saveTradeHistory(trades);

  const btn = document.getElementById('tradeSaveBtn');
  if (btn) {
    btn.textContent = '✅ Gespeichert!';
    btn.style.background = 'linear-gradient(135deg,#4caf81,#4caf81)';
    setTimeout(() => { btn.textContent = '✅ Done – Trade speichern'; btn.style.background = 'linear-gradient(135deg,#4caf81,#29b6f6)'; }, 2000);
  }
}

function showTradeHistory() {
  renderTradeHistory();
  navigate('tradeHistoryPage');
}

// ── EXPORT FÜR REPO (nur Admin) ──────────────────────────────
//  Erzeugt die komplette nächste Version von data/trade-history.js:
//  Basis-Trades + alle nur-lokalen Trades aus localStorage, sortiert
//  nach ID absteigend (= neueste zuerst, IDs sind Date.now()-Timestamps
//  bzw. feste 17xxxxxxxxx-Nummern der Alt-Trades). Die Datei wird als
//  Download angeboten — MANUELL als data/trade-history.js committen.
//  Nach dem Commit greift der ID-Filter in loadTradeHistory() und die
//  localStorage-Kopien werden automatisch ignoriert.
function exportTradeHistoryFile() {
  if (!isAdmin) { toast('⛔ Nur für Admins'); return; }
  const all = loadTradeHistory(); // user-Trades zuerst, dann Basis
  const merged = [...all].sort((a, b) => (b.id || 0) - (a.id || 0));
  const localCount = all.length - HARDCODED_TRADES.length;

  const header = [
    '// ============================================================',
    '//  TRADE HISTORY — Basis-Daten (für alle Ligamitglieder sichtbar)',
    '// ============================================================',
    '//  Diese Datei ist die einzige dauerhafte Quelle der Trade History.',
    '//  Neue Trades landen zunächst nur im localStorage des Admins',
    '//  (Staging). Der Button "⬇ Für Repo exportieren" auf der Trade-',
    '//  History-Seite (nur Admin) erzeugt eine neue Version dieser Datei',
    '//  mit allen lokalen Trades eingearbeitet — die heruntergeladene',
    '//  Datei dann einfach als data/trade-history.js committen.',
    '//  Nach dem Commit werden die localStorage-Kopien automatisch',
    '//  ignoriert (ID-Abgleich in loadTradeHistory()).',
    '//',
    '//  MANUELL: Der Commit passiert nicht automatisch — Datei herunter-',
    '//  laden und ins Repo pushen ist ein bewusst manueller Schritt',
    '//  (kein Contents-Schreibtoken im öffentlichen Client-JS).',
    '//',
    '//  Zuletzt exportiert: ' + new Date().toISOString().slice(0, 10),
    '// ============================================================',
    'const TRADE_HISTORY_BASE = [',
  ].join('\n');
  const body = merged.map(t => '  ' + JSON.stringify(t)).join(',\n');
  const fileContent = header + '\n' + body + '\n];\n';

  const blob = new Blob([fileContent], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'trade-history.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  toast('⬇ ' + merged.length + ' Trades exportiert (' + localCount + ' neu) — als data/trade-history.js committen');
}

// Zeigt dem Admin auf der Trade-History-Seite an, wie viele Trades nur
// lokal (noch nicht committed) existieren, und blendet den Export-Button ein.
function _thUpdateExportUI() {
  const btn = document.getElementById('thExportBtn');
  if (!btn) return;
  if (!isAdmin) { btn.style.display = 'none'; return; }
  const localCount = loadTradeHistory().length - HARDCODED_TRADES.length;
  btn.style.display = '';
  btn.textContent = localCount > 0
    ? '⬇ Für Repo exportieren (' + localCount + ' neu)'
    : '⬇ Für Repo exportieren';
  btn.style.borderColor = localCount > 0 ? 'var(--accent)' : 'var(--border)';
  btn.style.color = localCount > 0 ? 'var(--accent)' : 'var(--muted)';
}

function adminAddPickToTrade(tradeId) {
  const year  = prompt('Pick Jahr (z.B. 2026):');
  if (!year) return;
  const round = prompt('Runde (1 oder 2):');
  if (!round) return;
  const side  = prompt('Welche Seite bekommt den Pick? A oder B:')?.toUpperCase();
  if (side !== 'A' && side !== 'B') return;

  const trades = loadTradeHistory();
  const trade  = trades.find(t => t.id == tradeId);
  if (!trade) return;

  const pickObj = {
    isPick: true,
    year: parseInt(year),
    round: parseInt(round),
    name: year + ' R' + round,
    baseValue: 500, // rough placeholder
    origName: '', currName: '', traded: false,
  };

  if (side === 'A') trade.sideA.push(pickObj);
  else              trade.sideB.push(pickObj);
  trade.hasMissingPicks = false;

  saveTradeHistory(trades);
  renderTradeHistory();
  if (typeof toast === 'function') toast('✅ Pick hinzugefügt: ' + year + ' R' + round + ' → Side ' + side);
}

function showNbaTrades() {
  navigate('nbaTradesPage');
  renderNbaTrades();
  const lastTs = parseInt(localStorage.getItem('nbaTradesTs') || '0');
  if (Date.now() - lastTs > 60 * 60 * 1000) fetchNbaTrades().then(renderNbaTrades);
}

function renderNbaTrades() {
  const container = document.getElementById('nbaTradesList');
  if (!container) return;
  const fantasyNames = new Set();
  Object.values(ROSTERS).forEach(roster => roster.forEach(p => fantasyNames.add(p.name)));
  const raw = localStorage.getItem('nbaTrades');
  if (!raw) {
    container.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--muted);"><div style="font-size:36px;margin-bottom:12px;">⚠️</div><div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px;">Feature aktuell pausiert</div><div style="font-size:13px;max-width:420px;margin:0 auto;">Die bisherige Datenquelle (Balldontlie-API) bietet den Trades-Endpoint nicht mehr an. Sobald es eine kostenlose Alternative gibt, kommt das Feature zurück.</div></div>';
    return;
  }
  let trades = [];
  try { trades = JSON.parse(raw); } catch(e) { return; }
  if (!trades.length) {
    container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted);font-size:14px;">Keine Trades gefunden</div>';
    return;
  }
  const isLight = document.body.classList.contains('light');
  container.innerHTML = trades.map(t => {
    const rows = t.players.map(p => {
      const inLeague = fantasyNames.has(p.name);
      const bg = inLeague ? (isLight ? 'rgba(76,175,129,0.12)' : 'rgba(76,175,129,0.18)') : 'transparent';
      const badge = inLeague ? '<span style="font-size:10px;font-weight:800;padding:2px 7px;border-radius:10px;background:rgba(76,175,129,0.2);color:#4caf81;margin-left:8px;">In Liga ✓</span>' : '';
      return '<div style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:8px;background:' + bg + ';margin-bottom:3px;">'
        + '<span style="font-size:11px;font-weight:800;padding:2px 7px;border-radius:5px;background:var(--surface2);color:var(--muted);min-width:34px;text-align:center;">' + p.fromTeam + '</span>'
        + '<span style="color:var(--muted);font-size:13px;">' + String.fromCharCode(8594) + '</span>'
        + '<span style="font-size:11px;font-weight:800;padding:2px 7px;border-radius:5px;background:var(--surface2);color:var(--accent);min-width:34px;text-align:center;">' + p.toTeam + '</span>'
        + '<span style="flex:1;font-size:13px;font-weight:' + (inLeague ? '700' : '500') + ';color:var(--text);">' + p.name + badge + '</span>'
        + '</div>';
    }).join('');
    return '<div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px 16px;margin-bottom:10px;animation:fadeSlideIn 0.2s ease;">'
      + '<div style="font-size:11px;color:var(--muted);font-weight:700;letter-spacing:0.5px;margin-bottom:10px;">📅 ' + t.date + '</div>'
      + rows + '</div>';
  }).join('');
}

function deleteTradeEntry(id) {
  const hardcodedIds = new Set(HARDCODED_TRADES.map(t => t.id));
  if (hardcodedIds.has(id)) { alert('Basis-Trades können nicht gelöscht werden.'); return; }
  const trades = loadTradeHistory().filter(t => t.id !== id);
  saveTradeHistory(trades);
  renderTradeHistory();
}

function renderTradeHistory() {
  _thUpdateExportUI();
  const trades = loadTradeHistory();
  const container = document.getElementById('tradeHistoryList');
  if (!container) return;
  if (!trades.length) {
    container.innerHTML = `<div style="text-align:center;padding:60px 20px;color:var(--muted);border:2px dashed var(--border);border-radius:16px;margin-top:20px;"><div style="font-size:40px;margin-bottom:12px;">📋</div><div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px;">Noch keine Trades gespeichert</div><div style="font-size:13px;">Analysiere einen Trade und klicke "✅ Done – Trade speichern"</div></div>`;
    return;
  }
  const isLight = document.body.classList.contains('light');
  container.innerHTML = trades.map(t => {
    const d = (t.frozen && t.frozen[TH_MODE]) || { valA: t.valA||0, valB: t.valB||0, verdict: t.verdict||'', cls: t.cls||'fair', pctA: t.pctA||'50', pctB: t.pctB||'50' };
    const { valA, valB, verdict, cls, pctA, pctB } = d;
    const verdictColor = isLight ? (cls==='fair'?'#3d8a5c':cls==='slight'?'#9a6e10':'#b43c64') : (cls==='fair'?'#4caf81':cls==='slight'?'#f5c842':'#ff6584');
    const barColor = cls==='fair'?'#4caf81':cls==='slight'?'#f5c842':'#ff6584';
    const savedModeLabel = {dynasty:'🏗️ Dynasty',raw:'📊 Raw',winnow:'🏆 Win-Now'}[t.savedMode||t.mode]||'';
    const hardcodedIds = new Set(HARDCODED_TRADES.map(x=>x.id));
    const isHardcoded = hardcodedIds.has(t.id);

    const renderSide = (players, label, val) => {
      const rows = players.map(p => {
        if (p.isPick) return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);">
          <span style="font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px;background:rgba(197,143,50,0.15);color:#c58f32;flex-shrink:0;">📋 R${p.round}</span>
          <div style="flex:1;"><div style="font-weight:600;font-size:12px;color:var(--text);">${p.year} · Round ${p.round}</div><div style="font-size:11px;color:var(--muted);">${p.traded?'→ von '+p.origName:p.currName}</div></div>
          <div style="font-size:11px;font-weight:700;color:#c58f32;">~${(p.baseValue||0).toLocaleString()}</div></div>`;
        return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);">
          <span style="font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px;background:${dynastyRankBg(p.rank)};color:${dynastyRankColor(p.rank)};flex-shrink:0;">#${p.rank}</span>
          <div style="flex:1;"><div style="font-weight:600;font-size:12px;color:var(--text);">${p.name}</div><div style="font-size:11px;color:var(--muted);">${p.nba} · ${p.ownerName}</div></div></div>`;
      }).join('');
      return `<div style="flex:1;min-width:140px;background:var(--surface2);border-radius:10px;padding:10px 12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);">${label}</span>
          <span style="font-family:'Playfair Display',serif;font-size:16px;font-weight:800;color:var(--accent);">${val.toLocaleString()}</span>
        </div>${rows}</div>`;
    };

    return `<div style="background:var(--surface);border:1px solid ${verdictColor}55;border-left:3px solid ${verdictColor};border-radius:14px;padding:16px 18px;margin-bottom:12px;animation:fadeSlideIn 0.25s ease;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px;">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <span style="font-family:'Playfair Display',serif;font-size:16px;font-weight:800;color:${verdictColor};">${verdict}</span>
          <span style="font-size:10px;font-weight:700;background:var(--surface2);border:1px solid var(--border);color:var(--muted);padding:2px 8px;border-radius:10px;">gespeichert: ${savedModeLabel}</span>
          <span style="font-size:11px;color:var(--muted);">${t.date}</span>
        </div>
        ${isHardcoded ? '<span style="font-size:10px;color:var(--muted);">📌</span>' :
          (t.source === 'espn-sync' ? '<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;background:rgba(0,104,183,0.12);color:#0068b7;">🔄 ESPN Auto</span>' : '') +
          (isAdmin && t.source === 'espn-sync' && t.hasMissingPicks ? `<button onclick="adminAddPickToTrade(${t.id})" style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:8px;border:1.5px dashed var(--accent);background:transparent;color:var(--accent);cursor:pointer;margin-left:4px;">+ Pick</button>` : '') +
          (isAdmin && !isHardcoded ? `<button onclick="deleteTradeEntry(${t.id})" style="background:none;border:none;color:var(--muted);font-size:16px;cursor:pointer;padding:2px 6px;border-radius:4px;transition:color 0.15s;" onmouseover="this.style.color='#ff6584'" onmouseout="this.style.color='var(--muted)'">✕</button>` : '')
        }
      </div>
      <div style="background:var(--surface2);border-radius:20px;height:6px;overflow:hidden;margin-bottom:5px;">
        <div style="width:${pctA}%;height:100%;border-radius:20px;background:${parseFloat(pctA)>=50?barColor:'var(--muted)'};"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);font-weight:600;margin-bottom:12px;">
        <span>Side A <strong style="color:var(--text);">${valA.toLocaleString()}</strong> (${pctA}%)</span>
        <span><strong style="color:var(--text);">${valB.toLocaleString()}</strong> Side B (${pctB}%)</span>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        ${renderSide(t.sideA,'Side A',valA)}
        <div style="display:flex;align-items:center;color:var(--muted);font-weight:800;font-family:'Playfair Display',serif;font-size:14px;">⟷</div>
        ${renderSide(t.sideB,'Side B',valB)}
      </div>
    </div>`;
  }).join('');
}
