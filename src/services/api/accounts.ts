/**
 * KiraEnterprise v5.5 - Chart of Accounts API Service
 */

import { httpClient } from './client';
import type { Account } from '../../types';

export interface AccountCreateRequest {
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parent_id?: string | null;
  description?: string;
  opening_balance?: number;
  currency?: string;
  is_bank?: boolean;
}

export const accountsApi = {
  async list(): Promise<Account[]> {
    const response = await httpClient.get<{ data: Account[] }>('/api/accounts');
    return response.data;
  },

  async get(accountId: string): Promise<Account> {
    const response = await httpClient.get<{ data: Account }>(`/api/accounts/${accountId}`);
    return response.data;
  },

  async create(data: AccountCreateRequest): Promise<Account> {
    const response = await httpClient.post<{ data: Account }>('/api/accounts', data);
    return response.data;
  },

  async update(accountId: string, data: Partial<AccountCreateRequest>): Promise<Account> {
    const response = await httpClient.put<{ data: Account }>(`/api/accounts/${accountId}`, data);
    return response.data;
  },

  async deactivate(accountId: string): Promise<void> {
    await httpClient.post(`/api/accounts/${accountId}/deactivate`);
  },

  async activate(accountId: string): Promise<void> {
    await httpClient.post(`/api/accounts/${accountId}/activate`);
  },
};
