import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import { IChildProps } from '../shared/interfaces';
import { Clock, SideButtons } from '../molecules';
import { CurrentTodoCard } from '../organisms';
import { createPortal } from 'react-dom';
import Modal from './Modal';
import TodoList from './TodoList';
import { usePomodoroActions, usePomodoroValue } from '../hooks';

export interface IMainTodoProps extends IChildProps {
  isLogin: boolean;
}

function MainTodo({ isLogin, children }: IMainTodoProps) {
  const { settings: pomodoroSettings, status } = usePomodoroValue();
  const actions = usePomodoroActions();
  console.log(actions);
  console.log(pomodoroSettings);

  useEffect(() => {
    console.log('status not changed but rendered anyway');
  }, [status]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <MainTodoContainer ref={modalRef}>
      <MainTodoContentWrapper>
        <Clock></Clock>
        <MainTodoCenter>
          <SideButtons>
            <SideButtons.ProgressButton progress={45}>
              45
            </SideButtons.ProgressButton>
            <SideButtons.ProgressButton progress={45}>
              45
            </SideButtons.ProgressButton>
          </SideButtons>
          <CurrentTodoCard>
            focusstep: {pomodoroSettings.focusStep} <br />
            reststep: {pomodoroSettings.restStep}
            <br />
            focused:
            {status.isFocusing ? status.isFocusing.focusedTime : '집중안하는중'}
            <br />
            rested:
            {status.isResting ? status.isResting.restedTime : '휴식안하는중'}
            <br />
            <button onClick={() => actions?.setFocusStep(10)}>
              뽀모도로 집중시간 10분
            </button>
            <button onClick={() => actions?.setRestStep(10)}>
              뽀모도로 휴식시간 10분
            </button>
            <button onClick={() => actions?.startFocusing()}>
              집중시작!!!
            </button>
            <button onClick={() => actions?.startResting()}>휴식시작~</button>
          </CurrentTodoCard>
          <SideButtons>
            <SideButtons.IconButton
              onClick={() => {
                setIsModalOpen(true);
              }}
              imageSrc="icons/hamburger.svg"
            />
            <SideButtons.IconButton
              onClick={() => {
                console.log('clicked');
              }}
              imageSrc="icons/add.svg"
            />
          </SideButtons>
        </MainTodoCenter>
        {isModalOpen &&
          createPortal(
            <Modal
              title="할 일 목록"
              handleClose={() => {
                setIsModalOpen(false);
              }}
            >
              <TodoList />
            </Modal>,
            modalRef.current as HTMLDivElement,
          )}
      </MainTodoContentWrapper>
    </MainTodoContainer>
  );
}

const MainTodoContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MainTodoContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 4rem;
`;

const MainTodoCenter = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 3.06rem;
`;

export default MainTodo;
