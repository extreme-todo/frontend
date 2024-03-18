import { useRef, useState } from 'react';
import {
  IconAtom,
  InputAtom,
  DayPickerUI,
  type IDayPickerUIProps,
} from '../atoms';

import { format } from 'date-fns';

import styled from '@emotion/styled';
import 'react-day-picker/dist/style.css';

interface ICalendarInputProps
  extends Pick<IDayPickerUIProps, 'handleDaySelect'> {
  selectedDay: Date;
}

const CalendarInput = ({
  selectedDay,
  handleDaySelect,
}: ICalendarInputProps) => {
  const [showPopper, setShowPopper] = useState(false);
  const popperRef = useRef<HTMLDivElement>(null);

  const handleClosePopper = () => {
    setShowPopper(false);
  };

  const handleOpenPopper = () => {
    setShowPopper(true);
  };

  return (
    <>
      <CalendarContainer
        ref={popperRef}
        title="달력 아이콘을 클릭해 주세요."
        onClick={handleOpenPopper}
      >
        <IconAtom>
          <img alt="calendar_icon" src="icons/calendar.svg" />
        </IconAtom>
        <InputAtom.Underline
          value={format(selectedDay.toString(), 'y-MM-dd')}
          ariaLabel="calendar_input"
          placeholder={'달력 아이콘을 눌러주세요.'}
          styleOption={{ width: '7rem' }}
          handleChange={() => {
            console.debug('click');
          }}
        />
      </CalendarContainer>
      <DayPickerUI
        showPopper={showPopper}
        popperRef={popperRef}
        selected={selectedDay}
        handleClosePopper={handleClosePopper}
        handleDaySelect={handleDaySelect}
      />
    </>
  );
};

export default CalendarInput;

export const CalendarContainer = styled.div`
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 1rem;
  padding: 1px;
  /* margin-top: 0.61rem; */

  :hover {
    background-color: ${({ theme }) => theme.colors.bgColor};
    transition: background-color 0.2s ease-in-out;
  }

  div:first-of-type {
    width: 2rem;
    height: 2rem;
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
