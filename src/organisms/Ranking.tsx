import React, { ReactNode, useEffect, useState } from 'react';
import { CardAtom, TypoAtom } from '../atoms';
import { ICategory, IChildProps, IRanking } from '../shared/interfaces';
import RankingChart from '../molecules/RankingChart';
import LogInToUnlock from '../molecules/LogInToUnlock';
import styled from '@emotion/styled';
import RankingTexts from '../molecules/RankingTexts';
import { formatTime } from '../shared/timeUtils';
import CartegorySelector from '../molecules/CartegorySelector';

import { useQuery } from '@tanstack/react-query';
import { useIsMobile } from '../hooks/useIsMobile';
import { usersApi } from '../shared/apis';

export interface IRankingProps extends IChildProps {
  fetchRanking: (category: string) => Promise<IRanking>;
  fetchCategories: () => Promise<ICategory[]>;
  isLogin: boolean;
}

function Ranking({
  children,
  fetchRanking,
  fetchCategories,
  isLogin,
}: IRankingProps) {
  const [ranking, setRanking] = useState<IRanking>();
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();
  const isMobile = useIsMobile();

  const { data: categories } = useQuery(['category'], () => fetchCategories(), {
    staleTime: 1000 * 60 * 20,
  });

  useEffect(() => {
    if (categories) selectCategory(categories[0]);
  }, [categories]);

  const selectCategory = (category: ICategory) => {
    setSelectedCategory(category);
    fetchRanking(category?.name).then((res) => setRanking(res));
  };

  useEffect(() => {
    // if (isLogin) {
    // } else {
    //   setCategories(dummyCategories);
    //   setSelectedCategory(dummyCategories[0]);
    //   setRanking(dummyRanking);
    // }
  }, [isLogin]);

  return (
    <>
      <RankingContainer data-testid={'ranking-component'}>
        <div className="ranking-title-wrapper">
          <Ranking.titleLabel
            fontSize="h3"
            fontColor="primary1"
            className="ranking-title"
          >
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
                  bg: 'mint',
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
                formatTime(Number((ranking.user.time / 60000 ?? 0).toFixed(2)))
                  .split(/(\d+)/)
                  .slice(1)
                  .map((text, idx) => {
                    return (
                      <RankingTexts.Typo
                        fontSize={(() => {
                          if (idx % 2 !== 0) {
                            return 'h3';
                          }
                          if (text.length > 3) {
                            return 'h3';
                          } else {
                            return 'h1';
                          }
                        })()}
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
            isMobile={isMobile}
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
            {ranking && ranking.group && ranking?.group.length ? (
              <RankingChart
                options={Object.keys(ranking.group[0])}
                series={Object.values(ranking.group[0])}
              />
            ) : (
              <NoData>
                <TypoAtom fontSize="h2" fontColor="primary1">
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
            usersApi.login();
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
  .ranking-title-wrapper {
    text-align: left;
    width: 100%;
    grid-column: 1/3;
    grid-row: auto;
    height: 100%;
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    padding-bottom: 12rem;
    .ranking-title-wrapper {
      height: fit-content;
    }
    .ranking-title {
      font-size: 6rem;
      height: fit-content;
    }
    display: flex;
    flex-direction: column;
  }
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
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    flex: 1;
    gap: 2rem;
    span {
      font-size: 3rem;
    }
    .one_line:nth-child(3) > span {
      font-size: 8rem;
    }
  }
`;

const RankingRightContainer = styled.div`
  width: 100%;
  height: auto;
  grid-column: 2 / 4;
  box-sizing: border-box;
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    flex: 1;
  }
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
