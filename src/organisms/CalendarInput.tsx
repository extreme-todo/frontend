import { useRef, useState } from 'react';
import { InputAtom, TypoAtom } from '../atoms';
import { DayPickerUI, type IDayPickerUIProps } from '../molecules';

import { getDateInFormat } from '../shared/timeUtils';

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
        <TypoAtom>🗓️</TypoAtom>
        <InputAtom.Underline
          value={getDateInFormat(selectedDay)}
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
        handleDaySelect={(...args) => {
          handleDaySelect(...args);
          handleClosePopper();
        }}
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
  padding: 1px;
  width: fit-content;

  div:first-of-type {
    width: 2rem;
    height: 2rem;
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  & > input:hover {
    border-radius: 1rem;
    background-color: ${({ theme }) => theme.colors.bgColor};
    transition: background-color 0.2s ease-in-out;
  }

  & > span {
    margin-right: 1rem;
  }
`;