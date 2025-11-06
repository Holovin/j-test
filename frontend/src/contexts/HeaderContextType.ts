import { createContext } from 'react';

interface HeaderContextType {
  isLoading: boolean;
  meta: string[];
  setIsLoading: (isLoading: boolean) => void;
  setMeta: (meta: string[]) => void;
}

export const HeaderContext = createContext<HeaderContextType | undefined>(undefined);
