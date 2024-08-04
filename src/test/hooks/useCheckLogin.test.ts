import { renderHook } from '@testing-library/react';
import { userStub } from '../../../stubs';
import { useCheckLogin } from '../../hooks';
import { mockLocalStorage } from '../../../fixture/mockLocalStorage';

describe('useCheckLogin', () => {
  describe('localstorage에 extremeToken이 있으면', () => {
    beforeEach(() => {
      mockLocalStorage(
        jest.fn((key: string) => {
          if (key === 'extremeToken') return userStub().access;
          else if (key === 'extremeEmail') return userStub().email;
          else return null;
        }),
      );
    });
    it('isLogin state를 true로 초기화 해준다', () => {
      const { result } = renderHook(() => useCheckLogin());
      const isLogin = result.current;

      expect(isLogin).toBe(true);
    });
  });

  describe('localstorage에 extremeToken이 없으면', () => {
    beforeEach(() => {
      mockLocalStorage(jest.fn((key: string) => null));
    });
    it('isLogin state를 false로 초기화 해준다', () => {
      const { result } = renderHook(() => useCheckLogin());
      const isLogin = result.current;

      expect(isLogin).toBe(false);
    });
  });
});
