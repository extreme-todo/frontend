import styled from '@emotion/styled';
import { BtnAtom, TagAtom } from '../atoms';
import { ICategory } from '../shared/interfaces';
import { RandomTagColorList } from '../shared/RandomTagColorList';

interface ICategorySelectorProps {
  categories?: ICategory[];
  selected?: ICategory | null;
  selectHandler: (category: ICategory) => void;
  isMobile?: boolean;
}

export function CategorySelector({
  categories,
  selected,
  selectHandler,
  isMobile,
}: ICategorySelectorProps) {
  const tagColorList = RandomTagColorList.getInstance().getColorList;
  return (
    <CSContainer isMobile={isMobile ?? false}>
      {isMobile && categories && (
        <TagAtom
          styleOption={{
            bg: 'mint',
          }}
        >
          <select
            className="category-select-mobile"
            value={selected?.id}
            onChange={(e) => {
              const category: ICategory | undefined = categories.find(
                (v) => v.id === Number(e.target.value),
              );
              if (category) {
                selectHandler(category);
              }
            }}
          >
            {categories.map((category) => {
              return (
                <option
                  value={category.id}
                  key={category.id}
                  label={category.name}
                />
              );
            })}
          </select>
        </TagAtom>
      )}
      {!isMobile &&
        categories &&
        categories.map((category) => {
          return (
            <BtnAtom
              handleOnClick={() => {
                selectHandler(category);
              }}
              className={
                'category-select' +
                (selected?.id === category.id ? ' selected' : '')
              }
              key={category.id}
            >
              <TagAtom
                styleOption={{
                  bg: tagColorList[category.name],
                  selectable: true,
                  isSelected:
                    selected == null ? true : selected.id === category.id,
                  size: 'normal',
                  fontsize: 'tag',
                }}
              >
                {category.name}
              </TagAtom>
            </BtnAtom>
          );
        })}
    </CSContainer>
  );
}

const CSContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  width: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  flex-grow: 1;
  flex-shrink: 0;
  max-height: 4.75rem;
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  /* mask-image: linear-gradient(to bottom, black 50%, transparent 100%); */
  /* mask-size: calc(100% - 0.8rem) 100%, 0.8rem 100%; */

  &::-webkit-scrollbar {
    mask-image: none;
    display: initial;
    background-color: ${({ theme }) => theme.color.backgroundColor.primary1};
    width: 0.25rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.color.backgroundColor.primary2};
    border-radius: 0.4rem;
  }
  -ms-overflow-style: auto; /* IE and Edge */
  scrollbar-width: auto; /* Firefox */
  > {
    flex-grow: 1;
    flex-basis: 100%;
    height: fit-content;
  }
  .category-select-mobile {
    background-color: transparent;
    border: none;
    font-size: 2.5rem;
    /* appearance: unset; */
    width: fit-content;
  }
  ${({ isMobile }) => isMobile && ``}
`;
