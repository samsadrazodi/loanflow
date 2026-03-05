'use client'

import { useState, useEffect } from 'react'
import { supabase, type Loan, type Task } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LOPDashboard() {
  const [activeTab, setActiveTab] = useState<'urgent' | 'week' | 'pipeline'>('urgent')
  const [loans, setLoans] = useState<Loan[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
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

      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select('name, role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'LOP') {
        router.push('/login')
        return
      }

      setUserName(profile.name)

      // Load loans
      const { data: loansData } = await supabase
        .from('loans')
        .select('*')
        .order('close_date', { ascending: true })

      setLoans(loansData || [])

      // Load tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'pending')
        .order('due_date', { ascending: true })

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

  const markTaskComplete = async (taskId: string) => {
    await supabase
      .from('tasks')
      .update({ status: 'complete' })
      .eq('id', taskId)
    
    loadData()
  }

  // Get urgent tasks (due today or overdue)
  const urgentTasks = tasks.filter(task => {
    const dueDate = new Date(task.due_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 2)
    return dueDate < tomorrow
  })

  // Get this week tasks
  const thisWeekTasks = tasks.filter(task => {
    const dueDate = new Date(task.due_date)
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    return dueDate >= today && dueDate < nextWeek && !urgentTasks.includes(task)
  })

  const getLoanById = (loanId: string) => loans.find(l => l.id === loanId)

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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LOP Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {userName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-6 py-3 bg-gray-50 rounded-lg px-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{loans.length}</div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{urgentTasks.length}</div>
              <div className="text-xs text-gray-500">Urgent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{thisWeekTasks.length}</div>
              <div className="text-xs text-gray-500">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {loans.filter(l => l.stage !== 'Closed').length}
              </div>
              <div className="text-xs text-gray-500">On Track</div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-[140px] z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('urgent')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'urgent'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Urgent ({urgentTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('week')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'week'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              This Week ({thisWeekTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'pipeline'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Urgent Tab */}
        {activeTab === 'urgent' && (
          <div className="space-y-4">
            {urgentTasks.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                No urgent tasks! 🎉
              </div>
            ) : (
              urgentTasks.map(task => {
                const loan = getLoanById(task.loan_id)
                if (!loan) return null

                return (
                  <div key={task.id} className="bg-white border-l-4 border-red-500 rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{loan.borrower_name} #{loan.loan_number}</h3>
                        <p className="text-sm text-gray-600">
                          {loan.loan_type} • ${loan.amount.toLocaleString()} • Close: {new Date(loan.close_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                        {task.priority === 'urgent' ? 'URGENT' : 'HIGH'}
                      </span>
                    </div>
                    <div className="bg-red-50 p-3 rounded mb-3">
                      <p className="text-sm font-medium text-red-900">{task.title}</p>
                      <p className="text-sm text-red-700 mt-1">{task.description}</p>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => markTaskComplete(task.id)}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-green-700"
                      >
                        Mark Complete
                      </button>
                      <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700">
                        Call Borrower
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* This Week Tab */}
        {activeTab === 'week' && (
          <div className="space-y-4">
            {thisWeekTasks.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                No tasks this week!
              </div>
            ) : (
              thisWeekTasks.map(task => {
                const loan = getLoanById(task.loan_id)
                if (!loan) return null

                return (
                  <div key={task.id} className="bg-white border-l-4 border-yellow-500 rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{loan.borrower_name} #{loan.loan_number}</h3>
                        <p className="text-sm text-gray-600">
                          {loan.loan_type} • ${loan.amount.toLocaleString()}
                        </p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                        {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{task.title}</p>
                    <button 
                      onClick={() => markTaskComplete(task.id)}
                      className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700"
                    >
                      Mark Complete
                    </button>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            {['Application', 'Processing', 'Submitted to UW', 'Conditional Approval', 'Clear to Close', 'Closed'].map(stage => {
              const stageLoans = loans.filter(l => l.stage === stage)
              const stageColors: Record<string, { bg: string; text: string; badge: string }> = {
                'Application': { bg: 'bg-gray-100', text: 'text-gray-700', badge: 'bg-gray-600' },
                'Processing': { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'bg-blue-600' },
                'Submitted to UW': { bg: 'bg-purple-100', text: 'text-purple-700', badge: 'bg-purple-600' },
                'Conditional Approval': { bg: 'bg-yellow-100', text: 'text-yellow-700', badge: 'bg-yellow-600' },
                'Clear to Close': { bg: 'bg-green-100', text: 'text-green-700', badge: 'bg-green-600' },
                'Closed': { bg: 'bg-emerald-100', text: 'text-emerald-700', badge: 'bg-emerald-600' },
              }

              const colors = stageColors[stage]

              return (
                <div key={stage}>
                  <div className={`${colors.bg} rounded-t-lg px-4 py-3 flex justify-between items-center`}>
                    <h3 className={`font-semibold ${colors.text}`}>{stage}</h3>
                    <span className={`${colors.badge} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                      {stageLoans.length}
                    </span>
                  </div>
                  <div className="bg-white border border-gray-200 border-t-0 rounded-b-lg p-3 space-y-2">
                    {stageLoans.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-2">No loans in this stage</p>
                    ) : (
                      stageLoans.map(loan => (
                        <div key={loan.id} className="bg-gray-50 border border-gray-200 rounded p-3">
                          <p className="font-medium text-sm">{loan.borrower_name} #{loan.loan_number}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {loan.loan_type} • ${loan.amount.toLocaleString()} • Close: {new Date(loan.close_date).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
