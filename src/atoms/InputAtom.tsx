import { memo, ReactEventHandler } from 'react';

import { withTheme } from '@emotion/react';
import styled from '@emotion/styled';
import {
  BackgroundColorName,
  FontName,
  LengthType,
  PaddingType,
} from '../styles/emotion';

interface IInputAtomProps
  extends Pick<HTMLInputElement, 'placeholder' | 'value'> {
  handleChange?: ReactEventHandler<HTMLInputElement>;
  handleKeyDown?: (params: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  ariaLabel?: string;
  styleOption?: {
    width?: LengthType;
    height?: LengthType;
    borderRadius?: LengthType;
    padding?: PaddingType;
    margin?: PaddingType;
    backgroundColor?: BackgroundColorName;
    borderWidth?: LengthType;
    font?: FontName;
  };
}

const Usual = memo(({ handleChange, ariaLabel, ...props }: IInputAtomProps) => {
  return (
    <UsualInput onChange={handleChange} aria-label={ariaLabel} {...props} />
  );
});

const Underline = memo(
  ({ handleChange, handleKeyDown, ariaLabel, ...props }: IInputAtomProps) => {
    return (
      <UnderlineInput
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        {...props}
      />
    );
  },
);

const InputAtom = {
  Usual,
  Underline,
};

export default InputAtom;

const CommonInput = withTheme(
  styled.input<Pick<IInputAtomProps, 'styleOption'>>(
    ({ styleOption, theme }) => ({
      backgroundColor: styleOption?.backgroundColor
        ? theme.color.backgroundColor[styleOption.backgroundColor]
        : 'transparent',
      fontSize: styleOption?.font
        ? theme.fontSize[styleOption.font].size
        : theme.fontSize.body.size,
      fontWeight: styleOption?.font
        ? theme.fontSize[styleOption.font].weight
        : theme.fontSize.body.weight,
      margin: styleOption?.margin,
      outline: 0,
      '::placeholder': {
        opacity: 0.4,
      },
    }),
  ),
);
const UnderlineInput = withTheme(
  styled.input<Pick<IInputAtomProps, 'styleOption' | 'value' | 'placeholder'>>(
    ({ styleOption, value, placeholder, theme }) => ({
      width: styleOption?.width
        ? styleOption?.width
        : value.length > 10
        ? value.length + 10 + 'ch'
        : placeholder.length + 5 + 'ch',
      height: styleOption?.height ?? '1.863rem',
      backgroundColor: styleOption?.backgroundColor ?? `rgba(255, 255, 255, 0)`,
      fontSize: styleOption?.backgroundColor ?? theme.fontSize.b2.size,
      fontWeight: styleOption?.fontWeight
        ? theme.fontSize[styleOption.fontWeight].weight
        : theme.fontSize.b2.weight,

      outlineWidth: 0,
      boxSizing: 'border-box',
      border: 'none',
      borderBottom: `1px solid ${theme.color.fontColor.primary1}`,
      textAlign: 'center',
      borderRadius: '0px',
    }),
  ),
);
