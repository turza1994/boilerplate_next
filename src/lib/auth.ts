import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  // Also set in cookie for middleware access
  document.cookie = `${ACCESS_TOKEN_KEY}=${token}; path=/; max-age=900; SameSite=strict`;
};

export const removeAccessToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  // Also remove from cookie
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return Cookies.get(REFRESH_TOKEN_KEY) || null;
};

export const setRefreshToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  Cookies.set(REFRESH_TOKEN_KEY, token, {
    httpOnly: false, // Note: In production, this should be true and set by server
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: 7, // 7 days
  });
};

export const removeRefreshToken = (): void => {
  if (typeof window === 'undefined') return;
  Cookies.remove(REFRESH_TOKEN_KEY);
};

export const clearAllTokens = (): void => {
  removeAccessToken();
  removeRefreshToken();
};