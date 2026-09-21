/**
 * KiraEnterprise v5.5 - Journal Entries API Service
 * 
 * Enforces double-entry bookkeeping rules:
 * - Total debit must equal total credit
 * - Posted journals cannot be silently edited or deleted
 * - Corrections must use reversal entries
 */

import { httpClient } from './client';
import type { JournalEntry, JournalLine } from '../../types';

export interface JournalLineRequest {
  account_id: string;
  description?: string;
  debit: number;
  credit: number;
  currency?: string;
  exchange_rate?: number;
}

export interface JournalCreateRequest {
  entry_date: string;
  description: string;
  source_document?: string;
  reference?: string;
  period_id?: string;
  lines: JournalLineRequest[];
}

export interface JournalListFilters {
  status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export const journalsApi = {
  async list(filters?: JournalListFilters): Promise<JournalEntry[]> {
    const response = await httpClient.get<{ data: JournalEntry[] }>('/api/journals', filters as Record<string, string>);
    return response.data;
  },

  async get(journalId: string): Promise<{ entry: JournalEntry; lines: JournalLine[] }> {
    const response = await httpClient.get<{ data: { entry: JournalEntry; lines: JournalLine[] } }>(`/api/journals/${journalId}`);
    return response.data;
  },

  async create(data: JournalCreateRequest): Promise<JournalEntry> {
    // Client-side validation before sending
    const totalDebit = data.lines.reduce((sum, l) => sum + l.debit, 0);
    const totalCredit = data.lines.reduce((sum, l) => sum + l.credit, 0);
    
    if (totalDebit !== totalCredit) {
      throw new Error(`Journal does not balance. Debit: ${totalDebit}, Credit: ${totalCredit}`);
    }
    if (totalDebit === 0) {
      throw new Error('Journal must have non-zero amounts');
    }

    const response = await httpClient.post<{ data: JournalEntry }>('/api/journals', data);
    return response.data;
  },

  async update(journalId: string, data: Partial<JournalCreateRequest>): Promise<JournalEntry> {
    const response = await httpClient.put<{ data: JournalEntry }>(`/api/journals/${journalId}`, data);
    return response.data;
  },

  async post(journalId: string): Promise<JournalEntry> {
    const response = await httpClient.post<{ data: JournalEntry }>(`/api/journals/${journalId}/post`);
    return response.data;
  },

  async reverse(journalId: string, reason: string): Promise<JournalEntry> {
    const response = await httpClient.post<{ data: JournalEntry }>(`/api/journals/${journalId}/reverse`, { reason });
    return response.data;
  },

  async void(journalId: string, reason: string): Promise<void> {
    await httpClient.post(`/api/journals/${journalId}/void`, { reason });
  },

  /**
   * Delete only works for draft entries.
   * Posted entries must be reversed, not deleted.
   */
  async delete(journalId: string): Promise<void> {
    await httpClient.delete(`/api/journals/${journalId}`);
  },
};
