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
import { AddTodoDto, AddTodoSchema } from '../DB/indexed';
import {
  MAX_CATEGORY_ARRAY_LENGTH,
  MAX_TITLE_INPUT_LENGTH_WARNING,
  TITLE_EMPTY_MESSAGE,
} from '../DB/indexedAction';
import { RandomTagColorList } from '../shared/RandomTagColorList';

/* packages */
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { ZodError } from 'zod';
import FocusTrap from 'focus-trap-react';

interface IAddTodoProps {
  handleClose: () => void;
}

const ramdomTagColorList = RandomTagColorList.getInstance();

const AddTodo = ({ handleClose }: IAddTodoProps) => {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [category, setCategory] = useState('');
  const [categoryArray, setCategoryArray] = useState<Array<string>>([]);
  const [categoryError, setCategoryError] = useState<string | undefined>(
    undefined,
  );
  const [tomato, setTomato] = useState(1);

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
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
      if (typeof trimmed === 'object') {
        if (!titleError) {
          setTitleError(true);
        }
        if (trimmed.errorMessage === MAX_TITLE_INPUT_LENGTH_WARNING) {
          return;
        }
      } else if (typeof trimmed === 'string' && titleError !== undefined) {
        setTitleError(false);
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
        setTitleError(true);
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
          event.preventDefault();
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

  const handleAddSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget as HTMLFormElement);
      const newTodo = {
        todo: formData.get('title') as string,
        duration: tomato,
        categories: categoryArray.length === 0 ? null : categoryArray,
        date: setTimeInFormat(new Date()).toISOString(),
      };
      const { success, error } = AddTodoSchema.safeParse(newTodo);

      if (success) {
        mutate(newTodo);
      } else {
        if (error instanceof ZodError) {
          alert(error.issues[0].message);
        }
      }
    },
    [categoryArray, tomato],
  );

  return (
    <FocusTrap
      focusTrapOptions={{
        initialFocus: '#title',
        escapeDeactivates: true,
        clickOutsideDeactivates: true,
      }}
    >
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
                ariaLabel="title input"
                className="todoTitle"
                styleOption={{
                  borderWidth: titleError ? '2px' : '1px',
                  width: '100%',
                  height: '3rem',
                  font: 'h1',
                  borderColor: titleError ? 'extreme_orange' : 'primary1',
                }}
                tabIndex={0}
              />
            </label>
            <BtnAtom handleOnClick={handleClose} ariaLabel="close" tabIndex={3}>
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
            {categoryError && (
              <p className="category_error" role="alert">
                {categoryError}
              </p>
            )}
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
            disabled={title.length === 0 || titleError || isLoading}
            tabIndex={2}
          >
            <div style={{ width: 'max-content' }}>
              {isLoading ? '제출 중' : '추가'}
            </div>
          </BtnAtom>
        </FooterWrapper>
      </AddTodoWrapper>
    </FocusTrap>
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

const CategoryWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  .category_error {
    margin-top: 0.5rem;
    color: ${({ theme }) => theme.color.fontColor.extreme_orange};
    font-size: ${({ theme }) => theme.fontSize.body.size};
    font-weight: ${({ theme }) => theme.fontSize.body.weight};
  }
`;

const TomatoContainer = styled.div`
  width: 100%;
`;

const FooterWrapper = styled.div`
  display: flex;
  width: 100%;
  column-gap: 1.5625rem;
`;
