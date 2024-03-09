import React from 'react';

import { AddTodo } from '../../components';

import { act, fireEvent, render } from '@testing-library/react';

import { IChildProps } from '../../shared/interfaces';

import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';
import userEvent from '@testing-library/user-event';

describe('AddTodo', () => {
  describe('AddTodo에는', () => {
    let renderUI: () => ReturnType<typeof render>;
    let spyAlert: jest.SpyInstance<void, [message?: any]>;

    beforeEach(() => {
      spyAlert = jest.spyOn(window, 'alert').mockImplementation();
      renderUI = () =>
        render(<AddTodo />, {
          wrapper: ({ children }: IChildProps) => (
            <ThemeProvider theme={designTheme}>{children}</ThemeProvider>
          ),
        });
    });

    it('제목 input이 있다.', () => {
      const { getByRole } = renderUI();

      const titleInput = getByRole('textbox', { name: 'title' });

      expect(titleInput).toBeInTheDocument();
    });

    it('제목 input에 입력을 할 수 있다.', () => {
      const { getByRole } = renderUI();

      const titleInput = getByRole('textbox', {
        name: 'title',
      }) as HTMLInputElement;

      act(() => userEvent.type(titleInput, '새로운 할 일 제목 입니다'));

      expect(titleInput.value).toBe('새로운 할 일 제목 입니다');
    });

    // 태그 input이 있다.
    it('카테고리 input이 있다.', () => {
      const { getByRole } = renderUI();
      const category = getByRole('textbox', { name: 'category' });

      expect(category).toBeInTheDocument();
    });

    it('카테고리 input에 입력할 수 있다.', () => {
      const { getByRole } = renderUI();
      const categoryInput = getByRole('textbox', {
        name: 'category',
      }) as HTMLInputElement;

      act(() => userEvent.type(categoryInput, '새로운 카테고리'));

      expect(categoryInput.value).toBe('새로운 카테고리');
    });

    it('카테고리 input을 입력하고 Enter 키를 누르면 새로운 태그가 추가된다.', () => {
      const { getByRole, queryAllByRole } = renderUI();

      const categoryInput = getByRole('textbox', {
        name: 'category',
      }) as HTMLInputElement;
      const prevCategories = queryAllByRole('button', { name: 'category_tag' });
      act(() => userEvent.type(categoryInput, '새로운 카테고리{enter}'));

      const nextCategories = queryAllByRole('button', {
        name: 'category_tag',
      });

      expect(nextCategories.length).toBe(prevCategories.length + 1);
    });

    it('카테고리 input이 비어있는채로 엔터를 입력하면 추가되지 않고 alert창을 띄워준다.', () => {
      const { getByRole, queryAllByRole } = renderUI();

      const categoryInput = getByRole('textbox', { name: 'category' });
      const prevCategories = queryAllByRole('button', {
        name: 'category_tag',
      });

      act(() => userEvent.type(categoryInput, '{enter}'));

      const nextCategories = queryAllByRole('button', {
        name: 'category_tag',
      });
      expect(nextCategories.length).toBe(prevCategories.length);
      expect(spyAlert).toBeCalledTimes(1);
    });

    it('카테고리 input에 입력된 값이 이미 존재하면 추가되지 않고 alert창을 띄워준다.', () => {
      const { queryAllByRole, getByRole } = renderUI();

      const categoryInput = getByRole('textbox', { name: 'category' });
      act(() => userEvent.type(categoryInput, '영어{enter}'));
      act(() => userEvent.type(categoryInput, '영어{enter}'));

      const categories = queryAllByRole('button', {
        name: 'category_tag',
      });
      const tagsContent = categories.map((tag) => tag.textContent);
      const filtered = tagsContent.filter((tag) => tag == '영어');

      expect(filtered.length).toBe(1);
      expect(spyAlert).toBeCalledTimes(1);
    });

    it('카테고리 갯수가 5개를 초과하면 카테고리 input을 없앤다.', () => {
      const { getByRole, queryByRole } = renderUI();

      const categoryInput = getByRole('textbox', { name: 'category' });

      act(() => userEvent.type(categoryInput, '첫 번째 카테고리{enter}'));
      act(() => userEvent.type(categoryInput, '두 번째 카테고리{enter}'));
      act(() => userEvent.type(categoryInput, '세 번째 카테고리{enter}'));
      act(() => userEvent.type(categoryInput, '네 번째 카테고리{enter}'));
      act(() => userEvent.type(categoryInput, '다섯 번째 카테고리{enter}'));

      const removedInput = queryByRole('textbox', { name: 'category' });

      expect(removedInput).toBe(null);
    });

    it('카테고리 값에 특수문자와 이모지가 있으면 추가되지 않고 alert창을 띄워준다.', () => {
      const { getByRole, queryAllByRole } = renderUI();

      const categoryInput = getByRole('textbox', { name: 'category' });
      let prevCategories = queryAllByRole('button', { name: 'category_tag' });

      act(() =>
        userEvent.type(categoryInput, '나는 우주 최강이 될태야!{enter}'),
      );
      act(() => userEvent.type(categoryInput, '🇰🇷 대한민국 최고{enter}'));
      act(() => userEvent.type(categoryInput, 'Let‘s hit the road!!{enter}'));

      const nextCategories = queryAllByRole('button', {
        name: 'category_tag',
      });

      expect(nextCategories.length).toBe(prevCategories.length);
      expect(spyAlert).toBeCalledTimes(3);
    });

    it('카테고리 input은 20자 이상은 추가되지 않고 alert창을 띄워준다.', () => {
      const { getByRole, queryAllByRole } = renderUI();

      const categoryInput = getByRole('textbox', { name: 'category' });

      let prevCategories = queryAllByRole('button', { name: 'category_tag' });

      act(() =>
        userEvent.type(
          categoryInput,
          'I really psyched up starting new 2024!!!{enter}',
        ),
      );

      const nextCategories = queryAllByRole('button', {
        name: 'category_tag',
      });

      expect(nextCategories.length).toBe(prevCategories.length);
      expect(spyAlert).toBeCalledTimes(1);
    });

    it('카테고리 input은 한 칸 이상의 띄워쓴 곳은 한 칸 띄어쓰기로 교체하고 가장 앞뒤쪽의 띄어쓰기는 삭제해서 추가한다.', () => {
      const { getByRole, queryAllByRole } = renderUI();

      const categoryInput = getByRole('textbox', { name: 'category' });

      act(() =>
        userEvent.type(categoryInput, '   Welcome   to  my world{enter}'),
      );

      const categories = queryAllByRole('button', {
        name: 'category_tag',
      });
      const newCategory = categories[categories.length - 1].textContent;
      expect(newCategory).toBe('Welcome to my world');
    });

    it('등록된 카테고리 태그는 클릭하면 삭제된다.', () => {
      const { queryAllByRole, getByRole, getByText } = renderUI();

      const categoryInput = getByRole('textbox', {
        name: 'category',
      });
      act(() => userEvent.type(categoryInput, '수학공부{enter}'));

      const firstCheckPointCategories = queryAllByRole('button', {
        name: 'category_tag',
      });
      expect(firstCheckPointCategories.length).toBe(1);

      const thirdTag = getByText('수학공부');
      act(() => userEvent.click(thirdTag));
      const secondCheckPointCategories = queryAllByRole('button', {
        name: 'category_tag',
      });
      expect(secondCheckPointCategories.length).toBe(0);
    });

    // 날짜 input 존재
    it('날짜 input이 존재한다.', () => {
      const { getByRole } = renderUI();
      const calendar = getByRole('textbox', { name: 'calendar' });

      expect(calendar).toBeInTheDocument();
    });

    // 날짜 input에는 오늘 날짜가 들어가 있다.

    // tomato input이 존재한다.
    it('토마토 input이 존재한다.', () => {
      const { getByRole } = renderUI();
      const tomato = getByRole('slider', { name: 'tomato' });

      expect(tomato).toBeInTheDocument();
    });

    // tomato input 조절가능함
    it('tomato input에 토마토를 설정할 수 있다.', () => {
      const { getByRole } = renderUI();
      const tomato = getByRole('slider', {
        name: 'tomato',
      }) as HTMLInputElement;

      act(() => fireEvent.change(tomato, { target: { value: 3 } }));

      expect(tomato.value).toBe('3');
    });

    // 제출할 때 title이 비어있으면 에러 띄우기
  });
});
