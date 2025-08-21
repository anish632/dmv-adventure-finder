import React, { useState, useCallback } from 'react';
import { LOCATION_OPTIONS, TIME_OPTIONS, BUDGET_OPTIONS } from './constants';
import { getSuggestions } from './services/geminiService';
import OptionSelector from './components/OptionSelector';
import ActivityCard from './components/ActivityCard';
import Loader from './components/Loader';

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const TimeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const BudgetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
    </svg>
);

const App = () => {
  const [location, setLocation] = useState(null);
  const [time, setTime] = useState(null);
  const [budget, setBudget] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const isFormComplete = location && time && budget;

  const handleFindAdventure = useCallback(async () => {
    if (!isFormComplete) return;

    setIsLoading(true);
    setError(null);
    setShowResults(true);
    setActivities([]);

    try {
      const suggestions = await getSuggestions(location, time, budget);
      if (suggestions.length === 0) {
        setError("Couldn't find any activities. Try different options!");
      }
      setActivities(suggestions);
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [location, time, budget, isFormComplete]);

  const renderContent = () => {
    if (!showResults) {
      return (
        <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Welcome!</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Select your preferences above to discover your next adventure.</p>
        </div>
      );
    }

    if (isLoading) {
      return <Loader />;
    }

    if (error) {
      return <div className="text-center p-10 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400">{error}</div>;
    }

    if (activities.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((activity, index) => (
            <ActivityCard key={index} activity={activity} />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <main className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
            DMV Adventure Finder
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Discover your next journey in DC, Maryland, or Virginia.
          </p>
        </header>

        <section className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
          <OptionSelector title="Choose a Location" options={LOCATION_OPTIONS} selectedValue={location} onSelect={setLocation} Icon={<LocationIcon/>} />
          <OptionSelector title="How Much Time Do You Have?" options={TIME_OPTIONS} selectedValue={time} onSelect={setTime} Icon={<TimeIcon/>} />
          <OptionSelector title="Set Your Budget" options={BUDGET_OPTIONS} selectedValue={budget} onSelect={setBudget} Icon={<BudgetIcon/>} />
          
          <div className="text-center mt-8">
            <button
              onClick={handleFindAdventure}
              disabled={!isFormComplete || isLoading}
              className={`w-full sm:w-auto px-12 py-4 text-lg font-bold text-white rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 ${
                isFormComplete && !isLoading
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Searching...' : 'Find Adventure'}
            </button>
          </div>
        </section>

        <section className="mt-12">
          {renderContent()}
        </section>
      </main>
    </div>
  );
};

export default App;
