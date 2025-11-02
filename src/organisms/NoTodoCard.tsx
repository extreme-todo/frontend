import styled from '@emotion/styled';
import { BtnAtom, CardAtom, TypoAtom } from '../atoms';
import { ReactNode } from 'react';
import { useIsMobile } from '../hooks';

interface INoTodoCardProps {
  addTodoHandler: () => void;
  mobileTopButtonSlot?: ReactNode;
}

export function NoTodoCard({
  addTodoHandler,
  mobileTopButtonSlot,
}: INoTodoCardProps) {
  const isMobile = useIsMobile();
  return (
    <StyledNoTodoCard>
      <CardAtom bg="primary1" padding={'0'} className="no-todo-card">
        {isMobile && (
          <div className="mobile-top-button-wrapper">{mobileTopButtonSlot}</div>
        )}
        <div className="center-content">
          <TypoAtom fontSize="h3" className="tomato">
            🍅
          </TypoAtom>
          <TypoAtom fontSize="h3" fontColor="primary2" className="caption">
            새로운 TODO를 작성해볼까요?
          </TypoAtom>
          <BtnAtom
            className="add-todo"
            btnStyle="darkBtn"
            handleOnClick={addTodoHandler}
          >
            Todo +
          </BtnAtom>
        </div>
      </CardAtom>
    </StyledNoTodoCard>
  );
}

const StyledNoTodoCard = styled.div`
  .no-todo-card {
    display: flex;
    flex-direction: column;
    z-index: 1;
    align-items: flex-start;
    position: relative;
    .mobile-top-button-wrapper {
      flex-shrink: 0;
      height: fit-content;
      margin: 1.25rem;
      position: absolute;
      top: 0;
      left: 0;
    }
    .center-content {
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .tomato {
      margin-bottom: 8px;
    }
    .caption {
      margin-bottom: 12px;
    }
    .add-todo {
      padding: 6px 20.5px;
    }
  }
`;
