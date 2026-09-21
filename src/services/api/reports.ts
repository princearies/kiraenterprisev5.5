/**
 * KiraEnterprise v5.5 - Reports API Service
 */

import { httpClient } from './client';

export interface TrialBalanceRow {
  account_id: string;
  code: string;
  name: string;
  type: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface TrialBalanceResponse {
  rows: TrialBalanceRow[];
  total_debit: number;
  total_credit: number;
  is_balanced: boolean;
  company_name: string;
  report_date: string;
  period_from: string;
  period_to: string;
}

export interface ProfitLossRow {
  account_id: string;
  code: string;
  name: string;
  amount: number;
}

export interface ProfitLossResponse {
  revenue: ProfitLossRow[];
  expenses: ProfitLossRow[];
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  company_name: string;
  report_date: string;
  period_from: string;
  period_to: string;
}

export interface BalanceSheetResponse {
  assets: ProfitLossRow[];
  liabilities: ProfitLossRow[];
  equity: ProfitLossRow[];
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
  net_profit: number;
  is_balanced: boolean;
  company_name: string;
  report_date: string;
  period_from: string;
  period_to: string;
}

export interface DashboardStats {
  activeCompanies: number;
  currentFinancialYear: string;
  unpaidInvoices: number;
  unpaidBills: number;
  cashBalance: number;
  profitForPeriod: number;
  eInvoiceErrors: number;
  missingDocuments: number;
  yearEndReadiness: number;
  subscriptionStatus: string;
}

export interface ReportFilters {
  date_from?: string;
  date_to?: string;
  account_id?: string;
  period_id?: string;
}

export const reportsApi = {
  async trialBalance(filters?: ReportFilters): Promise<TrialBalanceResponse> {
    const response = await httpClient.get<TrialBalanceResponse>('/api/reports/trial-balance', filters as Record<string, string>);
    return response;
  },

  async profitLoss(filters?: ReportFilters): Promise<ProfitLossResponse> {
    const response = await httpClient.get<ProfitLossResponse>('/api/reports/profit-loss', filters as Record<string, string>);
    return response;
  },

  async balanceSheet(filters?: ReportFilters): Promise<BalanceSheetResponse> {
    const response = await httpClient.get<BalanceSheetResponse>('/api/reports/balance-sheet', filters as Record<string, string>);
    return response;
  },

  async generalLedger(filters?: ReportFilters): Promise<unknown> {
    const response = await httpClient.get<unknown>('/api/reports/general-ledger', filters as Record<string, string>);
    return response;
  },

  async generalJournal(filters?: ReportFilters): Promise<unknown> {
    const response = await httpClient.get<unknown>('/api/reports/general-journal', filters as Record<string, string>);
    return response;
  },

  async dashboardStats(): Promise<DashboardStats> {
    const response = await httpClient.get<DashboardStats>('/api/reports/dashboard');
    return response;
  },
};
