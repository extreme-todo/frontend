import { css } from '@emotion/react';

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
    100% {
      transform: rotateZ(-10deg);
      left: -28.5px;
      top: -146.52px;
      z-index: 0;
      opacity: 1;
      pointer-events: none;
    }
  }

  @keyframes showUp {
    0% {
      transform: rotateZ(-3.65deg);
      left: 34px;
      top: 40px;
      z-index: 0;
      opacity: 0;
      pointer-events: none;
    }
    100% {
      transform: rotateZ($cardDegree);
      left: 0;
      top: 0;
      z-index: 1;
      opacity: 1;
      pointer-events: auto;
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
      transform: rotateZ(3.65deg);
      left: 17px;
      top: 40px;
      z-index: 0;
      opacity: 1;
      pointer-events: none;
    }
  }
`;
