/* react */
import {
  KeyboardEventHandler,
  ReactEventHandler,
  useCallback,
  useMemo,
  useState,
} from 'react';

/* atomics */
import { BtnAtom, IconAtom, InputAtom, TypoAtom } from '../atoms';
import { CategoryInput } from '../molecules';
import { CalendarInput } from '../organisms';
import {
  EditWrapper,
  options,
  TomatoOption,
  TomatoSelector,
} from './TodoCard/content/EditUI';

/* custom hooks */
import { usePomodoroValue } from '../hooks';

/* custom functions or methods */
import { todosApi } from '../shared/apis';
import { categoryValidation, titleValidation } from '../shared/inputValidation';
import { setTimeInFormat } from '../shared/timeUtils';
import { AddTodoDto, ETIndexed } from '../DB/indexed';

/* packages */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SelectSingleEventHandler } from 'react-day-picker';
import styled from '@emotion/styled';
import { AxiosError } from 'axios';
import { useIsMobile } from '../hooks/useIsMobile';

const AddTodo = () => {
  const isMobile = useIsMobile();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categoryArray, setCategoryArray] = useState<Array<string>>([]);
  const [tomato, setTomato] = useState('1');

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
      setTomato('1');
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

  /* React Day Picker State and Ref */
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const handleDaySelect: SelectSingleEventHandler = useCallback((date) => {
    if (!date) return;
    setSelectedDate(date);
  }, []);

  /* handler */
  const handleTitleInput: ReactEventHandler<HTMLInputElement> = useCallback(
    (event) => setTitle(event.currentTarget.value),
    [],
  );

  const handleCategoryInput: ReactEventHandler<HTMLInputElement> = useCallback(
    (event) => setCategory(event.currentTarget.value),
    [],
  );

  const handleSubmitCategory: KeyboardEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        if (event.code === 'Enter') {
          // 한글 중복 입력 처리
          if (event.nativeEvent.isComposing) return;

          const newCategory = (event.target as HTMLInputElement).value;

          const trimmed = categoryValidation(newCategory, categoryArray ?? []);

          if (!trimmed) return;

          if (categoryArray) {
            const copy = categoryArray.slice();
            copy.push(trimmed);
            setCategoryArray(copy);
          } else {
            setCategoryArray([trimmed]);
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

  const handleTomatoInput: ReactEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = useCallback((event) => {
    setTomato(event.currentTarget.value);
  }, []);

  const addData: AddTodoDto = useMemo(
    () => ({
      date: setTimeInFormat(selectedDate).toISOString(),
      todo: title,
      duration: Number(`${tomato}`),
      categories: categoryArray.length > 0 ? categoryArray : null,
    }),
    [selectedDate, title, tomato, categoryArray],
  );

  const handleAddSubmit = useCallback(
    (todo: AddTodoDto) => {
      if (title.length <= 0) return alert('제목을 입력해주세요.');
      const trimmed = titleValidation(addData.todo);
      if (!trimmed) return;
      mutate({ ...todo, todo: trimmed });
    },
    [addData],
  );

  return (
    <>
      <AddTodoWrapper>
        <InputAtom.Usual
          value={title}
          handleChange={handleTitleInput}
          placeholder="할 일을 입력하세요"
          ariaLabel="title"
          className="todoTitle"
        />
        <CategoryInput
          categories={categoryArray}
          category={category}
          handleSubmit={handleSubmitCategory}
          handleClick={handleClickCategory}
          handleChangeCategory={handleCategoryInput}
        />
        <CalendarInput
          handleDaySelect={handleDaySelect}
          selectedDay={selectedDate}
        />
        <TomatoContainer>
          <TypoAtom>🍅</TypoAtom>
          {isMobile ? (
            <TomatoSelector
              aria-label="tomato_select"
              value={tomato}
              onChange={handleTomatoInput}
            >
              <TomatoOption aria-label="tomato_option" value={undefined}>
                뽀모도로 횟수
              </TomatoOption>
              {options.map((option) => (
                <TomatoOption
                  aria-label="tomato_option"
                  data-testid="tomato_option"
                  value={option}
                  key={option}
                >
                  {option}
                </TomatoOption>
              ))}
            </TomatoSelector>
          ) : (
            <TomatoInput
              value={tomato}
              onChange={handleTomatoInput}
              placeholder="할 일을 입력하세요"
              aria-label="tomato"
              type="range"
              data-value={tomato}
              data-focusmin={`${focusStep * Number(tomato)}min`}
              max={10}
              min={1}
              step={1}
              newVal={((Number(tomato) - 1) / (10 - 1)) * 100}
            />
          )}
        </TomatoContainer>
      </AddTodoWrapper>
      <FooterContainer>
        <BtnAtom handleOnClick={() => handleAddSubmit.call(this, addData)}>
          <IconAtom size={3.6} backgroundColor={'transparent'}>
            <img alt="submit_edit" src={'icons/ok.svg'} />
          </IconAtom>
        </BtnAtom>
      </FooterContainer>
    </>
  );
};

export default AddTodo;

const AddTodoWrapper = styled(EditWrapper)`
  background-color: transparent;
  width: 42.3125rem;

  & > div:first-of-type {
    margin-bottom: 1rem;
  }

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

const TomatoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;

  & > span {
    margin-right: 1.9rem;
  }
`;

const TomatoInput = styled.input<{
  value: string;
  max: number;
  min: number;
  newVal: number;
}>`
  display: flex;
  align-items: center;
  width: 24rem;
  height: 0.5rem;

  /* 초기화 */
  appearance: none;
  background: linear-gradient(
    to right,
    tomato 0%,

    tomato
      ${({ value, min, max }) =>
        `${((Number(value) - min) / (max - min)) * 100}%`},

    ${({ theme }) => theme.color.backgroundColor.white}
      ${({ value, min, max }) =>
        `${((Number(value) - min) / (max - min)) * 100}%`},

    ${({ theme }) => theme.color.backgroundColor.extreme_orange} 100%
  );
  outline: none;

  /* 슬라이더 바 속성  */
  cursor: pointer;
  border-radius: 10px;

  position: relative;

  &:before,
  :after {
    position: absolute;
    left: ${({ newVal }) => `calc(${newVal}% + (${10 - newVal * 0.15}px))`};

    margin-left: -1.4rem;

    text-align: center;
  }

  &:before {
    content: attr(data-value);

    padding-top: 6.2px;
    padding-bottom: 6.2px;

    width: 2.8rem;
    height: 1rem;

    background-color: ${({ theme }) =>
      theme.color.backgroundColor.extreme_orange};
    border-radius: 23.24rem;

    cursor: grab;

    box-shadow: ${({ theme }) => theme.shadow.container};
  }

  &:after {
    content: attr(data-focusmin);

    top: 1.5rem;
    width: 2.8rem;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: 1px;
  }

  &:active::-webkit-slider-thumb {
    cursor: grabbing;
  }
`;

const FooterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 1rem;
`;
