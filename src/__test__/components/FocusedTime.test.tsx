import { render, screen, fireEvent } from '@testing-library/react';
import { FocusedTime } from '../../components';
import React from 'react';
import { ICategory, IFocusTime } from '../../shared/interfaces';
import { categoryApi, timerApi } from '../../shared/apis';
import { formatTime } from '../../shared/timeUtils';
import {
  UIProviders,
  QueryProvider,
  LogicProviders,
} from '../../contexts/AppProviders';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

jest.mock('react-apexcharts', () => ({
  __esModule: true,
  default: () => <div />,
}));

describe('FocusedTime Component', () => {
  const mockCategories: ICategory[] = [
    { id: 1, name: '일' },
    { id: 2, name: '공부' },
  ];
  const mockRecordData: { data: IFocusTime } = {
    data: {
      total: {
        start: '2025-05-15T00:00:00Z',
        end: '2025-05-15T23:59:59Z',
        focused: 3600000,
        prevFocused: 1800000,
      },
      values: [
        { start: 8, end: 10, focused: 1200000 },
        { start: 10, end: 12, focused: 2400000 },
      ],
    },
  };

  beforeEach(() => {
    categoryApi.getCategories = jest
      .fn()
      .mockImplementation(() => mockCategories);
    timerApi.getRecords = jest.fn().mockImplementation(() => mockRecordData);
  });

  const renderComponent = () =>
    render(
      <UIProviders>
        <QueryProvider queryClient={queryClient}>
          <FocusedTime
            handleClose={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        </QueryProvider>
      </UIProviders>,
    );

  it('처음 진입하면 모든 카테고리에 대한 데이터를 요청한다', async () => {
    renderComponent();
    expect(timerApi.getRecords).toHaveBeenCalledWith(
      -new Date().getTimezoneOffset(),
      'day',
    );

    const expectedTime = formatTime(
      Math.floor(
        (mockRecordData.data.total.focused -
          mockRecordData.data.total.prevFocused) /
          60000,
      ),
    );

    // 텍스트가 여러 노드에 나뉘어 있을 수 있으므로 정규표현식이나 함수형 매처 사용
    expect(
      await screen.findByText(new RegExp(expectedTime)),
    ).toBeInTheDocument();
  });

  it('Day, Week, Month를 클릭하면 각 버튼이 활성화되며 데이터를 요청한다', () => {
    renderComponent();
    const dayButton = screen.getByText('Day');
    const weekButton = screen.getByText('Week');
    const monthButton = screen.getByText('Month');

    fireEvent.click(weekButton);
    expect(timerApi.getRecords).toHaveBeenCalledWith(
      -new Date().getTimezoneOffset(),
      'week',
    );
    fireEvent.click(monthButton);
    expect(timerApi.getRecords).toHaveBeenCalledWith(
      -new Date().getTimezoneOffset(),
      'month',
    );
    fireEvent.click(dayButton);
    expect(timerApi.getRecords).toHaveBeenCalledWith(
      -new Date().getTimezoneOffset(),
      'day',
    );
  });

  it('모든 카테고리를 렌더하고, 각 버튼을 클릭하면 데이터를 요청한다', () => {
    renderComponent();
    mockCategories.forEach((category) => {
      const categoryButton = screen.getByText(category.name);
      fireEvent.click(categoryButton);
      expect(timerApi.getRecords).toHaveBeenCalled();
    });
  });
});
