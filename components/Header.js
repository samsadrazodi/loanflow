import { Icons } from './Icons';
const pages = ['dashboard', 'applications', 'borrowers', 'reports', 'settings'];
export default function Header({ activePage, onNavigate, isDark, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header-left">
        <span className="header-logo" onClick={() => onNavigate('dashboard')}>
          <svg viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="7" fill="var(--accent-blue)"/><path d="M8 9h4v10H8V9zm5 0h2l4 10h-2.5l-0.8-2.2h-3.8L11 19h-.5L13 9zm1 1.8L12.6 15h2.8L14 10.8z" fill="white"/></svg>
          <span className="header-logo-text">LoanFlow</span>
          <span className="header-logo-version">v2.0</span>
        </span>
      </div>
      <nav className="header-nav">
        {pages.map(p => <a key={p} className={`header-nav-item ${activePage === p ? 'active' : ''}`} href="#" onClick={e => { e.preventDefault(); onNavigate(p); }}>{p.charAt(0).toUpperCase() + p.slice(1)}</a>)}
      </nav>
      <div className="header-right">
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle dark mode"><div className="theme-toggle-knob">{isDark ? Icons.moon : Icons.sun}</div></button>
        <button className="btn btn-ghost" title="Notifications">{Icons.bell}</button>
        <div className="avatar" style={{ background: 'var(--accent-blue)', fontSize: '0.72rem' }}>SM</div>
      </div>
    </header>
  );
}
