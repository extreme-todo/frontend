import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoDate, TodoEntity } from '../DB/indexedAction';
import { ETIndexed } from '../DB/indexed';

// ordering
const useOrderingMutation = () => {
  const db = new ETIndexed();
  const queryClient = useQueryClient();
  const mutationHandler = async ({
    prevOrder,
    newOrder,
    id,
    newDate,
  }: {
    prevOrder: number;
    newOrder: number;
    id?: number;
    newDate?: TodoDate;
    todolist?: Map<string, TodoEntity[]>;
  }) => {
    if (!newDate || !id) {
      await db.orderTodos(prevOrder, newOrder);
    } else {
      await db.updateTodo(id, { date: newDate });
      await db.orderTodos(prevOrder, newOrder);
    }
  };
  const { mutate } = useMutation(mutationHandler, {
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError(_err: any, _: any, context) {
      console.log(context);
      queryClient.setQueryData(['todos'], context);
    },
    onMutate({
      todolist,
    }: {
      prevOrder: number;
      newOrder: number;
      id?: number;
      newDate?: TodoDate;
      todolist?: Map<string, TodoEntity[]>;
    }) {
      queryClient.cancelQueries({ queryKey: ['todos'] });
      const prevTodoList = queryClient.getQueryData(['todos']);
      queryClient.setQueryData(['todos'], todolist);
      return prevTodoList;
    },
  });

  return mutate;
};

export { useOrderingMutation };
