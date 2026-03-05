-- LoanFlow Database Schema
-- Run this in your Supabase SQL Editor

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('LOP', 'LO', 'Underwriter', 'Borrower')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loans table
CREATE TABLE loans (
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
CREATE TABLE tasks (
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

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  required BOOLEAN DEFAULT true,
  received BOOLEAN DEFAULT false,
  received_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log table
CREATE TABLE activity_log (
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
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- RLS Policies for loans table
CREATE POLICY "LOPs can view all loans" ON loans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'LOP'
    )
  );

CREATE POLICY "LOs can view their assigned loans" ON loans
  FOR SELECT USING (
    assigned_lo_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'LOP'
    )
  );

-- RLS Policies for tasks table
CREATE POLICY "Users can view tasks for their loans" ON tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM loans 
      WHERE loans.id = tasks.loan_id 
      AND (
        loans.assigned_lo_id = auth.uid() OR
        loans.assigned_lop_id = auth.uid() OR
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('LOP', 'LO'))
      )
    )
  );

-- RLS Policies for documents table
CREATE POLICY "Users can view documents for their loans" ON documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM loans 
      WHERE loans.id = documents.loan_id 
      AND (
        loans.assigned_lo_id = auth.uid() OR
        loans.assigned_lop_id = auth.uid() OR
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('LOP', 'LO'))
      )
    )
  );

-- RLS Policies for activity_log table
CREATE POLICY "Users can view activity for their loans" ON activity_log
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM loans 
      WHERE loans.id = activity_log.loan_id 
      AND (
        loans.assigned_lo_id = auth.uid() OR
        loans.assigned_lop_id = auth.uid() OR
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('LOP', 'LO'))
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_loans_assigned_lo ON loans(assigned_lo_id);
CREATE INDEX idx_loans_assigned_lop ON loans(assigned_lop_id);
CREATE INDEX idx_loans_stage ON loans(stage);
CREATE INDEX idx_tasks_loan_id ON tasks(loan_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_documents_loan_id ON documents(loan_id);
CREATE INDEX idx_activity_loan_id ON activity_log(loan_id);
