import { useEffect, useState } from 'react';
import { TodoEntity } from '../DB/indexedAction';
import { ETIndexed } from '../DB/indexed';

type TodoResponseDto = TodoEntity;

const useCurrentTodo = () => {
  const [currentTodo, setCurrentTodo] = useState<TodoResponseDto>();
  const [focusedOnTodo, setFocusedOnTodo] = useState<number>(0);
  const localKey = 'currentTodo';
  const db = ETIndexed.getInstance();

  useEffect(() => {
    const checkLocalStorage = async () => {
      const localTodo = localStorage.getItem(localKey);
      if (localTodo != null) {
        setCurrentTodo(JSON.parse(localTodo) as TodoResponseDto);
      } else {
        const nextTodo = await getNextTodo();
        if (nextTodo) {
          setCurrentTodo(nextTodo);
          localStorage.setItem(localKey, JSON.stringify(nextTodo));
        } else {
          setCurrentTodo(undefined);
        }
      }
    };
    checkLocalStorage();
  }, [db]);

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

  const doTodo = async () => {
    if (currentTodo) await db.doTodo(currentTodo?.id, focusedOnTodo.toString());
    await getNextTodo();
    setFocusedOnTodo(0);
  };

  const getNextTodo = async (): Promise<TodoEntity> => {
    if (db) {
      const todolist = await db.getList(false);
      const todayTodos: TodoEntity[] = todolist.values().next()
        .value as TodoEntity[];
      if (todayTodos != null) {
        setCurrentTodo(todayTodos[0]);
        return todayTodos[0];
      } else {
        setCurrentTodo(undefined);
        return {} as TodoEntity;
      }
    } else {
      setCurrentTodo(undefined);
      return {} as TodoEntity;
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
