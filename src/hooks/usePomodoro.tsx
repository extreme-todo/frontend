import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IChildProps } from '../shared/interfaces';
import { PomodoroService, PomodoroStatus } from '../services/PomodoroService';

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
};

interface IPomodoroSettings {
  focusStep: focusStep;
  restStep: restStep;
}

export interface IPomodoroData {
  settings: IPomodoroSettings;
  status?: PomodoroStatus;
  time?: number;
}

export interface IPomodoroActions {
  setFocusStep: (step: focusStep) => void;
  setRestStep: (step: restStep) => void;
  startFocusing: () => void;
  startOverFocusing: () => void;
  startResting: () => void;
  stopTimer: () => void;
}

const PomodoroValueContext = createContext<IPomodoroData>({} as IPomodoroData);
const PomodoroActionsContext = createContext<IPomodoroActions>(
  {} as IPomodoroActions,
);

const PomodoroProvider = ({ children }: IChildProps) => {
  const [settings, setSetting] = useState<IPomodoroSettings>(
    getPomodoroData<IPomodoroSettings>('settings'),
  );
  const [time, setTime] = useState<number>();
  const [status, setStatus] = useState<PomodoroStatus>();

  const settingsRef = useRef<IPomodoroSettings>(settings);

  useEffect(() => {
    PomodoroService.startTimer();
  }, []);

  useEffect(() => {
    PomodoroService.pomodoroStatus$.subscribe((res) => {
      setStatus(res);
    });
    PomodoroService.pomodoroTime$.subscribe((res) => {
      setTime(res);
    });
  }, []);

  const actions = useMemo<IPomodoroActions>(
    () => ({
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
      startOverFocusing: () => {
        PomodoroService.setStatus(PomodoroStatus.OVERFOCUSING);
      },
      startFocusing: () => {
        PomodoroService.setStatus(PomodoroStatus.FOCUSING);
      },
      startResting: () => {
        PomodoroService.setStatus(PomodoroStatus.RESTING);
      },
      stopTimer: () => {
        PomodoroService.setStatus(PomodoroStatus.NONE);
      },
    }),
    [],
  );

  useEffect(() => {
    function updatePomodorBeforeUnload(settings: IPomodoroSettings) {
      updatePomodoroData<IPomodoroSettings>(settings, 'settings');
    }
    window.addEventListener('beforeunload', () =>
      updatePomodorBeforeUnload(settingsRef.current),
    );
    return () => {
      window.removeEventListener('beforeunload', () =>
        updatePomodorBeforeUnload(settingsRef.current),
      );
    };
  }, []);

  return (
    <PomodoroActionsContext.Provider value={actions}>
      <PomodoroValueContext.Provider value={{ settings, time, status }}>
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

function getPomodoroData<T>(type: 'settings') {
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
    }

    updatePomodoroData<T>(initData, type);
    return initData;
  }
}

function updatePomodoroData<T>(data: T, type: 'settings' | 'status') {
  const localKey = 'pomodoro-' + type;
  localStorage.setItem(localKey, JSON.stringify(data));
}

export { usePomodoroValue, usePomodoroActions, PomodoroProvider };
