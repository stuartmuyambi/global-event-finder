import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';
import { 
  BellIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  TicketIcon, 
  XMarkIcon,
  MegaphoneIcon,
  ClockIcon,
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import useSound from 'use-sound';

interface NotificationProps {
  onClose: () => void;
}

interface Notification {
  id: string;
  type: 'event' | 'friend' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  image?: string;
}

const NotificationCenter: React.FC<NotificationProps> = ({ onClose }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Sound effects
  const [playHover] = useSound('/sounds/hover.mp3', { volume: 0.2 });
  const [playClick] = useSound('/sounds/click.mp3', { volume: 0.5 });
  
  // Fetch notifications (simulated)
  useEffect(() => {
    const fetchNotifications = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample notifications data
      const notificationsData: Notification[] = [
        {
          id: '1',
          type: 'event',
          title: 'Price Drop Alert',
          message: 'Tickets for "Summer Music Festival" are now 20% off!',
          time: '10 minutes ago',
          read: false,
          actionUrl: '/events/summer-festival',
          actionLabel: 'View Event',
          image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fG11c2ljJTIwZmVzdGl2YWx8ZW58MHx8MHx8&auto=format&fit=crop&w=100&q=60'
        },
        {
          id: '2',
          type: 'friend',
          title: 'New Connection',
          message: 'Alex Johnson accepted your friend request',
          time: '1 hour ago',
          read: false,
          actionUrl: '/profile/alex-johnson',
          actionLabel: 'View Profile'
        },
        {
          id: '3',
          type: 'event',
          title: 'Event Reminder',
          message: 'The "Tech Conference 2025" starts tomorrow at 9 AM',
          time: '3 hours ago',
          read: true,
          actionUrl: '/events/tech-conf-2025',
          actionLabel: 'Event Details',
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGVjaCUyMGNvbmZlcmVuY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=100&q=60'
        },
        {
          id: '4',
          type: 'system',
          title: 'Account Update',
          message: 'Your profile was successfully updated',
          time: '1 day ago',
          read: true
        },
        {
          id: '5',
          type: 'friend',
          title: 'Event Invitation',
          message: 'Sarah invited you to "Art Exhibition Opening"',
          time: '1 day ago',
          read: false,
          actionUrl: '/events/art-exhibition',
          actionLabel: 'Respond'
        },
        {
          id: '6',
          type: 'system',
          title: 'New Feature Available',
          message: 'Check out our new AR event preview feature',
          time: '2 days ago',
          read: true,
          actionUrl: '/features/ar-preview',
          actionLabel: 'Learn More'
        },
        {
          id: '7',
          type: 'event',
          title: 'New Recommended Event',
          message: 'Based on your preferences: "Jazz in the Park"',
          time: '2 days ago',
          read: true,
          actionUrl: '/events/jazz-park',
          actionLabel: 'View Event',
          image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8amF6enxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=100&q=60'
        }
      ];
      
      setNotifications(notificationsData);
      setIsLoading(false);
    };
    
    fetchNotifications();
  }, []);
  
  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    playClick();
  };
  
  // Filter notifications by type
  const eventNotifications = notifications.filter(n => n.type === 'event');
  const friendNotifications = notifications.filter(n => n.type === 'friend');
  const systemNotifications = notifications.filter(n => n.type === 'system');
  
  // Get unread count by type
  const eventUnreadCount = eventNotifications.filter(n => !n.read).length;
  const friendUnreadCount = friendNotifications.filter(n => !n.read).length;
  const systemUnreadCount = systemNotifications.filter(n => !n.read).length;
  const totalUnreadCount = notifications.filter(n => !n.read).length;
  
  // Tab categories
  const categories = [
    { name: 'All', count: totalUnreadCount },
    { name: 'Events', count: eventUnreadCount, icon: <CalendarIcon className="h-5 w-5" /> },
    { name: 'Friends', count: friendUnreadCount, icon: <UserGroupIcon className="h-5 w-5" /> },
    { name: 'System', count: systemUnreadCount, icon: <MegaphoneIcon className="h-5 w-5" /> }
  ];
  
  // Get filtered notifications based on selected tab
  const getFilteredNotifications = () => {
    switch (selectedTab) {
      case 1: return eventNotifications;
      case 2: return friendNotifications;
      case 3: return systemNotifications;
      default: return notifications;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ duration: 0.2 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl z-[70]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <BellIcon className="h-5 w-5 mr-2" />
            Notifications
            {totalUnreadCount > 0 && (
              <span className="ml-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full">
                {totalUnreadCount} new
              </span>
            )}
          </h2>
          <div className="flex items-center space-x-3">
            <button 
              onClick={markAllAsRead}
              className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium flex items-center"
              onMouseEnter={() => playHover()}
            >
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Mark all as read
            </button>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onMouseEnter={() => playHover()}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex p-1 space-x-1 bg-gray-50 dark:bg-gray-900/50">
            {categories.map((category, idx) => (
              <Tab
                key={category.name}
                className={({ selected }) =>
                  `flex-1 py-2.5 text-sm font-medium leading-5 text-gray-700 dark:text-gray-300 rounded-md
                  ${selected 
                    ? 'bg-white dark:bg-gray-800 shadow'
                    : 'hover:bg-white/[0.5] dark:hover:bg-gray-800/[0.5] hover:text-gray-900 dark:hover:text-white'
                  }`
                }
                onClick={() => playHover()}
              >
                <div className="flex items-center justify-center">
                  {idx > 0 && <span className="mr-2">{category.icon}</span>}
                  {category.name}
                  {category.count > 0 && (
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                      selectedTab === idx
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {category.count}
                    </span>
                  )}
                </div>
              </Tab>
            ))}
          </Tab.List>
          
          <Tab.Panels className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 110px)' }}>
            {/* Loading state */}
            {isLoading ? (
              <div className="p-4 flex flex-col items-center justify-center h-40">
                <ArrowPathIcon className="h-8 w-8 text-indigo-500 animate-spin mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Loading notifications...</p>
              </div>
            ) : (
              <Tab.Panel>
                <NotificationList 
                  notifications={getFilteredNotifications()} 
                  onMarkAsRead={markAsRead} 
                  playHover={playHover}
                  playClick={playClick}
                />
              </Tab.Panel>
            )}
          </Tab.Panels>
        </Tab.Group>
      </motion.div>
    </>
  );
};

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  playHover: () => void;
  playClick: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  onMarkAsRead,
  playHover,
  playClick
}) => {
  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <BellIcon className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400">No notifications to show</p>
      </div>
    );
  }
  
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {notifications.map((notification) => (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-4 ${!notification.read ? 'bg-indigo-50/40 dark:bg-indigo-900/10' : ''}`}
        >
          <div className="flex">
            {/* Notification icon/image */}
            <div className="flex-shrink-0 mr-4">
              {notification.image ? (
                <img 
                  src={notification.image} 
                  alt="" 
                  className="h-12 w-12 rounded-lg object-cover" 
                />
              ) : (
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                  notification.type === 'friend' 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                    : notification.type === 'system'
                    ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                    : 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                }`}>
                  {notification.type === 'event' && <CalendarIcon className="h-6 w-6" />}
                  {notification.type === 'friend' && <UserGroupIcon className="h-6 w-6" />}
                  {notification.type === 'system' && <MegaphoneIcon className="h-6 w-6" />}
                </div>
              )}
            </div>
            
            {/* Notification content */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className={`text-sm font-medium ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                  {notification.title}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  {notification.time}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {notification.message}
              </p>
              
              {/* Action button */}
              {notification.actionUrl && notification.actionLabel && (
                <div className="mt-3">
                  <Link
                    to={notification.actionUrl}
                    className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    onClick={() => {
                      onMarkAsRead(notification.id);
                      playClick();
                    }}
                    onMouseEnter={() => playHover()}
                  >
                    {notification.actionLabel}
                    <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Unread indicator */}
            {!notification.read && (
              <div className="flex-shrink-0 ml-4">
                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default NotificationCenter;