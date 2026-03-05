/**
 * LoanFlow v2.0 — Application Entry Point
 */

import { initTheme, toggleTheme } from './utils/theme.js';
import { initRouter } from './utils/router.js';
import { initDashboard } from './components/dashboard.js';
import { initModal } from './components/loanDetailModal.js';
import { initApplications } from './components/applications.js';
import { initBorrowers } from './components/borrowers.js';
import { initReports } from './components/reports.js';
import { initSettings } from './components/settings.js';

// ── Boot ──
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  initTheme();
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

  // Components
  initDashboard();
  initModal();
  initApplications();
  initBorrowers();
  initReports();
  initSettings();

  // Router (must be last — triggers initial page render)
  initRouter();

  // Global keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      const search = document.getElementById('searchInput');
      if (search) search.focus();
    }
  });
});
