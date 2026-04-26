import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { api } from "../lib/api";
import type { User } from "../lib/api";

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  setUser: (user: User) => void;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  role: "student" | "client";
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("gigmate_token"));
  const [loading, setLoading] = useState<boolean>(true);

  async function refresh() {
    if (!localStorage.getItem("gigmate_token")) {
      setUserState(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get<{ user: User }>("/auth/me");
      setUserState(data.user);
    } catch {
      localStorage.removeItem("gigmate_token");
      setToken(null);
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string): Promise<User> {
    const { data } = await api.post<{ token: string; user: User }>("/auth/login", {
      email,
      password,
    });
    localStorage.setItem("gigmate_token", data.token);
    setToken(data.token);
    setUserState(data.user);
    return data.user;
  }

  async function signup(payload: SignupPayload): Promise<void> {
    // Intentionally does NOT log the user in. Caller should redirect to /login.
    await api.post<{ message: string; user: User }>("/auth/signup", payload);
  }

  function logout() {
    localStorage.removeItem("gigmate_token");
    setToken(null);
    setUserState(null);
  }

  function setUser(u: User) {
    setUserState(u);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout, refresh, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
