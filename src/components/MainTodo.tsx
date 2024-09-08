import styled from '@emotion/styled';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { IChildProps } from '../shared/interfaces';
import { Clock, SideButtons } from '../molecules';
import { CurrentTodoCard } from '../organisms';
import { createPortal } from 'react-dom';
import Modal from './Modal';
import TodoList from './TodoList';
import {
  LoginContext,
  usePomodoroActions,
  usePomodoroValue,
  useTimeMarker,
} from '../hooks';
import { getPomodoroStepPercent } from '../shared/timeUtils';
import AddTodo from './AddTodo';
import PomodoroTimeSetting from './PomodoroTimeSetting';
import { PomodoroStatus } from '../services/PomodoroService';
import { usersApi } from '../shared/apis';

type ModalType = 'todolistModal' | 'addTodoModal' | 'timeModal';

function MainTodo() {
  const [isModal, setIsModal] = useState<ModalType | null>(null);

  const {
    status: pomodoroStatus,
    settings: pomodoroSettings,
    time: pomodoroTime,
  } = usePomodoroValue();
  const { isLogin } = useContext(LoginContext);
  const [focusedPercent, setFocusedPercent] = useState<number>(0);
  const [restedPercent, setRestedPercent] = useState<number>(0);
  const mainTodoRef = useRef<HTMLDivElement>(null);
  useTimeMarker();

  useEffect(() => {
    setFocusedPercent(
      Number(
        getPomodoroStepPercent({
          curr:
            pomodoroStatus === PomodoroStatus.FOCUSING ? pomodoroTime ?? 0 : 0,
          unit: 1,
          step: pomodoroSettings.focusStep,
        }),
      ),
    );
    setRestedPercent(
      Number(
        getPomodoroStepPercent({
          curr:
            pomodoroStatus === PomodoroStatus.RESTING ? pomodoroTime ?? 0 : 0,
          unit: 1,
          step: pomodoroSettings.restStep,
        }),
      ),
    );
  }, [pomodoroTime]);

  return (
    <MainTodoContainer ref={mainTodoRef}>
      <MainTodoContentWrapper>
        <Clock></Clock>
        <MainTodoCenter>
          <SideButtons>
            <SideButtons.ProgressButton
              progress={focusedPercent}
              onClick={() => {
                if (!isLogin) {
                  if (window.confirm('로그인을 하시겠습니까?')) {
                    return usersApi.login();
                  }
                } else {
                  setIsModal('timeModal');
                }
              }}
            >
              {focusedPercent}%
            </SideButtons.ProgressButton>
            <SideButtons.ProgressButton
              progress={restedPercent}
              onClick={() => {
                if (!isLogin) {
                  if (window.confirm('로그인을 하시겠습니까?')) {
                    return usersApi.login();
                  }
                } else {
                  setIsModal('timeModal');
                }
              }}
            >
              {restedPercent}%
            </SideButtons.ProgressButton>
          </SideButtons>
          <CurrentTodoCard
            openAddTodoModal={() => {
              if (!isLogin) {
                if (window.confirm('로그인을 하시겠습니까?')) {
                  return usersApi.login();
                }
              } else {
                setIsModal('addTodoModal');
              }
            }}
          ></CurrentTodoCard>
          <SideButtons>
            <SideButtons.IconButton
              onClick={() => {
                if (!isLogin) {
                  if (window.confirm('로그인을 하시겠습니까?')) {
                    return usersApi.login();
                  }
                } else {
                  setIsModal('todolistModal');
                }
              }}
              imageSrc="icons/hamburger.svg"
            />
            <SideButtons.IconButton
              onClick={() => {
                if (!isLogin) {
                  if (window.confirm('로그인을 하시겠습니까?')) {
                    return usersApi.login();
                  }
                } else {
                  setIsModal('addTodoModal');
                }
              }}
              imageSrc="icons/add.svg"
            />
          </SideButtons>
        </MainTodoCenter>
        {isModal === 'todolistModal' &&
          createPortal(
            <Modal
              title="할 일 목록"
              handleClose={() => {
                setIsModal(null);
              }}
            >
              <TodoList />
            </Modal>,
            mainTodoRef.current as HTMLDivElement,
          )}
        {isModal === 'timeModal' &&
          createPortal(
            <Modal
              title="집중시간 / 휴식시간 설정"
              handleClose={() => {
                setIsModal(null);
              }}
            >
              <PomodoroTimeSetting />
            </Modal>,
            mainTodoRef.current as HTMLDivElement,
          )}
        {isModal === 'addTodoModal' &&
          createPortal(
            <Modal
              title="새 할 일 추가하기"
              handleClose={() => {
                setIsModal(null);
              }}
            >
              <AddTodo />
            </Modal>,
            mainTodoRef.current as HTMLDivElement,
          )}
      </MainTodoContentWrapper>
    </MainTodoContainer>
  );
}

const MainTodoContainer = styled.div`
  width: 100dvw;
  height: 100dvh;
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
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    width: 100%;
    height: 100%;
  }
`;

const MainTodoCenter = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 3.06rem;
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    width: 100%;
    height: 100%;
    padding: 24rem 4rem 4rem 4rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 0px;
    box-sizing: border-box;
    row-gap: 0;
    > :nth-child(2) {
      grid-column: 1 / span 2;
    }
    > :nth-child(1),
    > :nth-child(3) {
      margin-top: -12rem;
      z-index: 5;
      /* position: absolute;
      bottom: 0; */
    }
    > :nth-child(1) {
      justify-content: flex-start;
    }
    > :nth-child(3) {
      justify-content: flex-end;
    }
  }
`;

export default MainTodo;
