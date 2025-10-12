import styled from '@emotion/styled';
import { useIsMobile } from '../hooks';

const TodoProgressBarContainer = styled('div', {
  shouldForwardProp: (prop) => !['progress', 'type'].includes(prop as string),
})<{
  progress: number;
  type: 'primary1' | 'primary2' | 'extreme1' | 'extreme2';
}>`
  width: 100%;
  height: 90%;
  pointer-events: none;
  position: relative;

  #progress-bar-background {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
    > path {
      stroke: ${({ theme, type }) =>
        type !== 'primary2' && type !== 'extreme2'
          ? theme.color.backgroundColor.primary1
          : theme.color.backgroundColor.primary2};
      stroke-width: 12px;
      stroke-linecap: round;
      fill: none;
    }
  }
  #progress-bar-ticks {
    position: absolute;
    top: 2rem;
    left: 50%;
    transform: translateX(-50%);
    width: 92.75%;
    height: 89.58%;
  }
  #progress-bar-foreground {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
    > path {
      stroke: ${({ theme }) => theme.color.backgroundColor.extreme_orange};
      stroke-width: 12px;
      stroke-linecap: round;
      stroke-dasharray: ${(props) => `${props.progress} 100`};
      stroke-dashoffset: 0;
      transition: stroke-dasharray 0.2s ease-in-out;
    }
  }

  .background {
    fill: ${({ theme, type }) => {
      switch (type) {
        case 'primary1':
          return theme.color.backgroundColor.primary1;
        case 'primary2':
          return theme.color.backgroundColor.primary2;
        case 'extreme1':
          return theme.color.backgroundColor.extreme_dark;
        case 'extreme2':
          return theme.color.backgroundColor.extreme_orange;
      }
    }};
  }

  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    width: 100%;
    #progress-bar-background,
    #progress-bar-foreground {
      > path {
        stroke-width: 0.5rem;
      }
    }
    #progress-bar-ticks {
      top: 1.25rem;
    }
  }
`;

