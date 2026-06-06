import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService, userService } from "../api";
import type { Role, User } from "../types";

interface AuthContextValue {
  user: User | null;
  role: Role | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<Role>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return null;
    }
    try {
      const me = await userService.me();
      setUser(me);
      localStorage.setItem("role", me.role);
      return me;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await authService.login(email, password);
    localStorage.setItem("token", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    localStorage.setItem("role", tokens.role);
    localStorage.setItem("email", tokens.email);
    const me = await refreshUser();
    return me?.role ?? tokens.role;
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await userService.logout();
    } catch {
      /* ignore */
    }
    localStorage.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? (localStorage.getItem("role") as Role | null),
      loading,
      isAuthenticated: !!user || !!localStorage.getItem("token"),
      login,
      logout,
      refreshUser,
    }),
    [user, loading, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
