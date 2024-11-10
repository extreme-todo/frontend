import styled from '@emotion/styled';
import React from 'react';

// TODO: 나중에 일정한 사이즈를 가지게 되면 수정;
const CardAtom = styled.div<{
  padding?: string;
  margin?: string;
  bg?: 'default' | 'transparent';
  w?: string;
  h?: string;
}>`
  position: relative;
  font-size: 1rem;
  /* background: ${({ theme: { colors }, bg }) => {
    switch (bg) {
      case 'transparent':
        return `linear-gradient(180deg, rgba(255, 255, 255, 0.71) 0%, rgba(255, 255, 255, 0) 100%);`;
      default:
        return `linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.85) 0%,
      rgba(255, 255, 255, 0) 55.21%
    ), ${colors.bgYellow}`;
    }
  }}; */
  box-shadow: 16px 16px 40px rgba(28, 28, 29, 0.16);

  border-radius: 30px;
  padding: ${({ padding }) => padding ?? '2rem 2.75rem'};
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
