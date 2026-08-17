#!/usr/bin/env node
// ============================================================
//  ESPN-PROBE: Liefert ESPN Draft-Pick-Trades?
// ============================================================
//  HINTERGRUND
//  Die Trade-Erkennung vergleicht den Kader von gestern mit dem von
//  heute. Ein Trade, bei dem nur Picks den Besitzer wechseln, aendert
//  an keinem Kader ein Zeichen und ist damit strukturell unsichtbar.
//  Genau so ist am 11.08.2026 ein Trade komplett durchgerutscht.
//
//  Bevor wir Picks dauerhaft von Hand pflegen, soll geklaert sein, ob
//  ESPN sie ueberhaupt irgendwo herausgibt. Fuer 2027 und spaeter ist
//  die Antwort sicher nein -- diese Jahre existieren in ESPNs
//  Datenmodell nicht. Fuer 2026 ist es offen: ESPN kennt in manchen
//  Keeper-Formaten die Picks des kommenden Drafts.
//
//  WAS DAS SCRIPT TUT
//  Fragt mehrere ESPN-Views ab und berichtet, was zurueckkommt. Es
//  aendert NICHTS im Repo ausser einer Berichtsdatei, und es schlaegt
//  bei keinem Fehler fehl -- ein Diagnoseschritt darf den taeglichen
//  Workflow nicht stoppen.
//
//  Abgefragt werden:
//    mDraftDetail        -- Draftreihenfolge samt Besitzer je Pick.
//                           Weicht der Besitzer eines Picks vom Team
//                           ab, dem der Slot urspruenglich gehoert,
//                           ist das ein gehandelter Pick.
//    mTransactions2      -- Transaktionsprotokoll. Interessant ist,
//                           ob Eintraege vom Typ TRADE Positionen
//                           enthalten, die kein Spieler sind.
//    mTeam + mSettings   -- Enthaelt draftDetail und die Einstellung,
//                           ob Pick-Handel in dieser Liga ueberhaupt
//                           aktiviert ist.
//    mPendingTransactions
//
//  AUSGABE
//    Konsole: lesbare Zusammenfassung
//    scripts/data/espn-pick-probe.json: kompakter Bericht
//  Bewusst KEIN Rohdump: die Antworten sind mehrere Megabyte gross
//  und enthalten nichts, was ins Repo gehoert.
//
//  Usage:
//    node scripts/probe-espn-picks.js
//    node scripts/probe-espn-picks.js --season 2027
// ============================================================

const fs = require('fs');
const path = require('path');
const https = require('https');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'scripts', 'data');
const OUT_FILE = path.join(OUT_DIR, 'espn-pick-probe.json');

function loadConfig() {
  const code = fs.readFileSync(path.join(ROOT, 'js', 'espn-sync.js'), 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(
    `${code}\nthis.__CFG__ = { ESPN_LEAGUE_ID, ESPN_SEASON, ESPN_TO_TT_TEAM };`,
    sandbox
  );
  return sandbox.__CFG__;
}

function httpsGetJson(url, extraHeaders) {
  return new Promise((resolve, reject) => {
    const headers = Object.assign({
      'User-Agent': 'taco-tuesday-hq-bot',
      'Accept': 'application/json',
    }, extraHeaders || {});
    https.get(url, { headers }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGetJson(res.headers.location, extraHeaders).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('keine gültige JSON-Antwort')); }
      });
    }).on('error', reject);
  });
}

function base(cfg, season) {
  return `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/${season}/segments/0/leagues/${cfg.ESPN_LEAGUE_ID}`;
}

