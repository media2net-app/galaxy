"use client";

import { createContext, useContext, useMemo, useState } from "react";

type AuthContextValue = {
  user: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "galaxy-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
  });

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Vul e-mail en wachtwoord in.");
    }
    // Demo-auth: accepteer iedere combinatie voor deze proof-of-concept
    localStorage.setItem(STORAGE_KEY, email);
    setUser(email);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth moet binnen AuthProvider gebruikt worden.");
  }
  return ctx;
};

