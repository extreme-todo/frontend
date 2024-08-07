import { MainTodo, RankingAndRecords, Welcome } from './components';
import styled from '@emotion/styled';
import PomodoroProvider from './hooks/usePomodoro';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ExtremeModeProvider } from './hooks/useExtremeMode';
import 'react-day-picker/dist/style.css';
import './styles/customPickerStyle.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PomodoroProvider>
        <ExtremeModeProvider>
          <MainContainer id="main-container">
            <Welcome />
            <MainTodo />
            <RankingAndRecords />
          </MainContainer>
        </ExtremeModeProvider>
      </PomodoroProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

const MainContainer = styled.div`
  width: 100dvw;
  height: 100dvh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  & > div {
    scroll-snap-align: center;
  }
`;

export default App;
