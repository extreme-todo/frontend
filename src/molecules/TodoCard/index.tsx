import { TodoEntity } from '../../DB/indexedAction';

import {
  DraggableProvidedDragHandleProps,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import EditUI from './content/EditUI';
import { useEdit } from '../../hooks';
import TodoUI from './content/TodoUI';
import { useState } from 'react';

interface ITodoCardProps {
  todoData: TodoEntity;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
  snapshot: DraggableStateSnapshot;
}

const TodoCard = ({ todoData, dragHandleProps, snapshot }: ITodoCardProps) => {
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

  const [showEdit, setShowEdit] = useState(false);
  const [{ editMode, editTodoId }, setIsEdit] = useEdit();
  const [titleValue, setTitleValue] = useState(todo);
  const [categoryArray, setCategoryArray] = useState(categories);
  const [categoryValue, setCategoryValue] = useState('');

  const handleMouseOver = () => {
    setShowEdit(true);
  };

  const handleMouseOut = () => {
    setShowEdit(false);
  };

  const handleEditButton = () => {
    setIsEdit({ editMode: true, editTodoId: id });
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(event.target.value);
  };

  const handleChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryValue(event.target.value);
  };

  const handleSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const newCategory = (event.target as HTMLInputElement).value;
    if (!!!newCategory.length) return;
    if (categoryArray?.includes(newCategory)) return;
    if (event.code === 'Enter') {
      if (categoryArray) {
        const copy = categoryArray.slice();
        copy.push(newCategory);

        setCategoryArray(copy);
      } else {
        setCategoryArray([newCategory]);
      }

      setCategoryValue('');
    }
  };

  const handleClickTag = (category: string) => {
    setCategoryArray((prev) => {
      const deleted = prev?.filter((tag) => tag !== category) as string[]; // QUESTION event.currentTarget.innerHTML를 바로 넣어주면 에러가 왜 날까?
      return deleted;
    });
  };

  const renderCard = (() => {
    switch (editMode && editTodoId === id) {
      case true:
        return (
          <EditUI
            handleSubmit={handleSubmit}
            title={titleValue}
            handleChangeTitle={handleChangeTitle}
            category={categoryValue}
            handleChangeCategory={handleChangeCategory}
            categories={categoryArray}
            handleClickTag={handleClickTag}
          />
        );
      case false:
        return (
          <TodoUI
            dragHandleProps={dragHandleProps}
            snapshot={snapshot}
            todoData={todoData}
            editMode={editMode}
            showEdit={showEdit}
            handleMouseOut={handleMouseOut}
            handleMouseOver={handleMouseOver}
            handleEditButton={handleEditButton}
          />
        );
    }
  })();

  return renderCard;
};

export default TodoCard;
export type { ITodoCardProps };
