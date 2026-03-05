import { useState, useMemo } from 'react';
import { Icons } from './Icons';
import { loanData } from '../utils/data';
import { capitalize, formatDate } from '../utils/helpers';

export default function DashboardPage({ onOpenModal, onToast }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ field: 'date', dir: 'desc' });
  const filtered = useMemo(() => {
    let r = [...loanData];
    if (filter !== 'all') r = r.filter(l => l.status === filter);
    if (search) { const q = search.toLowerCase(); r = r.filter(l => l.id.toLowerCase().includes(q) || l.borrower.toLowerCase().includes(q) || l.amount.toString().includes(q)); }
    r.sort((a, b) => { let av = a[sort.field], bv = b[sort.field]; if (sort.field === 'amount') { av = +av; bv = +bv; } if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); } return av < bv ? (sort.dir === 'asc' ? -1 : 1) : av > bv ? (sort.dir === 'asc' ? 1 : -1) : 0; });
    return r;
  }, [filter, search, sort]);
  const doSort = f => setSort(p => p.field === f ? { field: f, dir: p.dir === 'asc' ? 'desc' : 'asc' } : { field: f, dir: 'asc' });
  const exportCSV = () => { const h = ['LOP ID','Borrower','Amount','Type','Status','Priority','Date']; const rows = loanData.map(l => [l.id,l.borrower,l.amount,l.type,l.status,l.priority,l.date]); const csv = [h.join(','), ...rows.map(r => r.join(','))].join('\n'); const b = new Blob([csv], { type: 'text/csv' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'loanflow-export.csv'; a.click(); URL.revokeObjectURL(u); onToast('CSV exported successfully', 'success'); };
  const filters = [{ key: 'all', label: 'All' }, { key: 'approved', label: 'Approved', icon: Icons.check }, { key: 'pending', label: 'Pending', icon: Icons.clock }, { key: 'review', label: 'In Review', icon: Icons.eye }, { key: 'rejected', label: 'Rejected', icon: Icons.x }];
  const sf = ['id','borrower','amount','type','status','priority','date'], sl = ['LOP ID','Borrower','Amount','Loan Type','Status','Priority','Created'];
  return (<>
    <section className="stats-row">
      {[{ label:'Total LOPs',value:'1,247',change:'+12.3% from last month',up:true,icon:Icons.file,color:'blue' },{ label:'Approved',value:'843',change:'+8.7% from last month',up:true,icon:Icons.check,color:'green' },{ label:'Pending Review',value:'189',change:'-3.1% from last month',up:false,icon:Icons.clock,color:'amber' },{ label:'Total Disbursed',value:'$24.6M',change:'+15.2% from last month',up:true,icon:Icons.dollar,color:'purple' }].map((s,i) => (
        <div className="stat-card" key={i}><div className="stat-card-header"><span className="stat-card-label">{s.label}</span><div className={`stat-card-icon ${s.color}`}>{s.icon}</div></div><div className="stat-card-value">{s.value}</div><div className={`stat-card-change ${s.up?'up':'down'}`}>{s.up?Icons.trendUp:Icons.trendDown} {s.change}</div></div>
      ))}
    </section>
    <section className="toolbar">
      <div className="toolbar-left">
        <div className="search-input">{Icons.search}<input placeholder="Search by LOP ID, borrower, or amount..." value={search} onChange={e=>setSearch(e.target.value)} /></div>
        {filters.map(f => <button key={f.key} className={`filter-chip ${filter===f.key?'active':''}`} onClick={()=>setFilter(f.key)}>{f.icon} {f.label}</button>)}
      </div>
      <div className="toolbar-right"><button className="btn btn-secondary" onClick={exportCSV}>{Icons.download} Export</button><button className="btn btn-primary" onClick={()=>onToast('New LOP form coming soon','info')}>{Icons.plus} New LOP</button></div>
    </section>
    <section className="table-container">
      <div className="table-header-bar"><div><span className="table-title">Loan Offer Letters</span><span className="table-count">Showing {filtered.length} of {loanData.length}</span></div></div>
      <div style={{overflowX:'auto'}}><table><thead><tr>{sl.map((l,i)=><th key={i} className={`sortable ${sort.field===sf[i]?(sort.dir==='asc'?'sort-asc':'sort-desc'):''}`} onClick={()=>doSort(sf[i])}>{l}</th>)}<th>Assigned</th><th style={{width:50}}/></tr></thead>
      <tbody>{filtered.map(loan=>(
        <tr key={loan.id} onClick={()=>onOpenModal(loan)}>
          <td><span className="text-mono" style={{fontSize:'0.78rem',color:'var(--accent-blue)',fontWeight:500}}>{loan.id}</span></td>
          <td style={{fontWeight:500}}>{loan.borrower}</td>
          <td className="text-mono" style={{fontWeight:600}}>${loan.amount.toLocaleString()}</td>
          <td>{loan.type}</td>
          <td><span className={`status-badge ${loan.status}`}>{capitalize(loan.status)}</span></td>
          <td><span className="priority"><span className={`priority-dot ${loan.priority}`}/>{capitalize(loan.priority)}</span></td>
          <td style={{color:'var(--text-secondary)',fontSize:'0.8rem'}}>{formatDate(loan.date)}</td>
          <td><div className="avatar" style={{background:loan.assignedColor,width:26,height:26,fontSize:'0.65rem'}}>{loan.assigned}</div></td>
          <td><button className="btn btn-ghost btn-sm" style={{padding:4}} onClick={e=>{e.stopPropagation();onToast('Actions menu coming soon','info')}}>{Icons.dots}</button></td>
        </tr>))}</tbody></table></div>
      <div className="pagination"><span className="pagination-info">Showing 1-{filtered.length} of {loanData.length}</span><div className="pagination-controls"><button className="pagination-btn" disabled>{Icons.chevronLeft}</button><button className="pagination-btn active">1</button><button className="pagination-btn">2</button><button className="pagination-btn">3</button><span style={{color:'var(--text-tertiary)',fontSize:'0.78rem',padding:'0 4px'}}>…</span><button className="pagination-btn">125</button><button className="pagination-btn">{Icons.chevronRight}</button></div></div>
    </section>
  </>);
}
