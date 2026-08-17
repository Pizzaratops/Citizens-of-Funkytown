/**
 * MFHFBs NBA Projections — Fantrax Draft-Results & ADP Fetcher
 * ------------------------------------------------------------
 * Zieht Draft-Ergebnisse UND Fantrax' eigene ADP direkt über Fantrax'
 * (von Fantrax selbst dokumentierte) "fxea"-API — kein manueller
 * CSV-Export/Upload mehr nötig. Schreibt die Ergebnisse in exakt dem
 * CSV-Format, das build-adp-data.py ohnehin erwartet, landet also
 * automatisch in derselben Pipeline wie die bisherigen manuellen
 * Uploads.
 *
 * Quelle: Fantrax fxea-API (offiziell von Fantrax dokumentiert, siehe
 * z.B. https://pkg.go.dev/github.com/pmurley/go-fantrax). Nicht
 * offiziell in dem Sinne, dass es ein stabiler Public-API-Vertrag mit
 * Versionierung ist — kann sich also theoretisch ändern. Das Skript
 * loggt bei jedem Schritt ausführlich, damit sich ein evtl. künftiges
 * Format-Update schnell erkennen und nachbessern lässt.
 *
 * KONFIGURATION: data/fantrax-leagues.json — Liste deiner Liga-IDs
 * (siehe Datei-Kommentar dort für Format). Neue Liga = ID dort
 * eintragen, Skript erneut laufen lassen. Fertig.
 *
 * Nutzung:
 *   node scripts/fetch-draft-results.mjs
 * Danach wie gewohnt:
 *   python3 scripts/build-adp-data.py
 *
 * Node >= 18 (nutzt globales fetch, keine Abhängigkeiten nötig).
 */

import fs from "node:fs/promises";
import path from "node:path";

const FXEA_BASE = "https://www.fantrax.com/fxea/general";
const LEAGUES_CONFIG = path.resolve("data/fantrax-leagues.json");
const DRAFT_RESULTS_DIR = path.resolve("data/draft-results");
const FANTRAX_ADP_PATH = path.resolve("data/fantrax-adp.csv");

async function fetchJson(url, options = {}, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "MFHFBs-NBA-Projections/1.0", ...(options.headers || {}) },
        ...options,
      });
      const text = await res.text();
      if (!res.ok) {
        const err = new Error(`HTTP ${res.status} für ${url} — Antwort: ${text.slice(0, 300)}`);
        err.status = res.status;
        throw err;
      }
      try {
        return JSON.parse(text);
      } catch {
        throw new Error(`Antwort von ${url} war kein gültiges JSON: ${text.slice(0, 300)}`);
      }
    } catch (err) {
      // 4xx-Fehler (falscher Endpoint/falsche ID) werden beim nächsten Versuch
      // nicht anders ausfallen -- nicht sinnlos wiederholen, sondern gleich
      // weiterreichen (z.B. an den nächsten Fallback-Endpoint).
      if (err.status && err.status >= 400 && err.status < 500) throw err;
      if (i === tries - 1) throw err;
      console.warn(`  (Versuch ${i + 1} fehlgeschlagen: ${err.message} — erneuter Versuch...)`);
      await new Promise((r) => setTimeout(r, 700 * (i + 1)));
    }
  }
}

// CSV-Feld quoten (identisch zum Fantrax-Exportformat: alles in "...")
function csvField(v) {
  return `"${String(v ?? "").replace(/"/g, '""')}"`;
}
function csvRow(fields) {
  return fields.map(csvField).join(",");
}

// Fantrax liefert Spielernamen als "Nachname, Vorname" -- umdrehen,
// damit es zum Rest der Seite passt ("Vorname Nachname" überall sonst).
function fantraxNameToDisplay(rawName) {
  if (!rawName) return "";
  const idx = rawName.indexOf(",");
  if (idx === -1) return rawName.trim();
  const last = rawName.slice(0, idx).trim();
  const first = rawName.slice(idx + 1).trim();
  return first ? `${first} ${last}` : last;
}

const CSV_HEADER = ["Player ID", "Round", "Pick", "Ov Pick", "Pos", "Player", "Team", "Fantasy Team", "Time (CEST)"];

async function loadLeaguesConfig() {
  let raw;
  try {
    raw = await fs.readFile(LEAGUES_CONFIG, "utf8");
  } catch {
    console.error(`Konfigurationsdatei fehlt: ${LEAGUES_CONFIG}`);
    console.error('Lege sie an mit z.B.: {"sport":"NBA","leagues":[{"id":"DEINE_LEAGUE_ID","label":"H2H 01"}]}');
    process.exit(1);
  }
  const cfg = JSON.parse(raw);
  if (!cfg.leagues || !cfg.leagues.length) {
    console.error(`${LEAGUES_CONFIG} enthält keine Ligen unter "leagues". Nichts zu tun.`);
    process.exit(1);
  }
  return cfg;
}

