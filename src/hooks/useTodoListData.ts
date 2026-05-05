import { useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { todosApi } from '../shared/apis';

/**
 * TodoList 전체의 데이터 페칭 및 관리 로직을 담당하는 커스텀 훅 (조회 전용)
 */
export const useTodoListData = ({ isLogin }: { isLogin: boolean }) => {
  /* --- 1. 데이터 페칭 (React Query) --- */
  // 완료되지 않은 할 일 목록 가져오기
  const { data: todos, isLoading: isTodoLoading } = useQuery(
    ['todos'],
    () => todosApi.getList(false),
    { staleTime: Infinity, enabled: isLogin },
  );

  // 완료된 할 일 목록 가져오기
  const { data: doneTodos, isLoading: isDoneLoading } = useQuery(
    ['doneTodos'],
    () => todosApi.getList(true),
    { staleTime: Infinity, enabled: isLogin },
  );

  /* --- 2. 데이터 가공 (Memoized) --- */
  // API 결과(Map)에서 첫 번째 날짜의 할 일 배열만 추출
  const todoList = useMemo(
    () => todos && Array.from(todos.values())[0],
    [todos],
  );

  const doneTodoList = useMemo(
    () => doneTodos && Array.from(doneTodos.values())[0],
    [doneTodos],
  );

  return {
    todos,
    doneTodos,
    todoList,
    doneTodoList,
    isTodoLoading,
    isDoneLoading,
  };
};
