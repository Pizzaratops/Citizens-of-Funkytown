// ============================================================
//  IN-SEASON BLENDING ENGINE
// ============================================================
//  Baut auf assets/shared.js auf (mfhfbNormalizeName, mfhfbComputeProjection
//  müssen bereits geladen sein). Zwei unabhängige Bausteine:
//
//  1) EXTERNE PROJECTIONS ("Konsens-Layer")
//     Eigene Minuten-Rate-Projection (mfhfbComputeProjection) bleibt die
//     Baseline. Externe Quellen (FantasyEdge, Josh Lloyd, Hashtag
//     Basketball, ...) werden pro Spieler/Kategorie dazugespeichert und
//     beim Rendern zu einer geblendeten Preseason-Projection gemittelt
//     (einfacher Mittelwert aus Baseline + allen Quellen, exakt die
//     manuelle Excel-Logik von früher). Die reine Baseline bleibt über
//     mfhfbBaselineOnly() jederzeit abrufbar (Admin-Ansicht).
//
//  2) IN-SEASON LIVE-BLENDING
//     Sobald echte Spiele da sind, werden die geblendete Preseason-
//     Projection und die bisherigen Season-Actuals (aus Taco Tuesday HQs
//     täglichen Live-Scores) nach der Formel
//
//       neuer_wert = (N_prior * preseason_wert + Σ echte_spiele)
//                    / (N_prior + anzahl_spiele)
//
//     kombiniert. N_prior ("Phantom-Spiele") ist pro Kategorie so
//     kalibriert, dass stabile Kategorien (REB/AST/BLK) sich langsam
//     bewegen und volatile (STL/FT%) schneller auf echte Daten reagieren
//     — dieselbe Grundidee wie MFHFB_STABILITY_ALPHA in shared.js, nur
//     jetzt innerhalb der Saison statt Jahr-zu-Jahr.
//
//  Datenquelle für (2): der bestehende tägliche ESPN-Fetch aus dem
//  Taco-Tuesday-HQ-Repo (LIVESCORES_DAILY), per raw.githubusercontent.com
//  clientseitig geladen — keine eigene Datenpipeline nötig, kein Backend.
// ============================================================

// --- 1) Externe Projections: Speicher -----------------------------------

const MFHFB_EXTPROJ_KEY = 'mfhfb_external_proj_v1';

// Kategorien, die wir aus externen Quellen entgegennehmen. Alles optional
// pro Quelle -- fehlende Kategorien fließen einfach nicht in den
// Mittelwert dieser Kategorie ein (kein 0 einsetzen!).
const MFHFB_EXT_CATS = ['min', 'pts', 'reb', 'ast', 'stl', 'blk', 'fg3m', 'tov', 'fgpct', 'ftpct'];

function mfhfbGetExternalProjections() {
  try {
    return JSON.parse(localStorage.getItem(MFHFB_EXTPROJ_KEY) || '{}');
  } catch {
    return {};
  }
}

function mfhfbSaveExternalProjections(all) {
  localStorage.setItem(MFHFB_EXTPROJ_KEY, JSON.stringify(all));
}

// stats: { pts, reb, ast, stl, blk, fg3m, tov, fgpct, ftpct, min } -- nur
// die Felder mitgeben, die die Quelle tatsächlich liefert.
function mfhfbSetExternalSource(playerName, sourceName, stats) {
  const key = mfhfbNormalizeName(playerName);
  const all = mfhfbGetExternalProjections();
  if (!all[key]) all[key] = { name: playerName, sources: {} };
  const clean = {};
  MFHFB_EXT_CATS.forEach(c => {
    if (stats[c] !== undefined && stats[c] !== null && stats[c] !== '' && !isNaN(stats[c])) {
      clean[c] = Number(stats[c]);
    }
  });
  all[key].sources[sourceName] = { ...clean, updatedAt: new Date().toISOString().slice(0, 10) };
  mfhfbSaveExternalProjections(all);
  return all[key];
}

