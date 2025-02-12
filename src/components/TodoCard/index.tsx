import {
  ReactEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  BtnAtom,
  IconAtom,
  InputAtom,
  PopperAtom,
  TagAtom,
  TomatoInput,
  TypoAtom,
} from '../../atoms';
import { CategoryInput } from '../../molecules';

import { useEdit } from '../../hooks';
import { focusStep } from '../../hooks/usePomodoro';

import { todosApi } from '../../shared/apis';
import { TodoEntity } from '../../DB/indexedAction';
import { ETIndexed, UpdateTodoDto } from '../../DB/indexed';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  DraggableProvidedDragHandleProps,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';

import { formatTime } from '../../shared/timeUtils';
import { categoryValidation } from '../../shared/inputValidation';

import { RandomTagColorList } from '../../shared/RandomTagColorList';
import { TagColorName } from '../../styles/emotion';
import styled from '@emotion/styled';

interface ITodoCardProps {
  todoData: TodoEntity;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  snapshot?: DraggableStateSnapshot;
  focusStep: focusStep;
  randomTagColor: Record<string, TagColorName>;
  isCurrTodo: boolean;
  order: number;
}

// TODO : 조금 있다가 TodoList에서 RandomTagColorList.getInstance()를 내리도록 하기
const tagColorList = RandomTagColorList.getInstance().getColorList;

