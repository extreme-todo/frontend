import { KeyboardEventHandler, ReactEventHandler, useState } from 'react';

import { InputAtom, TagAtom } from '../atoms';
import { EditWrapper } from '../molecules/TodoCard/content/EditUI';

import styled from '@emotion/styled';
import { CalendarInput, CategoryInput } from '../molecules';
import { SelectSingleEventHandler } from 'react-day-picker';
import { usePomodoroValue } from '../hooks';
import { categoryValidation } from '../shared/inputValidation';

const AddTodo = () => {
  const {
    settings: { focusStep },
  } = usePomodoroValue();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categoryArray, setCategoryArray] = useState<Array<string>>([]);
  const [tomato, setTomato] = useState('1');

  /* React Day Picker State and Ref */
  const [selected, setSelected] = useState<Date>(new Date());
  const handleDaySelect: SelectSingleEventHandler = (date) => {
    if (!date) return;
    setSelected(date);
  };

  /* handler */
  const handleTitleInput: ReactEventHandler<HTMLInputElement> = (event) =>
    setTitle(event.currentTarget.value);

  const handleCategoryInput: ReactEventHandler<HTMLInputElement> = (event) =>
    setCategory(event.currentTarget.value);

  const handleSubmitCategory: KeyboardEventHandler<HTMLInputElement> = (
    event,
  ) => {
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
  };

  const handleClickCategory = (category: string) => {
    setCategoryArray((prev) => {
      const deleted = prev?.filter((tag) => tag !== category);
      return deleted;
    });
  };

  const handleTomatoInput: ReactEventHandler<HTMLInputElement> = (event) => {
    setTomato(event.currentTarget.value);
  };

  return (
    <AddTodoWrapper>
      <InputAtom.Usual
        value={title}
        handleChange={handleTitleInput}
        placeholder="할 일을 입력하세요"
        ariaLabel="title"
      />
      <CategoryInput
        categories={categoryArray}
        category={category}
        handleSubmit={handleSubmitCategory}
        handleClick={handleClickCategory}
        handleChangeCategory={handleCategoryInput}
      />
      <CalendarInput handleDaySelect={handleDaySelect} selectedDay={selected} />

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
    </AddTodoWrapper>
  );
};

export default AddTodo;

const AddTodoWrapper = styled(EditWrapper)`
  background-color: transparent;
  width: 42.3125rem;
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

    ${({ theme }) => theme.colors.whiteWine}
      ${({ value, min, max }) =>
        `${((Number(value) - min) / (max - min)) * 100}%`},

    ${({ theme }) => theme.colors.whiteWine} 100%
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

    background-color: ${({ theme }) => theme.colors.accentColor};
    border-radius: 23.24rem;

    cursor: grab;

    box-shadow: ${({ theme }) => theme.shadows.button_shadow};
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
