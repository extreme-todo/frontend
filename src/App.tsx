import { useEffect } from 'react';

import {
  MainTodo,
  RankingAndRecords,
  TodoListModal,
  Welcome,
} from './components';
import useCheckLogin, { setToken } from './hooks/useCheckLogin';

import styled from '@emotion/styled';
import PomodoroProvider from './hooks/usePomodoro';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
  const isLogin = useCheckLogin();
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
    <QueryClientProvider client={queryClient}>
      <MainContainer>
        <Welcome />
        <MainTodo isLogin={isLogin} />
        <RankingAndRecords isLogin={isLogin} />
        <TodoListModal />
      </MainContainer>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
`;

export default App;
