// ============================================================
//  NBA TEAMS (nativ) — Logik
// ============================================================
//  Uebernommen aus dem inline <script> von projections/teams.html (das bis
//  2026-08-01 per Iframe lief). Inhaltlich unveraendert, nur in eine
//  aufrufbare Funktion gepackt (gleiches Muster wie js/projections-native.js
//  fuer die Projections-Seite) und IDs umbenannt, wo sie mit der bereits
//  nativen Projections-Seite kollidiert haetten (search -> searchTeams,
//  footerText -> footerTextTeams, adminToggle -> adminToggleTeams).
// ============================================================

function initLiveProjTeamsNative() {
  mfhfbInitAdminToggle('adminToggleTeams', () => render());
  const nameIndex = mfhfbBuildNameIndex(PLAYER_RATES);

  if (typeof ROSTERS_DATA !== 'undefined') mfhfbSyncManualTeams();
  const NEWEST_LABEL = SEASON_LABELS[SEASON_LABELS.length - 1];
  let query = '';

  // ── Fantasy-Besitz ───────────────────────────────────────
  // Logik in js/fantasy-owner.js, geteilt mit Projections und Best
  // Available.
  //
  // FUND-SCHWELLE: Ein freier Spieler mit hoher Minutenzahl ist der
  // interessanteste Fall auf dieser Seite -- viel Spielzeit in einer
  // NBA-Rotation, aber in keinem Kader der Liga. Solche Zeilen werden
  // markiert. 24 Minuten als Standard, weil darunter kaum jemand
  // verlaesslich 9cat-Wert liefert; per Auswahl aenderbar.
  let ownerFilter = null;
  let faMinMinutes = 24;

  function isFreeAgentFind(playerName, minutes) {
    return faMinMinutes > 0 && minutes >= faMinMinutes && !ttOwnerOf(playerName);
  }

  function fmt(v, d=1) { return v.toFixed(d); }

  function statHeaderRow(showOwner) {
    const own = showOwner
      ? '<th title="Fantasy Team in der Taco Tuesday League, FA = Free Agent">Fantasy</th>'
      : '';
    return `<tr><th>Spieler</th><th>Pos</th>${own}<th>Min</th><th>GP</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>3PM</th><th>FGM-FGA</th><th>FG%</th><th>FTM-FTA</th><th>FT%</th><th>TO</th></tr>`;
  }

  const HEAT_COLS = ['min', 'pts', 'reb', 'ast', 'stl', 'blk', 'fg3m', 'fgpct', 'ftpct', 'tov'];
  const HEAT_INVERT = { tov: true };

  function computeHeatRange(items, getVal) {
    const range = {};
    HEAT_COLS.forEach(col => {
      const vals = items.map(it => getVal(it, col)).filter(v => v !== null && v !== undefined && !isNaN(v));
      range[col] = vals.length ? { min: Math.min(...vals), max: Math.max(...vals) } : { min: 0, max: 0 };
    });
    return range;
  }
  function heatFor(range, col, val) {
    if (val === null || val === undefined || isNaN(val)) return '';
    return mfhfbHeatStyle(val, range[col].min, range[col].max, !!HEAT_INVERT[col]);
  }

  function renderManualRow(rp, teamBbmAbbr, range) {
    const key = mfhfbNormalizeName(rp.name);
    const admin = mfhfbIsAdmin();
    const manual = mfhfbGetManualStats()[key] || {};
    const projMin = mfhfbProjectedMin(rp.name);
    const field = (id, step) => {
      let v = manual[id];
      let isProj = false;
      if (id === 'min' && v === undefined && projMin !== undefined) {
        v = projMin;
        isProj = true;
      }
      const heatStyle = HEAT_COLS.includes(id) ? heatFor(range, id, v) : '';
      return `<td style="${heatStyle}"><input class="stat-input${isProj ? ' proj-min' : ''}" type="number" step="${step}" min="0" ${admin ? '' : 'disabled'}
        ${isProj ? 'title="projizierte Minuten (Rookie) — anpassbar"' : ''}
        value="${v !== undefined ? v : ''}" placeholder="–"
        data-key="${key}" data-team="${teamBbmAbbr}" data-field="${id}"
        data-name="${rp.name.replace(/"/g,'&quot;')}" data-pos="${(rp.position||'').replace(/"/g,'&quot;')}"
        onchange="onManualChange(this)"></td>`;
    };
    const minVal = manual.min !== undefined ? manual.min : (projMin !== undefined ? projMin : 0);
    const attemptProxy = (pctId) => {
      const rate = pctId === 'ftpct' ? 0.12 : 0.35;
      const est = minVal * rate;
      return `<td style="font-size:11px; color:var(--muted);" title="Geschätzte Versuche aus Min × Liga-Schnittrate — keine echten Attempt-Daten für manuelle/Rookie-Einträge">${fmt(est,1)}</td>`;
    };
    const mMin = manual.min !== undefined ? manual.min : (projMin !== undefined ? projMin : 0);
    const mFind = isFreeAgentFind(rp.name, mMin);
    return `<tr ${admin ? 'draggable="true"' : ''} data-key="${key}" data-team="${teamBbmAbbr}" class="manual-row${mFind ? ' fa-find' : ''}">
      <td class="name-cell">${admin ? '<span class="drag-handle">⠿</span>' : ''}${rp.name}<span class="manual-tag">manuell</span></td>
      <td class="left">${rp.position || '-'}</td>
      <td class="left">${ttOwnerTag(rp.name)}</td>
      ${field('min', 0.5)}
      ${field('gp', 1)}
      ${field('pts', 0.1)}
      ${field('reb', 0.1)}
      ${field('ast', 0.1)}
      ${field('stl', 0.1)}
      ${field('blk', 0.1)}
      ${field('fg3m', 0.1)}
      ${attemptProxy('fgpct')}
      ${field('fgpct', 0.5)}
      ${attemptProxy('ftpct')}
      ${field('ftpct', 0.5)}
      ${field('tov', 0.1)}
    </tr>`;
  }

  function renderLeftRows(rosterPlayers, weights, overrides, teamAbbr, teamBbmAbbr) {
    if (!rosterPlayers.length) return `<tr><td colspan="16" class="no-match-note">Keine Spieler</td></tr>`;

    const admin = mfhfbIsAdmin();
    const manualStats = mfhfbGetManualStats();

    let items = rosterPlayers.map(rp => {
      const key = mfhfbNormalizeName(rp.name);
      const match = nameIndex.get(key);
      if (!match) return { key, rp, match: null, manual: manualStats[key] || null };
      const isEdited = overrides[key] !== undefined;
      const latest = mfhfbLatestSeason(match);
      const newestActual = mfhfbNewestSeasonActual(match);
      const minutes = isEdited ? overrides[key] : mfhfbDefaultMinutes(match.name, latest.mpg, latest.gp);
      const s = mfhfbComputeProjection(match, minutes, weights);
      return { key, rp, match, isEdited, latest, newestActual, minutes, s };
    });

    items.sort((a, b) => {
      const av = a.match ? a.latest.mpg : (a.manual && a.manual.min) || -1;
      const bv = b.match ? b.latest.mpg : (b.manual && b.manual.min) || -1;
      return bv - av;
    });
    items = mfhfbApplyTeamOrder(items, teamAbbr);

    const range = computeHeatRange(
      items.filter(it => it.match),
      (it, col) => col === 'min' ? it.minutes : it.s[col]
    );
    const manualRange = computeHeatRange(
      items.filter(it => !it.match).map(it => it.manual || {}),
      (it, col) => it[col]
    );

    return items.map(it => {
      if (!it.match) return renderManualRow(it.rp, teamBbmAbbr, manualRange);
      const { rp, match, isEdited, latest, newestActual, minutes, s, key } = it;
      const find = isFreeAgentFind(match.name, minutes);
      return `<tr class="${find ? 'fa-find' : ''}" ${admin ? 'draggable="true"' : ''} data-key="${key}" data-team="${teamAbbr}">
        <td class="name-cell">${admin ? '<span class="drag-handle">⠿</span>' : ''}${match.name}${newestActual.missed ? `<span class="pause-tag">⚠ pausiert ${newestActual.label}</span>` : ''}</td>
        <td class="left">${rp.position || match.pos || '-'}</td>
        <td class="left">${ttOwnerTag(match.name)}</td>
        <td style="${heatFor(range,'min',minutes)}">
          <input class="min-input ${isEdited ? 'edited' : ''}" type="number" step="0.5" min="0" max="48" ${admin ? '' : 'disabled'}
            value="${fmt(minutes)}" data-name="${match.name.replace(/"/g,'&quot;')}" onchange="onMinutesChange(this)">
          ${isEdited && admin ? `<button class="reset-btn" onclick="onReset('${match.name.replace(/'/g,"\\'")}')">↺</button>` : ''}
        </td>
        <td>${latest.gp}</td>
        <td style="${heatFor(range,'pts',s.pts)}">${fmt(s.pts)}</td>
        <td style="${heatFor(range,'reb',s.reb)}">${fmt(s.reb)}</td>
        <td style="${heatFor(range,'ast',s.ast)}">${fmt(s.ast)}</td>
        <td style="${heatFor(range,'stl',s.stl)}">${fmt(s.stl,1)}</td>
        <td style="${heatFor(range,'blk',s.blk)}">${fmt(s.blk,1)}</td>
        <td style="${heatFor(range,'fg3m',s.fg3m)}">${fmt(s.fg3m,1)}</td>
        <td style="font-size:11px; color:var(--muted);">${fmt(s.fgm,1)}-${fmt(s.fga,1)}</td>
        <td style="${heatFor(range,'fgpct',s.fgpct)}">${fmt(s.fgpct)}%</td>
        <td style="font-size:11px; color:var(--muted);">${fmt(s.ftm,1)}-${fmt(s.fta,1)}</td>
        <td style="${heatFor(range,'ftpct',s.ftpct)}">${fmt(s.ftpct)}%</td>
        <td style="${heatFor(range,'tov',s.tov)}">${fmt(s.tov,1)}</td>
      </tr>`;
    }).join('');
  }

  function renderRightRows(bbmAbbr) {
    const players = PLAYER_RATES
      .filter(p => p.team === bbmAbbr)
      .filter(p => {
        const s = p.seasons[NEWEST_LABEL];
        return s && !s.missed;
      })
      .map(p => {
        const s = p.seasons[NEWEST_LABEL];
        const r = s.rates;
        return {
          p, latest: s,
          min: s.mpg, gp: s.gp,
          pts: r.pts * s.mpg, reb: r.reb * s.mpg, ast: r.ast * s.mpg,
          stl: r.stl * s.mpg, blk: r.blk * s.mpg, fg3m: r.fg3m * s.mpg,
          fgm: r.fgm * s.mpg, fga: r.fga * s.mpg,
          ftm: r.ftm * s.mpg, fta: r.fta * s.mpg,
          fgpct: (r.fgm / r.fga) * 100 || 0, ftpct: (r.ftm / r.fta) * 100 || 0, tov: r.tov * s.mpg,
        };
      })
      .sort((a, b) => b.min - a.min);

    if (!players.length) return `<tr><td colspan="14" class="no-match-note">Keine Daten für ${bbmAbbr}</td></tr>`;

    const range = computeHeatRange(players, (it, col) => it[col]);

    return players.map(it => `<tr>
        <td class="name-cell">${it.p.name}</td>
        <td class="left">${it.p.pos}</td>
        <td style="${heatFor(range,'min',it.min)}">${fmt(it.min)}</td>
        <td>${it.gp}</td>
        <td style="${heatFor(range,'pts',it.pts)}">${fmt(it.pts)}</td>
        <td style="${heatFor(range,'reb',it.reb)}">${fmt(it.reb)}</td>
        <td style="${heatFor(range,'ast',it.ast)}">${fmt(it.ast)}</td>
        <td style="${heatFor(range,'stl',it.stl)}">${fmt(it.stl,1)}</td>
        <td style="${heatFor(range,'blk',it.blk)}">${fmt(it.blk,1)}</td>
        <td style="${heatFor(range,'fg3m',it.fg3m)}">${fmt(it.fg3m,1)}</td>
        <td style="font-size:11px; color:var(--muted);">${fmt(it.fgm,1)}-${fmt(it.fga,1)}</td>
        <td style="${heatFor(range,'fgpct',it.fgpct)}">${fmt(it.fgpct)}%</td>
        <td style="font-size:11px; color:var(--muted);">${fmt(it.ftm,1)}-${fmt(it.fta,1)}</td>
        <td style="${heatFor(range,'ftpct',it.ftpct)}">${fmt(it.ftpct)}%</td>
        <td style="${heatFor(range,'tov',it.tov)}">${fmt(it.tov,1)}</td>
      </tr>`).join('');
  }

  function render() {
    const container = document.getElementById('teamsContent');

    if (typeof ROSTERS_DATA === 'undefined' || window.__rostersMissing) {
      container.innerHTML = `<div class="empty-state">
        Noch keine Roster-Daten geladen.<br><br>
        Einmal lokal ausführen: <code>node scripts/fetch-rosters.mjs</code><br>
        oder im Repo unter <b>Actions → Update NBA Rosters → Run workflow</b> manuell anstoßen.<br>
        Danach läuft es automatisch 1x täglich.
      </div>`;
      document.getElementById('footerTextTeams').textContent = 'Warte auf ersten Roster-Fetch von ESPN.';
      return;
    }

    const weights = mfhfbGetWeights();
    const overrides = mfhfbGetOverrides();
    const admin = mfhfbIsAdmin();
    const q = query.toLowerCase().trim();

    const lockNote = document.getElementById('lockNote');
    if (lockNote) {
      lockNote.innerHTML = admin
        ? '🔓 Admin-Modus aktiv — Minuten editierbar und per Drag &amp; Drop sortierbar.'
        : '🔒 Bearbeitung gesperrt. Zum Ändern der Minuten oben rechts auf <b>Admin</b> klicken.';
    }

    document.getElementById('footerTextTeams').textContent =
      `Roster-Stand: ${new Date(ROSTERS_DATA.fetchedAt).toLocaleString('de-DE')} · Quelle: ${ROSTERS_DATA.source} · ${ROSTERS_DATA.teamCount}/30 Teams geladen. Rechte Spalte = End-Rotation ${NEWEST_LABEL}.`;

    // Roster koennen sich per Sync geaendert haben
    ttOwnerInvalidate();
    const allPlayers = [];
    Object.entries(ROSTERS_DATA.rosters).forEach(([abbr, t]) =>
      (t.players || []).forEach(pl => allPlayers.push({ name: pl.name, team: abbr })));
    ttFillOwnerFilter(document.getElementById('teamsOwnerFilter'), allPlayers, ownerFilter);

    const findSel = document.getElementById('faMinSelect');
    if (findSel) findSel.value = String(faMinMinutes);

    const teamEntries = Object.entries(ROSTERS_DATA.rosters).sort((a, b) => a[0].localeCompare(b[0]));

    const filtered = teamEntries.filter(([abbr, team]) => {
      // Bei aktivem Besitzfilter Teams weglassen, von denen nichts
      // uebrig bleibt -- sonst stehen dreissig leere Kaesten da.
      if (ownerFilter && !team.players.some(p => ttOwnerMatches(ownerFilter, p.name, abbr))) return false;
      if (!q) return true;
      if (team.name.toLowerCase().includes(q) || abbr.toLowerCase().includes(q)) return true;
      return team.players.some(p => p.name.toLowerCase().includes(q));
    });

    container.innerHTML = filtered.map(([abbr, team]) => {
      const bbmAbbr = mfhfbToBbmAbbr(abbr);
      const leftPlayers = q
        ? team.players.filter(p => p.name.toLowerCase().includes(q) || team.name.toLowerCase().includes(q) || abbr.toLowerCase().includes(q))
            .filter(p => ttOwnerMatches(ownerFilter, p.name, abbr))
        : team.players.filter(p => ttOwnerMatches(ownerFilter, p.name, abbr));

      return `<div class="team-block">
        <div class="team-header">
          <div class="team-name">${abbr} — ${team.name}</div>
          <div class="team-count">${team.players.length} Spieler (aktuell)</div>
        </div>
        <div class="team-cols">
          <div class="col">
            <div class="col-title">Aktueller Kader — meine Minuten${admin ? ' (ziehbar für Starting 5)' : ' (gesperrt)'}</div>
            <table class="stat-table left-table">
              <thead>${statHeaderRow(true)}</thead>
              <tbody>${renderLeftRows(leftPlayers, weights, overrides, abbr, bbmAbbr)}</tbody>
            </table>
          </div>
          <div class="col">
            <div class="col-title right">End-Rotation ${NEWEST_LABEL} (real)</div>
            <table class="stat-table">
              <thead>${statHeaderRow(false)}</thead>
              <tbody>${renderRightRows(bbmAbbr)}</tbody>
            </table>
          </div>
        </div>
      </div>`;
    }).join('') || `<div class="empty-state">Keine Treffer.</div>`;

    if (admin) attachDragHandlers();
  }

  function onMinutesChange(input) {
    const val = parseFloat(input.value);
    if (isNaN(val) || val < 0) return;
    mfhfbSetMinutes(input.dataset.name, val);
    render();
  }

  function onReset(name) {
    mfhfbResetMinutes(name);
    render();
  }

  function onManualChange(input) {
    const { key, team, field, name, pos } = input.dataset;
    const raw = input.value.trim();
    const all = mfhfbGetManualStats();
    const existing = all[key] || {};
    const stats = { ...existing };
    if (raw === '') delete stats[field];
    else stats[field] = parseFloat(raw);

    if (field === 'min' && raw !== '') {
      const newMin = stats.min;
      const oldMin = existing.min !== undefined ? existing.min : mfhfbProjectedMin(name);
      if (oldMin && oldMin > 0 && newMin >= 0 && newMin !== oldMin) {
        const ratio = newMin / oldMin;
        ['pts', 'reb', 'ast', 'stl', 'blk', 'fg3m', 'tov'].forEach(c => {
          if (existing[c] !== undefined) {
            stats[c] = Math.round(existing[c] * ratio * 10) / 10;
          }
        });
      }
    }

    if (stats.min === undefined) {
      const pm = mfhfbProjectedMin(name);
      if (pm !== undefined) stats.min = pm;
    }
    mfhfbSetManualStat(name, team, pos, stats);
    render();
  }

  let dragKey = null, dragTeam = null;
  function attachDragHandlers() {
    document.querySelectorAll('#liveProjTeamsPage .left-table tbody tr[draggable]').forEach(tr => {
      tr.addEventListener('dragstart', () => {
        dragKey = tr.dataset.key;
        dragTeam = tr.dataset.team;
      });
      tr.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (tr.dataset.team === dragTeam) tr.classList.add('drag-over');
      });
      tr.addEventListener('dragleave', () => tr.classList.remove('drag-over'));
      tr.addEventListener('drop', (e) => {
        e.preventDefault();
        tr.classList.remove('drag-over');
        if (!dragKey || tr.dataset.team !== dragTeam || tr.dataset.key === dragKey) return;
        const tbody = tr.closest('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr[draggable]'));
        const fromEl = rows.find(r => r.dataset.key === dragKey);
        if (!fromEl) return;
        const fromIdx = rows.indexOf(fromEl);
        const toIdx = rows.indexOf(tr);
        if (fromIdx < toIdx) tr.after(fromEl); else tr.before(fromEl);
        const newOrder = Array.from(tbody.querySelectorAll('tr[draggable]')).map(r => r.dataset.key);
        mfhfbSetTeamOrder(dragTeam, newOrder);
        dragKey = null; dragTeam = null;
        render();
      });
    });
  }

  document.getElementById('searchTeams').addEventListener('input', e => { query = e.target.value; render(); });

  // Die Seite laeuft in einer IIFE, die onchange-Handler im Markup
  // brauchen die Funktionen aber global.
  window.teamsSetOwnerFilter = (v) => { ownerFilter = v || null; render(); };
  window.teamsSetFaMin = (v) => { faMinMinutes = parseInt(v, 10) || 0; render(); };

  // Onclick/onchange-Attribute im generierten HTML brauchen diese Funktionen
  // im globalen Scope.
  window.onMinutesChange = onMinutesChange;
  window.onReset = onReset;
  window.onManualChange = onManualChange;
  // Fuer js/theme.js: Heatmap-Zellfarben sind fixe Inline-Styles, muessen
  // bei Theme-Wechsel explizit neu gerendert werden.
  window.reRenderLiveProjTeams = render;

  render();
}
