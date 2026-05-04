import styled from '@emotion/styled';
import { TodoEntity } from '../../DB/indexedAction';
import { focusStep } from '../../hooks';
import { formatTime } from '../../shared/timeUtils';
import { RandomTagColorList } from '../../shared/RandomTagColorList';
import { IconAtom, TagAtom, TypoAtom, BtnAtom } from '../../atoms';
import { memo } from 'react';
import { SideBtnAtom } from '../../atoms/SideBtnAtom';

interface ITodoUIProps {
  todoData: TodoEntity;
  focusStep: focusStep;
  randomTagColor: RandomTagColorList;
  isExtreme: boolean;
  isCurrTodo: boolean;
  order: number;
  handleEditButton: () => void;
  handleDeleteButton: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const TodoCardContainer = styled.div<{
  done: boolean;
  isExtreme: boolean;
  isCurrTodo: boolean;
  isThisEdit: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: stretch;
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

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
`;

const OrderButtonsColumn = styled.div<{ isExtreme: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 0.5rem;
  margin-left: 0.5rem;
  padding-left: 0.5rem;
  border-left: 1px solid
    ${({ isExtreme }) =>
      isExtreme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)'};
`;

const OrderBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.backgroundColor.primary2};
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  line-height: 1;

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    opacity: 0.7;
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
    flex: 1;
    min-width: 0;
  }

  .order-text {
    margin-right: 0.25rem;
  }

  .todoTitle {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-all;
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

const FooterContainer = styled.div<{ isExtreme: boolean }>`
  display: flex;
  justify-content: flex-end;
  column-gap: 0.5rem;
`;

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.25rem;
`;

export const TodoUI = memo(
  ({
    todoData,
    focusStep,
    randomTagColor,
    isExtreme,
    isCurrTodo,
    order,
    handleEditButton,
    handleDeleteButton,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
  }: ITodoUIProps) => {
    const { todo, categories, done, duration } = todoData;
    const tagColorList = randomTagColor.getColorList;

    return (
      <TodoCardContainer
        isExtreme={isExtreme}
        done={done}
        isCurrTodo={isCurrTodo}
        isThisEdit={false}
      >
        <MainContent>
          <TitleContainer>
            <div style={{ display: 'flex' }}>
              {!done && (
                <TypoAtom
                  fontSize="h3"
                  fontColor="primary2"
                  className="order-text"
                >
                  {order}.
                </TypoAtom>
              )}
              <TypoAtom
                className="todoTitle"
                fontSize="h3"
                fontColor="primary2"
              >
                {todo}
              </TypoAtom>
            </div>
            {!isCurrTodo && !done && (
              <BtnAtom handleOnClick={handleDeleteButton}>
                <IconAtom src={'icon/delete.svg'} size={1.25} alt="delete" />
              </BtnAtom>
            )}
          </TitleContainer>

          {categories && categories.length !== 0 && (
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

          {!done && (
            <FooterContainer isExtreme={isExtreme}>
              <TimeWrapper>
                <IconAtom
                  src={'icon/yellowTimer.svg'}
                  alt="timer"
                  className="timer"
                  size={1.25}
                />
                <TypoAtom fontSize="body" fontColor="primary2">
                  {formatTime(focusStep * duration)}
                </TypoAtom>
              </TimeWrapper>
              {isCurrTodo ? (
                <SideBtnAtom
                  btnStyle={isExtreme ? 'extremeDarkBtn' : 'darkBtn'}
                  disabled
                  width="5.625rem"
                >
                  진행중
                </SideBtnAtom>
              ) : (
                <SideBtnAtom
                  btnStyle={isExtreme ? 'extremeDarkBtn' : 'darkBtn'}
                  onClick={handleEditButton}
                  width="5.625rem"
                >
                  수정
                </SideBtnAtom>
              )}
            </FooterContainer>
          )}
        </MainContent>

        {!done && (
          <OrderButtonsColumn isExtreme={isExtreme}>
            <OrderBtn
              type="button"
              onClick={onMoveUp}
              disabled={isFirst || isCurrTodo || !onMoveUp}
              aria-label="move up"
            >
              ▲
            </OrderBtn>
            <OrderBtn
              type="button"
              onClick={onMoveDown}
              disabled={isLast || isCurrTodo || !onMoveDown}
              aria-label="move down"
            >
              ▼
            </OrderBtn>
          </OrderButtonsColumn>
        )}
      </TodoCardContainer>
    );
  },
);
