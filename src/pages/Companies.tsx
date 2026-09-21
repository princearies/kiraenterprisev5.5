import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useCompanies } from '../hooks/useData';
import { LoadingState, ErrorState, EmptyState, PageHeader } from '../components/ui/States';
import { Plus, Search, Edit2 } from 'lucide-react';
import type { Company } from '../types';

export default function Companies() {
  const { currentCompany, setCurrentCompany } = useApp();
  const { data: companies, loading, error, refetch } = useCompanies();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  if (loading) {
    return <LoadingState message="Loading companies..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load companies" onRetry={refetch} details={error} />;
  }

  if (!companies || companies.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Companies" actions={
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
            <Plus size={16} /> Add Company
          </button>
        } />
        <EmptyState
          title="No companies found"
          description="Create your first company to start managing accounting records."
          action={{ label: 'Add Company', onClick: () => setShowForm(true) }}
        />
      </div>
    );
  }

  const filtered = companies.filter(c =>
    c.legal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.trading_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Companies" subtitle={`${companies.length} companies`} actions={
        <button onClick={() => { setEditingCompany(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
          <Plus size={16} /> Add Company
        </button>
      } />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search companies..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
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
              <p><span className="font-medium">Type:</span> {company.entity_type.replace(/_/g, ' ')}</p>
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
        <CompanyFormModal
          company={editingCompany}
          onClose={() => { setShowForm(false); setEditingCompany(null); }}
          onSaved={() => { setShowForm(false); setEditingCompany(null); refetch(); }}
        />
      )}
    </div>
  );
}

interface CompanyFormModalProps {
  company: Company | null;
  onClose: () => void;
  onSaved: () => void;
}

function CompanyFormModal({ company, onClose, onSaved }: CompanyFormModalProps) {
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company_code: company?.company_code || '',
    legal_name: company?.legal_name || '',
    trading_name: company?.trading_name || '',
    entity_type: company?.entity_type || 'private_limited',
    ssm_number: company?.ssm_number || '',
    tin: company?.tin || '',
    sst_number: company?.sst_number || '',
    business_address: company?.business_address || '',
    state: company?.state || 'Sabah',
    district: company?.district || '',
    postcode: company?.postcode || '',
    phone: company?.phone || '',
    email: company?.email || '',
    financial_year_end: company?.financial_year_end || '2024-12-31',
    base_currency: company?.base_currency || 'MYR',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    if (!formData.company_code.trim()) { setFormError('Company code is required'); return false; }
    if (!formData.legal_name.trim()) { setFormError('Legal name is required'); return false; }
    if (!formData.trading_name.trim()) { setFormError('Trading name is required'); return false; }
    if (!formData.ssm_number.trim()) { setFormError('SSM number is required'); return false; }
    if (!formData.tin.trim()) { setFormError('TIN is required'); return false; }
    if (!formData.email.trim()) { setFormError('Email is required'); return false; }
    if (!formData.financial_year_end) { setFormError('Financial year end is required'); return false; }
    setFormError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setFormError(null);

    try {
      // In production, this would call the API
      // For now, mock the save
      await new Promise(resolve => setTimeout(resolve, 500));
      onSaved();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save company');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-gray-800 mb-4">{company ? 'Edit Company' : 'Add New Company'}</h2>
        
        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600">Company Code *</label>
            <input type="text" value={formData.company_code} onChange={e => handleChange('company_code', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g. SB001" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Entity Type *</label>
            <select value={formData.entity_type} onChange={e => handleChange('entity_type', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="sole_proprietor">Sole Proprietor</option>
              <option value="partnership">Partnership</option>
              <option value="private_limited">Private Limited (Sdn Bhd)</option>
              <option value="public_limited">Public Limited (Berhad)</option>
              <option value="llp">LLP</option>
              <option value="cooperative">Cooperative</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Legal Name *</label>
            <input type="text" value={formData.legal_name} onChange={e => handleChange('legal_name', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Trading Name *</label>
            <input type="text" value={formData.trading_name} onChange={e => handleChange('trading_name', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">SSM Number *</label>
            <input type="text" value={formData.ssm_number} onChange={e => handleChange('ssm_number', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">TIN *</label>
            <input type="text" value={formData.tin} onChange={e => handleChange('tin', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">SST Number</label>
            <input type="text" value={formData.sst_number} onChange={e => handleChange('sst_number', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Financial Year End *</label>
            <input type="date" value={formData.financial_year_end} onChange={e => handleChange('financial_year_end', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-gray-600">Business Address *</label>
            <input type="text" value={formData.business_address} onChange={e => handleChange('business_address', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">State</label>
            <select value={formData.state} onChange={e => handleChange('state', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option>Johor</option><option>Kedah</option><option>Kelantan</option><option>Melaka</option>
              <option>Negeri Sembilan</option><option>Pahang</option><option>Perak</option><option>Perlis</option>
              <option>Pulau Pinang</option><option>Sabah</option><option>Sarawak</option><option>Selangor</option>
              <option>Terengganu</option><option>WP Kuala Lumpur</option><option>WP Putrajaya</option><option>WP Labuan</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">District</label>
            <input type="text" value={formData.district} onChange={e => handleChange('district', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Postcode</label>
            <input type="text" value={formData.postcode} onChange={e => handleChange('postcode', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Phone</label>
            <input type="text" value={formData.phone} onChange={e => handleChange('phone', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Email *</label>
            <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Base Currency</label>
            <input type="text" value={formData.base_currency} onChange={e => handleChange('base_currency', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Company'}
          </button>
        </div>
      </div>
    </div>
  );
}
