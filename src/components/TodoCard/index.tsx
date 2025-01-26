import { useCallback } from 'react';
import EditUI from './content/EditUI';
import TodoUI from './content/TodoUI';

import { useEdit } from '../../hooks';

import { todosApi } from '../../shared/apis';
import { TodoEntity } from '../../DB/indexedAction';
import { ETIndexed, UpdateTodoDto } from '../../DB/indexed';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DraggableProvidedDragHandleProps,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import { focusStep } from '../../hooks/usePomodoro';
import { TagColorName } from '../../styles/emotion';

interface ITodoCardProps {
  todoData: TodoEntity;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
  snapshot: DraggableStateSnapshot;
  focusStep: focusStep;
  randomTagColor: Record<string, TagColorName>;
  isCurrTodo: boolean;
}

const TodoCard = ({
  todoData,
  dragHandleProps,
  snapshot,
  focusStep,
  randomTagColor,
  isCurrTodo,
}: ITodoCardProps) => {
  const { id, date: prevDate } = todoData;
  const queryClient = useQueryClient();

  const updateMutationHandler = useCallback(
    async ({
      newTodo,
      id,
      prevDate,
    }: {
      newTodo: UpdateTodoDto;
      id: string;
      prevDate: string;
    }) => {
      if (newTodo.date === prevDate) {
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
          .find((todo) => todo.date <= (newTodo.date as string)) as TodoEntity;
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
      console.debug('\n\n\n ✅ data in TodoCard‘s updateTodos ✅ \n\n', data);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError(error) {
      console.debug('\n\n\n 🚨 error in TodoCard‘s updateTodos 🚨 \n\n', error);
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: ({ id }: { id: string }) => todosApi.deleteTodo(id),
    onSuccess(data) {
      console.debug('\n\n\n ✅ data in TodoCard‘s deleteTodo ✅ \n\n', data);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError(error) {
      console.debug('\n\n\n 🚨 error in TodoCard‘s deleteTodo 🚨 \n\n', error);
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

  const handleDeleteButton = () => {
    deleteMutate({ id });
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
            handleEditButton={handleEditButton}
            handleDeleteButton={handleDeleteButton}
            focusStep={focusStep}
            randomTagColor={randomTagColor}
            isCurrTodo={isCurrTodo}
          />
        );
    }
  })();

  return renderCard;
};

export default TodoCard;
export type { ITodoCardProps };
