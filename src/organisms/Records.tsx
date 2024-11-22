import { useEffect, useState } from 'react';
import { CardAtom, TypoAtom } from '../atoms';
import { IChildProps, ITotalFocusTime } from '../shared/interfaces';
import LogInToUnlock from '../molecules/LogInToUnlock';
import RecordCell from '../molecules/RecordCell';
import { AxiosResponse } from 'axios';
import { dummyRecords, initialRecords } from '../shared/constants';
import styled from '@emotion/styled';
import { usersApi } from '../shared/apis';
import { setTimeInFormat } from '../shared/timeUtils';

export interface IRecordsProps extends IChildProps {
  isLogin: boolean;
  fetchRecords: (
    currentDate: string,
    offset: number,
  ) => Promise<AxiosResponse<ITotalFocusTime>>;
}

function Records({ isLogin, fetchRecords }: IRecordsProps) {
  const [records, setRecords] = useState<ITotalFocusTime>(initialRecords);

  const fetchData = async () => {
    try {
      const { data: newRecords } = await fetchRecords(
        setTimeInFormat(new Date()).toISOString(),
        new Date().getTimezoneOffset(),
      );
      if (newRecords) {
        setRecords(newRecords);
      }
    } catch {
      console.error('데이터를 불러올 수 없습니다.');
    }
  };

  useEffect(() => {
    isLogin ? fetchData() : setRecords(dummyRecords);
  }, [isLogin]);

  return (
    <>
      <RecordsContainer>
        <div className="records-title">
          <Records.titleLabel fontSize="h2" fontColor="gray">
            나의 집중 기록
          </Records.titleLabel>
        </div>
        <Records.CardAtom
          bg="transparent"
          w="100%"
          h="100%"
          className="records-card"
        >
          <RecordCell label="전일 대비" record={records.daily} />
          <RecordCell label="전주 대비" record={records.weekly} />
          <RecordCell label="전월 대비" record={records.monthly} />
        </Records.CardAtom>
        {!isLogin && (
          <LogInToUnlock
            navigate={() => {
              return;
            }}
            subLabel="로그인하고 나의 집중 기록을 확인해보세요!"
          />
        )}
      </RecordsContainer>
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

Records.titleLabel = TypoAtom;
Records.RecordCell = RecordCell;
Records.CardAtom = CardAtom;

const RecordsContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 8.37rem 4.31rem 6.93rem 4.31rem;
  box-sizing: border-box;

  .records-title {
    text-align: left;
    width: 100%;
    position: absolute;
    top: 2.375rem;
    left: 2.75rem;
  }
  .records-card {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow: hidden;
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    display: flex;
    flex-direction: column;
    gap: 4rem;
    height: 100%;
    width: 100%;
    padding: 2.75rem;
    padding-bottom: 12rem;
    box-sizing: border-box;
    .records-title {
      position: initial;
      span {
        font-size: 6rem;
      }
    }
    .records-card {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      flex: 1;
      background: transparent;
      box-shadow: none;
      justify-content: flex-start;
      top: 0;
      left: 0;
      > * {
        flex-direction: column;
        gap: 2rem;
        align-items: flex-start;
        white-space: normal;
        flex-wrap: wrap;
        > * {
          flex-wrap: wrap;
        }
      }
    }
  }
`;

export default Records;
