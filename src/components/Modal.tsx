import styled from '@emotion/styled';
import { IChildProps } from '../shared/interfaces';
import { CardAtom, TypoAtom } from '../atoms';
import IconAtom from '../atoms/IconAtom';
import { useEffect } from 'react';
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
  useEffect(() => {
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    const preventArrowKeys = (e: KeyboardEvent) => {
      if (
        [
          'ArrowUp',
          'ArrowDown',
          'Space',
          'PageDown',
          'PageUp',
          'End',
          'Home',
        ].includes(e.code)
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', preventDefault, { passive: false });
    window.addEventListener('keydown', preventArrowKeys, { passive: false });
    return () => {
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('keydown', preventArrowKeys);
    };
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ModalBackground>
          <ModalContainer>
            <HeaderContainer>
              <TypoAtom fontSize={'h3'} fontColor={'titleColor'}>
                {title}
              </TypoAtom>

              <IconAtom
                onClick={handleClose}
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
    </>
  );
};

export default Modal;
export type { IModalProps };

const ModalBackground = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  z-index: 99;
`;

const ModalContainer = styled(CardAtom)`
  padding: 2.324375rem 3.2925rem;

  overflow: visible;

  max-height: 90vh;

  background: ${({ theme: { colors } }) =>
    `linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.85) 0%,
      rgba(255, 255, 255, 0) 55.21%
    ), ${colors.bgYellow}`};

  /* 
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  z-index: 99; 
  */
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
`;
