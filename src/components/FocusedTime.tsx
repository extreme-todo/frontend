import React, { ForwardedRef, forwardRef, useContext } from 'react';
import { CardAtom } from '../atoms';
import { LoginContext } from '../hooks';
import styled from '@emotion/styled';

const FocusedTime = forwardRef((_, ref: ForwardedRef<HTMLElement>) => {
  const { isLogin } = useContext(LoginContext);
  return (
    <FocusedTimeStyled ref={ref}>
      <CardAtom></CardAtom>
    </FocusedTimeStyled>
  );
});

const FocusedTimeStyled = styled.main`
  width: 100dvw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
Object.assign(FocusedTime, {
  CardAtom,
});
export default FocusedTime;
