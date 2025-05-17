import { CardAtom } from '../atoms';
import { ExtremeModeIndicator } from '../molecules';
import { CurrentTodo } from '../organisms';
import {
  useCurrentTodo,
  useExtremeMode,
  usePomodoroActions,
  usePomodoroValue,
} from '../hooks';
import styled from '@emotion/styled';

export function CurrentTodoCard() {
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

  return (
    <TransparentAbsoluteCardsParent>
      <CardAtom className="card" bg={isExtreme ? 'extreme_dark' : 'primary1'}>
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
          ></CurrentTodo>
        )}
      </CardAtom>
    </TransparentAbsoluteCardsParent>
  );
}

const TransparentAbsoluteCardsParent = styled.div`
  width: 53.75rem;
  height: 20rem;
  position: relative;
  .no-todo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    button {
      min-width: 101px;
    }
    > :first-child {
      margin-bottom: 8px;
    }
    > :nth-child(2) {
      margin-bottom: 12px;
    }
  }
`;
