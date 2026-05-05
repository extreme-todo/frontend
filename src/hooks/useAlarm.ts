import { useCallback, useEffect, useRef, useState } from 'react';

const useAlarm = () => {
  const alarmSound = useRef<HTMLAudioElement | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isAlarmOn, setIsAlarmOn] = useState<boolean>(() => {
    const saved = localStorage.getItem('isAlarmOn');
    return saved === null ? true : saved === 'true';
  });

  const toggleAlarm = useCallback(() => {
    setIsAlarmOn((prev) => {
      const next = !prev;
      localStorage.setItem('isAlarmOn', String(next));
      if (alarmSound.current) alarmSound.current.muted = !next;
      return next;
    });
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isAlarmOn') {
        const next = e.newValue === null ? true : e.newValue === 'true';
        setIsAlarmOn(next);
        if (alarmSound.current) {
          alarmSound.current.muted = !next;
          if (!next) {
            alarmSound.current.currentTime = 0;
          }
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const callNotification = useCallback(async () => {
    if (!alarmSound.current || !isAlarmOn) return;
    alarmSound.current.currentTime = 0;
    alarmSound.current.muted = false;
    alarmSound.current.volume = 1;
    try {
      await alarmSound.current.play();
    } catch (err) {
      console.error(err);
      alert('알람 소리 재생에 실패했습니다. 새로고침을 해주세요 :)');
    }
  }, [isAlarmOn]);

  const cancelNotification = useCallback(() => {
    if (!alarmSound.current) return;
    alarmSound.current.pause();
    alarmSound.current.currentTime = 0;
  }, []);

  const initSoundPlayer = useCallback(async () => {
    if (isMounted || !alarmSound.current) return;
    alarmSound.current.muted = true;
    try {
      await alarmSound.current.play();
      alarmSound.current.pause();
      alarmSound.current.muted = false;
      alarmSound.current.currentTime = 0;
      setIsMounted(true);
    } catch (err) {
      console.error(err);
      alert('알람 초기화에 실패했습니다. 새로고침을 해주세요 :)');
    }
  }, [isMounted]);

  useEffect(() => {
    alarmSound.current = new Audio('/alarm.mp3');
    alarmSound.current.loop = true;
    return () => {
      if (alarmSound.current) {
        alarmSound.current.pause();
        alarmSound.current.src = '';
      }
    };
  }, []);

  return {
    callNotification,
    cancelNotification,
    initSoundPlayer,
    isAlarmOn,
    toggleAlarm,
  };
};

export default useAlarm;
