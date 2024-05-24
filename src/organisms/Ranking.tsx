import React, { ReactNode, useEffect, useState } from 'react';
import { CardAtom, TypoAtom } from '../atoms';
import { ICategory, IChildProps, IRanking } from '../shared/interfaces';
import RankingChart from '../molecules/RankingChart';
import LogInToUnlock from '../molecules/LogInToUnlock';
import styled from '@emotion/styled';
import RankingTexts from '../molecules/RankingTexts';
import { formatTime } from '../shared/utils';
import CartegorySelector from '../molecules/CartegorySelector';
import {
  dummyCategories,
  dummyRanking,
  initialCategories,
  initialRanking,
} from '../shared/constants';
import { AxiosResponse } from 'axios';

export interface IRankingProps extends IChildProps {
  fetchRanking: (category: string) => Promise<AxiosResponse<IRanking>>;
  fetchCategories: () => Promise<AxiosResponse<ICategory[]>>;
  isLogin: boolean;
}

function Ranking({
  children,
  fetchRanking,
  fetchCategories,
  isLogin,
}: IRankingProps) {
  const [ranking, setRanking] = useState<IRanking>();
  const [categories, setCategories] = useState<ICategory[]>();
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();

  const getCateData = async () => {
    try {
      const { data: newCategories } = await fetchCategories();
      if (newCategories) setCategories(newCategories);
      if (newCategories) setSelectedCategory(newCategories[0]);
    } catch (error) {
      console.error('데이터를 불러올 수 없습니다.' + error);
    }
  };

  const getRankData = async () => {
    try {
      if (selectedCategory) {
        const { data: newRanking } = await fetchRanking(selectedCategory.name);
        if (newRanking.group) {
          setRanking(newRanking);
        }
      }
    } catch (error) {
      console.errort('데이터를 불러올 수 없습니다.' + error);
    }
  };

  const selectCategory = (category: ICategory) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    if (isLogin) {
      getCateData();
    } else {
      setCategories(dummyCategories);
      setSelectedCategory(dummyCategories[0]);
      setRanking(dummyRanking);
    }
  }, [isLogin]);

  useEffect(() => {
    isLogin && getRankData();
  }, [selectedCategory, isLogin]);

  return (
    <>
      <RankingContainer data-testid={'ranking-component'}>
        <div
          style={{
            textAlign: 'left',
            width: '100%',
            gridColumn: '1/3',
            gridRow: 'auto',
            height: '100%',
          }}
        >
          <Ranking.titleLabel fontSize="h3_bold" fontColor="titleColor">
            카테고리 별 랭킹
          </Ranking.titleLabel>
        </div>

        <RankingLeftContainer>
          <RankingTexts>
            <RankingTexts.Typo fontSize={'h3'}>이번 주</RankingTexts.Typo>
            <div className="one_line">
              <RankingTexts.Tag
                styleOption={{
                  size: 'big',
                  bg: 'white',
                  fontsize: 'b2',
                  shadow: 'button_shadow',
                }}
              >
                {selectedCategory?.name ?? '카테고리'}
              </RankingTexts.Tag>
              <RankingTexts.Typo fontSize={'h3'}>에</RankingTexts.Typo>
            </div>
            <div className="one_line time">
              {ranking?.user ? (
                formatTime(ranking.user.time ?? 0)
                  .split(/(\d+)/)
                  .slice(1)
                  .map((text, idx) => {
                    return (
                      <RankingTexts.Typo
                        fontSize={idx % 2 === 0 ? 'h1' : 'h3_bold'}
                        key={idx + text}
                      >
                        {text}
                      </RankingTexts.Typo>
                    );
                  })
              ) : (
                <RankingTexts.Typo fontSize="h1">{'0분'}</RankingTexts.Typo>
              )}
            </div>
            <RankingTexts.Typo fontSize={'h3'}>집중했어요.</RankingTexts.Typo>
          </RankingTexts>
          <CartegorySelector
            categories={categories}
            selected={selectedCategory}
            selectHandler={selectCategory}
          />
        </RankingLeftContainer>

        <RankingRightContainer>
          <Ranking.CardAtom
            bg="transparent"
            w="100%"
            h="100%"
            margin="0"
            padding="1.5rem"
            style={{ display: 'block', boxSizing: 'border-box' }}
          >
            {ranking?.group.length ? (
              <RankingChart
                options={Object.keys(ranking.group[0])}
                series={Object.values(ranking.group[0])}
              />
            ) : (
              <NoData>
                <TypoAtom fontSize="h2" fontColor="titleColor">
                  랭킹 데이터가 없어요.
                </TypoAtom>
                <TypoAtom>할 일을 완료하고 확인해보세요!</TypoAtom>
              </NoData>
            )}
          </Ranking.CardAtom>
        </RankingRightContainer>
      </RankingContainer>
      {!isLogin && (
        <LogInToUnlock
          navigate={() => {
            return;
          }}
        />
      )}
    </>
  );
}

Ranking.titleLabel = TypoAtom;
Ranking.CardAtom = CardAtom;
Ranking.RankingChart = RankingChart;
Ranking.LogInToUnlock = LogInToUnlock;

const RankingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-auto-rows: auto 1fr;
  grid-template-columns: 1fr 2fr;
  box-sizing: border-box;
  padding: 2.75rem;
  grid-column-gap: 2.5rem;
`;
const RankingLeftContainer = styled.div`
  width: 100%;
  height: inherit;
  grid-column: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  > :nth-of-type(2) {
    height: 20vmin;
  }
`;

const RankingRightContainer = styled.div`
  width: 100%;
  height: auto;
  grid-column: 2 / 4;
  box-sizing: border-box;
`;

const NoData = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1.5rem;
`;

export default Ranking;
