import React, { useContext, useEffect, useState } from 'react';
import { CardAtom, Overlay, TagAtom, TypoAtom } from '../atoms';
import { IChildProps } from '../shared/interfaces';
import styled from '@emotion/styled';
import {
  LoginContext,
  useCurrentTodo,
  usePomodoroActions,
  usePomodoroValue,
} from '../hooks';
import { CurrentTodo, ExtremeModeIndicator } from '../molecules';
import { pomodoroUnit } from '../hooks/usePomodoro';
import { PomodoroStatus } from '../services/PomodoroService';
import { usersApi } from '../shared/apis';

interface ICurrentTodoCardProps extends IChildProps {
  openAddTodoModal: () => void;
}
function CurrentTodoCard({
  children,
  openAddTodoModal,
}: ICurrentTodoCardProps) {
  const { settings: pomodoroSettings, status, time } = usePomodoroValue();
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
    <CurrentTodoWrapper>
      <CardAtom w="58.875rem" h="33.11456rem" className="card">
        <ExtremeModeIndicator />
        {currentTodo.currentTodo?.todo != null ? (
          <>
            <CurrentTodo
              todo={currentTodo.currentTodo}
              doTodo={() => {
                currentTodo.doTodo();
              }}
              focusStep={pomodoroSettings.focusStep}
              focusedOnTodo={currentTodo.focusedOnTodo}
              startResting={actions.startResting}
            ></CurrentTodo>
            {status === PomodoroStatus.RESTING && (
              <Overlay className="resting overlay">
                <TypoAtom fontSize="h1" fontColor="titleColor">
                  {shouldFocus ? '휴식 종료' : '휴식'}
                </TypoAtom>
                <button
                  onClick={() => {
                    if (!isLogin) {
                      if (window.confirm('로그인을 하시겠습니까?')) {
                        return usersApi.login();
                      }
                    } else {
                      actions.startFocusing();
                    }
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
                      if (!isLogin) {
                        if (window.confirm('로그인을 하시겠습니까?')) {
                          return usersApi.login();
                        }
                      } else {
                        currentTodo.doTodo();
                        actions.startFocusing();
                        setCanRest(false);
                      }
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
              <TagAtom
                styleOption={{ bg: 'titleColor', bold: 'extraBold' }}
                handler={openAddTodoModal}
              >
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
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    width: 100%;
    height: 100%;
    .resting {
      gap: 2rem;
      > span {
        font-size: 12rem;
      }
      .end-rest-button {
        span {
          font-size: 6rem;
          border-radius: 6rem;
          padding: 1rem 4rem;
        }
      }
    }
    .no-todo {
      padding: 2rem;
      box-sizing: border-box;
      gap: 1.12rem;
      justify-content: center;
      align-items: center;
      > span {
        font-size: 4rem;
        text-align: center;
      }
      .create-todo-button {
        span {
          font-size: 3rem;
          margin-top: 2rem;
          border-radius: 6rem;
          padding: 1rem 3rem;
        }
      }
    }
    .card {
      width: 100%;
      height: 100%;
    }
    .card:not(:first-child) {
      visibility: hidden;
    }
  }
`;

export default CurrentTodoCard;
