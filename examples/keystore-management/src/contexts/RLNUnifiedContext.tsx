"use client";

import { ReactNode } from 'react';
import { RLNProvider as StandardRLNProvider } from './RLNZerokitContext';
import { RLNProvider as LightRLNProvider } from './RLNLightContext';
import { useRLNImplementation } from './RLNImplementationContext';

// Create a unified provider that conditionally renders the appropriate provider
export function RLNUnifiedProvider({ children }: { children: ReactNode }) {
  const { implementation } = useRLNImplementation();

  // Render the appropriate provider based on the implementation
  return (
    <>
      {implementation === 'standard' ? (
        <StandardRLNProvider>{children}</StandardRLNProvider>
      ) : (
        <LightRLNProvider>{children}</LightRLNProvider>
      )}
    </>
  );
}

