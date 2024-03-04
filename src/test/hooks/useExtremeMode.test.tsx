import { RenderResult, fireEvent, render, screen } from '@testing-library/react';
import {useExtremeMode } from '../../hooks';
import React from 'react';
import { mockLocalStorage } from '../../../fixture/mockLocalStorage';
import { DEFAULT_IS_EXTREME, ExtremeModeProvider } from '../../hooks/useExtremeMode';
import PomodoroProvider from '../../hooks/usePomodoro';
ExtremeModeProvider

describe('useExtremeMode', () => {
  let component: RenderResult;
  const WrapperComponent = ({ children }) => (
    <PomodoroProvider>
      <ExtremeModeProvider>{children}</ExtremeModeProvider>
    </PomodoroProvider>
  );
  const TestExtremeMode = () => {
    const {isExtreme, setMode} = useExtremeMode()
    return (
      <>
        isExtreme:{String(isExtreme)}
        <button
          data-testid="setMode"
          onClick={() => setMode(true)}
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
          <TestExtremeMode />, {wrapper: WrapperComponent}
      );
    });

    it('초기값이 출력된다', () => {
      const { getByText } = component;
      expect(
        getByText(
          new RegExp('isExtreme:' + DEFAULT_IS_EXTREME),
        ),
      ).toBeDefined();
    });
  });

  describe('localStorage에 기존 데이터가 있을 때', () => {
    const mockData = true;


    beforeEach(() => {
      mockLocalStorage(
        jest.fn((key: string) => null),
        jest.fn((key: string) => {
          return JSON.stringify(mockData)
        }),
      );
      component = render(
          <TestExtremeMode />,{wrapper: WrapperComponent}
      );
    });

    it('localStorage의 데이터를 렌더링한다', () => {
      const { findByText } = component;
    screen.logTestingPlaygroundURL();

      expect(
        findByText(new RegExp('isExtreme:' + mockData)),
      ).toBeDefined();
    });
  });

  describe('버튼을 클릭하면', () => {
    beforeEach(() => {
      mockLocalStorage(
        jest.fn((key: string) => null),
        jest.fn((key: string, data: string) => null),
      );
      component = render(
          <TestExtremeMode></TestExtremeMode> , {wrapper: WrapperComponent}
      );
      fireEvent.click(component.getByTestId('setMode'));
    });

    it('isExtreme true가 된다.', () => {
      const { getByText } = component;
      expect(getByText(/isExtreme:true/)).toBeDefined();
    });
  });
});
