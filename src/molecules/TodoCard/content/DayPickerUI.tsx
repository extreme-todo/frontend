import { useState } from 'react';
import FocusTrap from 'focus-trap-react';
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker';
import { usePopper } from 'react-popper';
import { differenceInCalendarDays } from 'date-fns';

interface IDayPickerUIProps {
  showPopper: boolean;
  popperRef: React.RefObject<HTMLDivElement>;
  selected: Date;
  setShowPopper: React.Dispatch<React.SetStateAction<boolean>>;
  setSelected: React.Dispatch<React.SetStateAction<Date>>;
}

const DayPickerUI = ({
  showPopper,
  popperRef,
  selected,
  setShowPopper,
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
    setShowPopper(false);
  };

  const handleDaySelect: SelectSingleEventHandler = (date) => {
    if (!date) return;
    setSelected(date);
  };

  return (
    <>
      {showPopper && (
        <FocusTrap
          active
          focusTrapOptions={{
            initialFocus: false,
            allowOutsideClick: true,
            clickOutsideDeactivates: true,
            onDeactivate: handleClosePopper,
          }}
        >
          <div
            tabIndex={-1}
            style={popper.styles.popper}
            className="dialog-sheet"
            {...popper.attributes.popper}
            ref={setPopperElement}
            role="dialog"
            aria-label="Daypicker calendar"
          >
            <DayPicker
              initialFocus={showPopper}
              mode="single"
              selected={selected}
              onSelect={handleDaySelect}
              defaultMonth={new Date()}
              fromMonth={new Date()}
              disabled={{ before: new Date() }}
              required
            />
          </div>
        </FocusTrap>
      )}
    </>
  );
};

export default DayPickerUI;
