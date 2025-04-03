"use client";

import React, { Children, isValidElement } from 'react';
import { TabNavigation, TabItem } from './Tabs/TabNavigation';
import { useAppState } from '../contexts/AppStateContext';

const tabs: TabItem[] = [
  {
    id: 'membership',
    label: 'Membership Registration',
  },
  {
    id: 'keystore',
    label: 'Keystore Management',
  },
];

const componentToTabId: Record<string, string> = {
  MembershipRegistration: 'membership',
  KeystoreManagement: 'keystore',
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { activeTab, setActiveTab } = useAppState();
  const childrenArray = Children.toArray(children);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="container mx-auto px-4 py-6">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="mt-6">
          {childrenArray.map((child) => {
            if (isValidElement(child) && typeof child.type === 'function') {
              const componentName = child.type.name;
              const tabId = componentToTabId[componentName];
              
              if (tabId === activeTab) {
                return child;
              }
            }
            return null;
          })}
        </div>
      </main>
    </div>
  );
} 