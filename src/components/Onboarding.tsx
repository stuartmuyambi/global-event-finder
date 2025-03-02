import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface OnboardingStep {
  title: string;
  description: string;
}

const OnboardingFlow: React.FC = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    interests: [] as string[],
    location: '',
    notifications: false,
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { register } = useAuth();

  const steps: OnboardingStep[] = [
    {
      title: "Welcome! Let's get started",
      description: "We'll help you set up your profile in just a few steps"
    },
    {
      title: "Tell us about yourself",
      description: "This helps us personalize your experience"
    },
    {
      title: "Choose your interests",
      description: "Select the types of events you're interested in"
    },
    {
      title: "Almost there!",
      description: "Just a few final touches"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-bold text-indigo-600">{steps[0].title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{steps[0].description}</p>
            <button
              onClick={nextStep}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                What should we call you?
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Where are you located?
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your location"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {['Music', 'Sports', 'Tech', 'Art', 'Food', 'Business'].map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-4 rounded-lg border ${
                    formData.interests.includes(interest)
                      ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                      : 'border-gray-300 hover:border-indigo-500'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Choose a password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your password"
              />
            </div>
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                name="notifications"
                checked={formData.notifications}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable notifications for upcoming events
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {step > 0 && (
            <button
              onClick={prevStep}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Back
            </button>
          )}
          <div className="flex-1 mx-4">
            <div className="flex justify-between">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-full mx-1 rounded-full ${
                    index <= step ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="text-sm text-gray-500">
            Step {step + 1} of {steps.length}
          </span>
        </div>
      </div>

      <div className="mb-8">
        {renderStep()}
      </div>

      <div className="flex justify-between mt-8">
        {step > 0 && (
          <button
            onClick={prevStep}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button
            onClick={nextStep}
            className="ml-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={async () => {
              try {
                // Register the user with Firebase
                await register(formData.email, formData.password);
                console.log('Onboarding completed:', formData);
                // After successful registration, navigate to dashboard
                navigate('/dashboard');
              } catch (error) {
                console.error('Error during registration:', error);
                // You might want to add error handling UI here
              }
            }}
            className="ml-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;