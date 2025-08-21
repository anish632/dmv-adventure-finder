import React from 'react';

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const CostIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M8.433 7.418c.158-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.133 0V7.418zM11.567 7.151c.221.07.409.164.567.267v1.698a2.5 2.5 0 01-1.133 0V7.151zM10 5.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM10 3a7 7 0 100 14 7 7 0 000-14z" />
    </svg>
);

const ActivityCard = ({ activity }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden animate-fade-in">
      <div className="p-6">
        <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 mb-2">{activity.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-base">{activity.description}</p>
        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 dark:text-gray-400 space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center">
            <CostIcon />
            <span>{activity.estimated_cost}</span>
          </div>
          <div className="flex items-center">
            <LocationIcon />
            <span>{activity.location_hint}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
