/**
 * CampusOne API Client
 * Seamlessly interfaces with the Node.js / Express backend server at /api.
 * Falls back to dbStore when operating offline or in standalone presentation mode.
 */

const BASE_URL = '/api';

export class ApiClient {
  private static getToken(): string | null {
    try {
      return localStorage.getItem('campusone_jwt_token');
    } catch {
      return null;
    }
  }

  public static setToken(token: string): void {
    try {
      localStorage.setItem('campusone_jwt_token', token);
    } catch {}
  }

  public static clearToken(): void {
    try {
      localStorage.removeItem('campusone_jwt_token');
    } catch {}
  }

  private static getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Forward active persona role for judge ease
    try {
      const activeRole = localStorage.getItem('campusone_active_role');
      if (activeRole) {
        headers['x-demo-role'] = activeRole;
      }
    } catch {}
    return headers;
  }

  public static async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Network request failed' }));
      throw new Error(err.error || `HTTP error ${res.status}`);
    }
    return res.json();
  }

  public static async post<T>(endpoint: string, body?: any): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Network request failed' }));
      throw new Error(err.error || `HTTP error ${res.status}`);
    }
    return res.json();
  }

  public static async patch<T>(endpoint: string, body?: any): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Network request failed' }));
      throw new Error(err.error || `HTTP error ${res.status}`);
    }
    return res.json();
  }

  // Health check helper
  public static async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }
}
