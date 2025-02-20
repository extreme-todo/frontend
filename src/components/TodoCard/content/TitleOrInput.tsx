import { memo, ReactEventHandler, useCallback } from 'react';
import { InputAtom, TypoAtom } from '../../../atoms';

interface ITitleOrInputProps {
  todo: string;
  titleValue: string;
  isThisEdit: boolean;
  handleChangeTitle: ReactEventHandler<HTMLInputElement>;
}

const TitleOrInput = memo(
  ({ todo, titleValue, isThisEdit, handleChangeTitle }: ITitleOrInputProps) => {
    if (isThisEdit) {
      return (
        <InputAtom.Underline
          value={titleValue}
          handleChange={handleChangeTitle}
          placeholder="할 일을 입력하세요"
          ariaLabel="title_input"
          className="todoTitle"
          inputRef={useCallback((node: HTMLInputElement | null) => {
            node?.focus();
          }, [])}
          styleOption={{
            borderWidth: '1px',
            padding: '0 0 0 0',
            height: '1.25rem',
            font: 'h3',
            borderColor: 'primary1',
            fontColor: 'primary1',
          }}
        />
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

export default TitleOrInput;
