'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single()

      if (profile?.role === 'LOP') {
        router.push('/lop')
      } else if (profile?.role === 'LO') {
        router.push('/lo')
      } else {
        setError('Unknown user role')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('demo123')
    setError('')
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <svg viewBox="0 0 28 28" fill="none" style={{ width: 40, height: 40, margin: '0 auto 12px' }}>
            <rect width="28" height="28" rx="7" fill="var(--accent-blue)"/>
            <path d="M8 9h4v10H8V9zm5 0h2l4 10h-2.5l-0.8-2.2h-3.8L11 19h-.5L13 9zm1 1.8L12.6 15h2.8L14 10.8z" fill="white"/>
          </svg>
        </div>
        <div className="login-title">LoanFlow</div>
        <div className="login-subtitle">Loan Processing Dashboard v2.0</div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required placeholder="sam@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter password" />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-accounts">
          <h4>Demo Accounts</h4>
          <div className="demo-card" style={{ cursor: 'pointer' }} onClick={() => fillDemo('sam@example.com')}>
            <p className="demo-role">Loan Processor (LOP)</p>
            <p>sam@example.com · demo123</p>
          </div>
          <div className="demo-card" style={{ cursor: 'pointer' }} onClick={() => fillDemo('lo@example.com')}>
            <p className="demo-role">Loan Officer (LO)</p>
            <p>lo@example.com · demo123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
