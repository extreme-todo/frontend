import { memo, ReactNode, useMemo, useState } from 'react';

/* component */
import { TodoCard } from '../';
import { BtnAtom, CardAtom, IconAtom, TypoAtom } from '../../atoms';
import { TodoTab } from './TodoTab';

/* indexed DB */
import { TodoEntity } from '../../DB/indexedAction';

/* hooks */
import {
  useEdit,
  type focusStep,
  useIsMobile,
  useExtremeMode,
  useTodoListData,
} from '../../hooks';

/* etc */
import styled from '@emotion/styled';
import { RandomTagColorList } from '../../shared/RandomTagColorList';
import { ModalType } from '../MainTodo';

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
    const isMobile = useIsMobile();
    const { isExtreme } = useExtremeMode();

    const { todoList, doneTodoList } = useTodoListData();

    /* custom hook 호출 */
    const [editTodoId, setEditTodoId] = useEdit();

    const [activeTab, setActiveTab] = useState<'todo' | 'done'>('todo');

    const doneListSection = useMemo(
      () => (
        <ListSection
          isMobile={isMobile}
          role={isMobile ? 'tabpanel' : undefined}
          id="done-tabpanel"
          aria-labelledby="done-tab"
        >
          {!isMobile && (
            <div className="header__todo">
              <TypoAtom fontSize="body" fontColor="primary2">
                완료한 TODO
              </TypoAtom>
            </div>
          )}
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
      ),
      [doneTodoList, editTodoId, focusStep, isExtreme, isMobile, setEditTodoId],
    );

    const todoListSection = useMemo(
      () => (
        <ListSection
          isMobile={isMobile}
          role={isMobile ? 'tabpanel' : undefined}
          id="todo-tabpanel"
          aria-labelledby="todo-tab"
        >
          {!isMobile && (
            <div className="header__todo">
              <TypoAtom fontSize="body" fontColor="primary2">
                남은 TODO
              </TypoAtom>
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
      ),
      [
        currentTodo,
        doneTodoList?.length,
        editTodoId,
        focusStep,
        handleClose,
        isExtreme,
        isMobile,
        openAddTodoModal,
        setEditTodoId,
        todoList,
      ],
    );

    return (
      <>
        {/* <BtnAtom children={'add Todo'} handleOnClick={onClickHandler} /> */}
        <TodoListContainer
          bg={isExtreme ? 'extreme_dark' : 'primary1'}
          padding="1rem 1.5rem"
          className="card"
          isMobile={isMobile}
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
          {isMobile && (
            <TodoTab
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isExtreme={isExtreme}
            />
          )}
          <div className="todo-list-wrapper">
            {isMobile ? (
              activeTab === 'todo' ? (
                todoListSection
              ) : (
                doneListSection
              )
            ) : (
              <>
                {doneListSection}
                {todoListSection}
              </>
            )}
          </div>
        </TodoListContainer>
      </>
    );
  },
);

const TodoListContainer = styled(CardAtom)<{ isMobile: boolean }>`
  /* &,
  * {
    outline: red 1px solid;
  } */
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .mobile-header-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
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
    flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
    column-gap: 1rem;
  }
`;

const ListSection = styled.section<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '100%' : '50%')};
  min-height: 0;
  display: grid;
  grid-template-rows: ${({ isMobile }) => (isMobile ? '1fr' : 'auto 1fr')};

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
