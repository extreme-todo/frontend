import { useEffect, useState } from 'react';
import { IChildProps } from '../shared/interfaces';
import { TodoEntity } from '../DB/indexedAction';
import styled from '@emotion/styled';
import { BtnAtom, IconAtom, TypoAtom } from '../atoms';
import { getPomodoroStepPercent } from '../shared/timeUtils';
import Clock from './Clock';
import CategoryList from './CategoryList';

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
      <TypoAtom fontSize={'h1'} fontColor={'primary2'} className="title">
        힘 내세요!
      </TypoAtom>
      <TypoAtom fontSize={'body'} fontColor={'primary2'} className="left-time">
        남은 시간
      </TypoAtom>
      <div className="center-container">
        <Clock ms={getLeftMs()} fontColor={'primary2'}></Clock>
        <div className="todo-title">
          <div className="categories">
            <CategoryList categories={todo.categories}></CategoryList>
          </div>
          <TypoAtom fontSize={'h2'} fontColor="primary2">
            {todo.todo}
          </TypoAtom>
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
          <BtnAtom
            className="rest"
            btnType="darkBtn"
            handleOnClick={() => startResting()}
          >
            <IconAtom src="icons/pause-dark.svg" size={1} />
          </BtnAtom>
          <BtnAtom
            className="do-todo"
            aria-label="do todo"
            btnType="darkBtn"
            handleOnClick={() => doAndRest()}
          >
            끝내기
          </BtnAtom>
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
  .todo-title {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    max-width: 20ch;
  }
  .center-container {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
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
  .rest {
    width: 2.25rem;
    height: 2.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 1rem;
      height: 1rem;
    }
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
    span {
      color: ${({ theme }) => theme.color.primary.primary2};
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
    width: 6.25rem;
  }
  .progress-container {
    width: 100%;
    height: 4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
  }
  .title {
    line-height: 2.5rem;
    margin-bottom: 0.25rem;
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    height: 100%;
    position: relative;
    .title {
      font-size: ${({ theme: { fontSize } }) => fontSize.b1.size};
      font-weight: ${({ theme: { fontSize } }) => fontSize.b1.weight};
    }
    .todo-title {
      overflow: auto;
      padding-right: 16rem;
      box-sizing: border-box;
      max-height: 50%;
      span {
        vertical-align: middle;
        font-size: ${({ theme: { fontSize } }) => fontSize.h1.size};
        white-space: normal;
        overflow: initial;
      }
    }
    .categories {
      margin: 4rem 0 4rem 0;
      span {
        font-size: ${({ theme: { fontSize } }) => fontSize.h1.size};
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
        font-size: ${({ theme: { fontSize } }) => fontSize.h1.size};
      }
      div > span {
        font-size: ${({ theme: { fontSize } }) => fontSize.h1.size};
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
  background-color: ${({ theme }) => theme.color.backgroundColor.primary2};
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
    line-height: 2.875rem;
    border-radius: 3.125rem;
    background: ${({ theme }) => theme.color.backgroundColor.extreme_orange};
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
