"use client";

import React, { useState, useEffect } from 'react';
import { RLNInitButton } from '../../RLNInitButton';
import { RLNImplementationToggle } from '../../RLNImplementationToggle';
import { useAppState } from '../../../contexts/AppStateContext';
import { useRLN } from '../../../contexts/rln';
import { useWallet } from '../../../contexts/wallet';
import { KeystoreEntity } from '@waku/rln';

export function MembershipRegistration() {
  const { setGlobalError } = useAppState();
  const { registerMembership, isInitialized, isStarted, rateMinLimit, rateMaxLimit, error } = useRLN();
  const { isConnected, chainId } = useWallet();

  const [rateLimit, setRateLimit] = useState<number>(rateMinLimit);
  const [isRegistering, setIsRegistering] = useState(false);
  const [saveToKeystore, setSaveToKeystore] = useState(true);
  const [keystorePassword, setKeystorePassword] = useState('');
  const [registrationResult, setRegistrationResult] = useState<{
    success?: boolean;
    error?: string;
    txHash?: string;
    warning?: string;
    credentials?: KeystoreEntity;
    keystoreHash?: string;
  }>({});

  const isLineaSepolia = chainId === 59141;

  useEffect(() => {
    if (error) {
      setGlobalError(error);
    }
  }, [error, setGlobalError]);

  const handleRateLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setRateLimit(isNaN(value) ? rateMinLimit : value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setRegistrationResult({ success: false, error: 'Please connect your wallet first' });
      return;
    }
    
    if (!isInitialized || !isStarted) {
      setRegistrationResult({ success: false, error: 'RLN is not initialized' });
      return;
    }
    
    if (!isLineaSepolia) {
      setRegistrationResult({ success: false, error: 'Please switch to Linea Sepolia network' });
      return;
    }
    
    // Validate keystore password if saving to keystore
    if (saveToKeystore && keystorePassword.length < 8) {
      setRegistrationResult({ 
        success: false, 
        error: 'Keystore password must be at least 8 characters long' 
      });
      return;
    }
    
    setIsRegistering(true);
    setRegistrationResult({});
    
    try {
      setRegistrationResult({ 
        success: undefined, 
        warning: 'Please check your wallet to sign the registration message.' 
      });
      
      // Pass save options if saving to keystore
      const saveOptions = saveToKeystore ? { password: keystorePassword } : undefined;
      
      const result = await registerMembership(rateLimit, saveOptions);
      
      setRegistrationResult({
        ...result,
        credentials: result.credentials
      });
      
      // Clear password field after successful registration
      if (result.success) {
        setKeystorePassword('');
      }
    } catch (error) {
      setRegistrationResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          RLN Membership Registration
        </h2>
        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <RLNImplementationToggle />
          </div>

          {/* Network Warning */}
          {isConnected && !isLineaSepolia && (
            <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
              <p className="text-sm text-orange-700 dark:text-orange-400">
                <strong>Warning:</strong> You are not connected to Linea Sepolia network. Please switch networks to register.
              </p>
            </div>
          )}
          
          {/* Informational Box */}
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <h3 className="text-md font-semibold text-blue-800 dark:text-blue-300 mb-2">
              About RLN Membership on Linea Sepolia
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
              RLN (Rate Limiting Nullifier) membership allows you to participate in Waku RLN Relay with rate limiting protection,
              without exposing your private keys on your node.
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
              This application is configured to use the <strong>Linea Sepolia</strong> testnet for RLN registrations.
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              When you register, your wallet will sign a message that will be used to generate a cryptographic identity
              for your membership. This allows your node to prove it has permission to send messages without revealing your identity.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <RLNInitButton />
            {isInitialized && isStarted && (
              <span className="text-sm text-green-600 dark:text-green-400">
                ✓ RLN Initialized
              </span>
            )}
          </div>

          {!isConnected ? (
            <div className="text-amber-600 dark:text-amber-400">
              Please connect your wallet to register a membership
            </div>
          ) : !isInitialized || !isStarted ? (
            <div className="text-amber-600 dark:text-amber-400">
              Please initialize RLN before registering a membership
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label 
                  htmlFor="rateLimit" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Rate Limit (messages per epoch)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    id="rateLimit"
                    name="rateLimit"
                    min={rateMinLimit}
                    max={rateMaxLimit}
                    value={rateLimit}
                    onChange={handleRateLimitChange}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                    {rateLimit}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="saveToKeystore"
                    checked={saveToKeystore}
                    onChange={(e) => setSaveToKeystore(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label
                    htmlFor="saveToKeystore"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Save credentials to keystore
                  </label>
                </div>
                {saveToKeystore && (
                  <div>
                    <label
                      htmlFor="keystorePassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Keystore Password (min 8 characters)
                    </label>
                    <input
                      type="password"
                      id="keystorePassword"
                      value={keystorePassword}
                      onChange={(e) => setKeystorePassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Enter password to encrypt credentials"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isRegistering || !isLineaSepolia || (saveToKeystore && !keystorePassword)}
                className={`w-full px-4 py-2 text-sm font-medium rounded-md ${
                  isRegistering || !isLineaSepolia || (saveToKeystore && !keystorePassword)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isRegistering ? 'Registering...' : 'Register Membership'}
              </button>
            </form>
          )}

          {/* Registration Result */}
          {registrationResult.warning && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                {registrationResult.warning}
              </p>
            </div>
          )}
          {registrationResult.error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">
                {registrationResult.error}
              </p>
            </div>
          )}
          {registrationResult.success && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-400 mb-2">
                ✓ Membership registered successfully!
              </p>
              {registrationResult.txHash && (
                <p className="text-xs text-green-600 dark:text-green-500">
                  Transaction Hash: {registrationResult.txHash}
                </p>
              )}
              {registrationResult.keystoreHash && (
                <p className="text-xs text-green-600 dark:text-green-500">
                  Credentials saved to keystore with hash: {registrationResult.keystoreHash}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 