import { useCallback, useEffect, useRef, useState } from 'react';

const useAlarm = () => {
  const alarmSound = useRef<HTMLAudioElement>(new Audio('/alarm.mp3'));
  alarmSound.current.loop = true;
  const notiRef = useRef<Notification | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isNotiPermission, setIsNotiPermission] = useState<boolean>(false);

  const callNotification = () => {
    if (!isNotiPermission) return;

    // 알림 표시
    notiRef.current = new Notification('test', {
      body: 'test body',
      icon: '/icon.png',
      tag: 'test',
      requireInteraction: true,
    });
    notiRef.current.onshow = () => {
      alarmSound.current.muted = false;
      alarmSound.current.play();
    };
    notiRef.current.onclose = () => {
      alarmSound.current.pause();
    };
  };

  useEffect(() => {
    (async () => {
      const permissionNoti = await Notification.requestPermission();
      if (permissionNoti === 'denied') {
        return console.error('Notification permission denied');
      }
      setIsNotiPermission(true);
    })();
  }, []);

  const initSoundPlayer = () => {
    if (isMounted) return;
    alarmSound.current.muted = true;
    alarmSound.current.play();
    alarmSound.current.pause();
    setIsMounted(true);
  };

  useEffect(() => {
    window.addEventListener('click', initSoundPlayer);
    return () => {
      window.removeEventListener('click', initSoundPlayer);
    };
  }, []);

  return { callNotification };
};

export default useAlarm;
