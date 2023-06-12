import styled from '@emotion/styled';
import { IChildProps } from '../shared/interfaces';
import { BtnAtom, CardAtom, TypoAtom } from '../atoms';
import IconAtom from '../atoms/IconAtom';

interface IModalProps extends IChildProps {
  title: string;
  handleClose: () => void;
  handleDone?: () => void;
}

const Modal = ({ title, children, handleClose, handleDone }: IModalProps) => {
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

const ModalContainer = styled(CardAtom)`
  background: ${({ theme: { colors } }) =>
    `linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.85) 0%,
      rgba(255, 255, 255, 0) 55.21%
    ), ${colors.bgYellow}`};
  padding: 2.324375 3.2925;

  position: absolute;
  z-index: 99;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
`;

const FooterContainer = styled.div``;
