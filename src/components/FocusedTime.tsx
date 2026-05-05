import { ForwardedRef, forwardRef, useContext, useMemo, useState } from 'react';
import { BtnAtom, CardAtom, TypoAtom } from '../atoms';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { categoryApi, timerApi } from '../shared/apis';
import {
  ICategory,
  IDayFocusedTime,
  IMonthFocusedTime,
  IWeekFocusedTime,
} from '../shared/interfaces';
import { CategorySelector, RankingChart } from '../molecules';
import { RandomTagColorList } from '../shared/RandomTagColorList';
import { formatTime } from '../shared/timeUtils';
import { LoginContext, useExtremeMode, useIsMobile } from '../hooks';
import { SideBtnAtom } from '../atoms/SideBtnAtom';

export const FocusedTime = ({ handleClose }: { handleClose: () => void }) => {
  const tagColorList = RandomTagColorList.getInstance().getColorList;

  const [unit, setUnit] = useState<'day' | 'week' | 'month'>('day');
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );
  const { isExtreme } = useExtremeMode();
  const isMobile = useIsMobile();
  const { isLogin } = useContext(LoginContext);

  const getRecord = () =>
    selectedCategory
      ? timerApi.getRecords(
          -new Date().getTimezoneOffset(),
          unit,
          selectedCategory.id,
        )
      : timerApi.getRecords(-new Date().getTimezoneOffset(), unit);

  const getUnitSeriesLabel = (
    value: IDayFocusedTime | IWeekFocusedTime | IMonthFocusedTime,
  ) => {
    switch (unit) {
      case 'day':
        return (
          (value as IDayFocusedTime).start.toString().padStart(2, '0') + 'h'
        );
      case 'week':
        return (value as IWeekFocusedTime).day.toUpperCase();
      case 'month':
        return (value as IMonthFocusedTime).week.toString() + 'Week';
      default:
        throw new Error('Invalid unit');
    }
  };

  const UnitButtons = useMemo(
    () => (
      <div className="focused-header">
        <div className="button-wrapper">
          <SideBtnAtom
            onClick={function (): void {
              setUnit('day');
            }}
            focused={unit === 'day'}
            btnStyle={isExtreme ? 'extremeDarkBtn' : 'darkBtn'}
          >
            Day
          </SideBtnAtom>
          <SideBtnAtom
            onClick={function (): void {
              setUnit('week');
            }}
            focused={unit === 'week'}
            btnStyle={isExtreme ? 'extremeDarkBtn' : 'darkBtn'}
          >
            Week
          </SideBtnAtom>
          <SideBtnAtom
            onClick={function (): void {
              setUnit('month');
            }}
            focused={unit === 'month'}
            btnStyle={isExtreme ? 'extremeDarkBtn' : 'darkBtn'}
          >
            Month
          </SideBtnAtom>
        </div>
      </div>
    ),
    [unit, isExtreme],
  );

  const CloseButton = useMemo(
    () => (
      <BtnAtom handleOnClick={handleClose} className="close-btn">
        <img src="icon/closeYellow.svg" alt="close" />
      </BtnAtom>
    ),
    [handleClose],
  );

  const { data: recordData } = useQuery(
    ['category', selectedCategory, unit, 'focusedTime'],
    getRecord,
  );
  const { data: categories } = useQuery(
    ['category'],
    () => categoryApi.getCategories(),
    {
      enabled: isLogin,
    },
  );

  return (
    <FocusedTimeStyled>
      <CardAtom
        bg={isExtreme ? 'extreme_dark' : 'primary1'}
        className="focused-time-card"
      >
        <div className="left-side">
          <div className="top-side">
            <div className="current-record">
              <TypoAtom fontSize="body" fontColor="primary2">
                {unit === 'day'
                  ? format(
                      new Date(
                        (recordData?.data.total.start as string) ?? Date.now(),
                      ),
                      'MM월 dd일의 기록',
                    )
                  : format(
                      new Date(
                        (recordData?.data.total.start as string) ?? Date.now(),
                      ),
                      'MM.dd',
                    ) +
                    format(
                      new Date(
                        (recordData?.data.total.end as string) ?? Date.now(),
                      ),
                      '~MM.dd',
                    ) +
                    '간의 집중 기록'}
              </TypoAtom>
              {recordData?.data.total.focused != null && (
                <TypoAtom fontSize="h1" fontColor="primary2">
                  {formatTime(
                    Math.floor(recordData.data.total.focused / 60000),
                  )}
                </TypoAtom>
              )}
            </div>
            {isMobile && CloseButton}
          </div>
          <div className="bottom-side">
            <TypoAtom fontSize="body" fontColor="primary2">
              {unit === 'day'
                ? '전 일 대비'
                : unit === 'week'
                ? '전 주 대비'
                : '전 달 대비'}
            </TypoAtom>
            {recordData?.data.total.focused != null ? (
              <TypoAtom fontSize="h1" fontColor="primary2">
                {recordData.data.total.focused -
                  recordData.data.total.prevFocused >=
                0
                  ? '+'
                  : ''}
                {formatTime(
                  Math.floor(
                    (recordData.data.total.focused -
                      recordData.data.total.prevFocused) /
                      60000,
                  ),
                )}
              </TypoAtom>
            ) : (
              <TypoAtom fontSize="h1" fontColor="primary2">
                {'0분'}
              </TypoAtom>
            )}
            {categories && (
              <CategorySelector
                isMobile={isMobile}
                categories={categories}
                selected={selectedCategory}
                selectHandler={(category) => {
                  if (category.id === selectedCategory?.id) {
                    setSelectedCategory(null);
                  } else {
                    setSelectedCategory(category);
                  }
                }}
              ></CategorySelector>
            )}
          </div>
        </div>
        <div className="right-side">
          {!isMobile && (
            <div className="right-header">
              {UnitButtons}
              {CloseButton}
            </div>
          )}
          {recordData && (
            <div className="chart-wrapper">
              <RankingChart
                isMobile={isMobile}
                color={
                  selectedCategory
                    ? tagColorList[selectedCategory.name]
                    : undefined
                }
                options={[
                  ...recordData?.data.values.map((value) =>
                    getUnitSeriesLabel(value),
                  ),
                ]}
                series={[
                  ...recordData?.data.values.map((value) => value.focused),
                ]}
              ></RankingChart>
            </div>
          )}
          {isMobile && UnitButtons}
        </div>
      </CardAtom>
    </FocusedTimeStyled>
  );
};

const FocusedTimeStyled = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .focused-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    > .button-wrapper {
      display: flex;
      gap: 0.5rem;
    }
  }

  .card-wrapper {
    position: relative;
  }
  .focused-time-card {
    padding: 1.75rem;
    display: flex;
    flex-direction: row;
    .left-side {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 3rem;
      height: 100%;
      width: 15rem;
    }
    .top-side {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .current-record {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    .bottom-side {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .right-side {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 33.75rem;
      flex-shrink: 0;
      height: 100%;
      .right-header {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-shrink: 0;
        gap: 2.5rem;
      }
      .chart-wrapper {
        width: 100%;
        flex: 1;
      }
      .close-btn {
        width: 2rem;
        height: 2rem;
      }
    }
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    .focused-time-card {
      flex-direction: column;
      padding: 1.25rem 1.5rem 1.25rem 1.25rem;
      .left-side {
        width: 100%;
        gap: 0.75rem;
        height: auto;
        flex-shrink: 0;
      }
      .right-side {
        width: 100%;
        min-width: unset;
        justify-content: center;
        align-items: center;
        flex: 1;
      }
    }
  }
`;
Object.assign(FocusedTime, {
  CardAtom,
});
