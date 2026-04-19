import { createContext, ReactNode, useContext, useEffect } from 'react';
import { IChildProps } from '../shared/interfaces';
import { SideBtnAtom } from '../atoms/SideBtnAtom';
import { ButtonName } from '../styles/emotion';
import { IconAtom } from '../atoms';
import styled from '@emotion/styled';

export type SideButtonType =
  | 'ranking'
  | 'timer'
  | 'addTodo'
  | 'help'
  | 'list'
  | 'doAll';

interface SideButtonContextValue {
  onClickHandlers?: Record<SideButtonType, () => void>;
  focusedButton?: SideButtonType;
}

const SideButtonContext = createContext<SideButtonContextValue>({
  onClickHandlers: {
    ranking: () => {
      throw new Error('onClickRanking not provided');
    },
    timer: () => {
      throw new Error('onClickTimer not provided');
    },
    addTodo: () => {
      throw new Error('onClickAddTodo not provided');
    },
    help: () => {
      throw new Error('onClickHelp not provided');
    },
    list: () => {
      throw new Error('onClickList not provided');
    },
    doAll: () => {
      throw new Error('onClickDoAll not provided');
    },
  },
});

function SideButtonsMain({
  children,
  ...props
}: IChildProps & SideButtonContextValue) {
  return (
    <SideButtonContext.Provider
      value={{
        ...props,
      }}
    >
      {children}
    </SideButtonContext.Provider>
  );
}

const ShowAddTodoButton = ({ theme }: { theme: ButtonName }) => {
  const context = useContext(SideButtonContext);

  return (
    <SideBtnAtom
      focused={context.focusedButton === 'addTodo'}
      onClick={context.onClickHandlers?.addTodo}
      btnStyle={theme}
    >
      Todo +
    </SideBtnAtom>
  );
};

const ShowTimerButton = ({
  theme,
  focusStep,
  restStep,
  className,
}: {
  theme: ButtonName;
  focusStep: number;
  restStep: number;
  className?: string;
}) => {
  const context = useContext(SideButtonContext);
  return (
    <SideBtnAtom
      focused={context.focusedButton === 'timer'}
      onClick={context.onClickHandlers?.timer}
      btnStyle={theme}
      className={className}
    >
      {theme === 'extremeLightBtn' ? (
        <SideBtnIcon
          iconUrl="icon/clock-red.svg"
          btnStyle={theme}
          focused={context.focusedButton === 'timer'}
        />
      ) : (
        <SideBtnIcon
          iconUrl="icon/clock.svg"
          btnStyle={theme}
          focused={context.focusedButton === 'timer'}
        />
      )}
      {focusStep}분 집중 | {restStep}분 휴식
    </SideBtnAtom>
  );
};

const ShowListButton = ({
  theme,
  className,
}: {
  theme: ButtonName;
  className?: string;
}) => {
  const context = useContext(SideButtonContext);
  return (
    <SideBtnAtom
      focused={context.focusedButton === 'list'}
      onClick={context.onClickHandlers?.list}
      btnStyle={theme}
      className={className}
    >
      {theme === 'extremeLightBtn' ? (
        <SideBtnIcon
          iconUrl="icon/list-red.svg"
          btnStyle={theme}
          focused={context.focusedButton === 'list'}
        />
      ) : (
        <SideBtnIcon
          iconUrl="icon/list.svg"
          btnStyle={theme}
          focused={context.focusedButton === 'list'}
        />
      )}
      남은 할일
    </SideBtnAtom>
  );
};

const ShowRankingButton = ({
  theme,
  className,
}: {
  theme: ButtonName;
  className?: string;
}) => {
  const context = useContext(SideButtonContext);
  return (
    <SideBtnAtom
      focused={context.focusedButton === 'ranking'}
      onClick={context.onClickHandlers?.ranking}
      btnStyle={theme}
      className={className}
    >
      랭킹
    </SideBtnAtom>
  );
};

const ShowDoAllButton = ({
  theme,
  className,
}: {
  theme: ButtonName;
  className?: string;
}) => {
  const context = useContext(SideButtonContext);
  return (
    <SideBtnAtom
      focused={context.focusedButton === 'doAll'}
      onClick={context.onClickHandlers?.doAll}
      btnStyle={theme}
      className={className}
      btnType="plain"
    >
      모든 TODO 종료하기
    </SideBtnAtom>
  );
};

const ShowHelpButton = ({
  theme,
  className,
}: {
  theme: ButtonName;
  className?: string;
}) => {
  const context = useContext(SideButtonContext);
  return (
    <SideBtnAtom
      onClick={context.onClickHandlers?.help}
      focused={context.focusedButton === 'help'}
      btnStyle={theme}
      className={className}
      btnType="icon"
      type="button"
      aria-label="도움말"
    >
      ?
    </SideBtnAtom>
  );
};

const SideBtnIcon = styled.div<{
  iconUrl: string;
  btnStyle?: ButtonName;
  focused?: boolean;
}>`
  width: 1.25rem;
  height: 1.25rem;
  mask-image: url(${({ iconUrl }) => iconUrl});
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  background-color: ${({ theme, btnStyle }) =>
    theme.button[btnStyle ?? 'lightBtn'].default.color};
  margin-right: 0.5rem;
  &:hover {
    background-color: ${({ theme, btnStyle }) =>
      theme.button[btnStyle ?? 'lightBtn'].hover.color};
  }
  &:active {
    background-color: ${({ theme, btnStyle }) =>
      theme.button[btnStyle ?? 'lightBtn'].click.color};
  }
  &:disabled {
    background-color: ${({ theme, btnStyle }) =>
      theme.button[btnStyle ?? 'lightBtn'].default.color};
    cursor: not-allowed;
  }
  ${({ focused, theme, btnStyle }) =>
    focused &&
    'background-color: ' +
      theme.button[btnStyle ?? 'lightBtn'].click.color +
      '!important;'}
`;

export const SideButtons = Object.assign(SideButtonsMain, {
  ShowTimerButton,
  ShowListButton,
  ShowAddTodoButton,
  ShowRankingButton,
  ShowDoAllButton,
  ShowHelpButton,
});
