import React from 'react';

import { CategoryInput } from '../../molecules';

import { IChildProps } from '../../shared/interfaces';

import { designTheme } from '../../styles/theme';
import { ThemeProvider } from '@emotion/react';

import { TodoEntity } from '../../DB/indexedAction';

import { mockFetchTodoList } from '../../../fixture/mockTodoList';

import { render } from '@testing-library/react';

describe('CategoryInput', () => {
  let renderUI: () => ReturnType<typeof render>;
  let mockTodo: TodoEntity;
  const mockHandleSubmit = jest.fn();
  const mockHandleClick = jest.fn();
  const mockHandleChangeCategory = jest.fn();

  beforeEach(() => {
    mockTodo = mockFetchTodoList()[0];
    renderUI = () =>
      render(
        <CategoryInput
          categories={mockTodo.categories}
          category={''}
          handleSubmit={mockHandleSubmit}
          handleClick={mockHandleClick}
          handleChangeCategory={mockHandleChangeCategory}
        />,
        {
          wrapper: ({ children }: IChildProps) => (
            <ThemeProvider theme={designTheme}>{children}</ThemeProvider>
          ),
        },
      );
  });
  describe('CategoryInput은', () => {
    it('input이 있다.', () => {
      const { getByRole } = renderUI();
      const input = getByRole('textbox', { name: 'category_input' });

      expect(input).toBeInTheDocument();
    });

    it('input은 빈 input이다.', () => {
      const { getByText, getByRole } = renderUI();
      expect(getByText('영어')).toBeInTheDocument();
      expect(getByText('학교공부')).toBeInTheDocument();

      const categoryInput = getByRole('textbox', {
        name: 'category_input',
      }) as HTMLInputElement;

      expect(categoryInput).toBeInTheDocument();
      expect(categoryInput.placeholder).toBe('카테고리를 입력하세요');
      expect(categoryInput.value.length).toBe(0);
    });

    it('최초에 설정된 태그가 있다.', () => {
      const { getAllByRole } = renderUI();

      const categories = getAllByRole('button', { name: 'category_tag' });

      expect(categories.length).toBe(2);
    });
  });
});
