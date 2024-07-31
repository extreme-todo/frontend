import { TypoAtom } from '../atoms';
import { TodoCard } from '../components';

import { useDraggableInPortal } from '../hooks';
import { TodoEntity } from '../DB/indexedAction';

import styled from '@emotion/styled';
import { Draggable, Droppable } from 'react-beautiful-dnd';

interface IDateCardProps {
  date: string;
  tododata: TodoEntity[];
}

const isSameDay = (dateStr1: Date, dateStr2: Date): boolean => {
  return (
    dateStr1.getFullYear() === dateStr2.getFullYear() &&
    dateStr1.getMonth() === dateStr2.getMonth() &&
    dateStr1.getDate() === dateStr2.getDate()
  );
};

const DateCard = ({ tododata, date }: IDateCardProps) => {
  const optionalPortal = useDraggableInPortal();

  return (
    <Droppable droppableId={date}>
      {(provided) => (
        <DroppableContainer
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <DateContainer>
            <TypoAtom
              className="dateTitle"
              fontSize="sub"
              fontColor="whiteWine"
            >
              {isSameDay(new Date(date), new Date()) ? '오늘' : date}
            </TypoAtom>
          </DateContainer>
          {tododata.map((todo, idx) => (
            <Draggable draggableId={String(todo.id)} index={idx} key={todo.id}>
              {optionalPortal((provided, snapshot) => (
                <DraggableContainer
                  {...provided.draggableProps}
                  ref={provided.innerRef}
                >
                  <TodoCard
                    dragHandleProps={provided.dragHandleProps}
                    todoData={todo}
                    snapshot={snapshot}
                  />
                </DraggableContainer>
              ))}
            </Draggable>
          ))}
          {provided.placeholder}
        </DroppableContainer>
      )}
    </Droppable>
  );
};

export default DateCard;

const DroppableContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  > * {
    margin-bottom: 0.5rem;
  }
`;

const DateContainer = styled.div`
  margin-bottom: 1rem;
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    .dateTitle {
      font-size: large;
    }
  }
`;

const DraggableContainer = styled.div``;
