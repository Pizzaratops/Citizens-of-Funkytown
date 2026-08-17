#!/usr/bin/env node
// ============================================================
//  Daily 9cat Z-Score Ranking (Basketball-Monster-Style)
//  Reine Logik, Konsolen-Output + CSV-Export. Node 18+ (natives fetch).
//
//  Usage:
//    node daily-9cat.js               → heutiges Datum
//    node daily-9cat.js 2026-04-12    → bestimmtes Datum
//    node daily-9cat.js 2026-04-12 -v → verbose (alle Kategorien + Z-Scores)
//    node daily-9cat.js --league=nba  → reguläre Saison statt Summer League
//
//  Speichert zusätzlich eine CSV im selben Ordner wie das Script:
//    daily-9cat_<liga>_<datum>.csv
// ============================================================

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const verbose = args.includes('-v') || args.includes('--verbose');
const dateArg = args.find(a => /^\d{4}-\d{2}-\d{2}$/.test(a));

// ESPN führt Summer League unter eigenen League-Slugs, getrennt von der reguären
// Saison ('nba'). Verifizierte Slugs (Stand Juli 2026, via ESPN-Boxscore-URLs):
//   nba-summer-california   -> California Classic (San Francisco/Sacramento, 3.–6. Juli)
//   nba-summer-utah         -> Salt Lake City Summer League (4.–7. Juli)
//   nba-summer-las-vegas    -> NBA Summer League Las Vegas (Hauptevent, 9.–19. Juli)
// Per Flag wählbar: --league=nba-summer-las-vegas (Default) oder --league=nba (reguläre Saison)
const leagueArg = args.find(a => a.startsWith('--league='));
const LEAGUE = leagueArg ? leagueArg.split('=')[1] : 'nba-summer-las-vegas';

// Wo CSV + Meta-JSON landen. Default: scripts/data/ (das ist der Ordner, den
// aggregate-9cat.js und convert-to-livescores.js ebenfalls per Default lesen,
// und der von der GitHub Action committet wird — so bleibt die Tages-Historie
// im Repo erhalten, die aggregate-9cat.js später für Weekly/Monthly braucht).
const dirArg = args.find(a => a.startsWith('--dir='));
const OUT_DIR = dirArg ? dirArg.split('=')[1] : path.join(__dirname, 'data');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function todayYYYYMMDD() {
  // WICHTIG: Nicht das UTC-Kalenderdatum nehmen. ESPN datiert NBA-Spiele
  // (Preseason wie reguläre Saison) nach US-Ostküstenzeit, und unsere
  // GitHub-Action-Läufe passieren früh morgens UTC (z.B. 04:07/06:07 UTC) —
  // das ist in Eastern Time noch der VORABEND. Mit UTC-Kalenderdatum würde
  // deshalb systematisch "morgen" abgefragt, Spiele die in Eastern Time
  // noch gar nicht stattgefunden haben.
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  return fmt.format(new Date()); // en-CA liefert direkt YYYY-MM-DD
}

function toEspnDate(dateStr) {
  // "2026-04-12" -> "20260412"
  return dateStr.replaceAll('-', '');
}

const dateStr = dateArg || todayYYYYMMDD();
const espnDate = toEspnDate(dateStr);

const SCOREBOARD_URL = `https://site.api.espn.com/apis/site/v2/sports/basketball/${LEAGUE}/scoreboard?dates=${espnDate}`;
const SUMMARY_URL = eventId => `https://site.api.espn.com/apis/site/v2/sports/basketball/${LEAGUE}/summary?event=${eventId}`;

// 9cat Kategorien, in der Reihenfolge wie sie im Composite gewichtet werden.
// 'invert: true' bedeutet: niedriger ist besser (Turnovers).
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

// ------------------------------------------------------------
// 1) Spiele des Tages holen
// ------------------------------------------------------------
async function fetchGames(dateStr) {
  const res = await fetch(SCOREBOARD_URL);
  if (!res.ok) throw new Error(`Scoreboard fetch fehlgeschlagen: HTTP ${res.status}`);
  const data = await res.json();
  const events = data.events || [];
  return events
    .filter(e => e.status?.type?.completed) // nur abgeschlossene Spiele für stabile Baseline
    .map(e => {
      const competitors = e.competitions?.[0]?.competitors || [];
      const home = competitors.find(c => c.homeAway === 'home');
      const away = competitors.find(c => c.homeAway === 'away');
      const statusText = e.status?.type?.shortDetail || e.status?.type?.description || 'Final';
      const teamLabel = c => c?.team?.displayName || c?.team?.name || c?.team?.shortDisplayName || c?.team?.abbreviation || '???';
      // Für die Games-Zeile in der UI, z.B. "Memphis Grizzlies 84 @ Portland Trail Blazers 91 (Final)"
      const line = (home && away)
        ? `${teamLabel(away)} ${away.score ?? '?'} @ ${teamLabel(home)} ${home.score ?? '?'} (${statusText})`
        : (e.shortName || e.name);
      return { id: e.id, name: e.shortName || e.name, line };
    });
}

