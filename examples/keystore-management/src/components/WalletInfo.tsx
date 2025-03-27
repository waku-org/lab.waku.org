"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '../contexts/index';

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Function to switch to Linea Sepolia network
  const switchToLineaSepolia = async () => {
    if (!window.ethereum) {
      console.error("MetaMask not installed");
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: LINEA_SEPOLIA_CHAIN_ID }],
      });
    } catch (err) {
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

  if (!isConnected) {
    return (
      <div className="flex items-center">
        <button
          onClick={connectWallet}
          className="h-7 px-3 text-xs bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {error && (
        <div className="absolute right-0 -top-2 transform -translate-y-full mb-2 px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded whitespace-nowrap">
          <p>{error}</p>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 h-8 rounded transition-colors ${
          isOpen ? 'bg-gray-800' : 'hover:bg-gray-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-gray-300 truncate max-w-[140px]">
            {address}
          </span>
          <span className="font-mono text-xs text-gray-400">
            {balance ? `${parseFloat(balance).toFixed(4)} ETH` : 'Loading...'}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-lg bg-gray-800 shadow-lg border border-gray-700 overflow-hidden">
          <div className="p-3">
            <div className="flex flex-col gap-2 text-gray-300">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-400">Address:</span>
                <span className="font-mono text-xs truncate">{address}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-400">Network:</span>
                <span className={`font-mono text-xs ${isUnsupportedNetwork ? 'text-orange-400' : ''}`}>
                  {getNetworkName(chainId)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-400">Balance:</span>
                <span className="font-mono text-xs">
                  {balance ? `${parseFloat(balance).toFixed(4)} ETH` : 'Loading...'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 p-2 flex flex-col gap-2">
            {isUnsupportedNetwork && (
              <button
                onClick={switchToLineaSepolia}
                className="w-full h-7 px-3 text-xs bg-orange-500/20 text-orange-300 rounded hover:bg-orange-500/30 transition-colors"
              >
                Switch to Linea Sepolia
              </button>
            )}
            <button
              onClick={disconnectWallet}
              className="w-full h-7 px-3 text-xs bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 