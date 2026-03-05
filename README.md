# LoanFlow v2.0

Loan processing dashboard with role-based access, built with Next.js, Supabase, and a custom design system.

## Roles

- **LOP (Loan Processor)** — Full pipeline view, urgent/weekly task management, mark tasks complete
- **LO (Loan Officer)** — Pipeline overview, closing schedule, attention-needed loans

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Supabase** (Auth + Postgres + RLS)
- **Custom CSS** design system with dark mode

## Setup

```bash
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

Run the SQL files in your Supabase SQL Editor:
1. `supabase-schema.sql` — creates tables + RLS policies
2. `supabase-seed-data.sql` — sample loans, tasks, activity

Create demo users in Supabase Auth:
- `sam@example.com` / `demo123` (LOP)
- `lo@example.com` / `demo123` (LO)

Then update the seed SQL UUIDs with the actual auth user IDs.

```bash
npm run dev
```

## Deploy

Push to GitHub → import in Vercel. Add env vars in Vercel project settings.
