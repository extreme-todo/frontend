import { useEffect, useState } from 'react';

import { SwitchAtom, TagAtom, TypoAtom } from '../atoms';
import IconAtom from '../atoms/IconAtom';

import {
  rankingApi,
  settingsApi,
  timerApi,
  todosApi,
  usersApi,
} from '../shared/apis';

import styled from '@emotion/styled';
import { useExtremeMode } from '../hooks';
import { AxiosResponse } from 'axios';
import { ISettings } from '../shared/interfaces';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// TODO : state를 상위 컴포넌트로 뽑아낼 수는 없을까?.. 그게 더 괜찮은 방법이지 않을까?..
// TODO : 추가적으로 이런 모양의 선택지를 템플릿으로 뽑아낼 수는 없을까?
// TODO : Compound 적용해보자
const Setting = () => {
  const { isExtreme, setMode } = useExtremeMode();
  const [isOver, setIsOver] = useState<boolean>(false);
  const [settings, setSettings] = useState<ISettings>({
    colorMode: 'auto',
    extremeMode: isExtreme,
  });

  const handleReset = async () => {
    // if (!window.confirm('정말로 기록을 초기화 하시겠습니까?')) return;
    console.log('handleReset 작동');
    await Promise.all([
      todosApi.resetTodos(),
      rankingApi.resetRanking(),
      timerApi.reset(),
    ]);
  };

  const handleWithdrawal = async () => {
    // if (!window.confirm('정말로 회원 탈퇴하시겠습니까?')) return;
    console.log('handleWithdrawal 작동');
    await usersApi.withdrawal();
  };

  const queryClient = useQueryClient();
  const { mutate: resetMutation } = useMutation(handleReset, {
    onSuccess() {
      // window.alert('초기화 성공');
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
      // window.alert('회원 탈퇴 성공');
      queryClient.invalidateQueries(['todos']);
    },
    onError(error) {
      console.error(
        '\n\n\n 🚨 error in SettingModal‘s useMutation 🚨 \n\n',
        error,
      );
    },
  });

  const handleSwitch = (): void => {
    setMode(!isExtreme);
    setSettings((prev) => {
      const newSettings = { ...prev, extremeMode: !isExtreme };
      settingsApi.setSettings(newSettings);
      return newSettings;
    });
  };

  const tooltipMouseOver = () => {
    setIsOver(true);
  };
  const tooltipMouseLeave = () => {
    setIsOver(false);
  };

  const fetchSettings = async () => {
    const settings = await settingsApi.getSettings();
    const { data }: AxiosResponse<ISettings, any> = settings;
    if (data) setMode(data.extremeMode);
    setSettings({
      colorMode: data.colorMode,
      extremeMode: data.extremeMode,
    });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <>
      <SettingContainer>
        <ExtremeContainer>
          <TypoAtom fontSize={'h4'}>익스트림 모드</TypoAtom>
          <TooltipWrapper>
            {isOver ? (
              <Tooltip>
                <TypoAtom fontSize={'tooltip'}>
                  쉬는 시간을 초과할 시 작성했던 todo와 일간, 주간, 월간 기록이
                  모두 삭제됩니다!
                </TypoAtom>
              </Tooltip>
            ) : null}
            <IconAtom
              onMouseOver={tooltipMouseOver}
              onMouseLeave={tooltipMouseLeave}
              backgroundColor={'whiteWine'}
              size={1.5625}
            >
              <img alt="tooltip" src="icons/tooltip.svg"></img>
            </IconAtom>
          </TooltipWrapper>
          {/* TODO : 전역 객체로 처리해주자. 익스트림 모드는 할 일이 끝났을 때만 변경 가능하다 */}
          <SwitchAtom setValue={handleSwitch} value={isExtreme} />
        </ExtremeContainer>
        <TagAtom
          handler={resetMutation}
          styleOption={{ size: 'sm', fontsize: 'sm' }}
        >
          데이터 초기화
        </TagAtom>
        <TagAtom
          handler={withdrawMutation}
          styleOption={{ size: 'sm', fontsize: 'sm' }}
        >
          회원탈퇴
        </TagAtom>
      </SettingContainer>
    </>
  );
};

export default Setting;

const SettingContainer = styled.div`
  display: flex;
  flex-direction: column;
  > * {
    margin-bottom: 1.2rem;
  }
`;

const ExtremeContainer = styled.div`
  display: flex;
  align-items: center;

  > :nth-of-type(2) {
    margin-left: 0.3125rem;
  }

  > :last-child {
    margin-left: 1.8125rem;
  }
`;

const Tooltip = styled.div`
  background-color: white;
  padding: 8px;
  border-radius: 8px;

  position: absolute;
  width: 20rem;
  white-space: normal;
  line-height: 1.3;

  z-index: 22;
  top: -320%;
  left: 50%;
  transform: translateX(-50%);

  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: white transparent transparent transparent;
  }
`;

const TooltipWrapper = styled.div`
  position: relative;
`;
