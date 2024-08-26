import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IChildProps } from '../shared/interfaces';
import { timerApi } from '../shared/apis';

export const pomodoroUnit = 60000;
// TODO : 테스트용 1 제거 필요
export const focusStepList = [1, 10, 20, 30, 40, 50] as const;
export const restStepList = [1, 5, 10, 15, 20] as const;
export type focusStep = (typeof focusStepList)[number];
export type restStep = (typeof restStepList)[number];
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
  setEnableTimer: (enable: boolean) => void;
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
  const enableRef = useRef<boolean>(true);
  const statusRef = useRef<IPomodoroStatus>(status);
  const settingsRef = useRef<IPomodoroSettings>(settings);

  let interval: NodeJS.Timer;

  const actions = useMemo<IPomodoroActions>(
    () => ({
      setEnableTimer: (enable: boolean) => {
        enableRef.current = enable;
        if (enable === false)
          setStatus((prev) => {
            return { ...prev, focusedTime: 0, restedTime: 0 };
          });
      },
      setFocusStep: (step: focusStep) => {
        setSetting((prev) => {
          const newData = { ...prev, focusStep: step };
          settingsRef.current = newData;
          return newData;
        });
      },
      setRestStep: (step: restStep) => {
        setSetting((prev) => {
          const newData = { ...prev, restStep: step };
          settingsRef.current = newData;
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
          if (enableRef.current) {
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
          }
        }, 1000);
      },
      startResting: () => {
        clearInterval(interval);
        interval = setInterval(() => {
          if (enableRef.current) {
            setStatus((prev) => {
              const prevRestTime =
                prev.isResting !== false ? prev.restedTime : 0;
              const newData: IPomodoroStatus = {
                ...prev,
                isFocusing: false,
                isResting: true,
                restedTime: prevRestTime + 1000,
              };
              statusRef.current = newData;
              return newData;
            });
          }
        }, 1000);
      },
    }),
    [enableRef.current],
  );

  useEffect(() => {
    function updatePomodorBeforeUnload(
      status: IPomodoroStatus,
      settings: IPomodoroSettings,
    ) {
      updatePomodoroData<IPomodoroStatus>(status, 'status');
      updatePomodoroData<IPomodoroSettings>(settings, 'settings');
    }
    window.addEventListener('beforeunload', () =>
      updatePomodorBeforeUnload(statusRef.current, settingsRef.current),
    );
    return () => {
      window.removeEventListener('beforeunload', () =>
        updatePomodorBeforeUnload(statusRef.current, settingsRef.current),
      );
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
