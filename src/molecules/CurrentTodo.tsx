import React, { useEffect, useState } from 'react';
import { IChildProps } from '../shared/interfaces';
import { TodoEntity } from '../DB/indexedAction';
import styled from '@emotion/styled';
import { TagAtom, TypoAtom } from '../atoms';
import { formatTime, getPomodoroStepPercent } from '../shared/utils';

export interface ICurrentTodoProps extends IChildProps {
  todo: TodoEntity;
  doTodo: (focusTime: number) => Promise<void>;
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
      <TypoAtom fontSize={'h4'} fontColor={'titleColor'}>
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
        <TodoProgressBar progress={todoProgress}>
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
`;
