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
              margin: 'auto',
            }}
          >
            <BtnAtom handleOnClick={handleTimeUp} btnType="lightBtn">
              <svg
                width="2.5rem"
                height="2.5rem"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="svgBtn"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M20.0001 14.3586L9.9723 24.3864L7.29297 21.707L20.0001 8.99992L32.7072 21.707L30.0279 24.3864L20.0001 14.3586Z"
                  fill="#DBFE77"
                />
              </svg>
            </BtnAtom>
            <BtnAtom handleOnClick={handleTimeDown}>
              <svg
                width="2.5rem"
                height="2.5rem"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="svgBtn"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M19.9999 25.0555L30.0277 15.0277L32.707 17.707L19.9999 30.4141L7.29282 17.707L9.97215 15.0277L19.9999 25.0555Z"
                  fill="#DBFE77"
                />
              </svg>
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

const PomodoroTimeSetting = ({ handleClose }: { handleClose: () => void }) => {
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
    <PomodoroCardAtom bg="primary1">
      <div>
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
      </div>

      <div>
        <BtnAtom handleOnClick={handleSubmit} btnType="extremeDarkBtn">
          <div style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
            <TypoAtom fontColor="primary2" fontSize="b1">
              저장
            </TypoAtom>
          </div>
        </BtnAtom>
        <BtnAtom handleOnClick={handleClose}>
          <svg
            width="2rem"
            height="2rem"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="svgBtn"
          >
            <rect
              width="1.81331"
              height="25.3864"
              transform="matrix(-0.707107 0.707107 0.707107 0.707107 7.28223 6.19324)"
              fill="#DBFE77"
            />
            <rect
              x="7.28223"
              y="25.233"
              width="1.81331"
              height="25.3864"
              transform="rotate(-135 7.28223 25.233)"
              fill="#DBFE77"
            />
          </svg>
        </BtnAtom>
      </div>
    </PomodoroCardAtom>
  );
};

export default PomodoroTimeSetting;
export { TimeSetter };

const PomodoroCardAtom = styled(CardAtom)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .svgBtn path,
  .svgBtn rect {
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
  }
  .svgBtn:hover path,
  .svgBtn:hover rect {
    opacity: 0.4;
  }

  & > div:first-of-type {
    display: flex;

    & > div:first-of-type {
      margin-right: 2rem;
    }
  }

  & > div:last-of-type {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-end;

    & > button:first-of-type {
      margin: auto;
    }

    & > button:last-of-type {
      align-self: flex-start;
    }
  }
`;

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
  padding-top: 1.5rem;
  padding-bottom: 1.25rem;
  width: 11.5rem;
  border-bottom: 2px solid #dbfe77;
  text-align: center;
`;
