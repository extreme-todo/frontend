import styled from '@emotion/styled';
import { ReactNode, useEffect, useRef, useState } from 'react';

export interface ICardSize {
  w: number;
  h: number;
}

export interface ICardFlipAnimatorProps {
  cards: ReactNode[];
  degree?: number;
  currentCardIndex: number;
  className?: string;
  responsive?: boolean;
  cardSize?: ICardSize;
}

function CardFlipAnimator({
  cards,
  degree = -3.65,
  currentCardIndex,
  responsive = true,
  ...props
}: ICardFlipAnimatorProps) {
  const [cardSize, setCardSize] = useState<ICardSize>(
    props.cardSize ?? {
      w: 0,
      h: 0,
    },
  );
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    cardRefs.current.forEach((cardRef, idx) => {
      if (cardRef) {
        if (idx < currentCardIndex) {
          cardRef.style.zIndex = `${idx + 1}`;
          cardRef.style.pointerEvents = 'none';
          cardRef.style.animation = 'oneCardUp 0.3s forwards ease-in-out';
        }
        if (idx === currentCardIndex) {
          cardRef.style.zIndex = `${cards.length}`;
          cardRef.style.pointerEvents = 'auto';
          cardRef.style.animation = 'flipToFront 0.3s forwards ease-in-out';
        }
        if (idx > currentCardIndex) {
          cardRef.style.zIndex = `${cards.length - idx}`;
          cardRef.style.pointerEvents = 'none';
          cardRef.style.animation = 'flipToBack 0.3s forwards ease-in-out';
        }
      }
    });
  }, [currentCardIndex]);

  useEffect(() => {
    if (responsive) {
      let maxW = cardSize?.w ?? 0;
      let maxH = cardSize?.h ?? 0;
      cardRefs.current.forEach((cardRef, idx) => {
        const matrix = cardRef?.getBoundingClientRect();
        maxW = Math.max(maxW, matrix?.width ?? 0);
        maxH = Math.max(maxH, matrix?.height ?? 0);
      });
      setCardSize({ w: maxW, h: maxH });
    }
  }, [responsive]);

  return (
    <StyledCardFlipAnimatorWrapper
      w={cardSize.w}
      h={cardSize.h}
      degree={degree}
      {...{ ...props }}
    >
      {cards.map((card, idx) => (
        <div key={idx} ref={(el) => (cardRefs.current[idx] = el)}>
          {card}
        </div>
      ))}
    </StyledCardFlipAnimatorWrapper>
  );
}

const StyledCardFlipAnimatorWrapper = styled.div<
  ICardSize & { degree: number }
>`
  position: relative;
  width: ${({ w }) => `${w}px`};
  height: ${({ h }) => `${h}px`};
  > div {
    position: absolute;
    transform-origin: bottom left;
  }

  @keyframes oneCardUp {
    0% {
      transform: rotateZ(${({ degree }) => -degree * 2}deg);
      left: 17px;
      top: 40px;
    }

    50% {
      transform: rotateZ(90deg);
      left: 17px;
      top: 40px;
    }

    100% {
      transform: rotateZ(${({ degree }) => -degree}deg);
      left: 17px;
      top: 40px;
    }
  }

  @keyframes flipToBack {
    0% {
      transform: rotateZ(0deg);
      left: 0;
      top: 0;
    }

    50% {
      transform: rotateZ(90deg);
      left: 17px;
      top: 40px;
    }

    100% {
      transform: rotateZ(${({ degree }) => -degree}deg);
      left: 17px;
      top: 40px;
    }
  }

  @keyframes flipToFront {
    0% {
      transform: rotateZ(${({ degree }) => -degree}deg);
      left: 17px;
      top: 40px;
    }

    50% {
      transform: rotateZ(-90deg);
      left: 17px;
      top: 40px;
    }

    100% {
      transform: rotateZ(0deg);
      left: 0;
      top: 0;
    }
  }
`;

export default CardFlipAnimator;
