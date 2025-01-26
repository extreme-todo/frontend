import { memo, useCallback, useMemo } from 'react';

/* component */

/* indexed DB */
import { AddTodoDto, ETIndexed } from '../../DB/indexed';
import { TodoEntity } from '../../DB/indexedAction';

/* react query */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* react DnD */
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  useMouseSensor,
} from 'react-beautiful-dnd';

/* hooks */
import {
  EditContextProvider,
  useCurrentTodo,
  useDraggableInPortal,
  usePomodoroValue,
} from '../../hooks';

/* etc */
import { todosApi } from '../../shared/apis';
import styled from '@emotion/styled';
import { setTimeInFormat } from '../../shared/timeUtils';
import { onDragDropHandler } from './dragHelper';
import { addTodoMocks } from './mockAddTodos';
import useTouchSensor from '../../hooks/useTouchSensor';
import TodoCard from '../TodoCard';
import { CardAtom } from '../../atoms';
import { RandomTagColorList } from '../../shared/RandomTagColorList';

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

const randomTagColor = RandomTagColorList.getInstance().getColorList;

const TodoList = () => {
  /* hook 호출 */
  const queryClient = useQueryClient();

  const { data: todos, isLoading: isTodoLoading } = useQuery(
    ['todos'],
    () => todosApi.getList(false),
    {
      staleTime: 1000 * 60 * 20,
    },
  );
  const { data: doneTodos, isLoading: isDoneLoading } = useQuery(
    ['doneTodos'],
    () => todosApi.getList(true),
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
  const optionalPortal = useDraggableInPortal();

  const onClickHandler = () => {
    const mock = addTodoMocks();
    const temp = async () => {
      for (let i = 0; i < mock.length; i++) {
        await ETIndexed.getInstance().addTodo(mock[i]);
      }
    };
    temp();
  };

  const todoList = todos && Array.from(todos.values())[0];

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
      {/* <BtnAtom children={'add Todo'} handleOnClick={onClickHandler} /> */}
      <TodoListContainer
        w="53.75rem"
        h="20rem"
        padding="2rem 1.5rem"
        className="card"
      >
        {/* TODO : list가 두 개 되어야 함. 완료한 todo, 해야 할 todo */}
        <DragDropContext
          onDragEnd={handleDragEnd}
          enableDefaultSensors={false}
          sensors={[useMouseSensor, useTouchSensor]}
        >
          {!isTodoLoading && todos ? (
            <EditContextProvider>
              <Droppable droppableId="todoList">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {todoList
                      ? todoList.map((todo, idx) => (
                          <Draggable
                            draggableId={String(todo.id)}
                            index={idx}
                            key={todo.id}
                          >
                            {optionalPortal((provided, snapshot) => (
                              <div
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                              >
                                <TodoCard
                                  dragHandleProps={provided.dragHandleProps}
                                  todoData={todo}
                                  snapshot={snapshot}
                                  focusStep={focusStep}
                                  randomTagColor={randomTagColor}
                                  isCurrTodo={
                                    currentTodo
                                      ? currentTodo.id === todo.id
                                      : false
                                  }
                                />
                              </div>
                            ))}
                          </Draggable>
                        ))
                      : 'todo를 추가해보세요'}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </EditContextProvider>
          ) : null}
        </DragDropContext>
      </TodoListContainer>
      {/* </CardAtom> */}
      {/* </Modal> */}
    </>
  );
};

export default TodoList;

const TodoListContainer = styled(CardAtom)`
  background-color: ${({
    theme: {
      color: { backgroundColor },
    },
  }) => backgroundColor.primary1};
  overflow: scroll;
`;
