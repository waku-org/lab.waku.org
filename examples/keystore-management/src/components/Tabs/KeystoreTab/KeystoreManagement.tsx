"use client";

import React, { useState } from 'react';
import { useKeystore } from '@/contexts/keystore';
import { useRLN } from '@/contexts/rln';
import { saveKeystoreToFile, readKeystoreFromFile } from '../../../utils/fileUtils';
import { KeystoreEntity } from '@waku/rln';
import { useAppState } from '@/contexts/AppStateContext';

export function KeystoreManagement() {
  const { 
    hasStoredCredentials, 
    storedCredentialsHashes,
    error,
    exportCredential,
    importKeystore,
    removeCredential,
    getDecryptedCredential
  } = useKeystore();
  const { setGlobalError } = useAppState();
  const { isInitialized, isStarted } = useRLN();
  const [exportPassword, setExportPassword] = useState<string>('');
  const [selectedCredential, setSelectedCredential] = useState<string | null>(null);
  const [viewPassword, setViewPassword] = useState<string>('');
  const [viewingCredential, setViewingCredential] = useState<string | null>(null);
  const [decryptedInfo, setDecryptedInfo] = useState<KeystoreEntity | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  React.useEffect(() => {
    if (error) {
      setGlobalError(error);
    }
  }, [error, setGlobalError]);

  const handleExportCredential = async (hash: string) => {
    try {
      if (!exportPassword) {
        setGlobalError('Please enter your keystore password to export');
        return;
      }
      const keystoreJson = await exportCredential(hash, exportPassword);
      saveKeystoreToFile(keystoreJson, `waku-rln-credential-${hash.slice(0, 8)}.json`);
      setExportPassword('');
      setSelectedCredential(null);
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Failed to export credential');
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

  const handleViewCredential = async (hash: string) => {
    if (!viewPassword) {
      setGlobalError('Please enter your keystore password to view credential');
      return;
    }
    
    setIsDecrypting(true);
    
    try {
      const credential = await getDecryptedCredential(hash, viewPassword);
      setIsDecrypting(false);
      
      if (credential) {
        setDecryptedInfo(credential);
      } else {
        setGlobalError('Could not decrypt credential. Please check your password and try again.');
      }
    } catch (err) {
      setIsDecrypting(false);
      setGlobalError(err instanceof Error ? err.message : 'Failed to decrypt credential');
    }
  };

  // Reset view state when changing credentials
  React.useEffect(() => {
    if (viewingCredential !== selectedCredential) {
      setDecryptedInfo(null);
    }
  }, [viewingCredential, selectedCredential]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Keystore Management
        </h2>
        
        <div className="space-y-6">
          {/* Import Action */}
          <div>
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
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-start justify-between">
                        <code className="text-sm text-gray-600 dark:text-gray-400 break-all">
                          {hash}
                        </code>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setViewingCredential(hash === viewingCredential ? null : hash);
                              setSelectedCredential(null);
                              setViewPassword('');
                              setDecryptedInfo(null);
                            }}
                            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCredential(hash === selectedCredential ? null : hash);
                              setViewingCredential(null);
                              setExportPassword('');
                            }}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Export
                          </button>
                          <button
                            onClick={() => handleRemoveCredential(hash)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      {/* View Credential Section */}
                      {viewingCredential === hash && (
                        <div className="mt-2 space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="password"
                              value={viewPassword}
                              onChange={(e) => setViewPassword(e.target.value)}
                              placeholder="Enter keystore password"
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              disabled={isDecrypting}
                            />
                            <button
                              onClick={() => handleViewCredential(hash)}
                              disabled={!viewPassword || isDecrypting}
                              className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                                !viewPassword || isDecrypting
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                                  : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
                              }`}
                            >
                              {isDecrypting ? 'Decrypting...' : 'Decrypt'}
                            </button>
                          </div>
                          
                          {/* Decrypted Information Display */}
                          {decryptedInfo && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Decrypted Credential Information
                              </h4>
                              <div className="space-y-2">
                                <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-60">
                                  {JSON.stringify(decryptedInfo, null, 2)}
                                </pre>
                                <button
                                  onClick={() => setDecryptedInfo(null)}
                                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                  Hide Details
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Export Credential Section */}
                      {selectedCredential === hash && (
                        <div className="mt-2 space-y-2">
                          <input
                            type="password"
                            value={exportPassword}
                            onChange={(e) => setExportPassword(e.target.value)}
                            placeholder="Enter keystore password"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                          <button
                            onClick={() => handleExportCredential(hash)}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                          >
                            Export Credential
                          </button>
                        </div>
                      )}
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