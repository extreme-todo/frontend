import { Children, isValidElement, ReactNode } from 'react';
import { IChildProps } from '../shared/interfaces';
import { TagAtom, TypoAtom } from '../atoms';
import styled from '@emotion/styled';

export interface ILogInToUnlockProps extends IChildProps {
  icon?: string;
  label?: string;
  subLabel?: string;
  navigate: () => void;
}

function LogInToUnlock({
  icon,
  label,
  subLabel,
  navigate,
}: ILogInToUnlockProps) {
  return (
    <UnlockContainer>
      <div className="labels">
        <img className="lock-icon" src={icon ?? '/icons/icon-lock.svg'} />
        <div>
          <LogInToUnlock.typo
            fontSize={'body_bold'}
            fontColor={'titleColor'}
            className="login-typo"
          >
            {label ?? '로그인이 필요한 기능입니다.'}
          </LogInToUnlock.typo>
          <LogInToUnlock.typo fontSize={'h3'} className="login-typo">
            {subLabel ?? '로그인하고 기능을 확인해보세요!'}
          </LogInToUnlock.typo>
        </div>
      </div>
      <LogInToUnlock.loginButton
        styleOption={{
          size: 'big2',
          fontsize: 'md1',
          bold: 'extraBold',
          bg: 'titleColor',
          shadow: 'button_shadow',
        }}
        handler={navigate}
      >
        로그인하기
      </LogInToUnlock.loginButton>
    </UnlockContainer>
  );
}

LogInToUnlock.typo = TypoAtom;
LogInToUnlock.loginButton = TagAtom;

const UnlockContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(31px);
  background: rgba(255, 255, 255, 0.5);
  background-clip: content-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .labels {
    padding: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 2.37rem;
    margin-bottom: 1.31rem;
    img {
      width: 7.43rem;
      object-fit: contain;
    }
    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 1.12rem;
    }
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    .lock-icon {
      width: 6rem;
      height: 6rem;
    }
    .labels {
      flex-direction: column;
    }
    .login-typo {
      font-size: 4rem;
      text-align: center;
    }
    > button {
      > span {
        font-size: 3rem;
        border-radius: 6rem;
        padding: 1rem 3rem;
      }
    }
  }
`;

export default LogInToUnlock;
