import {
  BtnAtom,
  IconAtom,
  ITagSpanProps,
  TagAtom,
  TypoAtom,
} from '../../../atoms';

import { ITodoCardProps } from '..';

import styled from '@emotion/styled';
import { useMemo } from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';

interface ITodoUIProps extends ITodoCardProps {
  handleEditButton: () => void;
  handleDeleteButton: () => void;
}

const TodoUI = ({
  todoData,
  dragHandleProps,
  snapshot,
  handleEditButton,
  handleDeleteButton,
}: ITodoUIProps) => {
  const { todo, categories } = todoData;

  return (
    <TodoCardContainer>
      <TitleCategoryContainer>
        <TitleContainer>
          <div {...dragHandleProps}>
            {/* TODO : 🚨 조건문 처리 필요 */}
            <IconAtom src="icon/yellowHandle.svg" alt="handler" size={1.25} />
          </div>
          {/* TODO : 🚨 조건문 처리 및 변수 처리 필요 */}
          <TypoAtom fontSize="h3" fontColor="primary2">
            {'1.'}
          </TypoAtom>
          <TypoAtom className="todoTitle" fontSize="h3" fontColor="primary2">
            {todo}
          </TypoAtom>
        </TitleContainer>
        {snapshot?.isDragging ? null : (
          <CategoryContainer>
            {categories?.map((category) => {
              return (
                <TagAtom
                  key={category}
                  title={category}
                  // styleOption={tagSize}
                >
                  {category}
                </TagAtom>
              );
            })}
          </CategoryContainer>
        )}
      </TitleCategoryContainer>
      {snapshot?.isDragging ? null : (
        <EditContainer>
          <TimeWrapper>
            <IconAtom src={'icon/yellowTimer.svg'} alt="timer" size={1.25} />
            {/* TODO : 변수 처리 해야 됨 🚨 */}
            <TypoAtom
              fontSize="body"
              fontColor="primary2"
            >{`1시간 40분`}</TypoAtom>
          </TimeWrapper>
          <BtnAtom handleOnClick={handleEditButton}>
            <TagAtom
              styleOption={{
                size: 'normal',
                bg: 'transparent',
                borderColor: 'primary2',
              }}
            >
              <TypoAtom fontSize="b2" fontColor="primary2">
                수정
              </TypoAtom>
            </TagAtom>
          </BtnAtom>
          <BtnAtom handleOnClick={handleDeleteButton}>
            <TagAtom
              styleOption={{
                size: 'normal',
                bg: 'transparent',
                borderColor: 'primary2',
              }}
            >
              <TypoAtom fontSize="b2" fontColor="primary2">
                삭제
              </TypoAtom>
            </TagAtom>
          </BtnAtom>
        </EditContainer>
      )}
    </TodoCardContainer>
  );
};

export default TodoUI;

const TodoCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24.5rem;

  box-sizing: border-box;
  padding: 0.75rem;
  border-radius: 0.875rem;

  &,
  * {
    outline: 1px solid limegreen;
  }
`;

const TitleCategoryContainer = styled.div`
  margin-left: 1rem;
`;

const EditContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: 0.5rem;
`;

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.25rem;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  column-gap: 4px;
  margin-bottom: 4px;

  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: wrap;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    .todoTitle {
      font-size: ${({ theme }) => theme.fontSize.h2.size};
      /* 지정된 줄 수로 제한해서 말 줄임 하기 */
      -webkit-line-clamp: 3;
    }
  }
`;

export const CategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-left: 1.25rem;

  column-gap: 0.5rem;
  row-gap: 0.25rem;

  > div {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;
