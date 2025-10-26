import styled from '@emotion/styled';
import { BtnAtom, CardAtom, TodoProgressBarAtom, TypoAtom } from '../atoms';
import { Clock, ExtremeModeIndicator } from '../molecules';
import { PomodoroStatus } from '../services/PomodoroService';
import { usePomodoroActions, usePomodoroValue } from '../hooks/usePomodoro';
import { useCurrentTodo, useExtremeMode, useIsMobile } from '../hooks';
import { ReactNode, useMemo } from 'react';

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
    canRest,
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
  const getButtonContainer = useMemo(
    () => (
      <div className="button-container">
        <BtnAtom
          className="focus"
          btnStyle={isExtreme ? 'extremeLightBtn' : 'lightBtn'}
          handleOnClick={() => {
            canRest ? doTodo() : actions.startFocusing();
          }}
        >
          {canRest ? '다음 할 일 하기' : '끝내기'}
        </BtnAtom>
        {canRest && (
          <BtnAtom
            className="focusMore"
            handleOnClick={() => actions.startOverFocusing()}
          >
            조금 더 집중하기
          </BtnAtom>
        )}
      </div>
    ),
    [isExtreme, canRest, doTodo, actions],
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
        {pomodoro.status === PomodoroStatus.RESTING && (
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
                  <TypoAtom
                    fontSize="h3"
                    fontColor={isExtreme ? 'extreme_dark' : 'primary1'}
                  >
                    {`🍅 `.repeat(currentRound)}
                  </TypoAtom>
                  <TypoAtom
                    fontSize="h3"
                    className="left-round"
                    fontColor={isExtreme ? 'extreme_dark' : 'primary1'}
                  >
                    {`🍅 `.repeat(
                      Math.max(todo?.duration ?? 0 - currentRound, 0),
                    )}
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
  }
  .button-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-end;
    .focus {
      min-width: 100px;
      padding: 0 1rem;
    }
    .focusMore {
      text-decoration: underline;
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
