import { memo } from 'react';
import { TagAtom } from '../../../atoms';
import { CategoryInput } from '../../../molecules';
import { TagColorName } from '../../../styles/emotion';
import styled from '@emotion/styled';
import { SPECIAL_EXPRESSION_WARNING } from '../../../DB/indexedAction';

interface ICategoryContentProps {
  categories: string[] | null;
  categoryArray: string[] | null;
  handleAddCategory: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleDeleteCategory: (category: string) => void;
  categoryValue: string;
  handleChangeCategory: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tagColorList: Record<string, TagColorName>;
  isDragging: boolean | undefined;
  isThisEdit: boolean;
  categoryError?: string;
}

export const CategoryContent = memo(
  ({
    categories,
    categoryArray,
    handleAddCategory,
    handleDeleteCategory,
    categoryValue,
    handleChangeCategory,
    tagColorList,
    isDragging,
    isThisEdit,
    categoryError,
  }: ICategoryContentProps) => {
    if (isDragging || !categories) return null;
    else if (isThisEdit) {
      return (
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
      );
    } else if (categories && categories.length !== 0) {
      return (
        <CategoryContainer className="categories" categoryError={false}>
          {categories.map((category) => {
            return (
              <TagAtom
                key={category}
                title={category}
                styleOption={{ bg: tagColorList[category], size: 'normal' }}
              >
                {category}
              </TagAtom>
            );
          })}
        </CategoryContainer>
      );
    }
    return null;
  },
);

export const CategoryContainer = styled.div<{
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
