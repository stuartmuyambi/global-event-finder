import React, { useState } from 'react';
import OnboardingFlow from '../components/Onboarding';

const Home: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      {showOnboarding ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl">
            <OnboardingFlow />
          </div>
        </div>
      ) : (
        <div className="flex-1 container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Discover Events Worldwide
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our community and never miss out on exciting events happening around you. 
              Connect with like-minded people and create lasting memories.
            </p>
            <button
              onClick={() => setShowOnboarding(true)}
              className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold 
                hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 
                shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-200">
              <div className="text-indigo-600 text-4xl mb-4">🎭</div>
              <h3 className="text-xl font-semibold mb-3">Any Event Type</h3>
              <p className="text-gray-600 dark:text-gray-300">
                From concerts to workshops, find events that match your interests.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-200">
              <div className="text-indigo-600 text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-3">Global Coverage</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Discover events from around the world or right in your neighborhood.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-200">
              <div className="text-indigo-600 text-4xl mb-4">💫</div>
              <h3 className="text-xl font-semibold mb-3">Personalized For You</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get recommendations based on your interests and location.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;