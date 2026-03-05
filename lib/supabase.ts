import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Types ──
export type UserProfile = {
  id: string; email: string; name: string
  role: 'LOP' | 'LO' | 'Underwriter' | 'Borrower'
}

export type Loan = {
  id: string; loan_number: string; borrower_name: string
  loan_type: 'Conventional' | 'FHA' | 'VA' | 'USDA'
  amount: number; close_date: string
  stage: LoanStage
  assigned_lo_id: string; assigned_lop_id: string; created_at: string
}

export type Task = {
  id: string; loan_id: string; title: string; description: string
  due_date: string; priority: 'urgent' | 'high' | 'medium' | 'low'
  assigned_to_id: string; status: 'pending' | 'complete'; created_at: string
}

export type LoanDocument = {
  id: string; loan_id: string; document_type: string
  required: boolean; received: boolean; received_date: string | null
}

export type Activity = {
  id: string; loan_id: string; user_id: string
  action: string; notes: string; created_at: string
}

export type LoanNote = {
  id: string; loan_id: string; user_id: string; user_name?: string
  contact_type: 'LO' | 'Underwriter' | 'Client' | 'Other'
  content: string; created_at: string
}

// ── Constants ──
export const LOAN_STAGES = [
  'Application', 'Processing', 'Submitted to UW',
  'Conditional Approval', 'Clear to Close', 'Closed',
] as const

export type LoanStage = typeof LOAN_STAGES[number]

export const STAGE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'Application':          { bg: '#f3f4f6', text: '#6b7280', dot: '#9ca3af' },
  'Processing':           { bg: 'var(--accent-blue-light)', text: 'var(--accent-blue)', dot: 'var(--accent-blue)' },
  'Submitted to UW':      { bg: 'var(--accent-purple-light)', text: 'var(--accent-purple)', dot: 'var(--accent-purple)' },
  'Conditional Approval':  { bg: 'var(--accent-amber-light)', text: 'var(--accent-amber)', dot: 'var(--accent-amber)' },
  'Clear to Close':       { bg: 'var(--accent-green-light)', text: 'var(--accent-green)', dot: 'var(--accent-green)' },
  'Closed':               { bg: '#ecfdf5', text: '#059669', dot: '#059669' },
}

export const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'var(--accent-red)', high: 'var(--accent-amber)',
  medium: 'var(--accent-blue)', low: 'var(--accent-green)',
}

// ── Document requirements per loan type (hardcoded defaults) ──
export const LOAN_TYPE_DOCUMENTS: Record<string, string[]> = {
  Conventional: [
    'Government-issued ID', 'Pay stubs (last 2 months)', 'W-2 forms (2 years)',
    'Federal tax returns (2 years)', 'Bank statements (2 months)',
    'Employment verification letter', 'Credit report authorization',
    'Property appraisal report', 'Title search / title insurance',
    'Homeowners insurance', 'Purchase agreement / sales contract',
    'Signed loan application (1003)', 'Gift letter (if applicable)',
  ],
  FHA: [
    'Government-issued ID', 'Pay stubs (last 2 months)', 'W-2 forms (2 years)',
    'Federal tax returns (2 years)', 'Bank statements (2 months)',
    'Employment verification letter', 'Credit report authorization',
    'Property appraisal (FHA-approved appraiser)', 'Title search / title insurance',
    'Homeowners insurance', 'Purchase agreement / sales contract',
    'Signed loan application (1003)', 'FHA case number assignment',
    'UFMIP disclosure', 'Gift letter (if applicable)',
  ],
  VA: [
    'Government-issued ID', 'Certificate of Eligibility (COE)', 'DD-214 (discharge papers)',
    'Pay stubs (last 2 months)', 'W-2 forms (2 years)',
    'Federal tax returns (2 years)', 'Bank statements (2 months)',
    'Employment verification letter', 'Credit report authorization',
    'VA appraisal report', 'Title search / title insurance',
    'Homeowners insurance', 'Purchase agreement / sales contract',
    'Signed loan application (1003)', 'VA funding fee worksheet',
  ],
  USDA: [
    'Government-issued ID', 'Pay stubs (last 2 months)', 'W-2 forms (2 years)',
    'Federal tax returns (2 years)', 'Bank statements (2 months)',
    'Employment verification letter', 'Credit report authorization',
    'USDA property eligibility verification', 'Income eligibility documentation',
    'Property appraisal report', 'Title search / title insurance',
    'Homeowners insurance', 'Purchase agreement / sales contract',
    'Signed loan application (1003)', 'USDA guarantee fee disclosure',
  ],
}

export const CONTACT_TYPES = ['LO', 'Underwriter', 'Client', 'Other'] as const
export type ContactType = typeof CONTACT_TYPES[number]
