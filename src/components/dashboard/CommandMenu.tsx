import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  Cog6ToothIcon,
  HomeIcon,
  UserGroupIcon,
  BookmarkIcon,
  HeartIcon,
  SparklesIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import useSound from 'use-sound';

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string[];
  section?: string;
  keywords?: string[];
  featured?: boolean;
}

const CommandMenu: React.FC<Props> = ({ isOpen, setIsOpen }): JSX.Element => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();
  
  // Sound effects
  const [playHover] = useSound('/sounds/hover.mp3', { volume: 0.2 });
  const [playClick] = useSound('/sounds/click.mp3', { volume: 0.5 });

  // Command items
  const commands: CommandItem[] = [
    {
      id: 'home',
      title: 'Go to Dashboard',
      description: 'Return to the main dashboard view',
      icon: <HomeIcon className="h-5 w-5" />,
      action: () => {
        navigate('/dashboard');
        setIsOpen(false);
      },
      shortcut: ['g', 'd'],
      section: 'Navigation',
      keywords: ['dashboard', 'home', 'main'],
      featured: true
    },
    {
      id: 'events',
      title: 'Browse Events',
      description: 'View all upcoming events',
      icon: <CalendarIcon className="h-5 w-5" />,
      action: () => {
        navigate('/events');
        setIsOpen(false);
      },
      shortcut: ['g', 'e'],
      section: 'Navigation',
      keywords: ['events', 'concerts', 'shows', 'calendar']
    },
    {
      id: 'explore',
      title: 'Explore',
      description: 'Discover events near you',
      icon: <MapPinIcon className="h-5 w-5" />,
      action: () => {
        navigate('/explore');
        setIsOpen(false);
      },
      section: 'Navigation',
      keywords: ['explore', 'discover', 'nearby', 'map']
    },
    {
      id: 'friends',
      title: 'Find Friends',
      description: 'Connect with friends and see their events',
      icon: <UserGroupIcon className="h-5 w-5" />,
      action: () => {
        navigate('/friends');
        setIsOpen(false);
      },
      section: 'Social',
      keywords: ['friends', 'social', 'connections', 'people']
    },
    {
      id: 'saved',
      title: 'Saved Events',
      description: 'View your bookmarked events',
      icon: <BookmarkIcon className="h-5 w-5" />,
      action: () => {
        navigate('/saved');
        setIsOpen(false);
      },
      shortcut: ['g', 's'],
      section: 'User',
      keywords: ['saved', 'bookmarks', 'favorites']
    },
    {
      id: 'attending',
      title: 'My Events',
      description: 'Events you\'re attending',
      icon: <HeartIcon className="h-5 w-5" />,
      action: () => {
        navigate('/my-events');
        setIsOpen(false);
      },
      section: 'User',
      keywords: ['my events', 'attending', 'going', 'tickets']
    },
    {
      id: 'profile',
      title: 'My Profile',
      description: 'View and edit your profile',
      icon: <UserIcon className="h-5 w-5" />,
      action: () => {
        navigate('/profile');
        setIsOpen(false);
      },
      shortcut: ['g', 'p'],
      section: 'User',
      keywords: ['profile', 'account', 'me'],
      featured: true
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Manage your account settings',
      icon: <Cog6ToothIcon className="h-5 w-5" />,
      action: () => {
        navigate('/settings');
        setIsOpen(false);
      },
      shortcut: ['g', 's'],
      section: 'User',
      keywords: ['settings', 'preferences', 'config', 'options']
    },
    {
      id: 'ai-recommendations',
      title: 'AI Recommendations',
      description: 'Get personalized event recommendations',
      icon: <SparklesIcon className="h-5 w-5" />,
      action: () => {
        navigate('/recommendations');
        setIsOpen(false);
      },
      section: 'Features',
      keywords: ['ai', 'recommendations', 'personalized', 'suggested'],
      featured: true
    }
  ];

  // Filter commands based on query
  const filteredCommands = query
    ? commands.filter(command => {
        const matchQuery = (
          command.title.toLowerCase().includes(query.toLowerCase()) ||
          (command.description && command.description.toLowerCase().includes(query.toLowerCase())) ||
          (command.keywords && command.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase())))
        );
        return matchQuery;
      })
    : commands;

  // Group commands by section
  const commandSections = filteredCommands.reduce<Record<string, CommandItem[]>>((acc, command) => {
    const section = command.section || 'Other';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(command);
    return acc;
  }, {});

  // Handle key navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          playHover();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          playHover();
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[activeIndex]) {
            filteredCommands[activeIndex].action();
            playClick();
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, filteredCommands, playHover, playClick, setIsOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (itemsRef.current[activeIndex]) {
      itemsRef.current[activeIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeIndex]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80]"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[20%] inset-x-0 mx-auto max-w-xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-[90] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Command input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center">
                <CommandLineIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Search commands..."
                className="block w-full bg-transparent pl-12 pr-4 py-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 focus:outline-none"
              />
            </div>
            
            {/* Quick actions */}
            {!query && (
              <div className="px-4 py-3">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Quick Actions
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {commands
                    .filter(cmd => cmd.featured)
                    .map(cmd => (
                      <button
                        key={cmd.id}
                        onClick={() => {
                          cmd.action();
                          playClick();
                        }}
                        onMouseEnter={() => playHover()}
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                      >
                        <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md flex items-center justify-center">
                          {cmd.icon}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{cmd.title}</span>
                      </button>
                    ))}
                </div>
              </div>
            )}
            
            {/* Command list */}
            <div className="max-h-72 overflow-y-auto">
              {Object.entries(commandSections).length > 0 ? (
                Object.entries(commandSections).map(([section, sectionCommands]) => (
                  <div key={section}>
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-gray-900/30">
                      {section}
                    </div>
                    {sectionCommands.map((command) => {
                      const commandIndex = filteredCommands.findIndex(cmd => cmd.id === command.id);
                      return (
                        <div
                          key={command.id}
                          ref={el => {
                            itemsRef.current[commandIndex] = el;
                          }}
                          onClick={() => {
                            command.action();
                            playClick();
                          }}
                          onMouseEnter={() => {
                            setActiveIndex(commandIndex);
                            playHover();
                          }}
                          className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors duration-150 ${
                            activeIndex === commandIndex 
                              ? 'bg-indigo-50 dark:bg-indigo-900/20' 
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`flex-shrink-0 h-8 w-8 rounded-md flex items-center justify-center ${
                              activeIndex === commandIndex 
                                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}>
                              {command.icon}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                {command.title}
                              </h3>
                              {command.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {command.description}
                                </p>
                              )}
                            </div>
                          </div>
                          {command.shortcut && (
                            <div className="flex items-center space-x-1">
                              {command.shortcut.map((key, i) => (
                                <kbd 
                                  key={i}
                                  className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md"
                                >
                                  {key}
                                </kbd>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No commands found</p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/30 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <kbd className="px-1 py-0.5 font-semibold bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                    ↑
                  </kbd>
                  <kbd className="px-1 py-0.5 font-semibold bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                    ↓
                  </kbd>
                  <span>to navigate</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-1 py-0.5 font-semibold bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                    ⏎
                  </kbd>
                  <span>to select</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-1 py-0.5 font-semibold bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                  ESC
                </kbd>
                <span>to close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandMenu;