import { useState } from 'react';

import { IconAtom, TagAtom, TypoAtom } from '../atoms';

import { TodoEntity } from '../DB/indexedAction';

import {
  DraggableProvidedDragHandleProps,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import styled from '@emotion/styled';

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
      <DraggableWrapper>
        <IconAtom {...dragHandleProps} size={2}>
          <img src={'icons/handle.svg'}></img>
        </IconAtom>
        <TitleCategoryContainer>
          <TitleContainer>
            <TypoAtom title={todo} fontSize="body">
              {todo}
            </TypoAtom>
          </TitleContainer>
          <CategoryContainer>
            {!snapshot.isDragging
              ? categories?.map((category) => {
                  return (
                    <TagAtom
                      key={category}
                      title={category}
                      styleOption={{
                        fontsize: 'sm',
                        size: 'sm',
                        bg: 'lightGrey_2',
                        maxWidth: 10,
                      }}
                    >
                      {category}
                    </TagAtom>
                  );
                })
              : null}
          </CategoryContainer>
        </TitleCategoryContainer>
      </DraggableWrapper>
      <EditWrapper>
        {showEdit ? (
          <TagAtom styleOption={{ fontsize: 'sm', size: 'sm' }}>수정</TagAtom>
        ) : null}
      </EditWrapper>
    </TodoCardContainer>
  );
};

export default TodoCard;

const TodoCardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #5db1ff;
`;

const DraggableWrapper = styled.div`
  display: flex;
  width: 80%;
  background-color: mintcream;
`;

const TitleCategoryContainer = styled.div`
  margin-left: 1rem;
  width: 100%;
`;

const EditWrapper = styled.div`
  width: 20%;
  display: flex;
  justify-content: flex-end;
  background-color: #f3cef3;
`;

const TitleContainer = styled.div`
  background-color: #ff8888;
  margin-bottom: 0.5rem;
  width: 100%;

  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    width: 90%;
  }
`;

const CategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  > div {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;
