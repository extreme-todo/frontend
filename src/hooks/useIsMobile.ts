import { useContext } from 'react';
import { ResponsiveContext } from '../contexts/ResponsiveContext';

export const useIsMobile = () => {
  const context = useContext(ResponsiveContext);

  if (context === undefined) {
    throw new Error('useIsMobile must be used within ResponsiveProvider');
  }

  return context.isMobile;
};
