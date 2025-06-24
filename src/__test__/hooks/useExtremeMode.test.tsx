import {
  screen,
  fireEvent,
  render,
  waitFor,
  act,
} from '@testing-library/react';
import {
  useExtremeMode,
  EXTREME_MODE,
  ExtremeModeProvider,
  PomodoroProvider,
  usePomodoroActions,
} from '../../hooks';
import React, { useEffect } from 'react';
import { mockLocalStorage } from '../../../fixture/mockLocalStorage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  todosApi,
  settingsApi,
  EXTREME_EMAIL_STORAGE,
  EXTREME_TOKEN_STORAGE,
} from '../../shared/apis';
import { getDateInFormat, groupByDate } from '../../shared/timeUtils';
import { PomodoroService } from '../../services/PomodoroService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('useExtremeMode', () => {
  // setting test environment
  const WrapperComponent = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <PomodoroProvider>
        <ExtremeModeProvider>{children}</ExtremeModeProvider>
      </PomodoroProvider>
    </QueryClientProvider>
  );
  const TestExtremeMode = () => {
    const { isExtreme, handleExtremeMode, warningText } = useExtremeMode();
    const { startFocusing, startResting } = usePomodoroActions();
    // Start the Pomodoro timer when the app loads
    useEffect(() => {
      const startTimer = PomodoroService.startTimer().subscribe();
      return () => {
        startTimer.unsubscribe();
      };
    }, []);
    return (
      <>
        isExtreme:{String(isExtreme)}
        <hr />
        warningText:{warningText}
        <hr />
        <button
          data-testid="handleExtremeMode"
          onClick={() => handleExtremeMode(!mockExtremeTodo)}
        >
          handleExtremeMode
        </button>
        <hr />
        <button data-testid="startFocusing" onClick={startFocusing}>
          startFocusing
        </button>
        <hr />
        <button data-testid="startResting" onClick={startResting}>
          startResting
        </button>
      </>
    );
  };

  let wrapMockLocalStorage: (extremeMode: boolean) => void;
  let mockExtremeTodo: boolean;

  beforeEach(() => {
    // localStorage mocking
    mockExtremeTodo = true;
    wrapMockLocalStorage = (extremeMode: boolean) =>
      mockLocalStorage(
        jest.fn((key: string) => {
          if (key === EXTREME_TOKEN_STORAGE || key === EXTREME_EMAIL_STORAGE)
            return 'whydiditwork';
          else if (key === EXTREME_MODE) return extremeMode;
          else if (key === 'pomodoro-settings')
            return `{ "focusStep": 30, "restStep": 15 }`;
        }),
        jest.fn((key: string) => JSON.stringify('true')),
      );

    // api mocking
    settingsApi.setSettings = jest.fn().mockResolvedValue({
      data: {
        id: 5,
        colorMode: 'auto',
        extremeMode: !mockExtremeTodo,
      },
    });
    settingsApi.getSettings = jest.fn().mockResolvedValue({
      data: {
        id: 5,
        colorMode: 'auto',
        extremeMode: mockExtremeTodo,
      },
    });

    todosApi.getList = jest.fn().mockResolvedValue(
      groupByDate([
        {
          id: '1719637016087-a58bpkm1230',
          date: getDateInFormat(new Date()),
          todo: 'Go to grocery store',
          createdAt: new Date(),
          duration: 10,
          done: false,
          categories: ['영어', '학교공부'],
          focusTime: 0,
          order: 2,
        },
      ]),
    );
    todosApi.resetTodos = jest.fn();
  });

  afterEach(() => jest.clearAllMocks());

  describe('렌더링 되었을 때', () => {
    it('settingsApi의 getSettings 메서드가 호출된다.', () => {
      wrapMockLocalStorage(mockExtremeTodo);
      render(<TestExtremeMode />, { wrapper: WrapperComponent });
      expect(settingsApi.getSettings).toBeCalled();
    });
  });

  describe('서버의 extremeMode와 localStorage의 extremeMode가', () => {
    it('일치한다면 localStroage.setItem을 호출하지 않는다.', () => {
      wrapMockLocalStorage(mockExtremeTodo);
      render(<TestExtremeMode />, { wrapper: WrapperComponent });
      expect(localStorage.setItem).not.toBeCalledWith(
        EXTREME_MODE,
        !mockExtremeTodo,
      );
    });

    it('일치하지 않는다면 localStroage.setItem을 호출한다.', () => {
      wrapMockLocalStorage(!mockExtremeTodo);
      render(<TestExtremeMode />, { wrapper: WrapperComponent });
      expect(localStorage.setItem).toBeCalledWith(
        EXTREME_MODE,
        `${mockExtremeTodo}`,
      );
    });
  });

  describe('handleExtremeMode을 호출하면', () => {
    it('집중모드가 아닐 때는 settingsApi의 setSettings 메서드가 호출된다.', async () => {
      wrapMockLocalStorage(mockExtremeTodo);
      const { getByTestId } = render(<TestExtremeMode />, {
        wrapper: WrapperComponent,
      });
      const mutationBtn = getByTestId('handleExtremeMode');
      await waitFor(() => fireEvent.click(mutationBtn));
      expect(settingsApi.setSettings).toBeCalled();
    });

    it('집중모드일 때는  settingsApi의 setSettings 메서드가 호출되지 않는다.', async () => {
      jest.spyOn(window, 'alert').mockImplementation();
      wrapMockLocalStorage(mockExtremeTodo);
      const { getByTestId } = render(<TestExtremeMode />, {
        wrapper: WrapperComponent,
      });
      const focusBtn = getByTestId('startFocusing');
      await waitFor(() => fireEvent.click(focusBtn));
      const mutationBtn = getByTestId('handleExtremeMode');
      await waitFor(() => fireEvent.click(mutationBtn));
      expect(settingsApi.setSettings).not.toBeCalled();
    });
  });

  describe('leftTime은', () => {
    it('휴식 시간이 남아 있을 때는 기록이 삭제된다는 안내가 렌더링 된다.', async () => {
      wrapMockLocalStorage(mockExtremeTodo);
      const { getByText, getByTestId } = render(<TestExtremeMode />, {
        wrapper: WrapperComponent,
      });
      const startResting = getByTestId('startResting');
      await waitFor(() => {
        fireEvent.click(startResting);
      });
      const resetNotice = getByText(/휴식 시간이 끝나면 기록이 삭제됩니다\!/i);
      expect(resetNotice).toBeInTheDocument();
    });

    it('시간이 초과되면 초기화 진행 안내가 렌더링 된다.', async () => {
      mockLocalStorage(
        jest.fn((key: string) => {
          if (key === EXTREME_TOKEN_STORAGE || key === EXTREME_EMAIL_STORAGE)
            return 'whydiditwork';
          else if (key === EXTREME_MODE) return mockExtremeTodo;
          else if (key === 'pomodoro-settings')
            return `{ "focusStep": 30, "restStep": -10 }`;
        }),
        jest.fn((key: string) => JSON.stringify('true')),
      );
      const { getByTestId, findByText } = render(<TestExtremeMode />, {
        wrapper: WrapperComponent,
      });
      const startResting = getByTestId('startResting');
      await waitFor(() => fireEvent.click(startResting));
      await waitFor(async () => {
        const resetNotice1 = await findByText(/초기화가 진행됩니다\.\.\./i);
        // screen.logTestingPlaygroundURL();
        expect(resetNotice1).toBeInTheDocument();
      });
    });
  });
});
