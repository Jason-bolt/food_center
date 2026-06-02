import { useState, useEffect, useCallback, type ReactNode } from "react";
import { AuthContext, type AuthUser, type StreakToast, defaultStats } from "./AuthContext";

const TOKEN_KEY = "fc_user_token";
const BASE = import.meta.env.VITE_SERVER_BASE_URL;

/** Returns a toast if the user's current streak deserves a notification. */
const buildStreakToast = (user: AuthUser): StreakToast | null => {
  const streak = user.stats?.currentStreak ?? 0;
  if (streak < 1) return null;
  return { streak, xp: user.stats?.xp ?? 0 };
};

/** Ensures stats always exists even for legacy user documents. */
const normalise = (raw: Omit<AuthUser, "stats"> & { stats?: Partial<AuthUser["stats"]> }): AuthUser => ({
  ...raw,
  stats: { ...defaultStats, ...(raw.stats ?? {}) },
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,         setUser]         = useState<AuthUser | null>(null);
  const [token,        setToken]        = useState<string | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [streakToast,  setStreakToast]  = useState<StreakToast | null>(null);

  const clearStreakToast = useCallback(() => setStreakToast(null), []);

  // ── Refresh user from API (called externally to pick up XP changes) ─────────
  const refreshUser = useCallback(async () => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) return;
    try {
      const r = await fetch(`${BASE}/auth/me`, { headers: { Authorization: `Bearer ${stored}` } });
      if (r.ok) setUser(normalise(await r.json()));
    } catch { /* silent */ }
  }, []);

  // ── Bootstrap from localStorage ──────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) { setLoading(false); return; }

    fetch(`${BASE}/auth/me`, { headers: { Authorization: `Bearer ${stored}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((raw) => {
        const u = normalise(raw);
        setUser(u);
        setToken(stored);
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${BASE}/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Login failed");

    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);

    const u = normalise(data.user);
    setUser(u);

    // Show streak toast on login
    const toast = buildStreakToast(u);
    if (toast) setStreakToast(toast);
  }, []);

  // ── Register ─────────────────────────────────────────────────────────────────
  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch(`${BASE}/auth/register`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Registration failed");

    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(normalise(data.user));
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setStreakToast(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading, streakToast, clearStreakToast, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
