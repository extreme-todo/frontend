import styled from '@emotion/styled';
import { BackgroundColorName } from '../styles/emotion';

// TODO: 나중에 일정한 사이즈를 가지게 되면 수정;
export const CardAtom = styled.div<{
  padding?: string;
  margin?: string;
  bg?: 'default' | 'transparent' | BackgroundColorName;
  w?: string;
  h?: string;
}>`
  position: relative;
  font-size: ${({ theme: { fontSize } }) => fontSize.body.size};
  font-weight: ${({ theme: { fontSize } }) => fontSize.body.weight};
  background: ${({
    theme: {
      color: { backgroundColor },
    },
    bg,
  }) => {
    switch (bg) {
      case 'transparent':
        return `transparent`;
      case 'default':
        return `${backgroundColor.primary2}`;
      default:
        return `${bg ? backgroundColor[bg] : backgroundColor.primary2}`;
    }
  }};
  box-shadow: ${({ theme: { shadow } }) => shadow.container};
  border-radius: 30px;
  padding: ${({ padding }) => padding ?? '2rem 2.75rem'};
  margin: ${({ margin }) => margin ?? '0rem'};
  width: ${({ w }) => w ?? '53.75rem'};
  height: ${({ h }) => h ?? '20rem'};
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  transition: all 0.3s ease-in-out;
  z-index: 1;
`;
