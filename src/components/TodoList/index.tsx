import { memo, ReactNode, useCallback, useMemo } from 'react';

/* component */
import { TodoCard } from '../';
import { BtnAtom, CardAtom, IconAtom, TypoAtom } from '../../atoms';

/* indexed DB */
import { TodoEntity } from '../../DB/indexedAction';

/* react query */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todosApi } from '../../shared/apis';

/* hooks */
import {
  useEdit,
  type focusStep,
  useIsMobile,
  useExtremeMode,
} from '../../hooks';

/* etc */
import styled from '@emotion/styled';
import { setTimeInFormat } from '../../shared/timeUtils';
import { RandomTagColorList } from '../../shared/RandomTagColorList';
import { ModalType } from '../MainTodo';

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
  handleClose: () => void;
  mobileTopButtonSlot?: ReactNode;
}

export const TodoList = memo(
  ({
    openAddTodoModal,
    currentTodo,
    focusStep,
    handleClose,
    mobileTopButtonSlot,
  }: ITodoListProps) => {
    /* api 호출 */
    const queryClient = useQueryClient();

    const isMobile = useIsMobile();
    const { isExtreme } = useExtremeMode();

    const { data: todos } = useQuery(['todos'], () => todosApi.getList(false), {
      staleTime: Infinity,
    });

    const { data: doneTodos } = useQuery(
      ['doneTodos'],
      () => todosApi.getList(true),
      { staleTime: Infinity },
    );

    const { mutate: reorderMutate } = useMutation(orderMutationHandler, {
      onMutate({ todolist }: { todolist?: Map<string, TodoEntity[]> }) {
        queryClient.cancelQueries({ queryKey: ['todos'] });
        const prevTodoList = queryClient.getQueryData<
          Map<string, TodoEntity[]> | undefined
        >(['todos']);
        queryClient.setQueryData(['todos'], todolist);

        return prevTodoList;
      },
      onError(_err: any, _: any, context) {
        queryClient.setQueryData(['todos'], context);
      },
    });

    const todoList = useMemo(
      () => todos && Array.from(todos.values())[0],
      [todos],
    );

    const doneTodoList = useMemo(
      () => doneTodos && Array.from(doneTodos.values())[0],
      [doneTodos],
    );

    /* custom hook 호출 */
    const [editTodoId, setEditTodoId] = useEdit();

    const moveReorderHandler = useCallback(
      (todo: TodoEntity, direction: 'up' | 'down') => {
        if (!todos) return;
        const copyMapTodo = new Map(todos);
        const dateKey = Array.from(copyMapTodo.keys())[0];
        const copyTodo = (copyMapTodo.get(dateKey) ?? []).slice();
        const idx = copyTodo.findIndex((t) => t.id === todo.id);
        if (idx === -1) return;

        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= copyTodo.length) return;

        const prevOrder = todo.order as number;
        const newOrder = copyTodo[swapIdx].order as number;

        [copyTodo[idx], copyTodo[swapIdx]] = [copyTodo[swapIdx], copyTodo[idx]];
        copyMapTodo.set(dateKey, copyTodo);

        reorderMutate({ prevOrder, newOrder, todolist: copyMapTodo });
      },
      [todos, reorderMutate],
    );

    return (
      <>
        <TodoListContainer
          bg={isExtreme ? 'extreme_dark' : 'primary1'}
          padding="1rem 1.5rem"
          className="card"
        >
          {isMobile && (
            <div className="mobile-header-wrapper">
              <div className="mobile-top-button-slot">
                {mobileTopButtonSlot}
              </div>
              <BtnAtom
                handleOnClick={handleClose}
                ariaLabel="close"
                className="close__btn"
                tabIndex={3}
              >
                <IconAtom size={1.5} alt="close" src="icon/closeYellow.svg" />
              </BtnAtom>
            </div>
          )}
          <div className="todo-list-wrapper">
            <ListSection>
              <div className="header__todo">
                <TypoAtom fontSize="body" fontColor="primary2">
                  완료한 TODO
                </TypoAtom>
              </div>
              {doneTodoList ? (
                <List>
                  {doneTodoList.map((doneTodo, idx) => (
                    <MemoTodoCard
                      key={doneTodo.id}
                      isThisEdit={editTodoId === doneTodo.id}
                      setEditTodoId={setEditTodoId}
                      todoData={doneTodo}
                      focusStep={focusStep}
                      randomTagColor={randomTagColor}
                      isCurrTodo={false}
                      order={idx + 1}
                      isExtreme={isExtreme}
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
              <div className="header__todo">
                <TypoAtom fontSize="body" fontColor="primary2">
                  남은 TODO
                </TypoAtom>
                {!isMobile && (
                  <BtnAtom
                    handleOnClick={handleClose}
                    ariaLabel="close"
                    className="close__btn"
                    tabIndex={3}
                  >
                    <IconAtom
                      size={1.5}
                      alt="close"
                      src="icon/closeYellow.svg"
                    />
                  </BtnAtom>
                )}
              </div>
              {todoList ? (
                <List>
                  {currentTodo && (
                    <MemoTodoCard
                      isThisEdit={editTodoId === currentTodo.id}
                      setEditTodoId={setEditTodoId}
                      todoData={currentTodo}
                      focusStep={focusStep}
                      randomTagColor={randomTagColor}
                      isCurrTodo={true}
                      order={(doneTodoList?.length ?? 0) + 1}
                      isExtreme={isExtreme}
                    />
                  )}
                  <div className="innerList">
                    {(() => {
                      const filteredList = todoList.filter(
                        (todo) => todo.id !== currentTodo?.id,
                      );
                      return filteredList.map((todo, idx) => (
                        <li key={todo.id}>
                          <MemoTodoCard
                            isThisEdit={editTodoId === todo.id}
                            setEditTodoId={setEditTodoId}
                            todoData={todo}
                            focusStep={focusStep}
                            randomTagColor={randomTagColor}
                            isCurrTodo={false}
                            order={
                              idx +
                              1 +
                              (doneTodoList?.length ?? 0) +
                              (currentTodo ? 1 : 0)
                            }
                            isExtreme={isExtreme}
                            onMoveUp={() => moveReorderHandler(todo, 'up')}
                            onMoveDown={() => moveReorderHandler(todo, 'down')}
                            isFirst={idx === 0}
                            isLast={idx === filteredList.length - 1}
                          />
                        </li>
                      ));
                    })()}
                  </div>
                </List>
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
          </div>
        </TodoListContainer>
      </>
    );
  },
);

const TodoListContainer = styled(CardAtom)`
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .mobile-header-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .mobile-top-button-slot {
    flex-shrink: 0;
    text-align: left;
  }

  .todo-list-wrapper {
    width: 100%;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: row;
    column-gap: 1rem;
  }
`;

const ListSection = styled.section`
  width: 50%;
  min-height: 0;
  display: grid;
  grid-template-rows: auto 1fr;

  .header__todo {
    justify-content: space-between;
    min-height: 1.5rem;
    padding-bottom: 0.5rem;
    display: flex;
    align-items: center;
  }
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
