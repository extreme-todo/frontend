import styled from '@emotion/styled';
import React from 'react';
import { TagAtom } from '../atoms';
import { ICategory } from '../shared/interfaces';

interface ICategorySelectorProps {
  categories?: ICategory[];
  selected?: ICategory;
  selectHandler: (category: ICategory) => void;
}

function CartegorySelector({
  categories,
  selected,
  selectHandler,
}: ICategorySelectorProps) {
  return (
    <CSContainer>
      {categories &&
        selected &&
        categories.map((category) => {
          return (
            <div key={category.id + category.name}>
              <TagAtom
                styleOption={{
                  bg: category.id !== selected.id ? 'whiteWine' : 'titleColor',
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

const CSContainer = styled.div`
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
    background-color: ${({ theme }) => theme.colors.whiteWine};
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 0.4rem;
  }
  -ms-overflow-style: auto; /* IE and Edge */
  scrollbar-width: auto; /* Firefox */
  > {
    flex-grow: 1;
    flex-basis: 100%;
    height: fit-content;
  }
`;

export default CartegorySelector;
