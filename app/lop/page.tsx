'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, type Loan, type Task, type LoanNote, type LoanDocument, type FollowUp, LOAN_STAGES, STAGE_COLORS, LOAN_TYPE_DOCUMENTS, CONTACT_TYPES, type LoanStage, type ContactType } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const SunIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
const MoonIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
const CloseIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const CheckSm = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{width:10,height:10}}><polyline points="20 6 9 17 4 12"/></svg>
const SendIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>

type View = 'dashboard' | 'followups' | 'kanban' | 'reports'

export default function LOPDashboard() {
  const [view, setView] = useState<View>('dashboard')
  const [loans, setLoans] = useState<Loan[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [allDocs, setAllDocs] = useState<Record<string, LoanDocument[]>>({})
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const [isDark, setIsDark] = useState(false)
  // Modal state
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [modalTab, setModalTab] = useState('details')
  const [loanDocs, setLoanDocs] = useState<LoanDocument[]>([])
  const [loanNotes, setLoanNotes] = useState<LoanNote[]>([])
  const [loanFollowUps, setLoanFollowUps] = useState<FollowUp[]>([])
  const [newNote, setNewNote] = useState('')
  const [noteContact, setNoteContact] = useState<ContactType>('Client')
  const [editingNote, setEditingNote] = useState<string|null>(null)
  const [editNoteText, setEditNoteText] = useState('')
  // Follow-up form
  const [fuContact, setFuContact] = useState<ContactType>('Client')
  const [fuReason, setFuReason] = useState('')
  const [fuDate, setFuDate] = useState('')
  // Pipeline search + filter
  const [pipelineSearch, setPipelineSearch] = useState('')
  const [pipelineFilter, setPipelineFilter] = useState<string>('all')
  const router = useRouter()

  useEffect(() => { const s = localStorage.getItem('loanflow-theme'); if (s==='dark'||(!s && window.matchMedia('(prefers-color-scheme: dark)').matches)){setIsDark(true);document.documentElement.setAttribute('data-theme','dark')} }, [])
  const toggleTheme = () => { const n=!isDark;setIsDark(n);document.documentElement.setAttribute('data-theme',n?'dark':'light');localStorage.setItem('loanflow-theme',n?'dark':'light') }

  const loadData = useCallback(async () => {
    const { data:{user} } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUserId(user.id)
    const { data:profile } = await supabase.from('users').select('name,role').eq('id',user.id).single()
    if (profile?.role !== 'LOP') { router.push('/login'); return }
    setUserName(profile.name)
    const { data:l } = await supabase.from('loans').select('*').order('close_date',{ascending:true})
    setLoans(l || [])
    const { data:t } = await supabase.from('tasks').select('*').eq('status','pending').order('due_date',{ascending:true})
    setTasks(t || [])
    const { data:fu } = await supabase.from('follow_ups').select('*').eq('status','pending').order('due_date',{ascending:true})
    setFollowUps(fu || [])
    // Load all docs for all loans (for dashboard cards)
    const { data:docs } = await supabase.from('loan_documents').select('*')
    if (docs) {
      const byLoan: Record<string,LoanDocument[]> = {}
      docs.forEach(d => { if (!byLoan[d.loan_id]) byLoan[d.loan_id]=[]; byLoan[d.loan_id].push(d) })
      setAllDocs(byLoan)
    }
    setLoading(false)
  }, [router])
  useEffect(() => { loadData() }, [loadData])

  // Helpers
  const getLoan = (id: string) => loans.find(l => l.id === id)
  const activeLoans = loans.filter(l => l.stage !== 'Closed')
  const pipelineValue = activeLoans.reduce((s,l) => s+l.amount, 0)
  const today = new Date(); today.setHours(0,0,0,0)
  const getMissingDocs = (loanId: string) => {
    const docs = allDocs[loanId] || []
    return docs.filter(d => d.required && !d.received)
  }

  // Follow-up helpers
  const overdueFU = followUps.filter(f => new Date(f.due_date) < today)
  const todayFU = followUps.filter(f => { const d = new Date(f.due_date); return d.toDateString() === today.toDateString() })
  const upcomingFU = followUps.filter(f => { const d = new Date(f.due_date); return d > today })

  const markComplete = async (taskId: string) => { await supabase.from('tasks').update({status:'complete'}).eq('id',taskId); loadData() }
  const markFUDone = async (fuId: string) => { await supabase.from('follow_ups').update({status:'done'}).eq('id',fuId); loadData(); setLoanFollowUps(prev => prev.filter(f => f.id !== fuId)) }

  const changeStage = async (loanId: string, newStage: LoanStage) => {
    await supabase.from('loans').update({stage:newStage}).eq('id',loanId)
    if (selectedLoan?.id === loanId) setSelectedLoan({...selectedLoan, stage:newStage})
    loadData()
  }

  // Open loan modal
  const openLoan = async (loan: Loan) => {
    setSelectedLoan(loan); setModalTab('details')
    // Docs
    let { data:docs } = await supabase.from('loan_documents').select('*').eq('loan_id',loan.id).order('document_type')
    if (!docs || docs.length === 0) {
      const defaults = LOAN_TYPE_DOCUMENTS[loan.loan_type] || LOAN_TYPE_DOCUMENTS['Conventional']
      const inserts = defaults.map(dt => ({loan_id:loan.id, document_type:dt, required:true, received:false}))
      const { data:newDocs } = await supabase.from('loan_documents').insert(inserts).select()
      docs = newDocs || []
    }
    setLoanDocs(docs)
    // Notes
    const { data:notes } = await supabase.from('loan_notes').select('*').eq('loan_id',loan.id).order('created_at',{ascending:false})
    setLoanNotes(notes || [])
    // Follow-ups for this loan
    const { data:lfu } = await supabase.from('follow_ups').select('*').eq('loan_id',loan.id).order('due_date',{ascending:true})
    setLoanFollowUps(lfu || [])
  }

  const toggleDoc = async (docId: string, current: boolean) => {
    await supabase.from('loan_documents').update({received:!current, received_date:!current?new Date().toISOString():null}).eq('id',docId)
    setLoanDocs(prev => prev.map(d => d.id===docId ? {...d, received:!current, received_date:!current?new Date().toISOString():null} : d))
    // Refresh allDocs
    loadData()
  }

  const addNote = async () => {
    if (!newNote.trim() || !selectedLoan) return
    const { data } = await supabase.from('loan_notes').insert({loan_id:selectedLoan.id, user_id:userId, contact_type:noteContact, content:newNote.trim()}).select().single()
    if (data) setLoanNotes(prev => [data, ...prev])
    setNewNote('')
  }

  const startEditNote = (note: LoanNote) => { setEditingNote(note.id); setEditNoteText(note.content) }
  const saveEditNote = async (noteId: string) => {
    if (!editNoteText.trim()) return
    await supabase.from('loan_notes').update({content:editNoteText.trim()}).eq('id',noteId)
    setLoanNotes(prev => prev.map(n => n.id===noteId ? {...n, content:editNoteText.trim()} : n))
    setEditingNote(null); setEditNoteText('')
  }
  const deleteNote = async (noteId: string) => {
    await supabase.from('loan_notes').delete().eq('id',noteId)
    setLoanNotes(prev => prev.filter(n => n.id !== noteId))
  }

  // Filtered loans for pipeline
  const filteredLoans = loans.filter(l => {
    const matchSearch = !pipelineSearch || l.borrower_name.toLowerCase().includes(pipelineSearch.toLowerCase()) || l.loan_number.includes(pipelineSearch)
    const matchFilter = pipelineFilter === 'all' || l.stage === pipelineFilter
    return matchSearch && matchFilter
  })

  const addFollowUp = async () => {
    if (!fuReason.trim() || !fuDate || !selectedLoan) return
    const { data } = await supabase.from('follow_ups').insert({loan_id:selectedLoan.id, user_id:userId, contact_type:fuContact, reason:fuReason.trim(), due_date:fuDate}).select().single()
    if (data) { setLoanFollowUps(prev => [...prev, data].sort((a,b) => a.due_date.localeCompare(b.due_date))); setFollowUps(prev => [...prev, data]) }
    setFuReason(''); setFuDate('')
  }

  const quickFU = (days: number) => {
    const d = new Date(); d.setDate(d.getDate()+days)
    setFuDate(d.toISOString().split('T')[0])
    const missing = loanDocs.filter(d => d.required && !d.received).map(d => d.document_type)
    if (missing.length > 0 && !fuReason) setFuReason(`Follow up on: ${missing.slice(0,3).join(', ')}${missing.length > 3 ? ` +${missing.length-3} more` : ''}`)
  }

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login') }

  if (loading) return <div className="loading">Loading dashboard...</div>

  const receivedCount = loanDocs.filter(d=>d.received).length
  const totalDocsCount = loanDocs.length
  const stageDistribution = LOAN_STAGES.map(s => ({stage:s, count:loans.filter(l=>l.stage===s).length}))
  const typeDistribution = ['Conventional','FHA','VA','USDA'].map(t => ({type:t, count:loans.filter(l=>l.loan_type===t).length, value:loans.filter(l=>l.loan_type===t).reduce((s,l)=>s+l.amount,0)}))

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <span className="header-logo">
            <svg viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="7" fill="var(--accent-blue)"/><path d="M8 9h4v10H8V9zm5 0h2l4 10h-2.5l-0.8-2.2h-3.8L11 19h-.5L13 9zm1 1.8L12.6 15h2.8L14 10.8z" fill="white"/></svg>
            <span className="header-logo-text">LoanFlow</span><span className="header-logo-version">LOP</span>
          </span>
        </div>
        <nav className="header-nav">
          {([{id:'dashboard' as View,label:'Dashboard'},{id:'followups' as View,label:`Follow-ups${overdueFU.length?` (${overdueFU.length})`:''}`},{id:'kanban' as View,label:'Kanban'},{id:'reports' as View,label:'Reports'}]).map(i => (
            <button key={i.id} className={`header-nav-item ${view===i.id?'active':''}`} onClick={()=>setView(i.id)}>{i.label}</button>
          ))}
        </nav>
        <div className="header-right">
          <span className="header-user">{userName}</span>
          <button className="theme-toggle" onClick={toggleTheme}><div className="theme-toggle-knob">{isDark?MoonIcon:SunIcon}</div></button>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-content">

        {/* ═══ DASHBOARD ═══ */}
        {view === 'dashboard' && (<>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-label">Active Loans</div><div className="stat-value">{activeLoans.length}</div></div>
            <div className="stat-card"><div className="stat-label">Pipeline Value</div><div className="stat-value">${(pipelineValue/1e6).toFixed(1)}M</div></div>
            <div className="stat-card"><div className="stat-label">Overdue Follow-ups</div><div className="stat-value" style={{color:overdueFU.length?'var(--accent-red)':undefined}}>{overdueFU.length}</div></div>
            <div className="stat-card"><div className="stat-label">Today&apos;s Follow-ups</div><div className="stat-value" style={{color:todayFU.length?'var(--accent-amber)':undefined}}>{todayFU.length}</div></div>
            <div className="stat-card"><div className="stat-label">Pending Tasks</div><div className="stat-value">{tasks.length}</div></div>
          </div>

          {/* Loans needing docs */}
          {(() => {
            const loansWithMissing = activeLoans.filter(l => getMissingDocs(l.id).length > 0).slice(0,5)
            if (loansWithMissing.length === 0) return null
            return (
              <div className="panel">
                <div className="panel-header"><span className="panel-title" style={{color:'var(--accent-amber)'}}>Missing Documents</span></div>
                <div style={{padding:10,display:'flex',flexDirection:'column',gap:6}}>
                  {loansWithMissing.map(loan => {
                    const missing = getMissingDocs(loan.id)
                    return (
                      <div key={loan.id} className="card card-warn" onClick={()=>openLoan(loan)} style={{cursor:'pointer'}}>
                        <div className="card-body">
                          <div className="card-row"><div><div className="card-title">{loan.borrower_name} #{loan.loan_number}</div><div className="card-sub">{loan.loan_type} · ${loan.amount.toLocaleString()} · <span className="badge-stage" style={{background:STAGE_COLORS[loan.stage]?.bg,color:STAGE_COLORS[loan.stage]?.text,marginLeft:2}}>{loan.stage}</span></div></div><span className="badge badge-high">{missing.length} missing</span></div>
                          <div style={{display:'flex',gap:12,marginTop:4,fontSize:'.72rem',color:'var(--text-tertiary)'}}>
                            <span>Close: {new Date(loan.close_date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>
                            <span>{(() => { const d=Math.ceil((new Date(loan.close_date).getTime()-Date.now())/(1000*60*60*24)); return d<0?`${Math.abs(d)}d overdue`:d===0?'Closing today':`${d}d remaining` })()}</span>
                          </div>
                          <div className="card-highlight warn">{missing.slice(0,4).map(d => d.document_type).join(', ')}{missing.length > 4 ? `, +${missing.length-4} more` : ''}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}

          {/* Pipeline table */}
          <div className="panel">
            <div className="panel-header"><span className="panel-title">Loan Pipeline</span><span className="panel-count">{filteredLoans.length} of {loans.length} loans</span></div>
            <div style={{padding:'10px 14px',display:'flex',gap:6,flexWrap:'wrap',alignItems:'center',borderBottom:'1px solid var(--border-color)'}}>
              <div style={{display:'flex',alignItems:'center',gap:5,background:'var(--bg-tertiary)',border:'1px solid var(--border-color)',borderRadius:'var(--radius-sm)',padding:'4px 8px',minWidth:180}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" style={{width:13,height:13,flexShrink:0}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input placeholder="Search borrower..." value={pipelineSearch} onChange={e=>setPipelineSearch(e.target.value)} style={{border:'none',outline:'none',background:'transparent',fontFamily:'inherit',fontSize:'.75rem',color:'var(--text-primary)',width:'100%'}}/>
              </div>
              {['all',...LOAN_STAGES].map(s => (
                <button key={s} className={`btn btn-sm ${pipelineFilter===s?'btn-primary':'btn-secondary'}`} onClick={()=>setPipelineFilter(s)} style={{fontSize:'.68rem'}}>{s==='all'?'All':s.replace('Submitted to UW','Sub to UW').replace('Conditional Approval','Cond. Appr.')}</button>
              ))}
            </div>
            <div style={{overflowX:'auto'}}><table><thead><tr><th>#</th><th>Borrower</th><th>Type</th><th>Amount</th><th>Stage</th><th>Close Date</th><th>Days</th><th>Docs</th></tr></thead>
            <tbody>{filteredLoans.map(loan => {
              const missing = getMissingDocs(loan.id)
              const totalD = allDocs[loan.id]?.length || 0
              const recD = totalD - missing.length
              return (
                <tr key={loan.id} onClick={()=>openLoan(loan)}>
                  <td className="text-mono" style={{fontSize:'.75rem',color:'var(--accent-blue)'}}>{loan.loan_number}</td>
                  <td style={{fontWeight:600}}>{loan.borrower_name}</td><td>{loan.loan_type}</td>
                  <td className="text-mono" style={{fontWeight:600}}>${loan.amount.toLocaleString()}</td>
                  <td><span className="badge-stage" style={{background:STAGE_COLORS[loan.stage]?.bg,color:STAGE_COLORS[loan.stage]?.text}}>{loan.stage}</span></td>
                  <td style={{color:'var(--text-secondary)'}}>{new Date(loan.close_date).toLocaleDateString()}</td>
                  <td>{(() => { const d=Math.ceil((new Date(loan.close_date).getTime()-Date.now())/(1000*60*60*24)); return <span style={{fontSize:'.72rem',fontWeight:600,color:d<0?'var(--accent-red)':d<=7?'var(--accent-amber)':'var(--text-secondary)'}}>{d<0?`${Math.abs(d)}d over`:d===0?'Today':`${d}d`}</span> })()}</td>
                  <td>{totalD > 0 ? <span style={{fontSize:'.72rem',color:missing.length?'var(--accent-amber)':'var(--accent-green)'}}>{recD}/{totalD}</span> : <span style={{fontSize:'.72rem',color:'var(--text-tertiary)'}}>—</span>}</td>
                </tr>
              )
            })}</tbody></table></div>
          </div>
        </>)}

        {/* ═══ FOLLOW-UPS ═══ */}
        {view === 'followups' && (<>
          {([
            {title:'Overdue',items:overdueFU,color:'var(--accent-red)',dotColor:'var(--accent-red)',cls:'card-urgent'},
            {title:'Due Today',items:todayFU,color:'var(--accent-amber)',dotColor:'var(--accent-amber)',cls:'card-warn'},
            {title:'Upcoming',items:upcomingFU,color:'var(--accent-blue)',dotColor:'var(--accent-blue)',cls:'card-info'},
          ]).map(group => (
            <div key={group.title} className="followup-section">
              <div className="followup-section-title" style={{color:group.color}}><span className="dot" style={{background:group.dotColor}}/>{group.title} ({group.items.length})</div>
              {group.items.length === 0 ? <div className="empty-state" style={{padding:16}}>None</div> : (
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {group.items.map(fu => {
                    const loan = getLoan(fu.loan_id)
                    if (!loan) return null
                    const missing = getMissingDocs(loan.id)
                    return (
                      <div key={fu.id} className={`card ${group.cls}`}>
                        <div className="card-body">
                          <div className="card-row">
                            <div>
                              <div className="card-title">{loan.borrower_name} #{loan.loan_number}</div>
                              <div className="card-sub">{loan.loan_type} · ${loan.amount.toLocaleString()} · Close: {new Date(loan.close_date).toLocaleDateString('en-US',{month:'short',day:'numeric'})} · Due: {new Date(fu.due_date).toLocaleDateString()}</div>
                            </div>
                            <span className={`badge-contact ${fu.contact_type}`}>{fu.contact_type}</span>
                          </div>
                          <div className={`card-highlight ${group.title==='Overdue'?'urgent':group.title==='Due Today'?'warn':'info'}`}>
                            <strong>{fu.reason}</strong>
                            {missing.length > 0 && <div style={{marginTop:4,opacity:.85}}>Still missing: {missing.slice(0,3).map(d=>d.document_type).join(', ')}{missing.length>3?` +${missing.length-3} more`:''}</div>}
                          </div>
                          <div className="card-actions">
                            <button className="btn btn-success btn-sm" onClick={()=>markFUDone(fu.id)}>✓ Done</button>
                            <button className="btn btn-primary btn-sm" onClick={()=>openLoan(loan)}>Open Loan</button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </>)}

        {/* ═══ KANBAN ═══ */}
        {view === 'kanban' && (
          <div className="kanban">
            {LOAN_STAGES.map(stage => { const sl=loans.filter(l=>l.stage===stage); const c=STAGE_COLORS[stage]; return (
              <div className="kanban-col" key={stage}>
                <div className="kanban-col-header" style={{background:c.bg,color:c.text}}>{stage.replace('Submitted to UW','Sub to UW').replace('Conditional Approval','Cond. Appr.')}<span className="kcount" style={{background:c.dot}}>{sl.length}</span></div>
                <div className="kanban-col-body">
                  {sl.length===0 ? <div className="kanban-empty">Empty</div> : sl.map(loan => (
                    <div className="kanban-card" key={loan.id} onClick={()=>openLoan(loan)}>
                      <div className="kanban-card-name">{loan.borrower_name}</div>
                      <div className="kanban-card-meta">#{loan.loan_number} · ${(loan.amount/1000).toFixed(0)}k</div>
                      <div className="kanban-card-meta">{loan.loan_type} · {new Date(loan.close_date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
                    </div>
                  ))}
                </div>
              </div>
            )})}
          </div>
        )}

        {/* ═══ REPORTS ═══ */}
        {view === 'reports' && (<>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-label">Total Loans</div><div className="stat-value">{loans.length}</div></div>
            <div className="stat-card"><div className="stat-label">Active Pipeline</div><div className="stat-value">{activeLoans.length}</div></div>
            <div className="stat-card"><div className="stat-label">Pipeline Value</div><div className="stat-value">${(pipelineValue/1e6).toFixed(1)}M</div></div>
            <div className="stat-card"><div className="stat-label">Closed</div><div className="stat-value" style={{color:'var(--accent-green)'}}>{loans.filter(l=>l.stage==='Closed').length}</div></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <div className="panel">
              <div className="panel-header"><span className="panel-title">Loans by Stage</span></div>
              <div style={{padding:14}}>
                <div className="chart-bar-container">
                  {stageDistribution.map(s => { const max=Math.max(...stageDistribution.map(x=>x.count),1); return (
                    <div className="chart-bar-wrap" key={s.stage}><div className="chart-bar-val">{s.count}</div><div className="chart-bar" style={{height:`${(s.count/max)*100}%`,minHeight:4,background:STAGE_COLORS[s.stage]?.dot||'var(--accent-blue)'}}/></div>
                  )})}
                </div>
                <div className="chart-labels">{stageDistribution.map(s=><div className="chart-label" key={s.stage}>{s.stage.replace('Submitted to UW','UW').replace('Conditional Approval','Cond.').replace('Clear to Close','CTC')}</div>)}</div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-header"><span className="panel-title">Loans by Type</span></div>
              <div style={{padding:14}}>
                {typeDistribution.map(t => (
                  <div key={t.type} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                    <span style={{width:75,fontSize:'.75rem',fontWeight:500}}>{t.type}</span>
                    <div style={{flex:1,height:7,background:'var(--bg-tertiary)',borderRadius:4,overflow:'hidden'}}><div style={{width:`${(t.count/Math.max(loans.length,1))*100}%`,height:'100%',background:'var(--accent-blue)',borderRadius:4}}/></div>
                    <span className="text-mono" style={{fontSize:'.7rem',color:'var(--text-tertiary)',width:65,textAlign:'right'}}>{t.count} · ${(t.value/1e6).toFixed(1)}M</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>)}
      </main>

      {/* ═══ LOAN DETAIL MODAL ═══ */}
      {selectedLoan && (
        <div className="modal-overlay" onClick={()=>setSelectedLoan(null)}>
          <div className="modal-panel" onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <div><div className="modal-head-title">{selectedLoan.borrower_name} #{selectedLoan.loan_number}</div><div className="modal-head-sub">{selectedLoan.loan_type} · ${selectedLoan.amount.toLocaleString()} · Close: {new Date(selectedLoan.close_date).toLocaleDateString()}</div></div>
              <button className="modal-close" onClick={()=>setSelectedLoan(null)}>{CloseIcon}</button>
            </div>
            <div className="modal-tabs">
              {['details','documents','notes','follow-ups'].map(t => <button key={t} className={`modal-tab ${modalTab===t?'active':''}`} onClick={()=>setModalTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
            </div>
            <div className="modal-body">

              {/* Details */}
              {modalTab === 'details' && (<>
                <div className="field" style={{marginBottom:14}}>
                  <div className="field-label">Change Stage</div>
                  <select className="field-input" value={selectedLoan.stage} onChange={e=>changeStage(selectedLoan.id, e.target.value as LoanStage)}>
                    {LOAN_STAGES.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="info-grid">
                  <div><div className="field-label">Loan #</div><div className="field-value text-mono">{selectedLoan.loan_number}</div></div>
                  <div><div className="field-label">Borrower</div><div className="field-value">{selectedLoan.borrower_name}</div></div>
                  <div><div className="field-label">Type</div><div className="field-value">{selectedLoan.loan_type}</div></div>
                  <div><div className="field-label">Amount</div><div className="field-value text-mono">${selectedLoan.amount.toLocaleString()}</div></div>
                  <div><div className="field-label">Close Date</div><div className="field-value">{new Date(selectedLoan.close_date).toLocaleDateString()}</div></div>
                  <div><div className="field-label">Stage</div><div className="field-value"><span className="badge-stage" style={{background:STAGE_COLORS[selectedLoan.stage]?.bg,color:STAGE_COLORS[selectedLoan.stage]?.text}}>{selectedLoan.stage}</span></div></div>
                </div>
              </>)}

              {/* Documents */}
              {modalTab === 'documents' && (<>
                <div className="doc-progress">
                  <div className="doc-progress-bar"><div className="doc-progress-fill" style={{width:`${totalDocsCount?(receivedCount/totalDocsCount)*100:0}%`,background:receivedCount===totalDocsCount?'var(--accent-green)':'var(--accent-blue)'}}/></div>
                  <div className="doc-progress-text">{receivedCount}/{totalDocsCount} received</div>
                </div>
                <div className="doc-list">
                  {loanDocs.map(doc => (
                    <div key={doc.id} className={`doc-item ${doc.received?'received':'missing'}`} onClick={()=>toggleDoc(doc.id,doc.received)}>
                      <div className="doc-check">{doc.received && CheckSm}</div>
                      <span>{doc.document_type}</span>
                      {doc.received && doc.received_date && <span style={{marginLeft:'auto',fontSize:'.65rem',color:'var(--text-tertiary)'}}>{new Date(doc.received_date).toLocaleDateString()}</span>}
                    </div>
                  ))}
                </div>
              </>)}

              {/* Notes */}
              {modalTab === 'notes' && (<>
                <div style={{display:'flex',gap:6,marginBottom:14}}>
                  <select className="field-input" style={{width:110,flexShrink:0}} value={noteContact} onChange={e=>setNoteContact(e.target.value as ContactType)}>{CONTACT_TYPES.map(c=><option key={c} value={c}>{c}</option>)}</select>
                  <input className="field-input" placeholder="Add a note..." value={newNote} onChange={e=>setNewNote(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addNote()}/>
                  <button className="btn btn-primary" onClick={addNote}>{SendIcon}</button>
                </div>
                {loanNotes.length===0 ? <div className="empty-state">No notes yet</div> : loanNotes.map(note => (
                  <div key={note.id} className={`note-item ${note.contact_type}`}>
                    <div className="note-head">
                      <span className={`note-tag ${note.contact_type}`}>{note.contact_type}</span>
                      <div style={{display:'flex',gap:4,alignItems:'center'}}>
                        <span className="note-date">{new Date(note.created_at).toLocaleString()}</span>
                        {editingNote !== note.id && <button className="btn btn-ghost btn-sm" style={{padding:'1px 4px',fontSize:'.6rem'}} onClick={()=>startEditNote(note)}>Edit</button>}
                        <button className="btn btn-ghost btn-sm" style={{padding:'1px 4px',fontSize:'.6rem',color:'var(--accent-red)'}} onClick={()=>deleteNote(note.id)}>×</button>
                      </div>
                    </div>
                    {editingNote === note.id ? (
                      <div style={{display:'flex',gap:4,marginTop:4}}>
                        <input className="field-input" value={editNoteText} onChange={e=>setEditNoteText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&saveEditNote(note.id)} autoFocus/>
                        <button className="btn btn-primary btn-sm" onClick={()=>saveEditNote(note.id)}>Save</button>
                        <button className="btn btn-ghost btn-sm" onClick={()=>setEditingNote(null)}>Cancel</button>
                      </div>
                    ) : (
                      <div className="note-body">{note.content}</div>
                    )}
                  </div>
                ))}
              </>)}

              {/* Follow-ups */}
              {modalTab === 'follow-ups' && (<>
                <div style={{marginBottom:14,padding:12,background:'var(--bg-tertiary)',borderRadius:'var(--radius-md)'}}>
                  <div className="field-label" style={{marginBottom:6}}>Schedule Follow-up</div>
                  <div className="followup-form">
                    <select className="field-input" style={{width:110,flex:'none'}} value={fuContact} onChange={e=>setFuContact(e.target.value as ContactType)}>{CONTACT_TYPES.map(c=><option key={c} value={c}>{c}</option>)}</select>
                    <input className="field-input" placeholder="Reason / what to follow up on..." value={fuReason} onChange={e=>setFuReason(e.target.value)}/>
                  </div>
                  <div style={{display:'flex',gap:6,alignItems:'center'}}>
                    <input type="date" className="field-input" style={{width:150,flex:'none'}} value={fuDate} onChange={e=>setFuDate(e.target.value)}/>
                    <button className="btn btn-secondary btn-sm" onClick={()=>quickFU(2)}>+2 days</button>
                    <button className="btn btn-secondary btn-sm" onClick={()=>quickFU(4)}>+4 days</button>
                    <button className="btn btn-secondary btn-sm" onClick={()=>quickFU(7)}>+1 week</button>
                    <button className="btn btn-primary btn-sm" onClick={addFollowUp} disabled={!fuReason.trim()||!fuDate}>Add</button>
                  </div>
                </div>

                {loanFollowUps.length===0 ? <div className="empty-state">No follow-ups scheduled</div> : loanFollowUps.map(fu => {
                  const isOverdue = new Date(fu.due_date) < today && fu.status==='pending'
                  const isDueToday = new Date(fu.due_date).toDateString()===today.toDateString() && fu.status==='pending'
                  return (
                    <div key={fu.id} className={`card ${isOverdue?'card-urgent':isDueToday?'card-warn':'card-info'}`} style={{marginBottom:6}}>
                      <div className="card-body">
                        <div className="card-row">
                          <div><div className="card-title">{fu.reason}</div><div className="card-sub">Due: {new Date(fu.due_date).toLocaleDateString()}</div></div>
                          <div style={{display:'flex',gap:4,alignItems:'center'}}>
                            <span className={`badge-contact ${fu.contact_type}`}>{fu.contact_type}</span>
                            {fu.status==='pending' ? <span className="badge badge-high">{isOverdue?'Overdue':isDueToday?'Today':'Upcoming'}</span> : <span className="badge badge-low">Done</span>}
                          </div>
                        </div>
                        {fu.status==='pending' && <div className="card-actions"><button className="btn btn-success btn-sm" onClick={()=>markFUDone(fu.id)}>✓ Done</button></div>}
                      </div>
                    </div>
                  )
                })}
              </>)}
            </div>
            <div className="modal-footer"><div/><button className="btn btn-secondary" onClick={()=>setSelectedLoan(null)}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
