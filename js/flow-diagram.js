// ============================================================
//  DATA FLOW DIAGRAM — Home-Seite, unterhalb des Team-Grids
// ============================================================
//  Rendert die komplette Stat-Pipeline als Stufen-Diagramm in
//  #flowDiagram. Rein deklarativ: die Pipeline steht als Daten in
//  FLOW_STAGES, das Rendering darunter ist generisch. Wenn sich am
//  Ablauf etwas aendert, reicht es, FLOW_STAGES anzupassen.
//
//  Styling: css/flow.css (nutzt die globalen Theme-Variablen, also
//  Dark und Light ohne Sonderfall).
//
//  Zwei Ansichten:
//    kompakt     — nur Karten mit Kurzbeschreibung
//    ausfuehrlich — zusaetzlich die .flow-detail-Bloecke (Zeitpunkte,
//                   Gewichtungen, Dateinamen im Detail)
// ============================================================

const FLOW_STAGES = [
  {
    num: '01',
    name: 'Quelle',
    note: 'Alles startet bei ESPN. Nichts davon wird von Hand gepflegt.',
    connector: 'Automatischer Abruf über GitHub Actions',
    cards: [
      {
        icon: '🏀', kind: 'source', title: 'NBA Boxscores',
        text: 'Jeden Spieltag werden die kompletten Boxscores aller Partien abgerufen, Spieler für Spieler.',
        files: ['scripts/daily-9cat.js'],
        badge: '3× täglich',
        detail: [
          ['Läufe', '06:00, 08:00 und 22:00 Uhr Berliner Zeit. Der späte Lauf holt Spiele nach, die zum Morgenlauf noch nicht beendet waren.'],
          ['Datum', 'ESPN katalogisiert Spieltage nach US-Zeit, nicht nach UTC. Der Abruf rechnet deshalb explizit um, sonst fehlt regelmäßig ein Tag.'],
          ['Ausfall', 'GitHub verwirft geplante Läufe unter Last. Ein externer Trigger stößt den Workflow zusätzlich an, alle Läufe sind wiederholbar ohne Doppelzählung.'],
        ],
      },
      {
        icon: '👥', kind: 'source', title: 'Fantasy Rosters',
        text: 'Wer aktuell wem gehört, kommt direkt aus der ESPN Liga. Trades werden automatisch erkannt.',
        files: ['scripts/sync-espn-rosters.js'],
        badge: 'täglich',
        detail: [
          ['Ziel', 'data/rosters-live.js. Manuelle Korrekturen im Admin bleiben erhalten und werden obendrauf gelegt.'],
          ['Schutz', 'Liefert ESPN eine unvollständige Antwort, bricht der Sync ab statt den letzten guten Stand zu überschreiben.'],
          ['Cache', 'Nach jedem Lauf bekommt jede Datendatei in index.html eine Versionsnummer aus ihrem Inhalt. Ohne das liefern Browser die alte Fassung aus, obwohl im Repo längst die neue liegt.'],
        ],
      },
    ],
  },
  {
    num: '02',
    name: 'Rohdaten',
    note: 'Der unveränderte Tagesstand, aus dem alles Weitere entsteht.',
    connector: 'Pro Spieler und Spieltag eine Zeile',
    cards: [
      {
        icon: '📥', kind: 'data', title: 'Tageswerte',
        text: 'Ein Eintrag je Spieler und Spieltag mit allen neun Kategorien plus Minuten und Spielen.',
        files: ['data/livescores-daily.js'],
        detail: [
          ['Kategorien', 'PTS, REB, AST, STL, BLK, 3PM, TO sowie FG und FT jeweils als Treffer und Versuche.'],
          ['Prozente', 'FG% und FT% werden immer aus Treffern und Versuchen neu berechnet, nie aus Tagesprozenten gemittelt.'],
        ],
      },
      {
        icon: '📋', kind: 'data', title: 'Aktuelle Kader',
        text: 'Der Stand aller zwölf Teams inklusive Position und NBA Team je Spieler.',
        files: ['data/rosters-live.js'],
      },
      {
        icon: '🏷️', kind: 'script', title: 'Besitz-Zuordnung',
        text: 'Beantwortet an einer einzigen Stelle, wem ein Spieler gehört. Wer nirgends auftaucht, ist Free Agent.',
        files: ['js/fantasy-owner.js'],
        detail: [
          ['Genutzt von', 'Projections, NBA Teams und Best Available. Vorher stand die Logik nur an einer Stelle, beim Ausweiten wäre sie sonst dreimal kopiert worden.'],
          ['Warum geteilt', 'Der Namensabgleich ist die empfindlichste Stelle. Drei Kopien heißen drei Orte, an denen Aliase und Umlaute auseinanderlaufen können.'],
          ['Aktualität', 'Der Index wird bei jedem Rendern verworfen und neu gebaut, sonst zeigt die Seite nach einem Trade oder einer Adminänderung noch den Besitz von vorher.'],
        ],
      },
    ],
  },
  {
    num: '03',
    name: 'Aggregation',
    note: 'Aus Tageswerten werden rollierende Fenster mit Z-Scores.',
    connector: 'Zwei Fenster parallel, jeden Tag neu berechnet',
    cards: [
      {
        icon: '📆', kind: 'script', title: 'Weekly',
        text: 'Rollierendes Fenster über die letzten sieben Tage. Zeigt, wer gerade heiß läuft.',
        files: ['scripts/update-all-aggregates.js'],
        detail: [
          ['Fenster', 'Verschiebt sich täglich mit, umfasst immer die letzten sieben Kalendertage.'],
          ['Filter', 'Eine Mindestanzahl Spiele verhindert, dass ein einzelnes starkes Spiel die Liste anführt.'],
        ],
      },
      {
        icon: '🗓️', kind: 'script', title: 'Monthly',
        text: 'Rollierendes Fenster über dreißig Tage. Deutlich stabiler, gut für echte Formtrends.',
        files: ['scripts/update-all-aggregates.js'],
      },
      {
        icon: '🧮', kind: 'data', title: 'Z-Scores je Kategorie',
        text: 'Jede Kategorie wird gegen den Ligadurchschnitt normiert, sodass Punkte und Blocks vergleichbar werden.',
        files: ['data/livescores-aggregate.js'],
        detail: [
          ['Prinzip', 'Ein Z-Score sagt, wie viele Standardabweichungen ein Spieler über oder unter dem Durchschnitt liegt.'],
          ['FG und FT', 'Fließen als Impact ein, also Prozentsatz gewichtet mit dem Volumen. Ein Spieler mit 100% aus zwei Versuchen bewegt fast nichts.'],
          ['Composite', 'Die Summe aller neun Z-Scores. Das ist die Zahl, nach der sortiert wird.'],
        ],
      },
    ],
  },
  {
    num: '04',
    name: 'Archiv',
    note: 'Abgeschlossene Zeiträume werden dauerhaft festgeschrieben.',
    connector: 'Einmal geschrieben, nie wieder verändert',
    cards: [
      {
        icon: '🔒', kind: 'data', title: 'Rolling Rankings',
        text: 'Jede Kalenderwoche und jeder Monat bekommt genau einen dauerhaften Eintrag, sobald der Zeitraum vorbei ist.',
        files: ['data/rolling-rankings-2026-27.js'],
        detail: [
          ['Unterschied', 'Die Aggregate oben sind ein bewegliches Fenster und kappen alte Stichtage. Das Archiv wächst nur und wird nie gekürzt.'],
          ['Nutzen', 'Damit lässt sich der Verlauf über die Saison zeichnen, statt nur den Momentzustand zu sehen.'],
        ],
      },
      {
        icon: '☀️', kind: 'data', title: 'Off Season Rankings',
        text: 'Summer League und Preseason kumulativ über den gesamten Zeitraum, nicht rollierend.',
        files: ['data/offseason-rankings.js'],
      },
    ],
  },
  {
    num: '05',
    name: 'Projections',
    note: 'Erwartung und Realität werden gegeneinander verrechnet.',
    connector: 'Je mehr Spiele gespielt sind, desto stärker zählt die Realität',
    cards: [
      {
        icon: '🎯', kind: 'data', title: 'Preseason Baseline',
        text: 'Die vor Saisonstart einmal festgelegte Erwartung je Spieler. Der einzige Teil der Pipeline, der von Hand kommt.',
        files: ['data/projections-baseline.js'],
      },
      {
        icon: '🔮', kind: 'script', title: 'Live Blend',
        text: 'Baseline und tatsächliche Saisonstatistik werden gemischt. Am Saisonanfang dominiert die Baseline, später die echten Zahlen.',
        files: ['scripts/build-live-projections.js', 'data/live-projections.js'],
        detail: [
          ['Formel', 'Die Baseline zählt wie eine feste Anzahl fiktiver Spiele. Kommen echte Spiele dazu, verschiebt sich das Gewicht automatisch Richtung Realität.'],
          ['Effekt', 'Ein starker Saisonstart hebt die Projection sofort spürbar, aber nicht sprunghaft. Nach etwa zwanzig Spielen ist die Baseline weitgehend verdrängt.'],
        ],
      },
    ],
  },
  {
    num: '06',
    name: 'Gewichtung',
    note: 'Nicht jede Kategorie zählt gleich viel für den Gesamtwert.',
    connector: 'Gilt für Rolling Rankings und die abgeleiteten Boards',
    cards: [
      {
        icon: '⚖️', kind: 'script', title: 'Kategorie-Gewichte',
        text: 'Rebounds und Assists zählen voll, Punkte etwas weniger, Turnover fast gar nicht. Gespielte Spiele fließen bewusst nicht ein.',
        detail: [
          ['Voll', 'REB 1,0 · AST 1,0 · FG% 1,0'],
          ['Punkte', 'PTS 0,9 — Punkte sind in fast jedem Kader reichlich vorhanden und daher weniger knapp.'],
          ['FT%', 'FT% 0,85'],
          ['Knapp', 'STL 0,75 · BLK 0,75 · 3PM 0,75 — geringes Volumen, entsprechend hohe Zufallsschwankung.'],
          ['Turnover', 'TO 0,25 — Ballverluste korrelieren stark mit Ballbesitz und bestrafen sonst gute Spieler doppelt.'],
        ],
      },
      {
        icon: '🎚️', kind: 'view', title: 'Punt-Gewichtung',
        text: 'Auf der Live Scores Seite lässt sich jede Kategorie selbst von null bis doppelt drehen, um eine Punt-Strategie durchzurechnen.',
        page: 'showLiveScores',
      },
    ],
  },
  {
    num: '07',
    name: 'Ansichten',
    note: 'Was am Ende auf dieser Seite sichtbar wird.',
    connector: 'Alles hierunter greift auf dieselbe Datenbasis zu',
    cards: [
      {
        icon: '🔴', kind: 'view', title: 'Live Scores',
        text: 'Weekly und Monthly nebeneinander, mit Punt-Gewichtung, Mindestspielen und CSV Export.',
        page: 'showLiveScores',
      },
      {
        icon: '🏅', kind: 'view', title: '2026/27 Rankings',
        text: 'Die Z-Score Rangliste aller Spieler, getrennt nach Off Season und regulärer Saison.',
        page: 'showPlayerRankings',
      },
      {
        icon: '📈', kind: 'view', title: 'Rolling Rankings',
        text: 'Der Rangverlauf über die Saison hinweg, Woche für Woche aus dem Archiv gezeichnet.',
        page: 'showRollingRankings',
      },
      {
        icon: '🆓', kind: 'view', title: 'Best Available',
        text: 'Freie Spieler nach einem zusammengesetzten Wert aus Dynasty Rang, Preseason, aktueller Form und Draft Kapital. Filterbar nach NBA Team.',
        page: 'showBestAvail',
      },
      {
        icon: '⚖️', kind: 'view', title: 'Trade Analyzer',
        text: 'Bewertet beide Seiten eines Trades über Dynasty Rang und Alter.',
        page: 'showTrade',
      },
      {
        icon: '🏀', kind: 'view', title: 'NBA Teams',
        text: 'Rotation und Minuten je NBA Team, daneben die tatsächliche End-Rotation der Vorsaison zum Vergleich.',
        page: 'showLiveProjTeams',
        detail: [
          ['Fund-Hinweis', 'Freie Spieler ab einer wählbaren Minutenschwelle werden markiert. Viel Rolle in der NBA, aber in keinem Kader der Liga, ist der interessanteste Fall auf dieser Seite.'],
          ['Schwelle', 'Standard 24 Minuten, umstellbar auf 18 oder 30 oder ganz aus.'],
        ],
      },
      {
        icon: '🏆', kind: 'view', title: 'Fantrax Redraft',
        text: 'Live-Draft-Tracker für die Fantrax Redraft Ligen, mit Besitzquote und ADP über alle Ligen hinweg.',
        page: 'showLiveProjDraft',
        detail: [
          ['Meine Spieler', 'Zeigt je Spieler, in wie vielen Ligen er mir gehört, wie früh er im Schnitt ging und wie früh ich ihn geholt habe.'],
          ['Nicht verwechseln', 'Das ist der Redraft in fremden Ligen. Die Boards unter Draft bilden den Dynasty Rookie Draft der Taco Tuesday League ab.'],
        ],
      },
      {
        icon: '⚔️', kind: 'new', title: 'Matchup Planer',
        text: 'Stellt zwei Kader über alle neun Kategorien gegenüber, auf Basis der real angesetzten NBA Spiele der Woche.',
        page: 'showMatchupPlanner',
        badge: 'neu',
        badgeHot: true,
      },
    ],
  },
];

