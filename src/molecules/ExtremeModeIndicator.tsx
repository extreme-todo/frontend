import React, { useEffect, useMemo } from 'react';
import { useExtremeMode, usePomodoroValue } from '../hooks';
import styled from '@emotion/styled';
import { TypoAtom } from '../atoms';
import { formatTime } from '../shared/utils';

function ExtremeModeIndicator() {
  const { status, settings } = usePomodoroValue();
  const { isExtreme, leftTime, setMode } = useExtremeMode();

  useEffect(() => {
    return;
  }, [leftTime]);

  const toggleExtremeMode = () => {
    if (
      window.confirm(
        `정말로 익스트림 모드를 ${isExtreme ? '끄시' : '켜시'}겠습니까?`,
      )
    ) {
      setMode(!isExtreme);
    }
  };

  return (
    <ExtremeModeContainer>
      {isExtreme && (
        <TypoAtom fontSize="h5">{status.isResting && leftTime}</TypoAtom>
      )}
      {isExtreme ? (
        <img src="/icons/extreme-pink.svg" onClick={toggleExtremeMode}></img>
      ) : (
        <img src="/icons/extreme-gray.svg" onClick={toggleExtremeMode}></img>
      )}
    </ExtremeModeContainer>
  );
}

export default ExtremeModeIndicator;

const ExtremeModeContainer = styled.div`
  position: absolute;
  z-index: 1;
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
