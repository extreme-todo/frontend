import styled from '@emotion/styled';
import { IChildProps } from '../shared/interfaces';
import { RemType, type ButtonName } from '../styles/emotion';

type PaddingType = RemType<number> | 'auto';
interface IBtnAtomProps extends IChildProps {
  handleOnClick: () => void;
  btnType?: ButtonName;
  paddingHorizontal?: PaddingType;
  paddingVertical?: PaddingType;
  className?: string;
}

function BtnAtom({
  children,
  handleOnClick,
  btnType,
  paddingHorizontal = 'auto',
  paddingVertical = 'auto',
  className,
}: IBtnAtomProps) {
  if (btnType === undefined) {
    return (
      <div
        onClick={handleOnClick}
        style={{ cursor: 'pointer' }}
        className={className}
      >
        {children}
      </div>
    );
  }
  return (
    <ButtonWrapper
      onClick={handleOnClick}
      btnType={btnType}
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
      className={className}
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
  cursor: 'pointer';
  border-radius: 50px;
  padding-top: ${({ paddingVertical }) => paddingVertical};
  padding-bottom: ${({ paddingVertical }) => paddingVertical};
  padding-left: ${({ paddingHorizontal }) => paddingHorizontal};
  padding-left: ${({ paddingHorizontal }) => paddingHorizontal};
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
  &:click {
    background-color: ${({ theme, btnType }) =>
      theme.button[btnType].click.backgroundColor};
    color: ${({ theme, btnType }) => theme.button[btnType].click.color};
  }
`;

export default BtnAtom;
