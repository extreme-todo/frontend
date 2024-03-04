import React from 'react';

import { NowCard } from '../../molecules';

import { ThemeProvider } from '@emotion/react';

import { mockFetchTodoList } from '../../../fixture/mockTodoList';

import { render } from '@testing-library/react';

import { designTheme } from '../../styles/theme';
import { IChildProps } from '../../shared/interfaces';

describe('NowCard', () => {
  let renderer: ReturnType<typeof render>;
  beforeEach(() => {
    renderer = render(
      <NowCard currentTodo={mockFetchTodoList()[0]} focusStep={30} />,
      {
        wrapper: ({ children }: IChildProps) => (
          <ThemeProvider theme={designTheme}>{children}</ThemeProvider>
        ),
      },
    );
  });
  describe('NowCard는', () => {
    it('Todo의 타이틀을 렌더링 한다.', () => {
      const { getByText } = renderer;

      expect(getByText('Go to grocery store')).toBeInTheDocument();
    });
    it('Todo의 시간을 렌더링 한다.', () => {
      const { getByText } = renderer;

      expect(getByText('⏱️ 1시간 30분')).toBeInTheDocument();
    });
    it('Todo의 태그를 렌더링 한다.', () => {
      const { getByText } = renderer;

      const category1 = getByText('영어');
      const category2 = getByText('학교공부');

      expect(category1).toBeInTheDocument();
      expect(category2).toBeInTheDocument();
    });
  });
});
