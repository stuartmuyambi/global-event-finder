import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  User,
  AuthError
} from 'firebase/auth';
import { auth } from '../utils/firebase';

export interface ProfileData {
  displayName: string;
  photoURL: string;
  location: string;
  eventPreferences: string[];
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (email: string, password: string, profileData?: ProfileData) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection.');
          break;
        default:
          setError(authError.message);
      }
    } else {
      setError('An unexpected error occurred.');
    }
  };

  const clearError = () => setError(null);

  const login = async (email: string, password: string, remember = false) => {
    try {
      clearError();
      // Set persistence based on remember me option
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  const register = async (email: string, password: string, profileData?: ProfileData) => {
    try {
      clearError();
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      if (profileData) {
        await updateFirebaseProfile(user, {
          displayName: profileData.displayName,
          photoURL: profileData.photoURL || null
        });

        // Here you would typically save the rest of the profile data to your database
        // Example: await saveUserProfile(user.uid, profileData);
      }
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
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      await signInWithPopup(auth, provider);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      clearError();
      await sendPasswordResetEmail(auth, email);
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
    resetPassword,
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