import { Icons } from './Icons';
import { formatDate, formatCurrency, capitalize } from '../utils/helpers';
import { loanData } from '../utils/data';

export default function BorrowerProfile({ borrower, onBack }) {
  if (!borrower) return null;
  const riskBadge = { low: 'approved', medium: 'pending', high: 'rejected' };
  const borrowerLoans = loanData.filter(l => l.borrower === borrower.name);

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-left"><button className="btn btn-ghost" onClick={onBack}>{Icons.arrowLeft} Back to Borrowers</button></div>
      </div>

      <div className="table-container">
        <div className="table-header-bar">
          <div className="flex-center" style={{ gap: 12 }}>
            <div className="avatar" style={{ background: `hsl(${borrower.name.length * 37 % 360}, 55%, 55%)`, width: 36, height: 36, fontSize: '0.8rem' }}>{borrower.name.split(' ').map(n => n[0]).join('')}</div>
            <div>
              <span className="table-title">{borrower.name}</span>
              <span className="table-count"><span className={`status-badge ${riskBadge[borrower.risk]}`} style={{ marginLeft: 8 }}>{capitalize(borrower.risk)} Risk</span></span>
            </div>
          </div>
        </div>
        <div style={{ padding: 20 }}>
          <div className="info-grid">
            <div className="info-item"><label>Email</label><span>{borrower.email}</span></div>
            <div className="info-item"><label>Phone</label><span>{borrower.phone}</span></div>
            <div className="info-item"><label>Address</label><span>{borrower.address}</span></div>
            <div className="info-item"><label>Employer</label><span>{borrower.employer}</span></div>
            <div className="info-item"><label>Credit Score</label><span className="text-mono" style={{ fontWeight: 600, color: borrower.creditScore >= 720 ? 'var(--accent-green)' : borrower.creditScore >= 680 ? 'var(--accent-amber)' : 'var(--accent-red)' }}>{borrower.creditScore}</span></div>
            <div className="info-item"><label>Member Since</label><span>{formatDate(borrower.since)}</span></div>
            <div className="info-item"><label>Total Borrowed</label><span className="text-mono" style={{ fontWeight: 600 }}>{formatCurrency(borrower.totalBorrowed)}</span></div>
            <div className="info-item"><label>Monthly Payment</label><span className="text-mono">{formatCurrency(borrower.monthlyPayment)}</span></div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header-bar"><div><span className="table-title">Loan History</span><span className="table-count">{borrowerLoans.length} loan{borrowerLoans.length !== 1 ? 's' : ''}</span></div></div>
        {borrowerLoans.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead><tr><th>LOP ID</th><th>Amount</th><th>Type</th><th>Status</th><th>Rate</th><th>Date</th></tr></thead>
              <tbody>
                {borrowerLoans.map(l => (
                  <tr key={l.id}>
                    <td><span className="text-mono" style={{ fontSize: '0.78rem', color: 'var(--accent-blue)', fontWeight: 500 }}>{l.id}</span></td>
                    <td className="text-mono" style={{ fontWeight: 600 }}>{formatCurrency(l.amount)}</td>
                    <td>{l.type}</td>
                    <td><span className={`status-badge ${l.status}`}>{capitalize(l.status)}</span></td>
                    <td className="text-mono">{l.rate}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{formatDate(l.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.84rem' }}>No matching LOPs found for this borrower</div>
        )}
      </div>
    </>
  );
}
