import { useCallback, useState, createContext, useLayoutEffect } from 'react';
import { IChildProps } from '../shared/interfaces';
import { usersApi } from '../shared/apis';

export interface ILogin {
  isLogin: boolean;
  deleteToken: () => Promise<void>;
}

const DEFAULT_LOGIN_CONTEXT: ILogin = {
  isLogin: false,
  deleteToken() {
    return Promise.resolve();
  },
};

export const LoginContext = createContext<ILogin>(DEFAULT_LOGIN_CONTEXT);

export const LoginProvider = ({ children }: IChildProps) => {
  const [isLogin, setIsLogin] = useState(false);

  const checkLogin = useCallback(async (): Promise<void> => {
    try {
      await usersApi.getMe();
      setIsLogin(true);
    } catch (e) {
      setIsLogin(false);
    }
  }, []);

  const deleteToken = useCallback(async (): Promise<void> => {
    try {
      await usersApi.logout();
      setIsLogin(false);
    } catch (e) {
      setIsLogin(true);
    }
  }, []);

  useLayoutEffect(() => {
    void checkLogin();
  }, [checkLogin]);

  return (
    <LoginContext.Provider value={{ isLogin, deleteToken }}>
      {children}
    </LoginContext.Provider>
  );
};
