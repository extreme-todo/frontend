import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Clock } from '../../molecules';
import { IClockProps } from '../../molecules/Clock';

describe('Clock', () => {
  function renderClock(props: IClockProps) {
    return render(
      <ThemeProvider theme={designTheme}>
        <Clock {...{ ...props }} />
      </ThemeProvider>,
    );
  }

  describe('1000000ms를 입력하면', () => {
    it('00:16 이 출력된다', () => {
      renderClock({
        ms: 1000000,
      });
      expect(
        screen.getAllByText((_, element) => {
          return element?.textContent === '0016';
        })[0],
      ).toBeInTheDocument();
    });

    describe('show 옵션이 없으면', () => {
      it('시,분만 출력된다.', () => {
        renderClock({
          ms: 1000000,
        });
        expect(
          screen.getAllByText((_, element) => {
            return element?.textContent === '0016';
          })[0],
        ).toBeInTheDocument();
      });
    });

    describe('show 옵션을 모두 true 로 하면', () => {
      it('시,분,초가 출력된다', () => {
        renderClock({
          ms: 1000000,
          show: {
            hour: true,
            min: true,
            sec: true,
          },
        });
        expect(
          screen.getAllByText((_, element) => {
            return element?.textContent === '001640';
          })[0],
        ).toBeInTheDocument();
      });
    });

    describe('show 옵션에서 분, 초만 true로 하면', () => {
      it('분,초만 출력된다', () => {
        renderClock({
          ms: 1000000,
          show: {
            hour: false,
            min: true,
            sec: true,
          },
        });
        expect(
          screen.getAllByText((_, element) => {
            return element?.textContent === '1640';
          })[0],
        ).toBeInTheDocument();
      });
    });
  });
});
