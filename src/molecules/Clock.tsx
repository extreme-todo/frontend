import styled from '@emotion/styled';
import { TypoAtom } from '../atoms';
import { intervalToDuration } from 'date-fns';

export interface IClockProps {
  ms: number;
}

function Clock({ ms }: IClockProps) {
  return (
    <ClockContainer>
      <TypoAtom fontSize="h1" className="clock-time">
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

const ClockContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  // TODO: 아톰 수정되면 지워야됨
  .clock-time {
    /* 12 : 34 */
    font-style: normal;
    font-weight: ${({ theme: { fontSize } }) => fontSize.clock.weight};
    font-size: ${({ theme: { fontSize } }) => fontSize.clock.size};
    line-height: 8rem;
    /* identical to box height, or 100% */
    display: flex;
    align-items: center;
    letter-spacing: -0.02em;
    vertical-align: middle;
    color: ${({
      theme: {
        color: { fontColor },
      },
    }) => fontColor.primary1};
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
