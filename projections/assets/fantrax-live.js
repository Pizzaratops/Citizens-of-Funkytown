// MFHFBs NBA Projections — Live-Sync mit Fantrax (fxea-API, direkt im Browser)
// ------------------------------------------------------------
// Liest den aktuellen Draft-Stand einer Fantrax-Liga live direkt im
// Browser (CORS-getestet am 22.07.2026, funktioniert ohne eigenen
// Server/eigenes Backend). Kein Speichern/Laden von eigenem Zustand
// mehr nötig -- Fantrax SELBST ist die Quelle der Wahrheit, wir fragen
// bei Bedarf einfach neu ab. Ersetzt die vorherige
// Firebase/Firestore-Lösung komplett.
//
// WICHTIGER FORMAT-HINWEIS: Fantrax liefert Spielernamen im Format
// "Nachname, Vorname" (z.B. "Wembanyama, Victor") -- 
// mfhfbFantraxNameToDisplay() dreht das um, BEVOR der normale
// mfhfbNormalizeName()-Abgleich (assets/shared.js) läuft.
//
// WICHTIGER FELD-HINWEIS: In den draftPicks-Objekten von
// getDraftResults ist "pick" die OVERALL-Pick-Nummer über den ganzen
// Draft (nicht die Pick-Nummer innerhalb der Runde -- das ist
// "pickInRound"). Picks ohne "playerId" sind noch nicht gefallene
// (zukünftige) Picks, kein Fehler.
//
// Diese API ist von Fantrax dokumentiert, aber kein versioniertes
// Public-API-Produkt -- kann sich theoretisch ändern. Bei Problemen
// hilft ein Blick in die Browser-Konsole (Network-Tab), was die
// Endpoints aktuell tatsächlich zurückgeben.

const FANTRAX_BASE = "https://www.fantrax.com/fxea/general";

let _fantraxPlayerIndexCache = null;

// "Nachname, Vorname" -> "Vorname Nachname". Ohne Komma wird der Name
// unverändert zurückgegeben (defensiv, falls Fantrax das Format mal
// ändert oder ein Sonderfall auftaucht).
function mfhfbFantraxNameToDisplay(rawName) {
  if (!rawName) return "";
  const idx = rawName.indexOf(",");
  if (idx === -1) return rawName.trim();
  const last = rawName.slice(0, idx).trim();
  const first = rawName.slice(idx + 1).trim();
  return first ? `${first} ${last}` : last;
}

async function mfhfbFetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} für ${url}`);
  return res.json();
}

// Sport-weiter Spieler-Index -- groß (~600+ Spieler), ändert sich
// innerhalb einer Session praktisch nie, daher pro Session nur einmal
// geladen und wiederverwendet (auch über mehrere Liga-Wechsel hinweg).
async function mfhfbFantraxPlayerIndex(sport = "NBA") {
  if (_fantraxPlayerIndexCache) return _fantraxPlayerIndexCache;
  _fantraxPlayerIndexCache = await mfhfbFetchJson(`${FANTRAX_BASE}/getPlayerIds?sport=${sport}`);
  return _fantraxPlayerIndexCache;
}

// Liefert {draft, league} für eine Liga.
// draft.draftPicks[]: {round, pick, pickInRound, teamId, playerId?, time}
// draft.draftOrder[]: Team-IDs in der Reihenfolge, in der sie in Runde 1
//   picken -- das ist zugleich die 1..N Team-Nummerierung fürs eigene UI.
// league.teamInfo: {teamId: {name, id}}
async function mfhfbFetchFantraxLeague(leagueId) {
  const [draft, league] = await Promise.all([
    mfhfbFetchJson(`${FANTRAX_BASE}/getDraftResults?leagueId=${encodeURIComponent(leagueId)}`),
    mfhfbFetchJson(`${FANTRAX_BASE}/getLeagueInfo?leagueId=${encodeURIComponent(leagueId)}`),
  ]);
  return { draft, league };
}