const TodoCard = ({
  todoData,
  dragHandleProps,
  snapshot,
  focusStep,
  randomTagColor,
  isCurrTodo,
  order,
}: ITodoCardProps) => {
  const { id, date: prevDate, todo, categories, done, duration } = todoData;
  const [editTodoId, setEditTodoId] = useEdit();
  const isThisEdit = useMemo(
    () => (editTodoId ? editTodoId === id : false),
    [editTodoId, id],
  );

  const [titleValue, setTitleValue] = useState(todo);
  const [categoryArray, setCategoryArray] = useState(categories ?? null);
  const [categoryValue, setCategoryValue] = useState('');
  const [durationValue, setDurationValue] = useState(duration);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [showTomatoInput, setShowTomatoInput] = useState(false);
  const [triggerElement, setTriggerElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const editData = useMemo(
    () => ({
      categories: categoryArray,
      todo: titleValue,
      duration: durationValue,
    }),
    [categoryArray, titleValue, durationValue],
  );

  // apis
  const queryClient = useQueryClient();

  const updateMutationHandler = useCallback(
    async ({
      newTodo,
      id,
      prevDate,
    }: {
      newTodo: UpdateTodoDto;
      id: string;
      prevDate: string;
    }) => {
      if (newTodo.date === prevDate) {
        await todosApi.updateTodo(id, newTodo);
      } else {
        const mapTodos = queryClient.getQueryData(['todos']) as Map<
          string,
          TodoEntity[]
        >;
        const arrayTodos = Array.from(mapTodos.values()).flat();
        const { order: prevOrder } = arrayTodos.find(
          (todo) => todo.id === id,
        ) as TodoEntity;
        const searchDate = arrayTodos
          .reverse()
          .find((todo) => todo.date <= (newTodo.date as string)) as TodoEntity;
        let newOrder: number;
        if (!searchDate) {
          newOrder = 1;
        } else if ((prevOrder as number) > (searchDate.order as number)) {
          newOrder = (searchDate.order as number) + 1;
        } else {
          newOrder = searchDate.order as number;
        }
        await todosApi.updateTodo(id, newTodo);
        if (prevOrder !== newOrder) {
          await todosApi.reorderTodos(prevOrder as number, newOrder);
        }
      }
    },
    [queryClient],
  );

  const { mutate: updateMutate } = useMutation({
    mutationFn: updateMutationHandler,
    onSuccess(data) {
      console.debug('\n\n\n ✅ data in TodoCard‘s updateTodos ✅ \n\n', data);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError(error) {
      console.debug('\n\n\n 🚨 error in TodoCard‘s updateTodos 🚨 \n\n', error);
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: ({ id }: { id: string }) => todosApi.deleteTodo(id),
    onSuccess(data) {
      console.debug('\n\n\n ✅ data in TodoCard‘s deleteTodo ✅ \n\n', data);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError(error) {
      console.debug('\n\n\n 🚨 error in TodoCard‘s deleteTodo 🚨 \n\n', error);
    },
  });

  // handlers
  const handleEditButton = () => {
    setEditTodoId(id);
  };

  const handleEditSubmit = () => {
    updateMutate({ newTodo: editData, id, prevDate });
    setEditTodoId(undefined);
  };

  const handleChangeTitle: ReactEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setTitleValue(event.currentTarget.value);
    },
    [],
  );

  // TODO : TodoList 단에서 key를 새로 할당해서 상태 초기화가 될 수 있도록 하자!
  const handleEditCancel = () => {
    setEditTodoId(undefined);
    setTitleValue(todo);
    setCategoryArray(categories);
    setDurationValue(duration);
  };

  const handleDeleteButton = () => {
    deleteMutate({ id });
  };

  const handleAddCategory = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
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
    },
    [categoryArray],
  );

  const handleDeleteCategory = useCallback((category: string) => {
    setCategoryArray((prev) => {
      const deleted = prev?.filter((tag) => {
        return tag !== category;
      }) as string[]; // QUESTION event.currentTarget.innerHTML를 바로 넣어주면 에러가 왜 날까?

      if (deleted.length === 0) return null;
      return deleted;
    });
  }, []);

  const handleChangeCategory = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCategoryValue(event.target.value);
    },
    [],
  );

  const handleTomato = useCallback(
    (count: number) => setDurationValue(count),
    [],
  );

  const handleClickBackgroundToCloseTomatoInput = useCallback(
    (event: Event) => {
      if (popperElement && !popperElement.contains(event.target as Node)) {
        setShowTomatoInput(false);
      }
    },
    [popperElement],
  );

  // UI
  const HandlerIconAndOrder = useCallback(
    ({
      isCurrTodo,
      isEditMode,
      isThisEdit,
      done,
    }: {
      isCurrTodo: boolean;
      isEditMode: boolean;
      isThisEdit: boolean;
      done: boolean;
    }) => {
      if (done) return null;
      else if (isThisEdit) {
        return (
          <>
            <IconAtom
              src="icon/edit_handle.svg"
              alt="handler"
              size={1.25}
              className="handler"
            />
            <TypoAtom fontSize="h3" fontColor="primary1">
              {order}.
            </TypoAtom>
          </>
        );
      } else if (isCurrTodo || isEditMode) {
        return (
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
        );
      } else {
        return (
          <>
            <div {...dragHandleProps}>
              <IconAtom src="icon/yellowHandle.svg" alt="handler" size={1.25} />
            </div>
            <TypoAtom fontSize="h3" fontColor="primary2">
              {order}.
            </TypoAtom>
          </>
        );
      }
    },
    [],
  );

  const TitleOrInput = useCallback(
    ({
      todo,
      titleValue,
      isThisEdit,
      handleChangeTitle,
    }: {
      todo: string;
      titleValue: string;
      isThisEdit: boolean;
      handleChangeTitle: ReactEventHandler<HTMLInputElement>;
    }) => {
      if (isThisEdit) {
        return (
          <InputAtom.Underline
            value={titleValue}
            handleChange={handleChangeTitle}
            placeholder="할 일을 입력하세요"
            ariaLabel="title_input"
            className="todoTitle"
            styleOption={{
              borderWidth: '1px',
              padding: '0 0 0 0',
              height: '1.25rem',
              font: 'h3',
              borderColor: 'primary1',
              fontColor: 'primary1',
            }}
          />
        );
      } else {
        return (
          <TypoAtom className="todoTitle" fontSize="h3" fontColor="primary2">
            {todo}
          </TypoAtom>
        );
      }
    },
    [],
  );

  const TopRightCorner = useCallback(
    ({
      isCurrTodo,
      done,
      isThisEdit,
      isDragging,
    }: {
      isCurrTodo: boolean;
      done: boolean;
      isThisEdit: boolean;
      isDragging: boolean | undefined;
    }) => {
      if (isCurrTodo || done || isDragging) return null;
      else if (isThisEdit) {
        return (
          <BtnAtom handleOnClick={handleEditCancel}>
            <IconAtom src={'icon/close.svg'} size={1.25} alt="cancel" />
          </BtnAtom>
        );
      } else {
        return (
          <BtnAtom handleOnClick={handleDeleteButton}>
            <IconAtom src={'icon/delete.svg'} size={1.25} alt="delete" />
          </BtnAtom>
        );
      }
    },
    [],
  );

  const CategoryContent = useCallback(
    ({
      categories,
      categoryArray,
      handleAddCategory,
      handleDeleteCategory,
      categoryValue,
      handleChangeCategory,
      tagColorList,
      isDragging,
      isThisEdit,
    }: {
      categories: string[] | null;
      categoryArray: string[] | null;
      handleAddCategory: (event: React.KeyboardEvent<HTMLInputElement>) => void;
      handleDeleteCategory: (category: string) => void;
      categoryValue: string;
      handleChangeCategory: (
        event: React.ChangeEvent<HTMLInputElement>,
      ) => void;
      tagColorList: Record<string, TagColorName>;
      isDragging: boolean | undefined;
      isThisEdit: boolean;
    }) => {
      if (isDragging || !categories) return null;
      else if (isThisEdit) {
        return (
          <CategoryContainer className="categories">
            <CategoryInput
              categories={categoryArray}
              handleSubmit={handleAddCategory}
              handleClick={handleDeleteCategory}
              category={categoryValue}
              handleChangeCategory={handleChangeCategory}
              tagColorList={tagColorList}
            />
          </CategoryContainer>
        );
      } else if (categories && categories.length !== 0) {
        return (
          <CategoryContainer className="categories">
            {categories.map((category) => {
              return (
                <TagAtom
                  key={category}
                  title={category}
                  styleOption={{ bg: tagColorList[category], size: 'normal' }}
                >
                  {category}
                </TagAtom>
              );
            })}
          </CategoryContainer>
        );
      }
      return null;
    },
    [],
  );

  const FooterContent = useCallback(
    ({
      isDragging,
      done,
      isThisEdit,
      duration,
      handleEditSubmit,
      handleEditButton,
      durationValue,
    }: {
      isDragging: boolean | undefined;
      done: boolean;
      isThisEdit: boolean;
      duration: string;
      handleEditSubmit: () => void;
      handleEditButton: () => void;
      durationValue: number;
    }) => {
      if (isDragging || done) return null;
      else if (isThisEdit) {
        return (
          <FooterContainer>
            <BtnAtom handleOnClick={() => setShowTomatoInput(true)}>
              <TimeWrapper>
                <IconAtom
                  src={'icon/timer.svg'}
                  alt="timer"
                  className="timer"
                  size={1.25}
                />
                <div ref={setTriggerElement}>
                  <TypoAtom
                    fontSize="body"
                    fontColor="primary1"
                    className="duration"
                  >
                    {formatTime(durationValue)}
                  </TypoAtom>
                </div>
              </TimeWrapper>
            </BtnAtom>
            <BtnAtom handleOnClick={handleEditSubmit}>
              <TagAtom
                styleOption={{
                  size: 'normal',
                  bg: 'transparent',
                  borderColor: 'primary1',
                }}
                className="save__button"
              >
                <TypoAtom fontSize="b2" fontColor="primary1">
                  저장
                </TypoAtom>
              </TagAtom>
            </BtnAtom>
          </FooterContainer>
        );
      } else if (isCurrTodo) {
        return (
          <FooterContainer>
            <TimeWrapper>
              <IconAtom
                src={'icon/yellowTimer.svg'}
                alt="timer"
                className="timer"
                size={1.25}
              />
              <TypoAtom fontSize="body" fontColor="primary2">
                {duration}
              </TypoAtom>
            </TimeWrapper>
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
          </FooterContainer>
        );
      } else {
        return (
          <FooterContainer>
            <TimeWrapper>
              <IconAtom
                src={'icon/yellowTimer.svg'}
                alt="timer"
                className="timer"
                size={1.25}
              />
              <TypoAtom fontSize="body" fontColor="primary2">
                {duration}
              </TypoAtom>
            </TimeWrapper>
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
          </FooterContainer>
        );
      }
    },
    [isCurrTodo, snapshot?.isDragging, done],
  );

  useEffect(() => {
    const rootElement = document.querySelector('#root');
    if (!rootElement) return;
    if (showTomatoInput) {
      rootElement.addEventListener(
        'click',
        handleClickBackgroundToCloseTomatoInput,
      );
    } else {
      rootElement.removeEventListener(
        'click',
        handleClickBackgroundToCloseTomatoInput,
      );
    }
    return () => {
      rootElement.removeEventListener(
        'click',
        handleClickBackgroundToCloseTomatoInput,
      );
    };
  }, [showTomatoInput, handleClickBackgroundToCloseTomatoInput]);

  useEffect(() => {
    !isThisEdit && showTomatoInput && setShowTomatoInput(false);
  }, [isThisEdit]);

  return (
    <TodoCardContainer
      as={isThisEdit ? 'form' : 'div'}
      done={done}
      isCurrTodo={isCurrTodo}
      isThisEdit={isThisEdit}
    >
      <TitleContainer>
        <div>
          <HandlerIconAndOrder
            isCurrTodo={isCurrTodo}
            isEditMode={editTodoId !== undefined}
            done={done}
            isThisEdit={isThisEdit}
          />
          <TitleOrInput
            titleValue={titleValue}
            isThisEdit={isThisEdit}
            handleChangeTitle={handleChangeTitle}
            todo={todo}
          />
        </div>
        <TopRightCorner
          isCurrTodo={isCurrTodo}
          done={done}
          isThisEdit={isThisEdit}
          isDragging={snapshot?.isDragging}
        />
      </TitleContainer>
      <CategoryContent
        categoryArray={categoryArray}
        handleAddCategory={handleAddCategory}
        handleDeleteCategory={handleDeleteCategory}
        categoryValue={categoryValue}
        handleChangeCategory={handleChangeCategory}
        tagColorList={tagColorList}
        isDragging={snapshot?.isDragging}
        isThisEdit={isThisEdit}
        categories={categories}
      />
      <FooterContent
        isDragging={snapshot?.isDragging}
        done={done}
        isThisEdit={isThisEdit}
        duration={formatTime(focusStep * todoData.duration)}
        handleEditSubmit={handleEditSubmit}
        handleEditButton={handleEditButton}
        durationValue={durationValue}
      />

      {showTomatoInput && (
        <PopperAtom
          popperElement={popperElement}
          setPopperElement={setPopperElement}
          triggerElement={triggerElement}
          arrowElement={arrowElement}
          placement={'bottom'}
        >
          <TomatoInputWrapper aria-label="tomatoInput">
            <TomatoInput
              max={10}
              min={0}
              period={focusStep}
              handleTomato={handleTomato}
              tomato={+durationValue}
              useBalloonOrNot={false}
            />
          </TomatoInputWrapper>
          <PopperArrow id="arrow" data-popper-arrow ref={setArrowElement} />
        </PopperAtom>
      )}
    </TodoCardContainer>
  );
};

