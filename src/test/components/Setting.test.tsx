import React from 'react';
import { Setting } from '../../components';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';
import { rankingApi, settingsApi, todosApi, usersApi } from '../../shared/apis';
import { EXTREME_MODE, ExtremeModeProvider } from '../../hooks/useExtremeMode';
import PomodoroProvider from '../../hooks/usePomodoro';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginProvider } from '../../hooks';
import { mockLocalStorage } from '../../../fixture/mockLocalStorage';
import { getDateInFormat, groupByDate } from '../../shared/timeUtils';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('SettingModal', () => {
  let mockExtremeTodo = true;
  beforeEach(() => {
    mockLocalStorage(
      jest.fn((key: string) => {
        if (key === 'extremeToken' || key === 'extremeEmail')
          return 'whydiditwork';
        else if (key === EXTREME_MODE) return mockExtremeTodo;
        else if (key === 'pomodoro-settings')
          return `{ "focusStep": 30, "restStep": 15 }`;
      }),
      jest.fn((key: string) => JSON.stringify('true')),
      jest.fn(),
    );

    jest.spyOn(window, 'alert').mockImplementation();
    jest.spyOn(window, 'confirm').mockImplementation(() => true);

    // api mocking
    settingsApi.setSettings = jest.fn(({ colorMode, extremeMode }) => {
      mockExtremeTodo = extremeMode;
      return Promise.resolve({
        status: 200,
        statusText: '',
        headers: {},
        config: {},
        data: {
          id: 5,
          colorMode: colorMode,
          extremeMode: mockExtremeTodo,
        },
      });
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
          createdAt: new Date('Dec 26, 2022 18:00:30'),
          duration: 10,
          done: false,
          categories: ['영어', '학교공부'],
          focusTime: 0,
          order: 2,
        },
      ]),
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={designTheme}>
          <LoginProvider>
            <PomodoroProvider>
              <ExtremeModeProvider>
                <Setting handleClose={jest.fn()} />
              </ExtremeModeProvider>
            </PomodoroProvider>
          </LoginProvider>
        </ThemeProvider>
      </QueryClientProvider>,
    );
  });
  afterEach(() => jest.clearAllMocks());

  describe('익스트림 모드에는', () => {
    it('`익스트림 모드` 리스트 타이틀이 있다.', () => {
      expect(screen.getByText('익스트림 모드')).toBeInTheDocument();
    });

    it('툴팁 아이콘이 있다.', () => {
      expect(screen.getByAltText('tooltip')).toBeInTheDocument();
    });

    it('switch버튼이 초기값으로 ON 값을 가지고 있다.', () => {
      const switchBtn = screen.getByText('ON');

      expect(switchBtn).toBeInTheDocument();
    });
  });

  describe('툴팁 아이콘에 마우스를 올리면', () => {
    it('툴팁 메시지가 나온다.', () => {
      expect(
        screen.queryByText(
          '쉬는 시간을 초과할 시 작성했던 todo와 일간, 주간, 월간 기록이 모두 삭제됩니다!',
        ),
      ).toBeNull();

      const tooltipBtn = screen.getByAltText('tooltip');
      fireEvent.mouseOver(tooltipBtn);

      expect(
        screen.queryByText(
          '쉬는 시간을 초과할 시 작성했던 todo와 일간, 주간, 월간 기록이 모두 삭제됩니다!',
        ),
      ).toBeInTheDocument();
    });
  });

  describe('switch버튼을 누르면', () => {
    it('SettingsApi.setSettings를 호출해서 Extreme Mode를 반대로 설정한다.', async () => {
      const currExtremeTodo = mockExtremeTodo;
      const switchBtn = screen.getByText('ON');
      await waitFor(() => fireEvent.click(switchBtn));
      expect(settingsApi.setSettings).toBeCalledWith({
        colorMode: 'auto',
        extremeMode: !currExtremeTodo,
      });
      expect(mockExtremeTodo).toBe(!currExtremeTodo);
    });
  });

  // 회원탈퇴를 누르면
  describe('회원탈퇴에는', () => {
    // TODO : 예외처리 하기
    it('회원 탈퇴 버튼이 있다.', () => {
      expect(screen.queryByText('회원탈퇴')).toBeInTheDocument();
    });
  });

  describe('회원탈퇴 버튼을 누르고  ', () => {
    it('withdrawal 메소드가 호출된다.', async () => {
      const spyOnWithdrawal = jest
        .spyOn(usersApi, 'withdrawal')
        .mockImplementation();

      const withdrawBtn = screen.getByText('회원탈퇴');
      await act(async () => fireEvent.click(withdrawBtn));

      expect(spyOnWithdrawal).toBeCalled();
    });
  });

  describe('데이터 초기화에는', () => {
    it('데이터 초기화 버튼이 있다.', () => {
      expect(screen.queryByText('데이터 초기화')).toBeInTheDocument();
    });
  });

  describe('데이터 초기화 버튼을 누르면', () => {
    it('reset 메소드가 호출된다.', async () => {
      const spyOnReset = jest
        .spyOn(todosApi, 'resetTodos')
        .mockImplementation();
      const spyOnRanking = jest
        .spyOn(rankingApi, 'resetRanking')
        .mockImplementation();
      const resetBtn = screen.getByText('데이터 초기화');
      await act(async () => {
        fireEvent.click(resetBtn);
      });
      expect(spyOnReset).toBeCalled();
      expect(spyOnRanking).toBeCalled();
    });
  });
});
