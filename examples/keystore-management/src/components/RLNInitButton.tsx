"use client";

import React from 'react';
import { useRLN } from '../contexts/rln';

export function RLNInitButton() {
  const { initializeRLN, isInitialized, isStarted, error } = useRLN();

  const handleInitialize = async () => {
    try {
      await initializeRLN();
    } catch (err) {
      console.error('Error initializing RLN:', err);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleInitialize}
        disabled={isInitialized && isStarted}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          isInitialized && isStarted
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
            : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
        }`}
      >
        {isInitialized && isStarted ? 'RLN Initialized' : 'Initialize RLN'}
      </button>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
} 