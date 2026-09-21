/**
 * KiraEnterprise v5.5 - Data Fetching Hooks
 * 
 * Custom hooks for data fetching with proper loading, error, and success states.
 * Uses the API client in production, falls back to mock data in development.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { API_CONFIG } from '../services/api/config';
import * as mockData from '../store/mockData';
import type { Company, Account, JournalEntry, JournalLine } from '../types';

interface UseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseMutationResult<T, V> {
  data: T | null;
  loading: boolean;
  error: string | null;
  mutate: (variables: V) => Promise<T>;
  reset: () => void;
}

/**
 * Generic data fetching hook with API/mock fallback
 */
function useQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  mockFetcher: () => T,
  deps: unknown[] = []
): UseQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (API_CONFIG.useMock) {
        // Use mock data in development
        const result = mockFetcher();
        if (mountedRef.current) {
          setData(result);
        }
      } else {
        // Use real API
        const result = await fetcher();
        if (mountedRef.current) {
          setData(result);
        }
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => { mountedRef.current = false; };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Generic mutation hook
 */
function useMutation<T, V>(
  mutator: (variables: V) => Promise<T>,
  mockMutator: (variables: V) => T
): UseMutationResult<T, V> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (variables: V): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      let result: T;
      if (API_CONFIG.useMock) {
        result = mockMutator(variables);
      } else {
        result = await mutator(variables);
      }
      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Mutation failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutator, mockMutator]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, mutate, reset };
}

// ============ Specific Hooks ============

export function useCompanies(): UseQueryResult<Company[]> {
  return useQuery<Company[]>(
    'companies',
    async () => {
      const { companiesApi } = await import('../services/api');
      return companiesApi.list();
    },
    () => mockData.companies,
    []
  );
}

export function useAccounts(companyId: string | null): UseQueryResult<Account[]> {
  return useQuery<Account[]>(
    `accounts-${companyId}`,
    async () => {
      const { accountsApi } = await import('../services/api');
      return accountsApi.list();
    },
    () => mockData.accounts.filter(a => a.company_id === companyId),
    [companyId]
  );
}

export function useJournals(companyId: string | null, filters?: { status?: string; search?: string }): UseQueryResult<JournalEntry[]> {
  return useQuery<JournalEntry[]>(
    `journals-${companyId}-${filters?.status || 'all'}`,
    async () => {
      const { journalsApi } = await import('../services/api');
      return journalsApi.list(filters);
    },
    () => {
      let result = mockData.journalEntries.filter(j => j.company_id === companyId);
      if (filters?.status && filters.status !== 'all') {
        result = result.filter(j => j.status === filters.status);
      }
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        result = result.filter(j => 
          j.entry_number.toLowerCase().includes(search) ||
          j.description.toLowerCase().includes(search)
        );
      }
      return result;
    },
    [companyId, filters?.status, filters?.search]
  );
}

export function useJournalDetail(journalId: string | null): UseQueryResult<{ entry: JournalEntry; lines: JournalLine[] } | null> {
  return useQuery<{ entry: JournalEntry; lines: JournalLine[] } | null>(
    `journal-${journalId}`,
    async () => {
      if (!journalId) return null;
      const { journalsApi } = await import('../services/api');
      return journalsApi.get(journalId);
    },
    () => {
      if (!journalId) return null;
      const entry = mockData.journalEntries.find(j => j.id === journalId) || null;
      const lines = mockData.journalLines.filter(l => l.journal_id === journalId);
      return entry ? { entry, lines } : null;
    },
    [journalId]
  );
}

export function useDashboardStats() {
  return useQuery(
    'dashboard-stats',
    async () => {
      const { reportsApi } = await import('../services/api');
      return reportsApi.dashboardStats();
    },
    () => mockData.dashboardStats,
    []
  );
}

export function useTrialBalance(companyId: string | null, dateFrom: string, dateTo: string) {
  return useQuery(
    `trial-balance-${companyId}-${dateFrom}-${dateTo}`,
    async () => {
      const { reportsApi } = await import('../services/api');
      return reportsApi.trialBalance({ date_from: dateFrom, date_to: dateTo });
    },
    () => {
      // Compute trial balance from mock data
      const companyAccounts = mockData.accounts.filter(a => a.company_id === companyId && a.parent_id);
      const companyLines = mockData.journalLines.filter(l => {
        const journal = mockData.journalEntries.find(j => j.id === l.journal_id);
        return journal?.company_id === companyId && journal?.status === 'posted';
      });

      const rows = companyAccounts.map(account => {
        const lines = companyLines.filter(l => l.account_id === account.id);
        const totalDebit = lines.reduce((sum, l) => sum + l.debit, 0);
        const totalCredit = lines.reduce((sum, l) => sum + l.credit, 0);
        const movement = totalDebit - totalCredit;
        let balance: number;
        if (account.type === 'asset' || account.type === 'expense') {
          balance = account.opening_balance + movement;
        } else {
          balance = account.opening_balance - movement;
        }
        return {
          account_id: account.id,
          code: account.code,
          name: account.name,
          type: account.type,
          debit: balance >= 0 ? balance : 0,
          credit: balance < 0 ? Math.abs(balance) : 0,
          balance,
        };
      });

      const totalDebit = rows.reduce((sum, r) => sum + r.debit, 0);
      const totalCredit = rows.reduce((sum, r) => sum + r.credit, 0);

      return {
        rows,
        total_debit: totalDebit,
        total_credit: totalCredit,
        is_balanced: totalDebit === totalCredit,
        company_name: mockData.companies.find(c => c.company_id === companyId)?.legal_name || '',
        report_date: new Date().toISOString(),
        period_from: dateFrom,
        period_to: dateTo,
      };
    },
    [companyId, dateFrom, dateTo]
  );
}

export { useQuery, useMutation };
