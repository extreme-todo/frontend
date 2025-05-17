import { AriaRole, Dispatch, useEffect, useMemo, useState } from 'react';
import { IChildProps } from '../shared/interfaces';
import { Modifier, usePopper } from 'react-popper';
import { Rect } from '@popperjs/core';
import { type Placement } from '../../node_modules/@popperjs/core/lib/enums';
import styled from '@emotion/styled';

interface IPopperAtom extends IChildProps {
  popperElement: HTMLElement | null;
  setPopperElement: Dispatch<React.SetStateAction<any>>;
  triggerElement: HTMLElement | null;
  arrowElement?: HTMLElement | null;
  placement: Placement;
  ariaLabel?: string;
  tabIndex?: number;
  role?: AriaRole;
  className?: string;
  offset?: [number, number];
}

export const PopperAtom = ({
  popperElement,
  setPopperElement,
  triggerElement,
  arrowElement,
  placement,
  children,
  ariaLabel,
  offset,
  className,
  ...props
}: IPopperAtom) => {
  const [isRender, setIsRender] = useState(true);

  const arrowOffset = (
    arrowElement && triggerElement && popperElement
      ? [
          triggerElement.getBoundingClientRect().x -
            popperElement.getBoundingClientRect().x +
            triggerElement.clientWidth / 3,
          (arrowElement.clientHeight ?? 0) / 2,
        ]
      : undefined
  ) as [number, number] | undefined;

  const memoOffsetModifier = useMemo<Partial<Modifier<string, object>>>(
    () => ({
      name: 'offset',
      options: {
        offset: ({ reference }: { reference: Rect }) => {
          return offset ?? [0, 5 + (arrowElement?.clientHeight ?? 0) / 2];
        },
      },
    }),
    [offset, arrowElement?.clientHeight],
  );

  const memoArrowModifier = useMemo<Partial<Modifier<string, object>>>(
    () => ({
      name: 'arrow',
      options: {
        element: arrowElement,
        padding: arrowElement?.clientWidth ?? 0,
      },
    }),
    [arrowElement],
  );

  const popper = usePopper(triggerElement, popperElement, {
    placement,
    modifiers: [
      memoOffsetModifier,
      memoArrowModifier,
      {
        name: 'preventOverflow',
        options: {
          padding: 5,
        },
      },
      {
        name: 'flip',
      },
      {
        name: 'shift',
      },
      {
        name: 'autoUpdate',
        options: {
          elementRects: true,
        },
      },
    ],
  });

  useEffect(() => {
    setIsRender(false);
  }, []);

  return (
    <PopperElement
      style={popper.styles.popper}
      ref={setPopperElement}
      aria-label={ariaLabel}
      {...props}
      {...popper.attributes.popper}
      className={className}
      arrowOffset={arrowOffset}
      isRender={isRender}
    >
      {children}
    </PopperElement>
  );
};

const PopperElement = styled.div<{
  arrowOffset: [number, number] | undefined;
  isRender: boolean;
}>(({ arrowOffset, isRender }) => ({
  opacity: isRender ? 0 : 1,
  '&[data-popper-placement^="top"] > #arrow': {
    top: '100%',
    transform:
      arrowOffset !== undefined
        ? `translate(${arrowOffset[0]}px,${-arrowOffset[1]}px)`
        : undefined,
  },
  '&[data-popper-placement^="bottom"] > #arrow': {
    bottom: '100%',
    transform:
      arrowOffset !== undefined
        ? `translate(${arrowOffset[0]}px, ${arrowOffset[1]}px)`
        : undefined,
  },
}));
