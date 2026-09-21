/**
 * KiraEnterprise v5.5 - Authentication API Service
 */

import { httpClient } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  companies: Array<{
    company_id: string;
    company_code: string;
    trading_name: string;
    role: string;
  }>;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const authApi = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>('/api/auth/login', data);
    return response;
  },

  async logout(): Promise<void> {
    await httpClient.post('/api/auth/logout');
    httpClient.clearAuth();
  },

  async me(): Promise<UserInfo> {
    const response = await httpClient.get<{ data: UserInfo }>('/api/auth/me');
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await httpClient.post('/api/auth/change-password', { currentPassword, newPassword });
  },
};
