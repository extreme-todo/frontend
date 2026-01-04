import styled from '@emotion/styled';
import {
  BtnAtom,
  CardAtom,
  IconAtom,
  TodoProgressBarAtom,
  TypoAtom,
} from '../atoms';
import { Clock, ExtremeModeIndicator } from '../molecules';
import { usePomodoroActions, usePomodoroValue } from '../hooks/usePomodoro';
import { useCurrentTodo, useExtremeMode, useIsMobile } from '../hooks';
import { ReactNode, useCallback, useMemo } from 'react';
import {
  PomodoroFocusingStatus,
  PomodoroTimerStatus,
} from '../services/PomodoroService';

export function RestCard({
  mobileTopButtonSlot,
}: {
  mobileTopButtonSlot?: ReactNode;
}) {
  const isMobile = useIsMobile();
  const pomodoro = usePomodoroValue();
  const actions = usePomodoroActions();
  const { isExtreme } = useExtremeMode();
  const {
    currentTodo: todo,
    doTodo,
    currentRound,
  } = useCurrentTodo({
    value: { ...pomodoro },
    actions,
  });

  const getLeftMs = () => {
    return pomodoro.settings.restStep * 60000 - (pomodoro.time ?? 0);
  };

  const toggleTimerPlay = useCallback(() => {
    if (pomodoro.timerStatus === PomodoroTimerStatus.PAUSED) {
      actions.resumeTimer();
    } else {
      actions.pauseTimer();
    }
  }, [pomodoro.timerStatus, actions]);

  const getButtonContainer = useMemo(
    () => (
      <div className="button-container">
        <BtnAtom
          className="rest"
          btnStyle="lightBtn"
          handleOnClick={() => toggleTimerPlay && toggleTimerPlay()}
          ariaLabel="일시정지"
        >
          {pomodoro.timerStatus === PomodoroTimerStatus.PAUSED ? (
            <IconAtom src="icon/play-light.svg" size={2.25} />
          ) : (
            <IconAtom src="icon/pause-light.svg" size={1.5} />
          )}
        </BtnAtom>
        <BtnAtom
          className="do-todo"
          aria-label="do todo"
          btnStyle="lightBtn"
          handleOnClick={() => doTodo()}
          ariaLabel="할일완료"
        >
          <IconAtom src="icon/stop-light.svg" size={1.625} />
        </BtnAtom>
      </div>
    ),
    [todo, pomodoro.timerStatus, toggleTimerPlay],
  );
  return (
    <RestCardContainer>
      <CardAtom
        className="card"
        bg={'primary2'}
        padding={isMobile ? '0' : undefined}
      >
        {isMobile && (
          <div className="mobile-header-wrapper">
            <div className="mobile-top-button-slot">{mobileTopButtonSlot}</div>
            <ExtremeModeIndicator />
          </div>
        )}
        {!isMobile && (
          <div className="desktop-extreme-wrapper">
            <ExtremeModeIndicator />
          </div>
        )}
        {pomodoro.status === PomodoroFocusingStatus.RESTING && (
          <RestCardWrapper>
            <div className="center-container">
              <TypoAtom
                fontSize={'h3'}
                fontColor={isExtreme ? 'extreme_dark' : 'primary1'}
                className="left-time"
              >
                남은 휴식시간
              </TypoAtom>
              <Clock
                ms={getLeftMs()}
                show={{
                  hour: false,
                  min: true,
                  sec: true,
                }}
                fontColor={isExtreme ? 'extreme_dark' : 'primary1'}
              ></Clock>
              {!isMobile && getButtonContainer}
            </div>

            <div className="progress-container">
              <TodoProgressBarAtom
                type={isExtreme ? 'extreme1' : 'primary1'}
                progress={Math.floor(
                  ((pomodoro.time ?? 0) /
                    (pomodoro.settings.restStep * 60000)) *
                    100,
                )}
              ></TodoProgressBarAtom>
            </div>

            <div className="todo-title">
              <div className="todo-duration">
                <TypoAtom
                  fontSize={'h3'}
                  fontColor={isExtreme ? 'extreme_dark' : 'primary1'}
                >
                  {currentRound + ' Round'}
                </TypoAtom>
                <div>
                  <TypoAtom fontSize="h3">
                    {`🍅 `.repeat(currentRound)}
                  </TypoAtom>
                  <TypoAtom fontSize="h3" className="left-round">
                    {todo?.duration &&
                      `🍅 `.repeat(Math.max(todo.duration - currentRound, 0))}
                  </TypoAtom>
                </div>
              </div>
              <TypoAtom
                fontSize={'h2'}
                fontColor={isExtreme ? 'extreme_dark' : 'primary1'}
              >
                {todo?.todo}
              </TypoAtom>
              {isMobile && getButtonContainer}
            </div>
          </RestCardWrapper>
        )}
      </CardAtom>
    </RestCardContainer>
  );
}

const RestCardContainer = styled.div`
  .mobile-header-wrapper {
    width: 100%;
    padding: 1.25rem;
    height: 1.75rem;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    align-items: flex-start;
  }
  .desktop-extreme-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    box-sizing: border-box;
  }
`;

const RestCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  gap: 2.56rem;

  .center-container {
    display: flex;
    width: 100%;
    margin-top: 1.125rem;
    justify-content: space-between;
    align-items: center;
    > :first-child {
      padding-left: 2.75rem;
    }
  }
  .progress-container {
    width: 100%;
    height: 11rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .todo-title {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    max-width: 40ch;
    position: absolute;
    margin-bottom: 1.1428571429rem;
    justify-content: flex-end;
    align-items: center;
    .left-round {
      opacity: 0.5;
    }
  }
  .button-container {
    display: flex;
    gap: 0.5rem;
    .rest,
    .do-todo {
      width: 3.75rem;
      height: 3.75rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .todo-duration {
    height: 28px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    height: 100%;
    position: relative;
    gap: 0rem;
    justify-content: center;
    .progress-container {
      margin-top: 1.25rem;
      height: 5.5rem;
      margin-bottom: 0.625rem;
    }
    .center-container {
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      > :first-child {
        padding-left: 0;
      }
    }
    .todo-title {
      position: relative;
      > :first-child {
        margin-bottom: 1rem;
      }
    }
    .button-container {
      margin-top: 3.75rem;
    }
  }
`;
