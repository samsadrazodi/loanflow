import { useState, useEffect, useCallback } from 'react';
export function useTheme() {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    const s = localStorage.getItem('loanflow-theme');
    if (s) { setTheme(s); document.documentElement.setAttribute('data-theme', s); }
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) { setTheme('dark'); document.documentElement.setAttribute('data-theme', 'dark'); }
  }, []);
  const toggle = useCallback(() => {
    setTheme(p => { const n = p === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', n); localStorage.setItem('loanflow-theme', n); return n; });
  }, []);
  return { theme, toggle, isDark: theme === 'dark' };
}
