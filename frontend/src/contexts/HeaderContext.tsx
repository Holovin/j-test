import { useState, type ReactNode } from 'react';
import { HeaderContext } from './HeaderContextType.ts';

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [meta, setMeta] = useState<string[]>([]);

  return (
    <HeaderContext.Provider value={{ isLoading, meta, setIsLoading, setMeta }}>
      {children}
    </HeaderContext.Provider>
  );
}
