import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import { AuthState, User } from '../types/auth';

interface AuthStore extends AuthState {
  setAuthData: (data: { accessToken: string; refreshToken: string; user: User }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuthData: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user, isAuthenticated: true }),
      clearAuth: () => set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
    }),
    {
      name: 'prompt-auth-store',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, refreshToken: state.refreshToken, isAuthenticated: state.isAuthenticated })
    }
  )
);
