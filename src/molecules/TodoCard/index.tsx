import EditUI from './content/EditUI';
import TodoUI from './content/TodoUI';

import { useEdit } from '../../hooks';

import { TodoEntity } from '../../DB/indexedAction';
import { ETIndexed } from '../../DB/indexed';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  DraggableProvidedDragHandleProps,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';

interface ITodoCardProps {
  todoData: TodoEntity;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
  snapshot: DraggableStateSnapshot;
}

const TodoCard = ({ todoData, dragHandleProps, snapshot }: ITodoCardProps) => {
  const { id } = todoData;
  const queryClient = useQueryClient();

  // useMutation 요거 구현하기
  const { mutate } = useMutation({
    mutationFn: (todo: TodoEntity) =>
      ETIndexed.getInstance().updateTodo(todo.id, todo),
    onSuccess(data) {
      console.log('\n\n\n ✅ data in TodoCard‘s useMutation ✅ \n\n', data);
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
