import { InputAtom, ITagSpanProps, TagAtom } from '../atoms';
import styled from '@emotion/styled';
import { MAX_CATEGORY_ARRAY_LENGTH } from '../shared/inputValidation';
import { useIsMobile } from '../hooks/useIsMobile';
import { memo, useMemo } from 'react';

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
  const isMobile = useIsMobile();
  const tagSize: ITagSpanProps = useMemo(
    () =>
      isMobile
        ? {
            fontsize: 'md2',
            size: 'md',
            bg: 'whiteWine',
            maxWidth: 10,
          }
        : {
            fontsize: 'sm',
            size: 'sm',
            bg: 'whiteWine',
            maxWidth: 10,
          },
    [isMobile],
  );
  return (
    <CategoryContainer>
      {categories?.map((category) => (
        <TagAtom
          key={category}
          handler={() => handleClick.call(this, category)}
          ariaLabel="category_tag"
          styleOption={tagSize}
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

export default memo(CategoryInput);

const CategoryContainer = styled.div`
  flex-wrap: wrap;
  display: flex;
  align-items: center;
  row-gap: 1.3125rem;
  column-gap: 0.625rem;
  margin-top: 0.61rem;
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    input {
      font-size: 1.8rem;
    }
  }
`;
