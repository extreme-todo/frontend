import { TypoAtom } from '../atoms';
import { TodoCard } from '../molecules';

import { useDraggableInPortal } from '../hooks';
import { TodoEntity } from '../DB/indexedAction';

import styled from '@emotion/styled';
import { Draggable, Droppable } from 'react-beautiful-dnd';

interface IDateCardProps {
  date: string;
  tododata: TodoEntity[];
}

const DateCard = ({ tododata, date }: IDateCardProps) => {
  const optionalPortal = useDraggableInPortal();

  return (
    <Droppable droppableId={date}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <TypoAtom>{date}</TypoAtom>
          {tododata.map((todo, idx) => (
            <Draggable draggableId={String(todo.id)} index={idx} key={todo.id}>
              {optionalPortal((provided) => (
                <TodoCardContainer
                  {...provided.draggableProps}
                  ref={provided.innerRef}
                >
                  <TodoCard
                    dragHandleProps={provided.dragHandleProps}
                    todoData={todo}
                  />
                </TodoCardContainer>
              ))}
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
