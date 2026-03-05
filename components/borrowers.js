/**
 * LoanFlow v2.0 — Borrowers Component
 */

import { borrowersData } from '../utils/data.js';
import { capitalize, formatDate } from '../utils/helpers.js';
import { showToast } from '../utils/toast.js';

export function renderBorrowers() {
  const tbody = document.getElementById('borrowerTableBody');
  if (!tbody) return;

  let filtered = [...borrowersData];

  const searchEl = document.getElementById('borrowerSearchInput');
  const query = searchEl ? searchEl.value.toLowerCase() : '';
  if (query) {
    filtered = filtered.filter(b =>
      b.name.toLowerCase().includes(query) ||
      b.email.toLowerCase().includes(query)
    );
  }

  const countEl = document.getElementById('borrowerTableCount');
  if (countEl) countEl.textContent = `Showing ${filtered.length} borrowers`;

  const riskBadge = { low: 'approved', medium: 'pending', high: 'rejected' };

  tbody.innerHTML = filtered.map(b => `
    <tr style="cursor: pointer;">
      <td>
        <div class="flex-center">
          <div class="avatar" style="background: hsl(${b.name.length * 37 % 360}, 55%, 55%); width: 28px; height: 28px; font-size: 0.65rem;">${b.name.split(' ').map(n => n[0]).join('')}</div>
          <span style="font-weight: 500;">${b.name}</span>
        </div>
      </td>
      <td style="color: var(--text-secondary); font-size: 0.8rem;">${b.email}</td>
      <td style="font-weight: 600;">${b.loans}</td>
      <td class="text-mono" style="font-weight: 600;">$${b.totalBorrowed.toLocaleString()}</td>
      <td>
        <span class="text-mono" style="font-weight: 600; color: ${b.creditScore >= 720 ? 'var(--accent-green)' : b.creditScore >= 680 ? 'var(--accent-amber)' : 'var(--accent-red)'};">${b.creditScore}</span>
      </td>
      <td style="color: var(--text-secondary); font-size: 0.8rem;">${formatDate(b.since)}</td>
      <td><span class="status-badge ${riskBadge[b.risk]}">${capitalize(b.risk)}</span></td>
    </tr>
  `).join('');

  // Row click listeners
  tbody.querySelectorAll('tr').forEach(row => {
    row.addEventListener('click', () => showToast('Borrower profile coming soon', 'info'));
  });
}

export function initBorrowers() {
  const searchInput = document.getElementById('borrowerSearchInput');
  if (searchInput) searchInput.addEventListener('input', renderBorrowers);

  const exportBtn = document.getElementById('borrowerExportBtn');
  if (exportBtn) exportBtn.addEventListener('click', () => showToast('Borrower export coming soon', 'info'));
}
