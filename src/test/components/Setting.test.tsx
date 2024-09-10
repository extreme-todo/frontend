import React from 'react';
import { Setting } from '../../components';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';
import { rankingApi, timerApi, todosApi, usersApi } from '../../shared/apis';
import { ExtremeModeProvider } from '../../hooks/useExtremeMode';
import PomodoroProvider from '../../hooks/usePomodoro';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginProvider } from '../../hooks';
import { mockLocalStorage } from '../../../fixture/mockLocalStorage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('SettingModal', () => {
  beforeEach(() => {
    mockLocalStorage(
      jest.fn((key: string) => {
        if (key === 'extremeToken' || key === 'extremeEmail')
          return 'whydiditwork';
      }),
      jest.fn((key: string, data: string) => null),
      jest.fn((key: string) => null),
    );
    jest.spyOn(window, 'alert').mockImplementation();
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
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

    it('switch버튼이 ON 값을 가지고 있다.', () => {
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

  describe('switch버튼은', () => {
    it('ON이 초기값이고 누르면 OFF로 바뀐다.', () => {
      const switchBtn = screen.getByText('ON');

      fireEvent.click(switchBtn);
      expect(screen.queryByText('OFF')).toBeInTheDocument();
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
