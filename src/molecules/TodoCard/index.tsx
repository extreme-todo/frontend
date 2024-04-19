import { ReactEventHandler, useState } from 'react';

import EditUI from './content/EditUI';
import TodoUI from './content/TodoUI';

import { categoryValidation } from '../../shared/inputValidation';

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

  const { id, todo: todoTitle, categories, duration: tomato } = todoData;

  const [{ editMode, editTodoId }, setIsEdit] = useEdit();

  const [showEdit, setShowEdit] = useState(false);
  const [titleValue, setTitleValue] = useState(todoTitle);
  const [categoryArray, setCategoryArray] = useState(categories);
  const [categoryValue, setCategoryValue] = useState(''); // 새로운 카테고리에 대한 input value state
  const [duration, setDuration] = useState(tomato);

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

  const handleCategorySubmit = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.code === 'Enter') {
      // 한글 중복 입력 처리
      if (event.nativeEvent.isComposing) return;

      const newCategory = (event.target as HTMLInputElement).value;

      const trimmed = categoryValidation(newCategory, categoryArray ?? []);

      if (!trimmed) return;

      if (categoryArray) {
        const copy = categoryArray.slice();
        copy.push(trimmed);

        setCategoryArray(copy);
      } else {
        setCategoryArray([trimmed]);
      }

      setCategoryValue('');
    }
  };

  const handleDeleteCategory = (category: string) => {
    setCategoryArray((prev) => {
      const deleted = prev?.filter((tag) => tag !== category) as string[]; // QUESTION event.currentTarget.innerHTML를 바로 넣어주면 에러가 왜 날까?
      return deleted;
    });
  };

  const handleDuration: ReactEventHandler<HTMLSelectElement> = (event) => {
    setDuration(Number(event.currentTarget.value));
  };

  const handleEditCancel = () => {
    setIsEdit({ editMode: false, editTodoId: undefined });
  };
  const handleEditSubmit = (todo: TodoEntity) => {
    mutate(todo);
    setIsEdit({ editMode: false, editTodoId: undefined });
  };

  const renderCard = (() => {
    switch (editMode && editTodoId === id) {
      case true:
        return (
          <EditUI
            todoData={todoData}
            title={titleValue}
            handleChangeTitle={handleChangeTitle}
            category={categoryValue}
            handleChangeCategory={handleChangeCategory}
            handleClickCategory={handleDeleteCategory}
            handleCategorySubmit={handleCategorySubmit}
            categories={categoryArray}
            handleEditCancel={handleEditCancel}
            handleEditSubmit={handleEditSubmit}
            duration={duration}
            handleDuration={handleDuration}
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
