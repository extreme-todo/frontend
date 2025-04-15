import { memo, ReactEventHandler } from 'react';

import { withTheme } from '@emotion/react';
import styled from '@emotion/styled';
import {
  BackgroundColorName,
  FontColorName,
  FontName,
  LengthType,
  PaddingType,
} from '../styles/emotion';

interface CommonInputStyle {
  width?: LengthType;
  height?: LengthType;
  backgroundColor?: BackgroundColorName;
  borderColor?: BackgroundColorName;
  fontColor?: FontColorName;
  font?: FontName;
  margin?: PaddingType;
  textAlign?: 'center';
  borderWidth?: LengthType;
  placeholderOpacity?: number;
  placeholderColor?: FontColorName;
  padding?: PaddingType;
  borderStyle?: 'dashed' | 'dotted' | 'none' | 'solid';
  borderRadius?: LengthType;
}

interface IInputAtomProps
  extends Pick<HTMLInputElement, 'placeholder' | 'value'> {
  handleChange?: ReactEventHandler<HTMLInputElement>;
  handleKeyDown?: (params: React.KeyboardEvent<HTMLInputElement>) => void;
  handleFocus?: React.FocusEventHandler<HTMLInputElement>;
  handleBlur?: React.FocusEventHandler<HTMLInputElement>;
  className?: string;
  ariaLabel?: string;
  name?: string;
  id?: string;
  inputRef?: (
    node: HTMLInputElement | null,
  ) => void | React.RefObject<HTMLInputElement>;
}

const Usual = memo(
  ({
    handleChange = () => null,
    handleKeyDown,
    handleFocus,
    handleBlur,
    ariaLabel,
    styleOption,
    inputRef,
    ...props
  }: IInputAtomProps & {
    styleOption?: CommonInputStyle;
  }) => {
    return (
      <UsualInput
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={ariaLabel}
        styleOption={styleOption}
        ref={inputRef}
        {...props}
      />
    );
  },
);

const Underline = memo(
  ({
    handleChange = () => null,
    handleKeyDown,
    handleFocus,
    handleBlur,
    ariaLabel,
    inputRef,
    ...props
  }: IInputAtomProps & { styleOption?: CommonInputStyle }) => {
    return (
      <UnderlineInput
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={ariaLabel}
        ref={inputRef}
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
  styled.input<
    Pick<IInputAtomProps, 'value' | 'placeholder'> & {
      styleOption?: CommonInputStyle;
    }
  >(({ styleOption, theme, value, placeholder }) => ({
    height: styleOption?.height ?? '1.863rem',
    width: styleOption?.width
      ? styleOption.width
      : value.length > 10
      ? value.length + 10 + 'ch'
      : placeholder.length + 5 + 'ch',
    backgroundColor: styleOption?.backgroundColor
      ? theme.color.backgroundColor[styleOption.backgroundColor]
      : 'transparent',
    fontSize: styleOption?.font
      ? theme.fontSize[styleOption.font].size
      : theme.fontSize.body.size,
    fontWeight: styleOption?.font
      ? theme.fontSize[styleOption.font].weight
      : theme.fontSize.body.weight,
    color: styleOption?.fontColor
      ? theme.color.fontColor[styleOption.fontColor]
      : theme.color.fontColor.primary1,
    margin: styleOption?.margin,
    textAlign: styleOption?.textAlign ?? 'inherit',
    outline: 0,
    boxSizing: 'border-box',
    '::placeholder': {
      opacity: styleOption?.placeholderOpacity ?? 0.4,
      color: styleOption?.placeholderColor
        ? theme.color.fontColor[styleOption.placeholderColor]
        : 'inherit',
    },
  })),
);

const UsualInput = withTheme(
  styled(CommonInput)<{ styleOption?: CommonInputStyle }>(
    ({ styleOption, theme }) => ({
      borderRadius: styleOption?.borderRadius ?? undefined,
      borderWidth: styleOption?.borderWidth ?? 1,
      padding: styleOption?.padding ?? '0 1rem 0 1rem',
      borderStyle: styleOption?.borderStyle ?? 'solid',
      borderColor: styleOption?.borderColor
        ? theme.color.backgroundColor[styleOption.borderColor]
        : theme.color.backgroundColor.primary1,
    }),
  ),
);
const UnderlineInput = withTheme(
  styled(CommonInput)<{
    styleOption?: CommonInputStyle;
  }>(({ styleOption, theme }) => ({
    border: 'none',
    borderBottom: `${styleOption?.borderWidth ?? '1px'} solid ${
      styleOption?.borderColor
        ? theme.color.backgroundColor[styleOption.borderColor]
        : theme.color.backgroundColor.primary1
    }`,
    borderRadius: '0px',
    padding: styleOption?.padding ?? '0 0 0.5rem 0',
  })),
);
