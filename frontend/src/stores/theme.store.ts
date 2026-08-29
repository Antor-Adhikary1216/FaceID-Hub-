import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface ThemeStore {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(resolved: "light" | "dark") {
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export const useThemeStore = create<ThemeStore>((set) => {
  const saved = (localStorage.getItem("faceid-theme") as Theme) || "system";
  const resolved = saved === "system" ? getSystemTheme() : saved;
  applyTheme(resolved);

  if (typeof window !== "undefined") {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      const current = useThemeStore.getState().theme;
      if (current === "system") {
        const newResolved = getSystemTheme();
        applyTheme(newResolved);
        set({ resolvedTheme: newResolved });
      }
    });
  }

  return {
    theme: saved,
    resolvedTheme: resolved,
    setTheme: (theme: Theme) => {
      const resolved = theme === "system" ? getSystemTheme() : theme;
      localStorage.setItem("faceid-theme", theme);
      applyTheme(resolved);
      set({ theme, resolvedTheme: resolved });
    },
  };
});
