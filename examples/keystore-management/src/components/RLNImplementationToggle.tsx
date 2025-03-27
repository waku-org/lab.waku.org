"use client";

import React from 'react';
import { useRLNImplementation } from '../contexts/rln';

export function RLNImplementationToggle() {
  const { implementation, setImplementation } = useRLNImplementation();

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        RLN Implementation
      </label>
      <div className="flex space-x-4">
        <button
          onClick={() => setImplementation('light')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            implementation === 'light'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          Light
        </button>
        <button
          onClick={() => setImplementation('standard')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            implementation === 'standard'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          Standard
        </button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {implementation === 'light'
          ? 'Light implementation, without Zerokit. Instant initalisation.'
          : 'Standard implementation, with Zerokit. Initialisation takes 10-15 seconds for WASM module'
        }
      </p>
    </div>
  );
}
