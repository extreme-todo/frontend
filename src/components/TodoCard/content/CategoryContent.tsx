import { memo } from 'react';
import { TagAtom } from '../../../atoms';
import { CategoryInput } from '../../../molecules';
import { TagColorName } from '../../../styles/emotion';
import styled from '@emotion/styled';

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
}

const CategoryContent = memo(
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
  }: ICategoryContentProps) => {
    if (isDragging || !categories) return null;
    else if (isThisEdit) {
      return (
        <CategoryContainer className="categories">
          <CategoryInput
            categories={categoryArray}
            handleSubmit={handleAddCategory}
            handleClick={handleDeleteCategory}
            category={categoryValue}
            handleChangeCategory={handleChangeCategory}
            tagColorList={tagColorList}
          />
        </CategoryContainer>
      );
    } else if (categories && categories.length !== 0) {
      return (
        <CategoryContainer className="categories">
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

export const CategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;

  column-gap: 0.5rem;
  row-gap: 0.25rem;
`;

export default CategoryContent;
