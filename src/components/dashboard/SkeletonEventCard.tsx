import React from 'react';

const SkeletonEventCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
      
      {/* Content skeleton */}
      <div className="p-4">
        {/* Title */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-3"></div>
        
        {/* Location */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2 mb-6"></div>
        
        {/* Friends attending */}
        <div className="flex items-center mb-6">
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-1"></div>
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-1"></div>
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded-md ml-2"></div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="flex space-x-2">
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonEventCard;