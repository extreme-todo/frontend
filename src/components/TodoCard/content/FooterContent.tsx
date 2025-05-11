import styled from '@emotion/styled';
import { memo } from 'react';
import { BtnAtom, IconAtom, TagAtom, TypoAtom } from '../../../atoms';
import { formatTime } from '../../../shared/timeUtils';

interface IFooterContentProps {
  isDragging: boolean | undefined;
  done: boolean;
  isThisEdit: boolean;
  isCurrTodo: boolean;
  duration: string;
  durationValue: number;
  handleEditButton: () => void;
  setShowTomatoInput: React.Dispatch<React.SetStateAction<boolean>>;
  setTriggerElement: React.Dispatch<
    React.SetStateAction<HTMLDivElement | null>
  >;
  isSubmitting: boolean;
}

const FooterContent = memo(
  ({
    isDragging,
    done,
    isThisEdit,
    duration,
    handleEditButton,
    durationValue,
    setShowTomatoInput,
    isCurrTodo,
    setTriggerElement,
    isSubmitting,
  }: IFooterContentProps) => {
    if (isDragging || done) return null;
    else if (isThisEdit) {
      return (
        <FooterContainer>
          <BtnAtom handleOnClick={() => setShowTomatoInput(true)}>
            <TimeWrapper>
              <IconAtom
                src={'icon/timer.svg'}
                alt="timer"
                className="timer"
                size={1.25}
              />
              <div ref={setTriggerElement}>
                <TypoAtom
                  fontSize="body"
                  fontColor="primary1"
                  className="duration"
                >
                  {formatTime(durationValue)}
                </TypoAtom>
              </div>
            </TimeWrapper>
          </BtnAtom>
          <BtnAtom handleOnClick={handleEditSubmit}>
            <TagAtom
              styleOption={{
                size: 'normal',
                bg: 'transparent',
                borderColor: 'primary1',
              }}
              className="save__button"
            >
              <TypoAtom fontSize="b2" fontColor="primary1">
                저장
              </TypoAtom>
            </TagAtom>
          </BtnAtom>
        </FooterContainer>
      );
    } else if (isCurrTodo) {
      return (
        <FooterContainer>
          <TimeWrapper>
            <IconAtom
              src={'icon/yellowTimer.svg'}
              alt="timer"
              className="timer"
              size={1.25}
            />
            <TypoAtom fontSize="body" fontColor="primary2">
              {duration}
            </TypoAtom>
          </TimeWrapper>
          <TagAtom
            styleOption={{
              size: 'normal',
              bg: 'transparent',
              borderColor: 'primary2',
            }}
          >
            <TypoAtom fontSize="b2" fontColor="primary2">
              진행중
            </TypoAtom>
          </TagAtom>
        </FooterContainer>
      );
    } else {
      return (
        <FooterContainer>
          <TimeWrapper>
            <IconAtom
              src={'icon/yellowTimer.svg'}
              alt="timer"
              className="timer"
              size={1.25}
            />
            <TypoAtom fontSize="body" fontColor="primary2">
              {duration}
            </TypoAtom>
          </TimeWrapper>
          <BtnAtom handleOnClick={handleEditButton}>
            <TagAtom
              styleOption={{
                size: 'normal',
                bg: 'transparent',
                borderColor: 'primary2',
              }}
              className="edit__button"
            >
              <TypoAtom fontSize="b2" fontColor="primary2">
                수정
              </TypoAtom>
            </TagAtom>
          </BtnAtom>
        </FooterContainer>
      );
    }
  },
);

const FooterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: 0.5rem;
  .edit__button,
  .save__button {
    &:hover {
      background-color: ${({ theme: { button } }) =>
        button.darkBtn.hover.backgroundColor};
    }
    transition: background-color 0.3s ease-in-out;
  }
`;

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.25rem;
`;

export default FooterContent;
