"use client";

import { useEffect, useState } from 'react';
import { useRLN } from '../contexts/RLNContext';
import { useWallet } from '../contexts/WalletContext';
import { DecryptedCredentials, IdentityCredential } from '@waku/rln';
import { usePasskey } from '@/contexts/usePasskey';

export default function RLNMembershipRegistration() {
  const { registerMembership, isInitialized, isStarted, rateMinLimit, rateMaxLimit, error, initializeRLN, rln } = useRLN();
  const { isConnected, address, chainId } = useWallet();
  const { createPasskey, hasPasskey, getPasskey, getPasskeyCredential } = usePasskey();

  const [identity, setIdentity] = useState<IdentityCredential>();

  const [rateLimit, setRateLimit] = useState<number>(rateMinLimit);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<{
    success?: boolean;
    error?: string;
    txHash?: string;
    warning?: string;
    credentials?: DecryptedCredentials;
  }>({});

  const handleReadPasskey = () => {
    if (rln && hasPasskey()) {
      const seed = getPasskey();
      getPasskeyCredential(seed!);
      const _identity = rln.zerokit.generateSeededIdentityCredential(seed!);
      console.log(_identity);
      setIdentity(_identity);
    }
  };

  console.log(identity);
  const isLineaSepolia = chainId === 59141;

  const handleRateLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setRateLimit(isNaN(value) ? rateMinLimit : value);
  };

  const handleInitializeRLN = async () => {
    setIsInitializing(true);
    try {
      await initializeRLN();
    } catch (err) {
      console.error("Error initializing RLN:", err);
    } finally {
      setIsInitializing(false);
    }
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
    
    setIsRegistering(true);
    setRegistrationResult({});
    
    try {
      setRegistrationResult({ 
        success: undefined, 
        warning: 'Please check your wallet to sign the registration message.' 
      });
      
      const result = await registerMembership(rateLimit, createPasskey);
      setRegistrationResult({
        ...result,
        credentials: result.credentials
      });
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        RLN Membership Registration
      </h2>
      
      {/* Network Warning */}
      {isConnected && !isLineaSepolia && (
        <div className="mb-4 bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
          <p className="text-sm text-orange-700 dark:text-orange-400">
            <strong>Warning:</strong> You are not connected to Linea Sepolia network. Please switch networks to register.
          </p>
        </div>
      )}
      
      {/* Informational Box */}
      <div className="mb-6 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
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
      
      {/* Initialization Status */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              RLN Status: 
              <span className={isInitialized && isStarted ? "text-green-600 ml-2" : "text-amber-600 ml-2"}>
                {isInitialized && isStarted ? "Ready" : "Not Initialized"}
              </span>
            </p>
          </div>
          {isConnected && (!isInitialized || !isStarted) && (
            <button
              onClick={handleInitializeRLN}
              disabled={isInitializing || !isLineaSepolia}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                isInitializing 
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed" 
                  : isLineaSepolia
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              {isInitializing ? "Initializing..." : "Initialize RLN"}
            </button>
          )}
          <button
              onClick={handleReadPasskey}
              disabled={isInitializing || !isLineaSepolia}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                isInitializing 
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed" 
                  : isLineaSepolia
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              Read RLN from passkey
            </button>
        </div>
        {error && (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        )}
      </div>
      
      {isInitialized && !isStarted && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            <strong>Note:</strong> RLN is partially initialized. You can still proceed with registration, but some advanced features might be limited.
          </p>
        </div>
      )}
      
      {!isConnected ? (
        <div className="text-amber-600 dark:text-amber-400 mb-4">
          Please connect your wallet to register a membership
        </div>
      ) : !isInitialized || !isStarted ? (
        <div className="text-amber-600 dark:text-amber-400 mb-4">
          Please initialize RLN before registering a membership
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="rateLimit" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Rate Limit (messages per epoch)
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="rateLimit"
                  name="rateLimit"
                  min={rateMinLimit}
                  max={rateMaxLimit}
                  value={rateLimit}
                  onChange={handleRateLimitChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <span className="ml-3 w-12 text-gray-700 dark:text-gray-300">{rateLimit}</span>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Select a rate limit between {rateMinLimit} and {rateMaxLimit}
              </p>
            </div>
            
            {address && (
              <div className="text-sm text-gray-600 dark:text-gray-400 p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                <p className="font-medium mb-1">Registration Details:</p>
                <p>Connected Address: {address.slice(0, 8)}...{address.slice(-6)}</p>
                <p className="mt-1">When you register, your wallet will sign a secure message containing a random nonce. This signature will be used to generate your RLN credentials without exposing your private key.</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isRegistering || !isInitialized || !isStarted}
              className={`w-full py-2 px-4 rounded-md text-white font-medium 
                ${isRegistering || !isInitialized || !isStarted
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
            >
              {isRegistering ? 'Registering...' : 'Register Membership'}
            </button>
          </form>
          
          {registrationResult.warning && registrationResult.success === undefined && (
            <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
              <p className="font-medium">Important:</p>
              <p className="text-sm mt-1">{registrationResult.warning}</p>
              <div className="text-sm mt-1">
                You&apos;ll need to sign a message with your wallet to complete the registration.
              </div>
            </div>
          )}

{identity && (
                <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <p className="font-medium mb-2">Your RLN Credentials:</p>
                  <div className="text-xs font-mono overflow-auto">
                    <h4 className="font-semibold mt-2 mb-1">Identity:</h4>
                    <p className="mb-1">
                      <span className="font-semibold">ID Commitment:</span> {Buffer.from(identity.IDCommitment).toString('hex')}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">ID Secret Hash:</span> {Buffer.from(identity.IDSecretHash).toString('hex')}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">ID Nullifier:</span> {Buffer.from(identity.IDNullifier).toString('hex')}
                    </p>
                    <p className="mb-3">
                      <span className="font-semibold">ID Trapdoor:</span> {Buffer.from(identity.IDTrapdoor).toString('hex')}
                    </p>
                    
                    {/* <h4 className="font-semibold mt-3 mb-1">Membership:</h4>
                    <p className="mb-1">
                      <span className="font-semibold">Chain ID:</span> {registrationResult.credentials.membership.chainId}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">Contract Address:</span> {registrationResult.credentials.membership.address}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">Tree Index:</span> {registrationResult.credentials.membership.treeIndex}
                    </p> */}
                  </div>
                  <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                    These credentials are your proof of membership. Store them securely.
                  </p>
                </div>
              )}
          
          {registrationResult.success === true && (
            <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
              <p className="font-medium">Registration submitted!</p>
              {registrationResult.txHash && (
                <div>
                  <p className="text-sm mt-1 break-all">
                    {registrationResult.txHash}
                  </p>
                  {registrationResult.txHash.startsWith('0x') && (
                    <p className="mt-2">
                      <a 
                        href={`https://sepolia.lineascan.build/tx/${registrationResult.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 underline"
                      >
                        View on Linea Sepolia Explorer
                      </a>
                    </p>
                  )}
                </div>
              )}
              {registrationResult.warning && (
                <p className="text-sm mt-2 text-yellow-600 dark:text-yellow-300">
                  <strong>Note:</strong> {registrationResult.warning}
                </p>
              )}
              <p className="text-sm mt-2">
                Your RLN membership is now registered and can be used with your Waku node.
              </p>
              
              {(registrationResult.credentials) && (
                <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <p className="font-medium mb-2">Your RLN Credentials:</p>
                  <div className="text-xs font-mono overflow-auto">
                    <h4 className="font-semibold mt-2 mb-1">Identity:</h4>
                    <p className="mb-1">
                      <span className="font-semibold">ID Commitment:</span> {Buffer.from(registrationResult.credentials.identity.IDCommitment).toString('hex')}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">ID Secret Hash:</span> {Buffer.from(registrationResult.credentials.identity.IDSecretHash).toString('hex')}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">ID Nullifier:</span> {Buffer.from(registrationResult.credentials.identity.IDNullifier).toString('hex')}
                    </p>
                    <p className="mb-3">
                      <span className="font-semibold">ID Trapdoor:</span> {Buffer.from(registrationResult.credentials.identity.IDTrapdoor).toString('hex')}
                    </p>
                    
                    {/* <h4 className="font-semibold mt-3 mb-1">Membership:</h4>
                    <p className="mb-1">
                      <span className="font-semibold">Chain ID:</span> {registrationResult.credentials.membership.chainId}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">Contract Address:</span> {registrationResult.credentials.membership.address}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">Tree Index:</span> {registrationResult.credentials.membership.treeIndex}
                    </p> */}
                  </div>
                  <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                    These credentials are your proof of membership. Store them securely.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {registrationResult.success === false && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
              <p className="font-medium">Registration failed</p>
              <p className="text-sm mt-1">{registrationResult.error}</p>
              {registrationResult.error?.includes("field") && (
                <div className="mt-2 text-sm">
                  <p>
                    This is a mathematical constraint in the zero-knowledge proof system.
                    Your wallet&apos;s signatures produce values that aren&apos;t compatible with the RLN cryptographic system.
                  </p>
                  <p className="mt-2 font-medium">Recommended solution:</p>
                  <p>Please try using a different wallet address for registration. Different wallet addresses 
                  generate different signatures, and some are more compatible with the RLN cryptographic system.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
      
      {/* Debug Info (For Development) */}
      <div className="mt-6 p-3 border border-gray-200 dark:border-gray-700 rounded text-xs">
        <p className="font-semibold">Debug Info:</p>
        <p>Wallet Connected: {isConnected ? "Yes" : "No"}</p>
        <p>RLN Initialized: {isInitialized ? "Yes" : "No"}</p>
        <p>RLN Started: {isStarted ? "Yes" : "No"}</p>
        <p>Min Rate: {rateMinLimit}, Max Rate: {rateMaxLimit}</p>
      </div>
    </div>
  );
} 