import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import useSound from 'use-sound';
import {
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  BookmarkIcon,
  HeartIcon,
  FireIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TagIcon,
  BuildingStorefrontIcon,
  Square3Stack3DIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface Props {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  profile: any;
}

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const Sidebar: React.FC<Props> = ({ collapsed, setCollapsed, profile }) => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Sound effects
  const [playHover] = useSound('/sounds/hover.mp3', { volume: 0.2 });

  // Navigation items
  const navigationItems: NavItem[] = [
    { name: 'Events', icon: <CalendarIcon className="h-6 w-6" />, href: '/events' },
    { name: 'Explore', icon: <MapPinIcon className="h-6 w-6" />, href: '/explore' },
    { name: 'Social', icon: <UserGroupIcon className="h-6 w-6" />, href: '/social', badge: 3 },
    { name: 'Saved', icon: <BookmarkIcon className="h-6 w-6" />, href: '/saved' },
    { name: 'My Events', icon: <HeartIcon className="h-6 w-6" />, href: '/my-events' },
    { name: 'Trending', icon: <FireIcon className="h-6 w-6" />, href: '/trending' }
  ];

  // Event categories for quick filter
  const eventCategories = [
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'art', name: 'Art', icon: '🎨' },
    { id: 'food', name: 'Food', icon: '🍽️' },
    { id: 'tech', name: 'Tech', icon: '💻' },
  ];

  // Following section
  const following = [
    { id: '1', name: 'Madison Square Garden', type: 'venue' },
    { id: '2', name: 'Taylor Swift', type: 'artist' },
    { id: '3', name: 'Tech Conferences', type: 'category' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden" 
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: collapsed ? '5rem' : '16rem',
          transition: { duration: 0.2 }
        }}
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 ${
          collapsed ? 'w-20' : 'w-64'
        } transition-all duration-300 ${!collapsed ? 'shadow-lg lg:shadow-none' : ''}`}
      >
        <div className="flex flex-col h-full pt-16">
          {/* Toggle button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-24 hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-white shadow-md"
            onMouseEnter={() => playHover()}
          >
            {collapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4" />
            )}
          </button>

          {/* Main navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto scrollbar-hide">
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-2 py-2 rounded-lg transition-colors duration-150 ${
                      isActive(item.href)
                        ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onMouseEnter={() => playHover()}
                  >
                    {item.icon}
                    {!collapsed && (
                      <>
                        <span className="ml-3">{item.name}</span>
                        {item.badge && (
                          <span className="ml-auto bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full text-xs">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Categories section */}
            {!collapsed && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categories
                </h3>
                <div className="mt-2 space-y-1">
                  {eventCategories.map(category => (
                    <button
                      key={category.id}
                      className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-150 ${
                        selectedCategory === category.id
                          ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                      onMouseEnter={() => playHover()}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Following section */}
            {!collapsed && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Following
                </h3>
                <div className="mt-2 space-y-1">
                  {following.map(item => (
                    <a
                      key={item.id}
                      href="#"
                      className="flex items-center px-3 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                      onMouseEnter={() => playHover()}
                    >
                      <span className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                      {item.name}
                      <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {item.type}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* User section */}
          {!collapsed && profile && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {profile.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    View profile
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;