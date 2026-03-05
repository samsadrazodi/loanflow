/**
 * LoanFlow v2.0 — Applications Component
 */

import { applicationsData } from '../utils/data.js';
import { capitalize, formatDate } from '../utils/helpers.js';
import { showToast } from '../utils/toast.js';

let currentAppFilter = 'all';

const stageStyles = {
  new: 'review',
  processing: 'pending',
  completed: 'approved',
};

export function renderApplications() {
  const tbody = document.getElementById('appTableBody');
  if (!tbody) return;

  let filtered = [...applicationsData];

  if (currentAppFilter !== 'all') {
    filtered = filtered.filter(a => a.stage === currentAppFilter);
  }

  const searchEl = document.getElementById('appSearchInput');
  const query = searchEl ? searchEl.value.toLowerCase() : '';
  if (query) {
    filtered = filtered.filter(a =>
      a.id.toLowerCase().includes(query) ||
      a.applicant.toLowerCase().includes(query)
    );
  }

  const countEl = document.getElementById('appTableCount');
  if (countEl) countEl.textContent = `Showing ${filtered.length} applications`;

  tbody.innerHTML = filtered.map(app => `
    <tr>
      <td><span class="text-mono" style="font-size: 0.78rem; color: var(--accent-blue); font-weight: 500;">${app.id}</span></td>
      <td style="font-weight: 500;">${app.applicant}</td>
      <td class="text-mono" style="font-weight: 600;">$${app.amount.toLocaleString()}</td>
      <td>${app.type}</td>
      <td><span class="status-badge ${stageStyles[app.stage]}">${capitalize(app.stage)}</span></td>
      <td style="color: var(--text-secondary); font-size: 0.8rem;">${formatDate(app.submitted)}</td>
      <td>
        <span class="flex-center" style="font-size: 0.8rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          ${app.docs} / 10
        </span>
      </td>
      <td>
        <button class="btn btn-ghost btn-sm app-row-action" style="padding: 4px;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
      </td>
    </tr>
  `).join('');

  // Row click listeners
  tbody.querySelectorAll('tr').forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('.app-row-action')) {
        e.stopPropagation();
        showToast('Actions menu coming soon', 'info');
        return;
      }
      showToast('Application detail view coming soon', 'info');
    });
  });
}

function setAppFilter(filter) {
  currentAppFilter = filter;
  document.querySelectorAll('[data-appfilter]').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.appfilter === filter);
  });
  renderApplications();
}

export function initApplications() {
  // Search
  const searchInput = document.getElementById('appSearchInput');
  if (searchInput) searchInput.addEventListener('input', renderApplications);

  // Filter chips
  document.querySelectorAll('[data-appfilter]').forEach(chip => {
    chip.addEventListener('click', () => setAppFilter(chip.dataset.appfilter));
  });

  // New Application button
  const newAppBtn = document.getElementById('newAppBtn');
  if (newAppBtn) newAppBtn.addEventListener('click', () => showToast('New application form coming soon', 'info'));
}
