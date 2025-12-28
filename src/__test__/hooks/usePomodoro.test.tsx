import { RenderResult, fireEvent, render } from '@testing-library/react';
import {
  usePomodoroValue,
  usePomodoroActions,
  PomodoroProvider,
  initialPomodoroData,
} from '../../hooks';
import React, { act, useEffect } from 'react';
import { mockLocalStorage } from '../../../fixture/mockLocalStorage';
import {
  PomodoroService,
  PomodoroFocusingStatus,
} from '../../services/PomodoroService';

jest.useFakeTimers();
describe('usePomodoro', () => {
  let component: RenderResult;
  const WrapperComponent = ({ children }) => (
    <PomodoroProvider>{children}</PomodoroProvider>
  );
  const TestPomodoro = (expectedFocusStep, expectedRestStep) => {
    const { settings, status, time } = usePomodoroValue();
    const { startFocusing, startResting, setFocusStep, setRestStep } =
      usePomodoroActions();

    // Start the Pomodoro timer when the app loads
    useEffect(() => {
      const startTimer = PomodoroService.startTimer().subscribe();
      return () => {
        startTimer.unsubscribe();
      };
    }, []);

    return (
      <>
        focusStep:{settings.focusStep} <br />
        restStep:{settings.restStep} <br />
        isFocusing:{status === PomodoroFocusingStatus.FOCUSING
          ? time
          : 'false'}{' '}
        <br />
        isResting:{status === PomodoroFocusingStatus.RESTING
          ? time
          : 'false'}{' '}
        <br />
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
    });
  });

  describe('localStorage에 기존 데이터가 있을 때', () => {
    const mockData = {
      settings: {
        focusStep: 345,
        restStep: 987,
      },
    };

    beforeEach(() => {
      mockLocalStorage(
        jest.fn((key: string) => {
          if (key === 'pomodoro-settings')
            return JSON.stringify(mockData.settings);
          else return null;
        }),
      );
      component = render(
        <WrapperComponent>
          <TestPomodoro />
        </WrapperComponent>,
      );
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.clearAllTimers();
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
      jest.useFakeTimers();
      fireEvent.click(component.getByTestId('startFocusButton'));
    });

    afterEach(() => {
      jest.clearAllTimers();
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
      jest.useFakeTimers();
      fireEvent.click(component.getByTestId('startRestButton'));
    });

    afterEach(() => {
      jest.clearAllTimers();
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
