import {
  KeyboardEventHandler,
  ReactEventHandler,
  useRef,
  useState,
} from 'react';

import { IconAtom, InputAtom, TagAtom } from '../atoms';
import {
  CalendarContainer,
  CategoryContainer,
} from '../molecules/TodoCard/content/EditUI';

import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import DayPickerUI from '../molecules/TodoCard/content/DayPickerUI';

const AddTodo = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categoryArray, setCategoryArray] = useState<Array<string>>([]);
  const [tomato, setTomato] = useState('1');

  /* React Day Picker State and Ref */
  const [showPopper, setShowPopper] = useState(false);
  const [selected, setSelected] = useState<Date>(new Date());
  const popperRef = useRef<HTMLDivElement>(null);

  /* handler */
  const handleTitleInput: ReactEventHandler<HTMLInputElement> = (event) =>
    setTitle(event.currentTarget.value);

  const handleCategoryInput: ReactEventHandler<HTMLInputElement> = (event) =>
    setCategory(event.currentTarget.value);

  const handleSubmitCategory: KeyboardEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (event.code === 'Enter') {
      const newCategory = (event.target as HTMLInputElement).value;
      const regularCharacterRex =
        /^[a-zA-Z0-9 \u3131-\uD79D\u4E00-\u9FA5\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u20000-\u2A6DF\u2A700-\u2B73F\u2B740-\u2B81F\u2B820-\u2CEAF\u2CEB0-\u2EBEF\u2F800-\u2FA1F]+$/;
      const specialCharactersRex = /[@~₩?><|\\=_^]/;

      if (!!!newCategory.length) return alert('제목을 입력해주세요.');
      // 한글 중복 입력 처리
      if (event.nativeEvent.isComposing) return;
      // 글로벌 문자(영어 포함 한국,중국,일본어)인지 && 특수문자와 이모지 제외처리
      if (
        !regularCharacterRex.test(newCategory) ||
        specialCharactersRex.test(newCategory)
      )
        return alert('특수문자와 이모지는 입력할 수 없습니다.');

      // 5개가 되면 input 창을 사라지게 해서 일단은 없어도 되는 조건
      if (categoryArray?.length === 5)
        return alert('category는 5개까지 입력할 수 있습니다.');

      const trimmed = newCategory.replace(/\s+/g, ' ').trim();

      if (categoryArray?.includes(trimmed))
        return alert('이미 존재하는 카테고리 입니다.');
      if (trimmed.length > 20)
        return alert('20자 이하로만 입력할 수 있습니다.');

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

  const handleButtonClick = () => {
    setShowPopper(true);
  };

  const handleTomatoInput: ReactEventHandler<HTMLInputElement> = (event) => {
    setTomato(event.currentTarget.value);
  };

  return (
    <>
      <InputAtom.Usual
        value={title}
        handleChange={handleTitleInput}
        placeholder="할 일을 입력하세요"
        ariaLabel="title"
      />
      <CategoryContainer>
        {categoryArray?.map((category) => (
          <TagAtom
            key={category}
            handler={() => handleClickCategory.call(this, category)}
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

        {categoryArray && categoryArray.length >= 5 ? null : (
          <InputAtom.Underline
            value={category}
            handleChange={handleCategoryInput}
            handleKeyDown={handleSubmitCategory}
            placeholder="카테고리를 입력하세요"
            ariaLabel="category"
          />
        )}
      </CategoryContainer>
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
          ariaLabel="calendar"
          placeholder={'달력 아이콘을 눌러주세요.'}
          styleOption={{ width: '7rem' }}
          handleChange={() => {
            console.debug('click');
          }}
        />
      </CalendarContainer>
      <DayPickerUI
        showPopper={showPopper}
        popperRef={popperRef}
        selected={selected}
        setShowPopper={setShowPopper}
        setSelected={setSelected}
      />
      <InputAtom.Usual
        value={tomato}
        handleChange={handleTomatoInput}
        placeholder="할 일을 입력하세요"
        ariaLabel="tomato"
        type="range"
      />
    </>
  );
};

export default AddTodo;
