import { Icons } from './Icons';
import { reportChartData } from '../utils/data';

export default function ReportsPage({ onToast }) {
  const { months, values, loanTypes } = reportChartData;
  const mx = Math.max(...values);
  return (<>
    <section className="stats-row" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
      {[{label:'Approval Rate',value:'67.6%',change:'+2.1% from last quarter',icon:Icons.check,color:'green'},{label:'Avg. Processing Time',value:'4.2 days',change:'-0.8 days from last quarter',icon:Icons.clock,color:'amber'},{label:'Default Rate',value:'1.3%',change:'-0.2% from last quarter',icon:Icons.pulse,color:'blue'}].map((s,i)=>(
        <div className="stat-card" key={i}><div className="stat-card-header"><span className="stat-card-label">{s.label}</span><div className={`stat-card-icon ${s.color}`}>{s.icon}</div></div><div className="stat-card-value">{s.value}</div><div className="stat-card-change up">{Icons.trendUp} {s.change}</div></div>
      ))}
    </section>
    <section className="table-container">
      <div className="table-header-bar"><div><span className="table-title">Monthly Origination Volume</span><span className="table-count">Last 12 months</span></div><button className="btn btn-ghost btn-sm" onClick={()=>onToast('PDF export coming soon','info')}>{Icons.file} Export PDF</button></div>
      <div style={{padding:24}}>
        <div style={{display:'flex',alignItems:'flex-end',gap:8,height:200}}>{values.map((v,i)=>{const p=(v/mx)*100;return(<div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}><span style={{fontSize:'0.68rem',color:'var(--text-tertiary)',fontFamily:"'JetBrains Mono',monospace"}}>${v}M</span><div style={{width:'100%',height:`${p}%`,minHeight:8,background:i===values.length-1?'var(--accent-blue)':'var(--accent-blue-light)',borderRadius:'4px 4px 0 0',transition:`height 0.6s ease ${i*50}ms`}}/></div>);})}</div>
        <div style={{display:'flex',gap:8,marginTop:8}}>{months.map(m=><div key={m} style={{flex:1,textAlign:'center',fontSize:'0.68rem',color:'var(--text-tertiary)'}}>{m}</div>)}</div>
      </div>
    </section>
    <section className="table-container">
      <div className="table-header-bar"><div><span className="table-title">Loan Type Breakdown</span><span className="table-count">Current portfolio</span></div></div>
      <div style={{padding:24}}>
        <div style={{display:'flex',height:28,borderRadius:6,overflow:'hidden',marginBottom:16}}>{loanTypes.map(t=><div key={t.name} style={{width:`${t.pct}%`,background:t.color,transition:'width 0.5s ease'}} title={`${t.name}: ${t.pct}%`}/>)}</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:16}}>{loanTypes.map(t=>(<div className="flex-center" style={{gap:8}} key={t.name}><div style={{width:10,height:10,borderRadius:3,background:t.color}}/><span style={{fontSize:'0.8rem',fontWeight:500}}>{t.name}</span><span style={{fontSize:'0.75rem',color:'var(--text-tertiary)'}}>{t.pct}%</span></div>))}</div>
      </div>
    </section>
  </>);
}
