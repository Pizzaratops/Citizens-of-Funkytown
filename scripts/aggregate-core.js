// ============================================================
//  Geteilte Aggregations-Logik (Woche / Monat)
// ============================================================
//  Extrahiert aus aggregate-9cat.js, damit sowohl das manuelle
//  CLI-Tool (Konsole + CSV) als auch der Live-Scores-Converter
//  (data/livescores-aggregate.js) exakt dieselbe Z-Score-Mathe
//  benutzen und nicht auseinanderlaufen können.
// ============================================================

const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  { key: 'pts', label: 'PTS' },
  { key: 'reb', label: 'REB' },
  { key: 'ast', label: 'AST' },
  { key: 'stl', label: 'STL' },
  { key: 'blk', label: 'BLK' },
  { key: 'tpm', label: '3PM' },
  { key: 'fgImpact', label: 'FG%' },
  { key: 'ftImpact', label: 'FT%' },
  { key: 'to', label: 'TO', invert: true },
];

// Ligen der Off-Season (Summer League + Pre-Season) — hier reicht bereits
// EIN Spiel, um in Weekly/Monthly aufzutauchen, da viele Spieler in diesem
// kurzen Format nur einmal auflaufen. Reguläre Saison ("nba") behält die
// normalen Schwellen (week=2, month=4, siehe DEFAULT_MIN_GAMES unten).
const OFFSEASON_LEAGUES = [
  'nba-summer-california',
  'nba-summer-utah',
  'nba-summer-las-vegas',
  'nba-preseason',
];

const FIELD_MAP = {
  pts: 'ptsPg', reb: 'rebPg', ast: 'astPg', stl: 'stlPg', blk: 'blkPg',
  tpm: 'tpmPg', to: 'toPg', fgImpact: 'fgImpact', ftImpact: 'ftImpact',
};

function toDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
function toDateStr(d) {
  return d.toISOString().slice(0, 10);
}

// ------------------------------------------------------------
// Minimaler CSV-Parser (behandelt gequotete Felder mit "" als Escape)
// ------------------------------------------------------------
function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(l => l.length > 0);
  const header = splitCsvLine(lines[0]);
  return lines.slice(1).map(line => {
    const fields = splitCsvLine(line);
    const row = {};
    header.forEach((h, i) => { row[h] = fields[i]; });
    return row;
  });
}
function splitCsvLine(line) {
  const fields = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { cur += c; }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { fields.push(cur); cur = ''; }
      else cur += c;
    }
  }
  fields.push(cur);
  return fields;
}

