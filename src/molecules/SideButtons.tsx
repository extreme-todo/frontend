import { ReactNode } from 'react';
import { IChildProps } from '../shared/interfaces';
import styled from '@emotion/styled';
import { BtnAtom } from '../atoms';

function SideButtonsMain({ children }: IChildProps) {
  return <SideButtonsWrapper>{children}</SideButtonsWrapper>;
}

const SideButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
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
}: {
  onClick: () => void;
  children?: ReactNode;
}) => {
  return (
    <BtnAtom btnStyle="textBtn" handleOnClick={onClick}>
      {children}
    </BtnAtom>
  );
};

export const SideButtons = Object.assign(SideButtonsMain, {
  SideButton,
});
