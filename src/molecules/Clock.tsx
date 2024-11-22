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
      <TypoAtom fontSize="clock" rainbow={true} className="clock-date">
        {currentTime.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </TypoAtom>
      <TypoAtom fontSize="h1" rainbow={true} className="clock-time">
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
  @media ${({ theme }) => theme.responsiveDevice.mobile},
    ${({ theme }) => theme.responsiveDevice.tablet_v} {
    position: fixed;
    top: 4rem;
    .clock-date {
      font-size: 4rem;
    }
    .clock-time {
      font-size: 12rem;
    }
  }
`;

export default Clock;
