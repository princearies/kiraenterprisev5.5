/**
 * KiraEnterprise v5.5 - Invoices API Service
 */

import { httpClient } from './client';
import type { Invoice, InvoiceLine } from '../../types';

export interface InvoiceLineRequest {
  item_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount?: number;
  tax_code?: string;
  classification_code?: string;
}

export interface InvoiceCreateRequest {
  type: string;
  customer_id: string;
  date: string;
  due_date: string;
  notes?: string;
  lines: InvoiceLineRequest[];
}

export const invoicesApi = {
  async list(filters?: { status?: string; search?: string }): Promise<Invoice[]> {
    const response = await httpClient.get<{ data: Invoice[] }>('/api/invoices', filters as Record<string, string>);
    return response.data;
  },

  async get(invoiceId: string): Promise<{ invoice: Invoice; lines: InvoiceLine[] }> {
    const response = await httpClient.get<{ data: { invoice: Invoice; lines: InvoiceLine[] } }>(`/api/invoices/${invoiceId}`);
    return response.data;
  },

  async create(data: InvoiceCreateRequest): Promise<Invoice> {
    const response = await httpClient.post<{ data: Invoice }>('/api/invoices', data);
    return response.data;
  },

  async issue(invoiceId: string): Promise<Invoice> {
    const response = await httpClient.post<{ data: Invoice }>(`/api/invoices/${invoiceId}/issue`);
    return response.data;
  },

  async cancel(invoiceId: string, reason: string): Promise<void> {
    await httpClient.post(`/api/invoices/${invoiceId}/cancel`, { reason });
  },

  async void(invoiceId: string, reason: string): Promise<void> {
    await httpClient.post(`/api/invoices/${invoiceId}/void`, { reason });
  },
};
