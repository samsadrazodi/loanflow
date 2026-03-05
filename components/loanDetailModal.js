/**
 * LoanFlow v2.0 — Loan Detail Modal Component
 */

import { loanData, timelineData } from '../utils/data.js';
import { capitalize, formatDate } from '../utils/helpers.js';
import { showToast } from '../utils/toast.js';

export function openModal(loanId) {
  const loan = loanData.find(l => l.id === loanId);
  if (!loan) return;

  document.getElementById('modalTitle').textContent = loan.id;
  document.getElementById('modalSubtitle').textContent = `Created on ${formatDate(loan.date)} · ${loan.type} Loan`;
  document.getElementById('mdBorrower').textContent = loan.borrower;
  document.getElementById('mdAmount').textContent = `$${loan.amount.toLocaleString()}`;
  document.getElementById('mdType').textContent = loan.type;
  document.getElementById('mdRate').textContent = loan.rate;
  document.getElementById('mdTerm').textContent = loan.term;
  document.getElementById('mdLtv').textContent = loan.ltv;
  document.getElementById('mdAddress').textContent = loan.address;
  document.getElementById('mdPropertyValue').textContent = loan.propertyValue;
  document.getElementById('mdPropertyType').textContent = loan.propertyType;
  document.getElementById('mdAppraisal').textContent = loan.appraisal;
  document.getElementById('mdProgress').textContent = `${loan.progress}% complete`;
  document.getElementById('mdProgressBar').style.width = `${loan.progress}%`;

  // Status badge
  document.getElementById('mdStatus').innerHTML = `<span class="status-badge ${loan.status}">${capitalize(loan.status)}</span>`;

  // Progress bar color
  const bar = document.getElementById('mdProgressBar');
  bar.className = 'progress-bar-fill';
  if (loan.progress >= 80) bar.classList.add('green');
  else if (loan.progress >= 40) bar.classList.add('blue');
  else bar.classList.add('amber');

  // Timeline
  document.getElementById('mdTimeline').innerHTML = timelineData.map(t => `
    <div class="timeline-item">
      <div class="timeline-item-date">${t.date}</div>
      <div class="timeline-item-text">${t.text}</div>
      <div class="timeline-item-user">by ${t.user}</div>
    </div>
  `).join('');

  document.getElementById('loanModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

export function closeModal() {
  document.getElementById('loanModal').style.display = 'none';
  document.body.style.overflow = '';
}

export function initModal() {
  // Close button
  const closeBtn = document.getElementById('modalCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close on overlay click
  const overlay = document.getElementById('loanModal');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  // Footer buttons
  const rejectBtn = document.getElementById('modalRejectBtn');
  if (rejectBtn) rejectBtn.addEventListener('click', () => showToast('Rejection workflow coming soon', 'info'));

  const closeBtnFooter = document.getElementById('modalCloseBtnFooter');
  if (closeBtnFooter) closeBtnFooter.addEventListener('click', closeModal);

  const approveBtn = document.getElementById('modalApproveBtn');
  if (approveBtn) approveBtn.addEventListener('click', () => showToast('LOP approved successfully!', 'success'));

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}
