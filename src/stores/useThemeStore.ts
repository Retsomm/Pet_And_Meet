import { create } from "zustand";

interface ThemeState {
  currentTheme: string;
  toggleTheme: () => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: "valentine",
  toggleTheme: () => set((state) => ({ currentTheme: state.currentTheme === "valentine" ? "sunset" : "valentine" })),
}));

export default useThemeStore;
