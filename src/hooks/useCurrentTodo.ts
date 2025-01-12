import { useEffect, useMemo, useState } from 'react';
import { TodoEntity } from '../DB/indexedAction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { timerApi, todosApi } from '../shared/apis';
import { getDateInFormat } from '../shared/timeUtils';

interface ITodoFocusedTime {
  id: TodoEntity['id'];
  focusTime: number;
}
const TODO_FOCUS_TIME_KEY = 'ExtremeTodoFocusTime';
type TodoResponseDto = TodoEntity;

const useCurrentTodo = () => {
  const [currentTodo, setCurrentTodo] = useState<TodoResponseDto>();
  const [focusedOnTodo, setFocusedOnTodo] = useState<number>(0);

  const { data: todos } = useQuery(['todos'], () => todosApi.getList(false), {
    staleTime: 1000 * 60 * 20,
  });

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
    },
  });

  useEffect(() => {
    const nextTodo = getNextTodo();
    setCurrentTodo(() => {
      return nextTodo;
    });
    // TODO : 추후 오프라인일 경우 indexed db에서 현재 투두를 가져와야 할 듯
  }, [todos]);

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
  };

  const getNextTodo = (): TodoEntity | undefined => {
    if (todos) {
      const todayTodos: TodoEntity[] = todos.values().next()
        .value as TodoEntity[];

      if (
        todayTodos != null &&
        getDateInFormat(
          new Date(
            new Date(todayTodos[0].date).getTime() -
              new Date().getTimezoneOffset() * 60000,
          ),
        ) === getDateInFormat(new Date())
      ) {
        setFocusedOnTodo(checkLocalStorageAndGetFocusTime(todayTodos[0]));
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
    }),
    [
      doTodo,
      updateFocus,
      currentTodo,
      focusedOnTodo,
      checkLocalStorageAndGetFocusTime,
    ],
  );

  return useCurrentTodoResult;
};
export default useCurrentTodo;
export { type TodoResponseDto };
