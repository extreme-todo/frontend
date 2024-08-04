import { act, render } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { Ranking, IRankingProps } from '../../organisms';
import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';
import { ICategory, IRanking } from '../../shared/interfaces';
import { dummyRanking } from '../../shared/constants';
import { AxiosResponse } from 'axios';

describe('Ranking', () => {
  function renderRanking(props: IRankingProps) {
    return render(
      <ThemeProvider theme={designTheme}>
        <Ranking {...props} />
      </ThemeProvider>,
    );
  }

  const fakeFetchRanking = (ranking) => {
    return jest.fn(
      jest.fn().mockResolvedValue({
        data: ranking as IRanking,
      } as AxiosResponse<IRanking>),
    );
  };

  const fakeFetchCategories = (categories) => {
    return jest.fn(
      jest.fn().mockResolvedValue({
        data: categories as ICategory[],
      } as AxiosResponse<ICategory[]>),
    );
  };

  // TODO: 테스트 코드 수정 필요

  describe('모든 경우에', () => {
    it('타이틀 텍스트를 렌더한다', () => {
      const props = {
        fetchCategories: fakeFetchCategories([]),
        fetchRanking: fakeFetchRanking({}),
        isLogin: true,
      };
      // act(() => {
      //   const { getByText } = renderRanking(props);
      //   expect(getByText(/카테고리 별 랭킹/)).not.toBeNull();
      // });
    });
  });

  // describe('로그인 하지 않은 경우', () => {
  //   it('LogInToUnlock을 렌더하고, 데이터를 페치하지 않는다.', () => {
  //     const { getByText } = renderRanking({});
  //     expect(
  //       getByText(/로그인하고 카테고리 별 랭킹을 확인해보세요!/),
  //     ).not.toBeNull();
  //   });
  // });

  // describe('로그인한 경우', () => {
  //   it('기록 데이터를 페치하고 기록 데이터를 렌더한다.', () => {
  //     const fetchRanking = jest.fn().mockResolvedValue({
  //       daily: 207,
  //       weekly: 3098,
  //       monthly: -20325,
  //     });
  //     const { getByText } = renderRanking({ fetchRanking });
  //     expect(fetchRanking).toBeCalled();
  //     expect(getByText(/207/)).not.toBeNull();
  //     expect(getByText(/3,098/)).not.toBeNull();
  //     expect(getByText(/-20,325/)).not.toBeNull();
  //   });
  // });
});
