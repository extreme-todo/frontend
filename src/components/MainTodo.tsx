import styled from '@emotion/styled';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { SideButtons } from '../molecules';
import { CurrentTodoCard } from '../organisms';
import { createPortal } from 'react-dom';
import Modal from './Modal';
import TodoList from './TodoList';
import { LoginContext, usePomodoroValue, useTimeMarker } from '../hooks';
import { getPomodoroStepPercent } from '../shared/timeUtils';
import AddTodo from './AddTodo';
import PomodoroTimeSetting from './PomodoroTimeSetting';
import { PomodoroStatus } from '../services/PomodoroService';
import { usersApi } from '../shared/apis';
import { TypoAtom } from '../atoms';

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

  const handleClickSideButton = (type: ModalType) => {
    if (!isLogin) {
      if (window.confirm('로그인을 하시겠습니까?')) {
        return usersApi.login();
      }
    } else {
      setIsModal(type);
    }
  };

  const handleClose = () => {
    setIsModal(null);
  };

  const CurrentMainCard = useCallback(() => {
    switch (isModal) {
      case 'addTodoModal':
        return <AddTodo />;
      case 'timeModal':
        return <PomodoroTimeSetting />;
      case 'todolistModal':
        return <TodoList />;
      default:
        return (
          <CurrentTodoCard
            openAddTodoModal={() => handleClickSideButton('addTodoModal')}
          />
        );
    }
  }, [isModal]);

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
        <MainTodoCenter>
          <SideButtons>
            <SideButtons.SideButton
              onClick={() => handleClickSideButton('timeModal')}
            >
              <img src="icons/clock.svg" />
              <TypoAtom fontSize="body">
                {pomodoroSettings.focusStep}분 집중 |{' '}
                {pomodoroSettings.restStep}분 휴식
              </TypoAtom>
              <div className="tag-button">Edit</div>
            </SideButtons.SideButton>

            <SideButtons.SideButton
              onClick={() => handleClickSideButton('todolistModal')}
            >
              <img src="icons/list.svg" />
              <TypoAtom fontSize="body">오늘의 할일</TypoAtom>
            </SideButtons.SideButton>
            <SideButtons.SideButton
              onClick={() => handleClickSideButton('addTodoModal')}
            >
              <div className="tag-button">Todo +</div>
            </SideButtons.SideButton>
          </SideButtons>
          <CurrentMainCard />
        </MainTodoCenter>
        {/* {isModal === 'todolistModal' &&
          createPortal(
            <Modal title="할 일 목록" handleClose={handleClose}>
              <TodoList />
            </Modal>,
            mainTodoRef.current as HTMLDivElement,
          )} */}
        {/* {isModal === 'timeModal' &&
          createPortal(
            <Modal title="집중시간 / 휴식시간 설정" handleClose={handleClose}>
              <PomodoroTimeSetting />
            </Modal>,
            mainTodoRef.current as HTMLDivElement,
          )} */}
        {/* {isModal === 'addTodoModal' &&
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
          )} */}
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
  flex-direction: column;
  justify-content: space-between;
  gap: 0.75rem;
  .tag-button {
    border: 1px solid ${({ theme }) => theme.color.primary.primary1};
    border-radius: 1.25rem;
    height: 1.25rem;
    padding: 0 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.color.primary.primary1};
  }
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
