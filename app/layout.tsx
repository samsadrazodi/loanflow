import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: 'LoanFlow v2.0', description: 'Loan processing dashboard' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-theme="light"><body>{children}</body></html>
}
