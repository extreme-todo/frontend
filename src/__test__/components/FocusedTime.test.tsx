import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FocusedTime } from '../../components';
import React from 'react';
import { ICategory, IFocusTime } from '../../shared/interfaces';
import { categoryApi, timerApi, usersApi } from '../../shared/apis';
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
  const mockWeekRecordData: { data: IFocusTime } = {
    data: {
      total: {
        start: '2025-05-11T00:00:00Z',
        end: '2025-05-17T23:59:59Z',
        focused: 3600000 * 5,
        prevFocused: 1800000 * 5,
      },
      values: [
        { day: 'mon', focused: 3600000 },
        { day: 'tue', focused: 3600000 },
      ],
    },
  };
  const mockMonthRecordData: { data: IFocusTime } = {
    data: {
      total: {
        start: '2025-05-01T00:00:00Z',
        end: '2025-05-31T23:59:59Z',
        focused: 3600000 * 20,
        prevFocused: 1800000 * 20,
      },
      values: [
        { week: '1', focused: 3600000 * 5 },
        { week: '2', focused: 3600000 * 5 },
      ],
    },
  };

  beforeEach(() => {
    usersApi.getMe = jest
      .fn()
      .mockResolvedValue({ data: { email: 'test@test.com' } });
    categoryApi.getCategories = jest
      .fn()
      .mockImplementation(() => mockCategories);
    timerApi.getRecords = jest.fn().mockImplementation((_, unit) => {
      if (unit === 'day') return mockRecordData;
      if (unit === 'week') return mockWeekRecordData;
      if (unit === 'month') return mockMonthRecordData;
      return mockRecordData;
    });
  });

  const renderComponent = () =>
    render(
      <UIProviders>
        <QueryProvider queryClient={queryClient}>
          <LogicProviders>
            <FocusedTime
              handleClose={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
          </LogicProviders>
        </QueryProvider>
      </UIProviders>,
    );

  it('처음 진입하면 모든 카테고리에 대한 데이터를 요청한다', async () => {
    renderComponent();
    await waitFor(() => {
      expect(timerApi.getRecords).toHaveBeenCalledWith(
        -new Date().getTimezoneOffset(),
        'day',
      );
    });
    expect(
      await screen.findByText(
        new RegExp(
          `\\+${formatTime(
            Math.floor(
              (mockRecordData.data.total.focused -
                mockRecordData.data.total.prevFocused) /
                60000,
            ),
          )}`,
        ),
      ),
    ).toBeInTheDocument();
  });

  it('Day, Week, Month를 클릭하면 각 버튼이 활성화되며 데이터를 요청한다', async () => {
    renderComponent();
    const dayButton = await screen.findByText('Day');
    const weekButton = screen.getByText('Week');
    const monthButton = screen.getByText('Month');

    fireEvent.click(weekButton);
    await waitFor(() => {
      expect(timerApi.getRecords).toHaveBeenCalledWith(
        -new Date().getTimezoneOffset(),
        'week',
      );
    });
    fireEvent.click(monthButton);
    await waitFor(() => {
      expect(timerApi.getRecords).toHaveBeenCalledWith(
        -new Date().getTimezoneOffset(),
        'month',
      );
    });
    fireEvent.click(dayButton);
    await waitFor(() => {
      expect(timerApi.getRecords).toHaveBeenCalledWith(
        -new Date().getTimezoneOffset(),
        'day',
      );
    });
  });

  it('모든 카테고리를 렌더하고, 각 버튼을 클릭하면 데이터를 요청한다', async () => {
    renderComponent();
    for (const category of mockCategories) {
      const categoryButton = await screen.findByText(category.name);
      fireEvent.click(categoryButton);
      await waitFor(() => {
        expect(timerApi.getRecords).toHaveBeenCalled();
      });
    }
  });
});
