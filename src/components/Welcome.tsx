import { useContext, useRef, useState } from 'react';

import { BtnAtom, IconAtom, TypoAtom } from '../atoms';

import { rankingApi, todosApi, usersApi } from '../shared/apis';
import { LoginContext } from '../hooks';

import styled from '@emotion/styled';
import { MainLogo } from '../svg/MainLogo';
import { useInView, useAnimation } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Welcome = () => {
  const [isSettingModal, setIsSettingModal] = useState<boolean>(false);
  const { isLogin, deleteToken } = useContext(LoginContext);
  const welcomeRef = useRef<HTMLDivElement>(null);

  const handleLoginBtn = () => {
    return usersApi.login();
  };

  const handleLogoutBtn = (): void => {
    return deleteToken();
  };

  const handleSetting = (): void => {
    setIsSettingModal(true);
  };

  const handleClose = (): void => {
    setIsSettingModal(false);
  };

  const handleReset = async () => {
    if (!window.confirm('정말로 기록을 초기화 하시겠습니까?')) return;
    await Promise.all([todosApi.resetTodos(), rankingApi.resetRanking()]);
  };

  const handleWithdrawal = async () => {
    if (!window.confirm('정말로 회원 탈퇴하시겠습니까?')) return;
    console.debug('handleWithdrawal 작동');
    await usersApi.withdrawal();
  };

  const queryClient = useQueryClient();
  const { mutate: resetMutation } = useMutation(handleReset, {
    onSuccess() {
      window.alert('초기화 성공');
      queryClient.invalidateQueries(['todos']);
    },
    onError(error) {
      console.error(
        '\n\n\n 🚨 error in SettingModal‘s useMutation 🚨 \n\n',
        error,
      );
    },
  });
  const { mutate: withdrawMutation } = useMutation(handleWithdrawal, {
    onSuccess() {
      window.alert('회원 탈퇴 성공');
      queryClient.invalidateQueries(['todos']);
      queryClient.invalidateQueries(['category']);
      handleClose();
      deleteToken();
    },
    onError(error) {
      console.error(
        '\n\n\n 🚨 error in SettingModal‘s useMutation 🚨 \n\n',
        error,
      );
    },
  });

  return (
    <WelcomeContainer ref={welcomeRef}>
      <MainLogo />
      {isLogin ? (
        isSettingModal ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: '1.25rem',
              alignItems: 'center',
            }}
          >
            <BtnAtom handleOnClick={resetMutation} ariaLabel="reset">
              <TypoAtom fontSize="body" fontColor="extreme_orange">
                데이터 초기화
              </TypoAtom>
            </BtnAtom>
            <BtnAtom handleOnClick={withdrawMutation} ariaLabel="withdraw">
              <TypoAtom fontSize="body" fontColor="extreme_orange">
                회원 탈퇴
              </TypoAtom>
            </BtnAtom>
            <BtnAtom handleOnClick={handleClose} ariaLabel="goback">
              <IconAtom size={2} src="/icon/closeOrange.svg" />
            </BtnAtom>
          </div>
        ) : (
          <LoginContainer>
            <BtnAtom handleOnClick={handleSetting} ariaLabel="setting">
              <IconAtom size={1.25} src="/icon/setting.svg" />
              <TypoAtom fontColor="extreme_orange" fontSize="b2">
                설정
              </TypoAtom>
            </BtnAtom>
            <TypoAtom fontColor="extreme_orange" fontSize="b2">
              |
            </TypoAtom>
            <BtnAtom handleOnClick={handleLogoutBtn} ariaLabel="logout">
              <IconAtom size={1.25} src="/icon/logout.svg" />
              <TypoAtom fontColor="extreme_orange" fontSize="b2">
                로그아웃
              </TypoAtom>
            </BtnAtom>
          </LoginContainer>
        )
      ) : (
        <BtnAtom handleOnClick={handleLoginBtn} className="login_button">
          <TypoAtom fontColor="extreme_orange" fontSize="b1">
            Sign in with
          </TypoAtom>
          <IconAtom
            className="google_logo"
            src="/icon/googleIcon.svg"
            alt="google_login_button"
          />
        </BtnAtom>
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

  #logo {
    width: 33.75rem;
    height: 11.25rem;
    margin-bottom: 3.0625rem;
  }

  .login_button {
    display: flex;
    &:hover {
      opacity: 0.7;
      transition: opacity 0.3s ease-in-out;
    }
  }

  .google_logo {
    width: 6.25rem;
    height: 1.75rem;
    margin-left: 0.5rem;
  }

  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    > span:first-of-type {
      font-size: 8rem;
    }
  }
`;

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1.25rem;

  > button {
    display: flex;
    align-items: center;
    > img {
      margin-right: 0.25rem;
    }
  }
`;
