import api from "./api";
import type { AuthResponse } from "@/types";

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  async register(
    email: string,
    password: string,
    fullName: string
  ): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", {
      email,
      password,
      fullName,
    });
    return response.data;
  },

  async firebaseLogin(idToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/firebase", {
      idToken,
    });
    return response.data;
  },

  async refreshToken(token: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/refresh", {
      token,
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  async getMe() {
    const response = await api.get("/auth/me");
    return response.data;
  },
};
