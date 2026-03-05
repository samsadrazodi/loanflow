'use client'

import { useState, useEffect } from 'react'
import { supabase, type Loan, type Task, LOAN_STAGES, STAGE_COLORS } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LOPDashboard() {
  const [activeTab, setActiveTab] = useState<'urgent' | 'week' | 'pipeline'>('urgent')
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
    const next = !isDark
    setIsDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
    localStorage.setItem('loanflow-theme', next ? 'dark' : 'light')
  }

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase.from('users').select('name, role').eq('id', user.id).single()
      if (profile?.role !== 'LOP') { router.push('/login'); return }
      setUserName(profile.name)

      const { data: loansData } = await supabase.from('loans').select('*').order('close_date', { ascending: true })
      setLoans(loansData || [])

      const { data: tasksData } = await supabase.from('tasks').select('*').eq('status', 'pending').order('due_date', { ascending: true })
      setTasks(tasksData || [])
      setLoading(false)
    } catch (error) { console.error(error); setLoading(false) }
  }

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login') }

  const markTaskComplete = async (taskId: string) => {
    await supabase.from('tasks').update({ status: 'complete' }).eq('id', taskId)
    loadData()
  }

  const today = new Date(); today.setHours(0,0,0,0)
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 2)
  const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7)

  const urgentTasks = tasks.filter(t => new Date(t.due_date) < tomorrow)
  const weekTasks = tasks.filter(t => { const d = new Date(t.due_date); return d >= today && d < nextWeek && !urgentTasks.includes(t) })
  const getLoan = (id: string) => loans.find(l => l.id === id)
  const activeLoans = loans.filter(l => l.stage !== 'Closed')

  if (loading) return <div className="loading-screen">Loading dashboard...</div>

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <span className="header-logo">
            <svg viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="7" fill="var(--accent-blue)"/><path d="M8 9h4v10H8V9zm5 0h2l4 10h-2.5l-0.8-2.2h-3.8L11 19h-.5L13 9zm1 1.8L12.6 15h2.8L14 10.8z" fill="white"/></svg>
            <span className="header-logo-text">LoanFlow</span>
            <span className="header-logo-version">LOP</span>
          </span>
        </div>
        <div className="header-right">
          <span className="header-user">Welcome, {userName}</span>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
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
          <div className="stat-card"><div className="stat-card-header"><span className="stat-card-label">Active Loans</span><div className="stat-card-icon blue"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div></div><div className="stat-card-value">{activeLoans.length}</div></div>
          <div className="stat-card"><div className="stat-card-header"><span className="stat-card-label">Urgent Tasks</span><div className="stat-card-icon red"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div></div><div className="stat-card-value" style={{ color: 'var(--accent-red)' }}>{urgentTasks.length}</div></div>
          <div className="stat-card"><div className="stat-card-header"><span className="stat-card-label">This Week</span><div className="stat-card-icon amber"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div></div><div className="stat-card-value">{weekTasks.length}</div></div>
          <div className="stat-card"><div className="stat-card-header"><span className="stat-card-label">Pipeline Value</span><div className="stat-card-icon green"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div></div><div className="stat-card-value">${(activeLoans.reduce((s, l) => s + l.amount, 0) / 1000000).toFixed(1)}M</div></div>
        </section>

        {/* Tabs */}
        <div className="tab-bar">
          <button className={`tab-item urgent ${activeTab === 'urgent' ? 'active' : ''}`} onClick={() => setActiveTab('urgent')}>Urgent ({urgentTasks.length})</button>
          <button className={`tab-item warn ${activeTab === 'week' ? 'active' : ''}`} onClick={() => setActiveTab('week')}>This Week ({weekTasks.length})</button>
          <button className={`tab-item ${activeTab === 'pipeline' ? 'active' : ''}`} onClick={() => setActiveTab('pipeline')}>Pipeline</button>
        </div>

        {/* Urgent */}
        {activeTab === 'urgent' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {urgentTasks.length === 0 ? (
              <div className="card"><div className="card-body" style={{ textAlign: 'center', padding: 32, color: 'var(--text-tertiary)' }}>No urgent tasks! 🎉</div></div>
            ) : urgentTasks.map(task => {
              const loan = getLoan(task.loan_id)
              if (!loan) return null
              return (
                <div key={task.id} className="card card-urgent">
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div className="card-title">{loan.borrower_name} #{loan.loan_number}</div>
                        <div className="card-subtitle">{loan.loan_type} · ${loan.amount.toLocaleString()} · Close: {new Date(loan.close_date).toLocaleDateString()}</div>
                      </div>
                      <span className="badge badge-urgent">{task.priority.toUpperCase()}</span>
                    </div>
                    <div className="card-highlight urgent">
                      <strong>{task.title}</strong>
                      {task.description && <div style={{ marginTop: 4, opacity: 0.85 }}>{task.description}</div>}
                    </div>
                    <div className="card-meta">Due: {new Date(task.due_date).toLocaleDateString()}</div>
                    <div className="card-actions">
                      <button className="btn btn-success" style={{ flex: 1 }} onClick={() => markTaskComplete(task.id)}>✓ Mark Complete</button>
                      <button className="btn btn-primary" style={{ flex: 1 }}>Call Borrower</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* This Week */}
        {activeTab === 'week' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {weekTasks.length === 0 ? (
              <div className="card"><div className="card-body" style={{ textAlign: 'center', padding: 32, color: 'var(--text-tertiary)' }}>No tasks this week!</div></div>
            ) : weekTasks.map(task => {
              const loan = getLoan(task.loan_id)
              if (!loan) return null
              return (
                <div key={task.id} className="card card-warn">
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div className="card-title">{loan.borrower_name} #{loan.loan_number}</div>
                        <div className="card-subtitle">{loan.loan_type} · ${loan.amount.toLocaleString()}</div>
                      </div>
                      <span className="badge badge-high">{new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <p style={{ fontSize: '0.84rem', margin: '10px 0 0', color: 'var(--text-secondary)' }}>{task.title}</p>
                    <div className="card-actions">
                      <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => markTaskComplete(task.id)}>✓ Mark Complete</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pipeline */}
        {activeTab === 'pipeline' && (
          <div>
            {LOAN_STAGES.map(stage => {
              const stageLoans = loans.filter(l => l.stage === stage)
              const colors = STAGE_COLORS[stage]
              return (
                <div className="pipeline-section" key={stage}>
                  <div className="pipeline-header" style={{ background: colors.bg, color: colors.text }}>
                    <h3>{stage}</h3>
                    <span className="pipeline-count" style={{ background: colors.border }}>{stageLoans.length}</span>
                  </div>
                  <div className="pipeline-body">
                    {stageLoans.length === 0 ? (
                      <div className="pipeline-empty">No loans in this stage</div>
                    ) : stageLoans.map(loan => (
                      <div className="pipeline-loan" key={loan.id}>
                        <div className="pipeline-loan-name">{loan.borrower_name} #{loan.loan_number}</div>
                        <div className="pipeline-loan-meta">{loan.loan_type} · ${loan.amount.toLocaleString()} · Close: {new Date(loan.close_date).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
