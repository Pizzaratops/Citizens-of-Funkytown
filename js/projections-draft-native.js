// ============================================================
//  DRAFT BOARD (nativ) — Logik
// ============================================================
//  Uebernommen aus dem inline <script> von projections/draft.html (das bis
//  2026-08-01 per Iframe lief). Inhaltlich unveraendert bis auf:
//  - mfhfbInitThemeToggle entfernt (TTHQ-Theme greift nativ)
//  - IDs seasonBadge/footerText -> seasonBadgeDraft/footerTextDraft
//    (kollidierten mit der bereits nativen Projections-Seite)
//  - Side-Panel-Tab-Klassen .tab/.tabpane -> .dtab/.dtabpane, Selektoren
//    auf #liveProjDraftPage gescoped (TTHQ definiert .tab/.tabs GLOBAL in
//    css/style.css fuer die Roster-Seite — haette sonst sowohl Styles als
//    auch querySelectorAll-Treffer in fremde Seiten geleakt)
//  Gleiches Lazy-Load-Muster wie Projections/NBA Teams, siehe
//  js/player-rankings.js. fantrax-live.js kommt als eigene Abhaengigkeit mit.
// ============================================================

function initLiveProjDraftNative() {


  // Aktuelles Team statt historischem Vorsaison-Team (siehe ausführlicher
  // Kommentar in index.html / assets/shared.js) -- muss VOR dem ersten
  // buildPlayers()-Aufruf passieren, der p.team in row.team kopiert.
  if (typeof ROSTERS_DATA !== 'undefined') { mfhfbApplyCurrentTeams(PLAYER_RATES); mfhfbSyncManualTeams(); }
  // Season-Label-Liste (2018-19 · 2019-20 · ...) auf Wunsch entfernt — der Badge bleibt leer/ungenutzt.
  document.getElementById('footerTextDraft').textContent =
    'Nutzt dieselben Projections wie die Projections-Seite (inkl. Gewichtungen, Minuten-Overrides und manuellen Rookie-Stats). ' +
    'Änderungen an Gewichtung/Z-Basis auf der Projections-Seite wirken sich sofort hier aus. ' +
    'ADP-Spalte: Durchschnitts-Draftposition aus ' + (typeof ADP_DATA !== 'undefined' ? Object.values(ADP_DATA).filter(d=>d.ownAdp!==null).length : 0) +
    ' erfassten Spielern über deine hochgeladenen Fantrax Draft Results (data/draft-results/). ' +
    'F-ADP-Spalte: Fantrax\' eigener aktueller ADP-Snapshot (data/fantrax-adp.csv, ' + (typeof ADP_DATA !== 'undefined' ? Object.values(ADP_DATA).filter(d=>d.fantraxAdp!==null).length : 0) + ' Spieler).';

  const CATS = [
    {key:'pts', label:'PTS'},
    {key:'reb', label:'REB'},
    {key:'ast', label:'AST'},
    {key:'stl', label:'STL'},
    {key:'blk', label:'BLK'},
    {key:'fg3m', label:'3PM'},
    {key:'fgpct', label:'FG%'},
    {key:'ftpct', label:'FT%'},
    {key:'tov', label:'TOV', invert:true},
  ];
  const Z_CATS = ['pts', 'reb', 'ast', 'stl', 'blk', 'fg3m', 'tov', 'ftpct', 'fgpct'];
  const POSITIONS = ['PG','SG','SF','PF','C'];
  const SLOT_DEFS = [['PG',2],['SG',2],['SF',2],['PF',2],['C',2],['UTIL',4]];
  const TEAMS = 12;
  const SLOTS_PER_TEAM = SLOT_DEFS.reduce((s,d)=>s+d[1],0); // 14
  const TOTAL_PICKS = TEAMS * SLOTS_PER_TEAM;

  const MFHFB_DRAFT_KEY = 'mfhfb_draft_state_v1';
  const MFHFB_POINTS_KEY = 'mfhfb_points_weights_v1';

  // Liga-Formate. '9cat_roto' und '9cat_h2h' nutzen dieselbe Empfehlungs-Logik
  // (Kategorie-Rang-basiert) -- der Unterschied Roto/H2H wirkt sich auf den
  // Draft-Wert kaum aus, nur auf die Matchup-Logik während der Saison selbst.
  const FORMATS = [
    {key:'9cat_roto', label:'9-Cat Roto'},
    {key:'9cat_h2h', label:'9-Cat H2H (Categories)'},
    {key:'points', label:'Punkte-Liga'},
    {key:'bestball', label:'Best Ball'},
  ];
  const DEFAULT_POINTS_WEIGHTS = { pts:1, reb:1.2, ast:1.5, stl:3, blk:3, fg3m:1, tov:-1 };
  function loadPointsWeights(){
    try{
      const stored = JSON.parse(localStorage.getItem(MFHFB_POINTS_KEY) || 'null');
      return stored ? { ...DEFAULT_POINTS_WEIGHTS, ...stored } : { ...DEFAULT_POINTS_WEIGHTS };
    }catch(e){ return { ...DEFAULT_POINTS_WEIGHTS }; }
  }
  function savePointsWeights(w){ try{ localStorage.setItem(MFHFB_POINTS_KEY, JSON.stringify(w)); }catch(e){} }

  // Ungefähre Saison-Längen für die Verfügbarkeits-Quote (gp/max). 2020-21 war
  // coronabedingt auf 72 Spiele verkürzt, alle anderen Saisons hier 82 -- eine
  // grobe Näherung, keine exakte Schedule-Datenquelle (die gibt's im Projekt
  // nicht, siehe Chat vom 22.07.2026).
  const SEASON_MAX_GAMES = {
    '2018-19':82, '2019-20':82, '2020-21':72, '2021-22':82,
    '2022-23':82, '2023-24':82, '2024-25':82, '2025-26':82,
  };
  function mfhfbDurability(playerRatesEntry){
    if(!playerRatesEntry || !playerRatesEntry.seasons) return { durability: 0.85, known:false };
    const labels = SEASON_LABELS.filter(l => playerRatesEntry.seasons[l] && playerRatesEntry.seasons[l].gp != null).slice(-3);
    if(!labels.length) return { durability: 0.85, known:false };
    const ratios = labels.map(l => {
      const max = SEASON_MAX_GAMES[l] || 82;
      return Math.min(1, playerRatesEntry.seasons[l].gp / max);
    });
    return { durability: ratios.reduce((a,b)=>a+b,0)/ratios.length, known:true };
  }

  // ---------------- Normalverteilung (für Fall-Wahrscheinlichkeit ADP) ----------------
  function erf(x){
    const sign = x<0?-1:1; x=Math.abs(x);
    const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;
    const t=1/(1+p*x);
    const y=1-(((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);
    return sign*y;
  }
  function normalCdf(x){ return 0.5*(1+erf(x/Math.SQRT2)); }
  // Wahrscheinlichkeit, dass ein Spieler NACH "atPick" noch verfügbar ist,
  // geschätzt aus seiner erfassten eigenen ADP (Streuung aus ownMin/ownMax)
  // bzw. Fantrax-ADP als Fallback mit grober Default-Streuung.
  function fallProbability(p, atPick){
    let mean = null, sd = null;
    if(p.adp !== null && p.adpCount >= 3 && p.adpMin != null && p.adpMax != null){
      mean = p.adp; sd = Math.max(2, (p.adpMax - p.adpMin) / 4);
    } else if(p.adp !== null){
      mean = p.adp; sd = Math.max(4, p.adp * 0.3);
    } else if(p.fadp !== null){
      mean = p.fadp; sd = Math.max(4, p.fadp * 0.3);
    } else {
      return null;
    }
    const z = (atPick - 0.5 - mean) / sd;
    return 1 - normalCdf(z);
  }

  // ---------------- build player pool from the site's own projection engine ----------------
  function buildPlayers(){
    const weights = mfhfbGetWeights();
    const catWeights = mfhfbGetCategoryWeights();
    const poolSize = mfhfbGetPoolSize();
    const overrides = mfhfbGetOverrides();

    let rows = PLAYER_RATES
      .filter(p => mfhfbIsOnCurrentRoster(p.name, p.team))
      .map((p, idx) => {
      const latest = mfhfbLatestSeason(p);
      const key = mfhfbNormalizeName(p.name);
      // Im Consensus-Modus stammt auch die VORGESCHLAGENE Minutenzahl aus
      // der Projection, nicht aus der letzten gespielten Saison -- sonst
      // wuerde eine 2026/27-Projection mit den Minuten von 2025/26
      // hochgerechnet. Ein manueller Override sticht wie immer beides.
      const cons = typeof mfhfbConsensusRatesFor === 'function' ? mfhfbConsensusRatesFor(p) : null;
      const baseMpg = cons ? cons.mpg : latest.mpg;
      const baseGp  = cons && cons.gp ? cons.gp : latest.gp;
      const minutes = overrides[key] !== undefined ? overrides[key] : mfhfbDefaultMinutes(p.name, baseMpg, baseGp);
      const proj = mfhfbComputeProjection(p, minutes, weights);
      // fgm/fga/ftm/fta kommen jetzt direkt aus mfhfbComputeProjection() mit
      // (früher hier separat nachgerechnet, seit dem FG%/FT%-Volumen-Fix
      // zentral in shared.js miterledigt -- kein Duplikat mehr nötig).
      const dur = mfhfbDurability(p);
      return { rk: idx+1, n: p.name, team: p.team || '-', pos: p.pos || '-', s: proj, manual:false,
               durability: dur.durability, durabilityKnown: dur.known };
    });

    const manualStats = mfhfbGetManualStats();
    const PROD_CATS = ['pts', 'reb', 'ast', 'stl', 'blk', 'fg3m'];
    // Namen, für die wir schon echte Saisondaten haben -- ein manueller
    // Eintrag mit demselben Namen würde nameToRk (siehe reindexNames() weiter
    // unten) doppelt belegen und Fantrax-Picks der falschen Zeile zuordnen
    // (genau der Bug, den "Brandon Miller" verursacht hat -- ein echter
    // Hornets-Spieler, der versehentlich auch in rookie-projections.js stand).
    // Zweite Absicherung zusätzlich zur Bereinigung in teams.html.
    const realPlayerNameSet = new Set(PLAYER_RATES.map(p => mfhfbNormalizeName(p.name)));
    Object.entries(manualStats).forEach(([mKey, m]) => {
      const hasProduction = PROD_CATS.some(c => m[c] !== undefined && m[c] !== 0);
      if (!hasProduction) return;
      if (realPlayerNameSet.has(mKey)) return; // echte Saisondaten haben Vorrang
      // Einträge ohne Team (z.B. aus rookie-projections.js vorbefüllte
      // Spekulations-Prospects ohne realen Rosterplatz, wie "Drake Mitchell")
      // NICHT ins Draft Board -- dort sollen nur Spieler auftauchen, die auch
      // auf teams.html unter einem echten Team stehen. Wer wirklich gedraftet
      // werden könnte, dem trägst du auf teams.html ein Team ein, dann taucht
      // er automatisch wieder auf.
      if (!m.team || !m.team.trim()) return;
      if (!mfhfbIsOnCurrentRoster(m.name, m.team)) return;
      const min = m.min || 0;
      // Sicherheitsnetz: negative Counting-Stats können nie korrekt sein, egal
      // woher der manuelle Eintrag kommt (Rookie-Vorbelegung oder von Hand).
      // rookie-projections.js selbst ist seit dem PTS-Spalten-Fix (v2) sauber,
      // das hier bleibt trotzdem als generelle Absicherung für die Zukunft.
      const clamp0 = v => Math.max(0, v || 0);
      const s = {
        min, pts: clamp0(m.pts), reb: clamp0(m.reb), ast: clamp0(m.ast),
        stl: clamp0(m.stl), blk: clamp0(m.blk), fg3m: clamp0(m.fg3m), tov: clamp0(m.tov),
        fgpct: m.fgpct || 0, ftpct: m.ftpct || 0,
      };
      // keine Attempt-Daten für manuelle Einträge -> Minuten als Gewichtungs-Proxy
      // Keine echten Attempt-Daten für manuelle Einträge -- 1:1 Minuten als
      // Proxy war zu grob (unterstellt einen Freiwurf/Feldwurf JEDE Minute,
      // sprengt bei hoher Quote den Z-Score massiv, siehe Kingston-Flemings-
      // Fall: FT%-catZ von +10,75 durch diesen Bug). Realistischere Liga-
      // Schnittwerte: ~0,35 FGA/Min, ~0,12 FTA/Min (grobe NBA-Durchschnitte).
      s.fga = min * 0.35; s.fgm = s.fga * s.fgpct/100;
      s.fta = min * 0.12; s.ftm = s.fta * s.ftpct/100;
      rows.push({ rk: rows.length+1, n: m.name, team: m.team || '-', pos: m.pos || '-', s, manual:true,
                  durability: 0.85, durabilityKnown:false });
    });

    // Population für Z-Score-Mittelwert/Streuung (identisch zur Projections-Seite)
    let pool = rows;
    if (poolSize === '200' || poolSize === '400') {
      const n = poolSize === '200' ? 200 : 400;
      pool = [...rows].sort((a,b) => b.s.pts - a.s.pts).slice(0, n);
    }

    // FG%/FT%: NICHT die rohe Quote z-scoren -- ein Spieler mit 1/1 (100%)
    // sähe sonst identisch aus wie einer mit 9/10 (90%) auf echtem Volumen,
    // verzerrt Ranking/Score massiv nach oben für Kleinst-Stichproben. Statt-
    // dessen der tatsächliche IMPACT auf die Team-Quote: (eigene Quote minus
    // Liga-Schnitt) mal eigene Versuche -- exakt wie Team-FG%/FT% selbst schon
    // über Makes/Attempts aggregiert wird (siehe teamTotals()), nicht über den
    // Durchschnitt der Einzelquoten. Liga-Schnitt kommt aus derselben Pool-
    // Population wie Mittelwert/Streuung, für Konsistenz.
    const poolFga = pool.reduce((a,r)=>a+r.s.fga,0), poolFgm = pool.reduce((a,r)=>a+r.s.fgm,0);
    const poolFta = pool.reduce((a,r)=>a+r.s.fta,0), poolFtm = pool.reduce((a,r)=>a+r.s.ftm,0);
    const leagueFgPct = poolFga > 0 ? poolFgm / poolFga : 0;
    const leagueFtPct = poolFta > 0 ? poolFtm / poolFta : 0;
    rows.forEach(r => {
      r._fgImpact = (r.s.fgpct/100 - leagueFgPct) * r.s.fga;
      r._ftImpact = (r.s.ftpct/100 - leagueFtPct) * r.s.fta;
    });

    const stats = {};
    Z_CATS.forEach(cat => {
      let vals;
      if (cat === 'fgpct') vals = pool.map(r => r._fgImpact);
      else if (cat === 'ftpct') vals = pool.map(r => r._ftImpact);
      else vals = pool.map(r => r.s[cat]);
      const m = vals.reduce((a,b)=>a+b,0)/vals.length;
      const variance = vals.reduce((a,b)=>a+(b-m)*(b-m),0)/vals.length;
      stats[cat] = { mean: m, sd: Math.sqrt(variance) || 1 };
    });

    rows.forEach(row => {
      row.catZ = {};
      let z = 0;
      Z_CATS.forEach(cat => {
        let basis;
        if (cat === 'fgpct') basis = row._fgImpact;
        else if (cat === 'ftpct') basis = row._ftImpact;
        else basis = row.s[cat];
        let catZ = (basis - stats[cat].mean) / stats[cat].sd;
        if (cat === 'tov') catZ = -catZ;
        row.catZ[cat] = catZ;
        z += catZ * catWeights[cat];
      });
      row.z = z;
      row.posList = (row.pos || '-').split('/');

      // Z-Floor: Z-Score ohne die schlechteste Kategorie des Spielers
      // (Kategorie mit dem niedrigsten gewichteten Beitrag) — zeigt den Boden.
      const contribs = Z_CATS.map(cat => ({ cat, val: row.catZ[cat] * catWeights[cat] }));
      const worstCat = contribs.reduce((a,b) => a.val < b.val ? a : b);
      row.zFloor = z - worstCat.val;
      row.worstCat = worstCat.cat;

      // Z-Depth: Z-Score ohne die beste Kategorie — entlarvt One-Cat-Wonders.
      const bestCat = contribs.reduce((a,b) => a.val > b.val ? a : b);
      row.zDepth = z - bestCat.val;
      row.bestCat = bestCat.cat;

      // ADP aus zwei unabhängigen Quellen (adp-data.js, via
      // scripts/build-adp-data.py generiert):
      //  - row.adp  = eigener ADP aus deinen erfassten Fantrax Draft Results
      //  - row.fadp = Fantrax' eigener aktueller ADP-Snapshot
      // Jeweils null, wenn für den Spieler keine Daten aus der Quelle vorliegen.
      const normRowName = mfhfbNormalizeName(row.n);
      const adpEntry = (typeof ADP_DATA !== 'undefined') ? (ADP_DATA[normRowName] || ADP_DATA[mfhfbResolveAliasReverse(normRowName)]) : undefined;
      row.adp = (adpEntry && adpEntry.ownAdp !== null && adpEntry.ownAdp !== undefined) ? adpEntry.ownAdp : null;
      row.adpCount = adpEntry ? adpEntry.ownCount : 0;
      row.adpMin = (adpEntry && adpEntry.ownMin !== null && adpEntry.ownMin !== undefined) ? adpEntry.ownMin : null;
      row.adpMax = (adpEntry && adpEntry.ownMax !== null && adpEntry.ownMax !== undefined) ? adpEntry.ownMax : null;
      row.fadp = (adpEntry && adpEntry.fantraxAdp !== null && adpEntry.fantraxAdp !== undefined) ? adpEntry.fantraxAdp : null;
      row._adpRef = row.fadp || row.adp || null;
      // Volle Draft-Range (alle einzelnen Picks über deine erfassten Ligen,
      // aus data/draft-results/ via scripts/build-adp-data.py) -- fürs
      // Klick-Popover, das "alte Excel Draft Range"-Feature.
      row.ownPicks = (adpEntry && adpEntry.ownPicks) ? adpEntry.ownPicks : [];
    });

    // Punkte-Liga-Score (für Format 'points'): einfache Summe Stat x Punktwert.
    const pw = loadPointsWeights();
    rows.forEach(row => {
      row.ptsScore = (row.s.pts||0)*pw.pts + (row.s.reb||0)*pw.reb + (row.s.ast||0)*pw.ast +
        (row.s.stl||0)*pw.stl + (row.s.blk||0)*pw.blk + (row.s.fg3m||0)*pw.fg3m + (row.s.tov||0)*pw.tov;
    });

    rows.sort((a,b) => b.z - a.z);
    rows.forEach((r,i) => {
      r.rk = i+1;
      // ADP-Value = ADP-Rang minus unser Z-Rang: positiv = unterbewertet (Wert),
      // negativ = überbewertet (Reach). Braucht den finalen Z-Rang, daher erst hier.
      r.adpVal = r._adpRef ? Math.round(r._adpRef - r.rk) : null;
    });
    return rows;
  }

  // Kategorie-Seltenheit LIVE aus dem aktuell noch verfügbaren Pool
  // berechnet (nicht mehr einmalig vor dem Draft) -- wenn im Draft-Room
  // gerade reihenweise z.B. Shotblocker weggehen, wird BLK während des
  // Drafts spürbar seltener, das soll sich auch in den Empfehlungen
  // niederschlagen. Gedämpft (Wurzel) + gedeckelt (±25%), damit ein
  // Ein-Kategorie-Ausreißer nicht den Gesamtwert eines Spielers dominiert
  // (das war der Bug vom 22.07.2026 mit Kadary Richmond/Tre Scott).
  function computeCatScarcity(availablePlayers){
    const pool = availablePlayers.slice(0, TEAMS * SLOTS_PER_TEAM);
    if(pool.length < 20) return CAT_SCARCITY; // zu wenig übrig für ein stabiles Signal -- letzten Stand behalten
    const raw = {};
    Z_CATS.forEach(cat => {
      if(cat === 'tov'){ raw[cat] = 1; return; }
      const posShare = pool.filter(r => r.catZ[cat] > 0).length / pool.length;
      raw[cat] = 1 / Math.max(0.05, posShare);
    });
    const mean = Object.values(raw).reduce((a,b)=>a+b,0) / Object.values(raw).length;
    const out = {};
    Z_CATS.forEach(cat => {
      const norm = Math.sqrt(raw[cat] / mean);
      out[cat] = Math.max(0.8, Math.min(1.25, norm));
    });
    return out;
  }

  let CAT_SCARCITY = {};
  let PLAYERS = buildPlayers();
  const byRk = {};
  function reindex(){ Object.keys(byRk).forEach(k=>delete byRk[k]); PLAYERS.forEach(p=>byRk[p.rk]=p); }
  reindex();

  // normalisierter Name -> rk, fürs Zuordnen von Fantrax-Spielernamen
  // (siehe assets/fantrax-live.js) zu unseren lokalen Player-Rows.
  let nameToRk = {};
  function reindexNames(){
    nameToRk = {};
    PLAYERS.forEach(p => { nameToRk[mfhfbNormalizeName(p.n)] = p.rk; });
  }
  reindexNames();

  // ---------------- draft state ----------------
  let state = {
    picks: [],
    myTeam: 1,
    punt: [],
    format: '9cat_roto',
    sortKey: 'z',
    sortDir: 'desc',
    search: '',
    posFilter: null,
    hideDrafted: false,
    // Barttorvik-artiger Stat-Filter: bis zu 3 Bedingungen, UND-verknüpft.
    // Jede: {cat: 'fgpct', op: '>', val: 50}. cat aus STAT_FILTER_CATS.
    statFilters: [null, null, null],
  };

  function loadState(){
    try{
      const raw = localStorage.getItem(MFHFB_DRAFT_KEY);
      if(raw){ state = Object.assign(state, JSON.parse(raw)); }
    }catch(e){}
    // Suchtext, Stat-Filter und Positions-Filter bewusst NICHT übers Laden
    // hinweg mitnehmen -- die wurden zwar mitgespeichert, aber das Such-
    // feld/Filter-Panel wird beim Laden nie visuell synchronisiert, weil
    // beides standardmäßig leer/eingeklappt aussieht. Ergebnis: die Spieler-
    // liste war unsichtbar nach einem Suchbegriff gefiltert (z.B. "Zubac"),
    // ohne dass irgendwo sichtbar war, warum. Picks/Punt/Sortierung bleiben
    // dagegen bewusst erhalten -- das ist echter Draft-Fortschritt.
    state.search = '';
    state.posFilter = null;
    state.statFilters = [null, null, null];
  }
  let saveTimeout = null;
  function scheduleSave(){
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      try{
        localStorage.setItem(MFHFB_DRAFT_KEY, JSON.stringify(state));
        const ind = document.getElementById('saveIndicator');
        ind.textContent = 'gespeichert';
        setTimeout(()=>{ ind.textContent=''; }, 1000);
      }catch(e){}
    }, 250);
  }

  function draftedMap(){
    const m = {};
    state.picks.forEach(pk => m[pk.rk] = pk.team);
    return m;
  }
  function pickTeamForNumber(pickNo){
    const round = Math.ceil(pickNo/TEAMS);
    const idx = pickNo - (round-1)*TEAMS;
    return (round % 2 === 1) ? idx : (TEAMS + 1 - idx);
  }
  function nextPickForTeam(fromPickNo, team){
    for(let n=fromPickNo; n<=TOTAL_PICKS; n++){ if(pickTeamForNumber(n) === team) return n; }
    return null;
  }

  // ---------------- roster slot assignment (Kuhn's matching) ----------------
  function assignSlots(playerRks){
    const slotInstances = [];
    SLOT_DEFS.forEach(([name,count]) => { for(let i=0;i<count;i++) slotInstances.push(name); });
    const players = playerRks.map(rk => byRk[rk]).filter(Boolean);

    const adj = players.map(p => {
      const elig = [];
      slotInstances.forEach((slotName, i) => {
        if(slotName === 'UTIL' || p.posList.includes(slotName)) elig.push(i);
      });
      return elig;
    });

    const matchSlot = new Array(slotInstances.length).fill(-1);
    function tryKuhn(u, visited){
      for(const v of adj[u]){
        if(visited[v]) continue;
        visited[v] = true;
        if(matchSlot[v] === -1 || tryKuhn(matchSlot[v], visited)){ matchSlot[v] = u; return true; }
      }
      return false;
    }
    const matched = new Array(players.length).fill(false);
    for(let u=0; u<players.length; u++){
      const visited = new Array(slotInstances.length).fill(false);
      if(tryKuhn(u, visited)) matched[u] = true;
    }
    const slotAssignment = slotInstances.map((name,i) => ({ slot:name, player: matchSlot[i]!==-1 ? players[matchSlot[i]] : null }));
    const unassigned = players.filter((p,i) => !matched[i]);
    return { slotAssignment, unassigned, startingPlayers: players.filter((p,i)=>matched[i]) };
  }
  function teamRoster(teamIdx){
    const dm = draftedMap();
    const rks = Object.keys(dm).filter(rk => dm[rk] === teamIdx).map(Number);
    return assignSlots(rks);
  }
  function teamTotals(teamIdx){
    const {startingPlayers} = teamRoster(teamIdx);
    const totals = {};
    CATS.forEach(c => totals[c.key] = 0);
    let fgmSum=0, fgaSum=0, ftmSum=0, ftaSum=0, zSum=0;
    startingPlayers.forEach(p => {
      CATS.forEach(c => {
        if(c.key === 'fgpct' || c.key === 'ftpct') return;
        totals[c.key] += p.s[c.key];
      });
      fgmSum += p.s.fgm; fgaSum += p.s.fga;
      ftmSum += p.s.ftm; ftaSum += p.s.fta;
      zSum += p.z;
    });
    totals.fgpct = fgaSum > 0 ? (fgmSum/fgaSum)*100 : 0;
    totals.ftpct = ftaSum > 0 ? (ftmSum/ftaSum)*100 : 0;
    return { totals, zSum, count: startingPlayers.length };
  }
  function allTeamTotals(){
    const arr = [];
    for(let t=1;t<=TEAMS;t++) arr.push({team:t, ...teamTotals(t)});
    return arr;
  }
  function categoryRanks(){
    const all = allTeamTotals();
    const ranks = {};
    CATS.forEach(c => {
      const sorted = all.slice().sort((a,b) => {
        const av=a.totals[c.key], bv=b.totals[c.key];
        return c.invert ? (av-bv) : (bv-av);
      });
      ranks[c.key] = {};
      sorted.forEach((row,i) => { ranks[c.key][row.team] = i+1; });
    });
    return ranks;
  }

  // ---------------- Mathe-Hilfsfunktionen (H-Score) ----------------
  // Abramowitz-Stegun-Approximation der Fehlerfunktion (~1.5e-7 Genauigkeit),
  // JS hat keine eingebaute erf(). Für die Normalverteilungs-CDF gebraucht,
  // die H0 (Rosenof 2024) für Kategorie-Gewinnwahrscheinlichkeiten nutzt.
  function erf(x){
    const sign = x < 0 ? -1 : 1; x = Math.abs(x);
    const a1=0.254829592, a2=-0.284496736, a3=1.421413741, a4=-1.453152027, a5=1.061405429, p=0.3275911;
    const t = 1/(1+p*x);
    const y = 1 - (((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);
    return sign*y;
  }
  // P(meine Kategorie-Differenz > 0), modelliert als Normalverteilung mit
  // Mittelwert `diff` und Streuung `sigma` -- Sigma kommt aus der Liga-weiten
  // Team-Streuung (computeTeamCatStats), dieselbe Quelle wie im Punt-Planer.
  function normalCDF(diff, sigma){
    if(sigma <= 0) return diff > 0 ? 1 : (diff < 0 ? 0 : 0.5);
    return 0.5 * (1 + erf(diff / (Math.SQRT2 * sigma)));
  }

  // Rohe, summierbare Größen -- bewusst GETRENNT von CATS/Z_CATS, weil FG%/FT%
  // NICHT direkt summiert werden dürfen (sonst falsches Ergebnis). Makes/
  // Attempts werden aufsummiert, die Quote erst am Schluss daraus berechnet
  // (exakt wie in teamTotals() weiter oben).
  const RAW_SUM_KEYS = ['pts','reb','ast','stl','blk','fg3m','tov','fgm','fga','ftm','fta'];
  function finalizeCatTotals(raw){
    const out = {};
    RAW_SUM_KEYS.forEach(k => { if(k!=='fgm'&&k!=='fga'&&k!=='ftm'&&k!=='fta') out[k] = raw[k]; });
    out.fgpct = raw.fga > 0 ? (raw.fgm/raw.fga)*100 : 0;
    out.ftpct = raw.fta > 0 ? (raw.ftm/raw.fta)*100 : 0;
    return out;
  }
  function emptyRawSums(){ const o={}; RAW_SUM_KEYS.forEach(k=>o[k]=0); return o; }
  function addRawSums(a, b){ const o={}; RAW_SUM_KEYS.forEach(k=>o[k]=a[k]+b[k]); return o; }
  // Mirror von teamTotals(), aber gibt die ROHEN Summen zurück statt der
  // fertigen Kategorie-Totals -- wird für die H-Score-Simulation gebraucht,
  // wo bekannte + simulierte zukünftige Picks VOR der %-Berechnung addiert
  // werden müssen.
  function rawTeamSums(teamIdx){
    const {startingPlayers} = teamRoster(teamIdx);
    let sums = emptyRawSums();
    startingPlayers.forEach(p => { sums = addRawSums(sums, p.s); });
    return sums;
  }

  // ---------------- H-Score (Beta) ----------------
  // Vereinfachte, datengetriebene Umsetzung von Rosenof (2024) "Dynamic
  // quantification of player value for fantasy basketball" (H-scoring,
  // https://arxiv.org/abs/2409.09884). Kernidee dort: Statt einer statischen
  // Rangliste wird für jeden Kandidaten simuliert, wie das Restteam aussehen
  // wird, und daraus eine Kategorie-Gewinnwahrscheinlichkeit gegen die Liga
  // berechnet -- Punten entsteht dabei IMPLIZIT, ohne dass man es vorgibt.
  //
  // Das Original nutzt Gradient Descent über eine Kovarianzmatrix + eine
  // geschlossene Normalverteilungs-Näherung, weil die Autoren keine echten
  // Spielerdaten zur Simulation hatten. Wir haben aber echte Projektionen für
  // den kompletten Pool -- deshalb simulieren wir den kompletten Rest-Draft
  // direkt mit den tatsächlich verfügbaren Spielern statt mit einer
  // Verteilungs-Annahme (echte Snake-Reihenfolge, EIN gemeinsam schrumpfender
  // Pool -- kein Overlap zwischen simulierten Kadern). Bewusste
  // Vereinfachungen ggü. dem Paper:
  //  - Diskrete Suche über bis zu 2 gleichzeitig gepuntete Kategorien (46
  //    Kombinationen) statt kontinuierlichem Gradient Descent über 9 Gewichte
  //  - Keine Positions-/Slot-Modellierung für zukünftige Picks (nur Kategorien)
  //  - Alle Gegner draften "generisch" (Standard-Gewichtung) -- ihre eigenen
  //    Punt-Strategien werden nicht modelliert
  //  - Aus Performancegründen nur für die Top-Kandidaten (MFHFB_HSCORE_SHORTLIST)
  //    berechnet, nicht für den kompletten Pool -- Tiefenkader-/Free-Agent-
  //    Spieler zeigen bewusst keinen H-Score ("—") statt eines irreführenden Werts.
  //  - Simulations-Horizont auf MFHFB_HSCORE_HORIZON Picks begrenzt (nicht bis
  //    zum Draft-Ende) -- das Signal "wer wird mir zwischen jetzt und meinem
  //    nächsten Picks weggeschnappt" kommt ohnehin fast komplett aus den
  //    nächsten paar Runden, Pick 150 beeinflusst die Entscheidung JETZT kaum
  //    noch, kostet aber genauso viel Rechenzeit wie Pick 20.
  const MFHFB_HSCORE_MAX_PUNT = 1;
  const MFHFB_HSCORE_SHORTLIST = 50;
  const MFHFB_HSCORE_HORIZON = 48; // ~4 Runden voraus bei 12 Teams

  function generatePuntMasks(){
    const masks = [new Set()]; // leere Maske = Standard-Gewichtung, kein Punt
    Z_CATS.forEach(c => masks.push(new Set([c])));
    if(MFHFB_HSCORE_MAX_PUNT >= 2){
      for(let i=0;i<Z_CATS.length;i++){
        for(let j=i+1;j<Z_CATS.length;j++){
          masks.push(new Set([Z_CATS[i], Z_CATS[j]]));
        }
      }
    }
    return masks; // MAX_PUNT=1 -> 1+9=10 Masken, MAX_PUNT=2 -> 1+9+36=46
  }
  const MFHFB_PUNT_MASKS = generatePuntMasks();

  // Für JEDE der 46 Masken: verfügbare Spieler nach maskiertem Z sortiert.
  // Wird für die Fortsetzungs-Simulation als Ziehungsreihenfolge benutzt
  // (Zeiger läuft nur vorwärts, s.u.).
  function buildMaskIndex(availableRows, catWeights){
    return MFHFB_PUNT_MASKS.map(mask => {
      const sorted = [...availableRows].sort((a,b) => {
        let za=0, zb=0;
        Z_CATS.forEach(c => { if(!mask.has(c)){ za += a.catZ[c]*catWeights[c]; zb += b.catZ[c]*catWeights[c]; } });
        return zb - za;
      });
      return { mask, sorted };
    });
  }

  // Einmal pro renderPool()-Aufruf: teurer Teil (Masken-Index, Gegner-Basis,
  // aktuelle Pick-Nummer) gebündelt.
  function computeHScoreContext(){
    const dm = draftedMap();
    const availableRows = PLAYERS.filter(p => !dm[p.rk]);
    if(availableRows.length === 0) return null;
    const catWeights = mfhfbGetCategoryWeights();
    const maskIndex = buildMaskIndex(availableRows, catWeights);
    const defaultMaskEntry = maskIndex[0]; // Standard-Gewichtung, fürs Gegner-Modell

    const myRaw = rawTeamSums(state.myTeam);
    const teamCatStats = computeTeamCatStats(allTeamTotals()); // schon vorhanden (Punt-Planer)

    const opponents = [];
    for(let t=1; t<=TEAMS; t++){
      if(t === state.myTeam) continue;
      opponents.push({ team: t, raw: rawTeamSums(t) });
    }

    // Pick-Nummer DIREKT NACH dem aktuellen Pick (der Kandidat selbst gilt als
    // der aktuelle Pick) -- ab hier wird die Fortsetzung simuliert.
    const nextPickNo = state.picks.length + 2;

    return { maskIndex, defaultMaskEntry, myRaw, opponents, teamCatStats, nextPickNo, dm };
  }

  // H-Score eines Kandidaten: bester über alle 46 Masken erreichbare V(j).
  //
  // Anders als eine simple "nimm die besten K verbleibenden Spieler"-Näherung
  // wird hier der ECHTE Rest-Draft in Snake-Reihenfolge simuliert: für jeden
  // kommenden Pick schaut die Simulation, wem er gehört (pickTeamForNumber),
  // und zieht für MICH den besten verbleibenden Spieler laut Maske, für JEDEN
  // Gegner den besten laut Standard-Gewichtung -- aus EINEM gemeinsam
  // schrumpfenden Pool, nicht aus 12 unabhängigen Kopien. Das behebt einen
  // echten Bug der Vorversion: dort wurde für "meine Restauffüllung" immer
  // die objektiv beste verfügbare Auswahl angenommen, UNABHÄNGIG vom
  // aktuellen Kandidaten -- bei vielen offenen Slots hat das den Effekt
  // eines einzelnen (guten oder schlechten) Picks fast weggemittelt, wodurch
  // z.B. Tiefenkader-/Free-Agent-Spieler fast gleichauf mit Stars landeten.
  // Jetzt nehmen Gegner echten Spielern zwischen meinen Picks weg, wodurch
  // ein starker JETZT-Pick spürbar mehr wert ist als ein schwacher.
  function computeHScore(row, ctx){
    if(!ctx) return null;
    let best = -Infinity;
    ctx.maskIndex.forEach(maskEntry => {
      const removed = new Set(row.rk === undefined ? [] : [row.rk]);
      Object.keys(ctx.dm).forEach(rk => removed.add(Number(rk)));

      const mySorted = maskEntry.sorted, defSorted = ctx.defaultMaskEntry.sorted;
      let myPtr = 0, defPtr = 0;
      function drawNext(sortedArr, ptr){
        while(ptr.i < sortedArr.length && removed.has(sortedArr[ptr.i].rk)) ptr.i++;
        if(ptr.i >= sortedArr.length) return null;
        const p = sortedArr[ptr.i]; ptr.i++;
        removed.add(p.rk);
        return p;
      }
      const myPtrObj = {i:0}, defPtrObj = {i:0};

      let myRaw = addRawSums(ctx.myRaw, row.s);
      const oppRaw = {};
      ctx.opponents.forEach(o => { oppRaw[o.team] = {...o.raw}; });

      for(let pickNo = ctx.nextPickNo; pickNo <= Math.min(TOTAL_PICKS, ctx.nextPickNo + MFHFB_HSCORE_HORIZON - 1); pickNo++){
        const owner = pickTeamForNumber(pickNo);
        if(owner === state.myTeam){
          const p = drawNext(mySorted, myPtrObj);
          if(p) myRaw = addRawSums(myRaw, p.s);
        } else {
          const p = drawNext(defSorted, defPtrObj);
          if(p) oppRaw[owner] = addRawSums(oppRaw[owner], p.s);
        }
      }

      const myTotal = finalizeCatTotals(myRaw);
      let vSum = 0;
      ctx.opponents.forEach(opp => {
        const oppTotal = finalizeCatTotals(oppRaw[opp.team]);
        let v = 0;
        CATS.forEach(c => {
          const mv = myTotal[c.key], ov = oppTotal[c.key];
          const diff = c.invert ? (ov - mv) : (mv - ov);
          const sigma = (ctx.teamCatStats[c.key] && ctx.teamCatStats[c.key].sd) || 1;
          v += normalCDF(diff, sigma);
        });
        vSum += v;
      });
      const vAvg = ctx.opponents.length ? vSum / ctx.opponents.length : 0;
      if(vAvg > best) best = vAvg;
    });
    return best;
  }

  // ---------------- Kategorie-Scarcity-Kurve (Runden-Cliff) ----------------
  // Bündelt den noch verfügbaren Pool pro Kategorie in Runden-Buckets (12 Picks
  // = 1 Runde) und zeigt den Ø catZ je Bucket + den stärksten verbleibenden
  // Namen. Beantwortet "welche Kat. ist ab wann noch realistisch zu holen"
  // (z.B. AST/PTS konzentrieren sich früh in den Top-Runden und fallen danach
  // steiler ab als STL/BLK, siehe Josh-Lloyd-Category-Correlation-Recherche).
  // Getrennt von computeCatScarcity() oben, die einen einzelnen Live-Multiplikator
  // für die Empfehlungs-Engine liefert -- hier geht's um die Round-by-Round-Ansicht.
  function computeScarcityCurve(availablePlayers, roundsAhead){
    const sorted = {};
    Z_CATS.forEach(cat => {
      sorted[cat] = [...availablePlayers].sort((a,b) => b.catZ[cat] - a.catZ[cat]);
    });
    const buckets = [];
    for(let r = 0; r < roundsAhead; r++){
      const start = r * TEAMS, end = start + TEAMS;
      const row = { round: r, cats: {} };
      Z_CATS.forEach(cat => {
        const slice = sorted[cat].slice(start, end);
        if(!slice.length){ row.cats[cat] = null; return; }
        const avgZ = slice.reduce((a,p) => a + p.catZ[cat], 0) / slice.length;
        const top = slice[0];
        row.cats[cat] = { avgZ, topName: top.n, topZ: top.catZ[cat] };
      });
      buckets.push(row);
    }
    return buckets;
  }

  // Größter Ein-Runden-Einbruch je Kategorie über die Buckets -- "wo reißt
  // die Versorgung am abruptesten ab", nicht nur "wo ist der Wert insgesamt
  // niedrig" (das kann auch einfach eine grundsätzlich flache Kategorie sein).
  function steepestCliff(buckets){
    let worst = null;
    Z_CATS.forEach(cat => {
      for(let i=1; i<buckets.length; i++){
        const prev = buckets[i-1].cats[cat], cur = buckets[i].cats[cat];
        if(!prev || !cur) continue;
        const drop = prev.avgZ - cur.avgZ;
        if(!worst || drop > worst.drop) worst = { cat, drop, atRound: i };
      }
    });
    return worst;
  }

  // ---------------- Punt-Planer: H2H-Matchup-Simulation ----------------
  // Vergleicht zwei Team-Totals (aus teamTotals()) kategorienweise. Gepuntete
  // Kategorien zählen als bewusst abgegeben (weder Sieg noch Niederlage in der
  // "Bilanz"), nicht als automatischer Verlust -- entspricht der Denkweise
  // "ich gebe FT% komplett auf, um in den restlichen 8 möglichst oft 6-3/5-4
  // zu gewinnen", nicht "ich spiele 9 Kategorien und verliere eine sicher".
  // Mittelwert + Streuung je Kategorie ÜBER ALLE 12 TEAM-TOTALS (nicht über
  // einzelne Spieler wie die Pool-Z-Scores) -- macht Margen zwischen Teams
  // über Kategorien mit völlig unterschiedlichen Einheiten vergleichbar
  // (z.B. "5 Punkte Vorsprung" vs. "1,5 Prozentpunkte FG%-Vorsprung").
  function computeTeamCatStats(allTotals){
    const stats = {};
    CATS.forEach(c => {
      const vals = allTotals.map(t => t.totals[c.key]);
      const m = vals.reduce((a,b)=>a+b,0)/vals.length;
      const variance = vals.reduce((a,b)=>a+(b-m)*(b-m),0)/vals.length;
      stats[c.key] = { mean: m, sd: Math.sqrt(variance) || 1 };
    });
    return stats;
  }

  function computeMatchupRecord(myTotals, oppTotals, puntSet, teamCatStats){
    let wins = 0, losses = 0, ties = 0;
    const catResults = {};
    CATS.forEach(c => {
      if(puntSet.has(c.key)){ catResults[c.key] = 'punt'; return; }
      const mv = myTotals[c.key], ov = oppTotals[c.key];
      const diff = c.invert ? (ov - mv) : (mv - ov); // positiv = ich gewinne, rohe Einheit
      if(Math.abs(diff) < 1e-9){ ties++; catResults[c.key] = 'tie'; }
      else if(diff > 0){ wins++; catResults[c.key] = 'win'; }
      else { losses++; catResults[c.key] = 'loss'; }
      catResults[c.key+'_diff'] = diff;
      // Auf Liga-Streuung normiert -- macht Margen über Kategorien hinweg
      // vergleichbar (für closestMargin()), rohe diff bleibt fürs Anzeigen.
      const sd = teamCatStats ? teamCatStats[c.key].sd : 1;
      catResults[c.key+'_diffZ'] = diff / sd;
    });
    return { wins, losses, ties, punted: puntSet.size, catResults };
  }

  // Erkennt für ein Gegner-Team, ob es in einer MEINER Punt-Kategorien selbst
  // zu den schwächsten der Liga gehört (untere 3 von 12 Teams im Kategorie-
  // Rang) -- ein starkes Indiz für "die punten das vermutlich auch", wodurch
  // die Kategorie im direkten Duell faktisch neutralisiert ist (beide schwach,
  // niemand nutzt sie aktiv als Waffe).
  function detectMirrorPunts(oppTeamIdx, puntSet, ranks){
    const flagged = [];
    puntSet.forEach(catKey => {
      const rank = ranks[catKey][oppTeamIdx];
      if(rank >= TEAMS - 2) flagged.push(catKey); // Rang 10-12 von 12
    });
    return flagged;
  }

  // Für ein Gegner-Team: unter den NICHT gepunteten Kategorien diejenige mit
  // der knappsten (kleinsten positiven ODER negativen) Marge -- dort lohnt
  // sich zusätzliche Stärke gegen genau dieses Team am meisten, besonders
  // wichtig bei Mirror-Punt-Gegnern, wo eine Kategorie schon wegfällt und man
  // sich in den verbleibenden keinen zweiten Ausfall mehr leisten kann.
  function closestMargin(catResults, puntSet){
    let closest = null;
    CATS.forEach(c => {
      if(puntSet.has(c.key)) return;
      const diffZ = catResults[c.key+'_diffZ'];
      const diff = catResults[c.key+'_diff'];
      if(diffZ === undefined) return;
      if(!closest || Math.abs(diffZ) < Math.abs(closest.diffZ)) closest = { cat: c, diff, diffZ };
    });
    return closest;
  }

  // ---------------- rendering ----------------
  function fmtNum(v, digits=1){ return (Math.round(v*10**digits)/10**digits).toFixed(digits); }

  function renderTopbar(){
    const pickNo = state.picks.length + 1;
    const round = Math.ceil(pickNo/TEAMS);
    document.getElementById('pickNo').textContent = pickNo > TOTAL_PICKS ? '—' : pickNo;
    document.getElementById('roundNo').textContent = round > SLOTS_PER_TEAM ? SLOTS_PER_TEAM : round;
    const onClockTeam = pickNo <= TOTAL_PICKS ? pickTeamForNumber(pickNo) : null;
    const chip = document.getElementById('onClockChip');
    if(onClockTeam === null){ chip.textContent = 'Draft beendet'; chip.className = 'onclock other'; }
    else if(onClockTeam === state.myTeam){ chip.textContent = 'DU bist an der Reihe'; chip.className = 'onclock me'; }
    else { chip.textContent = `Team ${onClockTeam} an der Reihe`; chip.className = 'onclock other'; }
    document.getElementById('undoBtn').disabled = state.picks.length === 0;
  }

  // Barttorvik-artiger Stat-Filter: Kategorien + Operatoren, die zur Auswahl
  // stehen. 'z' verweist auf den gewichteten Gesamt-Score, alle anderen auf
  // den entsprechenden rohen Pro-Spiel-Wert (row.s[cat]).
  const STAT_FILTER_CATS = [
    {key:'pts', label:'PTS'}, {key:'reb', label:'REB'}, {key:'ast', label:'AST'},
    {key:'stl', label:'STL'}, {key:'blk', label:'BLK'}, {key:'fg3m', label:'3PM'},
    {key:'fgpct', label:'FG%'}, {key:'ftpct', label:'FT%'}, {key:'tov', label:'TOV'},
    {key:'z', label:'Z-Score'},
  ];
  const STAT_FILTER_OPS = ['>', '>=', '<', '<='];

  function statFilterValue(p, cat){
    return cat === 'z' ? p.z : p.s[cat];
  }
  function passesStatFilters(p){
    return state.statFilters.every(f => {
      if(!f || !f.cat || !f.op || f.val === null || f.val === undefined || f.val === '') return true;
      const v = statFilterValue(p, f.cat);
      const target = Number(f.val);
      if(Number.isNaN(target)) return true;
      switch(f.op){
        case '>': return v > target;
        case '>=': return v >= target;
        case '<': return v < target;
        case '<=': return v <= target;
        default: return true;
      }
    });
  }

  function renderStatFilterRows(){
    const container = document.getElementById('dStatFilterRows');
    container.innerHTML = state.statFilters.map((f, i) => `
      <div style="display:flex; gap:6px; align-items:center; margin-bottom:6px;">
        <select data-i="${i}" data-field="cat" style="padding:5px 8px; border-radius:6px; background:var(--surface2); border:1px solid var(--border); color:var(--text);">
          <option value="">–</option>
          ${STAT_FILTER_CATS.map(c => `<option value="${c.key}" ${f&&f.cat===c.key?'selected':''}>${c.label}</option>`).join('')}
        </select>
        <select data-i="${i}" data-field="op" style="padding:5px 8px; border-radius:6px; background:var(--surface2); border:1px solid var(--border); color:var(--text);">
          ${STAT_FILTER_OPS.map(o => `<option value="${o}" ${f&&f.op===o?'selected':''}>${o}</option>`).join('')}
        </select>
        <input data-i="${i}" data-field="val" type="number" step="0.1" placeholder="Wert" value="${f&&f.val!==undefined?f.val:''}"
          style="width:90px; padding:5px 8px; border-radius:6px; background:var(--surface2); border:1px solid var(--border); color:var(--text);">
      </div>
    `).join('');
    container.querySelectorAll('select,input').forEach(el => {
      el.addEventListener('change', () => {
        const i = Number(el.dataset.i), field = el.dataset.field;
        if(!state.statFilters[i]) state.statFilters[i] = {cat:'', op:'>', val:''};
        state.statFilters[i][field] = el.value;
        if(!state.statFilters[i].cat) state.statFilters[i] = null;
        renderPool(); scheduleSave();
      });
    });
  }

  function passesFilters(p, dm){
    if(state.hideDrafted && dm[p.rk]) return false;
    if(state.posFilter && !p.posList.includes(state.posFilter)) return false;
    if(!passesStatFilters(p)) return false;
    if(state.search){
      const s = state.search.toLowerCase();
      if(!p.n.toLowerCase().includes(s) && !p.team.toLowerCase().includes(s)) return false;
    }
    return true;
  }

  function renderPool(){
    closeAdpPopover();
    const dm = draftedMap();

    // Z-Punt (gepuntete Kategorien mit Gewicht 0) + H-Score (Beta) einmal pro
    // Render für alle Spieler berechnen -- MUSS vor dem Sort passieren, da
    // beide als Sortier-Spalten dienen. H-Score nur für noch verfügbare
    // Spieler (für gedraftete ist er bedeutungslos).
    //
    // Beides in try/catch: das ist neuer, komplexer Code (Simulation über
    // 168 Picks), der an einem Draft-Stand mit Kanten-Fällen (z.B. Picks, die
    // sich keinem Spieler zuordnen lassen) theoretisch crashen könnte. Ohne
    // dieses try/catch würde ein Fehler hier den KOMPLETTEN restlichen
    // renderPool()-Aufruf abbrechen -- der Punt-Chip würde sich zwar noch
    // umfärben (das passiert vorher), aber Tabelle/Sortierung/Empfehlungen
    // würden nicht mehr aktualisiert wirken. Bei einem Fehler bekommen
    // Z-Punt/H-Score einfach neutrale Werte statt die ganze Seite einzufrieren.
    try {
      const puntSet = new Set(state.punt);
      const catWeightsForPunt = mfhfbGetCategoryWeights();
      PLAYERS.forEach(p => {
        let zp = 0;
        Z_CATS.forEach(cat => { if(!puntSet.has(cat)) zp += p.catZ[cat] * catWeightsForPunt[cat]; });
        p.zPunt = zp;
      });
      const hscoreCtx = computeHScoreContext();
      if(hscoreCtx){
        const shortlist = PLAYERS.filter(p => !dm[p.rk]).sort((a,b) => b.z - a.z).slice(0, MFHFB_HSCORE_SHORTLIST);
        const shortlistSet = new Set(shortlist.map(p => p.rk));
        PLAYERS.forEach(p => { p.hscore = shortlistSet.has(p.rk) ? computeHScore(p, hscoreCtx) : null; });
      } else {
        PLAYERS.forEach(p => { p.hscore = null; });
      }
    } catch(err) {
      console.error('Z-Punt/H-Score-Berechnung fehlgeschlagen, Rest der Seite läuft trotzdem weiter:', err);
      PLAYERS.forEach(p => { if(p.zPunt === undefined) p.zPunt = p.z; if(p.hscore === undefined) p.hscore = null; });
    }

    let rows = PLAYERS.filter(p => passesFilters(p, dm));
    rows.sort((a,b) => {
      const dir = state.sortDir === 'asc' ? 1 : -1;
      let av, bv;
      if(state.sortKey === 'name'){ av=a.n; bv=b.n; }
      else if(state.sortKey === 'pos'){ av=a.pos; bv=b.pos; }
      else if(state.sortKey === 'adp'){
        // Spieler ohne ADP (noch nicht/nicht oft genug in den erfassten Draft
        // Results) landen immer ganz unten, unabhängig von der Sortierrichtung.
        // Untereinander vorerst Fallback auf Z-Score (später: Fantrax-ADP als
        // zweite Fallback-Stufe, sobald diese Datei importiert wird).
        const aNull = a.adp === null, bNull = b.adp === null;
        if(aNull && bNull) return b.z - a.z;
        if(aNull) return 1;
        if(bNull) return -1;
        av = a.adp; bv = b.adp;
      }
      else if(state.sortKey === 'fadp'){
        // Gleiches Null-Handling wie bei 'adp', aber für die unabhängige
        // Fantrax-ADP-Spalte.
        const aNull = a.fadp === null, bNull = b.fadp === null;
        if(aNull && bNull) return b.z - a.z;
        if(aNull) return 1;
        if(bNull) return -1;
        av = a.fadp; bv = b.fadp;
      }
      else if(state.sortKey === 'rk' || state.sortKey === 'z'){ av=a[state.sortKey]; bv=b[state.sortKey]; }
      else if(state.sortKey === 'zFloor'){ av=a.zFloor; bv=b.zFloor; }
      else if(state.sortKey === 'zDepth'){ av=a.zDepth; bv=b.zDepth; }
      else if(state.sortKey === 'zPunt'){ av=a.zPunt; bv=b.zPunt; }
      else if(state.sortKey === 'hscore'){ av=a.hscore??-999; bv=b.hscore??-999; }
      else if(state.sortKey === 'adpVal'){ av=a.adpVal??-999; bv=b.adpVal??-999; }
      else { av=a.s[state.sortKey]; bv=b.s[state.sortKey]; }
      if(typeof av === 'string') return dir*av.localeCompare(bv);
      return dir*(av-bv);
    });
    rows = rows.slice(0, 300);

    const tbody = document.getElementById('poolBody');
    const pickNo = state.picks.length + 1;
    const onClockTeam = pickNo <= TOTAL_PICKS ? pickTeamForNumber(pickNo) : null;

    // Heatmap-Range für Z-Spalten (über die aktuell sichtbaren/gefilterten Zeilen)
    const zVals = rows.map(r => r.z), zfVals = rows.map(r => r.zFloor), zdVals = rows.map(r => r.zDepth);
    const zpVals = rows.map(r => r.zPunt);
    const hsVals = rows.map(r => r.hscore).filter(v => v !== null && v !== undefined);
    const zMin = Math.min(...zVals), zMax = Math.max(...zVals);
    const zfMin = Math.min(...zfVals), zfMax = Math.max(...zfVals);
    const zdMin = Math.min(...zdVals), zdMax = Math.max(...zdVals);
    const zpMin = Math.min(...zpVals), zpMax = Math.max(...zpVals);
    const hsMin = hsVals.length ? Math.min(...hsVals) : 0, hsMax = hsVals.length ? Math.max(...hsVals) : 9;
    const hz  = v => mfhfbHeatStyle(v, zMin, zMax, false);
    const hzf = v => mfhfbHeatStyle(v, zfMin, zfMax, false);
    const hzd = v => mfhfbHeatStyle(v, zdMin, zdMax, false);
    const hzp = v => mfhfbHeatStyle(v, zpMin, zpMax, false);
    const hhs = v => mfhfbHeatStyle(v, hsMin, hsMax, false);

    tbody.innerHTML = rows.map(p => {
      const drafted = dm[p.rk];
      const posHtml = p.posList.map(x=>`<span class="postag">${x}</span>`).join('');
      let statusHtml;
      if(drafted){
        statusHtml = drafted === state.myTeam ? `<span class="drafted-tag me">DU</span>` : `<span class="drafted-tag">Team ${drafted}</span>`;
      } else {
        statusHtml = `<button class="draft-btn" data-rk="${p.rk}">Draft${onClockTeam?` → T${onClockTeam}`:''}</button>`;
      }
      return `<tr class="${drafted?'drafted':''}">
        <td class="rank-cell">${p.rk}</td>
        <td class="name-cell"><div class="p-name">${p.n}${p.manual?' <span style="color:var(--accent2);font-size:9px;">MANUELL</span>':''}</div><div class="p-meta">${p.team}</div></td>
        <td style="text-align:left;">${posHtml}</td>
        <td>${fmtNum(p.s.pts)}</td>
        <td>${fmtNum(p.s.reb)}</td>
        <td>${fmtNum(p.s.ast)}</td>
        <td>${fmtNum(p.s.stl)}</td>
        <td>${fmtNum(p.s.blk)}</td>
        <td>${fmtNum(p.s.fg3m)}</td>
        <td style="font-size:11px; color:var(--muted);">${fmtNum(p.s.fgm,1)}-${fmtNum(p.s.fga,1)}</td>
        <td>${fmtNum(p.s.fgpct)}%</td>
        <td style="font-size:11px; color:var(--muted);">${fmtNum(p.s.ftm,1)}-${fmtNum(p.s.fta,1)}</td>
        <td>${fmtNum(p.s.ftpct)}%</td>
        <td>${fmtNum(p.s.tov)}</td>
        <td class="col-z" style="${hz(p.z)}">${p.z>=0?'+':''}${fmtNum(p.z,2)}</td>
        <td style="${hzf(p.zFloor)};font-size:11px;font-weight:700" title="Floor — Schwächste Kat: ${p.worstCat||''}">${p.zFloor>=0?'+':''}${fmtNum(p.zFloor,2)}</td>
        <td style="${hzd(p.zDepth)};font-size:11px;font-weight:700" title="Depth — Stärkste Kat: ${p.bestCat||''}">${p.zDepth>=0?'+':''}${fmtNum(p.zDepth,2)}</td>
        <td style="${hzp(p.zPunt)};font-size:11px;font-weight:700">${p.zPunt>=0?'+':''}${fmtNum(p.zPunt,2)}</td>
        <td style="${p.hscore!==null&&p.hscore!==undefined?hhs(p.hscore):''};font-size:11px;font-weight:700">${p.hscore!==null&&p.hscore!==undefined?fmtNum(p.hscore,2):'—'}</td>
        <td style="font-size:11px;font-weight:700;color:${p.adpVal===null?'var(--muted)':p.adpVal>0?'var(--good)':'var(--bad)'}">${p.adpVal!==null?(p.adpVal>0?'+':'')+p.adpVal:'—'}</td>
        <td class="col-adp${p.adp===null?' no-adp':''}${p.ownPicks.length?' clickable':''}" ${p.ownPicks.length?`data-adp-rk="${p.rk}"`:''}>${p.adp!==null ? fmtNum(p.adp,1)+` <span class="adp-n">(n=${p.adpCount})</span>` : '—'}</td>
        <td class="col-fadp${p.fadp===null?' no-adp':''}">${p.fadp!==null ? p.fadp : '—'}</td>
        <td>${statusHtml}</td>
      </tr>`;
    }).join('');

    tbody.querySelectorAll('.draft-btn').forEach(btn => {
      btn.addEventListener('click', () => draftPlayer(Number(btn.dataset.rk)));
    });
    tbody.querySelectorAll('[data-adp-rk]').forEach(cell => {
      cell.addEventListener('click', (e) => {
        e.stopPropagation();
        showAdpPopover(Number(cell.dataset.adpRk), cell);
      });
    });
    document.querySelectorAll('#poolTable thead th').forEach(th => {
      th.classList.toggle('sorted', th.dataset.k === state.sortKey);
    });
  }

  // ---------------- Draft-Range-Popover (Klick auf ADP-Zelle) ----------------
  // Das "alte Excel Draft Range"-Feature: alle einzelnen Draft-Positionen
  // eines Spielers über deine erfassten Ligen (data/draft-results/*.csv),
  // nicht nur der gemittelte ADP. Zeigt außerdem, aus welcher Liga-Datei
  // jeder einzelne Pick stammt (grob, siehe source_label in build-adp-data.py).
  let currentAdpPopover = null;
  function closeAdpPopover(){
    if(currentAdpPopover){ currentAdpPopover.remove(); currentAdpPopover = null; }
    document.removeEventListener('click', onAdpPopoverOutsideClick);
    document.removeEventListener('keydown', onAdpPopoverEscape);
  }
  function onAdpPopoverOutsideClick(e){
    if(currentAdpPopover && !currentAdpPopover.contains(e.target)) closeAdpPopover();
  }
  function onAdpPopoverEscape(e){
    if(e.key === 'Escape') closeAdpPopover();
  }
  // Liga-Datei-Namen sind lange Fantrax-Hashes ohne Klarnamen (siehe
  // data/fantrax-leagues.txt) -- fürs Popover auf die letzten 6 Zeichen
  // gekürzt, nur zur groben "das war eine andere Liga"-Unterscheidung.
  function shortSource(label){
    const s = (label||'').replace(/^Fantrax-Draft-Results-AUTO-/, '');
    return s.length > 8 ? '…' + s.slice(-6) : s;
  }
  function showAdpPopover(rk, anchorEl){
    const p = byRk[rk];
    if(!p || !p.ownPicks.length) return;
    const isSame = currentAdpPopover && currentAdpPopover.dataset.rk === String(rk);
    closeAdpPopover();
    if(isSame) return; // zweiter Klick auf dieselbe Zelle schließt nur

    const picks = p.ownPicks.map(x=>x.pick).sort((a,b)=>a-b);
    const min = picks[0], max = picks[picks.length-1];
    const avg = picks.reduce((a,b)=>a+b,0)/picks.length;
    const span = Math.max(1, max-min);
    const chartMin = Math.max(1, min - Math.max(2, Math.round(span*0.1)));
    const chartMax = max + Math.max(2, Math.round(span*0.1));
    const chartSpan = chartMax - chartMin;
    const pct = v => ((v - chartMin) / chartSpan) * 100;

    const el = document.createElement('div');
    el.className = 'adp-popover';
    el.dataset.rk = String(rk);
    el.innerHTML = `
      <h4>${p.n} — Draft Range <span class="close-x">✕</span></h4>
      <div class="note" style="margin:0 0 6px;">Ø ${fmtNum(avg,1)} · Min ${min} · Max ${max} · n=${picks.length}</div>
      <div class="adp-range-bar">
        <div class="fill" style="left:${pct(min)}%; width:${pct(max)-pct(min)}%;"></div>
        <div class="avgmark" style="left:${pct(avg)}%;"></div>
      </div>
      <div class="adp-range-labels"><span>${chartMin}</span><span>${chartMax}</span></div>
      <div class="adp-pick-list">
        ${p.ownPicks.map(x => `<span class="adp-pick-chip ${x.pick===min?'lo':''}${x.pick===max?'hi':''}" title="${shortSource(x.source)}">${x.pick}</span>`).join('')}
      </div>`;
    // WICHTIG: an #liveProjDraftPage haengen, nicht document.body -- die
    // komplette Popover-Optik (.adp-popover, position:fixed, z-index usw.)
    // ist wie der Rest der Seite auf #liveProjDraftPage gescoped (siehe
    // css/projections.css). An document.body gehaengt wuerden keine dieser
    // Regeln greifen (unsichtbar/unstyled). position:fixed positioniert
    // trotzdem relativ zum Viewport, nicht zum Elternelement -- die
    // Platzierung unten funktioniert davon unabhaengig.
    document.getElementById('liveProjDraftPage').appendChild(el);

    // Position: unter der geklickten Zelle, aber im Viewport bleiben.
    const rect = anchorEl.getBoundingClientRect();
    let top = rect.bottom + 6, left = rect.left;
    const w = 260;
    if(left + w > window.innerWidth - 10) left = window.innerWidth - w - 10;
    if(top + 300 > window.innerHeight) top = Math.max(10, rect.top - 306);
    el.style.top = top + 'px';
    el.style.left = left + 'px';

    el.querySelector('.close-x').addEventListener('click', closeAdpPopover);
    currentAdpPopover = el;
    // setTimeout, damit der auslösende Klick nicht sofort wieder als
    // "außerhalb geklickt" gewertet wird (Event-Bubbling-Reihenfolge).
    setTimeout(() => {
      document.addEventListener('click', onAdpPopoverOutsideClick);
      document.addEventListener('keydown', onAdpPopoverEscape);
    }, 0);
  }


  function renderSlots(){
    const {slotAssignment, unassigned} = teamRoster(state.myTeam);
    const grid = document.getElementById('slotGrid');
    grid.innerHTML = slotAssignment.map(s => `
      <div class="slot-pill ${s.player?'full':'open'}">
        <span class="k">${s.slot}</span>
        <span class="v" title="${s.player ? s.player.n : ''}">${s.player ? s.player.n.split(' ').slice(-1)[0] : '—'}</span>
      </div>`).join('');
    if(unassigned.length){
      grid.innerHTML += `<div class="slot-pill slot-warn"><span class="k">Kein Slot frei</span><span class="v">${unassigned.map(p=>p.n).join(', ')}</span></div>`;
    }
  }

  function renderCatRanks(){
    const ranks = categoryRanks();
    const container = document.getElementById('catRanks');
    container.innerHTML = CATS.map(c => {
      const rank = ranks[c.key][state.myTeam];
      const pct = (TEAMS - rank) / (TEAMS - 1);
      const color = pct > 0.6 ? 'var(--good)' : pct < 0.4 ? 'var(--bad)' : 'var(--warn)';
      return `<div class="cat-row2">
        <div class="clabel">${c.label}</div>
        <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${(pct*100).toFixed(0)}%; background:${color};"></div></div>
        <div class="cat-rank" style="color:${color};">#${rank}</div>
      </div>`;
    }).join('');
  }

  function renderMatrix(){
    const ranks = categoryRanks();
    let html = `<table class="matrix"><thead><tr><th class="rowlabel">Kat.</th>`;
    for(let t=1;t<=TEAMS;t++) html += `<th class="${t===state.myTeam?'mycol':''}">${t===state.myTeam?'DU':'T'+t}</th>`;
    html += `</tr></thead><tbody>`;
    CATS.forEach(c => {
      html += `<tr><td class="rowlabel">${c.label}</td>`;
      for(let t=1;t<=TEAMS;t++){
        const rank = ranks[c.key][t];
        const pct = (TEAMS - rank) / (TEAMS - 1);
        const color = pct > 0.6 ? 'var(--good)' : pct < 0.4 ? 'var(--bad)' : 'var(--muted)';
        html += `<td class="rankcell ${t===state.myTeam?'mycol':''}" style="color:${color};">${rank}</td>`;
      }
      html += `</tr>`;
    });
    html += `</tbody></table>`;
    document.getElementById('matrixWrap').innerHTML = html;
  }

  function renderScarcity(){
    const dm = draftedMap();
    const available = PLAYERS.filter(p => !dm[p.rk]);
    const currentRound = Math.min(SLOTS_PER_TEAM, Math.ceil((state.picks.length+1)/TEAMS));
    const roundsAhead = Math.min(8, SLOTS_PER_TEAM - currentRound + 1); // Blick max. 8 Runden voraus
    if(roundsAhead < 1 || available.length < TEAMS){
      document.getElementById('scarcityWrap').innerHTML = '<div class="note">Draft beendet oder zu wenig Spieler übrig.</div>';
      document.getElementById('scarcityCliffNote').textContent = '';
      return;
    }
    const buckets = computeScarcityCurve(available, roundsAhead);

    // Heatmap-Range über alle sichtbaren Zellen gemeinsam, damit Kategorien
    // untereinander vergleichbar bleiben (nicht pro Kategorie neu skaliert).
    const allVals = [];
    buckets.forEach(b => Z_CATS.forEach(cat => { if(b.cats[cat]) allVals.push(b.cats[cat].avgZ); }));
    const vMin = Math.min(...allVals), vMax = Math.max(...allVals);

    let html = `<table class="matrix"><thead><tr><th class="rowlabel">Kat.</th>`;
    buckets.forEach(b => html += `<th>${b.round===0?'jetzt':'R+'+b.round}</th>`);
    html += `</tr></thead><tbody>`;
    CATS.filter(c => Z_CATS.includes(c.key)).forEach(c => {
      html += `<tr><td class="rowlabel">${c.label}</td>`;
      buckets.forEach(b => {
        const cell = b.cats[c.key];
        if(!cell){ html += `<td class="rankcell">—</td>`; return; }
        const style = mfhfbHeatStyle(cell.avgZ, vMin, vMax, false);
        html += `<td class="rankcell" style="${style}" title="Stärkster verbleibender: ${cell.topName} (${cell.topZ>=0?'+':''}${fmtNum(cell.topZ,2)})">${cell.avgZ>=0?'+':''}${fmtNum(cell.avgZ,2)}</td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody></table>`;
    document.getElementById('scarcityWrap').innerHTML = html;

    const cliff = steepestCliff(buckets);
    const cliffNote = document.getElementById('scarcityCliffNote');
    if(cliff){
      const catLabel = CATS.find(c=>c.key===cliff.cat).label;
      cliffNote.textContent = `Steilster Abfall: ${catLabel} verliert zwischen Runde +${cliff.atRound-1} und +${cliff.atRound} am meisten Tiefe (Ø-Z-Rückgang ${fmtNum(cliff.drop,2)}) — falls du dort noch etwas brauchst, ist das ungefähr das letzte Fenster.`;
    } else {
      cliffNote.textContent = '';
    }
  }

  function renderPuntPlanner(){
    const puntSet = new Set(state.punt);
    const ranks = categoryRanks();
    const myTotals = teamTotals(state.myTeam).totals;

    const summary = document.getElementById('puntSummary');
    if(puntSet.size === 0){
      summary.textContent = 'Noch keine Punt-Kategorie gewählt — wähle unten, um die Wochen-Bilanz gegen alle Gegner zu simulieren.';
    } else {
      const puntLabels = CATS.filter(c=>puntSet.has(c.key)).map(c=>c.label).join(', ');
      summary.textContent = `Gepuntet: ${puntLabels} — Bilanz unten aus den verbleibenden ${CATS.length - puntSet.size} Kategorien.`;
    }

    const allTotals = allTeamTotals();
    const teamCatStats = computeTeamCatStats(allTotals);

    const opponents = [];
    for(let t=1; t<=TEAMS; t++){
      if(t === state.myTeam) continue;
      const oppTotals = teamTotals(t).totals;
      const record = computeMatchupRecord(myTotals, oppTotals, puntSet, teamCatStats);
      const mirrors = detectMirrorPunts(t, puntSet, ranks);
      const margin = closestMargin(record.catResults, puntSet);
      opponents.push({ team: t, record, mirrors, margin });
    }
    // Schwächste Matchups zuerst -- das sind die, die im Zweifel kippen können.
    opponents.sort((a,b) => (a.record.wins - a.record.losses) - (b.record.wins - b.record.losses));

    const avgWins = opponents.reduce((s,o)=>s+o.record.wins,0) / opponents.length;
    const avgLosses = opponents.reduce((s,o)=>s+o.record.losses,0) / opponents.length;
    const worst = opponents[0];
    const mirrorCount = opponents.filter(o=>o.mirrors.length>0).length;
    if(puntSet.size > 0){
      summary.innerHTML += `<br>Ø voraussichtliche Bilanz: <b>${fmtNum(avgWins,1)}-${fmtNum(avgLosses,1)}</b> (${puntSet.size} gepuntet).
        Knappster Gegner: Team ${worst.team} (${worst.record.wins}-${worst.record.losses}).
        Mögliche Mirror-Punter bei dir: ${mirrorCount}/${TEAMS-1} Gegner.`;
    }

    let html = `<table class="matrix"><thead><tr>
      <th class="rowlabel">Gegner</th><th>Bilanz</th><th>Mirror-Punt</th><th>Knappste Kat.</th>
    </tr></thead><tbody>`;
    opponents.forEach(o => {
      const net = o.record.wins - o.record.losses;
      const color = net > 1 ? 'var(--good)' : net < 0 ? 'var(--bad)' : 'var(--warn)';
      const mirrorHtml = o.mirrors.length
        ? `⚠ ${o.mirrors.map(k=>CATS.find(c=>c.key===k).label).join(', ')}`
        : '—';
      const marginHtml = o.margin
        ? `${o.margin.cat.label} (${o.margin.diff>=0?'+':''}${fmtNum(o.margin.diff,1)})`
        : '—';
      html += `<tr>
        <td class="rowlabel">${o.team===state.myTeam?'DU':'Team '+o.team}</td>
        <td class="rankcell" style="color:${color};">${o.record.wins}-${o.record.losses}${o.record.ties?'-'+o.record.ties:''}</td>
        <td style="font-size:11px;">${mirrorHtml}</td>
        <td style="font-size:11px;">${marginHtml}</td>
      </tr>`;
    });
    html += `</tbody></table>`;
    document.getElementById('puntMatchupWrap').innerHTML = html;
  }

  function renderPower(){
    const all = allTeamTotals().sort((a,b)=>b.zSum-a.zSum);
    document.getElementById('powerRank').innerHTML = all.map((row,i) => `
      <div class="powerrank-row ${row.team===state.myTeam?'me':''}">
        <div class="prk">${i+1}</div>
        <div class="pname2">${row.team===state.myTeam?'Dein Team':'Team '+row.team} <span style="color:var(--muted); font-weight:400;">(${row.count}/${SLOTS_PER_TEAM})</span></div>
        <div class="pval">Σ${fmtNum(row.zSum,1)}</div>
      </div>`).join('');
  }

  function renderLog(){
    const container = document.getElementById('pickLog');
    if(state.picks.length === 0){ container.innerHTML = '<div class="empty">Noch keine Picks.</div>'; return; }
    const rows = state.picks.map((pk,i) => {
      const p = byRk[pk.rk];
      return `<div class="picklog-row"><span>#${i+1} ${pk.team===state.myTeam?'<b>DU</b>':'T'+pk.team}</span><b>${p?p.n:'?'}</b></div>`;
    }).reverse();
    container.innerHTML = rows.join('');
  }

  function renderReco(){
    const dm = draftedMap();
    const pickNo = state.picks.length + 1;
    const catFormat = (state.format === '9cat_roto' || state.format === '9cat_h2h');
    const available = PLAYERS.filter(p => !dm[p.rk]);

    // Seltenheit live aus dem noch verfügbaren Pool (siehe computeCatScarcity).
    CAT_SCARCITY = computeCatScarcity(available);

    let needWeight = null;
    if(catFormat){
      const ranks = categoryRanks();
      // Team-Bedarf ist in den ersten Runden extrem verrauscht -- ein Team
      // mit 1-2 Picks liegt in fast jeder Kategorie zufällig vorn/hinten,
      // das hat noch nichts mit echtem Roster-Bedarf zu tun. Konfidenz
      // steigt bis zu ~3 Picks pro Team linear, davor wird Richtung
      // "neutral" (0.5) gemischt statt dem verrauschten Rang voll zu
      // vertrauen.
      const avgPicksPerTeam = state.picks.length / TEAMS;
      const needConfidence = Math.min(1, avgPicksPerTeam / 3);
      needWeight = {};
      CATS.forEach(c => {
        if(state.punt.includes(c.key)){ needWeight[c.key] = 0; return; }
        const rank = ranks[c.key][state.myTeam];
        const rawBase = (rank-1)/(TEAMS-1);
        const base = needConfidence * rawBase + (1 - needConfidence) * 0.5;
        const scarcity = CAT_SCARCITY[c.key] || 1;
        needWeight[c.key] = base * scarcity;
      });
    }

    // Wann bin ich wieder dran? Für die Fall-Wahrscheinlichkeit unten.
    const nextMine = pickNo <= TOTAL_PICKS ? nextPickForTeam(pickNo, state.myTeam) : null;

    const scored = available.map(p => {
      let base;
      if(state.format === 'bestball'){
        base = p.z;
      } else if(state.format === 'points'){
        base = p.ptsScore / 40; // grob auf Z-ähnliche Größenordnung skaliert
      } else {
        base = 0;
        CATS.forEach(c => { base += (needWeight[c.key]||0) * p.catZ[c.key]; });
        base += 0.25 * p.z;
      }
      // i) Verfügbarkeit: Spieler mit schwacher Gesundheits-/Spielzeit-Historie
      // etwas abwerten (max. ±15%, siehe mfhfbDurability).
      const durMult = 0.85 + 0.15 * p.durability;

      // iii) Fällt er noch bis zu meinem nächsten Pick? Wahrscheinlich-weg
      // Spieler bekommen einen kleinen Bonus (jetzt zugreifen), Spieler die
      // sicher noch da sein werden einen kleinen Abschlag (später holen).
      let fallProb = null, urgencyMult = 1;
      if(nextMine !== null && nextMine > pickNo){
        fallProb = fallProbability(p, nextMine);
        if(fallProb !== null) urgencyMult = 0.85 + 0.30 * (1 - fallProb);
      }
      return {p, score: base * durMult * urgencyMult, fallProb};
    });
    scored.sort((a,b)=>b.score-a.score);
    const top = scored.slice(0,12);

    const container = document.getElementById('recoList');
    if(top.length === 0){ container.innerHTML = '<div class="empty">Keine verfügbaren Spieler.</div>'; return; }
    container.innerHTML = top.map(({p,score,fallProb}) => {
      const tags = [];
      if(catFormat){
        const bestCats = CATS.filter(c=>!state.punt.includes(c.key))
          .map(c=>({c, contrib: (needWeight[c.key]||0)*p.catZ[c.key]}))
          .sort((a,b)=>b.contrib-a.contrib).slice(0,2)
          .filter(x=>x.contrib>0.05).map(x=>x.c.label);
        if(bestCats.length) tags.push('stärkt '+bestCats.join(', '));
      }
      if(p.durabilityKnown && p.durability < 0.82) tags.push(`⚠ Verfügbarkeit ~${Math.round(p.durability*100)}%`);
      if(fallProb !== null && nextMine !== null){
        if(fallProb < 0.35) tags.push(`⏳ eher weg vor Pick ${nextMine}`);
        else if(fallProb > 0.65) tags.push(`↓ könnte bis Pick ${nextMine} fallen`);
      }
      if(!tags.length) tags.push('solider Gesamtwert');
      return `<div class="reco-item">
        <div><div class="reco-name">${p.n} <span class="p-meta">${p.pos}</span></div>
        <div class="reco-tags">${tags.join(' · ')}</div></div>
        <div style="display:flex; align-items:center; gap:8px;">
          <div class="reco-score">${fmtNum(score,2)}</div>
          <button class="draft-btn" data-rk="${p.rk}">Draft</button>
        </div>
      </div>`;
    }).join('');
    container.querySelectorAll('.draft-btn').forEach(btn => {
      btn.addEventListener('click', () => draftPlayer(Number(btn.dataset.rk)));
    });
  }

  function applyFormatUI(){
    const isPoints = state.format === 'points';
    document.getElementById('puntWrap').style.display = isPoints ? 'none' : '';
    document.getElementById('pointsWeightsWrap').style.display = isPoints ? '' : 'none';
  }
  function renderFormatOptions(){
    const sel = document.getElementById('formatSel');
    sel.innerHTML = FORMATS.map(f => `<option value="${f.key}">${f.label}</option>`).join('');
    sel.value = state.format;
    applyFormatUI();
  }
  function onFormatChange(newFormat){
    state.format = newFormat;
    applyFormatUI();
    // Wenn gerade eine Fantrax-Liga verbunden ist, das Format direkt für
    // diese Liga merken (siehe initLiveSyncPanel / loadFantraxLeague).
    if(liveSync.leagueId){
      const prefs = loadLiveSyncPrefs();
      prefs.leagues = prefs.leagues || {};
      if(prefs.leagues[liveSync.leagueId]) prefs.leagues[liveSync.leagueId].format = newFormat;
      saveLiveSyncPrefs(prefs);
    }
    renderAll(); scheduleSave();
  }
  function renderPointsWeights(){
    const pw = loadPointsWeights();
    const labels = { pts:'PTS', reb:'REB', ast:'AST', stl:'STL', blk:'BLK', fg3m:'3PM', tov:'TOV' };
    const container = document.getElementById('pointsWeights');
    container.innerHTML = Object.keys(labels).map(k => `
      <div style="display:flex; align-items:center; gap:4px;">
        <span style="font-size:10.5px; color:var(--muted); font-family:'DM Mono',monospace;">${labels[k]}</span>
        <input type="number" step="0.25" data-k="${k}" value="${pw[k]}" style="width:56px; background:var(--surface2); border:1px solid var(--border); color:var(--text); border-radius:6px; padding:4px 6px; font-size:11.5px; font-family:'DM Mono',monospace;">
      </div>`).join('');
    container.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('change', () => {
        const w = loadPointsWeights();
        w[inp.dataset.k] = parseFloat(inp.value) || 0;
        savePointsWeights(w);
        PLAYERS = buildPlayers(); reindex(); reindexNames(); renderAll();
      });
    });
  }
  // Rendert die Punt-Chips in JEDEN übergebenen Container (Setup-Panel +
  // Punt-Planer-Tab teilen sich dasselbe state.punt-Array, damit man von
  // beiden Stellen aus ändern kann und beide immer synchron sind).
  function renderPuntChips(){
    ['puntCats', 'puntCatsPlan'].forEach(containerId => {
      const container = document.getElementById(containerId);
      if(!container) return;
      container.innerHTML = CATS.map(c => `<div class="punt-chip ${state.punt.includes(c.key)?'active':''}" data-k="${c.key}">${c.label}</div>`).join('');
      container.querySelectorAll('.punt-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const k = chip.dataset.k;
          const i = state.punt.indexOf(k);
          if(i===-1) state.punt.push(k); else state.punt.splice(i,1);
          renderAll(); scheduleSave(); // rendert beide Chip-Container + alle abhängigen Tabs neu
        });
      });
    });
  }
  function renderPosFilters(){
    const container = document.getElementById('dPosFilters');
    const all = [{k:null,l:'Alle'}].concat(POSITIONS.map(p=>({k:p,l:p})));
    container.innerHTML = all.map(o => `<div class="tag-btn ${state.posFilter===o.k?'active':''}" data-k="${o.k??''}">${o.l}</div>`).join('');
    container.querySelectorAll('.tag-btn').forEach(btn => {
      btn.addEventListener('click', () => { state.posFilter = btn.dataset.k || null; renderPosFilters(); renderPool(); scheduleSave(); });
    });
  }

  function renderAll(){
    // Jeder Schritt einzeln in try/catch: eine Exception in EINEM Tab (z.B.
    // Scarcity oder Punt-Planer bei einem ungewöhnlichen Draft-Stand) soll
    // nicht dazu führen, dass der Rest der Seite (Tabelle, Empfehlungen,
    // Slots) stumm einfriert. Fehler landen in der Browser-Konsole statt
    // die ganze Seite lahmzulegen.
    const steps = [
      ['renderTopbar', renderTopbar], ['renderPool', renderPool], ['renderSlots', renderSlots],
      ['renderCatRanks', renderCatRanks], ['renderMatrix', renderMatrix], ['renderPuntChips', renderPuntChips],
      ['renderScarcity', renderScarcity], ['renderPuntPlanner', renderPuntPlanner],
      ['renderPower', renderPower], ['renderLog', renderLog], ['renderReco', renderReco],
    ];
    steps.forEach(([name, fn]) => {
      try { fn(); } catch(err) { console.error(name + '() fehlgeschlagen:', err); }
    });
  }

  // ---------------- Live-Sync mit Fantrax ----------------
  const MFHFB_LIVE_KEY = 'mfhfb_live_sync_v1';

  function loadLiveSyncPrefs(){
    let prefs;
    try { prefs = JSON.parse(localStorage.getItem(MFHFB_LIVE_KEY) || '{}'); } catch(e){ prefs = {}; }
    // Migration von der alten Struktur (nur eine lastLeagueId + teamByLeague)
    // auf das neue "Adressbuch" mit Namen + Format je Liga.
    if(!prefs.leagues){
      prefs.leagues = {};
      if(prefs.teamByLeague){
        Object.keys(prefs.teamByLeague).forEach(id => {
          prefs.leagues[id] = { label: id, format: '9cat_roto', teamId: prefs.teamByLeague[id] };
        });
      }
    }
    return prefs;
  }
  function saveLiveSyncPrefs(prefs){
    try { localStorage.setItem(MFHFB_LIVE_KEY, JSON.stringify(prefs)); } catch(e){}
  }
  function renderSavedLeagueSelect(){
    const prefs = loadLiveSyncPrefs();
    const sel = document.getElementById('savedLeagueSelect');
    const ids = Object.keys(prefs.leagues || {});
    const current = sel.value;
    sel.innerHTML = '<option value="">— Neue Liga eingeben —</option>' +
      ids.map(id => `<option value="${id}">${(prefs.leagues[id].label || id).replace(/"/g,'&quot;')}</option>`).join('');
    if(ids.includes(current)) sel.value = current;
    document.getElementById('liveDeleteBtn').style.display = sel.value ? '' : 'none';
  }
  function onSavedLeagueSelectChange(){
    const sel = document.getElementById('savedLeagueSelect');
    const id = sel.value;
    document.getElementById('liveDeleteBtn').style.display = id ? '' : 'none';
    if(!id){
      document.getElementById('liveLeagueId').value = '';
      document.getElementById('liveLeagueLabel').value = '';
      return;
    }
    const prefs = loadLiveSyncPrefs();
    const entry = prefs.leagues[id];
    if(!entry) return;
    document.getElementById('liveLeagueId').value = id;
    document.getElementById('liveLeagueLabel').value = entry.label || id;
    document.getElementById('formatSel').value = entry.format || '9cat_roto';
    onFormatChange(entry.format || '9cat_roto');
    loadFantraxLeague();
  }
  function onDeleteSavedLeague(){
    const sel = document.getElementById('savedLeagueSelect');
    const id = sel.value;
    if(!id) return;
    const prefs = loadLiveSyncPrefs();
    if(!confirm(`Liga "${prefs.leagues[id]?.label || id}" wirklich aus der Liste entfernen?`)) return;
    delete prefs.leagues[id];
    if(prefs.lastLeagueId === id) prefs.lastLeagueId = null;
    saveLiveSyncPrefs(prefs);
    document.getElementById('liveLeagueId').value = '';
    document.getElementById('liveLeagueLabel').value = '';
    sel.value = '';
    renderSavedLeagueSelect();
  }

  let liveSync = {
    leagueId: '',
    teamIdToNum: {},   // Fantrax-teamId -> lokale Team-Nummer 1..TEAMS
    teamNameById: {},  // Fantrax-teamId -> Anzeigename
    myTeamId: null,
    draftState: null,
    autoTimer: null,
  };

  function fmtDraftState(s){
    const map = { running:'läuft', complete:'abgeschlossen', drafted:'abgeschlossen', pending:'noch nicht gestartet', notStarted:'noch nicht gestartet' };
    return map[s] || s || 'unbekannt';
  }

  // Ordnet Fantrax-Picks unseren lokalen Player-Rows zu und ersetzt
  // state.picks komplett damit (Fantrax ist die Quelle der Wahrheit --
  // wir "speichern" nichts eigenes, sondern lesen bei jedem Laden neu).
  function applyFantraxPicks(draftPicks, players){
    const sorted = [...draftPicks].sort((a,b) => (a.pick||0) - (b.pick||0));
    const newPicks = [];
    const unmatchedNames = [];
    sorted.forEach(p => {
      if(!p.playerId) return; // noch nicht gefallener (zukünftiger) Pick
      const info = players[p.playerId];
      const displayName = info ? mfhfbFantraxNameToDisplay(info.name) : null;
      const normDisplay = displayName ? mfhfbNormalizeName(displayName) : null;
      const rk = normDisplay ? (nameToRk[normDisplay] ?? nameToRk[mfhfbResolveAlias(normDisplay)]) : undefined;
      const teamNum = liveSync.teamIdToNum[p.teamId];
      if(rk === undefined || teamNum === undefined){
        // Für die UI merken, WELCHER Spieler nicht zugeordnet werden konnte --
        // displayName falls Fantrax den Namen kennt aber wir ihn nicht in
        // unserer DB haben (häufigster Fall: neuer Rookie), sonst die
        // Fantrax-Player-ID als letzter Hinweis (falls Fantrax selbst schon
        // keine Namensauflösung liefert).
        unmatchedNames.push(displayName || `Fantrax-ID ${p.playerId}`);
        return;
      }
      newPicks.push({ rk, team: teamNum });
    });
    state.picks = newPicks;
    if(liveSync.myTeamId){
      state.myTeam = liveSync.teamIdToNum[liveSync.myTeamId] || state.myTeam;
      const sel = document.getElementById('myTeamSel');
      if(sel) sel.value = state.myTeam;
    }
    renderAll();
    scheduleSave();
    return { unmatched: unmatchedNames.length, names: unmatchedNames };
  }

  async function loadFantraxLeague(){
    const input = document.getElementById('liveLeagueId');
    const labelInput = document.getElementById('liveLeagueLabel');
    const leagueId = input.value.trim();
    const statusEl = document.getElementById('liveSyncStatus');
    const detailEl = document.getElementById('liveSyncDetail');
    const btn = document.getElementById('liveLoadBtn');

    if(!leagueId){
      statusEl.textContent = 'Liga-ID fehlt';
      statusEl.className = 'cloud-status err';
      return;
    }

    // Falls diese Liga schon im Adressbuch gespeichert ist, deren Format
    // übernehmen (z.B. beim direkten erneuten Laden per ID, ohne Auswahl
    // im Dropdown).
    const existing = (loadLiveSyncPrefs().leagues || {})[leagueId];
    if(existing && existing.format){
      document.getElementById('formatSel').value = existing.format;
      state.format = existing.format;
      applyFormatUI();
    }
    if(existing && !labelInput.value.trim()) labelInput.value = existing.label || leagueId;

    statusEl.textContent = 'lädt…';
    statusEl.className = 'cloud-status';
    btn.disabled = true;

    try{
      const [{ draft, league }, players] = await Promise.all([
        mfhfbFetchFantraxLeague(leagueId),
        mfhfbFantraxPlayerIndex(),
      ]);

      const order = draft.draftOrder || [];
      if(order.length && order.length !== TEAMS){
        console.warn(`Liga hat ${order.length} Teams, unser Board ist für ${TEAMS} Teams gebaut -- Zuordnung kann ungenau sein.`);
      }
      liveSync.teamIdToNum = {};
      order.forEach((tid, i) => { liveSync.teamIdToNum[tid] = i + 1; });
      liveSync.teamNameById = {};
      Object.entries(league.teamInfo || {}).forEach(([id, t]) => { liveSync.teamNameById[id] = t.name || id; });
      liveSync.leagueId = leagueId;
      liveSync.draftState = draft.draftState;

      const prefs = loadLiveSyncPrefs();
      prefs.leagues = prefs.leagues || {};
      const prevTeamId = (prefs.leagues[leagueId] || {}).teamId;

      const teamSel = document.getElementById('liveTeamPick');
      teamSel.innerHTML = order.map(tid =>
        `<option value="${tid}">${(liveSync.teamNameById[tid] || tid).replace(/"/g,'&quot;')}</option>`
      ).join('');
      if(prevTeamId && order.includes(prevTeamId)) teamSel.value = prevTeamId;
      liveSync.myTeamId = teamSel.value || null;
      document.getElementById('liveTeamPickWrap').style.display = order.length ? '' : 'none';

      const syncResult = applyFantraxPicks(draft.draftPicks || [], players);

      prefs.lastLeagueId = leagueId;
      prefs.leagues[leagueId] = {
        label: labelInput.value.trim() || (prefs.leagues[leagueId] && prefs.leagues[leagueId].label) || leagueId,
        format: state.format,
        teamId: liveSync.myTeamId,
      };
      saveLiveSyncPrefs(prefs);
      renderSavedLeagueSelect();
      document.getElementById('savedLeagueSelect').value = leagueId;
      document.getElementById('liveDeleteBtn').style.display = '';

      const total = (draft.draftPicks || []).length;
      const made = (draft.draftPicks || []).filter(p => p.playerId).length;
      statusEl.textContent = 'verbunden';
      statusEl.className = 'cloud-status ok';
      let detail = `Draft-Status: ${fmtDraftState(draft.draftState)} · ${made}/${total} Picks gefallen · zuletzt geladen ${new Date().toLocaleTimeString('de-DE')}`;
      if(syncResult.unmatched){
        const namesShort = syncResult.names.slice(0, 3).join(', ') + (syncResult.names.length > 3 ? ` +${syncResult.names.length-3} weitere` : '');
        detail += ` · ⚠️ ${syncResult.unmatched} Pick(s) nicht zuordenbar: `
          + `<span title="${syncResult.names.join(', ').replace(/"/g,'&quot;')}" style="text-decoration:underline dotted; cursor:help;">${namesShort}</span>`
          + ` (Spieler nicht in unserer Datenbank, z.B. neue Rookies)`;
        detailEl.innerHTML = detail;
      } else {
        detailEl.textContent = detail;
      }

      document.getElementById('liveAutoWrap').style.display = '';
      if(draft.draftState === 'running' && document.getElementById('liveAutoRefresh').checked) startAutoRefresh();
      else if(draft.draftState !== 'running') stopAutoRefresh();

    }catch(err){
      statusEl.textContent = 'Fehler';
      statusEl.className = 'cloud-status err';
      detailEl.textContent = err.message;
      console.error(err);
    }finally{
      btn.disabled = false;
    }
  }

  function onLiveTeamChange(e){
    liveSync.myTeamId = e.target.value;
    state.myTeam = liveSync.teamIdToNum[liveSync.myTeamId] || state.myTeam;
    const sel = document.getElementById('myTeamSel');
    if(sel) sel.value = state.myTeam;
    const prefs = loadLiveSyncPrefs();
    prefs.leagues = prefs.leagues || {};
    if(prefs.leagues[liveSync.leagueId]) prefs.leagues[liveSync.leagueId].teamId = liveSync.myTeamId;
    saveLiveSyncPrefs(prefs);
    renderAll();
    scheduleSave();
  }

  function startAutoRefresh(){
    stopAutoRefresh();
    liveSync.autoTimer = setInterval(loadFantraxLeague, 30000);
  }
  function stopAutoRefresh(){
    if(liveSync.autoTimer){ clearInterval(liveSync.autoTimer); liveSync.autoTimer = null; }
  }

  // ---------------- Liga-Fortschritt (alle Ligen aus data/fantrax-leagues.txt) ----------------
  async function loadLeagueDirectoryFromRepo(){
    // Dieselbe simple Zeilen-Liste, die auch scripts/fetch-draft-results.mjs
    // nutzt -- wird hier direkt aus dem Repo nachgeladen (relativ zur Seite,
    // funktioniert auf GitHub Pages ohne eigenes Backend).
    // War 'data/fantrax-leagues.txt', relativ korrekt, solange dieser Code
    // noch in projections/draft.html lief. Seit der nativen Portierung
    // (2026-08-01) laeuft er von TTHQs eigenem index.html im Repo-Root aus,
    // der relative Pfad muss daher den projections/-Ordner mit angeben.
    const res = await fetch('projections/data/fantrax-leagues.txt');
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.text();
    // Zeilennummer der Datei mitfuehren: bei 66 Ligen ist "Liga X nicht
    // erreichbar" ohne Fundstelle kaum nachzuverfolgen. lineNo zaehlt ab 1
    // inklusive Kommentar- und Leerzeilen, entspricht also genau dem, was
    // ein Editor anzeigt.
    return raw.split('\n')
      .map((l, i) => ({ lineNo: i + 1, text: l.split('#')[0].trim() }))
      .filter(e => e.text)
      .map(e => {
        const [id, ...rest] = e.text.split(',').map(s => s.trim());
        return { id, label: rest.join(',') || id, lineNo: e.lineNo };
      });
  }
  // Grobe Format-Erkennung nur aus dem selbstvergebenen Label (Roto/H2H/Points
  // als Stichwort) -- die Fantrax-API liefert das Scoring-Format nicht
  // zuverlässig dokumentiert mit. Ligen ohne erkennbares Stichwort im Label
  // landen unter "unbekannt".
  function guessLeagueFormat(label){
    const l = label.toLowerCase();
    if(l.includes('h2h')) return 'H2H';
    if(l.includes('roto')) return 'Roto';
    if(l.includes('points') || l.includes('punkte') || l.includes('pts')) return 'Points';
    return 'unbekannt';
  }
  // Fantrax dokumentiert den genauen Feldnamen für den Liga-Namen in
  // getLeagueInfo nicht offiziell -- probiere die plausibelsten Kandidaten
  // durch. Falls keiner passt (Fantrax hat's mal umbenannt o.ä.), fällt
  // alles unten sauber auf das manuelle Label / die ID zurück, nichts
  // bricht.
  function extractLeagueName(league){
    if(!league) return null;
    const candidates = [league.name, league.leagueName, league.info && league.info.name, league.league && league.league.name];
    const found = candidates.find(v => typeof v === 'string' && v.trim());
    return found ? found.trim() : null;
  }
  async function fetchLeagueProgress(entry){
    try{
      const { draft, league } = await mfhfbFetchFantraxLeague(entry.id);
      const apiName = extractLeagueName(league);
      const picks = draft.draftPicks || [];
      const made = picks.filter(p => p.playerId).length;
      const total = picks.length;
      const finished = total > 0 && made >= total;
      let overall = null, round = null, pickInRound = null;
      if(!finished && total > 0){
        overall = made + 1;
        const teams = draft.draftOrder ? draft.draftOrder.length : TEAMS;
        round = Math.ceil(overall/teams);
        pickInRound = overall - (round-1)*teams;
      }
      return { entry, apiName, ok:true, finished, made, total, overall, round, pickInRound };
    }catch(err){
      return { entry, ok:false, error: err.message };
    }
  }
  async function runWithConcurrency(items, limit, worker){
    const results = new Array(items.length);
    let idx = 0;
    async function next(){
      while(idx < items.length){
        const i = idx++;
        results[i] = await worker(items[i]);
      }
    }
    await Promise.all(Array.from({length: Math.min(limit, items.length)}, next));
    return results;
  }
  async function openLeagueProgress(){
    const overlay = document.getElementById('leagueProgressOverlay');
    const summaryEl = document.getElementById('leagueProgressSummary');
    const listEl = document.getElementById('leagueProgressList');
    overlay.style.display = 'flex';
    summaryEl.textContent = 'lädt…';
    listEl.innerHTML = '';

    let entries;
    try{
      entries = await loadLeagueDirectoryFromRepo();
    }catch(err){
      summaryEl.textContent = `Liga-Liste konnte nicht geladen werden (${err.message}).`;
      return;
    }
    if(!entries.length){ summaryEl.textContent = 'Keine Ligen in projections/data/fantrax-leagues.txt eingetragen.'; return; }

    const results = await runWithConcurrency(entries, 5, fetchLeagueProgress);

    const ok = results.filter(r => r.ok);
    const finished = ok.filter(r => r.finished);
    const inProgress = ok.filter(r => !r.finished && r.total > 0);
    const failed = results.filter(r => !r.ok);

    const finishedByFormat = {};
    finished.forEach(r => {
      const fmt = guessLeagueFormat(r.apiName || r.entry.label);
      finishedByFormat[fmt] = (finishedByFormat[fmt]||0) + 1;
    });
    const fmtParts = Object.entries(finishedByFormat).map(([k,v]) => `${v}x ${k}`).join(', ');
    summaryEl.textContent = `${finished.length}/${entries.length} Ligen fertig` +
      (fmtParts ? ` (${fmtParts})` : '') +
      (inProgress.length ? ` · ${inProgress.length} laufen noch` : '') +
      (failed.length ? ` · ${failed.length} nicht erreichbar` : '');

    const sorted = [...inProgress, ...finished, ...failed];
    listEl.innerHTML = sorted.map(r => {
      const name = (r.ok && r.apiName ? r.apiName : (r.entry.label || r.entry.id)).replace(/</g,'&lt;');
      if(!r.ok){
        return `<div class="league-row"><div><div class="lg-name">${name}</div><div class="lg-id">Zeile ${r.entry.lineNo} · ${r.entry.id}</div></div><div class="lg-status err">nicht erreichbar</div></div>`;
      }
      if(r.finished){
        return `<div class="league-row"><div><div class="lg-name">${name}</div><div class="lg-id">Zeile ${r.entry.lineNo} · ${r.entry.id}</div></div><div class="lg-status done">✓ Fertig</div></div>`;
      }
      if(r.total === 0){
        return `<div class="league-row"><div><div class="lg-name">${name}</div><div class="lg-id">Zeile ${r.entry.lineNo} · ${r.entry.id}</div></div><div class="lg-status">noch nicht gestartet</div></div>`;
      }
      return `<div class="league-row"><div><div class="lg-name">${name}</div><div class="lg-id">Zeile ${r.entry.lineNo} · ${r.entry.id}</div></div><div class="lg-status">Pick ${r.round}.${r.pickInRound} / #${r.overall} von ${r.total}</div></div>`;
    }).join('');
  }
  function initLeagueProgressModal(){
    document.getElementById('leagueProgressBtn').addEventListener('click', openLeagueProgress);
    document.getElementById('leagueProgressClose').addEventListener('click', () => {
      document.getElementById('leagueProgressOverlay').style.display = 'none';
    });
    document.getElementById('leagueProgressOverlay').addEventListener('click', (e) => {
      if(e.target.id === 'leagueProgressOverlay') e.currentTarget.style.display = 'none';
    });
  }

  // ---------------- Meine Spieler: Besitz + ADP ueber alle Ligen ----------------
  //
  // Wertet ALLE Ligen aus data/fantrax-leagues.txt aus und beantwortet zwei
  // Fragen je Spieler:
  //   1. In wie vielen meiner Ligen habe ich ihn gedraftet?
  //   2. Wie frueh ging er im Schnitt (Overall ADP) und wie frueh habe ICH
  //      ihn genommen (mein ADP)?
  //
  // Die Zuordnung "welches Team gehoert mir" laeuft ueber die Teamnamen, weil
  // die Fantrax-Team-IDs je Liga verschieden sind. Die Namensliste ist
  // editierbar und wird lokal gespeichert.
  //
  // ADP ist die Overall-Picknummer und damit ueber Ligagroessen hinweg direkt
  // vergleichbar: Pick 10 heisst ueberall, dass neun Spieler vorher weg waren.
  // Die Teamzahl aendert daran nichts, sie aendert nur, in welcher RUNDE
  // dieser Pick liegt.
  //
  // Wo die Ligagroesse doch wirkt, ist allein der hintere Rand: eine 10er-Liga
  // mit 13 Runden draftet 130 Spieler, eine 14er 182. Ein Spieler um Rang 150
  // erscheint deshalb nur in den tiefen Ligen, sein ADP steht auf wenigen
  // Beobachtungen und stammt genau aus den Ligen, in denen ihn jemand wollte.
  // Das ist eine Stichprobenfrage, kein Skalierungsproblem -- deshalb wird pro
  // Spieler ausgewiesen, auf wie vielen Ligen sein ADP beruht.

  const MFHFB_MYTEAMS_KEY = 'mfhfb_my_team_names_v1';
  const MFHFB_MYTEAMS_DEFAULT = ['MFHFBs', 'Steakosaurus', 'Pizzaratops', 'Hawkward'];

  let myPlayersCache = null;      // Ergebnis des letzten Durchlaufs
  let myPlayersShowAll = false;   // false = nur meine Spieler
  // Sortierung der Tabelle. Standard: meiste eigene Ligen zuerst.
  let myPlayersSort = { key: 'owned', dir: -1 };

  // Startrichtung je Spalte: bei Zaehlern will man absteigend beginnen
  // (viel zuerst), bei ADP aufsteigend (frueh zuerst).
  const MP_SORT_DEFS = {
    name:    { get: r => r.name.toLowerCase(), dir: 1, text: true },
    owned:   { get: r => r.owned,   dir: -1 },
    drafted: { get: r => r.drafted, dir: -1 },
    adp:     { get: r => r.adp,     dir:  1 },
    myAdp:   { get: r => r.myAdp,   dir:  1 },
    delta:   { get: r => r.delta,   dir: -1 },
  };

  function mpSortBy(key){
    const def = MP_SORT_DEFS[key];
    if(!def) return;
    // Gleiche Spalte erneut: Richtung drehen. Neue Spalte: mit der
    // Richtung starten, die fuer sie am nuetzlichsten ist.
    if(myPlayersSort.key === key) myPlayersSort.dir *= -1;
    else myPlayersSort = { key, dir: def.dir };
    renderMyPlayersTable();
  }

  function loadMyTeamNames(){
    try{
      const raw = JSON.parse(localStorage.getItem(MFHFB_MYTEAMS_KEY) || 'null');
      if(Array.isArray(raw) && raw.length) return raw;
    }catch(e){}
    return [...MFHFB_MYTEAMS_DEFAULT];
  }
  function saveMyTeamNames(list){
    try{ localStorage.setItem(MFHFB_MYTEAMS_KEY, JSON.stringify(list)); }catch(e){}
  }

  // Teamnamen tolerant vergleichen: Fantrax laesst Emojis, Bindestriche und
  // wechselnde Gross-/Kleinschreibung zu, deshalb auf reine Buchstaben und
  // Ziffern reduzieren und beidseitig auf Teilstring pruefen.
  function normTeamName(s){
    return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }
  // Nur EINE Richtung: der Teamname muss meine Eingabe enthalten.
  //
  // Die umgekehrte Richtung (Eingabe enthaelt den Teamnamen) gab es
  // frueher, damit "Steakosaurus" auch ein Team namens "Steak" findet.
  // Sie ist aber grundsaetzlich nicht sicher zu bekommen: bei der
  // Eingabe "Sternhold" passt ein fremdes Team namens "Stern" nach
  // genau derselben Regel wie "Steak" zu "Steakosaurus" -- gleiche
  // Laenge, gleicher Praefix, kein Merkmal unterscheidet die beiden.
  // Eine Laengenschwelle verschiebt das Problem nur. Ein faelschlich
  // zugeordnetes Team verfaelscht die Besitzquoten still, deshalb
  // lieber die vorhersagbare Regel: eingeben, was IM Teamnamen steht.
  // Was erkannt wurde, steht als Chips ueber der Tabelle.
  const MP_MIN_NEEDLE = 3;
  function makeIsMyTeam(names){
    const needles = names.map(normTeamName).filter(n => n.length >= MP_MIN_NEEDLE);
    return (teamName) => {
      const t = normTeamName(teamName);
      if(!t) return false;
      return needles.some(n => t.includes(n));
    };
  }

  async function fetchLeagueOwnership(entry, players, isMyTeam){
    try{
      const { draft, league } = await mfhfbFetchFantraxLeague(entry.id);
      const picks = (draft.draftPicks || []).filter(p => p.playerId);
      const teamInfo = league.teamInfo || {};
      const teamCount = (draft.draftOrder && draft.draftOrder.length)
        || Object.keys(teamInfo).length || null;

      const myTeamIds = new Set(
        Object.keys(teamInfo).filter(id => isMyTeam(teamInfo[id] && teamInfo[id].name))
      );
      const myTeamNames = [...myTeamIds].map(id => teamInfo[id].name);

      const rows = picks.map(p => ({
        playerId: p.playerId,
        pick: p.pick || 0,
        mine: myTeamIds.has(p.teamId),
      })).filter(r => r.pick > 0);

      return {
        entry, ok: true,
        apiName: extractLeagueName(league),
        teamCount, picks: rows,
        started: rows.length > 0,
        matched: myTeamIds.size > 0,
        myTeamNames,
        allTeamNames: Object.keys(teamInfo).map(id => teamInfo[id].name).filter(Boolean),
      };
    }catch(err){
      return { entry, ok: false, error: err.message };
    }
  }

  function buildOwnershipTable(results, players){
    const usable = results.filter(r => r.ok && r.started);
    const agg = new Map();

    usable.forEach(r => {
      r.picks.forEach(pk => {
        const info = players[pk.playerId];
        const display = info ? mfhfbFantraxNameToDisplay(info.name) : `Fantrax-ID ${pk.playerId}`;
        const key = mfhfbNormalizeName(display) || display;
        if(!agg.has(key)){
          agg.set(key, {
            name: display,
            pos: (info && (info.position || info.pos)) || '',
            team: (info && (info.team || info.teamShortName)) || '',
            allPicks: [], myPicks: [], myLeagues: [],
          });
        }
        const a = agg.get(key);
        a.allPicks.push(pk.pick);
        if(pk.mine){
          a.myPicks.push(pk.pick);
          a.myLeagues.push({ label: r.apiName || r.entry.label || r.entry.id, pick: pk.pick });
        }
      });
    });

    const mean = arr => arr.reduce((s, v) => s + v, 0) / arr.length;
    const rows = [...agg.values()].map(a => ({
      ...a,
      owned: a.myPicks.length,
      adp: mean(a.allPicks),
      myAdp: a.myPicks.length ? mean(a.myPicks) : null,
      drafted: a.allPicks.length,
    }));
    rows.forEach(r => { r.delta = r.myAdp === null ? null : r.myAdp - r.adp; });

    return { rows, leagueCount: usable.length };
  }

  function renderMyPlayersTable(){
    const listEl = document.getElementById('myPlayersList');
    if(!myPlayersCache){ listEl.innerHTML = ''; return; }
    const { rows, leagueCount } = myPlayersCache;

    let shown = myPlayersShowAll ? rows.slice() : rows.filter(r => r.owned > 0);

    const def = MP_SORT_DEFS[myPlayersSort.key] || MP_SORT_DEFS.owned;
    const dir = myPlayersSort.dir;
    shown.sort((a, b) => {
      const va = def.get(a), vb = def.get(b);
      // Spieler ohne eigenen Pick haben kein "Mein ADP" und keine Diff.
      // Die gehoeren immer ans Ende, egal in welche Richtung sortiert
      // wird -- sonst wandert beim Umschalten eine Wand aus Strichen
      // nach oben und verdraengt genau die Zeilen, die man sehen will.
      const na = va === null || va === undefined || (typeof va === 'number' && !Number.isFinite(va));
      const nb = vb === null || vb === undefined || (typeof vb === 'number' && !Number.isFinite(vb));
      if(na !== nb) return na ? 1 : -1;
      if(na && nb) return a.name.localeCompare(b.name);
      if(def.text) return va.localeCompare(vb) * dir;
      if(va !== vb) return (va - vb) * dir;
      return (a.adp - b.adp) || a.name.localeCompare(b.name);
    });

    if(!shown.length){
      listEl.innerHTML = '<div class="note">Keine Treffer. Stimmen die Teamnamen oben?</div>';
      return;
    }

    const fmt = v => v === null || v === undefined ? '—' : v.toFixed(1);
    const deltaCell = r => {
      if(r.delta === null) return '<td class="mp-o-num">—</td>';
      // Positiv heisst: ich habe ihn SPAETER geholt als der Schnitt, also
      // guenstiger eingekauft. Negativ heisst: ich habe hochgegriffen.
      const cls = r.delta > 0.5 ? 'good' : (r.delta < -0.5 ? 'bad' : '');
      const sign = r.delta > 0 ? '+' : '';
      return `<td class="mp-o-num ${cls}">${sign}${r.delta.toFixed(1)}</td>`;
    };

    // data-short liefert die Kurzform, die das CSS unter 700px per
    // ::after einblendet, waehrend das <span> ausgeblendet wird.
    const th = (key, label, short, title) => {
      const on = myPlayersSort.key === key;
      const arrow = on ? (myPlayersSort.dir === 1 ? ' ▲' : ' ▼') : '';
      const cls = 'mp-o-th' + (on ? ' sorted' : '') + (key === 'name' ? ' mp-o-name' : '');
      return `<th class="${cls}" data-sort="${key}" data-short="${short}${arrow}" title="${title}">`
           + `<span>${label}${arrow}</span></th>`;
    };

    listEl.innerHTML = `
      <table class="mp-owned">
        <thead><tr>
          ${th('name','Spieler','SPIELER','Nach Namen sortieren')}
          ${th('owned','Meine Ligen','MEINE','In wie vielen ausgewerteten Ligen ich ihn gedraftet habe')}
          ${th('drafted','Gedraftet in','GEZOGEN','In wie vielen Ligen er überhaupt gedraftet wurde. Je kleiner die Zahl, desto dünner die Grundlage des ADP.')}
          ${th('adp','Overall ADP','ADP','Durchschnittliche Overall-Picknummer über alle Ligen, in denen er gedraftet wurde')}
          ${th('myAdp','Mein ADP','MEIN','Durchschnittliche Picknummer, zu der ich ihn geholt habe')}
          ${th('delta','Diff','DIFF','Mein ADP minus Overall ADP. Plus heißt später geholt als der Markt.')}
        </tr></thead>
        <tbody>${shown.map(r => `
          <tr title="${r.myLeagues.map(l => `${l.label}: Pick ${l.pick}`).join(' | ').replace(/"/g, '&quot;')}">
            <td class="mp-o-name">
              <span class="mp-o-pname">${r.name.replace(/</g, '&lt;')}</span>
              <span class="mp-o-pmeta">${[r.pos, r.team].filter(Boolean).join(' · ')}</span>
            </td>
            <td class="mp-o-num${r.owned ? ' own' : ''}">${r.owned} / ${leagueCount}</td>
            <td class="mp-o-num${r.drafted < leagueCount ? ' thin' : ''}">${r.drafted} / ${leagueCount}</td>
            <td class="mp-o-num">${fmt(r.adp)}</td>
            <td class="mp-o-num">${fmt(r.myAdp)}</td>
            ${deltaCell(r)}
          </tr>`).join('')}
        </tbody>
      </table>`;
  }

  async function openMyPlayers(force){
    const overlay = document.getElementById('myPlayersOverlay');
    const summaryEl = document.getElementById('myPlayersSummary');
    const listEl = document.getElementById('myPlayersList');
    overlay.style.display = 'flex';
    document.getElementById('myTeamNamesInput').value = loadMyTeamNames().join(', ');

    if(myPlayersCache && !force){ renderMyPlayersTable(); return; }

    summaryEl.textContent = 'lädt…';
    listEl.innerHTML = '';

    let entries;
    try{
      entries = await loadLeagueDirectoryFromRepo();
    }catch(err){
      summaryEl.textContent = `Liga-Liste konnte nicht geladen werden (${err.message}).`;
      return;
    }
    if(!entries.length){ summaryEl.textContent = 'Keine Ligen in projections/data/fantrax-leagues.txt eingetragen.'; return; }

    const isMyTeam = makeIsMyTeam(loadMyTeamNames());
    let players;
    try{
      players = await mfhfbFantraxPlayerIndex();
    }catch(err){
      summaryEl.textContent = `Spieler-Index konnte nicht geladen werden (${err.message}).`;
      return;
    }

    const results = await runWithConcurrency(entries, 5, e => fetchLeagueOwnership(e, players, isMyTeam));
    myPlayersCache = buildOwnershipTable(results, players);

    const usable = results.filter(r => r.ok && r.started);
    const unmatched = usable.filter(r => !r.matched);
    const failed = results.filter(r => !r.ok);
    const notStarted = results.filter(r => r.ok && !r.started);
    const sizes = [...new Set(usable.map(r => r.teamCount).filter(Boolean))].sort((a, b) => a - b);

    let txt = `${usable.length} Ligen ausgewertet`;
    if(sizes.length > 1) txt += ` (${sizes.join(' bis ')} Teams)`;
    else if(sizes.length === 1) txt += ` (je ${sizes[0]} Teams)`;
    if(notStarted.length) txt += ` · ${notStarted.length} noch ohne Picks`;
    if(failed.length) txt += ` · ${failed.length} nicht erreichbar`;
    summaryEl.textContent = txt;

    // Welche Teams als meine erkannt wurden, offen ausweisen. Ohne das
    // laesst sich ein Fehlgriff der Namenssuche nicht bemerken -- ein
    // faelschlich zugeordnetes Team wuerde die Besitzquoten still
    // verfaelschen.
    const hitsEl = document.getElementById('myPlayersHits');
    if(hitsEl){
      const hits = {};
      usable.forEach(r => r.myTeamNames.forEach(n => { hits[n] = (hits[n]||0) + 1; }));
      const names = Object.keys(hits).sort((a,b) => hits[b]-hits[a] || a.localeCompare(b));
      hitsEl.innerHTML = names.length
        ? `<span class="mp-owned-hit" style="border:none;padding-left:0;">Erkannt als Deine Teams:</span>` +
          names.map(n => `<span class="mp-owned-hit">${n.replace(/</g,'&lt;')}${hits[n]>1?` ×${hits[n]}`:''}</span>`).join('')
        : '';
    }

    // Nicht erreichbare Ligen mit Fundstelle auflisten, sonst bleibt
    // "3 nicht erreichbar" eine Sackgasse.
    const failEl = document.getElementById('myPlayersFailed');
    if(failEl){
      if(failed.length){
        failEl.style.display = '';
        failEl.innerHTML = `<b>${failed.length} Liga(en) nicht erreichbar.</b> `
          + `Entweder ist die ID in projections/data/fantrax-leagues.txt veraltet oder Fantrax hat gerade gehakt.`
          + `<div class="mp-owned-fails">`
          + failed.map(r => `<span class="mp-owned-fail">`
              + `<span class="mp-owned-fail-ln">Zeile ${r.entry.lineNo}</span> `
              + `${(r.entry.label || '').replace(/</g,'&lt;')} `
              + `<code>${(r.entry.id || '').replace(/</g,'&lt;')}</code>`
              + `</span>`).join('')
          + `</div>`;
      } else {
        failEl.style.display = 'none';
      }
    }

    const warnEl = document.getElementById('myPlayersWarn');
    if(unmatched.length){
      // Ohne Treffer beim Teamnamen faellt eine ganze Liga aus der
      // Besitz-Rechnung -- das muss sichtbar sein, sonst wundert man sich
      // ueber zu niedrige Zaehler.
      warnEl.style.display = '';
      warnEl.innerHTML = `⚠️ In <b>${unmatched.length}</b> Liga(en) wurde kein Team mit Deinen Namen gefunden. `
        + `Diese Ligen zählen bei "Overall ADP" mit, aber nicht bei "Meine Ligen". `
        + `Entweder bist Du dort nicht dabei, oder der Teamname fehlt oben.`
        + `<details class="mp-owned-det"><summary>Betroffene Ligen anzeigen</summary>`
        + `<div class="mp-owned-fails">`
        + unmatched.map(r => `<span class="mp-owned-fail">`
            + `<span class="mp-owned-fail-ln">Zeile ${r.entry.lineNo}</span> `
            + `${(r.apiName || r.entry.label || r.entry.id).replace(/</g,'&lt;')}`
            + `</span>`).join('')
        + `</div></details>`;
    } else {
      warnEl.style.display = 'none';
    }

    renderMyPlayersTable();
  }

  function initMyPlayersModal(){
    document.getElementById('myPlayersBtn').addEventListener('click', () => openMyPlayers(false));
    document.getElementById('myPlayersClose').addEventListener('click', () => {
      document.getElementById('myPlayersOverlay').style.display = 'none';
    });
    document.getElementById('myPlayersOverlay').addEventListener('click', (e) => {
      if(e.target.id === 'myPlayersOverlay') e.currentTarget.style.display = 'none';
    });
    document.getElementById('myPlayersReload').addEventListener('click', () => {
      const raw = document.getElementById('myTeamNamesInput').value;
      const list = raw.split(',').map(s => s.trim()).filter(Boolean);
      saveMyTeamNames(list.length ? list : [...MFHFB_MYTEAMS_DEFAULT]);
      openMyPlayers(true);
    });
    // Delegiert, weil der Tabellenkopf bei jedem Rendern neu entsteht.
    document.getElementById('myPlayersList').addEventListener('click', (e) => {
      const th = e.target.closest('th[data-sort]');
      if(th) mpSortBy(th.dataset.sort);
    });
    document.getElementById('myPlayersShowAll').addEventListener('change', (e) => {
      myPlayersShowAll = e.target.checked;
      renderMyPlayersTable();
    });
  }

  function initLiveSyncPanel(){
    document.getElementById('liveLoadBtn').addEventListener('click', loadFantraxLeague);
    document.getElementById('liveTeamPick').addEventListener('change', onLiveTeamChange);
    document.getElementById('savedLeagueSelect').addEventListener('change', onSavedLeagueSelectChange);
    document.getElementById('liveDeleteBtn').addEventListener('click', onDeleteSavedLeague);
    document.getElementById('liveAutoRefresh').addEventListener('change', (e) => {
      if(e.target.checked) startAutoRefresh(); else stopAutoRefresh();
    });

    renderSavedLeagueSelect();
    const prefs = loadLiveSyncPrefs();
    if(prefs.lastLeagueId && prefs.leagues[prefs.lastLeagueId]){
      document.getElementById('liveLeagueId').value = prefs.lastLeagueId;
      document.getElementById('liveLeagueLabel').value = prefs.leagues[prefs.lastLeagueId].label || prefs.lastLeagueId;
      document.getElementById('savedLeagueSelect').value = prefs.lastLeagueId;
      document.getElementById('formatSel').value = prefs.leagues[prefs.lastLeagueId].format || '9cat_roto';
      state.format = prefs.leagues[prefs.lastLeagueId].format || '9cat_roto';
      applyFormatUI();
      loadFantraxLeague(); // direkt automatisch laden, wenn schon mal genutzt
    }
  }

  // ---------------- actions ----------------
  function draftPlayer(rk, teamOverride){
    const dm = draftedMap();
    if(dm[rk]) return;
    const pickNo = state.picks.length + 1;
    if(pickNo > TOTAL_PICKS) return;
    const team = teamOverride || pickTeamForNumber(pickNo);
    state.picks.push({rk, team});
    renderAll(); scheduleSave();
  }
  function undoPick(){
    if(state.picks.length===0) return;
    state.picks.pop();
    renderAll(); scheduleSave();
  }
  function resetDraft(){
    state.picks = [];
    renderAll(); scheduleSave();
  }

  // ---------------- init ----------------
  function initControls(){
    const myTeamSel = document.getElementById('myTeamSel');
    myTeamSel.innerHTML = Array.from({length:TEAMS},(_,i)=>i+1).map(t=>`<option value="${t}">Team ${t}</option>`).join('');
    myTeamSel.value = state.myTeam;
    myTeamSel.addEventListener('change', () => { state.myTeam = Number(myTeamSel.value); renderAll(); scheduleSave(); });

    // Datenbasis-Umschalter: Consensus-Projections vs. historische Raten.
    // Der Hinweistext nennt konkret, wie viele Spieler tatsaechlich
    // Consensus-Raten haben -- ohne das waere unklar, ob die Umstellung
    // ueberhaupt greift.
    const rateSel = document.getElementById('rateSourceSel');
    const rateNote = document.getElementById('rateSourceNote');
    function updateRateNote() {
      if (!rateNote) return;
      const mode = typeof mfhfbGetRateSource === 'function' ? mfhfbGetRateSource() : 'history';
      if (mode === 'consensus') {
        const n = (typeof PROJECTIONS_CONSENSUS !== 'undefined')
          ? Object.values(PROJECTIONS_CONSENSUS).filter(c => c.min > 0 && c.fga > 0).length : 0;
        rateNote.innerHTML = `Nutzt die gemittelten 2026/27-Projections (${n} Spieler mit ableitbaren Raten). `
          + `Minuten-Regler wirken normal weiter. Die <b>Saison-Gewichtung</b> hat hier keine Wirkung — `
          + `eine Projection hat keine Saison-Historie. Spieler ohne Consensus-Raten fallen automatisch auf die historischen Werte zurück.`;
      } else {
        rateNote.innerHTML = `Nutzt die Pro-Minute-Raten der letzten Saisons, gewichtet über die Saison-Gewichtung. `
          + `Das war das bisherige Verhalten vor dem Consensus-Import.`;
      }
    }
    if (rateSel) {
      rateSel.value = typeof mfhfbGetRateSource === 'function' ? mfhfbGetRateSource() : 'history';
      updateRateNote();
      rateSel.addEventListener('change', () => {
        if (typeof mfhfbSetRateSource === 'function') mfhfbSetRateSource(rateSel.value);
        if (typeof mfhfbInvalidateConsensusRates === 'function') mfhfbInvalidateConsensusRates();
        updateRateNote();
        renderAll();
      });
    }

    const searchInputEl = document.getElementById('searchInput');
    searchInputEl.value = ''; // gegen Browser-eigene Formularwert-Wiederherstellung beim Reload
    searchInputEl.addEventListener('input', e => { state.search = e.target.value; renderPool(); });
    document.getElementById('hideDraftedBtn').addEventListener('click', e => {
      state.hideDrafted = !state.hideDrafted;
      e.target.classList.toggle('active', state.hideDrafted);
      renderPool(); scheduleSave();
    });
    document.getElementById('dStatFilterToggle').addEventListener('click', e => {
      const panel = document.getElementById('dStatFilterPanel');
      const nowVisible = panel.style.display === 'none';
      panel.style.display = nowVisible ? 'block' : 'none';
      e.target.classList.toggle('active', nowVisible);
    });
    document.getElementById('dStatFilterClear').addEventListener('click', () => {
      state.statFilters = [null, null, null];
      renderStatFilterRows(); renderPool(); scheduleSave();
    });
    renderStatFilterRows();
    document.querySelectorAll('#poolTable thead th[data-k]').forEach(th => {
      th.addEventListener('click', () => {
        const k = th.dataset.k;
        if(state.sortKey === k) state.sortDir = state.sortDir==='asc' ? 'desc':'asc';
        else { state.sortKey = k; state.sortDir = (k==='name'||k==='pos'||k==='adp'||k==='fadp') ? 'asc':'desc'; }
        renderPool();
      });
    });
    document.getElementById('undoBtn').addEventListener('click', undoPick);
    document.getElementById('resetBtn').addEventListener('click', () => { if(confirm('Draft wirklich komplett zurücksetzen?')) resetDraft(); });
    document.getElementById('setupHead').addEventListener('click', () => document.getElementById('setupPanel').classList.toggle('collapsed'));
    document.getElementById('leagueHead').addEventListener('click', () => document.getElementById('leaguePanel').classList.toggle('collapsed'));

    document.querySelectorAll('#liveProjDraftPage .dtab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#liveProjDraftPage .dtab').forEach(t=>t.classList.remove('active'));
        document.querySelectorAll('#liveProjDraftPage .dtabpane').forEach(p=>p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('pane-'+tab.dataset.tab).classList.add('active');
      });
    });

    renderFormatOptions();
    document.getElementById('formatSel').addEventListener('change', e => onFormatChange(e.target.value));
    renderPointsWeights();
    renderPuntChips();
    renderPosFilters();
  }

  // Live-Update, wenn auf Projections/Teams (anderer Tab, gleicher Origin) Gewichte/Minuten geändert werden
  window.addEventListener('storage', (e) => {
    const watched = ['mfhfb_proj_minutes_v1','mfhfb_proj_weights_v1','mfhfb_cat_weights_v1','mfhfb_zscore_pool_v1','mfhfb_manual_stats_v1'];
    if(watched.includes(e.key)){
      PLAYERS = buildPlayers();
      reindex();
      reindexNames();
      renderAll();
    }
  });

  loadState();
  initControls();
  renderAll();
  initLiveSyncPanel();
  initLeagueProgressModal();
  initMyPlayersModal();

  // Fuer js/theme.js: Heatmap-/Statusfarben teils als Inline-Styles gerendert,
  // bei Theme-Wechsel neu zeichnen.
  window.reRenderLiveProjDraft = renderAll;
}
