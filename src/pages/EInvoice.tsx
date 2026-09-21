import React, { useState } from 'react';
import { eInvoices } from '../store/mockData';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { FileCheck, AlertTriangle, CheckCircle, XCircle, Clock, RefreshCw, ExternalLink } from 'lucide-react';

export default function EInvoice() {
  const { currentCompany } = useApp();
  const [filterStatus, setFilterStatus] = useState('all');

  const companyEInvoices = eInvoices.filter(e => e.company_id === currentCompany?.company_id);
  const filtered = filterStatus === 'all' ? companyEInvoices : companyEInvoices.filter(e => e.status === filterStatus);

  const statusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'rejected': return <XCircle size={16} className="text-red-500" />;
      case 'submitted': return <Clock size={16} className="text-blue-500" />;
      case 'cancelled': return <XCircle size={16} className="text-gray-500" />;
      default: return <AlertTriangle size={16} className="text-amber-500" />;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-emerald-100 text-emerald-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-gray-100 text-gray-700';
      case 'draft': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Warning */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-blue-600 mt-0.5 shrink-0" size={18} />
          <div>
            <h3 className="font-semibold text-blue-800 text-sm">e-Invoice Module - Development Mode</h3>
            <p className="text-xs text-blue-700 mt-1">
              This module uses a mock adapter for development. Real MyInvois submission requires LHDN credentials 
              configured in Cloudflare Secrets. Do not submit real documents without explicit configuration and user confirmation.
              Verify all e-Invoice requirements with LHDN before production use.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Total e-Invoices</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{companyEInvoices.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Valid</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{companyEInvoices.filter(e => e.status === 'valid').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{companyEInvoices.filter(e => e.status === 'submitted').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Rejected/Errors</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{companyEInvoices.filter(e => e.status === 'rejected' || e.status === 'invalid').length}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="all">All Status</option>
          <option value="not_ready">Not Ready</option>
          <option value="draft">Draft</option>
          <option value="queued">Queued</option>
          <option value="submitted">Submitted</option>
          <option value="valid">Valid</option>
          <option value="invalid">Invalid</option>
          <option value="cancelled">Cancelled</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* e-Invoice List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Invoice #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Buyer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Buyer TIN</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Classification</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(ei => (
                <tr key={ei.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {statusIcon(ei.status)}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor(ei.status)}`}>{ei.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{ei.invoice_number}</td>
                  <td className="px-4 py-3">{ei.buyer_name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{ei.buyer_tin}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatCurrency(ei.total_amount)}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{ei.classification_code}</span></td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {ei.status === 'rejected' && <button className="p-1.5 text-amber-500 hover:text-amber-700" title="Retry"><RefreshCw size={14} /></button>}
                      {ei.qr_code && <button className="p-1.5 text-blue-500 hover:text-blue-700" title="Verify"><ExternalLink size={14} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adapter Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-3">e-Invoice Adapter Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-xs font-medium text-emerald-700">✓ Mock Adapter</p>
            <p className="text-[10px] text-emerald-600 mt-1">Active for development</p>
          </div>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-60">
            <p className="text-xs font-medium text-gray-600">○ MyInvois Sandbox</p>
            <p className="text-[10px] text-gray-500 mt-1">Requires LHDN sandbox credentials</p>
          </div>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-60">
            <p className="text-xs font-medium text-gray-600">○ MyInvois Production</p>
            <p className="text-[10px] text-gray-500 mt-1">Requires production credentials</p>
          </div>
        </div>
        <p className="text-[10px] text-gray-500 mt-3">
          Supports both portal and API transmission methods. Credentials stored in Cloudflare Secrets only.
        </p>
      </div>
    </div>
  );
}
