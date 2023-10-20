import { BtnAtom, CardAtom } from '../atoms';
import { DateCard } from '../organisms';

import { AddTodoDto, ETIndexed } from '../DB/indexed';
import { TodoEntity, TodoDate } from '../DB/indexedAction';
import { useOrderingMutation } from '../shared/queries';

import {
  DragDropContext,
  DraggableLocation,
  DropResult,
} from 'react-beautiful-dnd';
import { useQuery } from '@tanstack/react-query';

const listRender = (mapTodo: Map<string, TodoEntity[]>) => {
  const dateList = Array.from(mapTodo.keys());
  const todoList = Array.from(mapTodo.values());

  const renderList = dateList.map((date, idx) => (
    <DateCard key={date} date={date} tododata={todoList[idx]} />
  ));

  return renderList;
};

const addTodoMock = (): Omit<AddTodoDto, 'order'>[] => {
  return [
    {
      date: '2023-08-25',
      todo: 'practice valorant',
      duration: 60 * 60,
      categories: ['game', 'practice'],
    },
    {
      date: '2023-08-25',
      todo: 'go to grocery store',
      duration: 60 * 60,
      categories: ['chore'],
    },
    {
      date: '2023-08-20',
      todo: 'Watch English News',
      duration: 60 * 60,
      categories: ['english', 'study'],
    },
    {
      date: '2023-08-20',
      todo: 'Start Exercise',
      duration: 60 * 60,
      categories: ['health'],
    },
    {
      date: '2023-08-10',
      todo: 'check riff',
      duration: 60 * 60,
      categories: ['music', 'guitar'],
    },
  ];
};

const db = new ETIndexed();

const TodoListModal = () => {
  const { data: todos, isLoading } = useQuery(
    ['todos'],
    () => db.getList(false),
    {
      refetchOnWindowFocus: false,
    },
  );

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
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

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
    const temp = async () => {
      for (let i = 0; i < mock.length; i++) {
        await db.addTodo(mock[i]);
      }
    };
    temp();
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
