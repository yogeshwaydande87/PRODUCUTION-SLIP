import create from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  updateRole: (role) => set((state) => ({
    user: state.user ? { ...state.user, role } : null
  }))
}));
