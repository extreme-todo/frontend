import styled from '@emotion/styled';
import { BtnAtom, GoogleLoginAtom, TypoAtom } from '../atoms';
import { usersApi } from '../shared/apis';
import { useCheckLogin } from '../hooks';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import Modal from './Modal';
import SettingModal from './SettingModal';

const Welcome = () => {
  const [isModal, setIsModal] = useState<boolean>(false);
  const isLogin = useCheckLogin();

  const handleLoginBtn = async () => {
    return await usersApi.login();
  };

  const handleLogoutBtn = (): void => {
    return usersApi.logout();
  };

  const handleSetting = (): void => {
    setIsModal((prev) => !prev);
  };

  const handleClose = (): void => {
    setIsModal(false);
  };

  return (
    <>
      <WelcomeContainer>
        <TypoAtom fontSize={'h1'}>EXTREME TODO</TypoAtom>
        {isLogin ? (
          <BtnContainer>
            <BtnAtom handler={handleLogoutBtn}>
              <TypoAtom fontSize="h5">SIGN OUT</TypoAtom>
            </BtnAtom>
            <div></div>
            <BtnAtom handler={handleSetting}>
              <TypoAtom fontSize="h5">SETTING</TypoAtom>
            </BtnAtom>
            {isModal &&
              createPortal(
                <Modal title="설정" handleClose={handleClose}>
                  <SettingModal />
                </Modal>,
                document.body,
              )}
          </BtnContainer>
        ) : (
          <GoogleLoginAtom onClick={handleLoginBtn} />
        )}
      </WelcomeContainer>
    </>
  );
};

export default Welcome;

const WelcomeContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > span:first-of-type {
    font-style: normal;
    line-height: 119px;
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
    text-fill-color: transparent;
  }
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 23.375rem;
  height: 2.375rem;

  > div {
    line-height: 30px;
    color: ${({ theme: { colors } }) => colors.subFontColor};
    margin: auto;
  }
  > div:nth-of-type(2) {
    width: 4px;
    height: 31px;
    background: rgba(108, 35, 35, 0.14);
    transform: rotate(45deg);
  }
`;
