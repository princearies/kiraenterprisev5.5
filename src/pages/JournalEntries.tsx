import React, { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useJournals, useAccounts, useJournalDetail } from '../hooks/useData';
import { LoadingState, ErrorState, EmptyState, PageHeader, SuccessBanner } from '../components/ui/States';
import { formatCurrency, validateJournalBalance } from '../utils/currency';
import { Plus, Search, Eye, Edit2, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import type { JournalEntry, JournalLine, Account } from '../types';

export default function JournalEntries() {
  const { currentCompany } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [viewEntryId, setViewEntryId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: journals, loading, error, refetch } = useJournals(
    currentCompany?.company_id || null,
    { status: filterStatus !== 'all' ? filterStatus : undefined, search: searchTerm || undefined }
  );
  const { data: companyAccounts } = useAccounts(currentCompany?.company_id || null);
  const { data: journalDetail } = useJournalDetail(viewEntryId);

  const getAccountName = useCallback((accountId: string): string => {
    if (!companyAccounts) return 'Unknown';
    const account = companyAccounts.find(a => a.id === accountId);
    return account ? `${account.code} - ${account.name}` : 'Unknown';
  }, [companyAccounts]);

  if (loading) {
    return <LoadingState message="Loading journal entries..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load journals" onRetry={refetch} details={error} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Journal Entries" subtitle={journals ? `${journals.length} entries` : ''} actions={
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
          <Plus size={16} /> New Journal
        </button>
      } />

      {successMessage && <SuccessBanner message={successMessage} onDismiss={() => setSuccessMessage(null)} />}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
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

      {/* Journal Table */}
      {!journals || journals.length === 0 ? (
        <EmptyState
          title="No journal entries found"
          description="Create your first journal entry to start recording transactions."
          action={{ label: 'New Journal', onClick: () => setShowForm(true) }}
        />
      ) : (
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
                {journals.map(journal => (
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
                        <button onClick={() => setViewEntryId(journal.id)} className="p-1.5 text-gray-400 hover:text-gray-600" title="View">
                          <Eye size={14} />
                        </button>
                        {journal.status === 'draft' && (
                          <button className="p-1.5 text-gray-400 hover:text-blue-600" title="Edit">
                            <Edit2 size={14} />
                          </button>
                        )}
                        {journal.status === 'posted' && (
                          <span className="p-1.5 text-gray-300" title="Posted entries cannot be edited">
                            <Lock size={14} />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Entry Detail */}
      {viewEntryId && journalDetail && (
        <JournalDetailView
          entry={journalDetail.entry}
          lines={journalDetail.lines}
          getAccountName={getAccountName}
          onClose={() => setViewEntryId(null)}
        />
      )}

      {/* New Journal Modal */}
      {showForm && companyAccounts && (
        <JournalFormModal
          accounts={companyAccounts}
          onClose={() => setShowForm(false)}
          onSaved={(msg) => { setShowForm(false); setSuccessMessage(msg); refetch(); }}
        />
      )}
    </div>
  );
}

// ============ Journal Detail View ============
interface JournalDetailViewProps {
  entry: JournalEntry;
  lines: JournalLine[];
  getAccountName: (id: string) => string;
  onClose: () => void;
}

function JournalDetailView({ entry, lines, getAccountName, onClose }: JournalDetailViewProps) {
  const isBalanced = lines.length > 0 ? validateJournalBalance(lines) : false;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-800">{entry.entry_number} - {entry.description}</h3>
          <p className="text-xs text-gray-500">Date: {entry.entry_date} | Source: {entry.source_document || 'N/A'} | Status: {entry.status}</p>
        </div>
        <div className="flex items-center gap-2">
          {isBalanced ? (
            <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle size={14} /> Balanced</span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-red-600"><AlertCircle size={14} /> Unbalanced</span>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm ml-2">✕</button>
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
          {lines.map(line => (
            <tr key={line.id}>
              <td className="py-2">{getAccountName(line.account_id)}</td>
              <td className="py-2 text-gray-600">{line.description}</td>
              <td className="py-2 text-right font-mono">{line.debit > 0 ? formatCurrency(line.debit) : '-'}</td>
              <td className="py-2 text-right font-mono">{line.credit > 0 ? formatCurrency(line.credit) : '-'}</td>
            </tr>
          ))}
          <tr className="border-t-2 border-gray-300 font-bold">
            <td className="py-2" colSpan={2}>Total</td>
            <td className="py-2 text-right font-mono">{formatCurrency(entry.total_debit)}</td>
            <td className="py-2 text-right font-mono">{formatCurrency(entry.total_credit)}</td>
          </tr>
        </tbody>
      </table>
      {entry.status === 'posted' && (
        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
          <Lock size={12} /> Posted entries cannot be edited. Use reversal entry for corrections.
        </p>
      )}
    </div>
  );
}

// ============ Journal Form Modal ============
interface JournalFormModalProps {
  accounts: Account[];
  onClose: () => void;
  onSaved: (message: string) => void;
}

interface JournalLineForm {
  account_id: string;
  description: string;
  debit: string;
  credit: string;
}

function JournalFormModal({ accounts, onClose, onSaved }: JournalFormModalProps) {
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    entry_date: new Date().toISOString().split('T')[0],
    description: '',
    source_document: '',
    reference: '',
  });
  const [lines, setLines] = useState<JournalLineForm[]>([
    { account_id: '', description: '', debit: '', credit: '' },
    { account_id: '', description: '', debit: '', credit: '' },
  ]);

  const addLine = () => {
    setLines(prev => [...prev, { account_id: '', description: '', debit: '', credit: '' }]);
  };

  const removeLine = (index: number) => {
    if (lines.length <= 2) return; // Minimum 2 lines for double-entry
    setLines(prev => prev.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: keyof JournalLineForm, value: string) => {
    setLines(prev => prev.map((line, i) => i === index ? { ...line, [field]: value } : line));
  };

  const totalDebit = lines.reduce((sum, l) => sum + (parseInt(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (parseInt(l.credit) || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const validate = (): boolean => {
    if (!formData.entry_date) { setFormError('Entry date is required'); return false; }
    if (!formData.description.trim()) { setFormError('Description is required'); return false; }
    
    const validLines = lines.filter(l => l.account_id);
    if (validLines.length < 2) { setFormError('At least 2 account lines are required'); return false; }
    
    for (const line of validLines) {
      if (!line.account_id) { setFormError('All lines must have an account selected'); return false; }
      const debit = parseInt(line.debit) || 0;
      const credit = parseInt(line.credit) || 0;
      if (debit > 0 && credit > 0) { setFormError('A line cannot have both debit and credit'); return false; }
      if (debit === 0 && credit === 0) { setFormError('Each line must have a debit or credit amount'); return false; }
    }

    if (!isBalanced) { setFormError(`Journal does not balance. Debit: ${totalDebit}, Credit: ${totalCredit}`); return false; }
    
    setFormError(null);
    return true;
  };

  const handleSaveDraft = async () => {
    if (!formData.description.trim()) { setFormError('Description is required'); return; }
    setSaving(true);
    setFormError(null);
    try {
      // In production, calls journalsApi.create() with status='draft'
      await new Promise(resolve => setTimeout(resolve, 500));
      onSaved('Journal entry saved as draft');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handlePost = async () => {
    if (!validate()) return;
    setSaving(true);
    setFormError(null);
    try {
      // In production, calls journalsApi.create() then journalsApi.post()
      await new Promise(resolve => setTimeout(resolve, 500));
      onSaved('Journal entry posted successfully');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to post');
    } finally {
      setSaving(false);
    }
  };

  const selectableAccounts = accounts.filter(a => a.parent_id); // Only leaf accounts

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-gray-800 mb-4">New Journal Entry</h2>
        
        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
            <AlertCircle size={16} /> {formError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-xs font-medium text-gray-600">Entry Date *</label>
            <input type="date" value={formData.entry_date} onChange={e => setFormData(p => ({ ...p, entry_date: e.target.value }))}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Source Document</label>
            <input type="text" value={formData.source_document} onChange={e => setFormData(p => ({ ...p, source_document: e.target.value }))}
              placeholder="e.g. INV-2024-005" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Reference</label>
            <input type="text" value={formData.reference} onChange={e => setFormData(p => ({ ...p, reference: e.target.value }))}
              placeholder="Optional reference" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-medium text-gray-600">Description *</label>
            <input type="text" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              placeholder="Enter journal description" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-700 mb-3">Journal Lines</h3>
        <div className="space-y-2 mb-4">
          {lines.map((line, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <select value={line.account_id} onChange={e => updateLine(i, 'account_id', e.target.value)}
                className="col-span-4 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option value="">Select account...</option>
                {selectableAccounts.map(a => (
                  <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                ))}
              </select>
              <input type="text" value={line.description} onChange={e => updateLine(i, 'description', e.target.value)}
                placeholder="Line description" className="col-span-3 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <input type="number" value={line.debit} onChange={e => updateLine(i, 'debit', e.target.value)}
                placeholder="Debit" className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-right" min="0" />
              <input type="number" value={line.credit} onChange={e => updateLine(i, 'credit', e.target.value)}
                placeholder="Credit" className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-right" min="0" />
              <button onClick={() => removeLine(i)} className="col-span-1 text-red-400 hover:text-red-600 text-center" disabled={lines.length <= 2}>✕</button>
            </div>
          ))}
        </div>
        <button onClick={addLine} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">+ Add Line</button>

        {/* Balance Check */}
        <div className={`mt-4 p-3 rounded-lg flex items-center justify-between ${isBalanced ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 border border-gray-200'}`}>
          <span className="text-sm text-gray-600">Balance Check:</span>
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono">Dr: {formatCurrency(totalDebit)}</span>
            <span className="text-sm font-mono">Cr: {formatCurrency(totalCredit)}</span>
            {isBalanced ? (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium"><CheckCircle size={14} /> Balanced</span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-amber-600 font-medium"><AlertCircle size={14} /> Not balanced</span>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
          <button onClick={handleSaveDraft} disabled={saving}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            Save as Draft
          </button>
          <button onClick={handlePost} disabled={saving || !isBalanced}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50">
            {saving ? 'Posting...' : 'Post Entry'}
          </button>
        </div>
      </div>
    </div>
  );
}
