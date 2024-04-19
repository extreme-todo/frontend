import { InputAtom, TagAtom } from '../atoms';
import styled from '@emotion/styled';

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
      {categories && categories.length >= 5 ? null : (
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
  margin-top: 0.61rem;
  & > button {
    margin-right: 0.61rem;
  }
`;
