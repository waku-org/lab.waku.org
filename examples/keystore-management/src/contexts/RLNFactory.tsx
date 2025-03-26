"use client";

import { createRLN, RLNLightInstance } from '@waku/rln';
import { ethers } from 'ethers';

// Define a unified interface that both implementations must support
export interface UnifiedRLNInstance {
  contract: {
    address: string;
    membershipFee?: () => Promise<ethers.BigNumber>;
  };
  start: (options: { signer: ethers.Signer }) => Promise<void>;
  // Both implementations use registerMembership but with different parameters
  registerMembership: (options: { signature: string }) => Promise<Record<string, unknown>>;
}

// Define a factory function that creates the appropriate RLN implementation
export async function createRLNImplementation(type: 'standard' | 'light'): Promise<UnifiedRLNInstance> {
  if (type === 'standard') {
    // Create and return the standard RLN implementation
    return await createRLN() as unknown as UnifiedRLNInstance;
  } else {
    // Create and return the light RLN implementation
    return new RLNLightInstance() as unknown as UnifiedRLNInstance;
  }
}
