import { useEffect, useState } from 'react';
import { TodoEntity } from '../DB/indexedAction';
import { ETIndexed } from '../DB/indexed';

type TodoResponseDto = TodoEntity;

const useCurrentTodo = () => {
  const [currentTodo, setCurrentTodo] = useState<TodoResponseDto>(); // TODO: 나중에 TodoEntity로 타입 픽스
  const localKey = 'currentTodo';
  const db = ETIndexed.getInstance();

  useEffect(() => {
    const checkLocalStorage = async () => {
      const localTodo = localStorage.getItem(localKey);
      if (localTodo != null) {
        setCurrentTodo(JSON.parse(localTodo) as TodoResponseDto);
      } else {
        const tmpTodo = await getNextTodo();
        if (tmpTodo) {
          setCurrentTodo(tmpTodo);
          localStorage.setItem(localKey, JSON.stringify(tmpTodo));
        } else {
          setCurrentTodo(undefined);
        }
      }
    };
    checkLocalStorage();
    getNextTodo();
  }, [db]);

  const doTodo = (focusTime: number) => {
    console.log('🔥 do todo!!!');

    if (currentTodo) db.doTodo(currentTodo?.id, focusTime.toString());
    getNextTodo();
  };

  const getNextTodo = async (): Promise<TodoEntity> => {
    console.log('🔥 get next todo');

    if (db) {
      const todolist = await db.getList(false);
      const todayTodos: TodoEntity[] = todolist.values().next()
        .value as TodoEntity[];
      setCurrentTodo(todayTodos[0]);
      return todayTodos[0];
    } else {
      return {} as TodoEntity;
    }
  };

  return {
    doTodo,
    currentTodo,
  };
};
export default useCurrentTodo;
