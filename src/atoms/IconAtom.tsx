import styled from '@emotion/styled';
import { forwardRef } from 'react';
import { BackgroundColorName } from '../styles/emotion';

interface IIconAtomProps {
  src: string;
  alt?: string;
  size?: number;
  backgroundColor?: BackgroundColorName | 'transparent';
  className?: string;
  id?: string;
  w?: number;
  h?: number;
}

const IconAtom = forwardRef<HTMLImageElement, IIconAtomProps>(
  ({ size = 4.455, backgroundColor = 'transparent', id, ...props }, ref) => {
    return (
      <IconContainer
        backgroundColor={backgroundColor}
        size={size}
        ref={ref}
        id={id}
        {...props}
      />
    );
  },
);

export default IconAtom;

const IconContainer = styled.img<
  Pick<IIconAtomProps, 'size' | 'backgroundColor' | 'h' | 'w'>
>`
  height: ${({ size, h }) =>
    h ? `${h}rem` : size ? `${size}rem` : `4.455rem`};
  width: ${({ size, w }) => (w ? `${w}rem` : size ? `${size}rem` : `4.455rem`)};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ backgroundColor, theme }) =>
    backgroundColor === 'transparent'
      ? backgroundColor
      : backgroundColor
      ? theme.color.backgroundColor[backgroundColor]
      : null};
  cursor: pointer;
`;
