'use client'

import { useState, useEffect } from 'react'
import { supabase, type Loan, type Task, LOAN_STAGES } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LODashboard() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [isDark, setIsDark] = useState(false)
  const router = useRouter()

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    const saved = localStorage.getItem('loanflow-theme')
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true); document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const next = !isDark; setIsDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
    localStorage.setItem('loanflow-theme', next ? 'dark' : 'light')
  }

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase.from('users').select('name, role').eq('id', user.id).single()
      if (profile?.role !== 'LO') { router.push('/login'); return }
      setUserName(profile.name)

      const { data: loansData } = await supabase.from('loans').select('*').eq('assigned_lo_id', user.id).order('close_date', { ascending: true })
      setLoans(loansData || [])

      const loanIds = (loansData || []).map(l => l.id)
      if (loanIds.length > 0) {
        const { data: tasksData } = await supabase.from('tasks').select('*').eq('status', 'pending').in('loan_id', loanIds)
        setTasks(tasksData || [])
      }
      setLoading(false)
    } catch (error) { console.error(error); setLoading(false) }
  }

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login') }

  const activeLoans = loans.filter(l => l.stage !== 'Closed')
  const pipelineValue = activeLoans.reduce((s, l) => s + l.amount, 0)

  const closingThisWeek = loans.filter(l => {
    const cd = new Date(l.close_date); const t = new Date(); const nw = new Date(t); nw.setDate(nw.getDate() + 7)
    return cd >= t && cd < nw && l.stage !== 'Closed'
  })

  const closingThisMonth = loans.filter(l => {
    const cd = new Date(l.close_date); const t = new Date()
    return cd.getMonth() === t.getMonth() && cd.getFullYear() === t.getFullYear() && l.stage !== 'Closed'
  })

  const loansNeedingAttention = loans.filter(l => {
    const hasUrgent = tasks.some(t => t.loan_id === l.id && t.priority === 'urgent')
    return hasUrgent || l.stage === 'Conditional Approval'
  })

  const loansByStage = Object.fromEntries(LOAN_STAGES.map(s => [s, loans.filter(l => l.stage === s).length]))

  if (loading) return <div className="loading-screen">Loading dashboard...</div>

  return (
    <div className="app-wrapper">
      <header className="header">
        <div className="header-left">
          <span className="header-logo">
            <svg viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="7" fill="var(--accent-blue)"/><path d="M8 9h4v10H8V9zm5 0h2l4 10h-2.5l-0.8-2.2h-3.8L11 19h-.5L13 9zm1 1.8L12.6 15h2.8L14 10.8z" fill="white"/></svg>
            <span className="header-logo-text">LoanFlow</span>
            <span className="header-logo-version">LO</span>
          </span>
        </div>
        <div className="header-right">
          <span className="header-user">Welcome, {userName}</span>
          <button className="theme-toggle" onClick={toggleTheme}>
            <div className="theme-toggle-knob">
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              )}
            </div>
          </button>
          <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        {/* Stats */}
        <section className="stats-row">
          <div className="stat-card"><div className="stat-card-header"><span className="stat-card-label">Pipeline Value</span><div className="stat-card-icon blue"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div></div><div className="stat-card-value">${(pipelineValue / 1000000).toFixed(1)}M</div></div>
          <div className="stat-card"><div className="stat-card-header"><span className="stat-card-label">Active Loans</span><div className="stat-card-icon purple"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div></div><div className="stat-card-value">{activeLoans.length}</div></div>
          <div className="stat-card"><div className="stat-card-header"><span className="stat-card-label">Closing This Week</span><div className="stat-card-icon green"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg></div></div><div className="stat-card-value" style={{ color: 'var(--accent-green)' }}>{closingThisWeek.length}</div></div>
          <div className="stat-card"><div className="stat-card-header"><span className="stat-card-label">Closing This Month</span><div className="stat-card-icon amber"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div></div><div className="stat-card-value">{closingThisMonth.length}</div></div>
        </section>

        {/* Needs Attention */}
        <div className="table-container">
          <div className="table-header-bar">
            <div><span className="table-title">Needs Your Attention</span><span className="table-count">Loans with urgent items or conditional approval</span></div>
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {loansNeedingAttention.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-tertiary)' }}>All loans are on track! 🎉</div>
            ) : loansNeedingAttention.map(loan => {
              const loanTasks = tasks.filter(t => t.loan_id === loan.id && t.priority === 'urgent')
              return (
                <div key={loan.id} className="card card-warn">
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div className="card-title">{loan.borrower_name}</div>
                        <div className="card-subtitle">#{loan.loan_number} · {loan.loan_type} · ${loan.amount.toLocaleString()}</div>
                      </div>
                      <span className="badge badge-high">{loan.stage}</span>
                    </div>
                    {loanTasks.length > 0 && (
                      <div className="card-highlight warn" style={{ marginTop: 10 }}>
                        <strong>{loanTasks.length} urgent {loanTasks.length === 1 ? 'task' : 'tasks'}</strong>
                        {loanTasks.map(t => <div key={t.id} style={{ marginTop: 4 }}>• {t.title}</div>)}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pipeline Overview */}
        <div className="table-container">
          <div className="table-header-bar"><span className="table-title">Pipeline Overview</span></div>
          <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {Object.entries(loansByStage).map(([stage, count]) => (
              <div key={stage} style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{stage}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing This Week */}
        {closingThisWeek.length > 0 && (
          <div className="table-container">
            <div className="table-header-bar"><span className="table-title">Closing This Week</span></div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {closingThisWeek.map(loan => (
                <div key={loan.id} className="card card-success">
                  <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="card-title">{loan.borrower_name}</div>
                      <div className="card-subtitle">#{loan.loan_number} · ${loan.amount.toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{new Date(loan.close_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{loan.stage}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
