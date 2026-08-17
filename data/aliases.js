// ============================================================
//  NAME NORMALIZATION  — canonical = ESPN roster name
// ============================================================
const NAME_ALIASES = {
  // Bub Carrington
  "carlton carrington":       "Bub Carrington",
  "bub carrington":           "Bub Carrington",

  // Deandre Ayton
  "deandre ayton":            "Deandre Ayton",
  "de'andre ayton":           "Deandre Ayton",
  "deandre ayton":            "Deandre Ayton",

  // Cam Johnson
  "cameron johnson":          "Cam Johnson",
  "cam johnson":              "Cam Johnson",

  // Dereck Lively
  "dereck lively":            "Dereck Lively II",
  "dereck lively ii":         "Dereck Lively II",

  // PJ Washington
  "p.j. washington":          "PJ Washington",
  "pj washington":            "PJ Washington",

  // TJ McConnell
  "t.j. mcconnell":           "TJ McConnell",
  "tj mcconnell":             "TJ McConnell",

  // OG Anunoby
  "o.g. anunoby":             "OG Anunoby",
  "og anunoby":               "OG Anunoby",

  // GG Jackson
  "g.g. jackson":             "GG Jackson",
  "gg jackson":               "GG Jackson",
  "gg jackson ii":            "GG Jackson",

  // AJ Green
  "a.j. green":               "AJ Green",
  "aj green":                 "AJ Green",

  // VJ Edgecombe
  "v.j. edgecombe":           "VJ Edgecombe",
  "vj edgecombe":             "VJ Edgecombe",

  // Ron Holland
  "ron holland":              "Ronald Holland II",
  "ron holland ii":           "Ronald Holland II",
  "ronald holland ii":        "Ronald Holland II",
  "ronald holland":           "Ronald Holland II",

  // Bobby Portis
  "bobby portis jr.":         "Bobby Portis",
  "bobby portis jr":          "Bobby Portis",
  "bobby portis":             "Bobby Portis",

  // Kevin Porter
  "kevin porter jr.":         "Kevin Porter Jr.",
  "kevin porter jr":          "Kevin Porter Jr.",

  // Scotty Pippen
  "scottie pippen jr.":       "Scotty Pippen Jr.",
  "scottie pippen jr":        "Scotty Pippen Jr.",
  "scotty pippen jr.":        "Scotty Pippen Jr.",

  // Jaren Jackson
  "jaren jackson":            "Jaren Jackson Jr.",
  "jaren jackson jr":         "Jaren Jackson Jr.",
  "jaren jackson jr.":        "Jaren Jackson Jr.",

  // Jabari Smith
  "jabari smith":             "Jabari Smith Jr.",
  "jabari smith jr":          "Jabari Smith Jr.",

  // Robert Williams
  "robert williams":          "Robert Williams III",
  "robert williams iii":      "Robert Williams III",

  // Trey Murphy
  "trey murphy":              "Trey Murphy III",
  "trey murphy iii":          "Trey Murphy III",

  // Guerschon Yabusele
  "guershon yabusele":        "Guerschon Yabusele",
  "guerschon yabusele":       "Guerschon Yabusele",

  // Nikola Jovic (diacritics)
  "nikola jović":             "Nikola Jovic",
  "nikola jovic":             "Nikola Jovic",

  // Alperen Sengun (diacritics)
  "alperen şengün":           "Alperen Sengun",
  "alperen sengün":           "Alperen Sengun",
  "alperen sengun":           "Alperen Sengun",

  // Kristaps Porzingis (diacritics)
  "kristaps porziņģis":       "Kristaps Porzingis",
  "kristaps porzingis":       "Kristaps Porzingis",

  // Alex Sarr
  "alexandre sarr":           "Alex Sarr",
  "alex sarr":                "Alex Sarr",

  // Egor Demin (diacritics)
  "egor dëmin":               "Egor Demin",
  "egor demin":               "Egor Demin",

  // Moussa Diabate
  "moussa diabaté":           "Moussa Diabate",
  "moussa diabate":           "Moussa Diabate",

  // Tidjane Salaun
  "tidjane salaün":           "Tidjane Salaun",
  "tidjane salaun":           "Tidjane Salaun",

  // Yanic Konan Niederhauser
  "yanic konan niederhäuser": "Yanic Konan Niederhauser",
  "yanic konan niederhauser": "Yanic Konan Niederhauser",

  // Dennis Schroder
  "dennis schröder":          "Dennis Schroder",
  "dennis schroder":          "Dennis Schroder",

  // Vit Krejci
  "vít krejcí":               "Vit Krejci",
  "vit krejci":               "Vit Krejci",

  // Nolan Traore
  "nolan traoré":             "Nolan Traore",
  "nolan traore":             "Nolan Traore",

  // Hugo Gonzalez
  "hugo gonzález":            "Hugo Gonzalez",
  "hugo gonzalez":            "Hugo Gonzalez",

  // Nic Claxton
  "nicolas claxton":          "Nic Claxton",
  "nic claxton":              "Nic Claxton",

  // De'Andre Hunter
  "de'andre hunter":          "De'Andre Hunter",
  "deandre hunter":           "De'Andre Hunter",

  // Day'Ron Sharpe
  "dayron sharpe":            "Day'Ron Sharpe",
  "day'ron sharpe":           "Day'Ron Sharpe",

  // Nae'Qwan Tomlin
  "naequan tomlin":           "Nae'Qwan Tomlin",
  "nae'qwan tomlin":          "Nae'Qwan Tomlin",

  // Kel'el Ware
  "kel'el ware":              "Kel'el Ware",
  "kelel ware":               "Kel'el Ware",

  // Tre Jones (not Tre Mann)
  "tre jones":                "Tre Jones",

  // Jalen McDaniels — was traded to NOR in some sources
  "jalen mcdaniels":          "Jalen McDaniels",

  // Santi Aldama
  "santi aldama":             "Santi Aldama",

  // Tristan da Silva
  "tristan da silva":         "Tristan da Silva",
  "tristan da silva":         "Tristan da Silva",

  // Ja'Kobe Walter
  "ja'kobe walter":           "Ja'Kobe Walter",
  "jakobe walter":            "Ja'Kobe Walter",

  // Cody Williams (not to confuse)
  "cody williams":            "Cody Williams",
};

