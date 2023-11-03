import styled from '@emotion/styled';
import { IChildProps } from '../shared/interfaces';
import { BtnAtom, CardAtom, TypoAtom } from '../atoms';
import IconAtom from '../atoms/IconAtom';
import { useEffect } from 'react';

interface IModalProps extends IChildProps {
  title: string;
  handleClose: () => void;
  handleDone?: () => void;
}

const _bodyEl = document.getElementById('root')?.firstChild as HTMLDivElement;

const Modal = ({ title, children, handleClose, handleDone }: IModalProps) => {
  useEffect(() => {
    _bodyEl.style.overflowY = 'hidden';
    return () => {
      _bodyEl.style.overflowY = 'auto';
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
            size={4.455}
            backgroundColor={'whiteWine'}
          >
            <img src={'icons/close.svg'}></img>
          </IconAtom>
        </HeaderContainer>
        {children}
        {/* <FooterContainer>
          <BtnAtom handler={handleDone}>
            <span className="material-symbols-outlined">done</span>
          </BtnAtom>
        </FooterContainer> */}
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
