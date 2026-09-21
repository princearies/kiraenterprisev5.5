import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { User, Company } from '../types';
import { companies as mockCompanies, users as mockUsers } from '../store/mockData';
import { httpClient } from '../services/api/client';
import { API_CONFIG } from '../services/api/config';

interface AppState {
  currentUser: User | null;
  currentCompany: Company | null;
  companies: Company[];
  isAuthenticated: boolean;
  sidebarOpen: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setCurrentCompany: (company: Company | null) => void;
  toggleSidebar: () => void;
  refreshCompanies: () => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize - check for existing session or show login
  useEffect(() => {
    const init = async () => {
      // Always show login screen on fresh load
      // User must explicitly login (even in mock mode)
      setIsLoading(false);
    };
    init();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Try API login first (if not in mock mode)
    if (!API_CONFIG.useMock) {
      try {
        const { authApi, companiesApi } = await import('../services/api');
        const response = await authApi.login({ email, password });
        httpClient.setAuthToken(response.token);
        
        setCurrentUser({
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role as User['role'],
          company_id: null,
          created_at: new Date().toISOString(),
        });
        
        const companyList = await companiesApi.list();
        setCompanies(companyList);
        if (companyList.length > 0) {
          setCurrentCompany(companyList[0]);
          httpClient.setCompanyId(companyList[0].company_id);
        }
        
        setIsAuthenticated(true);
        return true;
      } catch (error) {
        console.warn('API login failed, falling back to mock data:', error);
        // Fall through to mock login
      }
    }

    // Fallback to mock login (always works for demo)
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setCompanies(mockCompanies);
      if (user.company_id) {
        const company = mockCompanies.find(c => c.company_id === user.company_id);
        setCurrentCompany(company || mockCompanies[0]);
      } else {
        setCurrentCompany(mockCompanies[0]);
      }
      setIsAuthenticated(true);
      return true;
    }
    
    console.error('Login failed: User not found in mock data');
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCurrentCompany(null);
    setCompanies([]);
    setIsAuthenticated(false);
    httpClient.clearAuth();
  }, []);

  const handleSetCurrentCompany = useCallback((company: Company | null) => {
    setCurrentCompany(company);
    if (company) {
      httpClient.setCompanyId(company.company_id);
    }
  }, []);

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);

  const refreshCompanies = useCallback(async () => {
    if (API_CONFIG.useMock) {
      setCompanies(mockCompanies);
      return;
    }
    try {
      const { companiesApi } = await import('../services/api');
      const companyList = await companiesApi.list();
      setCompanies(companyList);
    } catch {
      // Keep existing companies on error
    }
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser,
      currentCompany,
      companies,
      isAuthenticated,
      sidebarOpen,
      isLoading,
      login,
      logout,
      setCurrentCompany: handleSetCurrentCompany,
      toggleSidebar,
      refreshCompanies,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
