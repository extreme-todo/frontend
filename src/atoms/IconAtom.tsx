import styled from '@emotion/styled';
import { forwardRef } from 'react';
import { BackgroundColor } from '../styles/emotion';

interface IIconAtomProps {
  src: string;
  alt?: string;
  size?: number;
  backgroundColor?: keyof BackgroundColor | 'transparent';
  className?: string;
}

const IconAtom = forwardRef<HTMLImageElement, IIconAtomProps>(
  ({ size = 4.455, backgroundColor = 'transparent', ...props }, ref) => {
    return (
      <IconContainer
        backgroundColor={backgroundColor}
        size={size}
        ref={ref}
        {...props}
      />
    );
  },
);

export default IconAtom;

const IconContainer = styled.img<
  Pick<IIconAtomProps, 'size' | 'backgroundColor'>
>`
  height: ${({ size }) => (size ? `${size}rem` : `4.455rem`)};
  width: ${({ size }) => (size ? `${size}rem` : `4.455rem`)};
  border-radius: ${({ size }) => (size ? `${size * 0.5}rem` : null)};
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