function renderFlowDiagram() {
  const host = document.getElementById('flowDiagram');
  if (!host) return;

  const parts = [];

  FLOW_STAGES.forEach((stage, si) => {
    const cards = stage.cards.map(c => {
      const files = (c.files || [])
        .map(f => `<span class="flow-card-file">${_flowEsc(f)}</span>`).join('');

      const detail = (c.detail && c.detail.length)
        ? `<div class="flow-detail"><div class="flow-detail-list">${
            c.detail.map(([k, v]) =>
              `<div class="flow-detail-row"><span class="flow-detail-key">${_flowEsc(k)}</span><span>${_flowEsc(v)}</span></div>`
            ).join('')
          }</div></div>`
        : '';

      const badge = c.badge
        ? `<span class="flow-card-badge${c.badgeHot ? ' hot' : ''}">${_flowEsc(c.badge)}</span>`
        : '';

      // Nur verlinken, wenn die Zielfunktion wirklich existiert — sonst
      // waere die Karte klickbar, ohne dass etwas passiert.
      const linked = c.page && typeof window[c.page] === 'function';
      const click = linked ? ` onclick="${c.page}()"` : '';

      return `<div class="flow-card is-${c.kind}${linked ? ' clickable' : ''}"${click}>
        <div class="flow-card-top">
          <span class="flow-card-icon">${c.icon}</span>
          <span class="flow-card-title">${_flowEsc(c.title)}</span>
          ${badge}
        </div>
        <div class="flow-card-text">${_flowEsc(c.text)}</div>
        ${files}
        ${detail}
      </div>`;
    }).join('');

    parts.push(`<div class="flow-stage">
      <div class="flow-stage-side">
        <div class="flow-stage-num">STUFE ${stage.num}</div>
        <div class="flow-stage-name">${_flowEsc(stage.name)}</div>
        <div class="flow-stage-note">${_flowEsc(stage.note)}</div>
      </div>
      <div class="flow-cards">${cards}</div>
    </div>`);

    if (si < FLOW_STAGES.length - 1 && stage.connector) {
      parts.push(`<div class="flow-connector">
        <div class="flow-connector-line">
          <span class="flow-connector-arrow">▼</span>
          <span class="flow-connector-label">${_flowEsc(stage.connector)}</span>
        </div>
      </div>`);
    }
  });

  host.innerHTML = parts.join('');
}

