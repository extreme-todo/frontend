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
import { useEffect } from 'react';
import { PomodoroStatus } from '../services/PomodoroService';

export function CurrentTodoCard() {
  const isMobile = useIsMobile();
  const { settings: pomodoroSettings, status, time } = usePomodoroValue();
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

  useEffect(() => {
    if (status === PomodoroStatus.NONE) {
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
        <ExtremeModeIndicator />
        {currentTodo.currentTodo && (
          <CurrentTodo
            todo={currentTodo.currentTodo}
            doTodo={() => {
              currentTodo.doTodo();
            }}
            focusStep={pomodoroSettings.focusStep}
            focusedOnTodo={currentTodo.focusedOnTodo}
            startResting={actions.startResting}
            currentRound={currentTodo.currentRound}
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
`;
