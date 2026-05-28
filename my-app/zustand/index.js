import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" }
  )
)

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))

// Legacy stores kept for backwards compatibility
export const useUserStorage = create(
  persist(
    (set) => ({
      loggedUser: null,
      setLoggedUser: (loggedUser) => set({ loggedUser }),
    }),
    { name: "user-storage" }
  )
)

export const useTaskFilter = create(
  persist(
    (set) => ({
      filtrarConcluidas: false,
      toggleFiltrarConcluidas: () =>
        set((state) => ({ filtrarConcluidas: !state.filtrarConcluidas })),
    }),
    { name: "taskFilter-storage" }
  )
)
