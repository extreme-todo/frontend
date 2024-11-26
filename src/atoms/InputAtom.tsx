import { memo, ReactEventHandler } from 'react';

import { withTheme } from '@emotion/react';
import styled from '@emotion/styled';
import {
  BackgroundColorName,
  FontName,
  LengthType,
  PaddingType,
} from '../styles/emotion';

interface CommonInputStyle {
  width?: LengthType;
  height?: LengthType;
  backgroundColor?: BackgroundColorName;
  font?: FontName;
  margin?: PaddingType;
  textAlign?: 'center';
  borderWidth?: LengthType;
  placeholderOpacity?: number;
}

interface UsualInputStyle {
  padding?: PaddingType;
  borderStyle?: 'dashed' | 'dotted' | 'none';
  borderRadius?: LengthType;
}

interface IInputAtomProps
  extends Pick<HTMLInputElement, 'placeholder' | 'value'> {
  handleChange?: ReactEventHandler<HTMLInputElement>;
  handleKeyDown?: (params: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  ariaLabel?: string;
}

const Usual = memo(
  ({
    handleChange,
    ariaLabel,
    styleOption,
    ...props
  }: IInputAtomProps & {
    styleOption?: CommonInputStyle & UsualInputStyle;
  }) => {
    return (
      <UsualInput
        onChange={handleChange}
        aria-label={ariaLabel}
        styleOption={styleOption}
        {...props}
      />
    );
  },
);

const Underline = memo(
  ({
    handleChange,
    handleKeyDown,
    ariaLabel,
    ...props
  }: IInputAtomProps & { styleOption?: CommonInputStyle }) => {
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
    color: theme.color.fontColor.primary1,
    margin: styleOption?.margin,
    textAlign: styleOption?.textAlign ?? 'inherit',
    outline: 0,
    boxSizing: 'border-box',
    '::placeholder': {
      opacity: styleOption?.placeholderOpacity ?? 0.4,
    },
  })),
);

const UsualInput = withTheme(
  styled(CommonInput)<{ styleOption?: UsualInputStyle }>(({ styleOption }) => ({
    borderRadius: styleOption?.borderRadius ?? undefined,
    borderWidth: styleOption?.borderWidth ?? 1,
    padding: styleOption?.padding ?? '0 1rem 0 1rem',
    borderStyle: styleOption?.borderStyle ?? 'solid',
  })),
);
const UnderlineInput = withTheme(
  styled(CommonInput)<{
    styleOption?: CommonInputStyle;
  }>(({ styleOption, theme }) => ({
    border: 'none',
    borderBottom: `${styleOption?.borderWidth ?? '1px'} solid ${
      theme.color.primary.primary1
    }`,
    borderRadius: '0px',
    padding: '0 0 0.5rem 0',
  })),
);
