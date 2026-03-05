export const loanData = [
  { id: 'LOP-2026-0847', borrower: 'Sarah Mitchell', amount: 485000, type: 'Conventional', status: 'approved', priority: 'high', date: '2026-03-01', assigned: 'JD', assignedColor: '#3b6ef6', rate: '6.25%', term: '30 years', ltv: '78.5%', address: '1422 Elm Street, Denver, CO', propertyValue: '$620,000', propertyType: 'Single Family', appraisal: 'Feb 18, 2026', progress: 95 },
  { id: 'LOP-2026-0846', borrower: 'James Rodriguez', amount: 320000, type: 'FHA', status: 'pending', priority: 'medium', date: '2026-02-28', assigned: 'AK', assignedColor: '#8b5cf6', rate: '5.75%', term: '30 years', ltv: '92.3%', address: '789 Oak Ave, Austin, TX', propertyValue: '$347,000', propertyType: 'Condo', appraisal: 'Feb 22, 2026', progress: 45 },
  { id: 'LOP-2026-0845', borrower: 'Elena Vasquez', amount: 750000, type: 'Jumbo', status: 'review', priority: 'high', date: '2026-02-27', assigned: 'SM', assignedColor: '#22c55e', rate: '6.75%', term: '15 years', ltv: '68.2%', address: '2100 Lake Shore Dr, Chicago, IL', propertyValue: '$1,100,000', propertyType: 'Multi-Family', appraisal: 'Feb 20, 2026', progress: 60 },
  { id: 'LOP-2026-0844', borrower: 'David Chen', amount: 295000, type: 'VA', status: 'approved', priority: 'low', date: '2026-02-26', assigned: 'JD', assignedColor: '#3b6ef6', rate: '5.50%', term: '30 years', ltv: '85.0%', address: '456 Pine St, Seattle, WA', propertyValue: '$347,000', propertyType: 'Townhouse', appraisal: 'Feb 15, 2026', progress: 100 },
  { id: 'LOP-2026-0843', borrower: 'Priya Sharma', amount: 420000, type: 'Conventional', status: 'pending', priority: 'high', date: '2026-02-25', assigned: 'AK', assignedColor: '#8b5cf6', rate: '6.00%', term: '30 years', ltv: '80.1%', address: '331 Birch Ln, Raleigh, NC', propertyValue: '$525,000', propertyType: 'Single Family', appraisal: 'Feb 19, 2026', progress: 30 },
  { id: 'LOP-2026-0842', borrower: 'Michael Okonkwo', amount: 580000, type: 'Jumbo', status: 'rejected', priority: 'medium', date: '2026-02-24', assigned: 'SM', assignedColor: '#22c55e', rate: '7.00%', term: '30 years', ltv: '95.2%', address: '99 Sunset Blvd, Miami, FL', propertyValue: '$610,000', propertyType: 'Condo', appraisal: 'Feb 12, 2026', progress: 100 },
  { id: 'LOP-2026-0841', borrower: 'Amy Zhao', amount: 275000, type: 'FHA', status: 'approved', priority: 'low', date: '2026-02-23', assigned: 'JD', assignedColor: '#3b6ef6', rate: '5.65%', term: '15 years', ltv: '88.0%', address: '812 Maple Dr, Portland, OR', propertyValue: '$312,500', propertyType: 'Single Family', appraisal: 'Feb 10, 2026', progress: 100 },
  { id: 'LOP-2026-0840', borrower: 'Robert Hoffman', amount: 650000, type: 'Conventional', status: 'review', priority: 'high', date: '2026-02-22', assigned: 'AK', assignedColor: '#8b5cf6', rate: '6.50%', term: '30 years', ltv: '73.9%', address: '1650 Park Ave, New York, NY', propertyValue: '$880,000', propertyType: 'Co-op', appraisal: 'Feb 17, 2026', progress: 55 },
  { id: 'LOP-2026-0839', borrower: 'Fatima Al-Hassan', amount: 340000, type: 'Conventional', status: 'disbursed', priority: 'low', date: '2026-02-21', assigned: 'SM', assignedColor: '#22c55e', rate: '6.10%', term: '30 years', ltv: '76.0%', address: '2455 Cedar Rd, Phoenix, AZ', propertyValue: '$447,000', propertyType: 'Single Family', appraisal: 'Feb 08, 2026', progress: 100 },
  { id: 'LOP-2026-0838', borrower: 'Thomas Abernathy', amount: 890000, type: 'Jumbo', status: 'pending', priority: 'medium', date: '2026-02-20', assigned: 'JD', assignedColor: '#3b6ef6', rate: '6.90%', term: '30 years', ltv: '70.5%', address: '4800 Wilshire Blvd, Los Angeles, CA', propertyValue: '$1,262,000', propertyType: 'Single Family', appraisal: 'Feb 14, 2026', progress: 20 },
];

