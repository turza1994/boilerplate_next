export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  data: {
    user: {
      id: string;
      email: string;
    };
    accessToken: string;
  };
}

export interface SignupResponse {
  data: {
    user: {
      id: string;
      email: string;
    };
    accessToken: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken?: string; // Optional since backend uses HttpOnly cookies
}

export interface RefreshTokenResponse {
  data: {
    accessToken: string;
  };
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