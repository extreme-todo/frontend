import {
  ReactEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { IconAtom, PopperAtom, TomatoInput, TypoAtom } from '../../atoms';

import FooterContent from './content/FooterContent';
import CategoryContent from './content/CategoryContent';
import HandlerIconAndOrder from './content/HandleIconAndOrder';
import TitleOrInput from './content/TitleOrInput';
import TopRightCornerIcon from './content/TopRightCornerIcon';

import { useEdit } from '../../hooks';
import { focusStep } from '../../hooks/usePomodoro';

import { todosApi } from '../../shared/apis';
import {
  MAX_CATEGORY_ARRAY_LENGTH,
  MAX_TITLE_INPUT_LENGTH_WARNING,
  TITLE_EMPTY_MESSAGE,
  TodoEntity,
} from '../../DB/indexedAction';
import { ETIndexed, UpdateTodoDto } from '../../DB/indexed';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  DraggableProvidedDragHandleProps,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';

import { formatTime } from '../../shared/timeUtils';
import {
  categoryValidation,
  titleValidation,
} from '../../shared/inputValidation';
import { RandomTagColorList } from '../../shared/RandomTagColorList';

import styled from '@emotion/styled';

interface ITodoCardProps {
  todoData: TodoEntity;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  snapshot?: DraggableStateSnapshot;
  focusStep: focusStep;
  randomTagColor: RandomTagColorList;
  isCurrTodo: boolean;
  order: number;
}

const ramdomTagColorList = RandomTagColorList.getInstance();

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
  const [titleError, setTitleError] = useState(false);
  const [categoryArray, setCategoryArray] = useState<string[]>(
    categories ?? [],
  );
  const [categoryValue, setCategoryValue] = useState('');
  const [categoryError, setCategoryError] = useState<string | undefined>(
    undefined,
  );
  const [durationValue, setDurationValue] = useState(duration);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [showTomatoInput, setShowTomatoInput] = useState(false);
  const [triggerElement, setTriggerElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [arrowElement, setArrowElement] = useState<HTMLImageElement | null>(
    null,
  );

  const editData = useMemo(
    () => ({
      categories: categoryArray,
      todo: titleValue,
      duration: durationValue,
      date: new Date(prevDate).toISOString(),
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
          .find((todo) => todo.date <= newTodo.date) as TodoEntity;
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

  const { mutate: updateMutate, isLoading } = useMutation({
    mutationFn: updateMutationHandler,
    onSuccess(data) {
      console.debug('\n\n\n ✅ data in TodoCard‘s updateTodos ✅ \n\n', data);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setEditTodoId(undefined);
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
  const handleEditButton = useCallback(() => {
    setEditTodoId(id);
  }, [id]);

  const handleEditSubmit = useCallback(() => {
    updateMutate({
      newTodo: editData,
      id,
      prevDate: prevDate,
    });
  }, [editData, id, prevDate]);

  const handleChangeTitle: ReactEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const trimmed = titleValidation(event.currentTarget.value);
      if (typeof trimmed === 'object') {
        if (!titleError) {
          setTitleError(true);
        }
        if (trimmed.errorMessage === MAX_TITLE_INPUT_LENGTH_WARNING) {
          return;
        }
      } else if (typeof trimmed === 'string' && titleError !== undefined) {
        setTitleError(false);
      }
      setTitleValue(event.currentTarget.value);
    },
    [titleError],
  );

  const handleTitleBlur: ReactEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const checkEmpty = titleValidation(event.currentTarget.value);
      if (
        typeof checkEmpty === 'object' &&
        checkEmpty.errorMessage === TITLE_EMPTY_MESSAGE
      ) {
        setTitleError(true);
      }
    },
    [],
  );

  const handleEditCancel = useCallback(() => {
    setEditTodoId(undefined);
    setTitleValue(todo);
    setCategoryArray(categories ?? []);
    setDurationValue(duration);
  }, [todo, categories, duration]);

  const handleDeleteButton = useCallback(() => {
    deleteMutate({ id });
  }, [id]);

  const handleAddCategory = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.code === 'Enter') {
        event.preventDefault();
        if (event.currentTarget.value.length === 0) return;
        // 한글 중복 입력 처리
        if (event.nativeEvent.isComposing) return;

        const newCategory = (event.target as HTMLInputElement).value;

        const trimmed = categoryValidation(newCategory);

        if (typeof trimmed === 'object') return;
        else if (
          typeof trimmed === 'string' &&
          !categoryArray.includes(trimmed) &&
          categoryArray.length <= MAX_CATEGORY_ARRAY_LENGTH
        ) {
          const copy = categoryArray.slice();
          copy.push(trimmed);
          setCategoryArray(copy);
          ramdomTagColorList.setColor = trimmed;
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
      });

      return deleted;
    });
  }, []);

  const handleChangeCategory = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCategoryValue(event.target.value);
      if (
        event.currentTarget.value.length === 0 &&
        categoryError !== undefined
      ) {
        return setCategoryError(undefined);
      }
      const trimmed = categoryValidation(event.currentTarget.value);
      if (typeof trimmed === 'object' && trimmed.errorMessage !== categoryError)
        setCategoryError(trimmed.errorMessage);
      else if (typeof trimmed === 'string' && categoryError !== undefined) {
        setCategoryError(undefined);
      }
    },
    [categoryError],
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
            done={done}
            isThisEdit={isThisEdit}
            order={order}
            dragHandleProps={dragHandleProps}
          />
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
          isDragging={snapshot?.isDragging}
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
        isDragging={snapshot?.isDragging}
        isThisEdit={isThisEdit}
        categories={categories}
      />
      <FooterContent
        isDragging={snapshot?.isDragging}
        done={done}
        isThisEdit={isThisEdit}
        isSubmitting={isLoading}
        duration={formatTime(focusStep * todoData.duration)}
        handleEditButton={handleEditButton}
        durationValue={durationValue}
        isCurrTodo={isCurrTodo}
        setShowTomatoInput={setShowTomatoInput}
        setTriggerElement={setTriggerElement}
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
            <TomatoInfo>
              <TypoAtom>{formatTime(durationValue * focusStep)}</TypoAtom>
              <TypoAtom>{durationValue}round</TypoAtom>
            </TomatoInfo>
            <TomatoInput
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
  /* width: 24.5rem; */
  width: 100%;

  box-sizing: border-box;
  padding: 0.75rem;
  border-radius: 0.875rem;

  background-color: ${({
    isThisEdit,
    theme: {
      color: { backgroundColor },
    },
  }) =>
    isThisEdit ? backgroundColor.primary2 : backgroundColor.dark_primary1};

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
