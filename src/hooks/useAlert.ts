import { useCallback, useRef, useState } from 'react';

const useAlarm = () => {
  const alarmSound = useRef<HTMLAudioElement>(new Audio('/alarm.mp3'));
  alarmSound.current.loop = true;
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const callNotification = useCallback(() => {
    alarmSound.current.muted = false;
    alarmSound.current.play();
  }, []);

  const cancelNotification = useCallback(() => {
    alarmSound.current.pause();
  }, []);

  const initSoundPlayer = useCallback(() => {
    if (isMounted) return;
    alarmSound.current.muted = true;
    alarmSound.current.play();
    alarmSound.current.pause();
    setIsMounted(true);
  }, [isMounted]);

  return { callNotification, cancelNotification, initSoundPlayer };
};

export default useAlarm;
