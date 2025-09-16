import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginApi, registerApi, getProfileApi } from '../api/apiClient';

type User = { id: string; name: string; email: string };

type AuthCtx = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const defaultValue: AuthCtx = {
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthCtx>(defaultValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!token) return;
    getProfileApi(token)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      });
  }, [token]);

  const login = async (email: string, password: string) => {
    const { token, user } = await loginApi(email, password);
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
  };

  const register = async (name: string, email: string, password: string) => {
    const { token, user } = await registerApi(name, email, password);
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
