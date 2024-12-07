import { useState } from 'react';

import { BtnAtom, IconAtom, TypoAtom } from '../atoms';
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
      <TypoAtom fontSize={'body'} className="timeSetterTypo">
        {title}
      </TypoAtom>
      <FlipHandlerContainer>
        <BtnAtom handleOnClick={handlePlus}>
          <IconAtom
            size={1}
            className="timeHandler"
            alt="timeup"
            src={'icons/btnUp.svg'}
          />
        </BtnAtom>
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
          <TypoAtom fontSize="body" className="timeSetterTypo">
            분
          </TypoAtom>
        </FlipContainer>
        <BtnAtom handleOnClick={handleMinus}>
          <IconAtom
            size={1}
            className="timeHandler"
            alt="timedown"
            src={'icons/btnDown.svg'}
          />
        </BtnAtom>
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
        <BtnAtom handleOnClick={handleSubmit}>
          <IconAtom
            size={4.455}
            backgroundColor="primary1"
            alt="timesubmit"
            src={'icons/ok.svg'}
          />
        </BtnAtom>
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
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    .timeSetterTypo {
      font-size: ${({ theme }) => theme.fontSize.h3.size};
    }
  }
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

  .timeHandler {
    padding: 1rem 0;
    width: 100%;
    height: 100%;
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    width: 20rem;
    img {
      width: 3rem;
      height: 3rem;
    }
  }
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

  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    height: 100%;
  }
`;

const PomodoroTimeSettingContainer = styled.div`
  display: flex;

  & > div:first-of-type {
    margin-right: 5.4375rem;
  }

  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    flex-direction: column;
    align-items: center;
    row-gap: 4rem;
    & > div:first-of-type {
      margin-right: 0;
    }
  }
`;

const FooterContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 0.75rem;
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    div {
      width: 4.5rem;
      height: 4.5rem;
      border-radius: 50%;
      margin-top: 3rem;
    }
    img {
      width: 3rem;
      height: 3rem;
    }
  }
`;
