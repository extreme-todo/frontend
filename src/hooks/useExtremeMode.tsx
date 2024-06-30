import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import { IChildProps } from '../shared/interfaces';
import { usePomodoroValue } from './usePomodoro';
import { rankingApi, timerApi, todosApi } from '../shared/apis';
import { ETIndexed } from '../DB/indexed';
import { useIsOnline } from './useIsOnline';

export interface IExtremeMode {
  isExtreme: boolean;
  setMode: (extremeMode: boolean) => void;
  leftTime: string;
}

export const DEFAULT_IS_EXTREME = true;

export const ExtremeModeContext = createContext<IExtremeMode>(
  {} as IExtremeMode,
);

export const ExtremeModeProvider = ({ children }: IChildProps) => {
  const { status, settings } = usePomodoroValue();
  const isOnline = useIsOnline();
  const setMode = (newMode: boolean) => {
    if (status.isFocusing === true) {
      window.alert('집중 시간에는 모드 변경이 불가능합니다.');
    } else
      setExtremeMode((prev: IExtremeMode) => {
        return { ...prev, isExtreme: newMode };
      });
  };
  const getLeftTime = () => {
    if (status.isResting) {
      const leftMs = settings.restStep * 60000 - status.restedTime;
      const minutes = (leftMs % 3600000) / 60000;
      if (leftMs < 0) {
        setLeftTime('휴식시간이 초과되었습니다. 초기화가 진행됩니다...');
        const resetOnlineTodos = [
          todosApi.resetTodos(),
          rankingApi.resetRanking(),
          timerApi.reset(),
        ];
        const resetOfflineTodos = [ETIndexed.getInstance().resetTodos()];
        Promise.all(isOnline ? resetOnlineTodos : resetOfflineTodos).then(
          () => {
            setLeftTime('휴식시간 초과로 모든 기록이 초기화되었습니다.');
          },
        );
      } else {
        setLeftTime(
          Math.floor(minutes) +
            '분 ' +
            Math.floor((leftMs % 60000) / 1000) +
            '초 뒤에 모든 기록이 삭제됩니다.',
        );
      }
    }
  };

  useEffect(() => {
    getLeftTime();
  }, [status]);

  const [extremeMode, setExtremeMode] = useState<IExtremeMode>({
    isExtreme: DEFAULT_IS_EXTREME,
    setMode,
    leftTime: '',
  });

  const setLeftTime = (value: string) => {
    setExtremeMode((prev) => ({ ...prev, leftTime: value }));
  };

  const localKey = 'extremeMode';

  useEffect(() => {
    const checkLocalStorage = () => {
      const localExtreme = localStorage.getItem(localKey);
      if (localExtreme != null) {
        setExtremeMode((prev) => ({
          ...prev,
          isExtreme: JSON.parse(localExtreme) as boolean,
        }));
      } else {
        setExtremeMode({
          isExtreme: DEFAULT_IS_EXTREME,
          setMode,
          leftTime: '',
        });
        updateExtreme(DEFAULT_IS_EXTREME);
      }
    };
    checkLocalStorage();
  }, []);

  useEffect(() => {
    localStorage.setItem(localKey, JSON.stringify(extremeMode.isExtreme));
  }, [extremeMode]);

  useEffect(() => {
    setExtremeMode((prev) => ({ ...prev, setMode }));
  }, [status]);

  return (
    <ExtremeModeContext.Provider value={extremeMode}>
      {children}
    </ExtremeModeContext.Provider>
  );
};

function updateExtreme(isExtreme: boolean) {
  const localKey = 'extremeMode';
  localStorage.setItem(localKey, JSON.stringify(isExtreme));
}

export default function useExtremeMode() {
  const value = useContext(ExtremeModeContext);
  return value;
}
