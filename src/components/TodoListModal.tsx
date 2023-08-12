/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CardAtom, TypoAtom } from '../atoms';
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import IconAtom from '../atoms/IconAtom';
import styled from '@emotion/styled';

interface TodoDto {
  id: number;
  date: string;
  todo: string;
  createdAt: Date;
  duration: number;
  done: boolean;
  categories: string[] | null;
  focusTime: number;
  order: number | null;
}

/* 테스트용 ************************************ */

const todoStubs = [
  {
    id: 1,
    date: '2023-08-08',
    todo: 'Go to grocery store',
    createdAt: new Date('Dec 26, 2022 18:00:30'),
    duration: 60 * 60,
    done: false,
    categories: null,
    focusTime: 0,
    order: 1,
  },
  {
    id: 2,
    date: '2023-08-08',
    todo: 'Go to Gym',
    createdAt: new Date('Dec 26, 2022 18:00:30'),
    duration: 60 * 60,
    done: false,
    categories: null,
    focusTime: 0,
    order: 0,
  },
  {
    id: 3,
    date: '2023-08-13',
    todo: 'Go to institute',
    createdAt: new Date('Dec 28, 2022 18:00:30'),
    duration: 60 * 60 * 2,
    done: true,
    categories: null,
    focusTime: 0,
    order: null,
  },
  {
    id: 4,
    date: '2023-08-13',
    todo: 'Go to grocery store',
    createdAt: new Date('Dec 26, 2022 18:00:30'),
    duration: 60 * 60,
    done: false,
    categories: null,
    focusTime: 0,
    order: 0,
  },
  {
    id: 5,
    date: '2023-08-13',
    todo: 'write test code',
    createdAt: new Date('Dec 26, 2022 18:00:30'),
    duration: 60 * 60,
    done: false,
    categories: null,
    focusTime: 0,
    order: 1,
  },
  {
    id: 6,
    date: '2023-08-14',
    todo: 'work ET',
    createdAt: new Date('Dec 26, 2022 18:00:30'),
    duration: 60 * 60,
    done: false,
    categories: null,
    focusTime: 0,
    order: 2,
  },
  {
    id: 7,
    date: '2023-08-14',
    todo: 'go to gym',
    createdAt: new Date('Dec 26, 2022 18:00:30'),
    duration: 60 * 60,
    done: false,
    categories: null,
    focusTime: 0,
    order: 3,
  },
  {
    id: 8,
    date: '2023-08-15',
    todo: 'Go to grocery store',
    createdAt: new Date('Dec 26, 2022 18:00:30'),
    duration: 60 * 60,
    done: false,
    categories: null,
    focusTime: 0,
    order: 4,
  },
];

const groupByDate = (todos: TodoDto[]) => {
  const todosMap = new Map<string, TodoDto[]>();
  for (const todo of todos) {
    const dateKey = todo.date;
    const group = todosMap.get(dateKey) || [];
    group.push(todo);
    todosMap.set(dateKey, group);
  }
  return todosMap;
};

const groupedStubs = groupByDate(todoStubs);

/* ************************************ 테스트용 */

const listRender = (mapTodo: Map<string, TodoDto[]>) => {
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

const TodoListModal = () => {
  const [mapTodo, setMapTodo] = useState<Map<string, TodoDto[]>>(groupedStubs);

  const modifiedSameDate = (
    source: DraggableLocation,
    destination: DraggableLocation,
  ) => {
    setMapTodo((prev) => {
      const copyMapTodo = new Map(prev);
      const copyTodo = copyMapTodo
        .get(source.droppableId)
        ?.slice() as unknown as TodoDto[];

      // [x]  1. 프론트 엔드 쪽에서 순서를 변경해준다.
      //      => tanStack Query를 사용한다면 api 요청만 하면 된다. 그걸 구현하게 되면 이 부분은 삭제하면 될 듯!
      const targetTodo = { ...copyTodo[source.index] };

      copyTodo.splice(source.index, 1);
      copyTodo.splice(destination.index, 0, targetTodo);
      copyMapTodo.set(source.droppableId, copyTodo);

      // [ ] 그와 동시에 백엔드에 api 요청을 보낸다. -> 할 때 order 정보를 잘 보내줘야 될 듯
      return copyMapTodo;
    });
  };

  const modifiedDiffDate = (
    source: DraggableLocation,
    destination: DraggableLocation,
  ) => {
    setMapTodo((prev) => {
      const copyMapTodo = new Map(prev);
      const copyPrevTodo = copyMapTodo
        .get(source.droppableId)
        ?.slice() as unknown as TodoDto[];
      // 1. 원래 source 부분에서 해당 todo를 삭제한다.
      const [...target] = copyPrevTodo.splice(source.index, 1);
      // 2. 수정 본을 set 한다.
      copyMapTodo.set(source.droppableId, copyPrevTodo);

      const copyCurrTodo = copyMapTodo
        .get(destination.droppableId)
        ?.slice() as unknown as TodoDto[];

      // 3. 갈 곳에 todo를 추가한다.
      copyCurrTodo.splice(destination.index, 0, ...target);

      // 4. 수정 본을 set 한다.
      copyMapTodo.set(destination.droppableId, copyCurrTodo);

      return copyMapTodo;
    });
  };

  const onDragDropHandler = (info: DropResult) => {
    const { destination, source } = info;
    // 이동이 없을 때
    if (!destination) return;
    // 같은 날 안에서 이동을 했을 때
    if (source.droppableId === destination.droppableId) {
      modifiedSameDate(source, destination);
    } else if (source.droppableId !== destination.droppableId) {
      // 다른 날에서 이동했을 때
      modifiedDiffDate(source, destination);
    }
  };

  useEffect(() => {
    // console.log('state가 드디어..');
  }, [mapTodo]);

  return (
    <>
      <CardAtom>
        <DragDropContext onDragEnd={onDragDropHandler}>
          {listRender(mapTodo)}
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
