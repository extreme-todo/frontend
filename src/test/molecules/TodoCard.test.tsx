import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { designTheme } from '../../styles/theme';
import { TodoCard } from '../../molecules';
import { mockFetchTodoList } from '../../../fixture/mockTodoList';
import { DraggableStateSnapshot } from 'react-beautiful-dnd';
import { EditContext } from '../../components/TodoList';

describe('TodoCard', () => {
  const mockTodo = mockFetchTodoList()[0];
  const renderTodoCard = (
    mockSnapshot: DraggableStateSnapshot,
    mockEditValue: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
  ) => {
    return render(
      <ThemeProvider theme={designTheme}>
        <EditContext.Provider value={mockEditValue}>
          <TodoCard
            todoData={mockTodo}
            dragHandleProps={undefined}
            snapshot={mockSnapshot}
          />
        </EditContext.Provider>
      </ThemeProvider>,
    );
  };

  describe('기본적으로 TodoCard는', () => {
    const mockSnapshot: DraggableStateSnapshot = {
      isDragging: false,
      isDropAnimating: false,
      isClone: false,
      dropAnimation: undefined,
      draggingOver: undefined,
      combineWith: undefined,
      combineTargetFor: undefined,
      mode: undefined,
    };
    it('Todo는 제목, 핸들 아이콘, 카테고리로 이루어져 있다.', () => {
      const { getByText, getByRole } = renderTodoCard(mockSnapshot, [
        false,
        () => {},
      ]);

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

  describe('drag 시에는', () => {
    const mockSnapshot: DraggableStateSnapshot = {
      isDragging: true,
      isDropAnimating: false,
      isClone: false,
      dropAnimation: undefined,
      draggingOver: undefined,
      combineWith: undefined,
      combineTargetFor: undefined,
      mode: undefined,
    };
    it('Todo의 카테고리가 숨겨진다.', () => {
      const { queryByText } = renderTodoCard(mockSnapshot, [false, () => {}]);

      const categories1 = queryByText('영어');
      const categories2 = queryByText('학교공부');
      expect(categories1).toBeNull();
      expect(categories2).toBeNull();
    });
  });
});
