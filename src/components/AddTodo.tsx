/* react */
import {
  FormEvent,
  KeyboardEventHandler,
  ReactEventHandler,
  useCallback,
  useMemo,
  useState,
} from 'react';

/* atomics */
import { BtnAtom, CardAtom, IconAtom, InputAtom, TomatoInput } from '../atoms';
import { CategoryInput } from '../molecules';

/* custom hooks */
import { usePomodoroValue } from '../hooks';

/* custom functions or methods */
import { todosApi } from '../shared/apis';
import { categoryValidation, titleValidation } from '../shared/inputValidation';
import { setTimeInFormat } from '../shared/timeUtils';
import { AddTodoDto } from '../DB/indexed';
import {
  MAX_CATEGORY_ARRAY_LENGTH,
  TITLE_EMPTY_MESSAGE,
} from '../DB/indexedAction';
import { RandomTagColorList } from '../shared/RandomTagColorList';

/* packages */
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styled from '@emotion/styled';

interface IAddTodoProps {
  handleClose: () => void;
}

const ramdomTagColorList = RandomTagColorList.getInstance();

const AddTodo = ({ handleClose }: IAddTodoProps) => {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState('');
  const [categoryArray, setCategoryArray] = useState<Array<string>>([]);
  const [categoryError, setCategoryError] = useState<string | undefined>(
    undefined,
  );
  const [tomato, setTomato] = useState(1);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (todo: AddTodoDto) => todosApi.addTodo(todo),
    onSuccess(data) {
      console.debug('\n\n\n ✅ data in TodoCard‘s useMutation ✅ \n\n', data);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['category'] });
      setTitle('');
      setCategory('');
      setCategoryArray([]);
      setTomato(1);
    },
    onError(error: AxiosError) {
      console.debug('\n\n\n 🚨 error in TodoCard‘s useMutation 🚨 \n\n', error);
      const errorString = '에러 발생 ' + error.code + ' ' + error.message;
      alert(errorString);
    },
  });

  const {
    settings: { focusStep },
  } = usePomodoroValue();

  /* handler */
  const handleTitleInput: ReactEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const trimmed = titleValidation(event.currentTarget.value);
      if (typeof trimmed === 'object' && trimmed.errorMessage !== titleError) {
        setTitleError(trimmed.errorMessage);
      } else if (typeof trimmed === 'string' && titleError !== undefined) {
        setTitleError(undefined);
      }
      setTitle(event.currentTarget.value);
    },
    [titleError],
  );

  const handleTitleBlur: ReactEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const checkEmpty = titleValidation(event.currentTarget.value);
      if (
        typeof checkEmpty === 'object' &&
        checkEmpty.errorMessage === TITLE_EMPTY_MESSAGE
      ) {
        setTitleError(checkEmpty.errorMessage);
      }
    },
    [],
  );

  const handleCategoryInput: ReactEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setCategory(event.currentTarget.value);
      if (
        event.currentTarget.value.length === 0 &&
        categoryError !== undefined
      ) {
        return setCategoryError(undefined);
      }
      const trimmed = categoryValidation(event.currentTarget.value);
      if (typeof trimmed === 'object' && trimmed.errorMessage !== categoryError)
        setCategoryError(trimmed.errorMessage);
      else if (typeof trimmed === 'string' && categoryError !== undefined) {
        setCategoryError(undefined);
      }
    },
    [categoryError],
  );

  const handleSubmitCategory: KeyboardEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        if (event.code === 'Enter') {
          if (event.currentTarget.value.length === 0) return;
          // 한글 중복 입력 처리
          if (event.nativeEvent.isComposing) return;
          const trimmed = categoryValidation(event.currentTarget.value);
          if (typeof trimmed === 'object') return;
          else if (
            typeof trimmed === 'string' &&
            !categoryArray.includes(trimmed) &&
            categoryArray.length <= MAX_CATEGORY_ARRAY_LENGTH
          ) {
            const copy = categoryArray.slice();
            copy.push(trimmed);
            setCategoryArray(copy);
            ramdomTagColorList.setColor = trimmed;
          }
          setCategory('');
        }
      },
      [categoryArray],
    );

  const handleClickCategory = useCallback((category: string) => {
    setCategoryArray((prev) => {
      const deleted = prev?.filter((tag) => tag !== category);
      return deleted;
    });
  }, []);

  const handleTomato = useCallback((count: number) => setTomato(count), []);

  const addData: AddTodoDto = useMemo(
    () => ({
      date: setTimeInFormat(new Date()).toISOString(),
      todo: title,
      duration: Number(`${tomato}`),
      categories: categoryArray.length > 0 ? categoryArray : null,
    }),
    [title, tomato, categoryArray],
  );

  const handleAddSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget as HTMLFormElement);
      const todo = formData.get('title');
      const duration = formData.get('duration');
      const categories = categoryArray;
      const date = setTimeInFormat(new Date()).toISOString();
      // const date = formData.get('date');
      // if (title.length <= 0) return alert('제목을 입력해주세요.');
      // const trimmed = titleValidation(addData.todo);
      // if (!trimmed) return;
      // mutate({ ...todo, todo: trimmed });
    },
    [addData],
  );

  return (
    <AddTodoWrapper
      w="53.75rem"
      h="20rem"
      padding="1.5rem"
      className="card"
      onSubmit={handleAddSubmit}
    >
      <MainWrapper>
        <TitleWrapper>
          <label htmlFor="title">
            <InputAtom.Underline
              name="title"
              value={title}
              handleBlur={handleTitleBlur}
              id={'title'}
              inputRef={useCallback((node: HTMLInputElement | null) => {
                node?.focus();
              }, [])}
              handleChange={handleTitleInput}
              placeholder="새로운 TODO를 작성해주세요"
              ariaLabel="title"
              className="todoTitle"
              styleOption={{
                borderWidth: '1px',
                width: '100%',
                height: '3rem',
                font: 'h1',
              }}
            />
          </label>
          {titleError && <p>{titleError}</p>}
          <BtnAtom handleOnClick={handleClose} ariaLabel="close">
            <IconAtom size={2} alt="close" src="icon/closeDark.svg" />
          </BtnAtom>
        </TitleWrapper>
        <CategoryWrapper>
          <CategoryInput
            categories={categoryArray}
            category={category}
            handleSubmit={handleSubmitCategory}
            handleClick={handleClickCategory}
            handleChangeCategory={handleCategoryInput}
            tagColorList={ramdomTagColorList.getColorList}
          />
          {categoryError && <p>{categoryError}</p>}
        </CategoryWrapper>
      </MainWrapper>
      <FooterWrapper>
        <TomatoContainer>
          <TomatoInput
            max={10}
            min={0}
            period={focusStep}
            handleTomato={handleTomato}
            tomato={tomato}
          />
        </TomatoContainer>
        <BtnAtom
          paddingHorizontal="2.0625rem"
          paddingVertical="0.375rem"
          btnStyle="lightBtn"
          ariaLabel="submit"
          type="submit"
        >
          <div style={{ width: 'max-content' }}>추가</div>
        </BtnAtom>
      </FooterWrapper>
    </AddTodoWrapper>
  );
};

export default AddTodo;

const AddTodoWrapper = styled(CardAtom.withComponent('form'))`
  overflow: visible;
  background-color: ${({
    theme: {
      color: { backgroundColor },
    },
  }) => backgroundColor.primary2};
  justify-content: space-between;

  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    .todoTitle {
      margin-bottom: 2rem;
    }
    .calendar {
      margin: 2rem 0;
    }
  }
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  width: 100%;
`;

const TitleWrapper = styled.div`
  display: flex;
  width: 100%;
  column-gap: 3rem;

  & > label {
    width: 100%;
  }

  & > button {
    height: 2rem;
  }
`;

// const CalendarAndCategoryWrapper = styled.div`
//   display: flex;
//   width: 100%;
//   justify-content: flex-start;
//   column-gap: 1rem;
// `;

const CategoryWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const TomatoContainer = styled.div`
  width: 100%;
`;

const FooterWrapper = styled.div`
  display: flex;
  width: 100%;
  column-gap: 1.5625rem;
`;
