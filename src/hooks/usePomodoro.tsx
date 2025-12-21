import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IChildProps } from '../shared/interfaces';
import {
  PomodoroService,
  PomodoroFocusingStatus,
  PomodoroTimerStatus,
} from '../services/PomodoroService';

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
  status?: PomodoroFocusingStatus;
  time?: number;
  timerStatus?: PomodoroTimerStatus;
}

export interface IPomodoroActions {
  setFocusStep: (step: focusStep) => void;
  setRestStep: (step: restStep) => void;
  startFocusing: () => void;
  startResting: () => void;
  stopTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
}

const PomodoroValueContext = createContext<IPomodoroData>({} as IPomodoroData);
const PomodoroActionsContext = createContext<IPomodoroActions>(
  {} as IPomodoroActions,
);

export const PomodoroProvider = ({ children }: IChildProps) => {
  const [settings, setSetting] = useState<IPomodoroSettings>(
    getPomodoroData<IPomodoroSettings>('settings'),
  );
  const [time, setTime] = useState<number>();
  const [status, setStatus] = useState<PomodoroFocusingStatus>();
  const [timerStatus, setTimerStatus] = useState<PomodoroTimerStatus>();

  const settingsRef = useRef<IPomodoroSettings>(settings);

  useEffect(() => {
    const subStatus = PomodoroService.pomodoroFocusingStatus$.subscribe(
      (res) => {
        setStatus(res);
      },
    );
    const subTime = PomodoroService.pomodoroTime$.subscribe((res) => {
      setTime(res);
    });
    const subTimerStatus = PomodoroService.pomodoroTimerStatus$.subscribe(
      (res) => {
        setTimerStatus(res);
      },
    );
    return () => {
      subStatus.unsubscribe();
      subTime.unsubscribe();
      subTimerStatus.unsubscribe();
    };
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
      startFocusing: () => {
        PomodoroService.setStatus(PomodoroFocusingStatus.FOCUSING);
      },
      startResting: () => {
        PomodoroService.setStatus(PomodoroFocusingStatus.RESTING);
      },
      stopTimer: () => {
        PomodoroService.setStatus(PomodoroFocusingStatus.NONE);
      },
      pauseTimer: () => {
        PomodoroService.pauseTimer();
      },
      resumeTimer: () => {
        PomodoroService.resumeTimer();
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
      <PomodoroValueContext.Provider
        value={{ settings, time, status, timerStatus }}
      >
        {children}
      </PomodoroValueContext.Provider>
    </PomodoroActionsContext.Provider>
  );
};

export function usePomodoroValue() {
  const value = useContext(PomodoroValueContext);
  return value;
}

export function usePomodoroActions() {
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