export const timelineData = [
  { date: 'Mar 04, 2026 · 2:15 PM', text: 'Final review completed', user: 'John Doe' },
  { date: 'Mar 03, 2026 · 10:30 AM', text: 'Appraisal report uploaded', user: 'System' },
  { date: 'Mar 01, 2026 · 9:00 AM', text: 'Credit check passed — score 742', user: 'AutoVerify' },
  { date: 'Feb 28, 2026 · 3:45 PM', text: 'Income verification completed', user: 'Anna Kim' },
  { date: 'Feb 27, 2026 · 11:20 AM', text: 'Application submitted', user: 'Borrower Portal' },
];

export const applicationsData = [
  { id: 'APP-3021', applicant: 'Lisa Morgan', amount: 310000, type: 'Conventional', stage: 'new', submitted: '2026-03-04', docs: 3 },
  { id: 'APP-3020', applicant: 'Kevin Park', amount: 525000, type: 'Jumbo', stage: 'processing', submitted: '2026-03-03', docs: 7 },
  { id: 'APP-3019', applicant: 'Maria Santos', amount: 210000, type: 'FHA', stage: 'processing', submitted: '2026-03-02', docs: 5 },
  { id: 'APP-3018', applicant: 'Alex Petrov', amount: 445000, type: 'Conventional', stage: 'completed', submitted: '2026-03-01', docs: 9 },
  { id: 'APP-3017', applicant: 'Rachel Kim', amount: 680000, type: 'Jumbo', stage: 'new', submitted: '2026-02-28', docs: 2 },
  { id: 'APP-3016', applicant: 'Omar Farouk', amount: 290000, type: 'VA', stage: 'processing', submitted: '2026-02-27', docs: 6 },
  { id: 'APP-3015', applicant: 'Jessica Bell', amount: 375000, type: 'Conventional', stage: 'completed', submitted: '2026-02-26', docs: 10 },
  { id: 'APP-3014', applicant: 'Taro Yamamoto', amount: 820000, type: 'Jumbo', stage: 'new', submitted: '2026-02-25', docs: 1 },
];

export const borrowersData = [
  { name: 'Sarah Mitchell', email: 'sarah.m@email.com', loans: 2, totalBorrowed: 725000, creditScore: 742, since: '2024-06-15', risk: 'low' },
  { name: 'James Rodriguez', email: 'j.rodriguez@email.com', loans: 1, totalBorrowed: 320000, creditScore: 688, since: '2025-01-22', risk: 'medium' },
  { name: 'Elena Vasquez', email: 'evasquez@email.com', loans: 3, totalBorrowed: 1450000, creditScore: 781, since: '2023-03-10', risk: 'low' },
  { name: 'David Chen', email: 'dchen@email.com', loans: 1, totalBorrowed: 295000, creditScore: 715, since: '2025-08-05', risk: 'low' },
  { name: 'Priya Sharma', email: 'psharma@email.com', loans: 1, totalBorrowed: 420000, creditScore: 698, since: '2025-11-18', risk: 'medium' },
  { name: 'Michael Okonkwo', email: 'm.okonkwo@email.com', loans: 2, totalBorrowed: 810000, creditScore: 621, since: '2024-02-28', risk: 'high' },
  { name: 'Amy Zhao', email: 'azhao@email.com', loans: 1, totalBorrowed: 275000, creditScore: 756, since: '2025-04-12', risk: 'low' },
  { name: 'Robert Hoffman', email: 'rhoffman@email.com', loans: 2, totalBorrowed: 980000, creditScore: 733, since: '2023-09-01', risk: 'low' },
];

export const reportChartData = {
  months: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  values: [18.2, 21.5, 19.8, 23.1, 20.4, 25.6, 22.3, 27.1, 24.8, 26.2, 23.9, 24.6],
  loanTypes: [
    { name: 'Conventional', pct: 48, color: 'var(--accent-blue)' },
    { name: 'FHA', pct: 22, color: 'var(--accent-green)' },
    { name: 'Jumbo', pct: 18, color: 'var(--accent-purple)' },
    { name: 'VA', pct: 9, color: 'var(--accent-amber)' },
    { name: 'Other', pct: 3, color: 'var(--text-tertiary)' },
  ],
};
