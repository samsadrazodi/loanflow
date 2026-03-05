/**
 * LoanFlow v2.0 — Reports Component
 */

import { reportChartData } from '../utils/data.js';
import { showToast } from '../utils/toast.js';

let rendered = false;

export function renderReports() {
  if (rendered) return;

  const chartEl = document.getElementById('barChart');
  const labelsEl = document.getElementById('barLabels');
  const breakdownEl = document.getElementById('loanTypeBreakdown');
  if (!chartEl || !labelsEl || !breakdownEl) return;

  const { months, values, loanTypes } = reportChartData;
  const maxVal = Math.max(...values);

  // Bar chart
  chartEl.innerHTML = values.map((v, i) => {
    const pct = (v / maxVal) * 100;
    const isLast = i === values.length - 1;
    return `<div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;">
      <span style="font-size: 0.68rem; color: var(--text-tertiary); font-family: 'JetBrains Mono', monospace;">$${v}M</span>
      <div style="width: 100%; height: ${pct}%; min-height: 8px; background: ${isLast ? 'var(--accent-blue)' : 'var(--accent-blue-light)'}; border-radius: 4px 4px 0 0; transition: height 0.6s ease ${i * 50}ms;"></div>
    </div>`;
  }).join('');

  labelsEl.innerHTML = months.map(m =>
    `<div style="flex: 1; text-align: center; font-size: 0.68rem; color: var(--text-tertiary);">${m}</div>`
  ).join('');

  // Loan type breakdown
  breakdownEl.innerHTML = `
    <div style="display: flex; height: 28px; border-radius: 6px; overflow: hidden; margin-bottom: 16px;">
      ${loanTypes.map(t => `<div style="width: ${t.pct}%; background: ${t.color}; transition: width 0.5s ease;" title="${t.name}: ${t.pct}%"></div>`).join('')}
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 16px;">
      ${loanTypes.map(t => `
        <div class="flex-center" style="gap: 8px;">
          <div style="width: 10px; height: 10px; border-radius: 3px; background: ${t.color};"></div>
          <span style="font-size: 0.8rem; font-weight: 500;">${t.name}</span>
          <span style="font-size: 0.75rem; color: var(--text-tertiary);">${t.pct}%</span>
        </div>
      `).join('')}
    </div>
  `;

  rendered = true;
}

export function initReports() {
  const exportPdfBtn = document.getElementById('reportExportPdfBtn');
  if (exportPdfBtn) exportPdfBtn.addEventListener('click', () => showToast('PDF export coming soon', 'info'));
}
