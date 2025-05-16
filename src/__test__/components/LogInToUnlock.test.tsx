import { fireEvent, render } from '@testing-library/react';
import { LogInToUnlock, ILogInToUnlockProps } from '../../molecules';
import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';

describe('LogInToUnlock', () => {
  function renderLogInToUnlock(props: ILogInToUnlockProps) {
    // DISCUSSION: 테스트 단위에서 테마를 제공하는 더 좋은 방법이나 테마를 무시할 수 있는 방법이 없을까?
    return render(
      <ThemeProvider theme={designTheme}>
        <LogInToUnlock {...props} />
      </ThemeProvider>,
    );
  }
  describe('subLabel 프랍을 넘길 경우', () => {
    it('subLabel 텍스트를 렌더링', () => {
      const { getByText } = renderLogInToUnlock({
        navigate: () => {},
        subLabel: 'subLabel',
      });
      expect(getByText(/subLabel/)).not.toBeNull();
    });
  });

  describe('label 프랍을 넘길 경우', () => {
    it('label 텍스트를 렌더링', () => {
      const { getByText } = renderLogInToUnlock({
        navigate: () => {},
        label: 'label',
      });
      expect(getByText(/label/)).not.toBeNull();
    });
  });

  describe('navigate 프랍만 넘길 경우', () => {
    it('기본 텍스트를 렌더링', () => {
      const { getByText } = renderLogInToUnlock({
        navigate: jest.fn(),
      });
      expect(getByText(/로그인이 필요한 기능입니다./)).not.toBeNull();
      expect(getByText(/로그인하고 기능을 확인해보세요!/)).not.toBeNull();
    });

    it('navigate 버튼을 누르면 로직 실행', () => {
      const handleNavigate = jest.fn();
      const { getByText } = renderLogInToUnlock({
        navigate: handleNavigate,
      });
      fireEvent.click(getByText('로그인하기'));
      expect(handleNavigate).toBeCalled();
    });
  });
});
