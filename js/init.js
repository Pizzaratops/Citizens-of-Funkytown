// On load: read hash and navigate to correct page
(function() {
  const initHash = window.location.hash;
  const initPageId = _pageIdFromHash(initHash);
  // Replace current history entry with proper state
  try { history.replaceState({ pageId: initPageId }, '', initHash || '#home'); } catch(e) {}
  renderHome(); // always render home data in background
  // Flow-Diagramm gehoert zur Home-Seite und wird deshalb hier gleich
  // mitgerendert, unabhaengig davon, welche Seite gerade offen ist.
  if (typeof initFlowDiagram === 'function') initFlowDiagram();
  if (initPageId !== 'homePage' && initHash) {
    _applyPage(initPageId);
    // Einziger Ort fuer "welche Seite braucht welche Init-Funktion" ist
    // _rerenderPage() in js/navigation.js -- hier NICHT nochmal eine eigene
    // Kopie der Liste pflegen. Frueher gab's hier eine zweite, eigene Liste,
    // die bei neuen Seiten (z.B. den 3 nativen Projections-Seiten) nicht
    // mitgepflegt wurde: beim direkten Neuladen (F5) auf einer Player-
    // Unterseite wurde die Seite zwar sichtbar (_applyPage), aber nie mit
    // Daten befuellt (das passiert erst in _rerenderPage) -- daher leer,
    // bis man einmal ueber die Navigation geklickt hat.
    _rerenderPage(initPageId);
  }
})();
initEspnSyncBtn();
espnSync(true);

// ============================================================
//  PWA-INSTALL-BUTTON (Android/Chrome/Edge)
// ============================================================
//  iOS Safari feuert dieses Event NIE -- dort gibt es grundsaetzlich
//  keinen programmatischen Install-Trigger, nur den manuellen Weg ueber
//  "Teilen > Zum Home-Bildschirm" (siehe apple-mobile-web-app-* Tags im
//  <head> fuer ein sauberes Ergebnis dabei). Auf Android/Chrome/Edge
//  wird der Button eingeblendet, sobald der Browser die Seite als
//  installierbar erkennt (gueltiges Manifest + registrierter Service
//  Worker + HTTPS -- alles seit diesem Update erfuellt).
let _pwaDeferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  _pwaDeferredPrompt = e;
  const btn = document.getElementById('pwaInstallBtn');
  if (btn) btn.style.display = '';
});
function pwaInstallApp() {
  if (!_pwaDeferredPrompt) return;
  _pwaDeferredPrompt.prompt();
  _pwaDeferredPrompt.userChoice.finally(() => {
    _pwaDeferredPrompt = null;
    const btn = document.getElementById('pwaInstallBtn');
    if (btn) btn.style.display = 'none';
  });
}
// Bereits installiert (oder Browser ohne beforeinstallprompt-Unterstuetzung,
// z.B. iOS/Firefox) -- Button bleibt dauerhaft versteckt, kein Fehlerfall.
window.addEventListener('appinstalled', () => {
  _pwaDeferredPrompt = null;
  const btn = document.getElementById('pwaInstallBtn');
  if (btn) btn.style.display = 'none';
});

// iOS: kein beforeinstallprompt moeglich -- eigener Button mit Anleitung.
// Nur zeigen wenn (a) iOS Safari/Chrome-auf-iOS (technisch immer Safari-
// Engine, Apple erzwingt das) UND (b) noch nicht bereits als installierte
// App gestartet (dann macht "installieren" keinen Sinn mehr).
(function () {
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPadOS meldet sich als Mac
  const isStandalone = window.navigator.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches;
  if (isIos && !isStandalone) {
    const btn = document.getElementById('pwaIosHintBtn');
    if (btn) btn.style.display = '';
  }
})();
function pwaShowIosSteps() {
  toast('📲 Teilen-Symbol tippen → "Zum Home-Bildschirm"');
}

// ============================================================
