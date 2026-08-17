// ============================================================
//  2027 DRAFT BOARD DATA
// ============================================================
//  Quelle: MFHFB 2027 Big Board (Fantasy gewichtet, Top 20) ·
//  Stand 08.08.2026 · v1.2 (abgeglichen mit Dizzle Dynasty, Game Theory Rankings, Ben Pfeifers Archetyp-Board, etc.)
//  Sortiert nach Dynasty-9cat-Wert, NICHT nach NBA-Draft-Slot.
//  Gleiche Struktur wie DRAFT_2026 (siehe data/draft2026.js), plus:
//  { pick, nbaRank, name, pos, school, tier, measurements, stats, fantasy, scouting, link }
//  pick    = Fantasy-Skillset-Einschätzung, MFHFBs eigener Rang (1-20, dieses Board)
//  nbaRank = Aggregat-Rang aus mehreren Quellen (Dizzle Dynasty, Game Theory Rankings, Tankathon, etc.)
//  Grosse Kartennummer zeigt beide: nbaRank/ pick
//  tier    = Fantasy-Archetyp-Qualität, MFHFBs eigene Einordnung (Board-Struktur), Werte aus Pfeifer-Tier-Spalte
//  tier ist eine von: 'Tier 1','Tier 2','Tier 3','Tier 4' (lokal, s.o.)
//  link = externer Scouting-Report bei Grinding Tape (grindingtape.com)
// ============================================================
const DRAFT_2027 = [
  {pick:1, nbaRank:1, name:"Tyran Stokes", pos:"SF", school:"Kansas", tier:"Tier 1",
   measurements:"6'8 · Freshman · Draftalter 19.7",
   stats:"—",
   fantasy:"Wing/Forward Handler · Kernkategorien: REB · AST · STL",
   scouting:"Point Forward Archetyp: liefert Rebounds und Assists aus der Wing Position, was in 9 cat überproportional wertvoll ist. Nr. 1 des 2026er HS Jahrgangs, höchste Wahrscheinlichkeit auf sofortige Volumenrolle. Hauptrisiko: FG%/FT% Effizienz und Off Court Fragen; nicht punt freundlich",
   link:"https://grindingtape.com/p/tyran-stokes"},

  {pick:2, nbaRank:2, name:"Caleb Holt", pos:"SG/PG", school:"Arizona", tier:"Tier 1",
   measurements:"6'5 · Freshman · Draftalter 19.6",
   stats:"—",
   fantasy:"Off Guard/Wing · Kernkategorien: STL · 3PM · FT% · low TO",
   scouting:"Derrick White Archetyp ist in 9 cat historisch deutlich wertvoller als im NBA Draft Diskurs, STL + 3PM + FT% + niedrige Turnover ist ein Top 40 Fantasy Profil ohne Star Status. Hauptrisiko: 3P Volumen muss kommen; gedeckelter Ceiling",
   link:"https://grindingtape.com/p/caleb-holt"},

  {pick:3, nbaRank:5, name:"Anthony Thompson", pos:"SF/PF", school:"Ohio State", tier:"Tier 2",
   measurements:"6'8 · Freshman · Draftalter 18.9",
   stats:"—",
   fantasy:"Off Ball Forward · Kernkategorien: 3PM · PTS · BLK",
   scouting:"Jüngstes Top Talent + ~7'3 bis 7'4 Spannweite + freie Usage nach Thorntons Abgang. Runter von Platz 1, weil Pfeifers Label 'Off Ball Forward' das AST Ceiling deckelt. Hauptrisiko: Wenn die Off Ball Rolle stimmt, wird er 3PM/PTS Spezialist statt All Cat Wing",
   link:"https://grindingtape.com/p/anthony-thompson"},

  {pick:4, nbaRank:8, name:"Stefan Joksimović", pos:"PG", school:"Baskonia", tier:"Tier 1",
   measurements:"6'8 · International · Draftalter 18.6",
   stats:"8.8 PTS · 4.1 REB · 2.9 AST · 1.5 STL · 0 BLK · 42.1% TS%",
   fantasy:"Wing/Forward Handler · Kernkategorien: PTS · AST · 3PM · REB",
   scouting:"Jumbo Initiator ist der wertvollste 9 cat Archetyp überhaupt. U18 EuroBasket MVP: 23,1/6,7/3,7/1,3 STL als Turniertopscorer + erster slowenischer Titel. Hauptrisiko: SIGNALPROBLEM: 11 EuroLeague Einsätze, 2,9 PPG in der ACB, bis zum Draft kaufst du fast blind",
   link:"https://grindingtape.com/p/stefan-joksimovic"},

  {pick:5, nbaRank:13, name:"Amari Allen", pos:"SF", school:"Alabama", tier:"Tier 2",
   measurements:"6'5 · Sophomore · Draftalter 21.4",
   stats:"14.6 PTS · 8.9 REB · 4 AST · 1.3 STL · 0.9 BLK · 57.0% TS%",
   fantasy:"Wing/Forward Handler · Kernkategorien: REB · AST · STL · TS%",
   scouting:"Beste Fantasy Statline auf dem gesamten Board: Wing mit Big Man Rebounds und Guard Assists bei nur 18,6% Usage. Der Usage Hebel ist der ganze Case. Hauptrisiko: Combine Messung 6'5.25 statt gelisteter 6'8; Alter 21,4",
   link:"https://grindingtape.com/p/amari-allen"},

  {pick:6, nbaRank:7, name:"Braylon Mullins", pos:"SG", school:"UConn", tier:"Tier 3",
   measurements:"6'6 · Sophomore · Draftalter 21.2",
   stats:"15.3 PTS · 4.5 REB · 1.8 AST · 1.3 STL · 0.8 BLK · 54.4% TS%",
   fantasy:"Off Guard/Wing · Kernkategorien: 3PM · FT% · STL",
   scouting:"Elite FT% (88,9%) bei 6,5 3PA/Spiel = punt freundlich und sofort einsetzbar. FT% ist die stabilste Wurf Skill von College zu NBA. Hauptrisiko: 33,5% von drei, TS nur .544; Alter 21,2 kostet Dynasty Jahre",
   link:"https://grindingtape.com/p/braylon-mullins"},

  {pick:7, nbaRank:16, name:"Patrick Ngongba II", pos:"C", school:"Duke", tier:"Tier 2",
   measurements:"6'11 · Junior · Draftalter 21.3",
   stats:"16.6 PTS · 9.6 REB · 3.3 AST · 1 STL · 1.7 BLK · 64.5% TS%",
   fantasy:"True 5 (Passing Big) · Kernkategorien: BLK · REB · AST · FG%",
   scouting:"Passing Big mit Blocks bei TS .645, 3,3 AST/36 von einem Fünfer ist genau das Profil, das oben in dieser Klasse fehlt. Hauptrisiko: Chronische Fußprobleme; Games Played ist die eigentliche Frage",
   link:"https://grindingtape.com/p/patrick-ngongba-ii"},

  {pick:8, nbaRank:3, name:"Jordan Smith Jr.", pos:"PG/SG", school:"Arkansas", tier:"Tier 1",
   measurements:"6'2 · Freshman · Draftalter 19.8",
   stats:"—",
   fantasy:"Combo Guard · Kernkategorien: STL · AST",
   scouting:"Defensivpotenzial 'durch die Decke' mit 6'9 Spannweite bei 6'2, Steals Profil ist real und translatiert am zuverlässigsten von allen Kategorien. Hauptrisiko: 25% 3P / 68% FT: doppeltes Kategorienrisiko genau dort, wo es weh tut",
   link:"https://grindingtape.com/p/jordan-smith-jr"},

  {pick:9, nbaRank:17, name:"Ivan Kharchenkov", pos:"SF", school:"Arizona", tier:"Tier 2",
   measurements:"6'7 · Sophomore · Draftalter 20.7",
   stats:"13.2 PTS · 5.5 REB · 2.9 AST · 1.7 STL · 0.4 BLK · 57.5% TS%",
   fantasy:"Wing/Forward Handler · Kernkategorien: STL · REB · AST",
   scouting:"Glue Wing mit echten Steals (1,7/36) und DBPM 5,5 bei nur 17,6% Usage. Breites Kategorienprofil ohne Volumenbedarf. Hauptrisiko: ~32% von drei bei niedrigem Volumen, der einzige Swing",
   link:"https://grindingtape.com/p/ivan-kharchenkov"},

  {pick:10, nbaRank:18, name:"Tounde Yessoufou", pos:"SG", school:"St. John's", tier:"Tier 3",
   measurements:"6'4 · Sophomore · Draftalter 21.1",
   stats:"19.7 PTS · 6.5 REB · 1.8 AST · 2.2 STL · 0.7 BLK · 55.0% TS%",
   fantasy:"Wing/Forward Handler · Kernkategorien: STL · PTS · REB",
   scouting:"2,2 STL/36 bei 26,9% Usage, Volumen plus Steals ist eine seltene Kombination. Pitino System sollte die Defense strukturieren. Hauptrisiko: Wurfmechanik; TS .550 bei hoher Usage ist grenzwertig",
   link:"https://grindingtape.com/p/tounde-yessoufou"},

  {pick:11, nbaRank:15, name:"Thomas Haugh", pos:"SF/PF", school:"Florida", tier:"Tier 3",
   measurements:"6'9 · Senior · Draftalter 23.9",
   stats:"18.4 PTS · 6.6 REB · 2.3 AST · 1.1 STL · 1 BLK · 58.6% TS%",
   fantasy:"Off Ball Forward · Kernkategorien: PTS · REB · BLK · STL",
   scouting:"BPM 11,0 und ein sauberes Neun Kategorien Profil ohne Loch. Sofortproduzent vom ersten NBA Tag an. Hauptrisiko: 23,9 Jahre am Draft Tag = harter Dynasty Abschlag, wenige Surplus Jahre",
   link:"https://grindingtape.com/p/thomas-haugh"},

  {pick:12, nbaRank:6, name:"Bruce Branch III", pos:"SG/SF", school:"BYU", tier:"Tier 2",
   measurements:"6'7 · Freshman · Draftalter 18.7",
   stats:"—",
   fantasy:"Off Guard/Wing · Kernkategorien: 3PM · STL",
   scouting:"3&D Prototyp mit 7'1 Spannweite und sauberer Wurfmechanik; sehr jung (18,7). Der Archetyp bekommt im NBA Wingflation Umfeld immer Minuten. Hauptrisiko: Niedrige Usage ist im Archetyp eingepreist; 195 lbs",
   link:"https://grindingtape.com/p/bruce-branch-iii"},

  {pick:13, nbaRank:12, name:"Dylan Mingo", pos:"PG", school:"Baylor", tier:"Tier 2",
   measurements:"6'5 · Freshman · Draftalter 18.7",
   stats:"—",
   fantasy:"Off Guard/Wing · Kernkategorien: AST · STL · PTS",
   scouting:"Lead Guard Wette mit Größe und Kraft; AST/STL sind in dieser Klasse die knappsten Kategorien. Hauptrisiko: 23% EYBL 3P, Shooting ist der klare Failure Mechanismus",
   link:"https://grindingtape.com/p/dylan-mingo"},

  {pick:14, nbaRank:4, name:"Cameron Williams", pos:"F/C", school:"Duke", tier:"Tier 3",
   measurements:"6'11 · Freshman · Draftalter 19.7",
   stats:"—",
   fantasy:"Combo Big · Kernkategorien: BLK · 3PM · REB",
   scouting:"BLK + 3PM in einem Körper ist der seltenste und in 9 cat wertvollste Big Archetyp. Runter von Platz 9 wegen Pfeifers Tier 5 Grade. Hauptrisiko: MINUTENKRISE: Scharnowski + Boumtje Boumtje stehen im Weg; 200 lbs",
   link:"https://grindingtape.com/p/cameron-williams"},

  {pick:15, nbaRank:22, name:"Motiejus Krivas", pos:"C", school:"Arizona", tier:"Tier 2",
   measurements:"7'2 · Senior · Draftalter 22.6",
   stats:"14.8 PTS · 11.6 REB · 1.6 AST · 1 STL · 2.7 BLK · 63.8% TS%",
   fantasy:"True 5 · Kernkategorien: REB · BLK · FG%",
   scouting:"11,6 REB + 2,7 BLK/36 bei TS .638. In Punt FT% Builds ein extrem sauberer Baustein. Hauptrisiko: 22,6 Jahre; Verletzungshistorie; null Spacing",
   link:"https://grindingtape.com/p/motiejus-krivas"},

  {pick:16, nbaRank:32, name:"Tyler Tanner", pos:"PG", school:"Vanderbilt", tier:"Tier 2",
   measurements:"5'11 · Junior · Draftalter 21.4",
   stats:"21 PTS · 3.9 REB · 5.5 AST · 2.6 STL · 0.4 BLK · 61.2% TS%",
   fantasy:"Initiator PG · Kernkategorien: AST · STL · FT% · 3PM",
   scouting:"NEU IN TOP 20. Pfeifer führt ihn als EINZIGEN Initiator PG über Tier 5, bei AST Knappheit im Jahrgang ist das ein Scarcity Argument. 19,5/5,1/2,4 STL bei 48,5/36,8/85,3% und nur 1,9 TO. Hauptrisiko: 5'10.75 barefoot deckelt Draft Kapital und NBA Minuten hart",
   link:"https://grindingtape.com/p/tyler-tanner"},

  {pick:17, nbaRank:9, name:"Baba Oladotun", pos:"SF", school:"Maryland", tier:"Tier 4",
   measurements:"6'9 · Freshman · Draftalter 18.5",
   stats:"—",
   fantasy:"Off Ball Forward · Kernkategorien: 3PM · REB · BLK",
   scouting:"Jüngster relevanter Prospect der Klasse (18,5). Reiner Ceiling Play auf einen 6'10 Shooter. Hauptrisiko: Aktuell mehr Projektion als Produktion; realistisch 2028er Draft",
   link:"https://grindingtape.com/p/babatunde-oladotun"},

  {pick:18, nbaRank:10, name:"Brandon McCoy Jr.", pos:"SG", school:"Michigan", tier:"Tier 3",
   measurements:"6'5 · Freshman · Draftalter 19.6",
   stats:"—",
   fantasy:"Off Ball Forward · Kernkategorien: STL · REB",
   scouting:"Multipositionaler Verteidiger Guard mit Rebounding über der Position; Steals Profil. Hauptrisiko: Offense und Jumper völlig offen; ohne Wurf kein Fantasy Wert",
   link:"https://grindingtape.com/p/brandon-mccoy"},

  {pick:19, nbaRank:29, name:"Malachi Moreno", pos:"C", school:"Kentucky", tier:"Tier 3",
   measurements:"7'0 · Sophomore · Draftalter 20.7",
   stats:"12.4 PTS · 10.1 REB · 2.8 AST · 0.8 STL · 2.3 BLK · 62.3% TS%",
   fantasy:"True 5 · Kernkategorien: REB · BLK · AST",
   scouting:"10,1 REB + 2,3 BLK + 2,8 AST/36 mit erst 20,7 Jahren. Passing Big Ansätze bei minimaler Usage. Hauptrisiko: 16,4% Usage; Kentucky Frontcourt Konkurrenz; eher 2028",
   link:"https://grindingtape.com/p/malachi-moreno"},

  {pick:20, nbaRank:20, name:"Luigi Suigo", pos:"C", school:"Villanova", tier:"Tier 3",
   measurements:"7'3 · Freshman · Draftalter 20.4",
   stats:"16.9 PTS · 10.6 REB · 1.7 AST · 0.9 STL · 2 BLK · 60.7% TS%",
   fantasy:"True 5 · Kernkategorien: REB · BLK · FG%",
   scouting:"10,6 REB + 2,0 BLK/36 bei 7'4/289 lbs. Big Man Kategorien mit Big East Startrolle ab Tag 1. Hauptrisiko: FT% als klassisches Center Loch; roh auf beiden Seiten",
   link:"https://grindingtape.com/p/luigi-suigo"},

];

