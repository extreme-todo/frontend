import { useContext, useEffect, useState } from 'react';
import { BtnAtom, CardAtom, Overlay, TagAtom, TypoAtom } from '../atoms';
import { IChildProps } from '../shared/interfaces';
import {
  LoginContext,
  useCurrentTodo,
  useExtremeMode,
  usePomodoroActions,
  usePomodoroValue,
} from '../hooks';
import { CurrentTodo, ExtremeModeIndicator } from '../molecules';
import { pomodoroUnit } from '../hooks/usePomodoro';
import { PomodoroStatus } from '../services/PomodoroService';
import RestCard from './RestCard';
import CardAnimationPlayer from '../atoms/CardAnimationPlayer';
import styled from '@emotion/styled';

interface ICurrentTodoCardProps extends IChildProps {
  openAddTodoModal: () => void;
}
function CurrentTodoCard({
  children,
  openAddTodoModal,
}: ICurrentTodoCardProps) {
  const { settings: pomodoroSettings, status, time } = usePomodoroValue();
  const { isExtreme } = useExtremeMode();
  const [canRest, setCanRest] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(false);
  const actions = usePomodoroActions();
  const currentTodo = useCurrentTodo();
  const { isLogin } = useContext(LoginContext);

  useEffect(() => {
    if (status !== PomodoroStatus.NONE && currentTodo.currentTodo == null) {
      actions.stopTimer();
    } else if (
      status === PomodoroStatus.NONE &&
      currentTodo.currentTodo != null
    ) {
      actions.startResting();
    }
  }, [currentTodo.currentTodo]);

  useEffect(() => {
    checkIfCanRest();
    checkIfShouldFocus();
    const ifShouldRest = checkIfShouldRest();
    status === PomodoroStatus.FOCUSING &&
      !ifShouldRest &&
      currentTodo.updateFocus(time === 0 ? 0 : 1000);
  }, [time]);

  /**
   * 쉴 수 있는 상황인지(투두에 기록된 duration을 초과했을 때)
   * @returns boolean
   */
  const checkIfCanRest = () => {
    if (
      currentTodo.currentTodo?.duration &&
      currentTodo.focusedOnTodo >=
        currentTodo.currentTodo?.duration *
          pomodoroSettings.focusStep *
          pomodoroUnit
    ) {
      setCanRest((prev) => {
        if (!prev) actions.startResting();
        return true;
      });
      return true;
    } else {
      return canRest;
    }
  };

  /**
   * 쉬어야 하는 상황인지(집중 단위시간이 다 되었을 때)
   * @returns boolean
   */
  const checkIfShouldRest = () => {
    if (
      status === PomodoroStatus.FOCUSING &&
      time === pomodoroSettings.focusStep * pomodoroUnit
    ) {
      actions.startResting();
      return true;
    }
    return false;
  };

  const checkIfShouldFocus = () => {
    if (
      status === PomodoroStatus.RESTING &&
      (time ?? 0) >= pomodoroSettings.restStep * pomodoroUnit
    ) {
      setShouldFocus(true);
    } else {
      setShouldFocus(false);
    }
  };

  return (
    <TransparentAbsoluteCardsParent>
      <CardAnimationPlayer
        animation={
          status === PomodoroStatus.RESTING ? ['HIDE_UP', 'NEXT_UP'] : 'SHOW_UP'
        }
      >
        <CardAtom className="card" bg={isExtreme ? 'extreme_dark' : 'primary1'}>
          {status === PomodoroStatus.FOCUSING && <ExtremeModeIndicator />}
          {currentTodo.currentTodo?.todo != null ? (
            <>
              {status === PomodoroStatus.FOCUSING && (
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
            </>
          ) : (
            <Overlay className="no-todo">
              <TypoAtom fontSize="h3">🍅</TypoAtom>
              <TypoAtom fontSize="h3" fontColor="primary2">
                새로운 TODO를 작성해볼까요?
              </TypoAtom>
              <BtnAtom btnType="darkBtn" handleOnClick={openAddTodoModal}>
                Todo+
              </BtnAtom>
            </Overlay>
          )}
        </CardAtom>
      </CardAnimationPlayer>
      <CardAnimationPlayer
        animation={
          status === PomodoroStatus.RESTING ? 'SHOW_UP' : ['HIDE_UP', 'NEXT_UP']
        }
      >
        <RestCard
          canRest={canRest}
          startFocusing={actions.startFocusing}
          isExtreme={isExtreme}
          doTodo={() => {
            currentTodo.doTodo();
            actions.startFocusing();
            setCanRest(false);
          }}
        ></RestCard>
      </CardAnimationPlayer>
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

export default CurrentTodoCard;
