# LoanFlow v2.0

Loan processing dashboard with Supabase auth, document tracking, and smart follow-ups.

## Features

- **Role-based auth** (LOP / LO dashboards)
- **Dashboard** — Pipeline table, missing docs summary, stats
- **Follow-ups** — Schedule reminders by contact type (Client/LO/UW), quick-add (+2d/+4d/+1w), auto-suggests remaining docs, overdue/today/upcoming grouping
- **Kanban** — 6-stage board, click to open loan detail
- **Reports** — Stage distribution chart, type breakdown
- **Loan Detail Modal** — 4 tabs: Details (stage change), Documents (per-loan-type checklist), Notes (tagged), Follow-ups (schedule & manage)
- **Dark mode** toggle
- **Dynamic doc tracking** — Dashboard cards show actual missing documents, not hardcoded text

## Setup

```bash
npm install
cp .env.example .env.local  # add Supabase credentials
```

Run in Supabase SQL Editor:
1. `supabase-schema.sql` (creates all tables including follow_ups)
2. `supabase-seed-data.sql` (update UUIDs)

```bash
npm run dev
```
