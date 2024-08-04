import { ReactEventHandler, useCallback, useMemo, useState } from 'react';

import { IconAtom, InputAtom, TypoAtom } from '../../../atoms';
import { CategoryInput } from '../../../molecules';
import { CalendarInput } from '../../../organisms';

import { UpdateTodoDto } from '../../../DB/indexed';
import { TodoEntity } from '../../../DB/indexedAction';

import { setTimeInFormat } from '../../../shared/timeUtils';
import {
  categoryValidation,
  titleValidation,
} from '../../../shared/inputValidation';

import { SelectSingleEventHandler } from 'react-day-picker';
import styled from '@emotion/styled';

interface IEditUIProps {
  todoData: TodoEntity;
  handleEditSubmit: (todo: UpdateTodoDto) => void;
  handleEditCancel: () => void;
}

const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const EditUI = ({
  todoData,
  handleEditSubmit,
  handleEditCancel,
}: IEditUIProps) => {
  const { date, todo: todoTitle, categories, duration: tomato } = todoData;

  const [selected, setSelected] = useState<Date>(new Date(date));
  const [titleValue, setTitleValue] = useState(todoTitle);
  const [categoryValue, setCategoryValue] = useState('');
  const [categoryArray, setCategoryArray] = useState(categories);
  const [duration, setDuration] = useState(tomato);

  const handleChangeTitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitleValue(event.target.value);
    },
    [],
  );

  const handleChangeCategory = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCategoryValue(event.target.value);
    },
    [],
  );

  const handleCategorySubmit = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
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

        setCategoryValue('');
      }
    },
    [categoryArray],
  );

  const handleDeleteCategory = useCallback((category: string) => {
    setCategoryArray((prev) => {
      const deleted = prev?.filter((tag) => {
        return tag !== category;
      }) as string[]; // QUESTION event.currentTarget.innerHTML를 바로 넣어주면 에러가 왜 날까?

      if (deleted.length === 0) return null;
      return deleted;
    });
  }, []);

  const handleDuration: ReactEventHandler<HTMLSelectElement> = useCallback(
    (event) => {
      setDuration(Number(event.currentTarget.value));
    },
    [],
  );

  const handleDaySelect: SelectSingleEventHandler = useCallback((date) => {
    if (!date) return;
    setSelected(date);
  }, []);

  const editData = useMemo(
    () => ({
      categories: categoryArray,
      date: setTimeInFormat(selected).toISOString(),
      todo: titleValue,
      duration,
    }),
    [categoryArray, selected, titleValue, duration],
  );

  return (
    <EditWrapper>
      <InputAtom.Usual
        value={titleValue}
        handleChange={handleChangeTitle}
        placeholder="할 일을 입력하세요"
        ariaLabel="title_input"
      />
      <CategoryInput
        categories={categoryArray}
        handleSubmit={handleCategorySubmit}
        handleClick={handleDeleteCategory}
        category={categoryValue}
        handleChangeCategory={handleChangeCategory}
      />
      <AdditionalDataContainer>
        <CalendarInput
          selectedDay={selected}
          handleDaySelect={handleDaySelect}
        />
        <TomatoContainer>
          <TypoAtom>🍅</TypoAtom>
          <TomatoSelector
            aria-label="tomato_select"
            value={duration}
            onChange={handleDuration}
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
        </TomatoContainer>
        <ButtonContainer>
          <IconAtom
            size={2.624375}
            backgroundColor={'whiteWine'}
            onClick={handleEditCancel}
          >
            <img alt="cancel_edit" src={'icons/close.svg'} />
          </IconAtom>
          <IconAtom
            size={2.624375}
            backgroundColor={'subFontColor'}
            onClick={() => {
              const trimmed = titleValidation(editData.todo);
              if (!trimmed) return;
              handleEditSubmit.call(this, { ...editData, todo: trimmed });
            }}
          >
            <img alt="submit_edit" src={'icons/ok.svg'} />
          </IconAtom>
        </ButtonContainer>
      </AdditionalDataContainer>
    </EditWrapper>
  );
};

export default EditUI;

export const EditWrapper = styled.div`
  padding: 0.759rem;
  border-radius: 10px;
  flex: column;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 1.439375rem;
`;

const AdditionalDataContainer = styled.div`
  display: flex;
  margin-top: 2.485rem;
  justify-content: space-between;
`;

const TomatoContainer = styled.div`
  display: flex;
  align-items: center;
  > span {
    margin-right: 0.625rem;
  }
`;

const TomatoSelector = styled.select`
  border-radius: 0.3rem;
  padding: 0.4rem;
  background-color: ${({ theme }) => theme.colors.whiteWine};
  text-align: center;
`;

const TomatoOption = styled.option``;

const ButtonContainer = styled.div`
  display: flex;
  div:first-of-type {
    margin-right: 0.356875rem;
  }
`;
