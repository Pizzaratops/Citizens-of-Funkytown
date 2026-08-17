// ============================================================
//  FANTASY-BESITZ — gemeinsame Basis
// ============================================================
//  Beantwortet ueberall auf der Seite dieselbe Frage: wem gehoert
//  dieser Spieler in der Taco Tuesday League, oder ist er frei?
//
//  Genutzt von:
//    js/projections-native.js        (Spalte + Filter)
//    js/projections-teams-native.js  (Spalte + Filter + Fund-Hinweis)
//    js/best-available.js            (Filter)
//
//  Vorher stand diese Logik nur in projections-native.js. Beim
//  Erweitern auf die anderen beiden Seiten waere sie sonst dreimal
//  kopiert worden, mit drei Stellen, an denen sie auseinanderlaufen
//  kann -- gerade beim Namensabgleich, wo Aliase und Umlaute schnell
//  fuer Abweichungen sorgen.
//
//  Quelle ist ROSTERS aus data/teams-rosters.js, das js/admin.js beim
//  Start aus data/rosters-live.js hydriert. Wer dort nicht auftaucht,
//  ist Free Agent.
//
//  WICHTIG: Der Index wird zwischengespeichert. Nach einem Roster-Sync
//  oder einer Admin-Aenderung muss ttOwnerInvalidate() laufen, sonst
//  zeigt die Seite den Besitz von vorher.
// ============================================================

let _ttOwnerIdx = null;

function ttOwnerInvalidate() { _ttOwnerIdx = null; }

function _ttNorm(name) {
  return (typeof normalizeName === 'function')
    ? normalizeName(name)
    : String(name || '').toLowerCase().trim();
}

function ttOwnerIndex() {
  if (_ttOwnerIdx) return _ttOwnerIdx;
  _ttOwnerIdx = new Map();
  if (typeof ROSTERS === 'undefined' || !ROSTERS) return _ttOwnerIdx;
  Object.keys(ROSTERS).forEach(tid => {
    (ROSTERS[tid] || []).forEach(pl => {
      const k = _ttNorm(pl.name);
      if (k && !_ttOwnerIdx.has(k)) _ttOwnerIdx.set(k, parseInt(tid, 10));
    });
  });
  return _ttOwnerIdx;
}

/** Fantasy-Team eines Spielers, oder null wenn Free Agent. */
function ttOwnerOf(name) {
  const tid = ttOwnerIndex().get(_ttNorm(name));
  if (!tid) return null;
  return (typeof teamMap !== 'undefined' && teamMap[tid])
    ? teamMap[tid]
    : { id: tid, name: 'Team ' + tid };
}

/**
 * Kuerzel aus dem Teamnamen ableiten.
 * TEAMS in data/teams-rosters.js hat kein Kuerzel-Feld, und eines
 * nachzupflegen hiesse, es bei jeder Umbenennung mitzupflegen.
 * Mehrere Woerter werden zu Initialen, ein Wort zu den ersten drei
 * Buchstaben. Der volle Name gehoert ins title-Attribut.
 */
function ttShort(name) {
  const w = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (w.length >= 2) return w.slice(0, 3).map(x => x[0]).join('').toUpperCase();
  return (w[0] || '?').slice(0, 3).toUpperCase();
}

/** Fertiges Markup fuer die Besitz-Zelle. */
function ttOwnerTag(name) {
  const o = ttOwnerOf(name);
  if (!o) return '<span class="own-tag fa" title="Free Agent, in keinem Kader">FA</span>';
  // getTeamColor() kann undefined liefern, wenn das Team-Objekt aus einem
  // Fallback stammt (kein Eintrag in teamMap) -- dann landet sonst
  // literal "undefined" im style-Attribut. Deshalb zweite Absicherung.
  const c = ((typeof getTeamColor === 'function') ? getTeamColor(o) : null) || 'var(--border)';
  return `<span class="own-tag" style="border-color:${c};color:${c}" title="${String(o.name).replace(/"/g, '&quot;')}">${ttShort(o.name)}</span>`;
}

// ─── Filter ──────────────────────────────────────────────────
//  Werte: '' = alle, 'FA' = nur Free Agents, 'T:<id>' = ein Fantasy
//  Team, 'N:<abk>' = ein NBA Team.

function ttOwnerMatches(filterValue, playerName, nbaTeam) {
  if (!filterValue) return true;
  if (filterValue === 'FA') return !ttOwnerOf(playerName);
  if (filterValue.startsWith('T:')) {
    const o = ttOwnerOf(playerName);
    return !!o && o.id === parseInt(filterValue.slice(2), 10);
  }
  if (filterValue.startsWith('N:')) return nbaTeam === filterValue.slice(2);
  return true;
}

/**
 * Befuellt ein <select> mit Alle / Free Agents / Fantasy Teams / NBA Teams.
 * items: [{ name, team }] -- die aktuell in Frage kommenden Spieler,
 * damit die Anzahl je Option zur Seite passt statt zur Gesamtdatenbank.
 */
function ttFillOwnerFilter(el, items, current) {
  if (!el) return;
  const faCount = items.filter(it => !ttOwnerOf(it.name)).length;
  const nbaTeams = [...new Set(items.map(it => it.team).filter(Boolean))].sort();
  const ttTeams = (typeof TEAMS !== 'undefined' ? TEAMS : [])
    .slice().sort((a, b) => a.name.localeCompare(b.name));

  el.innerHTML =
    `<option value="">Alle Spieler (${items.length})</option>` +
    `<option value="FA">Nur Free Agents (${faCount})</option>` +
    (ttTeams.length
      ? '<optgroup label="Fantasy Team">' + ttTeams.map(t => {
          const n = items.filter(it => { const o = ttOwnerOf(it.name); return o && o.id === t.id; }).length;
          return `<option value="T:${t.id}">${t.name} (${n})</option>`;
        }).join('') + '</optgroup>'
      : '') +
    '<optgroup label="NBA Team">' + nbaTeams.map(t =>
      `<option value="N:${t}">${t} (${items.filter(it => it.team === t).length})</option>`
    ).join('') + '</optgroup>';
  el.value = current || '';
}
