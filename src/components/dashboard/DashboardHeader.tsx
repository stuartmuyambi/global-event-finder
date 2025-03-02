import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User } from 'firebase/auth';
import {
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  QrCodeIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import useSound from 'use-sound';

interface Props {
  user: User | null;
  profile: any;
  darkMode: boolean;
  toggleDarkMode: () => void;
  showNotifications: boolean;
  toggleNotifications: () => void;
}

const DashboardHeader: React.FC<Props> = ({
  user,
  profile,
  darkMode,
  toggleDarkMode,
  showNotifications,
  toggleNotifications,
}) => {
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches] = useState(['music festival', 'tech conference', 'art exhibition']);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sound effects
  const [playHover] = useSound('/sounds/hover.mp3', { volume: 0.2 });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleOpenSearch = () => {
    setShowSearchModal(true);
    // Focus the search input after a short delay to ensure it's mounted
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex-shrink-0">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  EventHub
                </span>
              </Link>
            </div>

            {/* Search bar */}
            <button
              onClick={handleOpenSearch}
              className="hidden md:flex items-center ml-4 px-4 py-1.5 w-64 lg:w-96 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">Search events, artists, venues...</span>
              <div className="ml-auto px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">⌘K</div>
            </button>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Mobile search button */}
              <button
                onClick={handleOpenSearch}
                className="md:hidden rounded-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button
                onClick={toggleNotifications}
                className="rounded-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none relative"
                onMouseEnter={() => playHover()}
              >
                <BellIcon className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
              </button>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="rounded-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                onMouseEnter={() => playHover()}
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>

              {/* User menu */}
              <div className="relative ml-3">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex rounded-full bg-gray-800 text-sm focus:outline-none"
                  id="user-menu-button"
                >
                  <span className="sr-only">Open user menu</span>
                  {profile?.photoURL ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={profile.photoURL}
                      alt=""
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 z-30 mt-2 w-48 origin-top-right rounded-lg bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                    >
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user?.displayName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        Profile
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearchModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
              onClick={() => setShowSearchModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-4 inset-x-0 mx-auto max-w-2xl w-full z-[70] bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600"
                    placeholder="Search for events, venues, artists..."
                  />
                </div>

                {searchQuery ? (
                  <div className="mt-4 divide-y divide-gray-200 dark:divide-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 pb-2">
                      Results will appear here...
                    </p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Recent searches</h3>
                      <button className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                        Clear all
                      </button>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <MagnifyingGlassIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            </div>
                            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">{search}</span>
                          </div>
                          <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                            <span className="sr-only">Remove</span>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                        esc
                      </kbd>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">to close</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        <QrCodeIcon className="h-5 w-5" />
                      </button>
                      <button className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        <CommandLineIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardHeader;