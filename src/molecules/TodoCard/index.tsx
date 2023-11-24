import { TodoEntity } from '../../DB/indexedAction';

import {
  DraggableProvidedDragHandleProps,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import EditUI from './content/EditUI';
import { useEdit } from '../../hooks';
import TodoUI from './content/TodoUI';

interface ITodoCardProps {
  todoData: TodoEntity;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
  snapshot: DraggableStateSnapshot;
}

const TodoCard = ({ todoData, dragHandleProps, snapshot }: ITodoCardProps) => {
  const [{ editMode, editTodoId }] = useEdit();
  const {
    id,
    date,
    todo,
    createdAt,
    duration,
    done,
    categories,
    focusTime,
    order,
  } = todoData;

  const renderCard = () => {
    switch (editMode && editTodoId === id) {
      case true:
        return <EditUI todoData={todoData} />;
      case false:
        return (
          <TodoUI
            dragHandleProps={dragHandleProps}
            snapshot={snapshot}
            todoData={todoData}
          />
        );
    }
  };

  return renderCard();
};

export default TodoCard;
export type { ITodoCardProps };
