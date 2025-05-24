import { memo, ReactEventHandler, useCallback } from 'react';
import { InputAtom, TypoAtom } from '../../../atoms';

interface ITitleOrInputProps {
  todo: string;
  titleValue: string;
  isThisEdit: boolean;
  handleChangeTitle: ReactEventHandler<HTMLInputElement>;
  handleBlurTitle: ReactEventHandler<HTMLInputElement>;
  titleError: boolean;
}

export const TitleOrInput = memo(
  ({
    todo,
    titleValue,
    isThisEdit,
    handleChangeTitle,
    handleBlurTitle,
    titleError,
  }: ITitleOrInputProps) => {
    if (isThisEdit) {
      return (
        <label htmlFor="title">
          <InputAtom.Underline
            value={titleValue}
            handleChange={handleChangeTitle}
            handleBlur={handleBlurTitle}
            placeholder="할 일을 입력하세요"
            ariaLabel="title_input"
            name="title"
            className="todoTitle"
            inputRef={useCallback((node: HTMLInputElement | null) => {
              node?.focus();
            }, [])}
            styleOption={{
              borderWidth: titleError ? '2px' : '1px',
              padding: '0 0 0 0',
              height: '1.25rem',
              font: 'h3',
              borderColor: titleError ? 'extreme_orange' : 'primary1',
              fontColor: 'primary1',
            }}
          />
        </label>
      );
    } else {
      return (
        <TypoAtom className="todoTitle" fontSize="h3" fontColor="primary2">
          {todo}
        </TypoAtom>
      );
    }
  },
);
