import { createContext } from 'react';
import type { UserResponse } from '../interface/UserResponse';

export interface AuthContextType {
  accountLogin: UserResponse | null;
  logout: () => void;
  getToken: () => Promise<void>;
  isLoading: boolean;
}

export const ContextAuth = createContext<AuthContextType>({
  accountLogin: null,
  logout: () => { },
  getToken: async () => { },
  isLoading: true,
}); 