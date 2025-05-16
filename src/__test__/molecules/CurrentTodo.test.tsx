import { render } from '@testing-library/react';
import { TodoEntity } from '../../DB/indexedAction';
import { mockFetchTodoList } from '../../../fixture/mockTodoList';
import { CurrentTodo } from '../../organisms';
import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';

describe('CurrentTodo', () => {
  const mockCurrentTodo: TodoEntity = mockFetchTodoList()[0];
  let component: ReturnType<typeof renderRanking>;
  const mockDoTodoProp = jest.fn();
  function renderRanking(todo: TodoEntity) {
    return render(
      <ThemeProvider theme={designTheme}>
        <CurrentTodo
          todo={todo}
          doTodo={mockDoTodoProp}
          focusStep={10}
          focusedOnTodo={10}
          startResting={jest.fn()}
        ></CurrentTodo>
        ,
      </ThemeProvider>,
    );
  }

  describe('Todo가 존재하는 경우', () => {
    beforeEach(() => {
      component = renderRanking(mockCurrentTodo);
    });

    it('투두 제목을 렌더링한다', () => {
      const { getByText } = component;
      expect(getByText(mockCurrentTodo.todo)).toBeDefined();
    });

    it('카테고리를 렌더링한다', () => {
      const { getByText } = component;
      mockCurrentTodo.categories?.forEach((category) => {
        expect(getByText(category)).toBeDefined();
      });
    });

    it('시간(뽀모도로 단위)를 렌더링한다', () => {
      const { getByText } = component;
      expect(
        getByText(mockCurrentTodo.duration, { exact: false }),
      ).toBeDefined();
    });
  });
});
