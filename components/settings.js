/**
 * LoanFlow v2.0 — Settings Component
 */

import { toggleTheme } from '../utils/theme.js';
import { showToast } from '../utils/toast.js';

export function initSettings() {
  // Dark mode toggle in settings
  const settingsThemeToggle = document.getElementById('settingsThemeToggle');
  if (settingsThemeToggle) settingsThemeToggle.addEventListener('click', toggleTheme);

  // Save / Discard
  const saveBtn = document.getElementById('settingsSaveBtn');
  if (saveBtn) saveBtn.addEventListener('click', () => showToast('Settings saved successfully!', 'success'));

  const discardBtn = document.getElementById('settingsDiscardBtn');
  if (discardBtn) discardBtn.addEventListener('click', () => showToast('Changes discarded', 'info'));

  // Notification toggles
  document.querySelectorAll('.settings-toggle').forEach(btn => {
    btn.addEventListener('click', () => showToast('Notification preference saved', 'success'));
  });

  // Compact view toggle
  const compactToggle = document.getElementById('settingsCompactToggle');
  if (compactToggle) compactToggle.addEventListener('click', () => showToast('Compact view toggled', 'success'));
}
