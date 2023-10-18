import { useState } from 'react';

import { IconAtom, TagAtom, TypoAtom } from '../atoms';

import { TodoEntity } from '../DB/indexedAction';

import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import styled from '@emotion/styled';

interface ITodoCardProps {
  todoData: TodoEntity;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

const TodoCard = ({ todoData, dragHandleProps }: ITodoCardProps) => {
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
  const onMouseOverHandler = () => {
    setShowEdit(true);
  };
  const onMouseOutHandler = () => {
    setShowEdit(false);
  };

  return (
    <TodoCardContainer
      onMouseOver={onMouseOverHandler}
      onMouseOut={onMouseOutHandler}
    >
      <IconAtom {...dragHandleProps} size={2}>
        <img src={'icons/handle.svg'}></img>
      </IconAtom>
      <div>
        <TypoAtom>{todo}</TypoAtom>
        <TodoCategoryContainer>
          {categories?.map((category) => {
            return (
              <TagAtom
                key={category}
                styleOption={{
                  fontsize: 'sm',
                  size: 'sm',
                  bg: 'lightGrey_2',
                }}
              >
                {category}
              </TagAtom>
            );
          })}
        </TodoCategoryContainer>
      </div>
      {showEdit ? (
        <TagAtom styleOption={{ fontsize: 'sm', size: 'sm' }}>수정</TagAtom>
      ) : null}
    </TodoCardContainer>
  );
};

export default TodoCard;

const TodoCardContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 1rem;
`;
const TodoCategoryContainer = styled.div`
  display: flex;
`;
