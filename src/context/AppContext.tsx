import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Company } from '../types';
import { users, companies } from '../store/mockData';

interface AppState {
  currentUser: User | null;
  currentCompany: Company | null;
  isAuthenticated: boolean;
  sidebarOpen: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setCurrentCompany: (company: Company | null) => void;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(users[0]);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(companies[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const login = (email: string, _password: string): boolean => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      if (user.company_id) {
        const company = companies.find(c => c.company_id === user.company_id);
        setCurrentCompany(company || null);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentCompany(null);
    setIsAuthenticated(false);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <AppContext.Provider value={{ currentUser, currentCompany, isAuthenticated, sidebarOpen, login, logout, setCurrentCompany, toggleSidebar }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
