import React from 'react';

import { CategoryInput } from '../../molecules';

import { IChildProps } from '../../shared/interfaces';

import { designTheme } from '../../styles/theme';
import { ThemeProvider } from '@emotion/react';

import { TodoEntity } from '../../DB/indexedAction';

import { mockFetchTodoList } from '../../../fixture/mockTodoList';

import { fireEvent, render } from '@testing-library/react';

describe('CategoryInput', () => {
  let renderUI: () => ReturnType<typeof render>;
  let mockTodo: TodoEntity;
  const mockHandleSubmit = jest.fn();
  const mockHandleClick = jest.fn();

  beforeEach(() => {
    mockTodo = mockFetchTodoList()[0];
    renderUI = () =>
      render(
        <CategoryInput
          categories={mockTodo.categories}
          handleSubmit={mockHandleSubmit}
          handleClick={mockHandleClick}
        />,
        {
          wrapper: ({ children }: IChildProps) => (
            <ThemeProvider theme={designTheme}>{children}</ThemeProvider>
          ),
        },
      );
  });
  describe('CategoryInput은', () => {
    it('category input이 있다.', () => {
      const { getByRole } = renderUI();
      const input = getByRole('textbox', { name: 'category_input' });

      expect(input).toBeInTheDocument();
    });

    it('category input이 있고 빈 input이다.', () => {
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

    it('category input에는 유저가 입력값을 입력할 수 있다.', () => {
      const { getByRole } = renderUI();

      const categoryInput = getByRole('textbox', {
        name: 'category_input',
      }) as HTMLInputElement;

      fireEvent.change(categoryInput, {
        target: { value: 'add new category' },
      });

      expect(categoryInput.value).toBe('add new category');
    });
  });
});
