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
import { RandomTagColorList } from '../../shared/RandomTagColorList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const randomTagColor = RandomTagColorList.getInstance().getColorList;

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

  const renderUI = (MainUI: JSX.Element, wrapperUI: typeof wrapperCreator) => {
    return render(MainUI, { wrapper: wrapperUI });
  };

  const renderTodoUI = (isDragging: boolean, isCurrTodo = false) =>
    renderUI(
      <TodoCard
        todoData={mockTodo}
        dragHandleProps={undefined}
        snapshot={setMockSnapshot(isDragging)}
        focusStep={1}
        randomTagColor={randomTagColor}
        isCurrTodo={isCurrTodo}
        order={1}
      />,
      wrapperCreator,
    );

  describe('TodoUI', () => {
    describe('TodoUI는', () => {
      it('Todo는 제목이 있다.', () => {
        const { getByText } = renderTodoUI(false);
        const title = getByText('Go to grocery store');
        expect(title).toBeInTheDocument();
      });
      it('Todo는 카테고리가 있다.', () => {
        const { getByText } = renderTodoUI(false);
        const categories1 = getByText('영어');
        const categories2 = getByText('학교공부');
        expect(categories1).toBeInTheDocument();
        expect(categories2).toBeInTheDocument();
      });
    });

    describe('drag 시에는', () => {
      it('카테고리가 숨겨진다.', () => {
        const { queryByText } = renderTodoUI(true);

        const categories1 = queryByText('영어');
        const categories2 = queryByText('학교공부');
        expect(categories1).not.toBeInTheDocument();
        expect(categories2).not.toBeInTheDocument();
      });
      it('삭제 버튼이 숨겨진다.', () => {
        const { queryByAltText } = renderTodoUI(true);

        const deleteBtn = queryByAltText('delete');
        expect(deleteBtn).not.toBeInTheDocument();
      });
      it('수정 버튼이 숨겨진다.', () => {
        const { queryByAltText } = renderTodoUI(true);

        const editBtn = queryByAltText('edit');
        expect(editBtn).not.toBeInTheDocument();
      });
    });

    describe('남은 TodoUI에는', () => {
      it('할 일의 번호가 있다.', () => {
        const { getByText } = renderTodoUI(false);
        const num = getByText('1.');
        expect(num).toBeInTheDocument();
      });
      it('수정 버튼이 있다.', () => {
        const { getByText } = renderTodoUI(false);

        expect(getByText('수정')).toBeInTheDocument();
      });
      it('삭제 버튼이 있다.', () => {
        const { getByAltText } = renderTodoUI(false);

        expect(getByAltText('delete')).toBeInTheDocument();
      });
      it('소요 시간이 있다.', () => {
        const { getByText, getByAltText } = renderTodoUI(false);
        const duration = getByText('3분');
        const timer = getByAltText('timer');
        expect(timer).toBeInTheDocument();
        expect(duration).toBeInTheDocument();
      });
      it('핸들러 아이콘이 있다.', () => {
        const { getByAltText } = renderTodoUI(false);
        const handler = getByAltText('handler');
        expect(handler).toBeInTheDocument();
      });
    });

    describe('남은 TodoUI의 수정 버튼을 클릭하면', () => {
      it('해당 todoCard의 UI가 EditUI로 바뀐다.', async () => {
        const { getByText, getAllByText, findByRole } = renderUI(
          <>
            <TodoCard
              todoData={mockTodo}
              dragHandleProps={undefined}
              snapshot={setMockSnapshot(false)}
              focusStep={1}
              randomTagColor={randomTagColor}
              isCurrTodo={false}
              order={1}
            />
            <TodoCard
              todoData={mockFetchTodoList()[1]}
              dragHandleProps={undefined}
              snapshot={setMockSnapshot(false)}
              focusStep={1}
              randomTagColor={randomTagColor}
              isCurrTodo={false}
              order={2}
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

        const editBtn = getAllByText('수정');
        fireEvent.click(editBtn[0]);

        const titleInput = await findByRole('textbox', { name: 'title_input' });
        expect(titleOne).not.toBeInTheDocument();
        expect(titleInput).toBeInTheDocument();
        expect(titleTwo).toBeInTheDocument();
      });
    });

    describe('진행 중인 TodoUI에는', () => {
      it('수정 버튼이 없다.', () => {
        const { queryByText } = renderTodoUI(false, true);
        const editBtn = queryByText('수정');
        expect(editBtn).not.toBeInTheDocument();
      });
      it('삭제 버튼이 없다.', () => {
        const { queryByAltText } = renderTodoUI(false, true);
        const deleteBtn = queryByAltText('delete');
        expect(deleteBtn).not.toBeInTheDocument();
      });
      it('진행중 태그가 있다.', () => {
        const { getByText } = renderTodoUI(false, true);
        const inProgressTag = getByText('진행중');
        expect(inProgressTag).toBeInTheDocument();
      });
    });

    describe('완료한 TodoUI에는', () => {
      const doneTodoUI = renderUI(
        <TodoCard
          todoData={mockFetchTodoList()[2]}
          dragHandleProps={undefined}
          snapshot={setMockSnapshot(false)}
          focusStep={1}
          randomTagColor={randomTagColor}
          isCurrTodo={false}
          order={1}
        />,
        wrapperCreator,
      );
      it('소요 시간이 없다.', () => {
        const { queryByAltText, queryByText } = doneTodoUI;
        const timerIcon = queryByAltText('timer');
        const duration = queryByText('2분');
        expect(duration).not.toBeInTheDocument();
        expect(timerIcon).not.toBeInTheDocument();
      });
      it('삭제 버튼이 없다.', () => {
        const { queryByText } = doneTodoUI;
        const deleteBtn = queryByText('삭제');
        expect(deleteBtn).not.toBeInTheDocument();
      });
      it('수정 버튼이 없다.', () => {
        const { queryByText } = doneTodoUI;
        const editBtn = queryByText('수정');
        expect(editBtn).not.toBeInTheDocument();
      });
      it('핸들러 아이콘이 없다.', () => {
        const { queryByAltText } = doneTodoUI;
        const handlerIcon = queryByAltText('handler');
        expect(handlerIcon).not.toBeInTheDocument();
      });
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
            focusStep={1}
            randomTagColor={randomTagColor}
            isCurrTodo={false}
            order={1}
          />,
          wrapperCreator,
        );

        const editBtn = renderResult.getByText('수정');
        fireEvent.click(editBtn);
        return renderResult;
      };
    });

    // 기본UI
    describe('EditUI는', () => {
      it('기존 title을 초깃값으로 가지는 title input이 있다.', () => {
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

      // TODO : 소요시간 수정
      it('소요시간이 있다.', () => {
        const { queryByAltText, queryByText } = renderEditUI();
        const timerIcon = queryByAltText('timer');
        const duration = queryByText('3분');
        expect(duration).toBeInTheDocument();
        expect(timerIcon).toBeInTheDocument();
      });

      // TODO : 취소 svg 확인하기
      it('취소 svg가 있다.', () => {
        const { queryByAltText } = renderEditUI();
        const cancelBtn = queryByAltText('cancel');
        expect(cancelBtn).toBeInTheDocument();
      });

      // TODO : 저장 버튼 확인하기
      it('저장 버튼이 있다.', () => {
        const { queryByText } = renderEditUI();
        const saveBtn = queryByText('저장');
        expect(saveBtn).toBeInTheDocument();
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

    // TODO : popper 작동 테스트 코드
    describe('소요시간을 누르면', () => {
      it('TomatoInput이 렌더링 된다.', () => {});
    });

    describe('Button', () => {
      // TODO : 저장 버튼 눌렀을 때
      it('저장 버튼을 누르면 handleEditSubmit 메소드가 호출된다.', () => {
        // const mockHandleEditSubmit = jest.fn();
        // const { getByAltText } = renderUI(
        //   <EditUI
        //     todoData={mockFetchTodoList()[0]}
        //     handleEditCancel={jest.fn()}
        //     handleEditSubmit={mockHandleEditSubmit}
        //   />,
        //   ({ children }: IChildProps) => (
        //     <>
        //       <ThemeProvider theme={designTheme}>{children}</ThemeProvider>
        //     </>
        //   ),
        // );
        // const submitBtn = getByAltText('submit_edit');
        // act(() => userEvent.click(submitBtn));
        // expect(mockHandleEditSubmit).toHaveBeenCalled();
      });
      // TODO : 취소 svg를 눌렀을 때 그대로인 UI
      it('취소 svg를 누르면 기존 TodoUI가 렌더링 된다.', () => {
        // const { getByAltText, getByText } = renderEditUI();
        // const cancelBtn = getByAltText('cancel_edit');
        // act(() => userEvent.click(cancelBtn));
        // const title = getByText('Go to grocery store');
        // expect(title).toBeInTheDocument();
      });
    });
  });
});
