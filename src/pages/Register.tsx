import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import useSound from 'use-sound';

type RegistrationStep = 'basicInfo' | 'profile' | 'preferences' | 'success';

interface ProfileData {
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

const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('basicInfo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: '',
    photoURL: '',
    location: '',
    eventPreferences: [],
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
    }
  });

  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Sound effects
  const [playHover] = useSound('/sounds/hover.mp3', { volume: 0.5 });
  const [playSuccess] = useSound('/sounds/notification.mp3', { volume: 0.5 });

  // Event categories
  const eventCategories = [
    { id: 'concerts', name: 'Concerts', icon: '🎵' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'tech', name: 'Tech', icon: '💻' },
    { id: 'food', name: 'Food & Drink', icon: '🍷' },
    { id: 'arts', name: 'Arts & Culture', icon: '🎭' },
    { id: 'business', name: 'Business', icon: '💼' }
  ];

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password)
    };
    return requirements;
  };

  const handleBasicInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    const passwordReqs = validatePassword(password);
    if (!Object.values(passwordReqs).every(Boolean)) {
      return setError('Password does not meet requirements');
    }

    setCurrentStep('profile');
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData.displayName) {
      return setError('Please enter your name');
    }
    setCurrentStep('preferences');
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await register(email, password);
      // Here you would also save the profile data to your user profile system
      playSuccess();
      setCurrentStep('success');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to create account. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      await loginWithGoogle();
      playSuccess();
      navigate('/dashboard');
    } catch (err) {
      console.error('Google registration error:', err);
      setError('Failed to register with Google');
      setIsLoading(false);
    }
  };

  const renderBasicInfoStep = () => (
    <motion.form
      key="basic-info"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onSubmit={handleBasicInfoSubmit}
      className="space-y-6"
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
        
        {/* Password strength indicators */}
        <div className="mt-2 space-y-2">
          {Object.entries(validatePassword(password)).map(([requirement, isMet]) => (
            <div key={requirement} className="flex items-center text-sm">
              <CheckCircleIcon
                className={`h-4 w-4 mr-2 ${
                  isMet ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'
                }`}
              />
              <span className={`${
                isMet ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {requirement === 'length' && '8+ characters'}
                {requirement === 'uppercase' && 'Uppercase letter'}
                {requirement === 'lowercase' && 'Lowercase letter'}
                {requirement === 'number' && 'Number'}
                {requirement === 'special' && 'Special character'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Confirm password
        </label>
        <div className="mt-1">
          <input
            id="confirm-password"
            name="confirm-password"
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Continue
      </motion.button>

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
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <img className="h-5 w-5 mr-2" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" />
            Google
          </motion.button>
        </div>
      </div>
    </motion.form>
  );

  const renderProfileStep = () => (
    <motion.form
      key="profile"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onSubmit={handleProfileSubmit}
      className="space-y-6"
    >
      <div>
        <label htmlFor="display-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Display name
        </label>
        <div className="mt-1">
          <input
            id="display-name"
            name="display-name"
            type="text"
            required
            value={profileData.displayName}
            onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Location
        </label>
        <div className="mt-1">
          <input
            id="location"
            name="location"
            type="text"
            value={profileData.location}
            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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

      <div className="flex justify-between space-x-4">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="button"
          onClick={() => setCurrentStep('basicInfo')}
          className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onHoverStart={() => playHover()}
          type="submit"
          className="flex-1 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Continue
        </motion.button>
      </div>
    </motion.form>
  );

  const renderPreferencesStep = () => (
    <motion.form
      key="preferences"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onSubmit={handlePreferencesSubmit}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Event preferences
        </label>
        <div className="grid grid-cols-2 gap-4">
          {eventCategories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => {
                const newPreferences = profileData.eventPreferences.includes(category.id)
                  ? profileData.eventPreferences.filter(id => id !== category.id)
                  : [...profileData.eventPreferences, category.id];
                setProfileData({ ...profileData, eventPreferences: newPreferences });
              }}
              className={`p-4 flex items-center justify-center space-x-2 rounded-lg border ${
                profileData.eventPreferences.includes(category.id)
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-300 dark:border-gray-700'
              }`}
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {category.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notification preferences
        </label>
        {Object.entries(profileData.notificationPreferences).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
              {key} notifications
            </span>
            <button
              type="button"
              onClick={() => {
                setProfileData({
                  ...profileData,
                  notificationPreferences: {
                    ...profileData.notificationPreferences,
                    [key]: !value
                  }
                });
              }}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                value ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  value ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
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

      <div className="flex justify-between space-x-4">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="button"
          onClick={() => setCurrentStep('profile')}
          className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onHoverStart={() => playHover()}
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Create account'
          )}
        </motion.button>
      </div>
    </motion.form>
  );

  const renderSuccessStep = () => (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
      >
        <CheckCircleIcon className="h-12 w-12 text-white" />
      </motion.div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Welcome to EventHub!
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400">
        Your account has been successfully created. Get ready to discover amazing events!
      </p>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onHoverStart={() => playHover()}
        onClick={() => navigate('/dashboard')}
        className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Go to Dashboard
      </motion.button>
    </motion.div>
  );

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
            Create your account
          </motion.h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Join our community of event enthusiasts
          </p>
        </div>

        {/* Progress indicator */}
        {currentStep !== 'success' && (
          <div className="flex justify-between items-center">
            {['basicInfo', 'profile', 'preferences'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step
                      ? 'bg-indigo-600 text-white'
                      : index < ['basicInfo', 'profile', 'preferences'].indexOf(currentStep)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 2 && (
                  <div
                    className={`w-full h-1 mx-2 ${
                      index < ['basicInfo', 'profile', 'preferences'].indexOf(currentStep)
                        ? 'bg-green-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {currentStep === 'basicInfo' && renderBasicInfoStep()}
          {currentStep === 'profile' && renderProfileStep()}
          {currentStep === 'preferences' && renderPreferencesStep()}
          {currentStep === 'success' && renderSuccessStep()}
        </AnimatePresence>

        {currentStep !== 'success' && (
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Sign in
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Register;