function _flowEsc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ============================================================
//  FLOW-CHART-ANSICHT — dieselben FLOW_STAGES als echtes
//  Boxen-und-Pfeile-Diagramm statt Kartenraster. Wird als SVG
//  gerendert, damit es sich (wie der Rest der Seite) frei
//  skaliert und ohne externe Library auskommt.
//
//  Layout: Stufe für Stufe von oben nach unten. Je Stufe eine
//  Zeile aus Boxen (eine je Karte), dazwischen ein einzelner
//  Pfeil von der Zeilenmitte zur naechsten Zeilenmitte -- das
//  entspricht genau dem "connector"-Text, der in der Kartenan-
//  sicht schon zwischen den Stufen steht, nur jetzt als echte
//  Linie mit Pfeilspitze statt als Text mit ▼-Symbol.
//
//  Textumbruch ist eine grobe Schaetzung (Zeichenbreite ≈ 0.58
//  × Schriftgroesse), keine echte Textmessung -- bei den kurzen,
//  kuratierten Titeln reicht das. Faellt ein Titel doch zu lang
//  aus, wird er nicht abgeschnitten, sondern die Box waechst in
//  der Hoehe leicht mit (kein Datenverlust).
// ============================================================

function _flowWrap(text, maxWidth, fontSize) {
  const charW = fontSize * 0.58;
  const maxChars = Math.max(4, Math.floor(maxWidth / charW));
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = '';
  words.forEach(w => {
    const candidate = cur ? cur + ' ' + w : w;
    if (candidate.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = candidate;
    }
  });
  if (cur) lines.push(cur);
  return lines;
}

