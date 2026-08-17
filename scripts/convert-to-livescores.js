#!/usr/bin/env node
// ============================================================
//  CSV + Meta-JSON  →  data/livescores-daily.js
// ============================================================
//  Liest die von daily-9cat.js erzeugte Tages-CSV (und die dazu-
//  gehörige .meta.json mit Games-Zeile + Liga-Durchschnitt) und
//  merged sie in data/livescores-daily.js unter
//  LIVESCORES_DAILY[league][datum].
//
//  Bestehende Einträge (andere Ligen/Daten) bleiben erhalten —
//  es wird nur der eine Tag/Liga-Schlüssel überschrieben/ergänzt.
//
//  Usage:
//    node scripts/convert-to-livescores.js
//      → heutiges Datum, Liga nba-summer-las-vegas
//    node scripts/convert-to-livescores.js --date=2026-07-14 --league=nba
//    node scripts/convert-to-livescores.js --dir=scripts/data --out=data/livescores-daily.js
//    node scripts/convert-to-livescores.js --keep-days=60
//      → wirft Tage älter als 60 Tage (ab --date) aus der Ausgabedatei
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { CATEGORIES, mean, stdDev } = require('./aggregate-core');

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const found = args.find(a => a.startsWith(`--${name}=`));
  return found ? found.split('=').slice(1).join('=') : fallback;
};

const dateStr = arg('date', new Date().toISOString().slice(0, 10));
const LEAGUE = arg('league', 'nba-summer-las-vegas');
const DIR = arg('dir', path.join(__dirname, 'data'));
const OUT = arg('out', path.join(__dirname, '..', 'data', 'livescores-daily.js'));
const keepDaysArg = arg('keep-days', null);

// ------------------------------------------------------------
// Minimaler CSV-Parser (identisch zu aggregate-9cat.js)
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
const num = (v) => (v === undefined || v === '' ? 0 : Number(v) || 0);

// ------------------------------------------------------------
// Rekonstruiert die Pro-Kategorie-Z-Scores aus den bereits in der
// CSV vorhandenen Rohwerten (PTS/REB/AST/STL/BLK/TO/3PM/FGImpact/
// FTImpact) — daily-9cat.js berechnet diese Z-Scores intern schon,
// schreibt sie aber nur als Summe (Composite) in die CSV. Für die
// Punt-Gewichtung auf der Live-Scores-Seite brauchen wir sie einzeln.
// Rechnet über denselben Spieler-Pool (alle Zeilen der Tages-CSV),
// den daily-9cat.js für die ursprüngliche Berechnung benutzt hat —
// das Ergebnis ist identisch zur ursprünglichen Composite-Summe.
// ------------------------------------------------------------
function attachZScores(players) {
  const stats = {};
  for (const cat of CATEGORIES) {
    const values = players.map(p => p[cat.key]);
    const m = mean(values);
    const sd = stdDev(values, m);
    stats[cat.key] = { mean: m, sd };
  }
  for (const p of players) {
    p.zScores = {};
    let sum = 0;
    for (const cat of CATEGORIES) {
      const { mean: m, sd } = stats[cat.key];
      let z = sd > 0 ? (p[cat.key] - m) / sd : 0;
      if (cat.invert) z = -z;
      z = Math.round(z * 1000) / 1000;
      p.zScores[cat.key] = z;
      sum += z;
    }
    p._zSum = sum;
  }
}

// ------------------------------------------------------------
// 1) CSV + Meta für den angefragten Tag laden
// ------------------------------------------------------------
const csvPath = path.join(DIR, `daily-9cat_${LEAGUE}_${dateStr}.csv`);
const metaPath = path.join(DIR, `daily-9cat_${LEAGUE}_${dateStr}.meta.json`);

if (!fs.existsSync(csvPath)) {
  console.log(`Keine CSV gefunden (${csvPath}) — vermutlich keine Spiele am ${dateStr}. Überspringe, livescores-daily.js bleibt unverändert.`);
  process.exit(0);
}

const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
// Spalten werden per Name gelesen (nicht per Position) — robust gegenüber
// zusätzlichen/fehlenden Spalten in daily-9cat.js (z.B. FGM/FGA/FTM/FTA).
// fgImpact/ftImpact werden nur für die Z-Score-Rekonstruktion gebraucht,
// nicht Teil des finalen Player-Outputs (dort stehen fgPct/ftPct in %).
const rawPlayers = rows.map(row => ({
  rank: Math.round(num(row.Rank)),
  name: row.Name,
  team: row.Team,
  min: Math.round(num(row.MIN)),
  pts: Math.round(num(row.PTS)),
  reb: Math.round(num(row.REB)),
  ast: Math.round(num(row.AST)),
  stl: Math.round(num(row.STL)),
  blk: Math.round(num(row.BLK)),
  to: Math.round(num(row.TO)),
  tpm: Math.round(num(row['3PM'])),
  fgImpact: num(row.FGImpact),
  ftImpact: num(row.FTImpact),
  fgPct: num(row['FG%']),
  ftPct: num(row['FT%']),
  composite: num(row.Composite),
}));

attachZScores(rawPlayers);

// Sanity-Check: Summe der rekonstruierten Z-Scores sollte (bis auf
// Rundung) der ursprünglich gespeicherten Composite-Spalte entsprechen.
const mismatches = rawPlayers.filter(p => Math.abs(p._zSum - p.composite) > 0.05);
if (mismatches.length) {
  console.warn(`Achtung: ${mismatches.length} Spieler mit Composite-Abweichung > 0.05 nach Z-Score-Rekonstruktion (z.B. ${mismatches[0].name}: ${mismatches[0]._zSum.toFixed(2)} vs. ${mismatches[0].composite}). Läuft meist auf abweichende Rundung hinaus, kein Blocker.`);
}

