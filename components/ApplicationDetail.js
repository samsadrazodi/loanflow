import { Icons } from './Icons';
import { capitalize, formatDate, formatCurrency } from '../utils/helpers';

export default function ApplicationDetail({ app, onBack, onToast }) {
  if (!app) return null;
  const stageStyles = { new: 'review', processing: 'pending', completed: 'approved' };
  const docList = [
    { name: 'Government ID', done: app.docs >= 1 },
    { name: 'Pay Stubs (2 months)', done: app.docs >= 2 },
    { name: 'Bank Statements', done: app.docs >= 3 },
    { name: 'Tax Returns (2 years)', done: app.docs >= 4 },
    { name: 'Employment Letter', done: app.docs >= 5 },
    { name: 'W-2 Forms', done: app.docs >= 6 },
    { name: 'Property Insurance', done: app.docs >= 7 },
    { name: 'Appraisal Report', done: app.docs >= 8 },
    { name: 'Title Search', done: app.docs >= 9 },
    { name: 'Signed Disclosures', done: app.docs >= 10 },
  ];

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-left">
          <button className="btn btn-ghost" onClick={onBack}>{Icons.arrowLeft} Back to Applications</button>
        </div>
        <div className="toolbar-right">
          {app.stage === 'new' && <button className="btn btn-primary" onClick={() => { onToast(`${app.id} moved to processing`, 'success'); onBack(); }}>Start Processing</button>}
          {app.stage === 'processing' && <button className="btn btn-primary" onClick={() => { onToast(`${app.id} marked complete`, 'success'); onBack(); }}>{Icons.check} Mark Complete</button>}
        </div>
      </div>

      <div className="table-container">
        <div className="table-header-bar">
          <div>
            <span className="table-title">{app.id} — {app.applicant}</span>
            <span className="table-count"><span className={`status-badge ${stageStyles[app.stage]}`} style={{ marginLeft: 8 }}>{capitalize(app.stage)}</span></span>
          </div>
        </div>
        <div style={{ padding: 20 }}>
          <div className="info-grid">
            <div className="info-item"><label>Applicant</label><span>{app.applicant}</span></div>
            <div className="info-item"><label>Email</label><span>{app.email}</span></div>
            <div className="info-item"><label>Phone</label><span>{app.phone}</span></div>
            <div className="info-item"><label>Requested Amount</label><span className="text-mono" style={{ fontWeight: 600 }}>{formatCurrency(app.amount)}</span></div>
            <div className="info-item"><label>Loan Type</label><span>{app.type}</span></div>
            <div className="info-item"><label>Purpose</label><span>{app.purpose}</span></div>
            <div className="info-item"><label>Employment</label><span>{app.employment}</span></div>
            <div className="info-item"><label>Annual Income</label><span className="text-mono">{formatCurrency(app.income)}</span></div>
            <div className="info-item"><label>Submitted</label><span>{formatDate(app.submitted)}</span></div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header-bar">
          <div><span className="table-title">Document Checklist</span><span className="table-count">{app.docs} / 10 uploaded</span></div>
        </div>
        <div style={{ padding: 16 }}>
          <div className="progress-bar" style={{ marginBottom: 16 }}><div className={`progress-bar-fill ${app.docs >= 8 ? 'green' : app.docs >= 4 ? 'blue' : 'amber'}`} style={{ width: `${app.docs * 10}%` }} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {docList.map((d, i) => (
              <div key={i} className="flex-center" style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', background: d.done ? 'var(--accent-green-light)' : 'var(--bg-tertiary)', fontSize: '0.8rem' }}>
                {d.done ? <span style={{ color: 'var(--accent-green)' }}>{Icons.check}</span> : <span style={{ color: 'var(--text-tertiary)', width: 14, height: 14, display: 'inline-block' }}>○</span>}
                <span style={{ color: d.done ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
