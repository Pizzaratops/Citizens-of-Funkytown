// ============================================================
//  ROSTER OVERRIDES — manuelle Admin-Korrekturen an Kadern
// ============================================================
//  Speichert Zu- und Abgaenge pro Team im localStorage dieses
//  Geraets (Admin Settings → Spieler verwalten, Inline-Edit auf der
//  Teamseite). _applyRosterOverrides() in js/admin.js legt sie beim
//  Laden ueber den ESPN-Stand. Rein lokal, fuer andere unsichtbar.
//
//  Hiess bis 2026-09-23 js/trade-admin.js. Das Speichern von Trades
//  in die Trade History wurde fuer diese Redraft-Liga entfernt, nur
//  die Override-Helfer sind geblieben.
// ============================================================

// Schluessel bewusst unveraendert, damit bestehende Overrides erhalten bleiben.
const ROSTER_OVERRIDE_KEY = 'taco_roster_overrides_v1';

function loadRosterOverrides() {
  try {
    const raw = localStorage.getItem(ROSTER_OVERRIDE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e) { return {}; }
}

function saveRosterOverrides(overrides) {
  try {
    localStorage.setItem(ROSTER_OVERRIDE_KEY, JSON.stringify(overrides));
  } catch(e) {}
}
