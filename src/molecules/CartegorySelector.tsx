import styled from '@emotion/styled';
import React from 'react';
import { TagAtom } from '../atoms';
import { ICategory } from '../shared/interfaces';

interface ICategorySelectorProps {
  categories?: ICategory[];
  selected?: ICategory;
  selectHandler: (category: ICategory) => void;
  isMobile?: boolean;
}

function CartegorySelector({
  categories,
  selected,
  selectHandler,
  isMobile,
}: ICategorySelectorProps) {
  return (
    <CSContainer isMobile={isMobile ?? false}>
      {isMobile && categories && selected && (
        <TagAtom
          styleOption={{
            bg: 'mint',
          }}
        >
          <select
            className="category-select-mobile"
            value={selected.id}
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
        selected &&
        categories.map((category) => {
          return (
            <div key={category.id + category.name}>
              <TagAtom
                styleOption={{
                  bg: category.id !== selected.id ? 'green' : 'purple',
                }}
                handler={() => {
                  selectHandler(category);
                }}
              >
                {category.name}
              </TagAtom>
            </div>
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
  flex-basis: 0;
  /* mask-image: linear-gradient(to bottom, black 50%, transparent 100%); */
  /* mask-size: calc(100% - 0.8rem) 100%, 0.8rem 100%; */

  &::-webkit-scrollbar {
    mask-image: none;
    display: initial;
    width: 0.8rem;
    border-radius: 0.4rem;
    background-color: ${({ theme }) => theme.color.backgroundColor.primary2};
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.color.backgroundColor.primary1};
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

export default CartegorySelector;
