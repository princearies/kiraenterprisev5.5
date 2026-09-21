import React, { useState } from 'react';
import { accounts } from '../store/mockData';
import { useApp } from '../context/AppContext';
import { Plus, Search, ChevronRight, ChevronDown } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { Account, AccountType } from '../types';

export default function ChartOfAccounts() {
  const { currentCompany } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['acc-001', 'acc-005', 'acc-008', 'acc-011', 'acc-014']));

  const companyAccounts = accounts.filter(a => a.company_id === currentCompany?.company_id);
  const rootAccounts = companyAccounts.filter(a => !a.parent_id);
  const childAccounts = (parentId: string) => companyAccounts.filter(a => a.parent_id === parentId);

  const toggleGroup = (id: string) => {
    const next = new Set(expandedGroups);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedGroups(next);
  };

  const typeColors: Record<AccountType, string> = {
    asset: 'bg-blue-100 text-blue-700',
    liability: 'bg-red-100 text-red-700',
    equity: 'bg-purple-100 text-purple-700',
    revenue: 'bg-emerald-100 text-emerald-700',
    expense: 'bg-amber-100 text-amber-700',
  };

  const renderAccount = (account: Account, isChild = false) => {
    const children = childAccounts(account.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedGroups.has(account.id);

    return (
      <div key={account.id}>
        <div className={`flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors ${isChild ? 'ml-8' : ''}`}>
          {hasChildren ? (
            <button onClick={() => toggleGroup(account.id)} className="text-gray-400 hover:text-gray-600">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : <span className="w-4" />}
          <span className="text-sm font-mono text-gray-500 w-12">{account.code}</span>
          <span className="text-sm font-medium text-gray-800 flex-1">{account.name}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeColors[account.type]}`}>{account.type}</span>
          {account.opening_balance !== 0 && (
            <span className="text-sm text-gray-600 w-28 text-right">{formatCurrency(account.opening_balance)}</span>
          )}
          {account.is_bank && <span className="text-[10px] bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded">Bank</span>}
        </div>
        {hasChildren && isExpanded && children.map(child => renderAccount(child, true))}
      </div>
    );
  };

  const filtered = searchTerm
    ? companyAccounts.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.code.includes(searchTerm))
    : rootAccounts;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search accounts..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
          <Plus size={16} /> Add Account
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-4 text-xs font-medium text-gray-500">
          <span className="w-4"></span>
          <span className="w-12">Code</span>
          <span className="flex-1">Account Name</span>
          <span className="w-16 text-center">Type</span>
          <span className="w-28 text-right">Opening Bal.</span>
        </div>
        <div className="p-2">
          {filtered.map(account => renderAccount(account))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(['asset', 'liability', 'equity', 'revenue', 'expense'] as AccountType[]).map(type => {
          const total = companyAccounts.filter(a => a.type === type).reduce((sum, a) => sum + a.opening_balance, 0);
          return (
            <div key={type} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 capitalize">{type}</p>
              <p className="text-lg font-bold text-gray-800 mt-1">{formatCurrency(total)}</p>
            </div>
          );
        })}
      </div>

      {/* Add Account Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Add New Account</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600">Account Code</label>
                  <input type="text" placeholder="e.g. 1030" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Account Type</label>
                  <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="asset">Asset</option>
                    <option value="liability">Liability</option>
                    <option value="equity">Equity</option>
                    <option value="revenue">Revenue</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Account Name</label>
                <input type="text" placeholder="e.g. Fixed Deposits" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Description</label>
                <input type="text" placeholder="Optional description" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600">Opening Balance (cents)</label>
                  <input type="number" placeholder="0" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Parent Account</label>
                  <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="">None (Root)</option>
                    {rootAccounts.map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isBank" className="rounded" />
                <label htmlFor="isBank" className="text-sm text-gray-600">This is a bank account</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Save Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