function mfhfbDeleteExternalSource(playerName, sourceName) {
  const key = mfhfbNormalizeName(playerName);
  const all = mfhfbGetExternalProjections();
  if (all[key]) {
    delete all[key].sources[sourceName];
    if (Object.keys(all[key].sources).length === 0) delete all[key];
    mfhfbSaveExternalProjections(all);
  }
  return all[key] || null;
}

function mfhfbGetExternalSourcesFor(playerName) {
  const key = mfhfbNormalizeName(playerName);
  const all = mfhfbGetExternalProjections();
  return all[key] ? all[key].sources : {};
}

// Liste aller je benutzten Quellennamen (für Dropdown/Autocomplete im UI).
function mfhfbKnownExternalSourceNames() {
  const all = mfhfbGetExternalProjections();
  const names = new Set();
  Object.values(all).forEach(p => Object.keys(p.sources).forEach(s => names.add(s)));
  return [...names].sort();
}

// --- Bulk-Import: CSV/TSV-Paste -----------------------------------------
//
// Erwartet eine erste Zeile mit Headern (beliebige Reihenfolge, Komma ODER
// Tab getrennt -- praktisch zum direkten Copy-Paste aus Excel/Google
// Sheets). Erkannte Header (case-insensitive, mehrere Aliase erlaubt):
//   name/spieler/player, min/mpg, pts/ppg, reb/rpg, ast/apg, stl/spg,
//   blk/bpg, fg3m/3pm/tpm, tov/to, fg%/fgpct, ft%/ftpct
//
// Gibt { imported, skipped, unmatched } zurück -- unmatched = Zeilen,
// deren Name sich keinem Spieler in PLAYER_RATES/ROOKIE_PROJECTIONS/
// mfhfb_manual_stats zuordnen ließ (Namens-Tippfehler etc.), damit das UI
// das anzeigen kann statt sie stillschweigend zu verwerfen.
const MFHFB_HEADER_ALIASES = {
  name: ['name', 'spieler', 'player'],
  min: ['min', 'mpg', 'minutes'],
  pts: ['pts', 'ppg', 'points'],
  reb: ['reb', 'rpg', 'rebounds'],
  ast: ['ast', 'apg', 'assists'],
  stl: ['stl', 'spg', 'steals'],
  blk: ['blk', 'bpg', 'blocks'],
  fg3m: ['fg3m', '3pm', 'tpm', 'threes'],
  tov: ['tov', 'to', 'turnovers'],
  fgpct: ['fg%', 'fgpct', 'fg_pct'],
  ftpct: ['ft%', 'ftpct', 'ft_pct'],
};

function mfhfbParseBulkHeader(headerCells) {
  const map = {}; // column index -> canonical key
  headerCells.forEach((cell, i) => {
    const norm = cell.trim().toLowerCase();
    for (const [canonical, aliases] of Object.entries(MFHFB_HEADER_ALIASES)) {
      if (aliases.includes(norm)) { map[i] = canonical; break; }
    }
  });
  return map;
}

