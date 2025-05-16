import styled from '@emotion/styled';
import { BtnAtom, CardAtom, TypoAtom } from '../atoms';

interface INoTodoCardProps {
  addTodoHandler: () => void;
}

export function NoTodoCard({ addTodoHandler }: INoTodoCardProps) {
  return (
    <StyledNoTodoCard>
      <CardAtom bg="primary1" className="no-todo-card">
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
      </CardAtom>
    </StyledNoTodoCard>
  );
}

const StyledNoTodoCard = styled.div`
  .no-todo-card {
    display: flex;
    flex-direction: column;
    z-index: 1;
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
