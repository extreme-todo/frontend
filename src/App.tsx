import { useMemo, useRef, useState } from 'react';

import { IconAtom } from './atoms';
import { Navigation } from './molecules';
import { MainTodo, RankingAndRecords, Welcome } from './components';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion';

import { PomodoroProvider, ExtremeModeProvider } from './hooks';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import styled from '@emotion/styled';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export type NavigationPageType = 'Welcome' | 'Main' | 'Ranking';

export interface NavigationListType {
  componentName: NavigationPageType;
  componentRef: React.RefObject<HTMLElement>;
  dotActivePos: number[];
}

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [activeLabel, setActiveLabel] = useState<NavigationPageType>('Welcome');
  const [isLabelVisible, setIsLabelVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const welcomeRef = useRef<HTMLElement>(null);
  const mainTodoRef = useRef<HTMLElement>(null);
  const rankingRef = useRef<HTMLElement>(null);

  const NAVIGATION_LIST: NavigationListType[] = useMemo(
    () => [
      {
        componentName: 'Welcome',
        componentRef: welcomeRef,
        dotActivePos: [0, 0.3],
      },
      {
        componentName: 'Main',
        componentRef: mainTodoRef,
        dotActivePos: [0.3, 0.5, 0.7],
      },
      {
        componentName: 'Ranking',
        componentRef: rankingRef,
        dotActivePos: [0.7, 1],
      },
    ],
    [welcomeRef.current, mainRef.current, rankingRef.current],
  );

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
    let newLabel: NavigationPageType | null = null;

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

  return (
    <QueryClientProvider client={queryClient}>
      <PomodoroProvider>
        <ExtremeModeProvider>
          <MainContainer id="main-container" ref={mainRef}>
            <Navigation
              navigationLists={NAVIGATION_LIST}
              scrollYProgress={scrollYProgress}
              isLabelVisible={isLabelVisible}
              activeLabel={activeLabel}
            />
            <Welcome
              buttonOpacityForScroll={buttonOpacityForScroll}
              mainLogoPathLengthForScroll={mainLogoPathLengthForScroll}
              mainLogoFillForScroll={mainLogoFillForScroll}
              ref={welcomeRef}
            />
            <MainTodo ref={mainTodoRef} />
            <RankingAndRecords ref={rankingRef} />
            <motion.div
              className="scroll__guide"
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.01], [0.5, 0], {
                  clamp: true,
                }),
              }}
            >
              <IconAtom
                src="/icon/combobox.svg"
                size={3}
                className="scroll__guide__icon"
                alt="An icon indicating to scroll down"
              />
            </motion.div>
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
      cursor: pointer;

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

  div.scroll__guide {
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
    font-size: ${({ theme: { fontSize } }) => fontSize.h3.size};
    font-weight: ${({ theme: { fontSize } }) => fontSize.h3.weight};

    img.scroll__guide__icon {
      @keyframes updown {
        0% {
          transform: translateY(10px);
          animation-timing-function: ease-in;
        }
        50% {
          transform: translateY(-10px);
          animation-timing-function: ease-out;
        }
        100% {
          transform: translateY(10px);
        }
      }
      animation: updown 1.5s infinite;
    }
  }
`;

export default App;
