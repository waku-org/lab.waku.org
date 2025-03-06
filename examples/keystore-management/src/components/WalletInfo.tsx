"use client";

import React from 'react';
import { useWallet } from '../contexts/WalletContext';

function getNetworkName(chainId: number | null): string {
  if (!chainId) return 'Unknown';
  
  switch (chainId) {
    case 59141: return 'Linea Sepolia (Supported)';
    default: return `Unsupported Network (Chain ID: ${chainId})`;
  }
}

// Linea Sepolia Chain ID
const LINEA_SEPOLIA_CHAIN_ID = '0xe705'; // 59141 in hex

// Define interface for provider errors
interface ProviderRpcError extends Error {
  code: number;
  data?: unknown;
}

export function WalletInfo() {
  const { isConnected, address, balance, chainId, connectWallet, disconnectWallet, error } = useWallet();

  // Function to switch to Linea Sepolia network
  const switchToLineaSepolia = async () => {
    if (!window.ethereum) {
      console.error("MetaMask not installed");
      return;
    }

    try {
      // Try to switch to Linea Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: LINEA_SEPOLIA_CHAIN_ID }],
      });
    } catch (err) {
      // If the error code is 4902, the chain hasn't been added to MetaMask
      const providerError = err as ProviderRpcError;
      if (providerError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: LINEA_SEPOLIA_CHAIN_ID,
                chainName: 'Linea Sepolia Testnet',
                nativeCurrency: {
                  name: 'Linea Sepolia ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://linea-sepolia.infura.io/v3/', 'https://rpc.sepolia.linea.build'],
                blockExplorerUrls: ['https://sepolia.lineascan.build'],
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding Linea Sepolia chain", addError);
        }
      } else {
        console.error("Error switching to Linea Sepolia chain", providerError);
      }
    }
  };

  // Check if user is on unsupported network
  const isUnsupportedNetwork = isConnected && chainId !== 59141;

  return (
    <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800 p-3">
      {error && (
        <div className="mb-2 p-2 text-xs bg-red-100 text-red-700 rounded-md dark:bg-red-900 dark:text-red-100">
          <p>{error}</p>
        </div>
      )}

      {isConnected ? (
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="mr-3">
              <div className="flex items-center mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Address:</span>
                <span className="font-mono text-xs text-gray-900 dark:text-white truncate max-w-[120px]">
                  {address}
                </span>
              </div>
              <div className="flex items-center mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Network:</span>
                <span className={`font-mono text-xs ${isUnsupportedNetwork ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>
                  {getNetworkName(chainId)}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Balance:</span>
                <span className="font-mono text-xs text-gray-900 dark:text-white">
                  {balance ? `${parseFloat(balance).toFixed(4)} ETH` : 'Loading...'}
                </span>
              </div>
            </div>
            <button
              onClick={disconnectWallet}
              className="px-2 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Disconnect
            </button>
          </div>
          
          {isUnsupportedNetwork && (
            <div className="flex flex-col gap-2 mt-1">
              <button
                onClick={switchToLineaSepolia}
                className="w-full px-2 py-1 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Switch to Linea Sepolia
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <button
            onClick={connectWallet}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
} 