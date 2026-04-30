import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isSidebarOpen: boolean;
  isDarkMode: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      isDarkMode: false,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      toggleDarkMode: () => set((state) => {
        const newDarkMode = !state.isDarkMode;
        // Update document class for Tailwind dark mode
        if (typeof window !== 'undefined') {
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        return { isDarkMode: newDarkMode };
      }),
      setDarkMode: (dark) => set(() => {
        // Update document class for Tailwind dark mode
        if (typeof window !== 'undefined') {
          if (dark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        return { isDarkMode: dark };
      }),
    }),
    {
      name: 'ui-storage',
      onRehydrateStorage: () => (state) => {
        // Apply dark mode class on rehydration
        if (typeof window !== 'undefined' && state?.isDarkMode) {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);
