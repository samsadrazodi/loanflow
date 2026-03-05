import { Icons } from './Icons';

export default function SettingsPage({ isDark, onToggleTheme, onToast }) {
  return (
    <section className="table-container">
      <div className="table-header-bar"><span className="table-title">General Settings</span></div>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div className="modal-section">
          <div className="modal-section-title">Profile</div>
          <div className="modal-grid">
            <div className="modal-field"><span className="modal-field-label">Full Name</span><div style={{ marginTop: 4 }}><input type="text" defaultValue="Sam M." className="settings-input" /></div></div>
            <div className="modal-field"><span className="modal-field-label">Email</span><div style={{ marginTop: 4 }}><input type="email" defaultValue="sam@loanflow.io" className="settings-input" /></div></div>
            <div className="modal-field"><span className="modal-field-label">Role</span><div style={{ marginTop: 4 }}><select className="settings-input" defaultValue="Manager" style={{ cursor: 'pointer' }}><option>Admin</option><option>Loan Officer</option><option>Underwriter</option><option>Manager</option></select></div></div>
            <div className="modal-field"><span className="modal-field-label">Organization</span><div style={{ marginTop: 4 }}><input type="text" defaultValue="LoanFlow Inc." className="settings-input" /></div></div>
          </div>
        </div>

        <div className="modal-section">
          <div className="modal-section-title">Appearance</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
            <div><div style={{ fontSize: '0.88rem', fontWeight: 500 }}>Dark Mode</div><div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>Switch between light and dark themes</div></div>
            <button className="theme-toggle" onClick={onToggleTheme}><div className="theme-toggle-knob">{isDark ? Icons.moon : Icons.sun}</div></button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
            <div><div style={{ fontSize: '0.88rem', fontWeight: 500 }}>Compact Table View</div><div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>Reduce row spacing in data tables</div></div>
            <button className="theme-toggle" onClick={() => onToast('Compact view toggled', 'success')}><div className="theme-toggle-knob" /></button>
          </div>
        </div>

        <div className="modal-section">
          <div className="modal-section-title">Notifications</div>
          {[{ label: 'Email Notifications', desc: 'Receive updates on loan status changes', on: true }, { label: 'Push Notifications', desc: 'Browser notifications for urgent items', on: false }].map(n => (
            <div key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
              <div><div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{n.label}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{n.desc}</div></div>
              <button className="theme-toggle" onClick={() => onToast('Notification preference saved', 'success')} style={n.on ? { background: 'var(--accent-blue-light)', borderColor: 'var(--accent-blue)' } : {}}>
                <div className="theme-toggle-knob" style={n.on ? { transform: 'translateX(20px)' } : {}} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 8 }}>
          <button className="btn btn-secondary" onClick={() => onToast('Changes discarded', 'info')}>Discard</button>
          <button className="btn btn-primary" onClick={() => onToast('Settings saved successfully!', 'success')}>Save Changes</button>
        </div>
      </div>
    </section>
  );
}
