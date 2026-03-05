'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, type Loan, type Task, LOAN_STAGES, STAGE_COLORS } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LODashboard() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [isDark, setIsDark] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const s = localStorage.getItem('loanflow-theme')
    if (s === 'dark' || (!s && window.matchMedia('(prefers-color-scheme: dark)').matches)) { setIsDark(true); document.documentElement.setAttribute('data-theme', 'dark') }
  }, [])
  const toggleTheme = () => { const n = !isDark; setIsDark(n); document.documentElement.setAttribute('data-theme', n ? 'dark' : 'light'); localStorage.setItem('loanflow-theme', n ? 'dark' : 'light') }

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data: profile } = await supabase.from('users').select('name, role').eq('id', user.id).single()
    if (profile?.role !== 'LO') { router.push('/login'); return }
    setUserName(profile.name)
    const { data: l } = await supabase.from('loans').select('*').eq('assigned_lo_id', user.id).order('close_date', { ascending: true })
    setLoans(l || [])
    const ids = (l || []).map(x => x.id)
    if (ids.length) { const { data: t } = await supabase.from('tasks').select('*').eq('status', 'pending').in('loan_id', ids); setTasks(t || []) }
    setLoading(false)
  }, [router])
  useEffect(() => { loadData() }, [loadData])

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login') }

  const active = loans.filter(l => l.stage !== 'Closed')
  const pv = active.reduce((s, l) => s + l.amount, 0)
  const closingWeek = loans.filter(l => { const c = new Date(l.close_date), t = new Date(), w = new Date(t); w.setDate(w.getDate() + 7); return c >= t && c < w && l.stage !== 'Closed' })
  const closingMonth = loans.filter(l => { const c = new Date(l.close_date), t = new Date(); return c.getMonth() === t.getMonth() && c.getFullYear() === t.getFullYear() && l.stage !== 'Closed' })
  const attention = loans.filter(l => tasks.some(t => t.loan_id === l.id && t.priority === 'urgent') || l.stage === 'Conditional Approval')
  const byStage = Object.fromEntries(LOAN_STAGES.map(s => [s, loans.filter(l => l.stage === s).length]))

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <svg viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="7" fill="var(--accent-blue)"/><path d="M8 9h4v10H8V9zm5 0h2l4 10h-2.5l-0.8-2.2h-3.8L11 19h-.5L13 9zm1 1.8L12.6 15h2.8L14 10.8z" fill="white"/></svg>
          <span className="sidebar-logo-text">LoanFlow</span>
          <span className="sidebar-logo-badge">LO</span>
        </div>
        <nav className="sidebar-nav">
          <button className="sidebar-item active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> Dashboard</button>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user"><strong>{userName}</strong>Loan Officer</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button className="theme-toggle" onClick={toggleTheme}><div className="theme-toggle-knob">{isDark ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>}</div></button>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Logout</button>
          </div>
        </div>
      </aside>

      <div className="main-content">
        <div className="topbar"><div className="topbar-title">Loan Officer Dashboard</div></div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-label">Pipeline Value</div><div className="stat-value">${(pv/1e6).toFixed(1)}M</div></div>
          <div className="stat-card"><div className="stat-label">Active Loans</div><div className="stat-value">{active.length}</div></div>
          <div className="stat-card"><div className="stat-label">Closing This Week</div><div className="stat-value" style={{ color: 'var(--accent-green)' }}>{closingWeek.length}</div></div>
          <div className="stat-card"><div className="stat-label">Closing This Month</div><div className="stat-value">{closingMonth.length}</div></div>
        </div>

        {attention.length > 0 && (
          <div className="panel" style={{ marginBottom: 16 }}>
            <div className="panel-header"><span className="panel-title" style={{ color: 'var(--accent-amber)' }}>Needs Attention</span></div>
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {attention.map(loan => { const ut = tasks.filter(t => t.loan_id === loan.id && t.priority === 'urgent'); return (
                <div key={loan.id} className="card card-warn"><div className="card-body">
                  <div className="card-row"><div><div className="card-title">{loan.borrower_name}</div><div className="card-sub">#{loan.loan_number} · {loan.loan_type} · ${loan.amount.toLocaleString()}</div></div><span className="badge badge-high">{loan.stage}</span></div>
                  {ut.length > 0 && <div className="card-highlight warn"><strong>{ut.length} urgent task{ut.length > 1 ? 's' : ''}</strong>{ut.map(t => <div key={t.id}>• {t.title}</div>)}</div>}
                </div></div>
              )})}
            </div>
          </div>
        )}

        <div className="panel" style={{ marginBottom: 16 }}>
          <div className="panel-header"><span className="panel-title">Pipeline Overview</span></div>
          <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
            {Object.entries(byStage).map(([s, c]) => (
              <div key={s} style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: 3 }}>{s}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{c}</div>
              </div>
            ))}
          </div>
        </div>

        {closingWeek.length > 0 && (
          <div className="panel">
            <div className="panel-header"><span className="panel-title">Closing This Week</span></div>
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {closingWeek.map(loan => (
                <div key={loan.id} className="card card-success"><div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><div className="card-title">{loan.borrower_name}</div><div className="card-sub">#{loan.loan_number} · ${loan.amount.toLocaleString()}</div></div>
                  <div style={{ textAlign: 'right' }}><div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{new Date(loan.close_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div><div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>{loan.stage}</div></div>
                </div></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
