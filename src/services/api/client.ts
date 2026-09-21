/**
 * KiraEnterprise v5.5 - HTTP Client
 * 
 * Handles all API requests with proper error handling,
 * authentication headers, and tenant isolation.
 */

import { API_CONFIG, ApiClientError } from './config';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
}

class HttpClient {
  private baseUrl: string;
  private authToken: string | null = null;
  private companyId: string | null = null;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  setCompanyId(companyId: string): void {
    this.companyId = companyId;
  }

  clearAuth(): void {
    this.authToken = null;
    this.companyId = null;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    // Always include company_id for tenant isolation
    if (this.companyId && !url.searchParams.has('company_id')) {
      url.searchParams.append('company_id', this.companyId);
    }
    return url.toString();
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers: customHeaders, params } = options;

    const url = this.buildUrl(path, params);
    const headers = { ...this.getHeaders(), ...customHeaders };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        let errorData: { error?: string; details?: string } = {};
        try {
          errorData = await response.json();
        } catch {
          // Response is not JSON
        }
        throw new ApiClientError(
          errorData.error || `Request failed with status ${response.status}`,
          response.status,
          errorData.details
        );
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }
      // Network error or other
      throw new ApiClientError(
        'Network error. Please check your connection.',
        0,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  // Convenience methods
  async get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(path, { method: 'GET', params });
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'POST', body });
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'PUT', body });
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'PATCH', body });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

// Singleton instance
export const httpClient = new HttpClient();
