import { create } from 'zustand';
import { 
  User, 
  LoginCredentials, 
  SignupCredentials, 
  ApiError 
} from '@/types';
import { auth } from '@/config/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential 
} from 'firebase/auth';
import { api } from '@/services/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async ({ email, password }: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      // Firebase authentication
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get user data from our backend
      const { data } = await api.post<{ user: User }>('/auth/login', {
        firebaseUid: userCredential.user.uid,
      });

      set({ 
        user: data.user,
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: {
          message: error.message || 'Failed to login',
          code: error.code
        },
        isLoading: false 
      });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await signOut(auth);
      await api.post('/auth/logout');
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: {
          message: error.message || 'Failed to logout',
          code: error.code
        },
        isLoading: false 
      });
    }
  },

  signup: async ({ email, password, displayName }: SignupCredentials) => {
    set({ isLoading: true, error: null });
    try {
      // Firebase signup
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user in our backend
      const { data } = await api.post<{ user: User }>('/auth/register', {
        firebaseUid: userCredential.user.uid,
        email,
        displayName
      });

      set({ 
        user: data.user,
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: {
          message: error.message || 'Failed to sign up',
          code: error.code
        },
        isLoading: false 
      });
    }
  },

  updateUser: (userData: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null
    }));
  },

  clearError: () => set({ error: null })
}));
