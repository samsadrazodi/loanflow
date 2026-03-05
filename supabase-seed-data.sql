-- LoanFlow v2.0 Seed Data — Replace YOUR_LOP_USER_ID and YOUR_LO_USER_ID

INSERT INTO users (id, email, name, role) VALUES
('YOUR_LOP_USER_ID', 'sam@example.com', 'Sam (LOP)', 'LOP'),
('YOUR_LO_USER_ID', 'lo@example.com', 'Mike (LO)', 'LO');

INSERT INTO loans (loan_number, borrower_name, loan_type, amount, close_date, stage, assigned_lo_id, assigned_lop_id) VALUES
('4518','Johnson','FHA',450000,'2026-03-12','Processing','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4519','Rodriguez','Conventional',555000,'2026-03-25','Processing','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4520','Martinez','Conventional',395000,'2026-03-20','Submitted to UW','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4521','Chen','Conventional',385000,'2026-03-10','Conditional Approval','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4522','Hall','VA',425000,'2026-04-15','Processing','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4523','Anderson','Conventional',680000,'2026-03-18','Processing','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4524','Taylor','VA',475000,'2026-03-28','Processing','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4525','White','FHA',325000,'2026-03-23','Submitted to UW','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4526','Nguyen','Conventional',640000,'2026-03-27','Processing','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4527','Clark','VA',490000,'2026-03-16','Conditional Approval','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4528','Thomas','Conventional',710000,'2026-03-11','Clear to Close','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4529','Davis','VA',525000,'2026-03-08','Clear to Close','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4517','Williams','FHA',310000,'2026-03-22','Processing','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4530','Smith','Conventional',420000,'2026-03-30','Application','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4531','Garcia','FHA',285000,'2026-04-02','Application','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4532','Lee','VA',510000,'2026-04-05','Application','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4533','Young','Conventional',395000,'2026-04-10','Processing','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4534','Walker','FHA',340000,'2026-04-12','Processing','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4535','Lewis','Conventional',580000,'2026-04-15','Processing','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4536','Harris','VA',465000,'2026-04-18','Processing','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4537','Martin','Conventional',625000,'2026-04-20','Submitted to UW','YOUR_LO_USER_ID','YOUR_LOP_USER_ID'),
('4538','Moore','FHA',295000,'2026-04-22','Submitted to UW','YOUR_LO_USER_ID','YOUR_LOP_USER_ID');

-- Tasks
INSERT INTO tasks (loan_id,title,description,due_date,priority,assigned_to_id,status) SELECT l.id,'Conditional approval expires tomorrow','Updated pay stub needed','2026-03-06','urgent','YOUR_LOP_USER_ID','pending' FROM loans l WHERE l.loan_number='4521';
INSERT INTO tasks (loan_id,title,description,due_date,priority,assigned_to_id,status) SELECT l.id,'Closing Disclosure must be sent today','All conditions cleared','2026-03-05','urgent','YOUR_LOP_USER_ID','pending' FROM loans l WHERE l.loan_number='4518';
INSERT INTO tasks (loan_id,title,description,due_date,priority,assigned_to_id,status) SELECT l.id,'Final walkthrough tomorrow 2pm','Confirm with borrower','2026-03-06','urgent','YOUR_LOP_USER_ID','pending' FROM loans l WHERE l.loan_number='4529';
INSERT INTO tasks (loan_id,title,description,due_date,priority,assigned_to_id,status) SELECT l.id,'Check on appraisal status','Ordered 7 days ago','2026-03-05','urgent','YOUR_LOP_USER_ID','pending' FROM loans l WHERE l.loan_number='4520';
INSERT INTO tasks (loan_id,title,description,due_date,priority,assigned_to_id,status) SELECT l.id,'Submit file to underwriting','All docs received','2026-03-07','high','YOUR_LOP_USER_ID','pending' FROM loans l WHERE l.loan_number='4517';
INSERT INTO tasks (loan_id,title,description,due_date,priority,assigned_to_id,status) SELECT l.id,'Order appraisal','Must be done by Friday','2026-03-08','high','YOUR_LOP_USER_ID','pending' FROM loans l WHERE l.loan_number='4519';
INSERT INTO tasks (loan_id,title,description,due_date,priority,assigned_to_id,status) SELECT l.id,'Verify rate lock extension','Expires in 5 days','2026-03-09','high','YOUR_LOP_USER_ID','pending' FROM loans l WHERE l.loan_number='4524';
INSERT INTO tasks (loan_id,title,description,due_date,priority,assigned_to_id,status) SELECT l.id,'Follow up on missing W-2s','Borrower to provide 2024 W-2','2026-03-10','medium','YOUR_LOP_USER_ID','pending' FROM loans l WHERE l.loan_number='4526';
INSERT INTO tasks (loan_id,title,description,due_date,priority,assigned_to_id,status) SELECT l.id,'Review initial application','New intake','2026-03-08','medium','YOUR_LOP_USER_ID','pending' FROM loans l WHERE l.loan_number='4530';

