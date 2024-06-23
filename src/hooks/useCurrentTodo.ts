import { useEffect, useState } from 'react';
import { TodoEntity } from '../DB/indexedAction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { timerApi, todosApi } from '../shared/apis';

type TodoResponseDto = TodoEntity;

const useCurrentTodo = () => {
  const [currentTodo, setCurrentTodo] = useState<TodoResponseDto>();
  const [focusedOnTodo, setFocusedOnTodo] = useState<number>(0);
  const localKey = 'currentTodo';

  const { data: todos } = useQuery(['todos'], () => todosApi.getList(false), {
    refetchOnWindowFocus: false,
  });

  const quertClient = useQueryClient();

  async function doTodoMutateHandler({
    id,
    focusTime,
  }: {
    id: number;
    focusTime: number;
  }) {
    if (currentTodo) await todosApi.doTodo(id, focusTime);
  }

  const { mutate: doTodoMutate } = useMutation(doTodoMutateHandler, {
    onSuccess: () => {
      quertClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  useEffect(() => {
    const checkLocalStorage = () => {
      const localTodo = localStorage.getItem(localKey);
      if (localTodo != null) {
        setCurrentTodo(JSON.parse(localTodo) as TodoResponseDto);
      } else {
        const nextTodo = getNextTodo(todos);
        if (nextTodo) {
          setCurrentTodo(nextTodo);
          localStorage.setItem(localKey, JSON.stringify(nextTodo));
        } else {
          setCurrentTodo(undefined);
        }
      }
    };
    checkLocalStorage();
  }, [todos]);

  useEffect(() => {
    if (currentTodo != null) {
      localStorage.setItem(localKey, JSON.stringify(currentTodo));
    } else {
      localStorage.removeItem(localKey);
    }
  }, [currentTodo]);

  const updateFocus = (focusedTime: number) => {
    setFocusedOnTodo((prev) => prev + focusedTime);
  };

  const doTodo = () => {
    if (currentTodo)
      doTodoMutate({ id: currentTodo.id, focusTime: focusedOnTodo });
    getNextTodo(todos);
    timerApi.addTotalFocusTime(focusedOnTodo / 60000);
    setFocusedOnTodo(0);
  };

  const getNextTodo = (
    todos: Map<string, TodoEntity[]> | undefined,
  ): TodoEntity | undefined => {
    if (todos) {
      const todayTodos: TodoEntity[] = todos.values().next()
        .value as TodoEntity[];
      if (todayTodos != null) {
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
