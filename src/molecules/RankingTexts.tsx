import React from 'react';
import { IChildProps } from '../shared/interfaces';
import { TypoAtom, TagAtom } from '../atoms';
import styled from '@emotion/styled';
import { rainbowStyle } from '../styles/Global';

type IRankingTextsProps = IChildProps;

function RankingTexts({ children }: IRankingTextsProps) {
  return <RankingTextsContainer>{children}</RankingTextsContainer>;
}

RankingTexts.Typo = TypoAtom;
RankingTexts.Tag = TagAtom;

const RankingTextsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  padding-top: 4rem;
  padding-bottom: 2rem;
  gap: 1rem;
  .one_line {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .time {
    justify-content: flex-start;
    align-items: flex-end;
    gap: 0.5rem;
    flex-wrap: wrap;
    vertical-align: text-bottom;
    ${rainbowStyle}
  }
  * {
    display: inline-block;
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    gap: 2rem;
  }
`;
export default RankingTexts;
