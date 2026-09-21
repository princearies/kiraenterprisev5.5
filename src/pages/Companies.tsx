import React, { useState } from 'react';
import { companies as mockCompanies } from '../store/mockData';
import { Company } from '../types';
import { Plus, Search, Edit2, Archive, MoreVertical } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Companies() {
  const { currentCompany, setCurrentCompany } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const filtered = mockCompanies.filter(c =>
    c.legal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search companies..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
          <Plus size={16} /> Add Company
        </button>
      </div>

      {/* Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(company => (
          <div key={company.company_id} className={`bg-white rounded-xl border-2 p-5 transition-all hover:shadow-md ${currentCompany?.company_id === company.company_id ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{company.trading_name}</h3>
                <p className="text-xs text-gray-500">{company.legal_name}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${company.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                {company.status}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-gray-600">
              <p><span className="font-medium">Code:</span> {company.company_code}</p>
              <p><span className="font-medium">SSM:</span> {company.ssm_number}</p>
              <p><span className="font-medium">TIN:</span> {company.tin}</p>
              <p><span className="font-medium">Type:</span> {company.entity_type.replace('_', ' ')}</p>
              <p><span className="font-medium">FY End:</span> {company.financial_year_end}</p>
              <p><span className="font-medium">Address:</span> {company.business_address}, {company.district}, {company.state} {company.postcode}</p>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
              <button onClick={() => setCurrentCompany(company)} className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${currentCompany?.company_id === company.company_id ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {currentCompany?.company_id === company.company_id ? '✓ Active' : 'Select'}
              </button>
              <button onClick={() => { setEditingCompany(company); setShowForm(true); }} className="p-1.5 text-gray-400 hover:text-gray-600">
                <Edit2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-4">{editingCompany ? 'Edit Company' : 'Add New Company'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600">Company Code</label>
                <input type="text" defaultValue={editingCompany?.company_code || ''} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Entity Type</label>
                <select defaultValue={editingCompany?.entity_type || 'private_limited'} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="sole_proprietor">Sole Proprietor</option>
                  <option value="partnership">Partnership</option>
                  <option value="private_limited">Private Limited (Sdn Bhd)</option>
                  <option value="public_limited">Public Limited (Berhad)</option>
                  <option value="llp">LLP</option>
                  <option value="cooperative">Cooperative</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Legal Name</label>
                <input type="text" defaultValue={editingCompany?.legal_name || ''} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Trading Name</label>
                <input type="text" defaultValue={editingCompany?.trading_name || ''} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">SSM Number</label>
                <input type="text" defaultValue={editingCompany?.ssm_number || ''} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">TIN</label>
                <input type="text" defaultValue={editingCompany?.tin || ''} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">SST Number</label>
                <input type="text" defaultValue={editingCompany?.sst_number || ''} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Financial Year End</label>
                <input type="date" defaultValue={editingCompany?.financial_year_end || '2024-12-31'} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-gray-600">Business Address</label>
                <input type="text" defaultValue={editingCompany?.business_address || ''} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">State</label>
                <select defaultValue={editingCompany?.state || 'Sabah'} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option>Johor</option><option>Kedah</option><option>Kelantan</option><option>Melaka</option>
                  <option>Negeri Sembilan</option><option>Pahang</option><option>Perak</option><option>Perlis</option>
                  <option>Pulau Pinang</option><option>Sabah</option><option>Sarawak</option><option>Selangor</option>
                  <option>Terengganu</option><option>WP Kuala Lumpur</option><option>WP Putrajaya</option><option>WP Labuan</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Postcode</label>
                <input type="text" defaultValue={editingCompany?.postcode || ''} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Phone</label>
                <input type="text" defaultValue={editingCompany?.phone || ''} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Email</label>
                <input type="email" defaultValue={editingCompany?.email || ''} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Base Currency</label>
                <input type="text" defaultValue={editingCompany?.base_currency || 'MYR'} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Save Company</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
