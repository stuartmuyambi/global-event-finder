import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Menu } from '@headlessui/react';
import { MicrophoneIcon, CalendarIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { useThemeStore } from '@/context/store';

interface TrendingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  attendees: number;
  category: string;
}

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { scrollY } = useScroll();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Parallax effect values
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Mock trending events data
  const trendingEvents: TrendingEvent[] = [
    {
      id: '1',
      title: 'Tech Innovation Summit 2025',
      date: '2025-03-15',
      location: 'San Francisco, CA',
      image: '/images/events/tech-summit.jpg',
      attendees: 1500,
      category: 'Tech'
    },
    {
      id: '2',
      title: 'Global Music Festival',
      date: '2025-04-20',
      location: 'Austin, TX',
      image: '/images/events/music-festival.jpg',
      attendees: 5000,
      category: 'Music'
    },
    {
      id: '3',
      title: 'Future of AI Conference',
      date: '2025-05-10',
      location: 'Virtual Event',
      image: '/images/events/ai-conference.jpg',
      attendees: 2500,
      category: 'Tech'
    }
  ];

  // Categories for filter chips
  const categories = [
    { name: 'All', icon: '🌟' },
    { name: 'Music', icon: '🎵' },
    { name: 'Tech', icon: '💻' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Arts', icon: '🎨' },
    { name: 'Business', icon: '💼' }
  ];

  // Handle voice search
  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  // Mock suggestions based on search query
  useEffect(() => {
    if (searchQuery.length > 2) {
      // Simulated API call for suggestions
      const mockSuggestions = [
        'Tech conferences in San Francisco',
        'Music festivals this weekend',
        'Virtual networking events',
        'Local art exhibitions'
      ].filter(sugg => sugg.toLowerCase().includes(searchQuery.toLowerCase()));
      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic Background */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 overflow-hidden"
      >
        {/* Abstract Shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 1440 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M-200 400C100 300 400 600 700 500C1000 400 1300 600 1600 300"
              stroke={isDarkMode ? "rgba(147, 51, 234, 0.2)" : "rgba(79, 70, 229, 0.1)"}
              strokeWidth="100"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.circle
              cx="1200"
              cy="200"
              r="100"
              fill={isDarkMode ? "rgba(236, 72, 153, 0.1)" : "rgba(99, 102, 241, 0.1)"}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <motion.rect
              x="100"
              y="500"
              width="200"
              height="200"
              fill={isDarkMode ? "rgba(67, 56, 202, 0.1)" : "rgba(129, 140, 248, 0.1)"}
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Main Heading */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              Discover Global Events Near You
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From local gatherings to worldwide sensations, never miss what matters to you
          </motion.p>

          {/* Advanced Search Component */}
          <motion.div
            className="mt-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative">
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl shadow-xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for events..."
                  className="flex-1 px-6 py-4 text-lg bg-transparent focus:outline-none"
                />
                <div className="flex items-center space-x-2 px-4">
                  <Menu as="div" className="relative">
                    <Menu.Button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <CalendarIcon className="h-6 w-6 text-gray-500" />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="p-4">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                            <input
                              type="date"
                              value={dateRange.start}
                              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                            <input
                              type="date"
                              value={dateRange.end}
                              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    </Menu.Items>
                  </Menu>
                  <button
                    onClick={handleVoiceSearch}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <MicrophoneIcon className={`h-6 w-6 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <AdjustmentsHorizontalIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50">
                  <ul className="py-2">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => setSearchQuery(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${
                    selectedCategory === category.name
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Trending Events Carousel */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Trending Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingEvents.map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="relative h-48">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs">
                      {event.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{event.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{event.location}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{new Date(event.date).toLocaleDateString()}</span>
                      <span className="text-indigo-600 dark:text-indigo-400">{event.attendees}+ attending</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Get Recommendations Button */}
          {!user && (
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium text-lg shadow-xl hover:shadow-2xl transform transition-all hover:-translate-y-1"
              >
                Get Personalized Recommendations
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-gray-400 dark:border-gray-600 flex justify-center items-start p-1">
          <motion.div
            className="w-1 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"
            animate={{
              y: [0, 16, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;