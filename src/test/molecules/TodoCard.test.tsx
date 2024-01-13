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

        const titleInput = await findByRole('textbox', { name: 'title_input' });
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
          '카테고리를 입력하고 엔터를 눌러주세요',
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

    describe('Category', () => {
      let spyAlert: jest.SpyInstance<void, [message?: any]>;
      beforeEach(() =>
        (spyAlert = jest.spyOn(window, 'alert')).mockImplementation(),
      );

      it('category input창에 카테고리를 입력하고 enter를 치면 새로운 카테고리가 추가된다.', () => {
        const { getByRole, queryAllByRole } = renderEditUI();

        const categoryInput = getByRole('textbox', { name: 'category_input' });
        let prevCategories = queryAllByRole('button', { name: 'category_tag' });

        act(() => userEvent.type(categoryInput, '새 카테고리{enter}'));

        const nextCategories = queryAllByRole('button', {
          name: 'category_tag',
        });
        expect(nextCategories.length).toBe(prevCategories.length + 1);
      });

      it('input창이 비어있는채로 엔터를 입력하면 추가되지 않고 alert창을 띄워준다.', () => {
        const { getByRole, queryAllByRole } = renderEditUI();

        const categoryInput = getByRole('textbox', { name: 'category_input' });
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

      it('input된 값이 카테고리에 이미 존재하면 추가되지 않고 alert창을 띄워준다.', () => {
        const { queryAllByRole, getByRole } = renderEditUI();

        const categoryInput = getByRole('textbox', { name: 'category_input' });
        act(() => userEvent.type(categoryInput, '영어{enter}'));

        const categories = queryAllByRole('button', {
          name: 'category_tag',
        });
        const tagsContent = categories.map((tag) => tag.textContent);
        const filtered = tagsContent.filter((tag) => tag == '영어');

        expect(filtered.length).toBe(1);
        expect(spyAlert).toBeCalledTimes(1);
      });

      it('태그가 5개를 초과하면 더 이상 추가되지 않고 alert창을 띄워준다.', () => {
        const { getByRole, queryAllByRole } = renderEditUI();

        const categoryInput = getByRole('textbox', { name: 'category_input' });

        act(() => userEvent.type(categoryInput, '첫 번째 카테고리{enter}'));
        act(() => userEvent.type(categoryInput, '두 번째 카테고리{enter}'));
        act(() => userEvent.type(categoryInput, '세 번째 카테고리{enter}'));

        let prevCategories = queryAllByRole('button', { name: 'category_tag' });

        act(() => userEvent.type(categoryInput, '네 번째 카테고리{enter}'));

        const nextCategories = queryAllByRole('button', {
          name: 'category_tag',
        });

        expect(nextCategories.length).toBe(prevCategories.length);
        expect(spyAlert).toBeCalledTimes(1);
      });

      it('카테고리 값에 특수문자와 이모지가 있으면 추가되지 않고 alert창을 띄워준다.', () => {
        const { getByRole, queryAllByRole } = renderEditUI();

        const categoryInput = getByRole('textbox', { name: 'category_input' });
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

      it('20자 이상은 추가되지 않고 alert창을 띄워준다.', () => {
        const { getByRole, queryAllByRole } = renderEditUI();

        const categoryInput = getByRole('textbox', { name: 'category_input' });

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

      it('한 칸 이상의 띄워쓴 곳은 한 칸 띄어쓰기로 교체 및 가장 앞뒤쪽의 띄어쓰기는 삭제해서 추가한다.', () => {
        const { getByRole, queryAllByRole } = renderEditUI();

        const categoryInput = getByRole('textbox', { name: 'category_input' });

        act(() =>
          userEvent.type(categoryInput, '   Welcome   to  my world{enter}'),
        );

        const categories = queryAllByRole('button', {
          name: 'category_tag',
        });
        const newCategory = categories[categories.length - 1].textContent;
        expect(newCategory).toBe('Welcome to my world');
      });

      it('존재하는 tag를 클릭하면 삭제된다.', () => {
        const { queryAllByRole, getByRole, getByText } = renderEditUI();

        const categoryInput = getByRole('textbox', {
          name: 'category_input',
        });
        act(() => userEvent.type(categoryInput, '수학공부{enter}'));

        const firstCheckPointCategories = queryAllByRole('button', {
          name: 'category_tag',
        });
        expect(firstCheckPointCategories.length).toBe(3);

        const thirdTag = getByText('수학공부');
        act(() => userEvent.click(thirdTag));
        const secondCheckPointCategories = queryAllByRole('button', {
          name: 'category_tag',
        });
        expect(secondCheckPointCategories.length).toBe(2);

        const firstTag = getByText('영어');
        act(() => userEvent.click(firstTag));
        const lastCheckPointCategories = queryAllByRole('button', {
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
