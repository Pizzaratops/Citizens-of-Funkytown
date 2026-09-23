// ============================================================
//  DRAFT COUNTDOWN — Hero-Karte oben auf der Home-Seite
// ============================================================
//  Zaehlt bis zum Liga-Draft herunter. Drei Zustaende:
//   1) vor dem Draft:  Tage / Stunden / Minuten / Sekunden
//   2) Draft laeuft:   ab Startzeit fuer DRAFT_LIVE_WINDOW_MIN Minuten
//                      "Draft läuft" mit Link in die ESPN-Liga
//   3) danach:         Karte verschwindet komplett
//
//  Neuer Draft = nur DRAFT_START anpassen. Die Zeit steht bewusst mit
//  festem Offset (+02:00 = Sommerzeit Berlin) statt als lokale Zeit,
//  damit der Countdown auf jedem Geraet, egal in welcher Zeitzone,
//  auf denselben Moment zaehlt.
//
//  Markup: #draftCountdown in index.html (Home), Styling: css/countdown.css
// ============================================================

const DRAFT_START = new Date('2026-10-11T20:30:00+02:00');
const DRAFT_LIVE_WINDOW_MIN = 180;
const DRAFT_ESPN_URL = 'https://fantasy.espn.com/basketball/league?leagueId=15679';

let _dcTimer = null;

function _dcPad(n) { return String(n).padStart(2, '0'); }

function _dcRender() {
  const host = document.getElementById('draftCountdown');
  if (!host) return;
  const now = Date.now();
  const start = DRAFT_START.getTime();
  const end = start + DRAFT_LIVE_WINDOW_MIN * 60 * 1000;

  if (now >= end) {
    host.hidden = true;
    if (_dcTimer) { clearInterval(_dcTimer); _dcTimer = null; }
    return;
  }
  host.hidden = false;

  if (now >= start) {
    if (host.dataset.state !== 'live') {
      host.dataset.state = 'live';
      host.querySelector('.dc-clock').innerHTML = `
        <div class="dc-live">
          <span class="dc-live-dot" aria-hidden="true"></span>
          <span class="dc-live-text">Draft läuft</span>
        </div>
        <a class="dc-live-link" href="${DRAFT_ESPN_URL}" target="_blank" rel="noopener">Zur Liga auf ESPN ↗</a>`;
    }
    return;
  }

  host.dataset.state = 'countdown';
  let s = Math.floor((start - now) / 1000);
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600);  s -= h * 3600;
  const m = Math.floor(s / 60);    s -= m * 60;
  const set = (unit, val) => {
    const el = host.querySelector(`[data-unit="${unit}"]`);
    if (el && el.textContent !== val) el.textContent = val;
  };
  set('d', String(d));
  set('h', _dcPad(h));
  set('m', _dcPad(m));
  set('s', _dcPad(s));
  const lbl = host.querySelector('[data-label="d"]');
  if (lbl) lbl.textContent = d === 1 ? 'Tag' : 'Tage';
}

function initDraftCountdown() {
  const host = document.getElementById('draftCountdown');
  if (!host) return;
  const dateEl = host.querySelector('.dc-date');
  if (dateEl) {
    const datum = DRAFT_START.toLocaleDateString('de-DE', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Berlin',
    });
    const zeit = DRAFT_START.toLocaleTimeString('de-DE', {
      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin',
    });
    dateEl.textContent = `${datum} · ${zeit} Uhr`;
  }
  _dcRender();
  if (!host.hidden && !_dcTimer) _dcTimer = setInterval(_dcRender, 1000);
}
