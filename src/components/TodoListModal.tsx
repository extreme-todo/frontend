/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BtnAtom, CardAtom, TypoAtom } from '../atoms';
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd';
import { useEffect, useRef, useState } from 'react';
import IconAtom from '../atoms/IconAtom';
import styled from '@emotion/styled';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AddTodoDto, ETIndexed } from '../DB/indexed';
import { TodoEntity, TodoDate } from '../DB/indexedAction';

const listRender = (mapTodo: Map<string, TodoEntity[]>) => {
  const dateList = Array.from(mapTodo.keys());
  const todoList = Array.from(mapTodo.values());

  const renderList = dateList.map((date, idx) => (
    <Droppable droppableId={date} key={date}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <TypoAtom>{date}</TypoAtom>
          {todoList[idx].map(({ id, todo }, idx) => (
            <Draggable draggableId={String(id)} index={idx} key={id}>
              {(provided) => (
                <DraggableContainer
                  {...provided.draggableProps}
                  ref={provided.innerRef}
                >
                  <IconAtom {...provided.dragHandleProps}>
                    <img src={'icons/handle.svg'}></img>
                  </IconAtom>
                  <TypoAtom>{todo}</TypoAtom>
                </DraggableContainer>
              )}
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
    date: '2023-08-15',
    todo: 'Watch English News',
    duration: 60 * 60,
    categories: null,
  };
};

// index -> mySQL
// addTodo => order 의 마지막 값을 조회해서 그거에 +1.. =>
// 1. 추가되는 todo가 어느 날짜에 추가될건지..
// 1-1. 그 날짜에 todo data가 이미 있으면 그 날짜의 마지막 order에서 +1..
// 1-2. 그 전날 마지막 todo의 order => +1.. -> Map.. -> values.. -> Array.from() -> flat()
// last order 만 해줄 게 아니었다...

const db = new ETIndexed();

const TodoListModal = () => {
  /* Tanstack Query 테스트용 ************************************ */
  const queryClient = useQueryClient();
  const {
    data: todos,
    error,
    isLoading,
  } = useQuery(['todos'], () => db.getList(false), {
    refetchOnWindowFocus: false,
  });

  // 컴포넌트 안에서 전역변수
  const dropResultRef = useRef<{
    prevOrder: number;
    newOrder: number;
    id?: number;
    newDate?: TodoDate;
  }>();

  const mutationHandler = async ({
    prevOrder,
    newOrder,
    id,
    newDate,
  }: {
    prevOrder: number;
    newOrder: number;
    id?: number;
    newDate?: TodoDate;
    todolist?: Map<string, TodoEntity[]>;
  }) => {
    // if (dropResultRef.current) {
    // const { prevOrder, newOrder, newDate, id } = dropResultRef.current;
    if (!newDate || !id) {
      await db.orderTodos(prevOrder, newOrder);
    } else {
      await db.updateTodo(id, { date: newDate });
      await db.orderTodos(prevOrder, newOrder);
    }
    // }
  };

  const { mutate: orderMutate } = useMutation(mutationHandler, {
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError(_err: any, _: any, context: any) {
      queryClient.setQueryData(['todos'], context.prevTodoList);
    },
    onMutate({
      todolist,
    }: {
      prevOrder: number;
      newOrder: number;
      id?: number;
      newDate?: TodoDate;
      todolist?: Map<string, TodoEntity[]>;
    }) {
      queryClient.cancelQueries({ queryKey: ['todos'] });
      const prevTodoList = queryClient.getQueryData(['todos']);
      queryClient.setQueryData(['todos'], todolist);
      return { prevTodoList };
    },
  });

  /* ************************************ Tanstack Query 테스트용 */

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

    // dropResultRef.current = {
    //   prevOrder: sourceIndexInArray + 1,
    //   newOrder: destinationIndexInArray + 1,
    // };

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

    // dropResultRef.current = {
    //   prevOrder: sourceIndexInArray + 1,
    //   newOrder: destinationIndexInArray + 1,
    //   id: target.id,
    //   newDate: destination.droppableId as TodoDate,
    // };

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
      <CardAtom>
        <BtnAtom children={'add Todo'} handler={onClickHandler} />
        <DragDropContext onDragEnd={onDragDropHandler}>
          {!isLoading && todos ? listRender(todos) : null}
        </DragDropContext>
      </CardAtom>
    </>
  );
};

export default TodoListModal;

const DraggableContainer = styled.div`
  display: flex;
  align-items: center;
`;
