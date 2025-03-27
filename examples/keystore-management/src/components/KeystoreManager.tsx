"use client";

import { useState } from 'react';
import { useKeystore } from '../contexts/index';
import { saveKeystoreToFile, readKeystoreFromFile } from '../utils/fileUtils';

export default function KeystoreManager() {
  const { 
    isInitialized: isKeystoreInitialized, 
    hasStoredCredentials, 
    storedCredentialsHashes,
    exportKeystore,
    importKeystore 
  } = useKeystore();
  
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const handleExport = () => {
    try {
      const keystoreJson = exportKeystore();
      saveKeystoreToFile(keystoreJson);
      setSuccessMessage('Keystore exported successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export keystore');
      setTimeout(() => setError(null), 3000);
    }
  };
  
  const handleImport = async () => {
    try {
      const keystoreJson = await readKeystoreFromFile();
      const success = importKeystore(keystoreJson);
      
      if (success) {
        setSuccessMessage('Keystore imported successfully');
      } else {
        setError('Failed to import keystore');
      }
      
      setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import keystore');
      setTimeout(() => setError(null), 3000);
    }
  };
  
  if (!isKeystoreInitialized) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p className="text-gray-700 dark:text-gray-300">Initializing keystore...</p>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Keystore Management</h2>
      
      {/* Status */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Status:</span> {hasStoredCredentials ? 'Credentials found' : 'No credentials stored'}
        </p>
        {hasStoredCredentials && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            <span className="font-semibold">Stored credentials:</span> {storedCredentialsHashes.length}
          </p>
        )}
      </div>
      
      {/* Notifications */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
        </div>
      )}
      
      {/* Import/Export Buttons */}
      <div className="space-y-4">
        {/* Export Keystore */}
        <div>
          <button
            onClick={handleExport}
            disabled={!hasStoredCredentials}
            className={`w-full py-2 px-4 rounded ${
              !hasStoredCredentials
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-800'
            }`}
          >
            Export Keystore
          </button>
          {!hasStoredCredentials && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              No credentials to export
            </p>
          )}
        </div>
        
        {/* Import Keystore */}
        <div>
          <button
            onClick={handleImport}
            className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 active:bg-green-800 dark:bg-green-700 dark:hover:bg-green-800"
          >
            Import Keystore
          </button>
        </div>
      </div>
    </div>
  );
} 