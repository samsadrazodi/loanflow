import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email: string
  name: string
  role: 'LOP' | 'LO' | 'Underwriter' | 'Borrower'
}

export type Loan = {
  id: string
  loan_number: string
  borrower_name: string
  loan_type: 'Conventional' | 'FHA' | 'VA' | 'USDA'
  amount: number
  close_date: string
  stage: 'Application' | 'Processing' | 'Submitted to UW' | 'Conditional Approval' | 'Clear to Close' | 'Closed'
  assigned_lo_id: string
  assigned_lop_id: string
  created_at: string
}

export type Task = {
  id: string
  loan_id: string
  title: string
  description: string
  due_date: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  assigned_to_id: string
  status: 'pending' | 'complete'
  created_at: string
}

export type Document = {
  id: string
  loan_id: string
  document_type: string
  required: boolean
  received: boolean
  received_date: string | null
}

export type Activity = {
  id: string
  loan_id: string
  user_id: string
  action: string
  notes: string
  created_at: string
}
