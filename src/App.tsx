import { useRef } from 'react';
import { MainTodo, RankingAndRecords, Welcome } from './components';
import styled from '@emotion/styled';
import PomodoroProvider from './hooks/usePomodoro';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ExtremeModeProvider } from './hooks/useExtremeMode';
import { useMotionValueEvent, useScroll, useTransform } from 'framer-motion';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function App() {
  const mainRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: mainRef,
  });
  const buttonOpacityForScroll = useTransform(
    scrollYProgress,
    [0, 0.01],
    [1, 0],
    {
      clamp: true,
    },
  );
  const mainLogoPathLengthForScroll = useTransform(
    scrollYProgress,
    [0, 0.05, 0.2],
    [1, 1, 0],
    {
      clamp: true,
    },
  );
  const mainLogoFillForScroll = useTransform(
    scrollYProgress,
    [0, 0.03],
    ['#523ea1', '#523ea10'],
    {
      clamp: true,
    },
  );

  useMotionValueEvent(mainLogoFillForScroll, 'change', (scrollYProgress) => {
    console.log('scrollYProgress Page scroll: ', scrollYProgress);
  });

  return (
    <QueryClientProvider client={queryClient}>
      <PomodoroProvider>
        <ExtremeModeProvider>
          <MainContainer id="main-container" ref={mainRef}>
            <Welcome
              buttonOpacityForScroll={buttonOpacityForScroll}
              mainLogoPathLengthForScroll={mainLogoPathLengthForScroll}
              mainLogoFillForScroll={mainLogoFillForScroll}
            />
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
