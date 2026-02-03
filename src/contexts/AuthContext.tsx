'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import { 
  getAccessToken, 
  setAccessToken, 
  setRefreshToken, 
  clearAllTokens,
  getRefreshToken 
} from '@/lib/auth';
import { AuthContextType, AuthState } from '@/types/auth';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: true,
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();

        if (accessToken) {
          // Verify token is still valid by making a request
          try {
            const response = await apiClient.get('/api/health');
            if (response.success) {
              setState(prev => ({
                ...prev,
                accessToken,
                isAuthenticated: true,
                isLoading: false,
              }));
              return;
            }
          } catch (error) {
            // Token is invalid, try to refresh
            const refreshTokenValue = getRefreshToken();
            if (refreshTokenValue) {
              try {
                await new Promise((resolve, reject) => {
                  const response = fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh-token`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ refreshToken: refreshTokenValue }),
                  });
                  
                  response.then(res => {
                    if (res.ok) {
                      return res.json();
                    }
                    throw new Error('Refresh failed');
                  }).then(data => {
                    if (data.success && data.data?.accessToken) {
                      setAccessToken(data.data.accessToken);
                      resolve(data.data.accessToken);
                    } else {
                      reject(new Error('Invalid refresh response'));
                    }
                  }).catch(reject);
                });
                
                const newAccessToken = getAccessToken();
                if (newAccessToken) {
                  setState(prev => ({
                    ...prev,
                    accessToken: newAccessToken,
                    isAuthenticated: true,
                    isLoading: false,
                  }));
                  return;
                }
              } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
              }
            }
          }
        }

        // No valid tokens found
        clearAllTokens();
        setState(prev => ({
          ...prev,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Auth check failed:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await apiClient.login({ email, password });
      
      if (response.success && response.data) {
        const { user, accessToken } = response.data;
        
        // Store tokens
        setAccessToken(accessToken);
        
        // Note: In production, refresh token should be set by server as HttpOnly cookie
        // For demo purposes, we'll assume it's handled automatically
        
        setState({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = (): void => {
    clearAllTokens();
    setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      if (data.success && data.data?.accessToken) {
        setAccessToken(data.data.accessToken);
        setState(prev => ({
          ...prev,
          accessToken: data.data.accessToken,
        }));
      } else {
        throw new Error('Invalid refresh response');
      }
    } catch (error) {
      logout(); // Clear invalid tokens
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}