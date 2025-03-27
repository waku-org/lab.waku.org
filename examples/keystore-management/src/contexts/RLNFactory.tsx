"use client";

import { createRLN, MembershipInfo, RLNLightInstance } from '@waku/rln';
import { ethers } from 'ethers';

// Define a unified interface that both implementations must support
export interface UnifiedRLNInstance {
  contract: {
    address: string;
    membershipFee?: () => Promise<ethers.BigNumber>;
    getRateLimit: () => number;
    getMinRateLimit: () => Promise<number>;
    getMaxRateLimit: () => Promise<number>;
    getMaxTotalRateLimit: () => Promise<number>;
    getCurrentTotalRateLimit: () => Promise<number>;
    getRemainingTotalRateLimit: () => Promise<number>;
    setRateLimit: (newRateLimit: number) => Promise<void>;
    getRemainingMessages: (membershipId: number) => Promise<number>;
    getMembershipInfo: (idCommitment: string) => Promise<MembershipInfo | undefined>;
    extendMembership: (idCommitment: string) => Promise<ethers.ContractTransaction>;
    eraseMembership: (idCommitment: string, eraseFromMembershipSet?: boolean) => Promise<ethers.ContractTransaction>;
    registerMembership: (idCommitment: string, rateLimit?: number) => Promise<ethers.ContractTransaction>;
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
