'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false); const [error, setError] = useState(''); const router = useRouter()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) throw err
      const { data: profile } = await supabase.from('users').select('role').eq('id', data.user.id).single()
      if (profile?.role === 'LOP') router.push('/lop')
      else if (profile?.role === 'LO') router.push('/lo')
      else setError('Unknown role')
    } catch (err: any) { setError(err.message || 'Login failed') }
    finally { setLoading(false) }
  }
  const fill = (e: string) => { setEmail(e); setPassword('demo123'); setError('') }
  return (
    <div className="login-wrapper"><div className="login-card">
      <div style={{textAlign:'center',marginBottom:6}}><svg viewBox="0 0 28 28" fill="none" style={{width:36,height:36,margin:'0 auto 10px'}}><rect width="28" height="28" rx="7" fill="var(--accent-blue)"/><path d="M8 9h4v10H8V9zm5 0h2l4 10h-2.5l-0.8-2.2h-3.8L11 19h-.5L13 9zm1 1.8L12.6 15h2.8L14 10.8z" fill="white"/></svg></div>
      <div className="login-title">LoanFlow</div><div className="login-sub">Loan Processing Dashboard v2.0</div>
      <form onSubmit={handleLogin}>
        <div className="field"><label className="field-label">Email</label><input type="email" className="field-input" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="sam@example.com"/></div>
        <div className="field"><label className="field-label">Password</label><input type="password" className="field-input" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Enter password"/></div>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{width:'100%'}}>{loading ? 'Signing in...' : 'Sign In'}</button>
      </form>
      <div className="demo-section"><h4>Demo Accounts</h4>
        <div className="demo-card" onClick={()=>fill('sam@example.com')}><div className="role">Loan Processor (LOP)</div><div className="creds">sam@example.com · demo123</div></div>
        <div className="demo-card" onClick={()=>fill('lo@example.com')}><div className="role">Loan Officer (LO)</div><div className="creds">lo@example.com · demo123</div></div>
      </div>
    </div></div>
  )
}