// ── Auswertung: Draftreihenfolge ─────────────────────────────
//  draftDetail.picks hat je Eintrag teamId (wer zieht) und meist
//  auch die Info, aus wessen Slot der Pick stammt. Stimmen die
//  nicht ueberein, wurde der Pick gehandelt -- und das waere die
//  Information, die wir brauchen.
function analyzeDraftDetail(data, cfg) {
  const dd = data && data.draftDetail;
  if (!dd) return { vorhanden: false, hinweis: 'Kein draftDetail in der Antwort.' };

  const picks = Array.isArray(dd.picks) ? dd.picks : [];
  const felder = picks.length ? Object.keys(picks[0]) : [];

  // KORREKTUR gegenueber der ersten Fassung: das Feld heisst
  // "owningTeamIds" (Mehrzahl, ein Array), nicht "originalTeamId" oder
  // "owningTeamId". Die erste Fassung hat nach den falschen Namen
  // gesucht und faelschlich "kein Herkunftsfeld" gemeldet, obwohl ein
  // Array mit genau dieser Bedeutung die ganze Zeit da war.
  //
  // Annahme, die diese Probe jetzt prueft statt voraussetzt: wenn
  // owningTeamIds die Kette der Besitzer eines Picks ist, dann zeigt
  // das erste Element den urspruenglichen Besitzer, das letzte den
  // aktuellen (== teamId). Bei einem Pick ohne Handel waeren beide
  // gleich und das Array haette Laenge 1.
  const arrayFelder = felder.filter(f => Array.isArray(picks[0][f]));

  let mitMehrerenEintraegen = 0, pruefbar = 0, gehandeltVermutet = 0;
  const beispiele = [];
  const laengenVerteilung = {};

  picks.forEach(p => {
    const chain = p.owningTeamIds;
    if (!Array.isArray(chain)) return;
    pruefbar++;
    laengenVerteilung[chain.length] = (laengenVerteilung[chain.length] || 0) + 1;
    if (chain.length > 1) mitMehrerenEintraegen++;

    const erster = chain[0], letzter = chain[chain.length - 1];
    if (erster !== undefined && letzter !== undefined && erster !== letzter) {
      gehandeltVermutet++;
      if (beispiele.length < 8) {
        beispiele.push({
          runde: p.roundId, pickImDurchgang: p.roundPickNumber,
          overallPickNumber: p.overallPickNumber,
          owningTeamIds: chain,
          teamId: p.teamId,
          vonTeamTT: cfg.ESPN_TO_TT_TEAM[erster] || null,
          anTeamTT: cfg.ESPN_TO_TT_TEAM[letzter] || null,
        });
      }
    }
  });

  return {
    vorhanden: true,
    draftAbgeschlossen: !!dd.drafted,
    anzahlPicks: picks.length,
    felderJePick: felder,
    arrayFelder,
    aufHandelPruefbar: pruefbar,
    picksMitKettenlaengeUeber1: mitMehrerenEintraegen,
    erkannteGehandeltePicks: gehandeltVermutet,
    laengenVerteilungOwningTeamIds: laengenVerteilung,
    beispiele,
  };
}

// ── Auswertung: Transaktionsprotokoll ────────────────────────
function analyzeTransactions(data) {
  const tx = (data && (data.transactions || data.topics)) || null;
  if (!tx) return { vorhanden: false, hinweis: 'Keine transactions in der Antwort.' };

  const typen = {};
  let mitItems = 0;
  const nichtSpielerItems = [];

  // ERWEITERUNG: Nicht nur Items ohne playerId zaehlen, sondern auch
  // pruefen, ob ESPN fuer Picks eine Pseudo-playerId nutzt statt das
  // Feld leer zu lassen. Anhaltspunkt dafuer: Felder, die nur bei
  // Picks Sinn ergeben (overallPickNumber, roundId, pickId,
  // draftPickId), zusammen MIT einer playerId. In der ersten Fassung
  // waeren solche Items unentdeckt geblieben, weil nur auf eine
  // fehlende playerId geprueft wurde.
  const pickVerdaechtigeFelder = /overallpick|roundid|pickid|draftpick/i;
  const itemTypWerte = new Set();
  const pickVerdaechtigeItems = [];
  const tradeBeispiele = [];

  tx.forEach(t => {
    const typ = t.type || 'unbekannt';
    typen[typ] = (typen[typ] || 0) + 1;
    const items = Array.isArray(t.items) ? t.items : [];
    if (items.length) mitItems++;

    if (typ === 'TRADE_ACCEPT' && tradeBeispiele.length < 3) {
      tradeBeispiele.push({ transaktionId: t.id, items });
    }

    items.forEach(it => {
      if (it.type) itemTypWerte.add(it.type);
      const hatVerdaechtigesFeld = Object.keys(it).some(k => pickVerdaechtigeFelder.test(k));
      if (hatVerdaechtigesFeld) {
        pickVerdaechtigeItems.push({ transaktionstyp: typ, item: it });
      }
      if (it.playerId === undefined || it.playerId === null) {
        if (nichtSpielerItems.length < 8) {
          nichtSpielerItems.push({ transaktionstyp: typ, itemFelder: Object.keys(it), item: it });
        }
      }
    });
  });

  return {
    vorhanden: true,
    anzahl: tx.length,
    typen,
    mitItems,
    itemTypWerte: [...itemTypWerte],
    itemsOhneSpielerId: nichtSpielerItems.length,
    beispieleOhneSpielerId: nichtSpielerItems,
    pickVerdaechtigeItemsAnzahl: pickVerdaechtigeItems.length,
    pickVerdaechtigeItems: pickVerdaechtigeItems.slice(0, 8),
    // Volle Items aus bis zu 3 TRADE_ACCEPT-Transaktionen, ungefiltert.
    // Das ist der verlaesslichste Weg zu sehen, wie ein Pick in einem
    // Trade tatsaechlich aussieht, statt es aus Feldnamen zu erraten.
    tradeAcceptBeispiele: tradeBeispiele,
  };
}

function analyzeSettings(data) {
  const s = data && data.settings;
  if (!s) return { vorhanden: false };
  const tr = s.tradeSettings || {};
  const dr = s.draftSettings || {};
  return {
    vorhanden: true,
    ligaName: s.name || null,
    // Diese Felder sagen, ob ESPN in dieser Liga ueberhaupt Pick-Handel kennt.
    tradeSettingsFelder: Object.keys(tr),
    draftSettingsFelder: Object.keys(dr),
    keeperCount: s.rosterSettings ? s.rosterSettings.keeperCount : undefined,
    draftType: dr.type,
    pickHandelHinweis: Object.keys(dr).filter(k => /pick|trade/i.test(k)),
  };
}

