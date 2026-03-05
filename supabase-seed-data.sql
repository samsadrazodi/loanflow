-- SAMPLE DATA FOR LOANFLOW
-- Run this AFTER creating the schema and AFTER creating the auth users

-- IMPORTANT: You need to create these users in Supabase Auth first:
-- 1. sam@example.com (password: demo123)
-- 2. lo@example.com (password: demo123)
-- 
-- After creating them in Auth, get their UUIDs from the Supabase Auth dashboard
-- and replace the UUIDs below

-- For this demo, we'll use placeholder UUIDs
-- YOU MUST REPLACE THESE with actual UUIDs from your Supabase Auth users!

-- Insert users (linking to auth.users)
-- Replace 'YOUR_LOP_USER_ID' with the actual UUID from Supabase Auth for sam@example.com
-- Replace 'YOUR_LO_USER_ID' with the actual UUID from Supabase Auth for lo@example.com

INSERT INTO users (id, email, name, role) VALUES
('YOUR_LOP_USER_ID', 'sam@example.com', 'Sam (LOP)', 'LOP'),
('YOUR_LO_USER_ID', 'lo@example.com', 'Mike (LO)', 'LO');

-- Insert sample loans
INSERT INTO loans (loan_number, borrower_name, loan_type, amount, close_date, stage, assigned_lo_id, assigned_lop_id) VALUES
('4518', 'Johnson', 'FHA', 450000, '2026-03-12', 'Processing', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4519', 'Rodriguez', 'Conventional', 555000, '2026-03-25', 'Processing', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4520', 'Martinez', 'Conventional', 395000, '2026-03-20', 'Submitted to UW', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4521', 'Chen', 'Conventional', 385000, '2026-03-10', 'Conditional Approval', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4522', 'Hall', 'VA', 425000, '2026-04-15', 'Processing', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4523', 'Anderson', 'Conventional', 680000, '2026-03-18', 'Processing', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4524', 'Taylor', 'VA', 475000, '2026-03-28', 'Processing', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4525', 'White', 'FHA', 325000, '2026-03-23', 'Submitted to UW', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4526', 'Nguyen', 'Conventional', 640000, '2026-03-27', 'Processing', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4527', 'Clark', 'VA', 490000, '2026-03-16', 'Conditional Approval', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4528', 'Thomas', 'Conventional', 710000, '2026-03-11', 'Clear to Close', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4529', 'Davis', 'VA', 525000, '2026-03-08', 'Clear to Close', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4517', 'Williams', 'FHA', 310000, '2026-03-22', 'Processing', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4530', 'Smith', 'Conventional', 420000, '2026-03-30', 'Application', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4531', 'Garcia', 'FHA', 285000, '2026-04-02', 'Application', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4532', 'Lee', 'VA', 510000, '2026-04-05', 'Application', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4533', 'Young', 'Conventional', 395000, '2026-04-10', 'Processing', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4534', 'Walker', 'FHA', 340000, '2026-04-12', 'Processing', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4535', 'Lewis', 'Conventional', 580000, '2026-04-15', 'Processing', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4536', 'Harris', 'VA', 465000, '2026-04-18', 'Processing', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4537', 'Martin', 'Conventional', 625000, '2026-04-20', 'Submitted to UW', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID'),
('4538', 'Moore', 'FHA', 295000, '2026-04-22', 'Submitted to UW', 'YOUR_LO_USER_ID', 'YOUR_LOP_USER_ID');

-- Insert sample tasks (getting loan IDs from inserted loans)
INSERT INTO tasks (loan_id, title, description, due_date, priority, assigned_to_id, status)
SELECT 
  l.id,
  'Conditional approval expires tomorrow',
  'Still missing: Updated pay stub (showing March income)',
  '2026-03-06',
  'urgent',
  'YOUR_LOP_USER_ID',
  'pending'
FROM loans l WHERE l.loan_number = '4521';

INSERT INTO tasks (loan_id, title, description, due_date, priority, assigned_to_id, status)
SELECT 
  l.id,
  'Closing Disclosure must be sent today',
  'All conditions cleared - ready to generate',
  '2026-03-05',
  'urgent',
  'YOUR_LOP_USER_ID',
  'pending'
FROM loans l WHERE l.loan_number = '4518';

INSERT INTO tasks (loan_id, title, description, due_date, priority, assigned_to_id, status)
SELECT 
  l.id,
  'Final walkthrough tomorrow 2pm',
  'Confirm with borrower and agent',
  '2026-03-06',
  'urgent',
  'YOUR_LOP_USER_ID',
  'pending'
FROM loans l WHERE l.loan_number = '4529';

INSERT INTO tasks (loan_id, title, description, due_date, priority, assigned_to_id, status)
SELECT 
  l.id,
  'Borrower not responding to document requests',
  'Needed: 2023 tax returns, recent bank statements. Last contacted 5 days ago.',
  '2026-03-05',
  'urgent',
  'YOUR_LOP_USER_ID',
  'pending'
FROM loans l WHERE l.loan_number = '4523';

INSERT INTO tasks (loan_id, title, description, due_date, priority, assigned_to_id, status)
SELECT 
  l.id,
  'Check on appraisal status',
  'Ordered 7 days ago - should be back today',
  '2026-03-05',
  'urgent',
  'YOUR_LOP_USER_ID',
  'pending'
FROM loans l WHERE l.loan_number = '4520';

INSERT INTO tasks (loan_id, title, description, due_date, priority, assigned_to_id, status)
SELECT 
  l.id,
  'Submit complete file to underwriting',
  'All docs received - ready to submit',
  '2026-03-07',
  'high',
  'YOUR_LOP_USER_ID',
  'pending'
FROM loans l WHERE l.loan_number = '4517';

INSERT INTO tasks (loan_id, title, description, due_date, priority, assigned_to_id, status)
SELECT 
  l.id,
  'Order appraisal',
  'Must be done by Friday',
  '2026-03-08',
  'high',
  'YOUR_LOP_USER_ID',
  'pending'
FROM loans l WHERE l.loan_number = '4519';

INSERT INTO tasks (loan_id, title, description, due_date, priority, assigned_to_id, status)
SELECT 
  l.id,
  'Verify rate lock extension',
  'Rate lock expires in 5 days - check if extension needed',
  '2026-03-09',
  'high',
  'YOUR_LOP_USER_ID',
  'pending'
FROM loans l WHERE l.loan_number = '4524';

INSERT INTO tasks (loan_id, title, description, due_date, priority, assigned_to_id, status)
SELECT 
  l.id,
  'Follow up on missing W-2s',
  'Borrower to provide 2024 W-2',
  '2026-03-10',
  'medium',
  'YOUR_LOP_USER_ID',
  'pending'
FROM loans l WHERE l.loan_number = '4526';

-- Insert sample activity log entries
INSERT INTO activity_log (loan_id, user_id, action, notes)
SELECT 
  l.id,
  'YOUR_LOP_USER_ID',
  'Called borrower',
  'Left voicemail requesting updated pay stub'
FROM loans l WHERE l.loan_number = '4521';

INSERT INTO activity_log (loan_id, user_id, action, notes)
SELECT 
  l.id,
  'YOUR_LOP_USER_ID',
  'Sent email',
  'Requested bank statements via email'
FROM loans l WHERE l.loan_number = '4523';
