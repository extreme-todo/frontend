/* react */
import {
  KeyboardEventHandler,
  ReactEventHandler,
  useCallback,
  useMemo,
  useState,
} from 'react';

/* atomics */
import {
  BtnAtom,
  CardAtom,
  IconAtom,
  InputAtom,
  TomatoInput,
  TypoAtom,
} from '../atoms';
import { CategoryInput } from '../molecules';
import { CalendarInput } from '../organisms';

/* custom hooks */
import { usePomodoroValue } from '../hooks';

/* custom functions or methods */
import { todosApi } from '../shared/apis';
import { categoryValidation, titleValidation } from '../shared/inputValidation';
import { setTimeInFormat } from '../shared/timeUtils';
import { AddTodoDto, ETIndexed } from '../DB/indexed';
import { RandomTagColorList } from '../shared/RandomTagColorList';

/* packages */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SelectSingleEventHandler } from 'react-day-picker';
import styled from '@emotion/styled';
import { AxiosError } from 'axios';

interface IAddTodoProps {
  handleClose: () => void;
}

const ramdomTagColorList = RandomTagColorList.getInstance();

const AddTodo = ({ handleClose }: IAddTodoProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categoryArray, setCategoryArray] = useState<Array<string>>([]);
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

          if (categoryArray.length > 0) {
            const copy = categoryArray.slice();
            copy.push(trimmed);
            setCategoryArray(copy);
          } else {
            setCategoryArray([trimmed]);
          }
          ramdomTagColorList.setColor = trimmed;
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
    <AddTodoWrapper
      w="53.75rem"
      h="20rem"
      padding="2rem 1.5rem"
      className="card"
      as={'form'}
    >
      <MainWrapper>
        <TitleWrapper>
          <InputAtom.Underline
            value={title}
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
          <BtnAtom handleOnClick={handleClose} ariaLabel="close">
            <IconAtom size={2} alt="close" src="icon/close.svg" />
          </BtnAtom>
        </TitleWrapper>
        <CalendarAndCategoryWrapper>
          <CalendarWrapper>
            <TypoAtom fontSize="h3">TODO 시작시간</TypoAtom>
            <TypoAtom fontSize="h3">:</TypoAtom>
            <CalendarInput
              handleDaySelect={handleDaySelect}
              selectedDay={selectedDate}
            />
          </CalendarWrapper>
          <CategoryWrapper>
            <CategoryInput
              categories={categoryArray}
              category={category}
              handleSubmit={handleSubmitCategory}
              handleClick={handleClickCategory}
              handleChangeCategory={handleCategoryInput}
              tagColorList={ramdomTagColorList.getColorList}
            />
          </CategoryWrapper>
        </CalendarAndCategoryWrapper>
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
          handleOnClick={() => handleAddSubmit(addData)}
          paddingHorizontal="2.0625rem"
          paddingVertical="0.375rem"
          btnType="lightBtn"
          ariaLabel="submit"
        >
          <div style={{ width: 'max-content' }}>추가</div>
        </BtnAtom>
      </FooterWrapper>
    </AddTodoWrapper>
  );
};

export default AddTodo;

const AddTodoWrapper = styled(CardAtom)`
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
`;

const CalendarAndCategoryWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  column-gap: 1rem;
`;

const CalendarWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.25rem;
  width: 60%;
  height: 1.75rem;
`;

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
