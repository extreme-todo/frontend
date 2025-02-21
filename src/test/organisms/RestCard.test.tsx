import { render, screen } from '@testing-library/react';
import { mockFetchTodoList } from '../../../fixture/mockTodoList';
import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';
import RestCard, { IRestCardProps } from '../../organisms/RestCard';
import { mockLocalStorage } from '../../../fixture/mockLocalStorage';
import {
  EXTREME_EMAIL_STORAGE,
  EXTREME_TOKEN_STORAGE,
} from '../../shared/apis';
import { userStub } from '../../../stubs';
import { PomodoroStatus } from '../../services/PomodoroService';

describe('CurrentTodo', () => {
  mockLocalStorage(
    jest.fn((key: string) => {
      if (key === EXTREME_TOKEN_STORAGE) return userStub().access;
      else if (key === EXTREME_EMAIL_STORAGE) return userStub().email;
      else if (key === 'pomodoro-settings')
        return '{"focusStep":10,"restStep":5,"isTimerEnabled":false}';
      else if (key === 'pomodoro-status')
        return '{"isResting":true,"isFocusing":false,"focusedTime":0,"restedTime":100000}';
      else return null;
    }),
    jest.fn(),
    jest.fn(),
  );

  function renderRestCard(props: IRestCardProps) {
    return render(
      <ThemeProvider theme={designTheme}>
        <RestCard {...{ ...props }}></RestCard>
      </ThemeProvider>,
    );
  }

  describe('휴식시간인 경우', () => {
    const component = renderRestCard({
      startFocusing: jest.fn(),
      canRest: true,
      doTodo: jest.fn(),
      isExtreme: false,
      todo: mockFetchTodoList()[0],
      pomodoro: {
        status: PomodoroStatus.RESTING,
        settings: {
          focusStep: 10,
          restStep: 10,
        },
        time: 1000,
      },
    });

    it('"남은 휴식시간" 텍스트를 출력한다', () => {
      const { findByText } = component;
      expect(findByText(/남은 휴식시간/)).toBeDefined();
    });

    it('duration만큼 다 마쳤다면 (canRest 가 true라면) "조금 더 집중하기" 텍스트를 출력한다', () => {
      const { findByText } = component;
      expect(findByText(/조금 더 집중하기/)).toBeDefined();
    });

    it('휴식시간 10분에서 1000ms 지난 9분 59초를 출력한다', () => {
      expect(
        screen.findAllByText((_, element) => {
          return element?.textContent === '0959';
        }),
      ).toBeDefined();
    });
  });
});