/**
 * Normalize a player name to its canonical ESPN form.
 * Steps: trim → lowercase → alias lookup → if no hit, strip diacritics and try again.
 */
// Name variants that can't be solved by normalization alone
const NAME_FIRST_ALIASES = {
  'nicolas claxton':  'nic claxton',
  'alexandre sarr':   'alex sarr',
  'cameron johnson':  'cam johnson',  // Roster uses Cameron, DYNASTY_PLAYERS uses Cam
  'herbert jones':    'herb jones',   // Hashtag/ESPN nutzen "Herbert", Beyaz' Baseline "Herb"

  // 17.08.2026, aus dem manuellen Namensvarianten-Abgleich (Beyaz):
  // fuehrte ohne Alias zu doppelten Consensus-Eintraegen fuer denselben
  // Spieler. Zielschreibweise jeweils gegen den echten ESPN-Rosterfeed
  // geprueft (projections/rosters-data.js), nicht geraten.
  'lu dort':          'luguentz dort', // BBM nutzt Kurzform, ESPN nutzt "Luguentz"
  'd angelo russell': 'dangelo russell', // Apostroph durch Leerzeichen ersetzt statt entfernt
  'dlo':              'dangelo russell', // Spitzname
  'nic batum':        'nicolas batum',
};

/**
 * Canonical name for deduplication/matching:
 * lowercase → strip dots → strip apostrophes → strip Jr/Sr/II/III → apply first-name aliases
 * This lets "C.J. McCollum" == "CJ McCollum", "Michael Porter Jr." == "Michael Porter", etc.
 */
function normalizeName(raw) {
  if (!raw) return '';
  let s = raw.toLowerCase().trim();
  // BUGFIX (16.08.2026): Akzente/Umlaute wurden bisher NICHT entfernt.
  // "Sengün" matchte dadurch nie gegen "Sengun", "Dončić" nie gegen
  // "Doncic" -- obwohl exakt derselbe Spieler gemeint ist, je nachdem
  // welche Quelle ihn mit oder ohne Diakritika schreibt. Betraf JEDEN
  // Namensabgleich im Projekt (Fantasy-Besitz, Trade Analyzer,
  // Roster-Sync, Consensus-Projections), da alle normalizeName() nutzen.
  // js/navigation.js und js/trade-analyzer.js hatten dasselbe Problem
  // bereits lokal mit genau dieser NFD-Technik umgangen -- jetzt zentral
  // hier, damit es ueberall gilt statt an einzelnen Symptomen.
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  s = s.replace(/\./g, '');                          // c.j. → cj
  s = s.replace(/['\u2019\u2018`]/g, '');         // day'ron → dayron
  s = s.replace(/\b(jr|sr|iii|ii)\b/g, '');        // strip suffixes
  s = s.replace(/\s+/g, ' ').trim();
  return NAME_FIRST_ALIASES[s] || s;
}

// ============================================================
//  RANKING DISPLAY HELPERS
//  (used by rankings-ui.js, best-available.js)
// ============================================================
function rankClass(r) {
  if(r===1) return 'r-rank-top1';
  if(r<=5)  return 'r-rank-top5';
  if(r<=15) return 'r-rank-top15';
  return '';
}
function hashtagRankBadge(name) {
  const r = hashtagRank(name);
  if (!r) return '<span style="color:var(--border);font-size:11px;font-weight:600;">—</span>';
  let bg, color;
  if (r === 1)      { bg='rgba(245,200,66,0.15)';  color='#f5c842'; }
  else if (r <= 5)  { bg='rgba(108,99,255,0.15)';  color='#a89bff'; }
  else if (r <= 15) { bg='rgba(76,175,129,0.15)';  color='#6dddaa'; }
  else if (r <= 30) { bg='rgba(41,182,246,0.15)';  color='#4fc3f7'; }
  else if (r <= 75) { bg='rgba(255,101,132,0.12)'; color='#ff8fa3'; }
  else              { bg='rgba(123,127,158,0.12)'; color='var(--muted)'; }
  return `<span style="font-size:11px;font-weight:800;padding:2px 8px;border-radius:6px;background:${bg};color:${color};">#${r}</span>`;
}
function mattRankBadge(name) {
  const r = MATT_RANKS[name];
  if (!r) return '<span style="color:var(--border);font-size:11px;font-weight:600;">—</span>';
  let bg, color;
  if (r === 1)      { bg='rgba(245,200,66,0.15)';  color='#f5c842'; }
  else if (r <= 5)  { bg='rgba(108,99,255,0.15)';  color='#a89bff'; }
  else if (r <= 15) { bg='rgba(76,175,129,0.15)';  color='#6dddaa'; }
  else if (r <= 30) { bg='rgba(41,182,246,0.15)';  color='#4fc3f7'; }
  else if (r <= 75) { bg='rgba(255,101,132,0.12)'; color='#ff8fa3'; }
  else              { bg='rgba(123,127,158,0.12)'; color='var(--muted)'; }
  return `<span style="font-size:11px;font-weight:800;padding:2px 8px;border-radius:6px;background:${bg};color:${color};">#${r}</span>`;
}
