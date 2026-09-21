import React, { useState } from 'react';
import { accounts, journalLines, journalEntries } from '../store/mockData';
import { useApp } from '../context/AppContext';
import { formatCurrency, fromCents } from '../utils/currency';
import { Printer, Download, FileText, BarChart3 } from 'lucide-react';

type ReportType = 'trial-balance' | 'profit-loss' | 'balance-sheet' | 'general-ledger' | 'general-journal';

export default function Reports() {
  const { currentCompany } = useApp();
  const [activeReport, setActiveReport] = useState<ReportType>('trial-balance');
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-06-30');

  const companyAccounts = accounts.filter(a => a.company_id === currentCompany?.company_id);
  const companyLines = journalLines.filter(l => {
    const journal = journalEntries.find(j => j.id === l.journal_id);
    return journal?.company_id === currentCompany?.company_id && journal?.status === 'posted';
  });

  // Calculate account balances
  const getAccountBalance = (accountId: string) => {
    const account = companyAccounts.find(a => a.id === accountId);
    if (!account) return 0;
    const lines = companyLines.filter(l => l.account_id === accountId);
    const totalDebit = lines.reduce((sum, l) => sum + l.debit, 0);
    const totalCredit = lines.reduce((sum, l) => sum + l.credit, 0);
    const movement = totalDebit - totalCredit;
    // For assets and expenses: debit increases, for liabilities, equity, revenue: credit increases
    if (account.type === 'asset' || account.type === 'expense') {
      return account.opening_balance + movement;
    }
    return account.opening_balance - movement;
  };

  // Trial Balance
  const trialBalanceData = companyAccounts.filter(a => a.parent_id).map(a => {
    const lines = companyLines.filter(l => l.account_id === a.id);
    const totalDebit = lines.reduce((sum, l) => sum + l.debit, 0);
    const totalCredit = lines.reduce((sum, l) => sum + l.credit, 0);
    const balance = getAccountBalance(a.id);
    return { ...a, totalDebit, totalCredit, balance };
  });

  const totalDebits = trialBalanceData.reduce((sum, a) => sum + (a.balance > 0 ? a.balance : 0), 0);
  const totalCredits = trialBalanceData.reduce((sum, a) => sum + (a.balance < 0 ? Math.abs(a.balance) : 0), 0);

  // P&L
  const revenueAccounts = companyAccounts.filter(a => a.type === 'revenue' && a.parent_id);
  const expenseAccounts = companyAccounts.filter(a => a.type === 'expense' && a.parent_id);
  const totalRevenue = revenueAccounts.reduce((sum, a) => sum + Math.abs(getAccountBalance(a.id)), 0);
  const totalExpenses = expenseAccounts.reduce((sum, a) => sum + Math.abs(getAccountBalance(a.id)), 0);
  const netProfit = totalRevenue - totalExpenses;

  // Balance Sheet
  const assetAccounts = companyAccounts.filter(a => a.type === 'asset' && a.parent_id);
  const liabilityAccounts = companyAccounts.filter(a => a.type === 'liability' && a.parent_id);
  const equityAccounts = companyAccounts.filter(a => a.type === 'equity' && a.parent_id);
  const totalAssets = assetAccounts.reduce((sum, a) => sum + getAccountBalance(a.id), 0);
  const totalLiabilities = liabilityAccounts.reduce((sum, a) => sum + Math.abs(getAccountBalance(a.id)), 0);
  const totalEquity = equityAccounts.reduce((sum, a) => sum + getAccountBalance(a.id), 0) + netProfit;

  const reports = [
    { id: 'trial-balance' as ReportType, label: 'Trial Balance', icon: BarChart3 },
    { id: 'profit-loss' as ReportType, label: 'Profit & Loss', icon: FileText },
    { id: 'balance-sheet' as ReportType, label: 'Balance Sheet', icon: FileText },
    { id: 'general-ledger' as ReportType, label: 'General Ledger', icon: FileText },
    { id: 'general-journal' as ReportType, label: 'General Journal', icon: FileText },
  ];

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
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Printer size={14} /> Print
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
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
                {trialBalanceData.map(a => (
                  <tr key={a.id}>
                    <td className="py-2 font-mono text-xs text-gray-500">{a.code}</td>
                    <td className="py-2">{a.name}</td>
                    <td className="py-2 text-right font-mono">{a.balance >= 0 ? formatCurrency(a.balance) : '-'}</td>
                    <td className="py-2 text-right font-mono">{a.balance < 0 ? formatCurrency(Math.abs(a.balance)) : '-'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-400 font-bold">
                  <td className="py-3" colSpan={2}>TOTAL</td>
                  <td className="py-3 text-right font-mono">{formatCurrency(totalDebits)}</td>
                  <td className="py-3 text-right font-mono">{formatCurrency(totalCredits)}</td>
                </tr>
                <tr>
                  <td colSpan={4} className="py-2 text-center">
                    <span className={`text-xs font-medium ${totalDebits === totalCredits ? 'text-emerald-600' : 'text-red-600'}`}>
                      {totalDebits === totalCredits ? '✓ Trial Balance is in agreement' : '⚠ Trial Balance does not balance'}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Profit & Loss */}
        {activeReport === 'profit-loss' && (
          <div className="max-w-2xl mx-auto">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Revenue</h4>
                {revenueAccounts.map(a => (
                  <div key={a.id} className="flex justify-between py-1.5 text-sm">
                    <span className="text-gray-600 ml-4">{a.name}</span>
                    <span className="font-mono">{formatCurrency(Math.abs(getAccountBalance(a.id)))}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
                  <span>Total Revenue</span>
                  <span className="font-mono">{formatCurrency(totalRevenue)}</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Expenses</h4>
                {expenseAccounts.map(a => (
                  <div key={a.id} className="flex justify-between py-1.5 text-sm">
                    <span className="text-gray-600 ml-4">{a.name}</span>
                    <span className="font-mono">{formatCurrency(Math.abs(getAccountBalance(a.id)))}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
                  <span>Total Expenses</span>
                  <span className="font-mono">{formatCurrency(totalExpenses)}</span>
                </div>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gray-400 font-bold text-lg">
                <span>Net Profit / (Loss)</span>
                <span className={`font-mono ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(netProfit)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Balance Sheet */}
        {activeReport === 'balance-sheet' && (
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Assets</h4>
                {assetAccounts.map(a => (
                  <div key={a.id} className="flex justify-between py-1.5 text-sm">
                    <span className="text-gray-600 ml-4">{a.name}</span>
                    <span className="font-mono">{formatCurrency(getAccountBalance(a.id))}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
                  <span>Total Assets</span>
                  <span className="font-mono">{formatCurrency(totalAssets)}</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Liabilities</h4>
                {liabilityAccounts.map(a => (
                  <div key={a.id} className="flex justify-between py-1.5 text-sm">
                    <span className="text-gray-600 ml-4">{a.name}</span>
                    <span className="font-mono">{formatCurrency(Math.abs(getAccountBalance(a.id)))}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
                  <span>Total Liabilities</span>
                  <span className="font-mono">{formatCurrency(totalLiabilities)}</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Equity</h4>
                {equityAccounts.map(a => (
                  <div key={a.id} className="flex justify-between py-1.5 text-sm">
                    <span className="text-gray-600 ml-4">{a.name}</span>
                    <span className="font-mono">{formatCurrency(getAccountBalance(a.id))}</span>
                  </div>
                ))}
                <div className="flex justify-between py-1.5 text-sm">
                  <span className="text-gray-600 ml-4">Current Period Profit</span>
                  <span className="font-mono">{formatCurrency(netProfit)}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
                  <span>Total Equity</span>
                  <span className="font-mono">{formatCurrency(totalEquity)}</span>
                </div>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gray-400 font-bold text-lg">
                <span>Total Liabilities + Equity</span>
                <span className="font-mono">{formatCurrency(totalLiabilities + totalEquity)}</span>
              </div>
              <p className="text-center text-xs text-gray-500">
                {totalAssets === (totalLiabilities + totalEquity) ? '✓ Statement of Financial Position is balanced' : '⚠ Statement does not balance'}
              </p>
            </div>
          </div>
        )}

        {/* General Ledger */}
        {activeReport === 'general-ledger' && (
          <div className="space-y-6">
            {companyAccounts.filter(a => a.parent_id).map(account => {
              const lines = companyLines.filter(l => l.account_id === account.id);
              if (lines.length === 0) return null;
              return (
                <div key={account.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <span className="font-mono text-xs text-gray-500">{account.code}</span>
                    <span className="font-semibold text-gray-800 ml-2">{account.name}</span>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Date</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Description</th>
                        <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">Debit</th>
                        <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">Credit</th>
                        <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-1.5 text-xs text-gray-500" colSpan={2}>Opening Balance</td>
                        <td className="px-4 py-1.5 text-right font-mono text-xs">{account.opening_balance >= 0 ? formatCurrency(account.opening_balance) : '-'}</td>
                        <td className="px-4 py-1.5 text-right font-mono text-xs">{account.opening_balance < 0 ? formatCurrency(Math.abs(account.opening_balance)) : '-'}</td>
                        <td className="px-4 py-1.5 text-right font-mono text-xs font-medium">{formatCurrency(account.opening_balance)}</td>
                      </tr>
                      {lines.map((line, idx) => {
                        const journal = journalEntries.find(j => j.id === line.journal_id);
                        return (
                          <tr key={line.id} className="border-t border-gray-50">
                            <td className="px-4 py-1.5 text-xs text-gray-500">{journal?.entry_date}</td>
                            <td className="px-4 py-1.5 text-xs">{journal?.description}</td>
                            <td className="px-4 py-1.5 text-right font-mono text-xs">{line.debit > 0 ? formatCurrency(line.debit) : '-'}</td>
                            <td className="px-4 py-1.5 text-right font-mono text-xs">{line.credit > 0 ? formatCurrency(line.credit) : '-'}</td>
                            <td className="px-4 py-1.5 text-right font-mono text-xs font-medium">{formatCurrency(getAccountBalance(account.id))}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}

        {/* General Journal */}
        {activeReport === 'general-journal' && (
          <div className="space-y-4">
            {journalEntries.filter(j => j.company_id === currentCompany?.company_id && j.status === 'posted').map(journal => {
              const lines = journalLines.filter(l => l.journal_id === journal.id);
              return (
                <div key={journal.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs text-gray-500">{journal.entry_number}</span>
                      <span className="font-semibold text-gray-800 ml-2">{journal.description}</span>
                    </div>
                    <span className="text-xs text-gray-500">{journal.entry_date}</span>
                  </div>
                  <table className="w-full text-sm">
                    <tbody>
                      {lines.map(line => (
                        <tr key={line.id} className="border-t border-gray-50">
                          <td className="px-4 py-1.5 text-xs">{accounts.find(a => a.id === line.account_id)?.code} - {accounts.find(a => a.id === line.account_id)?.name}</td>
                          <td className="px-4 py-1.5 text-right font-mono text-xs w-28">{line.debit > 0 ? formatCurrency(line.debit) : ''}</td>
                          <td className="px-4 py-1.5 text-right font-mono text-xs w-28">{line.credit > 0 ? formatCurrency(line.credit) : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}

        {/* Signature space */}
        <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-3 gap-8 text-center">
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