function mean(arr) { return arr.reduce((s, v) => s + v, 0) / arr.length; }
function stdDev(arr, m) {
  const variance = arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

/**
 * Berechnet das aggregierte 9cat-Ranking für ein Zeitfenster.
 *
 * @param {Object} opts
 * @param {string} opts.league    ESPN League-Slug (z.B. "nba-summer-las-vegas")
 * @param {string} opts.period    "week" | "month"
 * @param {string} opts.endDate   "YYYY-MM-DD" — Stichtag, Fenster endet hier
 * @param {string} opts.dir       Ordner mit den Tages-CSVs
 * @param {number} [opts.minGames] Mindestanzahl Spiele (Default: week=2, month=4)
 * @returns {Object} Discriminated result:
 *   { status: 'no-files', windowStart, windowEnd }
 *   { status: 'no-eligible', windowStart, windowEnd, allPlayersCount, minGames }
 *   { status: 'ok', windowStart, windowEnd, windowDays, filesInWindow, allPlayers,
 *     eligible, leagueFGpct, leagueFTpct, minGames }
 */
function computeAggregate({ league, period, endDate, dir, minGames }) {
  const WINDOW_DAYS = period === 'month' ? 30 : 7;
  const DEFAULT_MIN_GAMES = period === 'month' ? 4 : 2;

  const end = toDate(endDate);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (WINDOW_DAYS - 1));

  const filePattern = new RegExp(`^daily-9cat_${league}_(\\d{4}-\\d{2}-\\d{2})\\.csv$`);
  const filesInWindow = fs.readdirSync(dir)
    .map(f => {
      const m = f.match(filePattern);
      if (!m) return null;
      const fileDate = toDate(m[1]);
      if (fileDate < start || fileDate > end) return null;
      return { file: f, date: m[1] };
    })
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!filesInWindow.length) {
    return { status: 'no-files', windowStart: start, windowEnd: end };
  }

  // MIN_GAMES darf nie höher sein, als die im Fenster tatsächlich verfügbaren
  // Spieltage es zulassen — sonst bleibt "month" für kurze Formate wie Summer
  // League (Teams spielen dort insgesamt nur 3-4 Partien) für immer leer.
  // Regel: höchstens die Hälfte der verfügbaren Tage (aufgerundet), gedeckelt
  // durch den regulären Default, minimal aber immer 1.
  // Beispiel Las Vegas Summer League (6 Tages-CSVs im Fenster): month → 3 statt 4.
  // Reguläre Saison (30 Tages-CSVs im Fenster): month → weiterhin 4 (unverändert).
  //
  // Off-Season-Ligen (siehe OFFSEASON_LEAGUES) bekommen zusätzlich einen festen
  // MIN_GAMES von 1 — dort spielen viele Spieler insgesamt nur ein einziges
  // Spiel, und sollen trotzdem in Weekly/Monthly auftauchen.
  const dynamicCap = Math.max(1, Math.ceil(filesInWindow.length / 2));
  const effectiveDefault = OFFSEASON_LEAGUES.includes(league) ? 1 : DEFAULT_MIN_GAMES;
  const MIN_GAMES = minGames != null ? minGames : Math.min(effectiveDefault, dynamicCap);

  const players = new Map(); // key: name -> aggregate object
  for (const { file, date } of filesInWindow) {
    const text = fs.readFileSync(path.join(dir, file), 'utf8');
    const rows = parseCsv(text);
    for (const row of rows) {
      const name = row.Name;
      if (!players.has(name)) {
        players.set(name, {
          name,
          team: row.Team,
          games: 0,
          min: 0, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, to: 0, tpm: 0,
          fgm: 0, fga: 0, ftm: 0, fta: 0,
        });
      }
      const p = players.get(name);
      p.team = row.Team; // letztbekanntes Team
      p.games += 1;
      p.min += Number(row.MIN) || 0;
      p.pts += Number(row.PTS) || 0;
      p.reb += Number(row.REB) || 0;
      p.ast += Number(row.AST) || 0;
      p.stl += Number(row.STL) || 0;
      p.blk += Number(row.BLK) || 0;
      p.to += Number(row.TO) || 0;
      p.tpm += Number(row['3PM']) || 0;
      p.fgm += Number(row.FGM) || 0;
      p.fga += Number(row.FGA) || 0;
      p.ftm += Number(row.FTM) || 0;
      p.fta += Number(row.FTA) || 0;
    }
  }

  const allPlayers = Array.from(players.values());
  const eligible = allPlayers.filter(p => p.games >= MIN_GAMES);

  if (!eligible.length) {
    return { status: 'no-eligible', windowStart: start, windowEnd: end, allPlayersCount: allPlayers.length, minGames: MIN_GAMES };
  }

  for (const p of eligible) {
    p.ptsPg = p.pts / p.games;
    p.rebPg = p.reb / p.games;
    p.astPg = p.ast / p.games;
    p.stlPg = p.stl / p.games;
    p.blkPg = p.blk / p.games;
    p.toPg = p.to / p.games;
    p.tpmPg = p.tpm / p.games;
  }

  const totalFGM = eligible.reduce((s, p) => s + p.fgm, 0);
  const totalFGA = eligible.reduce((s, p) => s + p.fga, 0);
  const totalFTM = eligible.reduce((s, p) => s + p.ftm, 0);
  const totalFTA = eligible.reduce((s, p) => s + p.fta, 0);
  const leagueFGpct = totalFGA > 0 ? totalFGM / totalFGA : 0;
  const leagueFTpct = totalFTA > 0 ? totalFTM / totalFTA : 0;

  for (const p of eligible) {
    const playerFGpct = p.fga > 0 ? p.fgm / p.fga : 0;
    const playerFTpct = p.fta > 0 ? p.ftm / p.fta : 0;
    p.fgImpact = p.fga > 0 ? (playerFGpct - leagueFGpct) * (p.fga / p.games) : 0;
    p.ftImpact = p.fta > 0 ? (playerFTpct - leagueFTpct) * (p.fta / p.games) : 0;
  }

  const stats = {};
  for (const cat of CATEGORIES) {
    const field = FIELD_MAP[cat.key];
    const values = eligible.map(p => p[field]);
    const m = mean(values);
    const sd = stdDev(values, m);
    stats[cat.key] = { mean: m, sd };
  }

  for (const p of eligible) {
    let composite = 0;
    p.zScores = {};
    for (const cat of CATEGORIES) {
      const field = FIELD_MAP[cat.key];
      const { mean: m, sd } = stats[cat.key];
      let z = sd > 0 ? (p[field] - m) / sd : 0;
      if (cat.invert) z = -z;
      p.zScores[cat.key] = z;
      composite += z;
    }
    p.composite = composite;
  }

  eligible.sort((a, b) => b.composite - a.composite);

  return {
    status: 'ok',
    windowStart: start,
    windowEnd: end,
    windowDays: WINDOW_DAYS,
    filesInWindow,
    allPlayers,
    eligible,
    leagueFGpct,
    leagueFTpct,
    minGames: MIN_GAMES,
  };
}

module.exports = {
  CATEGORIES, FIELD_MAP, OFFSEASON_LEAGUES,
  toDate, toDateStr,
  parseCsv, splitCsvLine,
  mean, stdDev,
  computeAggregate,
};
