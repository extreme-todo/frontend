import { useSyncExternalStore } from 'react';

export const useIsOnline = (
  callback: () => any = () => {
    console.debug('');
  },
) => {
  const getSnapshot = () => {
    return navigator.onLine;
  };

  const subscribe = () => {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
    return () => {
      window.removeEventListener('online', callback);
      window.removeEventListener('offline', callback);
    };
  };

  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  return isOnline;
};
