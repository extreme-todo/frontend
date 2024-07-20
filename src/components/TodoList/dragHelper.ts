import { DraggableLocation, DropResult } from 'react-beautiful-dnd';
import { TodoEntity } from '../../DB/indexedAction';

/* todo re-ordering 관련 함수  */
const modifiedSameDate = (
  source: DraggableLocation,
  destination: DraggableLocation,
  todos: Map<string, TodoEntity[]>,
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
  todos: Map<string, TodoEntity[]>,
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
    newDate: destination.droppableId,
    todolist: copyMapTodo,
  };
};

export const onDragDropHandler = (
  info: DropResult,
  todos: Map<string, TodoEntity[]>,
) => {
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
    return modifiedSameDate(source, destination, todos);
  } else if (source.droppableId !== destination.droppableId) {
    // 다른 날에서 이동했을 때
    return modifiedDiffDate(source, destination, todos);
  }
};
