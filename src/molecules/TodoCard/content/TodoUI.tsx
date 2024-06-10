import { IconAtom, TagAtom, TypoAtom } from '../../../atoms';

import { ITodoCardProps } from '..';

import styled from '@emotion/styled';
interface ITodoUIProps extends ITodoCardProps {
  handleEditButton: () => void;
  handleDeleteButton: () => void;
  editMode: boolean;
}

const TodoUI = ({
  todoData,
  editMode,
  dragHandleProps,
  snapshot,
  handleEditButton,
  handleDeleteButton,
}: ITodoUIProps) => {
  const { todo, categories } = todoData;

  return (
    <TodoCardContainer>
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
      <EditWrapper id="editWrapper">
        <TagAtom
          handler={handleEditButton}
          styleOption={{ fontsize: 'sm', size: 'sm' }}
        >
          수정
        </TagAtom>
        <TagAtom
          handler={handleDeleteButton}
          styleOption={{ fontsize: 'sm', size: 'sm' }}
        >
          삭제
        </TagAtom>
      </EditWrapper>
    </TodoCardContainer>
  );
};

export default TodoUI;

const TodoCardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  &:hover {
    #editWrapper {
      display: flex;
    }
  }
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
  display: none;
  justify-content: flex-end;
  gap: 10px;
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
