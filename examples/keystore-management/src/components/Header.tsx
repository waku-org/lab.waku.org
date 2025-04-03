"use client";

import React from 'react';
import { WalletInfo } from './WalletInfo';

export function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-medium text-white">Waku Keystore Management</h1>
        </div>
        <WalletInfo />
      </div>
    </header>
  );
} 