-- Documents: Davis #4529 (VA) — 3 missing
INSERT INTO loan_documents (loan_id,document_type,required,received,received_date) SELECT l.id,dt,true,CASE WHEN dt IN ('Credit report authorization','Homeowners insurance','Purchase agreement') THEN false ELSE true END,CASE WHEN dt IN ('Credit report authorization','Homeowners insurance','Purchase agreement') THEN NULL ELSE NOW()-interval '3 days' END FROM loans l,unnest(ARRAY['Government-issued ID','Certificate of Eligibility (COE)','DD-214 (discharge papers)','Pay stubs (2 months)','W-2 forms (2 years)','Federal tax returns (2 years)','Bank statements (2 months)','Employment verification letter','Credit report authorization','VA appraisal report','Title search / title insurance','Homeowners insurance','Purchase agreement','Signed loan application (1003)','VA funding fee worksheet']) AS dt WHERE l.loan_number='4529';

-- Chen #4521 (Conv) — 1 missing
INSERT INTO loan_documents (loan_id,document_type,required,received,received_date) SELECT l.id,dt,true,CASE WHEN dt='Bank statements (2 months)' THEN false ELSE true END,CASE WHEN dt='Bank statements (2 months)' THEN NULL ELSE NOW()-interval '5 days' END FROM loans l,unnest(ARRAY['Government-issued ID','Pay stubs (2 months)','W-2 forms (2 years)','Federal tax returns (2 years)','Bank statements (2 months)','Employment verification letter','Credit report authorization','Property appraisal report','Title search / title insurance','Homeowners insurance','Purchase agreement','Signed loan application (1003)','Gift letter (if applicable)']) AS dt WHERE l.loan_number='4521';

-- Thomas #4528 (Conv) — all received
INSERT INTO loan_documents (loan_id,document_type,required,received,received_date) SELECT l.id,dt,true,true,NOW()-interval '7 days' FROM loans l,unnest(ARRAY['Government-issued ID','Pay stubs (2 months)','W-2 forms (2 years)','Federal tax returns (2 years)','Bank statements (2 months)','Employment verification letter','Credit report authorization','Property appraisal report','Title search / title insurance','Homeowners insurance','Purchase agreement','Signed loan application (1003)','Gift letter (if applicable)']) AS dt WHERE l.loan_number='4528';

-- Anderson #4523 (Conv) — 5 missing
INSERT INTO loan_documents (loan_id,document_type,required,received,received_date) SELECT l.id,dt,true,CASE WHEN dt IN ('Federal tax returns (2 years)','Bank statements (2 months)','Property appraisal report','Title search / title insurance','Homeowners insurance') THEN false ELSE true END,CASE WHEN dt IN ('Federal tax returns (2 years)','Bank statements (2 months)','Property appraisal report','Title search / title insurance','Homeowners insurance') THEN NULL ELSE NOW()-interval '4 days' END FROM loans l,unnest(ARRAY['Government-issued ID','Pay stubs (2 months)','W-2 forms (2 years)','Federal tax returns (2 years)','Bank statements (2 months)','Employment verification letter','Credit report authorization','Property appraisal report','Title search / title insurance','Homeowners insurance','Purchase agreement','Signed loan application (1003)','Gift letter (if applicable)']) AS dt WHERE l.loan_number='4523';

-- Rodriguez #4519 (Conv) — 3 missing
INSERT INTO loan_documents (loan_id,document_type,required,received,received_date) SELECT l.id,dt,true,CASE WHEN dt IN ('W-2 forms (2 years)','Employment verification letter','Property appraisal report') THEN false ELSE true END,CASE WHEN dt IN ('W-2 forms (2 years)','Employment verification letter','Property appraisal report') THEN NULL ELSE NOW()-interval '2 days' END FROM loans l,unnest(ARRAY['Government-issued ID','Pay stubs (2 months)','W-2 forms (2 years)','Federal tax returns (2 years)','Bank statements (2 months)','Employment verification letter','Credit report authorization','Property appraisal report','Title search / title insurance','Homeowners insurance','Purchase agreement','Signed loan application (1003)','Gift letter (if applicable)']) AS dt WHERE l.loan_number='4519';

-- Smith #4530 (Conv, Application) — only 2 received
INSERT INTO loan_documents (loan_id,document_type,required,received,received_date) SELECT l.id,dt,true,CASE WHEN dt IN ('Government-issued ID','Signed loan application (1003)') THEN true ELSE false END,CASE WHEN dt IN ('Government-issued ID','Signed loan application (1003)') THEN NOW()-interval '1 day' ELSE NULL END FROM loans l,unnest(ARRAY['Government-issued ID','Pay stubs (2 months)','W-2 forms (2 years)','Federal tax returns (2 years)','Bank statements (2 months)','Employment verification letter','Credit report authorization','Property appraisal report','Title search / title insurance','Homeowners insurance','Purchase agreement','Signed loan application (1003)','Gift letter (if applicable)']) AS dt WHERE l.loan_number='4530';

