export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
  };
  accessToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface User {
  id: string;
  email: string;
}

export interface SampleItem {
  id: number;
  counter: number;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
}