// knownPlayerNames: Array echter Anzeigenamen, gegen die per
// mfhfbNormalizeName gematcht wird (Aufrufer übergibt z.B. alle Namen aus
// PLAYER_RATES + ROOKIE_PROJECTIONS + manuellen Stats).
function mfhfbImportExternalBulk(sourceName, rawText, knownPlayerNames) {
  const nameIndex = new Map(knownPlayerNames.map(n => [mfhfbNormalizeName(n), n]));
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return { imported: 0, skipped: 0, unmatched: [] };

  const delim = lines[0].includes('\t') ? '\t' : ',';
  const header = mfhfbParseBulkHeader(lines[0].split(delim));
  const nameCol = Object.entries(header).find(([, v]) => v === 'name');
  if (!nameCol) return { imported: 0, skipped: lines.length - 1, unmatched: [], error: 'Keine Name-Spalte erkannt.' };
  const nameColIdx = Number(nameCol[0]);

  let imported = 0, skipped = 0;
  const unmatched = [];

  for (let li = 1; li < lines.length; li++) {
    const cells = lines[li].split(delim);
    const rawName = (cells[nameColIdx] || '').trim();
    if (!rawName) { skipped++; continue; }
    const matched = nameIndex.get(mfhfbNormalizeName(rawName));
    if (!matched) { unmatched.push(rawName); skipped++; continue; }

    const stats = {};
    Object.entries(header).forEach(([idx, key]) => {
      if (key === 'name') return;
      const raw = (cells[Number(idx)] || '').replace('%', '').trim();
      if (raw !== '') stats[key] = raw;
    });
    mfhfbSetExternalSource(matched, sourceName, stats);
    imported++;
  }
  return { imported, skipped, unmatched };
}

// --- Geblendete Preseason-Projection (Baseline + externe Quellen) -------
//
// baseProjection: Rückgabewert von mfhfbComputeProjection() (die reine
// Minuten-Rate-Baseline). Ergebnis ist derselbe Shape plus Metadaten.
function mfhfbBlendedPreseasonProjection(playerName, baseProjection) {
  const sources = mfhfbGetExternalSourcesFor(playerName);
  const sourceNames = Object.keys(sources);
  if (sourceNames.length === 0) {
    return { ...baseProjection, sourceCount: 0, sourceNames: [], baseOnly: true };
  }

  const blended = { ...baseProjection };
  MFHFB_EXT_CATS.forEach(cat => {
    if (baseProjection[cat] === undefined) return;
    let sum = baseProjection[cat];
    let n = 1;
    sourceNames.forEach(s => {
      const v = sources[s][cat];
      if (v !== undefined) { sum += v; n++; }
    });
    blended[cat] = sum / n;
  });
  mfhfbSyncShootingVolume(blended);
  return { ...blended, sourceCount: sourceNames.length, sourceNames, baseOnly: false };
}

// fgm/ftm aus (unveränderter) fga/fta plus der ggf. geblendeten fgpct/ftpct
// neu ableiten -- externe Quellen/Live-Daten liefern nur Quoten, keine
// Attempts, daher bleiben fga/fta immer die der Minuten-Baseline. Ohne
// diesen Sync würden fgpct/fgm/fga für dieselbe Zeile nicht mehr
// zusammenpassen (relevant für die Liga-Schnitt-FG%-Berechnung in
// index.html/draft.html, die fgm UND fga getrennt aufsummiert).
function mfhfbSyncShootingVolume(values) {
  if (values.fga !== undefined && values.fgpct !== undefined) {
    values.fgm = values.fga * (values.fgpct / 100);
  }
  if (values.fta !== undefined && values.ftpct !== undefined) {
    values.ftm = values.fta * (values.ftpct / 100);
  }
  return values;
}

// Reine Baseline ohne externe Quellen -- für die Admin-Ansicht ("was sagt
// mein Modell allein"), unverändert gegenüber mfhfbComputeProjection().
function mfhfbBaselineOnly(baseProjection) {
  return { ...baseProjection, sourceCount: 0, sourceNames: [], baseOnly: true };
}

// --- 2) In-Season Live-Actuals (Taco Tuesday HQ) -------------------------

const MFHFB_LIVESCORES_URL =
  'https://raw.githubusercontent.com/Pizzaratops/Taco-Tuesday-HQ/main/data/livescores-daily.js';
const MFHFB_LIVE_CACHE_KEY = 'mfhfb_inseason_actuals_cache_v1';
const MFHFB_LIVE_CACHE_HOURS = 6; // neu laden, wenn Cache älter als das ist
const MFHFB_LIVE_LEAGUE = 'nba'; // Regular-Season-Key in LIVESCORES_DAILY; vor Saisonstart leer/nicht vorhanden

