import styled from '@emotion/styled';
import { TypoAtom } from '../atoms';
import { intervalToDuration } from 'date-fns';
import { FontColorName } from '../styles/emotion';

export interface IClockProps {
  ms: number;
  fontColor?: FontColorName;
  show?: {
    hour: boolean;
    min: boolean;
    sec: boolean;
  };
}

export function Clock({
  ms,
  fontColor = 'primary1',
  show = {
    hour: true,
    min: true,
    sec: false,
  },
}: IClockProps) {
  return (
    <ClockContainer {...{ ms, fontColor }}>
      {show.hour && (
        <TypoAtom fontSize="clock" className="clock-time">
          {ms < 0
            ? '00'
            : intervalToDuration({ start: 0, end: ms })
                .hours?.toString()
                .padStart(2, '0') ?? '00'}
        </TypoAtom>
      )}
      {show.min && (
        <TypoAtom fontSize="clock" className="clock-time">
          {ms < 0
            ? '00'
            : intervalToDuration({ start: 0, end: ms })
                .minutes?.toString()
                .padStart(2, '0') ?? '00'}
        </TypoAtom>
      )}
      {show.sec && (
        <TypoAtom fontSize="clock" className="clock-time">
          {ms < 0
            ? '00'
            : intervalToDuration({ start: 0, end: ms })
                .seconds?.toString()
                .padStart(2, '0') ?? '00'}
        </TypoAtom>
      )}
    </ClockContainer>
  );
}

const ClockContainer = styled.div<IClockProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  .clock-time {
    display: flex;
    align-items: center;
    letter-spacing: -0.02em;
    vertical-align: middle;
    line-height: 6.25rem;
    color: ${({ theme: { color }, fontColor }) =>
      fontColor ? color.fontColor[fontColor] : color.fontColor.primary2};
    &:not(:last-child) {
      &::after {
        display: block;
        content: ':';
      }
    }
  }
  @media ${({ theme }) => theme.responsiveDevice.mobile},
    ${({ theme }) => theme.responsiveDevice.tablet_v} {
    position: fixed;
    top: 4rem;
    .clock-date {
      font-size: ${({ theme: { fontSize } }) => fontSize.h1.size};
    }
    .clock-time {
      font-size: ${({ theme: { fontSize } }) => fontSize.clock.size};
    }
  }
`;
