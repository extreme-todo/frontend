import { useEffect, useState } from 'react';

interface TodoResponseDto {
  id: number;
  date: string;
  todo: string;
  createdAt: Date;
  duration: number;
  done: boolean;
  categories: string[] | null;
  focusTime: number;
  order: number | null;
}

const useCurrentTodo = () => {
  const [currentTodo, setCurrentTodo] = useState<TodoResponseDto>(); // TODO: 나중에 TodoEntity로 타입 픽스
  const localKey = 'currentTodo';

  useEffect(() => {
    const localTodo = localStorage.getItem(localKey);
    if (localTodo != null) {
      setCurrentTodo(JSON.parse(localTodo) as TodoResponseDto);
    } else {
      const tmpTodo = getNextTodo();
      if (tmpTodo) {
        setCurrentTodo(tmpTodo);
        localStorage.setItem(localKey, JSON.stringify(tmpTodo));
      } else {
        setCurrentTodo(undefined);
      }
    }
  }, []);

  const doTodo = () => {
    // TODO: do todo 로직 수행
    getNextTodo();
  };

  const getNextTodo = (): TodoResponseDto => {
    // TODO: 다음 todo를 가져오는 로직 수행
    return {
      id: 1,
      date: '2023-08-08',
      todo: 'Go to grocery store',
      createdAt: new Date('Dec 26, 2022 18:00:30'),
      duration: 60 * 60,
      done: false,
      categories: null,
      focusTime: 0,
      order: 1,
    };
  };

  return {
    doTodo,
    currentTodo,
  };
};
export default useCurrentTodo;
