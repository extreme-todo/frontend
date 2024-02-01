import { useRef, useState } from 'react';

import { IconAtom, InputAtom, TagAtom } from '../../../atoms';

import styled from '@emotion/styled';

import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import DayPickerUI from './DayPickerUI';

interface IEditUIProps {
  handleSubmit: (params: React.KeyboardEvent<HTMLInputElement>) => void;
  title: string;
  handleChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  category: string;
  handleChangeCategory: (event: React.ChangeEvent<HTMLInputElement>) => void;
  categories: string[] | null;
  handleClickTag: (category: string) => void;
}

const EditUI = ({
  handleSubmit,
  categories,
  title,
  handleChangeTitle,
  category,
  handleChangeCategory,
  handleClickTag,
}: IEditUIProps) => {
  const [selected, setSelected] = useState<Date>(new Date());
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
      <CalendarContainer ref={popperRef}>
          onClick={handleButtonClick}
          aria-label="pick a date"
          type="button"
        >
          <IconAtom>
            <img src="icons/calendar.svg" />
          </IconAtom>
        <InputAtom.Underline
          value={format(selected.toString(), 'y-MM-dd')}
          ariaLabel="calendar"
          placeholder={'달력 아이콘을 눌러주세요.'}
          styleOption={{ width: '7rem' }}
        />
      </CalendarContainer>
            handleChange={() => {
              console.debug('click');
            }}
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

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const IconContainer = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  :hover {
    background-color: ${({ theme }) => theme.colors.bgColor};
    transition: background-color 0.2s ease-in-out;
  }
`;
