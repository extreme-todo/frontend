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

const getSvgColor = (bg: string) => {
  switch (bg) {
    case 'mint':
    case 'orange':
    case 'pink':
    case 'purple':
      return '#FFFFFF';
    default:
      return '#523EA1';
  }
};

const CategoryInput = ({
  categories,
  handleSubmit,
  handleClick,
  category,
  handleChangeCategory,
  tagColorList,
}: ICategoryInputProps) => {
  return (
    <CategoryContainer>
      {categories?.map((category) => (
        <BtnAtom
          handleOnClick={() => handleClick.call(this, category)}
          ariaLabel="category_tag"
          key={category}
        >
          <TagAtom
            styleOption={{
              fontsize: 'b2',
              size: 'normal',
              bg: tagColorList[category],
            }}
            className="tag_with_delete"
          >
            {category}
            <svg
              width={'0.875rem'}
              height={'0.875rem'}
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="delete"
            >
              <rect
                width="1.81331"
                height="25.3864"
                transform="matrix(-0.707107 0.707107 0.707107 0.707107 7.28223 6.19336)"
                fill={getSvgColor(tagColorList[category])}
              />
              <rect
                x="7.28223"
                y="25.2329"
                width="1.81331"
                height="25.3864"
                transform="rotate(-135 7.28223 25.2329)"
                fill={getSvgColor(tagColorList[category])}
              />
            </svg>
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
            width: '15ch',
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
  .tag_with_delete {
    padding-right: 0.375rem;
  }
`;
