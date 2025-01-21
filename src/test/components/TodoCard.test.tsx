import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { TodoCard } from '../../components';
import EditUI from '../../components/TodoCard/content/EditUI';

import { EditContextProvider } from '../../hooks';

import { IChildProps } from '../../shared/interfaces';

import { mockFetchTodoList } from '../../../fixture/mockTodoList';

import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';

import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapperCreator = ({ children }: IChildProps) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={designTheme}>
      <EditContextProvider>{children}</EditContextProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

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

  let renderUI = (MainUI: JSX.Element, wrapperUI: typeof wrapperCreator) => {
    return render(MainUI, { wrapper: wrapperUI });
  };

  describe('TodoUI', () => {
    describe('TodoUI는', () => {
      it('Todo는 제목이 있다.', () => {
        const { getByText } = renderUI(
          <TodoCard
            todoData={mockTodo}
            dragHandleProps={undefined}
            snapshot={setMockSnapshot(false)}
          />,
          wrapperCreator,
        );
        const title = getByText('Go to grocery store');
        expect(title).toBeInTheDocument();
      });
      it('Todo는 카테고리가 있다.', () => {
        const { getByText } = renderUI(
          <TodoCard
            todoData={mockTodo}
            dragHandleProps={undefined}
            snapshot={setMockSnapshot(false)}
          />,
          wrapperCreator,
        );
        const categories1 = getByText('영어');
        const categories2 = getByText('학교공부');
        expect(categories1).toBeInTheDocument();
        expect(categories2).toBeInTheDocument();
      });
    });

    describe('drag 시에는', () => {
      it('Todo의 카테고리가 숨겨진다.', () => {
        const { queryByText } = renderUI(
          <TodoCard
            todoData={mockTodo}
            dragHandleProps={undefined}
            snapshot={setMockSnapshot(true)}
          />,
          wrapperCreator,
        );

        const categories1 = queryByText('영어');
        const categories2 = queryByText('학교공부');
        expect(categories1).not.toBeInTheDocument();
        expect(categories2).not.toBeInTheDocument();
      });
    });

    describe('남은 TodoUI에는', () => {
      it('수정 버튼이 있다.', () => {
        const { getByText } = renderUI(
          <TodoCard
            todoData={mockTodo}
            dragHandleProps={undefined}
            snapshot={setMockSnapshot(false)}
          />,
          wrapperCreator,
        );

        fireEvent.mouseOver(getByText('Go to grocery store'));

        act(() => {
          expect(getByText('수정')).toBeInTheDocument();
        });
      });
      it('삭제 버튼이 있다.', () => {
        const { getByText } = renderUI(
          <TodoCard
            todoData={mockTodo}
            dragHandleProps={undefined}
            snapshot={setMockSnapshot(false)}
          />,
          wrapperCreator,
        );

        fireEvent.mouseOver(getByText('Go to grocery store'));

        act(() => {
          expect(getByText('삭제')).toBeInTheDocument();
        });
      });
      it('소요 시간이 있다.', () => {});
      it('핸들러 아이콘이 있다.', () => {});
    });

    describe('남은 TodoUI의 수정 버튼을 클릭하면', () => {
      it('해당 todoCard의 UI가 EditUI로 바뀐다.', async () => {
        const { getByText, getAllByText, findByRole } = renderUI(
          <>
            <TodoCard
              todoData={mockTodo}
              dragHandleProps={undefined}
              snapshot={setMockSnapshot(false)}
            />
            <TodoCard
              todoData={mockFetchTodoList()[1]}
              dragHandleProps={undefined}
              snapshot={setMockSnapshot(false)}
            />
          </>,
          wrapperCreator,
        );
        // 해당 todoCard UI
        const titleOne = getByText('Go to grocery store');
        expect(titleOne).toBeInTheDocument();
        // 다른 todoCard UI
        const titleTwo = getByText('Go to Gym');
        expect(titleTwo).toBeInTheDocument();

        fireEvent.mouseOver(titleOne);

        const editBtn = getAllByText('수정');
        fireEvent.click(editBtn[0]);

        const titleInput = await findByRole('textbox', { name: 'title_input' });
        expect(titleOne).not.toBeInTheDocument();
        expect(titleInput).toBeInTheDocument();
        expect(titleTwo).toBeInTheDocument();
      });
    });

    describe('진행 중인 TodoUI에는', () => {
      it('수정 버튼이 없다.', () => {});
      it('삭제 버튼이 없다.', () => {});
      it('진행중 태그가 있다.', () => {});
    });

    describe('완료한 TodoUI에는', () => {
      it('소요 시간이 없다.', () => {});
      it('삭제 버튼이 없다.', () => {});
      it('수정 버튼이 없다.', () => {});
      it('핸들러 아이콘이 없다.', () => {});
    });
  });

  describe('EditUI', () => {
    let renderEditUI: () => ReturnType<typeof render>;

    beforeEach(() => {
      renderEditUI = () => {
        const renderResult = renderUI(
          <TodoCard
            todoData={mockTodo}
            dragHandleProps={undefined}
            snapshot={setMockSnapshot(false)}
          />,
          wrapperCreator,
        );

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

      //  TODO : categoryInput
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

      it('기존 category가 있다.', () => {
        const { getByText } = renderEditUI();
        expect(getByText('영어')).toBeInTheDocument();
        expect(getByText('학교공부')).toBeInTheDocument();
      });

      it('day input에 기존 date가 설정되어 있다.', () => {
        const { getByRole } = renderEditUI();
        const calendar = getByRole('textbox', {
          name: 'calendar_input',
        }) as HTMLInputElement;

        expect(calendar.value).toBe('2023-08-08');
      });

      // 토마토 아이콘, 토마토 드랍다운 버튼
      it('Tomato 텍스트와 select 태그가 있다.', () => {
        const { getByText, getByRole } = renderEditUI();

        const tomato = getByText('🍅');
        const select = getByRole('combobox', { name: 'tomato_select' });

        expect(tomato).toBeInTheDocument();
        expect(select).toBeInTheDocument();
      });

      it('default 값과 1부터 10까지의 option, 총 11개의 option 태그가 있다.', () => {
        const { getAllByRole } = renderEditUI();
        const options = getAllByRole('option', { name: 'tomato_option' });

        expect(options).toBeDefined();
        expect(options.length).toBe(11);
      });

      // 취소 버튼
      it('취소 버튼이 있다.', () => {
        const { getByAltText } = renderEditUI();

        const cancelBtn = getByAltText('cancel_edit');

        expect(cancelBtn).toBeInTheDocument();
      });

      // 수정 버튼
      it('제출 버튼이 있다.', () => {
        const { getByAltText } = renderEditUI();

        const submitBtn = getByAltText('submit_edit');

        expect(submitBtn).toBeInTheDocument();
      });
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

      it('태그가 5개를 초과하면 category_input 태그을 없앤다.', () => {
        const { getByRole, queryAllByRole, queryByRole } = renderEditUI();

        const categoryInput = getByRole('textbox', { name: 'category_input' });

        act(() => userEvent.type(categoryInput, '첫 번째 카테고리{enter}'));
        act(() => userEvent.type(categoryInput, '두 번째 카테고리{enter}'));
        act(() => userEvent.type(categoryInput, '세 번째 카테고리{enter}'));

        const removedInput = queryByRole('textbox', { name: 'category_input' });

        expect(removedInput).toBe(null);
      });

      it('category를 입력하면 유효성 검사를 해서 alert창을 띄워준다.', () => {
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

      it('존재하는 category를 클릭하면 삭제된다.', () => {
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

    // 토마토 수정 (토마토 수정, 토마토 토글, 수정, 수정 취소)
    describe('Tomato', () => {
      it('option 태그를 클릭하면 select 값이 바뀐다.', () => {
        const { getByRole, getAllByRole } = renderEditUI();

        let select = getByRole('combobox', {
          name: 'tomato_select',
        }) as HTMLSelectElement;

        expect(select.selectedIndex).toBe(3);

        const options = getAllByRole('option', { name: 'tomato_option' });

        act(() => userEvent.selectOptions(select, options[1]));

        select = getByRole('combobox', {
          name: 'tomato_select',
        }) as HTMLSelectElement;

        expect(select.selectedIndex).toBe(1);
      });
    });

    // 취소버튼 눌렀을 때 그대로인 UI
    // 확인버튼 눌렀을 때 추가된 UI
    describe('Button', () => {
      it('수정 버튼을 누르면 handleEditSubmit 메소드가 호출된다.', () => {
        const mockHandleEditSubmit = jest.fn();
        const { getByAltText } = renderUI(
          <EditUI
            todoData={mockFetchTodoList()[0]}
            handleEditCancel={jest.fn()}
            handleEditSubmit={mockHandleEditSubmit}
          />,
          ({ children }: IChildProps) => (
            <>
              <ThemeProvider theme={designTheme}>{children}</ThemeProvider>
            </>
          ),
        );
        const submitBtn = getByAltText('submit_edit');
        act(() => userEvent.click(submitBtn));

        expect(mockHandleEditSubmit).toHaveBeenCalled();
      });

      it('취소 버튼을 누르면 TodoUI가 렌더링 된다.', () => {
        const { getByAltText, getByText } = renderEditUI();

        const cancelBtn = getByAltText('cancel_edit');

        act(() => userEvent.click(cancelBtn));

        const title = getByText('Go to grocery store');
        expect(title).toBeInTheDocument();
      });
    });
  });
});
