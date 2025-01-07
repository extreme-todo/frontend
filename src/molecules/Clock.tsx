import styled from '@emotion/styled';
import { TypoAtom } from '../atoms';
import { intervalToDuration } from 'date-fns';
import { FontColorName } from '../styles/emotion';

export interface IClockProps {
  ms: number;
  fontColor: FontColorName;
}

function Clock({ ms, fontColor }: IClockProps) {
  return (
    <ClockContainer {...{ ms, fontColor }}>
      <TypoAtom fontSize="clock" className="clock-time">
        {(intervalToDuration({ start: 0, end: ms })
          .hours?.toString()
          .padStart(2, '0') ?? '00') +
          ' : ' +
          (intervalToDuration({ start: 0, end: ms })
            .minutes?.toString()
            .padStart(2, '0') ?? '00')}
      </TypoAtom>
    </ClockContainer>
  );
}

const ClockContainer = styled.div<IClockProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  // TODO: 아톰 수정되면 지워야됨
  .clock-time {
    display: flex;
    align-items: center;
    letter-spacing: -0.02em;
    vertical-align: middle;
    line-height: 6.25rem;
    color: ${({ theme: { color }, fontColor }) =>
      fontColor ? color.fontColor[fontColor] : color.fontColor.primary2};
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

export default Clock;
