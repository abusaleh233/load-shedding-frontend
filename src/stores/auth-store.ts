import { create } from "zustand";
import type { User } from "@/types/api";
import { clearTokens, setTokens } from "@/lib/token-storage";

interface AuthState {
  user: User | null;
  /** True once we've checked localStorage for an existing session on app load. */
  isHydrated: boolean;
  isAuthenticated: boolean;
  setSession: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  markHydrated: () => void;
}

/**
 * Holds the CURRENT USER OBJECT and derived auth state for the UI (what
 * name/role to show, which nav items render, etc). The actual JWTs live in
 * token-storage.ts, not here — api-client.ts reads tokens directly from
 * there so it never needs to import this store (see token-storage.ts's
 * top comment for why that matters).
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,
  isAuthenticated: false,

  setSession: (user, accessToken, refreshToken) => {
    setTokens(accessToken, refreshToken, user.role);
    set({ user, isAuthenticated: true });
  },

  setUser: (user) => set({ user }),
  

  logout: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false });
  },

  markHydrated: () => set({ isHydrated: true }),
}));
