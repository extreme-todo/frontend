import { useEffect, useMemo, useState } from 'react';
import { TodoEntity } from '../DB/indexedAction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { timerApi, todosApi } from '../shared/apis';
import { getDateInFormat } from '../shared/timeUtils';
import { PomodoroService, PomodoroStatus } from '../services/PomodoroService';
import { IPomodoroActions, IPomodoroData, pomodoroUnit } from './usePomodoro';

interface ITodoFocusedTime {
  id: TodoEntity['id'];
  focusTime: number;
}
const TODO_FOCUS_TIME_KEY = 'ExtremeTodoFocusTime';
type TodoResponseDto = TodoEntity;

const useCurrentTodo = ({
  value: { settings: pomodoroSettings, status, time },
  actions,
}: {
  value: IPomodoroData;
  actions: IPomodoroActions;
}) => {
  const [currentTodo, setCurrentTodo] = useState<TodoResponseDto>();
  const [focusedOnTodo, setFocusedOnTodo] = useState<number>(0);
  const [canRest, setCanRest] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(false);

  const { data: todos } = useQuery<Map<string, TodoEntity[]>>(
    ['todos'],
    () => todosApi.getList(false),
    {
      staleTime: 1000 * 60 * 20,
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

  useEffect(() => {
    PomodoroService.pomodoroStatus$.subscribe((changedStatus) => {
      if (currentTodo && changedStatus === PomodoroStatus.RESTING) {
        currentTodo?.categories?.forEach((cantegory) => {
          timerApi.recordFocusTime(cantegory, time ?? 0);
        });
      }
    });
  }, []);

  useEffect(() => {
    const nextTodo = getNextTodo();
    setCurrentTodo(() => {
      return nextTodo;
    });
    // TODO : 추후 오프라인일 경우 indexed db에서 현재 투두를 가져와야 할 듯
  }, [todos]);

  useEffect(() => {
    if (status !== PomodoroStatus.NONE && currentTodo == null) {
      // actions.stopTimer();
    } else if (status === PomodoroStatus.NONE && currentTodo != null) {
      actions.startResting();
    }
  }, [currentTodo]);

  useEffect(() => {
    status !== PomodoroStatus.OVERFOCUSING && checkIfCanRest();
    checkIfShouldFocus();
    const ifShouldRest = checkIfShouldRest();
    (status === PomodoroStatus.FOCUSING ||
      status === PomodoroStatus.OVERFOCUSING) &&
      !ifShouldRest &&
      updateFocus(time === 0 ? 0 : 1000);
  }, [time]);

  /**
   * 쉴 수 있는 상황인지(투두에 기록된 duration을 초과했을 때)
   * @returns boolean
   */
  const checkIfCanRest = () => {
    if (
      currentTodo?.duration &&
      focusedOnTodo >=
        currentTodo?.duration * pomodoroSettings.focusStep * pomodoroUnit
    ) {
      setCanRest((prev) => {
        if (!prev) actions.startResting();
        return true;
      });
      return true;
    } else {
      return canRest;
    }
  };

  /**
   * 쉬어야 하는 상황인지(집중 단위시간이 다 되었을 때)
   * @returns boolean
   */
  const checkIfShouldRest = () => {
    if (
      status === PomodoroStatus.FOCUSING &&
      time === pomodoroSettings.focusStep * pomodoroUnit
    ) {
      actions.startResting();
      return true;
    }
    return false;
  };

  const checkIfShouldFocus = () => {
    if (
      status === PomodoroStatus.RESTING &&
      (time ?? 0) >= pomodoroSettings.restStep * pomodoroUnit
    ) {
      setShouldFocus(true);
    } else {
      setShouldFocus(false);
    }
  };

  const checkLocalStorageAndGetFocusTime = (todo: TodoEntity) => {
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
  };

  const updateFocus = (focusedTime: number) => {
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
  };

  const doTodo = () => {
    if (currentTodo)
      doTodoMutate({ id: currentTodo.id, focusTime: focusedOnTodo });
    getNextTodo();
    setFocusedOnTodo(0);
    actions.startFocusing();
    setCanRest(false);
  };

  const getNextTodo = (): TodoEntity | undefined => {
    if (todos) {
      const todayTodos = todos.get(getDateInFormat(new Date()));
      if (todayTodos != null) {
        setFocusedOnTodo(checkLocalStorageAndGetFocusTime(todayTodos[0]));
        setCurrentTodo(todayTodos[0]);
        actions.startFocusing();
        return todayTodos[0];
      } else {
        setCurrentTodo(undefined);
        return undefined;
      }
    } else {
      setCurrentTodo(undefined);
      return undefined;
    }
  };

  const useCurrentTodoResult = useMemo(
    () => ({
      doTodo,
      updateFocus,
      currentTodo,
      focusedOnTodo,
      checkLocalStorageAndGetFocusTime,
      canRest,
      shouldFocus,
    }),
    [
      doTodo,
      updateFocus,
      currentTodo,
      focusedOnTodo,
      checkLocalStorageAndGetFocusTime,
      canRest,
      shouldFocus,
    ],
  );

  return useCurrentTodoResult;
};
export default useCurrentTodo;
export { type TodoResponseDto };
