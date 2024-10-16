import React, { useContext } from 'react';
import { render } from '@testing-library/react';
import { userStub } from '../../../stubs';
import { LoginContext, LoginProvider } from '../../hooks';
import { mockLocalStorage } from '../../../fixture/mockLocalStorage';
import userEvent from '@testing-library/user-event';
import {
  EXTREME_EMAIL_STORAGE,
  EXTREME_TOKEN_STORAGE,
} from '../../shared/apis';

describe('useCheckLogin', () => {
  const TestLoginComponent = () => {
    const { isLogin, deleteToken } = useContext(LoginContext);
    const user = userStub();
    return (
      <>
        <p aria-label="isLogin">{isLogin.toString()}</p>
        <button aria-label="loginBtn">로그인</button>
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
          if (key === EXTREME_TOKEN_STORAGE) return userStub().access;
          else if (key === EXTREME_EMAIL_STORAGE) return userStub().email;
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
