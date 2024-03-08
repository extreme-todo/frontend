import { useState } from 'react';

import { IconAtom, TypoAtom } from '../atoms';
import { FlipCounter } from '../molecules';
import { focusStepList, restStepList } from '../hooks/usePomodoro';
import styled from '@emotion/styled';

interface ITimeCounterProps {
  flipData: Array<number>;
  title: string;
  initFlipIndex: number;
}

const TimeSetter = ({ flipData, title, initFlipIndex }: ITimeCounterProps) => {
  const [flipIndex, setFlipIndex] = useState(initFlipIndex);
  const [isPlus, setIsPlus] = useState(false);

  const handlePlus = () => {
    setFlipIndex((prev) => (prev >= flipData.length - 1 ? prev : prev + 1));
    setIsPlus(true);
  };
  const handleMinus = () => {
    setFlipIndex((prev) => (prev <= 0 ? prev : prev - 1));
    setIsPlus(false);
  };

  return (
    <TimeSetterContainer>
      <TypoAtom fontSize={'tag'}>{title}</TypoAtom>
      <FlipHandlerContainer>
        <IconAtom size={1} onClick={handlePlus}>
          <img alt="timeup" src={'icons/polygonUp.svg'} />
        </IconAtom>
        <FlipContainer>
          <FlipCounter>
            {flipData.map((data) => (
              <FlipCounter.Flipper
                key={data}
                className={
                  (data === flipData[flipIndex - 1] ? 'prev' : '') +
                  (data === flipData[flipIndex] ? 'curr ' : '') +
                  (data === flipData[flipIndex + 1] ? 'next ' : '')
                }
                isPlus={isPlus}
                flipNumber={data}
              />
            ))}
          </FlipCounter>
          <TypoAtom fontSize="tag">분</TypoAtom>
        </FlipContainer>
        <IconAtom size={1} onClick={handleMinus}>
          <img alt="timedown" src={'icons/polygonDown.svg'} />
        </IconAtom>
      </FlipHandlerContainer>
    </TimeSetterContainer>
  );
};

const PomodoroTimeSetting = () => {
  // initFlipIndex init 해줘야 됨
  return (
    <>
      <PomodoroTimeSettingContainer>
        <TimeSetter
          flipData={[...focusStepList]}
          title={'집중시간'}
          initFlipIndex={0}
        />
        <TimeSetter
          flipData={[...restStepList]}
          title={'휴식시간'}
          initFlipIndex={0}
        />
      </PomodoroTimeSettingContainer>
      <FooterContainer>
        <IconAtom
          size={4.455}
          backgroundColor="subFontColor"
          onClick={() => {
            console.log('');
          }}
        >
          <img alt="ok" src={'icons/ok.svg'} />
        </IconAtom>
      </FooterContainer>
    </>
  );
};

export default PomodoroTimeSetting;
export { TimeSetter };

const TimeSetterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FlipHandlerContainer = styled.div`
  width: 16.3125rem;

  display: flex;
  flex-direction: column;
  align-items: center;

  border-radius: 1.4525rem;
  margin-top: 0.6875rem;
  padding: 0.6875rem 0.5625rem;
  background-color: rgb(219, 209, 164);
`;

const FlipContainer = styled.div`
  width: 100%;

  padding-top: 0.625rem;
  padding-bottom: 0.625rem;

  display: flex;
  justify-content: center;
  align-items: center;

  > :nth-of-type(2) {
    margin-left: 1.5625rem;
  }
`;

const PomodoroTimeSettingContainer = styled.div`
  display: flex;

  > :first-of-type {
    margin-right: 5.4375rem;
  }
`;

const FooterContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 0.75rem;
`;
