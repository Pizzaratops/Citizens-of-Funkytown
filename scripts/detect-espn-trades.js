#!/usr/bin/env node
// ============================================================
//  ESPN TRADE DETECTION (automatisiert, serverseitig)
// ============================================================
//  Node-Äquivalent von _detectAndSaveEspnTrades() aus
//  js/espn-trade-detect.js. Lief bisher NUR im Browser und schrieb
//  nur in den localStorage des jeweiligen Geräts -- ein Trade wurde
//  also nur erkannt, wenn EIN UND DASSELBE Geraet einmal vor und
//  einmal nach dem Trade synct hat, und selbst dann nur lokal
//  sichtbar bis zum manuellen Export+Commit.
//
//  Dieses Script laeuft stattdessen als Teil des taeglichen
//  GitHub-Actions-Workflows und schreibt erkannte Trades direkt in
//  data/trade-history.js -- fuer alle sofort sichtbar, ohne
//  Handgriff. Der "Fuer Repo exportieren"-Button in der App bleibt
//  als manueller Fallback bestehen (z.B. fuer Trades ausserhalb der
//  ESPN-Saison oder falls dieses Script mal ausfaellt).
//
//  Ablauf:
//    1. ALTEN Rosterstand aus data/rosters-live.js lesen (der Stand
//       VOR dem heutigen Sync -- muss also VOR dem Ueberschreiben
//       durch sync-espn-rosters.js aufgerufen werden).
//    2. NEUEN Rosterstand von genau derselben ESPN-Antwort nehmen,
//       die sync-espn-rosters.js ohnehin schon abgerufen hat (wird
//       als JSON-Datei uebergeben, um den Call nicht zu duplizieren).
//    3. Spieler, die das Team gewechselt haben, zu Trades gruppieren
//       (Team-Paar), bewerten, in data/trade-history.js einfuegen.
//
//  Usage:
//    node scripts/detect-espn-trades.js <path-zu-old-rosters.json> <path-zu-new-rosters.json>
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

function loadVmValue(file, varName) {
  const code = fs.readFileSync(file, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${code}\nthis.__X__ = typeof ${varName} !== 'undefined' ? ${varName} : null;`, sandbox);
  return sandbox.__X__;
}

function normalizeName(raw) {
  if (!raw) return '';
  let s = raw.toLowerCase().trim();
  s = s.replace(/\./g, '');
  s = s.replace(/['\u2019\u2018`]/g, '');
  s = s.replace(/\b(jr|sr|iii|ii)\b/g, '');
  s = s.replace(/\s+/g, ' ').trim();
  return NAME_FIRST_ALIASES[s] || s;
}

