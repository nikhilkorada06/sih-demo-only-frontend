import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { User, LoginPayload, RegisterPayload } from '../types/auth.types';
import { authApi } from '../api/auth.api';
import { getStoredToken, setStoredToken, removeStoredToken } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const sessionVersion = useRef(0);

  const refreshUser = async () => {
    const version = ++sessionVersion.current;
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const { user: profile } = await authApi.getMe();
      if (version !== sessionVersion.current) return;
      setUser(profile);
      setToken(currentToken);
    } catch (error) {
      if (version !== sessionVersion.current) return;
      // Token expired or invalid
      removeStoredToken();
      setUser(null);
      setToken(null);
    } finally {
      if (version === sessionVersion.current) setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (payload: LoginPayload) => {
    const res = await authApi.login(payload);
    sessionVersion.current++;
    setIsLoading(false);
    setStoredToken(res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (payload: RegisterPayload) => {
    const res = await authApi.register(payload);
    sessionVersion.current++;
    setIsLoading(false);
    setStoredToken(res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    sessionVersion.current++;
    setIsLoading(false);
    removeStoredToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
