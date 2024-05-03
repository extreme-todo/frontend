/* component */
import { BtnAtom } from '../atoms';
import { NowCard } from '../molecules';
import { DateCard } from '../organisms';

/* indexed DB */
import { AddTodoDto, ETIndexed } from '../DB/indexed';
import { TodoEntity, TodoDate } from '../DB/indexedAction';

/* react query */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* react DnD */
import {
  DragDropContext,
  DraggableLocation,
  DropResult,
} from 'react-beautiful-dnd';

/* hooks */
import {
  EditContextProvider,
  useCurrentTodo,
  usePomodoroValue,
} from '../hooks';

/* etc */
import { todosApi } from '../shared/apis';
import styled from '@emotion/styled';

const addTodoMocks = (): AddTodoDto[] => {
  return [
    {
      date: '2023-10-30',
      todo: 'practice valorant',
      duration: 1,
      categories: ['game', 'practice'],
    },
    {
      date: '2023-10-30',
      todo: 'go to grocery store',
      duration: 2,
      categories: ['chore'],
    },
    {
      date: '2023-10-29',
      todo: 'Watch English News',
      duration: 1,
      categories: ['english', 'study'],
    },
    {
      date: '2023-10-29',
      todo: 'Start Exercise',
      duration: 1,
      categories: ['health'],
    },
    {
      date: '2023-10-27',
      todo: 'check riff',
      duration: 0.05,
      categories: [
        'music',
        'guitar',
        'music theory',
        'hubby',
        'lorem ipsum sth sth',
      ],
    },
    {
      date: '2023-10-27',
      todo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      duration: 3,
      categories: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        'guitar',
      ],
    },
  ];
};

/* 날짜별 todo 데이터 render 함수 */
const listRender = (mapTodo: Map<string, TodoEntity[]>) => {
  const dateList = Array.from(mapTodo.keys());
  const todoList = Array.from(mapTodo.values());

  const renderList = dateList.map((date, idx) => (
    <DateCard key={date} date={date} tododata={todoList[idx]} />
  ));

  return renderList;
};

interface orderMutationHandlerArgs {
  prevOrder: number;
  newOrder: number;
  id?: number;
  newDate?: TodoDate;
  todolist?: Map<string, TodoEntity[]>;
}

const orderMutationHandler = async ({
  prevOrder,
  newOrder,
  id,
  newDate,
  todolist,
}: orderMutationHandlerArgs) => {
  if (!newDate || !id) {
    await todosApi.reorderTodos(prevOrder, newOrder);
  } else {
    await todosApi.updateTodo(id, { date: newDate });
    await todosApi.reorderTodos(prevOrder, newOrder);
  }
};

const TodoList = () => {
  /* hook 호출 */
  const queryClient = useQueryClient();
  const db = ETIndexed.getInstance();

  const { data: todos, isLoading } = useQuery(
    ['todos'],
    () => todosApi.getList(false),
    {
      refetchOnWindowFocus: false,
    },
  );

  const { mutate: reorderMutate } = useMutation(orderMutationHandler, {
    onError(_err: any, _: any, context) {
      alert('걸렸다!!');
      queryClient.setQueryData(['todos'], context);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onMutate({ todolist }: { todolist?: Map<string, TodoEntity[]> }) {
      console.log(todolist);
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

  /* todo re-ordering 관련 함수  */
  const modifiedSameDate = (
    source: DraggableLocation,
    destination: DraggableLocation,
  ) => {
    const copyMapTodo = new Map(todos);
    const copyTodo = copyMapTodo
      .get(source.droppableId)
      ?.slice() as unknown as TodoEntity[];

    const targetTodo = { ...copyTodo[source.index] };

    const sourceIndexInArray = Array.from(copyMapTodo.values())
      .flat()
      .findIndex((todo) => todo.id === targetTodo.id);

    copyTodo.splice(source.index, 1);
    copyTodo.splice(destination.index, 0, targetTodo);
    copyMapTodo.set(source.droppableId, copyTodo);

    const destinationIndexInArray = Array.from(copyMapTodo.values())
      .flat()
      .findIndex((todo) => todo.id === targetTodo.id);

    return {
      prevOrder: sourceIndexInArray + 1,
      newOrder: destinationIndexInArray + 1,
      todolist: copyMapTodo,
    };
  };

  const modifiedDiffDate = (
    source: DraggableLocation,
    destination: DraggableLocation,
  ) => {
    const copyMapTodo = new Map(todos);
    const copyPrevTodo = copyMapTodo
      .get(source.droppableId)
      ?.slice() as unknown as TodoEntity[];

    const target = { ...copyPrevTodo[source.index] };

    copyPrevTodo.splice(source.index, 1);

    const sourceIndexInArray = Array.from(copyMapTodo.values())
      .flat()
      .findIndex((todo) => todo.id === target.id);

    copyMapTodo.set(source.droppableId, copyPrevTodo);

    const copyCurrTodo = copyMapTodo
      .get(destination.droppableId)
      ?.slice() as unknown as TodoEntity[];

    copyCurrTodo.splice(destination.index, 0, target);

    copyMapTodo.set(destination.droppableId, copyCurrTodo);

    const destinationIndexInArray = Array.from(copyMapTodo.values())
      .flat()
      .findIndex((todo) => todo.id === target.id);

    return {
      prevOrder: sourceIndexInArray + 1,
      newOrder: destinationIndexInArray + 1,
      id: target.id,
      newDate: destination.droppableId as TodoDate,
      todolist: copyMapTodo,
    };
  };

  /* react dnd의 onDragDropHandler */
  const onDragDropHandler = (info: DropResult) => {
    const { destination, source } = info;
    // 이동이 없을 때
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // 같은 날 안에서 이동을 했을 때
    if (source.droppableId === destination.droppableId) {
      const modifiedTodoList = modifiedSameDate(source, destination);
      // reorderMutate 브랜치에서 작업 중
      reorderMutate(modifiedTodoList);
    } else if (source.droppableId !== destination.droppableId) {
      // 다른 날에서 이동했을 때
      const modifiedTodoList = modifiedDiffDate(source, destination);
      // reorderMutate 브랜치에서 작업 중
      reorderMutate(modifiedTodoList);
    }
  };

  const onClickHandler = () => {
    const mock = addTodoMocks();
    const temp = async () => {
      for (let i = 0; i < mock.length; i++) {
        await db.addTodo(mock[i]);
      }
    };
    temp();
  };

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
          currentTodo={currentTodo as TodoEntity}
          focusStep={focusStep}
        />
        <DragDropContext onDragEnd={onDragDropHandler}>
          {!isLoading && todos ? (
            <EditContextProvider>{listRender(todos)}</EditContextProvider>
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
