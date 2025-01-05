import styled from '@emotion/styled';
import { IChildProps } from '../shared/interfaces';
import { FontName, TagColorName } from '../styles/emotion';

export interface ITagAtomProps extends IChildProps {
  title?: string;
  styleOption?: ITagSpanProps;
  ariaLabel?: string;
  className?: string;
}

interface ITagSpanProps {
  bg?: TagColorName;
  fontsize?: FontName;
  size?: 'normal';
}

function TagAtom({
  children,
  styleOption,
  title,
  ariaLabel,
  className,
}: ITagAtomProps) {
  return (
    <TagSpan
      title={title}
      {...styleOption}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </TagSpan>
  );
}

const TagSpan = styled.span<ITagSpanProps & { isHandler?: boolean }>`
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
        return '0 1rem';
    }
  }};

  background: ${({ bg, theme }) =>
    bg ? theme.color.tag[bg] : theme.color.tag['orange']};
  color: ${({
    bg,
    theme: {
      color: { fontColor },
    },
  }) => {
    switch (bg) {
      case 'mint':
      case 'orange':
      case 'pink':
      case 'purple':
        return fontColor.white;
      default:
        return fontColor.primary1;
    }
  }};

  border-radius: 50px;

  font-size: ${({ fontsize, theme: { fontSize } }) =>
    fontsize ? fontSize[fontsize].size : fontSize.b2.size};
  font-weight: ${({ fontsize, theme: { fontSize } }) =>
    fontsize ? fontSize[fontsize].weight : fontSize.b2.weight};
  line-height: 120%;

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

export default TagAtom;
export { type ITagSpanProps };
