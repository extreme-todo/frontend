import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';
import { act, render } from '@testing-library/react';
import React from 'react';
import { Clock } from '../../molecules';

jest.useFakeTimers();
describe('Clock', () => {
  function renderClock() {
    return render(
      <ThemeProvider theme={designTheme}>
        <Clock />
      </ThemeProvider>,
    );
  }

  describe('1분이 지나면', () => {
    it('UI에도 1분 뒤의 시간이 반영된다', () => {
      const beforeTime = new Date();
      const { getByText } = renderClock();
      act(() => {
        jest.advanceTimersByTime(60000);
      });
      const afterTime = new Date(beforeTime.getTime() + 60000);
      expect(
        getByText(
          `${afterTime.getHours().toString().padStart(2, '0')}:${afterTime
            .getMinutes()
            .toString()
            .padStart(2, '0')}`,
        ),
      ).not.toBeNull();
    });
  });

  describe('1일이 지나면', () => {
    const ONE_DAY_TO_MS = 86400000;
    it('UI에도 1일 뒤의 시간이 반영된다', () => {
      const beforeTime = new Date();
      const { getByText } = renderClock();
      act(() => {
        jest.advanceTimersByTime(ONE_DAY_TO_MS);
      });
      const afterTime = new Date(beforeTime.getTime() + ONE_DAY_TO_MS);
      expect(
        getByText(
          `${afterTime.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}`,
        ),
      ).not.toBeNull();
    });
  });
});
