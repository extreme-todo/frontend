import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mockLocalStorage } from '../../../fixture/mockLocalStorage';
import { render } from '@testing-library/react';
import { useTimeMarker } from '../../hooks';
import { todosApi } from '../../shared/apis';
import React from 'react';
import { ET_TIME_MARKER, setTimeInFormat } from '../../shared/timeUtils';
import { startOfYesterday } from 'date-fns';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const TestComponent = () => {
  useTimeMarker();
  return <div></div>;
};

let setTimeMakerParam: Date;
if (new Date().getHours() >= 5) {
  setTimeMakerParam = setTimeInFormat(new Date(), '05:00:00');
} else {
  setTimeMakerParam = setTimeInFormat(startOfYesterday(), '05:00:00');
}

const removeDidntDoStringify = JSON.stringify({
  removeDidntDo: setTimeMakerParam.getTime(),
});

describe('useTimeMarking', () => {
  const removeDidntDo = jest
    .spyOn(todosApi, 'removeDidntDo')
    .mockImplementation();

  const renderComponent = () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>,
    );
  };

  describe('localStorage에 ETTimeMarker 데이터가 없다면,', () => {
    beforeEach(() => {
      mockLocalStorage(
        jest.fn(),
        jest.fn((key: string, value: number) => ({
          [key]: value,
        })),
      );
      renderComponent();
    });
    it('removeDidntDo를 호출하고,', () => {
      expect(removeDidntDo).toBeCalled();
    });
    it('setItem를 호출해서 localStorage에 업데이트 기준일 새벽 5시의 milliseconds를 저장해준다.', () => {
      expect(localStorage.setItem).toBeCalledWith(
        ET_TIME_MARKER,
        removeDidntDoStringify,
      );
    });
  });

  describe('localStorage의 ETTimeMarker가 있고, removeDidntDo 프로퍼티가 없다면,', () => {
    beforeEach(() => {
      mockLocalStorage(
        jest.fn((key: string) => '{}'),
        jest.fn((key: string, value: number) => ({
          [key]: value,
        })),
      );
      renderComponent();
    });
    it('removeDidntDo를 호출하고,', () => {
      expect(removeDidntDo).toBeCalled();
    });
    it('setItem를 호출해서 localStorage에 업데이트 기준일 새벽 5시의 milliseconds를 저장해준다.', () => {
      expect(localStorage.setItem).toBeCalledWith(
        ET_TIME_MARKER,
        removeDidntDoStringify,
      );
    });
  });

  describe('localStorage의 ETTimeMarker에 removeDidntDo 프로퍼티가 있고,', () => {
    describe('업데이트를 한지 하루 이상이 됐다면,', () => {
      beforeEach(() => {
        const timeDiff = setTimeInFormat(
          new Date('2024-08-10'),
          '05:00:00',
        ).getTime();
        const timeDiffStringify = JSON.stringify({ removeDidntDo: timeDiff });

        mockLocalStorage(
          jest.fn((key: string) => timeDiffStringify),
          jest.fn((key: string, value: number) => ({
            [key]: value,
          })),
        );
        renderComponent();
      });
      it('removeDidntDo를 호출하고,', () => {
        expect(removeDidntDo).toBeCalled();
      });
      it('localStorage에 업데이트 기준일 새벽 5시의 milliseconds를 저장해준다.', () => {
        expect(localStorage.setItem).toBeCalledWith(
          ET_TIME_MARKER,
          removeDidntDoStringify,
        );
      });
    });
    describe('업데이트를 한지 하루가 안 됐다면', () => {
      beforeEach(() => {
        const timeDiff = setTimeInFormat(new Date()).getTime() - 400000;
        const timeDiffStringify = JSON.stringify({ removeDidntDo: timeDiff });

        mockLocalStorage(
          jest.fn((key: string) => timeDiffStringify),
          jest.fn((key: string, value: number) => ({
            [key]: value,
          })),
        );
        renderComponent();
      });
      it('removeDidntDo를 호출하지 않고,', () => {
        expect(removeDidntDo).not.toBeCalled();
      });
      it('localStorage도 업데이트 하지 않는다.', () => {
        expect(localStorage.setItem).not.toBeCalled();
      });
    });
  });
});
