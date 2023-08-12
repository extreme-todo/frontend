import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { TypoAtom } from '../atoms';

function Clock() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  let interval: NodeJS.Timer;

  useEffect(() => {
    interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <ClockContainer>
      <TypoAtom fontSize="sub" rainbow={true}>
        {currentTime.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </TypoAtom>
      <TypoAtom fontSize="h1" rainbow={true}>
        {currentTime.getHours().toString().padStart(2, '0')}:
        {currentTime.getMinutes().toString().padStart(2, '0')}
      </TypoAtom>
    </ClockContainer>
  );
}

const ClockContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default Clock;
