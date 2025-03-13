import { useState } from 'react';

import { BtnAtom, CardAtom, IconAtom, TypoAtom } from '../atoms';

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
    <div
      style={{
        outline: '1px solid red',
        width: '17.5625rem',
      }}
    >
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
  const [focusTimeIndex, setFocusTimeIndex] = useState(
    focusStepList.findIndex((time) => time === focusStep),
  );
  const [restTimeIndex, setRestTimeIndex] = useState(
    restStepList.findIndex((time) => time === restStep),
  );

  /* local variable */
  const newTime = {
    newFocus: [...focusStepList][focusTimeIndex],
    resetFocus: [...restStepList][restTimeIndex],
  };

  /* handler */
  const handleFocusUp = () => {
    setFocusTimeIndex((prev) =>
      prev >= focusStepList.length - 1 ? prev : prev + 1,
    );
  };
  const handleFocusDown = () => {
    setFocusTimeIndex((prev) => (prev <= 0 ? prev : prev - 1));
  };

  const handleRestUp = () => {
    setRestTimeIndex((prev) =>
      prev >= restStepList.length - 1 ? prev : prev + 1,
    );
  };
  const handleRestDown = () => {
    setRestTimeIndex((prev) => (prev <= 0 ? prev : prev - 1));
  };

  const handleSubmit = () => {
    if (newTime.newFocus !== focusStep) setFocusStep(newTime.newFocus);
    if (newTime.resetFocus !== restStep) setRestStep(newTime.resetFocus);
  };

  return (
    <CardAtom
      bg="primary1"
      style={{ display: 'flex', flexDirection: 'row', columnGap: '3rem' }}
    >
      <TimeSetter
        timeTitle={'집중시간'}
        time={focusStepList[focusTimeIndex]}
        handleTimeUp={handleFocusUp}
        handleTimeDown={handleFocusDown}
      />
      <TimeSetter
        timeTitle={'휴식시간'}
        time={restStepList[restTimeIndex]}
        handleTimeUp={handleRestUp}
        handleTimeDown={handleRestDown}
      />
      <BtnAtom handleOnClick={handleSubmit}>저장</BtnAtom>
      <BtnAtom handleOnClick={() => alert('닫기')}>
        <IconAtom src={'icon/closeYellow.svg'} size={2} />
      </BtnAtom>
    </CardAtom>
  );
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
  width: 12.6875rem;
  border-bottom: 2px solid #dbfe77;
  text-align: center;
`;
