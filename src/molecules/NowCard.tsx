import { TagAtom, TypoAtom } from '../atoms';

import { TodoResponseDto } from '../hooks/useCurrentTodo';
import { TodoEntity } from '../DB/indexedAction';
import styled from '@emotion/styled';
import { DateCard } from '../organisms';
import { CategoryContainer } from './TodoCard/content/TodoUI';

// const NowCard = ({ currentTodo }: { currentTodo: TodoEntity }) => {
const NowCard = ({
  currentTodo,
}: {
  currentTodo: TodoResponseDto | undefined; // TODO : undefiend 일 때 fallbackUI를 보여줄까?..
}) => {
  return (
    <>
      <TypoAtom fontColor="whiteWine" fontSize="body_bold">
        NOW
      </TypoAtom>
      <NowCardContainer>
        <TypoAtom fontSize="h2">{currentTodo?.todo}</TypoAtom>
        <CurrentTodoInfoContainer>
          <TagAtom
            styleOption={{
              fontsize: 'sm',
              size: 'sm',
              bg: 'transparent',
            }}
          >
            <TypoAtom>{'⏱️ ' + currentTodo?.duration}</TypoAtom>
          </TagAtom>
          {currentTodo?.categories?.map((category) => (
            <TagAtom
              key={category}
              title={category}
              styleOption={{
                fontsize: 'sm',
                size: 'sm',
                bg: 'whiteWine',
                maxWidth: 10,
              }}
            >
              {category}
            </TagAtom>
          ))}
        </CurrentTodoInfoContainer>
      </NowCardContainer>
    </>
  );
};

export default NowCard;

const NowCardContainer = styled.div`
  display: flex;
  flex-direction: column;

  background: linear-gradient(#fcfcf4 30%, #f7f8e2 60%, #f0f1c7);
  border-radius: 1.4525rem;

  padding: 1.3125rem 1.8125rem;
  margin-bottom: 2.684375rem;
`;

const CurrentTodoInfoContainer = styled(CategoryContainer)`
  margin-top: 1rem;
  > :first-child {
    margin-right: 0.875rem;
    span:first-child {
      padding: 0.38rem 0rem;
    }
  }
`;
