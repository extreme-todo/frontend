import React, { useEffect, useState } from 'react';
import { CardAtom, Overlay, TagAtom, TypoAtom } from '../atoms';
import { IChildProps } from '../shared/interfaces';
import styled from '@emotion/styled';
import { useCurrentTodo, usePomodoroActions, usePomodoroValue } from '../hooks';
import { CurrentTodo } from '../molecules';
import { ETIndexed } from '../DB/indexed';
import { TodoEntity } from '../DB/indexedAction';

type ICurrentTodoCardProps = IChildProps;
function CurrentTodoCard({ children }: ICurrentTodoCardProps) {
  const { settings: pomodoroSettings, status } = usePomodoroValue();
  const actions = usePomodoroActions();
  const currentTodo = useCurrentTodo();
  console.log(actions);
  console.log(pomodoroSettings);

  useEffect(() => {
    console.log(currentTodo);
  }, [currentTodo]);

  return (
    <CurrentTodoWrapper>
      <CardAtom w="58.875rem" h="33.11456rem" className="card">
        {currentTodo.currentTodo ? (
          <CurrentTodo
            todo={currentTodo.currentTodo}
            doTodo={currentTodo.doTodo}
            focusStep={pomodoroSettings.focusStep}
            focusTime={status.focusedTime}
          ></CurrentTodo>
        ) : (
          <Overlay className="no-todo-overlay">
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
  .no-todo-overlay {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    text-align: center;
    gap: 1rem;
    height: 100%;
    flex-wrap: wrap;
    .create-todo-button {
      width: fit-content;
    }
  }
`;

export default CurrentTodoCard;
