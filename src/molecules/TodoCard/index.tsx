import EditUI from './content/EditUI';
import TodoUI from './content/TodoUI';

import { useEdit } from '../../hooks';

import { TodoDate, TodoEntity } from '../../DB/indexedAction';
import { ETIndexed, UpdateTodoDto } from '../../DB/indexed';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  DraggableProvidedDragHandleProps,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import { todosApi } from '../../shared/apis';
import { useCallback } from 'react';

interface ITodoCardProps {
  todoData: TodoEntity;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
  snapshot: DraggableStateSnapshot;
}

const TodoCard = ({ todoData, dragHandleProps, snapshot }: ITodoCardProps) => {
  const { id, date: prevDate } = todoData;
  const queryClient = useQueryClient();

  const updateMutationHandler = useCallback(
    async ({
      newTodo,
      id,
      prevDate,
    }: {
      newTodo: UpdateTodoDto;
      id: number;
      // prevDate: TodoDate;
      prevDate: string;
    }) => {
      if (newTodo === prevDate) {
        await todosApi.updateTodo(id, newTodo);
      } else {
        const mapTodos = queryClient.getQueryData(['todos']) as Map<
          string,
          TodoEntity[]
        >;
        const arrayTodos = Array.from(mapTodos.values()).flat();
        const { order: prevOrder } = arrayTodos.find(
          (todo) => todo.id === id,
        ) as TodoEntity;
        const searchDate = arrayTodos
          .reverse()
          .find(
            (todo) =>
              new Date(`${todo.date} 00:00:00`) <=
              new Date(`${newTodo.date as string} 00:00:00`),
          ) as TodoEntity;
        let newOrder: number;
        if (!searchDate) {
          newOrder = 1;
        } else if ((prevOrder as number) > (searchDate.order as number)) {
          newOrder = (searchDate.order as number) + 1;
        } else {
          newOrder = searchDate.order as number;
        }
        await todosApi.updateTodo(id, newTodo);
        if (prevOrder !== newOrder) {
          await todosApi.reorderTodos(prevOrder as number, newOrder);
        }
      }
    },
    [queryClient],
  );

  const { mutate: updateMutate } = useMutation({
    mutationFn: updateMutationHandler,
    onSuccess(data) {
      console.debug('\n\n\n ✅ data in TodoCard‘s useMutation ✅ \n\n', data);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError(error) {
      console.debug('\n\n\n 🚨 error in TodoCard‘s useMutation 🚨 \n\n', error);
    },
  });

  const [{ editMode, editTodoId }, setIsEdit] = useEdit();

  const handleEditButton = () => {
    setIsEdit({ editMode: true, editTodoId: id });
  };

  const handleEditSubmit = (newTodo: UpdateTodoDto) => {
    updateMutate({ newTodo, id, prevDate });
    setIsEdit({ editMode: false, editTodoId: undefined });
  };

  const handleEditCancel = () => {
    setIsEdit({ editMode: false, editTodoId: undefined });
  };

  const renderCard = (() => {
    switch (editMode && editTodoId === id) {
      case true:
        return (
          <EditUI
            todoData={todoData}
            handleEditCancel={handleEditCancel}
            handleEditSubmit={handleEditSubmit}
          />
        );
      case false:
        return (
          <TodoUI
            dragHandleProps={dragHandleProps}
            snapshot={snapshot}
            todoData={todoData}
            editMode={editMode}
            handleEditButton={handleEditButton}
          />
        );
    }
  })();

  return renderCard;
};

export default TodoCard;
export type { ITodoCardProps };
