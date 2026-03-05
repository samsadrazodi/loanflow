/**
 * LoanFlow v2.0 — Dashboard Component
 */

import { loanData } from '../utils/data.js';
import { capitalize, formatDate } from '../utils/helpers.js';
import { showToast } from '../utils/toast.js';
import { openModal } from './loanDetailModal.js';

let currentFilter = 'all';
let currentSort = { field: 'date', dir: 'desc' };

// ── Render Table ──
function renderTable() {
  const tbody = document.getElementById('loansTableBody');
  if (!tbody) return;

  let filtered = [...loanData];

  // Filter
  if (currentFilter !== 'all') {
    filtered = filtered.filter(l => l.status === currentFilter);
  }

  // Search
  const searchEl = document.getElementById('searchInput');
  const query = searchEl ? searchEl.value.toLowerCase() : '';
  if (query) {
    filtered = filtered.filter(l =>
      l.id.toLowerCase().includes(query) ||
      l.borrower.toLowerCase().includes(query) ||
      l.amount.toString().includes(query)
    );
  }

  const countEl = document.getElementById('tableCount');
  if (countEl) countEl.textContent = `Showing ${filtered.length} of ${loanData.length}`;

  tbody.innerHTML = filtered.map(loan => `
    <tr data-loan-id="${loan.id}">
      <td><span class="text-mono" style="font-size: 0.78rem; color: var(--accent-blue); font-weight: 500;">${loan.id}</span></td>
      <td style="font-weight: 500;">${loan.borrower}</td>
      <td class="text-mono" style="font-weight: 600;">$${loan.amount.toLocaleString()}</td>
      <td>${loan.type}</td>
      <td><span class="status-badge ${loan.status}">${capitalize(loan.status)}</span></td>
      <td>
        <span class="priority">
          <span class="priority-dot ${loan.priority}"></span>
          ${capitalize(loan.priority)}
        </span>
      </td>
      <td style="color: var(--text-secondary); font-size: 0.8rem;">${formatDate(loan.date)}</td>
      <td>
        <div class="avatar" style="background: ${loan.assignedColor}; width: 26px; height: 26px; font-size: 0.65rem;">${loan.assigned}</div>
      </td>
      <td>
        <button class="btn btn-ghost btn-sm row-action-btn" style="padding: 4px;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
      </td>
    </tr>
  `).join('');

  // Attach row click listeners
  tbody.querySelectorAll('tr[data-loan-id]').forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('.row-action-btn')) {
        e.stopPropagation();
        showToast('Actions menu coming soon', 'info');
        return;
      }
      openModal(row.dataset.loanId);
    });
  });
}

// ── Filters ──
function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('#page-dashboard .filter-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.filter === filter);
  });
  renderTable();
}

// ── Sorting ──
function sortTable(field) {
  if (currentSort.field === field) {
    currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort = { field, dir: 'asc' };
  }

  loanData.sort((a, b) => {
    let aVal = a[field], bVal = b[field];
    if (field === 'amount') { aVal = Number(aVal); bVal = Number(bVal); }
    if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
    if (aVal < bVal) return currentSort.dir === 'asc' ? -1 : 1;
    if (aVal > bVal) return currentSort.dir === 'asc' ? 1 : -1;
    return 0;
  });

  // Update header visuals
  document.querySelectorAll('#page-dashboard th.sortable').forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
  });
  const headerMap = { id: 0, borrower: 1, amount: 2, type: 3, status: 4, priority: 5, date: 6 };
  const idx = headerMap[field];
  if (idx !== undefined) {
    const ths = document.querySelectorAll('#page-dashboard th.sortable');
    if (ths[idx]) ths[idx].classList.add(currentSort.dir === 'asc' ? 'sort-asc' : 'sort-desc');
  }

  renderTable();
}

// ── CSV Export ──
function exportCSV() {
  const headers = ['LOP ID', 'Borrower', 'Amount', 'Type', 'Status', 'Priority', 'Date'];
  const rows = loanData.map(l => [l.id, l.borrower, l.amount, l.type, l.status, l.priority, l.date]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'loanflow-export.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exported successfully', 'success');
}

// ── Initialize Dashboard ──
export function renderDashboard() {
  renderTable();
}

export function initDashboard() {
  // Search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.addEventListener('input', renderTable);

  // Filter chips
  document.querySelectorAll('#page-dashboard .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => setFilter(chip.dataset.filter));
  });

  // Sortable headers
  document.querySelectorAll('#page-dashboard th.sortable').forEach(th => {
    const fields = ['id', 'borrower', 'amount', 'type', 'status', 'priority', 'date'];
    const idx = Array.from(th.parentElement.children).indexOf(th);
    if (fields[idx]) {
      th.addEventListener('click', () => sortTable(fields[idx]));
    }
  });

  // Export button
  const exportBtn = document.getElementById('exportCsvBtn');
  if (exportBtn) exportBtn.addEventListener('click', exportCSV);

  // New LOP button
  const newLopBtn = document.getElementById('newLopBtn');
  if (newLopBtn) newLopBtn.addEventListener('click', () => showToast('New LOP form coming soon', 'info'));

  renderTable();
}
