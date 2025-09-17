'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface DemoModeContextValue {
  isActive: boolean;
  startDemo: () => void;
  stopDemo: () => void;
}

const DemoModeContext = createContext<DemoModeContextValue | undefined>(undefined);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);

  const startDemo = useCallback(() => {
    setIsActive(true);
  }, []);

  const stopDemo = useCallback(() => {
    setIsActive(false);
  }, []);

  const value = useMemo(
    () => ({
      isActive,
      startDemo,
      stopDemo,
    }),
    [isActive, startDemo, stopDemo]
  );

  return <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>;
}

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
}
