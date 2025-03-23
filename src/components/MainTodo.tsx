import styled from '@emotion/styled';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { SideButtons } from '../molecules';
import { CurrentTodoCard } from '../organisms';
import { createPortal } from 'react-dom';
import Modal from './Modal';
import TodoList from './TodoList';
import {
  LoginContext,
  useCurrentTodo,
  useExtremeMode,
  usePomodoroValue,
  useTimeMarker,
} from '../hooks';
import { getPomodoroStepPercent } from '../shared/timeUtils';
import AddTodo from './AddTodo';
import PomodoroTimeSetting from './PomodoroTimeSetting';
import { PomodoroStatus } from '../services/PomodoroService';
import { usersApi } from '../shared/apis';
import { CardAtom, TypoAtom } from '../atoms';
import CardAnimationPlayer, {
  CardAnimationPlayerAnimationType,
} from '../atoms/CardAnimationPlayer';
import { BackgroundColorName } from '../styles/emotion';

export type ModalType = 'todolistModal' | 'addTodoModal' | 'timeModal';

function MainTodo() {
  const [isModal, setIsModal] = useState<ModalType | null>(null);
  const [currentCardColor, setCurrentCardColor] =
    useState<BackgroundColorName>('primary1');

  const {
    status: pomodoroStatus,
    settings: pomodoroSettings,
    time: pomodoroTime,
  } = usePomodoroValue();
  const { isLogin } = useContext(LoginContext);
  const { isExtreme } = useExtremeMode();
  const [focusedPercent, setFocusedPercent] = useState<number>(0);
  const [restedPercent, setRestedPercent] = useState<number>(0);
  const mainTodoRef = useRef<HTMLDivElement>(null);
  const [currentCardAnimation, setCurrentCardAnimation] = useState<
    CardAnimationPlayerAnimationType | CardAnimationPlayerAnimationType[]
  >('SHOW_UP');
  const [dummyCardAnimation, setDummyCardAnimation] = useState<
    CardAnimationPlayerAnimationType | CardAnimationPlayerAnimationType[]
  >('NEXT_UP');

  useTimeMarker();
  const { currentTodo } = useCurrentTodo();
  const {
    settings: { focusStep },
  } = usePomodoroValue();

  const handleClickSideButton = useCallback(
    (type: ModalType) => {
      if (!isLogin) {
        if (window.confirm('로그인을 하시겠습니까?')) {
          return usersApi.login();
        }
      } else {
        setCurrentCardAnimation('HIDE_UP');
        setDummyCardAnimation('SHOW_UP');
        setIsModal(type);
      }
    },
    [isLogin],
  );

  const handleClose = () => {
    setIsModal(null);
  };

  const getDummyCardColor = (): BackgroundColorName => {
    switch (currentCardColor) {
      case 'primary1':
        return 'primary2';
      case 'primary2':
        return 'primary1';
      case 'extreme_dark':
        return 'extreme_orange';
      case 'extreme_orange':
        return 'extreme_dark';
      default:
        return 'primary2';
    }
  };

  const CurrentMainCard = useCallback(() => {
    setCurrentCardAnimation(['HIDE_UP', 'SHOW_UP']);
    setDummyCardAnimation('NEXT_UP');
    switch (isModal) {
      case 'addTodoModal':
        setCurrentCardColor('primary2');
        return <AddTodo handleClose={handleClose} />;
      case 'timeModal':
        setCurrentCardColor('primary1');
        return <PomodoroTimeSetting handleClose={handleClose} />;
      case 'todolistModal':
        setCurrentCardColor('primary1');
        return (
          <TodoList
            openAddTodoModal={handleClickSideButton}
            currentTodo={currentTodo}
            focusStep={focusStep}
          />
        );
      default:
        setCurrentCardColor(
          pomodoroStatus === PomodoroStatus.FOCUSING
            ? isExtreme
              ? 'extreme_dark'
              : 'primary1'
            : isExtreme
            ? 'extreme_orange'
            : 'primary2',
        );
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
              {isExtreme ? (
                <img src="icons/clock-red.svg" />
              ) : (
                <img src="icons/clock.svg" />
              )}
              <TypoAtom
                fontSize="body"
                fontColor={isExtreme ? 'extreme_orange' : 'primary1'}
              >
                {pomodoroSettings.focusStep}분 집중 |{' '}
                {pomodoroSettings.restStep}분 휴식
              </TypoAtom>
            </SideButtons.SideButton>

            <SideButtons.SideButton
              onClick={() => handleClickSideButton('todolistModal')}
            >
              {isExtreme ? (
                <img src="icons/list-red.svg" />
              ) : (
                <img src="icons/list.svg" />
              )}
              {/* TODO: 남은 할 일 계산 로직 추가 */}
              <TypoAtom
                fontSize="body"
                fontColor={isExtreme ? 'extreme_orange' : 'primary1'}
              >
                남은 할일
              </TypoAtom>
            </SideButtons.SideButton>
            <SideButtons.SideButton
              onClick={() => handleClickSideButton('addTodoModal')}
            >
              <div className={'tag-button' + (isExtreme ? ' extreme' : '')}>
                Todo +
              </div>
            </SideButtons.SideButton>
          </SideButtons>
          <div className="center">
            <CardAnimationPlayer animation={currentCardAnimation}>
              <CurrentMainCard />
            </CardAnimationPlayer>
            <CardAnimationPlayer animation={dummyCardAnimation}>
              <CardAtom bg={getDummyCardColor()} />
            </CardAnimationPlayer>
          </div>
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
  overflow: hidden;
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
  .center {
    width: 53.75rem;
    height: 20rem;
    position: relative;
    > * {
      position: absolute;
    }
  }
  .tag-button {
    border: 1px solid ${({ theme }) => theme.color.primary.primary1};
    border-radius: 1.25rem;
    height: 1.25rem;
    padding: 0 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.color.primary.primary1};
    &.extreme {
      color: ${({ theme }) => {
        return theme.color.fontColor.extreme_orange;
      }};
      border-color: ${({ theme }) => {
        return theme.color.fontColor.extreme_orange;
      }};
    }
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
