import { create } from "zustand";
import { profileService } from "@/services/profile.service";
import type { Profile, ProfileFormData } from "@/types";

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  fetchMyProfile: () => Promise<void>;
  fetchProfile: (id: string) => Promise<void>;
  updateProfile: (data: ProfileFormData) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchMyProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileService.getMyProfile();
      set({ profile, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch profile",
        isLoading: false,
      });
    }
  },

  fetchProfile: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileService.getProfile(id);
      set({ profile, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch profile",
        isLoading: false,
      });
    }
  },

  updateProfile: async (data: ProfileFormData) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileService.updateProfile(data);
      set({ profile, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update profile",
        isLoading: false,
      });
      throw error;
    }
  },
}));
