// ============================================================
//  TRADE ANALYZER
// ============================================================

// Trade values from MFHFBs spreadsheet (rank → value lookup).
const TRADE_VALUE_TABLE = {"1": 1590, "2": 1375, "3": 1350, "4": 1325, "5": 1050, "6": 970, "7": 930, "8": 860, "9": 840, "10": 780, "11": 770, "12": 760, "13": 750, "14": 740, "15": 730, "16": 690, "17": 680, "18": 670, "19": 660, "20": 650, "21": 640, "22": 630, "23": 620, "24": 610, "25": 600, "26": 590, "27": 560, "28": 530, "29": 490, "30": 475, "31": 460, "32": 445, "33": 430, "34": 415, "35": 400, "36": 395, "37": 390, "38": 385, "39": 380, "40": 375, "41": 370, "42": 365, "43": 360, "44": 355, "45": 350, "46": 345, "47": 340, "48": 335, "49": 330, "50": 325, "51": 320, "52": 315, "53": 295, "54": 290, "55": 285, "56": 280, "57": 275, "58": 270, "59": 265, "60": 260, "61": 255, "62": 250, "63": 245, "64": 240, "65": 235, "66": 230, "67": 225, "68": 199, "69": 197, "70": 195, "71": 193, "72": 191, "73": 189, "74": 187, "75": 185, "76": 183, "77": 181, "78": 179, "79": 177, "80": 175, "81": 173, "82": 171, "83": 150, "84": 149, "85": 148, "86": 147, "87": 146, "88": 145, "89": 144, "90": 143, "91": 142, "92": 141, "93": 140, "94": 139, "95": 138, "96": 137, "97": 136, "98": 135, "99": 134, "100": 133, "101": 132, "102": 131, "103": 130, "104": 129, "105": 128, "106": 127, "107": 126, "108": 125, "109": 124, "110": 123, "111": 122, "112": 120, "113": 119.5, "114": 119, "115": 118.5, "116": 118, "117": 117.5, "118": 117, "119": 116.5, "120": 116, "121": 115.5, "122": 115, "123": 114.5, "124": 114, "125": 113.5, "126": 113, "127": 112.5, "128": 112, "129": 111.5, "130": 111, "131": 110.5, "132": 110, "133": 109.5, "134": 109, "135": 108.5, "136": 108, "137": 107.5, "138": 107, "139": 106.5, "140": 106, "141": 105.5, "142": 105, "143": 104.5, "144": 104, "145": 103.5, "146": 103, "147": 102.5, "148": 102, "149": 101.5, "150": 101, "151": 100.5, "152": 100, "153": 99.5, "154": 99, "155": 98.5, "156": 98, "157": 97.5, "158": 97, "159": 96.5, "160": 96, "161": 95.5, "162": 95, "163": 94.5, "164": 94, "165": 93.5, "166": 93, "167": 92.5, "168": 92, "169": 91.5, "170": 91, "171": 90.5, "172": 90, "173": 89.5, "174": 89, "175": 88.5, "176": 88, "177": 87.5, "178": 87, "179": 86.5, "180": 86, "181": 85.5, "182": 85, "183": 84.5, "184": 84, "185": 83.5, "186": 83, "187": 82.5, "188": 82, "189": 81.5, "190": 81, "191": 80.5, "192": 80, "193": 79.5, "194": 79, "195": 78.5, "196": 78, "197": 77.5, "198": 77, "199": 76.5, "200": 76, "201": 75.5, "202": 75, "203": 74.5, "204": 74, "205": 73.5, "206": 73, "207": 72.5, "208": 72, "209": 71.5, "210": 71, "211": 70.5, "212": 70, "213": 69.5, "214": 69, "215": 68.5, "216": 68, "217": 67.5, "218": 67, "219": 66.5, "220": 66, "221": 65.5, "222": 65, "223": 64.5, "224": 64, "225": 63.5, "226": 63, "227": 62.5, "228": 62, "229": 61.5, "230": 61, "231": 60.5, "232": 60, "233": 59.5, "234": 59, "235": 58.8, "236": 58.6, "237": 58.4, "238": 58.2, "239": 58, "240": 57.8, "241": 57.6, "242": 57.4, "243": 57.2, "244": 57, "245": 56.8, "246": 56.6, "247": 56.4, "248": 56.2, "249": 56, "250": 55.8, "251": 55.6, "252": 55.4, "253": 55.2, "254": 55, "255": 54.8, "256": 54.6, "257": 54.4, "258": 54.2, "259": 54, "260": 53.8, "261": 53.6, "262": 53.4, "263": 53.2, "264": 53, "265": 52.8, "266": 52.6, "267": 52.4, "268": 52.2, "269": 52, "270": 51.8, "271": 51.6, "272": 51.4, "273": 51.2, "274": 51, "275": 50.8, "276": 50.6, "277": 50.4, "278": 50.2, "279": 50, "280": 49.8, "281": 49.6, "282": 49.4, "283": 49.2, "284": 49, "285": 48.8, "286": 48.6, "287": 48.4, "288": 48.2, "289": 48, "290": 47.8, "291": 47.6, "292": 47.4, "293": 47.2, "294": 47, "295": 46.8, "296": 46.6, "297": 46.4, "298": 46.2, "299": 46, "300": 45.8, "301": 45.6, "302": 45.4, "303": 45.2, "304": 45, "305": 44.8, "306": 44.6, "307": 44.4, "308": 44.2, "309": 44, "310": 43.8, "311": 43.6, "312": 43.4, "313": 43.2, "314": 43, "315": 42.8, "316": 42.6, "317": 42.4, "318": 42.2, "319": 42, "320": 41.8, "321": 41.6, "322": 41.4, "323": 41.2, "324": 41, "325": 40.8, "326": 40.6, "327": 40.4, "328": 40.2, "329": 40, "330": 39.8, "331": 39.6, "332": 39.4, "333": 39.2, "334": 39, "335": 38.8, "336": 38.6, "337": 38.4, "338": 38.2, "339": 38, "340": 37.8, "341": 37.6, "342": 37.4, "343": 37.2, "344": 37, "345": 36.8, "346": 36.6, "347": 36.4, "348": 36.2, "349": 36, "350": 35.8, "351": 35.6, "352": 35.4, "353": 35.2, "354": 35, "355": 34.8, "356": 34.6, "357": 34.4, "358": 34.2, "359": 34, "360": 33.8, "361": 33.6, "362": 33.4, "363": 33.2, "364": 33, "365": 32.8, "366": 32.6, "367": 32.4, "368": 32.2, "369": 32, "370": 31.8, "371": 31.6, "372": 31.4, "373": 31.2, "374": 31, "375": 30.8, "376": 30.6, "377": 30.4, "378": 30.2, "379": 30, "380": 29.8, "381": 29.6, "382": 29.4, "383": 29.2, "384": 29, "385": 28.8, "386": 28.6, "387": 28.4, "388": 28.2, "389": 28, "390": 27.8, "391": 27.6, "392": 27.4, "393": 27.2, "394": 27, "395": 26.8, "396": 26.6, "397": 26.4, "398": 26.2, "399": 26, "400": 25.8, "401": 25.6, "402": 25.4, "403": 25.2, "404": 25, "405": 24.8, "406": 24.6, "407": 24.4, "408": 24.2, "409": 24, "410": 23.8, "411": 23.6, "412": 23.4, "413": 23.2, "414": 23, "415": 22.8, "416": 22.6, "417": 22.4, "418": 22.2, "419": 22, "420": 21.8, "421": 21.6, "422": 21.4, "423": 21.2, "424": 21, "425": 20.8, "426": 20.6, "427": 20.4, "428": 20.2, "429": 20, "430": 19.8, "431": 19.6, "432": 19.4, "433": 19.2, "434": 19, "435": 18.8, "436": 18.6, "437": 18.4, "438": 18.2, "439": 18, "440": 17.8, "441": 17.6, "442": 17.4, "443": 17.2, "444": 17, "445": 16.8, "446": 16.6, "447": 16.4, "448": 16.2, "449": 16, "450": 15.8, "451": 15.6, "452": 15.4, "453": 15.2, "454": 15, "455": 14.8, "456": 14.6, "457": 14.4, "458": 14.2, "459": 14, "460": 13.8, "461": 13.6, "462": 13.4, "463": 13.2, "464": 13, "465": 12.8, "466": 12.6, "467": 12.4, "468": 12.2, "469": 12, "470": 11.8, "471": 11.6, "472": 11.4, "473": 11.2, "474": 11, "475": 10.8, "476": 10.6, "477": 10.4, "478": 10.2, "479": 10, "480": 9.8, "481": 9.6, "482": 9.4, "483": 9.2, "484": 9, "485": 8.8, "486": 8.6, "487": 8.4, "488": 8.2, "489": 8, "490": 7.8, "491": 7.6, "492": 7.4, "493": 7.2, "494": 7, "495": 6.8, "496": 6.6, "497": 6.4, "498": 6.2, "499": 6, "500": 5.8, "501": 5.6, "502": 5.4, "503": 5.2, "504": 5, "505": 4.8, "506": 4.6, "507": 4.4, "508": 4.2, "509": 4, "510": 3.8, "511": 3.6, "512": 3.4, "513": 3.2, "514": 3, "515": 2.8, "516": 2.6, "517": 2.4, "518": 2.2, "519": 2, "520": 1.8, "521": 1.6, "522": 1.4, "523": 1.2, "524": 1, "525": 0.8, "526": 0.6, "527": 0.4, "528": 0, "529": 0, "530": 0, "531": 0, "532": 0, "533": 0, "534": 0, "535": 0, "536": 0, "537": 0, "538": 0, "539": 0, "540": 0, "541": 0, "542": 0, "543": 0, "544": 0, "545": 0, "546": 0, "547": 0, "548": 0, "549": 0, "550": 0, "551": 0, "552": 0, "553": 0, "554": 0, "555": 0, "556": 0, "557": 0, "558": 0, "559": 0, "560": 0, "561": 0, "562": 0, "563": 0, "564": 0, "565": 0, "566": 0, "567": 0, "568": 0, "569": 0, "570": 0, "571": 0, "572": 0, "573": 0, "574": 0, "575": 0, "576": 0, "577": 0, "578": 0, "579": 0, "580": 0, "581": 0, "582": 0, "583": 0, "584": 0, "585": 0, "586": 0, "587": 0, "588": 0, "589": 0, "590": 0, "591": 0, "592": 0, "593": 0, "594": 0, "595": 0, "596": 0, "597": 0, "598": 0, "599": 0, "600": 0, "601": 0, "602": 0, "603": 0, "604": 0, "605": 0, "606": 0, "607": 0, "608": 0, "609": 0, "610": 0, "611": 0, "612": 0, "613": 0, "614": 0, "615": 0, "616": 0, "617": 0, "618": 0, "619": 0, "620": 0, "621": 0, "622": 0, "623": 0, "624": 0, "625": 0, "626": 0, "627": 0, "628": 0, "629": 0, "630": 0, "631": 0, "632": 0, "633": 0, "634": 0, "635": 0, "636": 0, "637": 0, "638": 0, "639": 0, "640": 0, "641": 0, "642": 0, "643": 0, "644": 0, "645": 0, "646": 0, "647": 0, "648": 0, "649": 0, "650": 0, "651": 0, "652": 0, "653": 0, "654": 0, "655": 0, "656": 0, "657": 0};

