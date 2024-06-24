import { useEffect, useState } from 'react';
import { TodoEntity } from '../DB/indexedAction';
import { useQuery } from '@tanstack/react-query';
import { timerApi, todosApi } from '../shared/apis';

type TodoResponseDto = TodoEntity;

const useCurrentTodo = () => {
  const [currentTodo, setCurrentTodo] = useState<TodoResponseDto>();
  const [focusedOnTodo, setFocusedOnTodo] = useState<number>(0);
  const localKey = 'currentTodo';

  const { data: todos } = useQuery(['todos'], () => todosApi.getList(false), {
  });

  useEffect(() => {
    const checkLocalStorage = () => {
      const localTodo = localStorage.getItem(localKey);
      if (localTodo != null) {
        setCurrentTodo(JSON.parse(localTodo) as TodoResponseDto);
      } else {
        const nextTodo = getNextTodo();
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
    // if (currentTodo) await todosApi.doTodo(currentTodo?.id, focusedOnTodo.toString());
    getNextTodo();
    timerApi.addTotalFocusTime(focusedOnTodo / 60000);
    setFocusedOnTodo(0);
  };

  const getNextTodo = (): TodoEntity | undefined => {
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
