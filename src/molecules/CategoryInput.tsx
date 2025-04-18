import { memo, useState } from 'react';
import { BtnAtom, InputAtom, TagAtom } from '../atoms';
import { MAX_CATEGORY_ARRAY_LENGTH } from '../DB/indexedAction';
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
  const [isFocus, setIsFocus] = useState(false);
  return (
    <CategoryContainer>
      {categories?.map((category) => (
        <BtnAtom
          handleOnClick={() => handleClick.call(this, category)}
          key={category}
          ariaLabel={`category ${category}`}
        >
          <TagAtom
            styleOption={{
              bg: tagColorList[category],
              size: 'normal',
            }}
            className="tag_with_delete"
            ariaLabel={`category ${category} delete button`}
          >
            {category}
            <svg
              width={'0.625rem'}
              height={'0.625rem'}
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
        <label htmlFor="categories">
          <InputAtom.Usual
            value={category}
            id="categories"
            name="categories"
            ariaLabel="category input"
            handleChange={handleChangeCategory}
            handleKeyDown={handleSubmit}
            handleFocus={() => setIsFocus(true)}
            handleBlur={() => setIsFocus(false)}
            placeholder={isFocus ? '태그를 적어주세요' : '태그 추가하기'}
            styleOption={{
              borderStyle: isFocus ? 'solid' : 'dashed',
              borderRadius: '50px',
              borderWidth: '1px',
              textAlign: 'center',
              font: 'b2',
              placeholderOpacity: isFocus ? 0.3 : 1,
              placeholderColor: 'primary1',
              width: isFocus ? '17ch' : '15ch',
              height: '1.25rem',
            }}
          />
        </label>
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
