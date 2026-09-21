import React, { useState } from 'react';
import { invoices, invoiceLines, customers, items } from '../store/mockData';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { Plus, Search, Eye, Printer, Download, FileText } from 'lucide-react';

export default function Sales() {
  const { currentCompany } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<string | null>(null);

  const companyInvoices = invoices.filter(i => i.company_id === currentCompany?.company_id);
  const filtered = companyInvoices.filter(i => {
    const matchSearch = i.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getCustomer = (id: string) => customers.find(c => c.id === id);
  const getLines = (invId: string) => invoiceLines.filter(l => l.invoice_id === invId);
  const selectedInvoice = viewInvoice ? companyInvoices.find(i => i.id === viewInvoice) : null;
  const selectedLines = viewInvoice ? getLines(viewInvoice) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search invoices..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="issued">Issued</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
          <Plus size={16} /> New Invoice
        </button>
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Invoice #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Due Date</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Total</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{inv.invoice_number}</td>
                  <td className="px-4 py-3">{getCustomer(inv.customer_id)?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-gray-600">{inv.date}</td>
                  <td className="px-4 py-3 text-gray-600">{inv.due_date}</td>
                  <td className="px-4 py-3 text-right font-mono font-medium">{formatCurrency(inv.total)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                      inv.status === 'overdue' ? 'bg-red-100 text-red-700' :
                      inv.status === 'partially_paid' ? 'bg-amber-100 text-amber-700' :
                      inv.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{inv.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setViewInvoice(inv.id)} className="p-1.5 text-gray-400 hover:text-gray-600"><Eye size={14} /></button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600"><Printer size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Preview */}
      {selectedInvoice && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-3xl mx-auto" id="invoice-preview">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{currentCompany?.legal_name}</h2>
              <p className="text-sm text-gray-500">{currentCompany?.business_address}</p>
              <p className="text-sm text-gray-500">{currentCompany?.district}, {currentCompany?.state} {currentCompany?.postcode}</p>
              <p className="text-xs text-gray-400 mt-1">SSM: {currentCompany?.ssm_number} | TIN: {currentCompany?.tin}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold text-emerald-600">INVOICE</h3>
              <p className="font-mono text-sm">{selectedInvoice.invoice_number}</p>
              <p className="text-xs text-gray-500 mt-2">Date: {selectedInvoice.date}</p>
              <p className="text-xs text-gray-500">Due: {selectedInvoice.due_date}</p>
            </div>
          </div>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Bill To:</p>
            <p className="font-semibold">{getCustomer(selectedInvoice.customer_id)?.name}</p>
            <p className="text-sm text-gray-600">{getCustomer(selectedInvoice.customer_id)?.address}</p>
            <p className="text-xs text-gray-500">TIN: {getCustomer(selectedInvoice.customer_id)?.tin}</p>
          </div>
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2">Description</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-right py-2">Unit Price</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {selectedLines.map(line => (
                <tr key={line.id}>
                  <td className="py-2">{line.description}</td>
                  <td className="py-2 text-center">{line.quantity}</td>
                  <td className="py-2 text-right font-mono">{formatCurrency(line.unit_price)}</td>
                  <td className="py-2 text-right font-mono">{formatCurrency(line.line_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-mono">{formatCurrency(selectedInvoice.subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span>Tax</span><span className="font-mono">{formatCurrency(selectedInvoice.tax_amount)}</span></div>
              <div className="flex justify-between text-sm"><span>Discount</span><span className="font-mono">{formatCurrency(selectedInvoice.discount)}</span></div>
              <div className="flex justify-between font-bold text-lg border-t-2 border-gray-300 pt-2"><span>Total</span><span className="font-mono">{formatCurrency(selectedInvoice.total)}</span></div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-200 grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-gray-500">Notes:</p>
              <p className="text-sm text-gray-600">{selectedInvoice.notes}</p>
            </div>
            <div className="text-right">
              <div className="border-b border-gray-300 mb-2 h-10"></div>
              <p className="text-xs text-gray-500">Authorized Signature</p>
            </div>
          </div>
        </div>
      )}

      {/* New Invoice Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Create New Invoice</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-xs font-medium text-gray-600">Customer</label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="">Select customer...</option>
                  {customers.filter(c => c.company_id === currentCompany?.company_id).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Invoice Date</label>
                <input type="date" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Due Date</label>
                <input type="date" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Line Items</h3>
            <div className="space-y-2 mb-4">
              <div className="grid grid-cols-12 gap-2 items-center">
                <select className="col-span-5 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="">Select item...</option>
                  {items.filter(i => i.company_id === currentCompany?.company_id).map(i => (
                    <option key={i.id} value={i.id}>{i.code} - {i.name}</option>
                  ))}
                </select>
                <input type="number" placeholder="Qty" className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-right" />
                <input type="number" placeholder="Unit Price" className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-right" />
                <input type="text" placeholder="Tax Code" className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <button className="col-span-1 text-red-400 hover:text-red-600 text-center">✕</button>
              </div>
            </div>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">+ Add Line Item</button>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Save as Draft</button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Issue Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
