import axios from 'axios';

const TOKEN_KEY = 'mahasetu_auth_token';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 20000
});

// Attach Authorization Bearer token if present
apiClient.interceptors.request.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (config: any) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// Unified Error Response handler
apiClient.interceptors.response.use(
  (response: any) => response,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error: any) => {
    // If token expired or invalid (401), trigger session expired handling
    if (error?.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
      // Clear token if invalid
      localStorage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function extractErrorMessage(error: unknown, defaultMessage = 'An unexpected error occurred'): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = error as any;
  if (err?.response?.data?.message) {
    return String(err.response.data.message);
  }
  if (err?.response?.status === 429) {
    return 'Too many requests. Please wait a few moments and try again.';
  }
  if (err?.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }
  if (err?.response?.status === 404) {
    return 'The requested resource was not found.';
  }
  if (err?.code === 'ECONNABORTED') {
    return 'Request timed out. Please check your network connection.';
  }
  if (err?.message) {
    return String(err.message);
  }
  if (typeof error === 'string') {
    return error;
  }
  return defaultMessage;
}
