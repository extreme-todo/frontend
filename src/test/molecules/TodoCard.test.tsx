import { ThemeProvider } from '@emotion/react';
import { fireEvent, render } from '@testing-library/react';
import { designTheme } from '../../styles/theme';
import { TodoCard } from '../../molecules';
import { mockFetchTodoList } from '../../../fixture/mockTodoList';

describe('TodoCard', () => {
  const mockTodo = mockFetchTodoList()[0];
  const renderTodoCard = () => {
    return render(
      <ThemeProvider theme={designTheme}>
        <TodoCard todoData={mockTodo} dragProps={undefined} />
      </ThemeProvider>,
    );
  };
  describe('TodoCard는', () => {
    it('Todo는 제목, 핸들 아이콘, 카테고리로 이루어져 있다.', () => {
      const { getByText, getByRole } = renderTodoCard();

      const title = getByText('Go to grocery store');
      expect(title).toBeInTheDocument();

      const handleIcon = getByRole('img');
      expect(handleIcon).toBeInTheDocument();

      const categories1 = getByText('영어');
      const categories2 = getByText('학교공부');
      expect(categories1).toBeInTheDocument();
      expect(categories2).toBeInTheDocument();
    });
  });
});
