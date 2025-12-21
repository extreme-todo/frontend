import { CardAtom } from '../atoms';
import { ExtremeModeIndicator } from '../molecules';
import { CurrentTodo } from '../organisms';
import {
  useCurrentTodo,
  useExtremeMode,
  useIsMobile,
  usePomodoroActions,
  usePomodoroValue,
} from '../hooks';
import styled from '@emotion/styled';
import { ReactNode, useCallback, useEffect } from 'react';
import {
  PomodoroFocusingStatus,
  PomodoroTimerStatus,
} from '../services/PomodoroService';

export function CurrentTodoCard({
  mobileTopButtonSlot,
}: {
  mobileTopButtonSlot?: ReactNode;
}) {
  const isMobile = useIsMobile();
  const {
    settings: pomodoroSettings,
    status,
    time,
    timerStatus,
  } = usePomodoroValue();
  const { isExtreme } = useExtremeMode();
  const actions = usePomodoroActions();
  const currentTodo = useCurrentTodo({
    value: {
      settings: pomodoroSettings,
      status,
      time,
    },
    actions,
  });

  const toggleTimerPlay = useCallback(() => {
    if (timerStatus === PomodoroTimerStatus.PAUSED) {
      actions.resumeTimer();
    } else {
      actions.pauseTimer();
    }
  }, [timerStatus, actions]);

  useEffect(() => {
    if (status === PomodoroFocusingStatus.NONE) {
      actions.startFocusing();
    }
  }, [status, actions]);

  return (
    <TransparentAbsoluteCardsParent>
      <CardAtom
        className="card"
        padding={isMobile ? '0' : undefined}
        bg={isExtreme ? 'extreme_dark' : 'primary1'}
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
        {currentTodo.currentTodo && (
          <CurrentTodo
            todo={currentTodo.currentTodo}
            doTodo={currentTodo.doTodo}
            focusStep={pomodoroSettings.focusStep}
            focusedOnTodo={currentTodo.focusedOnTodo}
            currentRound={currentTodo.currentRound}
            paused={timerStatus === PomodoroTimerStatus.PAUSED}
            toggleTimerPlay={toggleTimerPlay}
          ></CurrentTodo>
        )}
      </CardAtom>
    </TransparentAbsoluteCardsParent>
  );
}

const TransparentAbsoluteCardsParent = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  .desktop-extreme-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    box-sizing: border-box;
  }
  .mobile-header-wrapper {
    width: 100%;
    padding: 1.25rem;
    height: 1.75rem;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    align-items: flex-start;
  }
  .mobile-top-button-slot {
    display: flex;
    justify-content: flex-start;
    height: fit-content;
  }
`;
