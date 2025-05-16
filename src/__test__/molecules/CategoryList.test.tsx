import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';
import CategoryList, { ICategoryListProps } from '../../molecules/CategoryList';
import { render } from '@testing-library/react';
import React from 'react';

describe('Clock', () => {
  function renderList(props: ICategoryListProps) {
    return render(
      <ThemeProvider theme={designTheme}>
        <CategoryList {...{ ...props }} />
      </ThemeProvider>,
    );
  }

  describe('study, work 카테고리를 입력하면', () => {
    it('study, work 태그가 출력된다', () => {
      const { getByText } = renderList({
        categories: ['study', 'work'],
      });
      expect(getByText(/study/)).not.toBeNull();
      expect(getByText(/work/)).not.toBeNull();
    });
  });

  describe('study, work, music 카테고리를 입력하면', () => {
    it('study, work, music 태그가 출력된다', () => {
      const { getByText } = renderList({
        categories: ['study', 'work', 'music'],
      });
      expect(getByText(/study/)).not.toBeNull();
      expect(getByText(/work/)).not.toBeNull();
      expect(getByText(/music/)).not.toBeNull();
    });
  });
});