let d27CurrentData = [...DRAFT_2027];

function renderDraft27(data) {
  const grid = document.getElementById('draft27Grid');
  const noR  = document.getElementById('draft27NoResults');
  if (!data.length) { grid.innerHTML = ''; noR.style.display = 'block'; return; }
  noR.style.display = 'none';

  const isFiltering = document.getElementById('draft27Search').value.trim() !== '';
  const isLight = document.body.classList.contains('light');
  const ts = isLight ? TIER_STYLE_LIGHT : TIER_STYLE_DARK;

  let html = '<div class="draft26-grid">';
  if (isFiltering) {
    data.forEach(p => { html += draft27Card(p); });
  } else {
    TIER_ORDER.forEach(tier => {
      const picks = data.filter(p => p.tier === tier);
      if (!picks.length) return;
      const s = ts[tier] || ts['Tier 6'];
      html += `<div class="draft26-tier-label" style="color:${s.label};border-color:${s.dot}22;">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${s.dot};margin-right:8px;vertical-align:middle;"></span>${tier}
      </div>`;
      picks.forEach(p => { html += draft27Card(p); });
    });
  }
  html += '</div>';
  grid.innerHTML = html;
}

function draft27Card(p) {
  const c   = posColor(p.pos);
  const idx = DRAFT_2027.indexOf(p);
  const iid = 'intel27_' + p.pick;
  const fp  = p.fantasy ? p.fantasy.split(' · ')[0] : '';
  const numLabel = (p.nbaRank != null) ? (p.nbaRank + '/ ' + p.pick) : p.pick;
  const statsLine = (p.stats && p.stats !== '—')
    ? '<div class="draft26-scout-preview" style="color:var(--muted);font-size:10px;margin-top:3px;">' + p.stats + '</div>' : '';
  const fpLine = fp
    ? '<div class="draft26-scout-preview" style="color:var(--accent);font-size:10px;margin-top:2px;font-weight:600;">' + fp + '</div>' : '';

  const intelBar = (p.scouting || p.fantasy) ? (
    '<div style="border-top:1px solid var(--border);padding:6px 16px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;background:var(--surface2);" '
    + 'onclick="toggleDraftIntel(\''+ iid +'\')" '
    + 'onmouseenter="this.style.background=\'var(--accent-light)\'" '
    + 'onmouseleave="this.style.background=\'var(--surface2)\'">'
    + '<span style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);">&#128269; Scout Intel</span>'
    + '<span id="' + iid + '_arrow" style="font-size:11px;color:var(--muted);transition:transform .2s;">&#9662;</span>'
    + '</div>'
    + '<div id="' + iid + '" style="display:none;padding:12px 16px;border-top:1px solid var(--border);background:var(--surface);">'
    + (p.fantasy ? '<div style="background:var(--accent-light);border:1px solid rgba(108,99,255,.25);border-radius:10px;padding:10px 12px;margin-bottom:10px;"><div style="font-size:9px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:5px;">&#127942; Fantasy 9cat</div><div style="font-size:12px;font-weight:600;color:var(--accent);line-height:1.6;">' + p.fantasy + '</div></div>' : '')
    + (p.scouting ? '<div style="font-size:9px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:6px;">Scouting Report (MFHFBs)</div><div style="font-size:13px;line-height:1.7;color:var(--text);">' + p.scouting + '</div>' : '')
    + (p.link ? '<a href="' + p.link + '" target="_blank" rel="noopener" onclick="event.stopPropagation()" style="display:inline-flex;align-items:center;gap:6px;margin-top:12px;font-size:11px;font-weight:700;color:var(--accent);text-decoration:none;border:1px solid var(--accent);border-radius:8px;padding:6px 12px;">&#127909; Volle Scouting-Reports &amp; Tape auf Grinding Tape &#8594;</a>' : '')
    + '</div>'
  ) : '';

  return '<div class="draft26-card-wrap">'
    + '<div class="draft26-card" style="flex-direction:column;align-items:stretch;padding:0;overflow:hidden;">'
    + '<div style="display:flex;align-items:center;gap:14px;padding:14px 16px;cursor:pointer;" onclick="openScoutModal27(' + idx + ')" '
    + 'onmouseenter="this.parentElement.style.borderColor=\'var(--accent)\';this.parentElement.style.transform=\'translateY(-2px)\';this.parentElement.style.boxShadow=\'0 6px 20px rgba(108,99,255,.15)\'" '
    + 'onmouseleave="this.parentElement.style.borderColor=\'var(--border)\';this.parentElement.style.transform=\'\';this.parentElement.style.boxShadow=\'\';">'
    + '<div class="draft26-pick-num ' + pickNumClass(p.pick, p.tier) + '" style="font-size:15px;white-space:nowrap;">' + numLabel + '</div>'
    + '<div class="draft26-info">'
      + '<div class="draft26-name">' + (p.link
          ? '<a href="' + p.link + '" target="_blank" rel="noopener" onclick="event.stopPropagation()" style="color:inherit;text-decoration:none;border-bottom:1px dotted var(--muted);">' + p.name + '</a>'
          : p.name) + '</div>'
      + '<div class="draft26-meta">'
        + '<span class="draft26-pos" style="background:' + c.bg + ';color:' + c.txt + ';font-size:10px;font-weight:800;padding:2px 7px;border-radius:5px;">' + p.pos + '</span>'
        + (p.school ? '<span class="draft26-school">' + p.school + '</span>' : '')
      + '</div>'
      + statsLine
      + fpLine
    + '</div>'
    + '<div class="draft26-open-hint">&#128269; &#246;ffnen</div>'
    + '</div>'
    + intelBar
    + '</div></div>';
}

