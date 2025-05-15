import { NavigationListType, NavigationPageType } from '../App';
import { ListAtom } from '../atoms';
import { MotionValue, useTransform } from 'framer-motion';

interface INavigationProps {
  navigationLists: NavigationListType[];
  scrollYProgress: MotionValue<number>;
  isLabelVisible: boolean;
  activeLabel: NavigationPageType;
}

const NORMAL_OPACITY = 0.5;
const NORMAL_SIZE = 1;
const ACTIVE_OPACITY = 1;
const ACTIVE_SIZE = 1.2;

const START_OPACITY = [NORMAL_SIZE, NORMAL_OPACITY];
const MIDDLE_OPACITY = [NORMAL_OPACITY, NORMAL_SIZE, NORMAL_OPACITY];
const END_OPACITY = [NORMAL_OPACITY, NORMAL_SIZE];

const START_SIZE = [ACTIVE_SIZE, ACTIVE_OPACITY];
const MIDDLE_SIZE = [ACTIVE_OPACITY, ACTIVE_SIZE, ACTIVE_OPACITY];
const END_SIZE = [ACTIVE_OPACITY, ACTIVE_SIZE];

const Navigation = ({
  navigationLists,
  scrollYProgress,
  isLabelVisible,
  activeLabel,
}: INavigationProps) => {
  return (
    <nav className="navigations">
      <ul>
        {navigationLists.map((list, idx, arr) => {
          return (
            <ListAtom
              key={idx}
              handleClick={() => {
                list.componentRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }}
              dotOpacity={useTransform(
                scrollYProgress,
                list.dotActivePos,
                idx === 0
                  ? START_OPACITY
                  : idx === arr.length - 1
                  ? END_OPACITY
                  : MIDDLE_OPACITY,
                {
                  clamp: true,
                },
              )}
              dotScale={useTransform(
                scrollYProgress,
                list.dotActivePos,
                idx === 0
                  ? START_SIZE
                  : idx === arr.length - 1
                  ? END_SIZE
                  : MIDDLE_SIZE,
                {
                  clamp: true,
                },
              )}
              labelOpacity={
                list.componentName === activeLabel && isLabelVisible ? 1 : 0
              }
            >
              {list.componentName}
            </ListAtom>
          );
        })}
      </ul>
    </nav>
  );
};

export { Navigation };
