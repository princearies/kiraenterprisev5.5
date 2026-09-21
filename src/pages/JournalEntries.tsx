import React, { useState } from 'react';
import { journalEntries, journalLines, accounts } from '../store/mockData';
import { useApp } from '../context/AppContext';
import { Plus, Search, Eye, Edit2, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrency, validateJournalBalance } from '../utils/currency';

export default function JournalEntries() {
  const { currentCompany } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewEntry, setViewEntry] = useState<string | null>(null);

  const companyJournals = journalEntries.filter(j => j.company_id === currentCompany?.company_id);
  const companyAccounts = accounts.filter(a => a.company_id === currentCompany?.company_id);

  const filtered = companyJournals.filter(j => {
    const matchSearch = j.entry_number.toLowerCase().includes(searchTerm.toLowerCase()) || j.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || j.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getLinesForJournal = (journalId: string) => journalLines.filter(l => l.journal_id === journalId);
  const getAccountName = (accountId: string) => companyAccounts.find(a => a.id === accountId)?.name || 'Unknown';

  const selectedEntry = viewEntry ? companyJournals.find(j => j.id === viewEntry) : null;
  const selectedLines = viewEntry ? getLinesForJournal(viewEntry) : [];
  const isBalanced = selectedLines.length > 0 ? validateJournalBalance(selectedLines) : false;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search journals..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="posted">Posted</option>
            <option value="reversed">Reversed</option>
            <option value="voided">Voided</option>
          </select>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
          <Plus size={16} /> New Journal
        </button>
      </div>

      {/* Journal Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Entry #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Description</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Debit</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Credit</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(journal => (
                <tr key={journal.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{journal.entry_number}</td>
                  <td className="px-4 py-3 text-gray-600">{journal.entry_date}</td>
                  <td className="px-4 py-3 text-gray-800">{journal.description}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatCurrency(journal.total_debit)}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatCurrency(journal.total_credit)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      journal.status === 'posted' ? 'bg-emerald-100 text-emerald-700' :
                      journal.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                      journal.status === 'reversed' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>{journal.status}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setViewEntry(journal.id)} className="p-1.5 text-gray-400 hover:text-gray-600"><Eye size={14} /></button>
                      {journal.status === 'draft' && (
                        <button className="p-1.5 text-gray-400 hover:text-blue-600"><Edit2 size={14} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Entry Detail */}
      {selectedEntry && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800">{selectedEntry.entry_number} - {selectedEntry.description}</h3>
              <p className="text-xs text-gray-500">Date: {selectedEntry.entry_date} | Source: {selectedEntry.source_document || 'N/A'}</p>
            </div>
            <div className="flex items-center gap-2">
              {isBalanced ? (
                <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle size={14} /> Balanced</span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-red-600"><AlertCircle size={14} /> Unbalanced</span>
              )}
              <button onClick={() => setViewEntry(null)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-600">Account</th>
                <th className="text-left py-2 font-medium text-gray-600">Description</th>
                <th className="text-right py-2 font-medium text-gray-600">Debit</th>
                <th className="text-right py-2 font-medium text-gray-600">Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {selectedLines.map(line => (
                <tr key={line.id}>
                  <td className="py-2">{getAccountName(line.account_id)}</td>
                  <td className="py-2 text-gray-600">{line.description}</td>
                  <td className="py-2 text-right font-mono">{line.debit > 0 ? formatCurrency(line.debit) : '-'}</td>
                  <td className="py-2 text-right font-mono">{line.credit > 0 ? formatCurrency(line.credit) : '-'}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-300 font-bold">
                <td className="py-2" colSpan={2}>Total</td>
                <td className="py-2 text-right font-mono">{formatCurrency(selectedEntry.total_debit)}</td>
                <td className="py-2 text-right font-mono">{formatCurrency(selectedEntry.total_credit)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* New Journal Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-4">New Journal Entry</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-xs font-medium text-gray-600">Entry Date</label>
                <input type="date" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Source Document</label>
                <input type="text" placeholder="e.g. INV-2024-005" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Reference</label>
                <input type="text" placeholder="Optional reference" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs font-medium text-gray-600">Description</label>
                <input type="text" placeholder="Enter journal description" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-gray-700 mb-3">Journal Lines</h3>
            <div className="space-y-2 mb-4">
              {[1, 2].map(i => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <select className="col-span-4 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="">Select account...</option>
                    {companyAccounts.filter(a => a.parent_id).map(a => (
                      <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                    ))}
                  </select>
                  <input type="text" placeholder="Line description" className="col-span-3 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                  <input type="number" placeholder="Debit" className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-right" />
                  <input type="number" placeholder="Credit" className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-right" />
                  <button className="col-span-1 text-red-400 hover:text-red-600 text-center">✕</button>
                </div>
              ))}
            </div>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">+ Add Line</button>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-gray-600">Balance Check:</span>
              <span className="text-sm font-medium text-amber-600">Enter amounts to validate</span>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Save as Draft</button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Post Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
