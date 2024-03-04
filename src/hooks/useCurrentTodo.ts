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
    getNextTodo();
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


  const getNextTodo = (): TodoResponseDto => {
    // TODO: 다음 todo를 가져오는 로직 수행
    return {
      id: 1,
      date: '2023-08-08',
      todo: 'Go to grocery store',
      createdAt: new Date('Dec 26, 2022 18:00:30'),
      duration: 6,
      done: false,
      categories: ['영어 학원', '장보기'],
      focusTime: 0,
      order: 1,
    };
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
