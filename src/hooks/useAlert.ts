import { useCallback, useRef, useState } from 'react';

const useAlarm = () => {
  const alarmSound = useRef<HTMLAudioElement>(new Audio('/alarm.mp3'));
  alarmSound.current.loop = true;
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const callNotification = useCallback(async () => {
    alarmSound.current.currentTime = 0;
    alarmSound.current.muted = false;
    alarmSound.current.volume = 1;
    try {
      await alarmSound.current.play();
    } catch (err) {
      console.error(err);
      alert('알람 소리 재생에 실패했습니다. 새로고침을 해주세요 :)');
    }
  }, []);

  const cancelNotification = useCallback(() => {
    alarmSound.current.pause();
    alarmSound.current.currentTime = 0;
  }, []);

  const initSoundPlayer = useCallback(async () => {
    if (isMounted) return;
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

  return { callNotification, cancelNotification, initSoundPlayer };
};

export default useAlarm;
