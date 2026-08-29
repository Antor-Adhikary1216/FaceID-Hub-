import { create } from "zustand";
import { authService } from "@/services/auth.service";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  firebaseLogin: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const response = await authService.login(email, password);
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    set({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
    });
  },

  register: async (email, password, fullName) => {
    const response = await authService.register(email, password, fullName);
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    set({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
    });
  },

  firebaseLogin: async () => {
    const { signInWithGoogle } = await import("@/services/firebase");
    const firebaseUser = await signInWithGoogle();
    const idToken = await firebaseUser.getIdToken();
    const response = await authService.firebaseLogin(idToken);
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    set({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout API errors
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }
    try {
      const response = await authService.getMe();
      set({
        user: response.user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
