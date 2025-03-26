"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {  DecryptedCredentials, RLNInstance, RLNLightInstance } from '@waku/rln';
import { useWallet } from './WalletContext';
import { ethers } from 'ethers';

// Constants
const SIGNATURE_MESSAGE = "Sign this message to generate your RLN credentials";
const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)"
];

// Linea Sepolia configuration
const LINEA_SEPOLIA_CONFIG = {
  chainId: 59141,
  tokenAddress: '0x185A0015aC462a0aECb81beCc0497b649a64B9ea'
};

interface RLNContextType {
  rln: RLNLightInstance | RLNInstance | null;
  isInitialized: boolean;
  isStarted: boolean;
  error: string | null;
  initializeRLN: () => Promise<void>;
  registerMembership: (rateLimit: number) => Promise<{ success: boolean; error?: string; credentials?: DecryptedCredentials }>;
  rateMinLimit: number;
  rateMaxLimit: number;
}

const RLNContext = createContext<RLNContextType | undefined>(undefined);

export function RLNProvider({ children }: { children: ReactNode }) {
  const { isConnected, signer } = useWallet();
  const [rln, setRln] = useState<RLNLightInstance | RLNInstance | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateMinLimit, setRateMinLimit] = useState(20);
  const [rateMaxLimit, setRateMaxLimit] = useState(600);

  const ensureLineaSepoliaNetwork = async (): Promise<boolean> => {
    try {
      console.log("Current network: unknown", await signer?.getChainId());
      
      // Check if already on Linea Sepolia
      if (await signer?.getChainId() === LINEA_SEPOLIA_CONFIG.chainId) {
        console.log("Already on Linea Sepolia network");
        return true;
      }
      
      // If not on Linea Sepolia, try to switch
      console.log("Not on Linea Sepolia, attempting to switch...");
      
      interface EthereumProvider {
        request: (args: { 
          method: string; 
          params?: unknown[] 
        }) => Promise<unknown>;
      }
      
      // Get the provider from window.ethereum
      const provider = window.ethereum as EthereumProvider | undefined;
      
      if (!provider) {
        console.warn("No Ethereum provider found");
        return false;
      }
      
      try {
        // Request network switch
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${LINEA_SEPOLIA_CONFIG.chainId.toString(16)}` }],
        });
        
        console.log("Successfully switched to Linea Sepolia");
        return true;
      } catch (switchError: unknown) {
        console.error("Error switching network:", switchError);
        return false;
      }
    } catch (err) {
      console.error("Error checking or switching network:", err);
      return false;
    }
  };

  const initializeRLN = async () => {
    console.log("InitializeRLN called. Connected:", isConnected, "Signer available:", !!signer);
    
    try {
      setError(null);
      
      if (!rln) {
        console.log("Creating RLN instance...");
        
        try {
          const rlnInstance = new RLNLightInstance();
          
          console.log("RLN instance created successfully:", !!rlnInstance);
          setRln(rlnInstance);
          
          setIsInitialized(true);
          console.log("isInitialized set to true");
          
          // Update rate limits to match contract requirements
          setRateMinLimit(20);  // Contract minimum (RATE_LIMIT_PARAMS.MIN_RATE)
          setRateMaxLimit(600); // Contract maximum (RATE_LIMIT_PARAMS.MAX_RATE)
        } catch (createErr) {
          console.error("Error creating RLN instance:", createErr);
          throw createErr;
        }
      } else {
        console.log("RLN instance already exists, skipping creation");
      }
      
      // Start RLN if wallet is connected
      if (isConnected && signer && rln && !isStarted) {
        console.log("Starting RLN with signer...");
        try {
          // Initialize with localKeystore if available (just for reference in localStorage)
          const localKeystore = localStorage.getItem("rln-keystore") || "";
          console.log("Local keystore available:", !!localKeystore);
          
          // Start RLN with signer
          await rln.start({ signer });
          
          setIsStarted(true);
          console.log("RLN started successfully, isStarted set to true");
        } catch (startErr) {
          console.error("Error starting RLN:", startErr);
          throw startErr;
        }
      } else {
        console.log("Skipping RLN start because:", {
          isConnected,
          hasSigner: !!signer,
          hasRln: !!rln,
          isAlreadyStarted: isStarted
        });
      }
    } catch (err) {
      console.error('Error in initializeRLN:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize RLN');
    }
  };

  const registerMembership = async (rateLimit: number) => {
    console.log("registerMembership called with rate limit:", rateLimit);
    
    if (!rln || !isStarted) {
      return { success: false, error: 'RLN not initialized or not started' };
    }
    
    if (!signer) {
      return { success: false, error: 'No signer available' };
    }
    
    try {
      // Validate rate limit
      if (rateLimit < rateMinLimit || rateLimit > rateMaxLimit) {
        return { 
          success: false, 
          error: `Rate limit must be between ${rateMinLimit} and ${rateMaxLimit}` 
        };
      }
      
      // Ensure we're on the correct network
      const isOnLineaSepolia = await ensureLineaSepoliaNetwork();
      if (!isOnLineaSepolia) {
        console.warn("Could not switch to Linea Sepolia network. Registration may fail.");
      }
      
      // Get user address and contract address
      const userAddress = await signer.getAddress();
      
      if (!rln.contract || !rln.contract.address) {
        return { success: false, error: "RLN contract address not available. Cannot proceed with registration." };
      }
      
      const contractAddress = rln.contract.address;
      const tokenAddress = LINEA_SEPOLIA_CONFIG.tokenAddress;
      
      // Create token contract instance
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        signer
      );
      
      // Check token balance
      const tokenBalance = await tokenContract.balanceOf(userAddress);
      if (tokenBalance.isZero()) {
        return { success: false, error: "You need tokens to register a membership. Your token balance is zero." };
      }
      
      // Check and approve token allowance if needed
      const currentAllowance = await tokenContract.allowance(userAddress, contractAddress);
      if (currentAllowance.eq(0)) {
        console.log("Requesting token approval...");
        
        // Approve a large amount (max uint256)
        const maxUint256 = ethers.constants.MaxUint256;
        
        try {
          const approveTx = await tokenContract.approve(contractAddress, maxUint256);
          console.log("Approval transaction submitted:", approveTx.hash);
          
          // Wait for the transaction to be mined
          await approveTx.wait(1);
          console.log("Token approval confirmed");
        } catch (approvalErr) {
          console.error("Error during token approval:", approvalErr);
          return { 
            success: false, 
            error: `Failed to approve token: ${approvalErr instanceof Error ? approvalErr.message : String(approvalErr)}` 
          };
        }
      } else {
        console.log("Token allowance already sufficient");
      }
      
      // Generate signature for identity
      const message = `${SIGNATURE_MESSAGE} ${Date.now()}`;
      const signature = await signer.signMessage(message);

      const _credentials = await rln.registerMembership({signature: signature});      
      if (!_credentials) {
        throw new Error("Failed to register membership: No credentials returned");
      }
      if (!_credentials.identity) {
        throw new Error("Failed to register membership: Missing identity information");
      }
      if (!_credentials.membership) {
        throw new Error("Failed to register membership: Missing membership information");
      }
      
      return { success: true, credentials: _credentials };
    } catch (err) {      
      let errorMsg = "Failed to register membership";
      if (err instanceof Error) {
        errorMsg = err.message;
      }
      
      return { success: false, error: errorMsg };
    }
  };

  // Initialize RLN when wallet connects
  useEffect(() => {
    console.log("Wallet connection state changed:", { isConnected, hasSigner: !!signer });
    if (isConnected && signer) {
      console.log("Wallet connected, attempting to initialize RLN");
      initializeRLN();
    } else {
      console.log("Wallet not connected or no signer available, skipping RLN initialization");
    }
  }, [isConnected, signer]);

  // Debug log for state changes
  useEffect(() => {
    console.log("RLN Context state:", { 
      isInitialized, 
      isStarted,
      hasRln: !!rln,
      error 
    });
  }, [isInitialized, isStarted, rln, error]);

  return (
    <RLNContext.Provider
      value={{
        rln,
        isInitialized,
        isStarted,
        error,
        initializeRLN,
        registerMembership,
        rateMinLimit,
        rateMaxLimit
      }}
    >
      {children}
    </RLNContext.Provider>
  );
}

export function useRLN() {
  const context = useContext(RLNContext);
  if (context === undefined) {
    throw new Error('useRLN must be used within an RLNProvider');
  }
  return context;
} 