// playerId -> {name, team, pos}
async function fetchPlayerIndex(sport) {
  console.log(`\n[1/3] Spieler-Index für ${sport} laden (getPlayerIds)...`);
  const data = await fetchJson(`${FXEA_BASE}/getPlayerIds?sport=${sport}`);
  const entries = Object.entries(data || {});
  console.log(`  -> ${entries.length} Spieler-IDs geladen.`);
  const idx = {};
  for (const [id, p] of entries) {
    idx[id] = { name: p.name, team: p.team, pos: p.position };
  }
  return idx;
}

// teamId -> Teamname (Fantasy-Team, nicht NBA-Team)
async function fetchTeamNames(leagueId) {
  try {
    const info = await fetchJson(`${FXEA_BASE}/getLeagueInfo?leagueId=${leagueId}`);
    const teamInfo = info.teamInfo || {};
    const out = {};
    for (const [id, t] of Object.entries(teamInfo)) out[id] = t.name || id;
    return out;
  } catch (err) {
    console.warn(`  Team-Namen für Liga ${leagueId} konnten nicht geladen werden (${err.message}) — nutze Team-IDs als Platzhalter.`);
    return {};
  }
}

// Holt Draft-Picks für eine Liga. Probiert getDraftResults zuerst
// (laut Go-Doc-Kommentar der eigentliche Endpoint-Name), fällt bei
// Fehler auf getDraftPicks zurück (laut README-Beispiel-URL).
async function fetchDraftPicks(leagueId) {
  const urls = [
    `${FXEA_BASE}/getDraftResults?leagueId=${leagueId}`,
    `${FXEA_BASE}/getDraftPicks?leagueId=${leagueId}`,
  ];
  let lastErr;
  for (const url of urls) {
    try {
      const data = await fetchJson(url);
      // Antwort-Form ist laut Doku nicht 100% eindeutig -- robust
      // gegen verschiedene Hüllen-Strukturen abfangen:
      const picks = data.draftPicks || data.picks || (Array.isArray(data) ? data : null);
      if (!picks) throw new Error(`Unerwartete Antwortstruktur von ${url}: ${JSON.stringify(data).slice(0, 300)}`);
      console.log(`  -> ${picks.length} Picks von ${url.includes("getDraftResults") ? "getDraftResults" : "getDraftPicks"} erhalten.`);
      return picks;
    } catch (err) {
      lastErr = err;
      console.warn(`  ${url} fehlgeschlagen: ${err.message}`);
    }
  }
  throw lastErr;
}

async function processLeague(league, playerIdx, sport) {
  console.log(`\n--- Liga: ${league.label} (${league.id}) ---`);
  const [picks, teamNames] = await Promise.all([
    fetchDraftPicks(league.id),
    fetchTeamNames(league.id),
  ]);

  if (!picks.length) {
    console.warn(`  Keine Picks für ${league.label} -- übersprungen (Draft evtl. noch nicht gestartet).`);
    return null;
  }

  // WICHTIG (verifiziert gegen echte Fantrax-API-Antworten am 22.07.2026):
  // "pick" ist die OVERALL-Pick-Nummer über den ganzen Draft, NICHT die
  // Pick-Nummer innerhalb der Runde -- das ist "pickInRound". Picks ohne
  // "playerId" sind schlicht noch nicht gefallene (zukünftige) Picks bei
  // einem laufenden Draft, kein Fehler -- werden übersprungen, nicht als
  // "unbekannt" mitgeschrieben (das wären sonst falsche ADP-Datenpunkte).
  const madePicks = picks.filter((p) => p.playerId);
  const pendingCount = picks.length - madePicks.length;
  if (pendingCount) {
    console.log(`  (${pendingCount} von ${picks.length} Picks sind noch nicht gefallen -- Draft läuft evtl. noch, werden übersprungen.)`);
  }

  const sorted = [...madePicks].sort((a, b) => (a.pick ?? 0) - (b.pick ?? 0));

  const rows = [CSV_HEADER];
  let unresolvedPlayers = 0;
  sorted.forEach((p) => {
    const playerId = p.playerId;
    const info = playerIdx[playerId];
    if (!info) unresolvedPlayers++;
    // Fantrax liefert Namen als "Nachname, Vorname" -- umdrehen, damit es
    // zum Rest der Seite passt (die überall "Vorname Nachname" nutzt).
    const displayName = info?.name ? fantraxNameToDisplay(info.name) : `UNBEKANNT (${playerId})`;
    const teamName = teamNames[p.teamId] || p.teamId || "";
    const timeStr = p.time ? new Date(p.time).toISOString() : "";
    rows.push([
      playerId || "",
      p.round ?? "",
      p.pickInRound ?? "",
      p.pick ?? "", // Ov Pick = von Fantrax direkt geliefert, nicht selbst zählen
      info?.pos || "",
      displayName,
      info?.team || "",
      teamName,
      timeStr,
    ]);
  });

  if (unresolvedPlayers) {
    console.warn(`  Warnung: ${unresolvedPlayers} Spieler-ID(s) nicht im ${sport}-Index gefunden (evtl. anderer Sport-Filter nötig?).`);
  }

  const outPath = path.join(DRAFT_RESULTS_DIR, `Fantrax-Draft-Results-AUTO-${league.label.replace(/[^a-z0-9]+/gi, "_")}.csv`);
  await fs.writeFile(outPath, rows.map(csvRow).join("\r\n") + "\r\n", "utf8");
  console.log(`  -> geschrieben: ${outPath} (${rows.length - 1} Picks)`);
  return outPath;
}

async function fetchFantraxAdp(sport, playerIdx) {
  console.log(`\n[3/3] Fantrax-ADP für ${sport} laden (getAdp)...`);
  let data;
  // Erst GET mit Query-Params probieren, bei Fehlschlag POST mit JSON-Body
  // (die Fantrax-Doku zeigt für diesen Endpoint ein "Request Body Example",
  // das Verb selbst ist nicht eindeutig dokumentiert).
  try {
    data = await fetchJson(`${FXEA_BASE}/getAdp?sport=${sport}&start=1&limit=1000&order=ADP`);
  } catch (errGet) {
    console.warn(`  GET fehlgeschlagen (${errGet.message}), versuche POST...`);
    data = await fetchJson(`${FXEA_BASE}/getAdp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sport, start: 1, limit: 1000, order: "ADP" }),
    });
  }

  const list = Array.isArray(data) ? data : data.players || data.results || [];
  if (!list.length) {
    console.warn("  Keine ADP-Daten erhalten -- fantrax-adp.csv bleibt unverändert.");
    return;
  }
  console.log(`  -> ${list.length} Spieler mit Fantrax-ADP erhalten.`);

  const sorted = [...list].sort((a, b) => (a.ADP ?? a.adp ?? 9999) - (b.ADP ?? b.adp ?? 9999));
  const rows = [CSV_HEADER];
  sorted.forEach((p) => {
    const adp = p.ADP ?? p.adp;
    const info = playerIdx[p.id] || {};
    // getAdp liefert eigene "name"-Felder direkt (nicht über playerIdx),
    // ebenfalls im "Nachname, Vorname"-Format -- umdrehen wie überall sonst.
    const rawName = p.name || info.name;
    rows.push([
      p.id || "",
      "",
      "",
      adp !== undefined ? Math.round(adp) : "",
      p.pos || info.pos || "",
      rawName ? fantraxNameToDisplay(rawName) : `UNBEKANNT (${p.id})`,
      info.team || "",
      "",
      "",
    ]);
  });

  await fs.writeFile(FANTRAX_ADP_PATH, rows.map(csvRow).join("\r\n") + "\r\n", "utf8");
  console.log(`  -> geschrieben: ${FANTRAX_ADP_PATH} (${rows.length - 1} Spieler)`);
}

async function main() {
  const cfg = await loadLeaguesConfig();
  const sport = cfg.sport || "NBA";

  await fs.mkdir(DRAFT_RESULTS_DIR, { recursive: true });

  const playerIdx = await fetchPlayerIndex(sport);

  console.log(`\n[2/3] Draft Results für ${cfg.leagues.length} Liga(en) laden...`);
  const results = [];
  for (const league of cfg.leagues) {
    try {
      const out = await processLeague(league, playerIdx, sport);
      if (out) results.push(out);
    } catch (err) {
      console.error(`  FEHLER bei Liga ${league.label} (${league.id}): ${err.message}`);
      console.error("  -> übersprungen, andere Ligen laufen weiter.");
    }
  }

  try {
    await fetchFantraxAdp(sport, playerIdx);
  } catch (err) {
    console.error(`  FEHLER beim Laden der Fantrax-ADP: ${err.message}`);
    console.error("  -> data/fantrax-adp.csv bleibt unverändert.");
  }

  console.log(`\nFertig. ${results.length}/${cfg.leagues.length} Liga(en) erfolgreich aktualisiert.`);
  console.log("Nächster Schritt: python3 scripts/build-adp-data.py");
}

main().catch((err) => {
  console.error("Unerwarteter Fehler:", err);
  process.exit(1);
});