export default TodoCard;
export type { ITodoCardProps };

const TodoCardContainer = styled.div<{
  done: boolean;
  isCurrTodo: boolean;
  isThisEdit: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24.5rem;

  box-sizing: border-box;
  padding: 0.75rem;
  border-radius: 0.875rem;

  background-color: ${({
    isThisEdit,
    theme: {
      color: { backgroundColor },
    },
  }) => (isThisEdit ? backgroundColor.primary2 : '#463685')};

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

  /* &,
  * {
    outline: 1px solid limegreen;
  } */
`;

const FooterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: 0.5rem;
  .edit__button,
  .save__button {
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

export const CategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;

  column-gap: 0.5rem;
  row-gap: 0.25rem;
`;

const TomatoInputWrapper = styled.div`
  background-color: ${({ theme }) => theme.color.backgroundColor.white};
  width: 44.625rem;
  height: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  padding: 1rem;
  border-radius: 1.25rem;
`;

const PopperArrow = styled.div`
  &,
  &::before {
    position: absolute;
    width: 8px;
    height: 8px;
    z-index: -1;
  }

  &::before {
    content: '';
    transform: rotate(45deg);
    background-color: ${({
      theme: {
        color: { backgroundColor },
      },
    }) => backgroundColor.white};
  }
`;
