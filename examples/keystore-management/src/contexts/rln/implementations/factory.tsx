"use client";

import { createRLN, MembershipInfo, RLNLightInstance } from '@waku/rln';
import { ethers } from 'ethers';

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
  registerMembership: (options: { signature: string }) => Promise<Record<string, unknown>>;
}

export async function createRLNImplementation(type: 'standard' | 'light' = 'light'): Promise<UnifiedRLNInstance> {
  if (type === 'standard') {
    return await createRLN() as unknown as UnifiedRLNInstance;
  } else {
    return new RLNLightInstance() as unknown as UnifiedRLNInstance;
  }
} 