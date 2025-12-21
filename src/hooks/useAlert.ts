import { useCallback, useRef, useState } from 'react';

const useAlarm = () => {
  const alarmSound = useRef<HTMLAudioElement>(new Audio('/alarm.mp3'));
  alarmSound.current.loop = true;
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const callNotification = useCallback(async () => {
    alarmSound.current.currentTime = 0;
    alarmSound.current.muted = false;
    alarmSound.current.volume = 1;
    await alarmSound.current.play();
  }, []);

  const cancelNotification = useCallback(() => {
    alarmSound.current.pause();
    alarmSound.current.currentTime = 0;
  }, []);

  const initSoundPlayer = useCallback(async () => {
    if (isMounted) return;
    alarmSound.current.muted = true;
    await alarmSound.current.play();
    alarmSound.current.pause();
    alarmSound.current.muted = false;
    alarmSound.current.currentTime = 0;
    setIsMounted(true);
  }, [isMounted]);

  return { callNotification, cancelNotification, initSoundPlayer };
};

export default useAlarm;
