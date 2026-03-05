'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, type Loan, type Task, type LoanNote, type LoanDocument, LOAN_STAGES, STAGE_COLORS, LOAN_TYPE_DOCUMENTS, CONTACT_TYPES, PRIORITY_COLORS, type LoanStage, type ContactType } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

// ── SVG Icons ──
const IC: Record<string, JSX.Element> = {
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  tasks: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  kanban: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg>,
  chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>,
  sun: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  alert: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  file: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  dollar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  send: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
}

type View = 'dashboard' | 'tasks' | 'kanban' | 'reports'

export default function LOPDashboard() {
  const [view, setView] = useState<View>('dashboard')
  const [loans, setLoans] = useState<Loan[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const [isDark, setIsDark] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [modalTab, setModalTab] = useState('details')
  const [loanDocs, setLoanDocs] = useState<LoanDocument[]>([])
  const [loanNotes, setLoanNotes] = useState<LoanNote[]>([])
  const [newNote, setNewNote] = useState('')
  const [noteContact, setNoteContact] = useState<ContactType>('Client')
  const router = useRouter()

  // ── Theme ──
  useEffect(() => {
    const s = localStorage.getItem('loanflow-theme')
    if (s === 'dark' || (!s && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true); document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])
  const toggleTheme = () => { const n = !isDark; setIsDark(n); document.documentElement.setAttribute('data-theme', n ? 'dark' : 'light'); localStorage.setItem('loanflow-theme', n ? 'dark' : 'light') }

  // ── Load data ──
  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUserId(user.id)
    const { data: profile } = await supabase.from('users').select('name, role').eq('id', user.id).single()
    if (profile?.role !== 'LOP') { router.push('/login'); return }
    setUserName(profile.name)
    const { data: l } = await supabase.from('loans').select('*').order('close_date', { ascending: true })
    setLoans(l || [])
    const { data: t } = await supabase.from('tasks').select('*').eq('status', 'pending').order('due_date', { ascending: true })
    setTasks(t || [])
    setLoading(false)
  }, [router])
  useEffect(() => { loadData() }, [loadData])

  // ── Task helpers ──
  const today = new Date(); today.setHours(0,0,0,0)
  const soon = new Date(today); soon.setDate(soon.getDate() + 2)
  const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7)
  const urgentTasks = tasks.filter(t => new Date(t.due_date) < soon)
  const weekTasks = tasks.filter(t => { const d = new Date(t.due_date); return d >= today && d < nextWeek && !urgentTasks.includes(t) })
  const getLoan = (id: string) => loans.find(l => l.id === id)
  const activeLoans = loans.filter(l => l.stage !== 'Closed')
  const pipelineValue = activeLoans.reduce((s, l) => s + l.amount, 0)

  const markComplete = async (taskId: string) => {
    await supabase.from('tasks').update({ status: 'complete' }).eq('id', taskId)
    loadData()
  }

  // ── Change loan stage ──
  const changeStage = async (loanId: string, newStage: LoanStage) => {
    await supabase.from('loans').update({ stage: newStage }).eq('id', loanId)
    if (selectedLoan && selectedLoan.id === loanId) setSelectedLoan({ ...selectedLoan, stage: newStage })
    loadData()
  }

  // ── Open loan detail ──
  const openLoan = async (loan: Loan) => {
    setSelectedLoan(loan); setModalTab('details')
    // Load docs
    const { data: docs } = await supabase.from('loan_documents').select('*').eq('loan_id', loan.id).order('document_type')
    if (docs && docs.length > 0) { setLoanDocs(docs) }
    else {
      // Initialize from defaults
      const defaults = LOAN_TYPE_DOCUMENTS[loan.loan_type] || LOAN_TYPE_DOCUMENTS['Conventional']
      const inserts = defaults.map(dt => ({ loan_id: loan.id, document_type: dt, required: true, received: false }))
      const { data: newDocs } = await supabase.from('loan_documents').insert(inserts).select()
      setLoanDocs(newDocs || [])
    }
    // Load notes
    const { data: notes } = await supabase.from('loan_notes').select('*').eq('loan_id', loan.id).order('created_at', { ascending: false })
    setLoanNotes(notes || [])
  }

  // ── Toggle document received ──
  const toggleDoc = async (docId: string, current: boolean) => {
    await supabase.from('loan_documents').update({ received: !current, received_date: !current ? new Date().toISOString() : null }).eq('id', docId)
    setLoanDocs(prev => prev.map(d => d.id === docId ? { ...d, received: !current, received_date: !current ? new Date().toISOString() : null } : d))
  }

  // ── Add note ──
  const addNote = async () => {
    if (!newNote.trim() || !selectedLoan) return
    const { data } = await supabase.from('loan_notes').insert({ loan_id: selectedLoan.id, user_id: userId, contact_type: noteContact, content: newNote.trim() }).select().single()
    if (data) setLoanNotes(prev => [data, ...prev])
    setNewNote('')
  }

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login') }

  if (loading) return <div className="loading">Loading dashboard...</div>

  const receivedCount = loanDocs.filter(d => d.received).length
  const totalDocs = loanDocs.length

  // ── Stages distribution for report ──
  const stageDistribution = LOAN_STAGES.map(s => ({ stage: s, count: loans.filter(l => l.stage === s).length }))
  const typeDistribution = ['Conventional', 'FHA', 'VA', 'USDA'].map(t => ({ type: t, count: loans.filter(l => l.loan_type === t).length, value: loans.filter(l => l.loan_type === t).reduce((s, l) => s + l.amount, 0) }))

  return (
    <div className="shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <svg viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="7" fill="var(--accent-blue)"/><path d="M8 9h4v10H8V9zm5 0h2l4 10h-2.5l-0.8-2.2h-3.8L11 19h-.5L13 9zm1 1.8L12.6 15h2.8L14 10.8z" fill="white"/></svg>
          <span className="sidebar-logo-text">LoanFlow</span>
          <span className="sidebar-logo-badge">LOP</span>
        </div>
        <nav className="sidebar-nav">
          {([
            { id: 'dashboard' as View, label: 'Dashboard', icon: IC.dashboard },
            { id: 'tasks' as View, label: 'Tasks', icon: IC.tasks, count: urgentTasks.length },
            { id: 'kanban' as View, label: 'Kanban', icon: IC.kanban },
            { id: 'reports' as View, label: 'Reports', icon: IC.chart },
          ]).map(item => (
            <button key={item.id} className={`sidebar-item ${view === item.id ? 'active' : ''}`} onClick={() => setView(item.id)}>
              {item.icon} {item.label}
              {item.count ? <span className="count">{item.count}</span> : null}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user"><strong>{userName}</strong>Loan Processor</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button className="theme-toggle" onClick={toggleTheme}><div className="theme-toggle-knob">{isDark ? IC.moon : IC.sun}</div></button>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>{IC.logout} Logout</button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main-content">

        {/* ═══ DASHBOARD VIEW ═══ */}
        {view === 'dashboard' && (<>
          <div className="topbar"><div className="topbar-title">Dashboard</div></div>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-label">Active Loans</div><div className="stat-value">{activeLoans.length}</div></div>
            <div className="stat-card"><div className="stat-label">Urgent Tasks</div><div className="stat-value" style={{ color: 'var(--accent-red)' }}>{urgentTasks.length}</div></div>
            <div className="stat-card"><div className="stat-label">Due This Week</div><div className="stat-value">{weekTasks.length}</div></div>
            <div className="stat-card"><div className="stat-label">Pipeline Value</div><div className="stat-value">${(pipelineValue / 1e6).toFixed(1)}M</div></div>
            <div className="stat-card"><div className="stat-label">Pending Tasks</div><div className="stat-value">{tasks.length}</div></div>
          </div>

          {/* Urgent cards */}
          {urgentTasks.length > 0 && (
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-header"><div className="panel-title" style={{ color: 'var(--accent-red)' }}>{IC.alert} Urgent Tasks</div></div>
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {urgentTasks.slice(0, 5).map(task => { const loan = getLoan(task.loan_id); if (!loan) return null; return (
                  <div key={task.id} className="card card-urgent" onClick={() => openLoan(loan)} style={{ cursor: 'pointer' }}>
                    <div className="card-body">
                      <div className="card-row"><div><div className="card-title">{loan.borrower_name} #{loan.loan_number}</div><div className="card-sub">{loan.loan_type} · ${loan.amount.toLocaleString()}</div></div><span className="badge badge-urgent">{task.priority.toUpperCase()}</span></div>
                      <div className="card-highlight urgent"><strong>{task.title}</strong>{task.description && <div style={{ marginTop: 3 }}>{task.description}</div>}</div>
                      <div className="card-actions"><button className="btn btn-success btn-sm" onClick={e => { e.stopPropagation(); markComplete(task.id) }}>✓ Complete</button></div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}

          {/* Pipeline table */}
          <div className="panel">
            <div className="panel-header"><span className="panel-title">Loan Pipeline</span><span className="panel-count">{loans.length} loans</span></div>
            <div style={{ overflowX: 'auto' }}><table><thead><tr><th>#</th><th>Borrower</th><th>Type</th><th>Amount</th><th>Stage</th><th>Close Date</th></tr></thead>
            <tbody>{loans.map(loan => (
              <tr key={loan.id} onClick={() => openLoan(loan)}>
                <td className="text-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-blue)' }}>{loan.loan_number}</td>
                <td style={{ fontWeight: 600 }}>{loan.borrower_name}</td>
                <td>{loan.loan_type}</td>
                <td className="text-mono" style={{ fontWeight: 600 }}>${loan.amount.toLocaleString()}</td>
                <td><span className="badge-stage" style={{ background: STAGE_COLORS[loan.stage]?.bg, color: STAGE_COLORS[loan.stage]?.text }}>{loan.stage}</span></td>
                <td style={{ color: 'var(--text-secondary)' }}>{new Date(loan.close_date).toLocaleDateString()}</td>
              </tr>
            ))}</tbody></table></div>
          </div>
        </>)}

        {/* ═══ TASKS VIEW ═══ */}
        {view === 'tasks' && (<>
          <div className="topbar"><div className="topbar-title">Tasks</div></div>
          {[
            { label: 'Urgent', items: urgentTasks, cls: 'card-urgent', badgeCls: 'badge-urgent' },
            { label: 'This Week', items: weekTasks, cls: 'card-warn', badgeCls: 'badge-high' },
          ].map(group => (
            <div key={group.label} style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 10, color: group.label === 'Urgent' ? 'var(--accent-red)' : 'var(--accent-amber)' }}>{group.label} ({group.items.length})</h3>
              {group.items.length === 0 ? <div className="empty-state">No {group.label.toLowerCase()} tasks!</div> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {group.items.map(task => { const loan = getLoan(task.loan_id); if (!loan) return null; return (
                    <div key={task.id} className={`card ${group.cls}`}>
                      <div className="card-body">
                        <div className="card-row"><div><div className="card-title">{loan.borrower_name} #{loan.loan_number}</div><div className="card-sub">{loan.loan_type} · ${loan.amount.toLocaleString()} · Close: {new Date(loan.close_date).toLocaleDateString()}</div></div><span className={`badge ${group.badgeCls}`}>{task.priority.toUpperCase()}</span></div>
                        <div className={`card-highlight ${group.label === 'Urgent' ? 'urgent' : 'warn'}`}><strong>{task.title}</strong>{task.description && <div style={{ marginTop: 3 }}>{task.description}</div>}</div>
                        <div className="card-meta">Due: {new Date(task.due_date).toLocaleDateString()}</div>
                        <div className="card-actions"><button className="btn btn-success btn-sm" onClick={() => markComplete(task.id)}>✓ Mark Complete</button><button className="btn btn-primary btn-sm" onClick={() => openLoan(loan)}>Open Loan</button></div>
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </div>
          ))}
        </>)}

        {/* ═══ KANBAN VIEW ═══ */}
        {view === 'kanban' && (<>
          <div className="topbar"><div className="topbar-title">Kanban Board</div></div>
          <div className="kanban">
            {LOAN_STAGES.map(stage => { const sl = loans.filter(l => l.stage === stage); const c = STAGE_COLORS[stage]; return (
              <div className="kanban-col" key={stage}>
                <div className="kanban-col-header" style={{ background: c.bg, color: c.text }}>{stage.replace('Submitted to UW', 'Sub to UW').replace('Conditional Approval', 'Cond. Appr.')}<span className="kcount" style={{ background: c.dot }}>{sl.length}</span></div>
                <div className="kanban-col-body">
                  {sl.length === 0 ? <div className="kanban-empty">Empty</div> : sl.map(loan => (
                    <div className="kanban-card" key={loan.id} onClick={() => openLoan(loan)}>
                      <div className="kanban-card-name">{loan.borrower_name}</div>
                      <div className="kanban-card-meta">#{loan.loan_number} · ${(loan.amount/1000).toFixed(0)}k</div>
                      <div className="kanban-card-meta">{loan.loan_type} · {new Date(loan.close_date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
                    </div>
                  ))}
                </div>
              </div>
            )})}
          </div>
        </>)}

        {/* ═══ REPORTS VIEW ═══ */}
        {view === 'reports' && (<>
          <div className="topbar"><div className="topbar-title">Reports</div></div>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-label">Total Loans</div><div className="stat-value">{loans.length}</div></div>
            <div className="stat-card"><div className="stat-label">Active Pipeline</div><div className="stat-value">{activeLoans.length}</div></div>
            <div className="stat-card"><div className="stat-label">Pipeline Value</div><div className="stat-value">${(pipelineValue / 1e6).toFixed(1)}M</div></div>
            <div className="stat-card"><div className="stat-label">Closed</div><div className="stat-value" style={{ color: 'var(--accent-green)' }}>{loans.filter(l => l.stage === 'Closed').length}</div></div>
            <div className="stat-card"><div className="stat-label">Pending Tasks</div><div className="stat-value">{tasks.length}</div></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="panel">
              <div className="panel-header"><span className="panel-title">Loans by Stage</span></div>
              <div style={{ padding: 16 }}>
                <div className="chart-bar-container">
                  {stageDistribution.map((s, i) => { const max = Math.max(...stageDistribution.map(x => x.count), 1); return (
                    <div className="chart-bar-wrap" key={s.stage}><div className="chart-bar-val">{s.count}</div><div className="chart-bar" style={{ height: `${(s.count / max) * 100}%`, minHeight: 4, background: STAGE_COLORS[s.stage]?.dot || 'var(--accent-blue)' }}/></div>
                  )})}
                </div>
                <div className="chart-labels">{stageDistribution.map(s => <div className="chart-label" key={s.stage} style={{ flex: 1 }}>{s.stage.replace('Submitted to UW','UW').replace('Conditional Approval','Cond.').replace('Clear to Close','CTC')}</div>)}</div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header"><span className="panel-title">Loans by Type</span></div>
              <div style={{ padding: 16 }}>
                {typeDistribution.map(t => (
                  <div key={t.type} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ width: 80, fontSize: '0.78rem', fontWeight: 500 }}>{t.type}</span>
                    <div style={{ flex: 1, height: 8, background: 'var(--bg-tertiary)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${(t.count / Math.max(loans.length, 1)) * 100}%`, height: '100%', background: 'var(--accent-blue)', borderRadius: 4, transition: 'width .5s ease' }}/>
                    </div>
                    <span className="text-mono" style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', width: 70, textAlign: 'right' }}>{t.count} · ${(t.value/1e6).toFixed(1)}M</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel" style={{ marginTop: 16 }}>
            <div className="panel-header"><span className="panel-title">Task Priority Breakdown</span></div>
            <div style={{ padding: 16, display: 'flex', gap: 20 }}>
              {(['urgent','high','medium','low'] as const).map(p => {
                const count = tasks.filter(t => t.priority === p).length
                return <div key={p} style={{ textAlign: 'center' }}><div style={{ fontSize: '1.2rem', fontWeight: 700, color: PRIORITY_COLORS[p] }}>{count}</div><div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{p}</div></div>
              })}
            </div>
          </div>
        </>)}
      </div>

      {/* ═══ LOAN DETAIL MODAL ═══ */}
      {selectedLoan && (
        <div className="modal-overlay" onClick={() => setSelectedLoan(null)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="modal-head-title">{selectedLoan.borrower_name} #{selectedLoan.loan_number}</div>
                <div className="modal-head-sub">{selectedLoan.loan_type} · ${selectedLoan.amount.toLocaleString()} · Close: {new Date(selectedLoan.close_date).toLocaleDateString()}</div>
              </div>
              <button className="modal-close" onClick={() => setSelectedLoan(null)}>{IC.close}</button>
            </div>

            <div className="modal-tabs">
              {['details', 'documents', 'notes'].map(t => (
                <button key={t} className={`modal-tab ${modalTab === t ? 'active' : ''}`} onClick={() => setModalTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
              ))}
            </div>

            <div className="modal-body">
              {/* Details Tab */}
              {modalTab === 'details' && (
                <>
                  <div className="field" style={{ marginBottom: 16 }}>
                    <div className="field-label">Change Stage</div>
                    <select className="field-input" value={selectedLoan.stage} onChange={e => changeStage(selectedLoan.id, e.target.value as LoanStage)}>
                      {LOAN_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="info-grid">
                    <div><div className="field-label">Loan Number</div><div className="field-value text-mono">{selectedLoan.loan_number}</div></div>
                    <div><div className="field-label">Borrower</div><div className="field-value">{selectedLoan.borrower_name}</div></div>
                    <div><div className="field-label">Loan Type</div><div className="field-value">{selectedLoan.loan_type}</div></div>
                    <div><div className="field-label">Amount</div><div className="field-value text-mono">${selectedLoan.amount.toLocaleString()}</div></div>
                    <div><div className="field-label">Close Date</div><div className="field-value">{new Date(selectedLoan.close_date).toLocaleDateString()}</div></div>
                    <div><div className="field-label">Current Stage</div><div className="field-value"><span className="badge-stage" style={{ background: STAGE_COLORS[selectedLoan.stage]?.bg, color: STAGE_COLORS[selectedLoan.stage]?.text }}>{selectedLoan.stage}</span></div></div>
                  </div>
                </>
              )}

              {/* Documents Tab */}
              {modalTab === 'documents' && (
                <>
                  <div className="doc-progress">
                    <div className="doc-progress-bar"><div className="doc-progress-fill" style={{ width: `${totalDocs ? (receivedCount / totalDocs) * 100 : 0}%`, background: receivedCount === totalDocs ? 'var(--accent-green)' : 'var(--accent-blue)' }}/></div>
                    <div className="doc-progress-text">{receivedCount}/{totalDocs} received</div>
                  </div>
                  <div className="doc-list">
                    {loanDocs.map(doc => (
                      <div key={doc.id} className={`doc-item ${doc.received ? 'received' : 'missing'}`} onClick={() => toggleDoc(doc.id, doc.received)}>
                        <div className="doc-check">{doc.received && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: 10, height: 10 }}><polyline points="20 6 9 17 4 12"/></svg>}</div>
                        <span>{doc.document_type}</span>
                        {doc.received && doc.received_date && <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>{new Date(doc.received_date).toLocaleDateString()}</span>}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Notes Tab */}
              {modalTab === 'notes' && (
                <>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <select className="field-input" style={{ width: 130, flexShrink: 0 }} value={noteContact} onChange={e => setNoteContact(e.target.value as ContactType)}>
                      {CONTACT_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input className="field-input" placeholder="Add a note..." value={newNote} onChange={e => setNewNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote()} />
                    <button className="btn btn-primary" onClick={addNote}>{IC.send}</button>
                  </div>
                  {loanNotes.length === 0 ? <div className="empty-state">No notes yet</div> : (
                    loanNotes.map(note => (
                      <div key={note.id} className={`note-item ${note.contact_type}`}>
                        <div className="note-head">
                          <span className={`note-tag ${note.contact_type}`}>{note.contact_type}</span>
                          <span className="note-date">{new Date(note.created_at).toLocaleString()}</span>
                        </div>
                        <div className="note-body">{note.content}</div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>

            <div className="modal-footer">
              <div />
              <button className="btn btn-secondary" onClick={() => setSelectedLoan(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
