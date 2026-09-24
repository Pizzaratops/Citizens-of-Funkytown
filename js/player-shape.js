// ============================================================
//  CAT WEB (vormals "Player Shape Studio")
//  Uebernommen aus Taco Tuesday HQ am 2026-09-23. Einzige Aenderungen:
//  Liga-Bezeichnungen, Export-Dateiname und das Nachladen der
//  Saison-Statdateien erst beim Oeffnen der Seite (_psEnsureSeasonData),
//  statt ~3,4 MB bei jedem Seitenaufruf statisch mitzuladen.
// ============================================================
//  9-Cat-Perzentil-Radar fuer jeden Spieler, der aktuell in einem
//  Funkytown-Kader steht (Quelle: ROSTERS, von js/admin.js beim Start aus
//  data/rosters-live.js hydriert -- siehe js/fantasy-owner.js fuer
//  dieselbe Konvention). Die Perzentile selbst werden HIER berechnet,
//  nicht aus vorgerechneten Z-Scores uebernommen (LIVE_PROJECTIONS.z
//  ist vor Saisonstart noch 0, siehe Kommentar dort).
//
//  SAISON-AUSWAHL: PS_SEASONS listet, welche Saisons zur Auswahl
//  stehen. Pro Saison braucht es eine echte Pro-Spiel-Statzeile je
//  Spieler (pts/reb/ast/stl/blk/3pm/to/fg%/ft%) -- ein blosser
//  End-Rang (wie in data/season-rankings.js) reicht NICHT fuer einen
//  Kategorie-Radar. "current" kommt aus data/live-projections.js
//  (LIVE_PROJECTIONS, dict); alle anderen aus je einer per BBM-Player-
//  Rankings-.xls + scripts/convert-bbm-last-season.py erzeugten
//  data/last-season-stats-<saison>.js (Array). Aktuell vorhanden:
//  2025-26 bis 2003-04, LUECKE nur bei 2017-18 (noch nicht nachgereicht,
//  siehe PS_SEASONS fuer den jeweils aktuellen Stand).
//  Weitere Saison ergaenzen: PS_SEASONS um einen Eintrag erweitern +
//  PS_LAST_SEASON_ARRAYS um eine Zeile ergaenzen. Der Rest (Pool,
//  Perzentile, Radar, Compare) braucht KEINE Aenderung.
//
//  Pool je Saison = ALLE Spieler mit einer Statzeile in der jeweiligen
//  Saison-Datenquelle -- nicht nur die aktuell gerosterten. Gerosterte
//  Spieler (heutiger Kaderstand) werden zuerst per normalizeName()+
//  NAME_ALIASES gegen die Saisonzeile abgeglichen (dieselbe zentrale
//  Normalisierung wie ueberall sonst im Projekt) und behalten dabei
//  pos/team/teamId aus ROSTERS; alle uebrigen Saison-Spieler (Free
//  Agents, Rookies wie zB AJ Dybantsa) kommen direkt aus der Saison-
//  Datenquelle selbst dazu, mit teamId=null ("Free Agents"-Gruppe in
//  Team-Filter/optgroups). Fuer "current" liefert BEST_AVAILABLE_BOARD
//  (data/best-available-board.js) die pos/team-Metadaten, die
//  LIVE_PROJECTIONS selbst nicht hat (siehe _psCurrentMetaIndex).
//  Gerosterte Spieler ganz ohne Treffer in der Saison-Statdatei (Rookies
//  ohne Vorjahresstats o.ae.) fallen fuer DIESE Saison raus -- wird im
//  Footer transparent ausgewiesen statt sie stillschweigend mit
//  Perzentil 50 aufzufuellen.
//
//  MATCH-MODUS zeigt zwei Matches uebereinander: "Shape Match" (bestes
//  Profil im Pool der AKTUELL gewaehlten Saison, siehe _psBestMatch)
//  und darunter "Historic Match" (bestes Profil ueber ALLE ANDEREN
//  Saisonen hinweg, siehe _psBestHistoricMatch) -- inkl. Angabe, aus
//  welcher Saison das historische Match stammt. Beide mit eigenem
//  %-Score (100 - mittlerer Perzentil-Abstand ueber alle 9 Kategorien).
//  Kandidaten mit zu wenig Einsatzzeit/Spielen werden dabei ausgefiltert
//  (siehe PS_MATCH_MIN_MPG/PS_MATCH_MIN_GAMES/_psHasEnoughSample).
// ============================================================

const PS_CATS = [
  { k: 'PTS', label: 'PTS',      raw: 'pts',  invert: false },
  { k: '3PM', label: '3PM',      raw: 'tpm',  invert: false },
  { k: 'REB', label: 'REB',      raw: 'reb',  invert: false },
  { k: 'AST', label: 'AST',      raw: 'ast',  invert: false },
  { k: 'STL', label: 'STL',      raw: 'stl',  invert: false },
  { k: 'BLK', label: 'BLK',      raw: 'blk',  invert: false },
  { k: 'TOC', label: 'TO CTRL',  raw: 'tov',  invert: true  },
  { k: 'FGP', label: 'FG%',      raw: 'fgPct',invert: false },
  { k: 'FTP', label: 'FT%',      raw: 'ftPct',invert: false },
];

const PS_SEASONS = [
  { key: 'current', label: '2026/27 (Projection)' },
  { key: '2025-26', label: '2025/26 (Saison-Ist-Werte)' },
  { key: '2024-25', label: '2024/25 (Saison-Ist-Werte)' },
  { key: '2023-24', label: '2023/24 (Saison-Ist-Werte)' },
  { key: '2022-23', label: '2022/23 (Saison-Ist-Werte)' },
  { key: '2021-22', label: '2021/22 (Saison-Ist-Werte)' },
  { key: '2020-21', label: '2020/21 (Saison-Ist-Werte)' },
  { key: '2019-20', label: '2019/20 (Saison-Ist-Werte)' },
  { key: '2018-19', label: '2018/19 (Saison-Ist-Werte)' },
  // 2017/18 fehlt bewusst -- noch nicht nachgereicht (siehe Kommentar am
  // Dateikopf).
  { key: '2016-17', label: '2016/17 (Saison-Ist-Werte)' },
  { key: '2015-16', label: '2015/16 (Saison-Ist-Werte)' },
  { key: '2014-15', label: '2014/15 (Saison-Ist-Werte)' },
  { key: '2013-14', label: '2013/14 (Saison-Ist-Werte)' },
  { key: '2012-13', label: '2012/13 (Saison-Ist-Werte)' },
  { key: '2011-12', label: '2011/12 (Saison-Ist-Werte)' },
  { key: '2010-11', label: '2010/11 (Saison-Ist-Werte)' },
  { key: '2009-10', label: '2009/10 (Saison-Ist-Werte)' },
  { key: '2008-09', label: '2008/09 (Saison-Ist-Werte)' },
  { key: '2007-08', label: '2007/08 (Saison-Ist-Werte)' },
  { key: '2006-07', label: '2006/07 (Saison-Ist-Werte)' },
  { key: '2005-06', label: '2005/06 (Saison-Ist-Werte)' },
  { key: '2004-05', label: '2004/05 (Saison-Ist-Werte)' },
  { key: '2003-04', label: '2003/04 (Saison-Ist-Werte)' },
];

let _psSeasonIdxCache = {};
let _psPoolCache = {};
let _psState = { name: null, mode: 'solo', teamFilter: '', experienceFilter: 'all', search: '', season: 'current', compareA: null, compareB: null, samePositionOnly: false, compareSearchA: '', compareSearchB: '' };

// Positions-Overlap statt Exakt-Vergleich: Spieler mit mehreren eligiblen
// Positionen (zB "PG/SG/SF/PF") sollen mit JEDER ihrer Positionen als
// Treffer zaehlen, nicht nur bei exakt identischem Positions-String.
// Split auf "/" UND "," -- die Positions-Strings sind je nach Datenquelle
// unterschiedlich formatiert (zB best-available-board.js: "SF/PF/C",
// teams-rosters.js: "PF, SF") und "/" allein wuerde Letzteres als EINEN
// Positions-Token behandeln, der dann nie matcht.
function _psPosOverlap(posA, posB) {
  if (!posA || !posB) return false;
  const a = String(posA).split(/[/,]+/).map(s => s.trim()).filter(Boolean);
  const b = String(posB).split(/[/,]+/).map(s => s.trim()).filter(Boolean);
  return a.some(x => b.includes(x));
}

function _psNorm(name) {
  return (typeof normalizeName === 'function') ? normalizeName(name) : String(name || '').toLowerCase().trim();
}

// Generationen-Suffix ("Jr.", "Sr", "II", "III", "IV") am Namensende, oder
// null falls keins vorhanden. normalizeName() strippt diese Suffixe bewusst
// (siehe data/aliases.js, wegen ESPN-Formatierungsinkonsistenzen bei EINEM
// Spieler) -- bei Namensvettern ueber Generationen (z.B. "Jabari Smith Jr."
// heute vs. "Jabari Smith Sr" 2003/04) fuehrt genau das aber zu falschen
// Treffern in alten Saisons.
function _psSuffix(name) {
  const m = String(name || '').trim().match(/\b(Jr\.?|Sr\.?|IV|III|II)\.?$/i);
  return m ? m[1].replace(/\./g, '').toUpperCase() : null;
}

