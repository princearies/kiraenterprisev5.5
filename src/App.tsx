import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import ChartOfAccounts from './pages/ChartOfAccounts';
import JournalEntries from './pages/JournalEntries';
import Reports from './pages/Reports';
import Sales from './pages/Sales';
import EInvoice from './pages/EInvoice';
import { Customers, Suppliers, Items, Zakat, YearEnd, SubscriptionPage, AuditLog, SettingsPage, Banking, Purchases, Expenses, GeneralLedger, TrialBalance } from './pages/OtherPages';
import { LoadingState } from './components/ui/States';

function LoginScreen() {
  const { login } = useApp();
  const [email, setEmail] = useState('admin@kiraenterprise.my');
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Try: admin@kiraenterprise.my');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center font-bold text-2xl text-white mx-auto mb-4">KE</div>
          <h1 className="text-2xl font-bold text-white">KiraEnterprise v5.5</h1>
          <p className="text-sm text-slate-400 mt-1">Malaysian Accounting & Invoicing</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sign In</h2>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full mt-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-[10px] text-gray-400 mt-4 text-center">
            Demo: admin@kiraenterprise.my / demo
          </p>
        </form>
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingState message="Loading KiraEnterprise..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

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
