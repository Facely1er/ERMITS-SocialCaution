import { createContext, useContext } from 'react';
import { LocalUser } from '../../services/localStorageService';

interface User extends LocalUser {}

export interface AuthContextType {
  loading: boolean;
  user: User | null;
  session: any;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  loading: true,
  user: null,
  session: null,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

