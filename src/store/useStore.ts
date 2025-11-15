import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import localStorageService, { LocalUser } from '../services/localStorageService';

interface UserState {
  user: LocalUser | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

interface UserActions {
  setUser: (user: LocalUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initialize: () => Promise<void>;
  signOut: () => void;
  updateUser: (updates: Partial<LocalUser>) => void;
}

const useStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      error: null,
      initialized: false,

      setUser: (user) => {
        set({ user });
        if (user) {
          localStorageService.saveUser(user);
        }
      },
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      initialize: async () => {
        try {
          set({ loading: true, error: null });
          
          // Load user from localStorage service
          const storedUser = localStorageService.getUser();
          if (storedUser) {
            set({ user: storedUser });
          }
          
          set({ initialized: true });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = localStorageService.updateUser(updates);
          if (updatedUser) {
            set({ user: updatedUser });
          }
        }
      },

      signOut: () => {
        localStorage.removeItem('auth_token');
        set({ user: null });
        // Note: We keep user data in localStorage for offline functionality
        // Only clear the auth token to log out
      },
    }),
    {
      name: 'social-caution-auth',
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

export default useStore;