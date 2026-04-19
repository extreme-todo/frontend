import { useCallback, useEffect, useMemo, useState } from 'react';
import { BtnAtom, IconAtom, TodoProgressBarAtom, TypoAtom } from '../atoms';
import { Clock, CategoryList } from '../molecules';
import { TodoEntity } from '../DB/indexedAction';
import { useExtremeMode, useIsMobile } from '../hooks';
import { IChildProps } from '../shared/interfaces';
import { getPomodoroStepPercent } from '../shared/timeUtils';
import styled from '@emotion/styled';

interface ICurrentTodoProps extends IChildProps {
  todo: TodoEntity;
  doTodo: () => void;
  focusStep: number;
  focusedOnTodo: number;
  currentRound: number;
  paused?: boolean;
  toggleTimerPlay?: () => void;
}

export function CurrentTodo({
  todo,
  focusStep,
  focusedOnTodo,
  doTodo,
  toggleTimerPlay,
  currentRound,
  paused,
}: ICurrentTodoProps) {
  const [todoProgress, setTodoProgress] = useState<number>(0);
  const isMobile = useIsMobile();
  useEffect(() => {
    setTodoProgress(
      Number(
        getPomodoroStepPercent({
          curr: focusedOnTodo % (focusStep * 60000),
          unit: 1,
          step: focusStep,
        }),
      ),
    );
  }, [focusedOnTodo]);

  const getLeftMs = () => {
    return todo.duration * focusStep * 60000 - focusedOnTodo;
  };

  const getButtonContainer = useMemo(
    () => (
      <div className="button-container">
        <BtnAtom
          className="rest"
          btnStyle="darkBtn"
          handleOnClick={() => toggleTimerPlay && toggleTimerPlay()}
          ariaLabel="일시정지"
        >
          {paused ? (
            <IconAtom src="icon/play-dark.svg" className="play" size={2.25} />
          ) : (
            <IconAtom src="icon/pause-dark.svg" size={1.5} />
          )}
        </BtnAtom>
        <BtnAtom
          className="do-todo"
          aria-label="do todo"
          btnStyle="darkBtn"
          handleOnClick={() => doTodo()}
          ariaLabel="할일완료"
        >
          <IconAtom src="icon/stop-dark.svg" size={1.625} />
        </BtnAtom>
      </div>
    ),
    [todo, toggleTimerPlay, paused],
  );

  return (
    <CurrentTodoContainer>
      <div className="center-container">
        <TypoAtom fontSize={'h3'} fontColor={'primary2'} className="left-time">
          남은 시간
        </TypoAtom>
        <Clock ms={getLeftMs()} fontColor={'primary2'}></Clock>
        {!isMobile && getButtonContainer}
      </div>

      <div className="progress-container">
        <TodoProgressBarAtom
          type="primary2"
          progress={Math.min(todoProgress, 100)}
        ></TodoProgressBarAtom>
      </div>

      <div className="todo-title">
        <div className="todo-duration">
          <TypoAtom fontSize={'h3'}>{currentRound + ' Round'}</TypoAtom>
          <div>
            <TypoAtom fontSize="h3">{`🍅 `.repeat(currentRound)}</TypoAtom>
            <TypoAtom fontSize="h3" className="left-round">
              {`🍅 `.repeat(Math.max(todo.duration - currentRound, 0))}
            </TypoAtom>
          </div>
        </div>
        <TypoAtom fontSize={'h2'} fontColor="primary2">
          {todo.todo}
        </TypoAtom>
        {isMobile && getButtonContainer}
      </div>
    </CurrentTodoContainer>
  );
}

const CurrentTodoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 90%;
  max-width: 90%;
  height: 100%;
  position: relative;
  gap: 2.56rem;
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
  .center-container {
    display: flex;
    width: 100%;
    margin-top: 1.125rem;
    justify-content: space-between;
    align-items: center;
    > :first-child {
      padding-left: 4.75rem;
    }
  }
  .progress-container {
    width: 100%;
    height: 11rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .indicator-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.75rem;
    margin-bottom: 0.5rem;
  }
  .button-container {
    display: flex;
    gap: 0.5rem;
  }
  .rest,
  .do-todo {
    width: 3.75rem;
    height: 3.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .left-round {
    opacity: 0.5;
  }
  .categories {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 0.99rem;
    flex-wrap: nowrap;
    overflow: auto;
  }
  .todo-duration {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    > :first-child {
      flex-shrink: 0;
    }
    span {
      color: ${({ theme }) => theme.color.primary.primary2};
    }
  }

  .title {
    line-height: 2.5rem;
    margin-bottom: 0.25rem;
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
