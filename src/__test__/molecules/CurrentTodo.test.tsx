import { render } from '@testing-library/react';
import { TodoEntity } from '../../DB/indexedAction';
import { mockFetchTodoList } from '../../../fixture/mockTodoList';
import { CurrentTodo } from '../../organisms';
import { AppProviders } from '../../contexts/AppProviders';
import { QueryClient } from '@tanstack/react-query';

describe('CurrentTodo', () => {
  const mockCurrentTodo: TodoEntity = mockFetchTodoList()[0];
  let component: ReturnType<typeof renderRanking>;
  const mockDoTodoProp = jest.fn();
  function renderRanking(todo: TodoEntity) {
    return render(
      <AppProviders
        queryClient={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <CurrentTodo
          todo={todo}
          doTodo={mockDoTodoProp}
          focusStep={10}
          focusedOnTodo={10}
          currentRound={0}
        ></CurrentTodo>
        ,
      </AppProviders>,
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

    it('시간(뽀모도로 단위)를 렌더링한다', () => {
      const { getByText } = component;
      expect(
        getByText(`🍅 `.repeat(mockCurrentTodo.duration).trim(), {
          exact: false,
        }),
      ).toBeDefined();
    });
  });
});
