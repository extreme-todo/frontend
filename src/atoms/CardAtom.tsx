import styled from '@emotion/styled';
import React from 'react';
import { Color, PrimaryColor } from '../styles/emotion';

// TODO: 나중에 일정한 사이즈를 가지게 되면 수정;
const CardAtom = styled.div<{
  padding?: string;
  margin?: string;
  bg?: 'default' | 'transparent' | PrimaryColor[keyof PrimaryColor];
  w?: string;
  h?: string;
}>`
  position: relative;
  font-size: 1rem;
  background: ${({
    theme: {
      color: { primary },
    },
    bg,
  }) => {
    switch (bg) {
      case 'transparent':
        return `transparent`;
      case 'default':
        return `${primary.primary2}`;
      default:
        return `${bg ? bg : primary.primary2}`;
    }
  }};
  box-shadow: 0px 4px 62px rgba(0, 0, 0, 0.05);
  border-radius: 30px;
  padding: ${({ padding }) => padding ?? '3rem'};
  margin: ${({ margin }) => margin ?? '0rem'};
  width: ${({ w }) => w ?? 'fit-content'};
  height: ${({ h }) => h ?? 'fit-content'};
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
`;

export default CardAtom;
