import React, { useContext } from 'react';
import { render, waitFor, act } from '@testing-library/react';
import { LoginContext, LoginProvider } from '../../hooks';
import userEvent from '@testing-library/user-event';
import { usersApi } from '../../shared/apis';

jest.mock('../../shared/apis');

describe('LoginContext', () => {
  const TestLoginComponent = () => {
    const { isLogin, deleteToken } = useContext(LoginContext);
    return (
      <>
        <p aria-label="isLogin">{isLogin.toString()}</p>
        <button
          aria-label="logoutBtn"
          onClick={() => {
            void deleteToken();
          }}
        >
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
    it('usersApi.getMe가 성공하면 true이다.', async () => {
      (usersApi.getMe as jest.Mock).mockResolvedValue({
        data: { email: 'test@test.com' },
      });

      const { getByLabelText } = renderFn();

      await waitFor(() => {
        expect(getByLabelText('isLogin')).toHaveTextContent('true');
      });
    });

    it('usersApi.getMe가 실패하면 false이다.', async () => {
      (usersApi.getMe as jest.Mock).mockRejectedValue(
        new Error('Unauthorized'),
      );

      const { getByLabelText } = renderFn();

      await waitFor(() => {
        expect(getByLabelText('isLogin')).toHaveTextContent('false');
      });
    });
  });

  describe('deleteToken은', () => {
    it('isLogin 상태를 false로 변경한다.', async () => {
      (usersApi.getMe as jest.Mock).mockResolvedValue({
        data: { email: 'test@test.com' },
      });

      const { getByLabelText, getByRole } = renderFn();

      await waitFor(() => {
        expect(getByLabelText('isLogin')).toHaveTextContent('true');
      });

      const logoutBtn = getByRole('button', { name: 'logoutBtn' });
      act(() => {
        userEvent.click(logoutBtn);
      });

      await waitFor(() => {
        expect(getByLabelText('isLogin')).toHaveTextContent('false');
      });
    });
  });
});
