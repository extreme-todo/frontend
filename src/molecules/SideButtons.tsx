import React from 'react';
import { IChildProps } from '../shared/interfaces';
import styled from '@emotion/styled';
import { ProgressButtonAtom } from '../atoms';
import IconAtom from '../atoms/IconAtom';

export type ISideButtonsProps = IChildProps;

function SideButtonsMain({ children }: ISideButtonsProps) {
  return <SideButtonsWrapper>{children}</SideButtonsWrapper>;
}

const SideButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 1.38rem;
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
  imageSrc,
  onClick,
}: {
  imageSrc: string;
  onClick: () => void;
}) => {
  return (
    <button>
      <IconAtom
        onClick={onClick}
        size={4.455}
        backgroundColor={'primary1'}
        className="icon"
      >
        <img src={imageSrc} />
      </IconAtom>
    </button>
  );
};

const SideButtons = Object.assign(SideButtonsMain, {
  ProgressButton: ProgressButtonAtom,
  IconButton: SideButton,
});

export default SideButtons;
