import { css } from '@emotion/react';
import { designTheme } from './theme';

export const CardAnimationStyle = css`
  @keyframes hideUp {
    0% {
      transform: rotateZ(0deg);
      left: 0;
      top: 0;
      z-index: 1;
      opacity: 1;
      pointer-events: none;
    }
    99% {
      transform: rotateZ(-10deg);
      left: -28.5px;
      top: -146.52px;
      z-index: 0;
      opacity: 0;
      pointer-events: none;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes showUp {
    0% {
      transform: rotateZ(-3deg);
      left: 0px;
      top: 2.27rem;
      z-index: 0;
      opacity: 1;
      pointer-events: none;
    }
    100% {
      transform: rotateZ(0);
      left: 0;
      top: 0;
      z-index: 1;
      opacity: 1;
      pointer-events: auto;
    }
  }

  @media ${designTheme.responsiveDevice.tablet_v},
    ${designTheme.responsiveDevice.mobile} {
    @keyframes showUp {
      0% {
        top: 3.75rem;
        transform: rotateZ(-3.65deg);
        left: 0px;
        z-index: 0;
        opacity: 1;
        pointer-events: none;
      }
      100% {
        transform: rotateZ(0);
        left: 0;
        top: 0;
        z-index: 1;
        opacity: 1;
        pointer-events: auto;
      }
    }
  }

  @keyframes nextUp {
    0% {
      transform: rotateZ(10deg);
      left: 28.5px;
      top: 178px;
      z-index: 0;
      opacity: 0;
      pointer-events: none;
    }
    100% {
      transform: rotateZ(3deg);
      left: 0px;
      top: 2.27rem;
      z-index: 0;
      opacity: 1;
      pointer-events: none;
      @media ${designTheme.responsiveDevice.tablet_v},
        ${designTheme.responsiveDevice.mobile} {
        top: 3.75rem;
        transform: rotateZ(3.65deg);
      }
    }
  }

  @media ${designTheme.responsiveDevice.tablet_v},
    ${designTheme.responsiveDevice.mobile} {
    @keyframes nextUp {
      0% {
        transform: rotateZ(10deg);
        left: 28.5px;
        top: 178px;
        z-index: 0;
        opacity: 0;
        pointer-events: none;
      }
      100% {
        transform: rotateZ(3.65deg);
        left: 0px;
        top: 3.75rem;
        z-index: 0;
        opacity: 1;
        pointer-events: none;
      }
    }
  }
`;
