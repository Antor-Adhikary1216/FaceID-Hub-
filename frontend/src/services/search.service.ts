import api from "./api";
import type { SearchResult } from "@/types";

export const searchService = {
  async searchFaces(imageFile: File): Promise<SearchResult[]> {
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await api.post<SearchResult[]>("/search", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async getSearchHistory(): Promise<SearchResult[]> {
    const response = await api.get<SearchResult[]>("/search/history");
    return response.data;
  },
};
