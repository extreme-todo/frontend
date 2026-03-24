import { IconAtom, PopperAtom, TomatoInputAtom, TypoAtom } from '../../atoms';

import {
  FooterContent,
  CategoryContent,
  HandlerIconAndOrder,
  TitleOrInput,
  TopRightCornerIcon,
} from './content';

import { type focusStep, useTodoUpdate } from '../../hooks';

import { TodoEntity } from '../../DB/indexedAction';

import { formatTime } from '../../shared/timeUtils';
import { RandomTagColorList } from '../../shared/RandomTagColorList';

import styled from '@emotion/styled';

interface ITodoCardProps {
  todoData: TodoEntity;
  focusStep: focusStep;
  randomTagColor: RandomTagColorList;
  isExtreme: boolean;
  isCurrTodo: boolean;
  order: number;
  isThisEdit: boolean;
  setEditTodoId: React.Dispatch<React.SetStateAction<string | undefined>>;
  isFirst?: boolean;
  isLast?: boolean;
}

export const TodoCard = ({
  todoData,
  focusStep,
  randomTagColor,
  isCurrTodo,
  order,
  isThisEdit,
  setEditTodoId,
  isExtreme,
  isFirst,
  isLast,
}: ITodoCardProps) => {
  const { todo, categories, done } = todoData;

  const {
    titleValue,
    titleError,
    categoryArray,
    categoryValue,
    categoryError,
    durationValue,
    popperElement,
    setPopperElement,
    showTomatoInput,
    setShowTomatoInput,
    triggerElement,
    setTriggerElement,
    arrowElement,
    setArrowElement,
    isLoading,
    handleEditButton,
    handleEditSubmit,
    handleChangeTitle,
    handleTitleBlur,
    handleEditCancel,
    handleDeleteButton,
    handleAddCategory,
    handleDeleteCategory,
    handleChangeCategory,
    handleTomato,
    handleMoveUp,
    handleMoveDown,
  } = useTodoUpdate({ todoData, setEditTodoId, isThisEdit });

  return (
    <TodoCardContainer
      isExtreme={isExtreme}
      as={isThisEdit ? 'form' : 'div'}
      done={done}
      isCurrTodo={isCurrTodo}
      isThisEdit={isThisEdit}
      onSubmit={handleEditSubmit}
    >
      <MainContent>
        <TitleContainer>
          <div>
            <HandlerIconAndOrder done={done} order={order} />
            <TitleOrInput
              titleValue={titleValue}
              isThisEdit={isThisEdit}
              handleChangeTitle={handleChangeTitle}
              handleBlurTitle={handleTitleBlur}
              todo={todo}
              titleError={titleError}
            />
          </div>
          <TopRightCornerIcon
            isCurrTodo={isCurrTodo}
            done={done}
            isThisEdit={isThisEdit}
            handleEditCancel={handleEditCancel}
            handleDeleteButton={handleDeleteButton}
          />
        </TitleContainer>
        <CategoryContent
          categoryArray={categoryArray}
          handleAddCategory={handleAddCategory}
          handleDeleteCategory={handleDeleteCategory}
          categoryValue={categoryValue}
          handleChangeCategory={handleChangeCategory}
          tagColorList={randomTagColor.getColorList}
          isThisEdit={isThisEdit}
          categories={categories}
          categoryError={categoryError}
        />
        <FooterContent
          done={done}
          isThisEdit={isThisEdit}
          isDisabled={titleValue.length === 0 || titleError || isLoading}
          isSubmitting={isLoading}
          duration={formatTime(focusStep * todoData.duration)}
          handleEditButton={handleEditButton}
          durationValue={durationValue}
          isCurrTodo={isCurrTodo}
          setShowTomatoInput={setShowTomatoInput}
          setTriggerElement={setTriggerElement}
        />
      </MainContent>
      {!done && (
        <OrderButtonsColumn>
          <OrderBtn
            type="button"
            onClick={handleMoveUp}
            disabled={isFirst || isCurrTodo}
            aria-label="move up"
          >
            ▲
          </OrderBtn>
          <OrderBtn
            type="button"
            onClick={handleMoveDown}
            disabled={isLast || isCurrTodo}
            aria-label="move down"
          >
            ▼
          </OrderBtn>
        </OrderButtonsColumn>
      )}
      {showTomatoInput && (
        <PopperAtom
          popperElement={popperElement}
          setPopperElement={setPopperElement}
          triggerElement={triggerElement}
          arrowElement={arrowElement}
          placement={'bottom'}
        >
          <TomatoInputWrapper aria-label="tomatoInput">
            <TomatoInfo>
              <TypoAtom>{formatTime(durationValue * focusStep)}</TypoAtom>
              <TypoAtom>{durationValue}round</TypoAtom>
            </TomatoInfo>
            <TomatoInputAtom
              max={10}
              min={0}
              period={focusStep}
              handleTomato={handleTomato}
              tomato={+durationValue}
              isBalloon={false}
              isLabel={false}
            />
          </TomatoInputWrapper>
          <IconAtom
            id="arrow"
            data-popper-arrow
            ref={setArrowElement}
            h={3.125}
            w={0.875}
            src={'icon/popperArrow.svg'}
          />
        </PopperAtom>
      )}
    </TodoCardContainer>
  );
};

const TodoCardContainer = styled.div<{
  done: boolean;
  isExtreme: boolean;
  isCurrTodo: boolean;
  isThisEdit: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  /* width: 24.5rem; */
  width: 100%;

  box-sizing: border-box;
  padding: 0.75rem;
  border-radius: 0.875rem;

  background-color: ${({
    isThisEdit,
    isExtreme,
    theme: {
      color: { backgroundColor },
    },
  }) =>
    isThisEdit
      ? backgroundColor.primary2
      : isExtreme
      ? backgroundColor.light_extreme_dark
      : backgroundColor.dark_primary1};

  color: ${({
    isThisEdit,
    theme: {
      color: { backgroundColor },
    },
  }) => (isThisEdit ? backgroundColor.primary1 : backgroundColor.primary2)};

  .todoTitle,
  .categories {
    opacity: ${({ done }) => (done ? 0.4 : 1)};
  }
  .categories {
    margin-left: ${({ done }) => (done ? 0 : '1.25rem')};
  }

  .duration {
    border-bottom: ${({
      theme: {
        color: { backgroundColor },
      },
    }) => `1px solid ${backgroundColor.primary1}`};
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

  #arrow {
    position: absolute;
    z-index: -1;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
`;

const OrderButtonsColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-left: 0.5rem;
  padding-left: 0.5rem;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
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
  }

  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: wrap;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .todoTitle {
    width: 17.125rem;
  }

  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    .todoTitle {
      font-size: ${({ theme }) => theme.fontSize.h2.size};
      /* 지정된 줄 수로 제한해서 말 줄임 하기 */
      -webkit-line-clamp: 3;
    }
  }
`;

const TomatoInputWrapper = styled.div`
  background-color: ${({ theme }) => theme.color.backgroundColor.white};
  width: 44.625rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  padding: 1.25rem 1rem;
  border-radius: 1.25rem;
`;

const TomatoInfo = styled.div`
  margin-bottom: 0.8rem;
  & > span:first-of-type {
    margin-right: 0.625rem;
    font-size: ${({ theme: { fontSize } }) => fontSize.h2.size};
    font-weight: ${({ theme: { fontSize } }) => fontSize.h2.weight};
  }
  & > span:last-of-type {
    font-size: ${({ theme: { fontSize } }) => fontSize.b2.size};
    font-weight: ${({ theme: { fontSize } }) => fontSize.b2.weight};
  }
`;
