import React, { createContext, useEffect, useState, useContext } from 'react';
import { IChildProps } from '../shared/interfaces';

export interface IExtremeMode {
  isExtreme: boolean;
  setMode: (extremeMode: boolean) => void;
}

export const DEFAULT_IS_EXTREME = false;

export const ExtremeModeContext = createContext<IExtremeMode>(
  {} as IExtremeMode,
);

export const ExtremeModeProvider = ({ children }: IChildProps) => {
  const setMode = (newMode: boolean) =>
    setExtremeMode((prev) => {
      return { ...prev, isExtreme: newMode };
    });
  const [extremeMode, setExtremeMode] = useState<IExtremeMode>({
    isExtreme: DEFAULT_IS_EXTREME,
    setMode,
  });
  const localKey = 'extremeMode';

  useEffect(() => {
    const checkLocalStorage = () => {
      const localExtreme = localStorage.getItem(localKey);
      if (localExtreme != null) {
        setExtremeMode((prev) => ({
          ...prev,
          isExtreme: JSON.parse(localExtreme) as boolean,
        }));
      } else {
        setExtremeMode({ isExtreme: false, setMode });
        updateExtreme(false);
      }
    };
    checkLocalStorage();
  }, []);

  useEffect(() => {
    localStorage.setItem(localKey, JSON.stringify(extremeMode.isExtreme));
  }, [extremeMode]);

  return (
    <ExtremeModeContext.Provider value={extremeMode}>
      {children}
    </ExtremeModeContext.Provider>
  );
};

function updateExtreme(isExtreme: boolean) {
  const localKey = 'extremeMode';
  localStorage.setItem(localKey, JSON.stringify(isExtreme));
}

export default function useExtremeMode() {
  const value = useContext(ExtremeModeContext);
  return value;
}
