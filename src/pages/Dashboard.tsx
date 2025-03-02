import React from 'react';
import { useAuth } from '@/context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="mb-4">Welcome back, {user?.email}!</p>
        <p className="text-gray-600 dark:text-gray-400">
          This is a protected dashboard page that only authenticated users can access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded">
              <span className="block text-sm text-gray-500 dark:text-gray-400">Total Views</span>
              <span className="text-2xl font-bold">1,234</span>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded">
              <span className="block text-sm text-gray-500 dark:text-gray-400">Completed</span>
              <span className="text-2xl font-bold">42</span>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded">
              <span className="block text-sm text-gray-500 dark:text-gray-400">In Progress</span>
              <span className="text-2xl font-bold">7</span>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded">
              <span className="block text-sm text-gray-500 dark:text-gray-400">Tasks</span>
              <span className="text-2xl font-bold">12</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-4">
            <div className="border-b pb-2 border-gray-200 dark:border-gray-700">
              <p className="font-medium">Project X updated</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
            </div>
            <div className="border-b pb-2 border-gray-200 dark:border-gray-700">
              <p className="font-medium">New comment on Task Y</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">5 hours ago</p>
            </div>
            <div>
              <p className="font-medium">Task Z completed</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Yesterday</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition">
              Create New Task
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition">
              Generate Report
            </button>
            <button className="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 py-2 px-4 rounded transition">
              View All Activities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;