// ------------------------------------------------------------
// 2) Boxscore eines Spiels parsen
// ------------------------------------------------------------
function parseMadeAttempt(str) {
  // "8-15" -> { made: 8, att: 15 }
  if (!str || typeof str !== 'string' || !str.includes('-')) return { made: 0, att: 0 };
  const [made, att] = str.split('-').map(Number);
  return { made: made || 0, att: att || 0 };
}

function parseMinutes(str) {
  const n = parseInt(str, 10);
  return Number.isFinite(n) ? n : 0;
}

async function fetchGamePlayers(gameId) {
  const res = await fetch(SUMMARY_URL(gameId));
  if (!res.ok) {
    console.warn(`  ! Boxscore fehlgeschlagen für Spiel ${gameId}: HTTP ${res.status}`);
    return [];
  }
  const data = await res.json();
  const teams = data.boxscore?.players || [];
  const players = [];

  for (const team of teams) {
    const teamAbbr = team.team?.abbreviation || '???';
    for (const statGroup of team.statistics || []) {
      const labels = statGroup.labels || statGroup.names || [];
      const idx = name => labels.indexOf(name);

      const iMin = idx('MIN');
      const iFG = idx('FG');
      const i3PT = idx('3PT');
      const iFT = idx('FT');
      const iREB = idx('REB');
      const iAST = idx('AST');
      const iSTL = idx('STL');
      const iBLK = idx('BLK');
      const iTO = idx('TO');
      const iPTS = idx('PTS');

      for (const athlete of statGroup.athletes || []) {
        const stats = athlete.stats || [];
        if (!stats.length || stats[0] === 'DNP' || stats.join('') === '') continue;

        const min = parseMinutes(stats[iMin]);
        if (!min) continue; // DNP / 0 Minuten raus

        const fg = parseMadeAttempt(stats[iFG]);
        const tpt = parseMadeAttempt(stats[i3PT]);
        const ft = parseMadeAttempt(stats[iFT]);

        players.push({
          name: athlete.athlete?.displayName || 'Unknown',
          team: teamAbbr,
          min,
          pts: Number(stats[iPTS]) || 0,
          reb: Number(stats[iREB]) || 0,
          ast: Number(stats[iAST]) || 0,
          stl: Number(stats[iSTL]) || 0,
          blk: Number(stats[iBLK]) || 0,
          to: Number(stats[iTO]) || 0,
          tpm: tpt.made,
          fgm: fg.made,
          fga: fg.att,
          ftm: ft.made,
          fta: ft.att,
        });
      }
    }
  }
  return players;
}

// ------------------------------------------------------------
// 3) FG%/FT% Impact (Volumen-gewichtet ggü. Liga-Durchschnitt des Tages)
// ------------------------------------------------------------
function attachImpactStats(players) {
  const totalFGM = players.reduce((s, p) => s + p.fgm, 0);
  const totalFGA = players.reduce((s, p) => s + p.fga, 0);
  const totalFTM = players.reduce((s, p) => s + p.ftm, 0);
  const totalFTA = players.reduce((s, p) => s + p.fta, 0);

  const leagueFGpct = totalFGA > 0 ? totalFGM / totalFGA : 0;
  const leagueFTpct = totalFTA > 0 ? totalFTM / totalFTA : 0;

  for (const p of players) {
    const playerFGpct = p.fga > 0 ? p.fgm / p.fga : 0;
    const playerFTpct = p.fta > 0 ? p.ftm / p.fta : 0;
    p.fgImpact = p.fga > 0 ? (playerFGpct - leagueFGpct) * p.fga : 0;
    p.ftImpact = p.fta > 0 ? (playerFTpct - leagueFTpct) * p.fta : 0;
  }

  return { leagueFGpct, leagueFTpct };
}

