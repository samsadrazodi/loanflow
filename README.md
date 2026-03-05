# LoanFlow v2.0 — LOP Dashboard

A modern Loan Offer Letter (LOP) management dashboard with dark mode, multi-page routing, and detailed loan modals.

## Features

- **5 Fully Routed Pages** — Dashboard, Applications, Borrowers, Reports, Settings
- **Dark Mode** — Header toggle + Settings page toggle; respects system preference; persists in localStorage
- **LoanDetailModal** — Click any LOP row for full loan details, property info, and activity timeline
- **Search & Filter** — Real-time search + status filter chips on Dashboard and Applications
- **Sortable Columns** — Click column headers to sort ascending/descending
- **CSV Export** — One-click export of loan data
- **Reports** — Bar chart (monthly originations) + loan type breakdown visualization
- **Settings** — Profile form, appearance toggles, notification preferences
- **Toast Notifications** — Feedback for user actions
- **Keyboard Shortcuts** — `Esc` closes modal, `/` focuses search
- **Responsive** — 1400px max-width down to mobile
- **Compact Buttons** — Dense, professional UI with smaller padding/fonts
- **Hash-Based Routing** — Browser back/forward works; deep-linkable via `#applications`, `#reports`, etc.

## Project Structure

```
loanflow/
├── index.html                   # Main HTML shell (all 5 pages)
├── app.js                       # Entry point — wires all modules
├── components/
│   ├── dashboard.js             # LOP table, filters, sorting, CSV export
│   ├── loanDetailModal.js       # Modal for loan details + timeline
│   ├── applications.js          # Applications pipeline page
│   ├── borrowers.js             # Borrower directory page
│   ├── reports.js               # Charts + analytics page
│   └── settings.js              # Settings form handlers
├── utils/
│   ├── router.js                # Hash-based client-side router
│   ├── theme.js                 # Dark mode toggle + persistence
│   ├── toast.js                 # Toast notification system
│   ├── helpers.js               # Shared utilities (capitalize, formatDate, etc.)
│   └── data.js                  # All sample data
├── styles/
│   └── main.css                 # Full design system (light + dark themes)
├── assets/
│   └── logo.svg                 # LoanFlow logo
└── README.md
```

## Usage

Open `index.html` in any modern browser. No build step required.

> **Note:** Since this uses ES modules (`type="module"`), you need to serve it via a local server rather than opening the file directly via `file://`. Use any of these:
>
> ```bash
> # Python
> python3 -m http.server 8000
>
> # Node.js
> npx serve .
>
> # VS Code
> # Use the "Live Server" extension
> ```

## Design Tokens

All colors, spacing, and transitions are managed via CSS custom properties in `:root` and `[data-theme="dark"]`. Override them to theme the app.
