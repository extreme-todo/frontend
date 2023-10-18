import { ReactElement } from 'react';
import { createPortal } from 'react-dom';

import { TypoAtom } from '../atoms';
import { TodoCard } from '../molecules';

import { TodoEntity } from '../DB/indexedAction';

import styled from '@emotion/styled';
import {
  Draggable,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from 'react-beautiful-dnd';

interface IDateCardProps {
  date: string;
  tododata: TodoEntity[];
}

const optionalPortal = (
  style: DraggingStyle | NotDraggingStyle | undefined,
  element: ReactElement,
) => {
  if (
    Object.getOwnPropertyNames(style).includes('position') &&
    (style as DraggingStyle).position === 'fixed'
  ) {
    return createPortal(element, document.body);
  }
  return element;
};

const DateCard = ({ tododata, date }: IDateCardProps) => {
  return (
    <Droppable droppableId={date}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <TypoAtom>{date}</TypoAtom>
          {tododata.map((todo, idx) => (
            <Draggable draggableId={String(todo.id)} index={idx} key={todo.id}>
              {(provided) =>
                optionalPortal(
                  provided.draggableProps.style,
                  <TodoCardContainer
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                  >
                    <TodoCard
                      dragHandleProps={provided.dragHandleProps}
                      todoData={todo}
                    />
                  </TodoCardContainer>,
                )
              }
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default DateCard;

const TodoCardContainer = styled.div``;
