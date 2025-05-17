import { act } from 'react';
import { Welcome } from '../../components';

import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';
import { timerApi, todosApi, usersApi } from '../../shared/apis';

import { mockLocalStorage } from '../../../fixture/mockLocalStorage';

import { fireEvent, render, waitFor } from '@testing-library/react';
import { LoginProvider } from '../../hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMotionValue } from 'framer-motion';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const ProviderWrapper = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={designTheme}>
        <LoginProvider>{children}</LoginProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

jest.mock('framer-motion', () => ({
  ...jest.requireActual('../../__mocks__/framerMotion.tsx'),
  useMotionValue: jest.fn().mockImplementation((initial) => ({
    get: () => 1,
    set: jest.fn(),
    on: jest.fn(), // 이벤트 리스너 추가
    off: jest.fn(),
    stop: jest.fn(),
    current: 1,
  })),
}));

const mockWelcome = (
  func1: jest.Mock<any, any>,
  func2?: jest.Mock<any, any>,
  func3?: jest.Mock<any, any>,
) => {
  mockLocalStorage(func1, func2, func3);
  const mockButtonOpacityForScroll = useMotionValue(1);
  const mockMainLogoPathLengthForScroll = useMotionValue(1);
  const mockMainLogoFillForScroll = useMotionValue('black');
  return render(
    <Welcome
      buttonOpacityForScroll={mockButtonOpacityForScroll}
      mainLogoPathLengthForScroll={mockMainLogoPathLengthForScroll}
      mainLogoFillForScroll={mockMainLogoFillForScroll}
    />,
    { wrapper: ProviderWrapper },
  );
};

describe('Welcome', () => {
  describe('Welcome 페이지에는', () => {
    let renderResult: ReturnType<typeof mockWelcome>;

    beforeEach(() => {
      renderResult = mockWelcome(jest.fn((key: string) => null));
    });

    it('로고가 있다.', () => {
      const { container } = renderResult;
      waitFor(() =>
        expect(container.querySelector('#logo')).toBeInTheDocument(),
      );
    });
    describe('유저가 로그인을 하지 않은 경우', () => {
      it('구글 소셜 로그인 버튼이 있다.', () => {
        const { getByText, getByRole } = renderResult;
        expect(getByText('Sign in with')).toBeInTheDocument();
        expect(
          getByRole('img', { name: /google_login_button/i }),
        ).toBeInTheDocument();
      });
      it('구글 소셜 버튼을 누르면 로그인 api가 호출된다.', () => {
        const { getByRole } = renderResult;
        const spyOnLogin = jest.spyOn(usersApi, 'login').mockImplementation();
        const googleImage = getByRole('img', { name: /google_login_button/i });
        fireEvent.click(googleImage);
        expect(spyOnLogin).toHaveBeenCalled();
      });
    });

    describe('유저가 로그인을 한 경우', () => {
      const mockDeleteLocalstorage = jest.fn();
      beforeEach(() => {
        renderResult = mockWelcome(
          jest.fn((key: string) => 'token_something'),
          jest.fn(),
          mockDeleteLocalstorage,
        );
      });
      it('로그아웃 버튼이 렌더링 되어야 하고', () => {
        const { getByRole } = renderResult;
        expect(getByRole('button', { name: /logout/i })).toBeInTheDocument();
      });
      it('설정 버튼이 렌더링 되어야 한다.', () => {
        const { getByRole } = renderResult;
        expect(getByRole('button', { name: /setting/i })).toBeInTheDocument();
      });
      it('로그아웃 버튼을 누르면 localStorage의 토큰과 사용자 정보가 제거된다.', () => {
        const { getByRole } = renderResult;
        const logout = getByRole('button', { name: /logout/i });
        fireEvent.click(logout);
        expect(mockDeleteLocalstorage).toHaveBeenCalledTimes(2);
      });
    });

    describe('설정 버튼을 누르면', () => {
      const mockDeleteLocalstorage = jest.fn();
      beforeEach(async () => {
        renderResult = mockWelcome(
          jest.fn((key: string) => 'token_something'),
          jest.fn(),
          mockDeleteLocalstorage,
        );
        const setting = renderResult.getByRole('button', { name: /setting/ });
        await act(() => fireEvent.click(setting));
      });
      it('데이터 초기화 버튼이 렌더링 되어야 하고', () => {
        const { getByRole } = renderResult;
        expect(getByRole('button', { name: /reset/i })).toBeInTheDocument();
      });
      it('회원 탈퇴 버튼이 렌더링 되어야 한다.', () => {
        const { getByRole } = renderResult;
        expect(getByRole('button', { name: /withdraw/i })).toBeInTheDocument();
      });
      it('데이터 초기화 버튼을 누르면 resetTodos와 resetRanking API를 호출한다.', async () => {
        const { getByRole } = renderResult;
        jest.spyOn(window, 'alert').mockImplementation();
        jest.spyOn(window, 'confirm').mockImplementation(() => true);
        const reset = getByRole('button', { name: /reset/i });
        const mockResetTodos = jest
          .spyOn(todosApi, 'resetTodos')
          .mockImplementation();
        const mockResetRanking = jest
          .spyOn(timerApi, 'resetRecords')
          .mockImplementation();
        await act(() => fireEvent.click(reset));
        expect(mockResetTodos).toHaveBeenCalled();
        expect(mockResetRanking).toHaveBeenCalled();
      });
      it('회원 탈퇴 버튼을 누르면 withdrawal을 호출한다.', async () => {
        const mockConfirm = jest
          .spyOn(usersApi, 'withdrawal')
          .mockImplementation(() => Promise.resolve());
        jest.spyOn(window, 'alert').mockImplementation();
        jest.spyOn(window, 'confirm').mockImplementation(() => true);
        const { getByRole } = renderResult;
        const withdraw = getByRole('button', { name: /withdraw/i });
        await act(() => fireEvent.click(withdraw));
        expect(mockConfirm).toHaveBeenCalled();
      });
      it('X 아이콘을 누르면 뒤로 간다.', () => {
        const { getByRole } = renderResult;
        const xButton = getByRole('button', { name: 'goback' });
        fireEvent.click(xButton);
        const setting = getByRole('button', { name: 'setting' });
        expect(xButton).not.toBeInTheDocument();
        expect(setting).toBeInTheDocument();
      });
    });
  });
});