// Zwei Suffixe gelten als Generationen-Konflikt nur, wenn BEIDE Seiten
// explizit eins tragen und sie sich unterscheiden ("Jr" vs "Sr"). Ein
// EINSEITIG fehlendes Suffix ist KEIN Konflikt -- BBMs Exporte lassen bei
// aktuellen Spielern (Kelly Oubre Jr., Robert Williams III, ...) das
// Suffix haeufig einfach weg, das waere sonst faelschlich rausgefiltert
// worden (siehe Test 2026-09-21: 6 legitime Treffer in 2025/26 betroffen).
function _psSuffixConflict(nameA, nameB) {
  const a = _psSuffix(nameA), b = _psSuffix(nameB);
  return !!(a && b && a !== b);
}

// Manuelle Sperrliste fuer Namensvettern-Faelle, die _psSuffixConflict
// NICHT erwischt (einseitig fehlendes Suffix, siehe Kommentar oben) -- z.B.
// "Gary Payton II" (heute gerostert) vs. "Gary Payton" (Hall-of-Famer,
// spielte 2003/04 fuer LAL). Beide Seiten normalisiert + kleingeschrieben,
// Reihenfolge egal. Bei Bedarf weitere Faelle ergaenzen, sobald entdeckt.
const _PS_MATCH_BLOCKLIST = new Set([
  ['gary payton ii', 'gary payton'].sort().join('|'),
]);
function _psIsBlockedPair(nameA, nameB) {
  // Bewusst NUR trim+lowercase, NICHT _psNorm() -- die Sperrliste muss
  // gerade die per Suffix unterscheidbaren Rohnamen vergleichen, waehrend
  // normalizeName() genau diese Suffixe wieder entfernen wuerde.
  const key = [String(nameA || '').trim().toLowerCase(), String(nameB || '').trim().toLowerCase()].sort().join('|');
  return _PS_MATCH_BLOCKLIST.has(key);
}

// Rank-Perzentil ueber ein sortiertes Array (aufsteigend). Gleiche Werte
// teilen sich den mittleren Rang, statt dass Ties zufaellig auseinander-
// fallen (Standard-Vorgehen fuer Perzentile bei diskreten Datensaetzen).
function _psPercentileOf(sortedAsc, v) {
  const n = sortedAsc.length;
  if (n <= 1) return 100;
  let lo = 0, hi = n;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (sortedAsc[mid] < v) lo = mid + 1; else hi = mid; }
  const firstGE = lo;
  lo = 0; hi = n;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (sortedAsc[mid] <= v) lo = mid + 1; else hi = mid; }
  const firstGT = lo;
  const numLess = firstGE, numEqual = firstGT - firstGE;
  return ((numLess + 0.5 * numEqual) / n) * 100;
}

// Umkehrung von _psPercentileOf: zu einem Perzentil (0-100) den Rohwert an
// dieser Stelle in einem sortierten (aufsteigend) Array liefern, linear
// zwischen den beiden naechsten Stuetzstellen interpoliert. Fuer
// _psTranslateStats() (Epochen-Uebersetzung, siehe dort).
function _psValueAtPercentile(sortedAsc, pct) {
  const n = sortedAsc.length;
  if (!n) return null;
  if (n === 1) return sortedAsc[0];
  const idx = (Math.max(0, Math.min(100, pct)) / 100) * (n - 1);
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  if (lo === hi) return sortedAsc[lo];
  const frac = idx - lo;
  return sortedAsc[lo] + (sortedAsc[hi] - sortedAsc[lo]) * frac;
}

// Formatiert einen Rohwert fuer die Anzeige, passend zur Kategorie (Prozent
// vs. Pro-Spiel-Zahl, unterschiedliche Nachkommastellen je nach ueblicher
// Groessenordnung).
function _psFmtRawValue(catRawKey, v) {
  if (typeof v !== 'number' || isNaN(v)) return '–';
  if (catRawKey === 'fgPct' || catRawKey === 'ftPct') return v.toFixed(1) + '%';
  if (catRawKey === 'stl' || catRawKey === 'blk') return v.toFixed(2);
  return v.toFixed(1);
}
function _psFmtCat(cat, raw) {
  return raw ? _psFmtRawValue(cat.raw, raw[cat.raw]) : '–';
}

// "Was haetten Michael Curtys 2003/04-Werte in der 2026/27-Liga bedeutet?"
// Epochen-Uebersetzung, perzentil-erhaltend: der Rohwert eines Spielers wird
// zuerst in sein Perzentil INNERHALB der QUELL-Saison umgerechnet (ueber
// deren eigenes sortedByRaw, NICHT ueber r.pctl -- das ist bei inverted-
// Kategorien wie TOC bereits invertiert und wuerde die Rueckrechnung
// verfaelschen), und dieses Perzentil dann im ZIEL-Saison-Pool wieder in
// einen Rohwert zurueckuebersetzt. Das ist dieselbe Idee wie eine
// Z-Score-Uebersetzung, nur nicht-parametrisch (robust gegen Ausreisser,
// keine Normalverteilungsannahme noetig).
function _psTranslateStats(sourcePlayer, sourceSeasonKey, targetSeasonKey) {
  const sourcePool = _psBuildPool(sourceSeasonKey);
  const targetPool = _psBuildPool(targetSeasonKey);
  const out = {};
  PS_CATS.forEach(c => {
    const rawVal = sourcePlayer.raw[c.raw];
    const srcSorted = sourcePool.sortedByRaw && sourcePool.sortedByRaw[c.raw];
    const tgtSorted = targetPool.sortedByRaw && targetPool.sortedByRaw[c.raw];
    if (typeof rawVal !== 'number' || isNaN(rawVal) || !srcSorted || !srcSorted.length || !tgtSorted || !tgtSorted.length) {
      out[c.raw] = null;
      return;
    }
    const rawPctl = _psPercentileOf(srcSorted, rawVal);
    out[c.raw] = _psValueAtPercentile(tgtSorted, rawPctl);
  });
  return out;
}

// Saison-Key -> Getter, der das jeweilige LAST_SEASON_STATS_*-Array liefert
// (oder null, falls das Datenscript nicht geladen ist). MUSS als Funktion
// mit woertlichem Bezeichner geschrieben werden, kein String-Lookup wie
// window[varName]: ein top-level "const X = [...]" in einem <script>-Tag
// haengt NICHT an window (siehe Projekt-Learnings zu Script-Scope/vm-
// Sandbox) -- der typeof-Check gegen den woertlichen Namen ist der einzige
// sichere Weg. Neue Saison ergaenzen: hier eine Zeile + PS_SEASONS-Eintrag,
// KEINE Aenderung an _psSeasonRawIndex/_psBuildPool/Radar/Compare noetig.
const PS_LAST_SEASON_ARRAYS = {
  '2025-26': () => (typeof LAST_SEASON_STATS_2025_26 !== 'undefined' ? LAST_SEASON_STATS_2025_26 : null),
  '2024-25': () => (typeof LAST_SEASON_STATS_2024_25 !== 'undefined' ? LAST_SEASON_STATS_2024_25 : null),
  '2023-24': () => (typeof LAST_SEASON_STATS_2023_24 !== 'undefined' ? LAST_SEASON_STATS_2023_24 : null),
  '2022-23': () => (typeof LAST_SEASON_STATS_2022_23 !== 'undefined' ? LAST_SEASON_STATS_2022_23 : null),
  '2021-22': () => (typeof LAST_SEASON_STATS_2021_22 !== 'undefined' ? LAST_SEASON_STATS_2021_22 : null),
  '2020-21': () => (typeof LAST_SEASON_STATS_2020_21 !== 'undefined' ? LAST_SEASON_STATS_2020_21 : null),
  '2019-20': () => (typeof LAST_SEASON_STATS_2019_20 !== 'undefined' ? LAST_SEASON_STATS_2019_20 : null),
  '2018-19': () => (typeof LAST_SEASON_STATS_2018_19 !== 'undefined' ? LAST_SEASON_STATS_2018_19 : null),
  '2016-17': () => (typeof LAST_SEASON_STATS_2016_17 !== 'undefined' ? LAST_SEASON_STATS_2016_17 : null),
  '2015-16': () => (typeof LAST_SEASON_STATS_2015_16 !== 'undefined' ? LAST_SEASON_STATS_2015_16 : null),
  '2014-15': () => (typeof LAST_SEASON_STATS_2014_15 !== 'undefined' ? LAST_SEASON_STATS_2014_15 : null),
  '2013-14': () => (typeof LAST_SEASON_STATS_2013_14 !== 'undefined' ? LAST_SEASON_STATS_2013_14 : null),
  '2012-13': () => (typeof LAST_SEASON_STATS_2012_13 !== 'undefined' ? LAST_SEASON_STATS_2012_13 : null),
  '2011-12': () => (typeof LAST_SEASON_STATS_2011_12 !== 'undefined' ? LAST_SEASON_STATS_2011_12 : null),
  '2010-11': () => (typeof LAST_SEASON_STATS_2010_11 !== 'undefined' ? LAST_SEASON_STATS_2010_11 : null),
  '2009-10': () => (typeof LAST_SEASON_STATS_2009_10 !== 'undefined' ? LAST_SEASON_STATS_2009_10 : null),
  '2008-09': () => (typeof LAST_SEASON_STATS_2008_09 !== 'undefined' ? LAST_SEASON_STATS_2008_09 : null),
  '2007-08': () => (typeof LAST_SEASON_STATS_2007_08 !== 'undefined' ? LAST_SEASON_STATS_2007_08 : null),
  '2006-07': () => (typeof LAST_SEASON_STATS_2006_07 !== 'undefined' ? LAST_SEASON_STATS_2006_07 : null),
  '2005-06': () => (typeof LAST_SEASON_STATS_2005_06 !== 'undefined' ? LAST_SEASON_STATS_2005_06 : null),
  '2004-05': () => (typeof LAST_SEASON_STATS_2004_05 !== 'undefined' ? LAST_SEASON_STATS_2004_05 : null),
  '2003-04': () => (typeof LAST_SEASON_STATS_2003_04 !== 'undefined' ? LAST_SEASON_STATS_2003_04 : null),
};

