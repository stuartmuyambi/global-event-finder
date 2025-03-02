import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useThemeStore } from '../context/store';

const Layout: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-grow relative">
        <Outlet />
      </main>
      <footer className="py-6 px-4 bg-white dark:bg-gray-800 shadow-inner relative z-10">
        <div className="container mx-auto text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} EventFinder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;