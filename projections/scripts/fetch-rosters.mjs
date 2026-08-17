/**
 * MFHFBs NBA Projections — Roster Fetcher
 * -----------------------------------------
 * Zieht die aktuellen Kader aller 30 NBA-Teams von ESPNs öffentlicher
 * (inoffizieller) JSON-API und schreibt sie nach data/rosters.json und
 * rosters-data.js (fürs Frontend). Gedacht zum täglichen Ausführen über
 * die GitHub Action .github/workflows/update-rosters.yml.
 *
 * Quelle: https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/{id}/roster
 * (unoffiziell, aber verlässlich aktuell — ESPN aktualisiert Roster i.d.R.
 * am selben Tag von Trades/Signings, meist schneller als Spotrac/Fanspo)
 *
 * Node >= 18 (nutzt globales fetch, keine Abhängigkeiten nötig).
 */

import fs from "node:fs/promises";
import path from "node:path";

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba";
const OUT_DIR = path.resolve("data");
const JSON_OUT = path.join(OUT_DIR, "rosters.json");
const JS_OUT = path.resolve("rosters-data.js");

// Fallback-Liste der 30 Team-IDs + Abkürzungen, falls der /teams-Call selbst
// mal fehlschlägt. Wird primär aber live von ESPN bezogen (s.u.).
const FALLBACK_TEAMS = [
  { id: "1", abbr: "ATL" }, { id: "2", abbr: "BOS" }, { id: "17", abbr: "BKN" },
  { id: "30", abbr: "CHA" }, { id: "4", abbr: "CHI" }, { id: "5", abbr: "CLE" },
  { id: "6", abbr: "DAL" }, { id: "7", abbr: "DEN" }, { id: "8", abbr: "DET" },
  { id: "9", abbr: "GS" }, { id: "10", abbr: "HOU" }, { id: "11", abbr: "IND" },
  { id: "12", abbr: "LAC" }, { id: "13", abbr: "LAL" }, { id: "29", abbr: "MEM" },
  { id: "14", abbr: "MIA" }, { id: "15", abbr: "MIL" }, { id: "16", abbr: "MIN" },
  { id: "3", abbr: "NO" }, { id: "18", abbr: "NY" }, { id: "25", abbr: "OKC" },
  { id: "19", abbr: "ORL" }, { id: "20", abbr: "PHI" }, { id: "21", abbr: "PHX" },
  { id: "22", abbr: "POR" }, { id: "23", abbr: "SAC" }, { id: "24", abbr: "SA" },
  { id: "28", abbr: "TOR" }, { id: "26", abbr: "UTAH" }, { id: "27", abbr: "WSH" },
];

async function fetchJson(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "MFHFBs-NBA-Projections/1.0" } });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.json();
    } catch (err) {
      if (i === tries - 1) throw err;
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
}

async function getTeamList() {
  try {
    const data = await fetchJson(`${ESPN_BASE}/teams`);
    const teams = data?.sports?.[0]?.leagues?.[0]?.teams ?? [];
    if (!teams.length) throw new Error("Leere Team-Liste von ESPN");
    return teams.map((t) => ({
      id: t.team.id,
      abbr: t.team.abbreviation,
      name: t.team.displayName,
    }));
  } catch (err) {
    console.warn(`Konnte Team-Liste nicht live laden (${err.message}), nutze Fallback-Liste.`);
    return FALLBACK_TEAMS.map((t) => ({ ...t, name: t.abbr }));
  }
}

// ESPNs Roster-Endpoint liefert je nach Zeitpunkt entweder eine flache
// "athletes"-Liste oder eine nach Position gruppierte Liste mit "items".
// Wir normalisieren beide Formen auf ein flaches Array.
function normalizeAthletes(payload) {
  const raw = payload?.athletes ?? [];
  if (!raw.length) return [];
  if (raw[0]?.items) {
    return raw.flatMap((group) => group.items ?? []);
  }
  return raw;
}

async function fetchTeamRoster(team) {
  const url = `${ESPN_BASE}/teams/${team.id}/roster`;
  const data = await fetchJson(url);
  const athletes = normalizeAthletes(data);
  return athletes.map((a) => ({
    name: a.displayName || a.fullName || `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim(),
    jersey: a.jersey ?? null,
    position: a.position?.abbreviation ?? null,
    height: a.displayHeight ?? null,
    weight: a.displayWeight ?? null,
    age: a.age ?? null,
    espnId: a.id ?? null,
  })).filter((p) => p.name);
}

async function main() {
  console.log("Lade Team-Liste von ESPN...");
  const teams = await getTeamList();
  console.log(`${teams.length} Teams gefunden.`);

  const rosters = {};
  const errors = [];

  for (const team of teams) {
    try {
      const players = await fetchTeamRoster(team);
      rosters[team.abbr] = { teamId: team.id, name: team.name, players };
      console.log(`  ${team.abbr}: ${players.length} Spieler`);
    } catch (err) {
      errors.push(`${team.abbr}: ${err.message}`);
      console.error(`  ${team.abbr}: FEHLER — ${err.message}`);
    }
    // kleine Pause, um ESPNs CDN nicht zu stressen
    await new Promise((r) => setTimeout(r, 150));
  }

  const output = {
    fetchedAt: new Date().toISOString(),
    source: "ESPN (site.api.espn.com)",
    teamCount: Object.keys(rosters).length,
    errors,
    rosters,
  };

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(JSON_OUT, JSON.stringify(output, null, 1));
  await fs.writeFile(
    JS_OUT,
    `// Automatisch generiert von scripts/fetch-rosters.mjs — ${output.fetchedAt}\n` +
      `// Quelle: ${output.source}\n` +
      `const ROSTERS_DATA = ${JSON.stringify(output, null, 1)};\n`
  );

  console.log(`\nFertig: ${output.teamCount}/30 Teams geladen -> ${JSON_OUT}, ${JS_OUT}`);
  if (errors.length) {
    console.warn(`${errors.length} Team(s) mit Fehlern:`, errors);
    if (output.teamCount === 0) process.exit(1); // harter Fehlschlag nur wenn GAR NICHTS geklappt hat
  }
}

main().catch((err) => {
  console.error("Roster-Fetch fehlgeschlagen:", err);
  process.exit(1);
});
