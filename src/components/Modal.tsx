import styled from '@emotion/styled';
import { IChildProps } from '../shared/interfaces';
import { CardAtom, TypoAtom } from '../atoms';
import IconAtom from '../atoms/IconAtom';
import { useEffect } from 'react';

interface IModalProps extends IChildProps {
  title: string;
  handleClose: () => void;
}

const Modal = ({ title, children, handleClose }: IModalProps) => {
  useEffect(() => {
    const bodyElement = document.getElementById('root') as HTMLDivElement;
    const El = document.getElementById('main-container') as HTMLDivElement;
    El.style.overflowY = 'hidden';
    bodyElement.style.background = `linear-gradient(328deg, #7b5da8, #b26ab6, #5bb8b0)`;
    return () => {
      El.style.overflowY = 'auto';
      bodyElement.style.background = `linear-gradient(328deg, #b8a2e4, #edbff1, #8ef0e8)`;
    };
  }, []);

  return (
    <>
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
    </>
  );
};

export default Modal;
export type { IModalProps };

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

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  z-index: 99;
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
`;

const FooterContainer = styled.div``;
