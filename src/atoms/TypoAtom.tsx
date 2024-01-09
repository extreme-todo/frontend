import styled from '@emotion/styled';
import { IChildProps } from '../shared/interfaces';
import { designTheme } from '../styles/theme';
import { rainbowStyle } from '../styles/Global';

interface ITypoProps extends IChildProps {
  fontSize?: keyof typeof designTheme.fontSize;
  fontColor?: keyof typeof designTheme.colors;
  rainbow?: boolean;
}

const TypoAtom = ({ children, fontColor, fontSize, rainbow }: ITypoProps) => {
  return (
    <Typo fontColor={fontColor} fontSize={fontSize} rainbow={rainbow}>
      {children}
    </Typo>
  );
};

export default TypoAtom;

const Typo = styled.span<ITypoProps>`
  color: ${({ fontColor }) =>
    fontColor
      ? designTheme.colors[fontColor]
      : designTheme.colors.subFontColor};
  font-size: ${({ fontSize }) =>
    fontSize
      ? designTheme.fontSize[fontSize].size
      : designTheme.fontSize.body.size};
  font-weight: ${({ fontSize }) =>
    fontSize
      ? designTheme.fontSize[fontSize].weight
      : designTheme.fontSize.body.weight};
  ${({ rainbow }) => rainbow && rainbowStyle};
`;
