import styled from '@emotion/styled';
import { ButtonName } from '../styles/emotion';

export interface SideBtnAtomProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  btnStyle: ButtonName;
  className?: string;
  ariaLabel?: string;
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
}

export const SideBtnAtom = styled.button<SideBtnAtomProps>`
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
      theme.button[btnStyle].default.backgroundColor};
    color: ${({ theme, btnStyle }) => theme.button[btnStyle].hover.color};
  }
  &:active {
    background-color: ${({ theme, btnStyle: btnType }) =>
      theme.button[btnType].click.backgroundColor};
    color: ${({ theme, btnStyle: btnType }) =>
      theme.button[btnType].click.color};
  }
  &:disabled {
    background-color: ${({ theme, btnStyle }) =>
      theme.button[btnStyle].default.backgroundColor};
    color: ${({ theme, btnStyle }) => theme.button[btnStyle].default.color};
    cursor: not-allowed;
  }
`;