-- Notes
INSERT INTO loan_notes (loan_id,user_id,contact_type,content,created_at) SELECT l.id,'YOUR_LOP_USER_ID','Client','Called borrower, left voicemail requesting updated pay stub for March.',NOW()-interval '2 days' FROM loans l WHERE l.loan_number='4521';
INSERT INTO loan_notes (loan_id,user_id,contact_type,content,created_at) SELECT l.id,'YOUR_LOP_USER_ID','Client','Borrower confirmed bank statements ready by Friday.',NOW()-interval '1 day' FROM loans l WHERE l.loan_number='4521';
INSERT INTO loan_notes (loan_id,user_id,contact_type,content,created_at) SELECT l.id,'YOUR_LOP_USER_ID','LO','Discussed rate lock with Mike. Lock good through 3/15.',NOW()-interval '3 days' FROM loans l WHERE l.loan_number='4523';
INSERT INTO loan_notes (loan_id,user_id,contact_type,content,created_at) SELECT l.id,'YOUR_LOP_USER_ID','Client','Sent email requesting tax returns and bank statements. Borrower traveling, expects 3/8.',NOW()-interval '5 days' FROM loans l WHERE l.loan_number='4523';
INSERT INTO loan_notes (loan_id,user_id,contact_type,content,created_at) SELECT l.id,'YOUR_LOP_USER_ID','Underwriter','UW requested explanation for large deposit in January bank statement.',NOW()-interval '1 day' FROM loans l WHERE l.loan_number='4520';
INSERT INTO loan_notes (loan_id,user_id,contact_type,content,created_at) SELECT l.id,'YOUR_LOP_USER_ID','LO','Mike confirmed buyer agent scheduled final walkthrough 3/7 at 2pm.',NOW()-interval '1 day' FROM loans l WHERE l.loan_number='4529';
INSERT INTO loan_notes (loan_id,user_id,contact_type,content,created_at) SELECT l.id,'YOUR_LOP_USER_ID','Client','New application. First-time homebuyer, pre-qualified $450k.',NOW()-interval '1 day' FROM loans l WHERE l.loan_number='4530';
INSERT INTO loan_notes (loan_id,user_id,contact_type,content,created_at) SELECT l.id,'YOUR_LOP_USER_ID','Underwriter','Appraisal came in at value. No property conditions.',NOW()-interval '2 days' FROM loans l WHERE l.loan_number='4528';

-- Follow-ups
INSERT INTO follow_ups (loan_id,user_id,contact_type,reason,due_date,status) SELECT l.id,'YOUR_LOP_USER_ID','Client','Follow up on bank statements — borrower said ready Friday','2026-03-07','pending' FROM loans l WHERE l.loan_number='4521';
INSERT INTO follow_ups (loan_id,user_id,contact_type,reason,due_date,status) SELECT l.id,'YOUR_LOP_USER_ID','Client','Follow up on tax returns and bank statements — returning from travel','2026-03-08','pending' FROM loans l WHERE l.loan_number='4523';
INSERT INTO follow_ups (loan_id,user_id,contact_type,reason,due_date,status) SELECT l.id,'YOUR_LOP_USER_ID','LO','Discuss rate lock extension — expires 3/15','2026-03-10','pending' FROM loans l WHERE l.loan_number='4523';
INSERT INTO follow_ups (loan_id,user_id,contact_type,reason,due_date,status) SELECT l.id,'YOUR_LOP_USER_ID','Client','Confirm borrower received Closing Disclosure','2026-03-06','pending' FROM loans l WHERE l.loan_number='4518';
INSERT INTO follow_ups (loan_id,user_id,contact_type,reason,due_date,status) SELECT l.id,'YOUR_LOP_USER_ID','Underwriter','Check if large deposit explanation was sufficient','2026-03-07','pending' FROM loans l WHERE l.loan_number='4520';
INSERT INTO follow_ups (loan_id,user_id,contact_type,reason,due_date,status) SELECT l.id,'YOUR_LOP_USER_ID','Client','Follow up on W-2s and employment verification','2026-03-09','pending' FROM loans l WHERE l.loan_number='4519';
INSERT INTO follow_ups (loan_id,user_id,contact_type,reason,due_date,status) SELECT l.id,'YOUR_LOP_USER_ID','Client','Collect initial document package — only ID and app received','2026-03-08','pending' FROM loans l WHERE l.loan_number='4530';

-- Activity
INSERT INTO activity_log (loan_id,user_id,action,notes) SELECT l.id,'YOUR_LOP_USER_ID','Called borrower','Left voicemail re: pay stub' FROM loans l WHERE l.loan_number='4521';
INSERT INTO activity_log (loan_id,user_id,action,notes) SELECT l.id,'YOUR_LOP_USER_ID','Sent email','Requested bank statements' FROM loans l WHERE l.loan_number='4523';
INSERT INTO activity_log (loan_id,user_id,action,notes) SELECT l.id,'YOUR_LOP_USER_ID','Stage change','Moved to Clear to Close' FROM loans l WHERE l.loan_number='4528';
