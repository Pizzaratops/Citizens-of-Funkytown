// MFHFBs NBA Projections — Shared Storage & Name Matching
// Wird von index.html (Projections) UND teams.html (Team-Ansicht) geladen.
// Beide Seiten laufen auf demselben Origin -> localStorage ist geteilt.
// Minuten werden auf teams.html eingetragen; index.html liest sie nur noch.

const MFHFB_STORAGE_KEY = 'mfhfb_proj_minutes_v1';
const MFHFB_WEIGHT_KEY = 'mfhfb_proj_weights_v1';
const MFHFB_CATWEIGHT_KEY = 'mfhfb_cat_weights_v1';

const MFHFB_DEFAULT_SEASON_WEIGHTS = { w1: 1.5, w2: 1.75 };
const MFHFB_DEFAULT_CATEGORY_WEIGHTS = {
  pts: 0.9, reb: 1, ast: 1, stl: 0.75, blk: 0.75, fg3m: 0.75,
  tov: 0.25, ftpct: 0.9, fgpct: 1,
};

// --- Year-to-Year-Stabilität pro Kategorie (Josh Lloyd, Locked On Fantasy
// Basketball, "Year To Year Statistical Correlation") ---
// Lloyd hat pro Kategorie den Pearson-R zwischen Season N und Season N+1
// gemessen (Sample: Top-184-250 Spieler über mehrere Jahres-Paare). Manche
// Kategorien sind extrem "sticky" (Rebounds/Assists/Blocks/3PM: R ≈ 0.87–0.92
// — der Vorjahreswert ist schon ein sehr guter Prädiktor), andere schwanken
// stark von Jahr zu Jahr (Steals, FT%: R ≈ 0.67–0.73 — hier auf das letzte
// Jahr zu vertrauen heißt oft, Rauschen zu jagen statt Signal).
//
// ALPHA steuert pro Rate-Key, wie stark die normale Recency-Gewichtung
// (Slider w1/w2, siehe mfhfbWeightedRates) noch zusätzlich Richtung eines
// flachen Mehrjahres-Durchschnitts (mfhfbFlatAverageRates) geshrinkt wird:
//   alpha = 1   -> unverändertes Verhalten wie bisher (volles Vertrauen
//                  in die Recency-Gewichtung, z.B. Rebounds/Assists/Blocks)
//   alpha < 1   -> Rate wird zusätzlich Richtung Karriere-/Mehrjahres-
//                  Schnitt gezogen (dämpft Ausreißer bei volatilen Kategorien
//                  wie Steals/FT%), Stärke proportional zu (1 - Stabilität)
// Grob aus Lloyds R-Werten abgeleitet (R > 0.85 -> alpha 0.9-1.0, R ~ 0.7
// -> alpha ~0.55-0.6). fgm/fga bestimmen FG% (R 0.83), ftm/fta FT% (R 0.67-0.73).
const MFHFB_STABILITY_ALPHA = {
  reb: 1.0,   // R ≈ 0.90–0.92, stabilste Kategorie überhaupt
  ast: 1.0,   // R ≈ 0.90
  blk: 1.0,   // R ≈ 0.91–0.92
  fg3m: 0.95, // R ≈ 0.87–0.89
  pts: 0.9,   // R ≈ 0.86
  fgm: 0.85,  // treibt FG%, R(FG%) ≈ 0.83
  fga: 0.85,
  tov: 0.85,  // R ≈ 0.77–0.88, ohnehin schon niedrig cat-gewichtet (0.25)
  ftm: 0.55,  // treibt FT%, R(FT%) ≈ 0.67–0.73 — deutlich shrinken
  fta: 0.55,
  stl: 0.55,  // R ≈ 0.67–0.71, am wenigsten stabile Zählkategorie
};

