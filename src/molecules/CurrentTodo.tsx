import React, { useEffect, useState } from 'react';
import { IChildProps } from '../shared/interfaces';
import { TodoEntity } from '../DB/indexedAction';
import styled from '@emotion/styled';
import { TagAtom, TypoAtom } from '../atoms';
import { formatTime, getPomodoroStepPercent } from '../shared/timeUtils';
import Clock from './Clock';
import { usePomodoroValue } from '../hooks';

export interface ICurrentTodoProps extends IChildProps {
  todo: TodoEntity;
  doTodo: (focusTime: number) => void;
  focusStep: number;
  focusedOnTodo: number;
  startResting: () => void;
}

function CurrentTodo({
  todo,
  focusStep,
  focusedOnTodo,
  doTodo,
  startResting,
}: ICurrentTodoProps) {
  const [todoProgress, setTodoProgress] = useState<number>(0);
  useEffect(() => {
    setTodoProgress(
      Number(
        getPomodoroStepPercent({
          curr: focusedOnTodo,
          unit: todo.duration,
          step: focusStep,
        }),
      ),
    );
  }, [focusedOnTodo]);

  const doAndRest = () => {
    doTodo(focusedOnTodo);
  };

  const getLeftMs = () => {
    return todo.duration * focusStep * 60000 - focusedOnTodo;
  };

  return (
    <CurrentTodoContainer>
      <TypoAtom fontSize={'h1'} fontColor={'titleColor'} className="title">
        더 집중하셔야 합니다!
      </TypoAtom>
      <TypoAtom
        fontSize={'body'}
        fontColor={'titleColor'}
        className="left-time"
      >
        남은 시간
      </TypoAtom>
      <div className="center-container">
        <Clock ms={getLeftMs()}></Clock>
        <div className="todo-title">
          <div className="categories">
            {todo.categories &&
              todo.categories?.map((category, idx) => {
                return (
                  <div className="category" key={idx}>
                    {category}
                  </div>
                );
              })}
          </div>
          <TypoAtom fontSize={'h2'}>{todo.todo}</TypoAtom>
        </div>
      </div>
      <div className="indicator-container">
        <div className="todo-duration">
          <TypoAtom fontSize={'h3'}>{todo.duration + ' Round'}</TypoAtom>
          <TypoAtom fontSize="h3">
            {todo.duration < 20
              ? `🍅 `.repeat(todo.duration)
              : `🍅 ` + todo.duration}
          </TypoAtom>
        </div>
        <div className="button-container">
          <button className="rest" onClick={() => startResting()}>
            <img src="icons/pause.svg" />
          </button>
          <button
            className="do-todo"
            aria-label="do todo"
            onClick={() => doAndRest()}
          >
            끝내기
          </button>
        </div>
      </div>

      <div className="progress-container">
        <TodoProgressBar progress={Math.min(todoProgress, 100)}>
          <div className="progress"></div>
        </TodoProgressBar>
      </div>
    </CurrentTodoContainer>
  );
}

export default CurrentTodo;

const CurrentTodoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  /* overflow: auto; */
  /* background-color: aliceblue; */
  // TODO : Atom 수정되면 지우기
  .title {
    /* 더 집중하셔야 합니다! */
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 2.25rem;
    line-height: 2.5rem;
    /* identical to box height, or 111% */
    display: flex;
    align-items: center;
    letter-spacing: -0.002em;
    color: #523ea1;
  }
  // TODO : Atom 수정되면 지우기
  .left-time {
    margin-top: 0.25rem;
    /* 남은 시간 */
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    /* identical to box height, or 125% */
    display: flex;
    align-items: center;
    color: #523ea1;
  }
  // TODO : Atom 수정되면 지우기
  .todo-title {
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    span {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      display: block;
      /* RxJS 공부하기 */
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 400;
      font-size: 1.875rem;
      line-height: 2rem;
      /* identical to box height, or 107% */
      display: flex;
      align-items: center;
      letter-spacing: -0.002em;

      color: #523ea1;
    }
  }
  .center-container {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
  .indicator-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .button-container {
    display: flex;
    gap: 0.5rem;
  }
  .rest {
    width: 2.25rem;
    height: 2.25rem;
    background: rgba(82, 62, 161, 0.21);
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .categories {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 0.99rem;
    flex-wrap: nowrap;
    overflow: auto;
  }
  .category {
    /* Auto layout */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4px 16px;
    gap: 10px;
    background: #00bd08;
    border-radius: 13px;
    color: white;
  }
  .todo-duration {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    span {
      color: #523ea1;
    }
  }
  .do-todo {
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 1.0625rem;
    gap: 0.625rem;
    background: rgba(82, 62, 161, 0.21);
    border-radius: 3.125rem;
  }
  .progress-container {
    width: 100%;
    height: 4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    height: 100%;
    position: relative;
    .title {
      font-size: 6rem;
      font-weight: 600;
    }
    .todo-title {
      overflow: auto;
      padding-right: 16rem;
      box-sizing: border-box;
      max-height: 50%;
      span {
        vertical-align: middle;
        font-size: 8rem;
        white-space: normal;
        overflow: initial;
      }
    }
    .categories {
      margin: 4rem 0 4rem 0;
      span {
        font-size: 4rem;
        border-radius: 6rem;
        padding: 1rem 3rem 1rem 3rem;
      }
    }
    .todo-duration {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 2rem;
      span {
        font-size: 4rem;
      }
      div > span {
        font-size: 3rem;
        border-radius: 6rem;
        padding: 0.5rem 3rem 0.5rem 3rem;
      }
    }
    .progress-container {
      position: absolute;
      height: calc(100% - 12rem);
      width: 6rem;
      top: 0;
      right: 0;
      flex-direction: row-reverse;
      box-sizing: border-box;
      .do-todo {
        position: absolute;
        right: 8rem;
        background-position: center;
      }
    }
  }
`;

const TodoProgressBar = styled.div<{ progress: number }>`
  background-color: #523ea1;
  height: 0.75rem;
  width: 100%;
  border-radius: 1.75rem;
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  .progress {
    width: ${({ progress }) => `${progress}%`};
    height: 100%;
    background: #ff7e55;
    transition: all 0.2s ease-in-out;
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    width: 100%;
    height: 100%;
    align-items: flex-start;
    justify-content: center;
    padding: 1rem 0 1rem 0;
    .progress {
      height: ${({ progress }) => `${progress}%`};
      width: 70%;
      overflow: hidden;
      padding: 0;
      color: transparent;
    }
  }
`;
