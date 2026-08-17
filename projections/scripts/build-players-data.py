"""
MFHFBs NBA Projections — Build Script (Mehrjahres-Version)
------------------------------------------------------------
Liest mehrere Saison-Rohdaten-Exports (Excel, BBM-Format) ein und
berechnet pro Spieler und Saison Pro-Minute-Raten. Alle Saisons werden
in players-data.js gemeinsam gespeichert — die Gewichtung (Slider auf
der Seite: 1 / 1.25 / 1.5 / 1.75 / 2 für die beiden jüngsten Saisons,
ältere Saisons fix mit Gewicht 1) passiert danach live im Browser.

Nutzung:
    python3 build-players-data.py <output.js> <saison_label>=<datei.xls> [...]

Beispiel:
    python3 build-players-data.py ../players-data.js \\
        2023-24=../data/Player_Rankings_23-24.xls \\
        2024-25=../data/Player_Rankings_24-25.xls \\
        2025-26=../data/Player_Rankings_25-26.xls

Erwartete Spalten in jeder Eingabedatei (BBM-Exportformat):
    Name, Team, Pos, g (Games Played), m/g (Minutes/Game),
    p/g, 3/g, r/g, a/g, s/g, b/g, fg/g, fga/g, ft/g, fta/g, to/g

Saison-Label-Reihenfolge im Aufruf ist nicht relevant — das Skript
sortiert die Saisons chronologisch anhand des Labels (z.B. "2023-24"
vor "2024-25" vor "2025-26"), bevor es die Daten schreibt.
"""

import sys
import json
import pandas as pd

RATE_COLUMNS = {
    "pts": "p/g",
    "fg3m": "3/g",
    "reb": "r/g",
    "ast": "a/g",
    "stl": "s/g",
    "blk": "b/g",
    "fgm": "fg/g",
    "fga": "fga/g",
    "ftm": "ft/g",
    "fta": "fta/g",
    "tov": "to/g",
}


def parse_season(path: str) -> dict:
    """Liest eine Saison-Datei und gibt {name: {team,pos,gp,mpg,rates}} zurück."""
    df = pd.read_excel(path)
    out = {}
    for _, row in df.iterrows():
        mpg = row.get("m/g")
        if pd.isna(mpg) or mpg <= 0:
            continue

        def rate(col: str) -> float:
            v = row.get(col)
            if pd.isna(v):
                v = 0
            return round(v / mpg, 5)

        out[row["Name"]] = {
            "team": row["Team"],
            "pos": row["Pos"],
            "gp": int(row["g"]) if not pd.isna(row["g"]) else 0,
            "mpg": round(mpg, 2),
            "rates": {key: rate(col) for key, col in RATE_COLUMNS.items()},
        }
    return out


def build(output_path: str, season_args: list) -> None:
    season_data = {}
    for arg in season_args:
        label, path = arg.split("=", 1)
        season_data[label] = parse_season(path)
        print(f"  {label}: {len(season_data[label])} Spieler aus {path}")

    season_labels = sorted(season_data.keys())  # chronologisch, z.B. "2023-24" < "2024-25"

    all_names = set()
    for d in season_data.values():
        all_names.update(d.keys())

    players = []
    for name in all_names:
        seasons = {}
        for label in season_labels:
            if name in season_data[label]:
                seasons[label] = season_data[label][name]
        if not seasons:
            continue

        # Zwischen dem Debüt und der insgesamt jüngsten geladenen Saison
        # werden fehlende Saisons explizit als "missed" (0 GP) markiert —
        # das erfasst sowohl Lücken mittendrin als auch eine komplett
        # verpasste aktuellste Saison (z.B. Verletzung). Saisons VOR dem
        # Debüt bleiben bewusst aus dem seasons-Objekt raus ("war noch
        # nicht in der Liga" statt "hat 0 Spiele gemacht").
        played_labels = sorted(seasons.keys())
        debut = played_labels[0]
        last_played = played_labels[-1]
        newest_overall = season_labels[-1]
        for label in season_labels:
            if debut <= label <= newest_overall and label not in seasons:
                seasons[label] = {"team": None, "pos": None, "gp": 0, "mpg": 0, "missed": True}

        # Team/Pos aus der juengsten *tatsaechlich gespielten* Saison
        latest_played = seasons[last_played]
        players.append({
            "name": name,
            "team": latest_played["team"],
            "pos": latest_played["pos"],
            "seasons": seasons,
        })

    # Standard-Sortierung: projizierte Punkte der juengsten gespielten Saison absteigend
    def sort_key(p):
        played = {l: s for l, s in p["seasons"].items() if not s.get("missed")}
        latest_label = max(played.keys())
        s = played[latest_label]
        return -(s["rates"]["pts"] * s["mpg"])

    players.sort(key=sort_key)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("// MFHFBs NBA Projections — per-minute rate data (mehrere Saisons)\n")
        f.write(f"// Saisons: {', '.join(season_labels)}\n")
        f.write("const SEASON_LABELS = ")
        f.write(json.dumps(season_labels))
        f.write(";\n")
        f.write("const PLAYER_RATES = ")
        f.write(json.dumps(players, indent=1, ensure_ascii=False))
        f.write(";\n")

    print(f"\n{len(players)} Spieler gesamt -> {output_path}")
    print(f"Saisons (chronologisch): {season_labels}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Nutzung: python3 build-players-data.py <output.js> <saison_label>=<datei.xls> [...]")
        sys.exit(1)
    build(sys.argv[1], sys.argv[2:])
