import React, { AriaRole, Dispatch } from 'react';
import { usePopper } from 'react-popper';
import { type Placement } from '../../node_modules/@popperjs/core/lib/enums';
import { IChildProps } from '../shared/interfaces';

interface IPopperAtom extends IChildProps {
  popperElement: HTMLElement | null;
  setPopperElement: Dispatch<React.SetStateAction<any>>;
  popperRef: React.RefObject<HTMLElement>;
  placement: Placement;
  ariaLabel?: string;
  tabIndex?: number;
  role?: AriaRole;
  className?: string;
  offset?: [number, number];
}

const PopperAtom = ({
  popperElement,
  setPopperElement,
  popperRef,
  placement,
  children,
  ariaLabel,
  offset = [0, 0],
  ...props
}: IPopperAtom) => {
  const popper = usePopper(popperRef.current, popperElement, {
    placement,
    modifiers: [
      {
        name: 'offset',
        options: { offset },
      },
    ],
  });

  return (
    <div
      style={popper.styles.popper}
      ref={setPopperElement}
      aria-label={ariaLabel}
      {...props}
      {...popper.attributes.popper}
    >
      {children}
    </div>
  );
};

export default PopperAtom;
