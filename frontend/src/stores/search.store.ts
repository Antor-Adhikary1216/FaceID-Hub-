import { create } from "zustand";
import { searchService } from "@/services/search.service";
import type { SearchResult } from "@/types";

interface SearchState {
  results: SearchResult[];
  isSearching: boolean;
  searchHistory: SearchResult[];
  searchFaces: (imageFile: File) => Promise<void>;
  fetchHistory: () => Promise<void>;
}

export const useSearchStore = create<SearchState>((set) => ({
  results: [],
  isSearching: false,
  searchHistory: [],

  searchFaces: async (imageFile: File) => {
    set({ isSearching: true, results: [] });
    try {
      const results = await searchService.searchFaces(imageFile);
      set({ results, isSearching: false });
    } catch (error) {
      set({ isSearching: false });
      throw error;
    }
  },

  fetchHistory: async () => {
    try {
      const searchHistory = await searchService.getSearchHistory();
      set({ searchHistory });
    } catch (error) {
      console.error("Failed to fetch search history:", error);
    }
  },
}));
