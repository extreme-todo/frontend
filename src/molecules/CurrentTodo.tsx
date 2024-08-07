import React, { useEffect, useState } from 'react';
import { IChildProps } from '../shared/interfaces';
import { TodoEntity } from '../DB/indexedAction';
import styled from '@emotion/styled';
import { TagAtom, TypoAtom } from '../atoms';
import { formatTime, getPomodoroStepPercent } from '../shared/timeUtils';

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

  return (
    <CurrentTodoContainer>
      <TypoAtom fontSize={'h4'} fontColor={'titleColor'} className="title">
        지금 할 일
      </TypoAtom>
      <div className="todo-title">
        <TypoAtom fontSize={'h2'} fontColor={'titleColor'}>
          {todo.todo}
        </TypoAtom>
      </div>
      <div className="categories">
        {todo.categories &&
          todo.categories?.map((category, idx) => {
            return (
              <TagAtom
                styleOption={{ bg: 'whiteWine', size: 'big', fontsize: 'md2' }}
                key={idx}
              >
                {category}
              </TagAtom>
            );
          })}
      </div>
      <div className="todo-duration">
        <TypoAtom fontSize={'h4'}>
          {todo.duration < 20
            ? `🍅 `.repeat(todo.duration)
            : `🍅 ` + todo.duration}
        </TypoAtom>
        <TagAtom styleOption={{ bg: 'white', size: 'sm', fontsize: 'sm' }}>
          {formatTime(todo.duration * focusStep)}
        </TagAtom>
      </div>
      <div className="progress-and-button">
        <TodoProgressBar progress={Math.min(todoProgress, 100)}>
          <div className="progress">{todoProgress}%</div>
        </TodoProgressBar>
        <button
          className="do-todo"
          aria-label="do todo"
          onClick={() => doAndRest()}
        ></button>
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
  .todo-title {
    margin-top: 6rem;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    span {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      display: block;
    }
  }
  .categories {
    width: 100%;
    display: flex;
    gap: 0.99rem;
    margin: 0.9rem 0 0.9rem 0;
    flex-wrap: nowrap;
    overflow: auto;
  }
  .todo-duration {
    margin-bottom: 1rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.34rem;
  }
  .progress-and-button {
    width: 100%;
    height: 4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    .do-todo {
      background-image: url('icons/check-dark.svg');
      width: 6.973rem;
      height: 6.973rem;
      flex-shrink: 0;
      background-size: contain;
    }
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
    .progress-and-button {
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
  background-color: ${({ theme }) => theme.colors.whiteWine};
  height: 4rem;
  width: 100%;
  border-radius: 3.125rem;
  padding: 0 0.63rem 0 0.63rem;
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  .progress {
    width: ${({ progress }) => `${progress}%`};
    height: 2.875rem;
    line-height: 2.875rem;
    border-radius: 3.125rem;
    background: ${({ theme }) => theme.colors.titleColor};
    /* 3d_shadow */
    box-shadow: 0px 10px 30px 0px rgba(255, 255, 255, 0.44) inset,
      0px -10px 20px 0px rgba(41, 32, 95, 0.33) inset;

    color: ${({ theme }) => theme.colors.white};
    text-align: right;
    font-size: 1.16219rem;
    font-weight: 700;
    padding-right: 1.4rem;
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
