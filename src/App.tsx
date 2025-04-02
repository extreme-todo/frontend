import { useRef, useState } from 'react';
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
  const [activeLabel, setActiveLabel] = useState<
    'Welcome' | 'Main' | 'Ranking'
  >('Welcome');
  const [isLabelVisible, setIsLabelVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const welcomeRef = useRef<HTMLElement>(null);
  const mainTodoRef = useRef<HTMLElement>(null);
  const rankingRef = useRef<HTMLElement>(null);

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

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const THRESHOLD = 0.1;
    let newLabel: 'Welcome' | 'Main' | 'Ranking' | null = null;

    if (Math.abs(latest - 0) < THRESHOLD) newLabel = 'Welcome';
    else if (Math.abs(latest - 0.5) < THRESHOLD) newLabel = 'Main';
    else if (Math.abs(latest - 1) < THRESHOLD) newLabel = 'Ranking';

    if (newLabel && newLabel !== activeLabel) {
      setActiveLabel(newLabel);
      setIsLabelVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsLabelVisible(false), 1000);
    }
  });

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PomodoroProvider>
        <ExtremeModeProvider>
          <MainContainer id="main-container" ref={mainRef}>
            <nav className="navigations">
              <ul>
                <li
                  className="navigation"
                  onClick={() => scrollToSection(welcomeRef)}
                >
                  <motion.div
                    style={{
                      opacity: useTransform(
                        scrollYProgress,
                        [0, 0.3],
                        [1, 0.5],
                        { clamp: true },
                      ),
                      scale: useTransform(scrollYProgress, [0, 0.3], [1.2, 1], {
                        clamp: true,
                      }),
                    }}
                    className="navigation__dot"
                  />
                  <motion.span
                    animate={{
                      opacity:
                        activeLabel === 'Welcome' && isLabelVisible ? 1 : 0,
                      transition: { duration: 0.3 },
                    }}
                    className="navigation__label"
                  >
                    Welcome
                  </motion.span>
                </li>
                <li
                  className="navigation"
                  onClick={() => scrollToSection(mainTodoRef)}
                >
                  <motion.div
                    style={{
                      opacity: useTransform(
                        scrollYProgress,
                        [0.3, 0.5, 1],
                        [0.5, 1, 0.5],
                        { clamp: true },
                      ),
                      scale: useTransform(
                        scrollYProgress,
                        [0.3, 0.5, 1],
                        [1, 1.2, 1],
                        { clamp: true },
                      ),
                    }}
                    className="navigation__dot"
                  />
                  <motion.span
                    animate={{
                      opacity: activeLabel === 'Main' && isLabelVisible ? 1 : 0,
                      transition: { duration: 0.3 },
                    }}
                    className="navigation__label"
                  >
                    Main
                  </motion.span>
                </li>
                <li
                  className="navigation"
                  onClick={() => scrollToSection(rankingRef)}
                >
                  <motion.div
                    style={{
                      opacity: useTransform(
                        scrollYProgress,
                        [0.7, 1],
                        [0.5, 1],
                        { clamp: true },
                      ),
                      scale: useTransform(scrollYProgress, [0.7, 1], [1, 1.2], {
                        clamp: true,
                      }),
                    }}
                    className="navigation__dot"
                  />
                  <motion.span
                    animate={{
                      opacity:
                        activeLabel === 'Ranking' && isLabelVisible ? 1 : 0,
                      transition: { duration: 0.3 },
                    }}
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
              ref={welcomeRef}
            />
            <MainTodo ref={mainTodoRef} />
            <RankingAndRecords ref={rankingRef} />
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
        opacity: 0;
      }
    }
  }
`;

export default App;
