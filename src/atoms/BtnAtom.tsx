import styled from '@emotion/styled';
import { IChildProps } from '../shared/interfaces';
import { RemType, ButtonName } from '../styles/emotion';

type PaddingType = RemType | 'auto';
interface IBtnAtomProps extends IChildProps {
  handleOnClick: () => void;
  btnType?: ButtonName;
  paddingHorizontal?: PaddingType;
  paddingVertical?: PaddingType;
  className?: string;
  ariaLabel?: string;
}

function BtnAtom({
  children,
  handleOnClick,
  btnType,
  paddingHorizontal = 'auto',
  paddingVertical = 'auto',
  className,
  ariaLabel,
}: IBtnAtomProps) {
  if (btnType === undefined) {
    return (
      <button
        onClick={handleOnClick}
        style={{ cursor: 'pointer' }}
        className={className}
        aria-label={ariaLabel}
        type="button"
      >
        {children}
      </button>
    );
  }
  return (
    <ButtonWrapper
      onClick={handleOnClick}
      btnType={btnType}
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
      className={className}
      aria-label={ariaLabel}
      type="button"
    >
      {children}
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.button<{
  btnType: ButtonName;
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
  height: ${({ theme, btnType }) => theme.button[btnType].height};
  font-size: ${({ theme, btnType }) => theme.button[btnType].fontSize.size};
  font-weight: ${({ theme, btnType }) => theme.button[btnType].fontSize.weight};
  background-color: ${({ theme, btnType }) =>
    theme.button[btnType].default.backgroundColor};
  color: ${({ theme, btnType }) => theme.button[btnType].default.color};
  &:hover {
    background-color: ${({ theme, btnType }) =>
      theme.button[btnType].hover.backgroundColor};
    color: ${({ theme, btnType }) => theme.button[btnType].hover.color};
  }
  &:active {
    background-color: ${({ theme, btnType }) =>
      theme.button[btnType].click.backgroundColor};
    color: ${({ theme, btnType }) => theme.button[btnType].click.color};
  }
  transition: all 0.2s ease-in-out;
`;

export default BtnAtom;