function openScoutModal27(idx) {
  const p = DRAFT_2027[idx];
  const c = posColor(p.pos);
  const isLight = document.body.classList.contains('light');
  const ts = isLight ? TIER_STYLE_LIGHT : TIER_STYLE_DARK;
  const s = ts[p.tier] || ts['Tier 6'];
  const numLabel = (p.nbaRank != null) ? (p.nbaRank + '/ ' + p.pick) : p.pick;
  document.getElementById('modalPick').textContent = `Aggregat-Rang ${p.nbaRank} · Fantasy-Skillset #${p.pick} · ${p.tier}`;
  document.getElementById('modalName').textContent = p.name;
  document.getElementById('modalMeta').innerHTML = `
    <span class="draft26-pos" style="background:${c.bg};color:${c.txt};font-size:12px;font-weight:800;padding:3px 9px;border-radius:6px;">${p.pos}</span>
    ${p.school ? `<span class="scout-modal-tier">${p.school}</span>` : ''}
    <span class="scout-modal-tier" style="color:${s.label};border-color:${s.dot}44;">${p.tier}</span>
  `;
  const measHtml = p.measurements
    ? `<div style="font-size:11px;color:var(--muted);margin-bottom:12px;">${p.measurements}</div>` : '';
  const statsHtml = p.stats && p.stats !== '—'
    ? `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:10px 14px;margin-bottom:12px;"><div style="font-size:9px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:5px;">📊 Per-36 Statistiken</div><div style="font-size:12px;font-weight:600;color:var(--text);line-height:1.6;">${p.stats}</div></div>`
    : '';
  const fantasyHtml = p.fantasy
    ? `<div style="background:${isLight ? 'rgba(192,98,47,0.07)' : 'rgba(108,99,255,0.08)'};border:1px solid ${isLight ? 'rgba(192,98,47,0.25)' : 'rgba(108,99,255,0.25)'};border-radius:10px;padding:10px 14px;margin-bottom:14px;"><div style="font-size:9px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:5px;">🏆 Fantasy 9cat Profil</div><div style="font-size:12px;font-weight:600;color:var(--accent);line-height:1.6;">${p.fantasy}</div></div>`
    : '';
  const linkHtml = p.link
    ? `<a href="${p.link}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;margin-top:16px;font-size:12px;font-weight:700;color:var(--accent);text-decoration:none;border:1px solid var(--accent);border-radius:8px;padding:8px 14px;">🎬 Volle Scouting-Reports &amp; Tape auf Grinding Tape →</a>`
    : '';
  document.getElementById('modalScouting').innerHTML = `${measHtml}${statsHtml}${fantasyHtml}<div style="font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:8px;">🔍 Scouting Report (MFHFBs)</div><div style="font-size:14px;line-height:1.7;color:var(--text);">${p.scouting || 'Kein Scouting Report verfügbar.'}</div>${linkHtml}`;
  document.getElementById('scoutModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function filterDraft27() {
  const q = document.getElementById('draft27Search').value.toLowerCase().trim();
  d27CurrentData = q
    ? DRAFT_2027.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.pos.toLowerCase().includes(q) ||
        (p.school || '').toLowerCase().includes(q))
    : [...DRAFT_2027];
  renderDraft27(d27CurrentData);
}

function showDraft27() {
  renderDraft27(d27CurrentData);
  navigate('draft27Page');
}
