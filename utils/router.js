/**
 * LoanFlow v2.0 — Client-Side Router
 */

import { renderDashboard } from '../components/dashboard.js';
import { renderApplications } from '../components/applications.js';
import { renderBorrowers } from '../components/borrowers.js';
import { renderReports } from '../components/reports.js';

const pageRenderers = {
  dashboard: renderDashboard,
  applications: renderApplications,
  borrowers: renderBorrowers,
  reports: renderReports,
  settings: null, // Settings is static HTML, no JS render needed
};

export function navigateTo(page, event) {
  if (event) event.preventDefault();

  // Hide all pages
  document.querySelectorAll('.page-section').forEach(el => (el.style.display = 'none'));

  // Show target page
  const target = document.getElementById('page-' + page);
  if (target) target.style.display = 'flex';

  // Update nav active state
  document.querySelectorAll('#mainNav .header-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  // Render page content
  const renderer = pageRenderers[page];
  if (renderer) renderer();

  // Update URL hash
  window.location.hash = page === 'dashboard' ? '' : page;
}

export function initRouter() {
  // Bind nav clicks
  document.querySelectorAll('#mainNav .header-nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      navigateTo(item.dataset.page, e);
    });
  });

  // Handle back/forward browser navigation
  window.addEventListener('hashchange', () => {
    const page = window.location.hash.replace('#', '') || 'dashboard';
    navigateTo(page);
  });

  // Handle initial hash on page load
  const hash = window.location.hash.replace('#', '');
  if (hash && Object.keys(pageRenderers).includes(hash)) {
    navigateTo(hash);
  } else {
    navigateTo('dashboard');
  }
}
