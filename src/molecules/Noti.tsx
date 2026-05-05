import { useEffect, useState } from 'react';
import { BtnAtom, IconAtom, TypoAtom } from '../atoms';
import useAlarm from '../hooks/useAlarm';
import { useCurrentTodo } from '../hooks/useCurrentTodo';
import styled from '@emotion/styled';

const Noti = () => {
  const { callNotification, cancelNotification } = useAlarm();
  const [notiType, setNotiType] = useState<'rest' | 'focus' | null>(null);

  const handleClose = () => {
    setNotiType(null);
    cancelNotification();
  };

  const { canRest, currentRound, canFocus } = useCurrentTodo();

  useEffect(() => {
    if (canRest === true) {
      setNotiType('rest');
      void callNotification();
    }
    if (canFocus === true) {
      setNotiType('focus');
      void callNotification();
    }
  }, [canFocus, canRest, callNotification]);

  const NotiComment = () => {
    if (notiType === 'rest') {
      return (
        <TypoAtom fontColor="primary1" fontSize="h2">
          {currentRound} 라운드 종료!
        </TypoAtom>
      );
    } else if (notiType === 'focus') {
      return (
        <TypoAtom fontColor="primary1" fontSize="h2">
          휴식시간 종료
        </TypoAtom>
      );
    }
    return null;
  };

  if (!notiType) return null;

  return (
    <Backdrop>
      <NotiContainer>
        <BtnAtom
          btnStyle="textBtn"
          handleOnClick={handleClose}
          ariaLabel="close"
          className="close__btn"
        >
          <IconAtom src="/icon/closeDark.svg" size={2} alt="close" />
        </BtnAtom>
        <div className="noti__center">
          <img src="/icon/noti_clock.svg" className="noti-clock" />
          <NotiComment />
        </div>
      </NotiContainer>
    </Backdrop>
  );
};

export { Noti };

const Backdrop = styled.div`
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const NotiContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 25rem;
  height: 17.375rem;
  background-color: ${({ theme: { color } }) => color.backgroundColor.white};
  border-radius: 2.0625rem;
  box-shadow: ${({ theme: { shadow } }) => shadow.container};
  padding: 1.25rem;
  box-sizing: border-box;
  position: relative;
  .noti__center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 1.375rem;
    width: 100%;
  }
  .noti-clock {
    width: 8rem;
    height: 8rem;
    animation: shake 300ms infinite;
    transform: rotate(-10deg);
  }
  @keyframes shake {
    30% {
      transform: rotate(-10deg);
    }
    70% {
      transform: rotate(10deg);
    }
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    width: 100%;
    margin: 0 3.625rem;
    min-height: 25rem;
    position: relative;
    .noti__center {
      top: 4.75rem;
      left: 50%;
      transform: translateX(-50%);
    }
    .close__btn {
      position: absolute;
      bottom: 2.5rem;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;
