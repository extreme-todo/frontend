import React, { useEffect, useState } from 'react';
import { CardAtom, Overlay, TagAtom, TypoAtom } from '../atoms';
import { IChildProps } from '../shared/interfaces';
import styled from '@emotion/styled';
import { useCurrentTodo, usePomodoroActions, usePomodoroValue } from '../hooks';
import { CurrentTodo, ExtremeModeIndicator } from '../molecules';
import { pomodoroUnit } from '../hooks/usePomodoro';

type ICurrentTodoCardProps = IChildProps;
function CurrentTodoCard({ children }: ICurrentTodoCardProps) {
  const { settings: pomodoroSettings, status } = usePomodoroValue();
  const [canRest, setCanRest] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(false);
  const actions = usePomodoroActions();
  const currentTodo = useCurrentTodo();

  useEffect(() => {
    const ifShouldRest = checkIfShouldRest();
    const ifCanRest = checkIfCanRest();
    !ifShouldRest && currentTodo.updateFocus(1000);
  }, [status.focusedTime]);

  useEffect(() => {
    checkIfShouldFocus();
  }, [status.restedTime]);

  const checkIfCanRest = () => {
    if (
      currentTodo.currentTodo?.duration &&
      currentTodo.focusedOnTodo >=
        currentTodo.currentTodo?.duration *
          pomodoroSettings.focusStep *
          pomodoroUnit
    ) {
      setCanRest(true);
      return true;
    } else {
      return canRest;
    }
  };

  const checkIfShouldRest = () => {
    if (
      currentTodo.currentTodo?.duration &&
      currentTodo.focusedOnTodo ===
        currentTodo.currentTodo?.duration *
          pomodoroSettings.focusStep *
          pomodoroUnit
    ) {
      actions.startResting();
      return true;
    }
    if (
      status.isFocusing &&
      status.focusedTime === pomodoroSettings.focusStep * pomodoroUnit
    ) {
      actions.startResting();
      return true;
    }
    return false;
  };

  const checkIfShouldFocus = () => {
    if (
      status.isResting &&
      status.restedTime >= pomodoroSettings.restStep * pomodoroUnit
    ) {
      setShouldFocus(true);
    } else {
      setShouldFocus(false);
    }
  };

  return (
    <CurrentTodoWrapper>
      <CardAtom w="58.875rem" h="33.11456rem" className="card">
        <ExtremeModeIndicator />
        {currentTodo.currentTodo?.todo != null ? (
          <>
            <CurrentTodo
              todo={currentTodo.currentTodo}
              doTodo={async () => {
                await currentTodo.doTodo();
                setCanRest(false);
              }}
              focusStep={pomodoroSettings.focusStep}
              focusedOnTodo={currentTodo.focusedOnTodo}
              startResting={actions.startResting}
            ></CurrentTodo>
            {status.isResting && (
              <Overlay className="resting overlay">
                <TypoAtom fontSize="h1" fontColor="titleColor">
                  {shouldFocus ? '휴식 종료' : '휴식'}
                </TypoAtom>
                <button
                  onClick={() => actions.startFocusing()}
                  className="end-rest-button"
                >
                  <TagAtom
                    styleOption={{
                      bg: 'subFontColor',
                      size: 'big',
                      fontsize: 'md2',
                    }}
                  >
                    {canRest
                      ? '조금 더 집중하기'
                      : shouldFocus
                      ? '다음 할 일을 시작하세요'
                      : '종료'}
                  </TagAtom>
                </button>
                {canRest && (
                  <button
                    onClick={() => {
                      currentTodo.doTodo();
                      actions.startFocusing();
                      setCanRest(false);
                    }}
                    className="end-rest-button"
                  >
                    <TagAtom
                      styleOption={{
                        bg: 'subFontColor',
                        size: 'big',
                        fontsize: 'md2',
                      }}
                    >
                      다음 할 일 하기
                    </TagAtom>
                  </button>
                )}
              </Overlay>
            )}
          </>
        ) : (
          <Overlay className="no-todo overlay">
            <TypoAtom>아직 작성된 할 일이 없어요.</TypoAtom>
            <TypoAtom>오늘 하루를 계획해 볼까요?</TypoAtom>
            {/* TODO: 새 투두 만드는 모달로 연결하면 좋을 것 같다 */}
            <button className="create-todo-button">
              <TagAtom styleOption={{ bg: 'titleColor' }}>
                할 일 기록하기
              </TagAtom>
            </button>
          </Overlay>
        )}
      </CardAtom>
      <CardAtom w="57.3125rem" h="32.25rem" className="card"></CardAtom>
      <CardAtom w="55.875rem" h="31.4375rem" className="card"></CardAtom>
    </CurrentTodoWrapper>
  );
}

const CurrentTodoWrapper = styled.div`
  position: relative;
  .card:nth-child(2) {
    position: absolute;
    top: 1.82rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
  }
  .card:nth-child(3) {
    position: absolute;
    top: 3.32rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: -2;
  }
  .overlay {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    text-align: center;
    gap: 0.63rem;
    height: 100%;
    flex-wrap: wrap;
    .create-todo-button {
      width: fit-content;
    }
    .end-rest-button {
      display: flex;
      justify-content: center;
    }
  }
`;

export default CurrentTodoCard;
