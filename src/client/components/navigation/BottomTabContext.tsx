import React, { createContext, useContext, useState } from 'react';

type TabRoute = 'list' | 'chart' | 'add' | 'discover' | 'profile';

interface BottomTabContextType {
  activeRoute: TabRoute;
  setActiveRoute: (route: TabRoute) => void;
}

const BottomTabContext = createContext<BottomTabContextType | undefined>(undefined);

export function BottomTabProvider({ children }: { children: React.ReactNode }) {
  const [activeRoute, setActiveRoute] = useState<TabRoute>('list');

  return (
    <BottomTabContext.Provider value={{ activeRoute, setActiveRoute }}>
      {children}
    </BottomTabContext.Provider>
  );
}

export function useBottomTab() {
  const context = useContext(BottomTabContext);
  if (!context) {
    throw new Error('useBottomTab must be used within a BottomTabProvider');
  }
  return context;
}
