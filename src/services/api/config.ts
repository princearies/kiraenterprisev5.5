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
    // In production (deployed to Cloudflare Workers), use relative URLs
    // The Worker serves both API and frontend from the same origin
    if (typeof window !== 'undefined' && window.location.hostname.includes('workers.dev')) {
      return ''; // Use relative URLs - same origin
    }
    // In development, use local worker
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:8787';
    }
    // Fallback to production URL
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
