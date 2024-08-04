import { useState } from 'react';
import FocusTrap from 'focus-trap-react';
import { Button, DayPicker, SelectSingleEventHandler } from 'react-day-picker';
import { PopperAtom } from '../atoms';

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

  return (
    <>
      {showPopper && (
        <FocusTrap
          active
          focusTrapOptions={{
            initialFocus: false,
            allowOutsideClick: true,
          }}
        >
          <PopperAtom
            popperElement={popperElement}
            setPopperElement={setPopperElement}
            popperRef={popperRef}
            placement={'bottom-start'}
            tabIndex={-1}
            className="dialog-sheet"
            role="dialog"
            ariaLabel="Daypicker calendar"
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
              footer={
                <div className="daypickerFooterWrapper">
                  <button
                    className="daypickerFooter"
                    onClick={handleClosePopper}
                  >
                    닫기
                  </button>
                </div>
              }
            />
          </PopperAtom>
        </FocusTrap>
      )}
    </>
  );
};

export default DayPickerUI;
export { type IDayPickerUIProps };
