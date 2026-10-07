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


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,
  isAuthenticated: false,

  setSession: (user, accessToken, refreshToken) => {
    setTokens(accessToken, refreshToken, user.role);
    set({ user, isAuthenticated: true });
  },

  // setUser: (user) => set({ user }),
  setUser: (user) => set({ user, isAuthenticated: true }),

  logout: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false });
  },

  markHydrated: () => set({ isHydrated: true }),
}));
