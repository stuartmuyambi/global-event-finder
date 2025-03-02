import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider, 
  signInWithPopup,
  User,
  AuthError
} from 'firebase/auth';
import { auth } from '../utils/firebase';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthError = (error: unknown) => {
    if (error instanceof Error) {
      const authError = error as AuthError;
      switch (authError.code) {
        case 'auth/user-not-found':
          setError('No account exists with this email.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password.');
          break;
        case 'auth/email-already-in-use':
          setError('An account already exists with this email.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/popup-closed-by-user':
          setError('Sign in was cancelled.');
          break;
        default:
          setError(authError.message);
      }
    } else {
      setError('An unexpected error occurred.');
    }
  };

  const clearError = () => setError(null);

  const login = async (email: string, password: string) => {
    try {
      clearError();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      clearError();
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      clearError();
      await signOut(auth);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      clearError();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    loginWithGoogle,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};