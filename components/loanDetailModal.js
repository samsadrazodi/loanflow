import { Icons } from './Icons';
import { capitalize, formatDate } from '@/utils/helpers';
import { timelineData } from '@/utils/data';

export default function LoanDetailModal({ loan, onClose, onToast }) {
  if (!loan) return null;

  const progressColor = loan.progress >= 80 ? 'green' : loan.progress >= 40 ? 'blue' : 'amber';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">{loan.id}</div>
            <div className="modal-subtitle">Created on {formatDate(loan.date)} · {loan.type} Loan</div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">{Icons.close}</button>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <div className="modal-section-title">Loan Details</div>
            <div className="modal-grid">
              <div className="modal-field"><span className="modal-field-label">Borrower Name</span><span className="modal-field-value">{loan.borrower}</span></div>
              <div className="modal-field"><span className="modal-field-label">Loan Amount</span><span className="modal-field-value mono">${loan.amount.toLocaleString()}</span></div>
              <div className="modal-field"><span className="modal-field-label">Loan Type</span><span className="modal-field-value">{loan.type}</span></div>
              <div className="modal-field"><span className="modal-field-label">Interest Rate</span><span className="modal-field-value mono">{loan.rate}</span></div>
              <div className="modal-field"><span className="modal-field-label">Term</span><span className="modal-field-value">{loan.term}</span></div>
              <div className="modal-field"><span className="modal-field-label">LTV Ratio</span><span className="modal-field-value mono">{loan.ltv}</span></div>
            </div>
          </div>

          <div className="modal-section">
            <div className="modal-section-title">Status & Progress</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className={`status-badge ${loan.status}`}>{capitalize(loan.status)}</span>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>{loan.progress}% complete</span>
            </div>
            <div className="progress-bar"><div className={`progress-bar-fill ${progressColor}`} style={{ width: `${loan.progress}%` }} /></div>
          </div>

          <div className="modal-section">
            <div className="modal-section-title">Property Information</div>
            <div className="modal-grid">
              <div className="modal-field"><span className="modal-field-label">Property Address</span><span className="modal-field-value">{loan.address}</span></div>
              <div className="modal-field"><span className="modal-field-label">Property Value</span><span className="modal-field-value mono">{loan.propertyValue}</span></div>
              <div className="modal-field"><span className="modal-field-label">Property Type</span><span className="modal-field-value">{loan.propertyType}</span></div>
              <div className="modal-field"><span className="modal-field-label">Appraisal Date</span><span className="modal-field-value">{loan.appraisal}</span></div>
            </div>
          </div>

          <div className="modal-section">
            <div className="modal-section-title">Activity Timeline</div>
            <div className="timeline">
              {timelineData.map((t, i) => (
                <div className="timeline-item" key={i}>
                  <div className="timeline-item-date">{t.date}</div>
                  <div className="timeline-item-text">{t.text}</div>
                  <div className="timeline-item-user">by {t.user}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-footer-left">
            <button className="btn btn-danger btn-sm" onClick={() => onToast('Rejection workflow coming soon', 'info')}>Reject</button>
          </div>
          <div className="modal-footer-right">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
            <button className="btn btn-primary" onClick={() => onToast('LOP approved successfully!', 'success')}>{Icons.check} Approve</button>
          </div>
        </div>
      </div>
    </div>
  );
}
