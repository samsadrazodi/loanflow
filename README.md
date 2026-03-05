# LoanFlow v2.0

Modern loan processing dashboard with role-based access, Kanban board, document tracking, and tagged notes.

## Features

- **Role-based auth** — LOP (Loan Processor) and LO (Loan Officer) dashboards
- **Sidebar navigation** — Dashboard, Tasks, Kanban Board, Reports
- **Kanban board** — 6 loan stages, click to change status
- **Loan detail modal** — Details tab, Documents tab (per loan type checklist), Notes tab (tagged by contact)
- **Document tracking** — Hardcoded requirements per loan type (Conventional/FHA/VA/USDA), stored in Supabase
- **Tagged notes** — Add notes tagged to LO, Underwriter, Client, or Other
- **Reports dashboard** — Pipeline stats, stage distribution chart, type breakdown
- **Dark mode** — Toggle in sidebar
- **Compact design** — 1200px max-width with sidebar layout

## Setup

```bash
npm install
cp .env.example .env.local  # then add your Supabase credentials
```

Run SQL in Supabase SQL Editor:
1. `supabase-schema.sql`
2. `supabase-seed-data.sql` (update UUIDs first)

Create demo users in Supabase Auth:
- `sam@example.com` / `demo123` → LOP
- `lo@example.com` / `demo123` → LO

```bash
npm run dev
```

## Deploy

Push to GitHub → Vercel. Add env vars in project settings.
