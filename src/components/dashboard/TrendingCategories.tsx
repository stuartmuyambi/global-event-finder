import { useState } from 'react';
import { motion } from 'framer-motion';
import { FireIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import useSound from 'use-sound';

interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
  color: string;
  gradient: string;
}

const TrendingCategories: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Sound effects
  const [playHover] = useSound('/sounds/hover.mp3', { volume: 0.2 });
  const [playClick] = useSound('/sounds/click.mp3', { volume: 0.5 });
  
  // Trending categories data
  const categories: Category[] = [
    {
      id: 'music',
      name: 'Concerts & Music',
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbmNlcnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      count: 256,
      color: 'from-purple-600 to-blue-500',
      gradient: 'bg-gradient-to-r from-purple-600 to-blue-500'
    },
    {
      id: 'food',
      name: 'Food Festivals',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMGZlc3RpdmFsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      count: 145,
      color: 'from-yellow-400 to-orange-500',
      gradient: 'bg-gradient-to-r from-yellow-400 to-orange-500'
    },
    {
      id: 'tech',
      name: 'Tech Conferences',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGVjaCUyMGNvbmZlcmVuY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      count: 89,
      color: 'from-cyan-500 to-blue-500',
      gradient: 'bg-gradient-to-r from-cyan-500 to-blue-500'
    },
    {
      id: 'sports',
      name: 'Sports Events',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3BvcnRzJTIwZXZlbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      count: 210,
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      id: 'arts',
      name: 'Arts & Theatre',
      image: 'https://images.unsplash.com/photo-1581785545132-877885a11079?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YXJ0JTIwdGhlYXRlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      count: 130,
      color: 'from-pink-500 to-rose-500',
      gradient: 'bg-gradient-to-r from-pink-500 to-rose-500'
    },
  ];
  
  const handleCategoryClick = (id: string) => {
    playClick();
    // In a real app, this would navigate to a filtered view
    console.log(`Navigating to ${id} category`);
  };

  return (
    <div className="mb-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <FireIcon className="h-6 w-6 text-orange-500 mr-2" />
          Trending Categories
        </h2>
        <button 
          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
          onMouseEnter={() => playHover()}
        >
          View all
          <ArrowRightIcon className="h-4 w-4 ml-1" />
        </button>
      </div>
      
      {/* Categories grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            className="relative rounded-xl overflow-hidden cursor-pointer group h-40"
            onClick={() => handleCategoryClick(category.id)}
            onMouseEnter={() => {
              setActiveCategory(category.id);
              playHover();
            }}
            onMouseLeave={() => setActiveCategory(null)}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
              <div className={`absolute inset-0 opacity-60 ${category.id === activeCategory ? 'opacity-80' : 'opacity-60'} transition-opacity duration-300 ${category.gradient}`} style={{ mixBlendMode: 'soft-light' }} />
            </div>
            
            {/* Content */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-white font-bold text-lg drop-shadow-md">
                  {category.name}
                </h3>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-white text-sm font-medium bg-black/30 px-2 py-0.5 rounded backdrop-blur-sm">
                  {category.count} events
                </span>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: category.id === activeCategory ? 1 : 0,
                    scale: category.id === activeCategory ? 1 : 0.8
                  }}
                  className="bg-white text-gray-900 rounded-full p-1.5"
                >
                  <ArrowRightIcon className="h-4 w-4" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrendingCategories;