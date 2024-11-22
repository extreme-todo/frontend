import styled from '@emotion/styled';
import React from 'react';
import { designTheme } from '../styles/theme';

/**
 * ProgressButtonAtom
 * 파이차트 모양의 Progress를 표시하는 버튼
 * @param {number} progress (1~100)% 값
 * @param {keyof typeof designTheme.color} bgColor progress 색 지정
 */
const ProgressButtonAtom = styled.button<{
  progress: number;
  bgColor?: keyof typeof designTheme.color;
}>`
  width: 4.455rem;
  height: 4.455rem;
  border-radius: 50%;
  color: ${({ theme }) => theme.color.fontColor.primary1};
  text-align: center;
  font-family: Pretendard;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 400;
  background: conic-gradient(
    ${({ theme, progress, bgColor }) =>
      bgColor ??
      theme.color.backgroundColor.extreme_orange +
        ' ' +
        progress +
        '%, 0, ' +
        theme.color.backgroundColor.extreme_orange +
        ' ' +
        (100 - progress) +
        '%'}
  );
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    width: 8rem;
    height: 8rem;
    border-radius: 8rem;
    font-size: 2.5rem;
  }
`;

export default ProgressButtonAtom;
