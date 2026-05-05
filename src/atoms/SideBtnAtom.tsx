import styled from '@emotion/styled';
import { ButtonName } from '../styles/emotion';

export interface SideBtnAtomProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  btnStyle: ButtonName;
  btnType?: 'text' | 'icon' | 'plain';
  className?: string;
  ariaLabel?: string;
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  focused?: boolean;
  children?: React.ReactNode;
  width?: string;
  height?: string;
}

export const SideBtnAtom = ({
  onClick,
  btnStyle,
  className,
  ariaLabel,
  type = 'button',
  disabled = false,
  focused = false,
  btnType = 'text',
  children,
  ...props
}: SideBtnAtomProps) => {
  return (
    <BaseBtnAtom
      btnType={btnType}
      onClick={onClick}
      btnStyle={btnStyle}
      className={className}
      aria-label={ariaLabel}
      type={type}
      disabled={disabled}
      focused={focused}
      {...props}
    >
      {children}
    </BaseBtnAtom>
  );
};

const BaseBtnAtom = styled.button<
  Pick<
    SideBtnAtomProps,
    'btnStyle' | 'focused' | 'btnType' | 'width' | 'height'
  >
>`
  width: ${({ width }) => width || 'auto'};
  height: ${({ height }) => height || 'auto'};

  background-color: transparent;
  color: ${({ theme, btnStyle }) => theme.sideButton[btnStyle].default.color};
  border: 1px solid
    ${({ theme, btnStyle }) => theme.sideButton[btnStyle].default.color};
  padding: ${({ width, height }) =>
    (height ? '0' : '0.25rem') + (width ? ' 0' : ' 1.5rem')};
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  text-align: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize.body.size};
  font-weight: ${({ theme }) => theme.fontSize.body.weight};
  line-height: ${({ theme }) => theme.fontSize.body.lineHeight};
  transition: background-color 0.3s, border-color 0.3s;

  &:hover {
    background-color: ${({ theme, btnStyle }) =>
      theme.sideButton[btnStyle].hover.backgroundColor};
    color: ${({ theme, btnStyle }) => theme.sideButton[btnStyle].hover.color};
  }
  &:active {
    background-color: ${({ theme, btnStyle }) =>
      theme.sideButton[btnStyle].click.backgroundColor};
    color: ${({ theme, btnStyle }) => theme.sideButton[btnStyle].click.color};
  }
  &:disabled {
    pointer-events: none;
    color: ${({ theme, btnStyle }) => theme.sideButton[btnStyle].default.color};
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${({ btnType }) =>
    btnType === 'icon' &&
    `
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    text-align: center;
    justify-content: center;
  `}

  ${({ btnType, theme }) =>
    btnType === 'plain' &&
    `
    border: none;
    padding: 0;
    border-radius: 0;
    font-size: ${theme.fontSize.h3.size};
    line-height: ${theme.fontSize.h3.lineHeight};
    text-decoration: underline;
    text-underline-offset: 4px;
  `}

  ${({ focused, theme, btnStyle: btnType }) =>
    focused &&
    `
    background-color: ${theme.sideButton[btnType].click.backgroundColor} !important;
    color: ${theme.sideButton[btnType].click.color} !important;
  `}
`;
