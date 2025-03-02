import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SearchFilters {
  location: string;
  category: string;
}

const Hero: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: '',
    category: ''
  });

  const categories = [
    'All Categories',
    'Music',
    'Sports',
    'Arts',
    'Food',
    'Business',
    'Technology'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient and overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700"
        style={{
          backgroundImage: `url('/images/hero-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
        >
          Discover Events Happening Near You <br />& Around the World
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto"
        >
          Find and join exciting events that match your interests. Connect with people who share your passions.
        </motion.p>

        {/* Search Section */}
        <motion.div
          variants={itemVariants}
          className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Location Input */}
            <div className="md:col-span-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchFilters.location}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Location"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white/10 backdrop-blur text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="md:col-span-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <select
                  value={searchFilters.category}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white/10 backdrop-blur text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category} className="text-gray-900">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="md:col-span-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Find Events
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={containerVariants}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { label: 'Active Events', value: '2,000+' },
            { label: 'Categories', value: '50+' },
            { label: 'Countries', value: '100+' },
            { label: 'Happy Users', value: '1M+' }
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="text-center"
            >
              <motion.p
                className="text-3xl font-bold text-white mb-2"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
              >
                {stat.value}
              </motion.p>
              <p className="text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;