import { RenderResult, fireEvent, render } from '@testing-library/react';
import {
  usePomodoroValue,
  usePomodoroActions,
  PomodoroProvider,
  initialPomodoroData,
  focusStep,
  restStep,
} from '../../hooks';
import React, { act } from 'react';
import { mockLocalStorage } from '../../../fixture/mockLocalStorage';
import { PomodoroFocusingStatus } from '../../services/PomodoroService';

describe('usePomodoro', () => {
  let component: RenderResult;
  const WrapperComponent = ({ children }: { children: React.ReactNode }) => (
    <PomodoroProvider>{children}</PomodoroProvider>
  );
  const TestPomodoro = () => {
    const { settings, status, time } = usePomodoroValue();
    const { startFocusing, startResting } = usePomodoroActions();

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
          <TestPomodoro />
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
    const mockData: { focusStep: focusStep; restStep: restStep } = {
      focusStep: 10,
      restStep: 5,
    };

    beforeEach(() => {
      mockLocalStorage(
        jest.fn((key: string) => {
          if (key === 'pomodoro-settings') return JSON.stringify(mockData);
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
        getByText(new RegExp('focusStep:' + mockData.focusStep)),
      ).toBeDefined();
      expect(
        getByText(new RegExp('restStep:' + mockData.restStep)),
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
  });
});
