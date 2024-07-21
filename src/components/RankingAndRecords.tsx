import React, { useState } from 'react';
import { CardAtom, TagAtom } from '../atoms';
import { IChildProps } from '../shared/interfaces';
import { Records, Ranking } from '../organisms';
import { categoryApi, rankingApi, timerApi } from '../shared/apis';
import styled from '@emotion/styled';

export interface IRankingAndRecordsProps extends IChildProps {
  isLogin: boolean;
}

function RankingAndRecords({ children, isLogin }: IRankingAndRecordsProps) {
  //TODO: 테스트용 주석 삭제 필요
  const [isRanking, setIsRanking] = useState(true);
  // const [isRanking, setIsRanking] = useState(false);
  return (
    <RNRContainer data-testid={'records-component'}>
      <TagAtom
        handler={() => setIsRanking((prev) => !prev)}
        styleOption={{ shadow: 'button_shadow', bg: 'lightGrey_2' }}
      >
        {!isRanking ? '카테고리 별 랭킹' : '나의 집중 기록'}
      </TagAtom>

      <CardAtom padding="0rem" w="100%" h="100%">
        {isRanking ? (
          <Ranking
            fetchCategories={categoryApi.getCategories}
            fetchRanking={rankingApi.getRanking}
            isLogin={isLogin}
          ></Ranking>
        ) : (
          <Records isLogin={isLogin} fetchRecords={timerApi.getRecords} />
        )}
      </CardAtom>
    </RNRContainer>
  );
}

const RNRContainer = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 12.2vmin;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-direction: column;
  box-sizing: border-box;
  gap: 1.225rem;
  @media ${({ theme }) => theme.responsiveDevice.tablet_h},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    width: 100%;
    height: 100%;
    padding: 24rem 4rem 4rem 4rem;
    flex-direction: column;
    position: relative;
    > :first-child {
      position: absolute;
      z-index: 5;
      bottom: 7rem;
      left: 50%;
      transform: translateX(-50%);
      span {
        font-size: 4rem;
        padding: 1rem 3rem;
        border-radius: 4rem;
        background: ${({ theme }) =>
          `linear-gradient(180deg,rgba(255, 255, 255, 0.85) 0%,rgba(255, 255, 255, 0) 55.21%), ${theme.colors.bgYellow}`};
      }
    }
  }
`;

RankingAndRecords.CardAtom = CardAtom;
RankingAndRecords.Ranking = Ranking;
RankingAndRecords.Records = Records;

export default RankingAndRecords;
