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
    const regularCharacterRex =
      /^[a-zA-Z0-9 \u3131-\uD79D\u4E00-\u9FA5\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u20000-\u2A6DF\u2A700-\u2B73F\u2B740-\u2B81F\u2B820-\u2CEAF\u2CEB0-\u2EBEF\u2F800-\u2FA1F]+$/;
    const specialCharactersRex = /[@~₩?><|\\=_^]/;

    if (event.code === 'Enter') {
      if (!!!newCategory.length) return alert('제목을 입력해주세요.');
      // 한글 중복 입력 처리
      if (event.nativeEvent.isComposing) return;
      // 글로벌 문자(영어 포함 한국,중국,일본어)인지 && 특수문자와 이모지 제외처리
      if (
        !regularCharacterRex.test(newCategory) ||
        specialCharactersRex.test(newCategory)
      )
        return alert('특수문자와 이모지는 입력할 수 없습니다.');

      // 5개가 되면 input 창을 사라지게 해서 일단은 없어도 되는 조건
      if (categoryArray?.length === 5)
        return alert('category는 5개까지 입력할 수 있습니다.');

      const trimmed = newCategory.replace(/\s+/g, ' ').trim();

      if (categoryArray?.includes(trimmed))
        return alert('이미 존재하는 카테고리 입니다.');
      if (trimmed.length > 20)
        return alert('20자 이하로만 입력할 수 있습니다.');

      if (categoryArray) {
        const copy = categoryArray.slice();
        copy.push(trimmed);

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
            date={date}
            duration={duration}
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
