import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IChildProps } from '../shared/interfaces';

export const pomodoroUnit = 60000;
// TODO : 테스트용 1 제거 필요
export type focusStep = 1 | 10 | 20 | 30 | 40 | 50;
export type restStep = 1 | 5 | 10 | 15 | 20;
export const initialPomodoroData: IPomodoroData = {
  settings: {
    focusStep: 1,
    restStep: 1,
  },
  status: {
    isFocusing: false,
    isResting: true,
    focusedTime: 0,
    restedTime: 0,
  },
};

interface IPomodoroStatus {
  isFocusing: boolean;
  isResting: boolean;
  focusedTime: number;
  restedTime: number;
}

interface IPomodoroSettings {
  focusStep: focusStep;
  restStep: restStep;
}

interface IPomodoroData {
  settings: IPomodoroSettings;
  status: IPomodoroStatus;
}

interface IPomodoroActions {
  setFocusStep: (step: focusStep) => void;
  setRestStep: (step: restStep) => void;
  startFocusing: () => void;
  startResting: () => void;
}

const PomodoroValueContext = createContext<IPomodoroData>({} as IPomodoroData);
const PomodoroActionsContext = createContext<IPomodoroActions>(
  {} as IPomodoroActions,
);

const PomodoroProvider = ({ children }: IChildProps) => {
  const [settings, setSetting] = useState<IPomodoroSettings>(
    getPomodoroData<IPomodoroSettings>('settings'),
  );
  const [status, setStatus] = useState<IPomodoroStatus>(
    getPomodoroData<IPomodoroStatus>('status'),
  );

  const settingRef = useRef<IPomodoroSettings>(settings);
  const statusRef = useRef<IPomodoroStatus>(status);

  let interval: NodeJS.Timer;

  const actions = useMemo<IPomodoroActions>(
    () => ({
      setFocusStep: (step: focusStep) => {
        setSetting((prev) => {
          const newData = { ...prev, focusStep: step };
          updatePomodoroData<IPomodoroSettings>(newData, 'settings');
          return newData;
        });
      },
      setRestStep: (step: restStep) => {
        setSetting((prev) => {
          const newData = { ...prev, restStep: step };
          updatePomodoroData<IPomodoroSettings>(newData, 'settings');
          return newData;
        });
      },
      startFocusing: () => {
        clearInterval(interval);

        setStatus({
          isResting: false,
          isFocusing: true,
          focusedTime: 0,
          restedTime: 0,
        });
        interval = setInterval(() => {
          setStatus((prev) => {
            const prevFocusTime =
              prev.isFocusing !== false ? prev.focusedTime : 0;
            const newData: IPomodoroStatus = {
              ...prev,
              isResting: false,
              isFocusing: true,
              focusedTime: prevFocusTime + 1000,
            };
            statusRef.current = newData;
            return newData;
          });
        }, 1000);
      },
      startResting: () => {
        clearInterval(interval);
        interval = setInterval(() => {
          setStatus((prev) => {
            const prevRestTime = prev.isResting !== false ? prev.restedTime : 0;
            const newData: IPomodoroStatus = {
              ...prev,
              isFocusing: false,
              isResting: true,
              restedTime: prevRestTime + 1000,
            };
            statusRef.current = newData;
            return newData;
          });
        }, 1000);
      },
    }),
    [],
  );

  useEffect(() => {
    function updatePomodorBeforeUnload() {
      updatePomodoroData<IPomodoroSettings>(settingRef.current, 'settings');
      updatePomodoroData<IPomodoroStatus>(statusRef.current, 'status');
    }
    window.addEventListener('beforeunload', updatePomodorBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', updatePomodorBeforeUnload);
    };
  }, []);

  return (
    <PomodoroActionsContext.Provider value={actions}>
      <PomodoroValueContext.Provider value={{ settings, status }}>
        {children}
      </PomodoroValueContext.Provider>
    </PomodoroActionsContext.Provider>
  );
};

function usePomodoroValue() {
  const value = useContext(PomodoroValueContext);
  return value;
}

function usePomodoroActions() {
  const value = useContext(PomodoroActionsContext);
  return value;
}

function getPomodoroData<T>(type: 'settings' | 'status') {
  const localKey = 'pomodoro-' + type;
  const existingData = localStorage.getItem(localKey);

  if (existingData) {
    return JSON.parse(existingData) as T;
  } else {
    let initData: T;
    switch (type) {
      case 'settings':
        initData = initialPomodoroData.settings as T;
        break;
      case 'status':
        initData = initialPomodoroData.status as T;
        break;
    }

    updatePomodoroData<T>(initData, type);
    return initData;
  }
}

function updatePomodoroData<T>(data: T, type: 'settings' | 'status') {
  const localKey = 'pomodoro-' + type;
  localStorage.setItem(localKey, JSON.stringify(data));
}

export default PomodoroProvider;
export { usePomodoroValue, usePomodoroActions };
