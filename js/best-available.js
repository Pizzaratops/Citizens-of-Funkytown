// ============================================================
//  BEST AVAILABLE
// ============================================================
let baCurrentData = [];
let baExperienceFilter = 'all'; // 'all' | 'rookie' | 'sophomore'

let baSortCol = null;   // 'name' | 'nbaTeam' | 'pos' | 'age' | 'minutesAvg' | 'bestCat30' | 'worstCat30' | 'dynastyRank' | 'stickyScore' | 'season2627Rank'
let baSortDir = 1;      // 1 = aufsteigend, -1 = absteigend

// Fixe 9-Cat-Reihenfolge fuer die Beste-/Schwaechste-Kat-Sortierung — identisch
// zur Spaltenreihenfolge in Team Analytics, damit "nach Kategorie sortiert"
// app-weit dasselbe bedeutet (erst PTS, dann 3PM, REB, AST, STL, BLK, FG%, FT%, TO).
const BA_CAT_ORDER = ['PTS', '3PM', 'REB', 'AST', 'STL', 'BLK', 'FG%', 'FT%', 'TO'];

function baSortBy(col) {
  if (baSortCol === col) {
    baSortDir *= -1;
  } else {
    baSortCol = col;
    // Rang-/Score-Spalten starten sinnvoll aufsteigend (1 = bester Rang).
    // Sticky Score: hoeher = besser, deshalb dort zuerst absteigend zeigen.
    baSortDir = (col === 'stickyScore') ? -1 : 1;
  }
  baUpdateSortArrows();
  filterBestAvail();
}

function baUpdateSortArrows() {
  ['name', 'nbaTeam', 'pos', 'age', 'minutesAvg', 'bestCat30', 'worstCat30', 'dynastyRank', 'stickyScore', 'season2627Rank']
    .forEach(col => {
      const el = document.getElementById('baArrow-' + col);
      if (!el) return;
      el.textContent = (col === baSortCol) ? (baSortDir === 1 ? '▲' : '▼') : '↕';
    });
}

function baSortData(data) {
  if (!baSortCol) return data;
  const dir = baSortDir;
  const getVal = (p) => {
    switch (baSortCol) {
      case 'name':           return (p.name || '').toLowerCase();
      case 'nbaTeam':        return (p.nbaTeam || '').toLowerCase();
      case 'pos':            return (p.pos || '').toLowerCase();
      case 'age':             return playerAge(p.dob) ?? p.age ?? null;
      case 'minutesAvg':     return p.minutesAvg ?? null;
      case 'bestCat30':      { const i = BA_CAT_ORDER.indexOf(p.bestCat30); return i === -1 ? null : i; }
      case 'worstCat30':     { const i = BA_CAT_ORDER.indexOf(p.worstCat30); return i === -1 ? null : i; }
      case 'dynastyRank':    return p.dynastyRank ?? null;
      case 'stickyScore':    return p.stickyScore ?? null;
      case 'season2627Rank': return p.season2627Rank ?? null;
      default: return null;
    }
  };
  return [...data].sort((a, b) => {
    const av = getVal(a), bv = getVal(b);
    // Fehlende Werte immer ans Ende, egal in welche Richtung sortiert wird
    if (av === null && bv === null) return 0;
    if (av === null) return 1;
    if (bv === null) return -1;
    if (typeof av === 'string') return dir * av.localeCompare(bv);
    return dir * (av - bv);
  });
}

