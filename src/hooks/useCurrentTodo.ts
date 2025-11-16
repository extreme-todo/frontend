import { useCallback, useEffect, useMemo, useState } from 'react';
import { TodoEntity } from '../DB/indexedAction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todosApi } from '../shared/apis';
import { getDateInFormat } from '../shared/timeUtils';
import { PomodoroStatus } from '../services/PomodoroService';
import { IPomodoroActions, IPomodoroData, pomodoroUnit } from './usePomodoro';

interface ITodoFocusedTime {
  id: TodoEntity['id'];
  focusTime: number;
}
const TODO_FOCUS_TIME_KEY = 'ExtremeTodoFocusTime';
export type TodoResponseDto = TodoEntity;

export const useCurrentTodo = ({
  value: { settings: pomodoroSettings, status, time },
  actions,
}: {
  value: IPomodoroData;
  actions: IPomodoroActions;
}) => {
  const [currentTodo, setCurrentTodo] = useState<TodoResponseDto>();
  const [focusedOnTodo, setFocusedOnTodo] = useState<number>(0);

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
    if (currentTodo) await todosApi.doTodo(id, focusTime);
  }

  const { mutate: doTodoMutate } = useMutation(doTodoMutateHandler, {
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
    return status === PomodoroStatus.FOCUSING;
  }, [status]);

  // 집중 단위시간동안 집중했는지
  const canRest = useMemo(() => {
    return (
      focusedOnTodo > 0 &&
      focusedOnTodo % (pomodoroSettings.focusStep * pomodoroUnit) === 0
    );
  }, [focusedOnTodo, pomodoroSettings.focusStep, pomodoroUnit]);

  // todo에 지정한 모든 라운드를 달성했는지
  const fullyFocused = useMemo(() => {
    return (
      currentTodo?.duration &&
      focusedOnTodo >=
        currentTodo?.duration * pomodoroSettings.focusStep * pomodoroUnit
    );
  }, [currentTodo, focusedOnTodo, pomodoroSettings.focusStep, pomodoroUnit]);

  /**
   * -----------------------callback (memoized)---------------------
   */

  /**
   * 집중 단위시간이 다 되었을 때 휴식
   * @returns boolean
   */
  const restWhenPomodoroEnd = useCallback(() => {
    if (isFocusing && canRest) {
      actions.startResting();
    }
  }, [isFocusing, canRest, actions]);

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
    if (currentTodo)
      doTodoMutate({ id: currentTodo.id, focusTime: focusedOnTodo });
  }, [currentTodo, focusedOnTodo, doTodoMutate]);

  /**
   * 다음 할 일을 가져온다.
   * 없으면 undefined를 반환한다.
   * @returns TodoEntity | undefined
   */
  const getNextTodo = useCallback((): TodoEntity | undefined => {
    if (todos) {
      const todayTodos = todos.get(getDateInFormat(new Date()));
      if (todayTodos != null) {
        return todayTodos[0];
      } else {
        setCurrentTodo(undefined);
        actions.stopTimer();
        return undefined;
      }
    } else {
      setCurrentTodo(undefined);
      actions.stopTimer();
      return undefined;
    }
  }, [todos]);

  /**
   * 초기화
   */
  const init = useCallback(() => {
    const nextTodo = getNextTodo();
    if (currentTodo == null) {
      if (nextTodo) {
        setCurrentTodo(nextTodo);
        setFocusedOnTodo(checkLocalStorageAndGetFocusTime(nextTodo) ?? 0);
        if (status == null) actions.startFocusing();
      } else {
        actions.stopTimer();
        setFocusedOnTodo(0);
      }
    }
  }, [
    getNextTodo,
    currentTodo,
    checkLocalStorageAndGetFocusTime,
    status,
    actions,
  ]);

  /**
   * -----------------------useEffect---------------------
   */

  useEffect(() => {
    // TODO 목록이 변경되었을 때 초기화
    init();
  }, [todos]);

  useEffect(() => {
    restWhenPomodoroEnd();
    isFocusing && updateFocus(time === 0 ? 0 : 1000);
  }, [time]);

  const useCurrentTodoResult = useMemo(
    () => ({
      doTodo,
      updateFocus,
      currentTodo,
      focusedOnTodo,
      fullyFocused,
      currentRound,
      canRest,
    }),
    [
      doTodo,
      updateFocus,
      currentTodo,
      focusedOnTodo,
      fullyFocused,
      currentRound,
      canRest,
    ],
  );

  return useCurrentTodoResult;
};
