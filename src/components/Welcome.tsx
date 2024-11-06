import { useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { BtnAtom, IconAtom, TypoAtom } from '../atoms';
import Modal from './Modal';
import Setting from './Setting';

import { usersApi } from '../shared/apis';
import { LoginContext } from '../hooks';

import styled from '@emotion/styled';

const Welcome = () => {
  const [isModal, setIsModal] = useState<boolean>(false);
  const { isLogin, deleteToken } = useContext(LoginContext);
  const welcomeRef = useRef<HTMLDivElement>(null);

  const handleLoginBtn = () => {
    return usersApi.login();
  };

  const handleLogoutBtn = (): void => {
    return deleteToken();
  };

  const handleSetting = (): void => {
    setIsModal((prev) => !prev);
  };

  const handleClose = (): void => {
    setIsModal(false);
  };

  return (
    <WelcomeContainer ref={welcomeRef}>
      <TypoAtom fontSize={'h1'}>EXTREME TODO</TypoAtom>
      {isLogin ? (
        <BtnContainer>
          <BtnAtom handleOnClick={handleLogoutBtn}>
            <TypoAtom fontSize="b1">SIGN OUT</TypoAtom>
          </BtnAtom>
          <div></div>
          <BtnAtom handleOnClick={handleSetting}>
            <TypoAtom fontSize="b1">SETTING</TypoAtom>
          </BtnAtom>
          {isModal &&
            createPortal(
              <Modal title="설정" handleClose={handleClose}>
                <Setting handleClose={handleClose} />
              </Modal>,
              welcomeRef.current as HTMLDivElement,
            )}
        </BtnContainer>
      ) : (
        <IconAtom className="login-button" onClick={handleLoginBtn}>
          <img
            src="btn_google_signin_dark_pressed_web@2x.png"
            alt="google login button"
          />
        </IconAtom>
      )}
    </WelcomeContainer>
  );
};

export default Welcome;

const WelcomeContainer = styled.div`
  width: 100dvw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 1.5rem;

  > span:first-of-type {
    font-style: normal;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: -0.05rem;

    /* TitleColor */

    background: linear-gradient(
        114.81deg,
        #00c2ff 22.57%,
        rgba(0, 117, 255, 0) 65.81%
      ),
      #fa00ff;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .login-button {
    width: 20rem;
    height: 5rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    > span:first-of-type {
      font-size: 8rem;
    }
  }
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 23.375rem;
  height: 2.375rem;

  > div {
    line-height: 30px;
    color: ${({ theme: { color } }) => color.primary1};
    margin: auto;
  }
  > div:nth-of-type(2) {
    width: 4px;
    height: 31px;
    background: rgba(108, 35, 35, 0.14);
    transform: rotate(45deg);
  }
`;
