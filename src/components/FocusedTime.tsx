import { ForwardedRef, forwardRef, useContext, useState } from 'react';
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

export const FocusedTime = forwardRef((_, ref: ForwardedRef<HTMLElement>) => {
  const tagColorList = RandomTagColorList.getInstance().getColorList;

  const [unit, setUnit] = useState<'day' | 'week' | 'month'>('day');
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );

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

  const { data: recordData } = useQuery(
    ['category', selectedCategory, unit, 'focusedTime'],
    getRecord,
  );
  const { data: categories } = useQuery(['category'], () =>
    categoryApi.getCategories(),
  );

  return (
    <FocusedTimeStyled ref={ref}>
      <div className="focused-header">
        <TypoAtom fontSize="h1">나의 집중 기록</TypoAtom>
        <div className="button-wrapper">
          <BtnAtom
            handleOnClick={function (): void {
              setUnit('day');
            }}
            className={'tag-button' + (unit === 'day' ? ' active' : '')}
          >
            Day
          </BtnAtom>
          <BtnAtom
            handleOnClick={function (): void {
              setUnit('week');
            }}
            className={'tag-button' + (unit === 'week' ? ' active' : '')}
          >
            Week
          </BtnAtom>
          <BtnAtom
            handleOnClick={function (): void {
              setUnit('month');
            }}
            className={'tag-button' + (unit === 'month' ? ' active' : '')}
          >
            Month
          </BtnAtom>
        </div>
      </div>
      <div className="card-wrapper">
        <CardAtom bg="primary1" className="focused-time-card">
          <div className="left-side">
            <div className="top-side">
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
                    : '-'}
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
                  '+0시간 0분'
                </TypoAtom>
              )}
              {categories && (
                <CategorySelector
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
            {recordData && (
              <RankingChart
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
            )}
          </div>
        </CardAtom>
        <CardAtom
          style={{
            position: 'absolute',
            left: '17px',
            top: '40px',
            transform: `rotateZ(3.65deg)`,
            zIndex: 0,
            opacity: 1,
            pointerEvents: 'none',
            transformOrigin: 'bottom left',
          }}
        ></CardAtom>
      </div>
    </FocusedTimeStyled>
  );
});

const FocusedTimeStyled = styled.main`
  width: 100dvw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .focused-header {
    display: flex;
    justify-content: space-between;
    width: 53.75rem;
    align-items: flex-end;
    margin-bottom: 0.5rem;
    > .button-wrapper {
      display: flex;
      gap: 0.5rem;
      margin-right: 1.25rem;
    }
  }
  .card-wrapper {
    position: relative;
    width: 53.75rem;
    height: 20rem;
  }
  .focused-time-card {
    padding: 2rem 2.5rem 1.25rem 2.5rem;
    display: flex;
    flex-direction: row;
    .left-side {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }
    .top-side {
      display: flex;
      flex-direction: column;
      flex: 1;
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
    }
  }
  .tag-button {
    border: 1px solid ${({ theme }) => theme.color.primary.primary1};
    border-radius: 1.25rem;
    height: 1.25rem;
    padding: 0 1rem;
    display: flex;
    width: 4.875rem;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.color.primary.primary1};
    &.active {
      background-color: ${({ theme }) => theme.color.primary.primary1};
      color: ${({ theme }) => {
        return theme.color.fontColor.gray;
      }};
    }
  }
`;
Object.assign(FocusedTime, {
  CardAtom,
});
