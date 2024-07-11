import React, { useContext } from 'react';
import { render } from '@testing-library/react';
import { userStub } from '../../../stubs';
import { LoginContext, LoginProvider } from '../../hooks';
import { mockLocalStorage } from '../../../fixture/mockLocalStorage';
import userEvent from '@testing-library/user-event';

describe('useCheckLogin', () => {
  const TestLoginComponent = () => {
    const { isLogin, deleteToken, setToken } = useContext(LoginContext);
    const user = userStub();
    return (
      <>
        <p aria-label="isLogin">{isLogin.toString()}</p>
        <button
          aria-label="loginBtn"
          onClick={() => setToken(user.access, user.email)}
        >
          로그인
        </button>
        <button aria-label="logoutBtn" onClick={() => deleteToken()}>
          로그아웃
        </button>
      </>
    );
  };
  const renderFn = () =>
    render(
      <LoginProvider>
        <TestLoginComponent />
      </LoginProvider>,
    );

  describe('isLogin은', () => {
    it('localstorage에 토큰과 유저 정보가 있을 때 true이다.', () => {
      mockLocalStorage(
        jest.fn((key: string) => {
          if (key === 'extremeToken') return userStub().access;
          else if (key === 'extremeEmail') return userStub().email;
          else return null;
        }),
      );

      const { getByLabelText } = renderFn();
      const isLogin = getByLabelText('isLogin');

      expect(isLogin.textContent).toBe('true');
    });
    it('localstorage에 토큰과 유저 정보가 없을 때 false이다.', () => {
      mockLocalStorage(jest.fn((key: string) => {}));

      const { getByLabelText } = renderFn();
      const isLogin = getByLabelText('isLogin');

      expect(isLogin.textContent).toBe('false');
    });
  });

  describe('setToken은', () => {
    it('토큰과 사용자 정보를 로컬 스토리지에 저장한다', () => {
      const mockSetLocalStorage = jest.fn();
      mockLocalStorage(jest.fn(), mockSetLocalStorage);

      const { getByRole } = renderFn();
      const loginBtn = getByRole('button', { name: 'loginBtn' });

      userEvent.click(loginBtn);

      // 로그인 버튼을 누르면 토큰과 유저정보 저장을 위해
      // setItem을 두 번 호출하는 것으로 테스트
      expect(mockSetLocalStorage).toBeCalledTimes(2);
    });
  });

  describe('deleteToken은', () => {
    it('토큰과 사용자 정보를 로컬 스토리지에서 삭제한다.', () => {
      const mockDeleteLocalStorage = jest.fn();
      mockLocalStorage(jest.fn(), jest.fn(), mockDeleteLocalStorage);

      const { getByRole } = renderFn();
      const logoutBtn = getByRole('button', { name: 'logoutBtn' });

      userEvent.click(logoutBtn);

      expect(mockDeleteLocalStorage).toBeCalledTimes(2);
    });
  });
});
