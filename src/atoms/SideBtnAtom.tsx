import styled from '@emotion/styled';
import { ButtonName } from '../styles/emotion';

export interface SideBtnAtomProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  btnStyle: ButtonName;
  btnType?: 'text' | 'icon';
  className?: string;
  ariaLabel?: string;
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  focused?: boolean;
  children?: React.ReactNode;
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
    >
      {children}
    </BaseBtnAtom>
  );
};

const BaseBtnAtom = styled.button<
  Pick<SideBtnAtomProps, 'btnStyle' | 'focused' | 'btnType'>
>`
  background-color: transparent;
  color: ${({ theme, btnStyle }) => theme.button[btnStyle].default.color};
  border: 1px solid
    ${({ theme, btnStyle }) => theme.button[btnStyle].default.color};
  padding: 0.25rem 1.5rem;
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.body.size};
  font-weight: ${({ theme }) => theme.fontSize.body.weight};
  line-height: ${({ theme }) => theme.fontSize.body.lineHeight};
  transition: background-color 0.3s, border-color 0.3s;

  &:hover {
    background-color: ${({ theme, btnStyle }) =>
      theme.button[btnStyle].hover.backgroundColor};
    color: ${({ theme, btnStyle }) => theme.button[btnStyle].hover.color};
  }
  &:active {
    background-color: ${({ theme, btnStyle }) =>
      theme.button[btnStyle].click.backgroundColor};
    color: ${({ theme, btnStyle }) => theme.button[btnStyle].click.color};
  }
  &:disabled {
    background-color: ${({ theme, btnStyle }) =>
      theme.button[btnStyle].default.backgroundColor};
    color: ${({ theme, btnStyle }) => theme.button[btnStyle].default.color};
    cursor: not-allowed;
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

  ${({ focused, theme, btnStyle: btnType }) =>
    focused &&
    `
    background-color: ${theme.button[btnType].click.backgroundColor} !important;
    color: ${theme.button[btnType].click.color} !important;
  `}
`;
