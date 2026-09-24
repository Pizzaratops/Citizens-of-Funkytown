// ============================================================
//  SCORE-MODUS — wie die 9 Kategorien zu EINEM Wert werden
// ============================================================
//  Gilt gemeinsam fuer Rankings, Projections und Cat Web (Rang-Anzeige).
//  Eine Umschaltung auf einer Seite gilt ueberall und wird im Browser
//  gemerkt (localStorage).
//
//  Drei Modi:
//   - 'z'     Z roh: Summe der (gewichteten) Kategorie-Z-Scores. So war es
//             bisher. Problem: schiefe Kategorien (v.a. BLK, auch STL/3PM)
//             liefern Ausreisser bis +5 und mehr, ein Spezialist bekommt
//             dadurch mehr Wert, als ihm in H2H-Kategorien je nuetzt
//             (eine Kategorie kann man pro Woche nur einmal gewinnen).
//   - 'zcap'  Z ±3 (Standard): wie 'z', aber jeder Kategorie-Z wird vor
//             dem Summieren auf -3..+3 gekappt. Aendert nur die Extreme,
//             die Mitte des Feldes bleibt identisch.
//   - 'pctl'  Perzentil: je Kategorie der Rang-Anteil im Pool (0-100,
//             50 = Median), dann gewichteter Mittelwert ueber die
//             Kategorien. Vollstaendig robust gegen Ausreisser, dafuer
//             gehen Abstaende zwischen Spielern verloren (Rang statt
//             Groesse).
//
//  Die Rohdaten (Pro-Spiel-Stats, Kategorie-Z-Scores) aendern sich NICHT,
//  die Pipeline (GitHub Actions) bleibt unberuehrt. Umgerechnet wird nur
//  im Browser, beim Anzeigen.
// ============================================================

const SCORE_Z_CAP = 3;
const SCORE_MODES = [
  { key: 'z',    label: 'Z roh',     short: 'Z',
    title: 'Summe der Kategorie-Z-Scores ohne Transformation (bisheriges Verhalten)' },
  { key: 'zcap', label: 'Z ±3',      short: 'Z±3',
    title: `Kategorie-Z-Scores vor dem Summieren auf ±${SCORE_Z_CAP} gekappt, dämpft Spezialisten-Ausreißer (v.a. Blocks)` },
  { key: 'pctl', label: 'Perzentil', short: 'Pctl',
    title: 'Je Kategorie der Perzentil-Rang im Pool (0–100), gemittelt. Unempfindlich gegen Ausreißer' },
];
const SCORE_MODE_KEY = 'cof_score_mode_v1';
const SCORE_MODE_DEFAULT = 'zcap';

let _scoreMode = SCORE_MODE_DEFAULT;
try {
  const m = localStorage.getItem(SCORE_MODE_KEY);
  if (m && SCORE_MODES.some(x => x.key === m)) _scoreMode = m;
} catch (e) { /* Privatmodus */ }

const _scoreModeListeners = [];

function getScoreMode() { return _scoreMode; }
function scoreModeInfo(mode) { return SCORE_MODES.find(x => x.key === (mode || _scoreMode)) || SCORE_MODES[0]; }

// Seiten melden hier an, was bei einem Moduswechsel neu gezeichnet werden
// muss. Alle Listener laufen bei jedem Wechsel (Caches leeren), das
// Neuzeichnen selbst pruefen die Seiten ueber ihre eigene Sichtbarkeit.
function onScoreModeChange(fn) { _scoreModeListeners.push(fn); }

function setScoreMode(mode) {
  if (!SCORE_MODES.some(x => x.key === mode) || mode === _scoreMode) { scoreModeSyncControls(); return; }
  _scoreMode = mode;
  try { localStorage.setItem(SCORE_MODE_KEY, mode); } catch (e) { /* Privatmodus */ }
  scoreModeSyncControls();
  _scoreModeListeners.forEach(fn => { try { fn(mode); } catch (e) { console.error(e); } });
}

// Segment-Schalter; kann mehrfach auf der Seite stehen (je Unterseite einer),
// alle bleiben ueber scoreModeSyncControls() im selben Zustand.
function scoreModeControlHTML() {
  return `<div class="score-mode" role="group" aria-label="Bewertung">
    <span class="score-mode-label">Bewertung</span>
    <div class="score-mode-seg">${SCORE_MODES.map(m =>
      `<button type="button" data-score-mode="${m.key}" title="${m.title}" aria-pressed="${m.key === _scoreMode}"
        class="${m.key === _scoreMode ? 'active' : ''}" onclick="setScoreMode('${m.key}')">${m.label}</button>`).join('')}
    </div>
  </div>`;
}