// ── Wertlogik 1:1 aus js/trade-analyzer.js portiert ──
// (dynastyValue ignoriert TRADE_MODE bewusst -- siehe Kommentar dort;
// reine Spieler-Trades haben deshalb identische dynasty/raw/winnow-
// Werte, exakt wie im Browser-Pfad.)
const TRADE_VALUE_TABLE = loadVmObjectFromTradeAnalyzer();
function loadVmObjectFromTradeAnalyzer() {
  const code = fs.readFileSync(path.join(ROOT, 'js', 'trade-analyzer.js'), 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  // Nur die Konstante extrahieren, ohne den ganzen Datei-Kontext (DOM-Aufrufe
  // etc.) auszufuehren -- daher ueber Regex statt vollem vm-Run.
  const m = code.match(/const TRADE_VALUE_TABLE = (\{[^;]*\});/);
  if (!m) throw new Error('TRADE_VALUE_TABLE nicht in js/trade-analyzer.js gefunden');
  return JSON.parse(m[1]);
}
function dynastyValue(rank) {
  const v = TRADE_VALUE_TABLE[String(rank)];
  return v !== undefined ? Math.round(v) : 0;
}
function tradeSideValue(players) {
  if (!players.length) return 0;
  const vals = players.map(p => dynastyValue(p.rank)).sort((a, b) => b - a);
  let total = 0;
  vals.forEach((v, i) => { total += v * Math.pow(0.80, i); });
  return Math.round(total);
}
function computeFrozen(playersA, playersB) {
  const vA = tradeSideValue(playersA), vB = tradeSideValue(playersB);
  const tot = vA + vB, pA = tot > 0 ? vA / tot * 100 : 50;
  const d = Math.abs(pA - 50);
  let verdict, cls;
  if (d < 5) { verdict = 'Fair Trade'; cls = 'fair'; }
  else if (d < 12) { verdict = vA > vB ? 'Slight Edge: Side A' : 'Slight Edge: Side B'; cls = 'slight'; }
  else { verdict = vA > vB ? 'Side A Wins Big' : 'Side B Wins Big'; cls = 'lopsided'; }
  const single = { valA: vA, valB: vB, verdict, cls, pctA: pA.toFixed(1), pctB: (100 - pA).toFixed(1) };
  return { dynasty: single, raw: single, winnow: single }; // s.o.: fuer Spieler identisch
}

function detectAndSaveTrades(oldRosters, newRosters, { root = ROOT } = {}) {
  const tradeHistoryPath = path.join(root, 'data', 'trade-history.js');
  const DYNASTY_PLAYERS = loadVmValue(path.join(root, 'data', 'rankings.js'), 'DYNASTY_PLAYERS');
  global.NAME_FIRST_ALIASES = loadVmValue(path.join(root, 'data', 'aliases.js'), 'NAME_FIRST_ALIASES') || {};
  const TEAMS = loadVmValue(path.join(root, 'data', 'teams-rosters.js'), 'TEAMS');

  const dynastyByNorm = new Map(DYNASTY_PLAYERS.map(p => [normalizeName(p[1]), p]));

  const oldOwnership = {}, newOwnership = {};
  Object.keys(oldRosters).forEach(tid => (oldRosters[tid] || []).forEach(p => { oldOwnership[p.name] = parseInt(tid); }));
  Object.keys(newRosters).forEach(tid => (newRosters[tid] || []).forEach(p => { newOwnership[p.name] = parseInt(tid); }));

  const tradeMap = {};
  Object.keys(newOwnership).forEach(name => {
    const oldTid = oldOwnership[name], newTid = newOwnership[name];
    if (oldTid === undefined || newTid === undefined || oldTid === newTid) return;
    const key = [Math.min(oldTid, newTid), Math.max(oldTid, newTid)].join('-');
    if (!tradeMap[key]) tradeMap[key] = { teamA: null, teamB: null, playersA: [], playersB: [] };
    const entry = tradeMap[key];
    const [tA] = key.split('-').map(Number);
    entry.teamA = tA; entry.teamB = Math.max(oldTid, newTid) === tA ? Math.min(oldTid, newTid) : Math.max(oldTid, newTid);
    if (oldTid === tA) entry.playersA.push(name); else entry.playersB.push(name);
  });

  if (!Object.keys(tradeMap).length) {
    console.log('[Trade Detection] Keine Team-Wechsel erkannt.');
    return { newTradesCount: 0 };
  }

  function makePlayerObj(name, ownerTid) {
    const dp = dynastyByNorm.get(normalizeName(name));
    const team = TEAMS.find(t => t.id === ownerTid);
    // NBA-Team/Position ueber ALLE Teams im NEUEN Rosterstand suchen,
    // nicht nur bei ownerTid: der Spieler steht dort (dem abgebenden
    // Team) nach dem Trade ja gerade NICHT mehr. ownerTid bleibt fuer
    // ownerName trotzdem richtig -- das ist bewusst das abgebende Team,
    // damit die Trade-Karte "Team X gab ab: Spieler Y" korrekt zeigt.
    let rosterEntry = null;
    for (const tid of Object.keys(newRosters)) {
      const hit = (newRosters[tid] || []).find(p => p.name === name);
      if (hit) { rosterEntry = hit; break; }
    }
    return {
      isPick: false,
      rank: dp ? dp[0] : null,
      name,
      nba: rosterEntry ? rosterEntry.team : '',
      pos: rosterEntry ? rosterEntry.pos : '',
      dob: dp ? dp[4] : null,
      ownerName: team ? team.name : ('Team ' + ownerTid),
    };
  }

  const existingSrc = fs.readFileSync(tradeHistoryPath, 'utf8');
  const m = existingSrc.match(/const TRADE_HISTORY_BASE = (\[[\s\S]*\]);/);
  if (!m) throw new Error('TRADE_HISTORY_BASE nicht in data/trade-history.js gefunden');
  const existingTrades = JSON.parse(m[1]);

  const now = new Date();
  const dateStr = now.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  const newTrades = [];

  Object.values(tradeMap).forEach(({ teamA, teamB, playersA, playersB }) => {
    if (!playersA.length || !playersB.length) return;
    const sideA = playersA.map(n => makePlayerObj(n, teamA));
    const sideB = playersB.map(n => makePlayerObj(n, teamB));
    const frozen = computeFrozen(sideA, sideB);

    const recentNames = new Set(
      existingTrades
        .filter(t => (now - new Date(t.id)) < 7 * 24 * 60 * 60 * 1000)
        .flatMap(t => [...(t.sideA || []), ...(t.sideB || [])].map(p => p.name))
    );
    const allNames = [...sideA, ...sideB].map(p => p.name);
    if (allNames.every(n => recentNames.has(n))) return;

    newTrades.push({
      id: Date.now() + Math.round(Math.random() * 1000) + newTrades.length, // Kollisionsschutz bei mehreren Trades im selben Lauf
      date: dateStr,
      savedMode: 'dynasty',
      source: 'espn-sync-auto',
      sideA, sideB, frozen,
      hasMissingPicks: true,
    });
  });

  if (!newTrades.length) {
    console.log('[Trade Detection] Team-Wechsel erkannt, aber bereits in den letzten 7 Tagen geloggt.');
    return { newTradesCount: 0 };
  }

  const merged = [...newTrades, ...existingTrades];
  const body = merged.map(t => '  ' + JSON.stringify(t)).join(',\n');
  const headerEnd = existingSrc.indexOf('const TRADE_HISTORY_BASE');
  const header = existingSrc.slice(0, headerEnd);
  const out = header + 'const TRADE_HISTORY_BASE = [\n' + body + '\n];\n';
  fs.writeFileSync(tradeHistoryPath, out, 'utf8');

  console.log(`[Trade Detection] ${newTrades.length} neue(r) Trade(s) automatisch erkannt und in data/trade-history.js geschrieben:`);
  newTrades.forEach(t => {
    console.log(`  ${t.sideA.map(p => p.name).join(', ')}  <->  ${t.sideB.map(p => p.name).join(', ')}`);
  });
  return { newTradesCount: newTrades.length };
}

module.exports = { detectAndSaveTrades };

// Auch als eigenstaendiges CLI-Script nutzbar (z.B. zum manuellen Testen
// gegen zwei gespeicherte Rosterstaende), falls es nicht ueber
// sync-espn-rosters.js aufgerufen wird.
if (require.main === module) {
  const [, , oldRostersPath, newRostersPath] = process.argv;
  if (!oldRostersPath || !newRostersPath) {
    console.error('Usage: node detect-espn-trades.js <old.json> <new.json>');
    process.exit(1);
  }
  const oldRosters = JSON.parse(fs.readFileSync(oldRostersPath, 'utf8'));
  const newRosters = JSON.parse(fs.readFileSync(newRostersPath, 'utf8'));
  detectAndSaveTrades(oldRosters, newRosters);
}
