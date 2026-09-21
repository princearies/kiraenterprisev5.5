import React, { useState } from 'react';
import { customers, suppliers, items, zakatProfiles, yearEndPackages, auditLogs, subscriptions, plans, accountingPeriods, accounts } from '../store/mockData';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { Plus, Search, Edit2, AlertTriangle, CheckCircle, Lock, Unlock, Calendar, FileText, Printer, Download, Shield, CreditCard } from 'lucide-react';

// ============ CUSTOMERS ============
export function Customers() {
  const { currentCompany } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const companyCustomers = customers.filter(c => c.company_id === currentCompany?.company_id);
  const filtered = companyCustomers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search customers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
          <Plus size={16} /> Add Customer
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">TIN</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">BRN</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">State</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Classification</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Contact</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{c.tin}</td>
                  <td className="px-4 py-3 font-mono text-xs">{c.brn || '-'}</td>
                  <td className="px-4 py-3">{c.state}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{c.classification_code}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-600">{c.phone}<br/>{c.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ SUPPLIERS ============
export function Suppliers() {
  const { currentCompany } = useApp();
  const companySuppliers = suppliers.filter(s => s.company_id === currentCompany?.company_id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-gray-500">{companySuppliers.length} suppliers</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
          <Plus size={16} /> Add Supplier
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companySuppliers.map(s => (
          <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{s.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{s.address}, {s.state} {s.postcode}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">{s.is_active ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="mt-3 space-y-1 text-xs text-gray-600">
              <p>TIN: <span className="font-mono">{s.tin}</span></p>
              <p>BRN: <span className="font-mono">{s.brn || 'N/A'}</span></p>
              <p>Contact: {s.phone} | {s.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ ITEMS ============
export function Items() {
  const { currentCompany } = useApp();
  const companyItems = items.filter(i => i.company_id === currentCompany?.company_id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-gray-500">{companyItems.length} items</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
          <Plus size={16} /> Add Item
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Code</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Unit Price</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Cost Price</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Tax Code</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Classification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {companyItems.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{item.code}</td>
                <td className="px-4 py-3">{item.name}<p className="text-xs text-gray-500">{item.description}</p></td>
                <td className="px-4 py-3"><span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{item.type}</span></td>
                <td className="px-4 py-3 text-right font-mono">{formatCurrency(item.unit_price)}</td>
                <td className="px-4 py-3 text-right font-mono">{formatCurrency(item.cost_price)}</td>
                <td className="px-4 py-3"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.tax_code}</span></td>
                <td className="px-4 py-3"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.classification_code}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ ZAKAT ============
export function Zakat() {
  const { currentCompany } = useApp();
  const companyZakat = zakatProfiles.filter(z => z.company_id === currentCompany?.company_id);

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-amber-600 mt-0.5 shrink-0" size={18} />
          <div>
            <h3 className="font-semibold text-amber-800 text-sm">Accounting Aid Only</h3>
            <p className="text-xs text-amber-700 mt-1">
              This zakat calculation module is an accounting aid only. It is not an official zakat ruling. 
              Zakat rates, nisab thresholds, and calculation methods are configurable and must be verified 
              with your state zakat authority (e.g., MAINS Sabah) or a qualified zakat officer.
            </p>
          </div>
        </div>
      </div>

      {companyZakat.map(z => (
        <div key={z.id} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800">{z.name}</h3>
              <p className="text-xs text-gray-500">Zakat Year: {z.zakat_year} | Method: {z.calculation_method.replace('_', ' ')}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${z.approval_status === 'approved' ? 'bg-emerald-100 text-emerald-700' : z.approval_status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                {z.approval_status}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${z.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                {z.payment_status}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-[10px] text-gray-500">Nisab</p>
              <p className="text-sm font-bold">{formatCurrency(z.nisab)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-[10px] text-gray-500">Rate</p>
              <p className="text-sm font-bold">{z.rate}%</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-[10px] text-gray-500">Eligible Amount</p>
              <p className="text-sm font-bold">{formatCurrency(z.eligible_amount)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-[10px] text-gray-500">Deductions</p>
              <p className="text-sm font-bold">{formatCurrency(z.deductions)}</p>
            </div>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-700">Calculated Zakat Amount</p>
              <p className="text-2xl font-bold text-emerald-800">{formatCurrency(z.calculated_amount)}</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
              <Printer size={14} /> Print Summary
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-3">Formula: ({z.eligible_amount} - {z.deductions} + {z.manual_adjustments}) × {z.rate}% = {formatCurrency(z.calculated_amount)}</p>
        </div>
      ))}
    </div>
  );
}

// ============ YEAR END ============
export function YearEnd() {
  const { currentCompany } = useApp();
  const companyPackages = yearEndPackages.filter(y => y.company_id === currentCompany?.company_id);

  const checks = [
    { label: 'Unbalanced journals', status: 'pass' },
    { label: 'Missing account mappings', status: 'pass' },
    { label: 'Unreconciled bank items', status: 'warning' },
    { label: 'Unpaid invoices', status: 'warning' },
    { label: 'Unpaid supplier bills', status: 'warning' },
    { label: 'Incomplete e-Invoice records', status: 'fail' },
    { label: 'Missing attachments', status: 'warning' },
    { label: 'Draft transactions', status: 'warning' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Year-End Workflow</h3>

      {companyPackages.map(pkg => (
        <div key={pkg.id} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-gray-800">Financial Year {pkg.financial_year}</h4>
              <p className="text-xs text-gray-500">Version {pkg.version}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              pkg.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
              pkg.status === 'draft' ? 'bg-amber-100 text-amber-700' :
              pkg.status === 'superseded' ? 'bg-gray-100 text-gray-600' :
              'bg-blue-100 text-blue-700'
            }`}>{pkg.status}</span>
          </div>

          {/* Checks */}
          {pkg.status === 'draft' && (
            <div className="mb-6">
              <h5 className="text-sm font-semibold text-gray-700 mb-3">Pre-Closing Checks</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {checks.map((check, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    {check.status === 'pass' ? <CheckCircle size={14} className="text-emerald-500" /> :
                     check.status === 'warning' ? <AlertTriangle size={14} className="text-amber-500" /> :
                     <AlertTriangle size={14} className="text-red-500" />}
                    <span className="text-xs text-gray-700">{check.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reports Generated */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className={`p-3 rounded-lg border ${pkg.trial_balance_generated ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
              <p className="text-[10px] text-gray-500">Trial Balance</p>
              <p className="text-xs font-medium">{pkg.trial_balance_generated ? '✓ Generated' : '○ Pending'}</p>
            </div>
            <div className={`p-3 rounded-lg border ${pkg.pnl_generated ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
              <p className="text-[10px] text-gray-500">Profit & Loss</p>
              <p className="text-xs font-medium">{pkg.pnl_generated ? '✓ Generated' : '○ Pending'}</p>
            </div>
            <div className={`p-3 rounded-lg border ${pkg.balance_sheet_generated ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
              <p className="text-[10px] text-gray-500">Balance Sheet</p>
              <p className="text-xs font-medium">{pkg.balance_sheet_generated ? '✓ Generated' : '○ Pending'}</p>
            </div>
            <div className={`p-3 rounded-lg border ${pkg.checks_completed ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
              <p className="text-[10px] text-gray-500">Checks</p>
              <p className="text-xs font-medium">{pkg.checks_completed ? '✓ Completed' : '○ Pending'}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            {pkg.status === 'draft' && (
              <>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
                  <FileText size={14} /> Generate Reports
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-50">
                  <Download size={14} /> Export Package
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                  <Lock size={14} /> Publish Year-End
                </button>
              </>
            )}
            {pkg.status === 'published' && (
              <>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">
                  <Printer size={14} /> Print Package
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">
                  <Download size={14} /> Download
                </button>
                <span className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                  <Lock size={12} /> Immutable snapshot - Published {pkg.published_at} by {pkg.published_by}
                </span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============ SUBSCRIPTION ============
export function SubscriptionPage() {
  const companySubs = subscriptions;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Subscription & Billing</h3>

      {/* Current Plan */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Current Plan</p>
            <h3 className="text-2xl font-bold mt-1">Business</h3>
            <p className="text-sm opacity-80 mt-2">Up to 5 companies • 10 users • Full features</p>
            <p className="text-xs opacity-70 mt-2">Renews: 1 January 2025 • Yearly billing</p>
          </div>
          <CreditCard size={48} className="opacity-30" />
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map(plan => (
          <div key={plan.id} className={`bg-white rounded-xl border-2 p-5 ${plan.id === 'plan-business' ? 'border-emerald-500' : 'border-gray-200'}`}>
            {plan.id === 'plan-business' && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Current</span>}
            <h4 className="font-bold text-gray-800 mt-2">{plan.name}</h4>
            <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
            <p className="text-2xl font-bold text-gray-800 mt-3">RM{plan.monthly_price / 100}<span className="text-sm font-normal text-gray-500">/month</span></p>
            <p className="text-xs text-gray-500">or RM{plan.yearly_price / 100}/year (save 17%)</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle size={12} className="text-emerald-500" /> {f}
                </li>
              ))}
            </ul>
            <button className={`w-full mt-4 py-2 rounded-lg text-sm font-medium ${plan.id === 'plan-business' ? 'bg-gray-100 text-gray-500' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
              {plan.id === 'plan-business' ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="font-semibold text-gray-800 mb-3">Billing History</h4>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 font-medium text-gray-600">Date</th>
              <th className="text-left py-2 font-medium text-gray-600">Description</th>
              <th className="text-right py-2 font-medium text-gray-600">Amount</th>
              <th className="text-center py-2 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-2">2024-01-01</td>
              <td className="py-2">Business Plan - Yearly</td>
              <td className="py-2 text-right font-mono">RM 990.00</td>
              <td className="py-2 text-center"><span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Paid</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-gray-400 text-center">Payment provider not yet configured. Using mock adapter for development.</p>
    </div>
  );
}

// ============ AUDIT LOG ============
export function AuditLog() {
  const { currentCompany } = useApp();
  const companyLogs = auditLogs.filter(l => l.company_id === currentCompany?.company_id);

  const actionColors: Record<string, string> = {
    login: 'bg-blue-100 text-blue-700',
    create: 'bg-emerald-100 text-emerald-700',
    post: 'bg-purple-100 text-purple-700',
    edit: 'bg-amber-100 text-amber-700',
    delete: 'bg-red-100 text-red-700',
    lock: 'bg-gray-100 text-gray-700',
    export: 'bg-teal-100 text-teal-700',
    print: 'bg-indigo-100 text-indigo-700',
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Timestamp</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Action</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Entity</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Details</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {companyLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(log.created_at).toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}</td>
                  <td className="px-4 py-3 text-xs">{log.user_id}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${actionColors[log.action] || 'bg-gray-100 text-gray-600'}`}>{log.action}</span>
                  </td>
                  <td className="px-4 py-3 text-xs">{log.entity_type} ({log.entity_id})</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{log.details}</td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-400">{log.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ SETTINGS ============
export function SettingsPage() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h4 className="font-semibold text-gray-800 mb-3">Company Settings</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Timezone</label>
              <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>Asia/Kuala_Lumpur (MYT, UTC+8)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Base Currency</label>
              <input type="text" value="MYR" readOnly className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Financial Year End</label>
              <input type="date" defaultValue="2024-12-31" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h4 className="font-semibold text-gray-800 mb-3">Users & Roles</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Ahmad bin Ismail</p>
                <p className="text-xs text-gray-500">admin@kiraenterprise.my</p>
              </div>
              <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">accountant_owner</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Fatimah binti Ali</p>
                <p className="text-xs text-gray-500">client1@sabahtrading.my</p>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">client_owner</span>
            </div>
          </div>
          <button className="mt-3 text-sm text-emerald-600 font-medium hover:text-emerald-700">+ Invite User</button>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h4 className="font-semibold text-gray-800 mb-3">Tax Configuration</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Default Tax Rate (%)</label>
              <input type="number" defaultValue="6" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">SST Registration</label>
              <input type="text" defaultValue="W10-1901-32000001" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <p className="text-[10px] text-amber-600">⚠ Verify tax rates with LHDN / Royal Malaysian Customs</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h4 className="font-semibold text-gray-800 mb-3">e-Invoice Settings</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Adapter</label>
              <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>Mock (Development)</option>
                <option>MyInvois Sandbox</option>
                <option>MyInvois Production</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Transmission Method</label>
              <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>API</option>
                <option>Portal</option>
              </select>
            </div>
            <p className="text-[10px] text-amber-600">⚠ Credentials stored in Cloudflare Secrets only</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ BANKING ============
export function Banking() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-5 text-white">
          <p className="text-xs opacity-80">Maybank Current Account</p>
          <p className="text-2xl font-bold mt-2">{formatCurrency(1205000)}</p>
          <p className="text-xs opacity-70 mt-1">Acc: 1234-5678-9012</p>
          <p className="text-xs opacity-70">Last reconciled: 2024-05-31</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl p-5 text-white">
          <p className="text-xs opacity-80">Cash on Hand</p>
          <p className="text-2xl font-bold mt-2">{formatCurrency(50000)}</p>
          <p className="text-xs opacity-70 mt-1">Petty Cash Fund</p>
          <p className="text-xs opacity-70">Last counted: 2024-06-01</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="font-semibold text-gray-800 mb-3">Bank Reconciliation</h4>
        <p className="text-sm text-gray-600 mb-4">Match bank statement transactions with recorded entries.</p>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-600">Statement Date</label>
            <input type="date" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-600">Statement Balance</label>
            <input type="number" placeholder="0.00" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <button className="mt-5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Start Reconciliation</button>
        </div>
      </div>
    </div>
  );
}

// ============ PURCHASES ============
export function Purchases() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-gray-500">Purchase bills and supplier invoices</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
          <Plus size={16} /> Record Purchase
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <FileText className="mx-auto text-gray-300 mb-3" size={48} />
        <p className="text-gray-500 text-sm">No purchase bills recorded yet.</p>
        <p className="text-gray-400 text-xs mt-1">Create your first purchase bill to track supplier expenses.</p>
      </div>
    </div>
  );
}

// ============ EXPENSES ============
export function Expenses() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-gray-500">Track business expenses and receipts</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
          <Plus size={16} /> Add Expense
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="font-semibold text-gray-800 mb-3">Recent Expenses</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium">Office Rent - April 2024</p>
              <p className="text-xs text-gray-500">Paid via Maybank • 2024-04-01</p>
            </div>
            <p className="font-mono font-medium">{formatCurrency(300000)}</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium">Staff Salaries - May 2024</p>
              <p className="text-xs text-gray-500">Paid via Maybank • 2024-05-15</p>
            </div>
            <p className="font-mono font-medium">{formatCurrency(850000)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ GENERAL LEDGER ============
export function GeneralLedger() {
  const { currentCompany } = useApp();
  const companyAccounts = accounts.filter(a => a.company_id === currentCompany?.company_id && a.parent_id);
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-4">
        <div>
          <label className="text-xs font-medium text-gray-600">Account</label>
          <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="">All Accounts</option>
            {companyAccounts.map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">From</label>
          <input type="date" defaultValue="2024-01-01" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">To</label>
          <input type="date" defaultValue="2024-06-30" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        </div>
        <button className="mt-5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">View Ledger</button>
      </div>
      <p className="text-sm text-gray-500">Select an account and date range to view the general ledger. For full reports, use the Reports section.</p>
    </div>
  );
}

// ============ TRIAL BALANCE ============
export function TrialBalance() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
        <p className="text-gray-600 text-sm mb-3">The Trial Balance report is available in the Reports section.</p>
        <p className="text-gray-400 text-xs">Navigate to Reports → Trial Balance for the full interactive report with print and export options.</p>
      </div>
    </div>
  );
}