function scoreModeMountAll() {
  document.querySelectorAll('[data-score-mode-host]').forEach(h => {
    if (!h.dataset.mounted) { h.innerHTML = scoreModeControlHTML(); h.dataset.mounted = '1'; }
  });
  scoreModeSyncControls();
}

function scoreModeSyncControls() {
  document.querySelectorAll('[data-score-mode]').forEach(b => {
    const on = b.dataset.scoreMode === _scoreMode;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

// Mittelrang-Perzentil (0-100) von v in einem aufsteigend sortierten Array.
function _scorePercentileOf(sortedAsc, v) {
  const n = sortedAsc.length;
  if (!n) return 50;
  if (n === 1) return 50;
  let lo = 0, hi = n;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (sortedAsc[mid] < v) lo = mid + 1; else hi = mid; }
  const firstGE = lo;
  lo = firstGE; hi = n;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (sortedAsc[mid] <= v) lo = mid + 1; else hi = mid; }
  const numEqual = lo - firstGE;
  return ((firstGE + 0.5 * numEqual) / n) * 100;
}

/**
 * Wandelt Kategorie-Z-Scores in einen Gesamtwert um.
 *
 * @param {Array<Object>} catZs  je Spieler ein Objekt { catKey: z } (Vorzeichen
 *                               bereits so, dass hoeher = besser, also TO invertiert)
 * @param {Array<string>} keys   die zu verwendenden Kategorie-Schluessel
 * @param {Object} [weights]     { catKey: Gewicht }, fehlend = 1
 * @param {Array<number>} [poolIdx] Indizes der Spieler, die die Perzentil-
 *                               Verteilung bilden (Default: alle)
 * @param {string} [mode]        Default: aktueller Modus
 * @returns {Array<{score:number, cats:Object}>} cats = je Kategorie der
 *          Wert, der in den Score einging (Z, gekappter Z oder Perzentil)
 */
function scoreFromCatZ(catZs, keys, weights, poolIdx, mode) {
  mode = mode || _scoreMode;
  const w = k => (weights && typeof weights[k] === 'number') ? weights[k] : 1;

  if (mode === 'pctl') {
    const idx = poolIdx && poolIdx.length ? poolIdx : catZs.map((_, i) => i);
    const sorted = {};
    keys.forEach(k => { sorted[k] = idx.map(i => catZs[i][k] || 0).sort((a, b) => a - b); });
    const wSum = keys.reduce((s, k) => s + w(k), 0) || 1;
    return catZs.map(z => {
      const cats = {};
      let s = 0;
      keys.forEach(k => { cats[k] = _scorePercentileOf(sorted[k], z[k] || 0); s += cats[k] * w(k); });
      return { score: s / wSum, cats };
    });
  }

  const cap = mode === 'zcap' ? SCORE_Z_CAP : Infinity;
  return catZs.map(z => {
    const cats = {};
    let s = 0;
    keys.forEach(k => {
      const v = Math.max(-cap, Math.min(cap, z[k] || 0));
      cats[k] = v; s += v * w(k);
    });
    return { score: s, cats };
  });
}

// Anzeige eines Gesamtwerts im jeweiligen Modus.
function scoreFormat(score, mode) {
  mode = mode || _scoreMode;
  if (!Number.isFinite(score)) return '–';
  if (mode === 'pctl') return score.toFixed(1);
  return (score >= 0 ? '+' : '') + score.toFixed(2);
}
// true, wenn der Wert "ueber dem Schnitt" liegt (fuer gruen/rot).
function scoreIsPositive(score, mode) {
  return (mode || _scoreMode) === 'pctl' ? score >= 50 : score >= 0;
}
// Spaltenkopf fuer den Gesamtwert.
function scoreColumnLabel(mode) {
  const m = mode || _scoreMode;
  return m === 'pctl' ? 'Ø Pctl' : (m === 'zcap' ? 'Z ±3' : 'Z-Score');
}

document.addEventListener('DOMContentLoaded', scoreModeMountAll);
