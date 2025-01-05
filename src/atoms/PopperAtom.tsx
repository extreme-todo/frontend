import React, { AriaRole, Dispatch, useMemo } from 'react';
import { IChildProps } from '../shared/interfaces';
import { Modifier, usePopper } from 'react-popper';
import { Rect } from '@popperjs/core';
import { type Placement } from '../../node_modules/@popperjs/core/lib/enums';

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
  offset,
  ...props
}: IPopperAtom) => {
  const memoModified = useMemo<Partial<Modifier<string, object>>>(
    () => ({
      name: 'offset',
      options: {
        offset: ({ reference }: { reference: Rect }) => {
          return offset ?? [-reference.width + reference.width / 3];
        },
      },
    }),
    [],
  );
  const popper = usePopper(popperRef.current, popperElement, {
    placement,
    modifiers: [memoModified],
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
