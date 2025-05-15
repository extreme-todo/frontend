import styled from '@emotion/styled';
import { IChildProps } from '../shared/interfaces';
import { rainbowStyle } from '../styles/Global';
import { FontColor, FontName } from '../styles/emotion';

interface ITypoProps extends IChildProps {
  fontSize?: FontName;
  fontColor?: keyof FontColor;
  rainbow?: boolean;
  className?: string;
  padding?: `${number}rem ${number}rem`;
}

const TypoAtom = ({
  children,
  fontColor,
  fontSize,
  rainbow,
  className,
  padding,
}: ITypoProps) => {
  return (
    <Typo
      fontColor={fontColor}
      fontSize={fontSize}
      rainbow={rainbow}
      className={className}
      padding={padding}
    >
      {children}
    </Typo>
  );
};

export default TypoAtom;

const Typo = styled.span<ITypoProps>`
  color: ${({ theme, fontColor }) =>
    fontColor
      ? theme.color.fontColor[fontColor]
      : theme.color.fontColor.primary1};
  font-size: ${({ theme, fontSize }) =>
    fontSize ? theme.fontSize[fontSize].size : theme.fontSize.body.size};
  font-weight: ${({ theme, fontSize }) =>
    fontSize ? theme.fontSize[fontSize].weight : theme.fontSize.body.weight};
  ${({ rainbow }) => rainbow && rainbowStyle};
  padding: ${({ padding }) => padding || 0};
  line-height: ${({ theme, fontSize }) =>
    fontSize
      ? (theme.fontSize[fontSize].lineHeight as string)
      : (theme.fontSize.body.lineHeight as string)};
`;
