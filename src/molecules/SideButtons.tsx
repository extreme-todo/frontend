import { ReactNode } from 'react';
import { IChildProps } from '../shared/interfaces';
import styled from '@emotion/styled';
import { BtnAtom } from '../atoms';
import { SideBtnAtom } from '../atoms/SideBtnAtom';
import { ButtonName } from '../styles/emotion';

function SideButtonsMain({ children }: IChildProps) {
  return <SideButtonsWrapper>{children}</SideButtonsWrapper>;
}

const SideButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.75rem;
  button {
    gap: 0.25rem;
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    flex-direction: row;
    justify-content: center;
    &:first-child {
      order: 1;
    }
    .icon {
      width: 8rem;
      height: 8rem;
      border-radius: 8rem;
      img {
        width: 4rem;
        height: 4rem;
      }
    }
  }
`;

const SideButton = ({
  onClick,
  children,
  btnStyle = 'darkBtn',
  style,
}: {
  onClick: () => void;
  children?: ReactNode;
  btnStyle?: ButtonName;
  style?: React.CSSProperties;
}) => {
  return (
    <SideBtnAtom onClick={onClick} btnStyle={btnStyle} style={style}>
      {children}
    </SideBtnAtom>
  );
};

export const SideButtons = Object.assign(SideButtonsMain, {
  SideButton,
});
