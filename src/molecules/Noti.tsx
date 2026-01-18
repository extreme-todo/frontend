import { useEffect, useState } from 'react';
import { BtnAtom, IconAtom, TypoAtom } from '../atoms';
import useAlarm from '../hooks/useAlert';
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
        <div className="noti__icons">
          <BtnAtom
            btnStyle="textBtn"
            handleOnClick={handleClose}
            ariaLabel="close"
          >
            <IconAtom src="/icon/closeDark.svg" size={2} alt="close" />
          </BtnAtom>
          <img src="/icon/noti_clock.svg" className="noti-clock" />
        </div>
        <NotiComment />
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
  align-items: center;
  width: 25rem;
  height: 17.375rem;
  background-color: ${({ theme: { color } }) => color.backgroundColor.white};
  border-radius: 2.0625rem;
  box-shadow: ${({ theme: { shadow } }) => shadow.container};
  * {
    box-sizing: border-box;
  }
  .noti-clock {
    width: 8rem;
    height: 8rem;
    animation: shake 300ms infinite;
    transform: rotate(-10deg);
  }
  .noti__icons {
    margin-bottom: 1.375rem;
    display: flex;
    flex-direction: column;
    padding: 1.25rem;
    button {
      align-self: flex-end;
      width: 2rem;
      height: 2rem;
    }
    align-items: center;
    width: 100%;
  }
  @keyframes shake {
    30% {
      transform: rotate(-10deg);
    }
    70% {
      transform: rotate(10deg);
    }
  }
`;
