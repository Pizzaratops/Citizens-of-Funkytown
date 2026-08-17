// ============================================================
//  PROJECTIONS (nativ) — Logik
// ============================================================
//  Uebernommen aus dem inline <script> von projections/index.html
//  (das bis 2026-08-01 per Iframe lief). Inhaltlich unveraendert,
//  nur in eine aufrufbare Funktion gepackt, weil Daten+Logik jetzt
//  erst beim ersten Seitenbesuch nachgeladen werden (siehe
//  js/player-rankings.js) statt beim initialen Seitenaufbau — sonst
//  wuerden alle TTHQ-Besucher die ~2,4 MB Projections-Daten immer
//  mitladen, auch wenn sie diese Seite nie besuchen.
//
//  Aufgerufen genau einmal von js/player-rankings.js, nachdem alle
//  Abhaengigkeiten (players-data.js, projected-minutes.js, adp-data.js,
//  rosters-data.js, rookie-projections.js, assets/shared.js,
//  assets/inseason-blend.js) geladen sind.
// ============================================================

function initLiveProjectionsNative() {
  let sortKey = 'z', sortAsc = false;
  let query = '';
  let posFilter = null;
  let statFilters = [null, null, null];
  let showBaselineOnly = false;

  const NEWEST_LABEL = SEASON_LABELS[SEASON_LABELS.length - 1];
  const Z_CATS = ['pts', 'reb', 'ast', 'stl', 'blk', 'fg3m', 'tov', 'ftpct', 'fgpct'];
  const CAT_LABELS = { pts:'PTS', reb:'REB', ast:'AST', stl:'STL', blk:'BLK', fg3m:'3PM', tov:'TOV', ftpct:'FT%', fgpct:'FG%' };
  // Spalten, die im Table auch farblich (Heatmap) markiert werden — TOV invertiert.
  const HEAT_COLS = ['min', 'pts', 'reb', 'ast', 'stl', 'blk', 'fg3m', 'fgpct', 'ftpct', 'tov', 'z', 'zFloor', 'zDepth'];
  const HEAT_INVERT = { tov: true };

  const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'];
  const STAT_FILTER_CATS = [
    { key: 'pts', label: 'PTS' }, { key: 'reb', label: 'REB' }, { key: 'ast', label: 'AST' },
    { key: 'stl', label: 'STL' }, { key: 'blk', label: 'BLK' }, { key: 'fg3m', label: '3PM' },
    { key: 'fgpct', label: 'FG%' }, { key: 'ftpct', label: 'FT%' }, { key: 'tov', label: 'TOV' },
    { key: 'z', label: 'Z-Score' },
  ];
  const STAT_FILTER_OPS = ['>', '>=', '<', '<='];

  // ── Fantasy-Besitz ───────────────────────────────────────
  // Logik liegt in js/fantasy-owner.js, damit NBA Teams und Best
  // Available dieselbe Zuordnung nutzen statt einer Kopie.
  let ownerFilter = null;

  function statFilterValue(row, cat) {
    return cat === 'z' ? row.z : row.s[cat];
  }
  function passesStatFilters(row) {
    return statFilters.every(f => {
      if (!f || !f.cat || !f.op || f.val === null || f.val === undefined || f.val === '') return true;
      const v = statFilterValue(row, f.cat);
      const target = Number(f.val);
      if (Number.isNaN(target)) return true;
      switch (f.op) {
        case '>': return v > target;
        case '>=': return v >= target;
        case '<': return v < target;
        case '<=': return v <= target;
        default: return true;
      }
    });
  }

  function renderStatFilterRows() {
    const container = document.getElementById('statFilterRows');
    container.innerHTML = statFilters.map((f, i) => `
      <div style="display:flex; gap:6px; align-items:center; margin-bottom:6px;">
        <select data-i="${i}" data-field="cat" style="padding:5px 8px; border-radius:6px; background:var(--surface2); border:1px solid var(--border); color:var(--text);">
          <option value="">–</option>
          ${STAT_FILTER_CATS.map(c => `<option value="${c.key}" ${f && f.cat === c.key ? 'selected' : ''}>${c.label}</option>`).join('')}
        </select>
        <select data-i="${i}" data-field="op" style="padding:5px 8px; border-radius:6px; background:var(--surface2); border:1px solid var(--border); color:var(--text);">
          ${STAT_FILTER_OPS.map(o => `<option value="${o}" ${f && f.op === o ? 'selected' : ''}>${o}</option>`).join('')}
        </select>
        <input data-i="${i}" data-field="val" type="number" step="0.1" placeholder="Wert" value="${f && f.val !== undefined ? f.val : ''}"
          style="width:90px; padding:5px 8px; border-radius:6px; background:var(--surface2); border:1px solid var(--border); color:var(--text);">
      </div>
    `).join('');
    container.querySelectorAll('select,input').forEach(el => {
      el.addEventListener('change', () => {
        const i = Number(el.dataset.i), field = el.dataset.field;
        if (!statFilters[i]) statFilters[i] = { cat: '', op: '>', val: '' };
        statFilters[i][field] = el.value;
        if (!statFilters[i].cat) statFilters[i] = null;
        render();
      });
    });
  }

  function renderPosFilters() {
    const container = document.getElementById('posFilters');
    const all = [{ k: null, l: 'Alle' }].concat(POSITIONS.map(p => ({ k: p, l: p })));
    container.innerHTML = all.map(o => `<div class="tag-btn ${posFilter === o.k ? 'active' : ''}" data-k="${o.k ?? ''}">${o.l}</div>`).join('');
    container.querySelectorAll('.tag-btn').forEach(btn => {
      btn.addEventListener('click', () => { posFilter = btn.dataset.k || null; renderPosFilters(); render(); });
    });
  }

  // Team-Anzeige auf AKTUELLES Team umstellen (aus dem täglichen ESPN-Fetch,
  // rosters-data.js) statt dem historischen Team der letzten gespielten
  // Saison aus players-data.js -- z.B. nach Trades wie Giannis -> Miami.
  // Einmalig beim Laden, danach lesen alle Renders einfach p.team wie bisher.
  if (typeof ROSTERS_DATA !== 'undefined') { mfhfbApplyCurrentTeams(PLAYER_RATES); mfhfbSyncManualTeams(); }

  // Season-Label-Liste (2018-19 · 2019-20 · ...) auf Wunsch entfernt — der Badge bleibt leer/ungenutzt.

  if (SEASON_LABELS.length >= 2) {
    document.getElementById('w1Label').textContent = `Vorletztes Jahr (${SEASON_LABELS[SEASON_LABELS.length - 2]})`;
    document.getElementById('w2Label').textContent = `Letztes Jahr (${NEWEST_LABEL})`;
  }

  let weights = mfhfbGetWeights();
  let catWeights = mfhfbGetCategoryWeights();
  let poolSize = mfhfbGetPoolSize();
  document.getElementById('w1').value = weights.w1;
  document.getElementById('w2').value = weights.w2;
  document.getElementById('w1val').textContent = weights.w1.toFixed(2) + '×';
  document.getElementById('w2val').textContent = weights.w2.toFixed(2) + '×';

  function updatePoolButtons() {
    document.querySelectorAll('#liveProjectionsPage .pool-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.pool === poolSize);
    });
  }
  updatePoolButtons();
  document.querySelectorAll('#liveProjectionsPage .pool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      poolSize = btn.dataset.pool;
      mfhfbSetPoolSize(poolSize);
      updatePoolButtons();
      render();
    });
  });

  // Kategorie-Slider dynamisch bauen
  document.getElementById('catGrid').innerHTML = Z_CATS.map(cat => `
    <div class="cat-row">
      <div class="cat-label"><span>${CAT_LABELS[cat]}</span><span class="cat-val" id="cw_${cat}_val">${catWeights[cat].toFixed(2)}</span></div>
      <input type="range" id="cw_${cat}" min="0" max="1.5" step="0.05" value="${catWeights[cat]}">
    </div>
  `).join('');

  Z_CATS.forEach(cat => {
    document.getElementById(`cw_${cat}`).addEventListener('input', e => {
      catWeights[cat] = parseFloat(e.target.value);
      document.getElementById(`cw_${cat}_val`).textContent = catWeights[cat].toFixed(2);
      mfhfbSetCategoryWeights(catWeights);
      render();
    });
  });

  document.getElementById('weightPanelHead').addEventListener('click', () => {
    document.getElementById('weightPanel').classList.toggle('collapsed');
  });

  function resetWeights() {
    weights = { ...MFHFB_DEFAULT_SEASON_WEIGHTS };
    catWeights = { ...MFHFB_DEFAULT_CATEGORY_WEIGHTS };
    poolSize = 'all';
    mfhfbSetWeights(weights);
    mfhfbSetCategoryWeights(catWeights);
    mfhfbSetPoolSize(poolSize);
    document.getElementById('w1').value = weights.w1;
    document.getElementById('w2').value = weights.w2;
    document.getElementById('w1val').textContent = weights.w1.toFixed(2) + '×';
    document.getElementById('w2val').textContent = weights.w2.toFixed(2) + '×';
    updatePoolButtons();
    Z_CATS.forEach(cat => {
      document.getElementById(`cw_${cat}`).value = catWeights[cat];
      document.getElementById(`cw_${cat}_val`).textContent = catWeights[cat].toFixed(2);
    });
    render();
  }

  function fmt(v, d=1) { return v.toFixed(d); }

  function mean(arr) { return arr.reduce((a,b)=>a+b,0) / arr.length; }
  function stdev(arr, m) {
    const variance = arr.reduce((a,b)=>a+(b-m)*(b-m),0) / arr.length;
    return Math.sqrt(variance) || 1; // vermeidet Division durch 0
  }

  function computeAll() {
    const overrides = mfhfbGetOverrides();
    const rows = PLAYER_RATES
      .filter(p => mfhfbIsOnCurrentRoster(p.name, p.team))
      .map(p => {
      const latest = mfhfbLatestSeason(p);
      const key = mfhfbNormalizeName(p.name);
      const minutes = overrides[key] !== undefined ? overrides[key] : mfhfbDefaultMinutes(p.name, latest.mpg, latest.gp);
      const proj = mfhfbComputeProjection(p, minutes, weights);
      const live = showBaselineOnly
        ? { values: mfhfbBaselineOnly(proj), meta: { gamesPlayed: 0, usingLiveData: false, sourceCount: 0 } }
        : mfhfbComputeLiveProjection(p.name, proj);
      return { p, s: live.values, edited: overrides[key] !== undefined, manual: false, liveMeta: live.meta, _base: proj };
    });

    // Manuell gepflegte Spieler (Rookies etc. ohne Rate-Daten, auf der
    // Teams-Seite eingetragen) als eigenständige Zeilen mit einmischen —
    // aber nur, wenn tatsächlich Produktionswerte eingetragen sind.
    const manualStats = mfhfbGetManualStats();
    const PROD_CATS = ['pts', 'reb', 'ast', 'stl', 'blk', 'fg3m'];
    Object.values(manualStats).forEach(m => {
      const hasProduction = PROD_CATS.some(c => m[c] !== undefined && m[c] !== 0);
      if (!hasProduction) return;
      if (!m.team || !m.team.trim()) return;
      if (!mfhfbIsOnCurrentRoster(m.name, m.team)) return;
      const s = {
        min: m.min || 0, pts: m.pts || 0, reb: m.reb || 0, ast: m.ast || 0,
        stl: m.stl || 0, blk: m.blk || 0, fg3m: m.fg3m || 0, tov: m.tov || 0,
        fgpct: m.fgpct || 0, ftpct: m.ftpct || 0,
      };
      s.fga = s.min * 0.35; s.fgm = s.fga * s.fgpct/100;
      s.fta = s.min * 0.12; s.ftm = s.fta * s.ftpct/100;
      const live = showBaselineOnly
        ? { values: mfhfbBaselineOnly(s), meta: { gamesPlayed: 0, usingLiveData: false, sourceCount: 0 } }
        : mfhfbComputeLiveProjection(m.name, s);
      rows.push({
        p: { name: m.name, team: m.team || '-', pos: m.pos || '-', seasons: {}, manualGP: m.gp },
        s: live.values, edited: true, manual: true, liveMeta: live.meta, _base: s,
      });
    });

    // Z-Score-Population bestimmen: Top 200 / Top 400 / Alle, sortiert nach
    // projizierten Punkten. Mean/SD kommen aus dieser Population, angewendet
    // wird der Z-Score trotzdem auf ALLE Spieler (auch außerhalb der Basis).
    let pool = rows;
    if (poolSize === '200' || poolSize === '400') {
      const n = poolSize === '200' ? 200 : 400;
      pool = [...rows].sort((a, b) => b.s.pts - a.s.pts).slice(0, n);
    }

    // FG%/FT%: NICHT die rohe Quote z-scoren -- stattdessen der tatsächliche
    // Impact auf die Team-Quote: (eigene Quote minus Liga-Schnitt) mal eigene
    // Versuche -- exakt wie im Draft Board.
    const poolFga = pool.reduce((a,r)=>a+r.s.fga,0), poolFgm = pool.reduce((a,r)=>a+r.s.fgm,0);
    const poolFta = pool.reduce((a,r)=>a+r.s.fta,0), poolFtm = pool.reduce((a,r)=>a+r.s.ftm,0);
    const leagueFgPct = poolFga > 0 ? poolFgm / poolFga : 0;
    const leagueFtPct = poolFta > 0 ? poolFtm / poolFta : 0;
    rows.forEach(r => {
      r._fgImpact = (r.s.fgpct/100 - leagueFgPct) * r.s.fga;
      r._ftImpact = (r.s.ftpct/100 - leagueFtPct) * r.s.fta;
    });

    const stats = {};
    Z_CATS.forEach(cat => {
      let vals;
      if (cat === 'fgpct') vals = pool.map(r => r._fgImpact);
      else if (cat === 'ftpct') vals = pool.map(r => r._ftImpact);
      else vals = pool.map(r => r.s[cat]);
      const m = mean(vals);
      stats[cat] = { mean: m, sd: stdev(vals, m) };
    });
    rows.forEach(r => {
      let z = 0;
      const catContribs = {};
      Z_CATS.forEach(cat => {
        let basis;
        if (cat === 'fgpct') basis = r._fgImpact;
        else if (cat === 'ftpct') basis = r._ftImpact;
        else basis = r.s[cat];
        let catZ = (basis - stats[cat].mean) / stats[cat].sd;
        if (cat === 'tov') catZ = -catZ;
        catContribs[cat] = catZ * catWeights[cat];
        z += catContribs[cat];
      });
      r.z = z;

      const worst = Object.entries(catContribs).reduce((a,b) => a[1]<b[1]?a:b);
      r.zFloor = z - worst[1];
      r.worstCat = worst[0];

      const best = Object.entries(catContribs).reduce((a,b) => a[1]>b[1]?a:b);
      r.zDepth = z - best[1];
      r.bestCat = best[0];

      r.adpVal = null;
      r._adpRef = null;
      const _normName = mfhfbNormalizeName(r.p.name);
      const _adpEntry = (typeof ADP_DATA !== 'undefined') ? (ADP_DATA[_normName] || ADP_DATA[mfhfbResolveAliasReverse(_normName)]) : undefined;
      if (_adpEntry) r._adpRef = _adpEntry.fantraxAdp || _adpEntry.ownAdp || null;
    });

    // ADP-Value = ADP-Rang minus unser Z-Rang: positiv = unterbewertet, negativ = überbewertet
    rows.sort((x,y) => y.z - x.z);
    rows.forEach((r,i) => {
      r._zRank = i + 1;
      r.adpVal = r._adpRef ? Math.round(r._adpRef - r._zRank) : null;
    });

    return rows;
  }

  function render() {
   try {
    // Roster koennen sich zwischen Aufrufen aendern (Trade-Sync),
    // deshalb den Besitzer-Index je Rendern verwerfen.
    ttOwnerInvalidate();   // Roster koennen sich per Sync geaendert haben
    ttFillOwnerFilter(document.getElementById('ownerFilter'),
      computeAll().map(r => ({ name: r.p.name, team: r.p.team })), ownerFilter);
    const q = query.toLowerCase().trim();
    let rows = computeAll();
    rows = rows.filter(r =>
      !q || r.p.name.toLowerCase().includes(q) || r.p.team.toLowerCase().includes(q) || r.p.pos.toLowerCase().includes(q)
    );
    if (posFilter) rows = rows.filter(r => (r.p.pos || '-').split('/').includes(posFilter));
    rows = rows.filter(r => ttOwnerMatches(ownerFilter, r.p.name, r.p.team));
    rows = rows.filter(passesStatFilters);

    rows.sort((x, y) => {
      let av, bv;
      if (sortKey === 'name') { av = x.p.name; bv = y.p.name; }
      else if (sortKey === 'team') { av = x.p.team; bv = y.p.team; }
      else if (sortKey === 'pos') { av = x.p.pos; bv = y.p.pos; }
      else if (sortKey === 'z') { av = x.z; bv = y.z; }
      else if (sortKey === 'zFloor') { av = x.zFloor; bv = y.zFloor; }
      else if (sortKey === 'zDepth') { av = x.zDepth; bv = y.zDepth; }
      else if (sortKey === 'adpVal') { av = x.adpVal ?? -999; bv = y.adpVal ?? -999; }
      else { av = x.s[sortKey]; bv = y.s[sortKey]; }
      const c = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
      return sortAsc ? c : -c;
    });

    window.__mfhfbCurrentRows = rows;
    document.getElementById('count').textContent = `${rows.length} Spieler`;

    const heatRange = {};
    HEAT_COLS.forEach(col => {
      const vals = rows.map(r => {
        if (col === 'z') return r.z;
        if (col === 'zFloor') return r.zFloor;
        if (col === 'zDepth') return r.zDepth;
        return r.s[col];
      });
      heatRange[col] = { min: Math.min(...vals), max: Math.max(...vals) };
    });
    const heat = (col, val) => mfhfbHeatStyle(val, heatRange[col].min, heatRange[col].max, !!HEAT_INVERT[col]);

    document.getElementById('body').innerHTML = rows.map((row, i) => {
      const {p, s, z, edited, manual} = row;
      const zFloor = row.zFloor, zDepth = row.zDepth, adpVal = row.adpVal;
      const worstCat = row.worstCat, bestCat = row.bestCat;
      return `<tr>
        <td class="rank-cell">${i + 1}.</td>
        <td class="name-cell">
          <div class="p-name">${p.name}${manual ? '<span style="color:var(--accent2);font-size:9px;font-weight:700;margin-left:5px;">MANUELL</span>' : ''}${mfhfbNameBadge(row)}</div>
          <div class="p-meta">GP: ${manual ? (p.manualGP !== undefined ? p.manualGP : '-') : mfhfbRecentGP(p)}</div>
        </td>
        <td class="left">${p.team}</td>
        <td class="left">${ttOwnerTag(p.name)}</td>
        <td class="left">${p.pos}</td>
        <td class="sep-col" style="${edited ? 'color:var(--warn);' : ''}${heat('min', s.min)}">${fmt(s.min)}</td>
        <td style="${heat('pts', s.pts)}">${fmt(s.pts)}</td>
        <td style="${heat('reb', s.reb)}">${fmt(s.reb)}</td>
        <td style="${heat('ast', s.ast)}">${fmt(s.ast)}</td>
        <td style="${heat('stl', s.stl)}">${fmt(s.stl,1)}</td>
        <td style="${heat('blk', s.blk)}">${fmt(s.blk,1)}</td>
        <td style="${heat('fg3m', s.fg3m)}">${fmt(s.fg3m,1)}</td>
        <td style="font-size:11px; color:var(--muted);">${fmt(s.fgm,1)}-${fmt(s.fga,1)}</td>
        <td style="${heat('fgpct', s.fgpct)}">${fmt(s.fgpct)}%</td>
        <td style="font-size:11px; color:var(--muted);">${fmt(s.ftm,1)}-${fmt(s.fta,1)}</td>
        <td style="${heat('ftpct', s.ftpct)}">${fmt(s.ftpct)}%</td>
        <td style="${heat('tov', s.tov)}">${fmt(s.tov,1)}</td>
        <td class="col-z" style="${heat('z', z)}">${z >= 0 ? '+' : ''}${fmt(z,2)}</td>
        <td style="${heat('zFloor', zFloor)};font-size:11px;font-weight:700" title="Floor — ohne ${worstCat||''}">${zFloor >= 0 ? '+' : ''}${fmt(zFloor,2)}</td>
        <td style="${heat('zDepth', zDepth)};font-size:11px;font-weight:700" title="Depth — ohne ${bestCat||''}">${zDepth >= 0 ? '+' : ''}${fmt(zDepth,2)}</td>
        <td style="font-weight:700;font-size:11px;color:${adpVal===null?'var(--muted)':adpVal>0?'var(--good)':'var(--bad)'}">${adpVal!==null?(adpVal>0?'+':'')+adpVal:'—'}</td>
      </tr>`;
    }).join('');
   } catch(err) {
     console.error('render() fehlgeschlagen:', err);
     document.getElementById('count').textContent = 'Fehler beim Rendern (siehe Browser-Konsole)';
     document.getElementById('body').innerHTML =
       `<tr><td colspan="20" style="padding:16px; color:var(--bad);">
         Fehler beim Anzeigen der Projections — Details in der Browser-Konsole (F12).
         Häufigste Ursache: veraltete Daten in localStorage nach einem Update.
         Falls das Problem bleibt: localStorage für diese Seite leeren und neu laden.
       </td></tr>`;
   }
  }

  function downloadCSV() {
    const rows = window.__mfhfbCurrentRows || computeAll();
    const header = ['Rank','Name','Team','Pos','Min','PTS','REB','AST','STL','BLK','3PM','FG%','FT%','TOV','Z','Z-Floor','Z-Depth','ADP-Val','RecentGP'];
    const lines = [header.join(',')];
    rows.forEach((r, i) => {
      const row = [
        i + 1, `"${r.p.name}"`, r.p.team, r.p.pos,
        fmt(r.s.min), fmt(r.s.pts), fmt(r.s.reb), fmt(r.s.ast), fmt(r.s.stl,1), fmt(r.s.blk,1), fmt(r.s.fg3m,1), fmt(r.s.fgpct), fmt(r.s.ftpct), fmt(r.s.tov,1),
        fmt(r.z,2), fmt(r.zFloor,2), fmt(r.zDepth,2), r.adpVal !== null ? fmt(r.adpVal,2) : '',
        r.manual ? (r.p.manualGP !== undefined ? r.p.manualGP : '-') : mfhfbRecentGP(r.p),
      ];
      lines.push(row.join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mfhfb-projections-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  document.getElementById('search').addEventListener('input', e => { query = e.target.value; render(); });
  document.getElementById('ownerFilter').addEventListener('change', e => { ownerFilter = e.target.value || null; render(); });

  renderPosFilters();
  renderStatFilterRows();
  document.getElementById('statFilterToggle').addEventListener('click', e => {
    const panel = document.getElementById('statFilterPanel');
    const nowVisible = panel.style.display === 'none';
    panel.style.display = nowVisible ? 'block' : 'none';
    e.target.classList.toggle('active', nowVisible);
  });
  document.getElementById('statFilterClear').addEventListener('click', () => {
    statFilters = [null, null, null];
    renderStatFilterRows();
    render();
  });

  document.querySelectorAll('#liveProjectionsPage thead th').forEach(th => {
    th.addEventListener('click', () => {
      const k = th.dataset.k;
      if (sortKey === k) sortAsc = !sortAsc; else { sortKey = k; sortAsc = false; }
      render();
    });
  });

  document.getElementById('w1').addEventListener('input', e => {
    weights.w1 = parseFloat(e.target.value);
    document.getElementById('w1val').textContent = weights.w1.toFixed(2) + '×';
    mfhfbSetWeights(weights);
    render();
  });
  document.getElementById('w2').addEventListener('input', e => {
    weights.w2 = parseFloat(e.target.value);
    document.getElementById('w2val').textContent = weights.w2.toFixed(2) + '×';
    mfhfbSetWeights(weights);
    render();
  });

  document.getElementById('footerText').textContent =
    `Pro-Minute-Raten aus Season-Totals ÷ MPG je Saison. Z-Score wird kategorienweise über die gewählte Ranking-Population berechnet und mit den Kategorie-Gewichtungen kombiniert (TOV invertiert). Farben markieren je Spalte den besten (grün) bis schlechtesten (rot) Wert der aktuell angezeigten Spieler. Minuten-Änderungen kommen von der Teams-Seite (localStorage, geräteweit noch nicht synchronisiert).`;

  // Live-Update, wenn auf der Teams-Seite (anderer Tab) Minuten geändert werden
  window.addEventListener('storage', (e) => {
    if (e.key === MFHFB_STORAGE_KEY || e.key === MFHFB_WEIGHT_KEY || e.key === MFHFB_CATWEIGHT_KEY || e.key === MFHFB_POOL_KEY) {
      weights = mfhfbGetWeights();
      catWeights = mfhfbGetCategoryWeights();
      poolSize = mfhfbGetPoolSize();
      updatePoolButtons();
      render();
    }
  });

  // ============================================================
  //  LIVE-BLENDING / EXTERNE QUELLEN — UI-Verkabelung
  //  (Engine: assets/inseason-blend.js)
  // ============================================================

  function mfhfbNameBadge(row) {
    const meta = row.liveMeta;
    if (!meta) return '';
    const parts = [];
    if (meta.sourceCount) parts.push(`🔗${meta.sourceCount}`);
    if (meta.usingLiveData) parts.push(`🏀${meta.gamesPlayed}`);
    if (!parts.length) return '';
    const safeName = row.p.name.replace(/'/g, "\\'");
    return `<span class="ext-badge" onclick="openComparison('${safeName}')" title="Preseason vs. Live vergleichen">${parts.join(' ')}</span>`;
  }

  function openComparison(name) {
    const row = (window.__mfhfbCurrentRows || []).find(r => r.p.name === name);
    if (!row || !row._base) return;
    const cmp = mfhfbProjectionComparisonRow(name, row._base);
    const cats = [
      ['min', 'MIN'], ['pts', 'PTS'], ['reb', 'REB'], ['ast', 'AST'], ['stl', 'STL'],
      ['blk', 'BLK'], ['fg3m', '3PM'], ['tov', 'TOV'], ['fgpct', 'FG%'], ['ftpct', 'FT%'],
    ];
    const fv = (v, c) => (v === undefined || v === null) ? '—' : ((c === 'fgpct' || c === 'ftpct') ? v.toFixed(1) + '%' : v.toFixed(1));
    const rowsHtml = cats.map(([c, label]) => `<tr>
        <td style="text-align:left;color:var(--muted);">${label}</td>
        <td>${fv(cmp.baseline[c], c)}</td>
        <td>${fv(cmp.preseasonBlended[c], c)}</td>
        <td style="font-weight:700;">${fv(cmp.live[c], c)}</td>
        <td>${cmp.seasonActualAvg ? fv(cmp.seasonActualAvg[c], c) : '—'}</td>
      </tr>`).join('');

    let statusText;
    if (cmp.usingLiveData) {
      statusText = `Live-Blend aktiv — ${cmp.gamesPlayed} Spiel${cmp.gamesPlayed === 1 ? '' : 'e'} dieser Saison bereits eingerechnet.`;
    } else if (cmp.preseasonBlended.sourceCount) {
      statusText = `Geblendete Preseason-Projection (${cmp.preseasonBlended.sourceCount} externe Quelle${cmp.preseasonBlended.sourceCount === 1 ? '' : 'n'}), noch keine Live-Saison-Daten.`;
    } else {
      statusText = 'Reine Minuten-Baseline — keine externen Quellen, noch keine Live-Daten.';
    }

    document.getElementById('cmpTitle').textContent = name;
    document.getElementById('cmpBody').innerHTML = `
      <div class="pool-hint" style="margin-bottom:10px;">${statusText}</div>
      <table style="width:100%; font-size:12px; border-collapse:collapse;">
        <thead><tr style="color:var(--muted);">
          <th style="text-align:left;">Kat.</th><th>Baseline</th><th>+Quellen</th><th>Live</th><th>Season-Ø</th>
        </tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>`;
    document.getElementById('cmpModal').style.display = 'block';
  }
  function closeComparison() { document.getElementById('cmpModal').style.display = 'none'; }
  document.getElementById('cmpModal').addEventListener('click', (e) => {
    if (e.target.id === 'cmpModal') closeComparison();
  });

  document.getElementById('livePanelHead').addEventListener('click', () => {
    document.getElementById('livePanel').classList.toggle('collapsed');
  });

  function updateLiveStatusUI() {
    const actuals = mfhfbGetLiveActualsSync();
    const nPlayers = Object.keys(actuals).length;
    const badge = document.getElementById('liveBadge');
    const text = document.getElementById('liveStatusText');
    if (nPlayers === 0) {
      badge.textContent = 'Preseason';
      text.textContent = 'Noch keine Live-Saison-Daten von Taco Tuesday HQ (vor Saisonstart normal) — Projections laufen auf der (ggf. mit externen Quellen geblendeten) Preseason-Projection.';
    } else {
      badge.textContent = nPlayers + ' Spieler live';
      text.textContent = `Live-Daten geladen: ${nPlayers} Spieler mit Season-Actuals aus Taco Tuesday HQ. Wird automatisch spätestens alle ${MFHFB_LIVE_CACHE_HOURS}h neu geholt.`;
    }
  }

  async function refreshLiveData() {
    document.getElementById('liveStatusText').textContent = 'Lade Live-Daten…';
    await mfhfbFetchInSeasonActuals(true);
    updateLiveStatusUI();
    render();
  }

  // --- Admin-Bereich (externe Quellen pflegen) ---
  mfhfbInitAdminToggle('adminToggle', (isAdmin) => {
    document.getElementById('adminExtProjArea').style.display = isAdmin ? 'block' : 'none';
    render();
  });
  if (mfhfbIsAdmin()) document.getElementById('adminExtProjArea').style.display = 'block';

  document.getElementById('baselineOnlyToggle').addEventListener('change', (e) => {
    showBaselineOnly = e.target.checked;
    render();
  });

  function mfhfbAllKnownPlayerNames() {
    const names = PLAYER_RATES.map(p => p.name);
    if (typeof ROOKIE_PROJECTIONS !== 'undefined') names.push(...Object.values(ROOKIE_PROJECTIONS).map(r => r.name));
    names.push(...Object.values(mfhfbGetManualStats()).map(m => m.name));
    return names;
  }

  function runBulkImport() {
    const source = document.getElementById('extSourceName').value.trim();
    const text = document.getElementById('extBulkText').value;
    const resultEl = document.getElementById('bulkImportResult');
    if (!source) { resultEl.textContent = 'Bitte zuerst einen Quellennamen eingeben.'; return; }
    if (!text.trim()) { resultEl.textContent = 'Keine Daten zum Importieren im Textfeld.'; return; }

    const result = mfhfbImportExternalBulk(source, text, mfhfbAllKnownPlayerNames());
    let msg = `${result.imported} importiert, ${result.skipped} übersprungen.`;
    if (result.error) msg += ` Fehler: ${result.error}`;
    if (result.unmatched && result.unmatched.length) {
      msg += `<br>Nicht zugeordnet (Tippfehler o.ä.?): ${result.unmatched.join(', ')}`;
    }
    resultEl.innerHTML = msg;
    render();
  }

  // --- Einzel-Editor ---
  document.getElementById('extSingleGrid').innerHTML = MFHFB_EXT_CATS.map(cat => `
    <div class="cat-row">
      <div class="cat-label"><span>${(CAT_LABELS[cat] || cat).toUpperCase()}</span></div>
      <input type="number" step="0.1" id="extcat_${cat}" style="width:70px; padding:4px 6px; background:var(--bg); border:1px solid var(--border); border-radius:6px; color:var(--text); font-size:12px;">
    </div>
  `).join('');

  function renderExtPlayerSourcesList() {
    const name = document.getElementById('extPlayerSearch').value.trim();
    const listEl = document.getElementById('extPlayerSourcesList');
    if (!name) { listEl.innerHTML = ''; return; }
    const sources = mfhfbGetExternalSourcesFor(name);
    const names = Object.keys(sources);
    if (!names.length) { listEl.innerHTML = 'Noch keine externen Quellen für diesen Spieler.'; return; }
    listEl.innerHTML = names.map(s => {
      const vals = MFHFB_EXT_CATS.filter(c => sources[s][c] !== undefined).map(c => `${(CAT_LABELS[c] || c)}: ${sources[s][c]}`).join(', ');
      return `<div style="display:flex; justify-content:space-between; gap:8px; padding:3px 0;">
        <span><strong>${s}</strong> (${sources[s].updatedAt}) — ${vals}</span>
        <button class="reset-btn" onclick="deleteExtSource('${name.replace(/'/g, "\\'")}','${s.replace(/'/g, "\\'")}')">✕ löschen</button>
      </div>`;
    }).join('');
  }
  document.getElementById('extPlayerSearch').addEventListener('input', renderExtPlayerSourcesList);

  function saveSingleExternal() {
    const name = document.getElementById('extPlayerSearch').value.trim();
    const source = document.getElementById('extPlayerSource').value.trim();
    if (!name || !source) { alert('Bitte Spielername UND Quelle angeben.'); return; }
    if (!mfhfbAllKnownPlayerNames().some(n => mfhfbNormalizeName(n) === mfhfbNormalizeName(name))) {
      if (!confirm(`"${name}" wurde in keiner bekannten Spielerliste gefunden — trotzdem als Quelle speichern (z.B. bei Namens-Tippfehler)?`)) return;
    }
    const stats = {};
    MFHFB_EXT_CATS.forEach(cat => {
      const v = document.getElementById(`extcat_${cat}`).value;
      if (v !== '') stats[cat] = v;
    });
    mfhfbSetExternalSource(name, source, stats);
    renderExtPlayerSourcesList();
    render();
  }

  function deleteExtSource(name, source) {
    mfhfbDeleteExternalSource(name, source);
    renderExtPlayerSourcesList();
    render();
  }

  // Alle onclick="..."-Handler im generierten HTML brauchen diese Funktionen
  // im globalen Scope (onclick-Attribute laufen nicht im Closure dieser
  // Funktion) — deshalb hier explizit an window haengen.
  window.resetWeights = resetWeights;
  window.downloadCSV = downloadCSV;
  window.openComparison = openComparison;
  window.closeComparison = closeComparison;
  window.refreshLiveData = refreshLiveData;
  window.runBulkImport = runBulkImport;
  window.saveSingleExternal = saveSingleExternal;
  window.deleteExtSource = deleteExtSource;
  // Fuer js/theme.js: Heatmap-Zellfarben sind fixe Inline-Styles (aus
  // Performance-Gruenden bei 1000+ Zeilen nicht live per CSS var), muessen
  // bei Theme-Wechsel also explizit neu gerendert werden.
  window.reRenderLiveProjections = render;

  // Live-Daten einmal beim Laden holen (gecacht, siehe MFHFB_LIVE_CACHE_HOURS),
  // dann neu rendern -- vor Saisonstart liefert das einfach "keine Daten" und
  // die Projections bleiben unverändert auf dem Preseason-Blend.
  mfhfbFetchInSeasonActuals().then(() => { updateLiveStatusUI(); render(); });
  updateLiveStatusUI();

  render();
}
