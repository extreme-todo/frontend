import { BtnAtom, CardAtom, TypoAtom } from '../atoms';
import { TodoCard } from '../molecules';
import { Modal } from '../components';

import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  DraggingStyle,
  DropResult,
  Droppable,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import { useQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';

import { AddTodoDto, ETIndexed } from '../DB/indexed';
import { TodoEntity, TodoDate } from '../DB/indexedAction';
import { useOrderingMutation } from '../shared/queries';
import { createPortal } from 'react-dom';
import { JSXElementConstructor, ReactElement, ReactNode } from 'react';

const dragEl = document.getElementById('draggable');

const optionalPortal = (
  style: DraggingStyle | NotDraggingStyle | undefined,
  element: ReactElement<HTMLElement, string | JSXElementConstructor<any>>,
) => {
  if (
    Object.getOwnPropertyNames(style).includes('position') &&
    (style as DraggingStyle).position === 'fixed'
  ) {
    return createPortal(element, dragEl as HTMLElement);
  }
  return element;
};

const listRender = (mapTodo: Map<string, TodoEntity[]>) => {
  const dateList = Array.from(mapTodo.keys());
  const todoList = Array.from(mapTodo.values());

  const renderList = dateList.map((date, idx) => (
    <Droppable droppableId={date} key={date}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <TypoAtom>{date}</TypoAtom>
          {todoList[idx].map((todo, idx) => (
            <Draggable draggableId={String(todo.id)} index={idx} key={todo.id}>
              {(provided) =>
                optionalPortal(
                  provided.draggableProps.style,
                  (
                    <DraggableContainer
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                    >
                      <TodoCard
                        dragProps={provided.dragHandleProps}
                        todoData={todo}
                      />
                    </DraggableContainer>
                  ) as ReactElement<
                    HTMLElement,
                    string | JSXElementConstructor<any>
                  >,
                )
              }
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  ));

  return renderList;
};
// 'Practice Valorant'
// 'Go to grocery store'
// 'Watch English News'
// 'Start Exercise'
// 'Check Riff'
const addTodoMock = (): Omit<AddTodoDto, 'order'> => {
  return {
    date: '2023-08-16',
    todo: 'Check Riff',
    duration: 60 * 60,
    categories: null,
  };
};

const db = new ETIndexed();

const TodoListModal = () => {
  const {
    data: todos,
    error,
    isLoading,
  } = useQuery(['todos'], () => db.getList(false), {
    refetchOnWindowFocus: false,
  });
  const orderMutate = useOrderingMutation();
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

  const onDragDropHandler = (info: DropResult) => {
    const { destination, source } = info;
    // 이동이 없을 때
    if (!destination) return;
    // 같은 날 안에서 이동을 했을 때

    if (source.droppableId === destination.droppableId) {
      const modifiedTodoList = modifiedSameDate(source, destination);
      orderMutate(modifiedTodoList);
    } else if (source.droppableId !== destination.droppableId) {
      // 다른 날에서 이동했을 때
      const modifiedTodoList = modifiedDiffDate(source, destination);
      orderMutate(modifiedTodoList);
    }
  };

  const onClickHandler = () => {
    const mock = addTodoMock();
    db.addTodo(mock);
  };

  return (
    <>
      {/* <Modal
        title={'할 일 목록'}
        handleClose={() => {
          alert('닫기');
        }}
      > */}
      <CardAtom>
        <BtnAtom children={'add Todo'} handler={onClickHandler} />
        <DragDropContext onDragEnd={onDragDropHandler}>
          {!isLoading && todos ? listRender(todos) : null}
        </DragDropContext>
      </CardAtom>
      {/* </Modal> */}
    </>
  );
};

export default TodoListModal;

const DraggableContainer = styled.div`
  display: flex;
  align-items: center;
`;
