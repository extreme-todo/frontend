import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { fireEvent, render } from '@testing-library/react';
import { designTheme } from '../../styles/theme';
import { TodoCard } from '../../molecules';
import { mockFetchTodoList } from '../../../fixture/mockTodoList';
import { DraggableStateSnapshot } from 'react-beautiful-dnd';
import { EditContext } from '../../components/TodoList';
import { act } from 'react-dom/test-utils';

describe('TodoCard', () => {
  const mockTodo = mockFetchTodoList()[0];
  const setMockSnapshot = (isDragging: boolean) => {
    return {
      isDragging,
      isDropAnimating: false,
      isClone: false,
      dropAnimation: undefined,
      draggingOver: undefined,
      combineWith: undefined,
      combineTargetFor: undefined,
      mode: undefined,
    };
  };
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
    it('Todo는 제목, 핸들 아이콘, 카테고리로 이루어져 있다.', () => {
      const { getByText, getByRole } = renderTodoCard(setMockSnapshot(false), [
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
    it('Todo의 카테고리가 숨겨진다.', () => {
      const { queryByText } = renderTodoCard(setMockSnapshot(true), [
        false,
        () => {},
      ]);

      const categories1 = queryByText('영어');
      const categories2 = queryByText('학교공부');
      expect(categories1).not.toBeInTheDocument();
      expect(categories2).not.toBeInTheDocument();
    });
  });

  describe('TodoCard에', () => {
    it('onMouseOver 이벤트가 발생하면 수정 버튼이 노출된다.', () => {
      const { getByText } = renderTodoCard(setMockSnapshot(false), [
        false,
        () => {},
      ]);

      fireEvent.mouseOver(getByText('Go to grocery store'));

      act(() => {
        expect(getByText('수정')).toBeInTheDocument();
      });
    });

    it('onMouseOut 이벤트가 발생하면 수정 버튼이 사라진다.', () => {
      const { getByText, queryByText } = renderTodoCard(
        setMockSnapshot(false),
        [false, () => {}],
      );

      fireEvent.mouseOut(getByText('Go to grocery store'));

      expect(queryByText('수정')).not.toBeInTheDocument();
    });
  });

  describe('수정 버튼을 클릭하면', () => {
    it('context의 edit이 true로 바뀐다.', () => {
      let isEdit = false;
      const setIsEdit = (prevEdit: boolean) => {
        isEdit = prevEdit;
      };
      const { getByText } = renderTodoCard(setMockSnapshot(false), [
        isEdit,
        setIsEdit as React.Dispatch<React.SetStateAction<boolean>>,
      ]);

      fireEvent.mouseOver(getByText('Go to grocery store'));

      const editBtn = getByText('수정');
      expect(editBtn).toBeInTheDocument();

      fireEvent.click(editBtn);
      expect(isEdit).toBe(true);
    });
  });
});
