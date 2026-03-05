import { useState } from 'react';
import { Icons } from './Icons';
import { capitalize, formatDate } from '../utils/helpers';
import { timelineEntries, defaultTimeline } from '../utils/data';

export default function LoanDetailModal({ loan, onClose, onToast }) {
  const [tab, setTab] = useState('details');
  if (!loan) return null;
  const pColor = loan.progress >= 80 ? 'green' : loan.progress >= 40 ? 'blue' : 'amber';
  const timeline = timelineEntries[loan.id] || defaultTimeline;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 780 }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">{loan.id}</div>
            <div className="modal-subtitle">Created on {formatDate(loan.date)} · {loan.type} Loan · {loan.borrower}</div>
          </div>
          <button className="modal-close" onClick={onClose}>{Icons.close}</button>
        </div>

        <div className="detail-tabs">
          {['details', 'property', 'timeline', 'notes'].map(t => (
            <button key={t} className={`detail-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{capitalize(t)}</button>
          ))}
        </div>

        <div className="modal-body">
          {tab === 'details' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span className={`status-badge ${loan.status}`}>{capitalize(loan.status)}</span>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>{loan.progress}% complete</span>
              </div>
              <div className="progress-bar" style={{ marginBottom: 20 }}><div className={`progress-bar-fill ${pColor}`} style={{ width: `${loan.progress}%` }} /></div>

              <div className="info-grid">
                <div className="info-item"><label>Borrower</label><span>{loan.borrower}</span></div>
                <div className="info-item"><label>Email</label><span>{loan.email}</span></div>
                <div className="info-item"><label>Phone</label><span>{loan.phone}</span></div>
                <div className="info-item"><label>Credit Score</label><span style={{ color: loan.creditScore >= 720 ? 'var(--accent-green)' : loan.creditScore >= 680 ? 'var(--accent-amber)' : 'var(--accent-red)', fontWeight: 600 }}>{loan.creditScore}</span></div>
                <div className="info-item"><label>Loan Amount</label><span className="text-mono" style={{ fontWeight: 600 }}>${loan.amount.toLocaleString()}</span></div>
                <div className="info-item"><label>Interest Rate</label><span className="text-mono">{loan.rate}</span></div>
                <div className="info-item"><label>Term</label><span>{loan.term}</span></div>
                <div className="info-item"><label>LTV Ratio</label><span className="text-mono">{loan.ltv}</span></div>
                <div className="info-item"><label>DTI Ratio</label><span className="text-mono">{loan.dti}</span></div>
                <div className="info-item"><label>Priority</label><span className="priority"><span className={`priority-dot ${loan.priority}`} />{capitalize(loan.priority)}</span></div>
              </div>
            </>
          )}

          {tab === 'property' && (
            <div className="info-grid">
              <div className="info-item"><label>Address</label><span>{loan.address}</span></div>
              <div className="info-item"><label>Property Value</label><span className="text-mono" style={{ fontWeight: 600 }}>{loan.propertyValue}</span></div>
              <div className="info-item"><label>Property Type</label><span>{loan.propertyType}</span></div>
              <div className="info-item"><label>Appraisal Date</label><span>{loan.appraisal}</span></div>
              <div className="info-item"><label>Loan Type</label><span>{loan.type}</span></div>
              <div className="info-item"><label>LTV</label><span className="text-mono">{loan.ltv}</span></div>
            </div>
          )}

          {tab === 'timeline' && (
            <div className="timeline">
              {timeline.map((t, i) => (
                <div className="timeline-item" key={i}>
                  <div className="timeline-item-date">{t.date}</div>
                  <div className="timeline-item-text">{t.text}</div>
                  <div className="timeline-item-user">by {t.user}</div>
                </div>
              ))}
            </div>
          )}

          {tab === 'notes' && (
            <div className="notes-box">{loan.notes}</div>
          )}
        </div>

        <div className="modal-footer">
          <div className="modal-footer-left">
            {loan.status !== 'rejected' && loan.status !== 'disbursed' && (
              <button className="btn btn-danger btn-sm" onClick={() => { onToast('Loan rejected', 'error'); onClose(); }}>Reject</button>
            )}
          </div>
          <div className="modal-footer-right">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
            {loan.status !== 'approved' && loan.status !== 'rejected' && loan.status !== 'disbursed' && (
              <button className="btn btn-primary" onClick={() => { onToast(`${loan.id} approved!`, 'success'); onClose(); }}>{Icons.check} Approve</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
