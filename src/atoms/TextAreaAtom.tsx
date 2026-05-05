import {
  memo,
  ReactEventHandler,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';

import { withTheme } from '@emotion/react';
import styled from '@emotion/styled';
import {
  BackgroundColorName,
  FontColorName,
  FontName,
  LengthType,
  PaddingType,
} from '../styles/emotion';

interface CommonTextAreaStyle {
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

interface ITextAreaAtomProps
  extends Pick<HTMLTextAreaElement, 'placeholder' | 'value'> {
  handleChange?: ReactEventHandler<HTMLTextAreaElement>;
  handleKeyDown?: (params: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  handleBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  className?: string;
  ariaLabel?: string;
  name?: string;
  id?: string;
  inputRef?: (
    node: HTMLTextAreaElement | null,
  ) => void | React.RefObject<HTMLTextAreaElement>;
  tabIndex?: number;
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
    tabIndex = 0,
    ...props
  }: ITextAreaAtomProps & {
    styleOption?: CommonTextAreaStyle;
  }) => {
    return (
      <UsualTextArea
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={ariaLabel}
        styleOption={styleOption}
        ref={inputRef}
        rows={1}
        tabIndex={tabIndex}
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
    tabIndex = 0,
    styleOption,
    ...props
  }: ITextAreaAtomProps & { styleOption?: CommonTextAreaStyle }) => {
    const innerRef = useRef<HTMLTextAreaElement>(null);

    const resize = useCallback(() => {
      const el = innerRef.current;
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }, []);

    useLayoutEffect(() => {
      resize();
    }, [props.value, resize]);

    const setRef = useCallback(
      (node: HTMLTextAreaElement | null) => {
        (
          innerRef as React.MutableRefObject<HTMLTextAreaElement | null>
        ).current = node;
        if (typeof inputRef === 'function') inputRef(node);
        else if (inputRef)
          (
            inputRef as React.MutableRefObject<HTMLTextAreaElement | null>
          ).current = node;
      },
      [inputRef],
    );

    return (
      <UnderlineTextArea
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={resize}
        aria-label={ariaLabel}
        ref={setRef}
        rows={1}
        tabIndex={tabIndex}
        styleOption={styleOption}
        {...props}
      />
    );
  },
);

export const TextAreaAtom = {
  Usual,
  Underline,
};

const CommonTextArea = withTheme(
  styled.textarea<
    Pick<ITextAreaAtomProps, 'value' | 'placeholder'> & {
      styleOption?: CommonTextAreaStyle;
    }
  >(({ styleOption, theme }) => ({
    minHeight: styleOption?.height,
    width: styleOption?.width ?? '100%',
    resize: 'none',
    overflow: 'hidden',
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
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    '::placeholder': {
      opacity: styleOption?.placeholderOpacity ?? 0.4,
      color: styleOption?.placeholderColor
        ? theme.color.fontColor[styleOption.placeholderColor]
        : 'inherit',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
  })),
);

const UsualTextArea = withTheme(
  styled(CommonTextArea)<{ styleOption?: CommonTextAreaStyle }>(
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

const UnderlineTextArea = withTheme(
  styled(CommonTextArea)<{
    styleOption?: CommonTextAreaStyle;
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
