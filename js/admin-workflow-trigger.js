// ============================================================
//  ADMIN: MANUELLER LIVE-SCORES-TRIGGER (GitHub Actions)
// ============================================================
//  Löst den "Daily 9cat Live Scores"-Workflow manuell per GitHub API
//  aus (workflow_dispatch), statt auf den nächsten Cron-Slot zu warten.
//
//  SICHERHEITSHINWEIS (wichtig, bitte lesen):
//  Diese Seite ist rein statisch (GitHub Pages, kein Backend). Der Token
//  unten liegt im Klartext im JS-Bundle und ist für jeden im Browser
//  sichtbar, der die Seite öffnet — der Admin-PIN schützt nur die UI,
//  nicht den Token selbst.
//
//  Deshalb: NUR einen "fine-grained" Personal Access Token verwenden,
//  der ausschließlich für DIESES eine Repo gilt und NUR die Berechtigung
//  "Actions: Read and write" hat — sonst nichts (kein Contents-Zugriff,
//  keine anderen Repos). Im schlimmsten Fall kann jemand damit nur
//  zusätzliche Workflow-Läufe auslösen — unschädlich, da alle Skripte
//  pro Datum überschreiben statt anzuhängen (siehe convert-to-livescores.js
//  & Co.), und der Commit-Step nur bei echten Änderungen committet.
//
//  Token erstellen:
//  1. github.com/settings/personal-access-tokens/new
//  2. "Repository access" → "Only select repositories" → Taco-Tuesday-HQ
//  3. "Repository permissions" → "Actions" → "Read and write"
//     (alle anderen Permissions auf "No access" lassen)
//  4. Expiration: z.B. 90 Tage oder 1 Jahr — nach Ablauf einfach neuen
//     Token erstellen und die Zeile unten ersetzen
//  5. Token generieren, kopieren, unten einfügen
// ============================================================

const GH_WORKFLOW_OWNER  = 'Pizzaratops';
const GH_WORKFLOW_REPO   = 'Taco-Tuesday-HQ';
const GH_WORKFLOW_FILE   = 'daily-9cat.yml';
const GH_WORKFLOW_BRANCH = 'main';

// ⚠️ Fine-grained PAT hier einfügen (nur "Actions: Read and write" auf
// dieses eine Repo, sonst keine Rechte):
const GH_WORKFLOW_TOKEN = 'PASTE_FINE_GRAINED_PAT_HERE';

async function triggerLiveScoresWorkflow() {
  if (!isAdmin) { toast('⛔ Nur für Admins'); return; }

  if (!GH_WORKFLOW_TOKEN || GH_WORKFLOW_TOKEN === 'PASTE_FINE_GRAINED_PAT_HERE') {
    toast('⚠️ Kein GitHub-Token hinterlegt (siehe js/admin-workflow-trigger.js)');
    return;
  }

  const btn = document.getElementById('liveScoresTriggerBtn');
  const statusEl = document.getElementById('as-sync-status');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Löse aus…'; }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GH_WORKFLOW_OWNER}/${GH_WORKFLOW_REPO}/actions/workflows/${GH_WORKFLOW_FILE}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GH_WORKFLOW_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ref: GH_WORKFLOW_BRANCH }),
      }
    );

    if (res.status === 204) {
      toast('🚀 Live-Scores-Workflow ausgelöst!');
      if (statusEl) {
        statusEl.innerHTML = `Workflow ausgelöst um ${new Date().toLocaleTimeString('de-DE')}. ` +
          `<a href="https://github.com/${GH_WORKFLOW_OWNER}/${GH_WORKFLOW_REPO}/actions/workflows/${GH_WORKFLOW_FILE}" target="_blank" rel="noopener">Status auf GitHub ansehen →</a>`;
      }
    } else if (res.status === 401 || res.status === 403) {
      toast('⛔ Token ungültig oder ohne Berechtigung');
      console.error('Workflow-Trigger fehlgeschlagen:', res.status, await res.text());
    } else if (res.status === 404) {
      toast('⛔ Workflow nicht gefunden (Dateiname/Branch prüfen)');
      console.error('Workflow-Trigger fehlgeschlagen:', res.status, await res.text());
    } else {
      toast('⚠️ Fehler beim Auslösen (siehe Konsole)');
      console.error('Workflow-Trigger fehlgeschlagen:', res.status, await res.text());
    }
  } catch (err) {
    toast('⚠️ Netzwerkfehler beim Auslösen');
    console.error('Workflow-Trigger Netzwerkfehler:', err);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '🚀 Live Scores jetzt aktualisieren'; }
  }
}
