import styled from '@emotion/styled';
import { IChildProps } from '../shared/interfaces';
import { CardAtom, TypoAtom } from '../atoms';
import IconAtom from '../atoms/IconAtom';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface IModalProps extends IChildProps {
  title: string;
  handleClose: () => void;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const Modal = ({ title, children, handleClose }: IModalProps) => {
  const [isRender, setIsRender] = useState(true);

  const handleCloseModal = () => {
    setIsRender(false);
    setTimeout(() => {
      handleClose();
    }, 400); // 애니메이션 시간과 맞춤
  };
  useEffect(() => {
    const El = document.getElementById('main-container') as HTMLDivElement;
    El.style.overflowY = 'hidden';
    return () => {
      El.style.overflowY = 'auto';
    };
  }, []);
  useEffect(() => {
    const preventArrowKeys = (e: KeyboardEvent) => {
      if (
        ['ArrowUp', 'ArrowDown', 'PageDown', 'PageUp', 'End', 'Home'].includes(
          e.code,
        )
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', preventArrowKeys, { passive: false });
    return () => {
      window.removeEventListener('keydown', preventArrowKeys);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ModalBackground isRender={isRender}>
        <ModalContainer isRender={isRender}>
          <HeaderContainer>
            <TypoAtom fontSize={'h3'} fontColor={'titleColor'}>
              {title}
            </TypoAtom>

            <IconAtom
              onClick={handleCloseModal}
              size={3.6}
              backgroundColor={'whiteWine'}
            >
              <img alt="close" src={'icons/close.svg'}></img>
            </IconAtom>
          </HeaderContainer>
          {children}
        </ModalContainer>
      </ModalBackground>
    </QueryClientProvider>
  );
};

export default Modal;
export type { IModalProps };

const ModalBackground = styled.div<{ isRender: boolean }>`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  z-index: 99;

  animation: ${({ isRender }) =>
    isRender
      ? 'renderAnimation 0.4s forwards'
      : 'closeAnimation 0.4s forwards'};

  @keyframes renderAnimation {
    0% {
      background-color: rgba(0, 0, 0, 0);
    }
    100% {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  @keyframes closeAnimation {
    0% {
      background-color: rgba(0, 0, 0, 0.1);
    }
    100% {
      background-color: rgba(0, 0, 0, 0);
    }
  }
`;

const ModalContainer = styled(CardAtom)<{ isRender: boolean }>`
  padding: 2.324375rem 3.2925rem;
  min-width: 120px;

  overflow: visible;

  max-height: 90vh;

  background: ${({ theme: { colors } }) =>
    `linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.85) 0%,
      rgba(255, 255, 255, 0) 55.21%
    ), ${colors.bgYellow}`};

  animation: ${({ isRender }) =>
    isRender
      ? 'renderAnimation 0.4s forwards'
      : 'closeAnimation 0.4s forwards'};

  @keyframes renderAnimation {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes closeAnimation {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  /* 모바일 세로 (해상도 ~ 479px)*/
  @media all and (max-width: 479px) {
    max-height: 60vh;
    border-radius: 30px 30px 0px 0px;
    width: 80vw;
    position: fixed;
    /* 모바일 애니메이션 */
    @keyframes renderAnimation {
      0% {
        bottom: -100vh;
      }
      100% {
        bottom: 0;
      }
    }

    @keyframes closeAnimation {
      0% {
        bottom: 0;
      }
      100% {
        bottom: -100vh;
      }
    }
  }
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
`;
