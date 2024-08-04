import { useEffect, useState } from 'react';
import LoginEvent from '../shared/LoginEvent';

const LOGINEVENT = LoginEvent.getInstance();

export const setToken = (token: string, email: string) => {
  localStorage.setItem('extremeToken', token);
  localStorage.setItem('extremeEmail', email);
  window.dispatchEvent(LOGINEVENT.getEvent());
};

const useCheckLogin = (): boolean => {
  const [isLogin, setIsLogin] = useState(false);

  const handleToken = (): void => {
    const token = localStorage.getItem('extremeToken');
    const email = localStorage.getItem('extremeEmail');
    setIsLogin(token && email ? true : false);
  };

  useEffect(() => {
    handleToken();
    window.addEventListener('loginevent', handleToken);
    return () => window.removeEventListener('loginevent', handleToken);
  }, []);

  return isLogin;
};

export default useCheckLogin;