// Liefert Map(normalizedName -> {pts,tpm,reb,ast,stl,blk,tov,fgPct,ftPct})
// fuer die gewaehlte Saison. Jede Saison hat ihre eigene Rohdaten-Form
// (Dict vs. Array, Feldname "to" vs. "tov") -- wird hier vereinheitlicht,
// damit der Rest des Moduls nur noch eine einzige Form kennen muss.
function _psSeasonRawIndex(seasonKey) {
  if (_psSeasonIdxCache[seasonKey]) return _psSeasonIdxCache[seasonKey];
  const map = new Map();

  if (seasonKey === 'current') {
    if (typeof LIVE_PROJECTIONS !== 'undefined') {
      const meta = _psCurrentMetaIndex();
      Object.keys(LIVE_PROJECTIONS).forEach(nm => {
        const s = LIVE_PROJECTIONS[nm];
        const m = meta.get(_psNorm(nm));
        map.set(_psNorm(nm), { name: nm, pts: s.pts, tpm: s.tpm, reb: s.reb, ast: s.ast, stl: s.stl, blk: s.blk, tov: s.tov, fgPct: s.fgPct, ftPct: s.ftPct, min: s.min, games: s.gamesPlayed, pos: m ? m.pos : null, nbaTeam: m ? m.nbaTeam : null, experience: m ? m.experience : null, rank: m ? m.rank : null });
      });
    }
  } else if (PS_LAST_SEASON_ARRAYS[seasonKey]) {
    const arr = PS_LAST_SEASON_ARRAYS[seasonKey]();
    if (arr) {
      // Rang innerhalb DIESER Saison ueber den vom Konverter mitgelieferten
      // Gesamt-Composite-Score (scripts/convert-bbm-last-season.py) -- nicht
      // ueber die hiesigen 9-Cat-Perzentile, die ja erst je nach Pool (nur
      // gerostert vs. volle Liga) entstehen. Objektreferenz statt Name als
      // Map-Key, falls zwei Zeilen zufaellig gleich heissen.
      //
      // Seit 24.09.2026 folgt der Rang dem Score-Modus (js/score-mode.js):
      // aus den mitgelieferten Kategorie-Z-Scores wird je nach Modus die
      // rohe Summe, die auf ±3 gekappte Summe oder der mittlere Perzentil-
      // Rang gebildet. Ohne zScores bleibt der BBM-Composite.
      const score = new Map();
      if (typeof scoreFromCatZ === 'function' && arr.length && arr.every(s => s.zScores)) {
        const res = scoreFromCatZ(arr.map(s => s.zScores), ['pts', 'reb', 'ast', 'stl', 'blk', 'tpm', 'fgImpact', 'ftImpact', 'to']);
        arr.forEach((s, i) => score.set(s, res[i].score));
      } else {
        arr.forEach(s => score.set(s, typeof s.composite === 'number' ? s.composite : -Infinity));
      }
      const ranked = arr.slice().sort((a, b) => score.get(b) - score.get(a));
      const rankOf = new Map();
      ranked.forEach((s, idx) => rankOf.set(s, idx + 1));
      arr.forEach(s => {
        map.set(_psNorm(s.name), { name: s.name, pts: s.pts, tpm: s.tpm, reb: s.reb, ast: s.ast, stl: s.stl, blk: s.blk, tov: s.to, fgPct: s.fgPct, ftPct: s.ftPct, min: s.min, games: s.games, pos: s.pos || null, nbaTeam: s.team || null, rank: rankOf.get(s) || null });
      });
    }
  }

  _psSeasonIdxCache[seasonKey] = map;
  return map;
}

// Positions-/Team-Metadaten fuer NICHT gerosterte Spieler der aktuellen
// Saison (Free Agents, Rookies) -- LIVE_PROJECTIONS liefert nur Stats,
// keine pos/team-Felder. BEST_AVAILABLE_BOARD (data/best-available-board.js,
// taeglich generiert) deckt de facto ALLE NBA-Spieler ab (auch gerosterte)
// und liefert genau diese Metadaten, siehe js/best-available.js fuer
// dieselbe Quelle.
//
// Der RANG selbst kommt NICHT von BEST_AVAILABLE_BOARD (das ist ein
// Best-Available-Composite), sondern von genau derselben Quelle wie die
// Seite "🔮 2026/27 Projections": data/projections-consensus.js + der
// dort in js/consensus-projections.js berechnete Z-Score-Gesamtrang
// (cpRecompute().overallRank), inkl. der vom Nutzer in localStorage
// gespeicherten Kategorie-Gewichte/Pool-Groesse -- so zeigt Cat Web
// exakt denselben Rang, den die Projections-Seite selbst anzeigt.
let _psCurrentMetaCache = null;
let _psProjRankMap = null;

function _psProjectionsRankMap() {
  if (_psProjRankMap) return _psProjRankMap;
  const m = new Map();
  if (typeof PROJECTIONS_CONSENSUS !== 'undefined' && typeof cpRecompute === 'function') {
    if (typeof cpLoadPrefs === 'function') cpLoadPrefs();
    const rows = (typeof cpGetComputed === 'function' && cpGetComputed()) || cpRecompute();
    if (rows) rows.forEach(r => { if (typeof r.overallRank === 'number') m.set(_psNorm(r.name), r.overallRank); });
  }
  _psProjRankMap = m;
  return m;
}

function _psCurrentMetaIndex() {
  if (_psCurrentMetaCache) return _psCurrentMetaCache;
  const m = new Map();
  const rankMap = _psProjectionsRankMap();
  if (typeof BEST_AVAILABLE_BOARD !== 'undefined') {
    BEST_AVAILABLE_BOARD.forEach(p => {
      const norm = _psNorm(p.name);
      const projRank = rankMap.get(norm);
      // Fallback auf BEST_AVAILABLE_BOARD.rank nur, wenn der Spieler in den
      // Consensus-Projections fehlt (z.B. sehr tiefe Free Agents) -- besser
      // irgendein Rang als gar keiner.
      m.set(norm, { pos: p.pos || null, nbaTeam: p.nbaTeam || null, experience: p.experience || null, rank: typeof projRank === 'number' ? projRank : (typeof p.rank === 'number' ? p.rank : null) });
    });
  }
  _psCurrentMetaCache = m;
  return m;
}

// Laedt data/projections-consensus.js nach (genau wie showPlayerProjections()
// es tut), falls noch nicht geschehen -- diese Datei ist bewusst NICHT
// statisch in index.html eingebunden (~2,4 MB), siehe Kommentar dort.
let _psProjectionsLoadStarted = false;
function _psEnsureProjectionsData(callback) {
  if (typeof PROJECTIONS_CONSENSUS !== 'undefined' || _psProjectionsLoadStarted) { callback(); return; }
  _psProjectionsLoadStarted = true;
  const load = (typeof _loadScriptOnce === 'function')
    ? _loadScriptOnce('data/projections-consensus.js?v=2')
    : new Promise(res => {
        const sc = document.createElement('script');
        sc.src = 'data/projections-consensus.js?v=2';
        sc.onload = res; sc.onerror = res;
        document.body.appendChild(sc);
      });
  load.then(() => {
    // Caches, die den (bisher rang-losen) Stand gespeichert haben, muessen
    // weg, damit der jetzt bekannte Projections-Rang tatsaechlich einfliesst.
    _psCurrentMetaCache = null;
    _psProjRankMap = null;
    delete _psSeasonIdxCache.current;
    _psPoolCache = {};
    callback();
  });
}

