// ============================================================
//  STANDINGS CHART
// ============================================================
let standingsChartInstance=null;
function renderStandingsChart(){
  const ctx=document.getElementById('standingsChart').getContext('2d');
  if(standingsChartInstance) standingsChartInstance.destroy();
  const seasons=['2021/22','2022/23','2023/24','2024/25','2025/26'];
  const standingsData=[
    {team:'Fighting Illini',color:'#6c63ff',lightColor:'#c0622f',avg:1.6,data:[1,3,2,1,1]},
    {team:'Seagulls',color:'#29b6f6',lightColor:'#2a7ab8',avg:5.4,data:[9,8,6,2,2]},
    {team:'Neukoelln Hustlers',color:'#ff6584',lightColor:'#b43c64',avg:6.4,data:[10,11,4,4,3]},
    {team:'Anadolu Ballers',color:'#f5c842',lightColor:'#9a6e10',avg:5.4,data:[8,7,5,3,4]},
    {team:'3-POINT MAFIA',color:'#e040fb',lightColor:'#7b3fa8',avg:8,data:[7,5,12,11,5]},
    {team:'Kawhi So Serious',color:'#ef5350',lightColor:'#a83030',avg:5.8,data:[4,4,3,12,6]},
    {team:'Always Money In The BananaStand',color:'#ff9800',lightColor:'#c06020',avg:7.2,data:[6,10,7,6,7]},
    {team:'Leaveland Cavaliers',color:'#4caf81',lightColor:'#2d7a50',avg:6.8,data:[5,6,8,7,8]},
    {team:'S-Town Grizzlies',color:'#66bb6a',lightColor:'#3d7a30',avg:9,data:[null,9,9,9,9]},
    {team:'Cooking Show',color:'#26c6da',lightColor:'#1a8080',avg:6.6,data:[2,2,11,8,10]},
    {team:'Vancouver Curry-Wurst',color:'#78909c',lightColor:'#607080',avg:4.2,data:[3,1,1,5,11]},
    {team:'Double Dribble Trouble',color:'#ffa726',lightColor:'#b86020',avg:11,data:[null,12,10,10,12]},
  ];
  const isLight=document.body.classList.contains('light');
  const textColor=isLight?'#9a7560':'#7b7f9e';
  const gridColor=isLight?'rgba(240,213,188,0.6)':'rgba(46,50,80,0.6)';
  standingsChartInstance=new Chart(ctx,{
    type:'line',
    data:{labels:seasons,datasets:standingsData.map(d=>({
      label:`${d.team} (Ø ${d.avg})`,data:d.data,
      borderColor:isLight?d.lightColor:d.color,backgroundColor:isLight?d.lightColor:d.color,
      borderWidth:2.5,pointRadius:5,pointHoverRadius:7,tension:0.3,spanGaps:false,
    }))},
    options:{
      responsive:true,
      maintainAspectRatio:false,
      plugins:{
        legend:{position:'bottom',labels:{color:isLight?'#2c1a0e':'#e8eaf6',padding:16,font:{family:'DM Sans',size:11},boxWidth:12,boxHeight:12}},
        tooltip:{
          callbacks:{label:ctx=>{const t=ctx.dataset.label.replace(/ \(Ø [\d.]+\)/,'');return ` ${t}: Place ${ctx.parsed.y}`;}},
          backgroundColor:isLight?'#ffffff':'#1a1d27',borderColor:isLight?'#f0d5bc':'#2e3250',borderWidth:1,
          titleColor:isLight?'#2c1a0e':'#e8eaf6',bodyColor:isLight?'#9a7560':'#7b7f9e',
          bodyFont:{family:'DM Sans'},titleFont:{family:'DM Sans',weight:'700'},
        }
      },
      scales:{
        y:{reverse:true,min:1,max:12,ticks:{stepSize:1,color:textColor,font:{family:'DM Sans',size:11},callback:val=>val===1?'1st':val===2?'2nd':val===3?'3rd':`${val}th`},grid:{color:gridColor},border:{color:gridColor}},
        x:{ticks:{color:textColor,font:{family:'DM Sans',size:12,weight:'600'}},grid:{color:gridColor},border:{color:gridColor}},
      }
    }
  });
}
