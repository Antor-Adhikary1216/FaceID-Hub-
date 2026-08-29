import api from "./api";
import type { Profile, ProfileFormData } from "@/types";

export const profileService = {
  async getMyProfile(): Promise<Profile> {
    const response = await api.get<Profile>("/profiles/me");
    return response.data;
  },

  async getProfile(id: string): Promise<Profile> {
    const response = await api.get<Profile>(`/profiles/${id}`);
    return response.data;
  },

  async createProfile(data: ProfileFormData): Promise<Profile> {
    const formData = new FormData();
    if (data.bio) formData.append("bio", data.bio);
    if (data.location) formData.append("location", data.location);
    if (data.company) formData.append("company", data.company);
    if (data.jobTitle) formData.append("jobTitle", data.jobTitle);
    formData.append("isPublic", String(data.isPublic));
    formData.append("allowMatching", String(data.allowMatching));
    if (data.skills.length > 0) {
      formData.append("skills", JSON.stringify(data.skills));
    }
    if (data.socialLinks.length > 0) {
      formData.append("socialLinks", JSON.stringify(data.socialLinks));
    }
    if (data.banner) formData.append("banner", data.banner);
    if (data.avatar) formData.append("avatar", data.avatar);

    const response = await api.post<Profile>("/profiles", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async updateProfile(data: ProfileFormData): Promise<Profile> {
    const formData = new FormData();
    if (data.bio !== undefined) formData.append("bio", data.bio);
    if (data.location !== undefined) formData.append("location", data.location);
    if (data.company !== undefined) formData.append("company", data.company);
    if (data.jobTitle !== undefined) formData.append("jobTitle", data.jobTitle);
    formData.append("isPublic", String(data.isPublic));
    formData.append("allowMatching", String(data.allowMatching));
    formData.append("skills", JSON.stringify(data.skills));
    formData.append("socialLinks", JSON.stringify(data.socialLinks));
    if (data.banner) formData.append("banner", data.banner);
    if (data.avatar) formData.append("avatar", data.avatar);

    const response = await api.put<Profile>("/profiles", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async deleteProfile(): Promise<void> {
    await api.delete("/profiles");
  },

  async addFaceEmbedding(
    imageFile: File
  ): Promise<{ id: string; imageUrl: string }> {
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await api.post("/profiles/face-embeddings", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async removeFaceEmbedding(embeddingId: string): Promise<void> {
    await api.delete(`/profiles/face-embeddings/${embeddingId}`);
  },
};
