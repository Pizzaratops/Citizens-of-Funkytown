// ============================================================
//  TEAMS — Liga 15679 (ab Saison 2026/27)
//  Interne TT-ID | ESPN Team-ID | Name | Owner
//    1 |  2 | Fighting Illini            | Kong Power
//    2 |  3 | Team Chewbuckets           | Tammo M
//    3 |  4 | German Wunderkinder        | Coach Buchholz
//    4 |  5 | Gewürz Jürgchens           | Jürgen Willi
//    5 |  6 | Team Peterson              | Harald Peterson
//    6 |  8 | Cook Island Airballers     | Micha Wenzel
//    7 |  9 | Crackpistel Baller         | Thies Rinner
//    8 | 10 | Isaac's Falling Fruits     | White Schröder
//    9 | 11 | Greifswald SG Gerstensaft  | Sven Kosanke
//   10 | 13 | Wedding Bobcats            | Fabian D
//   11 | 14 | Juicetown Farmers          | DA FZ
//   12 | 15 | Lokomotive List            | Steffen Wieting
// ============================================================
const TEAMS = [
  { id:1,  name:"Fighting Illini",           owner:"Kong Power",        record:"0-0-0", color:"#6c63ff", lightColor:"#4a3fd6" },
  { id:2,  name:"Team Chewbuckets",          owner:"Tammo M",           record:"0-0-0", color:"#29b6f6", lightColor:"#2a7ab8" },
  { id:3,  name:"German Wunderkinder",       owner:"Coach Buchholz",    record:"0-0-0", color:"#4caf81", lightColor:"#2d7a50" },
  { id:4,  name:"Gewürz Jürgchens",          owner:"Jürgen Willi",      record:"0-0-0", color:"#f5c842", lightColor:"#9a6e10" },
  { id:5,  name:"Team Peterson",             owner:"Harald Peterson",   record:"0-0-0", color:"#ef5350", lightColor:"#a83030" },
  { id:6,  name:"Cook Island Airballers",    owner:"Micha Wenzel",      record:"0-0-0", color:"#26c6da", lightColor:"#1a8080" },
  { id:7,  name:"Crackpistel Baller",        owner:"Thies Rinner",      record:"0-0-0", color:"#ff9800", lightColor:"#c06020" },
  { id:8,  name:"Isaac's Falling Fruits",    owner:"White Schröder",    record:"0-0-0", color:"#e040fb", lightColor:"#7b3fa8" },
  { id:9,  name:"Greifswald SG Gerstensaft", owner:"Sven Kosanke",      record:"0-0-0", color:"#66bb6a", lightColor:"#3d7a30" },
  { id:10, name:"Wedding Bobcats",           owner:"Fabian D",          record:"0-0-0", color:"#ff6584", lightColor:"#b43c64" },
  { id:11, name:"Juicetown Farmers",         owner:"DA FZ",             record:"0-0-0", color:"#ffa726", lightColor:"#b86020" },
  { id:12, name:"Lokomotive List",           owner:"Steffen Wieting",   record:"0-0-0", color:"#78909c", lightColor:"#607080" },
];
function getTeamColor(t) { return document.body.classList.contains('light') ? t.lightColor : t.color; }

// ============================================================
//  ROSTERS
// ============================================================
// Platzhalter — wird beim ersten Lauf von scripts/sync-espn-rosters.js
// (bzw. dem "ESPN Sync jetzt"-Button im Admin-Bereich) automatisch mit
// den echten Rosters der Liga 15679 befüllt (siehe data/rosters-live.js
// und js/admin.js -> _hydrateRostersFromLiveFile()). Bis dahin sind
// die Team-Kader in der App leer.
const ROSTERS = {
};

// ============================================================
//  PICKS
