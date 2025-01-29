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
import CardFlipAnimator from '../atoms/CardFlipAnimator';

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
    <CardFlipAnimator
      cards={[
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
            <Overlay className="no-todo overlay">
              <TypoAtom>아직 작성된 할 일이 없어요.</TypoAtom>
              <TypoAtom>오늘 하루를 계획해 볼까요?</TypoAtom>
              {/* TODO: 새 투두 만드는 모달로 연결하면 좋을 것 같다 */}
              <BtnAtom
                handleOnClick={openAddTodoModal}
                className="create-todo-button"
              >
                <TagAtom styleOption={{ bg: 'cyan' }}>할 일 기록하기</TagAtom>
              </BtnAtom>
            </Overlay>
          )}
        </CardAtom>,
        <RestCard
          shouldFocus={shouldFocus}
          isLogin={isLogin}
          canRest={canRest}
          startFocusing={actions.startFocusing}
          isExtreme={isExtreme}
          doTodo={() => {
            currentTodo.doTodo();
            actions.startFocusing();
            setCanRest(false);
          }}
        ></RestCard>,
      ]}
      currentCardIndex={status === PomodoroStatus.RESTING ? 1 : 0}
    ></CardFlipAnimator>
  );
}

export default CurrentTodoCard;
