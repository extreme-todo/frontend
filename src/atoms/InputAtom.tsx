import styled from '@emotion/styled';
import { designTheme } from '../styles/theme';

type TypePadding = `${number} ${number} ${number} ${number}`;
type TypeLength = `${number}rem` | `${number}%` | `${number}px`;

interface IInputAtomProps
  extends Pick<HTMLInputElement, 'placeholder' | 'value'> {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown?: (params: React.KeyboardEvent<HTMLInputElement>) => void;
  ariaLabel?: string;
  // styleOption?: {
  //   width?: TypeLength;
  //   height?: TypeLength;
  //   borderRadius?: TypeLength;
  //   padding?: TypePadding;
  //   margin?: TypePadding;
  //   backgroundColor?: keyof typeof designTheme.colors;
  //   outlineWidth?: TypeLength;
  // };
}

const Usual = ({ handleChange, ariaLabel, ...props }: IInputAtomProps) => {
  return (
    <UsualInput onChange={handleChange} aria-label={ariaLabel} {...props} />
  );
};

const Underline = ({
  handleChange,
  handleKeyDown,
  ariaLabel,
  ...props
}: IInputAtomProps) => {
  return (
    <UnderlineInput
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      {...props}
    />
  );
};

const InputAtom = {
  Usual,
  Underline,
};

export default InputAtom;

const UsualInput = styled.input`
  width: 100%;
  height: 3.898rem;
  background-color: ${({ theme }) => theme.colors.whiteWine};
  font-size: ${({ theme }) => theme.fontSize.h3.size};
  font-weight: ${({ theme }) => theme.fontSize.h3.weight};

  border-radius: 1.453rem;
  padding-left: 1rem;
  padding-right: 1rem;

  outline-width: 0;
  box-sizing: border-box;
`;

const UnderlineInput = styled.input`
  width: 18rem;
  height: 1.863rem;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.whiteWine};
  outline-width: 0;
  background-color: rgba(255, 255, 255, 0);
  font-size: ${({ theme }) => theme.fontSize.tag.size};
  font-weight: ${({ theme }) => theme.fontSize.tag.weight};
`;
