import {
  BtnAtom,
  IconAtom,
  ITagSpanProps,
  TagAtom,
  TypoAtom,
} from '../../../atoms';

import { ITodoCardProps } from '..';

import styled from '@emotion/styled';
import { useCallback, useMemo } from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { formatTime } from '../../../shared/timeUtils';

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
  focusStep,
  randomTagColor,
  isCurrTodo,
  order,
}: ITodoUIProps) => {
  const { todo, categories } = todoData;
  const HandlerIcon = useCallback(() => {
    return isCurrTodo ? (
      <IconAtom
        src="icon/handle.svg"
        alt="handler"
        size={1.25}
        className="handler"
      />
    ) : (
      <div {...dragHandleProps}>
        <IconAtom src="icon/yellowHandle.svg" alt="handler" size={1.25} />
      </div>
    );
  }, [isCurrTodo]);
  const FooterButton = useCallback(() => {
    return isCurrTodo ? (
      <TagAtom
        styleOption={{
          size: 'normal',
          bg: 'transparent',
          borderColor: 'primary2',
        }}
      >
        <TypoAtom fontSize="b2" fontColor="primary2">
          진행중
        </TypoAtom>
      </TagAtom>
    ) : (
      <>
        <BtnAtom handleOnClick={handleEditButton}>
          <TagAtom
            styleOption={{
              size: 'normal',
              bg: 'transparent',
              borderColor: 'primary2',
            }}
            className="edit__button"
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
            className="edit__button"
          >
            <TypoAtom fontSize="b2" fontColor="primary2">
              삭제
            </TypoAtom>
          </TagAtom>
        </BtnAtom>
      </>
    );
  }, [isCurrTodo]);

  return (
    <TodoCardContainer>
      <TitleContainer>
        <HandlerIcon />
        <TypoAtom fontSize="h3" fontColor="primary2">
          {order}.
        </TypoAtom>
        <TypoAtom className="todoTitle" fontSize="h3" fontColor="primary2">
          {todo}
        </TypoAtom>
      </TitleContainer>
      {snapshot?.isDragging ? null : (
        <>
          {categories ? (
            <CategoryContainer>
              {categories.map((category) => {
                return (
                  <TagAtom
                    key={category}
                    title={category}
                    styleOption={{ bg: randomTagColor[category] }}
                  >
                    {category}
                  </TagAtom>
                );
              })}
            </CategoryContainer>
          ) : null}
          <EditContainer>
            <TimeWrapper>
              <IconAtom
                src={'icon/yellowTimer.svg'}
                alt="timer"
                className="timer"
                size={1.25}
              />
              <TypoAtom fontSize="body" fontColor="primary2">
                {formatTime(focusStep * todoData.duration)}
              </TypoAtom>
            </TimeWrapper>
            <FooterButton />
          </EditContainer>
        </>
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

  background-color: #463685;

  .handler,
  .timer {
    cursor: auto;
  }

  /* &,
  * {
    outline: 1px solid limegreen;
  } */
`;

const EditContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: 0.5rem;
  .edit__button {
    &:hover {
      background-color: ${({ theme: { button } }) =>
        button.darkBtn.hover.backgroundColor};
    }
    transition: background-color 0.3s ease-in-out;
  }
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
  margin-bottom: 0.5rem;

  column-gap: 0.5rem;
  row-gap: 0.25rem;

  > div {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;
