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
import { settingsApi, timerApi, todosApi } from '../shared/apis';
import { ETIndexed } from '../DB/indexed';
import { useCurrentTodo, useIsOnline } from './';
import { PomodoroStatus } from '../services/PomodoroService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface ExtremeModeContextType {
  handleExtremeMode: (extremeMode: boolean) => void;
  isExtreme: boolean;
  warningText: string;
}

export const EXTREME_MODE = 'extremeMode';

const ExtremeModeContext = createContext<ExtremeModeContextType>({
  isExtreme: true,
  warningText: '',
  handleExtremeMode: (extremeMode: boolean) => {
    console.debug();
  },
});

export const ExtremeModeProvider = ({ children }: IChildProps) => {
  // state
  const [resetFlag, setResetFlag] = useState<boolean>(false); // true 면 reset 완료
  const [warningText, setWarningText] = useState('');

  // hooks
  const { status, settings, time } = usePomodoroValue();
  const pomodoroActions = usePomodoroActions();
  const { currentTodo } = useCurrentTodo({
    value: {
      settings,
      status,
      time,
    },
    actions: pomodoroActions,
  });
  const isOnline = useIsOnline();
  const queryClient = useQueryClient();

  // apis
  const { data: extremeModeData, isLoading } = useQuery({
    queryFn: settingsApi.getSettings,
    queryKey: ['settings'],
    staleTime: Infinity,
  });

  const { mutate: handleExtremeMutation } = useMutation(
    settingsApi.setSettings,
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['settings'] });
      },
      onError(error: AxiosError) {
        const errorString = '에러 발생 ' + error.code + ' ' + error.message;
        console.error(errorString);
      },
    },
  );

  // ref and const
  const prevStatus = useRef(status);
  const isExtreme = extremeModeData
    ? extremeModeData.data.extremeMode === undefined
      ? true
      : extremeModeData.data.extremeMode
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
    setWarningText(value);
  };

  const getLeftTime = () => {
    if (status === PomodoroStatus.RESTING) {
      const leftMs = settings.restStep * 60000 - (time ?? 0);
      if (leftMs >= 0) {
        handleLeftTime('휴식 시간이 끝나면 기록이 삭제됩니다!');
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
          ? [todosApi.resetTodos(), timerApi.resetRecords]
          : [ETIndexed.getInstance().resetTodos()],
      )
        .then(() => {
          handleLeftTime('휴식시간 초과로 모든 기록이 초기화되었습니다.');
          pomodoroActions.stopTimer();
          queryClient.invalidateQueries(['todos']);
          queryClient.invalidateQueries(['category']);
          queryClient.invalidateQueries(['focusedTime']);
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
  }, [time, status]);

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
        warningText,
        handleExtremeMode,
      }}
    >
      {children}
    </ExtremeModeContext.Provider>
  );
};

export function useExtremeMode() {
  const value = useContext(ExtremeModeContext);
  return value;
}
