"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DecryptedCredentials, RLNInstance, RLNLightInstance } from '@waku/rln';
import { useRLNImplementation } from './RLNImplementationContext';

// Define a dummy context for when neither implementation is available
interface RLNContextType {
  rln: RLNInstance | RLNLightInstance | null;
  isInitialized: boolean;
  isStarted: boolean;
  error: string | null;
  initializeRLN: () => Promise<void>;
  registerMembership: (rateLimit: number) => Promise<{ success: boolean; error?: string; credentials?: DecryptedCredentials }>;
  rateMinLimit: number;
  rateMaxLimit: number;
}

// Create a dummy context with default values
const dummyRLNContext: RLNContextType = {
  rln: null,
  isInitialized: false,
  isStarted: false,
  error: 'RLN context not initialized',
  initializeRLN: async () => { throw new Error('RLN context not initialized'); },
  registerMembership: async () => ({ success: false, error: 'RLN context not initialized' }),
  rateMinLimit: 20,
  rateMaxLimit: 600
};

// Create a context to store the selected RLN implementation
const UnifiedRLNContext = createContext<RLNContextType>(dummyRLNContext);

// Create a provider component that will fetch the appropriate implementation
export function UnifiedRLNProvider({ children }: { children: ReactNode }) {
  const { implementation } = useRLNImplementation();
  const [contextValue, setContextValue] = useState<RLNContextType>(dummyRLNContext);
  
  useEffect(() => {
    // This effect will run when the implementation changes
    // We'll dynamically import the appropriate context module
    const fetchContext = async () => {
      try {
        if (implementation === 'standard') {
          // Import the standard RLN hook
          const standardModule = await import('./RLNContext');
          const { useRLN: useStandardRLN } = standardModule;
          
          // Create a temporary component to access the context
          function TempComponent() {
            const context = useStandardRLN();
            setContextValue(context);
            return null;
          }
          
          // Render the component within the provider
          const { RLNProvider } = standardModule;
          return <RLNProvider><TempComponent /></RLNProvider>;
        } else {
          // Import the light RLN hook
          const lightModule = await import('./RLNLightContext');
          const { useRLN: useLightRLN } = lightModule;
          
          // Create a temporary component to access the context
          function TempComponent() {
            const context = useLightRLN();
            setContextValue(context);
            return null;
          }
          
          // Render the component within the provider
          const { RLNProvider } = lightModule;
          return <RLNProvider><TempComponent /></RLNProvider>;
        }
      } catch (error) {
        console.error('Error loading RLN context:', error);
      }
    };
    
    fetchContext();
  }, [implementation]);
  
  return (
    <UnifiedRLNContext.Provider value={contextValue}>
      {children}
    </UnifiedRLNContext.Provider>
  );
}

// Create a hook to use the unified RLN context
export function useRLN() {
  return useContext(UnifiedRLNContext);
}