// LIVESCORES_DAILY-Textdatei ist ein `const NAME = { ... };`-JS-Modul, aber
// alle Keys/Values darin sind reines JSON (nur Objektliteral drumrum) --
// wir müssen also nicht eval()en, sondern nur den Rahmen abschneiden.
function mfhfbParseLivescoresModule(jsText) {
  // Ab der eigentlichen Deklaration suchen, nicht ab dem ersten "{" in der
  // Datei -- der Kommentar-Kopf enthält vorher schon Beispiel-Objektshapes.
  const declIdx = jsText.indexOf('const LIVESCORES_DAILY');
  if (declIdx === -1) throw new Error('LIVESCORES_DAILY-Deklaration nicht gefunden.');
  const start = jsText.indexOf('{', declIdx);
  const end = jsText.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) throw new Error('Unerwartetes Format in livescores-daily.js');
  const objLiteral = jsText.slice(start, end + 1);
  // LIVESCORES_DAILY ist ein reines JS-Objektliteral (unquoted keys wie
  // `games: [...]`), KEIN JSON -- JSON.parse würde hier scheitern. Wir
  // werten daher nur das reine Datenliteral (kein Funktionsaufruf, keine
  // Statements) über `new Function` aus -- dieselbe Vertrauensebene wie
  // das bestehende <script>-Einbinden der anderen *-data.js-Dateien im
  // Projekt, nur eben per fetch() statt <script src> (raw.githubusercontent
  // liefert die Datei mit "nosniff"-Header, ein <script src> würde vom
  // Browser deshalb gar nicht erst ausgeführt).
  // eslint-disable-next-line no-new-func
  return new Function('"use strict"; return (' + objLiteral + ');')();
}

// Baut aus allen Tages-Einträgen einer Liga eine Season-Aggregation pro
// Spieler: { games, sums: { pts, reb, ast, stl, blk, fg3m, tov, fgpct, ftpct, min } }
// fgpct/ftpct werden dabei NICHT summiert, sondern als spielweiser
// Durchschnitt mitgeführt -- ohne FGA/FTA-Rohzahlen in den Live-Daten ist
// Volumen-Gewichtung hier nicht möglich (Einschränkung der Datenquelle,
// nicht der Formel).
function mfhfbAggregateSeasonActuals(dailyLeagueData) {
  const out = {}; // normalizedName -> { name, games, sums, fgpctSum, ftpctSum }
  Object.values(dailyLeagueData || {}).forEach(day => {
    (day.players || []).forEach(p => {
      const key = mfhfbNormalizeName(p.name);
      if (!out[key]) {
        out[key] = { name: p.name, games: 0, sums: { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, fg3m: 0, tov: 0, min: 0 }, fgpctSum: 0, ftpctSum: 0 };
      }
      const o = out[key];
      o.games++;
      o.sums.pts += p.pts || 0;
      o.sums.reb += p.reb || 0;
      o.sums.ast += p.ast || 0;
      o.sums.stl += p.stl || 0;
      o.sums.blk += p.blk || 0;
      o.sums.fg3m += p.tpm || 0;
      o.sums.tov += p.to || 0;
      o.sums.min += p.min || 0;
      o.fgpctSum += p.fgPct || 0;
      o.ftpctSum += p.ftPct || 0;
    });
  });
  Object.values(out).forEach(o => {
    o.sums.fgpct = o.games > 0 ? o.fgpctSum / o.games : 0;
    o.sums.ftpct = o.games > 0 ? o.ftpctSum / o.games : 0;
  });
  return out;
}

let _mfhfbLiveActualsCache = null; // in-memory, einmal pro Seitenaufruf

