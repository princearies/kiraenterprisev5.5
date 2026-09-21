import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import ChartOfAccounts from './pages/ChartOfAccounts';
import JournalEntries from './pages/JournalEntries';
import Reports from './pages/Reports';
import Sales from './pages/Sales';
import EInvoice from './pages/EInvoice';
import { Customers, Suppliers, Items, Zakat, YearEnd, SubscriptionPage, AuditLog, SettingsPage, Banking, Purchases, Expenses, GeneralLedger, TrialBalance } from './pages/OtherPages';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'companies': return <Companies />;
      case 'customers': return <Customers />;
      case 'suppliers': return <Suppliers />;
      case 'items': return <Items />;
      case 'sales': return <Sales />;
      case 'purchases': return <Purchases />;
      case 'expenses': return <Expenses />;
      case 'banking': return <Banking />;
      case 'journal': return <JournalEntries />;
      case 'ledger': return <GeneralLedger />;
      case 'trial-balance': return <TrialBalance />;
      case 'reports': return <Reports />;
      case 'einvoice': return <EInvoice />;
      case 'zakat': return <Zakat />;
      case 'yearend': return <YearEnd />;
      case 'subscription': return <SubscriptionPage />;
      case 'audit-log': return <AuditLog />;
      case 'settings': return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
