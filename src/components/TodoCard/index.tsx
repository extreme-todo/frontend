import {
  ReactEventHandler,
  SyntheticEvent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import EditUI from './content/EditUI';
import TodoUI from './content/TodoUI';

import { useEdit } from '../../hooks';

import { todosApi } from '../../shared/apis';
import { TodoEntity } from '../../DB/indexedAction';
import { ETIndexed, UpdateTodoDto } from '../../DB/indexed';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DraggableProvidedDragHandleProps,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import { focusStep } from '../../hooks/usePomodoro';
import { TagColorName } from '../../styles/emotion';
import styled from '@emotion/styled';
import { BtnAtom, IconAtom, InputAtom, TagAtom, TypoAtom } from '../../atoms';
import { formatTime, setTimeInFormat } from '../../shared/timeUtils';
import { RandomTagColorList } from '../../shared/RandomTagColorList';
import { categoryValidation } from '../../shared/inputValidation';
import { CategoryInput } from '../../molecules';

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
  const [{ editMode, editTodoId }, setIsEdit] = useEdit();

  const [titleValue, setTitleValue] = useState(todo);
  const [categoryArray, setCategoryArray] = useState(categories ?? null);
  const [categoryValue, setCategoryValue] = useState('');
  const [dateValue, setDateValue] = useState<Date>(new Date(prevDate));
  const [durationValue, setDurationValue] = useState(duration);

  const editData = useMemo(
    () => ({
      categories: categoryArray,
      date: setTimeInFormat(dateValue).toISOString(),
      todo: titleValue,
      duration: durationValue,
    }),
    [categoryArray, dateValue, titleValue, durationValue],
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
    setIsEdit({ editMode: true, editTodoId: id });
  };

  const handleEditSubmit = () => {
    updateMutate({ newTodo: editData, id, prevDate });
    setIsEdit({ editMode: false, editTodoId: undefined });
  };

  const handleChangeTitle: ReactEventHandler<HTMLInputElement> = useCallback(
    // (event: React.ChangeEvent<HTMLInputElement>) => {
    (event) => {
      console.log(event.currentTarget.value);
      setTitleValue(event.currentTarget.value);
    },
    [],
  );

  const handleEditCancel = () => {
    setIsEdit({ editMode: false, editTodoId: undefined });
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

  // UI
  const HandlerIconAndOrder = useCallback(
    ({
      isCurrTodo,
      editMode,
      done,
    }: {
      isCurrTodo: boolean;
      editMode: boolean;
      done: boolean;
    }) => {
      if (done) return null;
      else if (isCurrTodo || editMode) {
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
      titleValue,
      editTodoId,
      handleChangeTitle,
    }: {
      titleValue: string;
      editTodoId?: string;
      handleChangeTitle: ReactEventHandler<HTMLInputElement>;
    }) => {
      if (editTodoId === id) {
        return (
          <InputAtom.Underline
            value={titleValue}
            handleChange={handleChangeTitle}
            placeholder="할 일을 입력하세요"
            ariaLabel="title_input"
            className="todoTitle"
          />
        );
      } else {
        return (
          <TypoAtom className="todoTitle" fontSize="h3" fontColor="primary2">
            {titleValue}
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
      editMode,
      isDragging,
    }: {
      isCurrTodo: boolean;
      done: boolean;
      editMode: boolean;
      isDragging: boolean | undefined;
    }) => {
      if (isCurrTodo || done || isDragging) return null;
      else if (editMode) {
        return (
          <BtnAtom handleOnClick={handleEditCancel}>
            <IconAtom src={'icon/close.svg'} size={1.25} alt="delete" />
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
      categoryArray,
      handleAddCategory,
      handleDeleteCategory,
      categoryValue,
      handleChangeCategory,
      tagColorList,
      isDragging,
      editTodoId,
      id,
    }: {
      categoryArray: string[] | null;
      handleAddCategory: (event: React.KeyboardEvent<HTMLInputElement>) => void;
      handleDeleteCategory: (category: string) => void;
      categoryValue: string;
      handleChangeCategory: (
        event: React.ChangeEvent<HTMLInputElement>,
      ) => void;
      tagColorList: Record<string, TagColorName>;
      isDragging: boolean | undefined;
      editTodoId: string | undefined;
      id: string;
    }) => {
      if (isDragging || !categoryArray) return null;
      else if (editTodoId === id) {
        return (
          <CategoryInput
            categories={categoryArray}
            handleSubmit={handleAddCategory}
            handleClick={handleDeleteCategory}
            category={categoryValue}
            handleChangeCategory={handleChangeCategory}
            tagColorList={tagColorList}
          />
        );
      } else if (categoryArray && categoryArray.length !== 0) {
        return (
          <CategoryContainer className="categories">
            {categoryArray.map((category) => {
              return (
                <TagAtom
                  key={category}
                  title={category}
                  styleOption={{ bg: tagColorList[category] }}
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

  // TODO : editId 일 때 수정완료 버튼 넣고 tomato input 하기
  const FooterContent = useCallback(
    ({
      isDragging,
      done,
      editTodoId,
      id,
      duration,
      handleEditSubmit,
      handleEditButton,
    }: {
      isDragging: boolean | undefined;
      done: boolean;
      editTodoId: undefined | string;
      id: string;
      duration: string;
      handleEditSubmit: () => void;
      handleEditButton: () => void;
    }) => {
      if (isDragging || done) return null;
      else if (editTodoId === id) {
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
            <BtnAtom handleOnClick={handleEditSubmit}>
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

  return (
    <TodoCardContainer done={done} isCurrTodo={isCurrTodo}>
      <TitleContainer>
        <div>
          <HandlerIconAndOrder
            isCurrTodo={isCurrTodo}
            editMode={editMode}
            done={done}
          />
          <TitleOrInput
            titleValue={titleValue}
            editTodoId={editTodoId}
            handleChangeTitle={handleChangeTitle}
          />
        </div>
        <TopRightCorner
          isCurrTodo={isCurrTodo}
          done={done}
          editMode={editMode}
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
        editTodoId={editTodoId}
        id={id}
      />
      <FooterContent
        isDragging={snapshot?.isDragging}
        done={done}
        editTodoId={editTodoId}
        id={id}
        duration={formatTime(focusStep * todoData.duration)}
        handleEditSubmit={handleEditSubmit}
        handleEditButton={handleEditButton}
      />
    </TodoCardContainer>
  );
};

export default TodoCard;
export type { ITodoCardProps };

const TodoCardContainer = styled.div<{ done: boolean; isCurrTodo: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24.5rem;

  box-sizing: border-box;
  padding: 0.75rem;
  border-radius: 0.875rem;

  background-color: #463685;

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

  /* &,
  * {
    outline: 1px solid limegreen;
  } */
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

  > div {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;