const players = rawPlayers.map(p => ({
  rank: p.rank, name: p.name, team: p.team, min: p.min,
  pts: p.pts, reb: p.reb, ast: p.ast, stl: p.stl, blk: p.blk, to: p.to, tpm: p.tpm,
  fgPct: p.fgPct, ftPct: p.ftPct, composite: p.composite, zScores: p.zScores,
}));

let meta = { games: [], leagueAvg: { fg: 0, ft: 0 } };
if (fs.existsSync(metaPath)) {
  meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
} else {
  console.warn(`Keine Meta-Datei gefunden (${metaPath}) — Spiele-Zeile & Liga-Ø bleiben leer für diesen Tag.`);
}

const dayEntry = {
  games: meta.games || [],
  leagueAvg: { fg: num(meta.leagueAvg?.fg), ft: num(meta.leagueAvg?.ft) },
  players,
};

// ------------------------------------------------------------
// 2) Bestehende livescores-daily.js laden (falls vorhanden)
// ------------------------------------------------------------
let existing = {};
if (fs.existsSync(OUT)) {
  const code = fs.readFileSync(OUT, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  try {
    vm.runInContext(`${code}\nthis.__RESULT__ = typeof LIVESCORES_DAILY !== "undefined" ? LIVESCORES_DAILY : {};`, sandbox);
    existing = sandbox.__RESULT__ || {};
  } catch (err) {
    console.error(`Konnte bestehende ${OUT} nicht parsen (${err.message}) — sie wird komplett neu geschrieben.`);
    existing = {};
  }
}

existing[LEAGUE] = existing[LEAGUE] || {};
existing[LEAGUE][dateStr] = dayEntry;

// ------------------------------------------------------------
// 3) Optional: alte Tage rauswerfen, damit die Datei nicht unbegrenzt wächst
// ------------------------------------------------------------
if (keepDaysArg) {
  const keepDays = parseInt(keepDaysArg, 10);
  const [y, m, d] = dateStr.split('-').map(Number);
  const cutoff = new Date(Date.UTC(y, m - 1, d));
  cutoff.setUTCDate(cutoff.getUTCDate() - keepDays);
  for (const lg of Object.keys(existing)) {
    for (const d of Object.keys(existing[lg])) {
      const [dy, dm, dd] = d.split('-').map(Number);
      if (new Date(Date.UTC(dy, dm - 1, dd)) < cutoff) delete existing[lg][d];
    }
  }
}

// ------------------------------------------------------------
// 4) Zurück in JS serialisieren
// ------------------------------------------------------------
function fmtPlayer(p) {
  const z = p.zScores || {};
  const zStr = CATEGORIES.map(c => `${c.key}: ${z[c.key] ?? 0}`).join(', ');
  return `{ rank: ${p.rank}, name: ${JSON.stringify(p.name)}, team: ${JSON.stringify(p.team)}, min: ${p.min}, pts: ${p.pts}, reb: ${p.reb}, ast: ${p.ast}, stl: ${p.stl}, blk: ${p.blk}, to: ${p.to}, tpm: ${p.tpm}, fgPct: ${p.fgPct}, ftPct: ${p.ftPct}, composite: ${p.composite}, zScores: { ${zStr} } }`;
}

function fmtDay(day) {
  const players = (day.players || []).map(p => '        ' + fmtPlayer(p)).join(',\n');
  return `{
      games: ${JSON.stringify(day.games || [])},
      leagueAvg: { fg: ${num(day.leagueAvg?.fg)}, ft: ${num(day.leagueAvg?.ft)} },
      players: [
${players}
      ]
    }`;
}

const leagueBlocks = Object.keys(existing).sort().map(lg => {
  const dates = Object.keys(existing[lg]).sort();
  const dayBlocks = dates.map(d => `    ${JSON.stringify(d)}: ${fmtDay(existing[lg][d])}`).join(',\n');
  return `  ${JSON.stringify(lg)}: {\n${dayBlocks}\n  }`;
}).join(',\n');

const header = `// ============================================================
//  LIVE SCORES — Daily 9cat Z-Score Data
// ============================================================
//  AUTO-GENERIERT von scripts/convert-to-livescores.js über die
//  "Daily 9cat Live Scores" GitHub Action. Nicht von Hand editieren
//  — Änderungen werden beim nächsten Lauf überschrieben.
//
//  Shape:
//  LIVESCORES_DAILY[league][date] = {
//    games: [ "Team A 88 @ Team B 91 (Final)", ... ],
//    leagueAvg: { fg: 47.3, ft: 76.1 },
//    players: [
//      { rank, name, team, min, pts, reb, ast, stl, blk, to, tpm,
//        fgPct, ftPct, composite,
//        zScores: { pts, reb, ast, stl, blk, tpm, fgImpact, ftImpact, to } },
//      ...
//    ]
//  }
//
//  zScores sind die ungewichteten Pro-Kategorie-Z-Scores (composite ist
//  ihre einfache Summe) — Basis für die Punt-Gewichtung im Frontend
//  (js/livescores.js), die composite mit benutzerdefinierten Gewichten
//  neu berechnet, ohne dass hier serverseitig etwas gespeichert wird.
//
//  date format: "YYYY-MM-DD"
//  league keys match the ESPN league slugs used in daily-9cat.js:
//    "nba-summer-las-vegas" | "nba-preseason" | "nba"
// ============================================================

const LIVESCORES_DAILY = {
${leagueBlocks}
};
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, header, 'utf8');
console.log(`${OUT} aktualisiert: ${LEAGUE} / ${dateStr} (${players.length} Spieler, ${dayEntry.games.length} Spiel(e)).`);