function _flowChartKindColor(kind) {
  return {
    source: 'var(--accent2)',
    script: 'var(--accent)',
    data: 'var(--green)',
    view: '#f5c842',
    new: 'var(--accent2)',
  }[kind] || 'var(--border)';
}

const FLOW_CHART_KIND_LABELS = [
  ['source', 'Quelle'],
  ['script', 'Skript'],
  ['data', 'Daten'],
  ['view', 'Ansicht'],
  ['new', 'Neu'],
];

function _flowChartSvg() {
  const W = 1180;
  const GAP = 14;
  const NODE_H = 60;
  const STAGE_LABEL_GAP = 6;
  const CONNECTOR_H = 44;
  const PAD_TOP = 8;
  const titleFS = 12.5, noteFS = 11, connFS = 10.5, nameFS = 13.5, numFS = 10.5;

  let y = PAD_TOP;
  const parts = [];

  FLOW_STAGES.forEach((stage, si) => {
    // ── Stufen-Label (Nummer, Name, Notiz) ──
    const noteLines = _flowWrap(stage.note, W - 4, noteFS);
    const labelY0 = y;
    parts.push(`<text x="0" y="${y + numFS}" font-family="DM Mono, monospace" font-size="${numFS}" letter-spacing="1.4" fill="var(--accent)" font-weight="600">STUFE ${_flowEsc(stage.num)}</text>`);
    parts.push(`<text x="112" y="${y + numFS}" font-family="DM Sans, sans-serif" font-size="${nameFS}" fill="var(--text)" font-weight="700">${_flowEsc(stage.name)}</text>`);
    y += numFS + 5;
    noteLines.forEach(line => {
      parts.push(`<text x="0" y="${y + noteFS}" font-family="DM Sans, sans-serif" font-size="${noteFS}" fill="var(--muted)">${_flowEsc(line)}</text>`);
      y += noteFS + 4;
    });
    y += STAGE_LABEL_GAP;

    // ── Knoten-Zeile ──
    const n = stage.cards.length;
    const nodeW = (W - GAP * (n - 1)) / n;
    let x = 0;
    const rowTop = y;
    const nodePad = 24; // 12px oben + 12px unten
    stage.cards.forEach(c => {
      const color = _flowChartKindColor(c.kind);
      const linked = c.page && typeof window[c.page] === 'function';
      const cls = 'flowchart-node' + (linked ? ' is-clickable' : '');
      const click = linked ? ` onclick="${c.page}()"` : '';
      const titleLines = _flowWrap(c.icon + ' ' + c.title, nodeW - 20, titleFS).slice(0, 2);
      const nodeHActual = Math.max(NODE_H, titleLines.length * (titleFS + 4) + nodePad);
      // Lokale y-Koordinate (relativ zur Gruppe, die schon per transform
      // um rowTop verschoben ist -- rowTop hier NICHT nochmal addieren).
      const firstLineY = (nodeHActual - titleLines.length * (titleFS + 4)) / 2 + titleFS;

      const tooltip = (c.files && c.files.length)
        ? `<title>${_flowEsc(c.files.join(', '))}</title>` : '';

      const textLines = titleLines.map((line, li) =>
        `<text x="${nodeW / 2}" y="${firstLineY + li * (titleFS + 4)}" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="${titleFS}" font-weight="700" fill="var(--text)">${_flowEsc(line)}</text>`
      ).join('');

      parts.push(`<g class="${cls}" transform="translate(${x},${rowTop})"${click}>${tooltip}
        <rect width="${nodeW}" height="${nodeHActual}" rx="10" fill="var(--surface)" stroke="var(--border)" stroke-width="1.3"/>
        <rect width="4" height="${nodeHActual}" rx="2" fill="${color}"/>
        ${textLines}
      </g>`);
      x += nodeW + GAP;
    });

    const maxNodeH = Math.max(NODE_H, ...stage.cards.map(c => {
      const lines = _flowWrap(c.icon + ' ' + c.title, nodeW - 20, titleFS).slice(0, 2).length;
      return lines * (titleFS + 4) + nodePad;
    }));
    y = rowTop + maxNodeH;

    // ── Pfeil zur naechsten Stufe ──
    if (si < FLOW_STAGES.length - 1 && stage.connector) {
      const lineX = W / 2;
      const lineY0 = y + 8;
      const lineY1 = y + CONNECTOR_H - 10;
      parts.push(`<line x1="${lineX}" y1="${lineY0}" x2="${lineX}" y2="${lineY1}" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#flowArrowHead)"/>`);
      const connLines = _flowWrap(stage.connector, W / 2 - 30, connFS);
      connLines.forEach((line, li) => {
        parts.push(`<text x="${lineX + 12}" y="${(lineY0 + lineY1) / 2 - (connLines.length - 1) * 6 + li * 12 + 4}" font-family="DM Mono, monospace" font-size="${connFS}" fill="var(--muted)">${_flowEsc(line)}</text>`);
      });
      y += CONNECTOR_H;
    } else {
      y += 10;
    }
  });

  // ── Legende ──
  y += 14;
  parts.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="var(--border)" stroke-width="1"/>`);
  y += 22;
  let lx = 0;
  FLOW_CHART_KIND_LABELS.forEach(([kind, label]) => {
    const color = _flowChartKindColor(kind);
    parts.push(`<rect x="${lx}" y="${y - 9}" width="10" height="10" rx="3" fill="${color}"/>`);
    parts.push(`<text x="${lx + 16}" y="${y}" font-family="DM Sans, sans-serif" font-size="11" fill="var(--muted)">${_flowEsc(label)}</text>`);
    lx += 16 + label.length * 6.4 + 26;
  });
  y += 16;

  return { width: W, height: y, body: parts.join('') };
}

function renderFlowChart() {
  const host = document.getElementById('flowChartDiagram');
  if (!host) return;
  const { width, height, body } = _flowChartSvg();
  host.innerHTML = `<div class="flowchart-scroll"><svg viewBox="0 0 ${width} ${height}" width="${width}" style="min-width:720px;">
    <defs>
      <marker id="flowArrowHead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/>
      </marker>
    </defs>
    ${body}
  </svg></div>`;
  host.dataset.rendered = '1';
}

function flowSetMode(mode) {
  const sec = document.getElementById('flowSection');
  if (!sec) return;
  sec.classList.toggle('detailed', mode === 'detailed');
  const cardsHost = document.getElementById('flowDiagram');
  const chartHost = document.getElementById('flowChartDiagram');
  if (cardsHost) cardsHost.style.display = mode === 'flowchart' ? 'none' : '';
  if (chartHost) {
    chartHost.style.display = mode === 'flowchart' ? '' : 'none';
    // Lazy: erst beim ersten Wechsel in den Flow-Chart-Modus rendern,
    // Detail-Umschaltung braucht keinen Re-Render (statisches Diagramm).
    if (mode === 'flowchart' && !chartHost.dataset.rendered) renderFlowChart();
  }
  document.querySelectorAll('.flow-toggle-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.mode === mode));
  try { localStorage.setItem('tthqFlowMode', mode); } catch (e) { /* Privatmodus */ }
}

function initFlowDiagram() {
  renderFlowDiagram();
  let mode = 'compact';
  try { mode = localStorage.getItem('tthqFlowMode') || 'compact'; } catch (e) { /* Privatmodus */ }
  flowSetMode(mode);
}
