import { InputAtom, TagAtom } from '../atoms';
import styled from '@emotion/styled';
import { MAX_CATEGORY_ARRAY_LENGTH } from '../shared/inputValidation';

interface ICategoryInputProps {
  categories: string[] | null;
  category: string;
  handleSubmit: (params: React.KeyboardEvent<HTMLInputElement>) => void;
  handleClick: (category: string) => void;
  handleChangeCategory: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CategoryInput = ({
  categories,
  handleSubmit,
  handleClick,
  category,
  handleChangeCategory,
}: ICategoryInputProps) => {
  return (
    <CategoryContainer>
      {categories?.map((category) => (
        <TagAtom
          key={category}
          handler={() => handleClick.call(this, category)}
          ariaLabel="category_tag"
          styleOption={{
            fontsize: 'sm',
            size: 'sm',
            bg: 'whiteWine',
            maxWidth: 10,
          }}
        >
          {category}
        </TagAtom>
      ))}
      {categories && categories.length >= MAX_CATEGORY_ARRAY_LENGTH ? null : (
        <InputAtom.Underline
          value={category}
          handleChange={handleChangeCategory}
          handleKeyDown={handleSubmit}
          placeholder="카테고리를 입력하세요"
          ariaLabel="category_input"
        />
      )}
    </CategoryContainer>
  );
};

export default CategoryInput;

const CategoryContainer = styled.div`
  flex-wrap: wrap;
  display: flex;
  align-items: center;
  row-gap: 0.3125rem;
  column-gap: 0.625rem;
  margin-top: 0.61rem;
`;
