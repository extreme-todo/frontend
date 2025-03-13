import { useState } from 'react';

import { BtnAtom, CardAtom, IconAtom, TypoAtom } from '../atoms';
import { FlipCounter } from '../molecules';
import {
  focusStepList,
  restStepList,
  usePomodoroActions,
  usePomodoroValue,
} from '../hooks/usePomodoro';
import styled from '@emotion/styled';

interface ITimeCounterProps {
  timeTitle: string;
  time: number;
  handleTimeUp: () => void;
  handleTimeDown: () => void;
}

const TimeSetter = ({
  timeTitle,
  time,
  handleTimeUp,
  handleTimeDown,
}: ITimeCounterProps) => {
  return (
    <div style={{ outline: '1px solid red' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Rectangle />
        <TypoAtom fontSize="h2" fontColor="primary2">
          {timeTitle}
        </TypoAtom>
      </div>
      <div style={{ display: 'flex' }}>
        <ClockTypoContainer>
          <ClockTypo fontColor="primary2">{time}</ClockTypo>
        </ClockTypoContainer>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            marginLeft: '0.5625rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '0.625rem',
            }}
          >
            <BtnAtom handleOnClick={handleTimeUp}>
              <IconAtom src={'icon/pomodoroTimeUp.svg'} />
            </BtnAtom>
            <BtnAtom handleOnClick={handleTimeDown}>
              <IconAtom src={'icon/pomodoroTimeDown.svg'} />
            </BtnAtom>
          </div>
          <TypoAtom fontColor="primary2" fontSize="b1">
            Minute
          </TypoAtom>
        </div>
      </div>
    </div>
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

  return <CardAtom bg="primary1"></CardAtom>;
};

export default PomodoroTimeSetting;
export { TimeSetter };

const Rectangle = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  background-color: ${({
    theme: {
      color: { backgroundColor },
    },
  }) => backgroundColor.primary2};
  margin-right: 0.375rem;
`;

const ClockTypo = styled(TypoAtom)`
  font-weight: 700;
  font-size: 8.75rem;
  line-height: 6.25rem;
`;

const ClockTypoContainer = styled.div`
  padding: 1.5rem 0.71875rem 1.25rem 0.40625rem;
  border-bottom: 2px solid #dbfe77;
`;
