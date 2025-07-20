import styled from '@emotion/styled';

const TodoProgressBarContainer = styled.div<{
  progress: number;
  type: 'primary1' | 'primary2' | 'extreme1' | 'extreme2';
}>`
  width: 44.99rem;
  height: 10.02rem;
  pointer-events: none;
  position: relative;

  #progress-bar-background {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
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
`;

export const TodoProgressBarAtom = (props: {
  progress: number;
  type: 'primary1' | 'primary2' | 'extreme1' | 'extreme2';
  children?: React.ReactNode;
}) => {
  return (
    <TodoProgressBarContainer progress={props.progress} type={props.type}>
      <svg
        id="progress-bar-background"
        className="background"
        width="732"
        height="144"
        viewBox="0 0 732 144"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M729.753 141.925C731.796 139.559 731.534 135.981 729.148 133.961C627.721 48.1192 499.266 0.657765 366.27 0.00678025C233.275 -0.644205 104.361 45.5574 2.09862 130.403C-0.307114 132.399 -0.604172 135.974 1.41577 138.36C3.4357 140.746 7.00766 141.038 9.41379 139.042C109.617 55.94 235.917 10.6889 366.215 11.3267C496.513 11.9644 622.364 58.4498 721.749 142.529C724.135 144.548 727.71 144.291 729.753 141.925Z" />
      </svg>
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
    </TodoProgressBarContainer>
  );
};

// export const TodoProgressBarAtom = styled.div<{
//   progress: number;
//   type: 'primary1' | 'primary2' | 'extreme1' | 'extreme2';
// }>`
//   background-color: ${({ theme, type }) => {
//     switch (type) {
//       case 'primary1':
//         return theme.color.backgroundColor.primary1;
//       case 'primary2':
//         return theme.color.backgroundColor.primary2;
//       case 'extreme1':
//         return theme.color.backgroundColor.extreme_dark;
//       case 'extreme2':
//         return theme.color.backgroundColor.extreme_orange;
//     }
//   }};
//   height: 0.75rem;
//   width: 100%;
//   border-radius: 1.75rem;
//   display: flex;
//   align-items: center;
//   position: relative;
//   box-sizing: border-box;
//   overflow: hidden;
//   .progress {
//     width: ${({ progress }) => `${progress}%`};
//     height: 100%;
//     line-height: 2.875rem;
//     border-radius: 3.125rem;
//     background: ${({ theme }) => theme.color.backgroundColor.extreme_orange};
//     transition: all 0.2s ease-in-out;
//   }
//   @media ${({ theme }) => theme.responsiveDevice.tablet_v},
//     ${({ theme }) => theme.responsiveDevice.mobile} {
//     width: 100%;
//     height: 100%;
//     align-items: flex-start;
//     justify-content: center;
//     padding: 1rem 0 1rem 0;
//     .progress {
//       height: ${({ progress }) => `${progress}%`};
//       width: 70%;
//       overflow: hidden;
//       padding: 0;
//       color: transparent;
//     }
//   }
// `;
