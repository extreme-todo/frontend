import { useCallback, useEffect, useState, createContext } from 'react';
import LoginEvent from '../shared/LoginEvent';
import { IChildProps } from '../shared/interfaces';

export interface ILogin {
  isLogin: boolean;
  setToken: (token: string, email: string) => void;
  deleteToken: () => void;
}

const DEFAULT_LOGIN_CONTEXT: ILogin = {
  isLogin: false,
  setToken() {
    console.debug();
  },
  deleteToken() {
    console.debug();
  },
};

export const LoginContext = createContext<ILogin>(DEFAULT_LOGIN_CONTEXT);

const LOGINEVENT = LoginEvent.getInstance();

export const LoginProvider = ({ children }: IChildProps) => {
  const [isLogin, setIsLogin] = useState(false);

  const checkLogin = useCallback((): void => {
    const token = localStorage.getItem('extremeToken');
    const email = localStorage.getItem('extremeEmail');
    setIsLogin(token && email ? true : false);
  }, []);

  const setToken = useCallback((token: string, email: string) => {
    localStorage.setItem('extremeToken', token);
    localStorage.setItem('extremeEmail', email);
    window.dispatchEvent(LOGINEVENT.getEvent());
  }, []);

  const deleteToken = useCallback(() => {
    localStorage.removeItem('extremeToken');
    localStorage.removeItem('extremeEmail');
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
    <LoginContext.Provider value={{ isLogin, setToken, deleteToken }}>
      {children}
    </LoginContext.Provider>
  );
};
