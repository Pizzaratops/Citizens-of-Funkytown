#!/usr/bin/env python3
# ============================================================
#  BBM PLAYER RANKINGS (.xls) -> data/last-season-stats-YYYY-YY.js
# ============================================================
#  Konvertiert einen BBM (Basketball Monster) "Player Rankings"-Export
#  (volle Saison, alle Spieler) in das JS-Datenformat, das
#  scripts/build-best-available-board.js erwartet.
#
#  Der Export ist eine manuelle Datei ohne scriptbaren Endpunkt (BBM
#  bietet dafuer keine oeffentliche API) -- deshalb kein automatischer
#  taeglicher Workflow-Schritt, sondern einmal pro Saison von Hand
#  ausfuehren, nachdem Beyaz die aktuelle .xls hochgeladen hat.
#
#  Erwartete Spalten im Export: Name, Team, Pos, g, m/g, p/g, r/g,
#  a/g, s/g, b/g, 3/g, to/g, fg%, ft%, pV, 3V, rV, aV, sV, bV, fg%V,
#  ft%V, toV (Kategorie-Z-Scores).
#
#  Usage:
#    pip install pandas xlrd --break-system-packages
#    python3 scripts/convert-bbm-last-season.py path/zur/export.xls 2025-26
#  -> schreibt data/last-season-stats-2025-26.js
# ============================================================

import sys
import json
import pandas as pd

def r1(v):
    return round(float(v), 1) if pd.notna(v) else 0

def r2(v):
    return round(float(v), 2) if pd.notna(v) else 0

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 convert-bbm-last-season.py <input.xls> <season, z.B. 2026-27>")
        sys.exit(1)

    input_path = sys.argv[1]
    season = sys.argv[2]
    season_var = season.replace('-', '_')
    out_path = f"data/last-season-stats-{season}.js"

    engine = 'xlrd' if input_path.lower().endswith('.xls') else None
    df = pd.read_excel(input_path, sheet_name=0, engine=engine)

    lines = []
    for _, row in df.iterrows():
        zScores = {
            'pts': r2(row['pV']), 'tpm': r2(row['3V']), 'reb': r2(row['rV']),
            'ast': r2(row['aV']), 'stl': r2(row['sV']), 'blk': r2(row['bV']),
            'fgImpact': r2(row['fg%V']), 'ftImpact': r2(row['ft%V']), 'to': r2(row['toV']),
        }
        composite = round(sum(zScores.values()), 2)
        zStr = ', '.join(f'{k}: {v}' for k, v in zScores.items())
        name = json.dumps(str(row['Name']))
        team = json.dumps(str(row['Team'])) if pd.notna(row['Team']) else 'null'
        pos = json.dumps(str(row['Pos'])) if pd.notna(row['Pos']) else 'null'
        games = int(row['g']) if pd.notna(row['g']) else 0
        lines.append(
            f"  {{ name: {name}, team: {team}, pos: {pos}, games: {games}, min: {r1(row['m/g'])}, "
            f"pts: {r1(row['p/g'])}, reb: {r1(row['r/g'])}, ast: {r1(row['a/g'])}, stl: {r2(row['s/g'])}, "
            f"blk: {r2(row['b/g'])}, tpm: {r1(row['3/g'])}, to: {r1(row['to/g'])}, "
            f"fgPct: {r1(row['fg%'] * 100) if pd.notna(row['fg%']) else 0}, "
            f"ftPct: {r1(row['ft%'] * 100) if pd.notna(row['ft%']) else 0}, "
            f"zScores: {{ {zStr} }}, composite: {composite} }}"
        )

    out = f"""// ============================================================
//  LAST SEASON STATS {season} — BBM Player Rankings (voller Export)
// ============================================================
//  Statischer Snapshot — siehe scripts/convert-bbm-last-season.py.
//  NICHT automatisch aktualisiert.
// ============================================================

const LAST_SEASON_STATS_{season_var} = [
""" + ',\n'.join(lines) + """
];
"""

    with open(out_path, 'w') as f:
        f.write(out)
    print(f"{out_path} geschrieben: {len(lines)} Spieler.")
    print("WICHTIG: In scripts/build-best-available-board.js den Dateinamen und Variablennamen")
    print(f"(LAST_SEASON_STATS_{season_var}) fuer die neue Saison aktualisieren.")

if __name__ == '__main__':
    main()
