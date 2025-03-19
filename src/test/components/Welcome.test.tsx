import React, { ReactNode } from 'react';
import { Welcome } from '../../components/index';

import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';
import { usersApi } from '../../shared/apis';

import { mockLocalStorage } from '../../../fixture/mockLocalStorage';

import {
  act,
  fireEvent,
  render,
  screen,
  logRoles,
} from '@testing-library/react';
import { LoginProvider } from '../../hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

const mockWelcome = (
  func1: jest.Mock<any, any>,
  func2?: jest.Mock<any, any>,
  func3?: jest.Mock<any, any>,
) => {
  mockLocalStorage(func1, func2, func3);
  return render(<Welcome />, { wrapper: ProviderWrapper });
};

describe('Welcome', () => {
  describe('Welcome 페이지에는', () => {
    let renderResult: ReturnType<typeof mockWelcome>;

    beforeEach(() => {
      renderResult = mockWelcome(jest.fn((key: string) => null));
    });

    it('로고가 있다.', () => {
      const { getByRole } = renderResult;

      expect(getByRole('img', { name: /logo/i })).toBeInTheDocument();
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
        const { getByText, getByRole } = renderResult;
        const spyOnLogin = jest.spyOn(usersApi, 'login').mockImplementation();
        const googleImage = getByRole('img', { name: /google_login_button/i });
        fireEvent.click(googleImage);
        expect(spyOnLogin).toBeCalled();
      });
      // describe('유저가 로그인을 했을 경우', () => {
      //   let renderResult: HTMLElement;
      //   const mockDeleteLocalStorage = jest.fn();
      //   beforeEach(() => {
      //     renderResult = mockWelcome(
      //       jest.fn((key: string) => 'extremeTokemSample'),
      //       jest.fn(),
      //       mockDeleteLocalStorage,
      //     );
      //   });
      //   it('로그아웃 버튼이 렌더링 되어야 하고,', () => {
      //     expect(renderResult).toContainElement(screen.getByText('SIGN OUT'));
      //   });
      //   it('클릭하면 removeItem을 호출한다.', () => {
      //     const logoutBtn = screen.getByText('SIGN OUT');
      //     fireEvent.click(logoutBtn);
      //     expect(mockDeleteLocalStorage).toBeCalled();
      //   });
      //   it('셋팅 버튼이 렌더링 되어야 하고,', () => {
      //     expect(renderResult).toContainElement(screen.getByText('SETTING'));
      //   });
      //   it('클릭하면 셋팅 모달을 띄워준다.', () => {
      //     const settingBtn = screen.getByText('SETTING');
      //     fireEvent.click(settingBtn);
      //     act(() => {
      //       const settingTitle = screen.getByText('설정');
      //       expect(settingTitle).toBeInTheDocument();
      //     });
      //   });
    });

    describe('유저가 로그인을 한 경우', () => {
      it('로그아웃 버튼이 렌더링 되어야 하고', () => {});
      it('설정 버튼이 렌더링 되어야 한다.', () => {});
    });
    describe('설정 버튼을 누르면', () => {
      it('데이터 초기화 버튼이 렌더링 되어야 하고', () => {});
      it('회원 탈퇴 버튼이 렌더링 되어야 한다.', () => {});
      it('데이터 초기화 버튼을 누르면 removeItem을 호출한다.', () => {});
      it('회원 탈퇴 버튼을 누르면 withdrawal을 호출한다.', () => {});
    });
  });
});

/* TODO 로그인 로직 자체는 e2e테스트로 작성을 해야 한다.
[ ]context
  로그인 이미지를 누면 
it
  로그인 url로 넘어간다 or 갔다가 뭘 받아온다
[ ] context
  로그인 과정에서 에러가 발생한다면
it
  에러 메시지를 출력해준다.
*/