async function probe(cfg, season) {
  const b = base(cfg, season);
  const ergebnis = { saison: season, abgefragt: {} };

  const versuche = [
    ['mDraftDetail', `${b}?view=mDraftDetail`, analyzeDraftDetail],
    ['mSettings', `${b}?view=mSettings`, analyzeSettings],
    ['mTransactions2', `${b}?view=mTransactions2`, analyzeTransactions],
    ['mPendingTransactions', `${b}?view=mPendingTransactions`, analyzeTransactions],
  ];

  for (const [name, url, auswerten] of versuche) {
    try {
      const data = await httpsGetJson(url);
      ergebnis.abgefragt[name] = { ok: true, ...auswerten(data, cfg) };
      console.log(`  ✓ ${name}`);
    } catch (err) {
      ergebnis.abgefragt[name] = { ok: false, fehler: err.message };
      console.log(`  ✗ ${name}: ${err.message}`);
    }
  }
  return ergebnis;
}

function bewerten(ergebnis) {
  const dd = ergebnis.abgefragt.mDraftDetail || {};
  const tx = ergebnis.abgefragt.mTransactions2 || {};

  const alle = Object.values(ergebnis.abgefragt);
  const erreichbar = alle.filter(a => a.ok);
  if (!erreichbar.length) {
    const fehler = [...new Set(alle.map(a => a.fehler))].join(', ');
    return `UNKLAR: Keine der Abfragen kam durch (${fehler}). Das sagt nichts darüber aus, `
         + `ob ESPN Pick-Trades kennt -- nur, dass wir von hier aus nicht nachsehen konnten.`;
  }

  if (dd.ok && dd.erkannteGehandeltePicks > 0) {
    return `JA: draftDetail.owningTeamIds zeigt für ${ergebnis.saison} ${dd.erkannteGehandeltePicks} Pick(s), `
         + `deren erster und letzter Eintrag auseinanderfallen -- das liest sich als Besitzerkette mit Handel drin. `
         + `Siehe "beispiele" im Bericht zur Gegenprüfung gegen bekannte Trades.`;
  }
  if (tx.ok && tx.pickVerdaechtigeItemsAnzahl > 0) {
    return `MÖGLICH: Im Transaktionsprotokoll stehen ${tx.pickVerdaechtigeItemsAnzahl} Items mit Feldern, `
         + `die auf einen Pick hindeuten (overallPickNumber/roundId/pickId/draftPickId). `
         + `Siehe "pickVerdaechtigeItems" und "tradeAcceptBeispiele" im Bericht für die genaue Form.`;
  }
  if (dd.ok && dd.aufHandelPruefbar > 0 && dd.erkannteGehandeltePicks === 0) {
    return `NEIN: owningTeamIds ist bei allen ${dd.aufHandelPruefbar} geprüften Picks eine Kette der Länge 1 `
         + `(Verteilung: ${JSON.stringify(dd.laengenVerteilungOwningTeamIds)}) -- kein Hinweis auf einen Besitzerwechsel. `
         + `Prüfe trotzdem "tradeAcceptBeispiele" im Bericht von Hand gegen einen bekannten Trade, `
         + `bevor das als endgültig gilt.`;
  }
  if (dd.ok && dd.anzahlPicks > 0 && dd.aufHandelPruefbar === 0) {
    return `NEIN: draftDetail enthält ${dd.anzahlPicks} Picks, aber kein owningTeamIds-Array `
         + `(vorhandene Felder: ${(dd.felderJePick || []).join(', ')}). Gehandelte Picks sind daraus nicht ableitbar.`;
  }
  return `NEIN: Abfragen kamen durch (${erreichbar.length} von ${alle.length}), aber kein Hinweis auf Pick-Trades. `
       + `Picks müssen für ${ergebnis.saison} von Hand gepflegt werden.`;
}

async function main() {
  const cfg = loadConfig();
  const arg = process.argv.indexOf('--season');
  const seasons = arg > -1
    ? [parseInt(process.argv[arg + 1], 10)]
    : [cfg.ESPN_SEASON, cfg.ESPN_SEASON - 1];

  console.log(`ESPN-Probe für Liga ${cfg.ESPN_LEAGUE_ID}, Saisons: ${seasons.join(', ')}\n`);

  const bericht = { erstellt: new Date().toISOString(), liga: cfg.ESPN_LEAGUE_ID, saisons: [] };

  for (const s of seasons) {
    console.log(`Saison ${s}:`);
    const e = await probe(cfg, s);
    e.bewertung = bewerten(e);
    bericht.saisons.push(e);
    console.log(`  → ${e.bewertung}\n`);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(bericht, null, 2), 'utf8');
  console.log(`Bericht: ${path.relative(ROOT, OUT_FILE)}`);
}

main().catch(err => {
  // Diagnose darf nie den Workflow stoppen.
  console.error('Probe fehlgeschlagen (nicht kritisch):', err.message);
  process.exit(0);
});
