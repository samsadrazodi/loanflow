import { useState, useMemo } from 'react';
import { Icons } from './Icons';
import { borrowersData } from '../utils/data';
import { capitalize, formatDate } from '../utils/helpers';

const riskBadge = { low: 'approved', medium: 'pending', high: 'rejected' };

export default function BorrowersPage({ onToast }) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    if (!search) return borrowersData;
    const q = search.toLowerCase();
    return borrowersData.filter(b => b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q));
  }, [search]);

  return (
    <>
      <section className="stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {[
          { label: 'Total Borrowers', value: '962', change: '+24 this month', icon: Icons.users, color: 'blue' },
          { label: 'Active Loans', value: '1,841', change: '+5.6% from last month', icon: Icons.activity, color: 'green' },
          { label: 'Avg. Credit Score', value: '724', change: '+3 pts from last quarter', icon: Icons.barChart, color: 'purple' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card-header"><span className="stat-card-label">{s.label}</span><div className={`stat-card-icon ${s.color}`}>{s.icon}</div></div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-change up">{Icons.trendUp} {s.change}</div>
          </div>
        ))}
      </section>
      <section className="toolbar">
        <div className="toolbar-left"><div className="search-input">{Icons.search}<input type="text" placeholder="Search borrowers by name, email, or ID..." value={search} onChange={e => setSearch(e.target.value)} /></div></div>
        <div className="toolbar-right"><button className="btn btn-secondary" onClick={() => onToast('Borrower export coming soon', 'info')}>{Icons.download} Export</button></div>
      </section>
      <section className="table-container">
        <div className="table-header-bar"><div><span className="table-title">Borrower Directory</span><span className="table-count">Showing {filtered.length} borrowers</span></div></div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead><tr><th>Borrower</th><th>Email</th><th>Active Loans</th><th>Total Borrowed</th><th>Credit Score</th><th>Since</th><th>Risk</th></tr></thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.email} onClick={() => onToast('Borrower profile coming soon', 'info')}>
                  <td><div className="flex-center"><div className="avatar" style={{ background: `hsl(${b.name.length * 37 % 360}, 55%, 55%)`, width: 28, height: 28, fontSize: '0.65rem' }}>{b.name.split(' ').map(n => n[0]).join('')}</div><span style={{ fontWeight: 500 }}>{b.name}</span></div></td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{b.email}</td>
                  <td style={{ fontWeight: 600 }}>{b.loans}</td>
                  <td className="text-mono" style={{ fontWeight: 600 }}>${b.totalBorrowed.toLocaleString()}</td>
                  <td><span className="text-mono" style={{ fontWeight: 600, color: b.creditScore >= 720 ? 'var(--accent-green)' : b.creditScore >= 680 ? 'var(--accent-amber)' : 'var(--accent-red)' }}>{b.creditScore}</span></td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{formatDate(b.since)}</td>
                  <td><span className={`status-badge ${riskBadge[b.risk]}`}>{capitalize(b.risk)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