const FA_PLAYERS = [{"name":"Kadary Richmond","nba":"FA","pos":"SG","rank":40},{"name":"Alondes Williams","nba":"FA","pos":"SG","rank":62},{"name":"Bez Mbeng","nba":"UTA","pos":"SG","rank":109},{"name":"Cormac Ryan","nba":"MIL","pos":"SG","rank":113},{"name":"Jalen Slawson","nba":"IND","pos":"SF","rank":125},{"name":"Andersson Garcia","nba":"FA","pos":"SF","rank":150},{"name":"Lucas Williamson","nba":"MEM","pos":"SG","rank":181},{"name":"Chaney Johnson","nba":"BKN","pos":"SF","rank":193},{"name":"Malachi Smith","nba":"BKN","pos":"SG","rank":196},{"name":"Adama Bal","nba":"MEM","pos":"SG","rank":199},{"name":"Sam Merrill","nba":"CLE","pos":"SG","rank":201},{"name":"Tre Scott","nba":"BKN","pos":"SF","rank":213},{"name":"Mouhamadou Gueye","nba":"CHI","pos":"PF","rank":214},{"name":"Hayden Gray","nba":"UTA","pos":"SG","rank":215},{"name":"Leaky Black","nba":"WAS","pos":"SF","rank":223},{"name":"Matisse Thybulle","nba":"POR","pos":"SG/SF","rank":226},{"name":"DaQuan Jeffries","nba":"FA","pos":"SG","rank":238},{"name":"Dominick Barlow","nba":"PHI","pos":"PF/C","rank":241},{"name":"David Roddy","nba":"DEN","pos":"PF","rank":242},{"name":"Isaiah Stevens","nba":"SAC","pos":"PG","rank":247},{"name":"Bruce Brown","nba":"DEN","pos":"SG/SF","rank":252},{"name":"Lawson Lovering","nba":"FA","pos":"C","rank":253},{"name":"Blake Hinson","nba":"UTA","pos":"SF","rank":257},{"name":"Taurean Prince","nba":"MIL","pos":"SF","rank":259},{"name":"DeJon Jarreau","nba":"FA","pos":"PG/SG","rank":260},{"name":"Keshon Gilbert","nba":"ATL","pos":"SF","rank":265},{"name":"Javonte Green","nba":"DET","pos":"SF","rank":266},{"name":"Tyler Burton","nba":"FA","pos":"SF","rank":272},{"name":"Daeqwon Plowden","nba":"SAC","pos":"SG","rank":274},{"name":"Jamir Watkins","nba":"WAS","pos":"SG/SF","rank":275},{"name":"Cam Payne","nba":"FA","pos":"PG/SG","rank":276},{"name":"DeAndre Jordan","nba":"NOR","pos":"C","rank":293},{"name":"Kevin Love","nba":"UTA","pos":"PF/C","rank":294},{"name":"Oscar Tshiebwe","nba":"UTA","pos":"C","rank":301},{"name":"John Poulakidas","nba":"DAL","pos":"SG","rank":313},{"name":"Adem Bona","nba":"PHI","pos":"C","rank":315},{"name":"Grant Williams","nba":"CHA","pos":"PF","rank":318},{"name":"Skal Labissiere","nba":"FA","pos":"PF","rank":326},{"name":"Charles Bassey","nba":"GSW","pos":"C","rank":327},{"name":"Spencer Jones","nba":"DEN","pos":"SF","rank":329},{"name":"Simone Fontecchio","nba":"MIA","pos":"SF","rank":334},{"name":"Bryce McGowens","nba":"NOR","pos":"SG","rank":341},{"name":"EJ Harkless","nba":"UTA","pos":"SG","rank":347},{"name":"Killian Hayes","nba":"SAC","pos":"PG","rank":348},{"name":"Tristen Newton","nba":"HOU","pos":"PG","rank":349},{"name":"Nae'Qwan Tomlin","nba":"CLE","pos":"PF","rank":351},{"name":"Josh Oduro","nba":"NOR","pos":"C","rank":356},{"name":"Jahmai Mashack","nba":"MEM","pos":"SG","rank":358},{"name":"Mike Conley","nba":"MIN","pos":"PG","rank":359},{"name":"Rocco Zikarsky","nba":"MIN","pos":"C","rank":363},{"name":"Jevon Carter","nba":"ORL","pos":"PG","rank":365},{"name":"Moussa Cisse","nba":"DAL","pos":"C","rank":366},{"name":"Enrique Freeman","nba":"MIN","pos":"PF","rank":369},{"name":"Branden Carlson","nba":"OKC","pos":"C","rank":370},{"name":"D'Angelo Russell","nba":"WAS","pos":"PG/SG","rank":372},{"name":"Kenrich Williams","nba":"OKC","pos":"SF","rank":375},{"name":"Dwight Powell","nba":"DAL","pos":"C","rank":377},{"name":"Ethan Thompson","nba":"IND","pos":"PG/SG","rank":378},{"name":"Bogdan Bogdanovic","nba":"LAC","pos":"SG/SF","rank":379},{"name":"Pete Nance","nba":"MIL","pos":"PF","rank":380},{"name":"Rayan Rupert","nba":"MEM","pos":"SG","rank":381},{"name":"Olivier Sarr","nba":"CLE","pos":"C","rank":382},{"name":"MarJon Beauchamp","nba":"PHI","pos":"SG","rank":383},{"name":"E.J. Liddell","nba":"BKN","pos":"PF","rank":384},{"name":"Jeenathan Williams Jr","nba":"GSW","pos":"SG","rank":385},{"name":"Christian Koloko","nba":"ATL","pos":"C","rank":386},{"name":"Tyson Etienne","nba":"BKN","pos":"PG","rank":387},{"name":"Jamaree Bouyea","nba":"PHO","pos":"PG","rank":390},{"name":"Eric Gordon","nba":"FA","pos":"SG/SF","rank":392},{"name":"Mo Bamba","nba":"FA","pos":"C","rank":393},{"name":"Grant Nelson","nba":"FA","pos":"SF","rank":394},{"name":"PJ Hall","nba":"CHA","pos":"PF","rank":395},{"name":"Jordan Clarkson","nba":"NYK","pos":"SG/SF","rank":398},{"name":"Trey Alexander","nba":"NOR","pos":"SG","rank":400},{"name":"Haywood Highsmith","nba":"PHO","pos":"SF","rank":402},{"name":"Josh Okogie","nba":"HOU","pos":"SG/SF","rank":404},{"name":"Tyrese Martin","nba":"PHI","pos":"SF","rank":405},{"name":"Josh Green","nba":"CHA","pos":"SG/SF","rank":406},{"name":"Zyon Pullin","nba":"MIN","pos":"SG","rank":407},{"name":"Seth Curry","nba":"GSW","pos":"PG/SG","rank":408},{"name":"Jeremiah Robinson-Earl","nba":"FA","pos":"PF/C","rank":409},{"name":"Myron Gardner","nba":"MIA","pos":"SF","rank":410},{"name":"Drew Eubanks","nba":"SAC","pos":"C","rank":413},{"name":"Mac McClung","nba":"CHI","pos":"SG","rank":414},{"name":"Yuki Kawamura","nba":"CHI","pos":"PG","rank":416},{"name":"L.J. Cryer","nba":"GSW","pos":"PG","rank":421},{"name":"Chris Paul","nba":"FA","pos":"PG","rank":423},{"name":"Zeke Nnaji","nba":"DEN","pos":"PF","rank":426},{"name":"Malevy Leons","nba":"GSW","pos":"SF","rank":427},{"name":"Gary Trent","nba":"MIL","pos":"SG","rank":429},{"name":"Marcus Sasser","nba":"DET","pos":"PG","rank":430},{"name":"Kam Jones","nba":"IND","pos":"PG","rank":432},{"name":"Patrick Baldwin","nba":"SAC","pos":"SF","rank":433},{"name":"Dalano Banton","nba":"BOS","pos":"PG/SG/SF","rank":434},{"name":"Tyrese Proctor","nba":"CLE","pos":"SG","rank":435},{"name":"Payton Sandfort","nba":"OKC","pos":"SG","rank":436},{"name":"Jaden Hardy","nba":"WAS","pos":"SG","rank":437},{"name":"Garrison Mathews","nba":"FA","pos":"SG/SF","rank":439},{"name":"Chris Boucher","nba":"FA","pos":"PF/C","rank":440},{"name":"Gary Harris","nba":"MIL","pos":"SG","rank":441},{"name":"Dalen Terry","nba":"PHI","pos":"SG/SF","rank":442},{"name":"Jamal Cain","nba":"ORL","pos":"SF","rank":443},{"name":"Jabari Walker","nba":"PHI","pos":"PF","rank":444},{"name":"Micah Peavy","nba":"NOR","pos":"SG/SF","rank":445},{"name":"Taelon Peter","nba":"IND","pos":"SG","rank":446},{"name":"Ron Harper Jr.","nba":"BOS","pos":"SG/SF","rank":448},{"name":"Ariel Hukporti","nba":"NYK","pos":"C","rank":449},{"name":"Jett Howard","nba":"ORL","pos":"SG/SF","rank":451},{"name":"Keshad Johnson","nba":"MIA","pos":"PF","rank":454},{"name":"Tyus Jones","nba":"DEN","pos":"PG","rank":455},{"name":"Malaki Branham","nba":"FA","pos":"SG","rank":456},{"name":"Tyler Smith","nba":"DAL","pos":"SF","rank":458},{"name":"Tristan Enaruna","nba":"CLE","pos":"SF","rank":459},{"name":"Doug McDermott","nba":"SAC","pos":"SF","rank":460},{"name":"Gabe Vincent","nba":"ATL","pos":"PG","rank":461},{"name":"Jaylen Clark","nba":"MIN","pos":"SG","rank":462},{"name":"Taj Gibson","nba":"MEM","pos":"PF","rank":463},{"name":"Mason Plumlee","nba":"SAS","pos":"C","rank":464},{"name":"Tony Bradley","nba":"ATL","pos":"C","rank":465},{"name":"Keaton Wallace","nba":"ATL","pos":"PG","rank":466},{"name":"A.J. Lawson","nba":"TOR","pos":"SG","rank":467},{"name":"David Jones Garcia","nba":"SAS","pos":"SF","rank":469},{"name":"Riley Minix","nba":"CLE","pos":"SF","rank":470},{"name":"Luke Travers","nba":"FA","pos":"SG","rank":472},{"name":"Liam McNeeley","nba":"CHA","pos":"SG/SF","rank":473},{"name":"Wendell Moore Jr","nba":"DET","pos":"SF","rank":475},{"name":"KJ Simpson","nba":"DEN","pos":"PG","rank":478},{"name":"Nick Smith Jr.","nba":"LAL","pos":"SG","rank":481},{"name":"Tolu Smith","nba":"DET","pos":"PF","rank":483},{"name":"DaRon Holmes II","nba":"DEN","pos":"PF","rank":484},{"name":"Jordan Hawkins","nba":"NOR","pos":"SG","rank":486},{"name":"Norchad Omier","nba":"LAC","pos":"PF","rank":487},{"name":"Colby Jones","nba":"FA","pos":"SG","rank":489},{"name":"RayJ Dennis","nba":"ATL","pos":"PG","rank":490},{"name":"Chris Livingston","nba":"FA","pos":"SF","rank":491},{"name":"Maxi Kleber","nba":"LAL","pos":"PF","rank":492},{"name":"Duop Reath","nba":"FA","pos":"C","rank":493},{"name":"Julian Phillips","nba":"MIN","pos":"SF","rank":494},{"name":"Joe Ingles","nba":"MIN","pos":"SF","rank":495},{"name":"Drew Timme","nba":"LAL","pos":"C","rank":497},{"name":"Mohamed Diawara","nba":"NYK","pos":"PF","rank":498},{"name":"Miles Kelly","nba":"FA","pos":"PG","rank":500},{"name":"Isaiah Livers","nba":"PHO","pos":"PF","rank":501},{"name":"Curtis Jones","nba":"DEN","pos":"SG","rank":502},{"name":"TyTy Washington","nba":"LAC","pos":"PG","rank":503},{"name":"Jordan McLaughlin","nba":"SAS","pos":"PG","rank":504},{"name":"Jonathan Mogbo","nba":"TOR","pos":"PF","rank":505},{"name":"Blake Wesley","nba":"POR","pos":"SG","rank":507},{"name":"Chris Manon","nba":"LAL","pos":"SG","rank":508},{"name":"Amari Williams","nba":"BOS","pos":"C","rank":509},{"name":"Orlando Robinson","nba":"FA","pos":"C","rank":510},{"name":"Jamison Battle","nba":"TOR","pos":"SF","rank":511},{"name":"CJ Huntley","nba":"PHO","pos":"SF","rank":512},{"name":"Amir Coffey","nba":"PHO","pos":"SG","rank":513},{"name":"Jayson Kent","nba":"POR","pos":"SG","rank":514},{"name":"Kevin McCullar Jr","nba":"NYK","pos":"SF","rank":516},{"name":"Jae'Sean Tate","nba":"HOU","pos":"SF","rank":517},{"name":"J.D. Davison","nba":"HOU","pos":"PG","rank":518},{"name":"Brooks Barnhizer","nba":"OKC","pos":"SF","rank":519},{"name":"James Wiseman","nba":"FA","pos":"C","rank":520},{"name":"Pat Connaughton","nba":"CHA","pos":"SG/SF","rank":521},{"name":"Emanuel Miller","nba":"SAS","pos":"PF","rank":522},{"name":"Dillon Jones","nba":"NYK","pos":"SF","rank":523},{"name":"Lachlan Olbrich","nba":"CHI","pos":"PF","rank":524},{"name":"John Tonje","nba":"BOS","pos":"SF","rank":525},{"name":"Caleb Houstan","nba":"FA","pos":"SF","rank":526},{"name":"Antonio Reeves","nba":"CHA","pos":"SG","rank":528},{"name":"Hunter Dickinson","nba":"NOR","pos":"C","rank":530},{"name":"Isaiah Crawford","nba":"HOU","pos":"SF","rank":531},{"name":"N'Faly Dante","nba":"FA","pos":"C","rank":532},{"name":"Colin Castleton","nba":"ORL","pos":"C","rank":533},{"name":"Cam Christie","nba":"LAC","pos":"SG","rank":534},{"name":"Vladislav Goldin","nba":"MIA","pos":"C","rank":535},{"name":"Stanley Umude","nba":"FA","pos":"SG/SF","rank":536},{"name":"Andre Jackson Jr.","nba":"MIL","pos":"SG/SF","rank":537},{"name":"Alijah Martin","nba":"TOR","pos":"SG","rank":538},{"name":"Toby Okani","nba":"MEM","pos":"SF","rank":539},{"name":"Trey Jemison","nba":"NYK","pos":"C","rank":540},{"name":"Chris Youngblood","nba":"POR","pos":"SG","rank":541},{"name":"Lindy Waters III","nba":"SAS","pos":"SG/SF","rank":542},{"name":"A.J. Johnson","nba":"DAL","pos":"SG","rank":543},{"name":"Adou Thiero","nba":"LAL","pos":"SF","rank":544},{"name":"Hunter Tyson","nba":"FA","pos":"SF","rank":545},{"name":"Kobe Bufkin","nba":"FA","pos":"PG/SG","rank":546},{"name":"Thanasis Antetokounmpo","nba":"MIL","pos":"SF","rank":547},{"name":"Monte Morris","nba":"FA","pos":"PG","rank":548},{"name":"Brandon Clarke","nba":"MEM","pos":"PF/C","rank":549},{"name":"Jacob Toppin","nba":"FA","pos":"SF/PF","rank":550},{"name":"Bismack Biyombo","nba":"SAS","pos":"C","rank":551},{"name":"Trentyn Flowers","nba":"FA","pos":"SF","rank":552},{"name":"Harrison Ingram","nba":"SAS","pos":"SF","rank":553},{"name":"Chaz Lanier","nba":"DET","pos":"SG","rank":555},{"name":"Alex Morales","nba":"ORL","pos":"SG","rank":556},{"name":"Nigel Hayes-Davis","nba":"FA","pos":"SF","rank":557},{"name":"Jeff Green","nba":"HOU","pos":"PF","rank":558},{"name":"Pacome Dadiet","nba":"NYK","pos":"SF","rank":559},{"name":"Johnny Juzang","nba":"FA","pos":"SG/SF","rank":560},{"name":"Jahmir Young","nba":"MIA","pos":"PG","rank":561},{"name":"Mark Sears","nba":"FA","pos":"PG","rank":562},{"name":"Alex Antetokounmpo","nba":"MIL","pos":"SF","rank":563},{"name":"Kyle Lowry","nba":"PHI","pos":"PG","rank":564},{"name":"Bobi Klintman","nba":"FA","pos":"PF","rank":565},{"name":"Isaac Jones","nba":"DET","pos":"PF","rank":566},{"name":"Garrett Temple","nba":"TOR","pos":"SG","rank":567},{"name":"Sean Pedulla","nba":"LAC","pos":"PG","rank":568},{"name":"Javonte Cooke","nba":"FA","pos":"SG","rank":569},{"name":"Dario Saric","nba":"FA","pos":"PF","rank":570},{"name":"Markelle Fultz","nba":"FA","pos":"PG/SG","rank":571},{"name":"Hunter Sallis","nba":"FA","pos":"SG","rank":572},{"name":"Drew Peterson","nba":"FA","pos":"SF","rank":573},{"name":"Max Shulga","nba":"BOS","pos":"PG/SG","rank":574},{"name":"Buddy Boeheim","nba":"FA","pos":"SF","rank":575},{"name":"Trevor Keels","nba":"MIA","pos":"SG","rank":576},{"name":"Tosan Evbuomwan","nba":"CHA","pos":"SF","rank":577},{"name":"Darius Brown II","nba":"FA","pos":"PG","rank":580},{"name":"Chucky Hepburn","nba":"TOR","pos":"PG","rank":581},{"name":"Jahmyl Telfort","nba":"FA","pos":"PF","rank":582}];

