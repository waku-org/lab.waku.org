"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { KeystoreEntity } from '@waku/rln';
import { UnifiedRLNInstance } from './RLNFactory';
import { useRLNImplementation } from './RLNImplementationContext';
import { createRLNImplementation } from './RLNFactory';
import { ethers } from 'ethers';

// Constants for RLN membership registration
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

// Define the context type
interface RLNContextType {
  rln: UnifiedRLNInstance | null;
  isInitialized: boolean;
  isStarted: boolean;
  error: string | null;
  initializeRLN: () => Promise<void>;
  registerMembership: (rateLimit: number) => Promise<{ success: boolean; error?: string; credentials?: KeystoreEntity }>;
  rateMinLimit: number;
  rateMaxLimit: number;
  getCurrentRateLimit: () => Promise<number | null>;
  getRateLimitsBounds: () => Promise<{ success: boolean; rateMinLimit: number; rateMaxLimit: number; error?: string }>;
}

// Create the context
const RLNUnifiedContext = createContext<RLNContextType | undefined>(undefined);

// Create the provider component
export function RLNUnifiedProvider({ children }: { children: ReactNode }) {
  const { implementation } = useRLNImplementation();
  const [rln, setRln] = useState<UnifiedRLNInstance | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get the signer from window.ethereum
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [rateMinLimit, setRateMinLimit] = useState<number>(0);
  const [rateMaxLimit, setRateMaxLimit] = useState<number>(0);
  
  // Listen for wallet connection
  useEffect(() => {
    const checkWallet = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const signer = provider.getSigner();
            setSigner(signer);
            setIsConnected(true);
            return;
          }
        }
        
        setSigner(null);
        setIsConnected(false);
      } catch (err) {
        console.error("Error checking wallet:", err);
        setSigner(null);
        setIsConnected(false);
      }
    };
    
    checkWallet();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', checkWallet);
      window.ethereum.on('chainChanged', checkWallet);
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', checkWallet);
        window.ethereum.removeListener('chainChanged', checkWallet);
      }
    };
  }, []);
  
  // Reset RLN state when implementation changes
  useEffect(() => {
    setRln(null);
    setIsInitialized(false);
    setIsStarted(false);
    setError(null);
  }, [implementation]);
  
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
        console.log(`Creating RLN ${implementation} instance...`);
        
        try {
          // Use our factory to create the appropriate implementation
          const rlnInstance = await createRLNImplementation(implementation);
          
          console.log("RLN instance created successfully:", !!rlnInstance);
          setRln(rlnInstance);
          
          setIsInitialized(true);
          console.log("isInitialized set to true");
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

          // Fetch rate limits after RLN is started
          try {
            const minLimit = await rln.contract.getMinRateLimit();
            const maxLimit = await rln.contract.getMaxRateLimit();
            setRateMinLimit(minLimit);
            setRateMaxLimit(maxLimit);
            console.log("Rate limits fetched:", { min: minLimit, max: maxLimit });
          } catch (limitErr) {
            console.warn("Could not fetch rate limits:", limitErr);
          }
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

  const getCurrentRateLimit = async (): Promise<number | null> => {
    try {
      if (!rln || !rln.contract || !isStarted) {
        console.log("Cannot get rate limit: RLN not initialized or started");
        return null;
      }
      
      const rateLimit = rln.contract.getRateLimit();
      console.log("Current rate limit:", rateLimit);
      return rateLimit;
    } catch (err) {
      console.error("Error getting current rate limit:", err);
      return null;
    }
  };

  const getRateLimitsBounds = async () => {
    try {
      if (!rln || !isStarted) {
        return { 
          success: false, 
          rateMinLimit: 0, 
          rateMaxLimit: 0, 
          error: 'RLN not initialized or not started' 
        };
      }
      const minLimit = await rln.contract.getMinRateLimit();
      const maxLimit = await rln.contract.getMaxRateLimit();
      
      // Update state
      setRateMinLimit(minLimit);
      setRateMaxLimit(maxLimit);
      
      return { 
        success: true, 
        rateMinLimit: minLimit, 
        rateMaxLimit: maxLimit 
      };
    } catch (error) {
      console.error("Error getting rate limits bounds:", error);
      return { 
        success: false, 
        rateMinLimit: 0, 
        rateMaxLimit: 0, 
        error: 'Failed to get rate limits bounds' 
      };
    }
  }

  const registerMembership = async (rateLimit: number) => {
    console.log("registerMembership called with rate limit:", rateLimit);
    
    if (!rln || !isStarted) {
      return { success: false, error: 'RLN not initialized or not started' };
    }
    
    if (!signer) {
      return { success: false, error: 'No signer available' };
    }
    
    try {
      console.log("im here")
      const rateMinLimit = await rln.contract.getMinRateLimit();
      const rateMaxLimit = await rln.contract.getMaxRateLimit();
      console.log({
        rateMinLimit,
        rateMaxLimit
      })
      // Validate rate limit
      if (rateLimit < rateMinLimit || rateLimit > rateMaxLimit) {
        return { 
          success: false, 
          error: `Rate limit must be between ${rateMinLimit} and ${rateMaxLimit}` 
        };
      }
      rln.contract.setRateLimit(rateLimit);
      console.log("Rate limit set to:", rateLimit);
      
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
      // Get membership fee - implementation may differ between standard and light
      const membershipFee = await rln.contract.membershipFee?.() || ethers.utils.parseEther("0.01");
      
      if (currentAllowance.lt(membershipFee)) {
        console.log("Approving token allowance...");
        
        try {
          const approveTx = await tokenContract.approve(contractAddress, membershipFee);
          await approveTx.wait();
          console.log("Token allowance approved");
        } catch (approveErr) {
          console.error("Error approving token allowance:", approveErr);
          return { success: false, error: "Failed to approve token allowance for membership registration." };
        }
      } else {
        console.log("Token allowance already sufficient");
      }
      
      // Register membership
      console.log("Registering membership with rate limit:", rateLimit);
      
      try {
        // Both implementations use registerMembership with a signature
        // Generate signature for identity
        const message = `Sign this message to generate your RLN credentials ${Date.now()}`;
        const signature = await signer.signMessage(message);
        
        // Call registerMembership with the signature
        const credentials = await rln.registerMembership({
          signature: signature
        }) as unknown as KeystoreEntity;
        
        // Validate credentials
        if (!credentials) {
          throw new Error("Failed to register membership: No credentials returned");
        }
        if (!credentials.identity) {
          throw new Error("Failed to register membership: Missing identity information");
        }
        if (!credentials.membership) {
          throw new Error("Failed to register membership: Missing membership information");
        }
        
        console.log("Membership registered successfully");
        
        // Store credentials in localStorage for reference
        try {
          localStorage.setItem("rln-keystore", JSON.stringify(credentials));
        } catch (storageErr) {
          console.warn("Could not store credentials in localStorage:", storageErr);
        }
        
        return { 
          success: true, 
          credentials: credentials
        };
      } catch (registerErr) {
        console.error("Error registering membership:", registerErr);
        return { 
          success: false, 
          error: registerErr instanceof Error ? registerErr.message : "Failed to register membership" 
        };
      }
    } catch (err) {
      console.error("Error in registerMembership:", err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : "An unknown error occurred during registration" 
      };
    }
  };

  // Create the context value
  const contextValue: RLNContextType = {
    rln,
    isInitialized,
    isStarted,
    error,
    initializeRLN,
    registerMembership,
    getCurrentRateLimit,
    getRateLimitsBounds,
    rateMinLimit,
    rateMaxLimit
  };

  return (
    <RLNUnifiedContext.Provider value={contextValue}>
      {children}
    </RLNUnifiedContext.Provider>
  );
}

// Create a hook to use the context
export function useRLN() {
  const context = useContext(RLNUnifiedContext);
  if (context === undefined) {
    throw new Error('useRLN must be used within a RLNUnifiedProvider');
  }
  return context;
}

