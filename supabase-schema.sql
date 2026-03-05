-- LoanFlow v2.0 Database Schema
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('LOP','LO','Underwriter','Borrower')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_number TEXT UNIQUE NOT NULL, borrower_name TEXT NOT NULL,
  loan_type TEXT NOT NULL CHECK (loan_type IN ('Conventional','FHA','VA','USDA')),
  amount DECIMAL(12,2) NOT NULL, close_date DATE NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('Application','Processing','Submitted to UW','Conditional Approval','Clear to Close','Closed')),
  assigned_lo_id UUID REFERENCES users(id), assigned_lop_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  title TEXT NOT NULL, description TEXT, due_date DATE NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('urgent','high','medium','low')),
  assigned_to_id UUID REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','complete')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loan_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, required BOOLEAN DEFAULT true,
  received BOOLEAN DEFAULT false, received_date TIMESTAMPTZ, notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(loan_id, document_type)
);

CREATE TABLE IF NOT EXISTS loan_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  contact_type TEXT NOT NULL CHECK (contact_type IN ('LO','Underwriter','Client','Other')),
  content TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  contact_type TEXT NOT NULL CHECK (contact_type IN ('LO','Underwriter','Client','Other')),
  reason TEXT NOT NULL, due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','done')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL, notes TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "loans_select" ON loans FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('LOP','LO')));
CREATE POLICY "loans_update" ON loans FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'LOP'));
CREATE POLICY "tasks_all" ON tasks FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('LOP','LO')));
CREATE POLICY "docs_all" ON loan_documents FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('LOP','LO')));
CREATE POLICY "notes_all" ON loan_notes FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('LOP','LO')));
CREATE POLICY "notes_insert" ON loan_notes FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('LOP','LO')));
CREATE POLICY "followups_all" ON follow_ups FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('LOP','LO')));
CREATE POLICY "followups_insert" ON follow_ups FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('LOP','LO')));
CREATE POLICY "activity_all" ON activity_log FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('LOP','LO')));

CREATE INDEX IF NOT EXISTS idx_loans_stage ON loans(stage);
CREATE INDEX IF NOT EXISTS idx_tasks_loan ON tasks(loan_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_docs_loan ON loan_documents(loan_id);
CREATE INDEX IF NOT EXISTS idx_notes_loan ON loan_notes(loan_id);
CREATE INDEX IF NOT EXISTS idx_followups_loan ON follow_ups(loan_id);
CREATE INDEX IF NOT EXISTS idx_followups_status ON follow_ups(status);
CREATE INDEX IF NOT EXISTS idx_followups_due ON follow_ups(due_date);
