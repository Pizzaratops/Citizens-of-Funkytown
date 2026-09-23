// ============================================================
//  LIGA-BEITRÄGE — wer hat für welche Saison bezahlt
// ============================================================
//  Daten: data/league-dues.js (von Hand gepflegt, nur Zahlungen).
//  Aufbau wie der Beitrags-Tracker von Bear Witch Project HQ, ohne
//  die dortige Pick-Logik (Redraft: jeder zahlt jede Saison).
//  Styling: css/league.css (.dues-*)
// ============================================================

function showDues() {
  navigate('duesPage');
  renderDues();
}

function _duesBadge(status, entry) {
  if (status === 'paid') {
    const tip = entry && entry.date
      ? ` title="Bezahlt am ${new Date(entry.date).toLocaleDateString('de-DE')}"` : '';
    return `<span class="dues-badge dues-paid"${tip}>✅ Bezahlt</span>`;
  }
  if (status === 'owes') return '<span class="dues-badge dues-owes">⚠️ Muss zahlen</span>';
  return '<span class="dues-badge dues-open">offen</span>';
}

function renderDues() {
  const wrap = document.getElementById('duesContent');
  if (!wrap) return;
  if (typeof LEAGUE_DUES_PAID === 'undefined' || typeof DUES_SEASONS === 'undefined') {
    wrap.innerHTML = `<div class="lg-empty">data/league-dues.js fehlt. Dort Zahlungen als { teamId, season } eintragen, die Tabelle befüllt sich dann selbst.</div>`;
    return;
  }

  const cur = CURRENT_DUES_SEASON;
  const paidCount = TEAMS.filter(t => leagueDuesStatus(t.id, cur) === 'paid').length;
  const total = TEAMS.length;
  const pct = total ? Math.round(paidCount / total * 100) : 0;
  const money = (typeof DUES_AMOUNT === 'number' && DUES_AMOUNT > 0)
    ? `<div class="dues-money">${(paidCount * DUES_AMOUNT).toLocaleString('de-DE')} € von ${(total * DUES_AMOUNT).toLocaleString('de-DE')} € eingesammelt</div>`
    : '';

  // Offene Teams der laufenden Saison zuerst, damit sofort sichtbar ist,
  // wer noch fehlt. Innerhalb der Gruppen alphabetisch.
  const teams = [...TEAMS].sort((a, b) => {
    const pa = leagueDuesStatus(a.id, cur) === 'paid' ? 1 : 0;
    const pb = leagueDuesStatus(b.id, cur) === 'paid' ? 1 : 0;
    return pa - pb || a.name.localeCompare(b.name, 'de');
  });

  wrap.innerHTML = `
    <div class="dues-summary">
      <div>
        <div class="dues-summary-label">Saison ${cur}</div>
        <div class="dues-summary-value">${paidCount} <span>von ${total} bezahlt</span></div>
        ${money}
      </div>
      <div class="dues-progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
        <div class="dues-progress-fill" style="width:${pct}%"></div>
      </div>
    </div>
    <div class="lg-table-wrap">
      <table class="lg-table">
        <thead><tr>
          <th style="text-align:left;">Team</th>
          ${DUES_SEASONS.map(s => `<th>${s}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${teams.map(t => {
            const c = getTeamColor(t);
            return `<tr>
              <td style="text-align:left;">
                <div class="lg-team">
                  <span class="lg-dot" style="background:${c};"></span>
                  <div>
                    <div class="lg-team-name">${t.name}</div>
                    <div class="lg-team-owner">${t.owner}</div>
                  </div>
                </div>
              </td>
              ${DUES_SEASONS.map(s => `<td>${_duesBadge(leagueDuesStatus(t.id, s), leagueDuesPaidEntry(t.id, s))}</td>`).join('')}
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <p class="lg-foot">Zahlungen werden von Hand in <code>data/league-dues.js</code> eingetragen.</p>
  `;
}
