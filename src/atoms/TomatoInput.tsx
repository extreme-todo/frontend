import {
  useRef,
  useState,
  type TouchEvent,
  type MouseEvent,
  useEffect,
  memo,
  useCallback,
} from 'react';
import { formatTime } from '../shared/timeUtils';
import styled from '@emotion/styled';

interface ITomatoInputProps {
  max: number;
  min: number;
  period: number;
  handleTomato: (count: number) => void;
  tomato: number;
  isBalloon?: boolean;
  isLabel?: boolean;
}

const TomatoInput = ({
  max,
  min,
  period,
  tomato,
  handleTomato,
  isBalloon = true,
  isLabel = true,
}: ITomatoInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const thumbRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef<HTMLDivElement>(null);
  const tickCount = max - min;

  const handleDrag = (
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
  ) => {
    if (thumbRef.current && isDragging && event.currentTarget) {
      const rangeInputRect = event.currentTarget.getBoundingClientRect();
      const thumbWidth = thumbRef.current.offsetWidth;
      const halfThumbWidth = thumbWidth / 2;

      let clientX = 0;

      if (Object.hasOwn(event, 'touches')) {
        clientX = (event as TouchEvent).touches[0].clientX;
      } else {
        clientX = (event as MouseEvent).clientX;
      }

      // thumb가 위치할 수 있는 최대의 x좌표
      const maxPosX = event.currentTarget.offsetWidth;
      let posX = clientX - rangeInputRect.left;
      posX = Math.min(
        Math.max(posX - halfThumbWidth, 0),
        maxPosX - halfThumbWidth,
      );
      thumbRef.current.style.transform = 'translate(' + posX + 'px, -50%)';
    }
  };
  const handleDrapEnd = (
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
  ) => {
    setIsDragging(false);
    if (thumbRef.current && tickRef.current) {
      const rangeInputRect = event.currentTarget.getBoundingClientRect();
      const thumbWidth = thumbRef.current.offsetWidth;
      const halfThumbWidth = thumbWidth / 2;
      const tickWidth = tickRef.current.offsetWidth;
      const halfTickWidth = tickWidth / 2;

      let clientX = 0;

      if (Object.hasOwn(event, 'touches')) {
        clientX = (event as TouchEvent).changedTouches[0].clientX;
      } else {
        clientX = (event as MouseEvent).clientX;
      }
      let posX = clientX - rangeInputRect.left;
      const count = Math.floor(posX / tickWidth);
      handleTomato(count + 1);
      posX = count * tickWidth - thumbWidth + halfTickWidth + halfThumbWidth;
      thumbRef.current.style.transform = 'translate(' + posX + 'px, -50%)';
    }
  };

  const handleDragStart = () => setIsDragging(true);

  const handleInitTomato = useCallback(() => {
    if (thumbRef.current && tickRef.current) {
      const tickWidth = tickRef.current.offsetWidth;
      const thumbWidth = thumbRef.current.offsetWidth;
      const halfTickWidth = tickWidth / 2;
      const halfThumbWidth = thumbWidth / 2;
      const newCorrection = tomato * tickWidth - halfTickWidth - halfThumbWidth;
      thumbRef.current.style.transform =
        'translate(' + newCorrection + 'px, -50%)';
    }
  }, [tomato]);

  useEffect(() => {
    handleInitTomato();
    window.addEventListener('resize', handleInitTomato);
    return () => {
      window.removeEventListener('resize', handleInitTomato);
    };
  }, [handleInitTomato]);

  return (
    <>
      <RangeInputWrapper
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onMouseMove={handleDrag}
        onTouchMove={handleDrag}
        onMouseUp={handleDrapEnd}
        onTouchEnd={handleDrapEnd}
        aria-label="slider"
      >
        <Thumb
          ref={thumbRef}
          data-value={`${tomato}round`}
          aria-label="tomato"
          useBalloon={isBalloon}
        >
          🍅
        </Thumb>
        <AssistantLine />
        <InputTickWrapper>
          {Array.from({ length: tickCount }).map((_, index) => (
            <TickWrapper key={index} ref={tickRef} aria-label="tick">
              <InputTick
                tabIndex={1}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleTomato(index + 1);
                  }
                }}
              />
            </TickWrapper>
          ))}
        </InputTickWrapper>
      </RangeInputWrapper>
      {isLabel ? (
        <LabelWrapper>
          {Array.from({ length: tickCount }).map((_, index) => (
            <TickWrapper key={index} aria-label="label">
              {formatTime((index + 1) * period)}
            </TickWrapper>
          ))}
        </LabelWrapper>
      ) : undefined}
    </>
  );
};

export default memo(TomatoInput);

const RangeInputWrapper = styled.div`
  position: relative;
  width: 100%;
  cursor: pointer;
  height: 20px;
`;
const AssistantLine = styled.div`
  background-color: ${({
    theme: {
      color: { backgroundColor },
    },
  }) => backgroundColor.primary1};
  height: 0.25rem;
  border-radius: 50px;
  width: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

const InputTickWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
`;
const TickWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  font-size: ${({ theme: { fontSize } }) => fontSize.b2.size};
  font-weight: ${({ theme: { fontSize } }) => fontSize.b2.weight};
`;

const InputTick = styled.div`
  width: 0.625rem;
  height: 0.625rem;
  background-color: ${({
    theme: {
      color: { backgroundColor },
    },
  }) => backgroundColor.primary1};
  border-radius: 50%;
`;

const Thumb = styled.div<{ useBalloon: boolean }>(({ theme, useBalloon }) => ({
  fontSize: '2.25rem',
  width: '2.25rem',
  height: '2.25rem',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  cursor: 'grab',

  '&:active': {
    cursor: 'grabbing',
  },

  ...(useBalloon === true && {
    '&:before': {
      content: 'attr(data-value)',
      position: 'absolute',
      bottom: '4rem', // 말풍선 위치
      left: '50%',
      transform: 'translateX(-50%)',
      font: theme.fontSize.h3.size,
      fontWeight: theme.fontSize.h3.weight,
      color: theme.color.backgroundColor.extreme_orange,
      backgroundColor: theme.color.backgroundColor.white,
      padding: '0.5625rem 1.3125rem',
      borderRadius: '4.5625rem',
      zIndex: 1,
    },

    '&:after': {
      content: "''",
      position: 'absolute',
      bottom: '3rem', // 말풍선 꼬리 위치
      left: '50%',
      transform: 'translateX(-50%)',
      width: 0,
      height: 0,
      borderLeft: '0.5rem solid transparent',
      borderRight: '0.5rem solid transparent',
      borderTop: `1.5rem solid ${theme.color.backgroundColor.white}`, // 꼬리 색상
      zIndex: 1,
    },
  }),
}));

const LabelWrapper = styled.div`
  display: flex;
  margin-top: 0.375rem;
`;
