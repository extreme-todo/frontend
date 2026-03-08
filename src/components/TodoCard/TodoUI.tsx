import styled from '@emotion/styled';
import {
  DraggableProvidedDragHandleProps,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import { TodoEntity } from '../../DB/indexedAction';
import { focusStep } from '../../hooks';
import { formatTime } from '../../shared/timeUtils';
import { RandomTagColorList } from '../../shared/RandomTagColorList';
import { IconAtom, TagAtom, TypoAtom, BtnAtom } from '../../atoms';
import { memo } from 'react';

interface ITodoUIProps {
  todoData: TodoEntity;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  snapshot?: DraggableStateSnapshot;
  focusStep: focusStep;
  randomTagColor: RandomTagColorList;
  isExtreme: boolean;
  isCurrTodo: boolean;
  order: number;
  handleEditButton: () => void;
  handleDeleteButton: () => void;
}

export const TodoUI = memo(
  ({
    todoData,
    dragHandleProps,
    snapshot,
    focusStep,
    randomTagColor,
    isExtreme,
    isCurrTodo,
    order,
    handleEditButton,
    handleDeleteButton,
  }: ITodoUIProps) => {
    const { todo, categories, done, duration } = todoData;
    const isDragging = snapshot?.isDragging;
    const tagColorList = randomTagColor.getColorList;

    return (
      <TodoCardContainer
        isExtreme={isExtreme}
        done={done}
        isCurrTodo={isCurrTodo}
        isThisEdit={false}
      >
        <TitleContainer>
          <div style={{ display: 'flex' }}>
            {!done && (
              <>
                {isCurrTodo ? (
                  <>
                    <IconAtom
                      src="icon/handle.svg"
                      alt="handler"
                      size={1.25}
                      className="handler"
                    />
                    <TypoAtom fontSize="h3" fontColor="primary2">
                      {order}.
                    </TypoAtom>
                  </>
                ) : (
                  <>
                    <div {...dragHandleProps}>
                      <IconAtom
                        src="icon/yellowHandle.svg"
                        alt="handler"
                        size={1.25}
                      />
                    </div>
                    <TypoAtom fontSize="h3" fontColor="primary2">
                      {order}.
                    </TypoAtom>
                  </>
                )}
              </>
            )}
            <TypoAtom className="todoTitle" fontSize="h3" fontColor="primary2">
              {todo}
            </TypoAtom>
          </div>
          {!isCurrTodo && !done && !isDragging && (
            <BtnAtom handleOnClick={handleDeleteButton}>
              <IconAtom src={'icon/delete.svg'} size={1.25} alt="delete" />
            </BtnAtom>
          )}
        </TitleContainer>

        {!isDragging && categories && categories.length !== 0 && (
          <CategoryContainer className="categories" categoryError={false}>
            {categories.map((category) => (
              <TagAtom
                key={category}
                title={category}
                styleOption={{ bg: tagColorList[category], size: 'normal' }}
              >
                {category}
              </TagAtom>
            ))}
          </CategoryContainer>
        )}

        {!isDragging && !done && (
          <FooterContainer>
            <TimeWrapper>
              <IconAtom
                src={
                  isCurrTodo ? 'icon/yellowTimer.svg' : 'icon/yellowTimer.svg'
                }
                alt="timer"
                className="timer"
                size={1.25}
              />
              <TypoAtom fontSize="body" fontColor="primary2">
                {formatTime(focusStep * duration)}
              </TypoAtom>
            </TimeWrapper>
            {isCurrTodo ? (
              <TagAtom
                styleOption={{
                  size: 'normal',
                  bg: 'transparent',
                  borderColor: 'primary2',
                }}
              >
                <TypoAtom fontSize="b2" fontColor="primary2">
                  진행중
                </TypoAtom>
              </TagAtom>
            ) : (
              <BtnAtom handleOnClick={handleEditButton}>
                <TagAtom
                  styleOption={{
                    size: 'normal',
                    bg: 'transparent',
                    borderColor: 'primary2',
                  }}
                  className="edit__button"
                >
                  <TypoAtom fontSize="b2" fontColor="primary2">
                    수정
                  </TypoAtom>
                </TagAtom>
              </BtnAtom>
            )}
          </FooterContainer>
        )}
      </TodoCardContainer>
    );
  },
);

// Reusing styles from TodoCard
const TodoCardContainer = styled.div<{
  done: boolean;
  isExtreme: boolean;
  isCurrTodo: boolean;
  isThisEdit: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem;
  border-radius: 0.875rem;

  background-color: ${({
    isExtreme,
    theme: {
      color: { backgroundColor },
    },
  }) =>
    isExtreme
      ? backgroundColor.light_extreme_dark
      : backgroundColor.dark_primary1};

  color: ${({
    theme: {
      color: { backgroundColor },
    },
  }) => backgroundColor.primary2};

  .todoTitle,
  .categories {
    opacity: ${({ done }) => (done ? 0.4 : 1)};
  }
  .categories {
    margin-left: ${({ done }) => (done ? 0 : '1.25rem')};
  }

  border: ${({
    isCurrTodo,
    theme: {
      color: { backgroundColor },
    },
  }) => isCurrTodo && ` 1px solid ${backgroundColor.primary2}`};
  .handler,
  .timer {
    cursor: auto;
  }
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  column-gap: 4px;
  margin-bottom: 4px;

  & > div {
    display: flex;
  }

  .todoTitle {
    width: 17.125rem;
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
      font-size: ${({ theme }) => theme.fontSize.h2.size};
      -webkit-line-clamp: 3;
    }
  }
`;

const CategoryContainer = styled.div<{
  categoryError: boolean;
}>`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
  column-gap: 0.5rem;
  row-gap: 0.25rem;
`;

const FooterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: 0.5rem;
  .edit__button {
    &:hover {
      background-color: ${({ theme: { button } }) =>
        button.darkBtn.hover.backgroundColor};
    }
    transition: background-color 0.3s ease-in-out;
  }
`;

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.25rem;
`;