// Async: lädt (mit sessionStorage-Cache) die aktuellen Season-Actuals.
// Erfolgt einmal beim Seitenladen; UI ruft danach synchron
// mfhfbGetLiveActualsSync() ab. Wirft nicht -- bei Fehlern/vor Saisonstart
// wird einfach ein leeres Objekt geliefert und "keine Live-Daten"
// signalisiert.
async function mfhfbFetchInSeasonActuals(forceRefresh) {
  if (_mfhfbLiveActualsCache && !forceRefresh) return _mfhfbLiveActualsCache;

  try {
    const cachedRaw = sessionStorage.getItem(MFHFB_LIVE_CACHE_KEY);
    if (cachedRaw && !forceRefresh) {
      const cached = JSON.parse(cachedRaw);
      const ageHours = (Date.now() - cached.fetchedAt) / 3600000;
      if (ageHours < MFHFB_LIVE_CACHE_HOURS) {
        _mfhfbLiveActualsCache = cached.data;
        return _mfhfbLiveActualsCache;
      }
    }
  } catch { /* Cache korrupt -> einfach neu laden */ }

  try {
    const res = await fetch(MFHFB_LIVESCORES_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    const parsed = mfhfbParseLivescoresModule(text);
    const leagueData = parsed[MFHFB_LIVE_LEAGUE] || {};
    const aggregated = mfhfbAggregateSeasonActuals(leagueData);
    _mfhfbLiveActualsCache = aggregated;
    try {
      sessionStorage.setItem(MFHFB_LIVE_CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), data: aggregated }));
    } catch { /* sessionStorage voll -> einfach nicht cachen */ }
    return aggregated;
  } catch (err) {
    console.warn('mfhfbFetchInSeasonActuals: Live-Daten nicht verfügbar (vermutlich vor Saisonstart oder Netzwerk):', err.message);
    _mfhfbLiveActualsCache = {};
    return {};
  }
}

// Synchroner Zugriff NACH mfhfbFetchInSeasonActuals() (z.B. beim Rendern
// der Tabelle) -- gibt {} zurück, wenn noch nicht geladen.
function mfhfbGetLiveActualsSync() {
  return _mfhfbLiveActualsCache || {};
}

function mfhfbLiveActualsFor(playerName) {
  const key = mfhfbNormalizeName(playerName);
  return mfhfbGetLiveActualsSync()[key] || null;
}

// --- Phantom-Games-Blending-Formel ---------------------------------------
//
// N_prior pro Kategorie, abgeleitet aus MFHFB_STABILITY_ALPHA (shared.js):
// hohes Alpha (stabile Kat.) -> hohes N_prior -> Live-Daten brauchen mehr
// Spiele, um die Projection spürbar zu bewegen. Startwerte, gedacht zum
// Nachjustieren über die Saison (siehe mfhfbSetInSeasonPrior).
const MFHFB_INSEASON_PRIOR_DEFAULTS = {
  reb: 18, ast: 18, blk: 18,   // sehr stabil
  fg3m: 14,
  pts: 12,
  fgpct: 12, tov: 12,
  min: 10,
  ftpct: 7,
  stl: 6,                       // volatilste Zählkategorie
};

const MFHFB_INSEASON_PRIOR_KEY = 'mfhfb_inseason_priors_v1';

function mfhfbGetInSeasonPriors() {
  try {
    const stored = JSON.parse(localStorage.getItem(MFHFB_INSEASON_PRIOR_KEY) || '{}');
    return { ...MFHFB_INSEASON_PRIOR_DEFAULTS, ...stored };
  } catch {
    return { ...MFHFB_INSEASON_PRIOR_DEFAULTS };
  }
}

function mfhfbSetInSeasonPrior(cat, games) {
  const all = mfhfbGetInSeasonPriors();
  all[cat] = Number(games);
  localStorage.setItem(MFHFB_INSEASON_PRIOR_KEY, JSON.stringify(all));
}

function mfhfbResetInSeasonPriors() {
  localStorage.removeItem(MFHFB_INSEASON_PRIOR_KEY);
}