// Namen aus unterschiedlichen Quellen (BBM-Export vs. ESPN) normalisieren,
// damit z.B. "Nikola Jokić" (ESPN) und "Nikola Jokic" (BBM) gematcht werden.
function mfhfbNormalizeName(name) {
  return (name || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Akzente entfernen
    .toLowerCase()
    .replace(/[.'-]/g, '')      // Punkte, Apostrophe, Bindestriche
    .replace(/\s+jr$/, '')      // "Jr." am Ende ignorieren
    .replace(/\s+ii+$/, '')     // "II"/"III" am Ende ignorieren
    .replace(/\s+/g, ' ')
    .trim();
}

// Bekannte Namens-Varianten, bei denen Fantrax einen anderen Namen nutzt
// als unsere Datenbank (z.B. "Alex Sarr" bei Fantrax vs. "Alexandre Sarr"
// bei uns, aus den BBM-Season-Exports übernommen). Key = normalisierter
// Alias, Value = normalisierter kanonischer Name (wie er in PLAYER_RATES/
// ROOKIE_PROJECTIONS steht). Nur als FALLBACK genutzt, wenn die direkte
// Namenssuche nichts findet -- neue Fälle einfach als Zeile ergänzen,
// sobald der "X Pick(s) nicht zuordenbar"-Hinweis im Draft Board wieder
// auf einen Namens-Mismatch statt auf eine echte Datenlücke hinweist.
const MFHFB_NAME_ALIASES = {
  'alex sarr': 'alexandre sarr',
  'cam boozer': 'cameron boozer',
  'cameron johnson': 'cam johnson',
  'herbert jones': 'herb jones',
  'nic claxton': 'nicolas claxton',
};
function mfhfbResolveAlias(normalizedName) {
  return MFHFB_NAME_ALIASES[normalizedName] || normalizedName;
}
// Umgekehrte Richtung: kanonischer Name (wie in PLAYER_RATES) -> Fantrax-
// Alias. Gebraucht für ADP-Daten, die SELBST aus Fantrax-Exports kommen
// und deshalb unter dem Fantrax-Namen gespeichert sind, nicht unter unserem
// kanonischen -- die umgekehrte Nachschlagerichtung zu mfhfbResolveAlias().
const MFHFB_NAME_ALIASES_REVERSE = Object.fromEntries(
  Object.entries(MFHFB_NAME_ALIASES).map(([alias, canonical]) => [canonical, alias])
);
function mfhfbResolveAliasReverse(normalizedName) {
  return MFHFB_NAME_ALIASES_REVERSE[normalizedName] || normalizedName;
}

// Baut eine Lookup-Map normalisierter Name -> Spieler-Objekt aus PLAYER_RATES.
function mfhfbBuildNameIndex(playerRates) {
  const idx = new Map();
  for (const p of playerRates) {
    idx.set(mfhfbNormalizeName(p.name), p);
  }
  return idx;
}

function mfhfbGetOverrides() {
  try {
    return JSON.parse(localStorage.getItem(MFHFB_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function mfhfbSetMinutes(playerName, minutes) {
  const key = mfhfbNormalizeName(playerName);
  const overrides = mfhfbGetOverrides();
  overrides[key] = minutes;
  localStorage.setItem(MFHFB_STORAGE_KEY, JSON.stringify(overrides));
  return overrides;
}

function mfhfbResetMinutes(playerName) {
  const key = mfhfbNormalizeName(playerName);
  const overrides = mfhfbGetOverrides();
  delete overrides[key];
  localStorage.setItem(MFHFB_STORAGE_KEY, JSON.stringify(overrides));
  return overrides;
}

function mfhfbResetAllMinutes() {
  localStorage.setItem(MFHFB_STORAGE_KEY, JSON.stringify({}));
  return {};
}

function mfhfbGetWeights() {
  try {
    return JSON.parse(localStorage.getItem(MFHFB_WEIGHT_KEY) || 'null') || { ...MFHFB_DEFAULT_SEASON_WEIGHTS };
  } catch {
    return { ...MFHFB_DEFAULT_SEASON_WEIGHTS };
  }
}

function mfhfbSetWeights(weights) {
  localStorage.setItem(MFHFB_WEIGHT_KEY, JSON.stringify(weights));
}

function mfhfbGetCategoryWeights() {
  try {
    const stored = JSON.parse(localStorage.getItem(MFHFB_CATWEIGHT_KEY) || 'null');
    return stored ? { ...MFHFB_DEFAULT_CATEGORY_WEIGHTS, ...stored } : { ...MFHFB_DEFAULT_CATEGORY_WEIGHTS };
  } catch {
    return { ...MFHFB_DEFAULT_CATEGORY_WEIGHTS };
  }
}

function mfhfbSetCategoryWeights(weights) {
  localStorage.setItem(MFHFB_CATWEIGHT_KEY, JSON.stringify(weights));
}

// Liste nur der tatsächlich gespielten Saisons eines Spielers (ohne "missed").
function mfhfbPlayedSeasonLabels(player) {
  return Object.keys(player.seasons).filter(l => !player.seasons[l].missed).sort();
}

// GP der letzten bis zu 3 bekannten Saisons (neueste zuerst), z.B. "0/73/69"
// wenn die aktuellste Saison komplett verpasst wurde (0 GP), gefolgt von den
// beiden Saisons davor. "-" nur, wenn der Spieler zu dem Zeitpunkt noch gar
// nicht in der Liga war (vor seinem Debüt).
function mfhfbRecentGP(player) {
  const labels = SEASON_LABELS.slice(-3).reverse();
  return labels.map((l) => {
    const s = player.seasons[l];
    if (!s) return '-';
    return s.missed ? '0' : String(s.gp);
  }).join('/');
}

// Flacher (ungewichteter) Durchschnitt der Pro-Minute-Rate über alle
// tatsächlich gespielten Saisons eines Spielers — der "Karriere-Schnitt"
// als Shrinkage-Ziel für volatile Kategorien (siehe MFHFB_STABILITY_ALPHA).
// Bei nur einer gespielten Saison identisch zur gewichteten Rate dieser
// einen Saison, hat also keinen Effekt für Rookies/Spieler mit kurzer Historie.
function mfhfbFlatAverageRates(player) {
  const labels = mfhfbPlayedSeasonLabels(player);
  const sums = {};
  labels.forEach((label) => {
    const rates = player.seasons[label].rates;
    for (const key in rates) sums[key] = (sums[key] || 0) + rates[key];
  });
  const out = {};
  for (const key in sums) out[key] = sums[key] / labels.length;
  return out;
}

// Gewichtete Pro-Minute-Rate über die tatsächlich gespielten Saisons eines
// Spielers ("missed"-Saisons mit 0 GP fließen NICHT in die Rate ein, sonst
// würde eine Verletzungssaison die Projektion künstlich auf 0 drücken).
// Die zwei jüngsten GESPIELTEN Saisons bekommen die Slider-Gewichte,
// ältere zählen fix 1.
//
// Zusätzlich wird das Ergebnis pro Kategorie per MFHFB_STABILITY_ALPHA
// Richtung Mehrjahres-Schnitt geshrinkt (Josh-Lloyd-Year-to-Year-Stabilität,
// siehe Kommentar dort) — bei stabilen Kategorien (alpha=1) ändert sich
// dadurch nichts am bisherigen Verhalten, bei volatilen (Steals, FT%) wird
// ein reiner Ein-Jahres-Ausreißer gedämpft statt voll durchgereicht.
// ============================================================
//  CONSENSUS-RATEN fuer das Fantrax Draft Board
// ============================================================
//  Das Draft Board rechnet mit Pro-MINUTE-Raten und multipliziert sie
//  mit der eingestellten Minutenzahl -- nur so koennen die
//  Minuten-Regler ueberhaupt etwas bewirken. Die Consensus-Datei
//  (data/projections-consensus.js) enthaelt dagegen fertige
//  Pro-SPIEL-Werte mit bereits eingerechneten Minuten.
//
//  Wuerde man die direkt einsetzen, waeren die Regler wirkungslos:
//  die Zahl bliebe beim Schieben gleich. Deshalb wird hier
//  zurueckgerechnet:  Rate = Pro-Spiel-Wert / Consensus-Minuten
//  Danach gilt wieder  Anzeige = Rate x eingestellte Minuten,
//  die Regler funktionieren also unveraendert weiter.
//
//  NICHT fuer jeden Spieler moeglich: rund die Haelfte der
//  Consensus-Eintraege stammt nur aus Beyaz' Quelle und hat keine
//  Wurfversuche (fga/fta = 0). Aus denen liessen sich keine FG%-Raten
//  ableiten, ohne sie zu erfinden. Fuer diese Spieler faellt die
//  Berechnung auf die historischen Raten zurueck -- das betrifft in der
//  Praxis fast nur Spieler ohne NBA-Rolle, weil die Draft-Seite ohnehin
//  auf aktuelle Roster filtert.
//
//  Der Saison-Gewichtungs-Regler (w1/w2) hat im Consensus-Modus keine
//  Wirkung, weil eine Projection keine Saison-Historie hat. Das ist
//  kein Fehler, sondern liegt in der Natur der Datenquelle -- die
//  Draft-Seite weist im Umschalter darauf hin.

const MFHFB_RATE_SOURCE_KEY = 'mfhfb_rate_source_v1';

function mfhfbGetRateSource() {
  try { return localStorage.getItem(MFHFB_RATE_SOURCE_KEY) || 'consensus'; }
  catch (e) { return 'consensus'; }
}
function mfhfbSetRateSource(v) {
  try { localStorage.setItem(MFHFB_RATE_SOURCE_KEY, v); } catch (e) {}
}

let _mfhfbConsensusRateCache = null;
function _mfhfbConsensusRates() {
  if (_mfhfbConsensusRateCache) return _mfhfbConsensusRateCache;
  _mfhfbConsensusRateCache = new Map();
  if (typeof PROJECTIONS_CONSENSUS === 'undefined') return _mfhfbConsensusRateCache;

  Object.keys(PROJECTIONS_CONSENSUS).forEach(name => {
    const c = PROJECTIONS_CONSENSUS[name];
    // Ohne Minuten oder ohne Wurfversuche keine sinnvolle Rate ableitbar
    if (!c || !(c.min > 0) || !(c.fga > 0)) return;
    const m = c.min;
    _mfhfbConsensusRateCache.set(mfhfbNormalizeName(name), {
      mpg: m,
      gp: c.g || null,
      rates: {
        pts:  (c.pts  || 0) / m,
        fg3m: (c.tpm  || 0) / m,   // Consensus nennt es tpm, die Raten fg3m
        reb:  (c.reb  || 0) / m,
        ast:  (c.ast  || 0) / m,
        stl:  (c.stl  || 0) / m,
        blk:  (c.blk  || 0) / m,
        fgm:  (c.fgm  || 0) / m,
        fga:  (c.fga  || 0) / m,
        ftm:  (c.ftm  || 0) / m,
        fta:  (c.fta  || 0) / m,
        tov:  (c.tov  || 0) / m,
      },
    });
  });
  return _mfhfbConsensusRateCache;
}

// Nach einem Datenwechsel (z.B. neu geladene Consensus-Datei) verwerfen
function mfhfbInvalidateConsensusRates() { _mfhfbConsensusRateCache = null; }

// Liefert Consensus-Raten fuer einen Spieler, oder null wenn nicht
// verfuegbar bzw. der Modus ausgeschaltet ist.
function mfhfbConsensusRatesFor(player) {
  if (mfhfbGetRateSource() !== 'consensus') return null;
  const hit = _mfhfbConsensusRates().get(mfhfbNormalizeName(player.name));
  return hit || null;
}

function mfhfbWeightedRates(player, weights) {
  // Consensus-Projections haben Vorrang, wenn aktiviert und ableitbar
  // (siehe Kommentarblock oben). Fallback: historische Saison-Raten.
  const consensus = mfhfbConsensusRatesFor(player);
  if (consensus) return consensus.rates;

  const labels = mfhfbPlayedSeasonLabels(player);
  const n = labels.length;
  const sums = {};
  let wsum = 0;
  labels.forEach((label, i) => {
    let w = 1;
    if (i === n - 1) w = weights.w2;
    else if (i === n - 2) w = weights.w1;
    const rates = player.seasons[label].rates;
    for (const key in rates) sums[key] = (sums[key] || 0) + rates[key] * w;
    wsum += w;
  });
  const recencyWeighted = {};
  for (const key in sums) recencyWeighted[key] = sums[key] / wsum;

  // Bei nur einer Saison Historie gibt es keinen sinnvollen "Mehrjahres-
  // Schnitt" zum Shrinken -> unverändert die reine Recency-Rate zurückgeben.
  if (n <= 1) return recencyWeighted;

  const flat = mfhfbFlatAverageRates(player);
  const out = {};
  for (const key in recencyWeighted) {
    const alpha = MFHFB_STABILITY_ALPHA[key] ?? 1.0;
    const flatVal = flat[key] ?? recencyWeighted[key];
    out[key] = alpha * recencyWeighted[key] + (1 - alpha) * flatVal;
  }
  return out;
}

// Letzte tatsächlich GESPIELTE Saison (überspringt "missed"-Einträge) —
// Basis für Standard-Projektionsminuten und Team/Pos-Anzeige.
function mfhfbLatestSeason(player) {
  const labels = mfhfbPlayedSeasonLabels(player);
  return player.seasons[labels[labels.length - 1]];
}

// Realwerte für die insgesamt jüngste geladene Saison (z.B. 2025-26) —
// getrennt von mfhfbLatestSeason, weil die jeweils AKTUELLSTE Saison bei
// verletzten/inaktiven Spielern eine "missed"-Saison sein kann. In dem
// Fall soll die Projections-Seite das auch so anzeigen, nicht still die
// Vorjahreszahlen unterschieben.
function mfhfbNewestSeasonActual(player) {
  const newestLabel = SEASON_LABELS[SEASON_LABELS.length - 1];
  const s = player.seasons[newestLabel];
  if (!s || s.missed) {
    return { min: 0, pts: 0, reb: 0, ast: 0, fg3m: 0, missed: true, label: newestLabel };
  }
  return {
    min: s.mpg,
    pts: s.rates.pts * s.mpg,
    reb: s.rates.reb * s.mpg,
    ast: s.rates.ast * s.mpg,
    fg3m: s.rates.fg3m * s.mpg,
    missed: false,
    label: newestLabel,
  };
}

function mfhfbComputeProjection(player, minutes, weights) {
  const r = mfhfbWeightedRates(player, weights);
  const fgm = r.fgm * minutes, fga = r.fga * minutes;
  const ftm = r.ftm * minutes, fta = r.fta * minutes;
  return {
    min: minutes,
    pts: r.pts * minutes,
    reb: r.reb * minutes,
    ast: r.ast * minutes,
    stl: r.stl * minutes,
    blk: r.blk * minutes,
    fg3m: r.fg3m * minutes,
    tov: r.tov * minutes,
    fgm, fga, ftm, fta,
    fgpct: fga > 0 ? (fgm / fga) * 100 : 0,
    ftpct: fta > 0 ? (ftm / fta) * 100 : 0,
  };
}

const MFHFB_POOL_KEY = 'mfhfb_zscore_pool_v1';

function mfhfbGetPoolSize() {
  return localStorage.getItem(MFHFB_POOL_KEY) || 'all'; // 'all' | '200' | '400'
}

function mfhfbSetPoolSize(v) {
  localStorage.setItem(MFHFB_POOL_KEY, v);
}

// Excel-artige bedingte Formatierung: interpoliert zwischen "schlecht" und
// "gut" je nach Position von `value` zwischen `min` und `max`.
// invert=true für Kategorien, bei denen weniger besser ist (z.B. TOV).
// Setzt NUR die Hintergrundfarbe (leicht transparent) — die Textfarbe bleibt
// die Theme-Textfarbe, damit es in Dark UND Light Mode lesbar ist.
//
// War frueher ein hartcodierter HSL-Regenbogen (hue 0..120, rot->gruen ueber
// alle Zwischentoene) unabhaengig vom Theme — dadurch sahen die mittleren
// Werte "verwaschen" aus (Oliv/Gelb-Stich) und passten nicht zu TTHQs warmer
// Cream/Rost-Palette. Jetzt: echte lineare RGB-Interpolation zwischen den
// CSS-Variablen --bad und --good, live aus dem Theme ausgelesen — bleibt
// automatisch synchron, falls sich die Theme-Farben mal aendern.
const _mfhfbHeatColorCache = { theme: null, bad: null, good: null };
function _mfhfbHexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [128, 128, 128];
}
function _mfhfbHeatColors() {
  // Zwei Theme-Mechanismen moeglich: data-theme-Attribut auf <html> (wenn
  // diese Seite noch als eigenstaendiges Dokument/Iframe laeuft, siehe
  // <script> im <head> von index.html/teams.html/draft.html) ODER die
  // body.light-Klasse (wenn diese Seite nativ in Taco Tuesday HQ eingebaut
  // ist, seit 2026-08-01 der Fall fuer die Projections-Tabelle). Beide
  // pruefen, sonst haengt der Cache in der nativen Variante permanent auf
  // 'dark' fest, weil data-theme dort nie gesetzt wird.
  const isLight = document.documentElement.getAttribute('data-theme') === 'light'
    || document.body.classList.contains('light');
  const theme = isLight ? 'light' : 'dark';
  if (_mfhfbHeatColorCache.theme === theme) return _mfhfbHeatColorCache;
  const cs = getComputedStyle(document.documentElement);
  _mfhfbHeatColorCache.theme = theme;
  _mfhfbHeatColorCache.bad = _mfhfbHexToRgb(cs.getPropertyValue('--bad') || '#ff6584');
  _mfhfbHeatColorCache.good = _mfhfbHexToRgb(cs.getPropertyValue('--good') || '#4caf81');
  return _mfhfbHeatColorCache;
}
function mfhfbHeatStyle(value, min, max, invert) {
  if (max === min || !isFinite(min) || !isFinite(max)) return '';
  let t = (value - min) / (max - min);
  if (invert) t = 1 - t;
  t = Math.max(0, Math.min(1, t));
  const { bad, good } = _mfhfbHeatColors();
  const r = Math.round(bad[0] + (good[0] - bad[0]) * t);
  const g = Math.round(bad[1] + (good[1] - bad[1]) * t);
  const b = Math.round(bad[2] + (good[2] - bad[2]) * t);
  return `background-color:rgba(${r},${g},${b},0.22);`;
}

// --- Aktuelles Team pro Spieler (aus dem täglichen ESPN-Roster-Fetch) ---
// PLAYER_RATES/players-data.js "team"-Feld ist historisch (Team der letzten
// GESPIELTEN Saison, aus dem BBM-Export) -- das ist auf teams.html bewusst
// so gewollt (rechte Spalte = tatsächliche End-Rotation der Vorsaison, siehe
// dortiger Kommentar). Für die Projections- und Draft-Board-Seite wollen wir
// aber das AKTUELLE Team zeigen (nach Trades/Free Agency), das schon täglich
// automatisch in rosters-data.js (ROSTERS_DATA) landet -- nur wurde es dort
// bisher nicht genutzt. mfhfbApplyCurrentTeams() gleicht beides ab.

// ESPN- und BBM-Team-Kürzel weichen bei ein paar Teams voneinander ab
// (einzige zentrale Stelle -- vorher in teams.html dupliziert).
const MFHFB_ESPN_TO_BBM_TEAM = {
  GS: 'GSW', NO: 'NOR', NY: 'NYK', PHX: 'PHO', SA: 'SAS', UTAH: 'UTA', WSH: 'WAS',
};
function mfhfbToBbmAbbr(espnAbbr) { return MFHFB_ESPN_TO_BBM_TEAM[espnAbbr] || espnAbbr; }

let _mfhfbValidTeamSet = null;
// Menge aller aktuell echten NBA-Team-Kürzel (BBM-Format) -- aus
// ROSTERS_DATA abgeleitet (30 Teams), mit einer festen Fallback-Liste falls
// rosters-data.js auf einer Seite nicht geladen ist. Für den Filter
// "Spieler ohne echtes aktuelles Team raus" (Free Agents, ligafremd, etc.).
const MFHFB_STATIC_TEAM_FALLBACK = [
  'ATL','BOS','BKN','CHA','CHI','CLE','DAL','DEN','DET','GSW','HOU','IND',
  'LAC','LAL','MEM','MIA','MIL','MIN','NOR','NYK','OKC','ORL','PHI','PHO',
  'POR','SAC','SAS','TOR','UTA','WAS',
];
function mfhfbValidTeamSet() {
  if (_mfhfbValidTeamSet) return _mfhfbValidTeamSet;
  if (typeof ROSTERS_DATA !== 'undefined' && ROSTERS_DATA && ROSTERS_DATA.rosters) {
    _mfhfbValidTeamSet = new Set(Object.keys(ROSTERS_DATA.rosters).map(mfhfbToBbmAbbr));
  } else {
    _mfhfbValidTeamSet = new Set(MFHFB_STATIC_TEAM_FALLBACK);
  }
  return _mfhfbValidTeamSet;
}
function mfhfbIsValidCurrentTeam(teamAbbr) {
  return mfhfbValidTeamSet().has(teamAbbr);
}

let _mfhfbCurrentTeamIndex = null;
function mfhfbBuildCurrentTeamIndex() {
  if (_mfhfbCurrentTeamIndex) return _mfhfbCurrentTeamIndex;
  const idx = new Map();
  if (typeof ROSTERS_DATA !== 'undefined' && ROSTERS_DATA && ROSTERS_DATA.rosters) {
    Object.entries(ROSTERS_DATA.rosters).forEach(([espnAbbr, team]) => {
      const bbmAbbr = mfhfbToBbmAbbr(espnAbbr);
      (team.players || []).forEach(pl => {
        idx.set(mfhfbNormalizeName(pl.name), bbmAbbr);
      });
    });
  }
  _mfhfbCurrentTeamIndex = idx;
  return idx;
}

// Aktuelles Team eines Spielers (BBM-Kürzel-Format), oder fallbackAbbr falls
// er auf keinem der 30 ESPN-Roster auftaucht (z.B. Free Agent gerade ohne
// Team, oder rosters-data.js fehlt/ist nicht geladen -- dann einfach das
// historische Team aus PLAYER_RATES weiterverwenden statt "-" anzuzeigen).
function mfhfbCurrentTeamAbbr(playerName, fallbackAbbr) {
  const idx = mfhfbBuildCurrentTeamIndex();
  const norm = mfhfbNormalizeName(playerName);
  return idx.get(norm) || idx.get(mfhfbResolveAliasReverse(norm)) || fallbackAbbr;
}

// Überschreibt in-place das "team"-Feld einer Liste von Spielerobjekten
// (z.B. PLAYER_RATES) mit dem aktuellen Team, wo bekannt. NUR auf Seiten
// aufrufen, die das historische Team NICHT separat brauchen (index.html,
// draft.html) -- NICHT auf teams.html, deren rechte Spalte bewusst nach dem
// historischen Team filtert (siehe renderRightRows dort).
function mfhfbApplyCurrentTeams(playerRates) {
  const idx = mfhfbBuildCurrentTeamIndex();
  if (idx.size === 0) return 0; // rosters-data.js nicht geladen -- nichts zu tun
  let updated = 0;
  playerRates.forEach(p => {
    const current = idx.get(mfhfbNormalizeName(p.name));
    if (current && current !== p.team) { p.team = current; updated++; }
  });
  return updated;
}

// "Ist DIESER Spieler gerade auf einem echten NBA-Roster" -- anders als
// mfhfbIsValidCurrentTeam(), das nur prueft, ob p.team wie ein gueltiges
// Team-Kuerzel AUSSIEHT (z.B. "UTA"). Ein Spieler, der die Liga verlassen
// hat, behaelt in PLAYER_RATES oft noch sein letztes echtes Team als Feld
// stehen -- das ist weiterhin ein gueltiges Kuerzel, der Spieler ist aber
// laengst nicht mehr dort. mfhfbIsValidCurrentTeam() liess solche Spieler
// faelschlich durch (Bug-Report 2026-08-01: Hassan Whiteside, Nikola
// Mirotic tauchten im Draft Board/den Projections auf, obwohl sie auf
// keinem der 30 ESPN-Roster stehen). Fallback auf die alte, laxere Pruefung
// NUR wenn rosters-data.js gar nicht geladen ist (Index leer) -- sonst
// wuerde ein Netzwerk-/Ladefehler die komplette Seite leerraeumen statt nur
// die abgemeldeten Spieler rauszufiltern.
function mfhfbIsOnCurrentRoster(playerName, fallbackTeam) {
  const idx = mfhfbBuildCurrentTeamIndex();
  if (idx.size === 0) return mfhfbIsValidCurrentTeam(fallbackTeam); // Rosterdaten nicht geladen -- Notbremse
  const norm = mfhfbNormalizeName(playerName);
  // playerName kommt hier im PLAYER_RATES-Format (z.B. "Alexandre Sarr"),
  // ROSTERS_DATA (ESPN) nutzt teils Kurzformen (z.B. "Alex Sarr"). Ohne die
  // Alias-Aufloesung fielen betroffene Spieler schon HIER durchs Raster --
  // bevor applyFantraxPicks() überhaupt zum Zug kam, und ohne dass die
  // dortige Alias-Behandlung das reparieren konnte.
  return idx.has(norm) || idx.has(mfhfbResolveAliasReverse(norm));
}


// Dasselbe für manuelle/Rookie-Einträge (mfhfbGetManualStats()) -- deren
// "team"-Feld ist ein STATISCHES Vorab-Schätzung (z.B. Pre-Draft-Mock in
// rookie-projections.js) und wird NIE automatisch aktualisiert, wenn der
// Spieler später tatsächlich einem echten Team beitritt. teams.html zeigt
// ihn in dem Fall schon korrekt beim echten Team (linke Spalte kommt direkt
// aus ROSTERS_DATA, nicht aus dem manuellen Eintrag), aber Draft Board und
// Projections lesen p.team direkt -- ohne diesen Sync bleiben die
// veraltet, obwohl der Spieler längst einem echten Kader zugeordnet ist
// (Beispiel: Cameron Boozer, Rookie-Datei sagt GSW, ESPN sagt inzwischen MEM).
function mfhfbSyncManualTeams() {
  const idx = mfhfbBuildCurrentTeamIndex();
  if (idx.size === 0) return 0;
  const manual = mfhfbGetManualStats();
  let updated = 0;
  Object.values(manual).forEach(m => {
    const current = idx.get(mfhfbNormalizeName(m.name));
    if (current && current !== m.team) { m.team = current; updated++; }
  });
  if (updated > 0) localStorage.setItem(MFHFB_MANUAL_KEY, JSON.stringify(manual));
  return updated;
}

const MFHFB_THEME_KEY = 'mfhfb_theme_v1';

function mfhfbGetTheme() {
  return localStorage.getItem(MFHFB_THEME_KEY) || 'dark';
}

function mfhfbSetTheme(theme) {
  localStorage.setItem(MFHFB_THEME_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
}

// Baut den Theme-Toggle-Button auf (Text + Klick-Handler). Der data-theme-
// Attribut-Wert selbst wird schon per Inline-Script im <head> gesetzt,
// damit es beim Laden nicht kurz "flackert".
function mfhfbInitThemeToggle(buttonId) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  const updateLabel = () => {
    btn.textContent = mfhfbGetTheme() === 'light' ? '🌙 Dark' : '☀️ Light';
  };
  updateLabel();
  btn.addEventListener('click', () => {
    mfhfbSetTheme(mfhfbGetTheme() === 'light' ? 'dark' : 'light');
    updateLabel();
  });
}

// --- Manuelle Stats fuer Spieler ohne Rate-Daten (Rookies, Two-Way etc.) ---
// Speichert einen kompletten, selbststaendigen Stat-Datensatz (nicht nur
// Minuten), damit auch die Projections-Seite (die keinen ESPN-Roster laedt)
// diese Spieler anzeigen kann, ohne rosters-data.js zu brauchen.
const MFHFB_MANUAL_KEY = 'mfhfb_manual_stats_v1';

function mfhfbGetManualStats() {
  try {
    return JSON.parse(localStorage.getItem(MFHFB_MANUAL_KEY) || '{}');
  } catch {
    return {};
  }
}

function mfhfbSetManualStat(playerName, team, pos, stats) {
  const key = mfhfbNormalizeName(playerName);
  const all = mfhfbGetManualStats();
  all[key] = { name: playerName, team, pos, ...stats };
  localStorage.setItem(MFHFB_MANUAL_KEY, JSON.stringify(all));
  return all;
}

function mfhfbDeleteManualStat(playerName) {
  const key = mfhfbNormalizeName(playerName);
  const all = mfhfbGetManualStats();
  delete all[key];
  localStorage.setItem(MFHFB_MANUAL_KEY, JSON.stringify(all));
  return all;
}

// Rookie-Projektionen als Vorbelegung in localStorage schreiben. Laeuft
// beim Laden JEDER Seite (nicht nur teams.html!) -- vorher war das nur in
// teams.html verdrahtet, wodurch auf einem Geraet/Browser, auf dem
// teams.html noch nie geoeffnet wurde (z.B. Handy nur fuers Draft Board,
// oder ein zweiter Rechner), localStorage leer blieb und Rookies im Draft
// Board als "nicht zuordenbar" auftauchten, obwohl die Daten laengst
// korrekt in rookie-projections.js standen.
//
// Normalfall: nur wenn fuer den jeweiligen Spieler noch KEIN manueller
// Eintrag existiert, damit eigene Anpassungen nicht ueberschrieben werden.
// AUSNAHME: wenn sich ROOKIE_PROJECTIONS_VERSION geaendert hat (inhaltliche
// Korrektur der Quelldaten), wird EINMALIG erzwungen neu geseedet -- sonst
// wuerden alte, fehlerhafte Werte fuer immer bestehen bleiben, weil das
// normale Seeding nur Luecken auffuellt, nie vorhandene Eintraege ersetzt.
//
// Voraussetzung: rookie-projections.js muss VOR assets/shared.js geladen
// werden (siehe <script>-Reihenfolge in index.html/teams.html/draft.html).
// Ist die Datei auf einer Seite gar nicht eingebunden, ist dieser Block
// ein no-op (typeof-Check) -- kein Fehler, nur kein Seeding dort.
const MFHFB_ROOKIE_VERSION_KEY = 'mfhfb_rookie_seed_version';
function mfhfbSeedRookieProjections() {
  if (typeof ROOKIE_PROJECTIONS === 'undefined') return;
  if (typeof PLAYER_RATES === 'undefined') return; // Kollisions-Schutz unten braucht PLAYER_RATES
  const existing = mfhfbGetManualStats();
  const storedVersion = Number(localStorage.getItem(MFHFB_ROOKIE_VERSION_KEY) || 0);
  const forceReseed = typeof ROOKIE_PROJECTIONS_VERSION !== 'undefined' && storedVersion < ROOKIE_PROJECTIONS_VERSION;
  let seeded = 0, overwritten = 0;
  Object.entries(ROOKIE_PROJECTIONS).forEach(([key, proj]) => {
    if (!existing[key]) {
      existing[key] = proj;
      seeded++;
    } else if (forceReseed) {
      existing[key] = proj;
      overwritten++;
    }
  });

  // Genereller Schutz (nicht nur einmalig): ein manueller Eintrag darf NIE
  // einen Spieler ueberschatten, fuer den wir schon echte Saisondaten haben
  // (players-data.js) -- sonst entsteht genau der Bug, der Brandon Miller
  // getroffen hat: Namens-Lookup findet zwei Kandidaten, Fantrax-Picks
  // werden dem falschen zugeordnet. Betrifft nicht nur Rookie-Vorbelegungen,
  // sondern auch versehentlich von Hand angelegte Duplikate.
  const realPlayerNames = new Set(PLAYER_RATES.map(p => mfhfbNormalizeName(p.name)));
  let removed = 0;
  Object.keys(existing).forEach(key => {
    if (realPlayerNames.has(key)) { delete existing[key]; removed++; }
  });

  if (seeded > 0 || overwritten > 0 || removed > 0) {
    localStorage.setItem(MFHFB_MANUAL_KEY, JSON.stringify(existing));
    console.log(`Rookie-Projektionen: ${seeded} neu, ${overwritten} auf v${ROOKIE_PROJECTIONS_VERSION} aktualisiert, ${removed} entfernt (kollidierten mit echten Spielerdaten).`);
  }
  if (typeof ROOKIE_PROJECTIONS_VERSION !== 'undefined') {
    localStorage.setItem(MFHFB_ROOKIE_VERSION_KEY, String(ROOKIE_PROJECTIONS_VERSION));
  }
}
mfhfbSeedRookieProjections();

// --- Reihenfolge innerhalb eines Teams (Drag & Drop, z.B. fuer Starting 5) ---
const MFHFB_ORDER_KEY = 'mfhfb_team_order_v1';

function mfhfbGetTeamOrder(teamAbbr) {
  try {
    const all = JSON.parse(localStorage.getItem(MFHFB_ORDER_KEY) || '{}');
    return all[teamAbbr] || null; // Array normalisierter Namen, oder null wenn noch nicht gesetzt
  } catch {
    return null;
  }
}

function mfhfbSetTeamOrder(teamAbbr, orderedNormalizedNames) {
  let all = {};
  try { all = JSON.parse(localStorage.getItem(MFHFB_ORDER_KEY) || '{}'); } catch {}
  all[teamAbbr] = orderedNormalizedNames;
  localStorage.setItem(MFHFB_ORDER_KEY, JSON.stringify(all));
}

// Sortiert eine Liste von Items (mit .key = normalisierter Name) nach einer
// gespeicherten Reihenfolge; neue/unbekannte Spieler werden ans Ende gehängt.
function mfhfbApplyTeamOrder(items, teamAbbr) {
  const order = mfhfbGetTeamOrder(teamAbbr);
  if (!order) return items;
  const pos = new Map(order.map((k, i) => [k, i]));
  return [...items].sort((a, b) => {
    const ai = pos.has(a.key) ? pos.get(a.key) : Infinity;
    const bi = pos.has(b.key) ? pos.get(b.key) : Infinity;
    if (ai !== bi) return ai - bi;
    return 0;
  });
}

// --- Projizierte Minuten 2026-27 als Standardwert ---
// Reihenfolge: manueller Override (Teams-Seite) > projizierte Minuten
// (projected-minutes.js) > reale MPG der letzten gespielten Saison.
//
// Bei der reinen MPG-Rückfall-Option (keine explizite Projektion hinterlegt)
// ist eine sehr kleine Stichprobe (wenige gespielte Spiele) oft Rauschen --
// z.B. Tre Scott: 6 Spiele mit 30,4 MPG (Verletzungsvertretung), daraus wird
// sonst blind "30 Minuten nächste Saison" gemacht. Ab MFHFB_MIN_GP_FOR_TRUST
// gespielten Spielen volles Vertrauen in die MPG, darunter wird proportional
// Richtung einer konservativen Bankspieler-Baseline geshrinkt. Werte sind
// Heuristik/Erfahrungswert, nicht exakt hergeleitet -- bei Bedarf anpassen.
const MFHFB_MIN_GP_FOR_TRUST = 20;
const MFHFB_FRINGE_BASELINE_MIN = 6;
function mfhfbDefaultMinutes(playerName, fallbackMpg, fallbackGp) {
  const key = mfhfbNormalizeName(playerName);
  if (typeof PROJECTED_MINUTES !== 'undefined' && PROJECTED_MINUTES[key]) {
    return PROJECTED_MINUTES[key].min;
  }
  if (fallbackGp !== undefined && fallbackGp > 0 && fallbackGp < MFHFB_MIN_GP_FOR_TRUST) {
    const confidence = fallbackGp / MFHFB_MIN_GP_FOR_TRUST;
    const baseline = Math.min(fallbackMpg, MFHFB_FRINGE_BASELINE_MIN);
    return confidence * fallbackMpg + (1 - confidence) * baseline;
  }
  return fallbackMpg;
}

// True, wenn für den Spieler eine projizierte (nicht nur Vorsaison-)Minutenzahl existiert.
function mfhfbHasProjection(playerName) {
  const key = mfhfbNormalizeName(playerName);
  return typeof PROJECTED_MINUTES !== 'undefined' && !!PROJECTED_MINUTES[key];
}

// Rohe projizierte Minuten (oder undefined) — auch für Rookies ohne Rate-Daten.
function mfhfbProjectedMin(playerName) {
  const key = mfhfbNormalizeName(playerName);
  if (typeof PROJECTED_MINUTES !== 'undefined' && PROJECTED_MINUTES[key]) {
    return PROJECTED_MINUTES[key].min;
  }
  return undefined;
}

// --- Admin-Lock: Minuten-/Rotationsbearbeitung hinter Button sperren ---
// Client-seitige Sperre gegen versehentliche Änderungen durch Betrachter.
// (Hinweis: rein clientseitig, kein echter Schutz gegen jemanden, der den
// Quelltext liest — es geht um Bedien-, nicht um Manipulationssicherheit.)
const MFHFB_ADMIN_KEY = 'mfhfb_admin_v1';
const MFHFB_ADMIN_PASSWORD = '2025'; // hier bei Bedarf ändern

function mfhfbIsAdmin() {
  return localStorage.getItem(MFHFB_ADMIN_KEY) === '1';
}

function mfhfbSetAdmin(on) {
  if (on) localStorage.setItem(MFHFB_ADMIN_KEY, '1');
  else localStorage.removeItem(MFHFB_ADMIN_KEY);
}

// Verkabelt den Admin-Button. onChange wird nach jedem Statuswechsel aufgerufen
// (damit die Seite neu rendern und Inputs sperren/entsperren kann).
function mfhfbInitAdminToggle(buttonId, onChange) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  const label = () => {
    if (mfhfbIsAdmin()) {
      btn.textContent = '🔓 Admin aktiv';
      btn.classList.add('admin-on');
    } else {
      btn.textContent = '🔒 Admin';
      btn.classList.remove('admin-on');
    }
  };
  label();
  btn.addEventListener('click', () => {
    if (mfhfbIsAdmin()) {
      mfhfbSetAdmin(false); // Sperren braucht kein Passwort
    } else {
      const pw = prompt('Admin-Passwort eingeben, um die Bearbeitung freizuschalten:');
      if (pw === null) return; // abgebrochen
      if (pw === MFHFB_ADMIN_PASSWORD) {
        mfhfbSetAdmin(true);
      } else {
        alert('Falsches Passwort.');
        return;
      }
    }
    label();
    if (typeof onChange === 'function') onChange(mfhfbIsAdmin());
  });
}
