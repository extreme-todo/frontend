import styled from '@emotion/styled';
import { forwardRef, ReactElement } from 'react';
import { BackgroundColor } from '../styles/emotion';

interface IIconAtomProps {
  children: ReactElement<HTMLImageElement>;
  size?: number;
  backgroundColor?: keyof BackgroundColor | 'transparent';
  className?: string;
}

const IconAtom = forwardRef<HTMLDivElement, IIconAtomProps>(
  (
    { size = 4.455, children, backgroundColor = 'transparent', ...props },
    ref,
  ) => {
    return (
      <IconContainer
        backgroundColor={backgroundColor}
        size={size}
        {...props}
        ref={ref}
      >
        {children}
      </IconContainer>
    );
  },
);

export default IconAtom;

const IconContainer = styled.div<
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