// Kernformel: neuer_wert = (N_prior*preseason + Σ echte_spiele) / (N_prior + n)
// Nimmt preseason (per-Spiel-Wert) UND die Summe (nicht den Schnitt!) der
// echten Spiele, weil das mathematisch exakt "N_prior Phantom-Spiele mit
// dem Preseason-Wert" entspricht.
function mfhfbBlendWithPrior(preseasonPerGame, actualSum, gamesPlayed, priorGames) {
  if (!gamesPlayed || gamesPlayed <= 0) return preseasonPerGame;
  return (priorGames * preseasonPerGame + actualSum) / (priorGames + gamesPlayed);
}

// Hauptfunktion: kombiniert Baseline + externe Quellen + Live-Season-
// Actuals zu einer finalen, laufend aktualisierten Projection.
// Gibt { values, meta } zurück:
//   values = { min, pts, reb, ast, stl, blk, fg3m, tov, fgpct, ftpct }
//   meta   = { gamesPlayed, usingLiveData, preseasonBlended, sourceCount }
function mfhfbComputeLiveProjection(playerName, baseProjection) {
  const preseasonBlended = mfhfbBlendedPreseasonProjection(playerName, baseProjection);
  const actuals = mfhfbLiveActualsFor(playerName);
  const priors = mfhfbGetInSeasonPriors();

  if (!actuals || actuals.games === 0) {
    return {
      values: preseasonBlended,
      meta: { gamesPlayed: 0, usingLiveData: false, preseasonBlended, sourceCount: preseasonBlended.sourceCount },
    };
  }

  const values = { ...preseasonBlended };
  MFHFB_EXT_CATS.forEach(cat => {
    if (preseasonBlended[cat] === undefined) return;
    const priorGames = priors[cat] ?? 12;
    if (cat === 'fgpct' || cat === 'ftpct') {
      // Kein Volumen (FGA/FTA) in den Live-Daten -- Blend direkt auf dem
      // Spiel-Durchschnitt der Quote, nicht auf einer Summe.
      const actualAvg = actuals.sums[cat] || 0;
      values[cat] = mfhfbBlendWithPrior(preseasonBlended[cat], actualAvg * actuals.games, actuals.games, priorGames);
    } else {
      const sum = actuals.sums[cat] || 0;
      values[cat] = mfhfbBlendWithPrior(preseasonBlended[cat], sum, actuals.games, priorGames);
    }
  });
  mfhfbSyncShootingVolume(values);

  return {
    values,
    meta: {
      gamesPlayed: actuals.games,
      usingLiveData: true,
      preseasonBlended,
      seasonActualAvg: {
        pts: actuals.sums.pts / actuals.games,
        reb: actuals.sums.reb / actuals.games,
        ast: actuals.sums.ast / actuals.games,
        stl: actuals.sums.stl / actuals.games,
        blk: actuals.sums.blk / actuals.games,
        fg3m: actuals.sums.fg3m / actuals.games,
        tov: actuals.sums.tov / actuals.games,
        fgpct: actuals.sums.fgpct,
        ftpct: actuals.sums.ftpct,
        min: actuals.sums.min / actuals.games,
      },
      sourceCount: preseasonBlended.sourceCount,
    },
  };
}

// --- Vergleichs-Hilfsfunktion (für den "Vergleich"-Button) --------------
//
// Liefert Baseline, geblendete Preseason-Projection, aktuelle Live-
// Projection und reinen Season-Schnitt nebeneinander -- Grundlage für
// eine Vergleichstabelle/-modal auf index.html.
function mfhfbProjectionComparisonRow(playerName, baseProjection) {
  const live = mfhfbComputeLiveProjection(playerName, baseProjection);
  return {
    baseline: mfhfbBaselineOnly(baseProjection),
    preseasonBlended: live.meta.preseasonBlended,
    live: live.values,
    seasonActualAvg: live.meta.seasonActualAvg || null,
    gamesPlayed: live.meta.gamesPlayed,
    usingLiveData: live.meta.usingLiveData,
  };
}
