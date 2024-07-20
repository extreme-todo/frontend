import { useEffect, useState } from 'react';
import { TodoEntity } from '../DB/indexedAction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { timerApi, todosApi } from '../shared/apis';
import { getDateInFormat } from '../shared/timeUtils';

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
    if (nextTodo) {
      setCurrentTodo(nextTodo);
    } else {
      setCurrentTodo(undefined);
    }
    // TODO : 추후 오프라인일 경우 indexed db에서 현재 투두를 가져와야 할 듯
  }, [todos]);

  const updateFocus = (focusedTime: number) => {
    setFocusedOnTodo((prev) => prev + focusedTime);
  };

  const doTodo = () => {
    if (currentTodo)
      doTodoMutate({ id: currentTodo.id, focusTime: focusedOnTodo });
    getNextTodo();
    timerApi.addTotalFocusTime(focusedOnTodo / 60000);
    setFocusedOnTodo(0);
  };

  const getNextTodo = (): TodoEntity | undefined => {
    if (todos) {
      const todayTodos: TodoEntity[] = todos.values().next()
        .value as TodoEntity[];
      console.log(todayTodos);

      if (
        todayTodos != null &&
        getDateInFormat(new Date(todayTodos[0].date)) ===
          getDateInFormat(new Date())
      ) {
        setCurrentTodo(todayTodos[0]);
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

  return {
    doTodo,
    updateFocus,
    currentTodo,
    focusedOnTodo,
  };
};
export default useCurrentTodo;
export { type TodoResponseDto };