// ============================================================
//  VALUATION MODE  (dynasty | raw | winnow)
// ============================================================
let TRADE_MODE = 'dynasty';

const MODE_DESCRIPTIONS = {
  dynasty: '<strong style="color:var(--text);">Dynasty:</strong> Age-adjusted for long-term value. Young players get a significant boost, veterans are discounted. Best for rebuilding teams.',
  raw:     '<strong style="color:var(--text);">Raw:</strong> Pure rank-based value with no age adjustment. Neutral consensus view — useful as a baseline when both sides disagree.',
  winnow:  '<strong style="color:var(--text);">Win-Now:</strong> Veterans get a bonus, unproven youngsters are discounted. Best for contending teams prioritizing the next 2–3 seasons.'
};

function setTradeMode(mode) {
  TRADE_MODE = mode;
  document.querySelectorAll('.trade-mode-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('modeBtn-' + mode).classList.add('active');
  document.getElementById('tradeModeDesc').innerHTML = MODE_DESCRIPTIONS[mode];
  // Re-render everything so value badges update immediately without re-clicking
  renderTradeList('A');
  renderTradeList('B');
  renderSelectedPills('A');
  renderSelectedPills('B');
  renderTradeResult();
}

// ============================================================
//  AGE CALCULATION
// ============================================================
function playerAgeToday(dobStr) {
  if (!dobStr) return 26; // fallback to neutral age
  const dob = new Date(dobStr);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

// Age multiplier per mode.
// Dynasty: heavily rewards youth, penalizes age
// Raw: flat 1.0 always
// Win-Now: slight youth penalty, veteran bonus up to ~32, then decline
function ageMultiplier(dobStr, mode) {
  if (mode === 'raw') return 1.0;
  const age = playerAgeToday(dobStr);
  if (mode === 'dynasty') {
    if (age <= 19) return 1.50;
    if (age <= 21) return 1.35;
    if (age <= 23) return 1.20;
    if (age <= 25) return 1.08;
    if (age <= 27) return 1.00;
    if (age <= 29) return 0.82;
    if (age <= 31) return 0.62;
    if (age <= 33) return 0.42;
    if (age <= 35) return 0.22;
    return 0.08;
  }
  if (mode === 'winnow') {
    if (age <= 19) return 0.70;
    if (age <= 21) return 0.82;
    if (age <= 23) return 0.92;
    if (age <= 25) return 1.00;
    if (age <= 27) return 1.10;
    if (age <= 29) return 1.15;
    if (age <= 31) return 1.08;
    if (age <= 33) return 0.88;
    if (age <= 35) return 0.62;
    return 0.30;
  }
  return 1.0;
}

// ============================================================
//  F: Slot-basierte Pick-Werte (early/mid/late für 2026 R1)
// ============================================================
// Für Picks mit explizit gesetztem slot (1-12) wird der Wert
// dynamisch nach Slot-Position berechnet. Für alle anderen Picks
// (ohne slot, z.B. 2026 R2+, 2027+) bleibt "mid" als Standard.
function slotAwarePickValue(pick) {
  if (!pick || !pick.year || !pick.round) return 0;
  const yr = String(pick.year);
  const rd = pick.round;
  // Bestimme Pick-Range basierend auf Slot
  let range = 'mid';
  if (pick.slot != null) {
    if (pick.slot <= 4)       range = 'early';
    else if (pick.slot <= 8)  range = 'mid';
    else                       range = 'late';
  }
  const key = `${yr}_R${rd}_${range}`;
  return (typeof PICK_VALUES !== 'undefined' && PICK_VALUES[key]) || 0;
}

// BUGFIX (16.08.2026): dynastyValue() rief ageMultiplier() nie auf.
// Die drei Valuation-Modi (Dynasty/Raw/Win-Now) unterscheiden sich
// AUSSCHLIESSLICH ueber ageMultiplier() -- p.rank und TRADE_VALUE_TABLE
// sind in allen drei Modi identisch. Ohne den Multiplikator lieferten
// alle drei Modi also zwangslaeufig dieselben Werte; nur das Badge
// ("age 24 · +8%") zeigte einen Unterschied an, der nirgends
// eingerechnet wurde. Der alte Kommentar ("values from source already
// encode all of that") war schlicht falsch -- die Tabelle enthaelt
// keinerlei Altersinformation, nur eine Rang-zu-Wert-Zuordnung.
function dynastyValue(rank, dob, mode) {
  const v = TRADE_VALUE_TABLE[rank];
  if (v === undefined) return 0; // Out-of-range Raenge (tiefer Tail) -> 0
  const mult = ageMultiplier(dob, mode || TRADE_MODE);
  return Math.round(v * mult);
}

// Aggregate trade value with diminishing returns per additional player.
function tradeSideValue(players) {
  if (!players.length) return 0;
  const withValues = players
    .map(p => p.isPick ? pickTradeValue(p, TRADE_MODE) : dynastyValue(p.rank, p.dob, TRADE_MODE))
    .sort((a, b) => b - a);
  let total = 0;
  withValues.forEach((val, i) => { total += val * Math.pow(0.80, i); });
  return Math.round(total);
}

const TRADE_STATE = {
  A: { nbaFilter: '', ttFilter: '', search: '', selected: [] },
  B: { nbaFilter: '', ttFilter: '', search: '', selected: [] },
};

// Pre-built lookup maps for Hashtag and Matt rankings
const _hashtagRankMap = (() => {
  const m = {};
  HASHTAG_RANKINGS.forEach(p => { m[p[1].toLowerCase()] = p[0]; });
  return m;
})();

function hashtagRank(name) {
  const canonical = normalizeName(name).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const entry = HASHTAG_RANKINGS.find(p =>
    normalizeName(p[1]).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') === canonical
  );
  return entry ? entry[0] : null;
}

function mattRank(name) {
  const canonical = normalizeName(name);
  return MATT_RANKS[canonical] ?? MATT_RANKS[name] ?? null;
}

function rankBadgeHtml(label, rank, style) {
  if (rank === null) return `<span style="font-size:9px;font-weight:700;color:var(--muted);white-space:nowrap;">${label} —</span>`;
  return `<span style="font-size:9px;font-weight:700;${style}padding:1px 5px;border-radius:3px;white-space:nowrap;">${label} #${rank}</span>`;
}

function rankStyle(rank) {
  if (rank === null) return '';
  const isLight = document.body.classList.contains('light');
  if (rank <= 5)   return isLight ? 'background:rgba(154,110,16,0.18);color:#9a6e10;'  : 'background:rgba(245,200,66,0.18);color:#f5c842;';
  if (rank <= 15)  return isLight ? 'background:rgba(192,98,47,0.18);color:#c0622f;'   : 'background:rgba(108,99,255,0.18);color:#a89bff;';
  if (rank <= 30)  return isLight ? 'background:rgba(61,138,92,0.18);color:#2d7a50;'   : 'background:rgba(76,175,129,0.18);color:#6dddaa;';
  if (rank <= 75)  return isLight ? 'background:rgba(42,122,184,0.15);color:#2a7ab8;'  : 'background:rgba(41,182,246,0.15);color:#4fc3f7;';
  if (rank <= 150) return isLight ? 'background:rgba(180,60,100,0.13);color:#b43c64;'  : 'background:rgba(255,101,132,0.13);color:#ff8fa3;';
  return 'background:rgba(123,127,158,0.13);color:var(--muted);';
}

function buildTradePlayerPool() {
  const ownerMap = buildFantasyOwnerMap();
  const players  = DYNASTY_PLAYERS.map(p => {
    const ownerId = ownerMap[p[1].toLowerCase()] || null;
    const owner   = ownerId ? teamMap[ownerId] : null;
    return { isPick: false, rank: p[0], name: p[1], nba: p[2], pos: p[3], dob: p[4] || null, owner, ownerId };
  });
  return [...players, ...buildPickPool()];
}

function rankBadgeStyle(rank) {
  if (rank === 1)      return 'background:rgba(245,200,66,0.2);color:#f5c842;';
  if (rank <= 5)       return 'background:rgba(108,99,255,0.2);color:#a89bff;';
  if (rank <= 15)      return 'background:rgba(76,175,129,0.2);color:#6dddaa;';
  if (rank <= 30)      return 'background:rgba(41,182,246,0.2);color:#4fc3f7;';
  if (rank <= 75)      return 'background:rgba(255,101,132,0.15);color:#ff8fa3;';
  return 'background:rgba(123,127,158,0.15);color:var(--muted);';
}

function valueBadgeStyle(val) {
  const isLight = document.body.classList.contains('light');
  if (val >= 9000) return isLight ? 'background:rgba(154,110,16,0.2);color:#9a6e10;'  : 'background:rgba(245,200,66,0.2);color:#f5c842;';
  if (val >= 7000) return isLight ? 'background:rgba(192,98,47,0.2);color:#c0622f;'   : 'background:rgba(108,99,255,0.2);color:#a89bff;';
  if (val >= 5000) return isLight ? 'background:rgba(61,138,92,0.2);color:#2d7a50;'   : 'background:rgba(76,175,129,0.2);color:#6dddaa;';
  if (val >= 3000) return isLight ? 'background:rgba(42,122,184,0.2);color:#2a7ab8;'  : 'background:rgba(41,182,246,0.2);color:#4fc3f7;';
  if (val >= 1500) return isLight ? 'background:rgba(180,60,100,0.15);color:#b43c64;' : 'background:rgba(255,101,132,0.15);color:#ff8fa3;';
  return 'background:rgba(123,127,158,0.15);color:var(--muted);';
}

function initTradeDropdowns() {
  const nbaAbbrs = [...new Set(DYNASTY_PLAYERS.map(p => p[2]))].filter(a => a !== 'FA').sort();
  const nbaOpts = nbaAbbrs.map(a => `<option value="${a}">${a} – ${NBA_TEAM_NAMES[a]||a}</option>`).join('');
const ttOpts = `<option value="unowned">👻 Unowned</option>` + TEAMS.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  ['A','B'].forEach(side => {
    document.getElementById('tradeNbaFilter'+side).innerHTML = `<option value="">🏀 NBA Team</option>${nbaOpts}`;
    document.getElementById('tradeTTFilter'+side).innerHTML = `<option value="">🌮 TT Team</option>${ttOpts}`;
  });
}

function applyTradeDropdown(side) {
  TRADE_STATE[side].nbaFilter = document.getElementById('tradeNbaFilter'+side).value;
  TRADE_STATE[side].ttFilter  = document.getElementById('tradeTTFilter'+side).value;
  // Update visual state on dropdowns
  const nbaEl = document.getElementById('tradeNbaFilter'+side);
  const ttEl  = document.getElementById('tradeTTFilter'+side);
  nbaEl.classList.toggle('has-filter', !!TRADE_STATE[side].nbaFilter);
  ttEl.classList.toggle('has-filter', !!TRADE_STATE[side].ttFilter);
  renderTradeList(side);
}

function filterTradePlayers(side) {
  TRADE_STATE[side].search = document.getElementById('tradeSearch'+side).value;
  renderTradeList(side);
}

function renderTradeList(side) {
  const st   = TRADE_STATE[side];
  const list = document.getElementById('tradeList' + side);
  const isLight = document.body.classList.contains('light');
  const q = (st.search || '').toLowerCase().trim();

  // ── PICKS: nur wenn ein konkretes TT-Team gewaehlt ist ──────
  // (VEREINFACHUNG vom 16.08.2026: der separate "Picks anzeigen"-Knopf
  // ist weg, ebenso die zwei getrennten Listenmodi. Sobald ein TT-Team
  // ausgewaehlt ist, erscheinen seine gehaltenen Picks automatisch als
  // eigener Abschnitt oberhalb der Spielerliste -- ein Team besteht ja
  // ohnehin aus beidem. "Unowned" hat naturgemaess keine Picks.)
  let pickHtml = '';
  const ttFilterId = (st.ttFilter && st.ttFilter !== 'unowned') ? parseInt(st.ttFilter) : null;

  if (ttFilterId) {
    const heldPicks = PICKS.filter(p => p.currentOwner === ttFilterId);
    const selectedPickKeys = st.selected.filter(s => s.isPick).map(s => s.pickKey);

    const matching = heldPicks.filter(p => {
      if (!q) return true;
      const orig = teamMap[p.originalOwner];
      return String(p.year).includes(q) || String(p.round).includes(q) ||
             (orig && orig.name.toLowerCase().includes(q));
    }).sort((a, b) => a.year - b.year || a.round - b.round || a.originalOwner - b.originalOwner);

    if (matching.length) {
      pickHtml += `<div class="trade-section-head">📋 Draft Picks · ${matching.length}</div>`;
      matching.forEach(p => {
        const orig   = teamMap[p.originalOwner];
        const traded = p.originalOwner !== p.currentOwner;
        const key    = `${p.year}_R${p.round}_T${p.originalOwner}`;
        const isSel  = selectedPickKeys.includes(key);
        const val    = slotAwarePickValue(p);

        const statusTxt   = traded ? `→ von ${orig.name}` : 'Eigener Pick';
        const statusColor = traded ? (isLight ? '#b43c64' : '#ff8fa3') : (isLight ? '#c0622f' : '#6c63ff');
        const statusBg    = traded ? (isLight ? 'rgba(180,60,100,0.1)' : 'rgba(255,101,132,0.1)')
                                    : (isLight ? 'rgba(192,98,47,0.1)' : 'rgba(108,99,255,0.12)');

        pickHtml += `<div class="pick-item ${isSel ? 'selected' : ''}"
          onclick="toggleTradePickDirect('${side}','${key}',${p.year},${p.round},${p.originalOwner},${p.currentOwner},${val},'${traded}',${p.slot || 'null'})">
          <div class="tp-check" style="margin-top:2px;flex-shrink:0;">
            ${isSel ? '<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
          </div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span style="font-family:'Playfair Display',serif;font-size:14px;font-weight:800;color:#c58f32;">${p.year}</span>
              <span class="pick-round-pos">Round ${p.round}</span>
              ${p.slot ? `<span style="font-size:9px;font-weight:800;background:rgba(108,99,255,0.18);color:#6c63ff;padding:1px 6px;border-radius:3px;letter-spacing:0.5px;">Pick #${p.slot}</span>` : ''}
              ${p.note ? `<span style="font-size:9px;background:rgba(245,200,66,0.15);color:#f5c842;padding:1px 5px;border-radius:3px;">${p.note}</span>` : ''}
            </div>
            <div style="margin-top:5px;">
              <span style="font-size:11px;font-weight:700;padding:2px 10px;border-radius:20px;background:${statusBg};color:${statusColor};">${statusTxt}</span>
            </div>
          </div>
          <div style="flex-shrink:0;"><span class="pick-value-badge">~${val.toLocaleString()}</span></div>
        </div>`;
      });
    }
  }

  // ── SPIELER ──────────────────────────────────────────────────
  const pool = buildTradePlayerPool().filter(p => !p.isPick);
  const filtered = pool.filter(p => {
    if (st.nbaFilter && p.nba !== st.nbaFilter) return false;
    if (st.ttFilter === 'unowned' && p.ownerId !== null) return false;
    if (st.ttFilter && st.ttFilter !== 'unowned' && p.ownerId !== parseInt(st.ttFilter)) return false;
    if (q && !(p.name.toLowerCase().includes(q) || p.nba.toLowerCase().includes(q) ||
               (p.owner && p.owner.name.toLowerCase().includes(q)))) return false;
    return true;
  });
  const selectedNames = st.selected.filter(s => !s.isPick).map(s => s.name);

  let playerHtml = '';
  // Zwischenueberschrift nur, wenn beide Abschnitte gleichzeitig da sind
  // -- bei reiner Spielersuche (kein TT-Team) waere sie ueberfluessiges
  // Rauschen.
  if (pickHtml && filtered.length) {
    playerHtml += `<div class="trade-section-head">👤 Spieler · ${filtered.length}</div>`;
  }
  playerHtml += filtered.map(p => {
    const isSel      = selectedNames.includes(p.name);
    const ownerLabel = p.owner ? p.owner.name : 'Unowned';
    const val        = dynastyValue(p.rank, p.dob, TRADE_MODE);
    const mRank       = mattRank(p.name);
    const hRank       = hashtagRank(p.name);
    return `<div class="trade-player-item ${isSel ? 'selected' : ''}" onclick="toggleTradePlayer('${side}', ${p.rank})">
      <div class="tp-check">${isSel ? '<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</div>
      <div class="tp-name">${p.name}
        <div class="tp-detail" style="font-size:11px;color:var(--muted);font-weight:400;margin-top:1px;">${p.nba} · ${ownerLabel}</div>
        <div style="display:flex;gap:4px;margin-top:4px;flex-wrap:wrap;">
          ${rankBadgeHtml('MFHFBs', p.rank, rankStyle(p.rank))}
          ${rankBadgeHtml('Matt', mRank, rankStyle(mRank))}
          ${rankBadgeHtml('#️⃣', hRank, rankStyle(hRank))}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;">
        <span style="font-size:10px;font-weight:700;${valueBadgeStyle(val)}padding:1px 5px;border-radius:4px;">${val.toLocaleString()}</span>
      </div>
    </div>`;
  }).join('');

  const combined = pickHtml + playerHtml;
  list.innerHTML = combined || (ttFilterId
    ? '<div class="trade-no-players">Dieses Team hat weder passende Spieler noch Picks.</div>'
    : '<div class="trade-no-players">No players found.</div>');
}

function toggleTradePlayer(side, rank) {
  const st = TRADE_STATE[side];
  const pool = buildTradePlayerPool();
  const player = pool.find(p => p.rank === rank);
  if (!player) return;
  const idx = st.selected.findIndex(s => s.name === player.name);
  if (idx >= 0) { st.selected.splice(idx, 1); } else { st.selected.push(player); }
  renderTradeList(side);
  renderSelectedPills(side);
  renderTradeResult();
}

function removeTradePlayer(side, name) {
  const st = TRADE_STATE[side];
  st.selected = st.selected.filter(s => s.name !== name);
  renderTradeList(side);
  renderSelectedPills(side);
  renderTradeResult();
}

function renderSelectedPills(side) {
  const st   = TRADE_STATE[side];
  const wrap = document.getElementById('tradeSelected' + side);
  if (!st.selected.length) {
    wrap.innerHTML = '<span style="color:var(--muted);font-size:12px;">None yet</span>';
    return;
  }
  wrap.innerHTML = st.selected.map(item => {
    if (item.isPick) {
      const val = pickTradeValue(item, TRADE_MODE);
      return `<span class="trade-selected-pill" style="background:rgba(197,143,50,0.12);border-color:#c58f3266;color:#c58f32;" onclick="removeTradePick('${side}','${item.pickKey}')">
        📋 ${item.name}${item.slot ? ` #${item.slot}` : ''}&nbsp;<span style="font-size:10px;opacity:0.75;">(${val.toLocaleString()})</span> <span class="pill-x">×</span>
      </span>`;
    }
    return `<span class="trade-selected-pill" onclick="removeTradePlayer('${side}','${item.name.replace(/'/g,"\\'")}')">
      ${item.name} <span class="pill-x">×</span>
    </span>`;
  }).join('');
}

function renderTradeResult() {
  const selA = TRADE_STATE.A.selected;
  const selB = TRADE_STATE.B.selected;
  const wrap = document.getElementById('tradeResult');

  if (!selA.length || !selB.length) {
    wrap.innerHTML = '<div class="trade-empty-state">Select at least one player on each side to analyze the trade.</div>';
    return;
  }

  const valA = tradeSideValue(selA);
  const valB = tradeSideValue(selB);
  const total = valA + valB;
  const pctA = total > 0 ? (valA / total * 100) : 50;
  const pctB = 100 - pctA;
  const diff = Math.abs(pctA - 50); // how far from 50/50

  const aWins = valA > valB;
  let verdict, cls, subtext;

  if (diff < 5) {
    verdict = 'Fair Trade'; cls = 'fair';
    subtext = 'Both sides receive roughly equal dynasty value.';
  } else if (diff < 12) {
    verdict = aWins ? 'Slight Edge: Side A' : 'Slight Edge: Side B';
    cls = 'slight';
    subtext = `Side ${aWins ? 'A' : 'B'} gets the better end, but it's reasonably close.`;
  } else {
    verdict = aWins ? 'Side A Wins Big' : 'Side B Wins Big';
    cls = 'lopsided';
    subtext = `Side ${aWins ? 'A' : 'B'} gets significantly more dynasty value.`;
  }

  function breakdownSide(players, label, sideVal) {
    // Sort by value for display
const sorted = [...players].sort((a, b) => {
  const va = a.isPick ? pickTradeValue(a, TRADE_MODE) : dynastyValue(a.rank, a.dob, TRADE_MODE);
  const vb = b.isPick ? pickTradeValue(b, TRADE_MODE) : dynastyValue(b.rank, b.dob);
  return vb - va;
});   const rows = sorted.map((p, i) => {
      const rawVal       = p.isPick ? pickTradeValue(p, TRADE_MODE) : dynastyValue(p.rank, p.dob, TRADE_MODE);
      const effectiveVal = Math.round(rawVal * Math.pow(0.80, sorted.indexOf(p)));
      const isDiscounted = i > 0;
      const isLight      = document.body.classList.contains('light');

      let rankSection = '';
      if (p.isPick) {
        const ownerChips = (p.owners || []).map(o => {
          if (!o.curr) return '';
          const color = isLight ? o.curr.lightColor : o.curr.color;
          return `<span class="pick-owner-chip ${o.traded ? 'traded' : ''}" style="${o.traded ? '' : `border-color:${color}44;color:${color};`}">${o.traded ? '→ ' : ''}${o.curr.name}${o.note ? ` (${o.note})` : ''}</span>`;
        }).join('');
        rankSection = `<div style="margin-top:5px;">
          <span style="font-size:9px;font-weight:700;background:rgba(197,143,50,0.15);color:#c58f32;padding:1px 5px;border-radius:3px;">📋 ${p.pickRange} · ${p.year}</span>
          <div style="margin-top:3px;">${ownerChips}</div>
        </div>`;
      } else {
        const mRank2    = mattRank(p.name);
        const hRank2    = hashtagRank(p.name);
        const ageMult2  = ageMultiplier(p.dob, TRADE_MODE);
        const pAge2     = p.dob ? playerAgeToday(p.dob) : null;
        const ageStyle2 = ageMult2 >= 1.20 ? 'background:rgba(76,175,129,0.18);color:#6dddaa;' :
                          ageMult2 >= 1.05 ? 'background:rgba(108,99,255,0.15);color:#a89bff;' :
                          ageMult2 <= 0.50 ? 'background:rgba(255,101,132,0.18);color:#ff8fa3;' :
                          ageMult2 <= 0.80 ? 'background:rgba(245,200,66,0.15);color:#f5c842;' :
                          'background:rgba(123,127,158,0.12);color:var(--muted);';
        const ageLabel2 = TRADE_MODE !== 'raw' && pAge2
          ? `<span style="font-size:9px;font-weight:700;${ageStyle2}padding:1px 5px;border-radius:3px;white-space:nowrap;">age ${pAge2} · ${ageMult2 >= 1 ? '+' : ''}${Math.round((ageMult2-1)*100)}%</span>`
          : '';
        rankSection = `<div style="display:flex;gap:4px;margin-top:5px;flex-wrap:wrap;">
          ${rankBadgeHtml('MFHFBs', p.rank, rankStyle(p.rank))}
          ${rankBadgeHtml('Matt',   mRank2, rankStyle(mRank2))}
          ${rankBadgeHtml('#️⃣',   hRank2, rankStyle(hRank2))}
          ${ageLabel2}
        </div>`;
      }

      const ownerLabel = p.isPick
        ? (p.owners || []).map(o => o.curr ? o.curr.name : '').filter(Boolean).join(', ') || '—'
        : (p.owner ? p.owner.name : 'Unowned');

      return `<div class="trade-breakdown-player">
        <div style="flex:1;">
          <div class="tbp-name">${p.name}</div>
          <div class="tbp-detail">${p.isPick ? '📋 Draft Pick' : p.nba} · ${ownerLabel}</div>
          ${rankSection}
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div style="font-size:11px;font-weight:800;${valueBadgeStyle(rawVal)}padding:2px 5px;border-radius:4px;">${effectiveVal.toLocaleString()}</div>
          ${isDiscounted ? `<div style="font-size:9px;color:var(--muted);margin-top:2px;">–20% depth</div>` : ''}
        </div>
      </div>`;
    }).join('');

    return `<div class="trade-breakdown-side">
      <div class="trade-breakdown-label">${label}</div>
      ${rows}
      <div class="trade-value-row">
        <span class="trade-value-label">Total Value</span>
        <span class="trade-value-val" style="color:var(--accent);">${sideVal.toLocaleString()}</span>
      </div>
    </div>`;
  }

  // Value bar
  const barColor = cls === 'fair' ? '#4caf81' : cls === 'slight' ? '#f5c842' : '#ff6584';
  const barFillPct = aWins ? pctA : pctB;

  wrap.innerHTML = `<div class="trade-result-box ${cls}">
    <div class="trade-verdict ${cls}">${verdict}</div>
    <div class="trade-sub">${subtext}</div>
    <div class="trade-value-bar-wrap">
      <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;color:var(--muted);margin-bottom:5px;">
        <span>Side A &nbsp;<strong style="color:var(--text);">${valA.toLocaleString()}</strong></span>
        <span><strong style="color:var(--text);">${valB.toLocaleString()}</strong>&nbsp; Side B</span>
      </div>
      <div class="trade-value-bar-track">
        <div class="trade-value-bar-fill" style="width:${pctA.toFixed(1)}%;background:${aWins ? barColor : 'var(--muted)'};"></div>
      </div>
      <div class="trade-value-bar-labels" style="align-items:center;">
        <span style="${aWins ? `font-weight:800;color:${barColor};` : ''}">${pctA.toFixed(1)}% ${aWins ? '← Side A wins' : ''}</span>
        <span style="${!aWins ? `font-weight:800;color:${barColor};` : ''}">${!aWins ? 'Side B wins →' : ''} ${pctB.toFixed(1)}%</span>
      </div>
    </div>
    <div class="trade-breakdown">
      ${breakdownSide(selA, 'Side A', valA)}
      <div style="display:flex;align-items:center;padding:0 4px;">
        <div style="font-family:'Playfair Display',serif;font-size:20px;font-weight:800;color:var(--muted);">vs</div>
      </div>
      ${breakdownSide(selB, 'Side B', valB)}
    </div>
    <div style="margin-top:16px;padding:10px 14px;background:var(--surface2);border-radius:10px;font-size:11px;color:var(--muted);text-align:left;line-height:1.6;" id="tradeCalcExplainer">

    </div>

  </div>`;
  // Populate dynamic explainer
  const modeLabels = {
    dynasty: 'Dynasty mode',
    raw: 'Raw mode',
    winnow: 'Win-Now mode'
  };
  const ageNote = {
    dynasty: 'Young players (≤21) get up to +50% bonus; veterans 32+ are heavily discounted.',
    raw: 'No age adjustment — pure rank value only.',
    winnow: 'Players aged 25–31 are rewarded; teenagers and players 36+ are discounted.'
  };
  const el = document.getElementById('tradeCalcExplainer');
  if (el) el.innerHTML = `<strong style="color:var(--text);">${modeLabels[TRADE_MODE]} — How value is calculated:</strong> Raw values from MFHFBs' trade sheet minus a dynamic replacement floor (avg. ranks 175–250). Cliff: full value ≤50, 85% at 51–100, 65% at 101–150, 35% at 151–175, zero beyond. ${ageNote[TRADE_MODE]} Each additional packaged player counts at <strong>70%</strong> of their value (diminishing returns).`;
}

function showTrade() {
  TRADE_STATE.A.selected = []; TRADE_STATE.B.selected = [];
  TRADE_STATE.A.nbaFilter = ''; TRADE_STATE.B.nbaFilter = '';
  TRADE_STATE.A.search    = ''; TRADE_STATE.B.search    = '';

  // Auto-Vorauswahl: wenn ein Team aktiv war, Side A vorfiltern
  const preselectTeam = currentTeamId;
  TRADE_STATE.A.ttFilter = preselectTeam ? String(preselectTeam) : '';
  TRADE_STATE.B.ttFilter = '';

  initTradeDropdowns();

  ['A','B'].forEach(side => {
    document.getElementById('tradeNbaFilter'+side).value = '';
    document.getElementById('tradeTTFilter'+side).value  = TRADE_STATE[side].ttFilter || '';
    document.getElementById('tradeSearch'+side).value    = '';
    document.getElementById('tradeNbaFilter'+side).classList.remove('has-filter');
const pickBtn = document.getElementById('pickBtn' + side);
    if (pickBtn) { pickBtn.classList.remove('active'); pickBtn.textContent = '📋 Picks anzeigen'; }
    const ttEl = document.getElementById('tradeTTFilter'+side);
    ttEl.classList.toggle('has-filter', !!TRADE_STATE[side].ttFilter);
  });

  renderTradeList('A');
  renderTradeList('B');
  renderSelectedPills('A');
  renderSelectedPills('B');
  renderTradeResult();
  navigate('tradePage');

  // Kleiner Hinweis wenn vorausgefüllt
  if (preselectTeam) {
    const team = teamMap[preselectTeam];
    const hint = document.createElement('div');
    hint.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--surface);border:1px solid var(--accent);border-radius:12px;padding:10px 18px;font-size:12px;font-weight:600;color:var(--accent);z-index:200;box-shadow:0 4px 20px rgba(108,99,255,0.3);animation:modalIn 0.2s ease;pointer-events:none;white-space:nowrap;';
    hint.textContent = `Side A → ${team.name} vorausgewählt`;
    document.body.appendChild(hint);
    setTimeout(() => hint.remove(), 2500);
  }
}

// ============================================================
//  TRADE SHARE MODAL — implementiert die fehlenden Handler
//  für tradeScreenshotBtn, closeShareModal, copyShareBtn, downloadShareBtn
// ============================================================

function closeShareModal() {
  const overlay = document.getElementById('shareModalOverlay');
  if (overlay) overlay.style.display = 'none';
}

function openTradeShareModal() {
  const selA = TRADE_STATE.A.selected || [];
  const selB = TRADE_STATE.B.selected || [];
  if (!selA.length || !selB.length) {
    const hint = document.createElement('div');
    hint.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--surface);border:1px solid var(--accent2);border-radius:12px;padding:10px 18px;font-size:12px;font-weight:600;color:var(--accent2);z-index:200;box-shadow:0 4px 20px rgba(0,0,0,0.3);pointer-events:none;white-space:nowrap;';
    hint.textContent = 'Wähle Spieler/Picks auf beiden Seiten aus.';
    document.body.appendChild(hint);
    setTimeout(() => hint.remove(), 2200);
    return;
  }

  const isLight = document.body.classList.contains('light');
  const th = isLight ? {
    bg: '#fff5ee', surface: '#ffffff', surface2: '#fdebd8',
    border: '#f0d5bc', text: '#2c1a0e', muted: '#9a7560',
    accentA: '#c0622f', accentB: '#e8975a', divider: '#f0d5bc',
  } : {
    bg: '#0f1117', surface: '#1a1d27', surface2: '#222636',
    border: '#2e3250', text: '#e8eaf6', muted: '#7b7f9e',
    accentA: '#6c63ff', accentB: '#ff6584', divider: '#2e3250',
  };

  // Werte beider Seiten
  const valA = (typeof tradeSideValue === 'function') ? tradeSideValue(selA) : 0;
  const valB = (typeof tradeSideValue === 'function') ? tradeSideValue(selB) : 0;
  const total = valA + valB;
  const pctA = total > 0 ? (valA / total * 100) : 50;
  const pctB = 100 - pctA;
  const diff = Math.abs(pctA - 50);
  const aWins = valA > valB;

  let verdict, cls, verdictColor;
  if (diff < 5)       { verdict = '✅ Fair Trade';                            cls = 'fair';     verdictColor = '#4caf81'; }
  else if (diff < 12) { verdict = aWins ? '🟡 Leichter Edge: Side A' : '🟡 Leichter Edge: Side B'; cls = 'slight'; verdictColor = '#f5c842'; }
  else                { verdict = aWins ? '🔥 Side A gewinnt deutlich' : '🔥 Side B gewinnt deutlich'; cls = 'lopsided'; verdictColor = '#ff6584'; }

  function pillRow(items, label, val) {
    const rows = [...items]
      .sort((a, b) => {
        const va = a.isPick ? (a.baseValue || 0) : (typeof dynastyValue === 'function' ? dynastyValue(a.rank, a.dob, TRADE_MODE) : 0);
        const vb = b.isPick ? (b.baseValue || 0) : (typeof dynastyValue === 'function' ? dynastyValue(b.rank, b.dob) : 0);
        return vb - va;
      })
      .map((p, i) => {
        let line, detail, value;
        if (p.isPick) {
          const slotLabel = p.slot ? ` · Pick #${p.slot}` : '';
          line   = `📋 ${p.year} R${p.round}${slotLabel}`;
          detail = p.orig ? `via ${p.orig.name}` : '';
          value  = (typeof pickTradeValue === 'function') ? pickTradeValue(p, TRADE_MODE) : (p.baseValue || 0);
        } else {
          line   = p.name;
          detail = `${p.nba || ''}${p.owner ? ' · ' + p.owner.name : ''}`;
          value  = (typeof dynastyValue === 'function') ? dynastyValue(p.rank, p.dob, TRADE_MODE) : 0;
        }
        const effective = Math.round(value * Math.pow(0.80, i));
        return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid ${th.divider};">
          <div style="width:24px;height:24px;border-radius:6px;background:${th.accentA}22;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:${th.accentA};flex-shrink:0;">${i+1}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:700;font-size:13px;color:${th.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${line}</div>
            <div style="font-size:11px;color:${th.muted};">${detail}</div>
          </div>
          <div style="text-align:right;flex-shrink:0;">
            <div style="font-size:12px;font-weight:800;color:${th.text};">${effective.toLocaleString()}</div>
            ${i > 0 ? `<div style="font-size:9px;color:${th.muted};">×0.8^${i}</div>` : ''}
          </div>
        </div>`;
      }).join('');
    return `<div style="background:${th.surface};border:1px solid ${th.border};border-radius:12px;padding:12px 14px;margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${th.muted};">${label}</div>
        <div style="font-size:13px;font-weight:800;color:${th.accentA};">${val.toLocaleString()}</div>
      </div>
      ${rows}
    </div>`;
  }

  const modeNames = { dynasty: '🏗️ Dynasty', raw: '📊 Raw', winnow: '🏆 Win-Now' };
  const cardHtml = `<div id="shareCardInner" style="
    background:${th.bg};border:2px solid ${th.accentA};border-radius:20px;
    padding:24px 20px 20px;font-family:'DM Sans',system-ui,sans-serif;color:${th.text};
    max-width:480px;margin:0 auto;aspect-ratio:4/5;display:flex;flex-direction:column;justify-content:space-between;">
    <div style="text-align:center;margin-bottom:14px;">
      <div style="font-size:10px;font-weight:700;letter-spacing:2px;color:${th.muted};text-transform:uppercase;margin-bottom:5px;">🌮 Taco Tuesday HQ · Trade Analyzer</div>
      <div style="font-family:'Playfair Display',Georgia,serif;font-size:22px;font-weight:800;color:${th.accentA};">${verdict}</div>
      <div style="font-size:11px;color:${th.muted};margin-top:4px;">${modeNames[TRADE_MODE] || TRADE_MODE}-Bewertung</div>
    </div>
    ${pillRow(selA, 'Side A', valA)}
    <div style="text-align:center;font-family:'Playfair Display',serif;font-size:18px;font-weight:800;color:${th.muted};margin:4px 0;">vs</div>
    ${pillRow(selB, 'Side B', valB)}
    <div style="margin-top:10px;height:8px;background:${th.surface2};border-radius:4px;overflow:hidden;display:flex;">
      <div style="width:${pctA.toFixed(1)}%;background:${aWins ? verdictColor : th.muted};"></div>
      <div style="width:${pctB.toFixed(1)}%;background:${!aWins ? verdictColor : th.muted};"></div>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:10px;font-weight:700;color:${th.muted};margin-top:5px;">
      <span>${pctA.toFixed(1)}%</span>
      <span>${pctB.toFixed(1)}%</span>
    </div>
    <div style="text-align:center;margin-top:14px;font-size:9px;color:${th.muted};letter-spacing:1px;text-transform:uppercase;">taco-tuesday-league.com</div>
  </div>`;

  document.getElementById('shareCardContent').innerHTML = cardHtml;
  document.getElementById('shareModalOverlay').style.display = 'flex';

  // Speichere Plain-Text-Version für Copy
  window._tradeShareText = buildTradeShareText(selA, selB, valA, valB, verdict);
}

function buildTradeShareText(selA, selB, valA, valB, verdict) {
  function fmtSide(items) {
    return items.map(p => {
      if (p.isPick) {
        const slotLabel = p.slot ? ` Pick #${p.slot}` : '';
        const via = p.orig ? ` (via ${p.orig.name})` : '';
        return `  • ${p.year} R${p.round}${slotLabel}${via}`;
      }
      const owner = p.owner ? ` (${p.owner.name})` : '';
      return `  • ${p.name}${owner}`;
    }).join('\n');
  }
  return [
    '🌮 Taco Tuesday HQ · Trade Analyzer',
    verdict.replace(/[^\w\s\-:äöüÄÖÜß]/g, '').trim(),
    '',
    `Side A (${valA.toLocaleString()}):`,
    fmtSide(selA),
    '',
    `Side B (${valB.toLocaleString()}):`,
    fmtSide(selB),
  ].join('\n');
}

function copyTradeShare() {
  let txt = window._tradeShareText || '';
  if (!txt) {
    const card = document.getElementById('shareCardInner');
    if (card) txt = card.innerText.replace(/\n{3,}/g, '\n\n').trim();
  }
  if (!txt) return;
  navigator.clipboard.writeText(txt).then(() => {
    const btn = document.getElementById('copyShareBtn');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✓ Kopiert!';
      setTimeout(() => { btn.textContent = orig; }, 1500);
    }
  }).catch(err => {
    console.error('Copy failed:', err);
    alert('Kopieren fehlgeschlagen. Bitte manuell kopieren.');
  });
}

async function downloadTradeShare() {
  const card = document.getElementById('shareCardInner');
  if (!card) return;
  if (typeof html2canvas !== 'function') {
    alert('html2canvas Library nicht geladen.');
    return;
  }

  const btn = document.getElementById('downloadShareBtn');
  const orig = btn ? btn.textContent : '';
  if (btn) { btn.textContent = '⏳ Erstelle...'; btn.disabled = true; }

  try {
    const isLight = document.body.classList.contains('light');
    const canvas = await html2canvas(card, {
      backgroundColor: isLight ? '#fff5ee' : '#0f1117',
      scale: 2,
      logging: false,
      useCORS: true,
    });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    const stamp = new Date().toISOString().split('T')[0];
    link.download = `taco-trade-${stamp}.png`;
    link.click();
    if (btn) { btn.textContent = '✓ Gespeichert!'; }
    setTimeout(() => { if (btn) { btn.textContent = orig; btn.disabled = false; } }, 1500);
  } catch (err) {
    console.error('Screenshot failed:', err);
    alert('Fehler beim Erstellen: ' + err.message);
    if (btn) { btn.textContent = orig; btn.disabled = false; }
  }
}

// Event-Handler an die existierenden Buttons binden — sobald DOM bereit ist
(function bindTradeShareHandlers() {
  function bind() {
    const shareBtn    = document.getElementById('tradeScreenshotBtn');
    const copyBtn     = document.getElementById('copyShareBtn');
    const downloadBtn = document.getElementById('downloadShareBtn');
    const overlay     = document.getElementById('shareModalOverlay');

    if (shareBtn && !shareBtn._bound)    { shareBtn.addEventListener('click', openTradeShareModal); shareBtn._bound = true; }
    if (copyBtn && !copyBtn._bound)      { copyBtn.addEventListener('click', copyTradeShare);       copyBtn._bound  = true; }
    if (downloadBtn && !downloadBtn._bound) { downloadBtn.addEventListener('click', downloadTradeShare); downloadBtn._bound = true; }
    if (overlay && !overlay._bound) {
      overlay.addEventListener('click', (e) => { if (e.target === overlay) closeShareModal(); });
      overlay._bound = true;
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
