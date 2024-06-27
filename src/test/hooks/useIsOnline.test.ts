import { renderHook } from '@testing-library/react';
import { useIsOnline } from '../../hooks/useIsOnline';

describe('useIsOnline', () => {
  describe('window.navigator.onLine이 true이면', () => {
    it('true를 반환한다.', () => {
      jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
      const {
        result: { current },
      } = renderHook(() => useIsOnline());
      expect(current).toBe(true);
    });
  });
  describe('window.navigator.onLine이 false면', () => {
    it('false를 반환한다.', () => {
      jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
      const {
        result: { current },
      } = renderHook(() => useIsOnline());
      expect(current).toBe(false);
    });
  });
});
