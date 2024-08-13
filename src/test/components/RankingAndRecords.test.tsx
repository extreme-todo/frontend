import { fireEvent, render, act, waitFor } from '@testing-library/react';
import React from 'react';
import { RankingAndRecords } from '../../components';
import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';
import { LoginProvider } from '../../hooks';
import { mockLocalStorage } from '../../../fixture/mockLocalStorage';
import { userStub } from '../../../stubs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('RankingAndRecords', () => {
  mockLocalStorage(
    jest.fn((key: string) => {
      if (key === 'extremeToken') return userStub().access;
      else if (key === 'extremeEmail') return userStub().email;
      else return null;
    }),
    jest.fn(),
    jest.fn(),
  );
  function renderRankingAndRecords() {
    return render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={designTheme}>
          <LoginProvider>
            <RankingAndRecords />
          </LoginProvider>
        </ThemeProvider>
      </QueryClientProvider>,
    );
  }

  describe('처음 페이지가 렌더링 될 때', () => {
    it('Ranking 출력', () => {
      const { getByTestId } = renderRankingAndRecords();
      act(() => {
        expect(getByTestId('ranking-component')).not.toBeNull();
      });
    });
  });

  describe('나의 집중 기록 버튼을 클릭했을 때', () => {
    it('Records 출력', () => {
      const { getByRole, getByTestId } = renderRankingAndRecords();
      const toggleButton = getByRole('button', {
        name: /나의 집중 기록/i,
      });
      act(() => {
        fireEvent.click(toggleButton);
        expect(getByTestId('records-component')).not.toBeNull();
      });
    });
  });
});
