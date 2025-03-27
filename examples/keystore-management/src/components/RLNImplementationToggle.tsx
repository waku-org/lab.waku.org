"use client";

import { useRLNImplementation, type RLNImplementationType } from '../contexts/index';

export function RLNImplementationToggle() {
  const { implementation, setImplementation } = useRLNImplementation();

  const handleToggle = (newImplementation: RLNImplementationType) => {
    setImplementation(newImplementation);
  };

  return (
    <div className="flex items-center space-x-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        RLN Implementation:
      </span>
      <div className="flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          onClick={() => handleToggle('standard')}
          className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
            implementation === 'standard'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
          }`}
        >
          Standard
        </button>
        <button
          type="button"
          onClick={() => handleToggle('light')}
          className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
            implementation === 'light'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
          }`}
        >
          Light
        </button>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {implementation === 'standard' ? (
          <span>Using full RLN implementation</span>
        ) : (
          <span>Using lightweight RLN implementation</span>
        )}
      </div>
    </div>
  );
}
