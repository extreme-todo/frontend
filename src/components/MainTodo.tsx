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
import PomodoroTimeSetting from './PomodoroTimeSetting';

export interface IMainTodoProps extends IChildProps {
  isLogin: boolean;
}

function MainTodo({ isLogin, children }: IMainTodoProps) {
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const { status: pomodoroStatus, settings: pomodoroSettings } =
    usePomodoroValue();
  const { startResting } = usePomodoroActions();
  const [focusedPercent, setFocusedPercent] = useState<number>(0);
  const [restedPercent, setRestedPercent] = useState<number>(0);
  const mainTodoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 최초 진입시에는 휴식 상태로 시작
    startResting();
  }, []);

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
    <MainTodoContainer ref={mainTodoRef}>
      <MainTodoContentWrapper>
        <Clock></Clock>
        <MainTodoCenter>
          <SideButtons>
            <SideButtons.ProgressButton
              progress={focusedPercent}
              onClick={() => setIsTimeModalOpen(true)}
            >
              {focusedPercent}%
            </SideButtons.ProgressButton>
            <SideButtons.ProgressButton
              progress={restedPercent}
              onClick={() => setIsTimeModalOpen(true)}
            >
              {restedPercent}%
            </SideButtons.ProgressButton>
          </SideButtons>
          <CurrentTodoCard></CurrentTodoCard>
          <SideButtons>
            <SideButtons.IconButton
              onClick={() => {
                setIsTodoModalOpen(true);
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
        {isTodoModalOpen &&
          createPortal(
            <Modal
              title="할 일 목록"
              handleClose={() => {
                setIsTodoModalOpen(false);
              }}
            >
              <TodoList />
            </Modal>,
            mainTodoRef.current as HTMLDivElement,
          )}
        {isTimeModalOpen &&
          createPortal(
            <Modal
              title="집중시간 / 휴식시간 설정"
              handleClose={() => {
                setIsTimeModalOpen(false);
              }}
            >
              <PomodoroTimeSetting />
            </Modal>,
            mainTodoRef.current as HTMLDivElement,
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
