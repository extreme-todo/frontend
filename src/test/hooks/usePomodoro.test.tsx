import { RenderResult, act, fireEvent, render } from '@testing-library/react';
import { usePomodoroValue, usePomodoroActions } from '../../hooks';
import PomodoroProvider, { initialPomodoroData } from '../../hooks/usePomodoro';
import React from 'react';
import { mockLocalStorage } from '../../../fixture/mockLocalStorage';

jest.useFakeTimers();
describe('usePomodoro', () => {
  let component: RenderResult;
  const WrapperComponent = ({ children }) => (
    <PomodoroProvider>{children}</PomodoroProvider>
  );
  const TestPomodoro = (expectedFocusStep, expectedRestStep) => {
    const { settings, status } = usePomodoroValue();
    const { startFocusing, startResting, setFocusStep, setRestStep } =
      usePomodoroActions();
    return (
      <>
        focusStep:{settings.focusStep} <br />
        restStep:{settings.restStep} <br />
        isFocusing:{status.isFocusing ? status.focusedTime : 'false'} <br />
        isResting:{status.isResting ? status.restedTime : 'false'} <br />
        <button data-testid="startFocusButton" onClick={startFocusing}></button>
        <button data-testid="startRestButton" onClick={startResting}></button>
        <button
          data-testid="setFocusStep"
          onClick={() => {
            setFocusStep(expectedFocusStep);
          }}
        ></button>
        <button
          data-testid="setRestStep"
          onClick={() => setRestStep(expectedRestStep)}
        ></button>
      </>
    );
  };

  describe('처음 렌더링 되었을 때', () => {
    beforeEach(() => {
      mockLocalStorage(
        jest.fn((key: string) => null),
        jest.fn((key: string, data: string) => null),
      );
      component = render(
        <WrapperComponent>
          <TestPomodoro></TestPomodoro>
        </WrapperComponent>,
      );
    });

    it('초기값이 출력된다', () => {
      const { getByText } = component;
      expect(
        getByText(
          new RegExp('focusStep:' + initialPomodoroData.settings.focusStep),
        ),
      ).toBeDefined();
      expect(
        getByText(
          new RegExp('restStep:' + initialPomodoroData.settings.restStep),
        ),
      ).toBeDefined();
      expect(getByText(new RegExp('isFocusing:false'))).toBeDefined();
      expect(
        getByText(
          new RegExp('isResting:' + initialPomodoroData.status.restedTime),
        ),
      ).toBeDefined();
    });
  });

  describe('localStorage에 기존 데이터가 있을 때', () => {
    const mockData = {
      settings: {
        focusStep: 345,
        restStep: 987,
      },
      status: {
        isFocusing: false,
        isResting: true,
        restedTime: 2000,
        focusedTime: 0,
      },
    };

    beforeEach(() => {
      mockLocalStorage(
        jest.fn((key: string) => {
          if (key === 'pomodoro-settings')
            return JSON.stringify(mockData.settings);
          else if (key === 'pomodoro-status')
            return JSON.stringify(mockData.status);
          else return null;
        }),
      );
      component = render(
        <WrapperComponent>
          <TestPomodoro />
        </WrapperComponent>,
      );
    });

    it('localStorage의 데이터를 렌더링한다', () => {
      const { getByText } = component;
      expect(
        getByText(new RegExp('focusStep:' + mockData.settings.focusStep)),
      ).toBeDefined();
      expect(
        getByText(new RegExp('restStep:' + mockData.settings.restStep)),
      ).toBeDefined();
      expect(getByText(new RegExp('isFocusing:false'))).toBeDefined();
      expect(
        getByText(new RegExp('isResting:' + mockData.status.restedTime)),
      ).toBeDefined();
    });
  });

  describe('집중을 시작하면', () => {
    beforeEach(() => {
      mockLocalStorage(
        jest.fn((key: string) => null),
        jest.fn((key: string, data: string) => null),
      );
      component = render(
        <WrapperComponent>
          <TestPomodoro />
        </WrapperComponent>,
      );
      fireEvent.click(component.getByTestId('startFocusButton'));
    });

    it('isResting이 false가 된다.', () => {
      const { getByText } = component;
      expect(getByText(/isResting:false/)).toBeDefined();
    });

    it('10초 뒤, focusedTime이 1000이 된다', async () => {
      const { getByText } = component;
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(getByText(/isFocusing:1000/)).toBeDefined();
    });
  });

  describe('휴식을 시작하면', () => {
    beforeEach(() => {
      mockLocalStorage(
        jest.fn((key: string) => null),
        jest.fn((key: string, data: string) => null),
      );
      component = render(
        <WrapperComponent>
          <TestPomodoro />
        </WrapperComponent>,
      );
      fireEvent.click(component.getByTestId('startRestButton'));
    });

    it('isFocusing false가 된다.', () => {
      const { getByText } = component;
      expect(getByText(/isFocusing:false/)).toBeDefined();
    });

    it('10초 뒤, restedTime이 1000이 된다', async () => {
      const { getByText } = component;
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(getByText(/isResting:1000/)).toBeDefined();
    });
  });
});
