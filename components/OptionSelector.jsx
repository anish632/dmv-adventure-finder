import React from 'react';

const OptionSelector = ({
  title,
  options,
  selectedValue,
  onSelect,
  Icon,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
        {Icon && <span className="mr-3">{Icon}</span>}
        {title}
      </h2>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`px-4 py-2 text-sm font-medium rounded-full shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 ${
              selectedValue === option
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OptionSelector;
