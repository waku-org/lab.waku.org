"use client";

import React from 'react';
import { useKeystore } from '../../../contexts/keystore';
import { useAppState } from '../../../contexts/AppStateContext';
import { useRLN } from '../../../contexts/rln';
import { saveKeystoreToFile, readKeystoreFromFile } from '../../../utils/fileUtils';

export function KeystoreManagement() {
  const { 
    hasStoredCredentials, 
    storedCredentialsHashes, 
    error,
    exportKeystore,
    importKeystore,
    removeCredential
  } = useKeystore();
  const { setGlobalError } = useAppState();
  const { isInitialized, isStarted } = useRLN();

  React.useEffect(() => {
    if (error) {
      setGlobalError(error);
    }
  }, [error, setGlobalError]);

  const handleExport = () => {
    try {
      const keystoreJson = exportKeystore();
      saveKeystoreToFile(keystoreJson);
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Failed to export keystore');
    }
  };

  const handleImport = async () => {
    try {
      const keystoreJson = await readKeystoreFromFile();
      const success = importKeystore(keystoreJson);
      if (!success) {
        setGlobalError('Failed to import keystore');
      }
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Failed to import keystore');
    }
  };

  const handleRemoveCredential = (hash: string) => {
    try {
      removeCredential(hash);
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Failed to remove credential');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Keystore Management
        </h2>
        
        <div className="space-y-6">
          {/* Import/Export Actions */}
          <div className="flex space-x-4">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Export Keystore
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Import Keystore
            </button>
          </div>

          {/* RLN Status */}
          {!isInitialized || !isStarted ? (
            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                ⚠️ Please initialize RLN before managing credentials
              </p>
            </div>
          ) : null}

          {/* Stored Credentials */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Stored Credentials
            </h3>
            
            {hasStoredCredentials ? (
              <div className="space-y-4">
                {storedCredentialsHashes.map((hash) => (
                  <div 
                    key={hash} 
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <code className="text-sm text-gray-600 dark:text-gray-400 break-all">
                        {hash}
                      </code>
                      <button
                        onClick={() => handleRemoveCredential(hash)}
                        className="ml-4 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No credentials stored
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 