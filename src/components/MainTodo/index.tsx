import {
  ForwardedRef,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SideButtons } from '../../molecules';
import { CurrentTodoCard, NoTodoCard, RestCard } from '../../organisms';
import { TodoList, AddTodo, PomodoroTimeSetting } from '..';
import {
  CardWrapper,
  MainTodoCenter,
  MainTodoContainer,
  MainTodoContentWrapper,
} from './MainTodoStyles';
import {
  EditContextProvider,
  LoginContext,
  useCurrentTodo,
  useExtremeMode,
  useIsMobile,
  usePomodoroActions,
  usePomodoroValue,
  useTimeMarker,
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
  const isMobile = useIsMobile();
  const { isExtreme } = useExtremeMode();
  const currentCardAnimationTriggerSubject = useRef(
    new Subject<
      CardAnimationPlayerAnimationType | CardAnimationPlayerAnimationType[]
    >(),
  );
  const currentCardAnimationTrigger$ = useRef(
    currentCardAnimationTriggerSubject.current.asObservable(),
  );

  useTimeMarker();
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
    [isLogin],
  );

  const changeCard = useCallback((curr: CardType, next: CardType) => {
    setPrevCard(curr);
    setCurrentCard(next);
    currentCardAnimationTriggerSubject.current.next('SHOW_UP');
  }, []);

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

  const currentFocusedSideButton = useMemo(() => {
    switch (currentCard) {
      case 'addTodoModal':
        return 'addTodo';
      case 'timeModal':
        return 'timer';
      case 'todolistModal':
        return 'list';
      default:
        return undefined;
    }
  }, [currentCard]);

  const CurrentMainCard = useCallback(
    (props: { type: 'current' | 'prev'; children?: ReactNode }) => {
      switch (props.type === 'current' ? currentCard : prevCard) {
        case 'addTodoModal':
          return (
            <AddTodo
              mobileTopButtonSlot={props.children}
              handleClose={handleClose}
            />
          );
        case 'timeModal':
          return (
            <PomodoroTimeSetting
              mobileTopButtonSlot={props.children}
              handleClose={handleClose}
            />
          );
        case 'todolistModal':
          return (
            <EditContextProvider>
              <TodoList
                openAddTodoModal={handleClickSideButton}
                currentTodo={currentTodo}
                focusStep={focusStep}
                handleClose={handleClose}
                mobileTopButtonSlot={props.children}
              />
            </EditContextProvider>
          );
        case 'rest':
          return currentTodo?.todo ? (
            <RestCard mobileTopButtonSlot={props.children} />
          ) : (
            <NoTodoCard
              addTodoHandler={() => {
                handleClickSideButton('addTodoModal');
              }}
              mobileTopButtonSlot={props.children}
            />
          );
        case 'currentTodo':
          return currentTodo?.todo ? (
            <CurrentTodoCard mobileTopButtonSlot={props.children} />
          ) : (
            <NoTodoCard
              addTodoHandler={() => {
                handleClickSideButton('addTodoModal');
              }}
              mobileTopButtonSlot={props.children}
            />
          );
        default:
          return <></>;
      }
    },
    [currentCard, prevCard, currentTodo, isLogin],
  );

  const MainCard = useCallback(() => {
    return (
      <CardWrapper>
        <CurrentMainCard type="current">
          {isMobile && (
            <SideButtons.ShowTimerButton
              className="timer-mobile-btn"
              focusStep={pomodoroSettings.focusStep}
              restStep={pomodoroSettings.restStep}
              theme={(() => {
                if (isExtreme) {
                  return 'extremeDarkBtn';
                }
                switch (currentCardColor) {
                  case 'primary1':
                    return 'darkBtn';
                  case 'primary2':
                    return 'lightBtn';
                  case 'extreme_dark':
                    return 'extremeLightBtn';
                  case 'extreme_orange':
                    return 'extremeDarkBtn';
                  default:
                    return 'darkBtn';
                }
              })()}
            />
          )}
        </CurrentMainCard>
      </CardWrapper>
    );
  }, [
    currentCard,
    prevCard,
    isMobile,
    currentTodo,
    isLogin,
    pomodoroSettings.focusStep,
    pomodoroSettings.restStep,
  ]);

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
    <SideButtons
      focusedButton={currentFocusedSideButton}
      onClickHandlers={{
        ranking: () => alert('기능 준비 중입니다.'),
        help: () => alert('기능 준비 중입니다.'),
        addTodo: () => {
          handleClickSideButton('addTodoModal');
        },
        list: () => {
          handleClickSideButton('todolistModal');
        },
        timer: () => {
          handleClickSideButton('timeModal');
        },
        doAll: () => alert('기능 준비 중입니다.'),
      }}
    >
      <MainTodoContainer ref={ref}>
        <MainTodoContentWrapper>
          <MainTodoCenter>
            <div
              className="side-buttons"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {!isMobile && (
                  <SideButtons.ShowTimerButton
                    focusStep={pomodoroSettings.focusStep}
                    restStep={pomodoroSettings.restStep}
                    theme={isExtreme ? 'extremeLightBtn' : 'lightBtn'}
                  />
                )}
                <SideButtons.ShowAddTodoButton
                  theme={isExtreme ? 'extremeLightBtn' : 'lightBtn'}
                />
                <SideButtons.ShowListButton
                  theme={isExtreme ? 'extremeLightBtn' : 'lightBtn'}
                />
              </div>
              <div>
                <SideButtons.ShowHelpButton
                  theme={isExtreme ? 'extremeLightBtn' : 'lightBtn'}
                />
              </div>
            </div>
            <div className="center">
              <CardAnimationPlayerAtom
                trigger={currentCardAnimationTrigger$.current}
              >
                <MainCard />
                {/* <CurrentMainCard type="current" /> */}
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
    </SideButtons>
  );
});
