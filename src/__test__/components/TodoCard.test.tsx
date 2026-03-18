import React, { act } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { TodoCard } from '../../components';

import { EditContextProvider } from '../../hooks';

import { IChildProps } from '../../shared/interfaces';

import { mockFetchTodoList } from '../../../fixture/mockTodoList';

import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';

import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RandomTagColorList } from '../../shared/RandomTagColorList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const randomTagColor = RandomTagColorList.getInstance();

const wrapperCreator = ({ children }: IChildProps) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={designTheme}>
      <EditContextProvider>{children}</EditContextProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

describe('TodoCard', () => {
  const mockTodo = mockFetchTodoList()[0];

  const renderUI = (MainUI: JSX.Element, wrapperUI: typeof wrapperCreator) => {
    return render(MainUI, { wrapper: wrapperUI });
  };
  const renderTodoUI = (isCurrTodo = false) => {
    const setEditTodoId = jest.fn();
    return renderUI(
      <TodoCard
        todoData={mockTodo}
        focusStep={1}
        randomTagColor={randomTagColor}
        isCurrTodo={isCurrTodo}
        order={1}
        isExtreme={false}
        isThisEdit={false}
        setEditTodoId={setEditTodoId}
        onMoveUp={jest.fn()}
        onMoveDown={jest.fn()}
        isFirst={false}
        isLast={false}
      />,
      wrapperCreator,
    );
  };

  describe('TodoUI', () => {
    describe('TodoUI는', () => {
      it('Todo는 제목이 있다.', () => {
        const { getByText } = renderTodoUI();
        const title = getByText('Go to grocery store');
        expect(title).toBeInTheDocument();
      });
      it('Todo는 카테고리가 있다.', () => {
        const { getByText } = renderTodoUI();
        const categories1 = getByText('영어');
        const categories2 = getByText('학교공부');
        expect(categories1).toBeInTheDocument();
        expect(categories2).toBeInTheDocument();
      });
    });

    describe('남은 TodoUI에는', () => {
      it('할 일의 번호가 있다.', () => {
        const { getByText } = renderTodoUI();
        const num = getByText('1.');
        expect(num).toBeInTheDocument();
      });
      it('수정 버튼이 있다.', () => {
        const { getByText } = renderTodoUI();

        expect(getByText('수정')).toBeInTheDocument();
      });
      it('삭제 버튼이 있다.', () => {
        const { getByAltText } = renderTodoUI();

        expect(getByAltText('delete')).toBeInTheDocument();
      });
      it('소요 시간이 있다.', () => {
        const { getByText, getByAltText } = renderTodoUI();
        const duration = getByText(/3분/);
        const timer = getByAltText('timer');
        expect(timer).toBeInTheDocument();
        expect(duration).toBeInTheDocument();
      });
      it('순서 이동 버튼(▲, ▼)이 있다.', () => {
        const { getByLabelText } = renderTodoUI();
        expect(getByLabelText('move up')).toBeInTheDocument();
        expect(getByLabelText('move down')).toBeInTheDocument();
      });
    });

    describe('순서 이동 버튼을 클릭하면', () => {
      it('onMoveUp이 호출된다.', () => {
        const onMoveUp = jest.fn();
        const { getByLabelText } = renderUI(
          <TodoCard
            todoData={mockTodo}
            focusStep={1}
            randomTagColor={randomTagColor}
            isCurrTodo={false}
            order={1}
            isExtreme={false}
            isThisEdit={false}
            setEditTodoId={jest.fn()}
            onMoveUp={onMoveUp}
            isFirst={false}
          />,
          wrapperCreator,
        );
        fireEvent.click(getByLabelText('move up'));
        expect(onMoveUp).toHaveBeenCalled();
      });

      it('onMoveDown이 호출된다.', () => {
        const onMoveDown = jest.fn();
        const { getByLabelText } = renderUI(
          <TodoCard
            todoData={mockTodo}
            focusStep={1}
            randomTagColor={randomTagColor}
            isCurrTodo={false}
            order={1}
            isExtreme={false}
            isThisEdit={false}
            setEditTodoId={jest.fn()}
            onMoveDown={onMoveDown}
            isLast={false}
          />,
          wrapperCreator,
        );
        fireEvent.click(getByLabelText('move down'));
        expect(onMoveDown).toHaveBeenCalled();
      });
    });

    describe('남은 TodoUI의 수정 버튼을 클릭하면', () => {
      it('setEditTodoId를 호출해 부모 컴포넌트에서 UI를 변경하도록 한다', () => {
        const setEditTodoIdMock = jest.fn();
        const { getByText } = renderUI(
          <TodoCard
            todoData={mockTodo}
            focusStep={1}
            randomTagColor={randomTagColor}
            isCurrTodo={false}
            order={1}
            isExtreme={false}
            isThisEdit={false}
            setEditTodoId={setEditTodoIdMock}
          />,
          wrapperCreator,
        );

        const editBtn = getByText('수정');
        fireEvent.click(editBtn);

        // 부모에게 ID를 전달해 isThisEdit이 true가 되도록 요청
        expect(setEditTodoIdMock).toHaveBeenCalledWith(mockTodo.id);
      });
    });

    describe('진행 중인 TodoUI에는', () => {
      it('수정 버튼이 없다.', () => {
        const { queryByText } = renderTodoUI(true);
        const editBtn = queryByText('수정');
        expect(editBtn).not.toBeInTheDocument();
      });
      it('삭제 버튼이 없다.', () => {
        const { queryByAltText } = renderTodoUI(true);
        const deleteBtn = queryByAltText('delete');
        expect(deleteBtn).not.toBeInTheDocument();
      });
      it('진행중 태그가 있다.', () => {
        const { getByText } = renderTodoUI(true);
        const inProgressTag = getByText('진행중');
        expect(inProgressTag).toBeInTheDocument();
      });
      it('순서 이동 버튼이 비활성화된다.', () => {
        const { getByLabelText } = renderTodoUI(true);
        expect(getByLabelText('move up')).toBeDisabled();
        expect(getByLabelText('move down')).toBeDisabled();
      });
    });

    describe('완료한 TodoUI에는', () => {
      const doneTodoUI = () =>
        renderUI(
          <TodoCard
            todoData={mockFetchTodoList()[2]}
            focusStep={1}
            randomTagColor={randomTagColor}
            isCurrTodo={false}
            order={1}
            isExtreme={false}
            isThisEdit={false}
            setEditTodoId={jest.fn()}
          />,
          wrapperCreator,
        );
      it('소요 시간이 없다.', () => {
        const { queryByAltText, queryByText } = doneTodoUI();
        const timerIcon = queryByAltText('timer');
        const duration = queryByText(/2분/);
        expect(duration).not.toBeInTheDocument();
        expect(timerIcon).not.toBeInTheDocument();
      });
      it('삭제 버튼이 없다.', () => {
        const { queryByText } = doneTodoUI();
        const deleteBtn = queryByText('삭제');
        expect(deleteBtn).not.toBeInTheDocument();
      });
      it('수정 버튼이 없다.', () => {
        const { queryByText } = doneTodoUI();
        const editBtn = queryByText('수정');
        expect(editBtn).not.toBeInTheDocument();
      });
      it('순서 이동 버튼이 없다.', () => {
        const { queryByLabelText } = doneTodoUI();
        expect(queryByLabelText('move up')).not.toBeInTheDocument();
        expect(queryByLabelText('move down')).not.toBeInTheDocument();
      });
    });
  });

  describe('EditUI', () => {
    let renderEditUI: () => ReturnType<typeof render>;

    beforeEach(() => {
      renderEditUI = () => {
        // 렌더링할 때 isThisEdit을 true로 설정하여 바로 편집 모드로 표시
        return renderUI(
          <TodoCard
            todoData={mockTodo}
            focusStep={1}
            randomTagColor={randomTagColor}
            isCurrTodo={false}
            order={1}
            isExtreme={false}
            isThisEdit={true}
            setEditTodoId={jest.fn()}
          />,
          wrapperCreator,
        );
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
        expect(titleInput).toHaveValue('Go to grocery store');
      });

      it('title input에서 유저가 입력값을 수정할 수 있다.', () => {
        const { getByRole } = renderEditUI();
        const titleInput = getByRole('textbox', {
          name: /title/i,
        }) as HTMLInputElement;

        expect(titleInput).toHaveValue('Go to grocery store');

        fireEvent.change(titleInput, { target: { value: 'modified title' } });
        expect(titleInput).toHaveValue('modified title');
      });

      it('title이 50자 이상 입력되면 더 이상 입력되지 않는다.', () => {
        const { getByRole } = renderEditUI();
        const titleInput = getByRole('textbox', {
          name: /title/i,
        }) as HTMLInputElement;

        const longText = 'a'.repeat(51);
        act(() => userEvent.type(titleInput, longText));

        expect(titleInput.value.length).toBeLessThanOrEqual(50);
      });

      it('title을 비워두면 제출 버튼이 disabled된다.', () => {
        const { getByRole } = renderEditUI();
        const titleInput = getByRole('textbox', {
          name: /title/i,
        }) as HTMLInputElement;
        const saveBtn = getByRole('button', { name: /저장/i });
        act(() => userEvent.clear(titleInput));
        expect(saveBtn).toBeDisabled();
      });

      it('category input에는 유저가 입력값을 입력할 수 있다.', () => {
        const { getByRole } = renderEditUI();

        // CategoryInput 컴포넌트 내부의 실제 input 요소를 직접 선택
        const categoryInput = getByRole('textbox', {
          name: 'category input',
        }) as HTMLInputElement;

        expect(categoryInput).toBeInTheDocument();
        waitFor(() =>
          fireEvent.change(categoryInput, {
            target: { value: 'add new category' },
          }),
        );

        expect(categoryInput).toHaveValue('add new category');
      });

      it('기존 category가 있다.', () => {
        const { getByText } = renderEditUI();
        expect(getByText('영어')).toBeInTheDocument();
        expect(getByText('학교공부')).toBeInTheDocument();
      });

      it('소요시간이 있다.', () => {
        const { queryByText } = renderEditUI();
        const duration = queryByText(/3분/);
        expect(duration).toBeInTheDocument();
      });

      it('취소 svg가 있다.', () => {
        const { queryByAltText } = renderEditUI();
        const cancelBtn = queryByAltText('cancel');
        expect(cancelBtn).toBeInTheDocument();
      });

      it('저장 버튼이 있다.', () => {
        const { queryByText } = renderEditUI();
        const saveBtn = queryByText('저장');
        expect(saveBtn).toBeInTheDocument();
      });
    });

    describe('Category', () => {
      it('category input창에 카테고리를 입력하고 enter를 치면 새로운 카테고리가 추가된다.', () => {
        const { getByRole, queryAllByRole } = renderEditUI();

        const categoryInput = getByRole('textbox', { name: 'category input' });
        const prevCategories = queryAllByRole('button', { name: /category/i });

        act(() => userEvent.type(categoryInput, '새 카테고리{enter}'));

        const nextCategories = queryAllByRole('button', {
          name: /category/i,
        });
        expect(nextCategories.length).toBe(prevCategories.length + 1);
      });

      it('input된 값이 카테고리에 이미 존재하면 추가되지 않는다.', () => {
        const { queryAllByRole, getByRole } = renderEditUI();

        const categoryInput = getByRole('textbox', { name: 'category input' });
        act(() => userEvent.type(categoryInput, '영어{enter}'));

        const categories = queryAllByRole('button', {
          name: /category/i,
        });
        const tagsContent = categories.map((tag) => tag.textContent);
        const filtered = tagsContent.filter((tag) => tag == '영어');

        expect(filtered.length).toBe(1);
      });

      it('태그가 5개를 초과하면 category input 태그를 없앤다.', () => {
        const { getByRole, queryByRole } = renderEditUI();

        const categoryInput = getByRole('textbox', { name: 'category input' });

        act(() => userEvent.type(categoryInput, '첫 번째 카테고리{enter}'));
        act(() => userEvent.type(categoryInput, '두 번째 카테고리{enter}'));
        act(() => userEvent.type(categoryInput, '세 번째 카테고리{enter}'));

        const removedInput = queryByRole('textbox', { name: 'category input' });

        expect(removedInput).not.toBeInTheDocument();
      });

      it('카테고리가 20자를 초과하면, 유효성 검사에 실패하여 추가되지 않는다.', () => {
        const { getByRole, queryAllByRole } = renderEditUI();

        const categoryInput = getByRole('textbox', {
          name: 'category input',
        }) as HTMLInputElement;

        const prevCategories = queryAllByRole('button', { name: /category/i });

        act(() =>
          userEvent.type(
            categoryInput,
            'I really psyched up starting new 2024!!!{enter}',
          ),
        );

        const nextCategories = queryAllByRole('button', {
          name: /category/i,
        });

        expect(nextCategories.length).toBe(prevCategories.length);
        expect(categoryInput).toHaveValue(
          'I really psyched up starting new 2024!!!',
        );
      });

      it('카테고리에 특수문자나 이모지가 있으면 유효성 검사 오류 메시지가 표시된다.', () => {
        const { getByRole, queryAllByRole, queryByText } = renderEditUI();

        const categoryInput = getByRole('textbox', { name: 'category input' });
        const prevCategories = queryAllByRole('button', { name: /category/i });

        act(() => userEvent.type(categoryInput, '🍅 토마토 스터디{enter}'));

        const nextCategories = queryAllByRole('button', {
          name: /category/i,
        });

        const errorMessage = queryByText(/숫자,특수문자/i);
        expect(nextCategories.length).toBe(prevCategories.length);
        expect(errorMessage).toBeInTheDocument();
      });

      it('카테고리 입력 시 앞뒤 공백은 제거되고 연속된 공백은 하나로 처리된다.', () => {
        const { getByRole, getByText } = renderEditUI();

        const categoryInput = getByRole('textbox', { name: 'category input' });

        act(() => userEvent.type(categoryInput, '   공부   시간   {enter}'));

        const cleanedCategory = getByText('공부 시간');
        expect(cleanedCategory).toBeInTheDocument();
      });

      it('존재하는 category를 클릭하면 삭제된다.', () => {
        const { queryAllByRole, getByRole, getByText } = renderEditUI();

        const categoryInput = getByRole('textbox', {
          name: 'category input',
        });
        act(() => userEvent.type(categoryInput, '수학공부{enter}'));

        const firstCheckPointCategories = queryAllByRole('button', {
          name: /category/i,
        });
        expect(firstCheckPointCategories.length).toBe(3);

        const thirdTag = getByText('수학공부');
        act(() => userEvent.click(thirdTag));
        const secondCheckPointCategories = queryAllByRole('button', {
          name: /category/i,
        });
        expect(secondCheckPointCategories.length).toBe(2);

        const firstTag = getByText('영어');
        act(() => userEvent.click(firstTag));
        const lastCheckPointCategories = queryAllByRole('button', {
          name: /category/i,
        });
        expect(lastCheckPointCategories.length).toBe(1);
      });
    });

    describe('소요시간을 누르면', () => {
      it('TomatoInput이 렌더링 된다.', () => {
        const { getByLabelText, getByText } = renderEditUI();
        const duration = getByText(/3분/);
        act(() => userEvent.click(duration));
        const tomatoInput = getByLabelText('tomatoInput');
        expect(tomatoInput).toBeInTheDocument();
      });
      it('TomatoInput 외부를 클릭하면 TomatoInput이 언마운트 된다.', () => {
        const setEditTodoIdMock = jest.fn();
        const { getByLabelText, queryByLabelText, getByText } = renderUI(
          <div id="root">
            <TodoCard
              todoData={mockTodo}
              focusStep={1}
              randomTagColor={randomTagColor}
              isExtreme={false}
              isCurrTodo={false}
              order={1}
              isThisEdit={true} // 직접 편집 모드로 설정
              setEditTodoId={setEditTodoIdMock}
            />
          </div>,
          wrapperCreator,
        );

        // 수정 모드에서 tomatoInput 렌더링
        const duration = getByText(/3분/);
        const titleInput = getByLabelText('title_input');
        fireEvent.click(duration);

        // 렌더링 되었는지 확인
        let tomatoInput = queryByLabelText('tomatoInput');
        expect(tomatoInput).toBeInTheDocument();

        // 외부 요소 클릭해서 언마운트 확인
        fireEvent.mouseDown(titleInput);
        tomatoInput = queryByLabelText('tomatoInput');
        expect(tomatoInput).not.toBeInTheDocument();
      });
    });

    describe('Button', () => {
      it('취소 svg를 누르면 setEditTodoId가 호출된다', () => {
        const setEditTodoIdMock = jest.fn();

        const { getByAltText } = renderUI(
          <TodoCard
            todoData={mockTodo}
            focusStep={1}
            randomTagColor={randomTagColor}
            isExtreme={false}
            isCurrTodo={false}
            order={1}
            isThisEdit={true}
            setEditTodoId={setEditTodoIdMock}
          />,
          wrapperCreator,
        );

        const cancelBtn = getByAltText('cancel');
        expect(cancelBtn).toBeInTheDocument();

        fireEvent.click(cancelBtn);

        expect(setEditTodoIdMock).toHaveBeenCalledWith(undefined);
      });
    });
  });
});
