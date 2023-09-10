import { MainTodo, RankingAndRecords, TodoListModal } from './components';
import { useEffect } from 'react';
import Welcome from './components/Welcome';
import useCheckLogin, { setToken } from './hooks/useCheckLogin';
import styled from '@emotion/styled';
import PomodoroProvider from './hooks/usePomodoro';

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
    <MainContainer>
      <Welcome />
      <PomodoroProvider>
        <MainTodo isLogin={isLogin} />
      </PomodoroProvider>
      <RankingAndRecords isLogin={isLogin} />
      <TodoListModal />
    </MainContainer>
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
