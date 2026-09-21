import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Building2, Users, Truck, Package, Receipt, ShoppingCart, CreditCard, Landmark, BookOpen, BookText, Scale, BarChart3, FileCheck, Calculator, CalendarCheck, CreditCard as SubIcon, Settings, ScrollText, Menu, X, LogOut, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'suppliers', label: 'Suppliers', icon: Truck },
  { id: 'items', label: 'Items', icon: Package },
  { id: 'sales', label: 'Sales', icon: Receipt },
  { id: 'purchases', label: 'Purchases', icon: ShoppingCart },
  { id: 'expenses', label: 'Expenses', icon: CreditCard },
  { id: 'banking', label: 'Banking', icon: Landmark },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'ledger', label: 'General Ledger', icon: BookText },
  { id: 'trial-balance', label: 'Trial Balance', icon: Scale },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'einvoice', label: 'e-Invoice', icon: FileCheck },
  { id: 'zakat', label: 'Zakat', icon: Calculator },
  { id: 'yearend', label: 'Year End', icon: CalendarCheck },
  { id: 'subscription', label: 'Subscription', icon: SubIcon },
  { id: 'audit-log', label: 'Audit Log', icon: ScrollText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { currentUser, currentCompany, logout, sidebarOpen, toggleSidebar } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform transition-transform duration-200 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center font-bold text-sm">KE</div>
            <div>
              <h1 className="font-bold text-sm">KiraEnterprise</h1>
              <p className="text-[10px] text-slate-400">v5.5 • Malaysian Accounting</p>
            </div>
          </div>
        </div>

        {/* Company selector */}
        {currentCompany && (
          <div className="p-3 border-b border-slate-700">
            <div className="bg-slate-700/50 rounded-lg p-2">
              <p className="text-xs text-slate-400">Active Company</p>
              <p className="text-sm font-medium truncate">{currentCompany.trading_name}</p>
              <p className="text-[10px] text-slate-400">{currentCompany.company_code}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${currentPage === item.id ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'}`}
            >
              <item.icon size={18} />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className="p-3 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs font-medium">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-slate-400">{currentUser?.role}</p>
            </div>
            <button onClick={logout} className="text-slate-400 hover:text-white">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 sticky top-0 z-30">
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-900">
            <Menu size={24} />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800 capitalize">
              {navItems.find(i => i.id === currentPage)?.label || currentPage}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
              <AlertTriangle size={14} />
              <span>Verify tax/e-Invoice requirements with LHDN or qualified accountant</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