// Whitelist of valid NBA team abbreviations — anything else is a college/prospect
const BA_NBA_TEAMS = new Set(['ATL','BOS','BKN','CHA','CHI','CLE','DAL','DEN','DET',
  'GSW','HOU','IND','LAC','LAL','MEM','MIA','MIL','MIN','NOR','NYK','OKC','ORL',
  'PHI','PHO','POR','SAC','SAS','TOR','UTA','WAS','FA']);

// BEST_AVAILABLE_BOARD (data/best-available-board.js) ist bereits der fertige,
// gewichtete Gesamtscore ueber ALLE Signale (Dynasty-Rang, BBM-Rang,
// letzte Saison, Off-Season, laufende Saison, Post-Draft-Board fuer
// Rookies) - taeglich neu von scripts/build-best-available-board.js
// gebaut. Hier wird nur noch gegen die aktuellen Rosters gefiltert.
// NBA-Team-Filter. Ein Fantasy-Filter waere hier sinnlos, weil dieses
// Board per Definition nur Spieler zeigt, die in keinem Kader stehen.
// Nuetzlich ist die Frage andersherum: welches NBA-Team hat noch freie
// Spieler mit Rolle?
let baNbaFilter = '';

function baSetNbaFilter(val) {
  baNbaFilter = val || '';
  filterBestAvail();
}

