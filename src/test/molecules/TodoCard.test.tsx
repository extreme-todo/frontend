import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { fireEvent, getByRole, render, waitFor } from '@testing-library/react';
import { designTheme } from '../../styles/theme';
import { TodoCard } from '../../molecules';
import { mockFetchTodoList } from '../../../fixture/mockTodoList';
import { DraggableStateSnapshot } from 'react-beautiful-dnd';
import { EditContext, IEdit } from '../../components/TodoList';
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
  let mockIsEdit: IEdit;
  const mockSetIsEdit = ((prevEdit: IEdit) => {
    mockIsEdit = {
      ...mockIsEdit,
      ...prevEdit,
    };
  }) as React.Dispatch<React.SetStateAction<IEdit>>;
  let renderTodoCard = (
    mockSnapshot: DraggableStateSnapshot,
    mockEditValue: [IEdit, React.Dispatch<React.SetStateAction<IEdit>>],
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

  describe('TodoUI', () => {
    beforeEach(() => {
      mockIsEdit = (() => {
        return { editMode: false, editTodoId: undefined };
      })();
    });
    describe('TodoUI는', () => {
      it('Todo는 제목, 핸들 아이콘, 카테고리로 이루어져 있다.', () => {
        const { getByText, getByRole } = renderTodoCard(
          setMockSnapshot(false),
          [{ editMode: false, editTodoId: undefined }, () => {}],
        );

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
          { editMode: false, editTodoId: undefined },
          () => {},
        ]);

        const categories1 = queryByText('영어');
        const categories2 = queryByText('학교공부');
        expect(categories1).not.toBeInTheDocument();
        expect(categories2).not.toBeInTheDocument();
      });
    });

    describe('TodoUI에', () => {
      it('onMouseOver 이벤트가 발생하면 수정 버튼이 노출된다.', () => {
        const { getByText } = renderTodoCard(setMockSnapshot(false), [
          { editMode: false, editTodoId: undefined },
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
          [{ editMode: false, editTodoId: undefined }, () => {}],
        );

        fireEvent.mouseOut(getByText('Go to grocery store'));

        expect(queryByText('수정')).not.toBeInTheDocument();
      });
    });

    describe('수정 버튼을 클릭하면', () => {
      it('context의 editMode가 true로 바뀌고 editTodoId에 id값 1이 할당된다.', () => {
        const { getByText } = renderTodoCard(setMockSnapshot(false), [
          mockIsEdit,
          mockSetIsEdit,
        ]);

        fireEvent.mouseOver(getByText('Go to grocery store'));

        const editBtn = getByText('수정');
        expect(editBtn).toBeInTheDocument();

        fireEvent.click(editBtn);
        expect(mockIsEdit.editMode).toBe(true);
        expect(mockIsEdit.editTodoId).toBe(1);
      });

      it('해당 todoCard의 UI가 EditUI로 바뀐다.', () => {
        const { getByText, getByRole, queryByText } = renderTodoCard(
          setMockSnapshot(false),
          [mockIsEdit, mockSetIsEdit],
        );

        fireEvent.mouseOver(getByText('Go to grocery store'));
        expect(queryByText('Go to grocery store')).toBeInTheDocument();

        const editBtn = getByText('수정');
        fireEvent.click(editBtn);

        expect(queryByText('Go to grocery store')).toBeInTheDocument();

        waitFor(() => {
          expect(queryByText('Go to grocery store')).not.toBeInTheDocument();
          expect(getByRole('textbox')).toBeInTheDocument();
        });
      });
    });
  });

  describe('EditUI', () => {
    beforeEach(() => {
      mockIsEdit = (() => {
        return { editMode: true, editTodoId: 1 };
      })();
    });

    describe('EditUI는', () => {
      // TODO : 카테고리 추가버튼, 날짜, 날짜수정 버튼, 토마토 아이콘, 토마토 수정 토글 버튼(누르면 토글창 내려와야 됨), 취소버튼, 수정버튼
      let renderFn: ReturnType<typeof renderTodoCard>;
      beforeEach(() => {
        renderFn = renderTodoCard(setMockSnapshot(false), [
          mockIsEdit,
          mockSetIsEdit,
        ]);
      });

      it('input가 있고, input에는 기존 title이 입력되어 있습니다.', () => {
        const { getByRole } = renderFn;
        const target = getByRole('textbox') as HTMLInputElement;

        expect(target).toBeInTheDocument();
        expect(target.value).toBe('Go to grocery store');
      });

      it('categories와 category 추가 버튼이 있습니다.', () => {
        const { getByText } = renderFn;
        expect(getByText('영어')).toBeInTheDocument();
        expect(getByText('학교공부')).toBeInTheDocument();
      });
    });
  });
});
