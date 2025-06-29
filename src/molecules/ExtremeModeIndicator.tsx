import { useContext, useEffect, useState } from 'react';
import { LoginContext, useExtremeMode, usePomodoroValue } from '../hooks';
import styled from '@emotion/styled';
import { BtnAtom, IconAtom, PopperAtom, TypoAtom } from '../atoms';
import { PomodoroStatus } from '../services/PomodoroService';
import { usersApi } from '../shared/apis';

export function ExtremeModeIndicator() {
  const { isLogin } = useContext(LoginContext);
  const { status } = usePomodoroValue();
  const { isExtreme, handleExtremeMode } = useExtremeMode();
  const [popperEl, setPopperEl] = useState<HTMLDivElement | null>(null);
  const [popperOpen, setPopperOpen] = useState<boolean>(true);
  const [popperTriggerElement, setPopperTriggerElement] =
    useState<HTMLDivElement | null>(null);

  const toggleExtremeMode = () => {
    if (!isLogin) {
      if (window.confirm('로그인 하시겠습니까?')) {
        return usersApi.login();
      }
    } else {
      if (
        window.confirm(
          `정말로 익스트림 모드를 ${isExtreme ? '끄시' : '켜시'}겠습니까?`,
        )
      ) {
        handleExtremeMode(!isExtreme);
      }
    }
  };

  useEffect(() => {
    if (isExtreme && status === PomodoroStatus.RESTING) setPopperOpen(true);
    else setPopperOpen(false);
  }, [isExtreme, status]);

  return (
    <ExtremeModeContainer ref={setPopperTriggerElement}>
      {isExtreme && (
        <div>
          <TypoAtom
            fontSize="b2"
            fontColor="extreme_orange"
            className="extreme-status"
          >
            Extreme ON
          </TypoAtom>
        </div>
      )}
      {isExtreme ? (
        <img src="/icon/bolt-red.svg" onClick={toggleExtremeMode}></img>
      ) : (
        <img src="/icon/bolt.svg" onClick={toggleExtremeMode}></img>
      )}
      {popperOpen && (
        <PopperAtom
          popperElement={popperEl}
          setPopperElement={setPopperEl}
          triggerElement={popperTriggerElement}
          placement={'top'}
          offset={[0, 0]}
        >
          <div className="tooltip">
            <div className="tooltip-body">
              <TypoAtom fontSize={'body'} fontColor="extreme_orange">
                휴식 시간이 끝나면 기록이 삭제됩니다!
              </TypoAtom>
              <BtnAtom
                btnStyle="textBtn"
                handleOnClick={() => {
                  setPopperOpen(false);
                }}
              >
                <IconAtom
                  className="close-icon"
                  src="icon/close-red.svg"
                ></IconAtom>
              </BtnAtom>
            </div>
            <img src="/icon/tooltip-arrow.svg" className="tooltip-arrow"></img>
          </div>
        </PopperAtom>
      )}
    </ExtremeModeContainer>
  );
}

const ExtremeModeContainer = styled.div`
  position: absolute;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  top: 2rem;
  right: 2.0625rem;
  gap: 9px;
  img {
    width: 1.5625rem;
    height: 2.5rem;
  }
  .tooltip {
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    filter: drop-shadow(${({ theme }) => theme.shadow.tomato});
    .tooltip-body {
      background-color: white;
      border-radius: 4.5625rem;
      white-space: nowrap;
      padding: 13px 16px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .tooltip-arrow {
      margin-top: -0.3rem;
      width: 0.533125rem;
      height: 1.5rem;
    }
  }
  .close-icon {
    width: 20px;
    height: 20px;
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    margin-right: 8rem;
    img {
      width: 8rem;
      height: 8rem;
    }
    .extreme-status {
      width: fit-content;
      word-break: break-all;
    }
  }
`;
