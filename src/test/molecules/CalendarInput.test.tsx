import React from 'react';
import { render } from '@testing-library/react';
import { CalendarInput } from '../../molecules';
import { IChildProps } from '../../shared/interfaces';
import { designTheme } from '../../styles/theme';
import { ThemeProvider } from '@emotion/react';
import { format } from 'date-fns';

describe('CalendarInput', () => {
  let renderUI: () => ReturnType<typeof render>;
  let handleDaySelect = jest.fn();

  beforeEach(() => {
    renderUI = () =>
      render(
        <CalendarInput
          handleDaySelect={handleDaySelect}
          selectedDay={new Date()}
        />,
        {
          wrapper: ({ children }: IChildProps) => (
            <ThemeProvider theme={designTheme}>{children}</ThemeProvider>
          ),
        },
      );
  });
  describe('CalendarInput는 ', () => {
    it('달력 아이콘이 있다.', () => {
      const { getByAltText } = renderUI();
      const getIcon = getByAltText('calendar_icon');

      expect(getIcon).toBeInTheDocument();
    });

    it('날짜 입력 input이 있다.', () => {
      const { getByRole } = renderUI();
      const calendarInput = getByRole('textbox', { name: 'calendar_input' });

      expect(calendarInput).toBeInTheDocument();
    });

    it('초기 값으로 selectedDay가 설정 돼 있다.', () => {
      const { getByRole } = renderUI();
      const calendarValue = format(new Date().toString(), 'y-MM-dd');
      const calendarInput = getByRole('textbox', {
        name: 'calendar_input',
      }) as HTMLInputElement;
      expect(calendarInput.value).toBe(calendarValue);
    });
  });
});
