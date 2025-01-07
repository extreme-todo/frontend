import {
  useRef,
  useState,
  type TouchEvent,
  type MouseEvent,
  useEffect,
} from 'react';
import { formatTime } from '../shared/timeUtils';
import styled from '@emotion/styled';

const TomatoInput = ({
  max,
  min,
  period,
  tomato,
  handleTomato,
}: {
  max: number;
  min: number;
  period: number;
  handleTomato: (count: number) => void;
  tomato: number;
}) => {
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
      console.log(rangeInputRect);
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

  useEffect(() => {
    if (thumbRef.current && tickRef.current) {
      const initCorrection =
        (tickRef.current.offsetWidth / 2 - thumbRef.current.offsetWidth / 2) *
        tomato;
      thumbRef.current.style.transform =
        'translate(' + initCorrection + 'px, -50%)';
    }
  }, []);

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
        <Thumb ref={thumbRef} data-value={`${tomato}round`} aria-label="tomato">
          🍅
        </Thumb>
        <AssistantLine />
        <InputTickWrapper>
          {Array.from({ length: tickCount }).map((_, index) => (
            <TickWrapper key={index} ref={tickRef} aria-label="tick">
              <InputTick />
            </TickWrapper>
          ))}
        </InputTickWrapper>
      </RangeInputWrapper>
      <LabelWrapper>
        {Array.from({ length: tickCount }).map((_, index) => (
          <TickWrapper key={index} aria-label="label">
            {formatTime((index + 1) * period)}
          </TickWrapper>
        ))}
      </LabelWrapper>
    </>
  );
};

export default TomatoInput;

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

const Thumb = styled.div`
  font-size: 2.25rem;
  width: 2.25rem;
  height: 2.25rem;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }

  &:before {
    content: attr(data-value);
    position: absolute;
    /* top: -3rem; */
    bottom: 4rem;
    left: 50%;
    transform: translateX(-50%);
    font: ${({ theme: { fontSize } }) => fontSize.h3.size};
    font-weight: ${({ theme: { fontSize } }) => fontSize.h3.weight};
    color: ${({
      theme: {
        color: { backgroundColor },
      },
    }) => backgroundColor.extreme_orange};
    background-color: ${({
      theme: {
        color: { backgroundColor },
      },
    }) => backgroundColor.white};
    padding: 0.5625rem 1.3125rem;
    border-radius: 4.5625rem;
    z-index: 1;
  }
  &:after {
    content: '';
    position: absolute;
    /* top: -0.5rem; 말풍선 꼬리 위치 조정 */
    bottom: 3rem; /* 말풍선 꼬리 위치 조정 */
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    border-top: 1.5rem solid white; /* 꼬리의 색상 */
    z-index: 1;
  }
`;

const LabelWrapper = styled.div`
  display: flex;
  margin-top: 0.375rem;
`;
