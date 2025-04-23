import React, { act } from 'react';

import { AddTodo } from '../../components';

import { render } from '@testing-library/react';

import { IChildProps } from '../../shared/interfaces';

import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';
import userEvent from '@testing-library/user-event';
import { PomodoroProvider } from '../../hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('AddTodo', () => {
  describe('AddTodo에는', () => {
    let renderUI: () => ReturnType<typeof render>;

    beforeEach(() => {
      renderUI = () =>
        render(<AddTodo handleClose={jest.fn} />, {
          wrapper: ({ children }: IChildProps) => (
            <QueryClientProvider client={queryClient}>
              <ThemeProvider theme={designTheme}>
                <PomodoroProvider>{children}</PomodoroProvider>
              </ThemeProvider>
            </QueryClientProvider>
          ),
        });
    });

    it('제목 input이 있다.', () => {
      const { getByRole } = renderUI();

      const titleInput = getByRole('textbox', { name: 'title input' });

      expect(titleInput).toBeInTheDocument();
    });

    it('제목 input에 입력을 할 수 있다.', () => {
      const { getByRole } = renderUI();

      const titleInput = getByRole('textbox', {
        name: 'title input',
      }) as HTMLInputElement;

      act(() => userEvent.type(titleInput, '새로운 할 일 제목 입니다'));

      expect(titleInput.value).toBe('새로운 할 일 제목 입니다');
    });

    // 태그 input이 있다.
    it('카테고리 input이 있다.', () => {
      const { getByRole } = renderUI();
      const category = getByRole('textbox', { name: /category input/i });

      expect(category).toBeInTheDocument();
    });

    it('카테고리 input에 입력할 수 있다.', () => {
      const { getByRole } = renderUI();
      const categoryInput = getByRole('textbox', {
        name: /category input/i,
      }) as HTMLInputElement;

      act(() => userEvent.type(categoryInput, '새로운 카테고리'));

      expect(categoryInput.value).toBe('새로운 카테고리');
    });

    it('카테고리 input을 입력하고 Enter 키를 누르면 새로운 태그가 추가된다.', () => {
      const { getByRole, getAllByRole } = renderUI();

      const categoryInput = getByRole('textbox', {
        name: /category input/i,
      }) as HTMLInputElement;
      const prevCategories = getAllByRole('button');
      act(() => userEvent.type(categoryInput, '새로운 카테고리{enter}'));

      const nextCategories = getAllByRole('button');

      expect(nextCategories.length).toBe(prevCategories.length + 1);
    });

    it('카테고리 input이 비어있는채로 엔터를 입력하면 추가되지 않는다.', () => {
      const { getByRole, getAllByRole } = renderUI();
      const categoryInput = getByRole('textbox', { name: /category input/i });
      const beforeAllButton = getAllByRole('button');
      act(() => userEvent.type(categoryInput, '{enter}'));
      const afterAllButton = getAllByRole('button');
      expect(beforeAllButton.length).toBe(afterAllButton.length);
    });

    it('카테고리 input에 입력된 값이 이미 존재하면 추가되지 않는다.', () => {
      const { queryAllByRole, getByRole } = renderUI();

      const categoryInput = getByRole('textbox', { name: 'category input' });
      act(() => userEvent.type(categoryInput, '영어{enter}'));
      act(() => userEvent.type(categoryInput, '영어{enter}'));

      const categories = queryAllByRole('button', {
        name: /영어/i,
      });
      const tagsContent = categories.map((tag) => tag.textContent);
      const filtered = tagsContent.filter((tag) => tag == '영어');

      expect(filtered.length).toBe(1);
    });

    it('카테고리 갯수가 5개를 초과하면 카테고리 input을 없앤다.', () => {
      const { getByRole, queryByRole } = renderUI();

      const categoryInput = getByRole('textbox', { name: /category input/i });

      act(() => userEvent.type(categoryInput, '첫 번째 카테고리{enter}'));
      act(() => userEvent.type(categoryInput, '두 번째 카테고리{enter}'));
      act(() => userEvent.type(categoryInput, '세 번째 카테고리{enter}'));
      act(() => userEvent.type(categoryInput, '네 번째 카테고리{enter}'));
      act(() => userEvent.type(categoryInput, '다섯 번째 카테고리{enter}'));

      const removedInput = queryByRole('textbox', { name: /category input/i });

      expect(removedInput).toBe(null);
    });

    it('카테고리 값에 특수문자와 이모지가 있으면 추가되지 않고 경고 메시지를 보여준다.', () => {
      const { getByRole, getAllByRole, getByText } = renderUI();

      const categoryInput = getByRole('textbox', { name: /category input/i });

      const prevCategories = getAllByRole('button');
      act(() => userEvent.type(categoryInput, '🇰🇷 대한민국 최고{enter}'));

      const errorMessage = getByText(/숫자,특수문자/i);
      const afterCategories = getAllByRole('button');
      expect(errorMessage).toBeInTheDocument();
      expect(afterCategories.length).toBe(prevCategories.length);
    });

    it('카테고리 input은 20자 이상은 추가되지 않고 경고 메시지를 보여준다.', () => {
      const { getByRole, getByText, getAllByRole } = renderUI();
      const categoryInput = getByRole('textbox', { name: /category input/i });
      let prevCategories = getAllByRole('button');
      act(() =>
        userEvent.type(
          categoryInput,
          'I really psyched up starting new 2024!!!{enter}',
        ),
      );
      const errorMessage = getByText(/이하로만 입력할 수 있습니다/i);
      const nextCategories = getAllByRole('button');

      expect(nextCategories.length).toBe(prevCategories.length);
      expect(errorMessage).toBeInTheDocument();
    });

    it('카테고리 input은 한 칸 이상의 띄워쓴 곳은 한 칸 띄어쓰기로 교체하고 가장 앞뒤쪽의 띄어쓰기는 삭제해서 추가한다.', () => {
      const { getByRole, getByText } = renderUI();
      const categoryInput = getByRole('textbox', { name: /category input/i });
      act(() =>
        userEvent.type(categoryInput, '   Welcome   to  my world{enter}'),
      );
      const category = getByText('Welcome to my world');
      expect(category).toBeInTheDocument();
    });

    it('등록된 카테고리 태그는 클릭하면 삭제된다.', () => {
      const { getByRole, getAllByRole, getByText } = renderUI();

      const categoryInput = getByRole('textbox', {
        name: /category input/i,
      });
      act(() => userEvent.type(categoryInput, '수학공부{enter}'));

      const firstCheckPointCategories = getAllByRole('button');
      const thirdTag = getByText('수학공부');
      act(() => userEvent.click(thirdTag));

      const secondCheckPointCategories = getAllByRole('button');
      expect(secondCheckPointCategories.length).toBe(
        firstCheckPointCategories.length - 1,
      );
    });

    it('토마토 input이 존재한다.', () => {
      const { getByLabelText } = renderUI();
      const tomato = getByLabelText('slider');
      expect(tomato).toBeInTheDocument();
    });

    it('닫기 버튼이 있다.', () => {
      const { getByRole } = renderUI();
      const closeBtn = getByRole('button', {
        name: 'close',
      });
      expect(closeBtn).toBeInTheDocument();
    });

    it('제출 버튼이 있다.', () => {
      const { getByRole } = renderUI();
      const submitBtn = getByRole('button', {
        name: 'submit',
      });
      expect(submitBtn).toBeInTheDocument();
    });

    it('title이 50자 이상 입력되면 더 이상 입력되지 않는다.', () => {
      const { getByRole } = renderUI();
      const titleInput = getByRole('textbox', {
        name: /title input/i,
      }) as HTMLInputElement;
      act(() => userEvent.type(titleInput, 'a'.repeat(50) + 'b'));

      expect(titleInput.value[titleInput.value.length - 1]).toBe('a');
    });

    it('title을 비워두면 제출 버튼이 disabled된다.', () => {
      const { getByRole } = renderUI();
      const categoryInput = getByRole('textbox', {
        name: 'category input',
      }) as HTMLInputElement;
      const submitBtn = getByRole('button', {
        name: 'submit',
      });
      act(() => userEvent.click(categoryInput));
      expect(submitBtn).toBeDisabled();
    });
  });
});
