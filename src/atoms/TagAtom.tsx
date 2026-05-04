import styled from '@emotion/styled';
import { IChildProps } from '../shared/interfaces';
import { BackgroundColorName, FontName, TagColorName } from '../styles/emotion';
import { css } from '@emotion/react';
import { useMemo } from 'react';
import { designTheme } from '../styles/theme';

interface ITagAtomProps extends IChildProps {
  title?: string;
  styleOption?: ITagSpanProps;
  ariaLabel?: string;
  className?: string;
}

export interface ITagSpanProps {
  bg?: TagColorName | 'transparent';
  fontsize?: FontName;
  size?: 'normal';
  borderColor?: BackgroundColorName;
  isSelected?: boolean;
  selectable?: boolean;
}

export function getTagTextColor(bg: TagColorName | 'transparent' | undefined) {
  switch (bg) {
    case 'green':
    case 'gray':
    case 'brown':
    case 'purple':
    case 'cyan':
      return designTheme.color.fontColor.white;
    default:
      return designTheme.color.fontColor.primary1;
  }
}

export function TagAtom({
  children,
  styleOption,
  title,
  ariaLabel,
  className,
}: ITagAtomProps) {
  const tagTextColor = useMemo(() => {
    return getTagTextColor(styleOption?.bg);
  }, [styleOption?.bg]);

  return (
    <TagSpan
      title={title}
      {...styleOption}
      className={className}
      aria-label={ariaLabel}
      bg={styleOption?.bg ?? 'orange'}
      color={tagTextColor}
    >
      {children}
      {styleOption?.selectable && (
        <svg
          className="check-icon"
          width="10"
          height="8"
          viewBox="0 0 10 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 3.4L4.42857 7L9 1" />
        </svg>
      )}
    </TagSpan>
  );
}

const TagSpan = styled.span<
  ITagSpanProps & {
    isHandler?: boolean;
    bg: TagColorName | 'transparent';
    color?: string;
  }
>`
  transition: opacity 0.3s ease-in-out;
  width: ${({ size }) => {
    switch (size) {
      case 'normal':
      default:
        return 'fit-content';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'normal':
        return '1.25rem';
      default:
        return 'fit-content';
    }
  }};

  padding: ${({ size }) => {
    switch (size) {
      case 'normal':
      default:
        return '0.375rem 0.75rem';
    }
  }};

  background: ${({ bg, theme }) =>
    bg === 'transparent' ? 'transparent' : theme.color.tag[bg]};
  color: ${({
    color,
    theme: {
      color: { fontColor },
    },
  }) => color ?? fontColor.primary1};
  border: ${({
    borderColor,
    theme: {
      color: { backgroundColor },
    },
  }) =>
    borderColor ? `${backgroundColor[borderColor]} 1px solid` : 'inherit'};

  border-radius: 50px;

  font-size: ${({ fontsize, theme: { fontSize } }) =>
    fontsize ? fontSize[fontsize].size : fontSize.tag.size};
  font-weight: ${({ fontsize, theme: { fontSize } }) =>
    fontsize ? fontSize[fontsize].weight : fontSize.tag.weight};
  line-height: 120%;

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  align-items: center;

  &:has(.check-icon) {
    padding-right: 0.375rem;
    ${({ isSelected }) =>
      !isSelected &&
      css`
        opacity: 0.3;
      `}
  }
  .check-icon {
    display: inline-flex;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    margin-left: 0.25rem;
    padding: 0.125rem;
    box-sizing: border-box;
    background-color: ${({ bg }) => {
      switch (bg) {
        case 'green':
        case 'gray':
        case 'brown':
        case 'purple':
        case 'cyan':
          return 'rgba(255, 255, 255, 0.25)';
        default:
          return 'rgba(82,62,161, 0.25)';
      }
    }};
    stroke: ${({
      bg,
      isSelected,
      theme: {
        color: { backgroundColor },
      },
    }) => {
      if (!isSelected) return 'transparent';
      switch (bg) {
        case 'green':
        case 'gray':
        case 'brown':
        case 'purple':
        case 'cyan':
          return '#ffffff';
        default:
          return backgroundColor.primary1;
      }
    }};
  }
`;