function baFillNbaFilter() {
  const el = document.getElementById('baNbaFilter');
  if (!el) return;
  const all = buildBestAvailRaw();
  const teams = [...new Set(all.map(p => p.nbaTeam).filter(Boolean))].sort();
  el.innerHTML = `<option value="">Alle NBA Teams (${all.length})</option>` +
    teams.map(t => `<option value="${t}">${t} (${all.filter(p => p.nbaTeam === t).length})</option>`).join('');
  el.value = baNbaFilter;
}

// Ohne NBA-Filter, damit die Auswahlliste selbst nicht schrumpft,
// sobald man etwas auswaehlt.
function buildBestAvailRaw() {
  const allRosteredNames = new Set();
  Object.values(ROSTERS).forEach(roster => {
    roster.forEach(p => allRosteredNames.add(normalizeName(p.name)));
  });

  if (typeof BEST_AVAILABLE_BOARD === 'undefined') return [];

  return BEST_AVAILABLE_BOARD
    .filter(p => !allRosteredNames.has(normalizeName(p.name)))
    .filter(p => baExperienceFilter === 'all' || p.experience === baExperienceFilter)
    .map(p => ({
      ...p,
      source: p.isRookie ? 'postdraft' : (p.dynastyRank ? 'dynasty' : 'fa'),
    }));
}

