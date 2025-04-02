import { useRef } from 'react';
import { MainTodo, RankingAndRecords, Welcome } from './components';
import styled from '@emotion/styled';
import PomodoroProvider from './hooks/usePomodoro';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ExtremeModeProvider } from './hooks/useExtremeMode';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion';

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
            <nav className="navigations">
              <ul>
                <li
                  className="navigation"
                >
                  <motion.div
                    className="navigation__dot"
                  />
                  <motion.span
                    className="navigation__label"
                  >
                    Welcome
                  </motion.span>
                </li>
                <li
                  className="navigation"
                >
                  <motion.div
                    className="navigation__dot"
                  />
                  <motion.span
                    className="navigation__label"
                  >
                    Main
                  </motion.span>
                </li>
                <li
                  className="navigation"
                >
                  <motion.div
                    className="navigation__dot"
                  />
                  <motion.span
                    className="navigation__label"
                  >
                    Ranking
                  </motion.span>
                </li>
              </ul>
            </nav>
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
  & > main {
    scroll-snap-align: center;
  }

  nav.navigations {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 2%;
    z-index: 10;
    li.navigation {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;

      div.navigation__dot {
        width: 0.35rem;
        height: 0.35rem;
        border-radius: 50%;
        margin-right: 0.5rem;
        background-color: ${({
          theme: {
            color: { backgroundColor },
          },
        }) => backgroundColor.white};
      }
      span.navigation__label {
        color: ${({
          theme: {
            color: { fontColor },
          },
        }) => fontColor.white};
        font-size: ${({ theme: { fontSize } }) => fontSize.b2.size};
        font-weight: ${({ theme: { fontSize } }) => fontSize.b2.weight};
      }
    }
  }
`;

export default App;
