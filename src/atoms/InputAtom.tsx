import styled from '@emotion/styled';
import { designTheme } from '../styles/theme';
import { withTheme } from '@emotion/react';
import { memo } from 'react';

type TypePadding = `${number} ${number} ${number} ${number}`;
type TypeLength = `${number}rem` | `${number}%` | `${number}px` | `${number}ch`;

interface IInputAtomProps
  extends Pick<HTMLInputElement, 'placeholder' | 'value'> {
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown?: (params: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  ariaLabel?: string;
  styleOption?: {
    width?: TypeLength;
    height?: TypeLength;
    borderRadius?: TypeLength;
    padding?: TypePadding;
    margin?: TypePadding;
    backgroundColor?: keyof typeof designTheme.colors;
    outlineWidth?: TypeLength;
    fontWeight?: keyof typeof designTheme.fontSize;
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

const UsualInput = withTheme(
  styled.input<Pick<IInputAtomProps, 'styleOption'>>(
    ({ styleOption, theme }) => ({
      width: styleOption?.width ?? '100%',
      height: styleOption?.height ?? '3.898rem',
      backgroundColor: styleOption?.backgroundColor ?? theme.colors.whiteWine,
      fontSize: styleOption?.backgroundColor ?? theme.fontSize.h3.size,
      fontWeight: styleOption?.fontWeight
        ? theme.fontSize[styleOption.fontWeight].weight
        : theme.fontSize.h3.weight,
      borderRadius: styleOption?.borderRadius ?? '1.453rem',
      outlineWidth: 0,
      boxSizing: 'border-box',
      padding: '0 1rem 0 1rem',
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
      fontSize: styleOption?.backgroundColor ?? theme.fontSize.tag.size,
      fontWeight: styleOption?.fontWeight
        ? theme.fontSize[styleOption.fontWeight].weight
        : theme.fontSize.tag.weight,

      outlineWidth: 0,
      boxSizing: 'border-box',
      border: 'none',
      borderBottom: `1px solid ${theme.colors.whiteWine}`,
      textAlign: 'center',
      borderRadius: '0px',
    }),
  ),
);
