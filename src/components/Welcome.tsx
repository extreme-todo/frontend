import { ForwardedRef, forwardRef, useContext, useRef, useState } from 'react';

import { BtnAtom, IconAtom, TypoAtom } from '../atoms';
import { MainLogo } from '../svg/MainLogo';

import { LoginContext } from '../hooks';
import { timerApi, todosApi, usersApi } from '../shared/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import styled from '@emotion/styled';
import { motion, AnimatePresence, MotionValue } from 'framer-motion';

interface IWelcomeProps {
  buttonOpacityForScroll: MotionValue<number>;
  mainLogoPathLengthForScroll: MotionValue<number>;
  mainLogoFillForScroll: MotionValue<string>;
}

const Welcome = forwardRef(
  (
    {
      buttonOpacityForScroll,
      mainLogoPathLengthForScroll,
      mainLogoFillForScroll,
    }: IWelcomeProps,
    ref: ForwardedRef<HTMLElement>,
  ) => {
    const [isSettingModal, setIsSettingModal] = useState<boolean>(false);
    const { isLogin, deleteToken } = useContext(LoginContext);

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
      await Promise.all([todosApi.resetTodos(), timerApi.resetRecords()]);
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
        queryClient.invalidateQueries(['focusedTime']);
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
      <WelcomeContainer ref={ref}>
        <AnimatePresence mode="wait">
          {isSettingModal ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
              }}
              exit={{
                transition: { delay: 0.6 },
                opacity: 0,
              }}
              style={{ opacity: buttonOpacityForScroll }}
              key={'settingModal'}
            >
              <IconAtom src="/icon/logo.svg" size={10} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: '1.25rem',
                  alignItems: 'center',
                }}
              >
                <motion.button
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                  exit={{ opacity: 0, y: -40, transition: { delay: 0.6 } }}
                  transition={{
                    duration: 0.3,
                  }}
                >
                  <BtnAtom handleOnClick={resetMutation} ariaLabel="reset">
                    <TypoAtom fontSize="body" fontColor="extreme_orange">
                      데이터 초기화
                    </TypoAtom>
                  </BtnAtom>
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                  exit={{ opacity: 0, y: -40, transition: { delay: 0.4 } }}
                  transition={{
                    duration: 0.3,
                  }}
                >
                  <BtnAtom
                    handleOnClick={withdrawMutation}
                    ariaLabel="withdraw"
                  >
                    <TypoAtom fontSize="body" fontColor="extreme_orange">
                      회원 탈퇴
                    </TypoAtom>
                  </BtnAtom>
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
                  exit={{ opacity: 0, y: -40, transition: { delay: 0.2 } }}
                  transition={{
                    duration: 0.3,
                  }}
                >
                  <BtnAtom handleOnClick={handleClose} ariaLabel="goback">
                    <IconAtom size={2} src="/icon/closeOrange.svg" />
                  </BtnAtom>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0.65, ease: 'easeInOut' },
              }}
              key={'mainLogo'}
            >
              <MainLogo
                mainLogoPathLengthForScroll={mainLogoPathLengthForScroll}
                mainLogoFillForScroll={mainLogoFillForScroll}
              />
              <motion.div
                style={{ opacity: buttonOpacityForScroll }}
                key={'login_btn_container'}
              >
                <LoginContainer>
                  {isLogin ? (
                    <>
                      <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        style={{ opacity: buttonOpacityForScroll }}
                        key={'login_btn-setting'}
                      >
                        <BtnAtom
                          handleOnClick={handleSetting}
                          ariaLabel="setting"
                          className="buttonWithIcon"
                        >
                          <IconAtom size={1.25} src="/icon/setting.svg" />
                          <TypoAtom fontColor="extreme_orange" fontSize="b2">
                            설정
                          </TypoAtom>
                        </BtnAtom>
                      </motion.div>
                      <TypoAtom fontColor="extreme_orange" fontSize="b2">
                        |
                      </TypoAtom>
                      <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        key={'login_btn-logout'}
                      >
                        <BtnAtom
                          handleOnClick={handleLogoutBtn}
                          ariaLabel="logout"
                          className="buttonWithIcon"
                        >
                          <IconAtom size={1.25} src="/icon/logout.svg" />
                          <TypoAtom fontColor="extreme_orange" fontSize="b2">
                            로그아웃
                          </TypoAtom>
                        </BtnAtom>
                      </motion.div>
                    </>
                  ) : (
                    <BtnAtom
                      handleOnClick={handleLoginBtn}
                      className="login_button"
                    >
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
                </LoginContainer>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </WelcomeContainer>
    );
  },
);

export default Welcome;

const WelcomeContainer = styled.main`
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
  }

  button:hover {
    opacity: 0.7;
    transition: opacity 0.3s ease-in-out;
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
  justify-content: center;
  column-gap: 1.25rem;

  .buttonWithIcon {
    display: flex;
    align-items: center;
    > img {
      margin-right: 0.25rem;
    }
  }
`;
