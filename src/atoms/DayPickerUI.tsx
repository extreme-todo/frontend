import { useState } from 'react';
import FocusTrap from 'focus-trap-react';
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker';
import { usePopper } from 'react-popper';

interface IDayPickerUIProps {
  showPopper: boolean;
  popperRef: React.RefObject<HTMLDivElement>;
  selected: Date;
  handleClosePopper: () => void;
  handleDaySelect: SelectSingleEventHandler;
}

const DayPickerUI = ({
  showPopper,
  popperRef,
  selected,
  handleClosePopper,
  handleDaySelect,
}: IDayPickerUIProps) => {
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const popper = usePopper(popperRef.current, popperElement, {
    placement: 'bottom-start',
  });

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
export { type IDayPickerUIProps };
