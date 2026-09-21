import React from 'react';
import { useApp } from '../context/AppContext';
import { useDashboardStats } from '../hooks/useData';
import { LoadingState, ErrorState } from '../components/ui/States';
import { formatCurrency } from '../utils/currency';
import { Building2, DollarSign, FileWarning, AlertCircle, TrendingUp, CalendarCheck, CreditCard, FileX, CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { invoices, eInvoices } from '../store/mockData';

export default function Dashboard() {
  const { currentCompany } = useApp();
  const { data: stats, loading, error, refetch } = useDashboardStats();

  if (loading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load dashboard" onRetry={refetch} details={error} />;
  }

  if (!stats) {
    return <ErrorState message="No data available" onRetry={refetch} />;
  }

  const widgets = [
    { label: 'Active Companies', value: stats.activeCompanies.toString(), icon: Building2, color: 'bg-blue-500', change: null },
    { label: 'Cash Balance', value: formatCurrency(stats.cashBalance), icon: DollarSign, color: 'bg-emerald-500', change: '+12.5%' },
    { label: 'Unpaid Invoices', value: formatCurrency(stats.unpaidInvoices), icon: FileWarning, color: 'bg-amber-500', change: null },
    { label: 'Unpaid Bills', value: formatCurrency(stats.unpaidBills), icon: AlertCircle, color: 'bg-red-500', change: null },
    { label: 'Profit (Current Period)', value: formatCurrency(stats.profitForPeriod), icon: TrendingUp, color: 'bg-teal-500', change: '+8.3%' },
    { label: 'e-Invoice Errors', value: stats.eInvoiceErrors.toString(), icon: FileX, color: 'bg-orange-500', change: null },
    { label: 'Missing Documents', value: stats.missingDocuments.toString(), icon: FileX, color: 'bg-purple-500', change: null },
    { label: 'Year-End Readiness', value: `${stats.yearEndReadiness}%`, icon: CalendarCheck, color: 'bg-indigo-500', change: null },
  ];

  const recentInvoices = invoices.filter(i => i.company_id === currentCompany?.company_id).slice(0, 5);
  const recentEInvoices = eInvoices.filter(e => e.company_id === currentCompany?.company_id).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-amber-600 mt-0.5 shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-amber-800 text-sm">Important Disclaimer</h3>
            <p className="text-xs text-amber-700 mt-1">
              This system is a tax-ready accounting aid. It does not automatically guarantee Malaysian tax compliance. 
              All tax rates, e-Invoice rules, LHDN requirements, and zakat calculations must be verified with LHDN, 
              a qualified accountant, or a registered tax agent before submission.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map((w, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${w.color} rounded-lg flex items-center justify-center`}>
                <w.icon className="text-white" size={20} />
              </div>
              {w.change && (
                <span className={`text-xs font-medium flex items-center gap-0.5 ${w.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                  {w.change.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {w.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">{w.value}</p>
            <p className="text-xs text-gray-500 mt-1">{w.label}</p>
          </div>
        ))}
      </div>

      {/* Subscription Status */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Subscription Status</p>
            <p className="text-lg font-bold mt-1">{stats.subscriptionStatus}</p>
            <p className="text-xs opacity-80 mt-1">Renews: 1 January 2025</p>
          </div>
          <CreditCard size={40} className="opacity-30" />
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Invoices</h3>
          <div className="space-y-3">
            {recentInvoices.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No invoices yet</p>
            ) : (
              recentInvoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{inv.invoice_number}</p>
                    <p className="text-xs text-gray-500">{inv.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(inv.total)}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                      inv.status === 'overdue' ? 'bg-red-100 text-red-700' :
                      inv.status === 'partially_paid' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{inv.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* e-Invoice Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">e-Invoice Status</h3>
          <div className="space-y-3">
            {recentEInvoices.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No e-Invoices yet</p>
            ) : (
              recentEInvoices.map(ei => (
                <div key={ei.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{ei.invoice_number}</p>
                    <p className="text-xs text-gray-500">{ei.buyer_name}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    ei.status === 'valid' ? 'bg-emerald-100 text-emerald-700' :
                    ei.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    ei.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{ei.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Year-End Readiness */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Year-End Readiness (FY{stats.currentFinancialYear})</h3>
          <span className="text-sm text-indigo-600 font-medium">{stats.yearEndReadiness}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all" style={{ width: `${stats.yearEndReadiness}%` }} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Checks Completed', done: false },
            { label: 'Trial Balance', done: false },
            { label: 'P&L Generated', done: false },
            { label: 'Balance Sheet', done: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <CheckCircle2 size={14} className={item.done ? 'text-emerald-500' : 'text-gray-300'} />
              <span className={item.done ? 'text-gray-700' : 'text-gray-400'}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
