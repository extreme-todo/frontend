import styled from '@emotion/styled';
import { focusStep } from '../../hooks';
import { TagColorName } from '../../styles/emotion';
import {
  TagAtom,
  TypoAtom,
  BtnAtom,
  InputAtom,
  TomatoSelectorAtom,
} from '../../atoms';
import { CategoryInput } from '../../molecules';
import { memo, ReactEventHandler, useCallback } from 'react';
import { SPECIAL_EXPRESSION_WARNING } from '../../DB/indexedAction';
import { SideBtnAtom } from '../../atoms/SideBtnAtom';

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
  focusStepValue: focusStep;
  handleTomato: (count: number) => void;
  isSubmitting: boolean;
  isDisabled: boolean;
  handleEditSubmit: (event: React.FormEvent) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isCurrTodo: boolean;
  isExtreme: boolean;
}

const EditCardContainer = styled.form<{ isExtreme: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  box-sizing: border-box;
  border-radius: 0.875rem;
  background-color: ${({ theme }) => theme.color.backgroundColor.primary2};
  color: ${({ theme, isExtreme }) =>
    isExtreme
      ? theme.color.fontColor.extreme_dark
      : theme.color.backgroundColor.primary1};
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  padding: 0.75rem;
`;

const OrderButtonsColumn = styled.div<{ isExtreme: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 1.75rem;
  row-gap: 0.5rem;
  background-color: #95716919;
`;

const OrderBtn = styled.button<{ isExtreme: boolean; upDown: 'up' | 'down' }>`
  width: 1.25rem;
  height: 1.25rem;
  background: ${({ theme }) => theme.color.backgroundColor.primary1};
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  color: ${({ theme, isExtreme }) =>
    isExtreme
      ? theme.color.fontColor.extreme_dark
      : theme.color.backgroundColor.primary1};
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  line-height: 1;
  mask-image: url('icon/combobox.svg');
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;

  ${({ upDown }) =>
    upDown === 'down'
      ? 'transform: rotate(0deg);'
      : 'transform: rotate(180deg);'}

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
  align-items: center;
  column-gap: 4px;
  margin-left: 0.25rem;

  & > div {
    display: flex;
    flex: 1;
    align-items: center;
    min-width: 0;
  }

  .order-text {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    flex-shrink: 0;
  }

  .todoTitle {
    width: 100%;
    min-width: 0;
    line-height: 1.2;
  }

  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    .todoTitle {
      font-size: ${({ theme }) => theme.fontSize.h3.size};
    }
  }
`;

const CategoryContainer = styled.div<{
  categoryError: boolean;
}>`
  display: flex;
  flex-wrap: wrap;
  margin-left: 1.5635rem;
  margin-top: 0.5rem;
  margin-bottom: 0.375rem;
  column-gap: 0.5rem;
  row-gap: 0.25rem;
  .category_error {
    transition: all 0.7s ease;
    color: ${({ theme }) => theme.color.fontColor.extreme_orange};
    font-size: ${({ theme }) => theme.fontSize.b2.size};
    font-weight: ${({ theme }) => theme.fontSize.b2.weight};
    height: ${({ categoryError }) => (categoryError ? '1.8rem' : '0px')};
    overflow: hidden;
  }
`;

const FooterContainer = styled.div<{ isExtreme: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  row-gap: 1rem;

  .tomato-wrapper {
    width: 100%;
    min-width: 0;
  }

  .button-group {
    display: flex;
    column-gap: 0.5rem;
    align-items: center;
    justify-content: flex-end;
    flex-shrink: 0;
  }

  .save__button {
    &:hover {
      background-color: ${({ theme: { button }, isExtreme }) =>
        isExtreme
          ? button.extremeDarkBtn.hover.backgroundColor
          : button.darkBtn.hover.backgroundColor};
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
    focusStepValue,
    handleTomato,
    isSubmitting,
    isDisabled,
    handleEditSubmit,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
    isCurrTodo,
    isExtreme,
  }: IEditUIProps) => {
    const handleInputRef = useCallback((node: HTMLInputElement | null) => {
      node?.focus();
    }, []);

    return (
      <EditCardContainer onSubmit={handleEditSubmit} isExtreme={isExtreme}>
        <MainContent>
          <TitleContainer>
            <div style={{ display: 'flex' }}>
              <TypoAtom
                fontSize="h3"
                fontColor={isExtreme ? 'extreme_dark' : 'primary1'}
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
                  inputRef={handleInputRef}
                  styleOption={{
                    borderWidth: titleError ? '2px' : '1px',
                    padding: '0.25rem 0 0.25rem 0',
                    height: '1.5rem',
                    font: 'h3',
                    borderColor: titleError
                      ? 'extreme_orange'
                      : isExtreme
                      ? 'extreme_dark'
                      : 'primary1',
                    fontColor: isExtreme ? 'extreme_dark' : 'primary1',
                  }}
                />
              </label>
            </div>
          </TitleContainer>

          <CategoryContainer
            className="categories"
            categoryError={categoryError !== undefined}
          >
            <CategoryInput
              isExtreme={isExtreme}
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

          <FooterContainer isExtreme={isExtreme}>
            <div className="tomato-wrapper">
              <TomatoSelectorAtom
                max={10}
                min={1}
                period={focusStepValue}
                tomato={durationValue}
                handleTomato={handleTomato}
              />
            </div>
            <div className="button-group">
              <SideBtnAtom
                type="submit"
                btnStyle={isExtreme ? 'extremeLightBtn' : 'lightBtn'}
                disabled={isDisabled || isSubmitting}
                width="5.625rem"
                ariaLabel="submit"
              >
                {isSubmitting ? '저장 중' : '저장'}
              </SideBtnAtom>
              <SideBtnAtom
                type="button"
                btnStyle={isExtreme ? 'extremeLightBtn' : 'lightBtn'}
                width="5.625rem"
                ariaLabel="cancel"
                onClick={handleEditCancel}
              >
                취소
              </SideBtnAtom>
            </div>
          </FooterContainer>
        </MainContent>

        <OrderButtonsColumn isExtreme={isExtreme}>
          <OrderBtn
            type="button"
            onClick={onMoveUp}
            disabled={isFirst || isCurrTodo || !onMoveUp}
            aria-label="move up"
            isExtreme={isExtreme}
            upDown="up"
          />
          <OrderBtn
            type="button"
            onClick={onMoveDown}
            disabled={isLast || isCurrTodo || !onMoveDown}
            aria-label="move down"
            isExtreme={isExtreme}
            upDown="down"
          />
        </OrderButtonsColumn>
      </EditCardContainer>
    );
  },
);
