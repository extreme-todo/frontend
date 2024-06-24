import { useCallback, useEffect, useState } from 'react';

export const useIsOnline = () => {
  const [online, setOnline] = useState(window.navigator.onLine);

  const checkOnline = useCallback(async () => {
    const url = new URL(window.location.origin);

    // random value to prevent cached responses
    url.searchParams.set('rand', String(Date.now()));

    try {
      const response = await fetch(url.toString(), { method: 'HEAD' });
      setOnline(response.ok);
    } catch {
      setOnline(false);
    }
  }, []);

  useEffect(() => {
    const offlineCallback = () => setOnline(false);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    window.addEventListener('online', checkOnline);
    window.addEventListener('offline', offlineCallback);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      window.removeEventListener('online', checkOnline);
      window.removeEventListener('offline', offlineCallback);
    };
  }, [checkOnline]);

  return online;
};
