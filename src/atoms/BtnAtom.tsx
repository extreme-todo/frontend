import { IChildProps } from '../shared/interfaces';
import { RemType, ButtonName } from '../styles/emotion';
import styled from '@emotion/styled';

type PaddingType = RemType | 'auto';
interface IBtnAtomProps extends IChildProps {
  handleOnClick?: () => void;
  btnStyle?: ButtonName;
  paddingHorizontal?: PaddingType;
  paddingVertical?: PaddingType;
  className?: string;
  ariaLabel?: string;
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  tabIndex?: number;
}

export function BtnAtom({
  children,
  handleOnClick,
  btnStyle,
  paddingHorizontal = 'auto',
  paddingVertical = 'auto',
  className,
  ariaLabel,
  type = 'button',
  tabIndex = 0,
  ...props
}: IBtnAtomProps) {
  if (btnStyle === undefined) {
    return (
      <button
        {...props}
        onClick={handleOnClick}
        style={{ cursor: 'pointer' }}
        className={className}
        aria-label={ariaLabel}
        type={type}
        tabIndex={tabIndex}
      >
        {children}
      </button>
    );
  }
  return (
    <ButtonWrapper
      {...props}
      onClick={handleOnClick}
      btnStyle={btnStyle}
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
      className={className}
      aria-label={ariaLabel}
      type={type}
      tabIndex={tabIndex}
    >
      {children}
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.button<{
  btnStyle: ButtonName;
  paddingVertical: PaddingType;
  paddingHorizontal: PaddingType;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: 'pointer';
  border-radius: 50px;
  padding-top: ${({ paddingVertical }) => paddingVertical};
  padding-bottom: ${({ paddingVertical }) => paddingVertical};
  padding-left: ${({ paddingHorizontal }) => paddingHorizontal};
  padding-right: ${({ paddingHorizontal }) => paddingHorizontal};
  height: ${({ theme, btnStyle: btnType }) => theme.button[btnType].height};
  font-size: ${({ theme, btnStyle: btnType }) =>
    theme.button[btnType].fontSize.size};
  font-weight: ${({ theme, btnStyle: btnType }) =>
    theme.button[btnType].fontSize.weight};
  background-color: ${({ theme, btnStyle: btnType }) =>
    theme.button[btnType].default.backgroundColor};
  color: ${({ theme, btnStyle: btnType }) =>
    theme.button[btnType].default.color};
  &:hover {
    background-color: ${({ theme, btnStyle: btnType }) =>
      theme.button[btnType].hover.backgroundColor};
    color: ${({ theme, btnStyle: btnType }) =>
      theme.button[btnType].hover.color};
  }
  &:active {
    background-color: ${({ theme, btnStyle: btnType }) =>
      theme.button[btnType].click.backgroundColor};
    color: ${({ theme, btnStyle: btnType }) =>
      theme.button[btnType].click.color};
  }
  &:disabled {
    background-color: ${({ theme }) =>
      theme.button['extremeLightBtn'].default.backgroundColor};
    color: ${({ theme }) => theme.button['extremeDarkBtn'].default.color};
    cursor: not-allowed;
  }
  transition: all 0.2s ease-in-out;
`;
