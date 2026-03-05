/**
 * LoanFlow v2.0 — Theme Manager (Dark Mode)
 */

export function initTheme() {
  const saved = localStorage.getItem('loanflow-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  updateThemeIcons();
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('loanflow-theme', next);
  updateThemeIcons();
}

function updateThemeIcons() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  // Header toggle icons
  const sun = document.getElementById('themeIconSun');
  const moon = document.getElementById('themeIconMoon');
  if (sun) sun.style.display = isDark ? 'none' : 'block';
  if (moon) moon.style.display = isDark ? 'block' : 'none';

  // Settings page toggle icons (if present)
  document.querySelectorAll('.settings-sun-icon').forEach(el => el.style.display = isDark ? 'none' : 'block');
  document.querySelectorAll('.settings-moon-icon').forEach(el => el.style.display = isDark ? 'block' : 'none');
}
