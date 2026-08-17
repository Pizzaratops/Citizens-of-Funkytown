"""
MFHFBs NBA Projections — ADP Build Script
------------------------------------------------------------
Baut adp-data.js aus ZWEI unabhängigen Quellen:

1. EIGENE Draft Results (data/draft-results/*.csv, beliebig viele
   Dateien): Fantrax "Draft Results"-Exporte aus deinen tatsächlichen
   Ligen. Wird über die stabile Fantrax "Player ID" aggregiert, ADP =
   Durchschnitts-"Ov Pick" über alle eingelesenen Ligen. Mehr Dateien =
   akkurater. Landet im Output als "ownAdp" (+ "ownCount"/"ownMin"/
   "ownMax").

2. FANTRAX-ADP (data/fantrax-adp.csv, GENAU EINE Datei, gleiches
   CSV-Format): Fantrax' eigener aktueller ADP-Snapshot. Wird NICHT
   gemittelt (repräsentiert schon einen Durchschnitt über die ganze
   Fantrax-Plattform) — bei einem Update einfach diese eine Datei
   überschreiben, nicht zusätzliche Dateien anhäufen. Landet im Output
   als "fantraxAdp".

Beide Werte werden pro Spieler unabhängig voneinander gespeichert und
sind in draft.html als zwei separate, unabhängig sortierbare Spalten
nutzbar (ADP / F-ADP) — keine automatische Fallback-Verschmelzung.

Aggregiert/gematcht wird intern über die stabile Fantrax "Player ID",
der finale Key in adp-data.js ist aber der NORMALISIERTE Spielername —
dieselbe Normalisierung wie mfhfbNormalizeName() in assets/shared.js
(Akzente entfernt, lowercase, Punkte/Apostrophe/Bindestriche raus,
"Jr."/"II" am Ende ignoriert). Damit matched draft.html jeden Spieler
automatisch gegen PLAYER_RATES, ohne Zusatz-Mapping.

Nutzung (keine Argumente nötig):
    cd scripts
    python3 build-adp-data.py

Neue Draft Results hinzufügen: CSV-Datei einfach in data/draft-results/
ablegen (Dateiname ist egal) und das Skript erneut laufen lassen.
Neue Fantrax-ADP einspielen: data/fantrax-adp.csv überschreiben, Skript
erneut laufen lassen. Kein Code-Anfassen nötig.

Erwartete Spalten (Fantrax "Draft Results"-Export, für BEIDE Quellen):
    "Player ID","Round","Pick","Ov Pick","Pos","Player","Team","Fantasy Team","Time (CEST)"
"""

import csv
import glob
import json
import os
import re
import sys
import unicodedata

INPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "draft-results")
FANTRAX_ADP_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "fantrax-adp.csv")
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "adp-data.js")


def normalize_name(name: str) -> str:
    """Identische Regeln wie mfhfbNormalizeName() in assets/shared.js —
    NICHT unabhängig ändern, sonst matchen ADP_DATA und PLAYER_RATES
    nicht mehr gegeneinander."""
    name = name or ""
    name = unicodedata.normalize("NFD", name)
    name = "".join(c for c in name if unicodedata.category(c) != "Mn")  # Akzente entfernen
    name = name.lower()
    name = re.sub(r"[.'-]", "", name)  # Punkte, Apostrophe, Bindestriche
    name = re.sub(r"\s+jr$", "", name)  # "Jr." am Ende ignorieren
    name = re.sub(r"\s+ii+$", "", name)  # "II"/"III" am Ende ignorieren
    name = re.sub(r"\s+", " ", name).strip()
    return name


def load_own_draft_results():
    """Liest alle CSVs aus data/draft-results/ und berechnet pro Spieler
    den eigenen ADP (Mittelwert über alle Ligen). Rückgabe: dict
    normalisierter_name -> {name, adp, count, min, max, team, pos, picks}.
    "picks" ist die volle Liste aller einzelnen Draft-Positionen (+ aus
    welcher Datei/Liga sie stammen) — die "Draft Range" fürs Klick-Popover
    auf die ADP-Zelle in draft.html, aus denselben Rohdaten gespeist statt
    verworfen."""
    files = sorted(glob.glob(os.path.join(INPUT_DIR, "*.csv")))
    if not files:
        print(f"Keine eigenen Draft-Result-CSVs in {INPUT_DIR} gefunden (übersprungen).")
        return {}

    print(f"Gefundene eigene Draft-Result-Dateien: {len(files)}")

    # player_id -> {name, team, pos, picks: [{pick, source}, ...]}
    players = {}
    leagues_processed = 0
    skipped_rows = 0

    for path in files:
        # Dateiname (ohne Endung) als grobes Liga-Label fürs Popover, z.B.
        # "Fantrax-Draft-Results-AUTO-H2H01" -> "H2H01". Rein kosmetisch,
        # kein stabiler Identifier, nur zur Einordnung "aus welcher Liga".
        source_label = os.path.splitext(os.path.basename(path))[0]
        with open(path, encoding="utf-8-sig", newline="") as fh:
            rows = list(csv.DictReader(fh))
        if not rows:
            continue
        leagues_processed += 1

        for row in rows:
            pid = row.get("Player ID")
            name = row.get("Player")
            try:
                ov_pick = int(row.get("Ov Pick", ""))
            except (TypeError, ValueError):
                ov_pick = None

            if not pid or not name or ov_pick is None:
                skipped_rows += 1  # meist unvollständige letzte Runde eines Drafts
                continue

            entry = players.setdefault(
                pid, {"name": name, "team": row.get("Team", ""), "pos": row.get("Pos", ""), "picks": []}
            )
            entry["name"] = name
            entry["team"] = row.get("Team") or entry["team"]
            entry["pos"] = row.get("Pos") or entry["pos"]
            entry["picks"].append({"pick": ov_pick, "source": source_label})

    if skipped_rows:
        print(f"Warnung: {skipped_rows} Zeile(n) übersprungen (fehlende Felder, z.B. unvollständige letzte Runde).")

    out = {}
    for pid, p in players.items():
        picks = p["picks"]
        pick_nums = [pk["pick"] for pk in picks]
        key = normalize_name(p["name"])
        out[key] = {
            "name": p["name"],
            "adp": round(sum(pick_nums) / len(pick_nums), 1),
            "count": len(pick_nums),
            "min": min(pick_nums),
            "max": max(pick_nums),
            "team": p["team"],
            "pos": p["pos"],
            "picks": sorted(picks, key=lambda pk: pk["pick"]),
        }
    print(f"  -> {len(out)} Spieler aus {leagues_processed} eigenen Ligen aggregiert.")
    return out


