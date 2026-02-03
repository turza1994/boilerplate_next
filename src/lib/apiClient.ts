import { ApiResponse, LoginRequest, LoginResponse, RefreshTokenResponse } from '@/types/api';
import { getAccessToken, setAccessToken, getRefreshToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add Authorization header if access token exists
    const accessToken = getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Include credentials for refresh token cookies
    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    };

    try {
      const response = await fetch(url, config);
      const data: ApiResponse<T> = await response.json();

      // Handle 401 Unauthorized - attempt token refresh
      if (response.status === 401 && !endpoint.includes('/refresh-token')) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the original request with new token
          const newAccessToken = getAccessToken();
          if (newAccessToken) {
            headers['Authorization'] = `Bearer ${newAccessToken}`;
            const retryResponse = await fetch(url, { ...config, headers });
            return retryResponse.json();
          }
        }
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseURL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data: ApiResponse<RefreshTokenResponse> = await response.json();
        if (data.success && data.data?.accessToken) {
          setAccessToken(data.data.accessToken);
          return true;
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return false;
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Generic GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // Generic POST request
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Generic PUT request
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Generic DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();