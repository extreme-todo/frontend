import { ReactEventHandler, useState } from 'react';

import { IconAtom, InputAtom, TagAtom, TypoAtom } from '../../../atoms';

import styled from '@emotion/styled';

import { format } from 'date-fns';

import { TodoDate, TodoEntity } from '../../../DB/indexedAction';
import CalendarInput from '../../CalendarInput';
import { SelectSingleEventHandler } from 'react-day-picker';

interface IEditUIProps {
  todoData: TodoEntity;
  handleSubmit: (params: React.KeyboardEvent<HTMLInputElement>) => void;
  title: string;
  handleChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  category: string;
  handleChangeCategory: (event: React.ChangeEvent<HTMLInputElement>) => void;
  categories: string[] | null;
  handleClickTag: (category: string) => void;
  handleEditCancel: () => void;
  handleEditSubmit: (todo: TodoEntity) => void;
  duration: number;
  handleDuration: ReactEventHandler<HTMLSelectElement>;
}

const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const EditUI = ({
  todoData,
  handleSubmit,
  categories,
  title,
  handleChangeTitle,
  category,
  handleChangeCategory,
  handleClickTag,
  handleEditCancel,
  handleEditSubmit,
  duration,
  handleDuration,
}: IEditUIProps) => {
  const { date } = todoData;
  const [selected, setSelected] = useState<Date>(new Date(date));

  const handleDaySelect: SelectSingleEventHandler = (date) => {
    if (!date) return;
    setSelected(date);
  };

  const editData = {
    ...todoData,
    categories,
    date: format(selected.toString(), 'y-MM-dd') as TodoDate,
    todo: title,
    duration,
  };

  return (
    <EditWrapper>
      <InputAtom.Usual
        value={title}
        handleChange={handleChangeTitle}
        placeholder="할 일을 입력하세요"
        ariaLabel="title_input"
      />
      <CategoryContainer>
        {categories?.map((category) => (
          <TagAtom
            key={category}
            handler={() => handleClickTag.call(this, category)}
            ariaLabel="category_tag"
            styleOption={{
              fontsize: 'sm',
              size: 'sm',
              bg: 'whiteWine',
              maxWidth: 10,
            }}
          >
            {category}
          </TagAtom>
        ))}
        {categories && categories.length >= 5 ? null : (
          <InputAtom.Underline
            value={category}
            handleChange={handleChangeCategory}
            handleKeyDown={handleSubmit}
            placeholder="카테고리를 입력하세요"
            ariaLabel="category_input"
          />
        )}
      </CategoryContainer>
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
            onClick={() => handleEditSubmit.call(this, editData)}
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

export const CategoryContainer = styled.div`
  margin-top: 0.61rem;
  & > button {
    margin-right: 0.61rem;
  }
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
