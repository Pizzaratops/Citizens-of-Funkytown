# 🕺 Citizens of Funkytown

**Live:** https://pizzaratops.github.io/Citizens-of-Funkytown/ *(GitHub Pages ggf. noch unter Settings → Pages zu aktivieren)*

Fantasy-Basketball-Hub für eine 12-Team H2H 9-Category **Redraft**-Liga auf ESPN Fantasy Basketball (Liga-ID `15679`, aktiv seit 2018). Rosters, Trade-Analyse, Draft-Tools, Standings-Historie, Live Scores und mehr — automatisiert über GitHub Pages + GitHub Actions.

Dieses Repo ist ein Fork des Toolkits **[Taco Tuesday HQ](https://github.com/Pizzaratops/Taco-Tuesday-HQ)**, angepasst auf eine eigenständige, zweite Liga. Architektur, Automatisierung und Konventionen unten sind mit dem Original identisch — nur Liga-ID, Teams und Format unterscheiden sich.

---

## 🎯 Project Brief

**Was das ist.** Ein Werkzeugkasten für eine einzelne Liga auf ESPN Fantasy Basketball. Zwölf Teams, H2H über neun Kategorien, **Redraft-Format** (jede Saison neuer Draft, keine Keeper). Kein Produkt für Fremde, sondern ein Instrument, um in genau dieser Liga bessere Entscheidungen zu treffen: wen draften, wen traden, wen von der Waiver holen, wie die Woche ausgeht.

**Wofür es gebaut ist**

| Frage | Antwort auf der Seite |
|---|---|
| Wer läuft gerade heiß? | Live Scores (Weekly/Monthly), Saison-Rankings |
| Wie entwickelt sich jemand über die Saison? | Rolling Rankings |
| Wen kann ich noch holen? | Best Available, NBA Teams mit Fund-Hinweis |
| Wie geht meine Woche aus? | Matchup Planer |
| Was mache ich im Draft? | Draft Board |
| Lohnt sich der Trade? | Trade Analyzer |

**Grundsätze, die die Architektur erklären**

1. **Automatik vor Handarbeit.** Was ESPN liefert, wird abgerufen, nicht getippt. Alles Weitere entsteht täglich aus den Boxscores.
2. **Eine Quelle je Sachverhalt.** Die ESPN-Konfiguration (Liga-ID, Team-Mapping) liegt einzig in `js/espn-sync.js`, die Team-Stammdaten einzig in `data/teams-rosters.js` — beides wird gelesen, nicht kopiert.
3. **Z-Scores statt Rohzahlen.** In einer 9-Cat-Liga zählt jede Kategorie gleich, aber zehn Punkte sind Alltag und ein Block pro Spiel ist eine Ausnahme. Erst die Normierung macht einen Center mit Blocks gegen einen Guard mit Dreiern vergleichbar.
4. **Keine Zahl ohne Herkunft.** Wo eine Angabe geschätzt, genähert oder unvollständig ist, steht das auf der Seite.
5. **Lieber leer als erfunden.** Fehlen Daten, bleibt eine Seite leer und erklärt warum, statt eine Genauigkeit vorzutäuschen, die es nicht gibt.
6. **Ausfälle dürfen nichts kaputt machen.** Liefert ESPN unvollständig, bricht der Sync ab und der letzte gute Stand bleibt stehen. Scripts sind wiederholbar ohne Doppelzählung und schreiben nur nach `data/`.

**Bewusste Grenzen**

- Kein Backend. Alles läuft als statische Seite auf GitHub Pages, Datenaufbereitung passiert vorab in GitHub Actions.
- Der Matchup Planer kennt keine Positionsvorgaben bei der automatischen Aufstellung.
- Prozentwerte werden nach Minuten gewichtet, nicht nach Wurfversuchen, weil die Rankings-Quellen keine Versuche mitliefern.
- Redraft-Liga: Dynasty-Rankings/Keeper-Logik aus dem Original-Toolkit sind vorhanden, aber für diese Liga nicht relevant und standardmäßig nicht befüllt.

---

## 🆕 Stand der Migration (2026-08-17)

Dieses Repo wurde per GitHub-Import 1:1 aus Taco Tuesday HQ übernommen. Bisher angepasst:

- **`js/espn-sync.js`:** `ESPN_LEAGUE_ID` auf `15679` gesetzt, `ESPN_TO_TT_TEAM`-Mapping komplett neu für die 12 Teams dieser Liga aufgebaut.
- **`data/teams-rosters.js`:** `TEAMS`-Array mit den 12 echten Teams/Ownern dieser Liga (Namen, Farben) neu befüllt. `ROSTERS` ist aktuell noch **leer** — wird beim ersten Lauf von `scripts/sync-espn-rosters.js` automatisch mit echten Kadern befüllt.

**Noch offen, bevor die App vollständig nutzbar ist:**

1. Ersten ESPN-Roster-Sync laufen lassen (Kader sind aktuell leer).
2. Historische Saisons/Trades/Draft-Picks aus ESPN übernehmen (Liga existiert seit 2018 — `previousSeasons: [2018 … 2026]`).
3. `data/rankings.js`, `data/dynasty-rolling.js` und weitere Dynasty-spezifische Dateien leeren oder deaktivieren, da diese Liga Redraft ist.
4. GitHub Actions Workflows (`.github/workflows/*.yml`) prüfen und ggf. auf die neue Liga-ID/Team-Anzahl umstellen — wurden beim Import unverändert mitkopiert.

---

## 🗺️ Architektur & Datenfluss

Reines Vanilla-JS + HTML/CSS, keine Build-Tools, kein Framework. Gehostet auf GitHub Pages, Datenpipeline läuft über GitHub Actions + Node.js-Scripts.

```
ESPN API (Rosters + Boxscores)
   │
   ├─► sync-espn-rosters.js  ──► data/rosters-live.js
   ├─► daily-9cat.js         ──► data/livescores-daily.js
   │        │
   │        └─► convert-to-livescores.js ──► data/livescores-aggregate.js (Weekly/Monthly)
   │                 │
   │                 └─► update-all-aggregates.js
   │                          │
   │                          ├─► build-offseason-rankings.js ──► data/offseason-rankings.js
   │                          └─► build-rolling-archive.js    ──► data/rolling-rankings-*.js
   │
   └─► build-best-available-board.js  ──► data/best-available-board.js
            (bündelt: Rankings, Rolling, Off-Season, Post-Draft, Live-Signal)
```

### Verknüpfungsmatrix

| Seite | Datenquelle(n) | Automatisch? |
|---|---|---|
| **Best Available** | `best-available-board.js` gegen `rosters-live.js` gefiltert | komplett automatisch |
| **Trade Analyzer** | `rankings.js` bzw. aktuelle Rankings-Quelle | folgt manuellen Updates sofort |
| **Live Scores** | `livescores-daily.js` + `livescores-aggregate.js` | komplett automatisch |
| **Draft Board** | `draft20XX.js` (jeweiliger Draft-Jahrgang) | manuell, einmal pro Saison |
| **Team Analytics** | `js/analytics.js` | ⚠️ im Original-Toolkit statisch/nicht automatisiert |

Details zu Gewichtungen und weiteren Quellen: siehe [Taco Tuesday HQ README](https://github.com/Pizzaratops/Taco-Tuesday-HQ#readme) — die Mechanik ist identisch, nur die Liga dahinter ist neu.

## 📁 Projektstruktur

```
index.html              Single-Page-App, alle Seiten als <div class="page">
css/                     Styles
js/                      Frontend-Logik (eine Datei pro Feature-Bereich)
  espn-sync.js           └ ESPN-Liga-Konfiguration (Liga-ID, Team-Mapping) — EINZIGE Quelle
data/                    Datendateien — teils statisch (von Hand gepflegt),
                         teils automatisch generiert
  teams-rosters.js       └ Team-Stammdaten (Namen, Owner, Farben) — EINZIGE Quelle
scripts/                 Node-Scripts für die tägliche GitHub Action
.github/workflows/       Die tägliche Automatisierung
```

### Wichtige Datendateien

| Datei | Quelle | Update |
|---|---|---|
| `data/teams-rosters.js` (`TEAMS`) | manuell gepflegt | von Hand, bei Team-/Owner-Änderungen |
| `data/rosters-live.js` | ESPN API | täglich automatisch |
| `data/livescores-daily.js` / `-aggregate.js` | ESPN Boxscores | täglich automatisch |
| `data/rolling-rankings-2026-27.js` | laufende Saison | täglich automatisch |
| `data/best-available-board.js` | alle Signale kombiniert | täglich automatisch |

## ⚙️ Die tägliche Automatisierung

`.github/workflows/daily-9cat.yml` läuft mehrfach täglich. Reihenfolge:

1. **ESPN Rosters synchronisieren** (`sync-espn-rosters.js`)
2. **Tagesdaten von ESPN holen** (`daily-9cat.js`)
3. **In `livescores-daily.js` konvertieren**
4. **Weekly/Monthly aktualisieren** (`update-all-aggregates.js`)
5. **Off-Season-Rankings fortschreiben**
6. **Rolling-Rankings-Archiv fortschreiben**
7. **Best Available Board fortschreiben**
8. **Cache-Buster setzen** (`bump-data-version.js`)
9. **Committen & pushen** (nur wenn sich tatsächlich was geändert hat)

Manueller Trigger jederzeit möglich über den "Run workflow"-Button (Actions-Tab → Daily 9cat Live Scores → Run workflow).

## 🧑‍💻 Lokal testen

```bash
node --check <datei>    # Syntax-Check vor jedem Commit
```

Alle Build-Scripts sind idempotent und schreiben nur nach `data/` — kein Risiko, etwas kaputt zu machen, einfach nochmal laufen lassen. **Eine Ausnahme:** `bump-data-version.js` schreibt in `index.html`, ändert dort aber ausschließlich die `?v=`-Parameter der `data/`-Skripte.

## 📝 Konventionen

- Deutschsprachige UI, keine Bindestriche in deutschen UI-Texten
- Keine Emojis in Datentabellen
- Keine Inline-Kommentare in generiertem Code, aber ausführliche Header-Kommentare in jeder Datei
- `normalizeName()` (siehe `data/aliases.js`) für alle Namens-Abgleiche zwischen Datenquellen
