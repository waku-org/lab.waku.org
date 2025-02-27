"use client";

import React from 'react';
import { WalletInfo } from './WalletInfo';

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Waku Keystore Management</h1>
        </div>
        <div className="w-80">
          <WalletInfo />
        </div>
      </div>
    </header>
  );
} 