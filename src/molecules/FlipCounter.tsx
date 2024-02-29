import { useState } from 'react';

import styled from '@emotion/styled';
import TypoAtom from '../atoms/TypoAtom';

interface IFlipCounter {
  flipNumber: Array<number>;
}

const FlipCounter = ({ flipNumber }: IFlipCounter) => {
  const [flipIndex, setFlipIndex] = useState(0);
  const [isPlus, setIsPlus] = useState(false);
  const handlePlus = () => {
    setFlipIndex((prev) => (prev >= flipNumber.length - 1 ? prev : prev + 1));
    setIsPlus(true);
  };
  const handleMinus = () => {
    setFlipIndex((prev) => (prev <= 0 ? prev : prev - 1));
    setIsPlus(false);
  };

  return (
    <>
      <button onClick={handlePlus}>플러스</button>
      <FlipContainer>
        {flipNumber.map((num) => (
          <NumberCard
            className={
              (num === flipNumber[flipIndex - 1] ? 'prev' : '') +
              (num === flipNumber[flipIndex] ? 'curr ' : '') +
              (num === flipNumber[flipIndex + 1] ? 'next ' : '')
            }
            isPlus={isPlus}
          >
            <div className="upper">
              <TypoAtom fontSize="h1" className={'num'}>
                {num}
              </TypoAtom>
            </div>
            <div className="lower">
              <TypoAtom fontSize="h1" className={'num'}>
                {num}
              </TypoAtom>
            </div>
          </NumberCard>
        ))}
      </FlipContainer>
      <button onClick={handleMinus}>마이너스</button>
    </>
  );
};

export default FlipCounter;

const FlipContainer = styled.ul`
  position: relative;
  width: 7.4375rem;
  height: 8.625rem;
  margin: 2px;
  border-radius: 6px;
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.7); */
  font-size: 20px;
  font-weight: bold;
  list-style: none;
`;

const NumberCard = styled.li<{ isPlus: boolean }>`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 5px 0 5px;

  div {
    position: absolute;
    z-index: 1;
    left: 0;
    overflow: hidden;
    width: 100%;
    height: 50%;

    // 그림자 효과를 넣어줄 가상 요소
    &::before {
      position: absolute;
      z-index: 2;
      width: 100%;
      height: 100%;
      content: '';
    }

    .num {
      position: absolute;
      z-index: 1;
      left: 0;
      display: flex;
      width: 100%;
      height: 200%;
      align-items: center;
      justify-content: center;
      background-color: ${({ theme }) => theme.colors.bgYellow};
      border-radius: 6px;
    }

    &.upper {
      top: 0;
      transform-origin: 50% 100%;

      .num {
        top: 0;
      }

      // 카드 가운데 선
      &::after {
        position: absolute;
        z-index: 5;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: rgba(0, 0, 0, 0.4);
        content: '';
      }
    }

    &.lower {
      bottom: 0;
      transform-origin: 50% 0%;
      .num {
        bottom: 0;
      }
    }
  }

  ${({ isPlus }) => {
    if (isPlus)
      return `&.prev {
    z-index: 3;

    .upper {
      z-index: 2;
      animation: top-to-middle 0.3s linear both;

      &::before {
        animation: show 0.3s linear both;
        background: linear-gradient(
          to top,
          rgba(232, 234, 167, 0.1) 0%,
          rgba(232, 234, 167, 1) 100%
        );
        background: linear-gradient(
          to bottom,
          rgba(232, 234, 167, 0.1) 0%,
          0%,
          rgba(232, 234, 167, 1) 100%
        );
        border-radius: 6px;
      }
    }

    .lower {
      &::before {
        animation: show 0.3s linear both;
      }
    }
  }`;
    else
      return `
    &.next {
    z-index: 3;

    .lower {
      z-index: 2;
      animation: bottom-to-middle 0.3s linear both;

      &::before {
        animation: show 0.3s linear both;
        background: linear-gradient(
          to top,
          rgba(232, 234, 167, 0.1) 0%,
          rgba(232, 234, 167, 1) 100%
        );
        background: linear-gradient(
          to bottom,
          rgba(232, 234, 167, 0.1) 0%,
          0%,
          rgba(232, 234, 167, 1) 100%
        );
        border-radius: 6px;
      }
    }

    .upper {
      &::before {
        animation: show 0.3s linear both;
      }
    }
  }
    `;
  }}

  &.curr {
    z-index: 2;
    animation: increase-zindex 0.3s 0.3s linear forwards;

    ${({ isPlus }) => {
      if (isPlus)
        return `
      .upper {
      &::before {
        animation: hide 0.3s 0.1s linear both;
      }
    }

    .lower {
      z-index: 2;
      animation: middle-to-bottom 0.3s 0.3s linear both;

      &::before {
        animation: hide 0.3s 0.1s linear both;
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 1) 0%,
          rgba(0, 0, 0, 0.1) 100%
        );
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 1) 0%,
          rgba(0, 0, 0, 0.1) 100%
        );
        border-radius: 6px;
      }
    }
      `;
      else
        return `
      .upper {
        z-index: 2;
      animation: middle-to-top 0.3s 0.3s linear both;

      &::before {
        animation: hide 0.3s 0.1s linear both;
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 1) 0%,
          rgba(0, 0, 0, 0.1) 100%
        );
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 1) 0%,
          rgba(0, 0, 0, 0.1) 100%
        );
        border-radius: 6px;
      }
    }

    .lower {
      &::before {
        animation: hide 0.3s 0.1s linear both;
      }
    }
      `;
    }}
  }

  @keyframes top-to-middle {
    0% {
      transtorm: rotateX(0deg);
    }

    100% {
      transtorm: rotateX(90deg);
    }
  }

  @keyframes middle-to-bottom {
    0% {
      transtorm: rotateX(90deg);
    }

    100% {
      transtorm: rotateX(0deg);
    }
  }

  @keyframes middle-to-top {
    0% {
      transtorm: rotateX(90deg);
    }

    100% {
      transtorm: rotateX(0deg);
    }
  }

  @keyframes bottom-to-middle {
    0% {
      transtorm: rotateX(0deg);
    }

    100% {
      transtorm: rotateX(90deg);
    }
  }

  @keyframes show {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes hide {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes increase-zindex {
    0% {
      z-index: 4;
    }

    100% {
      z-index: 4;
    }
  }
`;
