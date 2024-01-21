import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import { IChildProps } from '../shared/interfaces';
import { Clock, SideButtons } from '../molecules';
import { CurrentTodoCard } from '../organisms';
import { createPortal } from 'react-dom';
import Modal from './Modal';
import TodoList from './TodoList';
import { useCurrentTodo, usePomodoroActions, usePomodoroValue } from '../hooks';
import { getPomodoroStepPercent } from '../shared/utils';

export interface IMainTodoProps extends IChildProps {
  isLogin: boolean;
}

function MainTodo({ isLogin, children }: IMainTodoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { status: pomodoroStatus, settings: pomodoroSettings } =
    usePomodoroValue();
  const [focusedPercent, setFocusedPercent] = useState<number>(0);
  const [restedPercent, setRestedPercent] = useState<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFocusedPercent(
      Number(
        getPomodoroStepPercent({
          curr: pomodoroStatus.focusedTime,
          unit: 1,
          step: pomodoroSettings.focusStep,
        }),
      ),
    );
    setRestedPercent(
      Number(
        getPomodoroStepPercent({
          curr: pomodoroStatus.restedTime,
          unit: 1,
          step: pomodoroSettings.restStep,
        }),
      ),
    );
  }, [pomodoroStatus]);

  return (
    <MainTodoContainer ref={modalRef}>
      <MainTodoContentWrapper>
        <Clock></Clock>
        <MainTodoCenter>
          <SideButtons>
            <SideButtons.ProgressButton progress={focusedPercent}>
              {focusedPercent}
            </SideButtons.ProgressButton>
            <SideButtons.ProgressButton progress={restedPercent}>
              {restedPercent}
            </SideButtons.ProgressButton>
          </SideButtons>
          <CurrentTodoCard></CurrentTodoCard>
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
