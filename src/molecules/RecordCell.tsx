/** @jsxImportSource @emotion/react */
import React from 'react';
import { TagAtom, TypoAtom } from '../atoms';
import { IChildProps } from '../shared/interfaces';
import { css } from '@emotion/react';
import { formatTime } from '../shared/timeUtils';

interface IRankingProps extends IChildProps {
  label: string;
  record: number;
}

function RecordCell({ children, label, record }: IRankingProps) {
  // Typo에 적용된 inline css들은 typo 컴포넌트 머지 이후 변경 필요
  return (
    <div
      css={css`
        margin-bottom: 2rem;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        gap: 8rem;
      `}
    >
      <RecordCell.RecordLabel
        styleOption={{ size: 'big', fontsize: 'b1', shadow: 'basic_shadow' }}
      >
        {label}
      </RecordCell.RecordLabel>
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.25rem;
        `}
      >
        <RecordCell.RecordTypo fontSize={'h1'} rainbow={record > 0}>
          {record > 0 ? '+' + record.toLocaleString() : record.toLocaleString()}
        </RecordCell.RecordTypo>
        <RecordCell.bodyTypo fontSize={'h3'}>
          분 ({formatTime(record)})
        </RecordCell.bodyTypo>
      </div>
    </div>
  );
}

RecordCell.RecordLabel = TagAtom;
RecordCell.RecordTypo = TypoAtom;
RecordCell.bodyTypo = TypoAtom;

export default RecordCell;
