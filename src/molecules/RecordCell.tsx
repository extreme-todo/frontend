/** @jsxImportSource @emotion/react */
import React from 'react';
import { TagAtom, TypoAtom } from '../atoms';
import { IChildProps } from '../shared/interfaces';
import { css } from '@emotion/react';
import { formatTime } from '../shared/timeUtils';
import styled from '@emotion/styled';

interface IRankingProps extends IChildProps {
  label: string;
  record: number;
}

function RecordCell({ children, label, record }: IRankingProps) {
  // Typo에 적용된 inline css들은 typo 컴포넌트 머지 이후 변경 필요
  return (
    <RecordCellContainer>
      <RecordCell.RecordLabel
        styleOption={{ size: 'big', fontsize: 'b1', shadow: 'basic_shadow' }}
      >
        {label}
      </RecordCell.RecordLabel>
      <div className="record-time-wrapper">
        <RecordCell.RecordTypo
          fontSize={'h1'}
          rainbow={record > 0}
          className="record-time-number"
        >
          {Math.floor(record / 60000) > 0
            ? '+' + Math.floor(record / 60000).toLocaleString()
            : Math.floor(record / 60000).toLocaleString()}
        </RecordCell.RecordTypo>
        <RecordCell.bodyTypo fontSize={'h3'} className="record-time-formatted">
          분 ({formatTime(Math.floor(record / 60000))})
        </RecordCell.bodyTypo>
      </div>
    </RecordCellContainer>
  );
}

RecordCell.RecordLabel = TagAtom;
RecordCell.RecordTypo = TypoAtom;
RecordCell.bodyTypo = TypoAtom;

const RecordCellContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  gap: 8rem;
  .record-time-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.25rem;
    flex-wrap: wrap;
    > :first-child {
      flex-shrink: 0;
    }
    > :nth-child(2) {
      flex: 1;
    }
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_h} {
    gap: 2rem;
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    > div:first-child > span {
      font-size: 3rem;
      padding: 1rem 3rem;
      border-radius: 5rem;
    }
    .record-time-wrapper {
      justify-content: flex-start;
    }
    .record-time-number {
      font-size: 12rem;
    }
    .record-time-formatted {
      font-size: 4rem;
    }
  }
`;

export default RecordCell;
