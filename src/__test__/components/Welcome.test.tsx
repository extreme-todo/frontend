import { act } from 'react';
import { Welcome } from '../../components';

import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';
import { timerApi, todosApi, usersApi } from '../../shared/apis';

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

const ProviderWrapper = ({ children }: { children: React.ReactNode }) => {
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
  useMotionValue: jest.fn().mockImplementation(() => ({
    get: () => 1,
    set: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    stop: jest.fn(),
    current: 1,
  })),
}));

jest.mock('../../shared/apis');

const renderWelcome = () => {
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
    beforeEach(() => {
      (usersApi.getMe as jest.Mock).mockRejectedValue(
        new Error('Unauthorized'),
      );
    });

    it('로고가 있다.', async () => {
      const { container } = renderWelcome();
      await waitFor(() => {
        expect(container.querySelector('#logo')).toBeInTheDocument();
      });
    });

    describe('유저가 로그인을 하지 않은 경우', () => {
      it('구글 소셜 로그인 버튼이 있다.', async () => {
        const { getByText, getByRole } = renderWelcome();
        await waitFor(() => {
          expect(getByText('Sign in with')).toBeInTheDocument();
        });
        expect(
          getByRole('img', { name: /google_login_button/i }),
        ).toBeInTheDocument();
      });
      it('구글 소셜 버튼을 누르면 로그인 api가 호출된다.', async () => {
        const { getByRole, findByRole } = renderWelcome();
        const spyOnLogin = (usersApi.login as jest.Mock).mockImplementation();
        const googleImage = await findByRole('img', {
          name: /google_login_button/i,
        });
        fireEvent.click(googleImage);
        expect(spyOnLogin).toHaveBeenCalled();
      });
    });

    describe('유저가 로그인을 한 경우', () => {
      beforeEach(() => {
        (usersApi.getMe as jest.Mock).mockResolvedValue({
          data: { email: 'test@test.com' },
        });
      });

      it('로그아웃 버튼이 렌더링 되어야 하고', async () => {
        const { getByRole } = renderWelcome();
        await waitFor(() => {
          expect(getByRole('button', { name: /logout/i })).toBeInTheDocument();
        });
      });
      it('설정 버튼이 렌더링 되어야 한다.', async () => {
        const { getByRole } = renderWelcome();
        await waitFor(() => {
          expect(getByRole('button', { name: /setting/i })).toBeInTheDocument();
        });
      });
      it('로그아웃 버튼을 누르면 구글 로그인 버튼이 다시 렌더링 된다.', async () => {
        const { getByRole, getByText, findByRole } = renderWelcome();
        const logout = await findByRole('button', { name: /logout/i });
        fireEvent.click(logout);
        await waitFor(() => {
          expect(getByText('Sign in with')).toBeInTheDocument();
        });
      });
    });

    describe('설정 버튼을 누르면', () => {
      beforeEach(() => {
        (usersApi.getMe as jest.Mock).mockResolvedValue({
          data: { email: 'test@test.com' },
        });
      });

      it('데이터 초기화 버튼이 렌더링 되어야 하고', async () => {
        const { findByRole } = renderWelcome();
        const setting = await findByRole('button', { name: /setting/ });
        act(() => {
          fireEvent.click(setting);
        });
        const resetBtn = await findByRole('button', { name: /reset/i });
        expect(resetBtn).toBeInTheDocument();
      });

      it('회원 탈퇴 버튼이 렌더링 되어야 한다.', async () => {
        const { findByRole } = renderWelcome();
        const setting = await findByRole('button', { name: /setting/ });
        act(() => {
          fireEvent.click(setting);
        });
        const withdrawBtn = await findByRole('button', { name: /withdraw/i });
        expect(withdrawBtn).toBeInTheDocument();
      });

      it('데이터 초기화 버튼을 누르면 resetTodos와 resetRanking API를 호출한다.', async () => {
        const { findByRole } = renderWelcome();
        jest.spyOn(window, 'alert').mockImplementation();
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        const setting = await findByRole('button', { name: /setting/ });
        act(() => {
          fireEvent.click(setting);
        });

        const reset = await findByRole('button', { name: /reset/i });
        (todosApi.resetTodos as jest.Mock).mockImplementation();
        (timerApi.resetRecords as jest.Mock).mockImplementation();

        act(() => {
          fireEvent.click(reset);
        });

        await waitFor(() => {
          expect(todosApi.resetTodos).toHaveBeenCalled();
          expect(timerApi.resetRecords).toHaveBeenCalled();
        });
      });

      it('회원 탈퇴 버튼을 누르면 withdrawal을 호출한다.', async () => {
        (usersApi.withdrawal as jest.Mock).mockImplementation(() =>
          Promise.resolve(),
        );
        jest.spyOn(window, 'alert').mockImplementation();
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        const { findByRole } = renderWelcome();
        const setting = await findByRole('button', { name: /setting/ });
        act(() => {
          fireEvent.click(setting);
        });

        const withdraw = await findByRole('button', { name: /withdraw/i });
        act(() => {
          fireEvent.click(withdraw);
        });

        await waitFor(() => {
          expect(usersApi.withdrawal).toHaveBeenCalled();
        });
      });

      it('X 아이콘을 누르면 뒤로 간다.', async () => {
        const { getByRole, queryByRole, findByRole } = renderWelcome();
        const setting = await findByRole('button', { name: /setting/ });
        act(() => {
          fireEvent.click(setting);
        });

        const xButton = await findByRole('button', { name: 'goback' });
        fireEvent.click(xButton);

        await waitFor(() => {
          expect(
            queryByRole('button', { name: 'goback' }),
          ).not.toBeInTheDocument();
        });
        expect(getByRole('button', { name: 'setting' })).toBeInTheDocument();
      });
    });
  });
});
