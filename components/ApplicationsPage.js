import { useState, useMemo } from 'react';
import { Icons } from './Icons';
import { applicationsData } from '../utils/data';
import { capitalize, formatDate } from '../utils/helpers';

const stageStyles = { new: 'review', processing: 'pending', completed: 'approved' };

export default function ApplicationsPage({ onToast }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = [...applicationsData];
    if (filter !== 'all') result = result.filter(a => a.stage === filter);
    if (search) { const q = search.toLowerCase(); result = result.filter(a => a.id.toLowerCase().includes(q) || a.applicant.toLowerCase().includes(q)); }
    return result;
  }, [filter, search]);

  return (
    <>
      <section className="toolbar">
        <div className="toolbar-left">
          <div className="search-input">{Icons.search}<input type="text" placeholder="Search applications..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          {['all', 'new', 'processing', 'completed'].map(f => (
            <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{capitalize(f)}</button>
          ))}
        </div>
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={() => onToast('New application form coming soon', 'info')}>{Icons.plus} New Application</button>
        </div>
      </section>
      <section className="table-container">
        <div className="table-header-bar"><div><span className="table-title">Loan Applications</span><span className="table-count">Showing {filtered.length} applications</span></div></div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead><tr><th>App ID</th><th>Applicant</th><th>Requested Amount</th><th>Type</th><th>Stage</th><th>Submitted</th><th>Documents</th><th style={{ width: 50 }} /></tr></thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id} onClick={() => onToast('Application detail view coming soon', 'info')}>
                  <td><span className="text-mono" style={{ fontSize: '0.78rem', color: 'var(--accent-blue)', fontWeight: 500 }}>{app.id}</span></td>
                  <td style={{ fontWeight: 500 }}>{app.applicant}</td>
                  <td className="text-mono" style={{ fontWeight: 600 }}>${app.amount.toLocaleString()}</td>
                  <td>{app.type}</td>
                  <td><span className={`status-badge ${stageStyles[app.stage]}`}>{capitalize(app.stage)}</span></td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{formatDate(app.submitted)}</td>
                  <td><span className="flex-center" style={{ fontSize: '0.8rem' }}>{Icons.file} {app.docs} / 10</span></td>
                  <td><button className="btn btn-ghost btn-sm" style={{ padding: 4 }} onClick={e => { e.stopPropagation(); onToast('Actions menu coming soon', 'info'); }}>{Icons.dots}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
