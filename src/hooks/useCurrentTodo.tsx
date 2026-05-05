import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TodoEntity } from '../DB/indexedAction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todosApi } from '../shared/apis';
import { IChildProps } from '../shared/interfaces';
import {
  PomodoroFocusingStatus,
  PomodoroService,
} from '../services/PomodoroService';
import {
  usePomodoroValue,
  usePomodoroActions,
  pomodoroUnit,
} from './usePomodoro';

export type TodoResponseDto = TodoEntity;

interface ITodoFocusedTime {
  id: TodoEntity['id'];
  focusTime: number;
}
const TODO_FOCUS_TIME_KEY = 'ExtremeTodoFocusTime';

export interface ICurrentTodoData {
  currentTodo?: TodoResponseDto;
  focusedOnTodo: number;
  lastRestRoundFocusedTime: number;
  currentRound: number;
  isFocusing: boolean;
  canRest: boolean;
  canFocus: boolean;
  fullyFocused: boolean;
}

export interface ICurrentTodoActions {
  updateFocus: (focusedTime: number) => void;
  doTodo: () => void;
  doAllTodo: () => void;
}

const CurrentTodoDataContext = createContext<ICurrentTodoData>(
  {} as ICurrentTodoData,
);
const CurrentTodoActionsContext = createContext<ICurrentTodoActions>(
  {} as ICurrentTodoActions,
);

