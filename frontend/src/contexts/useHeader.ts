import { useContext } from 'react';
import { HeaderContext } from '@/contexts/HeaderContextType';

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }

  return context;
}