function _psBuildPool(seasonKey) {
  seasonKey = seasonKey || _psState.season || 'current';
  if (_psPoolCache[seasonKey]) return _psPoolCache[seasonKey];

  const pool = { players: [], rosteredCount: 0, matchedCount: 0, freeAgentCount: 0 };
  _psPoolCache[seasonKey] = pool;

  const seasonIdx = _psSeasonRawIndex(seasonKey);
  const rows = [];
  const usedNorms = new Set();

  // 1) Fantasy-gerosterte Spieler zuerst -- pos/team/teamId kommen aus
  // ROSTERS (kuratiert, heutiger Kaderstand), nicht aus den Saison-
  // Rohdaten selbst.
  if (typeof ROSTERS !== 'undefined') {
    Object.keys(ROSTERS).forEach(tid => {
      (ROSTERS[tid] || []).forEach(p => {
        pool.rosteredCount++;
        const norm = _psNorm(p.name);
        const canon = (typeof NAME_ALIASES !== 'undefined' && NAME_ALIASES[norm]) || null;
        const s = seasonIdx.get(norm) || (canon ? seasonIdx.get(_psNorm(canon)) : null);
        if (!s) return;
        // Generationen-Schutz: explizit widerspruechliche Jr/Sr/II-Suffixe
        // (_psSuffixConflict) oder ein bekannter einseitiger Namensvetter-
        // Fall (_PS_MATCH_BLOCKLIST) zwischen Roster-Namen und Saison-
        // Statzeile gelten NICHT als Match.
        if (_psSuffixConflict(p.name, s.name) || _psIsBlockedPair(p.name, s.name)) return;
        rows.push({
          name: p.name, pos: p.pos, nbaTeam: p.team, teamId: parseInt(tid, 10),
          min: s.min, games: s.games, experience: s.experience || null, rank: s.rank || null,
          raw: { pts: s.pts, tpm: s.tpm, reb: s.reb, ast: s.ast, stl: s.stl, blk: s.blk, tov: s.tov, fgPct: s.fgPct, ftPct: s.ftPct },
        });
        usedNorms.add(norm);
        if (canon) usedNorms.add(_psNorm(canon));
        usedNorms.add(_psNorm(s.name));
      });
    });
  }
  pool.matchedCount = rows.length;

  // 2) Alle uebrigen Spieler aus den Saison-Rohdaten -- Free Agents und
  // Rookies, die in KEINEM Fantasy-Kader stehen (zB AJ Dybantsa). Die
  // Saison-Statdatei selbst ist bereits die volle Liga (nicht auf ROSTERS
  // gefiltert), teamId bleibt null -> _psTeamTag()/_psOptionsHTML() zeigen
  // dafuer "Free Agents". Kein Generationen-Check noetig, da Name direkt
  // aus der Saisonzeile kommt (kein Alias-Umweg wie bei ROSTERS oben).
  seasonIdx.forEach((s, norm) => {
    if (usedNorms.has(norm)) return;
    rows.push({
      name: s.name, pos: s.pos || null, nbaTeam: s.nbaTeam || null, teamId: null,
      min: s.min, games: s.games, experience: s.experience || null, rank: s.rank || null,
      raw: { pts: s.pts, tpm: s.tpm, reb: s.reb, ast: s.ast, stl: s.stl, blk: s.blk, tov: s.tov, fgPct: s.fgPct, ftPct: s.ftPct },
    });
    pool.freeAgentCount++;
  });

  // Perzentile je Kategorie ueber den kompletten Matched-Pool DIESER Saison.
  // sortedByRaw wird am Pool-Objekt gespeichert (nicht nur lokal genutzt) --
  // _psTranslateStats() braucht spaeter genau diese sortierten Rohwert-
  // Arrays aus ZWEI verschiedenen Saison-Pools fuer die Epochen-Uebersetzung.
  const sortedByRaw = {};
  PS_CATS.forEach(c => {
    sortedByRaw[c.raw] = rows.map(r => r.raw[c.raw]).filter(v => typeof v === 'number' && !isNaN(v)).sort((a, b) => a - b);
  });
  rows.forEach(r => {
    r.pctl = {};
    PS_CATS.forEach(c => {
      const v = r.raw[c.raw];
      if (typeof v !== 'number' || isNaN(v)) { r.pctl[c.k] = 50; return; }
      const pctl = _psPercentileOf(sortedByRaw[c.raw], v);
      r.pctl[c.k] = c.invert ? (100 - pctl) : pctl;
    });
  });

  pool.sortedByRaw = sortedByRaw;
  pool.players = rows.sort((a, b) => a.name.localeCompare(b.name));
  return pool;
}

function _psPlayerByName(name, seasonKey) {
  if (!name) return null;
  return _psBuildPool(seasonKey).players.find(p => p.name === name) || null;
}

function _psVec(p) { return PS_CATS.map(c => p.pctl[c.k]); }

// Mindest-Stichprobe fuer Shape-/Historic-Match-KANDIDATEN. Ohne das
// landen zwei Tiefbank-Spieler mit kaum Einsatzzeit faelschlich als
// "91% Match" nebeneinander -- beide haben einfach in fast jeder
// Kategorie niedrige Perzentile (weil kaum Spielzeit = kaum Produktion),
// nicht weil sie stilistisch aehnlich sind (Bug gefunden 2026-09-21:
// Cam Whitmore [13,2 proj. min] <-> Larry Nance Jr. [11,7 proj. min],
// 91% trotz komplett unterschiedlicher Rollen/Positionen). games wird
// nur geprueft, wenn > 0 vorliegt (in der Preseason ist gamesPlayed=0
// fuer ALLE Spieler -- das darf nicht faelschlich alle rausfiltern).
const PS_MATCH_MIN_MPG = 15;
const PS_MATCH_MIN_GAMES = 20;
function _psHasEnoughSample(p) {
  if (typeof p.min === 'number' && p.min < PS_MATCH_MIN_MPG) return false;
  if (typeof p.games === 'number' && p.games > 0 && p.games < PS_MATCH_MIN_GAMES) return false;
  return true;
}

function _psBestWorst(p) {
  let best = PS_CATS[0], worst = PS_CATS[0];
  PS_CATS.forEach(c => {
    if (p.pctl[c.k] > p.pctl[best.k]) best = c;
    if (p.pctl[c.k] < p.pctl[worst.k]) worst = c;
  });
  return { best, worst };
}

// Bestes Profil-Match im Pool. Ein Match auf einem ANDEREN Fantasy-Team
// wird bevorzugt (fuer Trade-Ideen relevanter als der eigene Kader) --
// nur wenn dort niemand annaehernd passt, wird auch das eigene Team
// durchsucht.
function _psBestMatch(player, seasonKey, samePositionOnly) {
  const pool = _psBuildPool(seasonKey).players;
  const v1 = _psVec(player);
  function scoreOf(p2) {
    const v2 = _psVec(p2);
    let sum = 0;
    for (let i = 0; i < v1.length; i++) sum += Math.abs(v1[i] - v2[i]);
    return 100 - (sum / v1.length);
  }
  let bestOther = null, bestOtherScore = -1;
  let bestAny = null, bestAnyScore = -1;
  let sawPosCandidate = false;
  pool.forEach(p2 => {
    if (p2.name === player.name) return;
    if (!_psHasEnoughSample(p2)) return;
    if (samePositionOnly) {
      if (!_psPosOverlap(player.pos, p2.pos)) return;
      sawPosCandidate = true;
    }
    const score = scoreOf(p2);
    if (score > bestAnyScore) { bestAnyScore = score; bestAny = p2; }
    if (p2.teamId !== player.teamId && score > bestOtherScore) { bestOtherScore = score; bestOther = p2; }
  });
  // Failguard: kein Kandidat mit Positions-Overlap gefunden (zB sehr enge
  // Positionsangabe oder Datenluecke) -- lieber ein unrestricted Ergebnis
  // zeigen als gar keins.
  if (samePositionOnly && !sawPosCandidate) { const r = _psBestMatch(player, seasonKey, false); r.posFallback = true; return r; }
  return bestOther ? { player: bestOther, score: Math.round(bestOtherScore) } : { player: bestAny, score: Math.round(bestAnyScore) };
}

// "Historic Match": bestes Profil-Match aus JEDER ANDEREN Saison als der
// aktuell gewaehlten (durchsucht alle Saisonen in PS_SEASONS ausser
// excludeSeasonKey und nimmt das insgesamt beste Ergebnis ueber alle
// hinweg). Der Spieler selbst wird ausgeschlossen -- eine eigene
// Stat-Zeile aus einer frueheren Saison ist kein "Match", sondern er
// selbst. Nuetzlich, um z.B. zu sehen "profiliert wie XY in 2024/25".
function _psBestHistoricMatch(player, excludeSeasonKey, samePositionOnly) {
  const v1 = _psVec(player);
  let best = null, bestScore = -1, bestSeasonKey = null;
  let sawPosCandidate = false;
  PS_SEASONS.forEach(s => {
    if (s.key === excludeSeasonKey) return;
    _psBuildPool(s.key).players.forEach(p2 => {
      if (_psNorm(p2.name) === _psNorm(player.name)) return;
      if (!_psHasEnoughSample(p2)) return;
      if (samePositionOnly) {
        if (!_psPosOverlap(player.pos, p2.pos)) return;
        sawPosCandidate = true;
      }
      const v2 = _psVec(p2);
      let sum = 0;
      for (let i = 0; i < v1.length; i++) sum += Math.abs(v1[i] - v2[i]);
      const score = 100 - (sum / v1.length);
      if (score > bestScore) { bestScore = score; best = p2; bestSeasonKey = s.key; }
    });
  });
  // Failguard wie bei _psBestMatch: kein Positions-Kandidat gefunden -->
  // unrestricted nochmal versuchen statt "kein Match".
  if (samePositionOnly && !sawPosCandidate) {
    const r = _psBestHistoricMatch(player, excludeSeasonKey, false);
    if (r) r.posFallback = true;
    return r;
  }
  return best ? { player: best, score: Math.round(bestScore), seasonKey: bestSeasonKey } : null;
}

