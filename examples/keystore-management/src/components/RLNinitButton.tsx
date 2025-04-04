"use client";

import { useRLN } from '@/contexts';
import React from 'react';

export function RLNInitButton() {
  const { initializeRLN, isInitialized, isStarted, error, isLoading } = useRLN();

  const handleInitialize = async () => {
    try {
      await initializeRLN();
    } catch (err) {
      console.error('Error initializing RLN:', err);
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Initializing...';
    if (isInitialized && isStarted) return 'RLN Initialized';
    return 'Initialize RLN';
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleInitialize}
        disabled={isLoading || (isInitialized && isStarted)}
        className={`
          px-4 py-2 rounded-lg font-medium transition-colors relative
          ${
            isLoading 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
              : isInitialized && isStarted
                ? 'bg-green-600 text-white cursor-default dark:bg-green-500'
                : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
          }
        `}
      >
        {isLoading && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2">
            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        )}
        {isInitialized && isStarted && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2">
            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}
        <span className={(isLoading || (isInitialized && isStarted)) ? 'pl-7' : ''}>
          {getButtonText()}
        </span>
      </button>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
} 