import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SideButtons } from '../../molecules';
import { CurrentTodoCard, NoTodoCard, RestCard } from '../../organisms';
import { TodoList, AddTodo, PomodoroTimeSetting } from '..';
import {
  MainTodoCenter,
  MainTodoContainer,
  MainTodoContentWrapper,
} from './MainTodoStyles';
import {
  EditContextProvider,
  LoginContext,
  useCurrentTodo,
  useExtremeMode,
  usePomodoroActions,
  usePomodoroValue,
  useHandleDidntDo,
} from '../../hooks';
import { PomodoroStatus } from '../../services/PomodoroService';
import { usersApi } from '../../shared/apis';
import {
  CardAtom,
  TypoAtom,
  CardAnimationPlayerAnimationType,
  CardAnimationPlayerAtom,
} from '../../atoms';
import { BackgroundColorName } from '../../styles/emotion';
import { Subject } from 'rxjs';

export type ModalType = 'todolistModal' | 'addTodoModal' | 'timeModal';

export type CardType = ModalType | 'noTodo' | 'currentTodo' | 'rest';

export const MainTodo = forwardRef((_, ref: ForwardedRef<HTMLElement>) => {
  const ANIMATION_DURATION = 300;
  const [currentCard, setCurrentCard] = useState<CardType>('currentTodo');
  const [prevCard, setPrevCard] = useState<CardType | null>(null);
  const [currentCardColor, setCurrentCardColor] =
    useState<BackgroundColorName>('primary1');
  const {
    status: pomodoroStatus,
    settings: pomodoroSettings,
    time: pomodoroTime,
  } = usePomodoroValue();
  const actions = usePomodoroActions();
  const { isLogin } = useContext(LoginContext);
  const { isExtreme } = useExtremeMode();
  const currentCardAnimationTriggerSubject = useRef(
    new Subject<
      CardAnimationPlayerAnimationType | CardAnimationPlayerAnimationType[]
    >(),
  );
  const currentCardAnimationTrigger$ = useRef(
    currentCardAnimationTriggerSubject.current.asObservable(),
  );

  const { currentTodo, canRest, doTodo } = useCurrentTodo({
    value: {
      status: pomodoroStatus,
      settings: pomodoroSettings,
      time: pomodoroTime,
    },
    actions,
  });
  const {
    settings: { focusStep },
  } = usePomodoroValue();

  const changeCard = (curr: CardType, next: CardType) => {
    setPrevCard(curr);
    setCurrentCard(next);
    currentCardAnimationTriggerSubject.current.next('SHOW_UP');
  };

  const handleClickSideButton = useCallback(
    (type: ModalType) => {
      if (!isLogin) {
        if (window.confirm('로그인을 하시겠습니까?')) {
          return usersApi.login();
        }
      } else {
        changeCard(currentCard, type);
      }
    },
    [isLogin, currentCard, changeCard],
  );

  const handleClose = useCallback(() => {
    changeCard(
      currentCard,
      pomodoroStatus === PomodoroStatus.RESTING ? 'rest' : 'currentTodo',
    );
  }, [currentCard, pomodoroStatus, changeCard]);

  const getDummyCardColor = (): BackgroundColorName => {
    switch (currentCardColor) {
      case 'primary1':
        return 'primary2';
      case 'primary2':
        return isExtreme ? 'extreme_dark' : 'primary1';
      case 'extreme_dark':
        return 'primary2';
      case 'extreme_orange':
        return 'extreme_dark';
      default:
        return 'primary2';
    }
  };

  const CurrentMainCard = useCallback(
    (props: { type: 'current' | 'prev' }) => {
      switch (props.type === 'current' ? currentCard : prevCard) {
        case 'addTodoModal':
          return <AddTodo handleClose={handleClose} />;
        case 'timeModal':
          return <PomodoroTimeSetting handleClose={handleClose} />;
        case 'todolistModal':
          return (
            <EditContextProvider>
              <TodoList
                openAddTodoModal={handleClickSideButton}
                currentTodo={currentTodo}
                focusStep={focusStep}
                handleClose={handleClose}
              />
            </EditContextProvider>
          );
        case 'rest':
          return <RestCard />;
        case 'currentTodo':
          return currentTodo ? (
            <CurrentTodoCard />
          ) : (
            <NoTodoCard
              addTodoHandler={() => {
                handleClickSideButton('addTodoModal');
              }}
            />
          );
        default:
          return <></>;
      }
    },
    [currentCard, prevCard, currentTodo, isLogin],
  );

  useHandleDidntDo();

  useEffect(() => {
    setTimeout(() => {
      switch (pomodoroStatus) {
        case PomodoroStatus.RESTING:
          console.log('🍅', pomodoroStatus);
          changeCard(currentCard, 'rest');
          break;
        case PomodoroStatus.OVERFOCUSING:
        case PomodoroStatus.FOCUSING:
          console.log('🥔', pomodoroStatus);
          changeCard(currentCard, 'currentTodo');
          break;
      }
    }, 0);
  }, [pomodoroStatus]);

  useEffect(() => {
    prevCard &&
      setTimeout(() => {
        setPrevCard(null);
      }, ANIMATION_DURATION);
  }, [prevCard]);

  useEffect(() => {
    setTimeout(() => {
      switch (currentCard) {
        case 'addTodoModal':
          setCurrentCardColor('primary2');
          break;
        case 'timeModal':
          setCurrentCardColor('primary1');
          break;
        case 'todolistModal':
          setCurrentCardColor('primary1');
          break;
        case 'currentTodo':
          setCurrentCardColor(isExtreme ? 'extreme_dark' : 'primary1');
          break;
        case 'rest':
          setCurrentCardColor('primary2');
      }
    }, 0.3);
  }, [currentCard, pomodoroStatus, isExtreme]);

  return (
    <MainTodoContainer ref={ref}>
      <MainTodoContentWrapper>
        <MainTodoCenter>
          <SideButtons>
            <SideButtons.SideButton
              onClick={() => handleClickSideButton('timeModal')}
            >
              {isExtreme ? (
                <img src="icon/clock-red.svg" />
              ) : (
                <img src="icon/clock.svg" />
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
                <img src="icon/list-red.svg" />
              ) : (
                <img src="icon/list.svg" />
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
            <CardAnimationPlayerAtom
              trigger={currentCardAnimationTrigger$.current}
            >
              <CurrentMainCard type="current" />
            </CardAnimationPlayerAtom>
            {prevCard && (
              <CardAnimationPlayerAtom animation={'HIDE_UP'}>
                <CurrentMainCard type="prev" />
              </CardAnimationPlayerAtom>
            )}
            {!prevCard && (
              <CardAnimationPlayerAtom animation={'NEXT_UP'}>
                <CardAtom bg={getDummyCardColor()} style={{ zIndex: -1 }} />
              </CardAnimationPlayerAtom>
            )}
          </div>
        </MainTodoCenter>
      </MainTodoContentWrapper>
    </MainTodoContainer>
  );
});
