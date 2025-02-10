import { ReactNode, useState } from 'react';
import FocusTrap from 'focus-trap-react';
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker';
import { PopperAtom } from '../atoms';

interface IDayPickerUIProps {
  showPopper: boolean;
  popperRef: React.RefObject<HTMLDivElement>;
  selected: Date;
  handleDaySelect: SelectSingleEventHandler;
  footerUI?: ReactNode;
}

const DayPickerUI = ({
  showPopper,
  popperRef,
  selected,
  footerUI,
  handleDaySelect,
}: IDayPickerUIProps) => {
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );

  return (
    <>
      {/* {showPopper && (
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
              footer={footerUI}
              required
            />
          </PopperAtom>
        </FocusTrap>
      )} */}
    </>
  );
};

export default DayPickerUI;
export { type IDayPickerUIProps };
