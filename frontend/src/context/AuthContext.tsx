import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { api } from "../lib/api";
import type { User } from "../lib/api";

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  role: "student" | "client";
  college?: string;
  bio?: string;
  skills?: string[];
  portfolioLinks?: string[];
  companyName?: string;
  description?: string;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("gigmate_token"));
  const [loading, setLoading] = useState<boolean>(true);

  async function refresh() {
    if (!localStorage.getItem("gigmate_token")) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get<{ user: User }>("/auth/me");
      setUser(data.user);
    } catch {
      localStorage.removeItem("gigmate_token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post<{ token: string; user: User }>("/auth/login", {
      email,
      password,
    });
    localStorage.setItem("gigmate_token", data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function signup(payload: SignupPayload) {
    const { data } = await api.post<{ token: string; user: User }>("/auth/signup", payload);
    localStorage.setItem("gigmate_token", data.token);
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("gigmate_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
