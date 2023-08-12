import React from 'react';
import { CardAtom } from '../atoms';
import { IChildProps } from '../shared/interfaces';
import styled from '@emotion/styled';

type ICurrentTodoCardProps = IChildProps;
function CurrentTodoCard({ children }: ICurrentTodoCardProps) {
  return (
    <CurrentTodoWrapper>
      <CardAtom w="58.875rem" h="33.11456rem">
        {children}
      </CardAtom>
      <CardAtom w="57.3125rem" h="32.25rem"></CardAtom>
      <CardAtom w="55.875rem" h="31.4375rem"></CardAtom>
    </CurrentTodoWrapper>
  );
}

const CurrentTodoWrapper = styled.div`
  position: relative;
  div:nth-child(2) {
    position: absolute;
    top: 1.82rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
  }
  div:nth-child(3) {
    position: absolute;
    top: 3.32rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: -2;
  }
`;

export default CurrentTodoCard;
