import { BtnAtom, ITagSpanProps, TagAtom, TypoAtom } from '../../../atoms';

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
  const isMobile = useIsMobile();
  // const tagSize: ITagSpanProps = useMemo(
  //   () =>
  //     isMobile
  //       ? {
  //           fontsize: 'md2',
  //           size: 'md',
  //           bg: 'cyan',
  //           maxWidth: 10,
  //         }
  //       : {
  //           fontsize: 'sm',
  //           size: 'sm',
  //           bg: 'cyan',
  //           maxWidth: 10,
  //         },
  //   [isMobile],
  // );

  return (
    <TodoCardContainer>
      <TitleCategoryContainer>
        <TitleContainer>
          <div {...dragHandleProps}>
            <IconAtom src="icon/handle.svg" alt="handler" size={1.25} />
          </div>
          {/* TODO : 🚨 조건문 처리 및 변수 처리 필요 */}
          <TypoAtom fontSize="h3">{'1.'}</TypoAtom>
          <TypoAtom className="todoTitle" fontSize="h3">
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
            <IconAtom src={'icon/timer.svg'} alt="timer" size={1.25} />
            {/* TODO : 변수 처리 해야 됨 🚨 */}
            <TypoAtom
              fontSize="body"
              {todo}
          </TitleContainer>
              })}
            </CategoryContainer>
          )}
        </TitleCategoryContainer>
      </DraggableWrapper>
      {snapshot?.isDragging ? null : (
        <EditWrapper id="editWrapper">
          <BtnAtom handleOnClick={handleEditButton}>
            <TagAtom styleOption={{ size: 'normal' }}>수정</TagAtom>
          </BtnAtom>
          <BtnAtom handleOnClick={handleDeleteButton}>
            <TagAtom styleOption={{ size: 'normal' }}>삭제</TagAtom>
          </BtnAtom>
        </EditWrapper>
      )}
    </TodoCardContainer>
  );
};

export default TodoUI;

const TodoCardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  @media all and (min-width: 1080px),
    ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.desktop} {
    &:hover {
      #editWrapper {
        display: flex;
      }
    }
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    overflow-x: hidden;
    #editWrapper {
      button {
        span {
          font-size: 2.1rem;
        }
      }
    }
  }
`;

const DraggableWrapper = styled.div`
  display: flex;
  width: 80%;
`;

const TitleCategoryContainer = styled.div`
  margin-left: 1rem;
`;

const EditWrapper = styled.div`
  display: none;
  gap: 10px;
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    display: flex;
  }
`;

const TitleContainer = styled.div`
  width: 100%;
  margin-bottom: 0.5rem;

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

  > div {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;
