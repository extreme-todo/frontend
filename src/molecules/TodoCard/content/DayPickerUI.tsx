import { useState } from 'react';
import styled from '@emotion/styled';
import FocusTrap from 'focus-trap-react';
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker';
import { usePopper } from 'react-popper';
import { differenceInCalendarDays } from 'date-fns';

interface IDayPickerUIProps {
  isPopper: boolean;
  popperRef: React.RefObject<HTMLDivElement>;
  selected: Date;
  setIsPopper: React.Dispatch<React.SetStateAction<boolean>>;
  setSelected: React.Dispatch<React.SetStateAction<Date>>;
}

const DayPickerUI = ({
  isPopper,
  popperRef,
  selected,
  setIsPopper,
  setSelected,
}: IDayPickerUIProps) => {
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );

  function isPastDate(date: Date) {
    return differenceInCalendarDays(date, new Date()) < 0;
  }

  const popper = usePopper(popperRef.current, popperElement, {
    placement: 'bottom-start',
  });

  const handleClosePopper = () => {
    setIsPopper(false);
  };

  const handleDaySelect: SelectSingleEventHandler = (date) => {
    if (!date) return;
    setSelected(date);
  };

  return (
    <>
      {isPopper && (
        <FocusTrap
          active
          focusTrapOptions={{
            initialFocus: false,
            allowOutsideClick: true,
            clickOutsideDeactivates: true,
            onDeactivate: handleClosePopper,
          }}
        >
          <PickerContainer
            tabIndex={-1}
            style={popper.styles.popper}
            className="dialog-sheet"
            {...popper.attributes.popper}
            ref={setPopperElement}
            role="dialog"
            aria-label="Daypicker calendar"
          >
            <DayPicker
              initialFocus={isPopper}
              mode="single"
              defaultMonth={selected}
              selected={selected}
              onSelect={handleDaySelect}
              required
              hidden={isPastDate}
            />
          </PickerContainer>
        </FocusTrap>
      )}
    </>
  );
};

export default DayPickerUI;

const PickerContainer = styled.div``;
