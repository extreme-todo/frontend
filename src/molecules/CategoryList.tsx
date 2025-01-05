import { useMemo } from 'react';
import { ITagSpanProps, TagAtom } from '../atoms';
import { RandomTagColorList } from '../shared/RandomTagColorList';
import { IChildProps } from '../shared/interfaces';
import { TodoEntity } from '../DB/indexedAction';
import styled from '@emotion/styled';

export interface ICategoryListProps extends IChildProps {
  categories: TodoEntity['categories'];
}

function CategoryList({ categories }: ICategoryListProps) {
  const tagSize: ITagSpanProps = useMemo(() => {
    return {
      fontsize: 'b2',
      size: 'normal',
    };
  }, []);
  const tagColorList = RandomTagColorList.getInstance().getColorList;
  return (
    <StyledCategoryList>
      {categories?.map((category) => (
        <TagAtom styleOption={{ ...tagSize, bg: tagColorList[category] }}>
          {category}
        </TagAtom>
      ))}
    </StyledCategoryList>
  );
}

const StyledCategoryList = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
`;

export default CategoryList;