function _psSeasonLabel(key) {
  const s = PS_SEASONS.find(s => s.key === key);
  return s ? s.label : key;
}

// ── SVG-Radar ──────────────────────────────────────────────
// ViewBox ist bewusst breiter als hoch: die Seiten-Labels ("100. PCTL",
// "TO CTRL") ragen mit anchor start/end deutlich ueber den Ring hinaus,
// und ein root-<svg> clippt per Spec alles ausserhalb seiner viewBox.
// Zu schmale Breite hat genau das abgeschnitten (siehe Fix 2026-09-21).
const PS_VIEW_W = 460, PS_VIEW_H = 400, PS_CX = PS_VIEW_W / 2, PS_CY = PS_VIEW_H / 2, PS_R = 118;

function _psPoint(i, n, value) {
  const angle = -Math.PI / 2 + i * (2 * Math.PI / n);
  const r = PS_R * (Math.max(0, Math.min(100, value)) / 100);
  return [PS_CX + r * Math.cos(angle), PS_CY + r * Math.sin(angle)];
}
function _psLabelPoint(i, n, offset) {
  const angle = -Math.PI / 2 + i * (2 * Math.PI / n);
  return [PS_CX + offset * Math.cos(angle), PS_CY + offset * Math.sin(angle)];
}
function _psPolyStr(values, n) {
  return values.map((v, i) => { const p = _psPoint(i, n, v); return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
}
function _psRingPoly(n, frac) {
  const pts = [];
  for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i * (2 * Math.PI / n); pts.push((PS_CX + PS_R * frac * Math.cos(a)).toFixed(1) + ',' + (PS_CY + PS_R * frac * Math.sin(a)).toFixed(1)); }
  return pts.join(' ');
}

// seriesList: [{ vals: number[], color: '<css color/var>', fill: bool }, ...]
// Erste Serie mit fill:true bekommt den Gradient-Fuellton, alle weiteren
// werden als reine Konturlinie gezeichnet (sonst verdeckt eine gefuellte
// Flaeche die andere(n) im Vergleichs-Modus komplett).
function _psRadarSVG(seriesList, primaryRaw) {
  const n = PS_CATS.length;
  const rings = [0.25, 0.5, 0.75, 1].map(f => `<polygon points="${_psRingPoly(n, f)}" fill="none" stroke="var(--border)" stroke-width="1"></polygon>`).join('');
  const spokes = PS_CATS.map((c, i) => { const p = _psPoint(i, n, 100); return `<line x1="${PS_CX}" y1="${PS_CY}" x2="${p[0].toFixed(1)}" y2="${p[1].toFixed(1)}" stroke="var(--border)" stroke-width="1"></line>`; }).join('');

  const primaryVals = seriesList[0].vals;
  const labels = PS_CATS.map((c, i) => {
    const lp = _psLabelPoint(i, n, PS_R + 28);
    let anchor = 'middle';
    if (lp[0] > PS_CX + 6) anchor = 'start'; else if (lp[0] < PS_CX - 6) anchor = 'end';
    const rawStr = primaryRaw ? _psFmtCat(c, primaryRaw) : null;
    return `<text x="${lp[0].toFixed(1)}" y="${(lp[1] - 3).toFixed(1)}" text-anchor="${anchor}" class="ps-cat-label">${c.label}</text>` +
           `<text x="${lp[0].toFixed(1)}" y="${(lp[1] + 11).toFixed(1)}" text-anchor="${anchor}" class="ps-cat-pctl">${Math.round(primaryVals[i])}. PCTL${rawStr ? ' · ' + rawStr : ''}</text>`;
  }).join('');

  const gradId = 'psGrad' + Math.random().toString(36).slice(2, 8);
  let defs = '';
  const polys = seriesList.map((s, idx) => {
    const dots = s.vals.map((v, i) => { const p = _psPoint(i, n, v); return `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${idx === 0 ? 4 : 3.5}" fill="${s.color}"></circle>`; }).join('');
    if (idx === 0 && s.fill !== false) {
      defs = `<defs><radialGradient id="${gradId}" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stop-color="${s.color}" stop-opacity="0.5"></stop>
        <stop offset="100%" stop-color="${s.color}" stop-opacity="0.1"></stop>
      </radialGradient></defs>`;
      return `<polygon points="${_psPolyStr(s.vals, n)}" fill="url(#${gradId})" stroke="${s.color}" stroke-width="2.5"></polygon>${dots}`;
    }
    return `<polygon points="${_psPolyStr(s.vals, n)}" fill="none" stroke="${s.color}" stroke-width="2.5"></polygon>${dots}`;
  }).join('');

  return `<svg class="ps-radar" viewBox="0 0 ${PS_VIEW_W} ${PS_VIEW_H}" width="100%" role="img" aria-label="Perzentil-Radar">
    ${defs}
    ${rings}${spokes}${polys}${labels}
  </svg>`;
}

// ── Steuerung / Rendering ──────────────────────────────────
// Laedt die Saison-Statdateien (data/last-season-stats-*.js, zusammen
// ~3,4 MB) erst beim ersten Oeffnen von Cat Web, ueber _loadScriptOnce()
// aus js/player-rankings.js. 2025-26 mit exakt derselben URL wie der
// Matchup Planer, damit die Datei nicht doppelt geladen wird.
let _psSeasonDataState = 'unloaded'; // 'unloaded' | 'loading' | 'ready'
const _psSeasonDataWaiters = [];
function _psSeasonSrc(key) {
  return key === '2025-26' ? 'data/last-season-stats-2025-26.js?v=1' : `data/last-season-stats-${key}.js?v=1`;
}
function _psEnsureSeasonData(callback) {
  if (_psSeasonDataState === 'ready') { callback(); return; }
  _psSeasonDataWaiters.push(callback);
  if (_psSeasonDataState === 'loading') return;
  _psSeasonDataState = 'loading';
  const card = document.getElementById('psCard');
  if (card && !card.innerHTML.trim()) card.innerHTML = '<div style="padding:28px;text-align:center;color:var(--muted);font-size:13px;">Lade Saison-Stats…</div>';
  const srcs = Object.keys(PS_LAST_SEASON_ARRAYS).map(_psSeasonSrc);
  Promise.all(srcs.map(src => (typeof _loadScriptOnce === 'function' ? _loadScriptOnce(src) : Promise.resolve()))).then(() => {
    _psSeasonDataState = 'ready';
    _psSeasonIdxCache = {};
    _psPoolCache = {};
    _psSeasonDataWaiters.splice(0).forEach(fn => fn());
  });
}

// Score-Modus gewechselt: die Raenge (nicht die Perzentil-Radare, die sind
// ohnehin schon perzentil-basiert) haengen davon ab -> Caches leeren.
if (typeof onScoreModeChange === 'function') {
  onScoreModeChange(() => {
    _psSeasonIdxCache = {};
    _psPoolCache = {};
    _psCurrentMetaCache = null;
    _psProjRankMap = null;
    const page = document.getElementById('playerShapePage');
    if (page && page.classList.contains('active')) { _psFillControls(); _psRenderCard(); }
  });
}

function showPlayerShape() {
  navigate('playerShapePage');
  _psApplyControlsCollapseState();
  _psEnsureSeasonData(() => _psEnsureProjectionsData(() => {
    _psFillSeasonSelect();
    _psBuildPool(_psState.season);
    _psFillControls();
    _psRenderCard();
  }));
}

// Auswahl-Panel ein-/ausklappbar (gemerkt in localStorage, ueberlebt also
// einen Reload) -- rein kosmetisch, keine Auswirkung auf _psState/Pool.
function psToggleControls() {
  const panel = document.getElementById('psControlsPanel');
  if (!panel) return;
  const collapsed = panel.classList.toggle('ps-controls-collapsed');
  _psSetControlsToggleUI(collapsed);
  try { localStorage.setItem('psControlsCollapsed', collapsed ? '1' : '0'); } catch (e) {}
}

function _psSetControlsToggleUI(collapsed) {
  const btn = document.getElementById('psControlsToggle');
  const icon = document.getElementById('psControlsToggleIcon');
  const label = document.getElementById('psControlsToggleLabel');
  if (btn) btn.setAttribute('aria-expanded', String(!collapsed));
  if (icon) icon.textContent = collapsed ? '▸' : '▾';
  if (label) label.textContent = collapsed ? 'Auswahl anzeigen' : 'Auswahl ausblenden';
}

function _psApplyControlsCollapseState() {
  const panel = document.getElementById('psControlsPanel');
  if (!panel || panel.dataset.collapseInit) return;
  panel.dataset.collapseInit = '1';
  let collapsed = false;
  try { collapsed = localStorage.getItem('psControlsCollapsed') === '1'; } catch (e) {}
  if (collapsed) {
    panel.classList.add('ps-controls-collapsed');
    _psSetControlsToggleUI(true);
  }
}

function _psFillSeasonSelect() {
  const sel = document.getElementById('psSeasonSelect');
  if (!sel || sel.dataset.filled) return;
  sel.innerHTML = PS_SEASONS.map(s => `<option value="${s.key}">${s.label}</option>`).join('');
  sel.value = _psState.season;
  sel.dataset.filled = '1';
  sel.addEventListener('change', () => {
    _psState.season = sel.value;
    // Aktueller Spieler / Vergleichsspieler koennten in dieser Saison
    // keine Stats haben -- Auswahl unten wird beim Neubefuellen validiert.
    _psFillControls();
    _psRenderCard();
  });
}

function _psFillControls() {
  const pool = _psBuildPool(_psState.season);
  const teamSel = document.getElementById('psTeamFilter');
  const expSel = document.getElementById('psExperienceFilter');
  const searchInput = document.getElementById('psSearch');
  const playerSel = document.getElementById('psPlayerSelect');
  if (!teamSel || !playerSel) return;
  if (!teamSel.dataset.filled) {
    const teams = (typeof TEAMS !== 'undefined' ? TEAMS : []).slice().sort((a, b) => a.name.localeCompare(b.name));
    teamSel.innerHTML = '<option value="">Alle Teams</option>' +
      teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('') +
      '<option value="FA">Free Agents</option>';
    teamSel.dataset.filled = '1';
    teamSel.addEventListener('change', () => { _psState.teamFilter = teamSel.value; _psFillPlayerOptions(); _psRenderCard(); });
  }
  if (expSel && !expSel.dataset.filled) {
    expSel.innerHTML = '<option value="all">Alle Spieler</option><option value="rookie">Rookies</option><option value="sophomore">Sophomores</option>';
    expSel.dataset.filled = '1';
    expSel.addEventListener('change', () => { _psState.experienceFilter = expSel.value; _psFillPlayerOptions(); _psRenderCard(); });
  }
  if (searchInput && !searchInput.dataset.filled) {
    searchInput.dataset.filled = '1';
    searchInput.addEventListener('input', () => { _psState.search = searchInput.value.trim().toLowerCase(); _psFillPlayerOptions(); });
  }
  if (!playerSel.dataset.filled) {
    playerSel.dataset.filled = '1';
    playerSel.addEventListener('change', () => { _psState.name = playerSel.value; _psRenderCard(); });
  }
  _psFillPlayerOptions();

  const seasonLabel = (PS_SEASONS.find(s => s.key === _psState.season) || {}).label || _psState.season;
  document.getElementById('psPoolNote').textContent =
    `${pool.matchedCount} von ${pool.rosteredCount} gerosterten Spielern haben Stats für ${seasonLabel}` +
    (pool.freeAgentCount ? ` (+ ${pool.freeAgentCount} Free Agents/Rookies)` : '');
}

// "FA" ist der Sentinel-Wert im Team-Filter-<select> fuer "nur nicht
// gerosterte Spieler" (teamId === null) -- eine normale Team-ID kommt aus
// TEAMS[].id und ist immer eine Zahl, daher kein Kollisionsrisiko.
function _psMatchesTeamFilter(p, teamFilterVal) {
  if (!teamFilterVal) return true;
  if (teamFilterVal === 'FA') return p.teamId === null;
  return p.teamId === parseInt(teamFilterVal, 10);
}

// Kombiniert Team-/Erfahrungs-Filter + Freitext-Suche (Name/Team/Position),
// so wie sie ueber der SPIELER-Auswahl stehen. Gilt NUR fuer das Haupt-Select
// -- die zwei Vergleichs-Selects im Compare-Modus haben ihre eigene, separate
// Namens-Suche (siehe _psFilteredComparePool/psFilterCompare weiter unten;
// Team-/Erfahrungs-Filter bewusst NICHT uebernommen, da man im Vergleich oft
// gezielt einen Spieler aus einem ANDEREN Team sucht). p.experience kommt nur
// fuer "current" (BEST_AVAILABLE_BOARD)
// zuverlaessig -- in historischen Saisons ist es null, der Rookie/Sophomore-
// Filter liefert dort also bewusst leer statt falscher Treffer.
function _psPassesFilters(p) {
  if (!_psMatchesTeamFilter(p, _psState.teamFilter)) return false;
  if (_psState.experienceFilter && _psState.experienceFilter !== 'all' && p.experience !== _psState.experienceFilter) return false;
  if (_psState.search) {
    const hay = `${p.name} ${p.nbaTeam || ''} ${p.pos || ''}`.toLowerCase();
    if (!hay.includes(_psState.search)) return false;
  }
  return true;
}

// Baut die optgroup-Liste (nach Fantasy-Team gruppiert, Free Agents als
// eigene Gruppe ganz am Ende) fuer ein beliebiges <select> -- genutzt vom
// Haupt-Spieler-Select (bereits vorgefiltert, siehe _psFillPlayerOptions)
// UND von den zwei Vergleichs-Selects im Compare-Modus (siehe
// _psFilteredComparePool).
function _psOptionsHTML(players) {
  const teamMapLocal = (typeof teamMap !== 'undefined') ? teamMap : {};
  const byTeam = new Map();
  players.forEach(p => {
    const tName = p.teamId !== null && teamMapLocal[p.teamId] ? teamMapLocal[p.teamId].name : 'Free Agents';
    if (!byTeam.has(tName)) byTeam.set(tName, []);
    byTeam.get(tName).push(p);
  });
  const teamNames = [...byTeam.keys()].sort((a, b) => {
    if (a === 'Free Agents') return 1;
    if (b === 'Free Agents') return -1;
    return a.localeCompare(b);
  });
  return teamNames.map(tName =>
    `<optgroup label="${tName}">` +
    byTeam.get(tName).map(p => `<option value="${p.name.replace(/"/g, '&quot;')}">${p.name} (${p.nbaTeam || '–'} ${p.pos || '–'})</option>`).join('') +
    '</optgroup>'
  ).join('');
}

function _psFillPlayerOptions() {
  const playerSel = document.getElementById('psPlayerSelect');
  const pool = _psBuildPool(_psState.season).players;
  const filtered = pool.filter(_psPassesFilters);
  playerSel.innerHTML = _psOptionsHTML(filtered);
  if (!filtered.some(p => p.name === _psState.name)) {
    _psState.name = filtered.length ? filtered[0].name : null;
  }
  if (_psState.name) playerSel.value = _psState.name;
}

// Filtert den Pool fuer EIN Vergleichs-Select: Hauptspieler und den jeweils
// ANDEREN Compare-Slot immer raus (kann sonst zweimal denselben Spieler
// waehlen), plus optionale Freitext-Suche ueber Name/Team/Position -- exakt
// dieselbe Haystack-Logik wie _psPassesFilters oben, nur ohne Team-/
// Erfahrungs-Filter (siehe Kommentar dort).
function _psFilteredComparePool(pool, mainName, excludeName, query) {
  const q = (query || '').trim().toLowerCase();
  return pool.filter(x => {
    if (x.name === mainName || x.name === excludeName) return false;
    if (!q) return true;
    const hay = `${x.name} ${x.nbaTeam || ''} ${x.pos || ''}`.toLowerCase();
    return hay.includes(q);
  });
}

// Live-Filter fuer die Namens-Suche vor den zwei Vergleichs-Selects
// (22.09.2026, Nutzerwunsch). Baut bewusst NUR die Optionsliste des
// betroffenen <select> neu, statt ueber _psRenderCard() die ganze Karte neu
// zu rendern -- sonst wuerde das Suchfeld bei jedem Tastendruck neu erzeugt
// und Fokus/Cursor gingen verloren.
function psFilterCompare(slot, query) {
  if (slot === 'A') _psState.compareSearchA = query || '';
  else _psState.compareSearchB = query || '';
  const season = _psState.season;
  const mainPlayer = _psState.name ? _psPlayerByName(_psState.name, season) : null;
  const pool = _psBuildPool(season).players;
  const excludeName = slot === 'A' ? _psState.compareB : _psState.compareA;
  const filtered = _psFilteredComparePool(pool, mainPlayer ? mainPlayer.name : null, excludeName, query);
  const sel = document.getElementById(slot === 'A' ? 'psCompareSelectA' : 'psCompareSelectB');
  if (!sel) return;
  const current = slot === 'A' ? _psState.compareA : _psState.compareB;
  sel.innerHTML = '<option value="">— Vergleichsspieler wählen —</option>' + _psOptionsHTML(filtered);
  // Auswahl nur zuruecksetzen, wenn sie nach dem Filtern noch in der Liste
  // steht -- _psState.compareA/B bleibt unangetastet, das aendert sich erst
  // ueber psSetCompare (onchange), damit ein noch tippender Nutzer nicht
  // ploetzlich die Auswahl verliert.
  if (filtered.some(x => x.name === current)) sel.value = current;
}

function psSetMode(mode) {
  _psState.mode = mode;
  document.querySelectorAll('#psModeSeg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
  _psRenderCard();
}

// "Nur gleiche Position" fuer Shape Match / Historic Match. Ueberlapp statt
// Exakt-Vergleich (siehe _psPosOverlap) -- ein Spieler mit vier eligiblen
// Positionen (zB Amen Thompson: PG/SG/SF/PF) zaehlt bei JEDER davon als
// Treffer, sonst waere der Filter fuer Multi-Position-Spieler witzlos.
function psToggleSamePosition(checked) {
  _psState.samePositionOnly = !!checked;
  _psRenderCard();
}

// Wird von den zwei dynamisch in der Card gerenderten Compare-Selects
// aufgerufen (inline onchange, siehe _psRenderCard).
function psSetCompare(slot, value) {
  if (slot === 'A') _psState.compareA = value || null;
  else _psState.compareB = value || null;
  _psRenderCard();
}

function _psTeamTag(teamId) {
  if (teamId === null) return `<span class="ps-team-tag" style="border-color:var(--border);color:var(--text-dim,#888)">Free Agent</span>`;
  const t = (typeof teamMap !== 'undefined') ? teamMap[teamId] : null;
  if (!t) return '';
  const c = (typeof getTeamColor === 'function') ? getTeamColor(t) : 'var(--border)';
  return `<span class="ps-team-tag" style="border-color:${c};color:${c}">${t.name}</span>`;
}

// Gesamt-Rang IN DER SAISON, aus der die Statzeile stammt -- fuer "current"
// der Rang aus den 2026/27 Consensus-Projections (siehe _psCurrentMetaIndex), fuer historische Saisonen der Rang nach
// dem BBM-Composite-Score dieser Saison (siehe _psSeasonRawIndex). Leerer
// String, wenn kein Rang vorliegt (zB Rookie ganz ohne Board-Eintrag).
function _psRankTag(p, tooltip) {
  if (!(typeof p.rank === 'number' && p.rank > 0)) return '';
  const label = `Rang #${p.rank}`;
  if (!tooltip && typeof scoreModeInfo === 'function') tooltip = `Gesamtrang nach Bewertung „${scoreModeInfo().label}"`;
  if (tooltip) return ` &middot; <span class="ps-rank-tag" title="${String(tooltip).replace(/"/g, '&quot;')}">${label}</span>`;
  return ` &middot; ${label}`;
}

// Grobe Rang-Schaetzung, wenn ein Spielerprofil aus einer anderen Saison in
// die ZIEL-Saison uebersetzt wuerde: skaliert seine relative Liga-Position
// (Rang / Poolgroesse) in der QUELL-Saison auf die Poolgroesse der ZIEL-
// Saison. Konsistent mit der perzentil-erhaltenden Idee von
// _psTranslateStats(), aber KEINE echte Neuberechnung des Composite-Scores
// in der Zielsaison -- nur eine Naeherung ueber die relative Liga-Position.
function _psTranslateRank(sourcePlayer, sourceSeasonKey, targetSeasonKey) {
  if (typeof sourcePlayer.rank !== 'number' || sourcePlayer.rank <= 0) return null;
  const nSource = _psBuildPool(sourceSeasonKey).players.length;
  const nTarget = _psBuildPool(targetSeasonKey).players.length;
  if (!nSource || !nTarget) return null;
  const frac = (sourcePlayer.rank - 1) / nSource;
  return Math.max(1, Math.round(frac * nTarget) + 1);
}

// Screenshot-Button direkt an der Karte (22.09.2026, Nutzerwunsch) --
// zusaetzlich zum bestehenden #psExportBtn oben im (einklappbaren!)
// Auswahl-Panel. Beide rufen dieselbe psDownloadShape() auf, hier gibt es
// nur einen zweiten, immer sichtbaren Einstiegspunkt direkt an der Karte,
// die man ja tatsaechlich exportieren will -- gerade wenn man die Auswahl
// vorher ueber "Auswahl ausblenden" versteckt hat, war der Original-Button
// mit versteckt.
function _psCardExportBtnHTML() {
  return `<button type="button" class="ps-card-export-btn" id="psCardExportBtn" onclick="psDownloadShape()" title="Aktuelle Ansicht als Bild exportieren">📸 Exportieren</button>`;
}

function _psRenderCard() {
  const card = document.getElementById('psCard');
  if (!card) return;
  const season = _psState.season;
  const p = _psState.name ? _psPlayerByName(_psState.name, season) : null;
  if (!p) {
    card.innerHTML = '<p class="ps-empty">Keine Spieler mit Stats für diese Saison gefunden. Bitte prüfen, ob die passende Datenquelle geladen ist.</p>';
    return;
  }
  const bw = _psBestWorst(p);

  if (_psState.mode === 'solo') {
    const radar = _psRadarSVG([{ vals: _psVec(p), color: 'var(--accent)', fill: true }], p.raw);
    card.innerHTML = `
      <div class="ps-top">
        <div>
          <p class="ps-id-tag">${p.nbaTeam || '–'} &middot; ${p.pos || '–'}${_psRankTag(p)} &middot; <b>Solo Shape</b></p>
          <h2 class="ps-name">${p.name}</h2>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end;">
          ${_psTeamTag(p.teamId)}
          ${_psCardExportBtnHTML()}
        </div>
      </div>
      <div class="ps-body">
        <div class="ps-radar-box">${radar}</div>
        <div class="ps-side">
          <p class="ps-hero-label">Shape Read</p>
          <p class="ps-meta">Perzentil-Profil über ${PS_CATS.length} 9-Cat-Kategorien, relativ zu allen Spielern mit Stats für diese Saison.</p>
          <div class="ps-kv-list">
            <div class="ps-kv-row"><span class="ps-kv-k">Stärkste Kategorie</span><span class="ps-kv-v ps-good">${bw.best.label} · ${Math.round(p.pctl[bw.best.k])} PCTL · ${_psFmtCat(bw.best, p.raw)}</span></div>
            <div class="ps-kv-row"><span class="ps-kv-k">Schwächste Kategorie</span><span class="ps-kv-v ps-warn">${bw.worst.label} · ${Math.round(p.pctl[bw.worst.k])} PCTL · ${_psFmtCat(bw.worst, p.raw)}</span></div>
          </div>
        </div>
      </div>`;

  } else if (_psState.mode === 'match') {
    const match = _psBestMatch(p, season, _psState.samePositionOnly);
    const alt = match.player;
    const historic = _psBestHistoricMatch(p, season, _psState.samePositionOnly);
    const historicAlt = historic ? historic.player : null;
    // Epochen-uebersetzter Rang: was historicAlt's Rangposition (aus SEINER
    // Saison) im Kontext der aktuell gewaehlten Saison bedeuten wuerde,
    // siehe _psTranslateRank(). Nur sinnvoll, wenn die Saisonen tatsaechlich
    // unterschiedlich sind. Die zugehoerigen uebersetzten Rohwerte werden
    // nicht mehr angezeigt (Nutzerwunsch 2026-09-22: laesst sich aus dem
    // Radar/PCTL ohnehin ablesen) -- _psTranslateStats() bleibt fuer
    // moegliche spaetere Verwendung erhalten.
    const translatedRank = (historicAlt && historic.seasonKey !== season) ? _psTranslateRank(historicAlt, historic.seasonKey, season) : null;
    const radar = _psRadarSVG([
      { vals: _psVec(p), color: 'var(--accent)', fill: true },
      ...(alt ? [{ vals: _psVec(alt), color: 'var(--accent2)' }] : []),
      ...(historicAlt ? [{ vals: _psVec(historicAlt), color: 'var(--accent3)' }] : []),
    ], p.raw);
    card.innerHTML = `
      <div class="ps-top">
        <div>
          <p class="ps-id-tag">${p.nbaTeam || '–'} &middot; ${p.pos || '–'}${_psRankTag(p)} &middot; <b>Shape Match</b></p>
          <h2 class="ps-name">${p.name}</h2>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end;">
          ${_psTeamTag(p.teamId)}
          ${_psCardExportBtnHTML()}
        </div>
      </div>
      <div class="ps-body">
        <div class="ps-radar-box">${radar}
          <div class="ps-legend">
            <span><i style="background:var(--accent);"></i>${p.name}</span>
            ${alt ? `<span><i style="background:var(--accent2);"></i>${alt.name}</span>` : ''}
            ${historicAlt ? `<span><i style="background:var(--accent3);"></i>${historicAlt.name} (${_psSeasonLabel(historic.seasonKey)})</span>` : ''}
          </div>
        </div>
        <div class="ps-side">
          <div class="ps-match-block">
          ${alt ? `
          <p class="ps-hero"><span class="ps-num">${match.score}%</span><span class="ps-hero-label">Shape Match &middot; ${_psSeasonLabel(season)}${match.posFallback ? ' <span class="ps-rank-tag" title="Kein Spieler mit Positions-Overlap gefunden — zeigt stattdessen das beste Match über alle Positionen.">(alle Positionen)</span>' : ''}</span></p>
          <div>
            <p class="ps-alt-name">${alt.name}</p>
            <p class="ps-meta">${alt.nbaTeam || '–'} &middot; ${alt.pos || '–'}${_psRankTag(alt, alt.teamId === p.teamId
              ? 'Ähnlichstes Profil steht im selben Kader — für Trade-Ideen sonst nicht direkt nutzbar.'
              : 'Ähnlichstes 9-Cat-Profil im gesamten Liga-Pool, kann auch im selben Kader stehen — als Ausgangspunkt für Trade-Gespräche.')} ${_psTeamTag(alt.teamId)}</p>
          </div>
          ` : '<p class="ps-note">Kein weiterer Spieler mit Stats für diese Saison im Pool gefunden.</p>'}
          </div>
          <div class="ps-match-block">
          ${historicAlt ? `
          <p class="ps-hero ps-hero-secondary"><span class="ps-num">${historic.score}%</span><span class="ps-hero-label">Historic Match &middot; ${_psSeasonLabel(historic.seasonKey)}${historic.posFallback ? ' <span class="ps-rank-tag" title="Kein Spieler mit Positions-Overlap gefunden — zeigt stattdessen das beste Match über alle Positionen.">(alle Positionen)</span>' : ''}</span></p>
          <div>
            <p class="ps-alt-name">${historicAlt.name}</p>
            <p class="ps-meta">${historicAlt.nbaTeam || '–'} &middot; ${historicAlt.pos || '–'}${_psRankTag(historicAlt, `Bestes 9-Cat-Profil-Match aus einer anderen Saison (${_psSeasonLabel(historic.seasonKey)}) im gerosterten Pool.`)}${typeof translatedRank === 'number' ? ` &middot; <span class="ps-rank-tag" title="Geschätzter Rang, wenn dieses Profil (perzentil-erhaltend übersetzt, siehe _psTranslateStats) unverändert in ${_psSeasonLabel(season)} gespielt hätte.">${_psSeasonLabel(season)} Rang: ~#${translatedRank}</span>` : ''} ${_psTeamTag(historicAlt.teamId)}</p>
          </div>
          ` : '<p class="ps-note">Kein historisches Match in einer anderen Saison gefunden.</p>'}
          </div>
          <div class="ps-kv-list">
            <div class="ps-kv-row"><span class="ps-kv-k">Stärke ${p.name.split(' ')[0]}</span><span class="ps-kv-v ps-good">${bw.best.label} · ${Math.round(p.pctl[bw.best.k])} PCTL · ${_psFmtCat(bw.best, p.raw)}</span></div>
            <div class="ps-kv-row"><span class="ps-kv-k">Schwäche ${p.name.split(' ')[0]}</span><span class="ps-kv-v ps-warn">${bw.worst.label} · ${Math.round(p.pctl[bw.worst.k])} PCTL · ${_psFmtCat(bw.worst, p.raw)}</span></div>
          </div>
        </div>
      </div>`;

  } else {
    // Vergleichs-Modus: Hauptspieler + bis zu 2 manuell gewaehlte Spieler.
    const pool = _psBuildPool(season).players;
    if (!_psState.compareA && !_psState.compareB) {
      const others = pool.filter(x => x.name !== p.name);
      _psState.compareA = others[0] ? others[0].name : null;
      _psState.compareB = others[1] ? others[1].name : null;
    }
    const pA = _psState.compareA ? _psPlayerByName(_psState.compareA, season) : null;
    const pB = _psState.compareB ? _psPlayerByName(_psState.compareB, season) : null;

    const series = [{ vals: _psVec(p), color: 'var(--accent)', fill: true }];
    if (pA) series.push({ vals: _psVec(pA), color: 'var(--accent2)' });
    if (pB) series.push({ vals: _psVec(pB), color: 'var(--accent3)' });
    const radar = _psRadarSVG(series, p.raw);

    const optsFor = (excludeName, searchStr) => _psOptionsHTML(_psFilteredComparePool(pool, p.name, excludeName, searchStr));
    const escAttr = (s) => String(s || '').replace(/"/g, '&quot;');

    card.innerHTML = `
      <div class="ps-top">
        <div>
          <p class="ps-id-tag">${p.nbaTeam || '–'} &middot; ${p.pos || '–'}${_psRankTag(p)} &middot; <b>Vergleich</b></p>
          <h2 class="ps-name">${p.name}</h2>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end;">
          ${_psTeamTag(p.teamId)}
          ${_psCardExportBtnHTML()}
        </div>
      </div>

      <div class="ps-compare-picks">
        <div class="ps-compare-row">
          <span class="ps-compare-swatch" style="background:var(--accent2);"></span>
          <div class="ps-compare-field">
            <input type="text" class="ps-compare-search" id="psCompareSearchA" placeholder="Name, Team, Position…" autocomplete="off" aria-label="Vergleichsspieler 1 suchen" value="${escAttr(_psState.compareSearchA)}" oninput="psFilterCompare('A', this.value)"/>
            <select id="psCompareSelectA" onchange="psSetCompare('A', this.value)" aria-label="Vergleichsspieler 1">
              <option value="">— Vergleichsspieler wählen —</option>
              ${optsFor(_psState.compareB, _psState.compareSearchA)}
            </select>
          </div>
        </div>
        <div class="ps-compare-row">
          <span class="ps-compare-swatch" style="background:var(--accent3);"></span>
          <div class="ps-compare-field">
            <input type="text" class="ps-compare-search" id="psCompareSearchB" placeholder="Name, Team, Position…" autocomplete="off" aria-label="Vergleichsspieler 2 suchen" value="${escAttr(_psState.compareSearchB)}" oninput="psFilterCompare('B', this.value)"/>
            <select id="psCompareSelectB" onchange="psSetCompare('B', this.value)" aria-label="Vergleichsspieler 2">
              <option value="">— Vergleichsspieler wählen —</option>
              ${optsFor(_psState.compareA, _psState.compareSearchB)}
            </select>
          </div>
        </div>
      </div>

      <div class="ps-body">
        <div class="ps-radar-box">${radar}
          <div class="ps-legend">
            <span><i style="background:var(--accent);"></i>${p.name}</span>
            ${pA ? `<span><i style="background:var(--accent2);"></i>${pA.name}</span>` : ''}
            ${pB ? `<span><i style="background:var(--accent3);"></i>${pB.name}</span>` : ''}
          </div>
        </div>
        <div class="ps-side">
          <p class="ps-hero-label">Direktvergleich</p>
          <p class="ps-meta">Perzentile aller ausgewählten Spieler relativ zum selben Saison-Pool — direkt vergleichbar, unabhängig vom Fantasy-Team.</p>
          <div class="ps-kv-list">
            <div class="ps-kv-row"><span class="ps-kv-k">${p.name}: Stärke</span><span class="ps-kv-v ps-good">${bw.best.label} · ${Math.round(p.pctl[bw.best.k])} PCTL · ${_psFmtCat(bw.best, p.raw)}</span></div>
            ${pA ? `<div class="ps-kv-row"><span class="ps-kv-k">${pA.name}: Stärke</span><span class="ps-kv-v ps-good">${_psBestWorst(pA).best.label} · ${Math.round(pA.pctl[_psBestWorst(pA).best.k])} PCTL · ${_psFmtCat(_psBestWorst(pA).best, pA.raw)}</span></div>` : ''}
            ${pB ? `<div class="ps-kv-row"><span class="ps-kv-k">${pB.name}: Stärke</span><span class="ps-kv-v ps-good">${_psBestWorst(pB).best.label} · ${Math.round(pB.pctl[_psBestWorst(pB).best.k])} PCTL · ${_psFmtCat(_psBestWorst(pB).best, pB.raw)}</span></div>` : ''}
          </div>
        </div>
      </div>`;

    // Selects auf den aktuell gespeicherten Zustand setzen (innerHTML-Neubau
    // verliert sonst die Auswahl beim Re-Render durch andere Aktionen).
    const selects = card.querySelectorAll('.ps-compare-row select');
    if (selects[0]) selects[0].value = _psState.compareA || '';
    if (selects[1]) selects[1].value = _psState.compareB || '';
  }
}

async function psDownloadShape() {
  const card = document.getElementById('psCard');
  if (!card) return;
  if (typeof html2canvas !== 'function') { alert('html2canvas Library nicht geladen.'); return; }
  // 22.09.2026: es gibt jetzt zwei Buttons, die hierher fuehren (der urspr.
  // #psExportBtn oben im einklappbaren Auswahl-Panel, und #psCardExportBtn
  // direkt an der Karte, siehe _psCardExportBtnHTML) -- beide gleich
  // behandeln, unabhaengig davon, welcher geklickt wurde. Beide sind
  // BUTTON-Elemente und werden ueber ignoreElements() unten ohnehin nicht
  // mitfotografiert.
  const btns = ['psExportBtn', 'psCardExportBtn'].map(id => document.getElementById(id)).filter(Boolean);
  const origTexts = btns.map(b => b.textContent);
  btns.forEach(b => { b.textContent = '⏳ Erstelle...'; b.disabled = true; });
  try {
    const isLight = document.body.classList.contains('light');
    const canvas = await html2canvas(card, {
      backgroundColor: isLight ? '#fff5ee' : '#0f1117',
      scale: 2,
      logging: false,
      useCORS: true,
      ignoreElements: (el) => el.tagName === 'BUTTON',
    });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    const stamp = new Date().toISOString().split('T')[0];
    const slug = (_psState.name || 'player').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    link.download = `funkytown-catweb-${slug}-${stamp}.png`;
    link.click();
    btns.forEach(b => { b.textContent = '✓ Gespeichert!'; });
    setTimeout(() => { btns.forEach((b, i) => { b.textContent = origTexts[i]; b.disabled = false; }); }, 1500);
  } catch (err) {
    console.error('Cat Web Screenshot failed:', err);
    alert('Fehler beim Erstellen: ' + err.message);
    btns.forEach((b, i) => { b.textContent = origTexts[i]; b.disabled = false; });
  }
}
