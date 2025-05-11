import { memo, useCallback, useMemo } from 'react';

/* component */
import TodoCard from '../TodoCard';
import { BtnAtom, CardAtom, TypoAtom } from '../../atoms';

/* indexed DB */
import { AddTodoDto, ETIndexed } from '../../DB/indexed';
import { TodoEntity } from '../../DB/indexedAction';

/* react query */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todosApi } from '../../shared/apis';

/* react DnD */
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  useMouseSensor,
} from 'react-beautiful-dnd';

/* hooks */
import { EditContextProvider, useDraggableInPortal } from '../../hooks';
import { type focusStep } from '../../hooks/usePomodoro';
import useTouchSensor from '../../hooks/useTouchSensor';

/* etc */
import styled from '@emotion/styled';
import { getDateInFormat, setTimeInFormat } from '../../shared/timeUtils';
import { onDragDropHandler } from './dragHelper';
import { addTodoMocks } from './mockAddTodos';
import { RandomTagColorList } from '../../shared/RandomTagColorList';
import { ModalType } from '../MainTodo/MainTodo';

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

const randomTagColor = RandomTagColorList.getInstance();

const MemoTodoCard = memo(TodoCard);

interface ITodoListProps {
  openAddTodoModal: (type: ModalType) => Window | null | undefined;
  currentTodo: TodoEntity | undefined;
  focusStep: focusStep;
}

const TodoList = memo(
  ({ openAddTodoModal, currentTodo, focusStep }: ITodoListProps) => {
    /* api 호출 */
    const queryClient = useQueryClient();

    const { data: todos, isLoading: isTodoLoading } = useQuery(['todos'], () =>
      todosApi.getList(false),
    );

    const { data: doneTodos, isLoading: isDoneLoading } = useQuery(
      ['doneTodos'],
      () => todosApi.getList(true),
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

    const droppableId = useMemo(
      () =>
        (todos && Array.from(todos.keys())[0]) ?? getDateInFormat(new Date()),
      [todos],
    );

    const todoList = useMemo(
      () => todos && Array.from(todos.values())[0],
      [todos],
    );

    const doneTodoList = useMemo(
      () => doneTodos && Array.from(doneTodos.values())[0],
      [doneTodos],
    );

    /* custom hook 호출 */
    const optionalPortal = useDraggableInPortal();

    /* react dnd의 onDragDropHandler */
    const handleDragEnd = useCallback(
      (info: DropResult) => {
        if (!todos) return;
        const reorderedTodos = onDragDropHandler(info, todos);
        reorderedTodos && reorderMutate(reorderedTodos);
      },
      [todos],
    );

    /* dev mode에서 로컬 indexed DB에 mock todo data 추가하는 핸들러 */
    const onClickHandler = useCallback(() => {
      const mock = addTodoMocks();
      const temp = async () => {
        for (let i = 0; i < mock.length; i++) {
          await ETIndexed.getInstance().addTodo(mock[i]);
        }
      };
      temp();
    }, []);

    return (
      <>
        {/* <Modal
        title={'todolist'}
        handleClose={function (): void {
          throw new Error('Function not implemented.');
        }}
      > */}
        {/* <CardAtom> */}
        {/* <BtnAtom children={'add Todo'} handleOnClick={onClickHandler} /> */}
        <TodoListContainer padding="2rem 1.5rem" className="card">
          <ListSection>
            <TypoAtom fontSize="body" fontColor="primary2">
              완료한 TODO
            </TypoAtom>
            {doneTodoList ? (
              <List>
                {doneTodoList.map((doneTodo, idx) => (
                  <MemoTodoCard
                    todoData={doneTodo}
                    focusStep={focusStep}
                    randomTagColor={randomTagColor}
                    isCurrTodo={false}
                    order={idx + 1}
                  />
                ))}
              </List>
            ) : (
              <EmptyList>
                <TypoAtom fontSize="body" fontColor="primary2">
                  🍅
                </TypoAtom>
                <TypoAtom fontSize="body" fontColor="primary2">
                  힘차게 시작해볼까요?
                </TypoAtom>
              </EmptyList>
            )}
          </ListSection>
          <ListSection>
            <TypoAtom fontSize="body" fontColor="primary2">
              남은 TODO
            </TypoAtom>
            {todoList ? (
              <EditContextProvider>
                <List>
                  {currentTodo && (
                    <MemoTodoCard
                      todoData={currentTodo}
                      focusStep={focusStep}
                      randomTagColor={randomTagColor}
                      isCurrTodo={true}
                      order={(doneTodoList?.length ?? 0) + 1}
                    />
                  )}
                  <DragDropContext
                    onDragEnd={handleDragEnd}
                    enableDefaultSensors={false}
                    sensors={[useMouseSensor, useTouchSensor]}
                  >
                    <Droppable droppableId={droppableId}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="innerList"
                        >
                          {todoList.map(
                            (todo, idx) =>
                              todo.id !== currentTodo?.id && (
                                <Draggable
                                  draggableId={String(todo.id)}
                                  index={idx}
                                  key={todo.id}
                                >
                                  {optionalPortal((provided, snapshot) => (
                                    <li
                                      {...provided.draggableProps}
                                      ref={provided.innerRef}
                                    >
                                      <MemoTodoCard
                                        dragHandleProps={
                                          provided.dragHandleProps
                                        }
                                        todoData={todo}
                                        snapshot={snapshot}
                                        focusStep={focusStep}
                                        randomTagColor={randomTagColor}
                                        isCurrTodo={
                                          currentTodo
                                            ? currentTodo.id === todo.id
                                            : false
                                        }
                                        order={
                                          idx +
                                          1 +
                                          (doneTodos ? doneTodos.size : 0)
                                        }
                                      />
                                    </li>
                                  ))}
                                </Draggable>
                              ),
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </List>
              </EditContextProvider>
            ) : (
              <EmptyList>
                <BtnAtom
                  handleOnClick={openAddTodoModal.bind(this, 'addTodoModal')}
                  btnStyle="extremeDarkBtn"
                >
                  <div style={{ padding: '0.375rem 1.28125rem' }}>
                    <TypoAtom fontSize="b1" fontColor="primary2">
                      Todo+
                    </TypoAtom>
                  </div>
                </BtnAtom>
              </EmptyList>
            )}
          </ListSection>
        </TodoListContainer>
        {/* </CardAtom> */}
        {/* </Modal> */}
      </>
    );
  },
);

export default TodoList;

const TodoListContainer = styled(CardAtom)`
  /* &,
  * {
    outline: red 1px solid;
  } */
  overflow: hidden;
  display: flex;
  flex-direction: row;
  column-gap: 1rem;

  background-color: ${({
    theme: {
      color: { backgroundColor },
    },
  }) => backgroundColor.primary1};
`;

const ListSection = styled.section`
  width: 50%;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 9fr;
`;

const List = styled.ul`
  border-radius: 0.875rem;

  overflow-y: scroll;
  overflow-x: hidden;
  overscroll-behavior-y: contain;
  scrollbar-width: thin;
  scrollbar-color: #dbfe77 transparent;
  &::-webkit-scrollbar {
    width: 0.25rem;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({
      theme: {
        color: { backgroundColor },
      },
    }) => backgroundColor.primary2};
    border-radius: 0.375rem;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &,
  .innerList {
    display: grid;
    grid-auto-rows: min-content;
    row-gap: 0.5rem;
  }
`;

const EmptyList = styled.div`
  border-radius: 0.875rem;
  background-color: ${({
    theme: {
      color: { backgroundColor },
    },
  }) => backgroundColor.dark_primary1};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

  row-gap: 0.3125rem;
`;
