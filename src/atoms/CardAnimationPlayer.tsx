import styled from '@emotion/styled';
import { ReactNode, useEffect, useRef, useState } from 'react';

export type CardAnimationPlayerAnimationType =
  | 'HIDE_UP' // 맨 위에 있던 카드가 위로 사라질 때
  | 'SHOW_UP' // 바로 뒤에 있던 카드가 현재 카드가 될 때
  | 'NEXT_UP'; // 더 뒤에 있던 카드에서 바로 뒤에 있는 카드로 올라올 때

export interface ICardAnimationPlayerProps {
  className?: string;
  children: ReactNode;
  duration?: number;
  animation:
    | CardAnimationPlayerAnimationType
    | CardAnimationPlayerAnimationType[];
}

function CardAnimationPlayer({
  children,
  animation,
  duration = 0.3,
}: ICardAnimationPlayerProps) {
  const cardRef = useRef<HTMLDivElement | null>();

  const getAnimation = (
    anim: CardAnimationPlayerAnimationType,
    idx?: number,
  ) => {
    switch (anim) {
      case 'HIDE_UP':
        return `hideUp ${duration}s ${
          duration * (idx ?? 0)
        }s forwards ease-in-out`;
      case 'SHOW_UP':
        return `showUp ${duration}s ${
          duration * (idx ?? 0)
        }s forwards ease-in-out`;
      case 'NEXT_UP':
        return `nextUp ${duration}s ${
          duration * (idx ?? 0)
        }s forwards ease-in-out`;
      default:
        return 'none';
    }
  };

  useEffect(() => {
    if (cardRef.current) {
      if (Array.isArray(animation)) {
        cardRef.current.style.animation = animation
          .map((anim, idx) => getAnimation(anim, idx))
          .join(', ');
      } else {
        cardRef.current.style.animation = getAnimation(animation);
      }
    }
  }, [animation]);

  return (
    <StyleddCardAnimationPlayerWrapper
      ref={(el) => {
        cardRef.current = el;
      }}
    >
      {children}
    </StyleddCardAnimationPlayerWrapper>
  );
}

const StyleddCardAnimationPlayerWrapper = styled.div`
  position: absolute;
  transform-origin: bottom left;
`;

export default CardAnimationPlayer;
