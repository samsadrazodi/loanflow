'use client'

import { useState, useEffect } from 'react'
import { supabase, type Loan, type Task } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LODashboard() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setUserId(user.id)

      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select('name, role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'LO') {
        router.push('/login')
        return
      }

      setUserName(profile.name)

      // Load loans assigned to this LO
      const { data: loansData } = await supabase
        .from('loans')
        .select('*')
        .eq('assigned_lo_id', user.id)
        .order('close_date', { ascending: true })

      setLoans(loansData || [])

      // Load tasks (all tasks for visibility, but we'll filter for escalated ones)
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'pending')
        .in('loan_id', (loansData || []).map(l => l.id))

      setTasks(tasksData || [])
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Calculate metrics
  const totalPipelineValue = loans
    .filter(l => l.stage !== 'Closed')
    .reduce((sum, loan) => sum + loan.amount, 0)

  const closingThisWeek = loans.filter(loan => {
    const closeDate = new Date(loan.close_date)
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    return closeDate >= today && closeDate < nextWeek && loan.stage !== 'Closed'
  })

  const closingThisMonth = loans.filter(loan => {
    const closeDate = new Date(loan.close_date)
    const today = new Date()
    return (
      closeDate.getMonth() === today.getMonth() &&
      closeDate.getFullYear() === today.getFullYear() &&
      loan.stage !== 'Closed'
    )
  })

  const loansNeedingAttention = loans.filter(loan => {
    // Loans with high priority tasks
    const hasUrgentTasks = tasks.some(t => t.loan_id === loan.id && t.priority === 'urgent')
    return hasUrgentTasks || loan.stage === 'Conditional Approval'
  })

  const loansByStage = {
    'Application': loans.filter(l => l.stage === 'Application').length,
    'Processing': loans.filter(l => l.stage === 'Processing').length,
    'Submitted to UW': loans.filter(l => l.stage === 'Submitted to UW').length,
    'Conditional Approval': loans.filter(l => l.stage === 'Conditional Approval').length,
    'Clear to Close': loans.filter(l => l.stage === 'Clear to Close').length,
    'Closed': loans.filter(l => l.stage === 'Closed').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Loan Officer Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {userName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Pipeline Value</h3>
            <p className="text-3xl font-bold text-blue-600">
              ${(totalPipelineValue / 1000000).toFixed(1)}M
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Loans</h3>
            <p className="text-3xl font-bold text-gray-900">{loans.filter(l => l.stage !== 'Closed').length}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Closing This Week</h3>
            <p className="text-3xl font-bold text-green-600">{closingThisWeek.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Closing This Month</h3>
            <p className="text-3xl font-bold text-purple-600">{closingThisMonth.length}</p>
          </div>
        </div>

        {/* Loans Needing Attention */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Needs Your Attention</h2>
            <p className="text-sm text-gray-600">Loans with urgent items or in conditional approval</p>
          </div>
          <div className="p-6">
            {loansNeedingAttention.length === 0 ? (
              <p className="text-gray-500 text-center py-4">All loans are on track! 🎉</p>
            ) : (
              <div className="space-y-4">
                {loansNeedingAttention.map(loan => {
                  const loanTasks = tasks.filter(t => t.loan_id === loan.id)
                  const urgentTasks = loanTasks.filter(t => t.priority === 'urgent')

                  return (
                    <div key={loan.id} className="border-l-4 border-orange-500 bg-orange-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{loan.borrower_name}</h3>
                          <p className="text-sm text-gray-600">
                            #{loan.loan_number} • {loan.loan_type} • ${loan.amount.toLocaleString()}
                          </p>
                        </div>
                        <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded">
                          {loan.stage}
                        </span>
                      </div>
                      {urgentTasks.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-orange-900">
                            {urgentTasks.length} urgent {urgentTasks.length === 1 ? 'task' : 'tasks'}
                          </p>
                          <ul className="mt-1 space-y-1">
                            {urgentTasks.map(task => (
                              <li key={task.id} className="text-sm text-orange-700">• {task.title}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Pipeline Overview */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Pipeline Overview</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(loansByStage).map(([stage, count]) => (
                <div key={stage} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">{stage}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Closing This Week */}
        {closingThisWeek.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Closing This Week</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {closingThisWeek.map(loan => (
                  <div key={loan.id} className="border-l-4 border-green-500 bg-green-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{loan.borrower_name}</h3>
                        <p className="text-sm text-gray-600">
                          #{loan.loan_number} • ${loan.amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(loan.close_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-xs text-gray-500">{loan.stage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
