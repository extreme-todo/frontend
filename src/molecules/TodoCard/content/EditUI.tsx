import { useRef, useState } from 'react';

import { IconAtom, InputAtom, TagAtom, TypoAtom } from '../../../atoms';

import styled from '@emotion/styled';

import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import DayPickerUI from './DayPickerUI';
import { TodoDate } from '../../../DB/indexedAction';
import { usePomodoroValue } from '../../../hooks';

interface IEditUIProps {
  handleSubmit: (params: React.KeyboardEvent<HTMLInputElement>) => void;
  title: string;
  handleChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  category: string;
  handleChangeCategory: (event: React.ChangeEvent<HTMLInputElement>) => void;
  categories: string[] | null;
  handleClickTag: (category: string) => void;
  date: TodoDate;
  duration: number;
}

const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const EditUI = ({
  handleSubmit,
  categories,
  title,
  handleChangeTitle,
  category,
  handleChangeCategory,
  handleClickTag,
  date,
  duration,
}: IEditUIProps) => {
  const {
    settings: { focusStep },
  } = usePomodoroValue();

  const [selected, setSelected] = useState<Date>(new Date(date));
  const [isPopper, setIsPopper] = useState(false);

  const popperRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = () => {
    setIsPopper(true);
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
            placeholder="카테고리를 입력하고 엔터를 눌러주세요."
            ariaLabel="category_input"
          />
        )}
      </CategoryContainer>
      <AdditionalDataContainer>
        <CalendarContainer
          ref={popperRef}
          title="달력 아이콘을 클릭해 주세요."
          onClick={handleButtonClick}
        >
          <IconAtom>
            <img alt="calendar_icon" src="icons/calendar.svg" />
          </IconAtom>
          <InputAtom.Underline
            value={format(selected.toString(), 'y-MM-dd')}
            ariaLabel="calendar_input"
            placeholder={'달력 아이콘을 눌러주세요.'}
            styleOption={{ width: '7rem' }}
            handleChange={() => {
              console.debug('click');
            }}
          />
        </CalendarContainer>
        <TomatoContainer>
          <TypoAtom>🍅</TypoAtom>
          <TomatoSelector
            aria-label="tomato_select"
            defaultValue={Math.ceil(duration / focusStep)}
          >
            <TomatoOption
              aria-label="tomato_option"
              data-testid="tomato_option"
              value={undefined}
            >
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
      </AdditionalDataContainer>
      <DayPickerUI
        isPopper={isPopper}
        popperRef={popperRef}
        selected={selected}
        setIsPopper={setIsPopper}
        setSelected={setSelected}
      />
    </EditWrapper>
  );
};

export default EditUI;

const EditWrapper = styled.div`
  padding: 0.759rem;
  border-radius: 10px;
  flex: column;
`;

const CategoryContainer = styled.div`
  margin-top: 0.61rem;
  & > button {
    margin-right: 0.61rem;
    margin-bottom: 0.61rem;
  }
`;

const AdditionalDataContainer = styled.div`
  display: flex;
  margin-top: 2.485rem;
`;

const CalendarContainer = styled.div`
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 1rem;
  padding: 1px;
  :hover {
    background-color: ${({ theme }) => theme.colors.bgColor};
    transition: background-color 0.2s ease-in-out;
  }

  div:first-of-type {
    width: 2rem;
    height: 2rem;
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
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
