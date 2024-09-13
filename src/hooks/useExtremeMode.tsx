import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from 'react';
import { IChildProps } from '../shared/interfaces';
import { usePomodoroActions, usePomodoroValue } from './usePomodoro';
import { rankingApi, settingsApi, todosApi } from '../shared/apis';
import { ETIndexed } from '../DB/indexed';
import { useIsOnline } from './useIsOnline';
import useCurrentTodo from './useCurrentTodo';
import { PomodoroStatus } from '../services/PomodoroService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface ExtremeModeContextType {
  handleExtremeMode: (extremeMode: boolean) => void;
  isExtreme: boolean;
  leftTime: string;
}

export const EXTREME_MODE = 'extremeMode';

export const ExtremeModeContext = createContext<ExtremeModeContextType>({
  isExtreme: true,
  leftTime: '',
  handleExtremeMode: (extremeMode: boolean) => {
    console.debug();
  },
});

export const ExtremeModeProvider = ({ children }: IChildProps) => {
  // state
  const [resetFlag, setResetFlag] = useState<boolean>(false); // true 면 reset 완료
  const [leftTime, setLeftTime] = useState('');

  // hooks
  const { status, settings, time } = usePomodoroValue();
  const pomodoroActions = usePomodoroActions();
  const { currentTodo } = useCurrentTodo();
  const isOnline = useIsOnline();
  const queryClient = useQueryClient();

  // apis
  const { data: extremeModeData, isLoading } = useQuery({
    queryFn: settingsApi.getSettings,
    queryKey: ['settings'],
    staleTime: 1000 * 60 * 60,
  });

  const { mutate: handleExtremeMutation } = useMutation(
    settingsApi.setSettings,
    {
      onSuccess(data) {
        console.debug(
          '\n\n\n ✅ data in useExtremeMode‘s useMutation ✅ \n\n',
          data,
        );
        queryClient.invalidateQueries({ queryKey: ['settings'] });
      },
      onError(error: AxiosError) {
        console.debug(
          '\n\n\n 🚨 error in useExtremeMode‘s useMutation 🚨 \n\n',
          error,
        );
        const errorString = '에러 발생 ' + error.code + ' ' + error.message;
        console.error(errorString);
      },
    },
  );

  // ref and const
  const prevStatus = useRef(status);
  const isExtreme = extremeModeData
    ? extremeModeData?.data.extremeMode === undefined
      ? true
      : extremeModeData?.data.extremeMode
    : true;

  // handlers
  const handleExtremeMode = useCallback(
    (newMode: boolean) => {
      if (status === PomodoroStatus.FOCUSING) {
        window.alert('집중 시간에는 모드 변경이 불가능합니다.');
      } else
        handleExtremeMutation({
          extremeMode: newMode,
          colorMode: 'auto',
        });
    },
    [status],
  );

  const handleLeftTime = (value: string) => {
    setLeftTime(value);
  };

  const getLeftTime = () => {
    if (status === PomodoroStatus.RESTING) {
      const leftMs = settings.restStep * 60000 - (time ?? 0);
      const minutes = (leftMs % 3600000) / 60000;
      if (leftMs >= 0) {
        handleLeftTime(
          Math.floor(minutes) +
            '분 ' +
            Math.floor((leftMs % 60000) / 1000) +
            '초 뒤에 모든 기록이 삭제됩니다.',
        );
      }
      return leftMs;
    }
  };

  // useEffects
  useEffect(() => {
    const leftMs = getLeftTime();
    if (currentTodo == null) {
      handleLeftTime('');
    }
    if (
      isExtreme === true &&
      prevStatus.current === status &&
      resetFlag === false &&
      currentTodo !== null &&
      Number(leftMs) < 0
    ) {
      handleLeftTime('휴식시간이 초과되었습니다. 초기화가 진행됩니다...');
      Promise.all(
        isOnline
          ? [todosApi.resetTodos(), rankingApi.resetRanking()]
          : [ETIndexed.getInstance().resetTodos()],
      )
        .then(() => {
          handleLeftTime('휴식시간 초과로 모든 기록이 초기화되었습니다.');
          pomodoroActions.stopTimer();
          queryClient.invalidateQueries(['todos']);
          queryClient.invalidateQueries(['category']);
        })
        .catch(() => {
          handleLeftTime('초기화가 실패했습니다. 운 좋은 줄 아십시오...');
        });
      setResetFlag(true);
    }
    if (prevStatus.current != status) {
      setResetFlag(false);
      prevStatus.current = status;
    }
  }, [time]);

  useEffect(() => {
    const localExtreme: string | null | boolean =
      localStorage.getItem(EXTREME_MODE);
    if (!isLoading) {
      if (localExtreme && JSON.parse(localExtreme) !== isExtreme)
        localStorage.setItem(EXTREME_MODE, JSON.stringify(isExtreme));
      else if (!localExtreme)
        localStorage.setItem(EXTREME_MODE, JSON.stringify(isExtreme));
    }
  }, [isExtreme, isLoading]);

  return (
    <ExtremeModeContext.Provider
      value={{
        isExtreme,
        leftTime: leftTime,
        handleExtremeMode,
      }}
    >
      {children}
    </ExtremeModeContext.Provider>
  );
};

export default function useExtremeMode() {
  const value = useContext(ExtremeModeContext);
  return value;
}
