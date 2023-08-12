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
      <IconAtom onClick={onClick} size={4.455} backgroundColor={'whiteWine'}>
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
