-- LoanFlow v2.0 Database Schema
-- Run this in your Supabase SQL Editor

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('LOP', 'LO', 'Underwriter', 'Borrower')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loans table
CREATE TABLE IF NOT EXISTS loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_number TEXT UNIQUE NOT NULL,
  borrower_name TEXT NOT NULL,
  loan_type TEXT NOT NULL CHECK (loan_type IN ('Conventional', 'FHA', 'VA', 'USDA')),
  amount DECIMAL(12,2) NOT NULL,
  close_date DATE NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('Application', 'Processing', 'Submitted to UW', 'Conditional Approval', 'Clear to Close', 'Closed')),
  assigned_lo_id UUID REFERENCES users(id),
  assigned_lop_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
  assigned_to_id UUID REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'complete')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loan documents tracking (per-loan checklist)
CREATE TABLE IF NOT EXISTS loan_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  required BOOLEAN DEFAULT true,
  received BOOLEAN DEFAULT false,
  received_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(loan_id, document_type)
);

-- Loan notes with contact tagging
CREATE TABLE IF NOT EXISTS loan_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  contact_type TEXT NOT NULL CHECK (contact_type IN ('LO', 'Underwriter', 'Client', 'Other')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "LOP and LO can view all loans" ON loans FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('LOP', 'LO'))
);
CREATE POLICY "LOP can update loans" ON loans FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'LOP')
);

CREATE POLICY "Users can manage tasks" ON tasks FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('LOP', 'LO'))
);

CREATE POLICY "Users can manage loan_documents" ON loan_documents FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('LOP', 'LO'))
);

CREATE POLICY "Users can manage loan_notes" ON loan_notes FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('LOP', 'LO'))
);
CREATE POLICY "Users can insert loan_notes" ON loan_notes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('LOP', 'LO'))
);

CREATE POLICY "Users can view activity" ON activity_log FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('LOP', 'LO'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_loans_stage ON loans(stage);
CREATE INDEX IF NOT EXISTS idx_loans_lo ON loans(assigned_lo_id);
CREATE INDEX IF NOT EXISTS idx_loans_lop ON loans(assigned_lop_id);
CREATE INDEX IF NOT EXISTS idx_tasks_loan ON tasks(loan_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_loan_docs_loan ON loan_documents(loan_id);
CREATE INDEX IF NOT EXISTS idx_loan_notes_loan ON loan_notes(loan_id);
CREATE INDEX IF NOT EXISTS idx_activity_loan ON activity_log(loan_id);
