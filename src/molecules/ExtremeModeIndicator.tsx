import React, { useEffect, useMemo } from 'react';
import { useExtremeMode, usePomodoroValue } from '../hooks';
import styled from '@emotion/styled';
import { TypoAtom } from '../atoms';
import { formatTime } from '../shared/utils';

function ExtremeModeIndicator() {
  const { status, settings } = usePomodoroValue();
  const { isExtreme, leftTime } = useExtremeMode();

  useEffect(() => {
    return;
  }, [leftTime]);

  return (
    <ExtremeModeContainer>
      <TypoAtom fontSize="h5">{status.isResting && leftTime}</TypoAtom>
      {isExtreme ? (
        <img src="/icons/extreme-pink.svg"></img>
      ) : (
        <img src="/icons/extreme-gray.svg"></img>
      )}
    </ExtremeModeContainer>
  );
}

export default ExtremeModeIndicator;

const ExtremeModeContainer = styled.div`
  position: absolute;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  top: 2.75rem;
  right: 2.0625rem;
  img {
    width: 3.4375rem;
    height: 3.4375rem;
  }
`;