// ------------------------------------------------------------
// 4) Z-Scores über den Tages-Pool
// ------------------------------------------------------------
function mean(arr) {
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}
function stdDev(arr, m) {
  const variance = arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

function computeZScores(players) {
  const stats = {};
  for (const cat of CATEGORIES) {
    const values = players.map(p => p[cat.key]);
    const m = mean(values);
    const sd = stdDev(values, m);
    stats[cat.key] = { mean: m, sd };
  }

  for (const p of players) {
    let composite = 0;
    p.zScores = {};
    for (const cat of CATEGORIES) {
      const { mean: m, sd } = stats[cat.key];
      let z = sd > 0 ? (p[cat.key] - m) / sd : 0;
      if (cat.invert) z = -z;
      p.zScores[cat.key] = z;
      composite += z;
    }
    p.composite = composite;
  }

  return stats;
}

// ------------------------------------------------------------
// 5) Main
// ------------------------------------------------------------
async function main() {
  console.log(`\n=== Daily 9cat Ranking — ${dateStr} (Liga: ${LEAGUE}) ===\n`);

  console.log('Lade Spielplan...');
  const games = await fetchGames(dateStr);
  if (!games.length) {
    console.log('Keine abgeschlossenen Spiele für dieses Datum gefunden.');
    return;
  }
  console.log(`${games.length} Spiel(e) gefunden: ${games.map(g => g.name).join(', ')}\n`);

  console.log('Lade Boxscores...');
  let allPlayers = [];
  for (const game of games) {
    const players = await fetchGamePlayers(game.id);
    allPlayers = allPlayers.concat(players);
  }
  console.log(`${allPlayers.length} Spieler mit Einsatzzeit gefunden.\n`);

  if (!allPlayers.length) {
    console.log('Keine Spielerdaten — Abbruch.');
    return;
  }

  const { leagueFGpct, leagueFTpct } = attachImpactStats(allPlayers);
  console.log(`Liga-Tages-Durchschnitt: FG% ${(leagueFGpct * 100).toFixed(1)}%  FT% ${(leagueFTpct * 100).toFixed(1)}%\n`);

  computeZScores(allPlayers);
  allPlayers.sort((a, b) => b.composite - a.composite);

  // Zeilen für Konsole (kompakt) und CSV (immer alle Kategorien inkl. Z-Scores) getrennt aufbauen
  const consoleRows = allPlayers.map((p, i) => ({
    Rank: i + 1,
    Name: p.name,
    Team: p.team,
    MIN: p.min,
    PTS: p.pts,
    REB: p.reb,
    AST: p.ast,
    STL: p.stl,
    BLK: p.blk,
    TO: p.to,
    '3PM': p.tpm,
    'FG%': p.fga > 0 ? ((p.fgm / p.fga) * 100).toFixed(1) : '-',
    'FT%': p.fta > 0 ? ((p.ftm / p.fta) * 100).toFixed(1) : '-',
    Composite: p.composite.toFixed(2),
  }));

  if (verbose) {
    const rows = allPlayers.map((p, i) => {
      const row = { Rank: i + 1, Name: p.name, Team: p.team, MIN: p.min, Composite: p.composite.toFixed(2) };
      for (const cat of CATEGORIES) {
        row[cat.label + 'z'] = p.zScores[cat.key].toFixed(2);
      }
      return row;
    });
    console.table(rows);
  } else {
    console.table(consoleRows);
  }

  // ------------------------------------------------------------
  // CSV-Export — landet im selben Ordner wie dieses Script
  // ------------------------------------------------------------
  const csvHeader = [
    'Rank', 'Name', 'Team', 'MIN', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'TO', '3PM',
    'FGM', 'FGA', 'FTM', 'FTA', 'FG%', 'FT%', 'FGImpact', 'FTImpact', 'Composite',
  ];
  const csvLines = [csvHeader.join(',')];
  allPlayers.forEach((p, i) => {
    const line = [
      i + 1,
      `"${p.name.replace(/"/g, '""')}"`,
      p.team,
      p.min,
      p.pts,
      p.reb,
      p.ast,
      p.stl,
      p.blk,
      p.to,
      p.tpm,
      p.fgm,
      p.fga,
      p.ftm,
      p.fta,
      p.fga > 0 ? ((p.fgm / p.fga) * 100).toFixed(1) : '',
      p.fta > 0 ? ((p.ftm / p.fta) * 100).toFixed(1) : '',
      p.fgImpact.toFixed(2),
      p.ftImpact.toFixed(2),
      p.composite.toFixed(2),
    ];
    csvLines.push(line.join(','));
  });

  const fileName = `daily-9cat_${LEAGUE}_${dateStr}.csv`;
  const filePath = path.join(OUT_DIR, fileName);
  fs.writeFileSync(filePath, csvLines.join('\n'), 'utf8');
  console.log(`\nCSV gespeichert: ${filePath}\n`);

  // ------------------------------------------------------------
  // Meta-JSON — Games-Zeile & Liga-Durchschnitt, die die CSV selbst nicht
  // enthält. convert-to-livescores.js liest beide Dateien zusammen.
  // ------------------------------------------------------------
  const metaFileName = `daily-9cat_${LEAGUE}_${dateStr}.meta.json`;
  const metaPath = path.join(OUT_DIR, metaFileName);
  const meta = {
    league: LEAGUE,
    date: dateStr,
    games: games.map(g => g.line),
    leagueAvg: {
      fg: Number((leagueFGpct * 100).toFixed(1)),
      ft: Number((leagueFTpct * 100).toFixed(1)),
    },
  };
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');
  console.log(`Meta gespeichert: ${metaPath}\n`);
}

main().catch(err => {
  console.error('Fehler:', err.message);
  process.exit(1);
});