export const TodoProgressBarAtom = (props: {
  progress: number;
  type: 'primary1' | 'primary2' | 'extreme1' | 'extreme2';
  children?: React.ReactNode;
}) => {
  const isMobile = useIsMobile();
  return (
    <TodoProgressBarContainer progress={props.progress} type={props.type}>
      {isMobile ? (
        <svg
          id="progress-bar-background"
          className="background"
          width="316"
          height="78"
          viewBox="0 0 316 78"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            pathLength={100}
            d="M4 74C41.398 31.1059 96.4445 4 157.822 4C219.297 4 274.421 31.192 311.822 74.2044"
          />
        </svg>
      ) : (
        <svg
          id="progress-bar-background"
          className="background"
          width="732"
          height="144"
          viewBox="0 0 732 144"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            pathLength={100}
            d="M6 135.058C103.14 54.457 227.911 6 364 6C502.015 6 628.389 55.8384 726.108 138.5"
          />
        </svg>
      )}
      {isMobile ? (
        <svg
          id="progress-bar-foreground"
          className="foreground"
          width="316"
          height="78"
          viewBox="0 0 316 78"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            pathLength={100}
            d="M4 74C41.398 31.1059 96.4445 4 157.822 4C219.297 4 274.421 31.192 311.822 74.2044"
          />
        </svg>
      ) : (
        <svg
          id="progress-bar-foreground"
          className="foreground"
          width="732"
          height="144"
          viewBox="0 0 732 144"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            pathLength={100}
            d="M6 135.058C103.14 54.457 227.911 6 364 6C502.015 6 628.389 55.8384 726.108 138.5"
          />
        </svg>
      )}
      {isMobile ? (
        <svg
          id="progress-bar-ticks"
          className="background"
          width="277"
          height="67"
          viewBox="0 0 277 67"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="137.002" width="3" height="6" rx="1.5" />
          <rect
            x="156.324"
            y="0.859375"
            width="3"
            height="6"
            rx="1.5"
            transform="rotate(6 156.324 0.859375)"
          />
          <rect
            x="175.451"
            y="3.7334"
            width="3"
            height="6"
            rx="1.5"
            transform="rotate(12 175.451 3.7334)"
          />
          <rect
            x="194.172"
            y="8.5918"
            width="3"
            height="6"
            rx="1.5"
            transform="rotate(18 194.172 8.5918)"
          />
          <rect
            x="212.283"
            y="15.3799"
            width="3"
            height="6"
            rx="1.5"
            transform="rotate(24 212.283 15.3799)"
          />
          <rect
            x="229.586"
            y="24.0244"
            width="3"
            height="6"
            rx="1.5"
            transform="rotate(30 229.586 24.0244)"
          />
          <rect
            x="245.891"
            y="34.4297"
            width="3"
            height="6"
            rx="1.5"
            transform="rotate(36 245.891 34.4297)"
          />
          <rect
            x="261.018"
            y="46.4824"
            width="3"
            height="6"
            rx="1.5"
            transform="rotate(42 261.018 46.4824)"
          />
          <rect
            x="274.801"
            y="60.0508"
            width="3"
            height="6"
            rx="1.5"
            transform="rotate(48 274.801 60.0508)"
          />
          <rect
            width="3"
            height="6"
            rx="1.5"
            transform="matrix(-1 0 0 1 139.809 0)"
          />
          <rect
            width="3"
            height="6"
            rx="1.5"
            transform="matrix(-0.994522 0.104528 0.104528 0.994522 120.486 0.859375)"
          />
          <rect
            width="3"
            height="6"
            rx="1.5"
            transform="matrix(-0.978148 0.207912 0.207912 0.978148 101.359 3.7334)"
          />
          <rect
            width="3"
            height="6"
            rx="1.5"
            transform="matrix(-0.951057 0.309017 0.309017 0.951057 82.6387 8.5918)"
          />
          <rect
            width="3"
            height="6"
            rx="1.5"
            transform="matrix(-0.913545 0.406737 0.406737 0.913545 64.5273 15.3799)"
          />
          <rect
            width="3"
            height="6"
            rx="1.5"
            transform="matrix(-0.866025 0.5 0.5 0.866025 47.2246 24.0244)"
          />
          <rect
            width="3"
            height="6"
            rx="1.5"
            transform="matrix(-0.809017 0.587785 0.587785 0.809017 30.9199 34.4297)"
          />
          <rect
            width="3"
            height="6"
            rx="1.5"
            transform="matrix(-0.743145 0.669131 0.669131 0.743145 15.793 46.4824)"
          />
          <rect
            width="3"
            height="6"
            rx="1.5"
            transform="matrix(-0.669131 0.743145 0.743145 0.669131 2.00977 60.0508)"
          />
        </svg>
      ) : (
        <svg
          id="progress-bar-ticks"
          className="background"
          width="679"
          height="129"
          viewBox="0 0 679 129"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="337" width="4" height="8" rx="2" />
          <rect
            x="370.254"
            y="0.882812"
            width="4"
            height="8"
            rx="2"
            transform="rotate(3.59027 370.254 0.882812)"
          />
          <rect
            x="403.387"
            y="3.84668"
            width="4"
            height="8"
            rx="2"
            transform="rotate(7.18054 403.387 3.84668)"
          />
          <rect
            x="436.27"
            y="8.87891"
            width="4"
            height="8"
            rx="2"
            transform="rotate(10.7708 436.27 8.87891)"
          />
          <rect
            x="468.773"
            y="15.9609"
            width="4"
            height="8"
            rx="2"
            transform="rotate(14.3611 468.773 15.9609)"
          />
          <rect
            x="500.77"
            y="25.0645"
            width="4"
            height="8"
            rx="2"
            transform="rotate(17.9513 500.77 25.0645)"
          />
          <rect
            x="532.133"
            y="36.1533"
            width="4"
            height="8"
            rx="2"
            transform="rotate(21.5416 532.133 36.1533)"
          />
          <rect
            x="562.74"
            y="49.1846"
            width="4"
            height="8"
            rx="2"
            transform="rotate(25.1319 562.74 49.1846)"
          />
          <rect
            x="592.471"
            y="64.1074"
            width="4"
            height="8"
            rx="2"
            transform="rotate(28.7222 592.471 64.1074)"
          />
          <rect
            x="621.209"
            y="80.8623"
            width="4"
            height="8"
            rx="2"
            transform="rotate(32.3124 621.209 80.8623)"
          />
          <rect
            x="648.842"
            y="99.3838"
            width="4"
            height="8"
            rx="2"
            transform="rotate(35.9027 648.842 99.3838)"
          />
          <rect
            x="675.26"
            y="119.6"
            width="4"
            height="8"
            rx="2"
            transform="rotate(39.493 675.26 119.6)"
          />
          <rect
            width="4"
            height="8"
            rx="2"
            transform="matrix(-1 0 0 1 341.346 0)"
          />
          <rect
            width="4"
            height="8"
            rx="2"
            transform="matrix(-0.998037 0.062621 0.062621 0.998037 308.092 0.882812)"
          />
          <rect
            width="4"
            height="8"
            rx="2"
            transform="matrix(-0.992157 0.124996 0.124996 0.992157 274.959 3.84668)"
          />
          <rect
            width="4"
            height="8"
            rx="2"
            transform="matrix(-0.982383 0.186881 0.186881 0.982383 242.076 8.87891)"
          />
          <rect
            width="4"
            height="8"
            rx="2"
            transform="matrix(-0.968752 0.248032 0.248032 0.968752 209.572 15.9609)"
          />
          <rect
            width="4"
            height="8"
            rx="2"
            transform="matrix(-0.951319 0.308209 0.308209 0.951319 177.576 25.0645)"
          />
          <rect
            width="4"
            height="8"
            rx="2"
            transform="matrix(-0.930151 0.367177 0.367177 0.930151 146.213 36.1533)"
          />
          <rect
            width="4"
            height="8"
            rx="2"
            transform="matrix(-0.905333 0.424703 0.424703 0.905333 115.605 49.1846)"
          />
          <rect
            width="4"
            height="8"
            rx="2"
            transform="matrix(-0.876961 0.480563 0.480563 0.876961 85.875 64.1074)"
          />
          <rect
            width="4"
            height="8"
            rx="2"
            transform="matrix(-0.845146 0.534536 0.534536 0.845146 57.1367 80.8623)"
          />
          <rect
            width="4"
            height="8"
            rx="2"
            transform="matrix(-0.810014 0.586411 0.586411 0.810014 29.5039 99.3838)"
          />
          <rect
            width="4"
            height="8"
            rx="2"
            transform="matrix(-0.771703 0.635984 0.635984 0.771703 3.08594 119.6)"
          />
        </svg>
      )}
    </TodoProgressBarContainer>
  );
};
