import { memo, useMemo } from 'react';
import { BtnAtom, InputAtom, ITagSpanProps, TagAtom } from '../atoms';
import { MAX_CATEGORY_ARRAY_LENGTH } from '../shared/inputValidation';
import { useIsMobile } from '../hooks/useIsMobile';
import styled from '@emotion/styled';
import { TagColorName } from '../styles/emotion';

interface ICategoryInputProps {
  categories: string[] | null;
  category: string;
  handleSubmit: (params: React.KeyboardEvent<HTMLInputElement>) => void;
  handleClick: (category: string) => void;
  handleChangeCategory: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tagColorList: Record<string, TagColorName>;
}

const CategoryInput = ({
  categories,
  handleSubmit,
  handleClick,
  category,
  handleChangeCategory,
  tagColorList,
}: ICategoryInputProps) => {
  const isMobile = useIsMobile();
  const tagSize: ITagSpanProps = useMemo(
    () =>
      isMobile
        ? {
            fontsize: 'b2',
            size: 'normal',
          }
        : {
            fontsize: 'b2',
            size: 'normal',
          },
    [isMobile],
  );

  return (
    <CategoryContainer>
      {categories?.map((category) => (
        <BtnAtom
          handleOnClick={() => handleClick.call(this, category)}
          ariaLabel="category_tag"
          key={category}
        >
          <TagAtom styleOption={{ ...tagSize, bg: tagColorList[category] }}>
            {category}
          </TagAtom>
        </BtnAtom>
      ))}
      {categories && categories.length >= MAX_CATEGORY_ARRAY_LENGTH ? null : (
        <InputAtom.Usual
          value={category}
          handleChange={handleChangeCategory}
          handleKeyDown={handleSubmit}
          placeholder="태그 추가하기"
          ariaLabel="category_input"
          styleOption={{
            borderStyle: 'dashed',
            borderRadius: '50px',
            borderWidth: '1px',
            textAlign: 'center',
            font: 'b2',
            placeholderOpacity: 1,
            width: '6.875rem',
            height: '1.25rem',
          }}
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
  gap: 0.5rem;
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    input {
      font-size: ${({ theme }) => theme.fontSize.body.size};
    }
  }
`;
