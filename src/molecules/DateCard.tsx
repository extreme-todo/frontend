import styled from '@emotion/styled';
import { Droppable } from 'react-beautiful-dnd';
import { TypoAtom } from '../atoms';
import { ReactElement } from 'react';

interface IDateCardProps {
  date: string;
  children: ReactElement;
}

const DateCard = ({ children, date }: IDateCardProps) => {
  return (
    <Droppable droppableId={date}>
      {(provided) => (
        <DateCardWrapper {...provided.droppableProps} ref={provided.innerRef}>
          <TypoAtom>{date}</TypoAtom>
          {children}
          {provided.placeholder}
        </DateCardWrapper>
      )}
    </Droppable>
  );
};

export default DateCard;

const DateCardWrapper = styled.div``;
