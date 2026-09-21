/**
 * KiraEnterprise v5.5 - API Client Configuration
 * 
 * In production, the API URL points to the Cloudflare Worker.
 * In development, it can point to a local wrangler dev server or use mock data.
 */

export const API_CONFIG = {
  // Production Worker URL
  productionUrl: 'https://kiraenterprisev5-5.mykira.workers.dev',
  
  // Determine current environment
  get baseUrl(): string {
    // In production, use the Worker URL
    if (typeof window !== 'undefined' && window.location.hostname.includes('mykira.workers.dev')) {
      return this.productionUrl;
    }
    // In development, use local worker or mock
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:8787';
    }
    return this.productionUrl;
  },

  // Whether to use mock data (development without worker)
  get useMock(): boolean {
    if (typeof window === 'undefined') return false;
    // Use mock if explicitly set or if worker is not reachable
    return window.location.search.includes('mock=true') || 
           (window.location.hostname === 'localhost' && !this.workerAvailable);
  },

  // Track if worker is available
  workerAvailable: false,
};

export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: string;
}

export class ApiClientError extends Error {
  status: number;
  details?: string;

  constructor(message: string, status: number, details?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.details = details;
  }
}
