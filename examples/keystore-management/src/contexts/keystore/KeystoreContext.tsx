"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Keystore, KeystoreEntity } from '@waku/rln';

// Define types for the context
interface KeystoreContextType {
  keystore: Keystore | null;
  isInitialized: boolean;
  error: string | null;
  hasStoredCredentials: boolean;
  storedCredentialsHashes: string[];
  saveCredentials: (credentials: KeystoreEntity, password: string) => Promise<string>;
  exportCredential: (hash: string, password: string) => Promise<string>;
  importKeystore: (keystoreJson: string) => boolean;
  removeCredential: (hash: string) => void;
}

// Create the context
const KeystoreContext = createContext<KeystoreContextType | undefined>(undefined);

// Provider component
export function KeystoreProvider({ children }: { children: ReactNode }) {
  const [keystore, setKeystore] = useState<Keystore | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storedCredentialsHashes, setStoredCredentialsHashes] = useState<string[]>([]);

  // Initialize keystore
  useEffect(() => {
    try {
      const storedKeystore = localStorage.getItem('waku-rln-keystore');
      let keystoreInstance: Keystore;

      if (storedKeystore) {
        const loaded = Keystore.fromString(storedKeystore);
        if (loaded) {
          keystoreInstance = loaded;
        } else {
          keystoreInstance = Keystore.create();
        }
      } else {
        keystoreInstance = Keystore.create();
      }

      setKeystore(keystoreInstance);
      setStoredCredentialsHashes(keystoreInstance.keys());
      setIsInitialized(true);
    } catch (err) {
      console.error("Error initializing keystore:", err);
      setError(err instanceof Error ? err.message : "Failed to initialize keystore");
    }
  }, []);

  // Save keystore to localStorage whenever it changes
  useEffect(() => {
    if (keystore && isInitialized) {
      try {
        localStorage.setItem('waku-rln-keystore', keystore.toString());
      } catch (err) {
        console.warn("Could not save keystore to localStorage:", err);
      }
    }
  }, [keystore, isInitialized]);

  const saveCredentials = async (credentials: KeystoreEntity, password: string): Promise<string> => {
    if (!keystore) {
      throw new Error("Keystore not initialized");
    }

    try {
      const hash = await keystore.addCredential(credentials, password);
      
      localStorage.setItem('waku-rln-keystore', keystore.toString());
      
      setStoredCredentialsHashes(keystore.keys());
      
      return hash;
    } catch (err) {
      console.error("Error saving credentials:", err);
      throw err;
    }
  };

  const exportCredential = async (hash: string, password: string): Promise<string> => {
    if (!keystore) {
      throw new Error("Keystore not initialized");
    }

    // Create a new keystore instance for the single credential
    const singleCredentialKeystore = Keystore.create();
    
    // Get the credential from the main keystore
    const credential = await keystore.readCredential(hash, password);
    if (!credential) {
      throw new Error("Credential not found");
    }
    
    // Add the credential to the new keystore
    await singleCredentialKeystore.addCredential(credential, password);
    console.log("Single credential keystore:", singleCredentialKeystore.toString());
    return singleCredentialKeystore.toString();
  };

  const importKeystore = (keystoreJson: string): boolean => {
    try {
      const imported = Keystore.fromString(keystoreJson);
      if (imported) {
        setKeystore(imported);
        setStoredCredentialsHashes(imported.keys());
        localStorage.setItem('waku-rln-keystore', keystoreJson);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error importing keystore:", err);
      setError(err instanceof Error ? err.message : "Failed to import keystore");
      return false;
    }
  };

  const removeCredential = (hash: string): void => {
    if (!keystore) {
      throw new Error("Keystore not initialized");
    }

    keystore.removeCredential(hash);
    setStoredCredentialsHashes(keystore.keys());
    localStorage.setItem('waku-rln-keystore', keystore.toString());
  };

  const contextValue: KeystoreContextType = {
    keystore,
    isInitialized,
    error,
    hasStoredCredentials: storedCredentialsHashes.length > 0,
    storedCredentialsHashes,
    saveCredentials,
    exportCredential,
    importKeystore,
    removeCredential
  };

  return (
    <KeystoreContext.Provider value={contextValue}>
      {children}
    </KeystoreContext.Provider>
  );
}

export function useKeystore() {
  const context = useContext(KeystoreContext);
  if (context === undefined) {
    throw new Error('useKeystore must be used within a KeystoreProvider');
  }
  return context;
} 