import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todosApi } from '../shared/apis';
import { TodoEntity } from '../DB/indexedAction';
import { UpdateDto } from '../DB/indexed';

interface UseTodoMutationProps {
  todoData: TodoEntity;
  setEditTodoId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface MutationContext {
  previousTodos: Map<string, TodoEntity[]> | undefined;
}

export const useTodoMutation = ({
  todoData,
  setEditTodoId,
}: UseTodoMutationProps) => {
  const { id } = todoData;
  const queryClient = useQueryClient();

  const updateTodoCache = useCallback(
    (
      updateFn: (
        oldData: Map<string, TodoEntity[]>,
      ) => Map<string, TodoEntity[]>,
    ) => {
      queryClient.setQueryData<Map<string, TodoEntity[]> | undefined>(
        ['todos'],
        (oldData) => {
          if (!oldData) return oldData;
          return updateFn(new Map(oldData));
        },
      );
    },
    [queryClient],
  );

  const { mutate: reorderMutate } = useMutation<
    void,
    unknown,
    {
      prevOrder: number;
      newOrder: number;
      todolist?: Map<string, TodoEntity[]>;
    },
    MutationContext
  >(({ prevOrder, newOrder }) => todosApi.reorderTodos(prevOrder, newOrder), {
    onMutate: async ({ todolist }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData<Map<string, TodoEntity[]>>(
        ['todos'],
      );
      if (todolist) queryClient.setQueryData(['todos'], todolist);
      return { previousTodos };
    },
    onError: (_, __, context) => {
      if (context?.previousTodos)
        queryClient.setQueryData(['todos'], context.previousTodos);
    },
  });

  const { mutate: updateMutate, isLoading } = useMutation<
    void,
    unknown,
    { newTodo: UpdateDto; id: string; prevDate: string },
    MutationContext
  >({
    mutationFn: async ({ newTodo, id, prevDate }) => {
      if (newTodo.date === prevDate) {
        await todosApi.updateTodo(id, newTodo);
      } else {
        const mapTodos = queryClient.getQueryData(['todos']) as Map<
          string,
          TodoEntity[]
        >;
        const arrayTodos = Array.from(mapTodos.values()).flat();
        const { order: prevOrder } = arrayTodos.find(
          (t) => t.id === id,
        ) as TodoEntity;
        const searchDate = [...arrayTodos]
          .reverse()
          .find((t) => t.date <= newTodo.date) as TodoEntity;

        const newOrder = !searchDate
          ? 1
          : (prevOrder as number) > (searchDate.order as number)
          ? (searchDate.order as number) + 1
          : (searchDate.order as number);
        await todosApi.updateTodo(id, newTodo);
        if (prevOrder !== newOrder)
          await todosApi.reorderTodos(prevOrder as number, newOrder);
      }
    },
    onMutate: async ({ newTodo, id }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData<Map<string, TodoEntity[]>>(
        ['todos'],
      );
      updateTodoCache((todoMap) => {
        Array.from(todoMap.entries()).forEach(([date, todos]) => {
          const updatedTodos = todos.map((t) =>
            t.id === id ? { ...t, ...newTodo } : t,
          );
          todoMap.set(date, updatedTodos);
        });
        return todoMap;
      });
      return { previousTodos };
    },
    onSuccess: () => setEditTodoId(undefined),
    onError: (_, __, context) => {
      if (context?.previousTodos)
        queryClient.setQueryData(['todos'], context.previousTodos);
    },
  });

  const { mutate: deleteMutate } = useMutation<
    void,
    unknown,
    { id: string },
    MutationContext
  >({
    mutationFn: ({ id }) => todosApi.deleteTodo(id),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData<Map<string, TodoEntity[]>>(
        ['todos'],
      );
      updateTodoCache((todoMap) => {
        Array.from(todoMap.entries()).forEach(([date, todos]) => {
          const updatedTodos = todos.filter((t) => t.id !== id);
          todoMap.set(date, updatedTodos);
        });
        return todoMap;
      });
      return { previousTodos };
    },
    onError: (_, __, context) => {
      if (context?.previousTodos)
        queryClient.setQueryData(['todos'], context.previousTodos);
    },
  });

  const moveReorderHandler = useCallback(
    (direction: 'up' | 'down') => {
      const todos = queryClient.getQueryData<Map<string, TodoEntity[]>>([
        'todos',
      ]);
      if (!todos) return;
      const copyMapTodo = new Map(todos);
      const dateKey = Array.from(copyMapTodo.keys())[0];
      const copyTodo = (copyMapTodo.get(dateKey) ?? []).slice();
      const idx = copyTodo.findIndex((t) => t.id === id);
      if (idx === -1) return;

      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= copyTodo.length) return;

      const prevOrder = todoData.order as number;
      const newOrder = copyTodo[swapIdx].order as number;
      [copyTodo[idx], copyTodo[swapIdx]] = [copyTodo[swapIdx], copyTodo[idx]];
      copyMapTodo.set(dateKey, copyTodo);
      reorderMutate({ prevOrder, newOrder, todolist: copyMapTodo });
    },
    [id, todoData.order, queryClient, reorderMutate],
  );

  return { updateMutate, deleteMutate, moveReorderHandler, isLoading };
};
