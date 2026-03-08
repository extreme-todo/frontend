import styled from '@emotion/styled';
import { focusStep } from '../../hooks';
import { formatTime } from '../../shared/timeUtils';
import { TagColorName } from '../../styles/emotion';
import {
  IconAtom,
  TagAtom,
  TypoAtom,
  BtnAtom,
  InputAtom,
  PopperAtom,
  TomatoInputAtom,
} from '../../atoms';
import { CategoryInput } from '../../molecules';
import { memo, ReactEventHandler, useCallback } from 'react';
import { SPECIAL_EXPRESSION_WARNING } from '../../DB/indexedAction';

interface IEditUIProps {
  titleValue: string;
  handleChangeTitle: ReactEventHandler<HTMLInputElement>;
  handleTitleBlur: ReactEventHandler<HTMLInputElement>;
  titleError: boolean;
  order: number;
  handleEditCancel: () => void;
  categoryArray: string[];
  handleAddCategory: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleDeleteCategory: (category: string) => void;
  categoryValue: string;
  handleChangeCategory: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tagColorList: Record<string, TagColorName>;
  categoryError?: string;
  durationValue: number;
  focusStep: focusStep;
  handleTomato: (count: number) => void;
  showTomatoInput: boolean;
  setShowTomatoInput: (show: boolean) => void;
  popperElement: HTMLDivElement | null;
  setPopperElement: (el: HTMLDivElement | null) => void;
  triggerElement: HTMLDivElement | null;
  setTriggerElement: (el: HTMLDivElement | null) => void;
  arrowElement: HTMLImageElement | null;
  setArrowElement: (el: HTMLImageElement | null) => void;
  isSubmitting: boolean;
  isDisabled: boolean;
  handleEditSubmit: (event: React.FormEvent) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isCurrTodo: boolean;
}

export const EditUI = memo(
  ({
    titleValue,
    handleChangeTitle,
    handleTitleBlur,
    titleError,
    order,
    handleEditCancel,
    categoryArray,
    handleAddCategory,
    handleDeleteCategory,
    categoryValue,
    handleChangeCategory,
    tagColorList,
    categoryError,
    durationValue,
    focusStep,
    handleTomato,
    showTomatoInput,
    setShowTomatoInput,
    popperElement,
    setPopperElement,
    triggerElement,
    setTriggerElement,
    arrowElement,
    setArrowElement,
    isSubmitting,
    isDisabled,
    handleEditSubmit,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
    isCurrTodo,
  }: IEditUIProps) => {
    return (
      <EditCardContainer onSubmit={handleEditSubmit}>
        <MainContent>
          <TitleContainer>
            <div style={{ display: 'flex' }}>
              <TypoAtom
                fontSize="h3"
                fontColor="primary1"
                className="order-text"
              >
                {order}.
              </TypoAtom>
              <label htmlFor="title" style={{ width: '100%' }}>
                <InputAtom.Underline
                  value={titleValue}
                  handleChange={handleChangeTitle}
                  handleBlur={handleTitleBlur}
                  placeholder="할 일을 입력하세요"
                  ariaLabel="title_input"
                  name="title"
                  className="todoTitle"
                  inputRef={useCallback((node: HTMLInputElement | null) => {
                    node?.focus();
                  }, [])}
                  styleOption={{
                    borderWidth: titleError ? '2px' : '1px',
                    padding: '0 0 0 0',
                    height: '1.25rem',
                    font: 'h3',
                    borderColor: titleError ? 'extreme_orange' : 'primary1',
                    fontColor: 'primary1',
                  }}
                />
              </label>
            </div>
            <BtnAtom handleOnClick={handleEditCancel}>
              <IconAtom src={'icon/closeDark.svg'} size={1.25} alt="cancel" />
            </BtnAtom>
          </TitleContainer>

          <CategoryContainer
            className="categories"
            categoryError={categoryError !== undefined}
          >
            <CategoryInput
              categories={categoryArray}
              handleSubmit={handleAddCategory}
              handleClick={handleDeleteCategory}
              category={categoryValue}
              handleChangeCategory={handleChangeCategory}
              tagColorList={tagColorList}
            />
            <p className="category_error" role="alert">
              {categoryError ? categoryError : SPECIAL_EXPRESSION_WARNING}
            </p>
          </CategoryContainer>

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
                    {formatTime(durationValue * focusStep)}
                  </TypoAtom>
                </div>
              </TimeWrapper>
            </BtnAtom>
            <BtnAtom
              type="submit"
              disabled={isDisabled}
              className="submit_btn"
              aria-label="submit"
            >
              <TagAtom
                styleOption={{
                  size: 'normal',
                  bg: 'transparent',
                  borderColor: 'primary1',
                }}
                className="save__button"
              >
                <TypoAtom fontSize="b2" fontColor={'primary1'}>
                  {isSubmitting ? '저장 중' : '저장'}
                </TypoAtom>
              </TagAtom>
            </BtnAtom>
          </FooterContainer>
        </MainContent>

        <OrderButtonsColumn>
          <OrderBtn
            type="button"
            onClick={onMoveUp}
            disabled={isFirst || isCurrTodo || !onMoveUp}
            aria-label="move up"
          >
            ▲
          </OrderBtn>
          <OrderBtn
            type="button"
            onClick={onMoveDown}
            disabled={isLast || isCurrTodo || !onMoveDown}
            aria-label="move down"
          >
            ▼
          </OrderBtn>
        </OrderButtonsColumn>

        {showTomatoInput && (
          <PopperAtom
            popperElement={popperElement}
            setPopperElement={setPopperElement}
            triggerElement={triggerElement}
            arrowElement={arrowElement}
            placement={'bottom'}
          >
            <TomatoInputWrapper aria-label="tomatoInput">
              <TomatoInfo>
                <TypoAtom fontSize="h2" fontColor="primary1">
                  {formatTime(durationValue * focusStep)}
                </TypoAtom>
                <TypoAtom fontSize="b2" fontColor="primary1">
                  {durationValue}round
                </TypoAtom>
              </TomatoInfo>
              <TomatoInputAtom
                max={10}
                min={0}
                period={focusStep}
                handleTomato={handleTomato}
                tomato={+durationValue}
                isBalloon={false}
                isLabel={false}
              />
            </TomatoInputWrapper>
            <IconAtom
              id="arrow"
              data-popper-arrow
              ref={setArrowElement}
              h={3.125}
              w={0.875}
              src={'icon/popperArrow.svg'}
            />
          </PopperAtom>
        )}
      </EditCardContainer>
    );
  },
);

