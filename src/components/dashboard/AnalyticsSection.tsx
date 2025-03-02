import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';
import useSound from 'use-sound';

// Mock data for analytics
const categoryData = [
  { name: 'Music', value: 42, color: '#818CF8' },
  { name: 'Tech', value: 28, color: '#34D399' },
  { name: 'Food', value: 15, color: '#F87171' },
  { name: 'Sports', value: 10, color: '#FBBF24' },
  { name: 'Arts', value: 5, color: '#C084FC' }
];

const monthlyData = [
  { month: 'Jan', events: 3, spent: 120 },
  { month: 'Feb', events: 5, spent: 220 },
  { month: 'Mar', events: 4, spent: 180 },
  { month: 'Apr', events: 7, spent: 350 },
  { month: 'May', events: 2, spent: 90 },
  { month: 'Jun', events: 6, spent: 280 },
  { month: 'Jul', events: 8, spent: 400 },
  { month: 'Aug', events: 5, spent: 250 },
  { month: 'Sep', events: 4, spent: 200 },
  { month: 'Oct', events: 6, spent: 320 },
  { month: 'Nov', events: 3, spent: 150 },
  { month: 'Dec', events: 0, spent: 0 }
];

const locationData = [
  { name: 'New York', events: 15 },
  { name: 'Los Angeles', events: 8 },
  { name: 'Chicago', events: 5 },
  { name: 'Austin', events: 4 },
  { name: 'Seattle', events: 3 }
];

const upcomingEvents = 6;
const totalEventsAttended = 58;
const totalMoneySaved = 245;
const satisfactionScore = 92;

type TimeFrame = '30days' | '6months' | '1year' | 'all';

const AnalyticsSection: React.FC = () => {
  const [timeframe, setTimeframe] = useState<TimeFrame>('6months');
  const [activeTab, setActiveTab] = useState<'attendance' | 'spending'>('attendance');
  
  // Sound effects
  const [playHover] = useSound('/sounds/hover.mp3', { volume: 0.2 });

  // Calculate max value for bar chart scaling
  const maxEventValue = Math.max(...monthlyData.map(item => item.events));
  const maxSpentValue = Math.max(...monthlyData.map(item => item.spent));
  
  // Function to get months based on timeframe
  const getFilteredMonths = () => {
    const currentMonth = new Date().getMonth();
    
    switch (timeframe) {
      case '30days':
        // Just return current and previous month
        return monthlyData.slice(Math.max(0, currentMonth - 1), currentMonth + 1);
      case '6months':
        // Return last 6 months
        const sixMonthsAgo = currentMonth - 5;
        const startIndex = sixMonthsAgo >= 0 ? sixMonthsAgo : 12 + sixMonthsAgo;
        const result = [];
        
        for (let i = 0; i < 6; i++) {
          const index = (startIndex + i) % 12;
          result.push(monthlyData[index]);
        }
        return result;
      case '1year':
        return monthlyData;
      case 'all':
        return monthlyData;
      default:
        return monthlyData;
    }
  };

  const filteredMonths = getFilteredMonths();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Summary cards */}
      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <p className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming Events</p>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">{upcomingEvents}</p>
          <div className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center">
            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>2 more than last month</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
              <ChartBarIcon className="h-5 w-5" />
            </div>
            <p className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">Total Attended</p>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">{totalEventsAttended}</p>
          <div className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center">
            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>+12.5% from last year</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
              <CurrencyDollarIcon className="h-5 w-5" />
            </div>
            <p className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">Saved Money</p>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">${totalMoneySaved}</p>
          <div className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center">
            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>Through early bookings</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <p className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">Satisfaction</p>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">{satisfactionScore}%</p>
          <div className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center">
            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>Based on your ratings</span>
          </div>
        </div>
      </div>
      
      {/* Main chart */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Event Activity</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track your event attendance and spending</p>
          </div>
          
          <div className="flex">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex">
              <button
                onClick={() => setActiveTab('attendance')}
                className={`px-3 py-1 text-sm ${
                  activeTab === 'attendance'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm rounded-md'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onMouseEnter={() => playHover()}
              >
                Attendance
              </button>
              <button
                onClick={() => setActiveTab('spending')}
                className={`px-3 py-1 text-sm ${
                  activeTab === 'spending'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm rounded-md'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onMouseEnter={() => playHover()}
              >
                Spending
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeframe('30days')}
              className={`px-3 py-1 text-xs rounded-md ${
                timeframe === '30days'
                  ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onMouseEnter={() => playHover()}
            >
              30 days
            </button>
            <button
              onClick={() => setTimeframe('6months')}
              className={`px-3 py-1 text-xs rounded-md ${
                timeframe === '6months'
                  ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onMouseEnter={() => playHover()}
            >
              6 months
            </button>
            <button
              onClick={() => setTimeframe('1year')}
              className={`px-3 py-1 text-xs rounded-md ${
                timeframe === '1year'
                  ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onMouseEnter={() => playHover()}
            >
              1 year
            </button>
            <button
              onClick={() => setTimeframe('all')}
              className={`px-3 py-1 text-xs rounded-md ${
                timeframe === 'all'
                  ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onMouseEnter={() => playHover()}
            >
              All time
            </button>
          </div>
        </div>
        
        {/* Chart visualization */}
        <div className="h-64 flex items-end space-x-2 mt-4 relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 bottom-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 py-2">
            <span>
              {activeTab === 'attendance' 
                ? Math.round(maxEventValue) 
                : `$${Math.round(maxSpentValue)}`}
            </span>
            <span>
              {activeTab === 'attendance' 
                ? Math.round(maxEventValue / 2) 
                : `$${Math.round(maxSpentValue / 2)}`}
            </span>
            <span>0</span>
          </div>
          
          <div className="pl-6 flex-1 flex items-end space-x-2 border-b border-t border-gray-200 dark:border-gray-700 pb-2 pt-6">
            {filteredMonths.map((item, index) => {
              const value = activeTab === 'attendance' ? item.events : item.spent;
              const maxValue = activeTab === 'attendance' ? maxEventValue : maxSpentValue;
              const heightPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
              
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercentage}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={`w-full max-w-[40px] rounded-t-md ${
                      activeTab === 'attendance' 
                        ? 'bg-indigo-500 dark:bg-indigo-600'
                        : 'bg-green-500 dark:bg-green-600'
                    }`}
                  />
                  <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Chart legend */}
        <div className="mt-4 flex justify-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-indigo-500 dark:bg-indigo-600 rounded-sm mr-1" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {activeTab === 'attendance' ? 'Events Attended' : 'Money Spent'}
              </span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 bg-gray-200 dark:bg-gray-700 rounded-sm mr-1" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Average</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Side panels */}
      <div className="space-y-6">
        {/* Category breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <ChartPieIcon className="h-5 w-5 mr-2 text-indigo-500" />
            Category Breakdown
          </h3>
          
          <div className="mt-4 space-y-4">
            {categoryData.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{category.name}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{category.value}%</span>
                </div>
                <div className="mt-2 h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.value}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Popular locations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2 text-indigo-500" />
            Top Locations
          </h3>
          
          <div className="mt-4 space-y-3">
            {locationData.map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{location.name}</span>
                <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">
                  {location.events} events
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;