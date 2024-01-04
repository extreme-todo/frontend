import React from 'react';
import { ThemeProvider } from '@emotion/react';
import {
  act,
  fireEvent,
  getByText,
  render,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { designTheme } from '../../styles/theme';
import { TodoCard } from '../../molecules';
import { mockFetchTodoList } from '../../../fixture/mockTodoList';
import { DraggableStateSnapshot } from 'react-beautiful-dnd';
import { EditContextProvider } from '../../hooks';
import EditUI from '../../molecules/TodoCard/content/EditUI';
import { TodoEntity } from '../../DB/indexedAction';

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

  let renderTodoCard = (mockSnapshot: DraggableStateSnapshot) => {
    return render(
      <ThemeProvider theme={designTheme}>
        <EditContextProvider>
          <TodoCard
            todoData={mockTodo}
            dragHandleProps={undefined}
            snapshot={mockSnapshot}
          />
        </EditContextProvider>
      </ThemeProvider>,
    );
  };

  describe('TodoUI', () => {
    describe('TodoUI는', () => {
      it('Todo는 제목, 핸들 아이콘, 카테고리로 이루어져 있다.', () => {
        const { getByText, getByRole } = renderTodoCard(setMockSnapshot(false));

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
        const { queryByText } = renderTodoCard(setMockSnapshot(true));

        const categories1 = queryByText('영어');
        const categories2 = queryByText('학교공부');
        expect(categories1).not.toBeInTheDocument();
        expect(categories2).not.toBeInTheDocument();
      });
    });

    describe('TodoUI에', () => {
      it('onMouseOver 이벤트가 발생하면 수정 버튼이 노출된다.', () => {
        const { getByText } = renderTodoCard(setMockSnapshot(false));

        fireEvent.mouseOver(getByText('Go to grocery store'));

        act(() => {
          expect(getByText('수정')).toBeInTheDocument();
        });
      });

      it('onMouseOut 이벤트가 발생하면 수정 버튼이 사라진다.', () => {
        const { getByText, queryByText } = renderTodoCard(
          setMockSnapshot(false),
        );

        fireEvent.mouseOut(getByText('Go to grocery store'));
        expect(queryByText('수정')).not.toBeInTheDocument();
      });
    });

    describe('수정 버튼을 클릭하면', () => {
      it('해당 todoCard의 UI가 EditUI로 바뀐다.', async () => {
        renderTodoCard = (mockSnapshot: DraggableStateSnapshot) => {
          return render(
            <ThemeProvider theme={designTheme}>
              <EditContextProvider>
                <TodoCard
                  todoData={mockTodo}
                  dragHandleProps={undefined}
                  snapshot={mockSnapshot}
                />
                <TodoCard
                  todoData={mockFetchTodoList()[1]}
                  dragHandleProps={undefined}
                  snapshot={mockSnapshot}
                />
              </EditContextProvider>
            </ThemeProvider>,
          );
        };

        const { getByText, findByRole } = renderTodoCard(
          setMockSnapshot(false),
        );
        // 해당 todoCard UI
        const titleOne = getByText('Go to grocery store');
        expect(titleOne).toBeInTheDocument();
        // 다른 todoCard UI
        const titleTwo = getByText('Go to Gym');
        expect(titleTwo).toBeInTheDocument();

        fireEvent.mouseOver(titleOne);

        const editBtn = getByText('수정');
        fireEvent.click(editBtn);

        const titleInput = await findByRole('textbox', { name: 'title' });
        expect(titleOne).not.toBeInTheDocument();
        expect(titleInput).toBeInTheDocument();
        expect(titleTwo).toBeInTheDocument();
      });
    });
  });

  describe('EditUI', () => {
    let renderEditUI: () => ReturnType<typeof render>;

    beforeEach(() => {
      renderEditUI = () => {
        const renderResult = renderTodoCard(setMockSnapshot(false));

        const title = renderResult.getByText('Go to grocery store');
        fireEvent.mouseOver(title);

        const editBtn = renderResult.getByText('수정');
        fireEvent.click(editBtn);
        return renderResult;
      };
    });

    // 기본UI
    describe('EditUI는', () => {
      it('title input이 있고, title input에는 기존 title이 입력되어 있습니다.', () => {
        const { getByRole } = renderEditUI();
        const titleInput = getByRole('textbox', {
          name: /title/i,
        }) as HTMLInputElement;

        expect(titleInput).toBeInTheDocument();
        expect(titleInput.value).toBe('Go to grocery store');
      });

      it('title input에서 유저가 입력값을 수정할 수 있다.', () => {
        const { getByRole } = renderEditUI();
        const titleInput = getByRole('textbox', {
          name: /title/i,
        }) as HTMLInputElement;

        expect(titleInput.value).toBe('Go to grocery store');

        fireEvent.change(titleInput, { target: { value: 'modified title' } });
        expect(titleInput.value).toBe('modified title');
      });

      it('category input이 있고 빈 input이다.', () => {
        const { getByText, getByRole } = renderEditUI();
        expect(getByText('영어')).toBeInTheDocument();
        expect(getByText('학교공부')).toBeInTheDocument();

        const categoryInput = getByRole('textbox', {
          name: 'category_input',
        }) as HTMLInputElement;

        expect(categoryInput).toBeInTheDocument();
        expect(categoryInput.placeholder).toBe(
          '새 카테고리를 입력하고 엔터를 눌러주세요',
        );
        expect(categoryInput.value.length).toBe(0);
      });

      it('category input에는 유저가 입력값을 입력할 수 있다.', () => {
        const { getByRole } = renderEditUI();

        const categoryInput = getByRole('textbox', {
          name: 'category_input',
        }) as HTMLInputElement;

        fireEvent.change(categoryInput, {
          target: { value: 'add new category' },
        });

        expect(categoryInput.value).toBe('add new category');
      });

      // 날짜, 날짜 아이콘?, 날짜 수정 아이콘(이건 필요가 없을지도)

      // 토마토 아이콘, 토마토 드랍다운 버튼

      // 취소 버튼

      // 수정 버튼
    });

    // 카테고리 관련 (추가, 입력취소, 삭제)
    describe('Category', () => {
      // 무언가 입력되어 있으면 카테고리에 추가
      it('category input창에 카테고리를 입력하고 enter를 치면 새로운 카테고리가 추가된다.', () => {
        const { getByRole, queryAllByRole } = renderEditUI();

        const categoryInput = getByRole('textbox', { name: 'category_input' });
        let prevCategories = queryAllByRole('generic', {
          name: 'category_tag',
        });
        act(() => userEvent.type(categoryInput, '새 카테고리{enter}'));

        const nextCategories = queryAllByRole('generic', {
          name: 'category_tag',
        });
        expect(nextCategories.length).toBe(prevCategories.length + 1);
      });

      // 빈 창을 엔터하면 아무것도 일어나지 않음.
      it('input창이 비어있다면 아무것도 일어나지 않는다.', () => {
        const { getByRole, queryAllByRole } = renderEditUI();

        const categoryInput = getByRole('textbox', { name: 'category_input' });
        const prevCategories = queryAllByRole('generic', {
          name: 'category_tag',
        });

        act(() => userEvent.type(categoryInput, '{enter}'));

        const nextCategories = queryAllByRole('generic', {
          name: 'category_tag',
        });
        expect(nextCategories.length).toBe(prevCategories.length);
      });

      // 중복 입력 예외처리
      it('input된 값이 카테고리에 이미 존재하면 추가되지 않는다.', () => {
        const { queryAllByRole, getByRole } = renderEditUI();

        const categoryInput = getByRole('textbox', { name: 'category_input' });
        act(() => userEvent.type(categoryInput, '영어{enter}'));

        const Categories = queryAllByRole('generic', {
          name: 'category_tag',
        });
        const tagsContent = Categories.map((tag) => tag.textContent);
        const filtered = tagsContent.filter((tag) => tag == '영어');

        expect(filtered.length).toBe(1);
      });

      // 삭제로직
      it('존재하는 tag를 클릭하면 삭제된다.', () => {
        const { queryAllByRole, getByRole, getByText } = renderEditUI();

        const categoryInput = getByRole('textbox', { name: 'category_input' });
        act(() => userEvent.type(categoryInput, '수학공부{enter}'));

        const firstCheckPointCategories = queryAllByRole('generic', {
          name: 'category_tag',
        });
        expect(firstCheckPointCategories.length).toBe(3);

        const thirdTag = getByText('수학공부');
        act(() => userEvent.click(thirdTag));
        const secondCheckPointCategories = queryAllByRole('generic', {
          name: 'category_tag',
        });
        expect(secondCheckPointCategories.length).toBe(2);

        const firstTag = getByText('영어');
        act(() => userEvent.click(firstTag));
        const lastCheckPointCategories = queryAllByRole('generic', {
          name: 'category_tag',
        });
        expect(lastCheckPointCategories.length).toBe(1);
      });
    });

    // 날짜 관련 (날짜 수정, 수정 취소)
    // 토마토 수정 (토마토 수정, 토마토 토글, 수정, 수정 취소)
    // 취소버튼 눌렀을 때 그대로인 UI
    // 확인버튼 눌렀을 때 추가된 UI
  });
});

/*
QUESTION 태그는 어딜 눌러야 취소가 될까?
*/
