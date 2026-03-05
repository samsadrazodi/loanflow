import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useTheme } from '../utils/useTheme';
import { useToast } from '../utils/useToast';
import Header from '../components/Header';
import ToastContainer from '../components/ToastContainer';
import DashboardPage from '../components/DashboardPage';
import ApplicationsPage from '../components/ApplicationsPage';
import BorrowersPage from '../components/BorrowersPage';
import ReportsPage from '../components/ReportsPage';
import SettingsPage from '../components/SettingsPage';
import LoanDetailModal from '../components/LoanDetailModal';

export default function Home() {
  const [page, setPage] = useState('dashboard');
  const [modalLoan, setModalLoan] = useState(null);
  const { toggle: toggleTheme, isDark } = useTheme();
  const { toasts, show: showToast } = useToast();

  useEffect(() => {
    const onHash = () => { const h = window.location.hash.replace('#','') || 'dashboard'; if (['dashboard','applications','borrowers','reports','settings'].includes(h)) setPage(h); };
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback(p => { setPage(p); window.location.hash = p === 'dashboard' ? '' : p; }, []);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setModalLoan(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (<>
    <Head><title>LoanFlow v2.0 — LOP Dashboard</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
    <div className="app-wrapper">
      <Header activePage={page} onNavigate={navigate} isDark={isDark} onToggleTheme={toggleTheme} />
      <main className="dashboard-content">
        {page === 'dashboard' && <DashboardPage onOpenModal={setModalLoan} onToast={showToast} />}
        {page === 'applications' && <ApplicationsPage onToast={showToast} />}
        {page === 'borrowers' && <BorrowersPage onToast={showToast} />}
        {page === 'reports' && <ReportsPage onToast={showToast} />}
        {page === 'settings' && <SettingsPage isDark={isDark} onToggleTheme={toggleTheme} onToast={showToast} />}
      </main>
    </div>
    {modalLoan && <LoanDetailModal loan={modalLoan} onClose={() => setModalLoan(null)} onToast={showToast} />}
    <ToastContainer toasts={toasts} />
  </>);
}
