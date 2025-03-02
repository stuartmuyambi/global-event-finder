import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import useSound from 'use-sound';
import { useAuth } from '@/context/AuthContext';
import { useInfiniteEvents } from '@/hooks/useInfiniteEvents';
import { useProfile } from '@/hooks/useProfile';
import {
  MagnifyingGlassIcon,
  BellIcon,
  Cog6ToothIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  ListBulletIcon,
  TableCellsIcon,
  MapIcon,
  ChartBarIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  FireIcon,
  SparklesIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';

// Dashboard components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import EventCard from '@/components/dashboard/EventCard';
import Sidebar from '@/components/dashboard/Sidebar';
import SkeletonEventCard from '@/components/dashboard/SkeletonEventCard';
import AnalyticsSection from '@/components/dashboard/AnalyticsSection';
import TrendingCategories from '@/components/dashboard/TrendingCategories';
import NotificationCenter from '@/components/dashboard/NotificationCenter';
import CommandMenu from '@/components/dashboard/CommandMenu';

type ViewMode = 'card' | 'list' | 'calendar' | 'map';

interface FeedFilter {
  type: 'recommended' | 'upcoming' | 'popular' | 'new';
  label: string;
  icon: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 1024);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FeedFilter['type']>('recommended');
  const [aiEnabled, setAiEnabled] = useState(true);
  
  // Custom hooks
  const { events, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteEvents();
  
  // Sound effects
  const [playHover] = useSound('/sounds/hover.mp3', { volume: 0.2 });
  const [playSuccess] = useSound('/sounds/notification.mp3', { volume: 0.5 });
  
  // Intersection observer for infinite scroll
  const { ref: bottomRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  
  // Last scroll position for detecting scroll direction
  const lastScrollPosition = useRef(0);

  // Feed filters
  const feedFilters: FeedFilter[] = [
    { type: 'recommended', label: 'For You', icon: <SparklesIcon className="h-5 w-5" /> },
    { type: 'upcoming', label: 'Upcoming', icon: <CalendarIcon className="h-5 w-5" /> },
    { type: 'popular', label: 'Popular', icon: <FireIcon className="h-5 w-5" /> },
    { type: 'new', label: 'New', icon: <StarIcon className="h-5 w-5" /> }
  ];

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      setIsScrollingUp(currentScrollPosition < lastScrollPosition.current);
      lastScrollPosition.current = currentScrollPosition;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Load more events when reaching bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command menu keyboard shortcut (Cmd+K or Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandMenuOpen(prevState => !prevState);
      }
      
      // Toggle dark mode (Cmd+Shift+D or Ctrl+Shift+D)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'd') {
        e.preventDefault();
        setDarkMode(prevMode => !prevMode);
        document.documentElement.classList.toggle('dark');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update dark mode class on html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle view mode change
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    playHover();
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
    playHover();
  };

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
    playHover();
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    playHover();
  };

  // Virtual list helper
  const isEventVisible = (index: number) => {
    const visibleRange = 15; // Approx number of items visible
    const scrollPosition = window.scrollY;
    const itemHeight = 350; // Approx height of an event card in pixels
    const itemTop = index * itemHeight;
    const itemBottom = itemTop + itemHeight;
    const windowTop = scrollPosition;
    const windowBottom = scrollPosition + window.innerHeight;
    
    // Add buffer for pre-loading
    const buffer = visibleRange * itemHeight;
    
    return (
      (itemTop >= windowTop - buffer && itemTop <= windowBottom + buffer) ||
      (itemBottom >= windowTop - buffer && itemBottom <= windowBottom + buffer)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Command Menu */}
      <CommandMenu isOpen={isCommandMenuOpen} setIsOpen={setIsCommandMenuOpen} />
      
      {/* Header */}
      <DashboardHeader 
        user={user} 
        profile={profile}
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        showNotifications={showNotifications}
        toggleNotifications={toggleNotifications}
      />
      
      {/* Mobile Header */}
      <motion.div 
        className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 shadow-md"
        initial={{ y: -100 }}
        animate={{ y: isScrollingUp ? 0 : -100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="mr-4">
              <ListBulletIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Events</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleNotifications}>
              <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
            <button onClick={() => setIsCommandMenuOpen(true)}>
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Notification Center */}
      <AnimatePresence>
        {showNotifications && (
          <NotificationCenter onClose={() => setShowNotifications(false)} />
        )}
      </AnimatePresence>
      
      {/* Main Layout */}
      <div className="flex h-full">
        {/* Sidebar */}
        <Sidebar 
          collapsed={isSidebarCollapsed} 
          setCollapsed={setIsSidebarCollapsed}
          profile={profile} 
        />
        
        {/* Main Content */}
        <main 
          className={`flex-1 transition-all duration-300 ${
            isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  Discover Events
                  {aiEnabled && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      <SparklesIcon className="h-3 w-3 mr-1" />
                      AI Enhanced
                    </span>
                  )}
                </h1>
                
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                    <button
                      onClick={() => handleViewModeChange('card')}
                      className={`p-2 rounded-md ${viewMode === 'card' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      <TableCellsIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleViewModeChange('list')}
                      className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      <ListBulletIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleViewModeChange('calendar')}
                      className={`p-2 rounded-md ${viewMode === 'calendar' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      <CalendarIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleViewModeChange('map')}
                      className={`p-2 rounded-md ${viewMode === 'map' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      <MapIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setAiEnabled(!aiEnabled)}
                    className={`hidden sm:flex items-center px-3 py-2 border ${
                      aiEnabled 
                        ? 'border-indigo-500 text-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300' 
                        : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    } rounded-md text-sm font-medium`}
                  >
                    <SparklesIcon className="h-4 w-4 mr-2" />
                    AI Recommendations
                  </button>
                </div>
              </div>
              
              {/* Feed Filters */}
              <div className="mt-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 pb-2 min-w-max">
                  {feedFilters.map((filter) => (
                    <motion.button
                      key={filter.type}
                      onClick={() => setCurrentFilter(filter.type)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-center px-4 py-2 rounded-full ${currentFilter === filter.type ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700'}`}
                    >
                      <span className="mr-2">{filter.icon}</span>
                      {filter.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Trending Categories (only shown for recommended view) */}
              {currentFilter === 'recommended' && (
                <section>
                  <TrendingCategories />
                </section>
              )}
              
              {/* Events Grid/List/Calendar/Map */}
              <section>
                {viewMode === 'card' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                      Array.from({ length: 9 }).map((_, index) => (
                        <SkeletonEventCard key={index} />
                      ))
                    ) : (
                      events?.map((event, index) => (
                        isEventVisible(index) && (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <EventCard event={event} />
                          </motion.div>
                        )
                      ))
                    )}
                  </div>
                )}
                
                {viewMode === 'list' && (
                  <div className="space-y-4">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="h-24 bg-white dark:bg-gray-800 rounded-lg animate-pulse" />
                      ))
                    ) : (
                      events?.map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center"
                        >
                          <div className="h-16 w-16 rounded bg-indigo-100 dark:bg-gray-700 flex-shrink-0 mr-4" />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{event.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{event.date} • {event.location}</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                )}
                
                {viewMode === 'calendar' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="text-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">September 2025</h2>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 35 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-24 border border-gray-200 dark:border-gray-700 rounded p-1 ${
                            i % 7 === 0 || i % 7 === 6 ? 'bg-gray-50 dark:bg-gray-850' : ''
                          }`}
                        >
                          <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                            {i - 3 > 0 && i - 3 <= 30 ? i - 3 : ''}
                          </div>
                          {i === 10 && (
                            <div className="mt-1 text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 p-1 rounded truncate">
                              Tech Conference
                            </div>
                          )}
                          {i === 15 && (
                            <div className="mt-1 text-xs bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 p-1 rounded truncate">
                              Music Festival
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {viewMode === 'map' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-[600px] flex items-center justify-center">
                    <div className="text-center">
                      <MapPinIcon className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Map View</h3>
                      <p className="text-gray-500 dark:text-gray-400">Interactive map coming soon</p>
                    </div>
                  </div>
                )}
              </section>
              
              {/* Loading Indicator */}
              {isFetchingNextPage && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
              )}
              
              {/* Infinite Scroll Observer */}
              <div ref={bottomRef} className="h-10" />
              
              {/* Analytics Section */}
              <section className="pt-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <ChartBarIcon className="h-5 w-5 mr-2 text-indigo-500" />
                  Your Event Analytics
                </h2>
                <AnalyticsSection />
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;