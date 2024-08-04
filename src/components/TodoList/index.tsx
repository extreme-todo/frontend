import { memo, useCallback, useMemo, useState } from 'react';

/* component */
import { BtnAtom } from '../../atoms';
import { NowCard } from '../../molecules';
import { DateCard } from '../../organisms';

/* indexed DB */
import { AddTodoDto, ETIndexed } from '../../DB/indexed';
import { TodoEntity } from '../../DB/indexedAction';

/* react query */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* react DnD */
import {
  DragDropContext,
  DropResult,
  useMouseSensor,
} from 'react-beautiful-dnd';

/* hooks */
import {
  EditContextProvider,
  useCurrentTodo,
  usePomodoroValue,
} from '../../hooks';

/* etc */
import { todosApi } from '../../shared/apis';
import styled from '@emotion/styled';
import { setTimeInFormat } from '../../shared/timeUtils';
import { onDragDropHandler } from './dragHelper';
import { addTodoMocks } from './mockAddTodos';
import useTouchSensor from '../../hooks/useTouchSensor';

const MemoDateCard = memo(DateCard);

interface orderMutationHandlerArgs {
  prevOrder: number;
  newOrder: number;
  id?: string;
  newDate?: string;
  todolist?: Map<string, TodoEntity[]>;
}

const orderMutationHandler = async ({
  prevOrder,
  newOrder,
  id,
  newDate,
}: orderMutationHandlerArgs) => {
  if (!newDate || !id) {
    await todosApi.reorderTodos(prevOrder, newOrder);
  } else {
    await todosApi.updateTodo(id, {
      date: setTimeInFormat(new Date(newDate)).toISOString(),
    });
    await todosApi.reorderTodos(prevOrder, newOrder);
  }
};

const TodoList = () => {
  /* hook 호출 */
  const queryClient = useQueryClient();

  const { data: todos, isLoading } = useQuery(
    ['todos'],
    () => todosApi.getList(false),
    {
      staleTime: 1000 * 60 * 20,
    },
  );

  const { mutate: reorderMutate } = useMutation(orderMutationHandler, {
    onError(_err: any, _: any, context) {
      queryClient.setQueryData(['todos'], context);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onMutate({ todolist }: { todolist?: Map<string, TodoEntity[]> }) {
      queryClient.cancelQueries({ queryKey: ['todos'] });
      const prevTodoList = queryClient.getQueryData(['todos']);
      queryClient.setQueryData(['todos'], todolist);
      return prevTodoList;
    },
  });

  /* custom hook 호출 */
  const { currentTodo } = useCurrentTodo();
  const {
    settings: { focusStep },
  } = usePomodoroValue();

  const onClickHandler = () => {
    const mock = addTodoMocks();
    const temp = async () => {
      for (let i = 0; i < mock.length; i++) {
        await ETIndexed.getInstance().addTodo(mock[i]);
      }
    };
    temp();
  };

  /* render helper function */
  /* 날짜별 todo 데이터 render 함수 */
  const listRender = useMemo(() => {
    const dateList = todos && Array.from(todos.keys());
    const todoList = todos && Array.from(todos.values());

    const renderList =
      dateList &&
      todoList &&
      dateList.map((date, idx) => (
        <MemoDateCard
          key={date}
          date={date}
          tododata={todoList[idx].filter((todo) => todo.id !== currentTodo?.id)}
        />
      ));

    return renderList;
  }, [todos, currentTodo]);

  /* react dnd의 onDragDropHandler */
  const handleDragEnd = useCallback(
    (info: DropResult) => {
      if (!todos) return;
      const reorderedTodos = onDragDropHandler(info, todos);
      reorderedTodos && reorderMutate(reorderedTodos);
    },
    [todos],
  );

  return (
    <>
      {/* <Modal
        title={'todolist'}
        handleClose={function (): void {
          throw new Error('Function not implemented.');
        }}
      > */}
      {/* <CardAtom> */}
      <BtnAtom children={'add Todo'} handleOnClick={onClickHandler} />
      <TodoListContainer>
        <NowCard
          currentTodo={
            currentTodo ||
            ({
              duration: 0,
              todo: '오늘 할 일이 비어있습니다 :)',
              categories: undefined,
            } as unknown as TodoEntity)
          }
          focusStep={focusStep}
        />
        <DragDropContext
          onDragEnd={handleDragEnd}
          enableDefaultSensors={false}
          sensors={[useMouseSensor, useTouchSensor]}
        >
          {!isLoading && todos ? (
            <EditContextProvider>{listRender}</EditContextProvider>
          ) : null}
        </DragDropContext>
      </TodoListContainer>
      {/* </CardAtom> */}
      {/* </Modal> */}
    </>
  );
};

export default TodoList;

const TodoListContainer = styled.div`
  width: 35.7275rem;
  overflow: scroll;
`;
