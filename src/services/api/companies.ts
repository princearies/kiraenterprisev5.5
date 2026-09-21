/**
 * KiraEnterprise v5.5 - Companies API Service
 */

import { httpClient } from './client';
import type { Company } from '../../types';

export interface CompanyListResponse {
  data: Company[];
  total: number;
}

export interface CompanyCreateRequest {
  company_code: string;
  legal_name: string;
  trading_name: string;
  entity_type: string;
  ssm_number: string;
  tin: string;
  sst_number?: string;
  business_address: string;
  state: string;
  district: string;
  postcode: string;
  phone: string;
  email: string;
  financial_year_end: string;
  base_currency?: string;
}

export const companiesApi = {
  async list(): Promise<Company[]> {
    const response = await httpClient.get<{ data: Company[] }>('/api/companies');
    return response.data;
  },

  async get(companyId: string): Promise<Company> {
    const response = await httpClient.get<{ data: Company }>(`/api/companies/${companyId}`);
    return response.data;
  },

  async create(data: CompanyCreateRequest): Promise<Company> {
    const response = await httpClient.post<{ data: Company }>('/api/companies', data);
    return response.data;
  },

  async update(companyId: string, data: Partial<CompanyCreateRequest>): Promise<Company> {
    const response = await httpClient.put<{ data: Company }>(`/api/companies/${companyId}`, data);
    return response.data;
  },

  async deactivate(companyId: string): Promise<void> {
    await httpClient.post(`/api/companies/${companyId}/deactivate`);
  },

  async activate(companyId: string): Promise<void> {
    await httpClient.post(`/api/companies/${companyId}/activate`);
  },
};
