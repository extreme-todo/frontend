import { IconAtom, TagAtom, TypoAtom } from '../../../atoms';

import { ITodoCardProps } from '..';

import styled from '@emotion/styled';
import { useState } from 'react';
interface ITodoUIProps extends ITodoCardProps {
  handleEditButton: () => void;
  editMode: boolean;
}

const TodoUI = ({
  todoData,
  editMode,
  dragHandleProps,
  snapshot,
  handleEditButton,
}: ITodoUIProps) => {
  const [showEdit, setShowEdit] = useState(false);
  const { todo, categories } = todoData;

  const handleMouseOver = () => {
    setShowEdit(true);
  };

  const handleMouseOut = () => {
    setShowEdit(false);
  };

  return (
    <TodoCardContainer
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <DraggableWrapper>
        {editMode ? (
          <IconAtom size={2}>
            <img src={'icons/handle.svg'}></img>
          </IconAtom>
        ) : (
          <IconAtom {...dragHandleProps} size={2}>
            <img src={'icons/handle.svg'}></img>
          </IconAtom>
        )}
        <TitleCategoryContainer>
          <TitleContainer>
            <TypoAtom fontSize="body">{todo}</TypoAtom>
          </TitleContainer>
          <CategoryContainer>
            {snapshot?.isDragging
              ? null
              : categories?.map((category) => {
                  return (
                    <TagAtom
                      key={category}
                      title={category}
                      styleOption={{
                        fontsize: 'sm',
                        size: 'sm',
                        bg: 'whiteWine',
                        maxWidth: 10,
                      }}
                    >
                      {category}
                    </TagAtom>
                  );
                })}
          </CategoryContainer>
        </TitleCategoryContainer>
      </DraggableWrapper>
      <EditWrapper>
        {showEdit ? (
          <TagAtom
            handler={handleEditButton}
            styleOption={{ fontsize: 'sm', size: 'sm' }}
          >
            수정
          </TagAtom>
        ) : null}
      </EditWrapper>
    </TodoCardContainer>
  );
};

export default TodoUI;

const TodoCardContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DraggableWrapper = styled.div`
  display: flex;
  width: 80%;
`;

const TitleCategoryContainer = styled.div`
  margin-left: 1rem;
  width: 100%;
`;

const EditWrapper = styled.div`
  width: 20%;
  display: flex;
  justify-content: flex-end;
`;

const TitleContainer = styled.div`
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

export const CategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  > div {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;
