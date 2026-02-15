import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { responsiveBreakpoints } from '../shared/constants';

interface ResponsiveContextType {
  isMobile: boolean;
}

export const ResponsiveContext = createContext<
  ResponsiveContextType | undefined
>(undefined);

interface ResponsiveProviderProps {
  children: ReactNode;
}

export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({
  children,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined'
      ? window.innerWidth < responsiveBreakpoints.tablet_v.max
      : false,
  );

  useEffect(() => {
    if (window.ResizeObserver) {
      const observer = new ResizeObserver((entries) => {
        const { borderBoxSize } = entries[0];
        const newIsMobile =
          borderBoxSize[0].inlineSize < responsiveBreakpoints.tablet_v.max;
        setIsMobile(newIsMobile);
      });

      observer.observe(document.body);

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <ResponsiveContext.Provider value={{ isMobile }}>
      {children}
    </ResponsiveContext.Provider>
  );
};