function buildBestAvail() {
  const all = buildBestAvailRaw();
  return baNbaFilter ? all.filter(p => p.nbaTeam === baNbaFilter) : all;
}

function baSetExperienceFilter(val) {
  baExperienceFilter = val;
  filterBestAvail();
}

function renderBestAvail(data) {
  const tbody = document.getElementById('baBody');
  const noR   = document.getElementById('baNoResults');
  if (!data.length) { tbody.innerHTML = ''; noR.style.display = 'block'; return; }
  noR.style.display = 'none';
  tbody.innerHTML = data.map((p, idx) => {
    const rank = idx + 1; // sequenzielle Anzeige-Position, nicht der rohe Composite-Rang aus
                           // BEST_AVAILABLE_BOARD (der hat Lücken, weil rostered Spieler
                           // rausgefiltert werden — siehe Diskussion, verwirrend für Beyaz)
    const name = p.name;
    const nba  = p.nbaTeam;
    const pos  = p.pos;
    const dob  = p.dob ?? null;
    const isFA = p.source === 'fa';
    const isRookie = p.source === 'postdraft' || p.isRookie;

    const age  = playerAge(dob) ?? p.age ?? null;
    const rc   = rankClass(rank);

    // Auf Wunsch zeigt Best Available nur noch den MFHFB-eigenen Dynasty-Rang
    // (data/rankings.js) statt zusaetzlich Matt Lawsons und Hashtag Basketballs
    // Vergleichsrang einzublenden — die bleiben auf der Dynasty-Rankings-Seite
    // selbst weiterhin sichtbar, nur hier auf Best Available nicht mehr.
    const mfhfbBadge = p.dynastyRank
      ? `<span style="font-size:11px;font-weight:800;padding:2px 8px;border-radius:6px;background:${dynastyRankBg(p.dynastyRank)};color:${dynastyRankColor(p.dynastyRank)};">#${p.dynastyRank}</span>`
      : '<span style="color:var(--border);">-</span>';
    const faBadge = isFA
      ? `<span style="font-size:9px;font-weight:800;padding:1px 5px;border-radius:5px;background:rgba(76,175,129,0.15);color:#4caf81;margin-left:5px;vertical-align:middle;">FA</span>`
      : '';
    const rookieBadge = isRookie
      ? `<span style="font-size:9px;font-weight:800;padding:1px 5px;border-radius:5px;background:rgba(108,99,255,0.15);color:#a89bff;margin-left:5px;vertical-align:middle;">ROOKIE</span>`
      : '';
    const stickyBadge = (p.stickyScore !== null && p.stickyScore !== undefined)
      ? `<span style="font-size:11px;font-weight:800;padding:2px 8px;border-radius:6px;background:${p.stickyScore >= 5 ? 'rgba(76,175,129,0.15)' : p.stickyScore >= 0 ? 'rgba(41,182,246,0.15)' : 'rgba(255,101,132,0.12)'};color:${p.stickyScore >= 5 ? '#6dddaa' : p.stickyScore >= 0 ? '#4fc3f7' : '#ff8fa3'};" title="Sticky Score (Summer-League-Modell)">${p.stickyScore.toFixed(1)}</span>`
      : '<span style="color:var(--border);">-</span>';

    const minCell = (p.minutesAvg !== null && p.minutesAvg !== undefined)
      ? `<span style="font-size:12px;color:var(--muted);font-weight:600;">${p.minutesAvg}</span>`
      : '<span style="color:var(--border);">-</span>';

    // Beste/schwaechste Kategorie aus dem jeweils aktuellsten verfuegbaren
    // Fenster (laufende Saison > Off-Season). Fehlt beides (z.B. etablierter
    // Veteran ohne Summer-League-Minuten vor Saisonstart), bleibt das Feld
    // leer statt eine falsche Zahl vorzutaeuschen.
    const bestCatCell = p.bestCat30
      ? `<span style="font-size:11px;font-weight:700;color:#6dddaa;">${p.bestCat30}</span>`
      : '<span style="color:var(--border);">-</span>';
    const worstCatCell = p.worstCat30
      ? `<span style="font-size:11px;font-weight:700;color:#ff8fa3;">${p.worstCat30}</span>`
      : '<span style="color:var(--border);">-</span>';

    // 2026/27 Rankings & Projections — Rankings zieht aus dem permanenten
    // Rolling-Rankings-Archiv der laufenden Saison (Liga "nba"), das sich
    // automatisch füllt, sobald Weekly/Monthly-Daten reinkommen. Off-Season:
    // bleibt leer, das ist erwartet. Projections hat noch keine Quelle.
    const season2627RankCell = p.season2627Rank
      ? `<span style="font-size:11px;font-weight:800;padding:2px 8px;border-radius:6px;background:${dynastyRankBg(p.season2627Rank)};color:${dynastyRankColor(p.season2627Rank)};">#${p.season2627Rank}</span>`
      : '<span style="color:var(--border);">-</span>';
    const season2627ProjCell = '<span style="color:var(--border);">-</span>';

    return `<tr>
      <td><span class="r-rank ${rc}">${rank}</span></td>
      <td><span class="r-name">${name}</span>${faBadge}${rookieBadge}</td>
      <td><span class="r-team r-team-link" onclick="showNBATeam('${nba}')" title="${NBA_TEAM_NAMES[nba]||nba}">${nba}</span></td>
      <td><span class="r-pos">${pos}</span></td>
      <td style="text-align:center;font-size:12px;color:var(--muted);font-weight:600;">${age !== null ? age+'y' : '-'}</td>
      <td style="text-align:center;">${minCell}</td>
      <td style="text-align:center;">${bestCatCell}</td>
      <td style="text-align:center;">${worstCatCell}</td>
      <td style="text-align:center;">${mfhfbBadge}</td>
      <td style="text-align:center;">${stickyBadge}</td>
      <td style="text-align:center;">${season2627RankCell}</td>
      <td style="text-align:center;">${season2627ProjCell}</td>
    </tr>`;
  }).join('');
}

function filterBestAvail() {
  const q = document.getElementById('baSearch').value.toLowerCase().trim();
  let data = q
    ? buildBestAvail().filter(p => {
        const name = (p.name || '').toLowerCase();
        const nba  = (p.nbaTeam || '').toLowerCase();
        const pos  = (p.pos || '').toLowerCase();
        return name.includes(q) || nba.includes(q) || pos.includes(q);
      })
    : buildBestAvail();
  baCurrentData = baSortData(data);
  renderBestAvail(baCurrentData);
}

function showBestAvail() {
  baFillNbaFilter();
  baCurrentData = baSortData(buildBestAvail());
  renderBestAvail(baCurrentData);
  baUpdateSortArrows();
  navigate('bestAvailPage');
}

// ============================================================
