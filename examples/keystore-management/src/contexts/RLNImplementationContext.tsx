"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the implementation types
export type RLNImplementationType = 'standard' | 'light';

// Define the context type
interface RLNImplementationContextType {
  implementation: RLNImplementationType;
  setImplementation: (implementation: RLNImplementationType) => void;
}

// Create the context
const RLNImplementationContext = createContext<RLNImplementationContextType | undefined>(undefined);

// Create the provider component
export function RLNImplementationProvider({ children }: { children: ReactNode }) {
  const [implementation, setImplementation] = useState<RLNImplementationType>('standard');

  return (
    <RLNImplementationContext.Provider value={{ implementation, setImplementation }}>
      {children}
    </RLNImplementationContext.Provider>
  );
}

// Create a hook to use the context
export function useRLNImplementation() {
  const context = useContext(RLNImplementationContext);
  if (context === undefined) {
    throw new Error('useRLNImplementation must be used within a RLNImplementationProvider');
  }
  return context;
}
