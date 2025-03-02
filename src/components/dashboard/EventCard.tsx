import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  MapPinIcon, 
  HeartIcon, 
  ShareIcon, 
  TicketIcon, 
  UserGroupIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import useSound from 'use-sound';

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  image: string;
  price?: string;
  category: string;
  attendees?: number;
  friendsAttending?: string[];
  availability?: 'available' | 'limited' | 'sold_out';
  featured?: boolean;
}

interface Props {
  event: Event;
}

const EventCard: React.FC<Props> = ({ event }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  // Sound effects
  const [playHover] = useSound('/sounds/hover.mp3', { volume: 0.2 });
  const [playClick] = useSound('/sounds/click.mp3', { volume: 0.5 });

  const handleLike = () => {
    setIsLiked(!isLiked);
    playClick();
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get color based on availability
  const getAvailabilityColor = () => {
    switch (event.availability) {
      case 'limited':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'sold_out':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  // Get availability text
  const getAvailabilityText = () => {
    switch (event.availability) {
      case 'limited':
        return 'Limited tickets';
      case 'sold_out':
        return 'Sold out';
      default:
        return 'Available';
    }
  };

  return (
    <motion.div 
      className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      onMouseEnter={() => playHover()}
    >
      {/* Event image with overlay gradient */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        
        {/* Date chip */}
        <div className="absolute top-3 left-3 bg-white dark:bg-gray-800 rounded-lg px-2 py-1 shadow-md flex items-center text-xs font-medium">
          <CalendarIcon className="h-3 w-3 mr-1 text-indigo-500" />
          {formatDate(event.date)}
          {event.time && ` • ${event.time}`}
        </div>
        
        {/* Category badge */}
        {event.category && (
          <div className="absolute top-3 right-3 bg-indigo-500 text-white text-xs px-2 py-1 rounded-md font-medium">
            {event.category}
          </div>
        )}
        
        {/* Featured badge */}
        {event.featured && (
          <div className="absolute left-0 bottom-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-3 py-1 font-medium">
            Featured
          </div>
        )}
        
        {/* Like button */}
        <button 
          onClick={handleLike} 
          className="absolute right-3 bottom-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-200"
        >
          {isLiked ? (
            <HeartIconSolid className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-white" />
          )}
        </button>
      </div>
      
      {/* Event details */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {event.title}
          </h3>
          <button 
            onClick={() => setShowActions(!showActions)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Action dropdown */}
        {showActions && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-3 mt-1 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 py-1"
          >
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
              View details
            </a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
              Add to calendar
            </a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
              Report event
            </a>
          </motion.div>
        )}
        
        <div className="mt-2">
          <p className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <MapPinIcon className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
            {event.location}
          </p>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            {event.friendsAttending && event.friendsAttending.length > 0 && (
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-2">
                  {event.friendsAttending.slice(0, 3).map((friend, index) => (
                    <div 
                      key={index}
                      className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-800 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium"
                    >
                      {friend.charAt(0)}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {event.friendsAttending.length > 3 
                    ? `+${event.friendsAttending.length - 3} friends going` 
                    : `${event.friendsAttending.length} friends`}
                </span>
              </div>
            )}
            
            {event.attendees && !event.friendsAttending && (
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <UserGroupIcon className="h-4 w-4 mr-1" />
                {event.attendees} attending
              </div>
            )}
          </div>
          
          {event.price && (
            <div className="text-sm font-medium">
              <span className="text-gray-900 dark:text-white">{event.price}</span>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className={`text-xs font-medium ${getAvailabilityColor()} py-1 px-2 rounded-md flex items-center`}>
            <TicketIcon className="h-3 w-3 mr-1" />
            {getAvailabilityText()}
          </div>
          
          <div className="flex space-x-2">
            <button className="p-1.5 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">
              <ShareIcon className="h-4 w-4" />
            </button>
            <button className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-md text-sm font-medium">
              Details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;