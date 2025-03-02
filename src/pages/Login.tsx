import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, ArrowRightIcon, FingerPrintIcon } from '@heroicons/react/24/outline';
import useSound from 'use-sound';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [loginStep, setLoginStep] = useState<'email' | 'password'>('email');
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Sound effects
  const [playHover] = useSound('/sounds/hover.mp3', { volume: 0.5 });
  const [playSuccess] = useSound('/sounds/notification.mp3', { volume: 0.5 });

  useEffect(() => {
    // Check if biometric authentication is available
    const checkBiometric = async () => {
      try {
        if ('credentials' in navigator && 'PublicKeyCredential' in window) {
          setBiometricAvailable(true);
        }
      } catch (err) {
        console.error('Biometric check failed:', err);
      }
    };
    checkBiometric();
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setLoginStep('password');
    } else {
      setError('Please enter a valid email address');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      playSuccess();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      await loginWithGoogle();
      playSuccess();
      navigate('/dashboard');
    } catch (err) {
      console.error('Google login error:', err);
      setError('Failed to login with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    // This is a placeholder for actual WebAuthn/FIDO2 implementation
    setError('');
    setIsLoading(true);
    
    try {
      // In a real implementation, this would use the WebAuthn API
      // For now, we'll just simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1500));
      playSuccess();
      navigate('/dashboard');
    } catch (err) {
      console.error('Biometric login error:', err);
      setError('Biometric authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl"
      >
        <div>
          <motion.h2 
            className="text-center text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            Welcome back
          </motion.h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Join 100,000+ event enthusiasts worldwide
          </p>
        </div>

        <AnimatePresence mode="wait">
          {loginStep === 'email' ? (
            <motion.form
              key="email-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleEmailSubmit}
              className="mt-8 space-y-6"
            >
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="relative">
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 dark:text-red-400"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onHoverStart={() => playHover()}
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </motion.button>

              {biometricAvailable && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onHoverStart={() => playHover()}
                  type="button"
                  onClick={handleBiometricLogin}
                  className="mt-3 group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FingerPrintIcon className="mr-2 h-5 w-5 text-indigo-500" />
                  Sign in with Biometrics
                </motion.button>
              )}

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <img className="h-5 w-5 mr-2" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" />
                    Google
                  </motion.button>
                </div>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="password-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handlePasswordSubmit}
              className="mt-8 space-y-6"
            >
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="relative">
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 dark:text-red-400"
                >
                  {error}
                </motion.p>
              )}

              <div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onHoverStart={() => playHover()}
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Sign in'
                  )}
                </motion.button>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setLoginStep('email')}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  ← Use a different email
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Sign up now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;