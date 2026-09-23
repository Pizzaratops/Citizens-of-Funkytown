// ============================================================
//  TOAST (kurze Statusmeldung unten am Bildschirmrand)
// ============================================================
//  Kurze Statusmeldung, z.B. aus js/init.js (PWA-Hinweis).
let _toastTimer = null;
function toast(msg) {
  let el = document.getElementById('ttToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ttToast';
    el.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(20px);' +
      'background:var(--surface,#1a1d27);color:var(--text,#e8eaf6);border:1px solid var(--border,#2e3250);' +
      'padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;font-family:DM Sans,sans-serif;' +
      'box-shadow:0 8px 24px rgba(0,0,0,.25);z-index:9999;opacity:0;transition:opacity .2s,transform .2s;' +
      'pointer-events:none;max-width:90vw;text-align:center;';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  clearTimeout(_toastTimer);
  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateX(-50%) translateY(0)';
  });
  _toastTimer = setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2600);
}

// ============================================================
//  THEME
// ============================================================
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById('themeToggle');
  if (body.classList.contains('light')) {
    body.classList.remove('light'); btn.textContent = '☀️ Light'; localStorage.setItem('theme','dark');
  } else {
    body.classList.add('light'); btn.textContent = '🌙 Dark'; localStorage.setItem('theme','light');
  }
  // Alle 3 Projections-Toolkit-Seiten sind seit 2026-08-01 native TTHQ-
  // Seiten — kein Iframe-/postMessage-Theme-Sync mehr noetig, die CSS-
  // Variablen greifen automatisch. Nur die als Inline-Styles gerenderten
  // Heatmap-/Statusfarben brauchen ein explizites Re-Render (unten).
  // Re-render standings chart if visible so legend/axis colors update
  const standingsPage = document.getElementById('standingsPage');
  if (standingsPage && standingsPage.classList.contains('active')) {
    setTimeout(renderStandingsChart, 50);
  }
  // Tabellenverlauf und Beitraege ebenfalls neu zeichnen (Teamfarben)
  const rsPage = document.getElementById('rollingStandingsPage');
  if (rsPage && rsPage.classList.contains('active') && typeof renderRollingStandings === 'function') {
    setTimeout(renderRollingStandings, 50);
  }
  const duesPage = document.getElementById('duesPage');
  if (duesPage && duesPage.classList.contains('active') && typeof renderDues === 'function') {
    setTimeout(renderDues, 50);
  }
  // Re-render home team grid so team colors update
  const homePage = document.getElementById('homePage');
  if (homePage && homePage.classList.contains('active')) {
    setTimeout(renderHome, 50);
  }
}
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
  document.getElementById('themeToggle').textContent = '🌙 Dark';
}
