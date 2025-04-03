"use client";

import React, { useState, useEffect } from 'react';
import { RLNImplementationToggle } from '../../RLNImplementationToggle';
import { KeystoreEntity } from '@waku/rln';
import { useAppState } from '../../../contexts/AppStateContext';
import { useRLN } from '../../../contexts/rln/RLNContext';
import { useWallet } from '../../../contexts/wallet';
import { RLNInitButton } from '../../RLNinitButton';
import { TerminalWindow } from '../../ui/terminal-window';
import { Slider } from '../../ui/slider';
import { Button } from '../../ui/button';

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
    <div className="space-y-6 max-w-full">
      <TerminalWindow className="w-full">
        <h2 className="text-lg font-mono font-medium text-primary mb-4 cursor-blink">
          RLN Membership Registration
        </h2>
        <div className="space-y-6">
          <div className="border-b border-terminal-border pb-6">
            <RLNImplementationToggle />
          </div>

          {/* Network Warning */}
          {isConnected && !isLineaSepolia && (
            <div className="mb-4 p-3 border border-destructive/20 bg-destructive/5 rounded">
              <p className="text-sm text-destructive font-mono flex items-center">
                <span className="mr-2">⚠️</span>
                <span>You are not connected to Linea Sepolia network. Please switch networks to register.</span>
              </p>
            </div>
          )}
          
          {/* Informational Box - Now part of main terminal */}
          <div className="border-t border-terminal-border pt-4 mt-4">
            <div className="flex items-center mb-3">
              <span className="text-primary font-mono font-medium mr-2">{">"}</span>
              <h3 className="text-md font-mono font-semibold text-primary">
                RLN Membership Info
              </h3>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-md font-mono font-semibold text-primary cursor-blink">
                About RLN Membership on Linea Sepolia
              </h4>
              <p className="text-sm text-foreground mb-2 opacity-90">
                RLN (Rate Limiting Nullifier) membership allows you to participate in Waku RLN Relay with rate limiting protection,
                without exposing your private keys on your node.
              </p>
              <p className="text-sm text-foreground mb-2 opacity-90">
                This application is configured to use the <span className="text-primary">Linea Sepolia</span> testnet for RLN registrations.
              </p>
              <p className="text-sm text-foreground opacity-90">
                When you register, your wallet will sign a message that will be used to generate a cryptographic identity
                for your membership. This allows your node to prove it has permission to send messages without revealing your identity.
              </p>
            </div>
          </div>

          <div className="border-t border-terminal-border pt-6 mt-4">
            <div className="flex items-center space-x-2">
              <RLNInitButton />
            </div>

            {!isConnected ? (
              <div className="text-warning-DEFAULT font-mono text-sm mt-4 flex items-center">
                <span className="mr-2">ℹ️</span>
                Please connect your wallet to register a membership
              </div>
            ) : !isInitialized || !isStarted ? (
              <div className="text-warning-DEFAULT font-mono text-sm mt-4 flex items-center">
                <span className="mr-2">ℹ️</span>
                Please initialize RLN before registering a membership
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label 
                    htmlFor="rateLimit" 
                    className="block text-sm font-mono text-muted-foreground mb-2"
                  >
                    Rate Limit (messages per epoch)
                  </label>
                  <div className="flex items-center space-x-4 py-2">
                    <Slider
                      id="rateLimit"
                      min={rateMinLimit}
                      max={rateMaxLimit}
                      value={[rateLimit]}
                      onValueChange={(value) => setRateLimit(value[0])}
                      className="w-full"
                    />
                    <span className="text-sm text-muted-foreground w-12 font-mono">
                      {rateLimit}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="saveToKeystore"
                      checked={saveToKeystore}
                      onChange={(e) => setSaveToKeystore(e.target.checked)}
                      className="h-4 w-4 rounded bg-terminal-background border-terminal-border text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="saveToKeystore"
                      className="ml-2 text-sm font-mono text-foreground"
                    >
                      Save credentials to keystore
                    </label>
                  </div>
                  {saveToKeystore && (
                    <div>
                      <label
                        htmlFor="keystorePassword"
                        className="block text-sm font-mono text-muted-foreground mb-1"
                      >
                        Keystore Password (min 8 characters)
                      </label>
                      <input
                        type="password"
                        id="keystorePassword"
                        value={keystorePassword}
                        onChange={(e) => setKeystorePassword(e.target.value)}
                        className="w-full px-3 py-2 border border-terminal-border rounded-md bg-terminal-background text-foreground font-mono focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                        placeholder="Enter password to encrypt credentials"
                      />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isRegistering || !isLineaSepolia || (saveToKeystore && !keystorePassword)}
                  variant={isRegistering ? "outline" : "default"}
                  className="w-full"
                >
                  {isRegistering ? 'Registering...' : 'Register Membership'}
                </Button>
              </form>
            )}
          </div>

          {/* Registration Result */}
          {registrationResult.warning && (
            <div className="mt-4 p-3 border border-warning-DEFAULT/20 bg-warning-DEFAULT/5 rounded">
              <p className="text-sm text-warning-DEFAULT font-mono flex items-center">
                <span className="mr-2">⚠️</span>
                {registrationResult.warning}
              </p>
            </div>
          )}
          {registrationResult.error && (
            <div className="mt-4 p-3 border border-destructive/20 bg-destructive/5 rounded">
              <p className="text-sm text-destructive font-mono flex items-center">
                <span className="mr-2">⚠️</span>
                {registrationResult.error}
              </p>
            </div>
          )}
          {registrationResult.success && (
            <div className="mt-4 p-3 border border-success-DEFAULT/20 bg-success-DEFAULT/5 rounded">
              <p className="text-sm text-success-DEFAULT font-mono mb-2 flex items-center">
                <span className="mr-2">✓</span>
                Membership registered successfully!
              </p>
              {registrationResult.txHash && (
                <p className="text-xs text-success-DEFAULT font-mono opacity-80 break-all">
                  Transaction Hash: {registrationResult.txHash}
                </p>
              )}
            </div>
          )}
        </div>
      </TerminalWindow>
    </div>
  );
} 