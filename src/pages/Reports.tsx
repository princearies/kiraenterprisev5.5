import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTrialBalance } from '../hooks/useData';
import { LoadingState, ErrorState } from '../components/ui/States';
import { formatCurrency } from '../utils/currency';
import { Printer, Download, FileText, BarChart3 } from 'lucide-react';
import type { TrialBalanceRow } from '../services/api/reports';

type ReportType = 'trial-balance' | 'profit-loss' | 'balance-sheet' | 'general-ledger' | 'general-journal';

export default function Reports() {
  const { currentCompany } = useApp();
  const [activeReport, setActiveReport] = useState<ReportType>('trial-balance');
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-06-30');

  const { data: trialBalanceData, loading: tbLoading, error: tbError, refetch: refetchTB } = useTrialBalance(
    currentCompany?.company_id || null,
    dateFrom,
    dateTo
  );

  const reports = [
    { id: 'trial-balance' as ReportType, label: 'Trial Balance', icon: BarChart3 },
    { id: 'profit-loss' as ReportType, label: 'Profit & Loss', icon: FileText },
    { id: 'balance-sheet' as ReportType, label: 'Balance Sheet', icon: FileText },
    { id: 'general-ledger' as ReportType, label: 'General Ledger', icon: FileText },
    { id: 'general-journal' as ReportType, label: 'General Journal', icon: FileText },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!trialBalanceData) return;
    const csvRows = [
      ['Code', 'Account', 'Debit', 'Credit'],
      ...trialBalanceData.rows.map(r => [r.code, r.name, r.debit.toString(), r.credit.toString()]),
    ];
    const csv = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trial-balance-${dateFrom}-${dateTo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Report selector */}
      <div className="flex flex-wrap gap-2">
        {reports.map(r => (
          <button key={r.id} onClick={() => setActiveReport(r.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeReport === r.id ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            <r.icon size={16} /> {r.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600">From:</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600">To:</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
        </div>
        <div className="flex-1" />
        <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Printer size={14} /> Print
        </button>
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 print:p-0">
        {/* Report Header */}
        <div className="text-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{currentCompany?.legal_name}</h2>
          <p className="text-sm text-gray-500">{currentCompany?.ssm_number} | TIN: {currentCompany?.tin}</p>
          <h3 className="text-lg font-semibold text-gray-700 mt-3">
            {activeReport === 'trial-balance' && 'Trial Balance'}
            {activeReport === 'profit-loss' && 'Profit and Loss Statement'}
            {activeReport === 'balance-sheet' && 'Statement of Financial Position'}
            {activeReport === 'general-ledger' && 'General Ledger'}
            {activeReport === 'general-journal' && 'General Journal'}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Financial Year Ended {currentCompany?.financial_year_end} | Period: {dateFrom} to {dateTo} | Currency: {currentCompany?.base_currency || 'MYR'}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">Generated: {new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}</p>
        </div>

        {/* Trial Balance */}
        {activeReport === 'trial-balance' && (
          <>
            {tbLoading && <LoadingState message="Generating trial balance..." />}
            {tbError && <ErrorState message="Failed to generate trial balance" onRetry={refetchTB} details={tbError} />}
            {trialBalanceData && !tbLoading && (
              <TrialBalanceTable data={trialBalanceData.rows} totalDebit={trialBalanceData.total_debit} totalCredit={trialBalanceData.total_credit} isBalanced={trialBalanceData.is_balanced} />
            )}
          </>
        )}

        {/* Other reports - placeholder with note */}
        {activeReport !== 'trial-balance' && (
          <div className="text-center py-8">
            <FileText className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-sm text-gray-500">
              {activeReport === 'profit-loss' && 'Profit and Loss report will be generated from the API.'}
              {activeReport === 'balance-sheet' && 'Statement of Financial Position will be generated from the API.'}
              {activeReport === 'general-ledger' && 'General Ledger report will be generated from the API.'}
              {activeReport === 'general-journal' && 'General Journal report will be generated from the API.'}
            </p>
            <p className="text-xs text-gray-400 mt-2">Select date range and click Generate when API is connected.</p>
          </div>
        )}

        {/* Signature space */}
        <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-3 gap-8 text-center no-print">
          <div>
            <div className="border-b border-gray-300 mb-2 h-12"></div>
            <p className="text-xs text-gray-500">Prepared By</p>
          </div>
          <div>
            <div className="border-b border-gray-300 mb-2 h-12"></div>
            <p className="text-xs text-gray-500">Reviewed By</p>
          </div>
          <div>
            <div className="border-b border-gray-300 mb-2 h-12"></div>
            <p className="text-xs text-gray-500">Approved By</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Trial Balance Table ============
interface TrialBalanceTableProps {
  data: TrialBalanceRow[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
}

function TrialBalanceTable({ data, totalDebit, totalCredit, isBalanced }: TrialBalanceTableProps) {
  return (
    <div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-2 font-semibold text-gray-700">Code</th>
            <th className="text-left py-2 font-semibold text-gray-700">Account</th>
            <th className="text-right py-2 font-semibold text-gray-700">Debit (MYR)</th>
            <th className="text-right py-2 font-semibold text-gray-700">Credit (MYR)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map(row => (
            <tr key={row.account_id}>
              <td className="py-2 font-mono text-xs text-gray-500">{row.code}</td>
              <td className="py-2">{row.name}</td>
              <td className="py-2 text-right font-mono">{row.debit > 0 ? formatCurrency(row.debit) : '-'}</td>
              <td className="py-2 text-right font-mono">{row.credit > 0 ? formatCurrency(row.credit) : '-'}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-400 font-bold">
            <td className="py-3" colSpan={2}>TOTAL</td>
            <td className="py-3 text-right font-mono">{formatCurrency(totalDebit)}</td>
            <td className="py-3 text-right font-mono">{formatCurrency(totalCredit)}</td>
          </tr>
          <tr>
            <td colSpan={4} className="py-2 text-center">
              <span className={`text-xs font-medium ${isBalanced ? 'text-emerald-600' : 'text-red-600'}`}>
                {isBalanced ? '✓ Trial Balance is in agreement' : '⚠ Trial Balance does not balance'}
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
