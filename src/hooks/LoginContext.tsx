import { useCallback, useEffect, useState, createContext } from 'react';
import LoginEvent from '../shared/LoginEvent';
import { IChildProps } from '../shared/interfaces';
import { EXTREME_EMAIL_STORAGE, EXTREME_TOKEN_STORAGE } from '../shared/apis';

export interface ILogin {
  isLogin: boolean;
  deleteToken: () => void;
}

const DEFAULT_LOGIN_CONTEXT: ILogin = {
  isLogin: false,
  deleteToken() {
    console.debug();
  },
};

export const LoginContext = createContext<ILogin>(DEFAULT_LOGIN_CONTEXT);

const LOGINEVENT = LoginEvent.getInstance();

export const LoginProvider = ({ children }: IChildProps) => {
  const [isLogin, setIsLogin] = useState(false);

  const checkLogin = useCallback((): void => {
    const token = localStorage.getItem(EXTREME_TOKEN_STORAGE);
    const email = localStorage.getItem(EXTREME_EMAIL_STORAGE);
    setIsLogin(token && email ? true : false);
  }, []);

  const setToken = useCallback((token: string, email: string) => {
    localStorage.setItem(EXTREME_TOKEN_STORAGE, token);
    localStorage.setItem(EXTREME_EMAIL_STORAGE, email);
    window.dispatchEvent(LOGINEVENT.getEvent());
  }, []);

  const deleteToken = useCallback(() => {
    localStorage.removeItem(EXTREME_TOKEN_STORAGE);
    localStorage.removeItem(EXTREME_EMAIL_STORAGE);
    window.dispatchEvent(LOGINEVENT.getEvent());
  }, []);

  useEffect(() => {
    checkLogin();
    window.addEventListener('loginevent', checkLogin);
    return () => window.removeEventListener('loginevent', checkLogin);
  }, []);

  useEffect(() => {
    const pathname = window.location.pathname;
    if (Object.is(pathname, '/oauth')) {
      const query = window.location.search;
      const clientURL = new URLSearchParams(query);

      const userinfo = {
        email: clientURL.get('email'),
        username: clientURL.get('username'),
        extremeToken: clientURL.get('token'),
      };

      if (userinfo.extremeToken && userinfo.email) {
        setToken(userinfo.extremeToken, userinfo.email);
        history.replaceState('', '', process.env.REACT_APP_API_CLIENT_URL);
      }
    }
  }, []);

  return (
    <LoginContext.Provider value={{ isLogin, deleteToken }}>
      {children}
    </LoginContext.Provider>
  );
};
