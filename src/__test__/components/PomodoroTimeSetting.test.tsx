import React, { act } from 'react';
import { render } from '@testing-library/react';
import { TimeSetter } from '../../components';
import { ThemeProvider } from '@emotion/react';

import { IChildProps } from '../../shared/interfaces';
import { designTheme } from '../../styles/theme';
import userEvent from '@testing-library/user-event';

describe('PomodoroTimeSetting', () => {
  let renderUI: ReturnType<typeof render>;
  const handleTimeUP = jest.fn();
  const handleTimeDown = jest.fn();

  describe('TimeSetter는', () => {
    beforeEach(() => {
      renderUI = render(
        <TimeSetter
          timeTitle={'집중시간'}
          time={30}
          handleTimeUp={handleTimeUP}
          handleTimeDown={handleTimeDown}
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
      const { getByRole } = renderUI;

      const timeup = getByRole('button', { name: 'timeup' });
      const timedown = getByRole('button', { name: 'timedown' });

      expect(timeup).toBeInTheDocument();
      expect(timedown).toBeInTheDocument();
    });

    it('집중시간에 Flip Counter에 설정된 시간이 있다.', () => {
      const { getByText } = renderUI;
      const time = getByText('30');
      expect(time).toBeInTheDocument();
    });

    it('시간 단위(분)가 있다.', () => {
      const { getByText } = renderUI;
      const minStandar = getByText('Minute');

      expect(minStandar).toBeInTheDocument();
    });

    it('Plus, Minus 조작 버튼을 누르면 해당 핸들러가 호출된다.', () => {
      const { getByRole } = renderUI;

      const timeup = getByRole('button', { name: 'timeup' });
      act(() => userEvent.click(timeup));

      const timedown = getByRole('button', { name: 'timedown' });
      act(() => userEvent.click(timedown));

      expect(handleTimeUP).toBeCalled();
      expect(handleTimeDown).toBeCalled();
    });
  });
});
