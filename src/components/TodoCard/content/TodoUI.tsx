import { TagAtom, TypoAtom } from '../../../atoms';

import { ITodoCardProps } from '..';

import styled from '@emotion/styled';

interface ITodoUIProps extends ITodoCardProps {
  handleEditButton: () => void;
  handleDeleteButton: () => void;
}

const TodoUI = ({
  todoData,
  dragHandleProps,
  snapshot,
  handleEditButton,
  handleDeleteButton,
}: ITodoUIProps) => {
  const { todo, categories } = todoData;

  return (
    <TodoCardContainer>
      <DraggableWrapper {...dragHandleProps}>
        <TitleCategoryContainer>
          <TitleContainer>
            <TypoAtom className="todoTitle" fontSize="body">
              {todo}
            </TypoAtom>
          </TitleContainer>
          {snapshot?.isDragging ? null : (
            <CategoryContainer>
              {categories?.map((category) => {
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
          )}
        </TitleCategoryContainer>
      </DraggableWrapper>
      {snapshot?.isDragging ? null : (
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
      )}
    </TodoCardContainer>
  );
};

export default TodoUI;

const TodoCardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  @media all and (min-width: 1080px),
    ${({ theme }) => theme.responsiveDevice.tablet_h},
    ${({ theme }) => theme.responsiveDevice.desktop} {
    &:hover {
      #editWrapper {
        display: flex;
      }
    }
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    overflow-x: hidden;
  }
`;

const DraggableWrapper = styled.div`
  display: flex;
  width: 80%;
`;

const TitleCategoryContainer = styled.div`
  margin-left: 1rem;
`;

const EditWrapper = styled.div`
  display: none;
  gap: 10px;
  background-color: aquamarine;
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    display: flex;
  }
`;

const TitleContainer = styled.div`
  margin-bottom: 0.5rem;
  width: 100%;
  background-color: tomato;

  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: wrap;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    .todoTitle {
      font-size: x-large;
      /* 지정된 줄 수로 제한해서 말 줄임 하기 */
      -webkit-line-clamp: 3;
    }
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