export const CurrentTodoProvider = ({ children }: IChildProps) => {
  const [currentTodo, setCurrentTodo] = useState<TodoResponseDto>();
  const [focusedOnTodo, setFocusedOnTodo] = useState<number>(0);
  const [lastRestRoundFocusedTime, setLastRestRoundFocusedTime] =
    useState<number>(0);

  const pomodoroValue = usePomodoroValue();
  const pomodoroActions = usePomodoroActions();
  const { settings: pomodoroSettings, status, time } = pomodoroValue;

  const { data: todos } = useQuery<Map<string, TodoEntity[]>>(
    ['todos'],
    () => {
      return todosApi.getList(false);
    },
    {
      staleTime: Infinity,
    },
  );

  const queryClient = useQueryClient();

  async function doTodoMutateHandler({
    id,
    focusTime,
  }: {
    id: string;
    focusTime: number;
  }) {
    if (currentTodo) {
      await todosApi.doTodo(id, focusTime);
    }
  }

  async function doAllTodoMutateHandler({
    id,
    focusTime,
  }: {
    id: string;
    focusTime: number;
  }) {
    if (currentTodo) {
      await doTodoMutateHandler({ id, focusTime });
    }
    await todosApi.doAllTodo();
  }

  const { mutate: doTodoMutate } = useMutation(doTodoMutateHandler, {
    onSuccess: () => {
      setFocusedOnTodo(0);
      setLastRestRoundFocusedTime(0);
      localStorage.removeItem(TODO_FOCUS_TIME_KEY);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['doneTodos'] });
    },
  });

  const { mutate: doAllTodoMutate } = useMutation(doAllTodoMutateHandler, {
    onSuccess: () => {
      setFocusedOnTodo(0);
      setLastRestRoundFocusedTime(0);
      localStorage.removeItem(TODO_FOCUS_TIME_KEY);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['doneTodos'] });
    },
  });

  /**
   * -----------------------합성 state (memoized)---------------------
   */

  // 현재 진행중인 라운드
  const currentRound = useMemo(() => {
    return Math.max(
      Math.ceil(focusedOnTodo / (pomodoroSettings.focusStep * pomodoroUnit)),
      1,
    );
  }, [focusedOnTodo, status, pomodoroSettings.focusStep]);

  // 현재 포모도로 상태가 집중중인지
  const isFocusing = useMemo(() => {
    return status === PomodoroFocusingStatus.FOCUSING;
  }, [status]);

  // 현재 진행중인 라운드만큼 집중했는지
  const canRest = useMemo(() => {
    const focusStepMs = pomodoroSettings.focusStep * pomodoroUnit;
    return (
      status === PomodoroFocusingStatus.FOCUSING &&
      focusedOnTodo % focusStepMs === 0 &&
      focusedOnTodo > lastRestRoundFocusedTime
    );
  }, [
    focusedOnTodo,
    status,
    pomodoroSettings.focusStep,
    pomodoroUnit,
    lastRestRoundFocusedTime,
  ]);

  // todo에 지정한 모든 라운드를 달성했는지
  const fullyFocused = useMemo(() => {
    return (
      currentTodo?.duration != null &&
      focusedOnTodo >=
        currentTodo?.duration * pomodoroSettings.focusStep * pomodoroUnit
    );
  }, [currentTodo, focusedOnTodo, pomodoroSettings.focusStep, pomodoroUnit]);

  // 포모도로 상태가 휴식중이고, 휴식 단위시간이 다 되었는지
  const canFocus = useMemo(() => {
    return (
      status === PomodoroFocusingStatus.RESTING &&
      (time ?? 0) > pomodoroSettings.restStep * pomodoroUnit
    );
  }, [fullyFocused, status, time, pomodoroSettings.restStep, pomodoroUnit]);

  /**
   * -----------------------callback (memoized)---------------------
   */

  /**
   * 집중 단위시간이 다 되었을 때 휴식
   * @returns boolean
   */
  const focusOrRestWhenPomodoroEnd = useCallback(() => {
    if (isFocusing && canRest) {
      setLastRestRoundFocusedTime(focusedOnTodo);
      pomodoroActions.startResting();
      return PomodoroFocusingStatus.RESTING;
    }
    if (!isFocusing && canFocus) {
      pomodoroActions.startFocusing();
      return PomodoroFocusingStatus.FOCUSING;
    }
    return;
  }, [isFocusing, canRest, canFocus, pomodoroActions, focusedOnTodo]);

  /**
   * 로컬스토리지에 저장된 집중시간을 확인하고 반환한다.
   * @param todo
   * @returns 집중시간 (ms)
   */
  const checkLocalStorageAndGetFocusTime = useCallback((todo: TodoEntity) => {
    const storageFocusTime = localStorage.getItem(TODO_FOCUS_TIME_KEY);
    if (storageFocusTime) {
      const originalTime: ITodoFocusedTime = JSON.parse(
        storageFocusTime,
      ) as unknown as ITodoFocusedTime;
      if (originalTime.id == todo.id) {
        return originalTime.focusTime;
      }
    }
    return 0;
  }, []);

  /**
   * 현재 할 일의 집중시간을 업데이트한다.
   * @param focusedTime 집중시간 (ms)
   */
  const updateFocus = useCallback(
    (focusedTime: number) => {
      if (currentTodo != null)
        setFocusedOnTodo((prev) => {
          const newtime = prev + focusedTime;
          localStorage.setItem(
            TODO_FOCUS_TIME_KEY,
            JSON.stringify({
              id: currentTodo?.id,
              focusTime: newtime,
            }),
          );
          return newtime;
        });
    },
    [currentTodo],
  );

  /**
   * 현재 할 일을 완료 처리한다.
   */
  const doTodo = useCallback(() => {
    if (currentTodo) {
      doTodoMutate({ id: currentTodo.id, focusTime: focusedOnTodo });
      pomodoroActions.startFocusing();
    }
  }, [currentTodo, focusedOnTodo, doTodoMutate, pomodoroActions]);

  /**
   * 현재 할 일을 완료 처리하고, 남은 할 일은 삭제 처리한다.
   */
  const doAllTodo = useCallback(() => {
    if (currentTodo) {
      doAllTodoMutate({ id: currentTodo.id, focusTime: focusedOnTodo });
    }
  }, [currentTodo, focusedOnTodo, doAllTodoMutate, pomodoroActions]);

  /**
   * 다음 할 일을 가져온다.
   * 없으면 undefined를 반환한다.
   * @returns TodoEntity | undefined
   */
  const getNextTodo = useCallback((): TodoEntity | undefined => {
    if (todos) {
      if (todos.size > 0) {
        return Array.from(todos.values())[0][0];
      } else {
        setCurrentTodo(undefined);
        pomodoroActions.stopTimer();
        return undefined;
      }
    } else {
      setCurrentTodo(undefined);
      pomodoroActions.stopTimer();
      return undefined;
    }
  }, [todos, pomodoroActions]);

  /**
   * 초기화
   */
  const init = useCallback(() => {
    const nextTodo = getNextTodo();
    const currentTodoRemoved =
      currentTodo != null &&
      todos != null &&
      !Array.from(todos.values())
        .flat()
        .some((t) => t.id === currentTodo.id);

    if (currentTodo == null || currentTodoRemoved) {
      if (nextTodo) {
        setCurrentTodo(nextTodo);
        const savedFocusTime = checkLocalStorageAndGetFocusTime(nextTodo) ?? 0;
        setFocusedOnTodo(savedFocusTime);
        if (status == null) {
          pomodoroActions.startFocusing();
          PomodoroService.setTime(
            savedFocusTime % (pomodoroSettings.focusStep * pomodoroUnit),
          );
        }
      } else {
        setCurrentTodo(undefined);
        pomodoroActions.stopTimer();
        setFocusedOnTodo(0);
      }
    }
  }, [
    todos,
    getNextTodo,
    currentTodo,
    checkLocalStorageAndGetFocusTime,
    status,
    pomodoroActions,
    pomodoroSettings,
    pomodoroUnit,
  ]);

  /**
   * -----------------------useEffect---------------------
   */

  useEffect(() => {
    // TODO 목록이 변경되었을 때 초기화
    init();
  }, [todos, init]);

  useEffect(() => {
    focusOrRestWhenPomodoroEnd();
  }, [time, focusOrRestWhenPomodoroEnd, updateFocus]);

  useEffect(() => {
    if (isFocusing) {
      updateFocus(PomodoroService.getPomodoroTickInterval());
    }
  }, [isFocusing, time, updateFocus]);

  const data: ICurrentTodoData = useMemo(
    () => ({
      currentTodo,
      focusedOnTodo,
      lastRestRoundFocusedTime,
      currentRound,
      isFocusing,
      canRest,
      canFocus,
      fullyFocused,
    }),
    [
      currentTodo,
      focusedOnTodo,
      lastRestRoundFocusedTime,
      currentRound,
      isFocusing,
      canRest,
      canFocus,
      fullyFocused,
    ],
  );

  const actions: ICurrentTodoActions = useMemo(
    () => ({
      updateFocus,
      doTodo,
      doAllTodo,
    }),
    [updateFocus, doTodo, doAllTodo],
  );

  return (
    <CurrentTodoActionsContext.Provider value={actions}>
      <CurrentTodoDataContext.Provider value={data}>
        {children}
      </CurrentTodoDataContext.Provider>
    </CurrentTodoActionsContext.Provider>
  );
};

export function useCurrentTodoData() {
  const value = useContext(CurrentTodoDataContext);
  return value;
}

export function useCurrentTodoActions() {
  const value = useContext(CurrentTodoActionsContext);
  return value;
}

export function useCurrentTodo() {
  const data = useCurrentTodoData();
  const actions = useCurrentTodoActions();
  return { ...data, ...actions };
}