const EditCardContainer = styled.form`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem;
  border-radius: 0.875rem;
  background-color: ${({ theme }) => theme.color.backgroundColor.primary2};
  color: ${({ theme }) => theme.color.backgroundColor.primary1};

  .duration {
    border-bottom: ${({ theme }) =>
      `1px solid ${theme.color.backgroundColor.primary1}`};
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
`;

const OrderButtonsColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-left: 0.5rem;
  padding-left: 0.5rem;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
`;

const OrderBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.backgroundColor.primary1};
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  line-height: 1;

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    opacity: 0.7;
  }
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  column-gap: 4px;
  margin-bottom: 4px;

  & > div {
    display: flex;
    flex: 1;
    min-width: 0;
  }

  .order-text {
    margin-right: 0.25rem;
  }

  .todoTitle {
    width: 100%;
    min-width: 0;
  }

  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    .todoTitle {
      font-size: ${({ theme }) => theme.fontSize.h2.size};
    }
  }
`;

const CategoryContainer = styled.div<{
  categoryError: boolean;
}>`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
  column-gap: 0.5rem;
  row-gap: 0.25rem;
  .category_error {
    transition: all 0.7s ease;
    margin-top: 0.5rem;
    color: ${({ theme }) => theme.color.fontColor.extreme_orange};
    font-size: ${({ theme }) => theme.fontSize.b2.size};
    font-weight: ${({ theme }) => theme.fontSize.b2.weight};
    height: ${({ categoryError }) => (categoryError ? '1.8rem' : '0px')};
    overflow: hidden;
  }
`;

const FooterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: 0.5rem;
  .save__button {
    &:hover {
      background-color: ${({ theme: { button } }) =>
        button.darkBtn.hover.backgroundColor};
    }
    transition: background-color 0.3s ease-in-out;
  }
  .submit_btn:disabled {
    opacity: 0.4;
    * {
      cursor: not-allowed;
    }
  }
`;

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.25rem;
`;

const TomatoInputWrapper = styled.div`
  background-color: ${({ theme }) => theme.color.backgroundColor.white};
  width: 44.625rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  padding: 1.25rem 1rem;
  border-radius: 1.25rem;
`;

const TomatoInfo = styled.div`
  margin-bottom: 0.8rem;
  & > span:first-of-type {
    margin-right: 0.625rem;
  }
`;
