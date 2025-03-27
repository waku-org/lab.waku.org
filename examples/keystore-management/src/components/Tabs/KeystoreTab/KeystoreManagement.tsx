"use client";

import React, { useEffect, useState } from 'react';
import { useKeystore } from '../../../contexts/keystore';
import { useAppState } from '../../../contexts/AppStateContext';
import { useRLN } from '../../../contexts/rln';
import { saveKeystoreToFile, readKeystoreFromFile } from '../../../utils/fileUtils';
import { KeystoreEntity } from '@waku/rln';

export function KeystoreManagement() {
  const { 
    hasStoredCredentials, 
    storedCredentialsHashes, 
    error,
    exportKeystore,
    importKeystore,
    removeCredential,
    loadCredential
  } = useKeystore();
  const { setGlobalError } = useAppState();
  const { isInitialized, isStarted } = useRLN();

  const [selectedHash, setSelectedHash] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [loadingCredential, setLoadingCredential] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadedCredential, setLoadedCredential] = useState<KeystoreEntity | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
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
      if (selectedHash === hash) {
        setSelectedHash(null);
        setPassword('');
        setLoadedCredential(null);
      }
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Failed to remove credential');
    }
  };

  const handleLoadCredential = async (hash: string) => {
    if (!password) {
      setLoadError('Please enter a password');
      return;
    }

    if (!isInitialized || !isStarted) {
      setLoadError('Please initialize RLN first');
      return;
    }

    setLoadingCredential(true);
    setLoadError(null);
    setShowSuccess(false);

    try {
      const credential = await loadCredential(hash, password);
      if (credential) {
        setLoadedCredential(credential);
        setLoadError(null);
        setPassword('');
        setShowSuccess(true);
        // Auto-hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setLoadError('Failed to load credential');
        setLoadedCredential(null);
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load credential');
      setLoadedCredential(null);
    } finally {
      setLoadingCredential(false);
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
                ⚠️ Please initialize RLN before loading credentials
              </p>
            </div>
          ) : null}

          {/* Loaded Credential Info */}
          {loadedCredential && (
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currently Loaded Credential
              </h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Hash:</span>{' '}
                  <code className="break-all">{selectedHash}</code>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Status:</span>{' '}
                  <span className="text-green-600 dark:text-green-400">Active</span>
                </p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                ✓ Credential loaded successfully
              </p>
            </div>
          )}

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
                    className={`p-4 rounded-lg border ${
                      selectedHash === hash 
                        ? 'border-blue-500 dark:border-blue-400' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <code className="text-sm text-gray-600 dark:text-gray-400 break-all">
                          {hash}
                        </code>
                        {selectedHash === hash && (
                          <div className="pt-3 space-y-3">
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter password to load credential"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            {loadError && (
                              <p className="text-sm text-red-600 dark:text-red-400">
                                {loadError}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            if (selectedHash === hash) {
                              setSelectedHash(null);
                              setPassword('');
                              setLoadedCredential(null);
                            } else {
                              setSelectedHash(hash);
                              setPassword('');
                            }
                          }}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                        >
                          {selectedHash === hash ? 'Cancel' : 'Load'}
                        </button>
                        {selectedHash === hash && (
                          <button
                            onClick={() => handleLoadCredential(hash)}
                            disabled={loadingCredential || !isInitialized || !isStarted}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingCredential ? 'Loading...' : 'Confirm'}
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveCredential(hash)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No credentials stored yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 