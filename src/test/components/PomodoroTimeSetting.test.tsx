import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { PomodoroTimeSetting, TimeSetter } from '../../components';
import { ThemeProvider } from '@emotion/react';

import { IChildProps } from '../../shared/interfaces';
import { focusStepList } from '../../hooks/usePomodoro';
import { designTheme } from '../../styles/theme';
import userEvent from '@testing-library/user-event';

describe('PomodoroTimeSetting', () => {
  let renderUI: ReturnType<typeof render>;

  describe('TimeSetter는', () => {
    beforeEach(() => {
      renderUI = render(
        <TimeSetter
          flipData={[...focusStepList]}
          title={'집중시간'}
          initFlipIndex={focusStepList.findIndex((step) => step === 30)}
        />,
        {
          wrapper: ({ children }: IChildProps) => (
            <ThemeProvider theme={designTheme}>{children}</ThemeProvider>
          ),
        },
      );
    });

    it('제목이 있다.', () => {
      const { getByText } = renderUI;

      const title = getByText('집중시간');
      expect(title).toBeInTheDocument();
    });

    it('Flip Counter를 조작할 수 있는 버튼이 두 개 있다.', () => {
      const { getByAltText } = renderUI;

      const timeup = getByAltText('timeup');
      const timedown = getByAltText('timedown');

      expect(timeup).toBeInTheDocument();
      expect(timedown).toBeInTheDocument();
    });

    it('집중시간에 Flip Counter에 설정된 시간(Step)이 있다.', () => {
      const { getAllByRole } = renderUI;
      const focusMin = getAllByRole('listitem');
      let minIndex = 0;

      const selectMin = focusMin.filter((element, idx) => {
        if (element.classList.contains('curr')) {
          minIndex = idx;
          return true;
        }
      });

      // 화면에 직접 노출되는 node는 curr class를 가진 li태그이고,
      // 이는 오직 하나이다.
      expect(selectMin.length).toBe(1);
      // 그 하나의 요소는 curr를 반드시 가지고 있다.(더블 체크)
      expect(selectMin[0]).toHaveClass('curr');
      // 그리고 이 테스트는 30을 initial flip data로 설정했기 때문에,
      // flipData 배열의 30의 index인 3이 minIndex에 할당되어 있어야 한다.
      expect(minIndex).toBe(3);
    });

    it('시간 단위(분)가 있다.', () => {
      const { getByText } = renderUI;
      const minStandar = getByText('분');

      expect(minStandar).toBeInTheDocument();
    });

    it('Flip Counter 조작 버튼을 누르면 Flip Counter가 수정된다.', () => {
      const { getByAltText, getAllByRole } = renderUI;

      const focusMin = getAllByRole('listitem');
      let minIndex = 0;

      // 버튼 조작 전
      focusMin.forEach((element, idx) => {
        if (element.classList.contains('curr')) {
          minIndex = idx;
        }
      });
      expect(minIndex).toBe(3);

      // 시간 추가 버튼 조작
      const timeup = getByAltText('timeup');
      act(() => userEvent.click(timeup));

      focusMin.forEach((element, idx) => {
        if (element.classList.contains('curr')) {
          minIndex = idx;
        }
      });
      expect(minIndex).toBe(4);

      const timedown = getByAltText('timedown');
      act(() => userEvent.click(timedown));

      focusMin.forEach((element, idx) => {
        if (element.classList.contains('curr')) {
          minIndex = idx;
        }
      });
      expect(minIndex).toBe(3);
    });
  });
  describe('TimeSetting은', () => {
    it('확인 버튼을 누르면 localStorage에 설정 값이 반영된다.', () => {});
  });
});
