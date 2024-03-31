import { useState } from 'react';

import { IconAtom, TypoAtom } from '../atoms';
import { FlipCounter } from '../molecules';
import {
  focusStepList,
  restStepList,
  usePomodoroActions,
  usePomodoroValue,
} from '../hooks/usePomodoro';
import styled from '@emotion/styled';

interface ITimeCounterProps {
  flipData: Array<number>;
  title: string;
  flipIndex: number;
  isPlus: boolean;
  handlePlus: () => void;
  handleMinus: () => void;
}

const TimeSetter = ({
  flipData,
  title,
  flipIndex,
  isPlus,
  handlePlus,
  handleMinus,
}: ITimeCounterProps) => {
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
  /* pomodoro context */
  const {
    settings: { focusStep, restStep },
  } = usePomodoroValue();
  const { setFocusStep, setRestStep } = usePomodoroActions();

  /* local state */
  const [focusFlipIndex, setFocusFlipIndex] = useState(
    focusStepList.findIndex((time) => time === focusStep),
  );
  const [restFlipIndex, setRestFlipIndex] = useState(
    restStepList.findIndex((time) => time === restStep),
  );
  const [isPlus, setIsPlus] = useState(false);

  /* local variable */
  const newTime = {
    newFocus: [...focusStepList][focusFlipIndex],
    resetFocus: [...restStepList][restFlipIndex],
  };

  /* handler */
  const handleFocusPlus = () => {
    setFocusFlipIndex((prev) =>
      prev >= focusStepList.length - 1 ? prev : prev + 1,
    );
    setIsPlus(true);
  };
  const handleFocusMinus = () => {
    setFocusFlipIndex((prev) => (prev <= 0 ? prev : prev - 1));
    setIsPlus(false);
  };

  const handleRestPlus = () => {
    setRestFlipIndex((prev) =>
      prev >= restStepList.length - 1 ? prev : prev + 1,
    );
    setIsPlus(true);
  };
  const handleRestMinus = () => {
    setRestFlipIndex((prev) => (prev <= 0 ? prev : prev - 1));
    setIsPlus(false);
  };

  const handleSubmit = () => {
    if (newTime.newFocus !== focusStep) setFocusStep(newTime.newFocus);
    if (newTime.resetFocus !== restStep) setRestStep(newTime.resetFocus);
  };

  return (
    <>
      <PomodoroTimeSettingContainer>
        <TimeSetter
          flipData={[...focusStepList]}
          title={'집중시간'}
          flipIndex={focusFlipIndex}
          isPlus={isPlus}
          handlePlus={handleFocusPlus}
          handleMinus={handleFocusMinus}
        />
        <TimeSetter
          flipData={[...restStepList]}
          title={'휴식시간'}
          flipIndex={restFlipIndex}
          isPlus={isPlus}
          handlePlus={handleRestPlus}
          handleMinus={handleRestMinus}
        />
      </PomodoroTimeSettingContainer>
      <FooterContainer>
        <IconAtom
          size={4.455}
          backgroundColor="subFontColor"
          onClick={handleSubmit}
        >
          <img alt="timesubmit" src={'icons/ok.svg'} />
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