def load_fantrax_adp():
    """Liest data/fantrax-adp.csv (GENAU EINE Datei, kein Ordner) —
    Fantrax' eigener ADP-Snapshot, wird nicht gemittelt, sondern 1:1
    übernommen. Rückgabe: dict normalisierter_name -> {name, adp, team, pos}."""
    if not os.path.exists(FANTRAX_ADP_PATH):
        print(f"Keine Fantrax-ADP-Datei unter {FANTRAX_ADP_PATH} gefunden (übersprungen).")
        return {}

    with open(FANTRAX_ADP_PATH, encoding="utf-8-sig", newline="") as fh:
        rows = list(csv.DictReader(fh))

    out = {}
    skipped_rows = 0
    for row in rows:
        name = row.get("Player")
        try:
            ov_pick = int(row.get("Ov Pick", ""))
        except (TypeError, ValueError):
            ov_pick = None
        if not name or ov_pick is None:
            skipped_rows += 1
            continue
        key = normalize_name(name)
        out[key] = {"name": name, "adp": ov_pick, "team": row.get("Team", ""), "pos": row.get("Pos", "")}

    if skipped_rows:
        print(f"Warnung: {skipped_rows} Zeile(n) in fantrax-adp.csv übersprungen.")
    print(f"Fantrax-ADP geladen: {len(out)} Spieler.")
    return out


def build() -> None:
    own_adp = load_own_draft_results()
    fantrax_adp = load_fantrax_adp()

    if not own_adp and not fantrax_adp:
        print("\nWeder eigene Draft Results noch Fantrax-ADP gefunden — nichts zu tun.")
        sys.exit(1)

    all_keys = set(own_adp.keys()) | set(fantrax_adp.keys())
    adp_data = {}
    for key in all_keys:
        own = own_adp.get(key)
        fx = fantrax_adp.get(key)
        adp_data[key] = {
            "name": (own or fx)["name"],
            "ownAdp": own["adp"] if own else None,
            "ownCount": own["count"] if own else 0,
            "ownMin": own["min"] if own else None,
            "ownMax": own["max"] if own else None,
            "ownPicks": own["picks"] if own else [],
            "fantraxAdp": fx["adp"] if fx else None,
            "team": (own or {}).get("team") or (fx or {}).get("team", ""),
            "pos": (own or {}).get("pos") or (fx or {}).get("pos", ""),
        }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write("// MFHFBs NBA Projections — ADP-Daten (Output von scripts/build-adp-data.py)\n")
        f.write(f"// Eigene Draft Results: {len(own_adp)} Spieler | Fantrax-ADP: {len(fantrax_adp)} Spieler\n")
        f.write("// Key = normalisierter Spielername (siehe mfhfbNormalizeName in assets/shared.js)\n")
        f.write("// Felder: ownAdp/ownCount/ownMin/ownMax/ownPicks (aus data/draft-results/), fantraxAdp (aus data/fantrax-adp.csv)\n")
        f.write("// NICHT MANUELL BEARBEITEN — Skript erneut laufen lassen, nachdem neue CSVs abgelegt wurden.\n")
        f.write("const ADP_DATA = ")
        f.write(json.dumps(adp_data, indent=1, ensure_ascii=False))
        f.write(";\n")

    with_own = [d for d in adp_data.values() if d["ownAdp"] is not None]
    with_fx = [d for d in adp_data.values() if d["fantraxAdp"] is not None]
    with_own.sort(key=lambda d: d["ownAdp"])
    with_fx.sort(key=lambda d: d["fantraxAdp"])

    print(f"\n{len(adp_data)} Spieler gesamt -> {OUTPUT_PATH}")
    print(f"  davon mit eigenem ADP: {len(with_own)}, mit Fantrax-ADP: {len(with_fx)}")
    print("\nTop 10 nach eigenem ADP:")
    for i, p in enumerate(with_own[:10], 1):
        print(f"  {i}. {p['name']:<28} ADP {p['ownAdp']:>5.1f}  (n={p['ownCount']}, range {p['ownMin']}-{p['ownMax']})")
    print("\nTop 10 nach Fantrax-ADP:")
    for i, p in enumerate(with_fx[:10], 1):
        print(f"  {i}. {p['name']:<28} F-ADP {p['fantraxAdp']:>5}")


if __name__ == "__main__":
    build()
