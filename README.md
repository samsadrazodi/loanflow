# LoanFlow v2.0 — LOP Dashboard

A modern Loan Offer Letter (LOP) management dashboard built with **Next.js** and **React**, deployable on **Vercel**.

## Features

- **5 Routed Pages** — Dashboard, Applications, Borrowers, Reports, Settings
- **Dark Mode** — Toggle in header + Settings; persists in localStorage; respects system preference
- **LoanDetailModal** — Click any LOP row for full details, property info, and activity timeline
- **Search & Filter** — Real-time search + status filter chips
- **Sortable Columns** — Click column headers to sort
- **CSV Export** — One-click download of loan data
- **Reports** — Bar chart + loan type breakdown
- **Toast Notifications** — Feedback for all user actions
- **Keyboard Shortcuts** — `Esc` closes modal
- **Responsive** — 1400px max-width down to mobile
- **Compact Buttons** — Dense, professional UI

## Project Structure

```
├── pages/
│   ├── _app.js              # Global CSS import
│   ├── _document.js          # HTML shell + fonts
│   └── index.js              # Main page — routes all views
├── components/
│   ├── Header.js             # Nav + dark mode toggle
│   ├── DashboardPage.js      # LOP table, stats, filters, sorting
│   ├── LoanDetailModal.js    # Loan detail modal + timeline
│   ├── ApplicationsPage.js   # Applications pipeline
│   ├── BorrowersPage.js      # Borrower directory
│   ├── ReportsPage.js        # Charts + analytics
│   ├── SettingsPage.js       # Profile, appearance, notifications
│   ├── ToastContainer.js     # Toast notification renderer
│   └── Icons.js              # Shared SVG icon components
├── utils/
│   ├── data.js               # All sample data
│   ├── helpers.js             # capitalize, formatDate, etc.
│   ├── useTheme.js            # Dark mode React hook
│   └── useToast.js            # Toast notification React hook
├── styles/
│   └── globals.css            # Full design system (light + dark)
├── public/
│   └── logo.svg
├── package.json
├── next.config.js
└── README.md
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

Push to GitHub and import in Vercel — it will auto-detect Next.js and deploy. No extra config needed.
